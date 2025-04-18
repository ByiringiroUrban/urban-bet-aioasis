
import React from "react";
import { TableCell } from "@/components/ui/table";
import { SportEvent } from "@/services/database/types";
import EventStatusBadges from "./EventStatusBadges";
import EventActions from "../EventActions";

interface EventDetailsRowProps {
  event: SportEvent;
  onEdit: (event: SportEvent) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function EventDetailsRow({ event, onEdit, onView, onDelete }: EventDetailsRowProps) {
  return (
    <>
      <TableCell>{event.homeTeam}</TableCell>
      <TableCell>{event.awayTeam}</TableCell>
      <TableCell>{event.league}</TableCell>
      <TableCell>{`${event.date} ${event.time}`}</TableCell>
      <TableCell>
        <EventStatusBadges isLive={event.isLive || false} featured={event.featured || false} />
      </TableCell>
      <TableCell>
        <EventActions
          event={event}
          onEdit={onEdit}
          onView={onView}
          onDelete={onDelete}
        />
      </TableCell>
    </>
  );
}
