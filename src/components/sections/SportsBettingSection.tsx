
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UpcomingMatchCard from "@/components/UpcomingMatchCard";

interface Match {
  homeTeam: string;
  awayTeam: string;
  league: string;
  time: string;
  date: string;
  homeOdds: number;
  drawOdds?: number;
  awayOdds: number;
  isLive?: boolean;
}

export default function SportsBettingSection({ upcomingMatches }: { upcomingMatches: Match[] }) {
  const [activeTab, setActiveTab] = useState("featured");
  
  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Sports Betting</h2>
            <p className="text-muted-foreground">Browse upcoming matches and place your bets</p>
          </div>
          
          <Tabs 
            defaultValue="featured" 
            className="mt-4 md:mt-0"
            onValueChange={setActiveTab}
          >
            <TabsList>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="live">Live Now</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {upcomingMatches.map((match, index) => (
            <UpcomingMatchCard
              key={index}
              homeTeam={match.homeTeam}
              awayTeam={match.awayTeam}
              league={match.league}
              time={match.time}
              date={match.date}
              homeOdds={match.homeOdds}
              drawOdds={match.drawOdds}
              awayOdds={match.awayOdds}
              isLive={match.isLive}
            />
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Button asChild>
            <Link to="/sports">
              View All Sports <ArrowRight size={16} className="ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
