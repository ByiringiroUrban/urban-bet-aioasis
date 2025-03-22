
import React, { createContext, useState, useContext, ReactNode } from "react";
import { toast } from "sonner";
import { isAuthenticated } from "@/utils/authUtils";
import { saveBet } from "@/services/bettingService";

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
  currency: "USD" | "RWF";
  setCurrency: (currency: "USD" | "RWF") => void;
  exchangeRate: number;
  convertAmount: (amount: number, from: "USD" | "RWF", to: "USD" | "RWF") => number;
}

const BettingContext = createContext<BettingContextType | undefined>(undefined);

export const BettingProvider = ({ children }: { children: ReactNode }) => {
  const [betItems, setBetItems] = useState<BetItem[]>([]);
  const [currency, setCurrency] = useState<"USD" | "RWF">("RWF");
  // Exchange rate: 1 USD = 1200 RWF
  const exchangeRate = 1200;
  
  const convertAmount = (amount: number, from: "USD" | "RWF", to: "USD" | "RWF"): number => {
    if (from === to) return amount;
    return from === "USD" ? amount * exchangeRate : amount / exchangeRate;
  };

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
      // Get user ID or use a default if not logged in
      const userId = isAuthenticated() ? localStorage.getItem("userToken") || "guest" : "guest";
      
      // Prepare bet data
      const totalOdds = betItems.reduce((acc, bet) => acc * bet.odds, 1);
      const betData = {
        userId,
        items: betItems.map(({id, ...item}) => item), // Remove client-side ID
        totalOdds,
        amount: currency === "USD" ? convertAmount(amount, "USD", "RWF") : amount,
        potentialWinnings: currency === "USD" 
          ? convertAmount(amount * totalOdds, "USD", "RWF") 
          : amount * totalOdds,
        timestamp: new Date().toISOString(),
        status: 'pending' as const,
        currency: currency
      };

      // Save bet to Supabase
      const result = await saveBet(betData);
      
      if (result.success) {
        toast.success("Bet placed successfully!");
        clearBets();
      } else {
        throw new Error("Failed to save bet");
      }
    } catch (error) {
      console.error("Error placing bet:", error);
      toast.error("Failed to place bet. Please try again.");
    }
  };

  return (
    <BettingContext.Provider value={{ 
      betItems, 
      addBet, 
      removeBet, 
      clearBets, 
      placeBet,
      currency,
      setCurrency,
      exchangeRate,
      convertAmount
    }}>
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
