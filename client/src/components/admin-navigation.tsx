import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Building, 
  FileText, 
  Users, 
  Store, 
  User,
  LogOut 
} from "lucide-react";

interface AdminNavigationProps {
  currentPage?: string;
}

export default function AdminNavigation({ currentPage = "home" }: AdminNavigationProps) {
  const [location] = useLocation();

  const navItems = [
    {
      id: "home",
      label: "Home", 
      href: "/admin",
      icon: Home
    },
    {
      id: "properties",
      label: "Properties",
      href: "/admin/properties", 
      icon: Building
    },
    {
      id: "applications",
      label: "Applications",
      href: "/admin/applications",
      icon: FileText
    },
    {
      id: "users",
      label: "Users",
      href: "/admin/users",
      icon: Users
    },
    {
      id: "sellers", 
      label: "Sellers",
      href: "/admin/sellers",
      icon: Store
    },
    {
      id: "account-managers",
      label: "Account Managers",
      href: "/admin/account-managers",
      icon: User
    }
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return location === "/admin";
    }
    return location.startsWith(href);
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-grass-600 rounded-lg flex items-center justify-center">
              <Home className="text-white h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">Rent2Own</span>
              <span className="text-sm text-grass-600 font-medium ml-1">Admin</span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.id} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className={`flex items-center space-x-2 ${
                      isActive(item.href) 
                        ? "bg-grass-600 hover:bg-grass-700 text-white" 
                        : "text-gray-700 hover:text-grass-600 hover:bg-grass-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Sign Out */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => window.location.href = "/api/logout"}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.id} href={item.href}>
                  <Button
                    size="sm"
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className={`flex items-center space-x-1 ${
                      isActive(item.href) 
                        ? "bg-grass-600 hover:bg-grass-700 text-white" 
                        : "text-gray-700 hover:text-grass-600 hover:bg-grass-50"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span className="text-xs">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}