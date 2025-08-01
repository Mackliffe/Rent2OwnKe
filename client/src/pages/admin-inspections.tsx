import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, Calendar, Phone, Mail, MapPin, Home, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useEffect } from "react";

export default function AdminInspections() {
  const { toast } = useToast();

  // Check if user is admin
  const { data: isAdmin, isLoading: adminLoading } = useQuery({
    queryKey: ["/api/admin/check"],
    retry: false,
  });

  // Fetch property inspections
  const { data: inspections, isLoading: inspectionsLoading } = useQuery({
    queryKey: ["/api/admin/inspections"],
    enabled: !!isAdmin,
  });

  // Redirect if not admin
  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "Admin credentials required to access this page",
        variant: "destructive",
      });
      window.location.href = "/admin-login";
    }
  }, [isAdmin, adminLoading, toast]);

  if (adminLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Admin
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Property Inspections</h1>
                <p className="text-sm text-gray-500">Manage property inspection bookings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {inspectionsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading inspections...</p>
            </div>
          </div>
        ) : !inspections || inspections.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No inspections found</h3>
                <p className="text-gray-500">Property inspection bookings will appear here.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Inspections</CardTitle>
                  <CardDescription className="text-2xl font-bold text-gray-900">
                    {inspections.length}
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Booked</CardTitle>
                  <CardDescription className="text-2xl font-bold text-blue-600">
                    {inspections.filter((i: any) => i.status === 'booked').length}
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Completed</CardTitle>
                  <CardDescription className="text-2xl font-bold text-green-600">
                    {inspections.filter((i: any) => i.status === 'completed').length}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Inspections List */}
            <div className="space-y-4">
              {inspections.map((inspection: any) => (
                <Card key={inspection.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {inspection.propertyType} - {inspection.county}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                          Reference: {inspection.referenceNumber}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(inspection.status)}>
                        {inspection.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Seller Information */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Seller Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <div className="w-4 h-4 mr-2" />
                            <span>{inspection.fullName}</span>
                            {inspection.seller && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Registered Seller
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Phone className="w-4 h-4 mr-2" />
                            <span>{inspection.phoneNumber}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Mail className="w-4 h-4 mr-2" />
                            <span>{inspection.email}</span>
                          </div>
                          {inspection.seller && (
                            <div className="flex items-center text-gray-600">
                              <div className="w-4 h-4 mr-2" />
                              <span>Seller ID: {inspection.seller.id}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Property Information */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Property Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Home className="w-4 h-4 mr-2" />
                            <span>{inspection.propertyType}</span>
                          </div>
                          <div className="flex items-start text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{inspection.propertyAddress}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <div className="w-4 h-4 mr-2" />
                            <span>{inspection.subcounty}, {inspection.county}</span>
                          </div>
                        </div>
                      </div>

                      {/* Inspection Details */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Inspection Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{inspection.inspectionDate}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <div className="w-4 h-4 mr-2" />
                            <span>{inspection.inspectionTime}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <div className="w-4 h-4 mr-2" />
                            <span>{inspection.estimatedCost}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          Booked: {new Date(inspection.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex space-x-2">
                          {inspection.status === 'booked' && (
                            <Button size="sm" variant="outline">
                              Mark Completed
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}