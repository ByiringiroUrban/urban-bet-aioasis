
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BettingSlip from "@/components/BettingSlip";
import Footer from "@/components/Footer";
import FeaturesSection from "@/components/sections/FeaturesSection";
import AIInsightsSection from "@/components/sections/AIInsightsSection";
import SportsBettingSection from "@/components/sections/SportsBettingSection";
import CasinoGamesSection from "@/components/sections/CasinoGamesSection";
import CallToActionSection from "@/components/sections/CallToActionSection";
import { aiInsights, upcomingMatches, casinoGames } from "@/data/homePageData";
import { useAuth } from "@/hooks/useAuth";
import { Match } from "@/types";
import { initializeDatabase } from "@/services/mongoService";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  const [dbInitialized, setDbInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Initialize database connection when the app starts
    const initDB = async () => {
      try {
        console.log("Initializing application data...");
        setIsLoading(true);
        const success = await initializeDatabase();
        
        if (success) {
          setDbInitialized(true);
          console.log("Successfully initialized with mock data for browser environment");
          
          // Show a toast indicating we're using mock data in browser
          toast({
            title: "Urban Bet Ready",
            description: "Using mock data for demonstration purposes",
          });
        } else {
          toast({
            title: "Data Initialization",
            description: "Could not initialize data. Some features may not work correctly.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error initializing data:", error);
        toast({
          title: "Initialization Error",
          description: "There was a problem setting up the application. Please try again.",
          variant: "destructive",
        });
      } finally {
        // Always end loading state, even if there's an error
        setIsLoading(false);
      }
    };
    
    initDB();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bet-dark">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Urban Bet...</h2>
          <p className="text-muted-foreground">Setting up your betting experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        <FeaturesSection />
        <AIInsightsSection aiInsights={aiInsights} />
        <SportsBettingSection upcomingMatches={upcomingMatches as Match[]} />
        <CasinoGamesSection casinoGames={casinoGames} />
        {!isLoggedIn && <CallToActionSection />}
      </main>
      
      <BettingSlip />
      <Footer />
    </div>
  );
};

export default Index;
