
import React from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Eye, Trash } from "lucide-react";
import { SportEvent } from "@/services/database/types";

interface EventActionsProps {
  event: SportEvent;
  onEdit: (event: SportEvent) => void;
  onView: (eventId: string) => void;
  onDelete: (eventId: string) => void;
}

export default function EventActions({ event, onEdit, onView, onDelete }: EventActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" size="sm" onClick={() => onEdit(event)}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={() => onView(event.id)}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={() => onDelete(event.id)}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}
