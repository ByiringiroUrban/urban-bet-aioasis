
// This is a mock MongoDB service for demonstration
// In a real application, this would use a MongoDB client to connect to your database

export interface BetRecord {
  id: string;
  userId: string;
  items: {
    event: string;
    selection: string;
    odds: number;
  }[];
  totalOdds: number;
  amount: number;
  potentialWinnings: number;
  timestamp: string;
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  currency?: 'USD' | 'RWF';
}

// Mock MongoDB operations
export const mongoService = {
  // Save a bet to MongoDB
  saveBet: async (betData: Omit<BetRecord, 'id'>): Promise<{ success: boolean; id?: string }> => {
    try {
      console.log('Saving bet to MongoDB:', betData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would be a call to your MongoDB API
      // For now, we'll just return a success response with a mock ID
      return {
        success: true,
        id: Math.random().toString(36).substring(2, 15)
      };
    } catch (error) {
      console.error('Error saving bet to MongoDB:', error);
      return { success: false };
    }
  },
  
  // Get user's bet history
  getBetHistory: async (userId: string): Promise<BetRecord[]> => {
    try {
      console.log('Fetching bet history for user:', userId);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mock data that would come from MongoDB - with Rwandan currency
      return [
        {
          id: '1',
          userId,
          items: [
            {
              event: 'Arsenal vs Chelsea',
              selection: 'Arsenal to win',
              odds: 2.1
            }
          ],
          totalOdds: 2.1,
          amount: 10000, // RWF
          potentialWinnings: 21000, // RWF
          timestamp: new Date().toISOString(),
          status: 'pending',
          currency: 'RWF'
        },
        {
          id: '2',
          userId,
          items: [
            {
              event: 'Barcelona vs Real Madrid',
              selection: 'Draw',
              odds: 3.25
            }
          ],
          totalOdds: 3.25,
          amount: 5000, // RWF
          potentialWinnings: 16250, // RWF
          timestamp: new Date().toISOString(),
          status: 'won',
          currency: 'RWF'
        }
      ];
    } catch (error) {
      console.error('Error fetching bet history from MongoDB:', error);
      return [];
    }
  },
  
  // Get all available sports
  getSports: async (): Promise<string[]> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return ['Football', 'Basketball', 'Tennis', 'Rugby', 'Cricket', 'eSports'];
    } catch (error) {
      console.error('Error fetching sports from MongoDB:', error);
      return ['Football', 'Basketball']; // fallback
    }
  },
  
  // Get available markets for an event
  getMarkets: async (eventId: string): Promise<any[]> => {
    try {
      console.log('Fetching markets for event:', eventId);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock markets data
      return [
        { id: 'm1', name: 'Match Result', options: ['Home Win', 'Draw', 'Away Win'] },
        { id: 'm2', name: 'Both Teams To Score', options: ['Yes', 'No'] },
        { id: 'm3', name: 'Over/Under 2.5 Goals', options: ['Over', 'Under'] },
        { id: 'm4', name: 'First Goal Scorer', options: ['Player 1', 'Player 2', 'No Goal'] },
      ];
    } catch (error) {
      console.error('Error fetching markets from MongoDB:', error);
      return [];
    }
  }
};
