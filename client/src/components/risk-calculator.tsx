import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, TrendingUp, Shield, DollarSign, MapPin, Clock, Users, Building } from "lucide-react";
import { formatKES } from "@/lib/currency";

interface RiskParams {
  propertyValue: number;
  location: string;
  propertyType: string;
  monthlyIncome: number;
  creditScore: number;
  downPaymentPercent: number;
  loanTerm: number;
  hasEmergencyFund: boolean;
  employmentType: string;
  yearsOfEmployment: number;
  marketExposure: number;
}

interface RiskAssessment {
  overallRiskScore: number;
  riskLevel: "Low" | "Moderate" | "High" | "Very High";
  financialRisk: number;
  locationRisk: number;
  marketRisk: number;
  creditRisk: number;
  liquidityRisk: number;
  recommendations: string[];
  strengths: string[];
  warnings: string[];
}

interface RiskCalculatorProps {
  initialValue?: number;
  className?: string;
}

export default function RiskCalculator({ initialValue = 8500000, className = "" }: RiskCalculatorProps) {
  const [params, setParams] = useState<RiskParams>({
    propertyValue: initialValue,
    location: "nairobi",
    propertyType: "apartment",
    monthlyIncome: 150000,
    creditScore: 700,
    downPaymentPercent: 20,
    loanTerm: 20,
    hasEmergencyFund: false,
    employmentType: "permanent",
    yearsOfEmployment: 3,
    marketExposure: 50,
  });

  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);

  const calculateRisk = () => {
    // Financial Risk Calculation (40% weight)
    const debtToIncomeRatio = ((params.propertyValue * 0.8) / params.loanTerm / 12) / params.monthlyIncome;
    const downPaymentRisk = Math.max(0, (25 - params.downPaymentPercent) * 2);
    const incomeStabilityRisk = params.employmentType === "permanent" ? 0 : 
                               params.employmentType === "contract" ? 15 : 25;
    const emergencyFundRisk = params.hasEmergencyFund ? 0 : 20;
    const employmentHistoryRisk = Math.max(0, (5 - params.yearsOfEmployment) * 5);
    
    const financialRisk = Math.min(100, 
      (debtToIncomeRatio * 100) + downPaymentRisk + incomeStabilityRisk + 
      emergencyFundRisk + employmentHistoryRisk
    );

    // Location Risk Calculation (25% weight)
    const locationRiskMap: Record<string, number> = {
      "nairobi": 10,
      "mombasa": 20,
      "kisumu": 30,
      "nakuru": 25,
      "eldoret": 35,
      "thika": 15,
      "kiambu": 12,
      "other": 40
    };
    const locationRisk = locationRiskMap[params.location] || 40;

    // Market Risk Calculation (20% weight)
    const propertyTypeRisk = params.propertyType === "apartment" ? 10 :
                            params.propertyType === "house" ? 15 :
                            params.propertyType === "townhouse" ? 12 : 25;
    const marketExposureRisk = params.marketExposure;
    const marketRisk = (propertyTypeRisk + marketExposureRisk) / 2;

    // Credit Risk Calculation (10% weight)
    const creditRisk = Math.max(0, (750 - params.creditScore) / 5);

    // Liquidity Risk Calculation (5% weight)
    const loanTermRisk = params.loanTerm > 25 ? 30 : params.loanTerm > 20 ? 15 : 5;
    const liquidityRisk = loanTermRisk;

    // Overall Risk Score (weighted average)
    const overallRiskScore = Math.round(
      (financialRisk * 0.4) + 
      (locationRisk * 0.25) + 
      (marketRisk * 0.2) + 
      (creditRisk * 0.1) + 
      (liquidityRisk * 0.05)
    );

    // Risk Level Classification
    const riskLevel: RiskAssessment["riskLevel"] = 
      overallRiskScore <= 25 ? "Low" :
      overallRiskScore <= 50 ? "Moderate" :
      overallRiskScore <= 75 ? "High" : "Very High";

    // Generate recommendations and warnings
    const recommendations: string[] = [];
    const strengths: string[] = [];
    const warnings: string[] = [];

    // Financial recommendations
    if (debtToIncomeRatio > 0.3) {
      warnings.push("Your debt-to-income ratio is high. Consider a lower-priced property or increase your income.");
    } else if (debtToIncomeRatio < 0.2) {
      strengths.push("Excellent debt-to-income ratio provides financial flexibility.");
    }

    if (params.downPaymentPercent < 20) {
      recommendations.push("Consider increasing your down payment to 20% or more to reduce monthly payments and eliminate PMI.");
    } else {
      strengths.push("Good down payment percentage reduces loan risk and monthly payments.");
    }

    if (!params.hasEmergencyFund) {
      warnings.push("Lack of emergency fund increases financial vulnerability. Build 3-6 months of expenses before investing.");
    } else {
      strengths.push("Emergency fund provides important financial security.");
    }

    if (params.employmentType !== "permanent") {
      recommendations.push("Consider securing permanent employment before making a large property investment.");
    }

    // Location recommendations
    if (locationRisk > 30) {
      recommendations.push("Consider investing in more established markets like Nairobi or Mombasa for lower location risk.");
    } else if (locationRisk < 20) {
      strengths.push("Excellent location choice with strong market fundamentals and growth potential.");
    }

    // Credit recommendations
    if (params.creditScore < 650) {
      warnings.push("Low credit score may result in higher interest rates. Work on improving your credit before applying.");
    } else if (params.creditScore > 750) {
      strengths.push("Excellent credit score qualifies you for the best interest rates.");
    }

    // Market recommendations
    if (marketExposureRisk > 70) {
      recommendations.push("High market exposure increases volatility. Consider diversifying your investment portfolio.");
    }

    // General recommendations
    if (overallRiskScore > 50) {
      recommendations.push("Consider working with a financial advisor to optimize your investment strategy.");
    }

    if (params.loanTerm > 25) {
      recommendations.push("Shorter loan terms reduce total interest paid and increase equity building speed.");
    }

    setAssessment({
      overallRiskScore,
      riskLevel,
      financialRisk: Math.round(financialRisk),
      locationRisk: Math.round(locationRisk),
      marketRisk: Math.round(marketRisk),
      creditRisk: Math.round(creditRisk),
      liquidityRisk: Math.round(liquidityRisk),
      recommendations,
      strengths,
      warnings
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      calculateRisk();
    }, 500);
    return () => clearTimeout(timer);
  }, [params]);

  useEffect(() => {
    calculateRisk();
  }, []);

  const getRiskColor = (score: number) => {
    if (score <= 25) return "text-green-600 bg-green-50";
    if (score <= 50) return "text-yellow-600 bg-yellow-50";
    if (score <= 75) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case "Low": return "bg-green-100 text-green-800";
      case "Moderate": return "bg-yellow-100 text-yellow-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Very High": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className={`max-w-7xl mx-auto ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Property Investment Risk Calculator</h2>
        <p className="text-lg text-gray-600">Analyze investment risks for Kenyan real estate properties</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Parameters */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-grass-600" />
                Financial Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="propertyValue">Property Value (KES)</Label>
                <Input
                  id="propertyValue"
                  type="number"
                  value={params.propertyValue}
                  onChange={(e) => setParams({...params, propertyValue: parseInt(e.target.value) || 0})}
                />
              </div>

              <div>
                <Label htmlFor="monthlyIncome">Monthly Income (KES)</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  value={params.monthlyIncome}
                  onChange={(e) => setParams({...params, monthlyIncome: parseInt(e.target.value) || 0})}
                />
              </div>

              <div className="space-y-2">
                <Label>Down Payment: {params.downPaymentPercent}%</Label>
                <Slider
                  value={[params.downPaymentPercent]}
                  onValueChange={(value) => setParams({...params, downPaymentPercent: value[0]})}
                  min={5}
                  max={50}
                  step={5}
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>5%</span>
                  <span>{formatKES(params.propertyValue * (params.downPaymentPercent / 100))}</span>
                  <span>50%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Credit Score: {params.creditScore}</Label>
                <Slider
                  value={[params.creditScore]}
                  onValueChange={(value) => setParams({...params, creditScore: value[0]})}
                  min={300}
                  max={850}
                  step={10}
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>300</span>
                  <span>850</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2 text-grass-600" />
                Property & Employment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Location</Label>
                <Select value={params.location} onValueChange={(value) => setParams({...params, location: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nairobi">Nairobi</SelectItem>
                    <SelectItem value="mombasa">Mombasa</SelectItem>
                    <SelectItem value="kisumu">Kisumu</SelectItem>
                    <SelectItem value="nakuru">Nakuru</SelectItem>
                    <SelectItem value="eldoret">Eldoret</SelectItem>
                    <SelectItem value="thika">Thika</SelectItem>
                    <SelectItem value="kiambu">Kiambu</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Property Type</Label>
                <Select value={params.propertyType} onValueChange={(value) => setParams({...params, propertyType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Employment Type</Label>
                <Select value={params.employmentType} onValueChange={(value) => setParams({...params, employmentType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="permanent">Permanent Employee</SelectItem>
                    <SelectItem value="contract">Contract Employee</SelectItem>
                    <SelectItem value="self-employed">Self-Employed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="yearsOfEmployment">Years of Employment</Label>
                <Input
                  id="yearsOfEmployment"
                  type="number"
                  value={params.yearsOfEmployment}
                  onChange={(e) => setParams({...params, yearsOfEmployment: parseInt(e.target.value) || 0})}
                  min="0"
                  max="50"
                />
              </div>

              <div>
                <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                <Input
                  id="loanTerm"
                  type="number"
                  value={params.loanTerm}
                  onChange={(e) => setParams({...params, loanTerm: parseInt(e.target.value) || 0})}
                  min="5"
                  max="30"
                />
              </div>

              <div className="space-y-2">
                <Label>Market Exposure Risk: {params.marketExposure}%</Label>
                <Slider
                  value={[params.marketExposure]}
                  onValueChange={(value) => setParams({...params, marketExposure: value[0]})}
                  min={0}
                  max={100}
                  step={5}
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Conservative</span>
                  <span>Aggressive</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="emergencyFund"
                  checked={params.hasEmergencyFund}
                  onChange={(e) => setParams({...params, hasEmergencyFund: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="emergencyFund">I have 3-6 months emergency fund</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Assessment Results */}
        <div className="space-y-6">
          {assessment && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-grass-600" />
                      Overall Risk Assessment
                    </span>
                    <Badge className={getRiskBadgeColor(assessment.riskLevel)}>
                      {assessment.riskLevel} Risk
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className={`text-6xl font-bold mb-2 ${getRiskColor(assessment.overallRiskScore).split(' ')[0]}`}>
                      {assessment.overallRiskScore}
                    </div>
                    <div className="text-gray-600">Risk Score (0-100)</div>
                    <Progress 
                      value={assessment.overallRiskScore} 
                      className="mt-4"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Financial Risk
                    </span>
                    <div className="flex items-center">
                      <span className="mr-2">{assessment.financialRisk}%</span>
                      <Progress value={assessment.financialRisk} className="w-20" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Location Risk
                    </span>
                    <div className="flex items-center">
                      <span className="mr-2">{assessment.locationRisk}%</span>
                      <Progress value={assessment.locationRisk} className="w-20" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Market Risk
                    </span>
                    <div className="flex items-center">
                      <span className="mr-2">{assessment.marketRisk}%</span>
                      <Progress value={assessment.marketRisk} className="w-20" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Credit Risk
                    </span>
                    <div className="flex items-center">
                      <span className="mr-2">{assessment.creditRisk}%</span>
                      <Progress value={assessment.creditRisk} className="w-20" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Liquidity Risk
                    </span>
                    <div className="flex items-center">
                      <span className="mr-2">{assessment.liquidityRisk}%</span>
                      <Progress value={assessment.liquidityRisk} className="w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {assessment.strengths.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-700">Investment Strengths</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {assessment.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <Shield className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {assessment.warnings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-700">Risk Warnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {assessment.warnings.map((warning, index) => (
                        <li key={index} className="flex items-start">
                          <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {assessment.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-700">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {assessment.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start">
                          <TrendingUp className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}