
import React from 'react';
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";

interface FormActionsProps {
  onSave: () => void;
  onCancel: () => void;
}

export default function FormActions({ onSave, onCancel }: FormActionsProps) {
  return (
    <TableCell className="text-right">
      <Button variant="outline" size="sm" onClick={onSave} className="mr-2">
        Save
      </Button>
      <Button variant="outline" size="sm" onClick={onCancel}>
        Cancel
      </Button>
    </TableCell>
  );
}
