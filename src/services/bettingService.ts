
import { ObjectId } from 'mongodb';
import { connectToDatabase } from './database/dbConnection';
import { BetRecord } from './database/types';

export const bettingService = {
  // Save a bet to MongoDB
  saveBet: async (betData: Omit<BetRecord, 'id'>): Promise<{ success: boolean; id?: string }> => {
    try {
      console.log('Saving bet to MongoDB:', betData);
      
      const db = await connectToDatabase();
      
      // If db connection failed, use mock implementation
      if (!db) {
        // Mock implementation for fallback
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
          success: true,
          id: new ObjectId().toString()
        };
      }
      
      const collection = db.collection('bets');
      const result = await collection.insertOne({
        ...betData,
        _id: new ObjectId()
      });
      
      return {
        success: true,
        id: result.insertedId.toString()
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
      
      const db = await connectToDatabase();
      
      // If db connection failed, use mock implementation
      if (!db) {
        // Mock data for fallback
        await new Promise(resolve => setTimeout(resolve, 600));
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
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
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
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
            status: 'won',
            currency: 'RWF'
          },
          {
            id: '3',
            userId,
            items: [
              {
                event: 'PSG vs Bayern Munich',
                selection: 'Bayern Munich to win',
                odds: 2.4
              },
              {
                event: 'Manchester City vs Liverpool',
                selection: 'Over 2.5 goals',
                odds: 1.8
              }
            ],
            totalOdds: 4.32,
            amount: 7500, // RWF
            potentialWinnings: 32400, // RWF
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
            status: 'lost',
            currency: 'RWF'
          }
        ];
      }
      
      const collection = db.collection('bets');
      const bets = await collection.find({ userId }).sort({ timestamp: -1 }).toArray();
      
      return bets.map(bet => ({
        id: bet._id.toString(),
        userId: bet.userId,
        items: bet.items,
        totalOdds: bet.totalOdds,
        amount: bet.amount,
        potentialWinnings: bet.potentialWinnings,
        timestamp: bet.timestamp,
        status: bet.status,
        currency: bet.currency || 'RWF'
      }));
    } catch (error) {
      console.error('Error fetching bet history from MongoDB:', error);
      return [];
    }
  }
};
