import { supabase } from '@/lib/supabase';
import { SportEvent, Market } from './database/types';

// Get list of sports
export const getSports = async (): Promise<{ id: string; name: string }[]> => {
  try {
    const { data, error } = await supabase
      .from('sports')
      .select('id, name')
      .eq('active', true)
      .order('display_order', { ascending: true });
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching sports:', error);
    // Return mock data
    return [
      { id: '1', name: 'Football' },
      { id: '2', name: 'Basketball' },
      { id: '3', name: 'Tennis' },
      { id: '4', name: 'Rugby' },
      { id: '5', name: 'Cricket' },
      { id: '6', name: 'eSports' }
    ];
  }
};

// Get available markets for an event
export const getMarkets = async (eventId?: string): Promise<Market[]> => {
  if (!eventId) {
    return [
      { id: '1', name: 'Match Winner', options: ['Home', 'Draw', 'Away'] },
      { id: '2', name: 'Over/Under 2.5 Goals', options: ['Over', 'Under'] },
      { id: '3', name: 'Both Teams to Score', options: ['Yes', 'No'] }
    ];
  }
  
  try {
    const { data, error } = await supabase
      .from('markets')
      .select('id, name, options')
      .eq('event_id', eventId);
      
    if (error || !data || data.length === 0) {
      // Return mock data for specific event
      return [
        { id: '1', name: 'Match Winner', options: ['Home', 'Draw', 'Away'], eventId },
        { id: '2', name: 'Over/Under 2.5 Goals', options: ['Over', 'Under'], eventId },
        { id: '3', name: 'Both Teams to Score', options: ['Yes', 'No'], eventId }
      ];
    }
    
    return data.map(market => ({
      id: market.id,
      name: market.name,
      options: market.options,
      eventId
    }));
  } catch (error) {
    console.error('Error fetching markets:', error);
    return [
      { id: '1', name: 'Match Winner', options: ['Home', 'Draw', 'Away'], eventId },
      { id: '2', name: 'Over/Under 2.5 Goals', options: ['Over', 'Under'], eventId },
      { id: '3', name: 'Both Teams to Score', options: ['Yes', 'No'], eventId }
    ];
  }
};

// Get events for sports section or homepage
export const getEvents = async (sportId?: string, featured: boolean = false): Promise<SportEvent[]> => {
  try {
    let query = supabase
      .from('events')
      .select(`
        id,
        home_team,
        away_team,
        league,
        country,
        start_time,
        is_live,
        featured,
        sport_id,
        sports (
          name
        )
      `)
      .order('start_time', { ascending: true });
    
    if (sportId) {
      query = query.eq('sport_id', sportId);
    }
    
    if (featured) {
      query = query.eq('featured', true);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    const events: SportEvent[] = (data || []).map(event => ({
      id: event.id,
      homeTeam: event.home_team,
      awayTeam: event.away_team,
      league: event.league || '',
      country: event.country || '',
      time: new Date(event.start_time).toLocaleTimeString(),
      date: new Date(event.start_time).toLocaleDateString(),
      homeOdds: 1.5,
      drawOdds: 3.5,
      awayOdds: 5.0,
      isLive: event.is_live || false,
      sportId: event.sport_id,
      sportName: event.sports ? event.sports.name : '',
      startTime: event.start_time,
      featured: event.featured || false
    }));
    
    for (const event of events) {
      const { data: oddsData, error: oddsError } = await supabase
        .from('odds')
        .select('market_id, selection, value')
        .eq('event_id', event.id);
        
      if (!oddsError && oddsData && oddsData.length > 0) {
        const matchWinnerOdds = oddsData.filter(odd => 
          odd.selection === 'Home' || 
          odd.selection === 'Draw' || 
          odd.selection === 'Away'
        );
        
        for (const odd of matchWinnerOdds) {
          if (odd.selection === 'Home') event.homeOdds = Number(odd.value);
          if (odd.selection === 'Draw') event.drawOdds = Number(odd.value);
          if (odd.selection === 'Away') event.awayOdds = Number(odd.value);
        }
      }
    }
    
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

// Get featured events for homepage
export const getFeaturedEvents = async (): Promise<SportEvent[]> => {
  return getEvents(undefined, true);
};

// Get all odds for an event
export const getOddsForEvent = async (eventId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('odds')
      .select(`
        id,
        selection,
        value,
        market_id,
        markets(name, options)
      `)
      .eq('event_id', eventId);
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching odds:', error);
    return [];
  }
};
