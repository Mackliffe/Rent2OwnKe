import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Calculator, 
  FileText, 
  CreditCard, 
  Home, 
  Key,
  CheckCircle2,
  Clock,
  Star,
  Sparkles,
  Trophy,
  Heart
} from "lucide-react";

interface JourneyStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  status: "completed" | "current" | "upcoming";
  estimatedTime?: string;
  tips?: string[];
}

interface PropertyJourneyProps {
  propertyId?: number;
  currentStep?: string;
  onStepClick?: (stepId: string) => void;
  showAnimations?: boolean;
}

export default function PropertyJourney({ 
  propertyId, 
  currentStep = "browse", 
  onStepClick,
  showAnimations = true 
}: PropertyJourneyProps) {
  const [progress, setProgress] = useState(0);
  const [celebrationVisible, setCelebrationVisible] = useState(false);

  const journeySteps: JourneyStep[] = [
    {
      id: "browse",
      title: "Explore Properties",
      description: "Discover your perfect home",
      icon: Search,
      status: currentStep === "browse" ? "current" : "completed",
      estimatedTime: "1-2 weeks",
      tips: ["Use filters to narrow down options", "Save properties you love", "Compare different locations"]
    },
    {
      id: "calculate",
      title: "Calculate Payments",
      description: "Plan your financial journey",
      icon: Calculator,
      status: getCurrentStepStatus("calculate", currentStep),
      estimatedTime: "30 minutes",
      tips: ["Try different down payment amounts", "Consider loan terms", "Factor in your monthly budget"]
    },
    {
      id: "apply",
      title: "Submit Application",
      description: "Take the first official step",
      icon: FileText,
      status: getCurrentStepStatus("apply", currentStep),
      estimatedTime: "1 hour",
      tips: ["Gather required documents", "Double-check all information", "Submit during business hours"]
    },
    {
      id: "approval",
      title: "Get Approved",
      description: "Receive loan approval",
      icon: CheckCircle2,
      status: getCurrentStepStatus("approval", currentStep),
      estimatedTime: "3-5 days",
      tips: ["Respond quickly to requests", "Provide additional docs if needed", "Stay in touch with your advisor"]
    },
    {
      id: "payment",
      title: "Start Payments",
      description: "Begin your rent-to-own journey",
      icon: CreditCard,
      status: getCurrentStepStatus("payment", currentStep),
      estimatedTime: "1 day",
      tips: ["Set up automatic payments", "Keep payment records", "Plan for ownership timeline"]
    },
    {
      id: "ownership",
      title: "Own Your Home",
      description: "Complete the journey to ownership",
      icon: Key,
      status: getCurrentStepStatus("ownership", currentStep),
      estimatedTime: "5-15 years",
      tips: ["Maintain the property well", "Build equity over time", "Celebrate this achievement!"]
    }
  ];

  function getCurrentStepStatus(stepId: string, current: string): "completed" | "current" | "upcoming" {
    const stepOrder = ["browse", "calculate", "apply", "approval", "payment", "ownership"];
    const currentIndex = stepOrder.indexOf(current);
    const stepIndex = stepOrder.indexOf(stepId);
    
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  }

  useEffect(() => {
    const stepOrder = ["browse", "calculate", "apply", "approval", "payment", "ownership"];
    const currentIndex = stepOrder.indexOf(currentStep);
    const newProgress = ((currentIndex + 1) / stepOrder.length) * 100;
    
    const timer = setTimeout(() => {
      setProgress(newProgress);
    }, 300);

    if (currentStep === "ownership") {
      setCelebrationVisible(true);
      setTimeout(() => setCelebrationVisible(false), 3000);
    }

    return () => clearTimeout(timer);
  }, [currentStep]);

  const getStepColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100 border-green-200";
      case "current":
        return "text-grass-600 bg-grass-100 border-grass-200";
      default:
        return "text-gray-400 bg-gray-50 border-gray-200";
    }
  };

  const getIconColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "current":
        return "text-grass-600";
      default:
        return "text-gray-400";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5 text-grass-600" />
              Your Property Journey
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Track your progress to homeownership
            </p>
          </div>
          <Badge variant="outline" className="bg-grass-50 text-grass-700 border-grass-200">
            {Math.round(progress)}% Complete
          </Badge>
        </div>
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {journeySteps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current";
            const isUpcoming = step.status === "upcoming";

            return (
              <motion.div
                key={step.id}
                initial={showAnimations ? { opacity: 0, x: -20 } : false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-start gap-4 p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-md ${getStepColor(step.status)}`}
                onClick={() => onStepClick?.(step.id)}
              >
                {/* Connection Line */}
                {index < journeySteps.length - 1 && (
                  <div className="absolute left-8 top-16 w-0.5 h-8 bg-gray-200"></div>
                )}

                {/* Step Icon */}
                <div className={`relative flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                  isCompleted ? "bg-green-100 border-green-300" :
                  isCurrent ? "bg-grass-100 border-grass-300" :
                  "bg-gray-50 border-gray-200"
                }`}>
                  {isCompleted && showAnimations ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                    >
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </motion.div>
                  ) : (
                    <Icon className={`w-6 h-6 ${getIconColor(step.status)}`} />
                  )}

                  {/* Current Step Pulse Animation */}
                  {isCurrent && showAnimations && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-grass-400"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-medium ${
                      isCompleted ? "text-green-800" :
                      isCurrent ? "text-grass-800" :
                      "text-gray-500"
                    }`}>
                      {step.title}
                    </h3>
                    {step.estimatedTime && (
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {step.estimatedTime}
                      </Badge>
                    )}
                  </div>
                  
                  <p className={`text-sm mb-3 ${
                    isCompleted ? "text-green-600" :
                    isCurrent ? "text-grass-600" :
                    "text-gray-500"
                  }`}>
                    {step.description}
                  </p>

                  {/* Tips for current step */}
                  {isCurrent && step.tips && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-1"
                    >
                      <p className="text-xs font-medium text-grass-700 mb-2">💡 Helpful Tips:</p>
                      {step.tips.map((tip, tipIndex) => (
                        <motion.div
                          key={tipIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: tipIndex * 0.1 }}
                          className="text-xs text-grass-600 flex items-start gap-1"
                        >
                          <span className="text-grass-400">•</span>
                          {tip}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Success message for completed steps */}
                  {isCompleted && showAnimations && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-1 text-xs text-green-600 font-medium"
                    >
                      <Star className="w-3 h-3" />
                      Completed successfully!
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Celebration Animation */}
        <AnimatePresence>
          {celebrationVisible && currentStep === "ownership" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                className="bg-white rounded-2xl p-8 text-center max-w-md mx-4 relative overflow-hidden"
              >
                {/* Celebration particles */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, y: 0 }}
                    animate={{ 
                      scale: [0, 1, 0],
                      y: [-100, -200],
                      x: [0, (i % 2 ? 50 : -50)]
                    }}
                    transition={{ 
                      duration: 2,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                    className="absolute top-4 left-1/2 w-2 h-2 bg-grass-400 rounded-full"
                  />
                ))}

                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  🎉 Congratulations!
                </h3>
                <p className="text-gray-600 mb-4">
                  You've completed your journey to homeownership!
                </p>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={() => setCelebrationVisible(false)}
                    className="bg-grass-600 hover:bg-grass-700"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Amazing!
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Journey Summary */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {journeySteps.filter(s => s.status === "completed").length} of {journeySteps.length} steps completed
            </span>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-grass-600 hover:text-grass-700 hover:bg-grass-50"
              onClick={() => onStepClick?.(currentStep)}
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Continue Journey
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}