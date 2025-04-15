
import { supabase } from '@/integrations/supabase/client';
import { AIprediction } from './database/types';

export const getAIPredictions = async (userId: string): Promise<AIprediction[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_predictions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching AI predictions:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAIPredictions:', error);
    throw error;
  }
};

export const generatePrediction = async (matchData: {
  match: string;
  teams: string[];
  history?: string;
  currentForm?: string;
}) => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-match-prediction', {
      body: matchData
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error generating prediction:', error);
    throw error;
  }
};
