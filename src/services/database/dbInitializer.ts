
import { connectToDatabase } from './dbConnection';

// Initialize database with required collections and sample data
export const initializeDatabase = async () => {
  try {
    const db = await connectToDatabase();
    if (!db) {
      console.log('Browser environment detected - using mock data');
      // We're in a browser, so we'll use mock data instead
      return true;
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
    return true; // Return true to allow app to continue with mock data
  }
};
