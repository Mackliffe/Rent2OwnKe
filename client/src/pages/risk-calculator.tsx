import Navigation from "@/components/navigation";
import RiskCalculator from "@/components/risk-calculator";

export default function RiskCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="py-16">
        <RiskCalculator className="px-4 sm:px-6 lg:px-8" />
      </div>
    </div>
  );
}