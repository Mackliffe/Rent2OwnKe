import Navigation from "@/components/navigation";
import MarketTrends from "@/components/market-trends";

export default function MarketTrendsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="py-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <MarketTrends />
        </div>
      </div>
    </div>
  );
}