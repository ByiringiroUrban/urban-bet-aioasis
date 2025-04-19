
import { useState, useEffect } from "react";
import { Match } from "@/types";
import { getEvents } from "@/services/sportsDataService";

interface UseUpcomingMatchesOptions {
  initialMatches?: Match[];
  limit?: number;
  sportId?: string;
  leagueFilter?: string;
  timeFilter?: 'upcoming' | 'live' | 'all';
  countryFilter?: string;
}

export const useUpcomingMatches = ({ 
  initialMatches, 
  limit = 4, 
  sportId, 
  leagueFilter,
  timeFilter = 'all',
  countryFilter
}: UseUpcomingMatchesOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>(initialMatches || []);
  
  useEffect(() => {
    // If we have initial matches and no filters, use them
    if (initialMatches && initialMatches.length > 0 && !sportId && !leagueFilter && !countryFilter && timeFilter === 'all') {
      setUpcomingMatches(initialMatches);
      return;
    }
    
    const loadMatches = async () => {
      setLoading(true);
      try {
        // Get events with optional sport filter
        const events = await getEvents(sportId);
        
        // Apply filters before converting to Match[]
        let filteredEvents = events;
        
        // Apply league filter if provided
        if (leagueFilter) {
          filteredEvents = filteredEvents.filter(event => 
            event.league?.toLowerCase().includes(leagueFilter.toLowerCase())
          );
        }
        
        // Apply country filter if provided
        if (countryFilter) {
          filteredEvents = filteredEvents.filter(event => 
            event.country?.toLowerCase().includes(countryFilter.toLowerCase())
          );
        }
        
        // Apply time filter
        if (timeFilter !== 'all') {
          const now = new Date();
          filteredEvents = filteredEvents.filter(event => {
            const eventDate = new Date(event.startTime || '');
            
            if (timeFilter === 'live') {
              return event.isLive;
            } else if (timeFilter === 'upcoming') {
              return eventDate > now && !event.isLive;
            }
            return true;
          });
        }
        
        // Convert SportEvent[] to Match[] with proper type casting
        const matches: Match[] = filteredEvents.slice(0, limit).map(event => ({
          id: event.id,
          homeTeam: event.homeTeam,
          awayTeam: event.awayTeam,
          league: event.league || '',
          country: event.country || '',
          time: event.time,
          date: event.date,
          homeOdds: event.homeOdds,
          drawOdds: event.drawOdds,
          awayOdds: event.awayOdds,
          isLive: event.isLive,
          startTime: event.startTime,
          featured: !!event.featured
        }));
        
        setUpcomingMatches(matches);
      } catch (error) {
        console.error("Error loading events:", error);
        // If there's an error, use initial matches as fallback
        if (initialMatches && initialMatches.length > 0) {
          setUpcomingMatches(initialMatches);
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadMatches();
    
    // Set up refresh interval to keep the data updated
    const intervalId = setInterval(loadMatches, 60000); // Refresh every minute
    
    return () => {
      clearInterval(intervalId);
    };
  }, [initialMatches, limit, sportId, leagueFilter, timeFilter, countryFilter]);

  return { upcomingMatches, loading };
};
