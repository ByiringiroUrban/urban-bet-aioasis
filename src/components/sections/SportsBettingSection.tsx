
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import UpcomingMatchCard from "@/components/UpcomingMatchCard";

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  country: string;
  time: string;
  date: string;
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
  isLive?: boolean;
}

interface SportsBettingSectionProps {
  upcomingMatches: Match[];
}

export default function SportsBettingSection({ upcomingMatches }: SportsBettingSectionProps) {
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  
  const handleExpandMarket = (matchId: string | null) => {
    setExpandedMatchId(matchId);
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Top Sports Events</h2>
          <Button asChild variant="link" className="group">
            <Link to="/sports/football">
              View All Sports 
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              onExpandMarket={handleExpandMarket}
              isExpanded={expandedMatchId === match.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
