
import { supabase } from '@/lib/supabase';
import { BetRecord, UserData, AIprediction, Market } from './database/types';

// Mock data for initial app state
const mockSports = ['Football', 'Basketball', 'Tennis', 'Rugby', 'Cricket', 'eSports'];
const mockMarkets = [
  { id: 'm1', name: 'Match Result', options: ['Home Win', 'Draw', 'Away Win'] },
  { id: 'm2', name: 'Both Teams To Score', options: ['Yes', 'No'] },
  { id: 'm3', name: 'Over/Under 2.5 Goals', options: ['Over', 'Under'] },
  { id: 'm4', name: 'First Goal Scorer', options: ['Player 1', 'Player 2', 'No Goal'] },
];
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

// Initialize the database with sample data
export const initializeDatabase = async (): Promise<boolean> => {
  try {
    console.log('Initializing Supabase data...');
    
    // Check if tables exist already - if not present, this is just preparation code
    // In a real app, you would create these tables through Supabase dashboard
    
    // Check if we have a connection to Supabase
    const { data, error } = await supabase.from('sports').select('count');
    
    if (error) {
      console.log('Error connecting to Supabase or table not found, using mock data');
      // Return true to continue with mock data
      return true;
    }
    
    console.log('Successfully connected to Supabase');
    return true;
    
  } catch (error) {
    console.error('Error initializing Supabase:', error);
    // Return true to allow app to continue with mock data
    return true;
  }
};

// User related functions
export const saveUser = async (userData: UserData): Promise<{ success: boolean; id?: string }> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert([userData], { onConflict: 'email' })
      .select('id');
      
    if (error) {
      console.error('Error saving user to Supabase:', error);
      return { success: false };
    }
    
    return {
      success: true,
      id: data?.[0]?.id
    };
  } catch (error) {
    console.error('Error saving user:', error);
    return { success: false };
  }
};

export const getUser = async (userId: string): Promise<UserData | null> => {
  try {
    // For mock data return immediately
    return {
      id: userId,
      name: 'Demo User',
      email: 'user@example.com',
      balance: 50000, // RWF
      currency: 'RWF'
    };
    
    // In real implementation, uncomment below:
    /*
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error || !data) {
      console.error('Error fetching user from Supabase:', error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      balance: data.balance || 0,
      currency: data.currency || 'RWF'
    };
    */
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

// Betting related functions
export const saveBet = async (betData: Omit<BetRecord, 'id'>): Promise<{ success: boolean; id?: string }> => {
  try {
    // For demonstration, return success
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: true,
      id: Math.random().toString(36).substring(2, 9)
    };
    
    // In real implementation, uncomment below:
    /*
    const { data, error } = await supabase
      .from('bets')
      .insert([betData])
      .select('id');
      
    if (error) {
      console.error('Error saving bet to Supabase:', error);
      return { success: false };
    }
    
    return {
      success: true,
      id: data?.[0]?.id
    };
    */
  } catch (error) {
    console.error('Error saving bet:', error);
    return { success: false };
  }
};

export const getBetHistory = async (userId: string): Promise<BetRecord[]> => {
  try {
    // Return mock data
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
  } catch (error) {
    console.error('Error fetching bet history:', error);
    return [];
  }
};

// Sports related functions
export const getSports = async (): Promise<string[]> => {
  try {
    // Return mock data
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockSports;
  } catch (error) {
    console.error('Error fetching sports:', error);
    return [];
  }
};

export const getMarkets = async (eventId: string): Promise<Market[]> => {
  try {
    // Return mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockMarkets;
  } catch (error) {
    console.error('Error fetching markets:', error);
    return [];
  }
};

// AI Predictions
export const getAIPredictions = async (userId: string): Promise<AIprediction[]> => {
  try {
    // Return mock data
    await new Promise(resolve => setTimeout(resolve, 700));
    return mockPredictions;
  } catch (error) {
    console.error('Error fetching AI predictions:', error);
    return [];
  }
};

// Export all functions for use in components
export const supabaseService = {
  initializeDatabase,
  saveUser,
  getUser,
  saveBet,
  getBetHistory,
  getSports,
  getMarkets,
  getAIPredictions
};

// Re-export types
export type { BetRecord } from './database/types';
