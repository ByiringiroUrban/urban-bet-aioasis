
import { useState } from "react";
import { useParams } from "react-router-dom";
import { SidebarProvider, Sidebar } from "@/components/ui/sidebar";
import { sportsCategories } from "@/data/sportsData";
import { sportsData } from "@/data/mockSportsData";
import Layout from "@/components/Layout";
import SportsSidebar from "@/components/sports/SportsSidebar";
import SportsContent from "@/components/sports/SportsContent";
import { useSportsData } from "@/hooks/useSportsData";
import { useEffect } from "react";
import { getEvents } from "@/services/sportsDataService";
import { Match } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function Sports() {
  const { sport = "football", country, league } = useParams();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [liveEvents, setLiveEvents] = useState<Record<string, Match[]>>(sportsData);
  const { toast } = useToast();
  
  const {
    searchQuery,
    setSearchQuery,
    matchesView,
    setMatchesView,
    filteredMatches,
    pageTitle,
    validSport
  } = useSportsData({
    sport,
    country,
    league,
    initialMatches: liveEvents
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await getEvents();
        const sportsMapped: Record<string, Match[]> = {};
        
        // Group events by sport
        events.forEach(event => {
          const sportType = event.sportId === "1" ? "football" : 
                            event.sportId === "2" ? "basketball" : 
                            event.sportId === "3" ? "tennis" : "football";
          
          if (!sportsMapped[sportType]) {
            sportsMapped[sportType] = [];
          }

          sportsMapped[sportType].push({
            id: event.id,
            homeTeam: event.homeTeam,
            awayTeam: event.awayTeam,
            league: event.league || "",
            country: event.country || "",
            time: event.time,
            date: event.date,
            homeOdds: event.homeOdds,
            drawOdds: event.drawOdds,
            awayOdds: event.awayOdds,
            isLive: event.isLive || false,
          });
        });
        
        // If we have events, update the state
        if (Object.keys(sportsMapped).length > 0) {
          setLiveEvents(sportsMapped);
        } else {
          // If no events, fallback to mock data
          setLiveEvents(sportsData);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        toast({
          title: "Error",
          description: "Failed to fetch events. Showing demo data instead.",
          variant: "destructive",
        });
        
        // Fallback to mock data
        setLiveEvents(sportsData);
      }
    };
    
    fetchEvents();
    
    // Set up an interval to refresh events every 60 seconds
    const intervalId = setInterval(fetchEvents, 60000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [toast]);

  return (
    <Layout>
      <div className="flex-grow flex">
        <SidebarProvider defaultOpen={!isCollapsed}>
          <Sidebar variant="inset" className="bg-background border-r">
            <SportsSidebar
              categories={sportsCategories}
              activeSport={validSport}
              activeCountry={country}
              activeLeague={league}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </Sidebar>
          
          <main className="flex-1 p-4">
            <SportsContent
              pageTitle={pageTitle}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              matchesView={matchesView}
              onMatchesViewChange={setMatchesView}
              matches={filteredMatches}
            />
          </main>
        </SidebarProvider>
      </div>
    </Layout>
  );
}
