import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import RoomViewer from "@/components/room-viewer";
import RentCalculator from "@/components/rent-calculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bed, Bath, Maximize, Car, MapPin, TreePine, Phone, Calculator as CalculatorIcon, CreditCard, CheckCircle } from "lucide-react";
import { formatKES } from "@/lib/currency";
import { useAuth } from "@/hooks/useAuth";
import type { Property } from "@shared/schema";

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();

  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: [`/api/properties/${id}`],
    enabled: !!id,
  });

  // Check if user has already applied for this property
  const { data: applicationStatus } = useQuery({
    queryKey: [`/api/applications/check/${id}`],
    enabled: !!id && isAuthenticated,
    retry: false,
  });

  const handleLoanApplication = () => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
    } else if (applicationStatus && 'hasApplied' in applicationStatus && applicationStatus.hasApplied) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = `/loan-application/${id}`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-1/2 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-80 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600">The property you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Badge className={getPropertyTypeColor(property.propertyType)}>
              {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
            </Badge>
            {property.featured && (
              <Badge variant="secondary">Featured</Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
          <p className="text-lg text-gray-600 flex items-center">
            <MapPin className="h-5 w-5 text-grass-500 mr-2" />
            {property.location}, {property.city}, {property.county}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Room Viewer */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Interior Views</h2>
            <RoomViewer rooms={property.rooms || []} />
          </div>
          
          {/* Property Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 text-grass-500 mr-3" />
                    <div>
                      <div className="font-medium">Bedrooms</div>
                      <div className="text-gray-600">{property.bedrooms}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 text-grass-500 mr-3" />
                    <div>
                      <div className="font-medium">Bathrooms</div>
                      <div className="text-gray-600">{property.bathrooms}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Maximize className="h-5 w-5 text-grass-500 mr-3" />
                    <div>
                      <div className="font-medium">Floor Area</div>
                      <div className="text-gray-600">{property.floorArea} m²</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Car className="h-5 w-5 text-grass-500 mr-3" />
                    <div>
                      <div className="font-medium">Parking</div>
                      <div className="text-gray-600">{property.parkingSpaces} Space{property.parkingSpaces !== 1 ? 's' : ''}</div>
                    </div>
                  </div>
                </div>

                {property.hasGarden && (
                  <div className="flex items-center mb-4">
                    <TreePine className="h-5 w-5 text-grass-500 mr-3" />
                    <span className="text-gray-700">Garden Available</span>
                  </div>
                )}

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{property.description}</p>
                </div>

                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {(property.amenities || []).map((amenity, index) => (
                        <Badge key={index} variant="outline">{amenity}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Rent-to-Own Summary */}
            <Card className="grass-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalculatorIcon className="mr-2 h-5 w-5" />
                  Rent-to-Own Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Property Value</span>
                    <span className="font-semibold">{formatKES(property.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Down Payment ({property.downPaymentPercent || 10}%)</span>
                    <span className="font-semibold text-grass-600">
                      {formatKES(property.price * ((property.downPaymentPercent || 10) / 100))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Payment</span>
                    <span className="font-semibold text-grass-600">{formatKES(property.monthlyRent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ownership Period</span>
                    <span className="font-semibold">{property.ownershipPeriod} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interest Rate</span>
                    <span className="font-semibold">{property.interestRate}%</span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  {/* Loan Application Button */}
                  {!isAuthenticated ? (
                    <Button
                      onClick={handleLoanApplication}
                      className="w-full bg-grass-500 hover:bg-grass-600 text-white"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Sign In to Apply for Loan
                    </Button>
                  ) : (applicationStatus && 'hasApplied' in applicationStatus && applicationStatus.hasApplied) ? (
                    <Button
                      onClick={handleLoanApplication}
                      variant="outline"
                      className="w-full border-gray-400 text-gray-600 hover:bg-gray-50"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Application Submitted - View Status
                    </Button>
                  ) : (
                    <Button
                      onClick={handleLoanApplication}
                      className="w-full bg-grass-500 hover:bg-grass-600 text-white"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Apply for Rent-to-Own Loan
                    </Button>
                  )}
                  
                  <Button variant="outline" className="w-full">
                    <Phone className="mr-2 h-4 w-4" />
                    Contact Agent
                  </Button>
                  <Button variant="outline" className="w-full">
                    Schedule Viewing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Full Calculator */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Calculate Your Payment Plan</h2>
          <RentCalculator initialValue={property.price} propertyId={id} />
        </div>
      </div>
    </div>
  );
}
