import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { X, ArrowRight, ArrowLeft, Info, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TooltipStep {
  id: string;
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: {
    text: string;
    onClick: () => void;
  };
}

interface GuideTooltipProps {
  steps: TooltipStep[];
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
  currentStep?: number;
}

export function GuideTooltip({ 
  steps, 
  isActive, 
  onComplete, 
  onSkip, 
  currentStep = 0 
}: GuideTooltipProps) {
  const [activeStep, setActiveStep] = useState(currentStep);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && steps[activeStep]) {
      const element = document.querySelector(steps[activeStep].target) as HTMLElement;
      setTargetElement(element);
      
      if (element) {
        // Scroll element into view
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center'
        });
        
        // Add highlight class
        element.classList.add('guide-highlight');
        
        // Calculate tooltip position
        updateTooltipPosition(element, steps[activeStep].position);
      }
    }

    return () => {
      // Remove highlight from all elements
      document.querySelectorAll('.guide-highlight').forEach(el => {
        el.classList.remove('guide-highlight');
      });
    };
  }, [activeStep, isActive, steps]);

  const updateTooltipPosition = (element: HTMLElement, position: string) => {
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltipRef.current?.getBoundingClientRect();
    
    if (!tooltipRect) return;

    const margin = 20;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    let x = 0;
    let y = 0;

    switch (position) {
      case 'top':
        x = rect.left + rect.width / 2 - tooltipRect.width / 2;
        y = rect.top - tooltipRect.height - 10;
        break;
      case 'bottom':
        x = rect.left + rect.width / 2 - tooltipRect.width / 2;
        y = rect.bottom + 10;
        break;
      case 'left':
        x = rect.left - tooltipRect.width - 10;
        y = rect.top + rect.height / 2 - tooltipRect.height / 2;
        break;
      case 'right':
        x = rect.right + 10;
        y = rect.top + rect.height / 2 - tooltipRect.height / 2;
        break;
    }

    // Ensure tooltip stays within viewport
    x = Math.max(10, Math.min(x, window.innerWidth - tooltipRect.width - 10));
    y = Math.max(10, Math.min(y, window.innerHeight - tooltipRect.height - 10));

    setTooltipPosition({ x, y });
  };

  const nextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      onComplete();
    }
  };

  const previousStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const currentStepData = steps[activeStep];

  if (!isActive || !currentStepData) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
        onClick={onSkip}
      />

      {/* Spotlight effect for highlighted element */}
      {targetElement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: targetElement.getBoundingClientRect().left - 5,
            top: targetElement.getBoundingClientRect().top - 5,
            width: targetElement.getBoundingClientRect().width + 10,
            height: targetElement.getBoundingClientRect().height + 10,
            border: '3px solid #10b981',
            borderRadius: '8px',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)',
          }}
        />
      )}

      {/* Tooltip */}
      <AnimatePresence>
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed z-[9999] max-w-sm"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
        >
          <Card className="shadow-xl border-0 bg-white"
                style={{ zIndex: 10000 }}>
            <CardContent className="p-0">
              {/* Header */}
              <div className="bg-grass-500 text-white p-4 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Info className="w-5 h-5" />
                    <span className="font-medium">
                      Step {activeStep + 1} of {steps.length}
                    </span>
                  </div>
                  <button
                    onClick={onSkip}
                    className="text-white hover:text-gray-200 transition-colors z-[10001] relative"
                    style={{ zIndex: 10001 }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg font-semibold text-gray-900 mb-3"
                >
                  {currentStepData.title}
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-600 mb-4 leading-relaxed"
                >
                  {currentStepData.content}
                </motion.p>

                {/* Action Button */}
                {currentStepData.action && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-4"
                  >
                    <Button
                      onClick={currentStepData.action.onClick}
                      className="w-full bg-grass-600 hover:bg-grass-700 text-white z-[10001] relative"
                      style={{ zIndex: 10001 }}
                    >
                      {currentStepData.action.text}
                    </Button>
                  </motion.div>
                )}

                {/* Navigation */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-between"
                >
                  <Button
                    variant="ghost"
                    onClick={previousStep}
                    disabled={activeStep === 0}
                    className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 z-[10001] relative"
                    style={{ zIndex: 10001 }}
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex space-x-1">
                    {steps.map((_, index) => (
                      <motion.div
                        key={index}
                        animate={{
                          backgroundColor: index === activeStep ? '#10b981' : '#e5e7eb',
                          scale: index === activeStep ? 1.2 : 1
                        }}
                        className="w-2 h-2 rounded-full"
                      />
                    ))}
                  </div>

                  <Button
                    onClick={nextStep}
                    className="bg-grass-600 hover:bg-grass-700 text-white z-[10001] relative"
                    style={{ zIndex: 10001 }}
                  >
                    {activeStep === steps.length - 1 ? (
                      <>
                        Complete
                        <CheckCircle className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          {/* Arrow pointer */}
          <div 
            className="absolute w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-200"
            style={{
              [currentStepData.position === 'top' ? 'bottom' : 
               currentStepData.position === 'bottom' ? 'top' :
               currentStepData.position === 'left' ? 'right' : 'left']: '-8px',
              [currentStepData.position === 'top' || currentStepData.position === 'bottom' ? 'left' : 'top']: '50%',
              transform: currentStepData.position === 'top' || currentStepData.position === 'bottom' 
                ? 'translateX(-50%) rotate(45deg)' 
                : 'translateY(-50%) rotate(45deg)'
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Custom CSS for highlighting */}
      <style>
        {`
          .guide-highlight {
            position: relative;
            z-index: 9997 !important;
            border-radius: 8px;
            animation: pulse-highlight 2s infinite;
          }
          
          @keyframes pulse-highlight {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
            }
            50% {
              box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
            }
          }
        `}
      </style>
    </>
  );
}

export default GuideTooltip;