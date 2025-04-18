
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SelectField from '../form/SelectField';
import EventSwitchField from '../form/EventSwitchField';

interface Sport {
  id: string;
  name: string;
}

interface EventFormFieldsProps {
  sports: Sport[];
  formData: {
    sportId: string;
    homeTeam: string;
    awayTeam: string;
    league: string;
    country: string;
    startTime: string;
    isLive: boolean;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onSwitchChange: (name: string, checked: boolean) => void;
}

const EventFormFields = ({
  sports,
  formData,
  onInputChange,
  onSelectChange,
  onSwitchChange
}: EventFormFieldsProps) => {
  const switchOptions = [
    {
      name: 'isLive',
      label: 'Live Event',
      checked: formData.isLive,
      onChange: (checked: boolean) => onSwitchChange('isLive', checked)
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <SelectField
        label="Sport"
        name="sportId"
        options={sports}
        value={formData.sportId}
        onChange={onSelectChange}
        required
      />

      <div>
        <Label htmlFor="homeTeam">Home Team<span className="text-destructive ml-1">*</span></Label>
        <Input 
          id="homeTeam" 
          name="homeTeam" 
          value={formData.homeTeam} 
          onChange={onInputChange} 
          placeholder="Home Team" 
        />
      </div>

      <div>
        <Label htmlFor="awayTeam">Away Team<span className="text-destructive ml-1">*</span></Label>
        <Input 
          id="awayTeam" 
          name="awayTeam" 
          value={formData.awayTeam} 
          onChange={onInputChange} 
          placeholder="Away Team" 
        />
      </div>

      <div>
        <Label htmlFor="league">League</Label>
        <Input 
          id="league" 
          name="league" 
          value={formData.league} 
          onChange={onInputChange} 
          placeholder="League" 
        />
      </div>

      <div>
        <Label htmlFor="country">Country</Label>
        <Input 
          id="country" 
          name="country" 
          value={formData.country} 
          onChange={onInputChange} 
          placeholder="Country" 
        />
      </div>

      <div>
        <Label htmlFor="startTime">Start Time<span className="text-destructive ml-1">*</span></Label>
        <Input 
          id="startTime" 
          name="startTime" 
          type="datetime-local" 
          value={formData.startTime} 
          onChange={onInputChange} 
        />
      </div>

      <EventSwitchField options={switchOptions} />
    </div>
  );
};

export default EventFormFields;
