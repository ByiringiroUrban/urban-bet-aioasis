
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { TableCell } from "@/components/ui/table";

interface SwitchFieldProps {
  options: {
    name: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }[];
}

export default function SwitchField({ options }: SwitchFieldProps) {
  return (
    <TableCell>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <div key={option.name} className="flex items-center space-x-2">
            <Switch 
              checked={option.checked} 
              onCheckedChange={option.onChange} 
            />
            <span>{option.label}</span>
          </div>
        ))}
      </div>
    </TableCell>
  );
}
