// MongoDB service for real database connection
import { MongoClient, ObjectId } from 'mongodb';

// MongoDB Connection URL - use local MongoDB
const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'urbanbet';

// Interface definitions
export interface BetRecord {
  id: string;
  userId: string;
  items: {
    event: string;
    selection: string;
    odds: number;
  }[];
  totalOdds: number;
  amount: number;
  potentialWinnings: number;
  timestamp: string;
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  currency?: 'USD' | 'RWF';
}

// Initialize MongoDB client
const client = new MongoClient(MONGODB_URI);

// Connect to MongoDB
const connectToDatabase = async () => {
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

// Export the initializeDatabase function directly so it can be imported in other files
export const initializeDatabase = async () => {
  try {
    const db = await connectToDatabase();
    if (!db) {
      console.warn('Failed to initialize database. Using mock data.');
      return false;
    }
    
    // Check if collections exist, create them if they don't
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    const requiredCollections = ['users', 'bets', 'sports', 'events', 'markets', 'predictions'];
    
    for (const collection of requiredCollections) {
      if (!collectionNames.includes(collection)) {
        await db.createCollection(collection);
        console.log(`Created collection: ${collection}`);
      }
    }
    
    // Add some initial data if collections are empty
    const sports = await db.collection('sports').countDocuments();
    if (sports === 0) {
      await db.collection('sports').insertMany([
        { name: 'Football' },
        { name: 'Basketball' },
        { name: 'Tennis' },
        { name: 'Rugby' },
        { name: 'Cricket' },
        { name: 'eSports' }
      ]);
      console.log('Added initial sports data');
    }
    
    // Add some sample matches if events collection is empty
    const events = await db.collection('events').countDocuments();
    if (events === 0) {
      await db.collection('events').insertMany([
        {
          id: 'event1',
          homeTeam: 'Arsenal',
          awayTeam: 'Chelsea',
          league: 'Premier League',
          time: '15:00',
          date: new Date().toISOString().split('T')[0],
          homeOdds: 2.10,
          drawOdds: 3.40,
          awayOdds: 3.20,
          isLive: false
        },
        {
          id: 'event2',
          homeTeam: 'Bayern Munich',
          awayTeam: 'Dortmund',
          league: 'Bundesliga',
          time: '17:30',
          date: new Date().toISOString().split('T')[0],
          homeOdds: 1.80,
          drawOdds: 3.70,
          awayOdds: 4.20,
          isLive: true
        },
        {
          id: 'event3',
          homeTeam: 'Barcelona',
          awayTeam: 'Real Madrid',
          league: 'La Liga',
          time: '20:00',
          date: new Date().toISOString().split('T')[0],
          homeOdds: 2.40,
          drawOdds: 3.20,
          awayOdds: 2.90,
          isLive: false
        }
      ]);
      console.log('Added initial events data');
    }
    
    // Add some sample predictions if predictions collection is empty
    const predictions = await db.collection('predictions').countDocuments();
    if (predictions === 0) {
      await db.collection('predictions').insertMany([
        {
          match: 'Arsenal vs Liverpool',
          prediction: 'Arsenal to win',
          confidence: 75,
          analysis: 'Arsenal has won 4 out of their last 5 home games against Liverpool',
          trend: 'Arsenal winning streak at home',
          odds: '1.95',
          userId: 'sample-jwt-token-google-user-1234'
        },
        {
          match: 'PSG vs Bayern Munich',
          prediction: 'Over 2.5 goals',
          confidence: 82,
          analysis: 'Both teams have scored in the last 7 encounters',
          trend: 'High scoring matches in Champions League',
          odds: '1.75',
          userId: 'sample-jwt-token-google-user-1234'
        },
        {
          match: 'Manchester City vs Liverpool',
          prediction: 'Both teams to score: Yes',
          confidence: 88,
          analysis: 'Both teams have scored in the last 9 out of 10 matches between them',
          trend: 'High scoring games in Premier League',
          odds: '1.65',
          userId: 'sample-jwt-token-google-user-1234'
        }
      ]);
      console.log('Added initial predictions data');
    }
    
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

export const mongoService = {
  // Save a bet to MongoDB
  saveBet: async (betData: Omit<BetRecord, 'id'>): Promise<{ success: boolean; id?: string }> => {
    try {
      console.log('Saving bet to MongoDB:', betData);
      
      const db = await connectToDatabase();
      
      // If db connection failed, use mock implementation
      if (!db) {
        // Mock implementation for fallback
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
          success: true,
          id: new ObjectId().toString()
        };
      }
      
      const collection = db.collection('bets');
      const result = await collection.insertOne({
        ...betData,
        _id: new ObjectId()
      });
      
      return {
        success: true,
        id: result.insertedId.toString()
      };
    } catch (error) {
      console.error('Error saving bet to MongoDB:', error);
      return { success: false };
    } finally {
      // Don't disconnect here as we're reusing the connection
    }
  },
  
  // Get user's bet history
  getBetHistory: async (userId: string): Promise<BetRecord[]> => {
    try {
      console.log('Fetching bet history for user:', userId);
      
      const db = await connectToDatabase();
      
      // If db connection failed, use mock implementation
      if (!db) {
        // Mock data for fallback
        await new Promise(resolve => setTimeout(resolve, 600));
        return [
          {
            id: '1',
            userId,
            items: [
              {
                event: 'Arsenal vs Chelsea',
                selection: 'Arsenal to win',
                odds: 2.1
              }
            ],
            totalOdds: 2.1,
            amount: 10000, // RWF
            potentialWinnings: 21000, // RWF
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
            status: 'pending',
            currency: 'RWF'
          },
          {
            id: '2',
            userId,
            items: [
              {
                event: 'Barcelona vs Real Madrid',
                selection: 'Draw',
                odds: 3.25
              }
            ],
            totalOdds: 3.25,
            amount: 5000, // RWF
            potentialWinnings: 16250, // RWF
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
            status: 'won',
            currency: 'RWF'
          },
          {
            id: '3',
            userId,
            items: [
              {
                event: 'PSG vs Bayern Munich',
                selection: 'Bayern Munich to win',
                odds: 2.4
              },
              {
                event: 'Manchester City vs Liverpool',
                selection: 'Over 2.5 goals',
                odds: 1.8
              }
            ],
            totalOdds: 4.32,
            amount: 7500, // RWF
            potentialWinnings: 32400, // RWF
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
            status: 'lost',
            currency: 'RWF'
          }
        ];
      }
      
      const collection = db.collection('bets');
      const bets = await collection.find({ userId }).sort({ timestamp: -1 }).toArray();
      
      return bets.map(bet => ({
        id: bet._id.toString(),
        userId: bet.userId,
        items: bet.items,
        totalOdds: bet.totalOdds,
        amount: bet.amount,
        potentialWinnings: bet.potentialWinnings,
        timestamp: bet.timestamp,
        status: bet.status,
        currency: bet.currency || 'RWF'
      }));
    } catch (error) {
      console.error('Error fetching bet history from MongoDB:', error);
      return [];
    }
  },
  
  // Get all available sports
  getSports: async (): Promise<string[]> => {
    try {
      const db = await connectToDatabase();
      
      // If db connection failed, use mock implementation
      if (!db) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return ['Football', 'Basketball', 'Tennis', 'Rugby', 'Cricket', 'eSports'];
      }
      
      const collection = db.collection('sports');
      const sports = await collection.find({}).toArray();
      
      return sports.map(sport => sport.name);
    } catch (error) {
      console.error('Error fetching sports from MongoDB:', error);
      return ['Football', 'Basketball']; // fallback
    }
  },
  
  // Get available markets for an event
  getMarkets: async (eventId: string): Promise<any[]> => {
    try {
      console.log('Fetching markets for event:', eventId);
      
      const db = await connectToDatabase();
      
      // If db connection failed, use mock implementation
      if (!db) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
          { id: 'm1', name: 'Match Result', options: ['Home Win', 'Draw', 'Away Win'] },
          { id: 'm2', name: 'Both Teams To Score', options: ['Yes', 'No'] },
          { id: 'm3', name: 'Over/Under 2.5 Goals', options: ['Over', 'Under'] },
          { id: 'm4', name: 'First Goal Scorer', options: ['Player 1', 'Player 2', 'No Goal'] },
        ];
      }
      
      const collection = db.collection('markets');
      const markets = await collection.find({ eventId }).toArray();
      
      return markets.map(market => ({
        id: market._id.toString(),
        name: market.name,
        options: market.options
      }));
    } catch (error) {
      console.error('Error fetching markets from MongoDB:', error);
      return [];
    }
  },
  
  // Get AI predictions for a user
  getAIPredictions: async (userId: string): Promise<any[]> => {
    try {
      console.log('Fetching AI predictions for user:', userId);
      
      const db = await connectToDatabase();
      
      // If db connection failed, use mock implementation
      if (!db) {
        await new Promise(resolve => setTimeout(resolve, 700));
        return [
          {
            id: 'p1',
            match: 'Arsenal vs Liverpool',
            prediction: 'Arsenal to win',
            confidence: 75,
            analysis: 'Arsenal has won 4 out of their last 5 home games against Liverpool',
            trend: 'Arsenal winning streak at home',
            odds: '1.95'
          },
          {
            id: 'p2',
            match: 'PSG vs Bayern Munich',
            prediction: 'Over 2.5 goals',
            confidence: 82,
            analysis: 'Both teams have scored in the last 7 encounters',
            trend: 'High scoring matches in Champions League',
            odds: '1.75'
          },
          {
            id: 'p3',
            match: 'Manchester City vs Liverpool',
            prediction: 'Both teams to score: Yes',
            confidence: 88,
            analysis: 'Both teams have scored in the last 9 out of 10 matches between them',
            trend: 'High scoring games in Premier League',
            odds: '1.65'
          }
        ];
      }
      
      const collection = db.collection('predictions');
      const predictions = await collection.find({ userId }).toArray();
      
      return predictions.map(prediction => ({
        id: prediction._id.toString(),
        match: prediction.match,
        prediction: prediction.prediction,
        confidence: prediction.confidence,
        analysis: prediction.analysis,
        trend: prediction.trend,
        odds: prediction.odds
      }));
    } catch (error) {
      console.error('Error fetching AI predictions:', error);
      return [];
    }
  },
  
  // Save user data
  saveUser: async (userData: any): Promise<{ success: boolean; id?: string }> => {
    try {
      const db = await connectToDatabase();
      
      // If db connection failed, use mock implementation
      if (!db) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
          success: true,
          id: new ObjectId().toString()
        };
      }
      
      const collection = db.collection('users');
      
      // Check if user already exists
      const existingUser = await collection.findOne({ email: userData.email });
      
      if (existingUser) {
        // Update existing user
        await collection.updateOne(
          { email: userData.email },
          { $set: { ...userData, lastLogin: new Date() } }
        );
        return {
          success: true,
          id: existingUser._id.toString()
        };
      } else {
        // Create new user
        const result = await collection.insertOne({
          ...userData,
          _id: new ObjectId(),
          createdAt: new Date(),
          lastLogin: new Date()
        });
        
        return {
          success: true,
          id: result.insertedId.toString()
        };
      }
    } catch (error) {
      console.error('Error saving user to MongoDB:', error);
      return { success: false };
    }
  },
  
  // Get user data
  getUser: async (userId: string): Promise<any | null> => {
    try {
      const db = await connectToDatabase();
      
      // If db connection failed, use mock implementation
      if (!db) {
        await new Promise(resolve => setTimeout(resolve, 400));
        return {
          id: userId,
          name: 'Demo User',
          email: 'user@example.com',
          balance: 50000, // RWF
          currency: 'RWF'
        };
      }
      
      const collection = db.collection('users');
      const user = await collection.findOne({ _id: new ObjectId(userId) });
      
      if (!user) return null;
      
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        balance: user.balance || 0,
        currency: user.currency || 'RWF'
      };
    } catch (error) {
      console.error('Error fetching user from MongoDB:', error);
      return null;
    }
  },
  
  // Close connection to MongoDB (use when app is shutting down)
  closeConnection: async () => {
    try {
      await client.close();
      console.log('MongoDB connection closed');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    }
  },
  
  // Add a reference to the exported initializeDatabase function
  initializeDatabase
};
