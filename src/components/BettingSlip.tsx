
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, X, ChevronDown, ChevronUp, CircleDollarSign, Info } from "lucide-react";
import { useBetting } from "@/contexts/BettingContext";
import { cn } from "@/lib/utils";
import { isAuthenticated } from "@/utils/authUtils";
import { useToast } from "@/hooks/use-toast";

export default function BettingSlip() {
  const [isOpen, setIsOpen] = useState(false);
  const [betAmount, setBetAmount] = useState<string>("");
  const { 
    betItems, 
    removeBet, 
    clearBets, 
    placeBet, 
    currency,
    setCurrency,
    convertAmount 
  } = useBetting();
  const { toast } = useToast();

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
    if (!isAuthenticated()) {
      toast({
        title: "Please log in to place a bet",
        description: "Create an account or log in to place bets.",
        variant: "destructive",
      });
      return;
    }
    
    if (parseFloat(betAmount) <= 0 || isNaN(parseFloat(betAmount))) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid bet amount",
        variant: "destructive",
      });
      return;
    }
    
    const minBet = currency === "RWF" ? 1000 : 1;
    if (parseFloat(betAmount) < minBet) {
      toast({
        title: "Minimum bet required",
        description: `Minimum bet amount is ${currency === "RWF" ? "RWF 1,000" : "$1"}`,
        variant: "destructive",
      });
      return;
    }
    
    await placeBet(parseFloat(betAmount));
    setBetAmount("");
  };

  const toggleCurrency = () => {
    setCurrency(currency === "USD" ? "RWF" : "USD");
    if (betAmount) {
      const amount = parseFloat(betAmount);
      if (!isNaN(amount)) {
        setBetAmount(convertAmount(amount, currency, currency === "USD" ? "RWF" : "USD").toFixed(0));
      }
    }
  };

  useEffect(() => {
    if (betItems.length > 0 && !isOpen) {
      setIsOpen(true);
    }
  }, [betItems.length]);

  return (
    <div className="fixed bottom-0 right-0 z-40 w-full md:w-80 md:mr-4 md:mb-4 md:rounded-lg glass border border-bet-primary/30 shadow-lg transition-all duration-300">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer md:hidden bg-bet-dark-accent rounded-t-lg"
        onClick={toggleOpen}
      >
        <div className="flex items-center space-x-2">
          <span className="font-medium">Betting Slip</span>
          <Badge 
            variant="outline" 
            className="bg-bet-primary/20 text-bet-primary border-bet-primary/30 hover:bg-bet-primary/30"
          >
            {betItems.length}
          </Badge>
        </div>
        {isOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
      </div>

      <div className={`${isOpen ? 'block' : 'hidden md:block'}`}>
        <CardHeader className="hidden md:block px-4 py-3 border-b border-border bg-bet-dark-accent rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center">
              Betting Slip
              <Badge 
                variant="outline" 
                className="ml-2 bg-bet-primary/20 text-bet-primary border-bet-primary/30 hover:bg-bet-primary/30"
              >
                {betItems.length}
              </Badge>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs font-normal"
              onClick={toggleCurrency}
            >
              {currency === "RWF" ? "RWF" : "USD"}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 max-h-[60vh] overflow-y-auto">
          {betItems.length > 0 ? (
            <div className="space-y-3">
              {betItems.map(bet => (
                <div 
                  key={bet.id} 
                  className="relative rounded-lg p-3 border border-border/50 group transition-all hover:border-bet-primary/30 bg-gradient-to-br from-transparent to-bet-primary/5"
                >
                  <button 
                    className="absolute top-2 right-2 text-muted-foreground hover:text-bet-danger transition-colors"
                    onClick={() => removeBet(bet.id)}
                  >
                    <X size={16} className="opacity-70 group-hover:opacity-100" />
                  </button>
                  <div className="text-sm font-medium">{bet.event}</div>
                  <div className="text-sm text-muted-foreground">{bet.selection}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Odds</span>
                    <span className="text-sm font-semibold bg-gradient-to-r from-bet-primary to-bet-accent bg-clip-text text-transparent">
                      {bet.odds.toFixed(2)}
                    </span>
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
              <div className="flex justify-between mb-1">
                <span className="text-sm">Bet Amount:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 px-2 text-xs font-normal -mr-2"
                  onClick={toggleCurrency}
                >
                  {currency}
                </Button>
              </div>
              <Input
                type="number"
                min="1"
                placeholder={`Enter amount in ${currency}`}
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-full"
              />
              {currency === "RWF" && (
                <p className="text-xs text-muted-foreground mt-1">Min: 1,000 RWF</p>
              )}
            </div>
            
            {betAmount && (
              <div className="flex justify-between w-full">
                <span className="text-sm">Potential Winnings:</span>
                <span className="font-semibold text-bet-secondary">
                  {currency === "RWF" ? "RWF " : "$"}
                  {calculatePotentialWinnings()}
                </span>
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
                disabled={!betAmount || parseFloat(betAmount) <= 0 || betItems.length === 0 || !isAuthenticated()}
                onClick={handlePlaceBet}
              >
                Place Bet
              </Button>
            </div>
            
            {!isAuthenticated() && (
              <div className="flex items-center mt-2 p-2 rounded-md bg-bet-primary/10 border border-bet-primary/20 text-xs">
                <Info size={14} className="text-bet-primary mr-2 shrink-0" />
                <span>Please log in to place bets</span>
              </div>
            )}
          </CardFooter>
        )}
      </div>
    </div>
  );
}
