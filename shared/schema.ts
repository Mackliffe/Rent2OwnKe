import { pgTable, text, serial, integer, decimal, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  propertyType: text("property_type").notNull(), // 'apartment', 'house', 'townhouse'
  location: text("location").notNull(),
  city: text("city").notNull(),
  county: text("county").notNull(),
  price: integer("price").notNull(), // in KES
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  floorArea: integer("floor_area").notNull(), // in square meters
  parkingSpaces: integer("parking_spaces").default(0),
  hasGarden: boolean("has_garden").default(false),
  amenities: jsonb("amenities").$type<string[]>().default([]),
  mainImage: text("main_image").notNull(),
  gallery: jsonb("gallery").$type<string[]>().default([]),
  rooms: jsonb("rooms").$type<PropertyRoom[]>().default([]),
  monthlyRent: integer("monthly_rent").notNull(), // calculated rent-to-own payment
  downPaymentPercent: integer("down_payment_percent").default(10),
  ownershipPeriod: integer("ownership_period").default(15), // years
  interestRate: decimal("interest_rate", { precision: 4, scale: 2 }).default("12.5"),
  featured: boolean("featured").default(false),
});

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  county: text("county").notNull(),
});

// Types for property rooms
export type PropertyRoom = {
  id: string;
  name: string;
  type: 'living_room' | 'kitchen' | 'bedroom' | 'bathroom' | 'dining_room' | 'study';
  image: string;
  description?: string;
  dimensions?: string;
};

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
});

export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;

// Calculator types
export type CalculatorParams = {
  propertyValue: number;
  downPaymentPercent: number;
  ownershipPeriod: number;
  interestRate: number;
};

export type CalculatorResult = {
  downPayment: number;
  loanAmount: number;
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
  totalAmount: number;
  paymentSchedule: PaymentScheduleItem[];
};

export type PaymentScheduleItem = {
  year: number;
  monthlyPayment: number;
  description: string;
};
