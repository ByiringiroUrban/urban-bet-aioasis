
// We're replacing MongoDB with Supabase, so let's re-export from supabaseService
import { 
  supabaseService, 
  initializeDatabase, 
  saveUser, 
  getUser, 
  saveBet, 
  getBetHistory, 
  getSports, 
  getMarkets, 
  getAIPredictions 
} from './supabaseService';

// Re-export types for use in other files
export type { BetRecord } from './database/types';

// Export the service object that combines all services
export const mongoService = {
  // Database management
  initializeDatabase,
  
  // User operations
  saveUser,
  getUser,
  
  // Betting operations
  saveBet,
  getBetHistory,
  
  // Sports and markets operations
  getSports,
  getMarkets,
  
  // AI predictions
  getAIPredictions
};

// Export initializeDatabase directly
export { initializeDatabase };
