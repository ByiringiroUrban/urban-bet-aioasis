
import { initializeDatabase } from './database/dbInitializer';
import { closeConnection } from './database/dbConnection';
import { userService } from './userService';
import { bettingService } from './bettingService';
import { sportsService } from './sportsService';
import { predictionsService } from './predictionsService';
import { BetRecord } from './database/types';

// Re-export types for use in other files
export { BetRecord } from './database/types';

// Export the main mongoService object that combines all services
export const mongoService = {
  // Database management
  initializeDatabase,
  closeConnection,
  
  // User operations
  saveUser: userService.saveUser,
  getUser: userService.getUser,
  
  // Betting operations
  saveBet: bettingService.saveBet,
  getBetHistory: bettingService.getBetHistory,
  
  // Sports and markets operations
  getSports: sportsService.getSports,
  getMarkets: sportsService.getMarkets,
  
  // AI predictions
  getAIPredictions: predictionsService.getAIPredictions
};

// Export initializeDatabase directly to fix the import error
export { initializeDatabase };
