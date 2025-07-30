import { Link, useLocation } from "wouter";
import { Home, Calculator, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Navigation() {
  const [location] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Home className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold text-gray-900">Rent2Own</span>
            <span className="text-sm text-grass-600 font-medium">Kenya</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`font-medium ${location === '/' ? 'text-grass-600' : 'text-gray-700 hover:text-grass-600'}`}
            >
              Browse Properties
            </Link>
            <Link 
              href="/calculator" 
              className={`font-medium ${location === '/calculator' ? 'text-grass-600' : 'text-gray-700 hover:text-grass-600'}`}
            >
              Calculator
            </Link>
            <Link 
              href="/risk-calculator" 
              className={`font-medium ${location === '/risk-calculator' ? 'text-grass-600' : 'text-gray-700 hover:text-grass-600'}`}
            >
              Risk Calculator
            </Link>
            <Link 
              href="/market-trends" 
              className={`font-medium ${location === '/market-trends' ? 'text-grass-600' : 'text-gray-700 hover:text-grass-600'}`}
            >
              Market Trends
            </Link>
            <Link 
              href="/recommendations" 
              className={`font-medium ${location === '/recommendations' ? 'text-grass-600' : 'text-gray-700 hover:text-grass-600'}`}
            >
              AI Recommendations
            </Link>
            <a href="#how-it-works" className="text-gray-700 hover:text-grass-600 font-medium">
              How It Works
            </a>
            <a href="#contact" className="text-gray-700 hover:text-grass-600 font-medium">
              Contact
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            {!isLoading && isAuthenticated && (
              <>
                <Link href="/api-settings">
                  <Button variant="ghost" className="text-green-600 hover:text-green-700">
                    API Settings
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-green-600 hover:text-green-700">
                    My Dashboard
                  </Button>
                </Link>
              </>
            )}
            {!isLoading && !isAuthenticated && (
              <>
                <Link href="/signin">
                  <Button variant="ghost" className="text-green-600 hover:text-green-700">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
            {!isLoading && isAuthenticated && (
              <Link href="/api/logout">
                <Button variant="ghost" className="text-green-600 hover:text-green-700">
                  Sign Out
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
