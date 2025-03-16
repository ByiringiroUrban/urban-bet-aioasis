
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Search, FilterIcon, ChevronRight, ChevronDown, CircleDot, Circle, User, Dribbble } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UpcomingMatchCard from "@/components/UpcomingMatchCard";
import { sportsCategories, SportCategory, Country, League } from "@/data/sportsData";
import { isAuthenticated } from "@/utils/authUtils";

// Define TypeScript interfaces for our data structure
interface BaseMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  time: string;
  date: string;
  homeOdds: number;
  awayOdds: number;
  isLive?: boolean;
  leagueId?: string;
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
      id: "match1",
      homeTeam: "Arsenal",
      awayTeam: "Chelsea",
      league: "Premier League",
      leagueId: "premier-league",
      time: "20:00",
      date: "Today",
      homeOdds: 2.10,
      drawOdds: 3.40,
      awayOdds: 3.75,
      isLive: true
    },
    {
      id: "match2",
      homeTeam: "Barcelona",
      awayTeam: "Real Madrid",
      league: "La Liga",
      leagueId: "la-liga",
      time: "21:00",
      date: "Tomorrow",
      homeOdds: 1.90,
      drawOdds: 3.50,
      awayOdds: 4.10
    },
    {
      id: "match3",
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
      id: "match4",
      homeTeam: "PSG",
      awayTeam: "Marseille",
      league: "Ligue 1",
      leagueId: "ligue-1",
      time: "20:45",
      date: "Sun, 26 Jun",
      homeOdds: 1.65,
      drawOdds: 3.90,
      awayOdds: 5.20
    },
    {
      id: "match5",
      homeTeam: "APR FC",
      awayTeam: "Rayon Sports",
      league: "Rwanda Premier League",
      leagueId: "rwanda-premier",
      time: "15:00",
      date: "Tomorrow",
      homeOdds: 2.20,
      drawOdds: 3.10,
      awayOdds: 3.50
    },
    {
      id: "match6",
      homeTeam: "Manchester United",
      awayTeam: "Liverpool",
      league: "Premier League",
      leagueId: "premier-league",
      time: "16:30",
      date: "Sun, 26 Jun",
      homeOdds: 2.80,
      drawOdds: 3.40,
      awayOdds: 2.50
    },
    {
      id: "match7",
      homeTeam: "Real Madrid",
      awayTeam: "Bayern Munich",
      league: "UEFA Champions League",
      leagueId: "champions-league",
      time: "20:00",
      date: "Tue, 28 Jun",
      homeOdds: 2.10,
      drawOdds: 3.50,
      awayOdds: 3.30
    }
  ],
  basketball: [
    {
      id: "bball1",
      homeTeam: "Lakers",
      awayTeam: "Celtics",
      league: "NBA",
      leagueId: "nba",
      time: "22:00",
      date: "Today",
      homeOdds: 1.85,
      awayOdds: 2.05,
      isLive: true
    },
    {
      id: "bball2",
      homeTeam: "Warriors",
      awayTeam: "Nets",
      league: "NBA",
      leagueId: "nba",
      time: "23:30",
      date: "Tomorrow",
      homeOdds: 1.75,
      awayOdds: 2.15
    },
    {
      id: "bball3",
      homeTeam: "Bulls",
      awayTeam: "Heat",
      league: "NBA",
      leagueId: "nba",
      time: "21:00",
      date: "Sat, 25 Jun",
      homeOdds: 2.25,
      awayOdds: 1.70
    },
    {
      id: "bball4",
      homeTeam: "Patriots BBC",
      awayTeam: "REG",
      league: "Rwanda Basketball League",
      leagueId: "rwanda-basketball",
      time: "18:00",
      date: "Tomorrow",
      homeOdds: 2.40,
      awayOdds: 1.60
    }
  ],
  tennis: [
    {
      id: "tennis1",
      homeTeam: "Djokovic",
      awayTeam: "Nadal",
      league: "Grand Slams",
      leagueId: "grand-slams",
      time: "15:00",
      date: "Tomorrow",
      homeOdds: 1.90,
      awayOdds: 2.00
    },
    {
      id: "tennis2",
      homeTeam: "Alcaraz",
      awayTeam: "Medvedev",
      league: "US Open",
      leagueId: "grand-slams",
      time: "18:30",
      date: "Sat, 25 Jun",
      homeOdds: 1.85,
      awayOdds: 2.05
    },
    {
      id: "tennis3",
      homeTeam: "Mugisha",
      awayTeam: "Hakizimana",
      league: "Rwandan Open",
      leagueId: "rwandan-open",
      time: "14:00",
      date: "Today",
      homeOdds: 2.10,
      awayOdds: 1.80
    }
  ]
};

const SportIcon = ({ sportId }: { sportId: string }) => {
  switch (sportId) {
    case 'football':
      return <CircleDot className="h-5 w-5" />;
    case 'basketball':
      return <Dribbble className="h-5 w-5" />;
    case 'tennis':
      return <Circle className="h-5 w-5" />;
    default:
      return <Circle className="h-5 w-5" />;
  }
};

export default function Sports() {
  const { sport = "football", country, league } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [matchesView, setMatchesView] = useState("all");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Validate sport parameter
  const validSport = Object.keys(sportsData).includes(sport) ? sport : "football";
  
  // Find all matches for the current sport
  let matches = sportsData[validSport as keyof typeof sportsData] || [];
  
  // Filter by league if provided
  if (league) {
    matches = matches.filter(match => (match as any).leagueId === league);
  }
  // Filter by country if provided (check leagues in that country)
  else if (country) {
    const sportCategory = sportsCategories.find(sc => sc.id === validSport);
    if (sportCategory) {
      const countryData = sportCategory.countries.find(c => c.id === country);
      if (countryData) {
        const leagueIds = countryData.leagues.map(l => l.id);
        matches = matches.filter(match => leagueIds.includes((match as any).leagueId || ''));
      }
    }
  }
  
  // Further filter matches based on search and view
  const filteredMatches = matches.filter(match => {
    const matchesSearch = 
      match.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) || 
      match.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.league.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesViewFilter = 
      matchesView === "all" || 
      (matchesView === "live" && match.isLive === true) || 
      (matchesView === "upcoming" && match.isLive !== true);
    
    return matchesSearch && matchesViewFilter;
  });

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleSportChange = (newSport: string) => {
    navigate(`/sports/${newSport}`);
  };

  const getPageTitle = () => {
    if (league) {
      // Find league name
      const sportCategory = sportsCategories.find(sc => sc.id === validSport);
      if (sportCategory) {
        for (const countryData of sportCategory.countries) {
          const leagueData = countryData.leagues.find(l => l.id === league);
          if (leagueData) {
            return leagueData.name;
          }
        }
      }
      return league.replace(/-/g, ' ');
    }
    
    if (country) {
      // Find country name
      const sportCategory = sportsCategories.find(sc => sc.id === validSport);
      if (sportCategory) {
        const countryData = sportCategory.countries.find(c => c.id === country);
        if (countryData) {
          return `${countryData.name} ${sportCategory.name}`;
        }
      }
      return country.replace(/-/g, ' ');
    }
    
    // Default to sport name
    const sportCategory = sportsCategories.find(sc => sc.id === validSport);
    return sportCategory ? sportCategory.name : validSport.replace(/-/g, ' ');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex">
        <SidebarProvider defaultOpen={!isCollapsed}>
          <Sidebar variant="inset" className="bg-background border-r">
            <SidebarHeader className="p-4">
              <h3 className="text-lg font-semibold">Sports</h3>
              <div className="relative mb-2 mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Search sports & leagues..." 
                  className="pl-10 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </SidebarHeader>
            
            <SidebarContent>
              <Accordion type="multiple" defaultValue={[validSport]}>
                {sportsCategories.map((category) => (
                  <AccordionItem key={category.id} value={category.id}>
                    <AccordionTrigger className="py-2 px-4 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <SportIcon sportId={category.id} />
                        <span>{category.name}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <SidebarMenu>
                        {/* All matches for this sport */}
                        <SidebarMenuItem key={`all-${category.id}`}>
                          <SidebarMenuButton 
                            asChild 
                            isActive={validSport === category.id && !country && !league}
                          >
                            <Link to={`/sports/${category.id}`}>
                              All {category.name}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        
                        {/* Countries and leagues */}
                        {category.countries.map((countryData) => (
                          <Collapsible key={countryData.id}>
                            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent hover:text-accent-foreground rounded-md text-sm">
                              <span>{countryData.name}</span>
                              <ChevronRight className="h-4 w-4" />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="pl-2">
                                {/* Link to all leagues in this country */}
                                <SidebarMenuItem key={`country-${countryData.id}`}>
                                  <SidebarMenuButton 
                                    asChild 
                                    isActive={validSport === category.id && country === countryData.id && !league}
                                  >
                                    <Link to={`/sports/${category.id}/${countryData.id}`}>
                                      All {countryData.name} Leagues
                                    </Link>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                                
                                {/* Individual leagues */}
                                {countryData.leagues.map((leagueData) => (
                                  <SidebarMenuItem key={leagueData.id}>
                                    <SidebarMenuButton 
                                      asChild 
                                      isActive={validSport === category.id && league === leagueData.id}
                                    >
                                      <Link to={`/sports/${category.id}/${countryData.id}/${leagueData.id}`}>
                                        {leagueData.name}
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </SidebarMenu>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </SidebarContent>
          </Sidebar>
          
          <main className="flex-1 p-4">
            <div className="max-w-7xl mx-auto">
              {/* Sports page content */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold">{getPageTitle()}</h1>
                  <p className="text-muted-foreground">
                    Browse available matches and place your bets
                  </p>
                </div>
                <SidebarTrigger 
                  className="h-9 w-9"
                  onClick={() => setIsCollapsed(!isCollapsed)} 
                />
              </div>
              
              {/* View Options */}
              <div className="bg-card rounded-lg p-4 mb-6 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="relative max-w-sm">
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
                    className="w-full md:w-auto"
                  >
                    <TabsList className="grid grid-cols-3 w-full md:w-auto">
                      <TabsTrigger value="all">All Matches</TabsTrigger>
                      <TabsTrigger value="live">Live Now</TabsTrigger>
                      <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              
              {/* Matches Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMatches.length > 0 ? (
                  filteredMatches.map((match, index) => (
                    <UpcomingMatchCard
                      key={match.id || `${validSport}-${index}`}
                      id={match.id || `${validSport}-${index}`}
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
          </main>
        </SidebarProvider>
      </div>
      
      <Footer />
    </div>
  );
}
