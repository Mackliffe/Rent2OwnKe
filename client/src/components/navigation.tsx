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
          {/* Logo - clickable on mobile/tablet to open menu */}
          <div 
            className="flex items-center space-x-2 cursor-pointer md:cursor-default"
            onClick={() => window.innerWidth < 768 && setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Link href="/" className="flex items-center space-x-2 md:pointer-events-auto pointer-events-none">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Home className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-gray-900">Rent2Own</span>
              <span className="text-sm text-grass-600 font-medium">Kenya</span>
            </Link>
          </div>
          
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
            
            <Link 
              href="/property-journey" 
              className={`font-medium ${location === '/property-journey' ? 'text-grass-600' : 'text-gray-700 hover:text-grass-600'}`}
            >
              Journey Tracker
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
                <Link href="/signin" className="hidden md:inline-block">
                  <Button variant="ghost" className="text-green-600 hover:text-green-700">
                    Sign In
                  </Button>
                </Link>
                <Link href="/onboarding" className="hidden md:inline-block">
                  <Button className="bg-grass-600 hover:bg-grass-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
            
            {/* Mobile menu close button - only shown when menu is open */}
            {mobileMenuOpen && (
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-6 h-6" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Mobile/Tablet Slide-out Menu */}
        <div className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-25"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className={`absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Home className="text-white text-sm" />
                </div>
                <span className="text-lg font-bold text-gray-900">Rent2Own</span>
                <span className="text-xs text-grass-600 font-medium">Kenya</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Menu Items */}
            <div className="p-4 space-y-1">
              <Link 
                href="/" 
                className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-grass-600 hover:bg-grass-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Properties
              </Link>
              
              {/* Calculators Section */}
              <div className="py-2">
                <div className="px-3 py-1 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Calculators
                </div>
                <Link 
                  href="/calculator" 
                  className="block px-3 py-2 ml-3 text-base font-medium text-gray-700 hover:text-grass-600 hover:bg-grass-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <Calculator className="w-4 h-4" />
                    <span>Payment Calculator</span>
                  </div>
                </Link>
                <Link 
                  href="/risk-calculator" 
                  className="block px-3 py-2 ml-3 text-base font-medium text-gray-700 hover:text-grass-600 hover:bg-grass-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="w-4 h-4" />
                    <span>Risk Calculator</span>
                  </div>
                </Link>
              </div>
              
              <a 
                href="#how-it-works" 
                className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-grass-600 hover:bg-grass-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <Link 
                href="/market-trends" 
                className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-grass-600 hover:bg-grass-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Market Trends
              </Link>
              <Link 
                href="/recommendations" 
                className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-grass-600 hover:bg-grass-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                AI Recommendations
              </Link>
              <Link 
                href="/property-journey" 
                className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-grass-600 hover:bg-grass-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Journey Tracker
              </Link>
              
              {/* Auth Section */}
              <div className="pt-6 border-t border-gray-200 mt-6">
                {!isLoading && !isAuthenticated && (
                  <div className="space-y-2">
                    <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-green-600 hover:text-green-700 hover:bg-grass-50">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/onboarding" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-grass-600 hover:bg-grass-700 text-white">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
                {!isLoading && isAuthenticated && (
                  <div className="space-y-2">
                    <Link href="/api-settings" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-green-600 hover:text-green-700 hover:bg-grass-50">
                        API Settings
                      </Button>
                    </Link>
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-green-600 hover:text-green-700 hover:bg-grass-50">
                        My Dashboard
                      </Button>
                    </Link>
                    <Link href="/api/logout" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-green-600 hover:text-green-700 hover:bg-grass-50">
                        Sign Out
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
