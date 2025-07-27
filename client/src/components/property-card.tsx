import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Maximize, MapPin, Car, Star } from "lucide-react";
import { formatKES } from "@/lib/currency";
import type { Property } from "@shared/schema";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const getPropertyTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'apartment':
        return 'grass-100 text-grass-800';
      case 'house':
        return 'bg-blue-100 text-blue-800';
      case 'townhouse':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
      <img 
        src={property.mainImage} 
        alt={property.title}
        className="w-full h-48 object-cover"
      />
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Badge className={getPropertyTypeColor(property.propertyType)}>
            {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
          </Badge>
          <div className="flex items-center text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-current" />
            ))}
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
        <p className="text-gray-600 mb-4 flex items-center">
          <MapPin className="h-4 w-4 text-grass-500 mr-2" />
          {property.location}, {property.city}
        </p>
        
        <div className="grid grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Bed className="h-4 w-4 text-grass-500 mr-1" />
            {property.bedrooms} Beds
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 text-grass-500 mr-1" />
            {property.bathrooms} Baths
          </div>
          <div className="flex items-center">
            <Maximize className="h-4 w-4 text-grass-500 mr-1" />
            {property.floorArea} m²
          </div>
        </div>
        
        {property.parkingSpaces && property.parkingSpaces > 0 && (
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <Car className="h-4 w-4 text-grass-500 mr-1" />
            {property.parkingSpaces} Parking Space{property.parkingSpaces > 1 ? 's' : ''}
          </div>
        )}
        
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-bold text-gray-900">{formatKES(property.price)}</span>
            <span className="text-sm text-gray-500">Total Price</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-grass-600">{formatKES(property.monthlyRent)}/month</span>
            <span className="text-sm text-gray-500">Rent-to-own</span>
          </div>
          <div className="space-y-2">
            <Link href={`/property/${property.id}`}>
              <Button className="w-full bg-grass-500 hover:bg-grass-600 text-white">
                View More
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
