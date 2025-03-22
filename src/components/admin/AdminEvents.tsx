
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SportEvent } from "@/services/database/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Pencil, Trash, Plus, Save } from "lucide-react";

export default function AdminEvents() {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [sports, setSports] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<string | null>(null);
  const { toast } = useToast();
  
  // New event form state
  const [formData, setFormData] = useState({
    sportId: "",
    homeTeam: "",
    awayTeam: "",
    league: "",
    country: "",
    startTime: "",
    isLive: false
  });
  
  // Edit event form state
  const [editData, setEditData] = useState<Partial<SportEvent>>({});
  
  useEffect(() => {
    loadSports();
    loadEvents();
  }, []);

  const loadSports = async () => {
    try {
      const { data, error } = await supabase.from('sports').select('id, name');
      
      if (error) throw error;
      
      setSports(data || []);
    } catch (error) {
      console.error('Error loading sports:', error);
      toast({
        title: "Error",
        description: "Failed to load sports. Using mock data.",
        variant: "destructive",
      });
      
      // Mock data fallback
      setSports([
        { id: '1', name: 'Football' },
        { id: '2', name: 'Basketball' },
        { id: '3', name: 'Tennis' }
      ]);
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
        homeOdds: 1.5, // We'll implement odds fetching later
        drawOdds: 3.5,
        awayOdds: 5.0,
        isLive: event.is_live || false,
        sportId: event.sport_id,
        country: event.country || '',
        startTime: event.start_time
      }));
      
      setEvents(transformedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEditSelectChange = (name: string, value: string) => {
    setEditData({
      ...editData,
      [name]: value
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleEditSwitchChange = (name: string, checked: boolean) => {
    setEditData({
      ...editData,
      [name]: checked
    });
  };

  const handleCreateEvent = async () => {
    try {
      // Validate form
      if (!formData.homeTeam || !formData.awayTeam || !formData.startTime || !formData.sportId) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      
      // Format data for Supabase
      const eventData = {
        sport_id: formData.sportId,
        home_team: formData.homeTeam,
        away_team: formData.awayTeam,
        league: formData.league,
        country: formData.country,
        start_time: formData.startTime,
        is_live: formData.isLive
      };
      
      const { error } = await supabase.from('events').insert([eventData]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Event created successfully.",
      });
      
      // Reset form
      setFormData({
        sportId: "",
        homeTeam: "",
        awayTeam: "",
        league: "",
        country: "",
        startTime: "",
        isLive: false
      });
      
      // Reload events
      await loadEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    }
  };

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
      sportId: event.sportId
    });
  };

  const handleSaveEdit = async () => {
    if (!editMode || !editData.id) return;
    
    try {
      // Format data for Supabase
      const eventData = {
        sport_id: editData.sportId,
        home_team: editData.homeTeam,
        away_team: editData.awayTeam,
        league: editData.league,
        country: editData.country,
        start_time: editData.startTime,
        is_live: editData.isLive
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
      
      // Reload events
      await loadEvents();
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
      const { error } = await supabase.from('events').delete().eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Event deleted successfully.",
      });
      
      // Reload events
      await loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Events</h2>
      
      {/* Create Event Form */}
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
          
          <div className="flex items-center space-x-2 mt-6">
            <Switch id="isLive" checked={formData.isLive} onCheckedChange={(checked) => handleSwitchChange('isLive', checked)} />
            <Label htmlFor="isLive">Live Event</Label>
          </div>
        </div>
        
        <Button className="mt-4" onClick={handleCreateEvent}>
          <Plus className="mr-2 h-4 w-4" /> Create Event
        </Button>
      </div>
      
      {/* Events Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Home Team</TableHead>
              <TableHead>Away Team</TableHead>
              <TableHead>League</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>Live</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-2 border-bet-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : events.length > 0 ? (
              events.map(event => (
                <TableRow key={event.id}>
                  {editMode === event.id ? (
                    // Edit Mode
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
                          value={typeof editData.startTime === 'string' ? editData.startTime : ''} 
                          onChange={handleEditInputChange} 
                        />
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={!!editData.isLive} 
                          onCheckedChange={(checked) => handleEditSwitchChange('isLive', checked)} 
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={handleSaveEdit} className="mr-2">
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setEditMode(null)}>
                          Cancel
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    // View Mode
                    <>
                      <TableCell>{event.homeTeam}</TableCell>
                      <TableCell>{event.awayTeam}</TableCell>
                      <TableCell>{event.league}</TableCell>
                      <TableCell>{`${event.date} ${event.time}`}</TableCell>
                      <TableCell>{event.isLive ? 'Yes' : 'No'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)} className="mr-2">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">No events found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
