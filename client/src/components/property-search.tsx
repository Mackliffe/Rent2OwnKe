import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface PropertySearchProps {
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  city: string;
  propertyType: string;
  priceRange: string;
}

export default function PropertySearch({ onSearch }: PropertySearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    city: "all",
    propertyType: "all",
    priceRange: "all"
  });

  const handleSearch = () => {
    // Convert "all" values to empty strings for the API
    const searchFilters = {
      city: filters.city === "all" ? "" : filters.city,
      propertyType: filters.propertyType === "all" ? "" : filters.propertyType,
      priceRange: filters.priceRange === "all" ? "" : filters.priceRange,
    };
    onSearch(searchFilters);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <Select value={filters.city} onValueChange={(value) => setFilters({...filters, city: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              <SelectItem value="Nairobi">Nairobi</SelectItem>
              <SelectItem value="Mombasa">Mombasa</SelectItem>
              <SelectItem value="Kisumu">Kisumu</SelectItem>
              <SelectItem value="Nakuru">Nakuru</SelectItem>
              <SelectItem value="Eldoret">Eldoret</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
          <Select value={filters.propertyType} onValueChange={(value) => setFilters({...filters, propertyType: value})}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="apartment">Apartments</SelectItem>
              <SelectItem value="house">Houses</SelectItem>
              <SelectItem value="townhouse">Townhouses</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Budget (KES)</label>
          <Select value={filters.priceRange} onValueChange={(value) => setFilters({...filters, priceRange: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Budgets</SelectItem>
              <SelectItem value="2000000-5000000">2M - 5M</SelectItem>
              <SelectItem value="5000000-10000000">5M - 10M</SelectItem>
              <SelectItem value="10000000-20000000">10M - 20M</SelectItem>
              <SelectItem value="20000000-50000000">20M+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-1 flex items-end">
          <Button onClick={handleSearch} className="w-full bg-grass-500 hover:bg-grass-600 text-white">
            <Search className="mr-2 h-4 w-4" />
            Search Properties
          </Button>
        </div>
      </div>
    </div>
  );
}
