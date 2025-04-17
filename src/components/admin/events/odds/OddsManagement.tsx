
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { SportEvent } from "@/services/database/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import MarketOddsGroup from './MarketOddsGroup';
import { OddsData, DEFAULT_ODDS_DATA, loadEventOdds, updateMarketOdds } from './oddsUtils';

interface OddsManagementProps {
  event: SportEvent;
  onClose: () => void;
  onOddsUpdated: () => Promise<void>;
}

export default function OddsManagement({ event, onClose, onOddsUpdated }: OddsManagementProps) {
  const [oddsData, setOddsData] = useState<OddsData>(DEFAULT_ODDS_DATA);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOdds = async () => {
      const data = await loadEventOdds(event.id);
      setOddsData(data);
    };
    
    fetchOdds();
  }, [event.id]);

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

      // Update Match Winner odds
      if (matchWinnerMarket) {
        await updateMarketOdds(event.id, matchWinnerMarket.id, [
          { selection: 'Home', value: parseFloat(oddsData.homeOdds) },
          { selection: 'Draw', value: parseFloat(oddsData.drawOdds) },
          { selection: 'Away', value: parseFloat(oddsData.awayOdds) }
        ]);
      }

      // Update BTTS odds
      if (bttsMarket) {
        await updateMarketOdds(event.id, bttsMarket.id, [
          { selection: 'Yes', value: parseFloat(oddsData.bttsYes) },
          { selection: 'No', value: parseFloat(oddsData.bttsNo) }
        ]);
      }

      // Update Over/Under odds
      if (overUnderMarket) {
        await updateMarketOdds(event.id, overUnderMarket.id, [
          { selection: 'Over', value: parseFloat(oddsData.over25) },
          { selection: 'Under', value: parseFloat(oddsData.under25) }
        ]);
      }

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

  const getMatchWinnerSelections = () => [
    { name: 'homeOdds', label: `${event.homeTeam} (Home)`, value: oddsData.homeOdds },
    { name: 'drawOdds', label: 'Draw', value: oddsData.drawOdds },
    { name: 'awayOdds', label: `${event.awayTeam} (Away)`, value: oddsData.awayOdds }
  ];

  const getBTTSSelections = () => [
    { name: 'bttsYes', label: 'Yes', value: oddsData.bttsYes },
    { name: 'bttsNo', label: 'No', value: oddsData.bttsNo }
  ];

  const getOverUnderSelections = () => [
    { name: 'over25', label: 'Over 2.5', value: oddsData.over25 },
    { name: 'under25', label: 'Under 2.5', value: oddsData.under25 }
  ];

  return (
    <div className="p-4">
      <h4 className="font-semibold mb-4">Manage Odds: {event.homeTeam} vs {event.awayTeam}</h4>

      <Accordion type="single" collapsible defaultValue="match-winner">
        <MarketOddsGroup
          title="Match Winner"
          selections={getMatchWinnerSelections()}
          onInputChange={handleOddsInputChange}
          defaultOpen={true}
        />
        <MarketOddsGroup
          title="Both Teams to Score"
          selections={getBTTSSelections()}
          onInputChange={handleOddsInputChange}
        />
        <MarketOddsGroup
          title="Over/Under 2.5 Goals"
          selections={getOverUnderSelections()}
          onInputChange={handleOddsInputChange}
        />
      </Accordion>

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
