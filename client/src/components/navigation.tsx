import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Home, Calculator, TrendingDown, ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

export default function Navigation() {
  const [location] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            
            {/* Calculators Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className={`font-medium flex items-center space-x-1 ${
                location === '/calculator' || location === '/risk-calculator' 
                  ? 'text-grass-600' 
                  : 'text-gray-700 hover:text-grass-600'
              }`}>
                <span>Calculators</span>
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/calculator" className="flex items-center space-x-2 w-full">
                    <Calculator className="w-4 h-4" />
                    <span>Payment Calculator</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/risk-calculator" className="flex items-center space-x-2 w-full">
                    <TrendingDown className="w-4 h-4" />
                    <span>Risk Calculator</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <a href="#how-it-works" className="text-gray-700 hover:text-grass-600 font-medium">
              How It Works
            </a>
            
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
                <Link href="/api/logout">
                  <Button variant="ghost" className="text-green-600 hover:text-green-700">
                    Sign Out
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
                <Link href="/onboarding">
                  <Button className="bg-grass-600 hover:bg-grass-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              <Link 
                href="/" 
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-grass-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Properties
              </Link>
              <Link 
                href="/calculator" 
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-grass-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Payment Calculator
              </Link>
              <Link 
                href="/risk-calculator" 
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-grass-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Risk Calculator
              </Link>
              <a 
                href="#how-it-works" 
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-grass-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <Link 
                href="/market-trends" 
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-grass-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Market Trends
              </Link>
              <Link 
                href="/recommendations" 
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-grass-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                AI Recommendations
              </Link>
              
              {/* Mobile auth buttons */}
              <div className="pt-4 border-t border-gray-200">
                {!isLoading && !isAuthenticated && (
                  <>
                    <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-green-600 hover:text-green-700">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/onboarding" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-grass-600 hover:bg-grass-700 text-white mt-2">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
                {!isLoading && isAuthenticated && (
                  <>
                    <Link href="/api-settings" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-green-600 hover:text-green-700">
                        API Settings
                      </Button>
                    </Link>
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-green-600 hover:text-green-700">
                        My Dashboard
                      </Button>
                    </Link>
                    <Link href="/api/logout" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-green-600 hover:text-green-700">
                        Sign Out
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
