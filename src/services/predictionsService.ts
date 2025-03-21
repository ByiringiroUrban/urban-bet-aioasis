
import { supabase } from '@/lib/supabase';
import { AIprediction } from './database/types';

// Mock predictions data
const mockPredictions = [
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

// AI Predictions
export const getAIPredictions = async (userId: string): Promise<AIprediction[]> => {
  try {
    // Try to fetch from Supabase
    const { data, error } = await supabase
      .from('ai_predictions')
      .select('*')
      .eq('userId', userId);
    
    if (error || !data || data.length === 0) {
      console.log('Using mock AI predictions data');
      // Return mock data
      await new Promise(resolve => setTimeout(resolve, 700));
      return mockPredictions;
    }
    
    // Return actual data
    return data as AIprediction[];
  } catch (error) {
    console.error('Error fetching AI predictions:', error);
    return mockPredictions;
  }
};
