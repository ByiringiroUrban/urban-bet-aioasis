
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TableCell } from "@/components/ui/table";
import { SportEvent } from "@/services/database/types";

interface EditEventFormProps {
  editData: Partial<SportEvent>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSwitchChange: (name: string, checked: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function EditEventForm({
  editData,
  onInputChange,
  onSwitchChange,
  onSave,
  onCancel
}: EditEventFormProps) {
  return (
    <>
      <TableCell>
        <Input 
          name="homeTeam" 
          value={editData.homeTeam || ''} 
          onChange={onInputChange} 
        />
      </TableCell>
      <TableCell>
        <Input 
          name="awayTeam" 
          value={editData.awayTeam || ''} 
          onChange={onInputChange} 
        />
      </TableCell>
      <TableCell>
        <Input 
          name="league" 
          value={editData.league || ''} 
          onChange={onInputChange} 
        />
      </TableCell>
      <TableCell>
        <Input 
          name="startTime" 
          type="datetime-local" 
          value={editData.startTime || ''} 
          onChange={onInputChange} 
        />
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={editData.isLive || false} 
              onCheckedChange={(checked) => onSwitchChange('isLive', checked)} 
            />
            <span>Live</span>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              checked={editData.featured || false}
              onCheckedChange={(checked) => onSwitchChange('featured', checked)} 
            />
            <span>Featured</span>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="outline" size="sm" onClick={onSave} className="mr-2">
          Save
        </Button>
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </TableCell>
    </>
  );
}
