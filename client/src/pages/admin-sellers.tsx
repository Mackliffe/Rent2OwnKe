import { useQuery } from "@tanstack/react-query";
import AdminNavigation from "@/components/admin-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Store,
  User,
  Mail,
  Calendar,
  Building,
  TrendingUp,
  Phone
} from "lucide-react";

export default function AdminSellers() {
  const { data: sellers = [], isLoading } = useQuery({
    queryKey: ["/api/admin/sellers"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavigation currentPage="sellers" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-grass-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation currentPage="sellers" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Seller Management</h1>
          <p className="text-gray-600 mt-2">Manage property sellers and their listings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Store className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sellers</p>
                  <p className="text-2xl font-bold text-gray-900">{sellers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {sellers.reduce((sum: number, seller: any) => sum + (seller.activeListings || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {sellers.reduce((sum: number, seller: any) => sum + (seller.totalSales || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="w-8 h-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">New This Month</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {sellers.filter((seller: any) => {
                      const monthAgo = new Date();
                      monthAgo.setMonth(monthAgo.getMonth() - 1);
                      return new Date(seller.createdAt) > monthAgo;
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sellers List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellers.map((seller: any) => (
            <Card key={seller.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    {seller.profileImageUrl ? (
                      <img 
                        src={seller.profileImageUrl} 
                        alt={seller.firstName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <Store className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {seller.firstName} {seller.lastName}
                    </h3>
                    <Badge className="bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                      <Store className="w-3 h-3" />
                      Seller
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{seller.email}</span>
                  </div>

                  {seller.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{seller.phone}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-100">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{seller.activeListings || 0}</p>
                      <p className="text-xs text-gray-600">Active Listings</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{seller.totalSales || 0}</p>
                      <p className="text-xs text-gray-600">Total Sales</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>Joined {new Date(seller.createdAt).toLocaleDateString()}</span>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3"
                    onClick={() => {/* Navigate to seller details */}}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sellers.length === 0 && (
          <div className="text-center py-12">
            <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sellers found</h3>
            <p className="text-gray-600">Sellers will appear here when users register as sellers</p>
          </div>
        )}
      </div>
    </div>
  );
}