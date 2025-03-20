
import { MongoClient } from 'mongodb';

// MongoDB Connection URL - use local MongoDB
const MONGODB_URI = 'mongodb://localhost:27017';
export const DB_NAME = 'urbanbet';

// Initialize MongoDB client
const client = new MongoClient(MONGODB_URI);

// Connect to MongoDB
export const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB at localhost:27017');
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
  try {
    await client.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
};
