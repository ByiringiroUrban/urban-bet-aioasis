
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SportEvent } from "@/services/database/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface OddsData {
  homeOdds: string;
  drawOdds: string;
  awayOdds: string;
  bttsYes: string;
  bttsNo: string;
  over25: string;
  under25: string;
}

interface OddsManagementProps {
  event: SportEvent;
  onClose: () => void;
  onOddsUpdated: () => Promise<void>;
}

export default function OddsManagement({ event, onClose, onOddsUpdated }: OddsManagementProps) {
  const [oddsData, setOddsData] = useState<OddsData>({
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
        const newOddsData: OddsData = {
          homeOdds: "1.90",
          drawOdds: "3.50",
          awayOdds: "4.20",
          bttsYes: "1.80",
          bttsNo: "2.00",
          over25: "1.95",
          under25: "1.85"
        };

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

      // Update Match Winner odds
      if (matchWinnerMarket) {
        await updateOdds(event.id, matchWinnerMarket.id, [
          { selection: 'Home', value: parseFloat(oddsData.homeOdds) },
          { selection: 'Draw', value: parseFloat(oddsData.drawOdds) },
          { selection: 'Away', value: parseFloat(oddsData.awayOdds) }
        ]);
      }

      // Update BTTS odds
      if (bttsMarket) {
        await updateOdds(event.id, bttsMarket.id, [
          { selection: 'Yes', value: parseFloat(oddsData.bttsYes) },
          { selection: 'No', value: parseFloat(oddsData.bttsNo) }
        ]);
      }

      // Update Over/Under odds
      if (overUnderMarket) {
        await updateOdds(event.id, overUnderMarket.id, [
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

  const updateOdds = async (eventId: string, marketId: string, odds: { selection: string; value: number }[]) => {
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

  return (
    <div className="p-4">
      <h4 className="font-semibold mb-4">Manage Odds: {event.homeTeam} vs {event.awayTeam}</h4>

      <Accordion type="single" collapsible defaultValue="match-winner">
        <AccordionItem value="match-winner">
          <AccordionTrigger>Match Winner</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="homeOdds">{event.homeTeam} (Home)</Label>
                <Input
                  id="homeOdds"
                  name="homeOdds"
                  value={oddsData.homeOdds}
                  onChange={handleOddsInputChange}
                  type="number"
                  step="0.01"
                  min="1.01"
                />
              </div>
              <div>
                <Label htmlFor="drawOdds">Draw</Label>
                <Input
                  id="drawOdds"
                  name="drawOdds"
                  value={oddsData.drawOdds}
                  onChange={handleOddsInputChange}
                  type="number"
                  step="0.01"
                  min="1.01"
                />
              </div>
              <div>
                <Label htmlFor="awayOdds">{event.awayTeam} (Away)</Label>
                <Input
                  id="awayOdds"
                  name="awayOdds"
                  value={oddsData.awayOdds}
                  onChange={handleOddsInputChange}
                  type="number"
                  step="0.01"
                  min="1.01"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="btts">
          <AccordionTrigger>Both Teams to Score</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="bttsYes">Yes</Label>
                <Input
                  id="bttsYes"
                  name="bttsYes"
                  value={oddsData.bttsYes}
                  onChange={handleOddsInputChange}
                  type="number"
                  step="0.01"
                  min="1.01"
                />
              </div>
              <div>
                <Label htmlFor="bttsNo">No</Label>
                <Input
                  id="bttsNo"
                  name="bttsNo"
                  value={oddsData.bttsNo}
                  onChange={handleOddsInputChange}
                  type="number"
                  step="0.01"
                  min="1.01"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="over-under">
          <AccordionTrigger>Over/Under 2.5 Goals</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="over25">Over 2.5</Label>
                <Input
                  id="over25"
                  name="over25"
                  value={oddsData.over25}
                  onChange={handleOddsInputChange}
                  type="number"
                  step="0.01"
                  min="1.01"
                />
              </div>
              <div>
                <Label htmlFor="under25">Under 2.5</Label>
                <Input
                  id="under25"
                  name="under25"
                  value={oddsData.under25}
                  onChange={handleOddsInputChange}
                  type="number"
                  step="0.01"
                  min="1.01"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
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
