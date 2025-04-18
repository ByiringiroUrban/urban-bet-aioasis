
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UpcomingMatchCard from "@/components/UpcomingMatchCard";
import { Match } from "@/types";

interface SportsContentProps {
  pageTitle: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  matchesView: string;
  onMatchesViewChange: (value: string) => void;
  matches: Match[];
}

export default function SportsContent({
  pageTitle,
  searchQuery,
  onSearchChange,
  matchesView,
  onMatchesViewChange,
  matches
}: SportsContentProps) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          <p className="text-muted-foreground">
            Browse available matches and place your bets
          </p>
        </div>
      </div>
      
      <div className="bg-card rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search for matches..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          <Tabs 
            defaultValue="all" 
            value={matchesView}
            onValueChange={onMatchesViewChange}
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {matches.length > 0 ? (
          matches.map((match) => (
            <UpcomingMatchCard
              key={match.id}
              match={match}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No matches found matching your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
