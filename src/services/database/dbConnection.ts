
import { MongoClient } from 'mongodb';

// MongoDB Connection URL - use local MongoDB
const MONGODB_URI = 'mongodb://localhost:27017';
export const DB_NAME = 'urbanbet';

// Check if running in browser environment
const isBrowser = typeof window !== 'undefined';

// Initialize MongoDB client
let client: MongoClient | null = null;

// Connect to MongoDB
export const connectToDatabase = async () => {
  // If in browser, always return null to use mock data
  if (isBrowser) {
    console.log('Running in browser environment - using mock data');
    return null;
  }

  try {
    if (!client) {
      client = new MongoClient(MONGODB_URI);
      await client.connect();
      console.log('Connected to MongoDB at localhost:27017');
    }
    return client.db(DB_NAME);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    
    // Fallback to mock data if connection fails
    console.warn('Using mock data instead');
    return null;
  }
};

// Close connection to MongoDB (use when app is shutting down)
export const closeConnection = async () => {
  if (!client) return;
  
  try {
    await client.close();
    client = null;
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
};
