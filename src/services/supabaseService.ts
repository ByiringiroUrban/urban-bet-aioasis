
// This file now serves as a central export point for all services
// All the actual implementation has been moved to separate service files

// Import and re-export all services
import { initializeDatabase } from './databaseService';
import { saveUser, getUser } from './userService';
import { saveBet, getBetHistory } from './bettingService';
import { getSports, getMarkets, getEvents, getFeaturedEvents, getOddsForEvent } from './sportsDataService';
import { getAIPredictions } from './predictionsService';

// Export the service object that combines all services
export const supabaseService = {
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
  getEvents,
  getFeaturedEvents,
  getOddsForEvent,
  
  // AI predictions
  getAIPredictions
};

// Re-export individual services for direct imports
export {
  initializeDatabase,
  saveUser,
  getUser,
  saveBet,
  getBetHistory,
  getSports,
  getMarkets,
  getEvents,
  getFeaturedEvents,
  getOddsForEvent,
  getAIPredictions
};

// Re-export types
export type { BetRecord } from './database/types';
