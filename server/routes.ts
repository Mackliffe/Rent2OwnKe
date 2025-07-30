import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, type PropertySearchFilters } from "./storage";
import { kenyanRealEstateAPI } from "./api-integrations";
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
        type: req.query.type as string,
        minPrice: req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined,
        bedrooms: req.query.bedrooms ? parseInt(req.query.bedrooms as string) : undefined,
        bathrooms: req.query.bathrooms ? parseInt(req.query.bathrooms as string) : undefined,
      };

      // Get properties from local storage
      const localProperties = await storage.searchProperties(filters);
      
      // Get properties from external Kenyan APIs
      let externalProperties: any[] = [];
      try {
        const apiResults = await kenyanRealEstateAPI.searchProperties(filters);
        externalProperties = apiResults.map((apiProp, index) => ({
          ...kenyanRealEstateAPI.convertToInternalProperty(apiProp),
          id: 1000 + index, // Use numeric IDs for external properties
          isExternal: true,
        }));
      } catch (apiError) {
        console.warn("External API search failed:", apiError);
      }

      // Combine local and external results
      const allProperties = [...localProperties, ...externalProperties];
      
      res.json(allProperties);
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

  // Auto-authenticate and submit application
  app.post("/api/applications/auto-auth", async (req, res) => {
    try {
      const { propertyId, applicationData } = req.body;
      const { email, fullName, phoneNumber } = applicationData;

      if (!email || !fullName) {
        return res.status(400).json({ message: "Email and full name are required" });
      }

      // Check if user is already authenticated
      const reqUser = req as any;
      const isAuthenticated = reqUser.user && reqUser.isAuthenticated && reqUser.isAuthenticated();
      if (isAuthenticated) {
        const userId = reqUser.user?.claims?.sub;
        
        // Check for existing application
        const existingApplication = await storage.getUserApplicationByProperty(userId, propertyId);
        if (existingApplication) {
          return res.status(400).json({ message: "Application already exists" });
        }

        // Create the application
        const application = await storage.createApplication({
          userId,
          propertyId: parseInt(propertyId),
          applicationData,
          status: "pending",
        });

        return res.status(201).json({ 
          success: true, 
          application,
          message: "Application submitted successfully"
        });
      }

      // User not authenticated - check if account exists by email or phone
      const existingUser = await storage.getUserByEmail(email);
      
      if (existingUser) {
        // User exists - create application and associate with user
        const existingApplication = await storage.getUserApplicationByProperty(existingUser.id, propertyId);
        if (existingApplication) {
          return res.status(400).json({ 
            message: "You have already applied for this property",
            hasAccount: true,
            requiresLogin: true 
          });
        }

        // Create the application for existing user
        const application = await storage.createApplication({
          userId: existingUser.id,
          propertyId: parseInt(propertyId),
          applicationData,
          status: "pending",
        });

        return res.status(201).json({ 
          success: true, 
          application,
          message: "Application submitted successfully! Please sign in to track your application status.",
          hasAccount: true,
          requiresLogin: true
        });
      }

      // New user - prompt for password to create account
      return res.status(202).json({ 
        message: "New user detected. Please set a password to create your account.",
        requiresSignup: true,
        email: email,
        phoneNumber: phoneNumber
      });

    } catch (error) {
      console.error("Auto-auth application error:", error);
      res.status(500).json({ message: "Failed to process application" });
    }
  });

  // Property Applications endpoints
  app.get("/api/applications", async (req: any, res) => {
    try {
      if (!req.user?.claims?.sub) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const applications = await storage.getUserApplications(req.user.claims.sub);
      res.json(applications);
    } catch (error) {
      console.error("Error getting applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.post("/api/applications", async (req: any, res) => {
    try {
      if (!req.user?.claims?.sub) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { propertyId, applicationData } = req.body;
      
      // Check if user already applied for this property
      const existingApplication = await storage.getPropertyApplication(req.user.claims.sub, propertyId);
      if (existingApplication) {
        return res.status(400).json({ message: "You have already applied for this property" });
      }

      const application = await storage.createApplication({
        userId: req.user.claims.sub,
        propertyId: parseInt(propertyId),
        applicationData,
        status: "pending",
      });

      res.status(201).json({ 
        success: true, 
        application,
        message: "Application submitted successfully"
      });
    } catch (error) {
      console.error("Error creating application:", error);
      res.status(500).json({ message: "Failed to create application" });
    }
  });

  app.get("/api/applications/check/:propertyId", async (req: any, res) => {
    try {
      if (!req.user?.claims?.sub) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const application = await storage.getPropertyApplication(
        req.user.claims.sub, 
        parseInt(req.params.propertyId)
      );
      
      res.json({ hasApplied: !!application, application });
    } catch (error) {
      console.error("Error checking application:", error);
      res.status(500).json({ message: "Failed to check application" });
    }
  });

  // AI Recommendations routes
  app.post("/api/recommendations/analyze-intent", async (req, res) => {
    try {
      const { query } = req.body;
      const { recommendationEngine } = await import("./recommendation-engine");
      const intent = recommendationEngine.analyzeSearchIntent(query);
      res.json(intent);
    } catch (error) {
      console.error("Error analyzing search intent:", error);
      res.status(500).json({ message: "Failed to analyze search intent" });
    }
  });

  app.post("/api/recommendations/generate", async (req, res) => {
    try {
      const { preferences } = req.body;
      const { recommendationEngine } = await import("./recommendation-engine");
      
      // Get all properties
      const properties = await storage.getProperties();
      
      // Generate recommendations with proper defaults
      const userPreferences = {
        userId: "demo-user",
        preferredLocations: preferences.preferredLocations || [],
        propertyTypes: preferences.propertyTypes || [],
        budgetMin: preferences.budgetMin,
        budgetMax: preferences.budgetMax,
        bedroomPreference: preferences.bedroomPreference,
        lifestyleFactors: preferences.lifestyleFactors || [],
        investmentGoals: preferences.investmentGoals || [],
        riskTolerance: preferences.riskTolerance || "moderate",
        searchHistory: [],
        viewedProperties: [],
        savedProperties: [],
        lastUpdated: new Date()
      };
      
      const recommendations = recommendationEngine.generateRecommendations(
        properties,
        userPreferences
      );
      
      // Attach property details to recommendations
      const enrichedRecommendations = recommendations.slice(0, 6).map(rec => ({
        ...rec,
        property: properties.find(p => p.id === rec.propertyId)
      }));
      
      res.json(enrichedRecommendations);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
