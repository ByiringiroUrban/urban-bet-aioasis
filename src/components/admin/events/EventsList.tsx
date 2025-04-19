
import React, { useState } from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { SportEvent } from "@/services/database/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import OddsManagement from './OddsManagement';
import EditEventForm from './EditEventForm';
import EventsTableLoading from './components/EventsTableLoading';
import EventsTableEmpty from './components/EventsTableEmpty';
import EventDetailsRow from './components/EventDetailsRow';

interface EventsListProps {
  events: SportEvent[];
  loading: boolean;
  onEventUpdated: () => Promise<void>;
}

export default function EventsList({ events, loading, onEventUpdated }: EventsListProps) {
  const [editMode, setEditMode] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<SportEvent>>({});
  const { toast } = useToast();

  const handleEditEvent = (event: SportEvent) => {
    setEditMode(event.id);
    setEditData({
      id: event.id,
      homeTeam: event.homeTeam,
      awayTeam: event.awayTeam,
      league: event.league,
      country: event.country,
      startTime: event.startTime,
      isLive: event.isLive,
      sportId: event.sportId,
      featured: event.featured
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value
    });
  };

  const handleEditSwitchChange = (name: string, checked: boolean) => {
    setEditData({
      ...editData,
      [name]: checked
    });
  };

  const handleSaveEdit = async () => {
    if (!editMode || !editData.id) return;

    try {
      const eventData = {
        sport_id: editData.sportId,
        home_team: editData.homeTeam,
        away_team: editData.awayTeam,
        league: editData.league,
        country: editData.country,
        start_time: editData.startTime,
        is_live: editData.isLive,
        featured: editData.featured
      };

      const { error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', editData.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event updated successfully.",
      });

      setEditMode(null);
      setEditData({});
      await onEventUpdated();
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error: oddsError } = await supabase
        .from('odds')
        .delete()
        .eq('event_id', id);

      if (oddsError) throw oddsError;

      const { error: marketsError } = await supabase
        .from('markets')
        .delete()
        .eq('event_id', id);

      if (marketsError) throw marketsError;

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event deleted successfully.",
      });

      await onEventUpdated();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) return <EventsTableLoading />;
  if (events.length === 0) return <EventsTableEmpty />;

  return (
    <>
      {events.map((event) => (
        <React.Fragment key={event.id}>
          <TableRow>
            {editMode === event.id ? (
              <EditEventForm
                editData={editData}
                onInputChange={handleEditInputChange}
                onSwitchChange={handleEditSwitchChange}
                onSave={handleSaveEdit}
                onCancel={() => setEditMode(null)}
              />
            ) : (
              <EventDetailsRow
                event={event}
                onEdit={handleEditEvent}
                onView={(id) => setSelectedEvent(id)}
                onDelete={handleDeleteEvent}
              />
            )}
          </TableRow>
          {selectedEvent === event.id && (
            <TableRow>
              <TableCell colSpan={6} className="bg-muted/30">
                <OddsManagement 
                  event={event} 
                  onClose={() => setSelectedEvent(null)}
                  onOddsUpdated={onEventUpdated}
                />
              </TableCell>
            </TableRow>
          )}
        </React.Fragment>
      ))}
    </>
  );
}
