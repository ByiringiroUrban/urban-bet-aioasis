
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getSports } from "@/services/sportsDataService";

interface SportsBettingHeaderProps {
  onSportChange?: (sportId: string) => void;
  onTimeFilterChange?: (filter: 'upcoming' | 'live' | 'all') => void;
  selectedSport?: string;
  selectedTimeFilter?: string;
}

export default function SportsBettingHeader({ 
  onSportChange, 
  onTimeFilterChange,
  selectedSport = 'all',
  selectedTimeFilter = 'all'
}: SportsBettingHeaderProps) {
  const [sports, setSports] = useState<{id: string; name: string}[]>([]);
  
  useEffect(() => {
    const loadSports = async () => {
      try {
        const sportsData = await getSports();
        setSports([{ id: 'all', name: 'All Sports' }, ...sportsData]);
      } catch (error) {
        console.error("Error loading sports:", error);
        // Fallback sports data
        setSports([
          { id: 'all', name: 'All Sports' },
          { id: '1', name: 'Football' },
          { id: '2', name: 'Basketball' },
          { id: '3', name: 'Tennis' }
        ]);
      }
    };
    
    loadSports();
  }, []);

  const handleSportChange = (value: string) => {
    if (onSportChange) {
      onSportChange(value);
    }
  };
  
  const handleTimeFilterChange = (value: string) => {
    if (onTimeFilterChange) {
      onTimeFilterChange(value as 'upcoming' | 'live' | 'all');
    }
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Sports Betting</h2>
          <p className="text-muted-foreground">
            Get real-time odds and place bets on your favorite sports
          </p>
        </div>
        <Button asChild variant="outline" className="mt-4 md:mt-0">
          <Link to="/sports">
            Explore All <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Select value={selectedSport} onValueChange={handleSportChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Select Sport" />
          </SelectTrigger>
          <SelectContent>
            {sports.map(sport => (
              <SelectItem key={sport.id} value={sport.id}>
                {sport.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Tabs defaultValue={selectedTimeFilter} value={selectedTimeFilter} onValueChange={handleTimeFilterChange} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="live">Live Now</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
