
import { useState, useEffect } from "react";
import { Match } from "@/types";

interface UseLiveBettingReturn {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  activeSport: string;
  setActiveSport: (value: string) => void;
  activeMatches: Match[];
  expandedMatchId: string | null;
  handleExpandMarket: (matchId: string | null) => void;
}

export const useLiveBetting = (initialMatches: Match[]): UseLiveBettingReturn => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSport, setActiveSport] = useState("all");
  const [activeMatches, setActiveMatches] = useState<Match[]>(initialMatches);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  
  const handleExpandMarket = (matchId: string | null) => {
    setExpandedMatchId(matchId);
  };
  
  useEffect(() => {
    let filtered = initialMatches;
    
    if (searchQuery) {
      filtered = filtered.filter(match => 
        match.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) || 
        match.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.league.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
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
  }, [searchQuery, activeSport, initialMatches]);

  return {
    searchQuery,
    setSearchQuery,
    activeSport,
    setActiveSport,
    activeMatches,
    expandedMatchId,
    handleExpandMarket
  };
};
