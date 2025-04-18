
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LiveBettingHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeSport: string;
  onSportChange: (value: string) => void;
}

export default function LiveBettingHeader({
  searchQuery,
  onSearchChange,
  activeSport,
  onSportChange
}: LiveBettingHeaderProps) {
  return (
    <>
      <div className="bg-bet-dark-accent py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <h1 className="text-4xl font-bold">Live Betting</h1>
            <Badge className="bg-bet-danger animate-pulse">LIVE</Badge>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Experience the thrill of in-play betting with real-time odds and statistics.
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Search live matches..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            
            <Tabs 
              defaultValue="all" 
              value={activeSport}
              onValueChange={onSportChange}
              className="mb-8"
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="all">All Sports</TabsTrigger>
                <TabsTrigger value="football">Football</TabsTrigger>
                <TabsTrigger value="basketball">Basketball</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
