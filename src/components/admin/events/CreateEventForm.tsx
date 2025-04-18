
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEventForm } from './hooks/useEventForm';
import EventFormFields from './components/EventFormFields';

interface Sport {
  id: string;
  name: string;
}

interface CreateEventFormProps {
  sports: Sport[];
  onEventCreated: () => Promise<void>;
}

export default function CreateEventForm({ sports, onEventCreated }: CreateEventFormProps) {
  const {
    formData,
    handleInputChange,
    handleSelectChange,
    handleSwitchChange,
    handleCreateEvent
  } = useEventForm({ onEventCreated });

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4">Create New Event</h3>
      
      <EventFormFields
        sports={sports}
        formData={formData}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onSwitchChange={handleSwitchChange}
      />

      <Button className="mt-4" onClick={handleCreateEvent}>
        <Plus className="mr-2 h-4 w-4" /> Create Event
      </Button>
    </div>
  );
}
