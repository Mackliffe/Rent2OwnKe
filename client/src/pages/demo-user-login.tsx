import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Mail, 
  Lock, 
  Building2, 
  ArrowRight,
  AlertCircle 
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DemoUserLogin() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    email: "john.mwangi@gmail.com",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate user login for demo purposes
      if (formData.email === "john.mwangi@gmail.com" && formData.password === "demo123") {
        // Store demo user session
        localStorage.setItem("demo_user_session", JSON.stringify({
          userId: "user-001",
          email: formData.email,
          firstName: "John",
          lastName: "Mwangi",
          loginTime: Date.now()
        }));
        
        // Redirect to dashboard
        setLocation("/dashboard");
      } else {
        setError("Invalid credentials. Use demo123 as password for John Mwangi.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-grass-50 to-grass-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-grass-100 rounded-full">
              <Building2 className="w-8 h-8 text-grass-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Rent2Own Demo Login
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Login as a demo user to track loan applications
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john.mwangi@gmail.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter demo password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Demo User Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-3">Demo User Profile:</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span><strong>Name:</strong> John Mwangi</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span><strong>Email:</strong> john.mwangi@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span><strong>Password:</strong> demo123</span>
                </div>
              </div>
              <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-700">
                This user has 3 loan applications: 1 approved, 1 pending, and 1 under review
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-grass-600 hover:bg-grass-700"
              disabled={isLoading}
            >
              {isLoading ? (
                "Signing in..."
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Sign In as Demo User</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>

          {/* Navigation Links */}
          <div className="mt-6 space-y-2 text-center">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="text-sm text-gray-600 hover:text-grass-600"
            >
              ← Back to main site
            </Button>
            <div className="text-xs text-gray-500">
              Want to use real authentication? <a href="/api/login" className="text-grass-600 hover:underline">Login with Replit</a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}