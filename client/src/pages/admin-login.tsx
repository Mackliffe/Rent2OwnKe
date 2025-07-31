import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Shield, 
  User, 
  Lock, 
  Building2, 
  ArrowRight,
  AlertCircle 
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "admin" as "admin" | "account_manager"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate admin login
      if (formData.email === "admin@rent2own.co.ke" && formData.password === "admin123") {
        // Successful admin login
        localStorage.setItem("admin_session", JSON.stringify({
          role: formData.role,
          email: formData.email,
          loginTime: Date.now()
        }));
        setLocation("/admin");
      } else if (formData.role === "account_manager" && formData.password === "manager123") {
        // Account manager login
        localStorage.setItem("admin_session", JSON.stringify({
          role: formData.role,
          email: formData.email,
          loginTime: Date.now()
        }));
        setLocation("/admin");
      } else {
        setError("Invalid credentials. Please check your email and password.");
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
            Rent2Own Admin Portal
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Access the administrative dashboard
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label>Login As</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={formData.role === "admin" ? "default" : "outline"}
                  className={`h-auto p-3 ${
                    formData.role === "admin" 
                      ? "bg-grass-600 hover:bg-grass-700 border-grass-600" 
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => handleInputChange("role", "admin")}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm">Admin</span>
                  </div>
                </Button>
                <Button
                  type="button"
                  variant={formData.role === "account_manager" ? "default" : "outline"}
                  className={`h-auto p-3 ${
                    formData.role === "account_manager" 
                      ? "bg-grass-600 hover:bg-grass-700 border-grass-600" 
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => handleInputChange("role", "account_manager")}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <User className="w-5 h-5" />
                    <span className="text-sm">Account Manager</span>
                  </div>
                </Button>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@rent2own.co.ke"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-4"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="pl-4"
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

            {/* Demo Credentials */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</h4>
              <div className="text-xs text-blue-700 space-y-1">
                <div><strong>Admin:</strong> admin@rent2own.co.ke / admin123</div>
                <div><strong>Account Manager:</strong> any email / manager123</div>
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
                  <Lock className="w-4 h-4" />
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>

          {/* Back to Main Site */}
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="text-sm text-gray-600 hover:text-grass-600"
            >
              ← Back to main site
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}