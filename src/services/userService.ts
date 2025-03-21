
import { supabase } from '@/lib/supabase';
import { UserData } from './database/types';

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
    // Try to fetch from Supabase
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error || !data) {
      console.log('Using mock user data');
      // Return mock data
      return {
        id: userId,
        name: 'Demo User',
        email: 'user@example.com',
        balance: 50000, // RWF
        currency: 'RWF'
      };
    }
    
    // Return actual data
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      balance: data.balance || 0,
      currency: data.currency || 'RWF'
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};
