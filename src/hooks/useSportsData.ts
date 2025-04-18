
import { useState, useEffect } from "react";
import { Match } from "@/types";
import { sportsCategories, SportCategory } from "@/data/sportsData";

interface UseSportsDataProps {
  sport?: string;
  country?: string;
  league?: string;
  initialMatches: Record<string, Match[]>;
}

export function useSportsData({ sport = "football", country, league, initialMatches }: UseSportsDataProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [matchesView, setMatchesView] = useState("all");
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  
  const validSport = Object.keys(initialMatches).includes(sport) ? sport : "football";
  
  useEffect(() => {
    let matches = initialMatches[validSport as keyof typeof initialMatches] || [];
    
    if (league) {
      matches = matches.filter(match => (match as any).leagueId === league);
    }
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
    
    // Filter by search and view type
    const filtered = matches.filter(match => {
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
    
    setFilteredMatches(filtered);
  }, [validSport, country, league, searchQuery, matchesView, initialMatches]);

  const getPageTitle = () => {
    if (league) {
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
      const sportCategory = sportsCategories.find(sc => sc.id === validSport);
      if (sportCategory) {
        const countryData = sportCategory.countries.find(c => c.id === country);
        if (countryData) {
          return `${countryData.name} ${sportCategory.name}`;
        }
      }
      return country.replace(/-/g, ' ');
    }
    
    const sportCategory = sportsCategories.find(sc => sc.id === validSport);
    return sportCategory ? sportCategory.name : validSport.replace(/-/g, ' ');
  };

  return {
    searchQuery,
    setSearchQuery,
    matchesView,
    setMatchesView,
    filteredMatches,
    pageTitle: getPageTitle(),
    validSport
  };
}
