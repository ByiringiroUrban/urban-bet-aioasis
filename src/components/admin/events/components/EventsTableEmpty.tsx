
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";

export default function EventsTableEmpty() {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-6">No events found</TableCell>
    </TableRow>
  );
}
