
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

/**
 * Create default markets and odds for a new event
 */
export const createDefaultMarketsAndOdds = async (eventId: string) => {
  try {
    // Default markets
    const defaultMarkets = [
      {
        name: "Match Winner",
        options: ["Home", "Draw", "Away"],
        initialOdds: [1.95, 3.50, 4.10]
      },
      {
        name: "Over/Under 2.5 Goals",
        options: ["Over", "Under"],
        initialOdds: [1.85, 1.95]
      },
      {
        name: "Both Teams to Score",
        options: ["Yes", "No"],
        initialOdds: [1.80, 2.00]
      }
    ];

    // Create markets and associated odds for each default market
    for (const market of defaultMarkets) {
      // Create market
      const { data: marketData, error: marketError } = await supabase
        .from('markets')
        .insert({
          event_id: eventId,
          name: market.name,
          options: market.options
        })
        .select();

      if (marketError) throw marketError;
      
      if (!marketData || marketData.length === 0) {
        throw new Error('Failed to create market');
      }

      const marketId = marketData[0].id;
      
      // Create odds for each selection
      const oddsPromises = market.options.map((selection, index) => {
        return supabase
          .from('odds')
          .insert({
            event_id: eventId,
            market_id: marketId,
            selection,
            value: market.initialOdds[index]
          });
      });

      await Promise.all(oddsPromises);
    }

    return true;
  } catch (error) {
    console.error('Error creating default markets and odds:', error);
    return false;
  }
};

/**
 * Update event odds and mark the event as featured
 */
export const markEventAsFeatured = async (eventId: string, featured: boolean = true) => {
  try {
    const { error } = await supabase
      .from('events')
      .update({ featured })
      .eq('id', eventId);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error marking event as featured:', error);
    return false;
  }
};

/**
 * Get all featured events 
 */
export const getFeaturedEvents = async () => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        id,
        home_team,
        away_team,
        league,
        country,
        start_time,
        is_live,
        sport_id,
        sports (name)
      `)
      .eq('featured', true)
      .order('start_time', { ascending: true });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching featured events:', error);
    return [];
  }
};
