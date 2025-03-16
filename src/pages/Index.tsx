
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
import { isAuthenticated } from "@/utils/authUtils";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check auth status when component mounts and set state
    setIsLoggedIn(isAuthenticated());
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        <FeaturesSection />
        <AIInsightsSection aiInsights={aiInsights} />
        <SportsBettingSection upcomingMatches={upcomingMatches} />
        <CasinoGamesSection casinoGames={casinoGames} />
        {!isLoggedIn && <CallToActionSection />}
      </main>
      
      <BettingSlip />
      <Footer />
    </div>
  );
};

export default Index;
