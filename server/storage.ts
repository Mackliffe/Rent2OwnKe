import { properties, locations, type Property, type InsertProperty, type Location, type InsertLocation, type PropertyRoom } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // Properties
  getProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  getFeaturedProperties(): Promise<Property[]>;
  getPropertiesByCity(city: string): Promise<Property[]>;
  getPropertiesByType(propertyType: string): Promise<Property[]>;
  searchProperties(filters: PropertySearchFilters): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  
  // Locations
  getLocations(): Promise<Location[]>;
  getLocationsByCity(city: string): Promise<Location[]>;
}

export type PropertySearchFilters = {
  city?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
};

export class DatabaseStorage implements IStorage {
  async getProperties(): Promise<Property[]> {
    return await db.select().from(properties);
  }

  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property || undefined;
  }

  async getFeaturedProperties(): Promise<Property[]> {
    return await db.select().from(properties).where(eq(properties.featured, true));
  }

  async getPropertiesByCity(city: string): Promise<Property[]> {
    return await db.select().from(properties).where(eq(properties.city, city));
  }

  async getPropertiesByType(propertyType: string): Promise<Property[]> {
    return await db.select().from(properties).where(eq(properties.propertyType, propertyType));
  }

  async searchProperties(filters: PropertySearchFilters): Promise<Property[]> {
    const conditions: any[] = [];

    if (filters.city) {
      conditions.push(eq(properties.city, filters.city));
    }

    if (filters.type) {
      conditions.push(eq(properties.propertyType, filters.type));
    }

    if (filters.minPrice) {
      conditions.push(gte(properties.price, filters.minPrice));
    }

    if (filters.maxPrice) {
      conditions.push(lte(properties.price, filters.maxPrice));
    }

    if (filters.bedrooms) {
      conditions.push(gte(properties.bedrooms, filters.bedrooms));
    }

    if (filters.bathrooms) {
      conditions.push(gte(properties.bathrooms, filters.bathrooms));
    }

    if (conditions.length > 0) {
      return await db.select().from(properties).where(and(...conditions));
    }

    return await db.select().from(properties);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const [property] = await db
      .insert(properties)
      .values(insertProperty)
      .returning();
    return property;
  }

  async getLocations(): Promise<Location[]> {
    return await db.select().from(locations);
  }

  async getLocationsByCity(city: string): Promise<Location[]> {
    return await db.select().from(locations).where(eq(locations.city, city));
  }
}

export class MemStorage implements IStorage {
  private properties: Map<number, Property>;
  private locations: Map<number, Location>;
  private currentPropertyId: number;
  private currentLocationId: number;

  constructor() {
    this.properties = new Map();
    this.locations = new Map();
    this.currentPropertyId = 1;
    this.currentLocationId = 1;
    
    // Initialize with sample Kenyan locations
    this.initializeLocations();
    this.initializeProperties();
  }

  private initializeLocations() {
    const kenyanLocations: InsertLocation[] = [
      { name: "Westlands", city: "Nairobi", county: "Nairobi" },
      { name: "Karen", city: "Nairobi", county: "Nairobi" },
      { name: "Kilimani", city: "Nairobi", county: "Nairobi" },
      { name: "Lavington", city: "Nairobi", county: "Nairobi" },
      { name: "Nyali", city: "Mombasa", county: "Mombasa" },
      { name: "Bamburi", city: "Mombasa", county: "Mombasa" },
      { name: "Milimani", city: "Kisumu", county: "Kisumu" },
      { name: "Kileleshwa", city: "Nairobi", county: "Nairobi" },
    ];

    kenyanLocations.forEach(location => {
      const id = this.currentLocationId++;
      this.locations.set(id, { ...location, id });
    });
  }

  private initializeProperties() {
    const sampleRooms: PropertyRoom[] = [
      {
        id: "living",
        name: "Living Room",
        type: "living_room",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        description: "Spacious living area with modern furnishings",
        dimensions: "4m x 5m"
      },
      {
        id: "kitchen",
        name: "Kitchen",
        type: "kitchen",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        description: "Modern kitchen with fitted appliances",
        dimensions: "3m x 4m"
      },
      {
        id: "master_bedroom",
        name: "Master Bedroom",
        type: "bedroom",
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        description: "Large master bedroom with ensuite",
        dimensions: "4m x 4m"
      },
      {
        id: "bathroom",
        name: "Master Bathroom",
        type: "bathroom",
        image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        description: "Modern bathroom with premium fittings",
        dimensions: "2m x 3m"
      }
    ];

    const kenyanProperties: InsertProperty[] = [
      {
        title: "Modern 3BR Apartment",
        description: "Luxurious 3-bedroom apartment in the heart of Westlands with stunning city views and modern amenities.",
        propertyType: "apartment",
        location: "Westlands",
        city: "Nairobi",
        county: "Nairobi",
        price: 8500000,
        bedrooms: 3,
        bathrooms: 2,
        floorArea: 120,
        parkingSpaces: 1,
        hasGarden: false,
        amenities: ["Swimming Pool", "Gym", "Security", "Backup Generator", "Elevator"],
        mainImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        gallery: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        rooms: sampleRooms,
        monthlyRent: 45000,
        downPaymentPercent: 10,
        ownershipPeriod: 15,
        interestRate: "12.5",
        featured: true,
      },
      {
        title: "Family House with Garden",
        description: "Beautiful 4-bedroom family house in Karen with a large garden, perfect for growing families.",
        propertyType: "house",
        location: "Karen",
        city: "Nairobi",
        county: "Nairobi",
        price: 15200000,
        bedrooms: 4,
        bathrooms: 3,
        floorArea: 200,
        parkingSpaces: 2,
        hasGarden: true,
        amenities: ["Large Garden", "Security", "Garage", "Study Room", "Servant Quarter"],
        mainImage: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        gallery: [
          "https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        rooms: sampleRooms,
        monthlyRent: 85000,
        downPaymentPercent: 15,
        ownershipPeriod: 15,
        interestRate: "12.0",
        featured: true,
      },
      {
        title: "Ocean View Apartment",
        description: "Stunning 2-bedroom beachfront apartment in Nyali with panoramic ocean views.",
        propertyType: "apartment",
        location: "Nyali",
        city: "Mombasa",
        county: "Mombasa",
        price: 12800000,
        bedrooms: 2,
        bathrooms: 2,
        floorArea: 95,
        parkingSpaces: 1,
        hasGarden: false,
        amenities: ["Ocean View", "Swimming Pool", "Beach Access", "Security", "Backup Generator"],
        mainImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        gallery: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        rooms: sampleRooms.slice(0, 3), // 2BR apartment
        monthlyRent: 68000,
        downPaymentPercent: 12,
        ownershipPeriod: 12,
        interestRate: "13.0",
        featured: true,
      },
      {
        title: "Kilimani Modern Apartment",
        description: "Contemporary 2-bedroom apartment in Kilimani with modern finishes and amenities.",
        propertyType: "apartment",
        location: "Kilimani",
        city: "Nairobi",
        county: "Nairobi",
        price: 6800000,
        bedrooms: 2,
        bathrooms: 2,
        floorArea: 85,
        parkingSpaces: 1,
        hasGarden: false,
        amenities: ["Gym", "Security", "Backup Generator", "Internet"],
        mainImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        gallery: [],
        rooms: sampleRooms.slice(0, 3),
        monthlyRent: 38000,
        downPaymentPercent: 10,
        ownershipPeriod: 15,
        interestRate: "12.5",
        featured: false,
      }
    ];

    kenyanProperties.forEach(property => {
      const id = this.currentPropertyId++;
      this.properties.set(id, { ...property, id });
    });
  }

  async getProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getFeaturedProperties(): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(p => p.featured);
  }

  async getPropertiesByCity(city: string): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(p => 
      p.city.toLowerCase() === city.toLowerCase()
    );
  }

  async getPropertiesByType(propertyType: string): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(p => 
      p.propertyType.toLowerCase() === propertyType.toLowerCase()
    );
  }

  async searchProperties(filters: PropertySearchFilters): Promise<Property[]> {
    let results = Array.from(this.properties.values());

    if (filters.city) {
      results = results.filter(p => p.city.toLowerCase() === filters.city!.toLowerCase());
    }

    if (filters.type) {
      results = results.filter(p => p.propertyType.toLowerCase() === filters.type!.toLowerCase());
    }

    if (filters.minPrice) {
      results = results.filter(p => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice) {
      results = results.filter(p => p.price <= filters.maxPrice!);
    }

    if (filters.bedrooms) {
      results = results.filter(p => p.bedrooms >= filters.bedrooms!);
    }

    if (filters.bathrooms) {
      results = results.filter(p => p.bathrooms >= filters.bathrooms!);
    }

    return results;
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.currentPropertyId++;
    const property: Property = { ...insertProperty, id };
    this.properties.set(id, property);
    return property;
  }

  async getLocations(): Promise<Location[]> {
    return Array.from(this.locations.values());
  }

  async getLocationsByCity(city: string): Promise<Location[]> {
    return Array.from(this.locations.values()).filter(l => 
      l.city.toLowerCase() === city.toLowerCase()
    );
  }
}

export const storage = new DatabaseStorage();

// Initialize database with sample data
export async function initializeDatabase() {
  try {
    // Check if locations already exist
    const existingLocations = await storage.getLocations();
    if (existingLocations.length === 0) {
      // Insert sample locations
      const kenyanLocations: InsertLocation[] = [
        { name: "Westlands", city: "Nairobi", county: "Nairobi" },
        { name: "Karen", city: "Nairobi", county: "Nairobi" },
        { name: "Kilimani", city: "Nairobi", county: "Nairobi" },
        { name: "Lavington", city: "Nairobi", county: "Nairobi" },
        { name: "Nyali", city: "Mombasa", county: "Mombasa" },
        { name: "Bamburi", city: "Mombasa", county: "Mombasa" },
        { name: "Milimani", city: "Kisumu", county: "Kisumu" },
        { name: "Kileleshwa", city: "Nairobi", county: "Nairobi" },
      ];

      await db.insert(locations).values(kenyanLocations);
    }

    // Check if properties already exist
    const existingProperties = await storage.getProperties();
    if (existingProperties.length === 0) {
      const sampleRooms: PropertyRoom[] = [
        {
          id: "living",
          name: "Living Room",
          type: "living_room",
          image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          description: "Spacious living area with modern furnishings",
          dimensions: "4m x 5m"
        },
        {
          id: "kitchen",
          name: "Kitchen",
          type: "kitchen",
          image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          description: "Modern kitchen with fitted appliances",
          dimensions: "3m x 4m"
        },
        {
          id: "master_bedroom",
          name: "Master Bedroom",
          type: "bedroom",
          image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          description: "Large master bedroom with ensuite",
          dimensions: "4m x 4m"
        },
        {
          id: "bathroom",
          name: "Master Bathroom",
          type: "bathroom",
          image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          description: "Modern bathroom with premium fittings",
          dimensions: "2m x 3m"
        }
      ];

      const kenyanProperties: InsertProperty[] = [
        {
          title: "Modern 3BR Apartment",
          description: "Luxurious 3-bedroom apartment in the heart of Westlands with stunning city views and modern amenities.",
          propertyType: "apartment",
          location: "Westlands",
          city: "Nairobi",
          county: "Nairobi",
          price: 8500000,
          bedrooms: 3,
          bathrooms: 2,
          floorArea: 120,
          parkingSpaces: 1,
          hasGarden: false,
          amenities: ["Swimming Pool", "Gym", "Security", "Backup Generator", "Elevator"],
          mainImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          gallery: [
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
          ],
          rooms: sampleRooms,
          monthlyRent: 45000,
          downPaymentPercent: 10,
          ownershipPeriod: 15,
          interestRate: "12.5",
          featured: true,
        },
        {
          title: "Family House with Garden",
          description: "Beautiful 4-bedroom family house in Karen with a large garden, perfect for growing families.",
          propertyType: "house",
          location: "Karen",
          city: "Nairobi",
          county: "Nairobi",
          price: 15200000,
          bedrooms: 4,
          bathrooms: 3,
          floorArea: 200,
          parkingSpaces: 2,
          hasGarden: true,
          amenities: ["Large Garden", "Security", "Garage", "Study Room", "Servant Quarter"],
          mainImage: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          gallery: [
            "https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
          ],
          rooms: sampleRooms,
          monthlyRent: 85000,
          downPaymentPercent: 15,
          ownershipPeriod: 15,
          interestRate: "12.0",
          featured: true,
        },
        {
          title: "Ocean View Apartment",
          description: "Stunning 2-bedroom beachfront apartment in Nyali with panoramic ocean views.",
          propertyType: "apartment",
          location: "Nyali",
          city: "Mombasa",
          county: "Mombasa",
          price: 12800000,
          bedrooms: 2,
          bathrooms: 2,
          floorArea: 95,
          parkingSpaces: 1,
          hasGarden: false,
          amenities: ["Ocean View", "Swimming Pool", "Beach Access", "Security", "Backup Generator"],
          mainImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          gallery: [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
          ],
          rooms: sampleRooms.slice(0, 3), // 2BR apartment
          monthlyRent: 68000,
          downPaymentPercent: 12,
          ownershipPeriod: 12,
          interestRate: "13.0",
          featured: true,
        },
        {
          title: "Kilimani Modern Apartment",
          description: "Contemporary 2-bedroom apartment in Kilimani with modern finishes and amenities.",
          propertyType: "apartment",
          location: "Kilimani",
          city: "Nairobi",
          county: "Nairobi",
          price: 6800000,
          bedrooms: 2,
          bathrooms: 2,
          floorArea: 85,
          parkingSpaces: 1,
          hasGarden: false,
          amenities: ["Gym", "Security", "Backup Generator", "Internet"],
          mainImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          gallery: [],
          rooms: sampleRooms.slice(0, 3),
          monthlyRent: 38000,
          downPaymentPercent: 10,
          ownershipPeriod: 15,
          interestRate: "12.5",
          featured: false,
        },
        {
          title: "Kisumu Lakeside Townhouse",
          description: "3-bedroom townhouse near Lake Victoria with beautiful lake views and modern amenities.",
          propertyType: "townhouse",
          location: "Milimani",
          city: "Kisumu",
          county: "Kisumu",
          price: 4500000,
          bedrooms: 3,
          bathrooms: 2,
          floorArea: 140,
          parkingSpaces: 1,
          hasGarden: true,
          amenities: ["Lake View", "Garden", "Security", "Water Tank"],
          mainImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          gallery: [],
          rooms: sampleRooms,
          monthlyRent: 28000,
          downPaymentPercent: 15,
          ownershipPeriod: 12,
          interestRate: "13.5",
          featured: false,
        },
        {
          title: "Nakuru City Center Apartment",
          description: "Modern 1-bedroom apartment in Nakuru city center, perfect for young professionals.",
          propertyType: "apartment",
          location: "City Center",
          city: "Nakuru",
          county: "Nakuru",
          price: 3200000,
          bedrooms: 1,
          bathrooms: 1,
          floorArea: 45,
          parkingSpaces: 1,
          hasGarden: false,
          amenities: ["Security", "Backup Generator", "WIFI"],
          mainImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          gallery: [],
          rooms: sampleRooms.slice(0, 2),
          monthlyRent: 18000,
          downPaymentPercent: 10,
          ownershipPeriod: 10,
          interestRate: "14.0",
          featured: false,
        },
        {
          title: "Mombasa Executive House",
          description: "Luxury 5-bedroom house in Mombasa with premium finishes and large compound.",
          propertyType: "house",
          location: "Nyali",
          city: "Mombasa",
          county: "Mombasa",
          price: 25000000,
          bedrooms: 5,
          bathrooms: 4,
          floorArea: 300,
          parkingSpaces: 3,
          hasGarden: true,
          amenities: ["Swimming Pool", "Large Garden", "Security", "Garage", "Servant Quarters", "Generator"],
          mainImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          gallery: [],
          rooms: [...sampleRooms, ...sampleRooms.slice(2, 4)], // 5BR house
          monthlyRent: 125000,
          downPaymentPercent: 20,
          ownershipPeriod: 20,
          interestRate: "11.5",
          featured: false,
        },
        {
          title: "Nairobi Budget Apartment",
          description: "Affordable 1-bedroom apartment in Kasarani, ideal for first-time homebuyers.",
          propertyType: "apartment",
          location: "Kasarani",
          city: "Nairobi",
          county: "Nairobi",  
          price: 2800000,
          bedrooms: 1,
          bathrooms: 1,
          floorArea: 40,
          parkingSpaces: 1,
          hasGarden: false,
          amenities: ["Security", "Water Tank"],
          mainImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          gallery: [],
          rooms: sampleRooms.slice(0, 2),
          monthlyRent: 15000,
          downPaymentPercent: 10,
          ownershipPeriod: 10,
          interestRate: "14.5",
          featured: false,
        }
      ];

      await db.insert(properties).values(kenyanProperties as any);
    }

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}
