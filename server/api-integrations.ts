import type { Property } from "@shared/schema";
import { searchMockProperties, getMockProperty } from "./mock-api-data";

// Common interface for Kenyan real estate API responses
export interface KenyanPropertyAPIResponse {
  id: string;
  title: string;
  description: string;
  price: number;
  location: {
    county: string;
    city: string;
    neighborhood?: string;
  };
  type: 'apartment' | 'house' | 'townhouse' | 'villa';
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  features: string[];
  agent?: {
    name: string;
    phone: string;
    email: string;
  };
}

// Base class for all Kenyan real estate API integrations
export abstract class BaseKenyanRealEstateAPI {
  protected baseUrl: string;
  protected apiKey?: string;

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  protected async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error making request to ${url}:`, error);
      throw error;
    }
  }

  abstract getProperties(filters?: PropertySearchFilters): Promise<KenyanPropertyAPIResponse[]>;
  abstract getProperty(id: string): Promise<KenyanPropertyAPIResponse | null>;
}

export interface PropertySearchFilters {
  city?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
}

// Kenya Property Portal API Integration
export class KenyaPropertyPortalAPI extends BaseKenyanRealEstateAPI {
  constructor(apiKey?: string) {
    super('https://api.kenyapropertyportal.com/v1', apiKey);
  }

  async getProperties(filters?: PropertySearchFilters): Promise<KenyanPropertyAPIResponse[]> {
    const queryParams = new URLSearchParams();
    
    if (filters?.city) queryParams.append('city', filters.city);
    if (filters?.type) queryParams.append('type', filters.type);
    if (filters?.minPrice) queryParams.append('min_price', filters.minPrice.toString());
    if (filters?.maxPrice) queryParams.append('max_price', filters.maxPrice.toString());
    if (filters?.bedrooms) queryParams.append('bedrooms', filters.bedrooms.toString());

    const endpoint = `/properties?${queryParams.toString()}`;
    const response = await this.makeRequest<{ data: KenyanPropertyAPIResponse[] }>(endpoint);
    return response.data;
  }

  async getProperty(id: string): Promise<KenyanPropertyAPIResponse | null> {
    try {
      const response = await this.makeRequest<{ data: KenyanPropertyAPIResponse }>(`/properties/${id}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }
}

// BuyRentKenya API Integration
export class BuyRentKenyaAPI extends BaseKenyanRealEstateAPI {
  constructor(apiKey?: string) {
    super('https://api.buyrentkenya.com/v2', apiKey);
  }

  async getProperties(filters?: PropertySearchFilters): Promise<KenyanPropertyAPIResponse[]> {
    const payload = {
      location: filters?.city,
      property_type: filters?.type,
      price_range: filters?.minPrice && filters?.maxPrice ? {
        min: filters.minPrice,
        max: filters.maxPrice
      } : undefined,
      bedrooms: filters?.bedrooms,
    };

    const response = await this.makeRequest<{ properties: KenyanPropertyAPIResponse[] }>('/search', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    
    return response.properties;
  }

  async getProperty(id: string): Promise<KenyanPropertyAPIResponse | null> {
    try {
      const response = await this.makeRequest<KenyanPropertyAPIResponse>(`/property/${id}`);
      return response;
    } catch (error) {
      return null;
    }
  }
}

// Property Point Kenya API Integration
export class PropertyPointKenyaAPI extends BaseKenyanRealEstateAPI {
  constructor(apiKey?: string) {
    super('https://api.propertypoint.co.ke/api', apiKey);
  }

  async getProperties(filters?: PropertySearchFilters): Promise<KenyanPropertyAPIResponse[]> {
    const params: Record<string, string> = {};
    
    if (filters?.city) params.location = filters.city;
    if (filters?.type) params.category = filters.type;
    if (filters?.minPrice) params.price_from = filters.minPrice.toString();
    if (filters?.maxPrice) params.price_to = filters.maxPrice.toString();
    if (filters?.bedrooms) params.bedrooms = filters.bedrooms.toString();

    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/listings?${queryString}`;
    
    const response = await this.makeRequest<{ listings: KenyanPropertyAPIResponse[] }>(endpoint);
    return response.listings;
  }

  async getProperty(id: string): Promise<KenyanPropertyAPIResponse | null> {
    try {
      const response = await this.makeRequest<{ listing: KenyanPropertyAPIResponse }>(`/listing/${id}`);
      return response.listing;
    } catch (error) {
      return null;
    }
  }
}

// Main API aggregator service
export class KenyanRealEstateAPIAggregator {
  private apis: BaseKenyanRealEstateAPI[] = [];

  constructor() {
    // Initialize available APIs - in production, these would use real API keys
    this.apis = [
      new KenyaPropertyPortalAPI(process.env.KENYA_PROPERTY_PORTAL_API_KEY),
      new BuyRentKenyaAPI(process.env.BUYRENT_KENYA_API_KEY),
      new PropertyPointKenyaAPI(process.env.PROPERTY_POINT_API_KEY),
    ];
  }

  async searchProperties(filters?: PropertySearchFilters): Promise<KenyanPropertyAPIResponse[]> {
    // For demonstration, use mock data instead of making real API calls
    const mockProperties = searchMockProperties({
      city: filters?.city,
      type: filters?.type,
      minPrice: filters?.minPrice,
      maxPrice: filters?.maxPrice,
      bedrooms: filters?.bedrooms,
    });

    // Return mock data to demonstrate API integration
    return mockProperties;
  }

  async getProperty(id: string): Promise<KenyanPropertyAPIResponse | null> {
    // For demonstration, use mock data
    return getMockProperty(id);
  }

  // Convert API response to our internal Property format
  convertToInternalProperty(apiProperty: KenyanPropertyAPIResponse): Omit<Property, 'id'> {
    return {
      title: apiProperty.title,
      description: apiProperty.description,
      propertyType: apiProperty.type,
      location: `${apiProperty.location.neighborhood || ''}, ${apiProperty.location.city}, ${apiProperty.location.county}`.replace(/^, /, ''),
      city: apiProperty.location.city,
      county: apiProperty.location.county,
      price: apiProperty.price,
      bedrooms: apiProperty.bedrooms,
      bathrooms: apiProperty.bathrooms,
      floorArea: apiProperty.area,
      parkingSpaces: 1,
      hasGarden: apiProperty.features.some(f => f.toLowerCase().includes('garden')),
      amenities: apiProperty.features,
      mainImage: apiProperty.images[0] || '/placeholder.jpg',
      gallery: apiProperty.images,
      rooms: this.generateRoomsFromAPI(apiProperty),
      monthlyRent: Math.round(apiProperty.price * 0.008), // Estimate 0.8% of property value
      downPaymentPercent: 10,
      ownershipPeriod: 15,
      interestRate: "12.5",
      featured: false,
    };
  }

  private generateRoomsFromAPI(apiProperty: KenyanPropertyAPIResponse): Array<{
    id: string;
    name: string;
    type: 'living_room' | 'kitchen' | 'bedroom' | 'bathroom' | 'dining_room' | 'study';
    description: string;
    image: string;
  }> {
    const rooms: Array<{ id: string; name: string; type: 'living_room' | 'kitchen' | 'bedroom' | 'bathroom' | 'dining_room' | 'study'; description: string; image: string }> = [];
    let roomId = 1;
    
    // Generate basic rooms based on property type and bedrooms
    if (apiProperty.bedrooms > 0) {
      for (let i = 1; i <= apiProperty.bedrooms; i++) {
        rooms.push({
          id: `room_${roomId++}`,
          name: i === 1 ? "Master Bedroom" : `Bedroom ${i}`,
          type: "bedroom",
          description: i === 1 ? "Spacious master bedroom with ensuite bathroom" : `Comfortable bedroom with ample storage space`,
          image: apiProperty.images[0] || "/placeholder-room.jpg",
        });
      }
    }

    // Add common rooms
    rooms.push(
      {
        id: `room_${roomId++}`,
        name: "Living Room",
        type: "living_room",
        description: "Open plan living area perfect for family time",
        image: apiProperty.images[0] || "/placeholder-room.jpg",
      },
      {
        id: `room_${roomId++}`,
        name: "Kitchen",
        type: "kitchen",
        description: "Modern kitchen with all necessary appliances",
        image: apiProperty.images[0] || "/placeholder-room.jpg",
      }
    );

    if (apiProperty.bathrooms > 1) {
      rooms.push({
        id: `room_${roomId++}`,
        name: "Guest Bathroom",
        type: "bathroom",
        description: "Well-appointed guest bathroom",
        image: apiProperty.images[0] || "/placeholder-room.jpg",
      });
    }

    return rooms;
  }
}

export const kenyanRealEstateAPI = new KenyanRealEstateAPIAggregator();