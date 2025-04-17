
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Option {
  id: string;
  name: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  options: Option[];
  value: string;
  onChange: (name: string, value: string) => void;
  required?: boolean;
}

const SelectField = ({ 
  label, 
  name, 
  options, 
  value, 
  onChange, 
  required = false 
}: SelectFieldProps) => {
  return (
    <div>
      <Label htmlFor={name}>{label}{required && <span className="text-destructive ml-1">*</span>}</Label>
      <Select value={value} onValueChange={(value) => onChange(name, value)}>
        <SelectTrigger id={name}>
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectField;
