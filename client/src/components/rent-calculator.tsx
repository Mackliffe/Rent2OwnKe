import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calculator, Info, CheckCircle } from "lucide-react";
import { formatKES } from "@/lib/currency";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import type { CalculatorParams, CalculatorResult } from "@shared/schema";

interface RentCalculatorProps {
  initialValue?: number;
  className?: string;
  propertyId?: string;
}

export default function RentCalculator({ initialValue = 8500000, className = "", propertyId }: RentCalculatorProps) {
  const { isAuthenticated } = useAuth();
  const [params, setParams] = useState<CalculatorParams>({
    propertyValue: initialValue,
    downPaymentPercent: 10,
    ownershipPeriod: 15,
    interestRate: 12.5,
  });

  const [result, setResult] = useState<CalculatorResult | null>(null);

  // Check if user has already applied for this property
  const { data: applicationStatus } = useQuery({
    queryKey: [`/api/applications/check/${propertyId}`],
    enabled: !!propertyId && isAuthenticated,
    retry: false,
  });

  const calculateMutation = useMutation({
    mutationFn: async (calculatorParams: CalculatorParams) => {
      const response = await apiRequest("POST", "/api/calculate", calculatorParams);
      return response.json() as Promise<CalculatorResult>;
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const handleCalculate = () => {
    calculateMutation.mutate(params);
  };

  // Auto-calculate on parameter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      handleCalculate();
    }, 500);

    return () => clearTimeout(timer);
  }, [params]);

  // Initial calculation
  useEffect(() => {
    handleCalculate();
  }, []);

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Rent-to-Own Calculator</h2>
        <p className="text-lg text-gray-600">Calculate your path to homeownership with our Kenya-specific calculator</p>
      </div>
      
      <Card className="bg-white shadow-lg">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calculator Inputs */}
            <div className="space-y-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl">Property Information</CardTitle>
              </CardHeader>
              
              <div className="space-y-2">
                <Label htmlFor="propertyValue">Property Value (KES)</Label>
                <Input
                  id="propertyValue"
                  type="number"
                  value={params.propertyValue}
                  onChange={(e) => setParams({...params, propertyValue: parseInt(e.target.value) || 0})}
                  placeholder="Enter property value"
                />
              </div>
              
              <div className="space-y-4">
                <Label>Down Payment: {params.downPaymentPercent}%</Label>
                <Slider
                  value={[params.downPaymentPercent]}
                  onValueChange={(value) => setParams({...params, downPaymentPercent: value[0]})}
                  min={5}
                  max={30}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>5%</span>
                  <span>30%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Ownership Period (Years)</Label>
                <Select 
                  value={params.ownershipPeriod.toString()} 
                  onValueChange={(value) => setParams({...params, ownershipPeriod: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 years</SelectItem>
                    <SelectItem value="10">10 years</SelectItem>
                    <SelectItem value="15">15 years</SelectItem>
                    <SelectItem value="20">20 years</SelectItem>
                    <SelectItem value="25">25 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  value={params.interestRate}
                  onChange={(e) => setParams({...params, interestRate: parseFloat(e.target.value) || 0})}
                  placeholder="Annual interest rate"
                />
              </div>
              
              <Button 
                onClick={handleCalculate} 
                className="w-full grass-500 hover:bg-grass-600"
                disabled={calculateMutation.isPending}
              >
                <Calculator className="mr-2 h-4 w-4" />
                {calculateMutation.isPending ? 'Calculating...' : 'Calculate Payment Plan'}
              </Button>
            </div>
            
            {/* Results Display */}
            <div className="space-y-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl">Payment Breakdown</CardTitle>
              </CardHeader>
              
              {result && (
                <div className="space-y-4">
                  <Card className="bg-gray-50">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Down Payment</span>
                        <span className="text-lg font-semibold text-grass-600">
                          {formatKES(result.downPayment)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Monthly Payment</span>
                        <span className="text-lg font-semibold text-grass-600">
                          {formatKES(result.monthlyPayment)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Interest</span>
                        <span className="text-lg font-semibold">
                          {formatKES(result.totalInterest)}
                        </span>
                      </div>
                      <hr className="my-3" />
                      <div className="flex justify-between items-center">
                        <span className="text-gray-900 font-medium">Total Amount Payable</span>
                        <span className="text-xl font-bold text-gray-900">
                          {formatKES(result.totalAmount)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Payment Schedule */}
                  <Card className="grass-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Payment Schedule</h4>
                      <div className="space-y-2 text-sm">
                        {result.paymentSchedule.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{item.description}</span>
                            <span className="font-medium">{formatKES(item.monthlyPayment)}/month</span>
                          </div>
                        ))}
                      </div>
                      <Card className="mt-4 bg-white border-grass-200">
                        <CardContent className="p-3">
                          <div className="flex items-center text-grass-700">
                            <Info className="mr-2 h-4 w-4" />
                            <span className="text-sm">
                              You'll own the property after {params.ownershipPeriod} years of consistent payments
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {calculateMutation.isError && (
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-4">
                    <p className="text-red-700 text-sm">
                      Error calculating payments. Please check your inputs and try again.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          {/* Loan Application Button */}
          {result && propertyId && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              {(isAuthenticated && applicationStatus?.hasApplied) ? (
                <div className="text-center">
                  <Button
                    disabled
                    className="w-full bg-gray-400 text-white text-lg py-3 cursor-not-allowed"
                    size="lg"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Application Submitted
                  </Button>
                  <p className="text-sm text-gray-600 mt-2">
                    You have already applied for this property. Check your{" "}
                    <a href="/dashboard" className="text-green-600 hover:underline">
                      dashboard
                    </a>{" "}
                    for status updates.
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <Button
                    onClick={() => window.location.href = `/loan-application/${propertyId}`}
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3"
                    size="lg"
                  >
                    Apply for Rent to Own
                  </Button>
                  <p className="text-sm text-gray-600 mt-2">
                    Start your application to get pre-approved for this property
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
