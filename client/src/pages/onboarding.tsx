import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { OnboardingAnimations } from "@/components/onboarding/OnboardingAnimations";
import { PropertyJourneyAnimation } from "@/components/onboarding/PropertyJourneyAnimation";
import { ArrowRight, Play, Pause } from "lucide-react";

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const [currentView, setCurrentView] = useState<'intro' | 'journey' | 'complete'>('intro');
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const handleIntroComplete = () => {
    setCurrentView('journey');
  };

  const handleJourneyComplete = () => {
    setCurrentView('complete');
  };

  const handleFinalComplete = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    setLocation('/');
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingSkipped', 'true');
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-grass-50 to-green-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-grass-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R2O</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Rent2Own Kenya</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="text-gray-600 hover:text-grass-600"
              >
                {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isAutoPlay ? 'Pause' : 'Play'}
              </Button>
              <Button
                variant="ghost" 
                onClick={handleSkip}
                className="text-gray-600 hover:text-grass-600"
              >
                Skip Tour
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        {currentView === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-6xl mx-auto"
          >
            <OnboardingAnimations 
              onComplete={handleIntroComplete}
              autoPlay={isAutoPlay}
            />
          </motion.div>
        )}

        {currentView === 'journey' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-8">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold text-gray-900 mb-4"
              >
                Your Property Investment Journey
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-600 max-w-2xl mx-auto"
              >
                Discover how easy it is to own your dream home through our rent-to-own program
              </motion.p>
            </div>

            <PropertyJourneyAnimation 
              interactive={true}
              showProgress={true}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center mt-12"
            >
              <Button
                onClick={handleJourneyComplete}
                className="bg-grass-600 hover:bg-grass-700 text-white px-8 py-3 text-lg"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        )}

        {currentView === 'complete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center px-6"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-24 h-24 bg-grass-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                🏠
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Welcome to Your Homeownership Journey!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-600 mb-8"
            >
              You're all set to start exploring properties and building your path to homeownership.
              Let's find your perfect rent-to-own property in Kenya.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <Button
                onClick={handleFinalComplete}
                className="w-full bg-grass-600 hover:bg-grass-700 text-white py-3 text-lg"
              >
                Start Browsing Properties
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setLocation('/calculator')}
                  className="flex-1 border-grass-300 text-grass-600 hover:bg-grass-50"
                >
                  Try Calculator
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLocation('/recommendations')}
                  className="flex-1 border-grass-300 text-grass-600 hover:bg-grass-50"
                >
                  Get AI Recommendations
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}