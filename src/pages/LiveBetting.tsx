import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, BarChart2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UpcomingMatchCard from "@/components/UpcomingMatchCard";
import { Match } from "@/types";
import LiveBettingHeader from "@/components/live-betting/LiveBettingHeader";
import LiveBettingStats from "@/components/live-betting/LiveBettingStats";
import { useLiveBetting } from "@/hooks/useLiveBetting";

// Mock data for live matches
const liveMatches: Match[] = [
  {
    id: "live1",
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    league: "Premier League",
    country: "England",
    time: "62'",
    date: "Live",
    homeOdds: 2.10,
    drawOdds: 3.40,
    awayOdds: 3.75,
    isLive: true
  },
  {
    id: "live2",
    homeTeam: "Lakers",
    awayTeam: "Celtics",
    league: "NBA",
    country: "USA",
    time: "Q3 8:42",
    date: "Live",
    homeOdds: 1.85,
    awayOdds: 2.05,
    isLive: true
  },
  {
    id: "live3",
    homeTeam: "PSG",
    awayTeam: "Lyon",
    league: "Ligue 1",
    country: "France",
    time: "34'",
    date: "Live",
    homeOdds: 1.55,
    drawOdds: 4.20,
    awayOdds: 6.00,
    isLive: true
  },
  {
    id: "live4",
    homeTeam: "Real Madrid",
    awayTeam: "Atletico Madrid",
    league: "La Liga",
    country: "Spain",
    time: "77'",
    date: "Live",
    homeOdds: 1.30,
    drawOdds: 5.50,
    awayOdds: 9.00,
    isLive: true
  },
  {
    id: "live5",
    homeTeam: "Bucks",
    awayTeam: "76ers",
    league: "NBA",
    country: "USA",
    time: "Q4 2:18",
    date: "Live",
    homeOdds: 2.30,
    awayOdds: 1.65,
    isLive: true
  },
  {
    id: "live6",
    homeTeam: "Bayern Munich",
    awayTeam: "Leverkusen",
    league: "Bundesliga",
    country: "Germany",
    time: "56'",
    date: "Live",
    homeOdds: 1.90,
    drawOdds: 3.70,
    awayOdds: 4.10,
    isLive: true
  }
];

export default function LiveBetting() {
  const {
    searchQuery,
    setSearchQuery,
    activeSport,
    setActiveSport,
    activeMatches,
    expandedMatchId,
    handleExpandMarket
  } = useLiveBetting(liveMatches);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <LiveBettingHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeSport={activeSport}
          onSportChange={setActiveSport}
        />
        
        <LiveBettingStats activeMatchesCount={activeMatches.length} />
        
        <div className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeMatches.length > 0 ? (
                activeMatches.map((match) => (
                  <UpcomingMatchCard
                    key={match.id}
                    match={match}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No live matches found matching your criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
