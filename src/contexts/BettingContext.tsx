import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { isAuthenticated } from "@/utils/authUtils";
import { saveBet } from "@/services/bettingService";

export interface BetItem {
  id: string;
  event: string;
  selection: string;
  odds: number;
  eventId?: string;
  matchName?: string;
  marketName?: string;
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
  selections?: any[];
  addToBetSlip?: (selection: any) => void;
}

// Global context instance for testing if we're already inside a provider
let isBettingProviderMounted = false;

const BettingContext = createContext<BettingContextType | undefined>(undefined);

interface BettingProviderProps {
  children: ReactNode;
  isRoot?: boolean;
}

// Local storage keys
const BET_ITEMS_STORAGE_KEY = 'urbanbet_betslip';
const CURRENCY_STORAGE_KEY = 'urbanbet_currency';

export const BettingProvider = ({ children, isRoot = false }: BettingProviderProps) => {
  React.useEffect(() => {
    if (isRoot) {
      isBettingProviderMounted = true;
      return () => {
        isBettingProviderMounted = false;
      };
    }
  }, [isRoot]);

  // Add a check for existing context to avoid nesting warnings
  const existingContext = useContext(BettingContext);
  
  // If we already have a context and this is not the root provider, just return the children
  if (existingContext !== undefined && !isRoot) {
    return <>{children}</>;
  }

  // Initialize state from localStorage if available
  const [betItems, setBetItems] = useState<BetItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedBets = localStorage.getItem(BET_ITEMS_STORAGE_KEY);
      return savedBets ? JSON.parse(savedBets) : [];
    }
    return [];
  });
  
  const [currency, setCurrency] = useState<"USD" | "RWF">(() => {
    if (typeof window !== 'undefined') {
      const savedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY);
      return (savedCurrency === 'USD' || savedCurrency === 'RWF') ? savedCurrency : 'RWF';
    }
    return 'RWF';
  });
  
  // Exchange rate: 1 USD = 1200 RWF
  const exchangeRate = 1200;
  
  // Save to localStorage whenever bets or currency change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(BET_ITEMS_STORAGE_KEY, JSON.stringify(betItems));
    }
  }, [betItems]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
    }
  }, [currency]);
  
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

  const addToBetSlip = (selection: any) => {
    addBet({
      event: selection.matchName,
      selection: `${selection.marketName}: ${selection.selection}`,
      odds: selection.odds,
      eventId: selection.eventId,
      marketName: selection.marketName,
    });
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
      addToBetSlip,
      selections: betItems,
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

export const BettingProviderRoot = ({ children }: { children: ReactNode }) => {
  // This is the root provider that should be used only once in the app
  return (
    <BettingProvider isRoot={true}>
      {children}
    </BettingProvider>
  );
};

export const useBetting = () => {
  const context = useContext(BettingContext);
  
  // More graceful error handling - either we get the context, or we get a mock context
  // that does nothing but doesn't crash the app
  if (context === undefined) {
    console.warn("useBetting hook used outside of BettingProvider. Some functionality will be limited.");
    
    // Return a placeholder implementation that doesn't crash
    return {
      betItems: [],
      addBet: () => {
        console.warn("Betting functionality unavailable - addBet called outside BettingProvider");
        toast.error("Unable to add bet - please refresh the page");
      },
      addToBetSlip: () => {
        console.warn("Betting functionality unavailable - addToBetSlip called outside BettingProvider");
        toast.error("Unable to add bet - please refresh the page");
      },
      selections: [],
      removeBet: () => {
        console.warn("Betting functionality unavailable - removeBet called outside BettingProvider");
      },
      clearBets: () => {
        console.warn("Betting functionality unavailable - clearBets called outside BettingProvider");
      },
      placeBet: async () => {
        console.warn("Betting functionality unavailable - placeBet called outside BettingProvider");
        toast.error("Unable to place bet - please refresh the page");
      },
      currency: "RWF" as const,
      setCurrency: () => {
        console.warn("Betting functionality unavailable - setCurrency called outside BettingProvider");
      },
      exchangeRate: 1200,
      convertAmount: (amount: number) => amount,
    };
  }
  
  return context;
};
