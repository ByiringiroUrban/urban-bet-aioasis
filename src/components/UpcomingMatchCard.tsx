
import React, { useState } from "react";
import { CalendarDays, Broadcast, ChevronRight, Trophy } from "lucide-react";
import { Match } from "@/types";
import { Badge } from "@/components/ui/badge";
import OddsButton from "./betting/OddsButton";
import MarketsList from "./betting/MarketsList";
import MatchCardFooter from "./betting/MatchCardFooter";
import { useBetting } from "@/contexts/BettingContext";

interface UpcomingMatchCardProps {
  match: Match;
}

const UpcomingMatchCard = ({ match }: UpcomingMatchCardProps) => {
  const { addToBetSlip, selections } = useBetting();
  const [showMoreMarkets, setShowMoreMarkets] = useState(false);
  const [isLoadingMarkets, setIsLoadingMarkets] = useState(false);
  const [additionalMarkets, setAdditionalMarkets] = useState<any[]>([]);

  // Format the date and time for display
  const matchDate = new Date(match.date);
  const formattedTime = match.time;
  const formattedDate = matchDate instanceof Date && !isNaN(matchDate.getTime()) 
    ? matchDate.toLocaleDateString() 
    : match.date;

  const handleToggleMarkets = () => {
    if (!showMoreMarkets && additionalMarkets.length === 0) {
      setIsLoadingMarkets(true);
      // Simulate loading markets
      setTimeout(() => {
        setAdditionalMarkets([
          {
            id: "1",
            name: "Both Teams to Score",
            options: [
              { label: "Yes", odds: 1.86 },
              { label: "No", odds: 1.95 },
            ],
          },
          {
            id: "2",
            name: "Over/Under 2.5 Goals",
            options: [
              { label: "Over", odds: 1.89 },
              { label: "Under", odds: 1.95 },
            ],
          },
        ]);
        setIsLoadingMarkets(false);
      }, 500);
    }
    setShowMoreMarkets(!showMoreMarkets);
  };

  const handleAddToBetSlip = (marketName: string, selection: string, odds: number) => {
    addToBetSlip({
      id: `${match.id}-${marketName}-${selection}`,
      eventId: match.id,
      matchName: `${match.homeTeam} vs ${match.awayTeam}`,
      marketName,
      selection,
      odds,
    });
  };

  const isSelectionActive = (marketName: string, selection: string) => {
    const selectionKey = `${marketName}: ${selection}`;
    return selections.some(
      (s) => 
        s.eventId === match.id && 
        s.marketName === marketName && 
        s.selection === selection
    );
  };

  // Main markets (Match Winner)
  const mainMarkets = [
    {
      label: "Home",
      odds: match.homeOdds,
      selected: isSelectionActive("Match Winner", "Home"),
      onClick: () => handleAddToBetSlip("Match Winner", "Home", match.homeOdds),
    },
    {
      label: "Draw",
      odds: match.drawOdds,
      selected: isSelectionActive("Match Winner", "Draw"),
      onClick: () => handleAddToBetSlip("Match Winner", "Draw", match.drawOdds),
    },
    {
      label: "Away",
      odds: match.awayOdds,
      selected: isSelectionActive("Match Winner", "Away"),
      onClick: () => handleAddToBetSlip("Match Winner", "Away", match.awayOdds),
    },
  ];

  // Format markets for MarketsList component
  const additionalMarketsFormatted = additionalMarkets.map((market) => ({
    id: market.id,
    name: market.name,
    options: market.options,
  }));

  const handleSelectOption = (marketName: string, option: { label: string; odds: number }) => {
    handleAddToBetSlip(marketName, option.label, option.odds);
  };

  const selectedOdds = selections.find((s) => s.eventId === match.id)
    ? `${selections.find((s) => s.eventId === match.id)?.marketName}: ${
        selections.find((s) => s.eventId === match.id)?.selection
      }`
    : null;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Match header */}
      <div className="p-4 border-b border-border">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {formattedDate} • {formattedTime}
            </span>
          </div>
          <div className="flex items-center">
            {match.isLive && (
              <Badge variant="destructive" className="flex items-center mr-2">
                <Broadcast className="mr-1 h-3 w-3" />
                LIVE
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {match.league || "League"}
            </Badge>
          </div>
        </div>

        <h3 className="font-bold text-lg">
          {match.homeTeam} vs {match.awayTeam}
        </h3>
      </div>

      {/* Main betting options */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-2 mb-4">
          {mainMarkets.map((market, index) => (
            <OddsButton
              key={index}
              label={market.label}
              odds={market.odds}
              onClick={market.onClick}
              isSelected={market.selected}
            />
          ))}
        </div>

        {/* Additional markets */}
        {showMoreMarkets && (
          <div className="mt-4 pt-4 border-t border-border">
            <MarketsList
              markets={additionalMarketsFormatted}
              selectedOdds={selectedOdds}
              onSelectOption={handleSelectOption}
              isLoading={isLoadingMarkets}
            />
          </div>
        )}
      </div>

      {/* Footer with "More Markets" button */}
      <div className="px-4 pb-4">
        <MatchCardFooter
          showMoreMarkets={showMoreMarkets}
          onToggleMarkets={handleToggleMarkets}
          isLoadingMarkets={isLoadingMarkets}
        />
      </div>
    </div>
  );
};

export default UpcomingMatchCard;
