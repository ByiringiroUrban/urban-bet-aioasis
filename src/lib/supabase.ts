
import { createClient } from '@supabase/supabase-js';

// These should be the public keys only, safe to use in browser
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://urbanbet.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyYmFuYmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYyOTAwMTcsImV4cCI6MjAzMTg2NjAxN30.gOyFQ_Fw1jG7bWW1rLYKIqaCfZ8n6LDIXWXGQmM0H8c';

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
