import { useState, useEffect } from "react";

interface DemoUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  loginTime: number;
}

export function useDemoAuth() {
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const demoUserSession = localStorage.getItem("demo_user_session");
    if (demoUserSession) {
      try {
        const userData = JSON.parse(demoUserSession);
        setDemoUser(userData);
      } catch (error) {
        console.error("Invalid demo user session:", error);
        localStorage.removeItem("demo_user_session");
      }
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("demo_user_session");
    setDemoUser(null);
  };

  return {
    demoUser,
    isAuthenticated: !!demoUser,
    isLoading,
    logout,
  };
}