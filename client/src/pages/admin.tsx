import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminNavigation from "@/components/admin-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, Home, FileText, TrendingUp, Settings, 
  CheckCircle, XCircle, Clock, Eye, Edit, Trash2,
  Plus, Shield, BarChart3, Activity
} from "lucide-react";
import { Link } from "wouter";
import { formatKES } from "@/lib/currency";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [, setLocation] = useLocation();

  // Check if user is admin
  const { data: isAdmin, isLoading: adminLoading } = useQuery({
    queryKey: ["/api/admin/check"],
    retry: false,
  });

  // Redirect to admin login if not admin
  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "Admin credentials required to access this page",
        variant: "destructive",
      });
      setLocation("/admin-login");
    }
  }, [isAdmin, adminLoading, setLocation, toast]);

  // Dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: !!isAdmin,
  });

  // Properties management
  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ["/api/admin/properties"],
    enabled: !!isAdmin && selectedTab === "properties",
  });

  // Applications management
  const { data: applications, isLoading: applicationsLoading } = useQuery({
    queryKey: ["/api/admin/applications"],
    enabled: !!isAdmin && selectedTab === "applications",
  });

  // Users management
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: !!isAdmin && selectedTab === "users",
  });

  // Update application status mutation
  const updateApplicationMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await apiRequest(`/api/admin/applications/${id}`, {
        method: "PATCH",
        body: { status },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Success",
        description: "Application status updated successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Your session has expired. Please sign in again.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    },
  });

  // Toggle property featured status
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: number; featured: boolean }) => {
      return await apiRequest(`/api/admin/properties/${id}`, {
        method: "PATCH",
        body: { featured },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/properties"] });
      toast({
        title: "Success",
        description: "Property updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update property",
        variant: "destructive",
      });
    },
  });

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavigation currentPage="home" />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-grass-600 mx-auto mb-4"></div>
            <p>Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-32">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-4">
                You don't have administrator privileges to access this dashboard.
              </p>
              <Button onClick={() => window.location.href = "/"}>
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      processing: { color: "bg-blue-100 text-blue-800", icon: Activity },
      approved: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      rejected: { color: "bg-red-100 text-red-800", icon: XCircle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center space-x-1`}>
        <Icon className="w-3 h-3" />
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation currentPage="home" />
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Shield className="w-8 h-8 text-grass-600 mr-3" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {user?.firstName || 'Admin'}. Manage your Rent2Own Kenya platform.
            </p>
          </div>

          {/* Overview Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Properties</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
                      <p className="text-sm text-grass-600">{stats.featuredProperties} featured</p>
                    </div>
                    <Home className="w-8 h-8 text-grass-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Applications</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                      <p className="text-sm text-blue-600">{stats.pendingApplications} pending</p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                      <p className="text-sm text-green-600">{stats.newUsersThisMonth} this month</p>
                    </div>
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Property Value</p>
                      <p className="text-2xl font-bold text-gray-900">{formatKES(stats.avgPropertyValue)}</p>
                      <p className="text-sm text-purple-600">+2.5% this month</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Applications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {applicationsLoading ? (
                      <div className="animate-pulse space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-16 bg-gray-200 rounded"></div>
                        ))}
                      </div>
                    ) : applications?.slice(0, 5).map((app: any) => (
                      <div key={app.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{app.property.title}</p>
                          <p className="text-sm text-gray-600">{app.user.firstName} {app.user.lastName}</p>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Property Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {propertiesLoading ? (
                      <div className="animate-pulse space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-16 bg-gray-200 rounded"></div>
                        ))}
                      </div>
                    ) : properties?.slice(0, 5).map((property: any) => (
                      <div key={property.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{property.title}</p>
                          <p className="text-sm text-gray-600">{formatKES(property.price)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{property.applicationCount || 0} applications</p>
                          {property.featured && (
                            <Badge className="bg-grass-100 text-grass-800">Featured</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="applications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Management</CardTitle>
                </CardHeader>
                <CardContent>
                  {applicationsLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-20 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications?.map((app: any) => (
                        <div key={app.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-semibold">{app.property.title}</h4>
                              <p className="text-sm text-gray-600">
                                {app.user.firstName} {app.user.lastName} • {app.user.email}
                              </p>
                              <p className="text-xs text-gray-500">
                                Applied: {new Date(app.appliedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-3">
                              {getStatusBadge(app.status)}
                              <Select
                                value={app.status}
                                onValueChange={(status) => 
                                  updateApplicationMutation.mutate({ id: app.id, status })
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="approved">Approved</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          {app.applicationData && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Monthly Income:</span> {formatKES(app.applicationData.monthlyIncome)}
                              </div>
                              <div>
                                <span className="font-medium">Employment:</span> {app.applicationData.employmentType}
                              </div>
                              <div>
                                <span className="font-medium">Preferred Loan Term:</span> {app.applicationData.preferredLoanTerm} years
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="properties" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Property Management</CardTitle>
                    <Button className="bg-grass-600 hover:bg-grass-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Property
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {propertiesLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {properties?.map((property: any) => (
                        <div key={property.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <img 
                                src={property.mainImage} 
                                alt={property.title}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div>
                                <h4 className="font-semibold">{property.title}</h4>
                                <p className="text-sm text-gray-600">
                                  {property.city} • {property.bedrooms} bed, {property.bathrooms} bath
                                </p>
                                <p className="text-sm font-medium text-grass-600">
                                  {formatKES(property.price)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <Badge className={property.featured ? "bg-grass-100 text-grass-800" : "bg-gray-100 text-gray-800"}>
                                {property.featured ? "Featured" : "Standard"}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleFeaturedMutation.mutate({ 
                                  id: property.id, 
                                  featured: !property.featured 
                                })}
                              >
                                {property.featured ? "Unfeature" : "Feature"}
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {users?.map((user: any) => (
                        <div key={user.id} className="flex items-center justify-between py-3 border-b">
                          <div className="flex items-center space-x-4">
                            <img 
                              src={user.profileImageUrl || '/api/placeholder/40/40'} 
                              alt={`${user.firstName} ${user.lastName}`}
                              className="w-10 h-10 object-cover rounded-full"
                            />
                            <div>
                              <p className="font-medium">{user.firstName} {user.lastName}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <Badge className={user.role === 'admin' ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}>
                              {user.role}
                            </Badge>
                            <p className="text-sm text-gray-500">
                              {user.applicationCount || 0} applications
                            </p>
                            <p className="text-sm text-gray-500">
                              Joined {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Admin Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-grass-500 rounded-lg flex items-center justify-center">
                  <Home className="text-white h-5 w-5" />
                </div>
                <span className="text-xl font-bold">Rent2Own Kenya - Admin</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Administrative portal for managing properties, users, inspections, and overseeing the rent-to-own marketplace operations.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/admin-inspections" className="hover:text-grass-400">Property Inspections</Link></li>
                <li><Link href="/admin-sellers" className="hover:text-grass-400">Seller Management</Link></li>
                <li><Link href="/admin-account-managers" className="hover:text-grass-400">Account Managers</Link></li>
                <li><Link href="/admin-properties" className="hover:text-grass-400">Property Management</Link></li>
                <li><Link href="/admin-users" className="hover:text-grass-400">User Management</Link></li>
                <li><Link href="/admin-applications" className="hover:text-grass-400">Loan Applications</Link></li>
                <li><Link href="/" className="hover:text-grass-400">Return to Main Site</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Admin Tools</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-grass-500" />
                  User Analytics
                </li>
                <li className="flex items-center">
                  <BarChart3 className="mr-2 h-4 w-4 text-grass-500" />
                  Market Reports
                </li>
                <li className="flex items-center">
                  <Settings className="mr-2 h-4 w-4 text-grass-500" />
                  System Settings
                </li>
                <li className="flex items-center">
                  <Shield className="mr-2 h-4 w-4 text-grass-500" />
                  Security Logs
                </li>
              </ul>
            </div>
          </div>
          
          <hr className="border-gray-800 my-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 Rent2Own Kenya Admin Portal. All rights reserved.</p>
            <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
              <a href="#" className="hover:text-grass-400">Admin Guidelines</a>
              <a href="#" className="hover:text-grass-400">Support</a>
              <a href="#" className="hover:text-grass-400">Documentation</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}