import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import WaterTracker from "./pages/WaterTracker";
import CalorieTracker from "./pages/CalorieTracker";
import FitnessTracker from "./pages/FitnessTracker";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { BottomNav } from "./components/BottomNav";
import { SplashScreen } from "./components/SplashScreen";

const queryClient = new QueryClient();

const STORAGE_KEY = "vitaltrack_user";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSignIn = (name: string) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, signedInAt: new Date().toISOString() }));
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Auth onSignIn={handleSignIn} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-center" richColors />
          {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
          <HashRouter>
            <div className="h-full w-full flex flex-col bg-background overflow-hidden">
              <main className="flex-1 overflow-y-auto overflow-x-hidden">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/water" element={<WaterTracker />} />
                  <Route path="/calories" element={<CalorieTracker />} />
                  <Route path="/fitness" element={<FitnessTracker />} />
                  <Route path="/profile" element={<Profile onSignOut={handleSignOut} />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <BottomNav />
            </div>
          </HashRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
