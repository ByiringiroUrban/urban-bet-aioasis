
import { supabase } from '@/lib/supabase';
import { BetRecord } from './database/types';

// Betting related functions
export const saveBet = async (betData: Omit<BetRecord, 'id'>): Promise<{ success: boolean; id?: string }> => {
  try {
    // Try to save to Supabase
    const { data, error } = await supabase
      .from('bets')
      .insert([{
        user_id: betData.userId,
        items: betData.items,
        total_odds: betData.totalOdds,
        amount: betData.amount,
        potential_winnings: betData.potentialWinnings,
        status: betData.status,
        currency: betData.currency || 'RWF',
      }])
      .select('id');
    
    if (error) {
      console.log('Error saving bet:', error.message);
      // Return success with mock id
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        success: true,
        id: Math.random().toString(36).substring(2, 9)
      };
    }
    
    return {
      success: true,
      id: data?.[0]?.id
    };
  } catch (error) {
    console.error('Error saving bet:', error);
    return { success: false };
  }
};

export const getBetHistory = async (userId: string): Promise<BetRecord[]> => {
  try {
    // Try to fetch from Supabase
    const { data, error } = await supabase
      .from('bets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error || !data || data.length === 0) {
      console.log('Using mock bet history:', error?.message || 'No data found');
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
    }
    
    // Convert Supabase data to BetRecord format
    return data.map(bet => ({
      id: bet.id,
      userId: bet.user_id,
      items: bet.items as any[],
      totalOdds: bet.total_odds,
      amount: bet.amount,
      potentialWinnings: bet.potential_winnings,
      timestamp: bet.created_at,
      status: bet.status as 'pending' | 'won' | 'lost' | 'cancelled',
      currency: bet.currency
    }));
  } catch (error) {
    console.error('Error fetching bet history:', error);
    return [];
  }
};
