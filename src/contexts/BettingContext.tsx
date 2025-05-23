
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { BetItem } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface BettingContextType {
  betSlip: BetItem[];
  addBet: (bet: Omit<BetItem, 'id'>) => void;
  removeBet: (betId: string) => void;
  clearBetSlip: () => void;
  placeBet: (stake: number) => Promise<boolean>;
  isBetInSlip: (betId: string) => boolean;
  totalOdds: number;
  // Add these missing properties
  betItems: BetItem[];
  clearBets: () => void;
  currency: 'USD' | 'RWF';
  setCurrency: (currency: 'USD' | 'RWF') => void;
  convertAmount: (amount: number, from: 'USD' | 'RWF', to: 'USD' | 'RWF') => number;
}

const BettingContext = createContext<BettingContextType | undefined>(undefined);

export const BettingProvider = ({ children }: { children: ReactNode }) => {
  const [betSlip, setBetSlip] = useState<BetItem[]>([]);
  const [currency, setCurrency] = useState<'USD' | 'RWF'>('USD');
  const { toast } = useToast();
  
  // Convert between USD and RWF
  const convertAmount = (amount: number, from: 'USD' | 'RWF', to: 'USD' | 'RWF'): number => {
    // Using an exchange rate of 1 USD = 1200 RWF
    const rate = 1200;
    
    if (from === 'USD' && to === 'RWF') {
      return amount * rate;
    } else if (from === 'RWF' && to === 'USD') {
      return amount / rate;
    }
    
    return amount; // Same currency, no conversion needed
  };
  
  // Add a bet to the bet slip
  const addBet = (bet: Omit<BetItem, 'id'>) => {
    // Generate a unique ID for the bet
    const newBet: BetItem = {
      ...bet,
      id: `${bet.event}-${bet.selection}-${Date.now()}`,
    };
    
    // Check if we already have this selection
    const existingBetIndex = betSlip.findIndex(
      (item) => item.event === bet.event && item.selection === bet.selection
    );
    
    if (existingBetIndex !== -1) {
      // Replace the existing bet
      const updatedSlip = [...betSlip];
      updatedSlip[existingBetIndex] = newBet;
      setBetSlip(updatedSlip);
      
      toast({
        title: "Bet Updated",
        description: `Updated odds for ${bet.selection}`,
      });
    } else {
      // Add new bet
      setBetSlip((prevBets) => [...prevBets, newBet]);
      
      toast({
        title: "Bet Added",
        description: `${bet.selection} added to bet slip`,
      });
    }
  };
  
  // Remove a bet from the slip
  const removeBet = (betId: string) => {
    setBetSlip((prevBets) => prevBets.filter((bet) => bet.id !== betId));
    
    toast({
      title: "Bet Removed",
      description: "Selection removed from bet slip",
    });
  };
  
  // Clear the entire bet slip
  const clearBetSlip = () => {
    setBetSlip([]);
    
    toast({
      title: "Bet Slip Cleared",
      description: "All selections have been removed",
    });
  };
  
  // Alias for clearBetSlip to maintain backward compatibility
  const clearBets = clearBetSlip;
  
  // Place the bet (mock implementation)
  const placeBet = async (stake: number): Promise<boolean> => {
    try {
      // Here we would normally call an API to place the bet
      console.log("Placing bet with stake:", stake, "and selections:", betSlip);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Clear bet slip after successful bet
      clearBetSlip();
      
      toast({
        title: "Bet Placed Successfully",
        description: `Your bet of ${currency === 'USD' ? '$' : 'RWF '}${stake.toFixed(2)} has been placed!`,
      });
      
      return true;
    } catch (error) {
      console.error("Error placing bet:", error);
      
      toast({
        title: "Error Placing Bet",
        description: "There was a problem placing your bet. Please try again.",
        variant: "destructive",
      });
      
      return false;
    }
  };
  
  // Check if a bet is already in the slip
  const isBetInSlip = (betId: string): boolean => {
    return betSlip.some((bet) => bet.id === betId);
  };
  
  // Calculate total odds
  const totalOdds = betSlip.reduce((acc, bet) => acc * bet.odds, 1);
  
  return (
    <BettingContext.Provider
      value={{
        betSlip,
        addBet,
        removeBet,
        clearBetSlip,
        placeBet,
        isBetInSlip,
        totalOdds,
        // Add the new properties to the context value
        betItems: betSlip, // Alias for betSlip
        clearBets, // Alias for clearBetSlip
        currency,
        setCurrency,
        convertAmount,
      }}
    >
      {children}
    </BettingContext.Provider>
  );
};

export const useBetting = () => {
  const context = useContext(BettingContext);
  if (context === undefined) {
    throw new Error('useBetting must be used within a BettingProvider');
  }
  return context;
};
