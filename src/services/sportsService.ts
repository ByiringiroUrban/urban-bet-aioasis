
import { connectToDatabase } from './database/dbConnection';
import { Market } from './database/types';

export const sportsService = {
  // Get all available sports
  getSports: async (): Promise<string[]> => {
    try {
      const db = await connectToDatabase();
      
      // If db connection failed, use mock implementation
      if (!db) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return ['Football', 'Basketball', 'Tennis', 'Rugby', 'Cricket', 'eSports'];
      }
      
      const collection = db.collection('sports');
      const sports = await collection.find({}).toArray();
      
      return sports.map(sport => sport.name);
    } catch (error) {
      console.error('Error fetching sports from MongoDB:', error);
      return ['Football', 'Basketball']; // fallback
    }
  },
  
  // Get available markets for an event
  getMarkets: async (eventId: string): Promise<Market[]> => {
    try {
      console.log('Fetching markets for event:', eventId);
      
      const db = await connectToDatabase();
      
      // If db connection failed, use mock implementation
      if (!db) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
          { id: 'm1', name: 'Match Result', options: ['Home Win', 'Draw', 'Away Win'] },
          { id: 'm2', name: 'Both Teams To Score', options: ['Yes', 'No'] },
          { id: 'm3', name: 'Over/Under 2.5 Goals', options: ['Over', 'Under'] },
          { id: 'm4', name: 'First Goal Scorer', options: ['Player 1', 'Player 2', 'No Goal'] },
        ];
      }
      
      const collection = db.collection('markets');
      const markets = await collection.find({ eventId }).toArray();
      
      return markets.map(market => ({
        id: market._id.toString(),
        name: market.name,
        options: market.options
      }));
    } catch (error) {
      console.error('Error fetching markets from MongoDB:', error);
      return [];
    }
  }
};
