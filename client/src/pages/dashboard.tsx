import { useAuth } from "@/hooks/useAuth";
import { useDemoAuth } from "@/hooks/useDemoAuth";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import PropertyJourney from "@/components/property-journey";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatKES } from "@/lib/currency";
import { Calendar, MapPin, Home, FileText, CreditCard, Clock, CheckCircle, ArrowRight, LogOut, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import type { PropertyApplication } from "@shared/schema";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Dashboard() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { demoUser, isAuthenticated: isDemoAuthenticated, isLoading: demoLoading, logout: demoLogout } = useDemoAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

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
      case 'processing':
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
      case 'processing':
        return <FileText className="w-4 h-4" />;
      case 'approved':
        return <CreditCard className="w-4 h-4" />;
      case 'rejected':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
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

        {/* Journey Tracker Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <PropertyJourney 
              currentStep={(() => {
                if (applications.length === 0) return "browse";
                const hasApproved = applications.some(app => app.status === "approved");
                const hasPending = applications.some(app => app.status === "pending" || app.status === "processing");
                if (hasApproved) return "payment";
                if (hasPending) return "approval";
                return "apply";
              })()}
              onStepClick={(stepId) => {
                if (stepId === "browse") window.location.href = "/";
                if (stepId === "calculate") window.location.href = "/calculator";
                if (stepId === "apply") window.location.href = "/loan-application/5";
              }}
              showAnimations={true}
            />
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/property-journey">
                  <Button variant="outline" className="w-full justify-between">
                    View Full Journey
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full justify-between">
                    Browse Properties
                    <Home className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/calculator">
                  <Button variant="outline" className="w-full justify-between">
                    Payment Calculator
                    <CreditCard className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-4">
                  <Home className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.filter(app => app.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-4">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.filter(app => app.status === 'approved').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              My Property Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
                <p className="text-gray-600 mb-6">Start by browsing properties and applying for rent-to-own loans.</p>
                <Button 
                  onClick={() => window.location.href = "/"}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Browse Properties
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge className={getStatusColor(application.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(application.status)}
                              <span className="capitalize">{application.status}</span>
                            </div>
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Application #{application.id}
                          </span>
                        </div>
                        
                        {application.property && (
                          <>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {application.property.title}
                            </h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm">
                                {application.property.location}, {application.property.city}
                              </span>
                            </div>
                            <div className="text-lg font-semibold text-green-600 mb-3">
                              {formatKES(application.property.price)}
                            </div>
                          </>
                        )}
                        
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Applied on {new Date(application.appliedAt).toLocaleDateString('en-GB')}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {application.property && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.href = `/property/${application.propertyId}`}
                          >
                            View Property
                          </Button>
                        )}
                        
                        {application.status === 'approved' && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            View Contract
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {application.status === 'processing' && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          Your application is being reviewed by our team. We'll contact you within 2-3 business days.
                        </p>
                      </div>
                    )}
                    
                    {application.status === 'approved' && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          Congratulations! Your application has been approved. Please check your email for next steps.
                        </p>
                      </div>
                    )}
                    
                    {application.status === 'rejected' && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                          Unfortunately, your application was not approved. You can apply for other properties.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}