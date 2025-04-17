
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SwitchOption {
  name: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface EventSwitchFieldProps {
  options: SwitchOption[];
}

const EventSwitchField = ({ options }: EventSwitchFieldProps) => {
  return (
    <div className="flex items-center space-x-8 mt-6">
      {options.map((option) => (
        <div key={option.name} className="flex items-center space-x-2">
          <Switch 
            id={option.name} 
            checked={option.checked} 
            onCheckedChange={option.onChange} 
          />
          <Label htmlFor={option.name}>{option.label}</Label>
        </div>
      ))}
    </div>
  );
};

export default EventSwitchField;
