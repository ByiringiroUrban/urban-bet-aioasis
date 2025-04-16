
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { SportEvent } from "@/services/database/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import OddsForm from './OddsForm';

interface OddsManagementProps {
  event: SportEvent;
  onClose: () => void;
  onOddsUpdated: () => Promise<void>;
}

export default function OddsManagement({ event, onClose, onOddsUpdated }: OddsManagementProps) {
  const [oddsData, setOddsData] = useState({
    homeOdds: "1.90",
    drawOdds: "3.50",
    awayOdds: "4.20",
    bttsYes: "1.80",
    bttsNo: "2.00",
    over25: "1.95",
    under25: "1.85"
  });
  
  const { toast } = useToast();

  useEffect(() => {
    loadEventOdds();
  }, [event.id]);

  const loadEventOdds = async () => {
    try {
      const { data: oddsData, error } = await supabase
        .from('odds')
        .select('market_id, selection, value')
        .eq('event_id', event.id);

      if (error) throw error;

      if (oddsData && oddsData.length > 0) {
        const newOddsData = { ...oddsData };
        
        for (const odd of oddsData) {
          switch (odd.selection) {
            case 'Home': newOddsData.homeOdds = odd.value.toString(); break;
            case 'Draw': newOddsData.drawOdds = odd.value.toString(); break;
            case 'Away': newOddsData.awayOdds = odd.value.toString(); break;
            case 'Yes': newOddsData.bttsYes = odd.value.toString(); break;
            case 'No': newOddsData.bttsNo = odd.value.toString(); break;
            case 'Over': newOddsData.over25 = odd.value.toString(); break;
            case 'Under': newOddsData.under25 = odd.value.toString(); break;
          }
        }

        setOddsData(newOddsData);
      }
    } catch (error) {
      console.error('Error loading odds:', error);
    }
  };

  const handleOddsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOddsData({
      ...oddsData,
      [name]: value
    });
  };

  const handleSaveOdds = async () => {
    try {
      const { data: markets, error: marketsError } = await supabase
        .from('markets')
        .select('id, name')
        .eq('event_id', event.id);

      if (marketsError) throw marketsError;

      if (!markets || markets.length === 0) {
        throw new Error("No markets found for this event");
      }

      const matchWinnerMarket = markets.find(m => m.name === 'Match Winner');
      const bttsMarket = markets.find(m => m.name === 'Both Teams to Score');
      const overUnderMarket = markets.find(m => m.name === 'Over/Under 2.5 Goals');

      await updateMarketOdds(event.id, matchWinnerMarket?.id, [
        { selection: 'Home', value: parseFloat(oddsData.homeOdds) },
        { selection: 'Draw', value: parseFloat(oddsData.drawOdds) },
        { selection: 'Away', value: parseFloat(oddsData.awayOdds) }
      ]);

      await updateMarketOdds(event.id, bttsMarket?.id, [
        { selection: 'Yes', value: parseFloat(oddsData.bttsYes) },
        { selection: 'No', value: parseFloat(oddsData.bttsNo) }
      ]);

      await updateMarketOdds(event.id, overUnderMarket?.id, [
        { selection: 'Over', value: parseFloat(oddsData.over25) },
        { selection: 'Under', value: parseFloat(oddsData.under25) }
      ]);

      toast({
        title: "Success",
        description: "Odds updated successfully.",
      });

      onOddsUpdated();
      onClose();
    } catch (error) {
      console.error('Error saving odds:', error);
      toast({
        title: "Error",
        description: "Failed to save odds. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateMarketOdds = async (eventId: string, marketId: string | undefined, odds: { selection: string; value: number }[]) => {
    if (!marketId) return;

    for (const odd of odds) {
      await supabase
        .from('odds')
        .upsert({
          event_id: eventId,
          market_id: marketId,
          selection: odd.selection,
          value: odd.value
        }, {
          onConflict: 'event_id,market_id,selection'
        });
    }
  };

  return (
    <div className="p-4">
      <h4 className="font-semibold mb-4">Manage Odds: {event.homeTeam} vs {event.awayTeam}</h4>
      
      <OddsForm 
        event={event}
        oddsData={oddsData}
        onOddsInputChange={handleOddsInputChange}
      />

      <div className="flex justify-end mt-4 gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSaveOdds}>
          Save Odds
        </Button>
      </div>
    </div>
  );
}
