import Navigation from "@/components/navigation";
import PropertyRecommendations from "@/components/property-recommendations";

export default function RecommendationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="py-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <PropertyRecommendations />
        </div>
      </div>
    </div>
  );
}