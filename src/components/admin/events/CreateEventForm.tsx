
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

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

  const createDefaultMarketsAndOdds = async (eventId: string) => {
    try {
      // Create Match Winner market
      const { data: matchWinnerMarket } = await supabase
        .from('markets')
        .insert([{
          event_id: eventId,
          name: 'Match Winner',
          options: ['Home', 'Draw', 'Away']
        }])
        .select();

      // Create BTTS market
      const { data: bttsMarket } = await supabase
        .from('markets')
        .insert([{
          event_id: eventId,
          name: 'Both Teams to Score',
          options: ['Yes', 'No']
        }])
        .select();

      // Create Over/Under market
      const { data: overUnderMarket } = await supabase
        .from('markets')
        .insert([{
          event_id: eventId,
          name: 'Over/Under 2.5 Goals',
          options: ['Over', 'Under']
        }])
        .select();

      if (matchWinnerMarket?.[0]?.id) {
        await supabase.from('odds').insert([
          { event_id: eventId, market_id: matchWinnerMarket[0].id, selection: 'Home', value: 1.90 },
          { event_id: eventId, market_id: matchWinnerMarket[0].id, selection: 'Draw', value: 3.50 },
          { event_id: eventId, market_id: matchWinnerMarket[0].id, selection: 'Away', value: 4.20 }
        ]);
      }

      if (bttsMarket?.[0]?.id) {
        await supabase.from('odds').insert([
          { event_id: eventId, market_id: bttsMarket[0].id, selection: 'Yes', value: 1.80 },
          { event_id: eventId, market_id: bttsMarket[0].id, selection: 'No', value: 2.00 }
        ]);
      }

      if (overUnderMarket?.[0]?.id) {
        await supabase.from('odds').insert([
          { event_id: eventId, market_id: overUnderMarket[0].id, selection: 'Over', value: 1.95 },
          { event_id: eventId, market_id: overUnderMarket[0].id, selection: 'Under', value: 1.85 }
        ]);
      }
    } catch (error) {
      console.error('Error creating markets and odds:', error);
      throw error;
    }
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
        // Removed 'featured' field as it doesn't exist in the database
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

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4">Create New Event</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="sportId">Sport*</Label>
          <Select value={formData.sportId} onValueChange={(value) => handleSelectChange('sportId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Sport" />
            </SelectTrigger>
            <SelectContent>
              {sports.map(sport => (
                <SelectItem key={sport.id} value={sport.id}>{sport.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="homeTeam">Home Team*</Label>
          <Input id="homeTeam" name="homeTeam" value={formData.homeTeam} onChange={handleInputChange} placeholder="Home Team" />
        </div>

        <div>
          <Label htmlFor="awayTeam">Away Team*</Label>
          <Input id="awayTeam" name="awayTeam" value={formData.awayTeam} onChange={handleInputChange} placeholder="Away Team" />
        </div>

        <div>
          <Label htmlFor="league">League</Label>
          <Input id="league" name="league" value={formData.league} onChange={handleInputChange} placeholder="League" />
        </div>

        <div>
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" value={formData.country} onChange={handleInputChange} placeholder="Country" />
        </div>

        <div>
          <Label htmlFor="startTime">Start Time*</Label>
          <Input id="startTime" name="startTime" type="datetime-local" value={formData.startTime} onChange={handleInputChange} />
        </div>

        <div className="flex items-center space-x-8 mt-6">
          <div className="flex items-center space-x-2">
            <Switch id="isLive" checked={formData.isLive} onCheckedChange={(checked) => handleSwitchChange('isLive', checked)} />
            <Label htmlFor="isLive">Live Event</Label>
          </div>
          
          {/* Removed the 'Featured on Homepage' switch since the column doesn't exist */}
        </div>
      </div>

      <Button className="mt-4" onClick={handleCreateEvent}>
        <Plus className="mr-2 h-4 w-4" /> Create Event
      </Button>
    </div>
  );
}
