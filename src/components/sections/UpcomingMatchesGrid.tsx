
import { useState } from "react";
import { Match } from "@/types";
import UpcomingMatchCard from "@/components/UpcomingMatchCard";
import { Button } from "@/components/ui/button";

interface UpcomingMatchesGridProps {
  matches: Match[];
  loading: boolean;
  emptyStateAction?: () => void;
}

export default function UpcomingMatchesGrid({ 
  matches, 
  loading,
  emptyStateAction
}: UpcomingMatchesGridProps) {
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  
  // This function handles expanding only one match at a time
  const handleExpandMarket = (matchId: string | null) => {
    setExpandedMatchId(matchId);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-8 h-8 border-4 border-bet-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (matches.length === 0) {
    return (
      <div className="text-center py-10 bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">No matches available at the moment</p>
        {emptyStateAction && (
          <Button variant="link" onClick={emptyStateAction}>
            Browse all sports
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {matches.map((match) => (
        <UpcomingMatchCard
          key={match.id}
          match={match}
        />
      ))}
    </div>
  );
}
