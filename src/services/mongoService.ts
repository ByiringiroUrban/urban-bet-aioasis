
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
      
      // Mock data that would come from MongoDB
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
          amount: 10,
          potentialWinnings: 21,
          timestamp: new Date().toISOString(),
          status: 'pending'
        }
      ];
    } catch (error) {
      console.error('Error fetching bet history from MongoDB:', error);
      return [];
    }
  }
};
