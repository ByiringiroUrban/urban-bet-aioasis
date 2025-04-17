
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TableCell } from "@/components/ui/table";

interface FormFieldProps {
  name: string;
  label?: string;
  value: string | number | boolean | undefined;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormField({
  name,
  label,
  value,
  type = 'text',
  onChange
}: FormFieldProps) {
  // Convert boolean values to strings for input value
  const inputValue = typeof value === 'boolean' ? value.toString() : (value ?? '');
  
  return (
    <TableCell>
      {label && <Label htmlFor={name}>{label}</Label>}
      <Input
        id={name}
        name={name}
        value={inputValue}
        onChange={onChange}
        type={type}
      />
    </TableCell>
  );
}
