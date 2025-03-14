
import { Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UpcomingMatchCardProps {
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

export default function UpcomingMatchCard({
  homeTeam,
  awayTeam,
  league,
  time,
  date,
  homeOdds,
  drawOdds,
  awayOdds,
  isLive = false
}: UpcomingMatchCardProps) {
  const addToBettingSlip = (selection: string, odds: number) => {
    // This would be implemented with context/state management in a real app
    console.log(`Added ${selection} at odds ${odds} to betting slip`);
  };

  return (
    <Card className="card-highlight transition-all duration-300 bg-card border-border/50 hover-scale">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{homeTeam} vs {awayTeam}</CardTitle>
          {isLive && (
            <Badge className="bg-bet-danger/20 text-bet-danger hover:bg-bet-danger/30 animate-pulse">
              LIVE
            </Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground flex items-center mt-1">
          <span>{league}</span>
          <span className="mx-2">•</span>
          <Clock size={12} className="mr-1" />
          <span>{time}, {date}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-3 gap-2">
          <Button 
            variant="outline" 
            className="flex flex-col items-center py-3 hover:border-bet-primary hover:text-bet-primary transition-all"
            onClick={() => addToBettingSlip(`${homeTeam} to win`, homeOdds)}
          >
            <span className="text-xs text-muted-foreground mb-1">Home</span>
            <span className="font-bold">{homeOdds}</span>
          </Button>
          
          {drawOdds ? (
            <Button 
              variant="outline" 
              className="flex flex-col items-center py-3 hover:border-bet-primary hover:text-bet-primary transition-all"
              onClick={() => addToBettingSlip("Draw", drawOdds)}
            >
              <span className="text-xs text-muted-foreground mb-1">Draw</span>
              <span className="font-bold">{drawOdds}</span>
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="flex flex-col items-center py-3 opacity-50 cursor-not-allowed"
              disabled
            >
              <span className="text-xs text-muted-foreground mb-1">N/A</span>
              <span className="font-bold">-</span>
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center py-3 hover:border-bet-primary hover:text-bet-primary transition-all"
            onClick={() => addToBettingSlip(`${awayTeam} to win`, awayOdds)}
          >
            <span className="text-xs text-muted-foreground mb-1">Away</span>
            <span className="font-bold">{awayOdds}</span>
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full text-xs">
          More Markets <ArrowRight size={14} className="ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}
