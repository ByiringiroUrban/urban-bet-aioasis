
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MarketOption {
  label: string;
  odds: number;
}

interface Market {
  id: string;
  name: string;
  options: MarketOption[];
}

interface MarketsListProps {
  markets: Market[];
  selectedOdds: string | null;
  onSelectOption: (marketName: string, option: MarketOption) => void;
  isLoading: boolean;
}

const MarketsList = ({ 
  markets, 
  selectedOdds, 
  onSelectOption,
  isLoading 
}: MarketsListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-2">
        <p className="text-sm text-muted-foreground">Loading markets...</p>
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <div className="text-center py-2">
        <p className="text-sm text-muted-foreground">No markets available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {markets.map((market) => (
        <div key={market.id} className="space-y-2">
          <h4 className="text-sm font-medium">{market.name}</h4>
          <div className="grid grid-cols-2 gap-2">
            {market.options.map((option, index) => {
              const selectionKey = `${market.name}: ${option.label}`;
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
                  onClick={() => onSelectOption(market.name, option)}
                >
                  {option.label} <span className="ml-1 text-bet-primary">{option.odds.toFixed(2)}</span>
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MarketsList;
