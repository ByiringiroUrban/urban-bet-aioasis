
import { createClient } from '@supabase/supabase-js';

// These should be the public keys only, safe to use in browser
const supabaseUrl = "https://jfhybzemirlpcynhjosk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmaHliemVtaXJscGN5bmhqb3NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NDkxMjUsImV4cCI6MjA1ODEyNTEyNX0.iQpPteRheZR6BTCliqg9QJODNy14YvQs3KRODt7OeL4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for auth
export const signInWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signUpWithEmail = async (email: string, password: string, name: string) => {
  return await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: { name }
    }
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentSession = async () => {
  return await supabase.auth.getSession();
};

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data?.user;
};

// Delete user account function that handles auth and profile cleanup
export const deleteAccount = async () => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return {
        success: false,
        error: "No user is currently logged in"
      };
    }
    
    // Delete user's profile data first
    const { error: profileDeleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id);
      
    if (profileDeleteError) {
      console.error('Error deleting user profile:', profileDeleteError);
      return { 
        success: false, 
        error: `Failed to delete profile: ${profileDeleteError.message}` 
      };
    }
    
    // Sign out from all devices
    const { error: signOutError } = await supabase.auth.signOut({ 
      scope: 'global' 
    });
    
    if (signOutError) {
      console.error('Error signing out user:', signOutError);
      return { 
        success: false, 
        error: `Failed to sign out: ${signOutError.message}` 
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in deleteAccount:', error);
    return { 
      success: false, 
      error: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
};
