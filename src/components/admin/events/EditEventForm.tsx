
import React from 'react';
import { SportEvent } from "@/services/database/types";
import FormField from './form/FormField';
import SwitchField from './form/SwitchField';
import FormActions from './form/FormActions';

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
      <FormField 
        name="homeTeam" 
        value={editData.homeTeam || ''} 
        onChange={onInputChange} 
      />
      <FormField 
        name="awayTeam" 
        value={editData.awayTeam || ''} 
        onChange={onInputChange} 
      />
      <FormField 
        name="league" 
        value={editData.league || ''} 
        onChange={onInputChange} 
      />
      <FormField 
        name="startTime" 
        type="datetime-local" 
        value={editData.startTime || ''} 
        onChange={onInputChange} 
      />
      <SwitchField 
        options={[
          {
            name: 'isLive',
            label: 'Live',
            checked: editData.isLive || false,
            onChange: (checked) => onSwitchChange('isLive', checked)
          },
          {
            name: 'featured',
            label: 'Featured',
            checked: editData.featured || false,
            onChange: (checked) => onSwitchChange('featured', checked)
          }
        ]} 
      />
      <FormActions onSave={onSave} onCancel={onCancel} />
    </>
  );
}
