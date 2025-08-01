import { pgTable, text, serial, integer, decimal, boolean, jsonb, timestamp, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
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

// Define relations
export const propertiesRelations = relations(properties, ({ one }) => ({
  location: one(locations, {
    fields: [properties.city],
    references: [locations.city],
  }),
}));

export const locationsRelations = relations(locations, ({ many }) => ({
  properties: many(properties),
}));

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

// User table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"), // user, admin
  userTypes: varchar("user_types").array().default(sql`ARRAY['user']::varchar[]`), // Multiple user types: user, seller, account_manager
  phone: varchar("phone"),
  accountManagerId: varchar("account_manager_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Property Applications table for tracking user applications
export const propertyApplications = pgTable("property_applications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  propertyId: integer("property_id").notNull().references(() => properties.id),
  status: varchar("status").notNull().default("pending"), // pending, approved, rejected, processing
  appliedAt: timestamp("applied_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  applicationData: jsonb("application_data"), // Store the form data
});

export const propertyApplicationsRelations = relations(propertyApplications, ({ one }) => ({
  user: one(users, {
    fields: [propertyApplications.userId],
    references: [users.id],
  }),
  property: one(properties, {
    fields: [propertyApplications.propertyId],
    references: [properties.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  propertyInspections: many(propertyInspections),
  applications: many(propertyApplications),
}));

// Property Inspections
export const propertyInspections = pgTable("property_inspections", {
  id: serial("id").primaryKey(),
  // Seller Information (reference to user who is a seller)
  sellerId: varchar("seller_id").references(() => users.id),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  email: text("email").notNull(),
  // Property Information
  propertyType: text("property_type").notNull(),
  propertyAddress: text("property_address").notNull(),
  county: text("county").notNull(),
  subcounty: text("subcounty").notNull(),
  // Document paths (in real app, these would be file storage paths)
  nationalIdFront: text("national_id_front"),
  nationalIdBack: text("national_id_back"),
  kraPin: text("kra_pin"),
  // Inspection Details
  inspectionDate: text("inspection_date").notNull(),
  inspectionTime: text("inspection_time").notNull(),
  // Status and metadata
  status: text("status").default("booked").notNull(), // 'booked', 'completed', 'cancelled'
  referenceNumber: text("reference_number").notNull(),
  estimatedCost: text("estimated_cost").default("KShs 5,000"),
  // Property details for listing (populated after inspection)
  propertyTitle: text("property_title"),
  propertyDescription: text("property_description"),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  floorArea: integer("floor_area"),
  price: integer("price"),
  mainImage: text("main_image").default("/api/placeholder/400/300"), // placeholder until inspection
  gallery: jsonb("gallery").$type<string[]>().default([]),
  rooms: jsonb("rooms").$type<PropertyRoom[]>().default([]),
  amenities: jsonb("amenities").$type<string[]>().default([]),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const propertyInspectionsRelations = relations(propertyInspections, ({ one }) => ({
  seller: one(users, {
    fields: [propertyInspections.sellerId],
    references: [users.id],
  }),
}));

export const insertPropertyInspectionSchema = createInsertSchema(propertyInspections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type PropertyInspection = typeof propertyInspections.$inferSelect;
export type InsertPropertyInspection = z.infer<typeof insertPropertyInspectionSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type UpsertUser = typeof users.$inferInsert;
export type PropertyApplication = typeof propertyApplications.$inferSelect;
export type InsertPropertyApplication = typeof propertyApplications.$inferInsert;
