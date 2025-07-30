import { z } from "zod";
import { properties, users } from "./schema";

// User preferences schema
export const userPreferencesSchema = z.object({
  userId: z.string(),
  preferredLocations: z.array(z.string()).default([]),
  propertyTypes: z.array(z.string()).default([]),
  budgetMin: z.number().optional(),
  budgetMax: z.number().optional(),
  bedroomPreference: z.number().optional(),
  lifestyleFactors: z.array(z.string()).default([]), // ["family-friendly", "urban", "quiet", "transport-access"]
  investmentGoals: z.array(z.string()).default([]), // ["long-term", "rental-income", "first-home", "upgrade"]
  riskTolerance: z.enum(["low", "moderate", "high"]).default("moderate"),
  searchHistory: z.array(z.string()).default([]),
  viewedProperties: z.array(z.number()).default([]),
  savedProperties: z.array(z.number()).default([]),
  lastUpdated: z.date().default(() => new Date()),
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

// Property recommendation schema
export const propertyRecommendationSchema = z.object({
  propertyId: z.number(),
  userId: z.string(),
  matchScore: z.number().min(0).max(100),
  confidence: z.number().min(0).max(1),
  reasons: z.array(z.string()),
  insights: z.array(z.object({
    category: z.string(),
    insight: z.string(),
    importance: z.enum(["high", "medium", "low"])
  })),
  financialFit: z.object({
    affordabilityScore: z.number().min(0).max(100),
    paymentComfort: z.enum(["comfortable", "stretch", "tight"]),
    investmentPotential: z.number().min(0).max(100)
  }),
  marketInsights: z.object({
    priceCompetitiveness: z.string(),
    marketTrend: z.enum(["rising", "stable", "declining"]),
    investmentOutlook: z.string()
  }),
  personalizedNote: z.string().optional(),
  generatedAt: z.date().default(() => new Date()),
});

export type PropertyRecommendation = z.infer<typeof propertyRecommendationSchema>;

// Search intent analysis schema
export const searchIntentSchema = z.object({
  query: z.string(),
  intent: z.enum(["browse", "specific_search", "comparison", "investment_analysis", "first_time_buyer"]),
  extractedFilters: z.object({
    location: z.string().optional(),
    propertyType: z.string().optional(),
    budget: z.object({
      min: z.number().optional(),
      max: z.number().optional()
    }).optional(),
    bedrooms: z.number().optional(),
    features: z.array(z.string()).default([])
  }),
  urgency: z.enum(["immediate", "within_month", "within_quarter", "exploring"]),
  confidence: z.number().min(0).max(1),
});

export type SearchIntent = z.infer<typeof searchIntentSchema>;