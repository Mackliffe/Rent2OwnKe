import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDemoAuth } from "@/hooks/useDemoAuth";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import PropertyJourney from "@/components/property-journey";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatKES } from "@/lib/currency";
import { Calendar, MapPin, Home, FileText, CreditCard, Clock, CheckCircle, ArrowRight, LogOut, User, Eye } from "lucide-react";
import { Link, useLocation } from "wouter";
import type { PropertyApplication } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Dashboard() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { demoUser, isAuthenticated: isDemoAuthenticated, isLoading: demoLoading, logout: demoLogout } = useDemoAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);

  // Check if user is authenticated (either regular or demo)
  const isUserAuthenticated = isAuthenticated || isDemoAuthenticated;
  const currentUser = user || (demoUser ? {
    firstName: demoUser.firstName,
    lastName: demoUser.lastName,
    email: demoUser.email,
  } : null);
  const isLoadingAuth = authLoading || demoLoading;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoadingAuth && !isUserAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view your dashboard",
        variant: "destructive",
      });
      setTimeout(() => {
        setLocation("/");
      }, 500);
      return;
    }
  }, [isUserAuthenticated, isLoadingAuth, toast, setLocation]);

  const { data: applications = [], isLoading, error } = useQuery<PropertyApplication[]>({
    queryKey: ["/api/applications"],
    enabled: isUserAuthenticated,
    retry: false,
  });

  // Auto-select first application if none selected
  useEffect(() => {
    if (applications.length > 0 && !selectedApplicationId) {
      setSelectedApplicationId(applications[0].id);
    }
  }, [applications, selectedApplicationId]);

  const selectedApplication = applications.find(app => app.id === selectedApplicationId);

  // Handle unauthorized errors
  useEffect(() => {
    if (error && isUnauthorizedError(error as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [error, toast]);

  if (isLoadingAuth || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-1/3 mb-6" />
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isUserAuthenticated || !currentUser) {
    return null; // Will redirect in useEffect
  }

  const handleLogout = () => {
    if (isDemoAuthenticated) {
      demoLogout();
      setLocation("/demo-user");
    } else {
      window.location.href = "/api/logout";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'under_review':
        return <FileText className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getJourneyStep = (status: string) => {
    switch (status) {
      case 'pending':
        return 'apply';
      case 'under_review':
        return 'approval';
      case 'approved':
        return 'payment';
      case 'rejected':
        return 'apply';
      default:
        return 'browse';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {currentUser.firstName}!
            </h1>
            <p className="text-gray-600 mt-2">Track your property applications and journey to homeownership</p>
            {isDemoAuthenticated && (
              <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full inline-block">
                <User className="w-4 h-4 inline mr-1" />
                Demo User Session
              </div>
            )}
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-gray-600 mb-6">Start by browsing properties and applying for rent-to-own loans.</p>
            <Button 
              onClick={() => setLocation("/")}
              className="bg-grass-600 hover:bg-grass-700"
            >
              Browse Properties
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Applications Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <FileText className="w-5 h-5 mr-2" />
                    My Applications ({applications.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-2 p-4">
                      {applications.map((application) => (
                        <div
                          key={application.id}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedApplicationId === application.id
                              ? 'border-grass-600 bg-grass-50'
                              : 'border-gray-200 hover:border-grass-300 hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedApplicationId(application.id)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <Badge className={getStatusColor(application.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(application.status)}
                                <span className="capitalize">{application.status.replace('_', ' ')}</span>
                              </div>
                            </Badge>
                            {selectedApplicationId === application.id && (
                              <Eye className="w-4 h-4 text-grass-600" />
                            )}
                          </div>
                          
                          {application.property && (
                            <>
                              <h4 className="font-medium text-gray-900 mb-1 text-sm">
                                {application.property.title}
                              </h4>
                              <div className="flex items-center text-gray-600 text-xs mb-1">
                                <MapPin className="w-3 h-3 mr-1" />
                                <span>{application.property.location}, {application.property.city}</span>
                              </div>
                              <div className="text-sm font-semibold text-grass-600">
                                {formatKES(application.property.price)}
                              </div>
                            </>
                          )}
                          
                          <div className="flex items-center text-gray-500 text-xs mt-2">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>Applied {new Date(application.createdAt).toLocaleDateString('en-GB')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Property Journey Main Area */}
            <div className="lg:col-span-2">
              {selectedApplication ? (
                <div className="space-y-6">
                  {/* Selected Application Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Application Details</span>
                        <Badge className={getStatusColor(selectedApplication.status)}>
                          {selectedApplication.status.replace('_', ' ').charAt(0).toUpperCase() + 
                           selectedApplication.status.replace('_', ' ').slice(1)}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedApplication.property && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {selectedApplication.property.title}
                            </h3>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2" />
                                {selectedApplication.property.location}, {selectedApplication.property.city}
                              </div>
                              <div className="flex items-center">
                                <Home className="w-4 h-4 mr-2" />
                                {selectedApplication.property.bedrooms} bed, {selectedApplication.property.bathrooms} bath
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                Applied: {new Date(selectedApplication.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-grass-600 mb-2">
                              {formatKES(selectedApplication.property.price)}
                            </div>
                            <div className="text-sm text-gray-600">
                              Monthly rent: {formatKES(selectedApplication.property.monthlyRent)}
                            </div>
                            {selectedApplication.status === 'approved' && (
                              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center text-green-800">
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  <span className="font-medium">Congratulations!</span>
                                </div>
                                <p className="text-green-700 text-sm mt-1">
                                  Your application has been approved. You can now proceed with payment arrangements.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Property Journey Tracker */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Rent-to-Own Journey</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PropertyJourney 
                        currentStep={getJourneyStep(selectedApplication.status)}
                        onStepClick={(stepId) => {
                          if (stepId === "browse") setLocation("/");
                          if (stepId === "calculate") setLocation("/calculator");
                          if (stepId === "apply") setLocation(`/loan-application/${selectedApplication.propertyId}`);
                        }}
                        showAnimations={true}
                      />
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Application</h3>
                    <p className="text-gray-600">Choose an application from the sidebar to view its journey details.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}