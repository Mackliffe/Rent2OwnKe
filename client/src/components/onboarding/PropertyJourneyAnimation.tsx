import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Search,
  Heart,
  Calculator,
  FileText,
  CheckCircle,
  Key,
  TrendingUp,
  Home,
  Clock,
  DollarSign,
  MapPin,
  Star
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface JourneyStage {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  duration: string;
  description: string;
  features: string[];
}

const journeyStages: JourneyStage[] = [
  {
    id: "search",
    title: "Discover Your Dream Home",
    subtitle: "Explore properties tailored to you",
    icon: Search,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    duration: "Week 1-2",
    description: "Browse our curated selection of rent-to-own properties across Kenya's major cities",
    features: ["AI-powered recommendations", "Virtual property tours", "Neighborhood insights", "Price comparisons"]
  },
  {
    id: "favorite",
    title: "Save Your Favorites",
    subtitle: "Build your shortlist",
    icon: Heart,
    color: "text-red-600",
    bgColor: "bg-red-100",
    duration: "Week 2-3",
    description: "Save properties you love and get notifications about similar listings",
    features: ["Wishlist management", "Price alerts", "Market updates", "Comparison tools"]
  },
  {
    id: "calculate",
    title: "Plan Your Finances",
    subtitle: "Understand your investment",
    icon: Calculator,
    color: "text-green-600",
    bgColor: "bg-green-100",
    duration: "Week 3-4",
    description: "Use our smart calculator to plan your rent-to-own journey and understand costs",
    features: ["Monthly payment calculator", "Equity building tracker", "ROI projections", "Affordability assessment"]
  },
  {
    id: "apply",
    title: "Submit Application",
    subtitle: "Secure your property",
    icon: FileText,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    duration: "Week 4-5",
    description: "Complete our streamlined KYC process with guided support every step of the way",
    features: ["Digital document upload", "Identity verification", "Income verification", "Credit assessment"]
  },
  {
    id: "approve",
    title: "Get Approved",
    subtitle: "Quick decision process",
    icon: CheckCircle,
    color: "text-grass-600",
    bgColor: "bg-grass-100",
    duration: "Week 5-6",
    description: "Our team reviews your application and provides a decision within 48 hours",
    features: ["Fast approval process", "Transparent criteria", "Personal advisor", "Flexible terms"]
  },
  {
    id: "move",
    title: "Move In & Start Building",
    subtitle: "Begin your ownership journey",
    icon: Key,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    duration: "Month 2+",
    description: "Move into your future home and start building equity with every monthly payment",
    features: ["Immediate occupancy", "Equity building", "Property maintenance", "Path to ownership"]
  }
];

interface PropertyJourneyAnimationProps {
  currentStage?: number;
  interactive?: boolean;
  showProgress?: boolean;
}

export function PropertyJourneyAnimation({ 
  currentStage = 0, 
  interactive = true,
  showProgress = true 
}: PropertyJourneyAnimationProps) {
  const [activeStage, setActiveStage] = useState(currentStage);
  const [animationDirection, setAnimationDirection] = useState<'forward' | 'backward'>('forward');
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  useEffect(() => {
    if (isAutoPlaying) {
      const timer = setInterval(() => {
        setActiveStage((prev) => {
          if (prev < journeyStages.length - 1) {
            setAnimationDirection('forward');
            return prev + 1;
          } else {
            setAnimationDirection('backward');
            return 0;
          }
        });
      }, 4000);

      return () => clearInterval(timer);
    }
  }, [isAutoPlaying]);

  const handleStageClick = (index: number) => {
    if (interactive) {
      setAnimationDirection(index > activeStage ? 'forward' : 'backward');
      setActiveStage(index);
    }
  };

  const currentStageData = journeyStages[activeStage];
  const IconComponent = currentStageData.icon;

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Progress Timeline */}
      {showProgress && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full">
              <motion.div
                animate={{ width: `${((activeStage + 1) / journeyStages.length) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-grass-500 rounded-full"
              />
            </div>

            {/* Stage Indicators */}
            <div className="relative flex justify-between">
              {journeyStages.map((stage, index) => {
                const StageIcon = stage.icon;
                const isActive = index === activeStage;
                const isCompleted = index < activeStage;

                return (
                  <motion.div
                    key={stage.id}
                    whileHover={interactive ? { scale: 1.1 } : {}}
                    whileTap={interactive ? { scale: 0.95 } : {}}
                    onClick={() => handleStageClick(index)}
                    className={`relative flex flex-col items-center cursor-pointer group ${
                      interactive ? 'hover:opacity-80' : ''
                    }`}
                  >
                    <motion.div
                      animate={{
                        backgroundColor: isActive ? stage.color.replace('text-', '#') : 
                                       isCompleted ? '#10b981' : '#e5e7eb',
                        scale: isActive ? 1.2 : 1
                      }}
                      className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <StageIcon className={`w-6 h-6 ${
                        isActive || isCompleted ? 'text-white' : 'text-gray-400'
                      }`} />
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isActive ? 1 : 0.7 }}
                      className="mt-2 text-center"
                    >
                      <div className={`text-xs font-medium ${
                        isActive ? 'text-gray-900' : 'text-gray-600'
                      }`}>
                        {stage.duration}
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage}
          initial={{ 
            opacity: 0, 
            x: animationDirection === 'forward' ? 100 : -100,
            scale: 0.95
          }}
          animate={{ 
            opacity: 1, 
            x: 0,
            scale: 1
          }}
          exit={{ 
            opacity: 0, 
            x: animationDirection === 'forward' ? -100 : 100,
            scale: 0.95
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <Card className="overflow-hidden border-0 shadow-xl">
            <CardContent className="p-0">
              <div className="relative">
                {/* Header Section */}
                <div className={`${currentStageData.bgColor} p-8`}>
                  <div className="flex items-center space-x-6">
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className={`w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg`}
                    >
                      <IconComponent className={`w-10 h-10 ${currentStageData.color}`} />
                    </motion.div>
                    
                    <div className="flex-1">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Badge variant="secondary" className="mb-2">
                          {currentStageData.duration}
                        </Badge>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                          {currentStageData.title}
                        </h2>
                        <p className="text-lg text-gray-700">
                          {currentStageData.subtitle}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg text-gray-600 mb-6 leading-relaxed"
                  >
                    {currentStageData.description}
                  </motion.p>

                  {/* Features Grid */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                  >
                    {currentStageData.features.map((feature, index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className="bg-gray-50 rounded-lg p-4 text-center"
                      >
                        <div className="flex items-center justify-center mb-2">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity, 
                              delay: index * 0.5 
                            }}
                          >
                            <Star className="w-5 h-5 text-grass-500" />
                          </motion.div>
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                          {feature}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      {interactive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center items-center mt-8 space-x-4"
        >
          <button
            onClick={() => handleStageClick(Math.max(0, activeStage - 1))}
            disabled={activeStage === 0}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors"
          >
            Previous
          </button>
          
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              isAutoPlaying 
                ? 'bg-grass-600 text-white hover:bg-grass-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isAutoPlaying ? 'Pause' : 'Auto Play'}
          </button>
          
          <button
            onClick={() => handleStageClick(Math.min(journeyStages.length - 1, activeStage + 1))}
            disabled={activeStage === journeyStages.length - 1}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors"
          >
            Next
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default PropertyJourneyAnimation;