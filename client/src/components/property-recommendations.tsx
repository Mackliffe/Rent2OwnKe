import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Sparkles, TrendingUp, DollarSign, MapPin, Home, Brain, 
  Heart, Target, Lightbulb, Star, Search, Filter, Wand2 
} from "lucide-react";
import { formatKES } from "@/lib/currency";
import { apiRequest } from "@/lib/queryClient";
import PropertyCard from "./property-card";
import type { Property } from "@shared/schema";

interface PropertyRecommendation {
  propertyId: number;
  matchScore: number;
  confidence: number;
  reasons: string[];
  insights: Array<{
    category: string;
    insight: string;
    importance: "high" | "medium" | "low";
  }>;
  financialFit: {
    affordabilityScore: number;
    paymentComfort: "comfortable" | "stretch" | "tight";
    investmentPotential: number;
  };
  marketInsights: {
    priceCompetitiveness: string;
    marketTrend: "rising" | "stable" | "declining";
    investmentOutlook: string;
  };
  personalizedNote?: string;
  property?: Property;
}

interface UserPreferences {
  preferredLocations: string[];
  propertyTypes: string[];
  budgetMin?: number;
  budgetMax?: number;
  bedroomPreference?: number;
  lifestyleFactors: string[];
  investmentGoals: string[];
  riskTolerance: "low" | "moderate" | "high";
  searchHistory: string[];
  viewedProperties: number[];
  savedProperties: number[];
}

export default function PropertyRecommendations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [preferences, setPreferences] = useState<UserPreferences>({
    preferredLocations: [],
    propertyTypes: [],
    budgetMax: 15000000,
    bedroomPreference: 3,
    lifestyleFactors: ["family-friendly"],
    investmentGoals: ["first-home"],
    riskTolerance: "moderate",
    searchHistory: [],
    viewedProperties: [],
    savedProperties: []
  });
  const [showPreferences, setShowPreferences] = useState(false);

  // Fetch recommendations
  const { data: recommendations, isLoading, refetch } = useQuery<PropertyRecommendation[]>({
    queryKey: ["/api/recommendations", preferences],
    enabled: false, // Manual trigger
  });

  // Search intent analysis
  const analyzeIntentMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest("POST", "/api/recommendations/analyze-intent", { query });
      return response.json();
    },
  });

  // Generate recommendations
  const generateRecommendationsMutation = useMutation({
    mutationFn: async (prefs: UserPreferences) => {
      const response = await apiRequest("POST", "/api/recommendations/generate", { preferences: prefs });
      return response.json();
    },
    onSuccess: (data) => {
      // Manually update the query data
      // In a real app, you'd use queryClient.setQueryData
    },
  });

  const handleSmartSearch = async () => {
    if (searchQuery.trim()) {
      const intent = await analyzeIntentMutation.mutateAsync(searchQuery);
      
      // Update preferences based on intent
      const updatedPreferences = { ...preferences };
      
      if (intent.extractedFilters.location) {
        updatedPreferences.preferredLocations = [intent.extractedFilters.location];
      }
      if (intent.extractedFilters.propertyType) {
        updatedPreferences.propertyTypes = [intent.extractedFilters.propertyType];
      }
      if (intent.extractedFilters.budget) {
        if (intent.extractedFilters.budget.min) updatedPreferences.budgetMin = intent.extractedFilters.budget.min;
        if (intent.extractedFilters.budget.max) updatedPreferences.budgetMax = intent.extractedFilters.budget.max;
      }
      if (intent.extractedFilters.bedrooms) {
        updatedPreferences.bedroomPreference = intent.extractedFilters.bedrooms;
      }
      
      setPreferences(updatedPreferences);
      generateRecommendations(updatedPreferences);
    }
  };

  const generateRecommendations = async (prefs: UserPreferences = preferences) => {
    await generateRecommendationsMutation.mutateAsync(prefs);
    refetch();
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-blue-600 bg-blue-50";
    if (score >= 40) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getComfortColor = (comfort: string) => {
    switch (comfort) {
      case "comfortable": return "text-green-600";
      case "stretch": return "text-yellow-600";
      case "tight": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "rising": return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "stable": return <Target className="w-4 h-4 text-blue-600" />;
      case "declining": return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default: return <Target className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <Sparkles className="w-8 h-8 mr-3 text-grass-600" />
          AI-Powered Property Recommendations
        </h2>
        <p className="text-lg text-gray-600">Discover your perfect property with intelligent insights and personalized suggestions</p>
      </div>

      {/* Smart Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-grass-600" />
            Smart Property Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Describe what you're looking for... e.g., '3 bedroom house in Nairobi under 10 million'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSmartSearch()}
              />
            </div>
            <Button 
              onClick={handleSmartSearch}
              disabled={analyzeIntentMutation.isPending}
              className="bg-grass-600 hover:bg-grass-700"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              {analyzeIntentMutation.isPending ? 'Analyzing...' : 'Smart Search'}
            </Button>
          </div>
          
          {analyzeIntentMutation.data && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>AI Analysis:</strong> {analyzeIntentMutation.data.intent} search detected. 
                Confidence: {Math.round(analyzeIntentMutation.data.confidence * 100)}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="recommendations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recommendations">Personalized Recommendations</TabsTrigger>
          <TabsTrigger value="preferences">Customize Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Your Personalized Matches</h3>
            <Button 
              onClick={() => generateRecommendations()}
              disabled={generateRecommendationsMutation.isPending}
              variant="outline"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {generateRecommendationsMutation.isPending ? 'Generating...' : 'Generate New Recommendations'}
            </Button>
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="w-full h-48 bg-gray-200" />
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                    <div className="h-8 bg-gray-200 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {recommendations && recommendations.length > 0 && (
            <div className="space-y-8">
              {recommendations.map((rec, index) => (
                <Card key={rec.propertyId} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                      {/* Property Card */}
                      <div className="lg:col-span-1">
                        {rec.property && <PropertyCard property={rec.property} />}
                      </div>

                      {/* AI Insights */}
                      <div className="lg:col-span-2 p-6 space-y-6">
                        {/* Match Score */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`px-4 py-2 rounded-full ${getMatchScoreColor(rec.matchScore)}`}>
                              <span className="text-2xl font-bold">{rec.matchScore}</span>
                              <span className="text-sm ml-1">% Match</span>
                            </div>
                            <Badge variant="secondary">
                              <Star className="w-3 h-3 mr-1" />
                              {Math.round(rec.confidence * 100)}% Confidence
                            </Badge>
                          </div>
                          <Badge className="bg-grass-100 text-grass-800">
                            #{index + 1} Recommendation
                          </Badge>
                        </div>

                        {/* Personalized Note */}
                        {rec.personalizedNote && (
                          <div className="bg-gradient-to-r from-grass-50 to-blue-50 p-4 rounded-lg">
                            <p className="text-grass-800 font-medium">{rec.personalizedNote}</p>
                          </div>
                        )}

                        {/* Why This Property */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <Heart className="w-4 h-4 mr-2 text-red-500" />
                            Why This Property is Perfect for You
                          </h4>
                          <div className="space-y-2">
                            {rec.reasons.map((reason, idx) => (
                              <div key={idx} className="flex items-start">
                                <div className="w-2 h-2 bg-grass-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{reason}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* AI Insights */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
                            AI Insights
                          </h4>
                          <div className="space-y-3">
                            {rec.insights.map((insight, idx) => (
                              <div key={idx} className="flex items-start space-x-3">
                                <Badge className={getImportanceColor(insight.importance)}>
                                  {insight.category}
                                </Badge>
                                <span className="text-sm text-gray-700 flex-1">{insight.insight}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Financial & Market Analysis */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Financial Fit */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                              <DollarSign className="w-4 h-4 mr-2" />
                              Financial Fit
                            </h5>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Affordability</span>
                                <Progress value={rec.financialFit.affordabilityScore} className="w-20" />
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Payment Comfort</span>
                                <span className={`text-sm font-medium capitalize ${getComfortColor(rec.financialFit.paymentComfort)}`}>
                                  {rec.financialFit.paymentComfort}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Investment Potential</span>
                                <Progress value={rec.financialFit.investmentPotential} className="w-20" />
                              </div>
                            </div>
                          </div>

                          {/* Market Analysis */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                              <TrendingUp className="w-4 h-4 mr-2" />
                              Market Analysis
                            </h5>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Market Trend</span>
                                <div className="flex items-center">
                                  {getTrendIcon(rec.marketInsights.marketTrend)}
                                  <span className="text-sm ml-1 capitalize">{rec.marketInsights.marketTrend}</span>
                                </div>
                              </div>
                              <div>
                                <span className="text-sm font-medium">Price Competitiveness:</span>
                                <p className="text-xs text-gray-600 mt-1">{rec.marketInsights.priceCompetitiveness}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium">Investment Outlook:</span>
                                <p className="text-xs text-gray-600 mt-1">{rec.marketInsights.investmentOutlook}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && (!recommendations || recommendations.length === 0) && (
            <Card className="text-center py-12">
              <CardContent>
                <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Yet</h3>
                <p className="text-gray-600 mb-4">Set your preferences and generate personalized property recommendations</p>
                <Button onClick={() => generateRecommendations()} className="bg-grass-600 hover:bg-grass-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Recommendations
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customize Your Preferences</CardTitle>
              <p className="text-sm text-gray-600">Help our AI understand what you're looking for in your perfect property</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="budgetMax">Maximum Budget (KES)</Label>
                  <Input
                    id="budgetMax"
                    type="number"
                    value={preferences.budgetMax || ''}
                    onChange={(e) => setPreferences({...preferences, budgetMax: parseInt(e.target.value) || undefined})}
                  />
                </div>

                <div>
                  <Label htmlFor="bedrooms">Preferred Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={preferences.bedroomPreference || ''}
                    onChange={(e) => setPreferences({...preferences, bedroomPreference: parseInt(e.target.value) || undefined})}
                  />
                </div>
              </div>

              <div>
                <Label>Preferred Locations</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["nairobi", "mombasa", "kisumu", "nakuru", "eldoret"].map(location => (
                    <Button
                      key={location}
                      variant={preferences.preferredLocations.includes(location) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const updated = preferences.preferredLocations.includes(location)
                          ? preferences.preferredLocations.filter(l => l !== location)
                          : [...preferences.preferredLocations, location];
                        setPreferences({...preferences, preferredLocations: updated});
                      }}
                    >
                      {location.charAt(0).toUpperCase() + location.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Property Types</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["apartment", "house", "townhouse", "commercial"].map(type => (
                    <Button
                      key={type}
                      variant={preferences.propertyTypes.includes(type) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const updated = preferences.propertyTypes.includes(type)
                          ? preferences.propertyTypes.filter(t => t !== type)
                          : [...preferences.propertyTypes, type];
                        setPreferences({...preferences, propertyTypes: updated});
                      }}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Investment Goals</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["first-home", "investment", "upgrade", "rental-income"].map(goal => (
                    <Button
                      key={goal}
                      variant={preferences.investmentGoals.includes(goal) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const updated = preferences.investmentGoals.includes(goal)
                          ? preferences.investmentGoals.filter(g => g !== goal)
                          : [...preferences.investmentGoals, goal];
                        setPreferences({...preferences, investmentGoals: updated});
                      }}
                    >
                      {goal.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => generateRecommendations()}
                  className="bg-grass-600 hover:bg-grass-700"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Apply Preferences & Generate Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}