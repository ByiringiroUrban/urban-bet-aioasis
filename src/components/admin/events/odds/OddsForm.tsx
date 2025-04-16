
import React from 'react';
import { Accordion } from "@/components/ui/accordion";
import MarketAccordionItem from './MarketAccordionItem';
import { SportEvent } from "@/services/database/types";

interface OddsFormProps {
  event: SportEvent;
  oddsData: {
    homeOdds: string;
    drawOdds: string;
    awayOdds: string;
    bttsYes: string;
    bttsNo: string;
    over25: string;
    under25: string;
  };
  onOddsInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function OddsForm({ event, oddsData, onOddsInputChange }: OddsFormProps) {
  const markets = [
    {
      title: 'Match Winner',
      options: [
        { label: `${event.homeTeam} (Home)`, name: 'homeOdds' },
        { label: 'Draw', name: 'drawOdds' },
        { label: `${event.awayTeam} (Away)`, name: 'awayOdds' }
      ]
    },
    {
      title: 'Both Teams to Score',
      options: [
        { label: 'Yes', name: 'bttsYes' },
        { label: 'No', name: 'bttsNo' }
      ]
    },
    {
      title: 'Over/Under 2.5 Goals',
      options: [
        { label: 'Over 2.5', name: 'over25' },
        { label: 'Under 2.5', name: 'under25' }
      ]
    }
  ];

  return (
    <Accordion type="single" collapsible defaultValue="match-winner">
      {markets.map((market) => (
        <MarketAccordionItem
          key={market.title}
          title={market.title}
          options={market.options}
          values={oddsData}
          onOddsChange={onOddsInputChange}
        />
      ))}
    </Accordion>
  );
}
