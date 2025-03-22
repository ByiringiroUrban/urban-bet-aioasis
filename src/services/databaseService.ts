
import { supabase } from '@/lib/supabase';

// Initialize the database with sample data
export const initializeDatabase = async (): Promise<boolean> => {
  try {
    console.log('Checking Supabase database connection...');
    
    // Check if we have a connection to Supabase
    const { data, error } = await supabase.from('sports').select('count');
    
    if (error) {
      console.log('Error connecting to Supabase or table not found:', error.message);
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
