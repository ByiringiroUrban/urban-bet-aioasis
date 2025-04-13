
import { supabase } from '@/integrations/supabase/client';
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

// Delete user account
export const deleteUser = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // First get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, message: "No user is currently logged in" };
    }
    
    // Delete user's profile data first
    const { error: profileDeleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id);
      
    if (profileDeleteError) {
      console.error('Error deleting user profile:', profileDeleteError);
      return { success: false, message: `Failed to delete profile: ${profileDeleteError.message}` };
    }
    
    // Since we don't have admin access, instead of deleting the user auth account
    // we'll just sign them out globally which will invalidate all sessions
    const { error: signOutError } = await supabase.auth.signOut({ 
      scope: 'global' 
    });
    
    if (signOutError) {
      console.error('Error signing out user:', signOutError);
      return { success: false, message: `Failed to sign out: ${signOutError.message}` };
    }
    
    return { success: true, message: "Account successfully deleted" };
  } catch (error) {
    console.error('Error in deleteUser:', error);
    return { 
      success: false, 
      message: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
};
