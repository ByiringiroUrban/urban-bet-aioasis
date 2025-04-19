
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface OddsButtonProps {
  label: string;
  odds: number;
  onClick: () => void;
  disabled?: boolean;
  isSelected?: boolean;
}

const OddsButton = ({
  label,
  odds,
  onClick,
  disabled = false,
  isSelected = false,
}: OddsButtonProps) => {
  // Add a safeguard against undefined odds
  const displayOdds = typeof odds === 'number' && !isNaN(odds) ? odds.toFixed(2) : '0.00';
  
  return (
    <Button
      variant="outline"
      className={cn(
        "flex flex-col items-center justify-center h-auto py-3 w-full transition-all duration-200",
        isSelected ? "border-bet-primary bg-bet-primary/10 text-bet-primary" : "border-border",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:border-bet-primary hover:bg-bet-primary/5 hover:text-bet-primary active:scale-95"
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="text-xs text-muted-foreground mb-1">{label}</span>
      <span
        className={cn("font-bold text-lg", isSelected ? "text-bet-primary" : "")}
      >
        {displayOdds}
      </span>
    </Button>
  );
};

export default OddsButton;
