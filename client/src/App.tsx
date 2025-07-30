import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import PropertyDetails from "@/pages/property-details";
import Calculator from "@/pages/calculator";
import RiskCalculatorPage from "@/pages/risk-calculator";
import MarketTrendsPage from "@/pages/market-trends";
import RecommendationsPage from "@/pages/recommendations";
import OnboardingPage from "@/pages/onboarding";
import SignUp from "@/pages/signup";
import SignIn from "@/pages/signin";
import APISettings from "@/pages/api-settings";
import LoanApplication from "@/pages/loan-application";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/property/:id" component={PropertyDetails} />
      <Route path="/calculator" component={Calculator} />
      <Route path="/risk-calculator" component={RiskCalculatorPage} />
      <Route path="/market-trends" component={MarketTrendsPage} />
      <Route path="/recommendations" component={RecommendationsPage} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/signup" component={SignUp} />
      <Route path="/signin" component={SignIn} />
      <Route path="/api-settings" component={APISettings} />
      <Route path="/loan-application/:propertyId" component={LoanApplication} />
      <Route path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
