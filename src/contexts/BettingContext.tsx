
import React, { createContext, useState, useContext, ReactNode } from "react";
import { toast } from "sonner";

export interface BetItem {
  id: string;
  event: string;
  selection: string;
  odds: number;
}

interface BettingContextType {
  betItems: BetItem[];
  addBet: (bet: Omit<BetItem, "id">) => void;
  removeBet: (id: string) => void;
  clearBets: () => void;
  placeBet: (amount: number) => Promise<void>;
}

const BettingContext = createContext<BettingContextType | undefined>(undefined);

export const BettingProvider = ({ children }: { children: ReactNode }) => {
  const [betItems, setBetItems] = useState<BetItem[]>([]);

  const addBet = (bet: Omit<BetItem, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    // Check if similar bet already exists
    const existingBetIndex = betItems.findIndex(
      (item) => item.event === bet.event && item.selection.includes(bet.selection.split(" ")[0])
    );

    if (existingBetIndex !== -1) {
      // Replace the existing bet
      const updatedBets = [...betItems];
      updatedBets[existingBetIndex] = { ...bet, id };
      setBetItems(updatedBets);
      toast.info("Updated selection in betting slip");
    } else {
      // Add new bet
      setBetItems((prev) => [...prev, { ...bet, id }]);
      toast.success("Added to betting slip");
    }
  };

  const removeBet = (id: string) => {
    setBetItems((prev) => prev.filter((bet) => bet.id !== id));
    toast.info("Removed from betting slip");
  };

  const clearBets = () => {
    setBetItems([]);
    toast.info("Betting slip cleared");
  };

  const placeBet = async (amount: number) => {
    if (betItems.length === 0 || !amount || amount <= 0) {
      toast.error("Please add selections and enter a valid amount");
      return;
    }

    try {
      // In a real application, this would make an API call to MongoDB
      const betData = {
        items: betItems,
        totalOdds: betItems.reduce((acc, bet) => acc * bet.odds, 1),
        amount,
        timestamp: new Date().toISOString(),
        status: "pending"
      };

      // Simulating API call
      console.log("Saving bet to MongoDB:", betData);
      
      // Mock successful DB operation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success("Bet placed successfully!");
      clearBets();
    } catch (error) {
      console.error("Error placing bet:", error);
      toast.error("Failed to place bet. Please try again.");
    }
  };

  return (
    <BettingContext.Provider value={{ betItems, addBet, removeBet, clearBets, placeBet }}>
      {children}
    </BettingContext.Provider>
  );
};

export const useBetting = () => {
  const context = useContext(BettingContext);
  if (context === undefined) {
    throw new Error("useBetting must be used within a BettingProvider");
  }
  return context;
};
