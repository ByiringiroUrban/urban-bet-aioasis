
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getSports } from "@/services/sportsDataService";
import { SportEvent } from "@/services/database/types";
import { supabase } from "@/lib/supabase";
import CreateEventForm from "./events/CreateEventForm";
import EventsList from "./events/EventsList";

export default function AdminEvents() {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [sports, setSports] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSports();
    loadEvents();
  }, []);

  const loadSports = async () => {
    try {
      const sports = await getSports();
      setSports(sports);
    } catch (error) {
      console.error('Error loading sports:', error);
      setSports([]);
    }
  };

  const loadEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) throw error;

      // Transform to match SportEvent type
      const transformedEvents = (data || []).map(event => ({
        id: event.id,
        homeTeam: event.home_team,
        awayTeam: event.away_team,
        league: event.league || '',
        time: new Date(event.start_time).toLocaleTimeString(),
        date: new Date(event.start_time).toLocaleDateString(),
        homeOdds: 1.5,
        drawOdds: 3.5,
        awayOdds: 5.0,
        isLive: event.is_live ||false,
        sportId: event.sport_id,
        country: event.country || '',
        startTime: event.start_time,
        featured: event.featured || false
      }));

      setEvents(transformedEvents);

      // Load odds for each event
      for (const event of transformedEvents) {
        await loadOddsForEvent(event.id);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOddsForEvent = async (eventId: string) => {
    try {
      const { data: oddsData, error } = await supabase
        .from('odds')
        .select('market_id, selection, value')
        .eq('event_id', eventId);

      if (error) throw error;

      if (oddsData && oddsData.length > 0) {
        setEvents(prevEvents =>
          prevEvents.map(event => {
            if (event.id === eventId) {
              const matchWinnerOdds = oddsData.filter(odd =>
                odd.selection === 'Home' ||
                odd.selection === 'Draw' ||
                odd.selection === 'Away'
              );

              let homeOdds = event.homeOdds;
              let drawOdds = event.drawOdds;
              let awayOdds = event.awayOdds;

              for (const odd of matchWinnerOdds) {
                if (odd.selection === 'Home') homeOdds = Number(odd.value);
                if (odd.selection === 'Draw') drawOdds = Number(odd.value);
                if (odd.selection === 'Away') awayOdds = Number(odd.value);
              }

              return {
                ...event,
                homeOdds,
                drawOdds,
                awayOdds
              };
            }
            return event;
          })
        );
      }
    } catch (error) {
      console.error('Error loading odds for event:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Events</h2>

      <CreateEventForm 
        sports={sports}
        onEventCreated={loadEvents}
      />

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Home Team</TableHead>
              <TableHead>Away Team</TableHead>
              <TableHead>League</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <EventsList 
              events={events}
              loading={loading}
              onEventUpdated={loadEvents}
            />
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
