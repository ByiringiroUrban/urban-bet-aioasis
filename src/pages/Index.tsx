
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
        console.log("Initializing database connection...");
        setIsLoading(true);
        const success = await initializeDatabase();
        console.log(`Database initialization ${success ? 'successful' : 'failed'}`);
        
        if (success) {
          setDbInitialized(true);
          toast({
            title: "Using Data",
            description: "Successfully initialized with mock data for browser environment",
          });
        } else {
          toast({
            title: "Data Initialization",
            description: "Using mock data - could not initialize database",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error initializing database:", error);
        toast({
          title: "Database Error",
          description: "There was a problem initializing data. Using mock data instead.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    initDB();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
