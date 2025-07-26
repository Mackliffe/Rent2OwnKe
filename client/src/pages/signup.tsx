import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Home, User } from "lucide-react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
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
    // Handle sign up logic here
    console.log("Sign up data:", formData);
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

      {/* Sign Up Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-grass-100 p-3 rounded-full">
                <User className="h-8 w-8 text-grass-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-grass-700">Create Your Account</CardTitle>
            <CardDescription>
              Join Rent2Own Kenya to start your homeownership journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="focus:ring-grass-500 focus:border-grass-500"
                />
              </div>

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
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="07XXXXXXXX"
                  value={formData.phone}
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
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="focus:ring-grass-500 focus:border-grass-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="focus:ring-grass-500 focus:border-grass-500"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-grass-600 hover:bg-grass-700 text-white"
              >
                Create Account
              </Button>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/signin" className="text-grass-600 hover:text-grass-700 font-medium">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-grass-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Home className="h-8 w-8 text-grass-600" />
              </div>
              <h3 className="font-semibold text-grass-700 mb-2">Browse Properties</h3>
              <p className="text-sm text-gray-600">
                Explore hundreds of rent-to-own properties across Kenya
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-grass-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-grass-600 font-bold text-xl">KES</span>
              </div>
              <h3 className="font-semibold text-grass-700 mb-2">Calculate Payments</h3>
              <p className="text-sm text-gray-600">
                Use our calculator to plan your rent-to-own journey
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-grass-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <User className="h-8 w-8 text-grass-600" />
              </div>
              <h3 className="font-semibold text-grass-700 mb-2">Own Your Home</h3>
              <p className="text-sm text-gray-600">
                Start building equity towards homeownership today
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}