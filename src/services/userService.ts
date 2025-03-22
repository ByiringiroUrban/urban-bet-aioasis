
import { supabase } from '@/lib/supabase';
import { UserData } from './database/types';

// Save or update user profile
export const saveUser = async (userData: UserData): Promise<boolean> => {
  try {
    if (!userData.id) {
      console.error('User ID is required');
      return false;
    }

    // Check if user exists in profiles
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.id)
      .single();

    if (existingUser) {
      // Update existing user
      const { error } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          email: userData.email,
          currency: userData.currency,
          updated_at: new Date().toISOString()
        })
        .eq('id', userData.id);

      if (error) throw error;
    } else {
      // Insert new user
      const { error } = await supabase
        .from('profiles')
        .insert([{
          id: userData.id,
          name: userData.name,
          email: userData.email,
          balance: userData.balance || 50000,
          currency: userData.currency || 'RWF',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;
    }

    return true;
  } catch (error) {
    console.error('Error saving user:', error);
    return false;
  }
};

// Get user profile by ID
export const getUser = async (userId: string): Promise<UserData | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('User not found, will create profile on first login');
        return null;
      }
      throw error;
    }

    return data as UserData;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};
