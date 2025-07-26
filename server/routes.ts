import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, type PropertySearchFilters } from "./storage";
import { z } from "zod";
import type { CalculatorParams, CalculatorResult, PaymentScheduleItem } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all properties
  app.get("/api/properties", async (req, res) => {
    try {
      const properties = await storage.getProperties();
      res.json(properties);
    } catch (error) {
      console.error("Error getting properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  // Get featured properties
  app.get("/api/properties/featured", async (req, res) => {
    try {
      const properties = await storage.getFeaturedProperties();
      res.json(properties);
    } catch (error) {
      console.error("Error getting featured properties:", error);
      res.status(500).json({ message: "Failed to fetch featured properties" });
    }
  });

  // Search properties (must come before the :id route)
  app.get("/api/properties/search", async (req, res) => {
    try {
      const filters: PropertySearchFilters = {
        city: req.query.city as string,
        propertyType: req.query.propertyType as string,
        minPrice: req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined,
        bedrooms: req.query.bedrooms ? parseInt(req.query.bedrooms as string) : undefined,
        bathrooms: req.query.bathrooms ? parseInt(req.query.bathrooms as string) : undefined,
      };

      const properties = await storage.searchProperties(filters);
      res.json(properties);
    } catch (error) {
      console.error("Error searching properties:", error);
      res.status(500).json({ message: "Failed to search properties" });
    }
  });

  // Get property by ID (must come after search route)
  app.get("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      res.json(property);
    } catch (error) {
      console.error("Error getting property:", error);
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  // Get all locations
  app.get("/api/locations", async (req, res) => {
    try {
      const locations = await storage.getLocations();
      res.json(locations);
    } catch (error) {
      console.error("Error getting locations:", error);
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });

  // Calculate rent-to-own payments
  app.post("/api/calculate", async (req, res) => {
    try {
      const calculatorSchema = z.object({
        propertyValue: z.number().positive(),
        downPaymentPercent: z.number().min(5).max(50),
        ownershipPeriod: z.number().min(5).max(30),
        interestRate: z.number().min(1).max(30),
      });

      const params = calculatorSchema.parse(req.body) as CalculatorParams;
      
      // Calculate rent-to-own values
      const downPayment = params.propertyValue * (params.downPaymentPercent / 100);
      const loanAmount = params.propertyValue - downPayment;
      const monthlyInterestRate = (params.interestRate / 100) / 12;
      const numberOfPayments = params.ownershipPeriod * 12;

      // Monthly payment calculation using loan formula
      const monthlyPayment = loanAmount * 
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

      const totalPayments = monthlyPayment * numberOfPayments;
      const totalInterest = totalPayments - loanAmount;
      const totalAmount = downPayment + totalPayments;

      // Generate payment schedule
      const paymentSchedule: PaymentScheduleItem[] = [];
      const yearsPerPeriod = Math.ceil(params.ownershipPeriod / 3);
      
      for (let i = 0; i < 3; i++) {
        const startYear = i * yearsPerPeriod + 1;
        const endYear = Math.min((i + 1) * yearsPerPeriod, params.ownershipPeriod);
        
        if (startYear <= params.ownershipPeriod) {
          paymentSchedule.push({
            year: startYear,
            monthlyPayment: monthlyPayment,
            description: `Years ${startYear}-${endYear}: Building Equity${i === 2 ? ' (Final Payments)' : ''}`
          });
        }
      }

      const result: CalculatorResult = {
        downPayment,
        loanAmount,
        monthlyPayment,
        totalPayments,
        totalInterest,
        totalAmount,
        paymentSchedule,
      };

      res.json(result);
    } catch (error) {
      console.error("Error calculating payments:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid calculation parameters", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to calculate payments" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
