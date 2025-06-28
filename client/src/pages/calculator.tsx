import Navigation from "@/components/navigation";
import RentCalculator from "@/components/rent-calculator";

export default function Calculator() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="py-16">
        <RentCalculator className="px-4 sm:px-6 lg:px-8" />
      </div>
    </div>
  );
}
