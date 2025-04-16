
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface MarketOddsData {
  [key: string]: string;
}

interface MarketAccordionItemProps {
  title: string;
  options: { label: string; name: string }[];
  values: MarketOddsData;
  onOddsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function MarketAccordionItem({
  title,
  options,
  values,
  onOddsChange
}: MarketAccordionItemProps) {
  const marketKey = title.toLowerCase().replace(/\s+/g, '-');

  return (
    <AccordionItem value={marketKey}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {options.map(({ label, name }) => (
            <div key={name}>
              <Label htmlFor={name}>{label}</Label>
              <Input
                id={name}
                name={name}
                value={values[name]}
                onChange={onOddsChange}
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
