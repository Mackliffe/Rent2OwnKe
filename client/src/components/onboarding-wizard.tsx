import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowRight, ArrowLeft, Home, Calculator, TrendingUp, MapPin, 
  DollarSign, Users, BookOpen, Target, Lightbulb, CheckCircle,
  Star, Heart, Shield, Clock, Banknote, PiggyBank, Building2
} from "lucide-react";
import { Link } from "wouter";
import { formatKES } from "@/lib/currency";

interface OnboardingData {
  // Personal Info
  experience: "first-time" | "some-experience" | "experienced";
  budget: number;
  monthlyIncome: number;
  investmentGoals: string[];
  timeframe: string;
  riskTolerance: "low" | "moderate" | "high";
  
  // Preferences
  preferredLocations: string[];
  propertyTypes: string[];
  bedroomPreference: number;
  lifestyleFactors: string[];
  
  // Priorities
  priorities: string[];
  concerns: string[];
  
  // Contact for follow-up
  interests: string[];
}

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

export default function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    experience: "first-time",
    budget: 10000000,
    monthlyIncome: 150000,
    investmentGoals: [],
    timeframe: "1-2-years",
    riskTolerance: "moderate",
    preferredLocations: [],
    propertyTypes: [],
    bedroomPreference: 3,
    lifestyleFactors: [],
    priorities: [],
    concerns: [],
    interests: []
  });

  const totalSteps = 7;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayValue = (field: keyof OnboardingData, value: string) => {
    setData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(value)
        ? (prev[field] as string[]).filter(item => item !== value)
        : [...(prev[field] as string[]), value]
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(data);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    {
      title: "Welcome to Rent-to-Own Investing!",
      subtitle: "Let's find your perfect property investment",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-grass-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-10 h-10 text-grass-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Your Property Investment Journey</h3>
            <p className="text-gray-600 mb-6">
              Rent-to-own investing allows you to gradually build property ownership while living in your investment. 
              We'll guide you through finding the perfect property that matches your financial situation and goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Calculator className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Smart Calculator</h4>
              <p className="text-sm text-gray-600">Calculate your payments and ownership timeline</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Market Insights</h4>
              <p className="text-sm text-gray-600">Get real-time market data and trends</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Lightbulb className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">AI Recommendations</h4>
              <p className="text-sm text-gray-600">Personalized property suggestions</p>
            </div>
          </div>

          <div className="bg-grass-50 p-4 rounded-lg">
            <h4 className="font-medium text-grass-800 mb-2">What you'll learn:</h4>
            <ul className="text-sm text-grass-700 space-y-1">
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" />How rent-to-own works in Kenya</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" />Your ideal budget and property type</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" />Investment strategies for beginners</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" />Personalized property recommendations</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Your Investment Experience",
      subtitle: "Help us understand your background",
      content: (
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium">What's your property investment experience?</Label>
            <RadioGroup 
              value={data.experience} 
              onValueChange={(value) => updateData("experience", value)}
              className="mt-3"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="first-time" id="first-time" />
                <div className="flex-1">
                  <label htmlFor="first-time" className="font-medium cursor-pointer">First-time investor</label>
                  <p className="text-sm text-gray-600">I'm new to property investment and want to learn</p>
                </div>
                <BookOpen className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="some-experience" id="some-experience" />
                <div className="flex-1">
                  <label htmlFor="some-experience" className="font-medium cursor-pointer">Some experience</label>
                  <p className="text-sm text-gray-600">I've invested before but want to try rent-to-own</p>
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="experienced" id="experienced" />
                <div className="flex-1">
                  <label htmlFor="experienced" className="font-medium cursor-pointer">Experienced investor</label>
                  <p className="text-sm text-gray-600">I have multiple investments and know the market</p>
                </div>
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
            </RadioGroup>
          </div>

          {data.experience === "first-time" && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Great choice for beginners!</h4>
                  <p className="text-sm text-blue-800 mt-1">
                    Rent-to-own is perfect for first-time investors because you can start with lower upfront costs 
                    and gradually build equity while learning about property ownership.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: "Financial Planning",
      subtitle: "Let's understand your budget and income",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="budget" className="text-base font-medium">Maximum Property Budget</Label>
              <Input
                id="budget"
                type="number"
                value={data.budget}
                onChange={(e) => updateData("budget", parseInt(e.target.value) || 0)}
                className="mt-2"
              />
              <p className="text-sm text-gray-600 mt-1">
                Current: {formatKES(data.budget)}
              </p>
            </div>

            <div>
              <Label htmlFor="income" className="text-base font-medium">Monthly Income</Label>
              <Input
                id="income"
                type="number"
                value={data.monthlyIncome}
                onChange={(e) => updateData("monthlyIncome", parseInt(e.target.value) || 0)}
                className="mt-2"
              />
              <p className="text-sm text-gray-600 mt-1">
                Current: {formatKES(data.monthlyIncome)}/month
              </p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Estimated Monthly Payment</h4>
            <div className="text-2xl font-bold text-green-800">
              {formatKES(Math.round(data.budget * 0.008))} - {formatKES(Math.round(data.budget * 0.012))}
            </div>
            <p className="text-sm text-green-700 mt-1">
              Based on 10-15% down payment and 15-year term
            </p>
          </div>

          <div>
            <Label className="text-base font-medium">Risk Tolerance</Label>
            <RadioGroup 
              value={data.riskTolerance} 
              onValueChange={(value) => updateData("riskTolerance", value)}
              className="mt-3"
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="low" id="low-risk" />
                <div className="flex-1">
                  <label htmlFor="low-risk" className="font-medium cursor-pointer">Conservative</label>
                  <p className="text-sm text-gray-600">I prefer stable, low-risk investments</p>
                </div>
                <Shield className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="moderate" id="moderate-risk" />
                <div className="flex-1">
                  <label htmlFor="moderate-risk" className="font-medium cursor-pointer">Balanced</label>
                  <p className="text-sm text-gray-600">I'm comfortable with moderate risk for better returns</p>
                </div>
                <Target className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="high" id="high-risk" />
                <div className="flex-1">
                  <label htmlFor="high-risk" className="font-medium cursor-pointer">Aggressive</label>
                  <p className="text-sm text-gray-600">I'm willing to take higher risks for higher returns</p>
                </div>
                <TrendingUp className="w-5 h-5 text-red-500" />
              </div>
            </RadioGroup>
          </div>
        </div>
      )
    },
    {
      title: "Investment Goals",
      subtitle: "What do you want to achieve?",
      content: (
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-4 block">Select your investment goals (choose all that apply)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { id: "first-home", label: "Own my first home", icon: Home, color: "blue" },
                { id: "investment", label: "Build wealth through property", icon: TrendingUp, color: "green" },
                { id: "rental-income", label: "Generate rental income", icon: DollarSign, color: "yellow" },
                { id: "upgrade", label: "Upgrade from current home", icon: ArrowRight, color: "purple" },
                { id: "retirement", label: "Retirement planning", icon: PiggyBank, color: "indigo" },
                { id: "family", label: "Secure family's future", icon: Users, color: "pink" }
              ].map(goal => (
                <div 
                  key={goal.id}
                  className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    data.investmentGoals.includes(goal.id) ? 'bg-grass-50 border-grass-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => toggleArrayValue("investmentGoals", goal.id)}
                >
                  <Checkbox 
                    checked={data.investmentGoals.includes(goal.id)}
                    onChange={() => {}}
                  />
                  <goal.icon className={`w-5 h-5 text-${goal.color}-500`} />
                  <span className="font-medium">{goal.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Investment timeline</Label>
            <RadioGroup 
              value={data.timeframe} 
              onValueChange={(value) => updateData("timeframe", value)}
              className="mt-3"
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="immediately" id="immediately" />
                <div className="flex-1">
                  <label htmlFor="immediately" className="font-medium cursor-pointer">Ready to invest now</label>
                  <p className="text-sm text-gray-600">I want to start within the next 1-3 months</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="1-2-years" id="1-2-years" />
                <div className="flex-1">
                  <label htmlFor="1-2-years" className="font-medium cursor-pointer">Within 1-2 years</label>
                  <p className="text-sm text-gray-600">I'm planning ahead and want to prepare</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="exploring" id="exploring" />
                <div className="flex-1">
                  <label htmlFor="exploring" className="font-medium cursor-pointer">Just exploring</label>
                  <p className="text-sm text-gray-600">I'm learning about my options</p>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
      )
    },
    {
      title: "Property Preferences",
      subtitle: "What type of property interests you?",
      content: (
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-4 block">Preferred locations in Kenya</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Kiambu", "Karen", "Westlands", "Kilimani"].map(location => (
                <div 
                  key={location}
                  className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                    data.preferredLocations.includes(location.toLowerCase()) ? 'bg-grass-50 border-grass-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => toggleArrayValue("preferredLocations", location.toLowerCase())}
                >
                  <Checkbox 
                    checked={data.preferredLocations.includes(location.toLowerCase())}
                    onChange={() => {}}
                  />
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">{location}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium mb-4 block">Property types you're interested in</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { id: "apartment", label: "Apartment", description: "Urban living with amenities", icon: Building2 },
                { id: "house", label: "House", description: "Standalone family home", icon: Home },
                { id: "townhouse", label: "Townhouse", description: "Multi-level shared community", icon: Users },
                { id: "commercial", label: "Commercial Property", description: "Business investment opportunity", icon: DollarSign }
              ].map(type => (
                <div 
                  key={type.id}
                  className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    data.propertyTypes.includes(type.id) ? 'bg-grass-50 border-grass-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => toggleArrayValue("propertyTypes", type.id)}
                >
                  <Checkbox 
                    checked={data.propertyTypes.includes(type.id)}
                    onChange={() => {}}
                  />
                  <type.icon className="w-5 h-5 text-grass-600" />
                  <div>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-sm text-gray-600">{type.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="bedrooms" className="text-base font-medium">Preferred number of bedrooms</Label>
            <div className="flex space-x-2 mt-3">
              {[1, 2, 3, 4, 5].map(num => (
                <Button
                  key={num}
                  variant={data.bedroomPreference === num ? "default" : "outline"}
                  onClick={() => updateData("bedroomPreference", num)}
                  className="w-12 h-12"
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Lifestyle Factors",
      subtitle: "What matters most to you?",
      content: (
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-4 block">Important lifestyle factors (select all that apply)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { id: "family-friendly", label: "Family-friendly area", description: "Good schools and safe neighborhoods" },
                { id: "transport-access", label: "Transport accessibility", description: "Near matatus, buses, or main roads" },
                { id: "shopping", label: "Shopping centers", description: "Close to malls and markets" },
                { id: "quiet", label: "Quiet environment", description: "Peaceful residential area" },
                { id: "urban", label: "Urban lifestyle", description: "City living with nightlife and entertainment" },
                { id: "security", label: "High security", description: "Gated communities with security" },
                { id: "amenities", label: "Modern amenities", description: "Gym, pool, parking, backup power" },
                { id: "investment-growth", label: "Investment growth potential", description: "Area with development and appreciation" }
              ].map(factor => (
                <div 
                  key={factor.id}
                  className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    data.lifestyleFactors.includes(factor.id) ? 'bg-grass-50 border-grass-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => toggleArrayValue("lifestyleFactors", factor.id)}
                >
                  <Checkbox 
                    checked={data.lifestyleFactors.includes(factor.id)}
                    onChange={() => {}}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="font-medium">{factor.label}</div>
                    <div className="text-sm text-gray-600">{factor.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Final Steps",
      subtitle: "You're all set! Let's find your perfect property",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Congratulations!</h3>
            <p className="text-gray-600 mb-6">
              You've completed the onboarding process. Based on your preferences, we'll now show you 
              personalized property recommendations that match your investment goals and budget.
            </p>
          </div>

          <div className="bg-grass-50 p-6 rounded-lg">
            <h4 className="font-bold text-grass-900 mb-4">Your Investment Profile Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Experience:</strong> {data.experience.replace("-", " ")}
              </div>
              <div>
                <strong>Budget:</strong> {formatKES(data.budget)}
              </div>
              <div>
                <strong>Risk Tolerance:</strong> {data.riskTolerance}
              </div>
              <div>
                <strong>Bedrooms:</strong> {data.bedroomPreference}
              </div>
              <div>
                <strong>Locations:</strong> {data.preferredLocations.length} selected
              </div>
              <div>
                <strong>Property Types:</strong> {data.propertyTypes.length} selected
              </div>
            </div>
          </div>

          <div>
            <Label className="text-base font-medium mb-4 block">What would you like to explore first?</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { id: "recommendations", label: "Get AI Recommendations", description: "See personalized property matches" },
                { id: "calculator", label: "Calculate Payments", description: "Estimate your monthly payments" },
                { id: "market-trends", label: "Market Analysis", description: "View current market trends" },
                { id: "browse", label: "Browse Properties", description: "Explore all available properties" }
              ].map(interest => (
                <div 
                  key={interest.id}
                  className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    data.interests.includes(interest.id) ? 'bg-grass-50 border-grass-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => toggleArrayValue("interests", interest.id)}
                >
                  <Checkbox 
                    checked={data.interests.includes(interest.id)}
                    onChange={() => {}}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="font-medium">{interest.label}</div>
                    <div className="text-sm text-gray-600">{interest.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
  ];

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-grass-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">{currentStep + 1}</span>
            </div>
            <div className="text-sm text-gray-600">of {totalSteps}</div>
          </div>
          <Progress value={progress} className="w-full max-w-md mx-auto mb-4" />
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              onClick={onSkip}
              className="text-gray-500 hover:text-gray-700"
            >
              Skip for now
            </Button>
            <div className="text-right">
              <div className="text-sm text-gray-500">Step {currentStep + 1} of {totalSteps}</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
            <p className="text-gray-600">{steps[currentStep].subtitle}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {steps[currentStep].content}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>
          
          <Button 
            onClick={nextStep}
            className="bg-grass-600 hover:bg-grass-700 flex items-center space-x-2"
          >
            <span>{currentStep === totalSteps - 1 ? 'Complete Setup' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}