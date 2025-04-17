
import { supabase } from "@/lib/supabase";

export interface OddsData {
  homeOdds: string;
  drawOdds: string;
  awayOdds: string;
  bttsYes: string;
  bttsNo: string;
  over25: string;
  under25: string;
}

export const DEFAULT_ODDS_DATA: OddsData = {
  homeOdds: "1.90",
  drawOdds: "3.50",
  awayOdds: "4.20",
  bttsYes: "1.80",
  bttsNo: "2.00",
  over25: "1.95",
  under25: "1.85"
};

export const loadEventOdds = async (eventId: string): Promise<OddsData> => {
  try {
    const { data: oddsData, error } = await supabase
      .from('odds')
      .select('market_id, selection, value')
      .eq('event_id', eventId);

    if (error) throw error;

    const newOddsData = { ...DEFAULT_ODDS_DATA };

    if (oddsData && oddsData.length > 0) {
      for (const odd of oddsData) {
        switch (odd.selection) {
          case 'Home':
            newOddsData.homeOdds = odd.value.toString();
            break;
          case 'Draw':
            newOddsData.drawOdds = odd.value.toString();
            break;
          case 'Away':
            newOddsData.awayOdds = odd.value.toString();
            break;
          case 'Yes':
            newOddsData.bttsYes = odd.value.toString();
            break;
          case 'No':
            newOddsData.bttsNo = odd.value.toString();
            break;
          case 'Over':
            newOddsData.over25 = odd.value.toString();
            break;
          case 'Under':
            newOddsData.under25 = odd.value.toString();
            break;
        }
      }
    }

    return newOddsData;
  } catch (error) {
    console.error('Error loading odds:', error);
    return { ...DEFAULT_ODDS_DATA };
  }
};

export const updateMarketOdds = async (
  eventId: string, 
  marketId: string, 
  odds: { selection: string; value: number }[]
) => {
  for (const odd of odds) {
    await supabase
      .from('odds')
      .upsert({
        event_id: eventId,
        market_id: marketId,
        selection: odd.selection,
        value: odd.value
      }, {
        onConflict: 'event_id,market_id,selection',
        ignoreDuplicates: false
      });
  }
};
