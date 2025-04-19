
import React, { useState } from 'react';
import { Clock, ChevronDown, ChevronUp } from "lucide-react";
import { Match } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Add Button import
import OddsButton from "@/components/betting/OddsButton";
import MatchCardFooter from "@/components/betting/MatchCardFooter";
import MarketsList from "@/components/betting/MarketsList";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { isEventExpired } from "@/services/sportsDataService";
import { useBetting } from "@/contexts/BettingContext";

interface UpcomingMatchCardProps {
  match: Match;
  className?: string;
}

export default function UpcomingMatchCard({ match, className }: UpcomingMatchCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isLoadingMarkets, setIsLoadingMarkets] = useState(false);
  const { addBet } = useBetting();
  
  const isExpired = match.startTime ? isEventExpired(match.startTime) : false;
  const isBettingDisabled = isExpired && !match.isLive;
  
  const handleSelectOdds = (selection: string, odds: number) => {
    if (!isBettingDisabled) {
      addBet({
        // Remove explicit id from here as it's handled in the context
        event: `${match.homeTeam} vs ${match.awayTeam}`,
        selection: `Match Winner: ${selection}`,
        odds: odds
      });
    }
  };
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="p-4 bg-card border-b flex flex-row items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{match.league}</p>
          <div className="flex gap-2 items-center mt-1">
            <span className="text-xs bg-muted px-2 py-0.5 rounded-sm">
              {match.country}
            </span>
            {match.isLive ? (
              <Badge variant="destructive" className="text-xs py-0">Live</Badge>
            ) : (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{match.date} {match.time}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium">{match.homeTeam}</p>
            {!isBettingDisabled && (
              <OddsButton
                label="Home"
                odds={match.homeOdds}
                onClick={() => handleSelectOdds('Home', match.homeOdds)}
                disabled={isBettingDisabled}
              />
            )}
          </div>
          
          {match.drawOdds !== undefined && (
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">Draw</p>
              {!isBettingDisabled && (
                <OddsButton
                  label="Draw"
                  odds={match.drawOdds}
                  onClick={() => handleSelectOdds('Draw', match.drawOdds)}
                  disabled={isBettingDisabled}
                />
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <p className="font-medium">{match.awayTeam}</p>
            {!isBettingDisabled && (
              <OddsButton
                label="Away"
                odds={match.awayOdds}
                onClick={() => handleSelectOdds('Away', match.awayOdds)}
                disabled={isBettingDisabled}
              />
            )}
          </div>
          
          {isBettingDisabled && (
            <div className="mt-2 text-center">
              <Badge variant="outline" className="bg-muted/50">
                Betting closed for this event
              </Badge>
            </div>
          )}
        </div>
        
        {expanded && (
          <MarketsList 
            markets={[]}
            selectedOdds={null}
            onSelectOption={() => {}}
            isLoading={isLoadingMarkets}
          />
        )}
        
        <MatchCardFooter
          showMoreMarkets={expanded}
          onToggleMarkets={() => setExpanded(!expanded)}
          isLoadingMarkets={isLoadingMarkets}
        />
      </CardContent>
    </Card>
  );
}
