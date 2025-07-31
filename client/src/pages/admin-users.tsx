import { useQuery } from "@tanstack/react-query";
import AdminNavigation from "@/components/admin-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User,
  Users,
  Shield,
  Store,
  Mail,
  Calendar
} from "lucide-react";

export default function AdminUsers() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { color: "bg-red-100 text-red-800", icon: Shield },
      user: { color: "bg-blue-100 text-blue-800", icon: User },
      seller: { color: "bg-green-100 text-green-800", icon: Store },
      account_manager: { color: "bg-purple-100 text-purple-800", icon: User },
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.user;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1 capitalize`}>
        <Icon className="w-3 h-3" />
        {role.replace('_', ' ')}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavigation currentPage="users" />
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
      <AdminNavigation currentPage="users" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage all registered users and their roles</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="w-8 h-8 text-red-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Admins</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((user: any) => user.role === 'admin').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Store className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Sellers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((user: any) => user.userTypes?.includes('seller')).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Account Managers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((user: any) => user.userTypes?.includes('account_manager')).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user: any) => (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-grass-100 rounded-full flex items-center justify-center">
                    {user.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt={user.firstName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-grass-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {user.firstName} {user.lastName}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Mail className="w-3 h-3" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Role:</span>
                    {getRoleBadge(user.role)}
                  </div>

                  {user.userTypes && user.userTypes.length > 1 && (
                    <div>
                      <span className="text-sm text-gray-600 block mb-2">User Types:</span>
                      <div className="flex flex-wrap gap-1">
                        {user.userTypes.map((type: string) => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {user.phone && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Phone:</span>
                      <span className="text-sm font-medium">{user.phone}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">Users will appear here when they register</p>
          </div>
        )}
      </div>
    </div>
  );
}