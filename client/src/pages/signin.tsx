import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Home, LogIn } from "lucide-react";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign in logic here
    console.log("Sign in data:", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-grass-50 to-grass-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 text-grass-600 hover:text-grass-700">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-grass-600" />
              <span className="text-xl font-bold text-grass-700">Rent2Own Kenya</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Sign In Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-grass-100 p-3 rounded-full">
                <LogIn className="h-8 w-8 text-grass-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-grass-700">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your Rent2Own Kenya account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="focus:ring-grass-500 focus:border-grass-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="focus:ring-grass-500 focus:border-grass-500"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 rounded border-gray-300" />
                  Remember me
                </label>
                <Link href="/forgot-password" className="text-grass-600 hover:text-grass-700">
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-grass-600 hover:bg-grass-700 text-white"
              >
                Sign In
              </Button>

              <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup" className="text-grass-600 hover:text-grass-700 font-medium">
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Why Choose Rent2Own Section */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-grass-700 mb-4">Why Choose Rent2Own Kenya?</h2>
          <p className="text-gray-600">Your path to homeownership made simple</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-grass-600 mb-2">5-15</div>
              <div className="text-sm text-gray-600">Years to own</div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-grass-600 mb-2">10%</div>
              <div className="text-sm text-gray-600">Min down payment</div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-grass-600 mb-2">500+</div>
              <div className="text-sm text-gray-600">Properties available</div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-grass-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Customer support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}