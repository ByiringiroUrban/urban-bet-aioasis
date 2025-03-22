
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
