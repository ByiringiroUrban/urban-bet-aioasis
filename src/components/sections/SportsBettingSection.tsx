
import { useNavigate } from "react-router-dom";
import { Match } from "@/types";
import { useUpcomingMatches } from "@/hooks/useUpcomingMatches";
import SportsBettingHeader from "./SportsBettingHeader";
import UpcomingMatchesGrid from "./UpcomingMatchesGrid";
import { useState, useEffect } from "react";

interface SportsBettingSectionProps {
  upcomingMatches?: Match[];
}

export default function SportsBettingSection({ upcomingMatches: propMatches }: SportsBettingSectionProps) {
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState<string | undefined>(undefined);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<'upcoming' | 'live' | 'all'>('all');
  
  const { upcomingMatches, loading } = useUpcomingMatches({ 
    initialMatches: propMatches,
    sportId: selectedSport,
    timeFilter: selectedTimeFilter,
    limit: 6 // Show more matches on the homepage
  });
  
  // Refresh data periodically
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      // This will trigger the useEffect in useUpcomingMatches
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(refreshInterval);
  }, []);

  const handleSportChange = (sportId: string) => {
    setSelectedSport(sportId === 'all' ? undefined : sportId);
  };
  
  const handleTimeFilterChange = (filter: 'upcoming' | 'live' | 'all') => {
    setSelectedTimeFilter(filter);
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-background/95">
      <div className="max-w-7xl mx-auto">
        <SportsBettingHeader 
          onSportChange={handleSportChange}
          onTimeFilterChange={handleTimeFilterChange}
          selectedSport={selectedSport}
          selectedTimeFilter={selectedTimeFilter}
        />
        <UpcomingMatchesGrid 
          matches={upcomingMatches} 
          loading={loading} 
          emptyStateAction={() => navigate("/sports")}
        />
      </div>
    </section>
  );
}
