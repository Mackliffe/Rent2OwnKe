import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import PropertyCard from "@/components/property-card";
import PropertySearch, { type SearchFilters } from "@/components/property-search";
import RentCalculator from "@/components/rent-calculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Calculator, Home as HomeIcon, Play, Phone } from "lucide-react";
import type { Property } from "@shared/schema";

export default function Home() {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    city: "all",
    propertyType: "all",
    priceRange: "all"
  });

  const { data: featuredProperties, isLoading: loadingFeatured } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured"],
  });

  const { data: searchResults, isLoading: loadingSearch } = useQuery<Property[]>({
    queryKey: ["/api/properties/search", searchFilters],
    queryFn: async () => {
      // Convert search filters to API format
      const params = new URLSearchParams();
      
      if (searchFilters.city !== "all") {
        params.append("city", searchFilters.city);
      }
      
      if (searchFilters.propertyType !== "all") {
        params.append("propertyType", searchFilters.propertyType);
      }
      
      if (searchFilters.priceRange !== "all") {
        const [minPrice, maxPrice] = searchFilters.priceRange.split("-").map(Number);
        if (minPrice) params.append("minPrice", minPrice.toString());
        if (maxPrice) params.append("maxPrice", maxPrice.toString());
      }
      
      const response = await fetch(`/api/properties/search?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to search properties");
      return response.json();
    },
    enabled: !!(searchFilters.city !== "all" || searchFilters.propertyType !== "all" || searchFilters.priceRange !== "all"),
  });

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
  };

  const displayProperties = searchResults || featuredProperties || [];
  const isLoading = loadingFeatured || loadingSearch;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-grass-50 to-green-100 py-20">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" 
             style={{backgroundImage: "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"}} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Path to 
              <span className="text-grass-600"> Home Ownership</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover affordable rent-to-own properties across Kenya. Start renting today and own your dream home tomorrow with flexible payment plans.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-grass-600 hover:bg-grass-700 text-white"
                  onClick={() => {
                    // Check if user has completed onboarding
                    const completed = localStorage.getItem('onboardingCompleted');
                    const skipped = localStorage.getItem('onboardingSkipped');
                    
                    if (!completed && !skipped) {
                      window.location.href = '/onboarding';
                    } else {
                      window.location.href = '/recommendations';
                    }
                  }}
                >
                  Get Started
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => {
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Learn More
                </Button>
              </div>
              
              <PropertySearch onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {searchResults ? 'Search Results' : 'Featured Properties'}
            </h2>
            <p className="text-lg text-gray-600">
              {searchResults ? 'Properties matching your search criteria' : 'Discover your perfect rent-to-own home across Kenya'}
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="w-full h-48 bg-gray-200" />
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                    <div className="h-8 bg-gray-200 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : displayProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600">Try adjusting your search criteria to find more properties.</p>
            </div>
          )}
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 grass-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RentCalculator />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Rent2Own Works</h2>
            <p className="text-lg text-gray-600">Your journey to homeownership in three simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 grass-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-grass-600 h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Find Your Home</h3>
              <p className="text-gray-600">Browse our curated selection of rent-to-own properties across Kenya. Use our filters to find homes that match your budget and preferences.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 grass-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calculator className="text-grass-600 h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Calculate & Plan</h3>
              <p className="text-gray-600">Use our Kenya-specific calculator to determine your down payment, monthly payments, and ownership timeline. Get a clear picture of your investment.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 grass-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <HomeIcon className="text-grass-600 h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Start Your Journey</h3>
              <p className="text-gray-600">Make your down payment, move in, and start building equity with every monthly payment. Own your home at the end of the agreed period.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-grass-500 to-grass-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Own Your Dream Home?</h2>
          <p className="text-xl text-grass-100 mb-8">Join thousands of Kenyans who are building their path to homeownership through our rent-to-own program.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" className="bg-white text-grass-600 hover:bg-gray-100">
              <Play className="mr-2 h-4 w-4" />
              Watch How It Works
            </Button>
            <Button className="bg-grass-700 hover:bg-grass-800 text-white">
              <Phone className="mr-2 h-4 w-4" />
              Speak to an Advisor
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 grass-500 rounded-lg flex items-center justify-center">
                  <HomeIcon className="text-white h-5 w-5" />
                </div>
                <span className="text-xl font-bold">Rent2Own Kenya</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">Making homeownership accessible to all Kenyans through flexible rent-to-own solutions. Your journey to owning a home starts here.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-grass-400">Browse Properties</a></li>
                <li><a href="/calculator" className="hover:text-grass-400">Payment Calculator</a></li>
                <li><a href="/risk-calculator" className="hover:text-grass-400">Risk Calculator</a></li>
                <li><a href="/market-trends" className="hover:text-grass-400">Market Trends</a></li>
                <li><a href="/recommendations" className="hover:text-grass-400">AI Recommendations</a></li>
                <li><a href="/property-journey" className="hover:text-grass-400">Property Journey</a></li>
                <li><a href="#how-it-works" className="hover:text-grass-400">How It Works</a></li>
                <li><a href="/admin-login" className="hover:text-grass-400">Admin Portal</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-grass-500" />
                  +254 700 123 456
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-grass-500">✉</span>
                  info@rent2own.co.ke
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-grass-500">📍</span>
                  Nairobi, Kenya
                </li>
              </ul>
            </div>
          </div>
          
          <hr className="border-gray-800 my-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 Rent2Own Kenya. All rights reserved.</p>
            <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
              <a href="#" className="hover:text-grass-400">Privacy Policy</a>
              <a href="#" className="hover:text-grass-400">Terms of Service</a>
              <a href="#" className="hover:text-grass-400">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
