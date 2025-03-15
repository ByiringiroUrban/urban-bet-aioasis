
import { Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBetting } from "@/contexts/BettingContext";
import { cn } from "@/lib/utils";

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
  const { addBet } = useBetting();

  const addToBettingSlip = (selection: string, odds: number) => {
    addBet({
      event: `${homeTeam} vs ${awayTeam}`,
      selection,
      odds
    });
  };

  const OddsButton = ({ 
    label, 
    odds, 
    onClick, 
    disabled = false 
  }: { 
    label: string; 
    odds: number; 
    onClick: () => void; 
    disabled?: boolean 
  }) => (
    <Button 
      variant="outline" 
      className={cn(
        "flex flex-col items-center py-3 transition-all duration-200 border-border",
        disabled ? "opacity-50 cursor-not-allowed" : 
        "hover:border-bet-primary hover:bg-bet-primary/5 hover:text-bet-primary active:scale-95"
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="text-xs text-muted-foreground mb-1">{label}</span>
      <span className="font-bold text-lg bg-gradient-to-r from-bet-primary to-bet-accent bg-clip-text text-transparent">
        {odds.toFixed(2)}
      </span>
    </Button>
  );

  return (
    <Card className="card-highlight transition-all duration-300 bg-card border-border/50 hover-scale overflow-hidden">
      <CardHeader className="pb-2 relative">
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
        {isLive && (
          <div className="absolute -top-1 -right-1 w-24 h-24 bg-gradient-to-br from-bet-danger/30 to-transparent rounded-bl-full opacity-40 pointer-events-none" />
        )}
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-3 gap-2">
          <OddsButton
            label="Home"
            odds={homeOdds}
            onClick={() => addToBettingSlip(`${homeTeam} to win`, homeOdds)}
          />
          
          {drawOdds ? (
            <OddsButton
              label="Draw"
              odds={drawOdds}
              onClick={() => addToBettingSlip("Draw", drawOdds)}
            />
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
          
          <OddsButton
            label="Away"
            odds={awayOdds}
            onClick={() => addToBettingSlip(`${awayTeam} to win`, awayOdds)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full text-xs group">
          More Markets <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
}
