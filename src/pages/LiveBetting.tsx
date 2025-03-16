import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, BarChart2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UpcomingMatchCard from "@/components/UpcomingMatchCard";
import { Match } from "@/types";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSport, setActiveSport] = useState("all");
  const [activeMatches, setActiveMatches] = useState<Match[]>(liveMatches);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  
  // Handle expanding only one match at a time
  const handleExpandMarket = (matchId: string | null) => {
    setExpandedMatchId(matchId);
  };
  
  // Filter matches based on search query and active sport
  useEffect(() => {
    let filtered = liveMatches;
    
    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(match => 
        match.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) || 
        match.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.league.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by sport
    if (activeSport !== "all") {
      filtered = filtered.filter(match => {
        if (activeSport === "football") {
          return match.league.includes("League") || match.league.includes("Liga");
        } else if (activeSport === "basketball") {
          return match.league.includes("NBA");
        }
        return false;
      });
    }
    
    setActiveMatches(filtered);
  }, [searchQuery, activeSport]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-bet-dark-accent py-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex justify-center items-center gap-2 mb-2">
              <h1 className="text-4xl font-bold">Live Betting</h1>
              <Badge className="bg-bet-danger animate-pulse">LIVE</Badge>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Experience the thrill of in-play betting with real-time odds and statistics.
            </p>
            
            {/* Search & Filter */}
            <div className="max-w-md mx-auto">
              <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Search live matches..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Tabs 
                defaultValue="all" 
                value={activeSport}
                onValueChange={setActiveSport}
                className="mb-8"
              >
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="all">All Sports</TabsTrigger>
                  <TabsTrigger value="football">Football</TabsTrigger>
                  <TabsTrigger value="basketball">Basketball</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
        
        {/* Live Statistics Banner */}
        <div className="bg-gradient-to-r from-bet-primary/20 to-bet-accent/20 py-6 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-6 text-center">
            <div className="flex items-center gap-2">
              <Clock className="text-bet-primary" size={20} />
              <span>{activeMatches.length} Live Events</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart2 className="text-bet-accent" size={20} />
              <span>Real-time Analytics</span>
            </div>
          </div>
        </div>
        
        {/* Matches Grid */}
        <div className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeMatches.length > 0 ? (
                activeMatches.map((match) => (
                  <UpcomingMatchCard
                    key={match.id}
                    id={match.id}
                    homeTeam={match.homeTeam}
                    awayTeam={match.awayTeam}
                    league={match.league}
                    time={match.time}
                    date={match.date}
                    homeOdds={match.homeOdds}
                    drawOdds={match.drawOdds}
                    awayOdds={match.awayOdds}
                    isLive={match.isLive}
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
