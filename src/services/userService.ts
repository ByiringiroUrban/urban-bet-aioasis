
import { ObjectId } from 'mongodb';
import { connectToDatabase } from './database/dbConnection';
import { UserData } from './database/types';

export const userService = {
  // Save user data
  saveUser: async (userData: UserData): Promise<{ success: boolean; id?: string }> => {
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
  getUser: async (userId: string): Promise<UserData | null> => {
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
  }
};
