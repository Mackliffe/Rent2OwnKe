import type { KenyanPropertyAPIResponse } from "./api-integrations";

// Mock data to simulate external Kenyan real estate APIs
export const mockKenyanProperties: KenyanPropertyAPIResponse[] = [
  {
    id: "kpp_001",
    title: "Luxury 4BR Penthouse in Westlands",
    description: "Stunning penthouse apartment with panoramic views of Nairobi skyline. Features modern finishes, large balcony, and premium amenities including gym and swimming pool.",
    price: 25000000,
    location: {
      county: "Nairobi",
      city: "Nairobi",
      neighborhood: "Westlands"
    },
    type: "apartment",
    bedrooms: 4,
    bathrooms: 3,
    area: 180,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&auto=format&fit=crop"
    ],
    features: ["Swimming Pool", "Gym", "24/7 Security", "Backup Generator", "Elevator", "Parking"],
    agent: {
      name: "Sarah Mwangi",
      phone: "+254722123456",
      email: "sarah@kenyapropertyportal.com"
    }
  },
  {
    id: "brk_002",
    title: "Modern 3BR Townhouse in Karen",
    description: "Beautiful townhouse in the prestigious Karen suburb. Features spacious rooms, well-maintained garden, and excellent security.",
    price: 18000000,
    location: {
      county: "Nairobi",
      city: "Nairobi",
      neighborhood: "Karen"
    },
    type: "townhouse",
    bedrooms: 3,
    bathrooms: 2,
    area: 200,
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop"
    ],
    features: ["Garden", "Security", "Parking", "Modern Kitchen", "Spacious Living Area"],
    agent: {
      name: "David Kimani",
      phone: "+254733234567",
      email: "david@buyrentkenya.com"
    }
  },
  {
    id: "ppk_003",
    title: "Beachfront Villa in Mombasa",
    description: "Exclusive beachfront property with direct beach access. Perfect for vacation home or rental investment.",
    price: 35000000,
    location: {
      county: "Mombasa",
      city: "Mombasa",
      neighborhood: "Nyali"
    },
    type: "villa",
    bedrooms: 5,
    bathrooms: 4,
    area: 300,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop"
    ],
    features: ["Beach Access", "Swimming Pool", "Ocean View", "Garden", "Security", "Parking"],
    agent: {
      name: "Amina Hassan",
      phone: "+254744345678",
      email: "amina@propertypoint.co.ke"
    }
  },
  {
    id: "kpp_004",
    title: "Student Apartments in Kisumu",
    description: "Modern student accommodation near Maseno University. Fully furnished with study areas and high-speed internet.",
    price: 4500000,
    location: {
      county: "Kisumu",
      city: "Kisumu",
      neighborhood: "Maseno"
    },
    type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    area: 65,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop"
    ],
    features: ["Furnished", "Internet", "Study Area", "Security", "Near University"],
    agent: {
      name: "Peter Ochieng",
      phone: "+254755456789",
      email: "peter@kenyapropertyportal.com"
    }
  },
  {
    id: "brk_005",
    title: "Commercial Building in Nakuru CBD",
    description: "Prime commercial property in Nakuru's central business district. Perfect for offices or retail space.",
    price: 45000000,
    location: {
      county: "Nakuru",
      city: "Nakuru",
      neighborhood: "CBD"
    },
    type: "house", // Using 'house' as closest match for commercial
    bedrooms: 0,
    bathrooms: 6,
    area: 400,
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&auto=format&fit=crop"
    ],
    features: ["CBD Location", "Elevator", "Parking", "Security", "High Visibility"],
    agent: {
      name: "Grace Wanjiku",
      phone: "+254766567890",
      email: "grace@buyrentkenya.com"
    }
  },
  {
    id: "ppk_006",
    title: "Family Home in Eldoret",
    description: "Spacious family home in a quiet residential area of Eldoret. Features large compound and modern amenities.",
    price: 12000000,
    location: {
      county: "Uasin Gishu",
      city: "Eldoret",
      neighborhood: "Pioneer"
    },
    type: "house",
    bedrooms: 4,
    bathrooms: 3,
    area: 220,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop"
    ],
    features: ["Large Compound", "Garage", "Modern Kitchen", "Security", "Water Tank"],
    agent: {
      name: "John Kipchoge",
      phone: "+254777678901",
      email: "john@propertypoint.co.ke"
    }
  }
];

// Mock function to simulate API search with filters
export function searchMockProperties(filters?: {
  city?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
}): KenyanPropertyAPIResponse[] {
  let filteredProperties = [...mockKenyanProperties];

  if (filters?.city) {
    filteredProperties = filteredProperties.filter(prop => 
      prop.location.city.toLowerCase().includes(filters.city!.toLowerCase())
    );
  }

  if (filters?.type) {
    filteredProperties = filteredProperties.filter(prop => 
      prop.type === filters.type
    );
  }

  if (filters?.minPrice !== undefined) {
    filteredProperties = filteredProperties.filter(prop => 
      prop.price >= filters.minPrice!
    );
  }

  if (filters?.maxPrice !== undefined) {
    filteredProperties = filteredProperties.filter(prop => 
      prop.price <= filters.maxPrice!
    );
  }

  if (filters?.bedrooms !== undefined) {
    filteredProperties = filteredProperties.filter(prop => 
      prop.bedrooms === filters.bedrooms
    );
  }

  return filteredProperties;
}

// Mock function to get a single property by ID
export function getMockProperty(id: string): KenyanPropertyAPIResponse | null {
  return mockKenyanProperties.find(prop => prop.id === id) || null;
}