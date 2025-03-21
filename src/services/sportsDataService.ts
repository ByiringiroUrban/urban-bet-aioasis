
import { supabase } from '@/lib/supabase';
import { Market } from './database/types';

// Mock data for initial app state
const mockSports = ['Football', 'Basketball', 'Tennis', 'Rugby', 'Cricket', 'eSports'];
const mockMarkets = [
  { id: 'm1', name: 'Match Result', options: ['Home Win', 'Draw', 'Away Win'] },
  { id: 'm2', name: 'Both Teams To Score', options: ['Yes', 'No'] },
  { id: 'm3', name: 'Over/Under 2.5 Goals', options: ['Over', 'Under'] },
  { id: 'm4', name: 'First Goal Scorer', options: ['Player 1', 'Player 2', 'No Goal'] },
];

// Sports related functions
export const getSports = async (): Promise<string[]> => {
  try {
    // Try to fetch from Supabase
    const { data, error } = await supabase.from('sports').select('name');
    
    if (error || !data || data.length === 0) {
      console.log('Using mock sports data');
      // Return mock data
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockSports;
    }
    
    // Return actual data from Supabase
    return data.map(sport => sport.name);
  } catch (error) {
    console.error('Error fetching sports:', error);
    return mockSports;
  }
};

export const getMarkets = async (eventId: string): Promise<Market[]> => {
  try {
    // Try to fetch from Supabase
    const { data, error } = await supabase
      .from('markets')
      .select('*')
      .eq('eventId', eventId);
    
    if (error || !data || data.length === 0) {
      console.log('Using mock markets data');
      // Return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockMarkets;
    }
    
    // Return actual data
    return data;
  } catch (error) {
    console.error('Error fetching markets:', error);
    return mockMarkets;
  }
};
