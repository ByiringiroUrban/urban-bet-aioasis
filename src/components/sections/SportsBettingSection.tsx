
import { useEffect, useState } from "react";
import { Match } from "@/types";
import UpcomingMatchCard from "@/components/UpcomingMatchCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getFeaturedEvents } from "@/services/sportsDataService";

interface SportsBettingSectionProps {
  upcomingMatches?: Match[];
}

export default function SportsBettingSection({ upcomingMatches: propMatches }: SportsBettingSectionProps) {
  const navigate = useNavigate();
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>(propMatches || []);
  
  // This function handles expanding only one match at a time
  const handleExpandMarket = (matchId: string | null) => {
    setExpandedMatchId(matchId);
  };
  
  useEffect(() => {
    if (propMatches && propMatches.length > 0) {
      setUpcomingMatches(propMatches);
      return;
    }
    
    const loadFeaturedMatches = async () => {
      setLoading(true);
      try {
        const featuredEvents = await getFeaturedEvents();
        // Convert SportEvent[] to Match[] with proper type casting
        const matches: Match[] = featuredEvents.map(event => ({
          id: event.id,
          homeTeam: event.homeTeam,
          awayTeam: event.awayTeam,
          league: event.league,
          country: event.country || '',
          time: event.time,
          date: event.date,
          homeOdds: event.homeOdds,
          drawOdds: event.drawOdds,
          awayOdds: event.awayOdds,
          isLive: event.isLive,
          featured: event.featured
        }));
        setUpcomingMatches(matches);
      } catch (error) {
        console.error("Error loading featured events:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFeaturedMatches();
  }, [propMatches]);

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-background/95">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Sports Betting</h2>
            <p className="text-muted-foreground mt-2">Upcoming matches with AI-enhanced odds</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/sports")}>
            View All Sports <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-bet-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : upcomingMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingMatches.map((match) => (
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
                isExpanded={expandedMatchId === match.id}
                onExpandMarket={handleExpandMarket}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-muted/20 rounded-lg">
            <p className="text-muted-foreground">No featured matches available at the moment</p>
            <Button variant="link" onClick={() => navigate("/sports")}>
              Browse all sports
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
