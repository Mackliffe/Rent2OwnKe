import type { Property } from "@shared/schema";
import type { UserPreferences, PropertyRecommendation, SearchIntent } from "@shared/recommendation-schema";

interface MarketData {
  [location: string]: {
    averagePrice: number;
    priceGrowth: number;
    marketActivity: "hot" | "moderate" | "slow";
    daysOnMarket: number;
  };
}

// Mock market data - in production this would come from real estate APIs
const marketData: MarketData = {
  "nairobi": { averagePrice: 13850000, priceGrowth: 10.8, marketActivity: "hot", daysOnMarket: 45 },
  "mombasa": { averagePrice: 9450000, priceGrowth: 11.2, marketActivity: "moderate", daysOnMarket: 52 },
  "kisumu": { averagePrice: 6850000, priceGrowth: 10.5, marketActivity: "moderate", daysOnMarket: 38 },
  "nakuru": { averagePrice: 6350000, priceGrowth: 9.5, marketActivity: "hot", daysOnMarket: 35 },
  "eldoret": { averagePrice: 5750000, priceGrowth: 10.6, marketActivity: "moderate", daysOnMarket: 29 }
};

export class RecommendationEngine {
  
  // Analyze user search intent from natural language
  analyzeSearchIntent(query: string): SearchIntent {
    const lowercaseQuery = query.toLowerCase();
    
    // Intent classification
    let intent: SearchIntent["intent"] = "browse";
    if (lowercaseQuery.includes("compare") || lowercaseQuery.includes("vs")) {
      intent = "comparison";
    } else if (lowercaseQuery.includes("investment") || lowercaseQuery.includes("roi")) {
      intent = "investment_analysis";
    } else if (lowercaseQuery.includes("first time") || lowercaseQuery.includes("beginner")) {
      intent = "first_time_buyer";
    } else if (lowercaseQuery.length > 20) {
      intent = "specific_search";
    }

    // Extract location
    let location: string | undefined;
    const locations = ["nairobi", "mombasa", "kisumu", "nakuru", "eldoret", "thika", "kiambu"];
    for (const loc of locations) {
      if (lowercaseQuery.includes(loc)) {
        location = loc;
        break;
      }
    }

    // Extract property type
    let propertyType: string | undefined;
    if (lowercaseQuery.includes("apartment")) propertyType = "apartment";
    else if (lowercaseQuery.includes("house")) propertyType = "house";
    else if (lowercaseQuery.includes("townhouse")) propertyType = "townhouse";
    else if (lowercaseQuery.includes("commercial")) propertyType = "commercial";

    // Extract budget
    const budgetMatch = lowercaseQuery.match(/(\d+)(?:\s*(?:million|m|k))?/g);
    let budget: { min?: number; max?: number } | undefined;
    if (budgetMatch) {
      const amounts = budgetMatch.map(match => {
        let num = parseFloat(match.replace(/[^\d.]/g, ''));
        if (match.includes('m') || match.includes('million')) num *= 1000000;
        else if (match.includes('k')) num *= 1000;
        else if (num < 100) num *= 1000000; // Assume millions if small number
        return num;
      });
      
      if (amounts.length === 1) {
        budget = { max: amounts[0] };
      } else if (amounts.length >= 2) {
        budget = { min: Math.min(...amounts), max: Math.max(...amounts) };
      }
    }

    // Extract bedrooms
    const bedroomMatch = lowercaseQuery.match(/(\d+)\s*(?:bed|br|bedroom)/);
    const bedrooms = bedroomMatch ? parseInt(bedroomMatch[1]) : undefined;

    // Extract features
    const features: string[] = [];
    const featureKeywords = {
      "parking": ["parking", "garage"],
      "garden": ["garden", "yard"],
      "security": ["security", "gated"],
      "modern": ["modern", "contemporary"],
      "furnished": ["furnished", "equipped"],
      "pool": ["pool", "swimming"],
      "gym": ["gym", "fitness"],
      "shopping": ["shopping", "mall", "market"]
    };

    for (const [feature, keywords] of Object.entries(featureKeywords)) {
      if (keywords.some(keyword => lowercaseQuery.includes(keyword))) {
        features.push(feature);
      }
    }

    // Determine urgency
    let urgency: SearchIntent["urgency"] = "exploring";
    if (lowercaseQuery.includes("urgent") || lowercaseQuery.includes("asap")) {
      urgency = "immediate";
    } else if (lowercaseQuery.includes("soon") || lowercaseQuery.includes("month")) {
      urgency = "within_month";
    } else if (lowercaseQuery.includes("quarter") || lowercaseQuery.includes("3 months")) {
      urgency = "within_quarter";
    }

    return {
      query,
      intent,
      extractedFilters: {
        location,
        propertyType,
        budget,
        bedrooms,
        features
      },
      urgency,
      confidence: 0.8 // Simple confidence score
    };
  }

  // Generate property recommendations based on user preferences
  generateRecommendations(
    properties: Property[],
    userPreferences: UserPreferences,
    userIncome?: number
  ): PropertyRecommendation[] {
    
    return properties.map(property => {
      const matchScore = this.calculateMatchScore(property, userPreferences);
      const financialFit = this.assessFinancialFit(property, userIncome);
      const marketInsights = this.generateMarketInsights(property);
      const reasons = this.generateReasons(property, userPreferences, matchScore);
      const insights = this.generateInsights(property, userPreferences, financialFit);
      const personalizedNote = this.generatePersonalizedNote(property, userPreferences);

      return {
        propertyId: property.id,
        userId: userPreferences.userId,
        matchScore,
        confidence: this.calculateConfidence(matchScore, userPreferences),
        reasons,
        insights,
        financialFit,
        marketInsights,
        personalizedNote,
        generatedAt: new Date()
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }

  private calculateMatchScore(property: Property, preferences: UserPreferences): number {
    let score = 0;
    let maxScore = 0;

    // Location preference (25%)
    maxScore += 25;
    if (preferences.preferredLocations.length > 0) {
      if (preferences.preferredLocations.includes(property.location.toLowerCase())) {
        score += 25;
      }
    } else {
      score += 15; // Neutral if no preference
    }

    // Property type preference (20%)
    maxScore += 20;
    if (preferences.propertyTypes.length > 0) {
      if (preferences.propertyTypes.includes(property.type.toLowerCase())) {
        score += 20;
      }
    } else {
      score += 12; // Neutral if no preference
    }

    // Budget fit (30%)
    maxScore += 30;
    if (preferences.budgetMin || preferences.budgetMax) {
      const withinBudget = 
        (!preferences.budgetMin || property.price >= preferences.budgetMin) &&
        (!preferences.budgetMax || property.price <= preferences.budgetMax);
      
      if (withinBudget) {
        score += 30;
      } else {
        // Partial score based on how close it is
        const avgBudget = ((preferences.budgetMin || 0) + (preferences.budgetMax || property.price)) / 2;
        const priceDiff = Math.abs(property.price - avgBudget) / avgBudget;
        score += Math.max(0, 30 - (priceDiff * 30));
      }
    } else {
      score += 20; // Neutral if no budget preference
    }

    // Bedroom preference (15%)
    maxScore += 15;
    if (preferences.bedroomPreference) {
      const bedroomDiff = Math.abs(property.bedrooms - preferences.bedroomPreference);
      score += Math.max(0, 15 - (bedroomDiff * 5));
    } else {
      score += 10; // Neutral if no preference
    }

    // Previous interactions (10%)
    maxScore += 10;
    if (preferences.viewedProperties.includes(property.id)) {
      score += 5; // Previously viewed
    }
    if (preferences.savedProperties.includes(property.id)) {
      score += 10; // Previously saved
    }

    return Math.min(100, (score / maxScore) * 100);
  }

  private assessFinancialFit(property: Property, userIncome?: number): PropertyRecommendation["financialFit"] {
    if (!userIncome) {
      return {
        affordabilityScore: 50,
        paymentComfort: "stretch",
        investmentPotential: 70
      };
    }

    // Calculate monthly payment (20% down, 15-year term, 12.5% interest)
    const downPayment = property.price * 0.2;
    const loanAmount = property.price - downPayment;
    const monthlyRate = 0.125 / 12;
    const months = 15 * 12;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);

    // Affordability assessment
    const monthlyIncome = userIncome;
    const paymentToIncomeRatio = monthlyPayment / monthlyIncome;
    
    let affordabilityScore: number;
    let paymentComfort: "comfortable" | "stretch" | "tight";

    if (paymentToIncomeRatio <= 0.25) {
      affordabilityScore = 90;
      paymentComfort = "comfortable";
    } else if (paymentToIncomeRatio <= 0.35) {
      affordabilityScore = 70;
      paymentComfort = "comfortable";
    } else if (paymentToIncomeRatio <= 0.45) {
      affordabilityScore = 50;
      paymentComfort = "stretch";
    } else {
      affordabilityScore = 30;
      paymentComfort = "tight";
    }

    // Investment potential based on location and market data
    const locationData = marketData[property.location.toLowerCase()];
    const investmentPotential = locationData ? 
      Math.min(100, 50 + (locationData.priceGrowth * 3)) : 60;

    return {
      affordabilityScore,
      paymentComfort,
      investmentPotential
    };
  }

  private generateMarketInsights(property: Property): PropertyRecommendation["marketInsights"] {
    const locationData = marketData[property.location.toLowerCase()];
    
    if (!locationData) {
      return {
        priceCompetitiveness: "Market data not available",
        marketTrend: "stable",
        investmentOutlook: "Standard investment potential"
      };
    }

    // Price competitiveness
    const priceDiff = ((property.price - locationData.averagePrice) / locationData.averagePrice) * 100;
    let priceCompetitiveness: string;
    if (priceDiff < -10) {
      priceCompetitiveness = "Excellent value - priced below market average";
    } else if (priceDiff < 0) {
      priceCompetitiveness = "Good value - competitively priced";
    } else if (priceDiff < 10) {
      priceCompetitiveness = "Market rate - fairly priced";
    } else {
      priceCompetitiveness = "Premium pricing - above market average";
    }

    // Market trend
    let marketTrend: "rising" | "stable" | "declining";
    if (locationData.priceGrowth > 8) {
      marketTrend = "rising";
    } else if (locationData.priceGrowth > 3) {
      marketTrend = "stable";
    } else {
      marketTrend = "declining";
    }

    // Investment outlook
    let investmentOutlook: string;
    if (locationData.priceGrowth > 10 && locationData.marketActivity === "hot") {
      investmentOutlook = "Strong growth potential with high market activity";
    } else if (locationData.priceGrowth > 8) {
      investmentOutlook = "Good investment potential with steady growth";
    } else if (locationData.priceGrowth > 5) {
      investmentOutlook = "Moderate investment potential";
    } else {
      investmentOutlook = "Conservative investment with stable returns";
    }

    return {
      priceCompetitiveness,
      marketTrend,
      investmentOutlook
    };
  }

  private generateReasons(
    property: Property, 
    preferences: UserPreferences, 
    matchScore: number
  ): string[] {
    const reasons: string[] = [];

    // Location match
    if (preferences.preferredLocations.includes(property.location.toLowerCase())) {
      reasons.push(`Located in your preferred area: ${property.location}`);
    }

    // Property type match
    if (preferences.propertyTypes.includes(property.type.toLowerCase())) {
      reasons.push(`Matches your preferred property type: ${property.type}`);
    }

    // Budget fit
    if (preferences.budgetMax && property.price <= preferences.budgetMax) {
      reasons.push("Within your specified budget range");
    }

    // Bedroom match
    if (preferences.bedroomPreference === property.bedrooms) {
      reasons.push(`Perfect bedroom count: ${property.bedrooms} bedrooms`);
    }

    // High match score
    if (matchScore > 80) {
      reasons.push("Exceptional match for your preferences");
    } else if (matchScore > 60) {
      reasons.push("Good match for your requirements");
    }

    // Market factors
    const locationData = marketData[property.location.toLowerCase()];
    if (locationData?.priceGrowth > 10) {
      reasons.push("Strong investment potential with high price growth");
    }

    // Previous interest
    if (preferences.viewedProperties.includes(property.id)) {
      reasons.push("You previously viewed this property");
    }

    return reasons.slice(0, 5); // Limit to top 5 reasons
  }

  private generateInsights(
    property: Property,
    preferences: UserPreferences,
    financialFit: PropertyRecommendation["financialFit"]
  ): PropertyRecommendation["insights"] {
    const insights: PropertyRecommendation["insights"] = [];

    // Financial insights
    if (financialFit.paymentComfort === "comfortable") {
      insights.push({
        category: "Financial",
        insight: "Monthly payments would be very manageable based on typical income ratios",
        importance: "high"
      });
    } else if (financialFit.paymentComfort === "stretch") {
      insights.push({
        category: "Financial",
        insight: "Consider saving for a larger down payment to reduce monthly obligations",
        importance: "medium"
      });
    }

    // Investment insights
    if (financialFit.investmentPotential > 80) {
      insights.push({
        category: "Investment",
        insight: "Excellent long-term appreciation potential in this growing market",
        importance: "high"
      });
    }

    // Lifestyle insights
    if (preferences.lifestyleFactors.includes("family-friendly") && property.bedrooms >= 3) {
      insights.push({
        category: "Lifestyle",
        insight: "Spacious layout ideal for family living with room for growth",
        importance: "medium"
      });
    }

    // Market timing insights
    const locationData = marketData[property.location.toLowerCase()];
    if (locationData?.marketActivity === "hot") {
      insights.push({
        category: "Market",
        insight: "High demand area - consider moving quickly on this opportunity",
        importance: "high"
      });
    }

    return insights;
  }

  private generatePersonalizedNote(
    property: Property,
    preferences: UserPreferences
  ): string {
    const locationData = marketData[property.location.toLowerCase()];
    
    let note = `This ${property.type.toLowerCase()} in ${property.location}`;
    
    // Add specific appeal based on preferences
    if (preferences.investmentGoals.includes("first-home")) {
      note += " could be an excellent first home choice";
    } else if (preferences.investmentGoals.includes("investment")) {
      note += " offers strong investment potential";
    } else {
      note += " aligns well with your search criteria";
    }

    // Add market context
    if (locationData?.priceGrowth > 10) {
      note += ". The area is experiencing strong growth, making it a smart long-term investment.";
    } else if (locationData?.marketActivity === "hot") {
      note += ". High demand in this area means properties move quickly.";
    } else {
      note += ". The stable market provides good value for your investment.";
    }

    return note;
  }

  private calculateConfidence(matchScore: number, preferences: UserPreferences): number {
    let confidence = 0.5; // Base confidence
    
    // Higher confidence with more complete preferences
    const preferenceCompleteness = [
      preferences.preferredLocations.length > 0,
      preferences.propertyTypes.length > 0,
      preferences.budgetMax !== undefined,
      preferences.bedroomPreference !== undefined,
      preferences.lifestyleFactors.length > 0
    ].filter(Boolean).length / 5;
    
    confidence += preferenceCompleteness * 0.3;
    
    // Higher confidence with higher match scores
    confidence += (matchScore / 100) * 0.2;
    
    return Math.min(1, confidence);
  }
}

export const recommendationEngine = new RecommendationEngine();