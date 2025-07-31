import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import PropertyJourney from "@/components/property-journey";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Rocket, 
  Target, 
  Users, 
  TrendingUp,
  BookOpen,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Heart
} from "lucide-react";

export default function PropertyJourneyPage() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState("browse");
  const [selectedExample, setSelectedExample] = useState("first-time");
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to track your property journey",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  const journeyExamples = {
    "first-time": {
      title: "First-Time Buyer",
      description: "Sarah's journey to her first home",
      timeline: "12 months",
      currentStep: "calculate",
      story: "Sarah started exploring properties in Kilimani after saving for 2 years. She's now calculating payments for a 2BR apartment.",
      budget: "KES 6.5M",
      progress: 33
    },
    "family": {
      title: "Growing Family",
      description: "John & Mary upgrading to a family home",
      timeline: "8 months",
      currentStep: "apply",
      story: "The Kiprotich family needs more space for their growing family. They found the perfect 4BR house in Karen.",
      budget: "KES 12M",
      progress: 50
    },
    "investment": {
      title: "Investment Property",
      description: "Peter's second property investment",
      timeline: "6 months",
      currentStep: "payment",
      story: "Peter is an experienced investor looking for rental income. He's starting payments on an apartment in Westlands.",
      budget: "KES 8.5M",
      progress: 83
    },
    "completed": {
      title: "Proud Homeowner",
      description: "Grace's completed journey",
      timeline: "Completed!",
      currentStep: "ownership",
      story: "Grace successfully completed her 10-year rent-to-own journey and now owns her dream home in Lavington.",
      budget: "KES 15M",
      progress: 100
    }
  };

  const handleStepClick = (stepId: string) => {
    setCurrentStep(stepId);
    
    // Navigate to relevant pages based on step
    switch (stepId) {
      case "browse":
        setLocation("/");
        break;
      case "calculate":
        setLocation("/calculator");
        break;
      case "apply":
        setLocation("/loan-application/5");
        break;
      case "approval":
        setLocation("/dashboard");
        break;
      case "payment":
        setLocation("/dashboard");
        break;
      case "ownership":
        // Trigger celebration animation
        break;
    }
  };

  const currentExample = journeyExamples[selectedExample as keyof typeof journeyExamples];

  // Loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-grass-600 mx-auto mb-4"></div>
            <p>Loading your journey...</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect in useEffect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-grass-600 rounded-full flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Property Journey
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Follow the path to homeownership with our guided journey tracker. 
            See exactly where you are and what comes next in your rent-to-own adventure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Journey Tracker */}
          <div className="lg:col-span-2">
            <PropertyJourney 
              currentStep={currentExample.currentStep}
              onStepClick={handleStepClick}
              showAnimations={true}
            />
          </div>

          {/* Example Stories */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-grass-600" />
                  Journey Examples
                </CardTitle>
                <CardDescription>
                  See how others are progressing on their path to ownership
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(journeyExamples).map(([key, example]) => (
                  <div
                    key={key}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedExample === key 
                        ? "border-grass-300 bg-grass-50" 
                        : "border-gray-200 hover:border-grass-200"
                    }`}
                    onClick={() => setSelectedExample(key)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{example.title}</h3>
                      <Badge variant={key === "completed" ? "default" : "secondary"}>
                        {example.progress}%
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{example.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{example.budget}</span>
                      <span>{example.timeline}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Current Story */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-grass-600" />
                  {currentExample.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{currentExample.story}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-medium">{currentExample.budget}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Timeline:</span>
                    <span className="font-medium">{currentExample.timeline}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress:</span>
                    <span className="font-medium">{currentExample.progress}% Complete</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-grass-600" />
                  Take Action
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-grass-600 hover:bg-grass-700"
                  onClick={() => setLocation("/")}
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Start Browsing Properties
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setLocation("/calculator")}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Calculate Payments
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full text-grass-600 hover:text-grass-700"
                  onClick={() => setLocation("/onboarding")}
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Get Personalized Help
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Journey Tips */}
        <div className="mt-12">
          <Tabs defaultValue="tips" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tips">Journey Tips</TabsTrigger>
              <TabsTrigger value="timeline">Timeline Guide</TabsTrigger>
              <TabsTrigger value="success">Success Stories</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tips" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Start with Research",
                    description: "Take time to explore different areas and property types before making decisions.",
                    icon: BookOpen,
                    color: "blue"
                  },
                  {
                    title: "Budget Realistically", 
                    description: "Include all costs: down payment, monthly payments, and maintenance expenses.",
                    icon: TrendingUp,
                    color: "green"
                  },
                  {
                    title: "Document Everything",
                    description: "Keep records of all applications, communications, and payment confirmations.",
                    icon: CheckCircle,
                    color: "purple"
                  }
                ].map((tip, index) => {
                  const Icon = tip.icon;
                  return (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${tip.color}-100`}>
                            <Icon className={`w-5 h-5 text-${tip.color}-600`} />
                          </div>
                          <h3 className="font-semibold">{tip.title}</h3>
                        </div>
                        <p className="text-gray-600 text-sm">{tip.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {[
                      { phase: "Research Phase", duration: "1-4 weeks", activities: ["Browse properties", "Visit neighborhoods", "Compare prices"] },
                      { phase: "Planning Phase", duration: "1-2 weeks", activities: ["Calculate budgets", "Check eligibility", "Gather documents"] },
                      { phase: "Application Phase", duration: "1 week", activities: ["Submit applications", "Provide documentation", "Interview process"] },
                      { phase: "Approval Phase", duration: "1-2 weeks", activities: ["Credit checks", "Income verification", "Property evaluation"] },
                      { phase: "Ownership Journey", duration: "5-15 years", activities: ["Monthly payments", "Property maintenance", "Equity building"] }
                    ].map((phase, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-grass-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-grass-600">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{phase.phase}</h3>
                            <Badge variant="outline">{phase.duration}</Badge>
                          </div>
                          <div className="space-y-1">
                            {phase.activities.map((activity, actIndex) => (
                              <div key={actIndex} className="text-sm text-gray-600 flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-grass-500" />
                                {activity}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="success" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    name: "Grace Wanjiku",
                    property: "3BR Apartment in Lavington",
                    timeline: "Completed in 8 years",
                    story: "Started as a young professional, now owns her dream home with a beautiful view of the city.",
                    achievement: "Built KES 4.2M in equity"
                  },
                  {
                    name: "David Kimani", 
                    property: "4BR House in Karen",
                    timeline: "Completed in 12 years",
                    story: "Wanted to give his family a great home. Now his children have grown up in their own house.",
                    achievement: "Property value doubled"
                  }
                ].map((story, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-grass-100 rounded-full flex items-center justify-center">
                          <Heart className="w-6 h-6 text-grass-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{story.name}</h3>
                          <p className="text-sm text-gray-600">{story.property}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{story.story}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Timeline:</span>
                          <Badge variant="secondary">{story.timeline}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Achievement:</span>
                          <span className="font-medium text-grass-600">{story.achievement}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}