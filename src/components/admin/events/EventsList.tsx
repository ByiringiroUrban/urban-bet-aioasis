
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SportEvent } from "@/services/database/types";
import { Pencil, Trash, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import OddsManagement from './OddsManagement';

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

  if (loading) {
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

  if (events.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="text-center py-6">No events found</TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {events.map((event) => (
        <React.Fragment key={event.id}>
          <TableRow>
            {editMode === event.id ? (
              <>
                <TableCell>
                  <Input 
                    name="homeTeam" 
                    value={editData.homeTeam || ''} 
                    onChange={handleEditInputChange} 
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    name="awayTeam" 
                    value={editData.awayTeam || ''} 
                    onChange={handleEditInputChange} 
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    name="league" 
                    value={editData.league || ''} 
                    onChange={handleEditInputChange} 
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    name="startTime" 
                    type="datetime-local" 
                    value={editData.startTime || ''} 
                    onChange={handleEditInputChange} 
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={editData.isLive || false} 
                        onCheckedChange={(checked) => handleEditSwitchChange('isLive', checked)} 
                      />
                      <span>Live</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={editData.featured || false}
                        onCheckedChange={(checked) => handleEditSwitchChange('featured', checked)} 
                      />
                      <span>Featured</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={handleSaveEdit} className="mr-2">
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditMode(null)}>
                    Cancel
                  </Button>
                </TableCell>
              </>
            ) : (
              <>
                <TableCell>{event.homeTeam}</TableCell>
                <TableCell>{event.awayTeam}</TableCell>
                <TableCell>{event.league}</TableCell>
                <TableCell>{`${event.date} ${event.time}`}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {event.isLive && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        Live
                      </span>
                    )}
                    {event.featured && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        Featured
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedEvent(event.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </>
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
