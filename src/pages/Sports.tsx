
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, FilterIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UpcomingMatchCard from "@/components/UpcomingMatchCard";
import { useParams, useNavigate } from "react-router-dom";

// Define TypeScript interfaces for our data structure
interface BaseMatch {
  homeTeam: string;
  awayTeam: string;
  league: string;
  time: string;
  date: string;
  homeOdds: number;
  awayOdds: number;
  isLive?: boolean;
}

// For sports that have draws (like football)
interface MatchWithDraw extends BaseMatch {
  drawOdds: number;
}

// Type guard to check if a match has drawOdds
function hasDrawOdds(match: BaseMatch): match is MatchWithDraw {
  return 'drawOdds' in match;
}

// Mock data for sports matches
const sportsData: Record<string, (BaseMatch | MatchWithDraw)[]> = {
  football: [
    {
      homeTeam: "Arsenal",
      awayTeam: "Chelsea",
      league: "Premier League",
      time: "20:00",
      date: "Today",
      homeOdds: 2.10,
      drawOdds: 3.40,
      awayOdds: 3.75,
      isLive: true
    },
    {
      homeTeam: "Barcelona",
      awayTeam: "Real Madrid",
      league: "La Liga",
      time: "21:00",
      date: "Tomorrow",
      homeOdds: 1.90,
      drawOdds: 3.50,
      awayOdds: 4.10
    },
    {
      homeTeam: "Bayern Munich",
      awayTeam: "Borussia Dortmund",
      league: "Bundesliga",
      time: "19:30",
      date: "Sat, 25 Jun",
      homeOdds: 1.75,
      drawOdds: 3.80,
      awayOdds: 4.50
    },
    {
      homeTeam: "PSG",
      awayTeam: "Marseille",
      league: "Ligue 1",
      time: "20:45",
      date: "Sun, 26 Jun",
      homeOdds: 1.65,
      drawOdds: 3.90,
      awayOdds: 5.20
    }
  ],
  basketball: [
    {
      homeTeam: "Lakers",
      awayTeam: "Celtics",
      league: "NBA",
      time: "22:00",
      date: "Today",
      homeOdds: 1.85,
      awayOdds: 2.05,
      isLive: true
    },
    {
      homeTeam: "Warriors",
      awayTeam: "Nets",
      league: "NBA",
      time: "23:30",
      date: "Tomorrow",
      homeOdds: 1.75,
      awayOdds: 2.15
    },
    {
      homeTeam: "Bulls",
      awayTeam: "Heat",
      league: "NBA",
      time: "21:00",
      date: "Sat, 25 Jun",
      homeOdds: 2.25,
      awayOdds: 1.70
    }
  ],
  tennis: [
    {
      homeTeam: "Djokovic",
      awayTeam: "Nadal",
      league: "Wimbledon",
      time: "15:00",
      date: "Tomorrow",
      homeOdds: 1.90,
      awayOdds: 2.00
    },
    {
      homeTeam: "Alcaraz",
      awayTeam: "Medvedev",
      league: "US Open",
      time: "18:30",
      date: "Sat, 25 Jun",
      homeOdds: 1.85,
      awayOdds: 2.05
    }
  ]
};

export default function Sports() {
  const { sport = "football" } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [matchesView, setMatchesView] = useState("all");
  
  // Validate sport parameter
  const validSport = Object.keys(sportsData).includes(sport) ? sport : "football";
  const matches = sportsData[validSport as keyof typeof sportsData] || [];
  
  // Filter matches based on search and view
  const filteredMatches = matches.filter(match => {
    const matchesSearch = 
      match.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) || 
      match.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.league.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesView = 
      matchesView === "all" || 
      (matchesView === "live" && match.isLive === true) || 
      (matchesView === "upcoming" && match.isLive !== true);
    
    return matchesSearch && matchesView;
  });

  const handleSportChange = (newSport: string) => {
    navigate(`/sports/${newSport}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-bet-dark-accent py-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Sports Betting</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Place bets on your favorite sports with competitive odds and AI-powered predictions.
            </p>
            
            {/* Sport Tabs */}
            <Tabs 
              value={validSport} 
              onValueChange={handleSportChange}
              className="mb-8"
            >
              <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
                <TabsTrigger value="football">Football</TabsTrigger>
                <TabsTrigger value="basketball">Basketball</TabsTrigger>
                <TabsTrigger value="tennis">Tennis</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Search & Filter */}
            <div className="max-w-md mx-auto">
              <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Search for matches..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Tabs 
                defaultValue="all" 
                value={matchesView}
                onValueChange={setMatchesView}
                className="mb-8"
              >
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="all">All Matches</TabsTrigger>
                  <TabsTrigger value="live">Live Now</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
        
        {/* Matches Grid */}
        <div className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMatches.length > 0 ? (
                filteredMatches.map((match, index) => (
                  <UpcomingMatchCard
                    key={index}
                    homeTeam={match.homeTeam}
                    awayTeam={match.awayTeam}
                    league={match.league}
                    time={match.time}
                    date={match.date}
                    homeOdds={match.homeOdds}
                    drawOdds={hasDrawOdds(match) ? match.drawOdds : undefined}
                    awayOdds={match.awayOdds}
                    isLive={match.isLive}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No matches found matching your search criteria</p>
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
