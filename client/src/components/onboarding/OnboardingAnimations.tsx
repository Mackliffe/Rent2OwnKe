import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Home, 
  Calculator, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight, 
  Heart,
  Key,
  FileText,
  DollarSign,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  animation: string;
  color: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: "explore",
    title: "Explore Properties",
    description: "Browse through our curated selection of rent-to-own properties across Kenya",
    icon: Home,
    animation: "bounce",
    color: "bg-blue-500"
  },
  {
    id: "calculate",
    title: "Calculate Payments",
    description: "Use our smart calculator to understand your monthly payments and ownership timeline",
    icon: Calculator,
    animation: "pulse",
    color: "bg-green-500"
  },
  {
    id: "apply",
    title: "Submit Application",
    description: "Complete your KYC application with our guided, secure process",
    icon: FileText,
    animation: "slide",
    color: "bg-purple-500"
  },
  {
    id: "approve",
    title: "Get Approved",
    description: "Our team reviews your application and provides quick approval decisions",
    icon: CheckCircle,
    animation: "scale",
    color: "bg-grass-500"
  },
  {
    id: "move",
    title: "Move In & Build Equity",
    description: "Start living in your future home while building ownership equity every month",
    icon: Key,
    animation: "rotate",
    color: "bg-orange-500"
  }
];

const journeyMilestones = [
  { step: "Property Selection", icon: Heart, progress: 20 },
  { step: "Financial Planning", icon: DollarSign, progress: 40 },
  { step: "Application Review", icon: FileText, progress: 60 },
  { step: "Approval & Move-in", icon: Key, progress: 80 },
  { step: "Path to Ownership", icon: TrendingUp, progress: 100 }
];

interface OnboardingAnimationsProps {
  onComplete?: () => void;
  autoPlay?: boolean;
}

export function OnboardingAnimations({ onComplete, autoPlay = true }: OnboardingAnimationsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMilestones, setShowMilestones] = useState(false);

  useEffect(() => {
    if (autoPlay) {
      const timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < onboardingSteps.length - 1) {
            return prev + 1;
          } else {
            setShowMilestones(true);
            return prev;
          }
        });
      }, 3000);

      return () => clearInterval(timer);
    }
  }, [autoPlay]);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      setShowMilestones(true);
    }
  };

  const getStepAnimation = (animation: string) => {
    const animations = {
      bounce: {
        animate: { y: [0, -10, 0] },
        transition: { duration: 0.6, repeat: Infinity, repeatType: "reverse" as const }
      },
      pulse: {
        animate: { scale: [1, 1.1, 1] },
        transition: { duration: 0.8, repeat: Infinity }
      },
      slide: {
        animate: { x: [0, 10, 0] },
        transition: { duration: 1, repeat: Infinity, repeatType: "reverse" as const }
      },
      scale: {
        animate: { scale: [1, 1.2, 1] },
        transition: { duration: 0.7, repeat: Infinity }
      },
      rotate: {
        animate: { rotate: [0, 360] },
        transition: { duration: 2, repeat: Infinity, ease: "linear" }
      }
    };
    return animations[animation as keyof typeof animations] || animations.bounce;
  };

  if (showMilestones) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mx-auto p-6"
      >
        <div className="text-center mb-8">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            Your Property Investment Journey
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600"
          >
            Track your progress towards homeownership
          </motion.p>
        </div>

        <div className="space-y-4">
          {journeyMilestones.map((milestone, index) => {
            const IconComponent = milestone.icon;
            return (
              <motion.div
                key={milestone.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-12 h-12 bg-grass-100 rounded-full flex items-center justify-center"
                      >
                        <IconComponent className="w-6 h-6 text-grass-600" />
                      </motion.div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{milestone.step}</h3>
                        <div className="mt-2 bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${milestone.progress}%` }}
                            transition={{ delay: index * 0.2 + 0.5, duration: 1 }}
                            className="bg-grass-500 h-2 rounded-full"
                          />
                        </div>
                      </div>
                      
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.2 + 1 }}
                        className="text-sm font-medium text-grass-600"
                      >
                        {milestone.progress}%
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {onComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="text-center mt-8"
          >
            <Button
              onClick={onComplete}
              className="bg-grass-600 hover:bg-grass-700 text-white px-8 py-3"
            >
              Start Your Journey
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-2"
        >
          Welcome to Rent2Own Kenya
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 text-lg"
        >
          Your pathway to homeownership made simple
        </motion.p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                <motion.div
                  {...getStepAnimation(onboardingSteps[currentStep].animation)}
                  className="relative"
                >
                  <div className={`w-24 h-24 ${onboardingSteps[currentStep].color} rounded-full flex items-center justify-center shadow-lg`}>
                    {React.createElement(onboardingSteps[currentStep].icon, {
                      className: "w-12 h-12 text-white"
                    })}
                  </div>
                  
                  {/* Animated ring around icon */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`absolute inset-0 ${onboardingSteps[currentStep].color} rounded-full`}
                  />
                </motion.div>
                
                <div className="flex-1 text-center md:text-left">
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-gray-900 mb-3"
                  >
                    {onboardingSteps[currentStep].title}
                  </motion.h3>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-600 text-lg leading-relaxed"
                  >
                    {onboardingSteps[currentStep].description}
                  </motion.p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Progress indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center items-center mt-8 space-x-2"
      >
        {onboardingSteps.map((_, index) => (
          <motion.div
            key={index}
            animate={{
              scale: index === currentStep ? 1.2 : 1,
              backgroundColor: index <= currentStep ? "#10b981" : "#d1d5db"
            }}
            className="w-3 h-3 rounded-full cursor-pointer"
            onClick={() => setCurrentStep(index)}
          />
        ))}
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex justify-center items-center mt-6 space-x-4"
      >
        {!autoPlay && (
          <Button
            onClick={nextStep}
            disabled={isAnimating}
            className="bg-grass-600 hover:bg-grass-700 text-white px-6 py-2"
          >
            {currentStep < onboardingSteps.length - 1 ? "Next Step" : "View Journey"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
        
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center text-sm text-gray-500"
        >
          <Clock className="w-4 h-4 mr-1" />
          Step {currentStep + 1} of {onboardingSteps.length}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default OnboardingAnimations;