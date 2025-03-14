
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Trash2, X, ChevronDown, ChevronUp } from "lucide-react";

interface BetItem {
  id: string;
  event: string;
  selection: string;
  odds: number;
}

export default function BettingSlip() {
  const [isOpen, setIsOpen] = useState(false);
  const [betAmount, setBetAmount] = useState<string>("");
  const [betItems, setBetItems] = useState<BetItem[]>([
    {
      id: "1",
      event: "Chelsea vs Arsenal",
      selection: "Chelsea to win",
      odds: 2.1
    },
    {
      id: "2",
      event: "Lakers vs Warriors",
      selection: "Over 210.5 points",
      odds: 1.9
    }
  ]);

  const removeBet = (id: string) => {
    setBetItems(betItems.filter(bet => bet.id !== id));
  };

  const toggleOpen = () => setIsOpen(!isOpen);

  const calculateTotalOdds = (): string => {
    if (betItems.length === 0) return "0";
    return betItems.reduce((acc, bet) => acc * bet.odds, 1).toFixed(2);
  };

  const calculatePotentialWinnings = () => {
    const amount = parseFloat(betAmount) || 0;
    const totalOdds = parseFloat(calculateTotalOdds());
    return (amount * totalOdds).toFixed(2);
  };

  return (
    <div className="fixed bottom-0 right-0 z-40 w-full md:w-80 md:mr-4 md:mb-4 md:rounded-lg glass border border-bet-primary/20 shadow-lg">
      {/* Mobile Toggle Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer md:hidden"
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
        <CardHeader className="hidden md:block px-4 py-3 border-b border-border">
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
                <div key={bet.id} className="bg-muted rounded-lg p-3 relative">
                  <button 
                    className="absolute top-2 right-2 text-muted-foreground hover:text-bet-danger transition-colors"
                    onClick={() => removeBet(bet.id)}
                  >
                    <X size={16} />
                  </button>
                  <div className="text-sm font-medium">{bet.event}</div>
                  <div className="text-sm text-muted-foreground">{bet.selection}</div>
                  <div className="mt-1 text-sm font-semibold text-bet-primary">
                    Odds: {bet.odds}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Your betting slip is empty. Select some odds to start betting.
            </div>
          )}
        </CardContent>
        
        {betItems.length > 0 && (
          <CardFooter className="flex flex-col p-4 border-t border-border space-y-3">
            <div className="flex justify-between w-full">
              <span className="text-sm">Total Odds:</span>
              <span className="font-semibold">{calculateTotalOdds()}</span>
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
                className="flex-1 border-bet-danger text-bet-danger hover:bg-bet-danger/10"
                onClick={() => setBetItems([])}
              >
                <Trash2 size={16} className="mr-1" /> Clear
              </Button>
              <Button 
                size="sm" 
                className="flex-1 bg-bet-primary hover:bg-bet-primary/90"
                disabled={!betAmount || parseFloat(betAmount) <= 0}
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
