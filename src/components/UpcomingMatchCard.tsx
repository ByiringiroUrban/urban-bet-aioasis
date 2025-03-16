
import { Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useBetting } from "@/contexts/BettingContext";
import { cn } from "@/lib/utils";
import { mongoService } from "@/services/mongoService";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [showMoreMarkets, setShowMoreMarkets] = useState(false);
  const [isLoadingMarkets, setIsLoadingMarkets] = useState(false);
  const [markets, setMarkets] = useState<any[]>([]);
  const [selectedOdds, setSelectedOdds] = useState<string | null>(null);

  const addToBettingSlip = (selection: string, odds: number) => {
    addBet({
      event: `${homeTeam} vs ${awayTeam}`,
      selection,
      odds
    });
    
    // Highlight the selected odds
    setSelectedOdds(selection);
    
    toast({
      title: "Added to Bet Slip",
      description: `${selection} - ${homeTeam} vs ${awayTeam}`,
    });
  };

  const handleShowMoreMarkets = async () => {
    setIsLoadingMarkets(true);
    try {
      // Generate a fake event ID based on team names
      const eventId = `${homeTeam.toLowerCase().replace(/\s/g, '')}-${awayTeam.toLowerCase().replace(/\s/g, '')}`;
      const marketsData = await mongoService.getMarkets(eventId);
      setMarkets(marketsData);
      setShowMoreMarkets(true);
    } catch (error) {
      toast({
        title: "Error loading markets",
        description: "Could not load additional markets for this event",
        variant: "destructive"
      });
    } finally {
      setIsLoadingMarkets(false);
    }
  };

  const OddsButton = ({ 
    label, 
    odds, 
    onClick, 
    disabled = false,
    isSelected = false
  }: { 
    label: string; 
    odds: number; 
    onClick: () => void; 
    disabled?: boolean;
    isSelected?: boolean;
  }) => (
    <Button 
      variant="outline" 
      className={cn(
        "flex flex-col items-center justify-center h-auto py-3 w-full transition-all duration-200",
        isSelected ? "border-bet-primary bg-bet-primary/10 text-bet-primary" : "border-border",
        disabled ? "opacity-50 cursor-not-allowed" : 
        "hover:border-bet-primary hover:bg-bet-primary/5 hover:text-bet-primary active:scale-95"
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="text-xs text-muted-foreground mb-1">{label}</span>
      <span className={cn(
        "font-bold text-lg",
        isSelected ? "text-bet-primary" : ""
      )}>
        {odds.toFixed(2)}
      </span>
    </Button>
  );

  return (
    <Card className="card-highlight transition-all duration-300 bg-card border-border/50 hover:shadow-md overflow-hidden">
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
            isSelected={selectedOdds === `${homeTeam} to win`}
          />
          
          {drawOdds ? (
            <OddsButton
              label="Draw"
              odds={drawOdds}
              onClick={() => addToBettingSlip("Draw", drawOdds)}
              isSelected={selectedOdds === "Draw"}
            />
          ) : (
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-auto py-3 opacity-50 cursor-not-allowed w-full"
              disabled
            >
              <span className="text-xs text-muted-foreground mb-1">Draw</span>
              <span className="font-bold">N/A</span>
            </Button>
          )}
          
          <OddsButton
            label="Away"
            odds={awayOdds}
            onClick={() => addToBettingSlip(`${awayTeam} to win`, awayOdds)}
            isSelected={selectedOdds === `${awayTeam} to win`}
          />
        </div>

        {showMoreMarkets && (
          <div className="mt-4 space-y-4 border-t border-border/50 pt-4">
            {markets.map((market) => (
              <div key={market.id} className="space-y-2">
                <h4 className="text-sm font-medium">{market.name}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {market.options.map((option: string, index: number) => {
                    // Generate a consistent but random odds value for each option
                    const randomOdds = 2 + Math.random() * 3;
                    const selectionKey = `${market.name}: ${option}`;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className={cn(
                          "text-xs",
                          selectedOdds === selectionKey 
                            ? "border-bet-primary bg-bet-primary/10 text-bet-primary" 
                            : "hover:border-bet-primary hover:bg-bet-primary/5"
                        )}
                        onClick={() => addToBettingSlip(selectionKey, randomOdds)}
                      >
                        {option} <span className="ml-1 text-bet-primary">{randomOdds.toFixed(2)}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-xs group"
          onClick={handleShowMoreMarkets}
          disabled={isLoadingMarkets}
        >
          {showMoreMarkets ? "Hide Markets" : (isLoadingMarkets ? "Loading..." : "More Markets")} 
          <ArrowRight size={14} className={`ml-1 ${showMoreMarkets ? "rotate-90" : ""} group-hover:translate-x-1 transition-transform`} />
        </Button>
      </CardFooter>
    </Card>
  );
}
