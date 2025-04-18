
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { createDefaultMarketsAndOdds } from '@/services/eventMarketsService';

interface FormData {
  sportId: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  country: string;
  startTime: string;
  isLive: boolean;
}

interface UseEventFormProps {
  onEventCreated: () => Promise<void>;
}

export const useEventForm = ({ onEventCreated }: UseEventFormProps) => {
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
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

  return {
    formData,
    handleInputChange,
    handleSelectChange,
    handleSwitchChange,
    handleCreateEvent
  };
};
