
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import FormSection from './form/FormSection';
import SelectField from './form/SelectField';
import EventSwitchField from './form/EventSwitchField';
import { createDefaultMarketsAndOdds } from '@/services/eventMarketsService';

interface Sport {
  id: string;
  name: string;
}

interface FormData {
  sportId: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  country: string;
  startTime: string;
  isLive: boolean;
}

interface CreateEventFormProps {
  sports: Sport[];
  onEventCreated: () => Promise<void>;
}

export default function CreateEventForm({ sports, onEventCreated }: CreateEventFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    sportId: "",
    homeTeam: "",
    awayTeam: "",
    league: "",
    country: "",
    startTime: "",
    isLive: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleCreateEvent = async () => {
    try {
      if (!formData.homeTeam || !formData.awayTeam || !formData.startTime || !formData.sportId) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      const eventData = {
        sport_id: formData.sportId,
        home_team: formData.homeTeam,
        away_team: formData.awayTeam,
        league: formData.league,
        country: formData.country,
        start_time: formData.startTime,
        is_live: formData.isLive
      };

      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select();

      if (error) throw error;

      const eventId = data?.[0]?.id;
      if (!eventId) throw new Error("Failed to retrieve event ID");

      await createDefaultMarketsAndOdds(eventId);

      toast({
        title: "Success",
        description: "Event and odds created successfully.",
      });

      setFormData({
        sportId: "",
        homeTeam: "",
        awayTeam: "",
        league: "",
        country: "",
        startTime: "",
        isLive: false
      });

      await onEventCreated();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const switchOptions = [
    {
      name: 'isLive',
      label: 'Live Event',
      checked: formData.isLive,
      onChange: (checked: boolean) => handleSwitchChange('isLive', checked)
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4">Create New Event</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SelectField
          label="Sport"
          name="sportId"
          options={sports}
          value={formData.sportId}
          onChange={handleSelectChange}
          required
        />

        <div>
          <Label htmlFor="homeTeam">Home Team<span className="text-destructive ml-1">*</span></Label>
          <Input 
            id="homeTeam" 
            name="homeTeam" 
            value={formData.homeTeam} 
            onChange={handleInputChange} 
            placeholder="Home Team" 
          />
        </div>

        <div>
          <Label htmlFor="awayTeam">Away Team<span className="text-destructive ml-1">*</span></Label>
          <Input 
            id="awayTeam" 
            name="awayTeam" 
            value={formData.awayTeam} 
            onChange={handleInputChange} 
            placeholder="Away Team" 
          />
        </div>

        <div>
          <Label htmlFor="league">League</Label>
          <Input 
            id="league" 
            name="league" 
            value={formData.league} 
            onChange={handleInputChange} 
            placeholder="League" 
          />
        </div>

        <div>
          <Label htmlFor="country">Country</Label>
          <Input 
            id="country" 
            name="country" 
            value={formData.country} 
            onChange={handleInputChange} 
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
            onChange={handleInputChange} 
          />
        </div>

        <EventSwitchField options={switchOptions} />
      </div>

      <Button className="mt-4" onClick={handleCreateEvent}>
        <Plus className="mr-2 h-4 w-4" /> Create Event
      </Button>
    </div>
  );
}
