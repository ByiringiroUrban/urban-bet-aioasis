
import { supabase } from '@/integrations/supabase/client';
import { AIprediction } from './database/types';

// Get AI predictions for a user
export const getAIPredictions = async (userId: string): Promise<AIprediction[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_predictions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error || !data || data.length === 0) {
      // Return mock data
      return [
        {
          id: '1',
          match: 'Liverpool vs Manchester United',
          prediction: 'Liverpool to win',
          confidence: 78,
          analysis: 'Liverpool\'s strong home record and current form gives them the edge.',
          trend: 'upward',
          odds: '1.85',
          userId
        },
        {
          id: '2',
          match: 'Real Madrid vs Barcelona',
          prediction: 'Over 2.5 goals',
          confidence: 82,
          analysis: 'El Clasico matches have averaged 3.2 goals in the last 10 meetings.',
          trend: 'stable',
          odds: '1.75',
          userId
        }
      ];
    }
    
    // Convert Supabase data to AIprediction format
    return data.map(prediction => ({
      id: prediction.id,
      match: prediction.match,
      prediction: prediction.prediction,
      confidence: prediction.confidence,
      analysis: prediction.analysis,
      trend: prediction.trend,
      odds: prediction.odds,
      userId: prediction.user_id
    }));
  } catch (error) {
    console.error('Error fetching AI predictions:', error);
    // Return mock data
    return [
      {
        id: '1',
        match: 'Liverpool vs Manchester United',
        prediction: 'Liverpool to win',
        confidence: 78,
        analysis: 'Liverpool\'s strong home record and current form gives them the edge.',
        trend: 'upward',
        odds: '1.85',
        userId
      },
      {
        id: '2',
        match: 'Real Madrid vs Barcelona',
        prediction: 'Over 2.5 goals',
        confidence: 82,
        analysis: 'El Clasico matches have averaged 3.2 goals in the last 10 meetings.',
        trend: 'stable',
        odds: '1.75',
        userId
      }
    ];
  }
};
