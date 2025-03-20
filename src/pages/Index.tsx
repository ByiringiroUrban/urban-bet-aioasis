
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
  
  useEffect(() => {
    // Initialize database connection when the app starts
    const initDB = async () => {
      try {
        console.log("Initializing database connection...");
        const success = await initializeDatabase();
        console.log(`Database initialization ${success ? 'successful' : 'failed'}`);
        
        if (success) {
          setDbInitialized(true);
          toast({
            title: "Connected to Database",
            description: "Successfully connected to MongoDB at localhost:27017",
          });
        } else {
          toast({
            title: "Database Connection",
            description: "Using mock data - could not connect to MongoDB",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error initializing database:", error);
        toast({
          title: "Database Error",
          description: "There was a problem connecting to the database. Using mock data instead.",
          variant: "destructive",
        });
      }
    };
    
    initDB();
  }, [toast]);

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
