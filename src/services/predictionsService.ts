
import { connectToDatabase } from './database/dbConnection';
import { AIprediction } from './database/types';

export const predictionsService = {
  // Get AI predictions for a user
  getAIPredictions: async (userId: string): Promise<AIprediction[]> => {
    try {
      console.log('Fetching AI predictions for user:', userId);
      
      const db = await connectToDatabase();
      
      // If db connection failed, use mock implementation
      if (!db) {
        await new Promise(resolve => setTimeout(resolve, 700));
        return [
          {
            id: 'p1',
            match: 'Arsenal vs Liverpool',
            prediction: 'Arsenal to win',
            confidence: 75,
            analysis: 'Arsenal has won 4 out of their last 5 home games against Liverpool',
            trend: 'Arsenal winning streak at home',
            odds: '1.95'
          },
          {
            id: 'p2',
            match: 'PSG vs Bayern Munich',
            prediction: 'Over 2.5 goals',
            confidence: 82,
            analysis: 'Both teams have scored in the last 7 encounters',
            trend: 'High scoring matches in Champions League',
            odds: '1.75'
          },
          {
            id: 'p3',
            match: 'Manchester City vs Liverpool',
            prediction: 'Both teams to score: Yes',
            confidence: 88,
            analysis: 'Both teams have scored in the last 9 out of 10 matches between them',
            trend: 'High scoring games in Premier League',
            odds: '1.65'
          }
        ];
      }
      
      const collection = db.collection('predictions');
      const predictions = await collection.find({ userId }).toArray();
      
      return predictions.map(prediction => ({
        id: prediction._id.toString(),
        match: prediction.match,
        prediction: prediction.prediction,
        confidence: prediction.confidence,
        analysis: prediction.analysis,
        trend: prediction.trend,
        odds: prediction.odds
      }));
    } catch (error) {
      console.error('Error fetching AI predictions:', error);
      return [];
    }
  }
};
