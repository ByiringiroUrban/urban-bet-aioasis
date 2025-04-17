
import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MarketOddsGroupProps {
  title: string;
  selections: {
    name: string;
    label: string;
    value: string;
  }[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultOpen?: boolean;
}

export default function MarketOddsGroup({ 
  title, 
  selections, 
  onInputChange,
  defaultOpen
}: MarketOddsGroupProps) {
  const marketKey = title.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <AccordionItem value={marketKey}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {selections.map((selection) => (
            <div key={selection.name}>
              <Label htmlFor={selection.name}>{selection.label}</Label>
              <Input
                id={selection.name}
                name={selection.name}
                value={selection.value}
                onChange={onInputChange}
                type="number"
                step="0.01"
                min="1.01"
              />
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
