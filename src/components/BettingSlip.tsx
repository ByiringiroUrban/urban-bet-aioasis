
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Trash2, X, ChevronDown, ChevronUp, CircleDollarSign } from "lucide-react";
import { useBetting } from "@/contexts/BettingContext";
import { cn } from "@/lib/utils";

export default function BettingSlip() {
  const [isOpen, setIsOpen] = useState(false);
  const [betAmount, setBetAmount] = useState<string>("");
  const { betItems, removeBet, clearBets, placeBet } = useBetting();

  const toggleOpen = () => setIsOpen(!isOpen);

  const calculateTotalOdds = (): string => {
    if (betItems.length === 0) return "0.00";
    return betItems.reduce((acc, bet) => acc * bet.odds, 1).toFixed(2);
  };

  const calculatePotentialWinnings = () => {
    const amount = parseFloat(betAmount) || 0;
    const totalOdds = parseFloat(calculateTotalOdds());
    return (amount * totalOdds).toFixed(2);
  };

  const handlePlaceBet = async () => {
    await placeBet(parseFloat(betAmount));
    setBetAmount("");
  };

  return (
    <div className="fixed bottom-0 right-0 z-40 w-full md:w-80 md:mr-4 md:mb-4 md:rounded-lg glass border border-bet-primary/20 shadow-lg transition-all duration-300">
      {/* Mobile Toggle Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer md:hidden bg-bet-dark-accent rounded-t-lg"
        onClick={toggleOpen}
      >
        <div className="flex items-center space-x-2">
          <span className="font-medium">Betting Slip</span>
          <span className="bg-bet-primary/20 text-bet-primary px-2 py-0.5 rounded-full text-xs">
            {betItems.length}
          </span>
        </div>
        {isOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
      </div>

      {/* Content (always visible on desktop, toggleable on mobile) */}
      <div className={`${isOpen ? 'block' : 'hidden md:block'}`}>
        <CardHeader className="hidden md:block px-4 py-3 border-b border-border bg-bet-dark-accent rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center">
              Betting Slip
              <span className="ml-2 bg-bet-primary/20 text-bet-primary px-2 py-0.5 rounded-full text-xs">
                {betItems.length}
              </span>
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 max-h-[60vh] overflow-y-auto">
          {betItems.length > 0 ? (
            <div className="space-y-3">
              {betItems.map(bet => (
                <div 
                  key={bet.id} 
                  className="bg-muted rounded-lg p-3 relative border border-border/50 group transition-all hover:border-bet-primary/30"
                >
                  <button 
                    className="absolute top-2 right-2 text-muted-foreground hover:text-bet-danger transition-colors"
                    onClick={() => removeBet(bet.id)}
                  >
                    <X size={16} className="opacity-70 group-hover:opacity-100" />
                  </button>
                  <div className="text-sm font-medium">{bet.event}</div>
                  <div className="text-sm text-muted-foreground">{bet.selection}</div>
                  <div className="mt-1 text-sm font-semibold bg-gradient-to-r from-bet-primary to-bet-accent bg-clip-text text-transparent">
                    Odds: {bet.odds.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
              <CircleDollarSign className="text-bet-primary/40" size={32} />
              <p>Your betting slip is empty. Select some odds to start betting.</p>
            </div>
          )}
        </CardContent>
        
        {betItems.length > 0 && (
          <CardFooter className="flex flex-col p-4 border-t border-border space-y-3">
            <div className="flex justify-between w-full">
              <span className="text-sm">Total Odds:</span>
              <span className="font-semibold bg-gradient-to-r from-bet-primary to-bet-accent bg-clip-text text-transparent">
                {calculateTotalOdds()}
              </span>
            </div>
            
            <div className="w-full">
              <div className="text-sm mb-1">Bet Amount:</div>
              <Input
                type="number"
                min="1"
                placeholder="Enter amount"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-full"
              />
            </div>
            
            {betAmount && (
              <div className="flex justify-between w-full">
                <span className="text-sm">Potential Winnings:</span>
                <span className="font-semibold text-bet-secondary">${calculatePotentialWinnings()}</span>
              </div>
            )}
            
            <div className="flex w-full space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className={cn(
                  "flex-1 border-bet-danger/70 text-bet-danger hover:bg-bet-danger/10 transition-all",
                  betItems.length === 0 && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => clearBets()}
                disabled={betItems.length === 0}
              >
                <Trash2 size={16} className="mr-1" /> Clear
              </Button>
              <Button 
                size="sm" 
                className="flex-1 bg-bet-primary hover:bg-bet-primary/90 transition-all"
                disabled={!betAmount || parseFloat(betAmount) <= 0 || betItems.length === 0}
                onClick={handlePlaceBet}
              >
                Place Bet
              </Button>
            </div>
          </CardFooter>
        )}
      </div>
    </div>
  );
}
