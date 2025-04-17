
import { supabase } from "@/lib/supabase";

export const createDefaultMarketsAndOdds = async (eventId: string) => {
  try {
    // Create Match Winner market
    const { data: matchWinnerMarket } = await supabase
      .from('markets')
      .insert([{
        event_id: eventId,
        name: 'Match Winner',
        options: ['Home', 'Draw', 'Away']
      }])
      .select();

    // Create BTTS market
    const { data: bttsMarket } = await supabase
      .from('markets')
      .insert([{
        event_id: eventId,
        name: 'Both Teams to Score',
        options: ['Yes', 'No']
      }])
      .select();

    // Create Over/Under market
    const { data: overUnderMarket } = await supabase
      .from('markets')
      .insert([{
        event_id: eventId,
        name: 'Over/Under 2.5 Goals',
        options: ['Over', 'Under']
      }])
      .select();

    if (matchWinnerMarket?.[0]?.id) {
      await supabase.from('odds').insert([
        { event_id: eventId, market_id: matchWinnerMarket[0].id, selection: 'Home', value: 1.90 },
        { event_id: eventId, market_id: matchWinnerMarket[0].id, selection: 'Draw', value: 3.50 },
        { event_id: eventId, market_id: matchWinnerMarket[0].id, selection: 'Away', value: 4.20 }
      ]);
    }

    if (bttsMarket?.[0]?.id) {
      await supabase.from('odds').insert([
        { event_id: eventId, market_id: bttsMarket[0].id, selection: 'Yes', value: 1.80 },
        { event_id: eventId, market_id: bttsMarket[0].id, selection: 'No', value: 2.00 }
      ]);
    }

    if (overUnderMarket?.[0]?.id) {
      await supabase.from('odds').insert([
        { event_id: eventId, market_id: overUnderMarket[0].id, selection: 'Over', value: 1.95 },
        { event_id: eventId, market_id: overUnderMarket[0].id, selection: 'Under', value: 1.85 }
      ]);
    }
  } catch (error) {
    console.error('Error creating markets and odds:', error);
    throw error;
  }
};
