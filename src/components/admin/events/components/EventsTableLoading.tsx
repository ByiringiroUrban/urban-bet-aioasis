
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";

export default function EventsTableLoading() {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-8">
        <div className="flex justify-center">
          <div className="w-6 h-6 border-2 border-bet-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </TableCell>
    </TableRow>
  );
}
