import { useLocation } from "wouter";
import OnboardingWizard from "@/components/onboarding-wizard";

export default function OnboardingPage() {
  const [, setLocation] = useLocation();

  const handleComplete = (data: any) => {
    // Store onboarding data in localStorage for future use
    localStorage.setItem('onboardingData', JSON.stringify(data));
    localStorage.setItem('onboardingCompleted', 'true');
    
    // Redirect based on user's interests
    if (data.interests.includes('recommendations')) {
      setLocation('/recommendations');
    } else if (data.interests.includes('calculator')) {
      setLocation('/calculator');
    } else if (data.interests.includes('market-trends')) {
      setLocation('/market-trends');
    } else {
      setLocation('/');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingSkipped', 'true');
    setLocation('/');
  };

  return (
    <OnboardingWizard onComplete={handleComplete} onSkip={handleSkip} />
  );
}