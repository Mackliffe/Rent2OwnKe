import { useQuery } from "@tanstack/react-query";
import AdminNavigation from "@/components/admin-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User,
  Mail,
  Calendar,
  Users,
  TrendingUp,
  Phone,
  Award,
  Link2
} from "lucide-react";

export default function AdminAccountManagers() {
  const { data: accountManagers = [], isLoading } = useQuery({
    queryKey: ["/api/admin/account-managers"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavigation currentPage="account-managers" />
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
      <AdminNavigation currentPage="account-managers" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Account Manager Management</h1>
            <p className="text-gray-600 mt-2">Manage internal sales agents and their performance</p>
          </div>
          <Button className="bg-grass-600 hover:bg-grass-700">
            <Link2 className="w-4 h-4 mr-2" />
            Account Manager Login
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Account Managers</p>
                  <p className="text-2xl font-bold text-gray-900">{accountManagers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Clients</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {accountManagers.reduce((sum: number, am: any) => sum + (am.activeClients || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {accountManagers.reduce((sum: number, am: any) => sum + (am.totalApplications || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="w-8 h-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Successful Closings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {accountManagers.reduce((sum: number, am: any) => sum + (am.successfulClosings || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Managers List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accountManagers.map((accountManager: any) => (
            <Card key={accountManager.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    {accountManager.profileImageUrl ? (
                      <img 
                        src={accountManager.profileImageUrl} 
                        alt={accountManager.firstName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-purple-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {accountManager.firstName} {accountManager.lastName}
                    </h3>
                    <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1 w-fit">
                      <User className="w-3 h-3" />
                      Account Manager
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{accountManager.email}</span>
                  </div>

                  {accountManager.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{accountManager.phone}</span>
                    </div>
                  )}

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-100">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{accountManager.activeClients || 0}</p>
                      <p className="text-xs text-gray-600">Active Clients</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{accountManager.totalApplications || 0}</p>
                      <p className="text-xs text-gray-600">Applications</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pb-3">
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">{accountManager.successfulClosings || 0}</p>
                      <p className="text-xs text-gray-600">Closings</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">
                        {accountManager.totalApplications > 0 
                          ? Math.round(((accountManager.successfulClosings || 0) / accountManager.totalApplications) * 100)
                          : 0
                        }%
                      </p>
                      <p className="text-xs text-gray-600">Success Rate</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>Joined {new Date(accountManager.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {/* Navigate to account manager details */}}
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {/* Edit account manager */}}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {accountManagers.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No account managers found</h3>
            <p className="text-gray-600 mb-4">Account managers will appear here when assigned</p>
            <Button className="bg-grass-600 hover:bg-grass-700">
              Add Account Manager
            </Button>
          </div>
        )}

        {/* Account Manager Login Portal */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Manager Portal</h3>
                <p className="text-gray-600">
                  Account managers can access their dedicated login portal to view assigned applications and client details.
                </p>
              </div>
              <Button variant="outline" className="shrink-0">
                <Link2 className="w-4 h-4 mr-2" />
                Portal Access
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}