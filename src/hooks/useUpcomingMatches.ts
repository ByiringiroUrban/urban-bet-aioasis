
import { useState, useEffect } from "react";
import { Match } from "@/types";
import { getEvents } from "@/services/sportsDataService";

interface UseUpcomingMatchesOptions {
  initialMatches?: Match[];
  limit?: number;
}

export const useUpcomingMatches = ({ initialMatches, limit = 4 }: UseUpcomingMatchesOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>(initialMatches || []);
  
  useEffect(() => {
    if (initialMatches && initialMatches.length > 0) {
      setUpcomingMatches(initialMatches);
      return;
    }
    
    const loadFeaturedMatches = async () => {
      setLoading(true);
      try {
        // Get the latest events
        const events = await getEvents(undefined, false);
        // Convert SportEvent[] to Match[] with proper type casting
        const matches: Match[] = events.slice(0, limit).map(event => ({
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
          featured: false // Default since column doesn't exist
        }));
        setUpcomingMatches(matches);
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFeaturedMatches();
  }, [initialMatches, limit]);

  return { upcomingMatches, loading };
};
