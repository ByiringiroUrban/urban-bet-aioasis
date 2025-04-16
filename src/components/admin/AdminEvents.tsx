
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SportEvent } from "@/services/database/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Pencil, Trash, Plus, Save, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

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
    isLive: false,
    featured: false
  });
  
  // Edit event form state
  const [editData, setEditData] = useState<Partial<SportEvent>>({});
  
  // Odds management
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [oddsData, setOddsData] = useState<{
    homeOdds: string;
    drawOdds: string;
    awayOdds: string;
    bttsYes: string;
    bttsNo: string;
    over25: string;
    under25: string;
  }>({
    homeOdds: "1.90",
    drawOdds: "3.50",
    awayOdds: "4.20",
    bttsYes: "1.80",
    bttsNo: "2.00",
    over25: "1.95",
    under25: "1.85"
  });
  
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
        homeOdds: 1.5, // We'll get actual odds later
        drawOdds: 3.5,
        awayOdds: 5.0,
        isLive: event.is_live || false,
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
      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const loadOddsForEvent = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('odds')
        .select('market_id, selection, value')
        .eq('event_id', eventId);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Update events with odds data
        setEvents(prevEvents => 
          prevEvents.map(event => {
            if (event.id === eventId) {
              // Find home, draw, and away odds
              const matchWinnerOdds = data.filter(odd => 
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
  
  const handleOddsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOddsData({
      ...oddsData,
      [name]: value
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
        is_live: formData.isLive,
        featured: formData.featured
      };
      
      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select();
      
      if (error) throw error;
      
      // Get the created event ID
      const eventId = data?.[0]?.id;
      
      if (!eventId) {
        throw new Error("Failed to retrieve event ID");
      }
      
      // Create default markets for the event
      await createDefaultMarketsAndOdds(eventId);
      
      toast({
        title: "Success",
        description: "Event and odds created successfully.",
      });
      
      // Reset form
      setFormData({
        sportId: "",
        homeTeam: "",
        awayTeam: "",
        league: "",
        country: "",
        startTime: "",
        isLive: false,
        featured: false
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
  
  const createDefaultMarketsAndOdds = async (eventId: string) => {
    try {
      // Create Match Winner market
      const { data: matchWinnerMarket, error: matchWinnerError } = await supabase
        .from('markets')
        .insert([
          {
            event_id: eventId,
            name: 'Match Winner',
            options: ['Home', 'Draw', 'Away']
          }
        ])
        .select();
        
      if (matchWinnerError) throw matchWinnerError;
      
      const matchWinnerMarketId = matchWinnerMarket?.[0]?.id;
      
      // Create BTTS market
      const { data: bttsMarket, error: bttsError } = await supabase
        .from('markets')
        .insert([
          {
            event_id: eventId,
            name: 'Both Teams to Score',
            options: ['Yes', 'No']
          }
        ])
        .select();
        
      if (bttsError) throw bttsError;
      
      const bttsMarketId = bttsMarket?.[0]?.id;
      
      // Create Over/Under 2.5 Goals market
      const { data: overUnderMarket, error: overUnderError } = await supabase
        .from('markets')
        .insert([
          {
            event_id: eventId,
            name: 'Over/Under 2.5 Goals',
            options: ['Over', 'Under']
          }
        ])
        .select();
        
      if (overUnderError) throw overUnderError;
      
      const overUnderMarketId = overUnderMarket?.[0]?.id;
      
      // Insert odds for Match Winner market
      if (matchWinnerMarketId) {
        const matchWinnerOdds = [
          { event_id: eventId, market_id: matchWinnerMarketId, selection: 'Home', value: 1.90 },
          { event_id: eventId, market_id: matchWinnerMarketId, selection: 'Draw', value: 3.50 },
          { event_id: eventId, market_id: matchWinnerMarketId, selection: 'Away', value: 4.20 }
        ];
        
        const { error: oddsError } = await supabase
          .from('odds')
          .insert(matchWinnerOdds);
          
        if (oddsError) throw oddsError;
      }
      
      // Insert odds for BTTS market
      if (bttsMarketId) {
        const bttsOdds = [
          { event_id: eventId, market_id: bttsMarketId, selection: 'Yes', value: 1.80 },
          { event_id: eventId, market_id: bttsMarketId, selection: 'No', value: 2.00 }
        ];
        
        const { error: oddsError } = await supabase
          .from('odds')
          .insert(bttsOdds);
          
        if (oddsError) throw oddsError;
      }
      
      // Insert odds for Over/Under 2.5 Goals market
      if (overUnderMarketId) {
        const overUnderOdds = [
          { event_id: eventId, market_id: overUnderMarketId, selection: 'Over', value: 1.95 },
          { event_id: eventId, market_id: overUnderMarketId, selection: 'Under', value: 1.85 }
        ];
        
        const { error: oddsError } = await supabase
          .from('odds')
          .insert(overUnderOdds);
          
        if (oddsError) throw oddsError;
      }
    } catch (error) {
      console.error('Error creating markets and odds:', error);
      throw error;
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
      sportId: event.sportId,
      featured: event.featured
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
      // First delete related odds
      const { error: oddsError } = await supabase
        .from('odds')
        .delete()
        .eq('event_id', id);
        
      if (oddsError) throw oddsError;
      
      // Then delete related markets
      const { error: marketsError } = await supabase
        .from('markets')
        .delete()
        .eq('event_id', id);
        
      if (marketsError) throw marketsError;
      
      // Finally delete the event
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
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
  
  const handleManageOdds = (eventId: string) => {
    setSelectedEvent(eventId);
    
    // Load existing odds for this event
    const loadEventOdds = async () => {
      try {
        const { data: oddsData, error } = await supabase
          .from('odds')
          .select('market_id, selection, value')
          .eq('event_id', eventId);
          
        if (error) throw error;
        
        if (oddsData && oddsData.length > 0) {
          // Create a new object to hold our odds values
          const newOddsValues = { ...oddsData };
          
          // Initialize with default values
          const newOdds = {
            homeOdds: "1.90",
            drawOdds: "3.50",
            awayOdds: "4.20",
            bttsYes: "1.80",
            bttsNo: "2.00",
            over25: "1.95",
            under25: "1.85"
          };
          
          // Update with actual values from database
          for (const odd of oddsData) {
            if (odd.selection === 'Home') newOdds.homeOdds = odd.value.toString();
            else if (odd.selection === 'Draw') newOdds.drawOdds = odd.value.toString();
            else if (odd.selection === 'Away') newOdds.awayOdds = odd.value.toString();
            else if (odd.selection === 'Yes') newOdds.bttsYes = odd.value.toString();
            else if (odd.selection === 'No') newOdds.bttsNo = odd.value.toString();
            else if (odd.selection === 'Over') newOdds.over25 = odd.value.toString();
            else if (odd.selection === 'Under') newOdds.under25 = odd.value.toString();
          }
          
          setOddsData(newOdds);
        }
      } catch (error) {
        console.error('Error loading odds:', error);
      }
    };
    
    loadEventOdds();
  };
  
  const handleSaveOdds = async () => {
    if (!selectedEvent) return;
    
    try {
      // Get the market IDs for this event
      const { data: markets, error: marketsError } = await supabase
        .from('markets')
        .select('id, name')
        .eq('event_id', selectedEvent);
        
      if (marketsError) throw marketsError;
      
      if (!markets || markets.length === 0) {
        throw new Error("No markets found for this event");
      }
      
      // Find market IDs
      const matchWinnerMarket = markets.find(m => m.name === 'Match Winner');
      const bttsMarket = markets.find(m => m.name === 'Both Teams to Score');
      const overUnderMarket = markets.find(m => m.name === 'Over/Under 2.5 Goals');
      
      // Update Match Winner odds
      if (matchWinnerMarket) {
        const matchWinnerUpdates = [
          { 
            selection: 'Home', 
            value: parseFloat(oddsData.homeOdds),
            event_id: selectedEvent,
            market_id: matchWinnerMarket.id 
          },
          { 
            selection: 'Draw', 
            value: parseFloat(oddsData.drawOdds),
            event_id: selectedEvent,
            market_id: matchWinnerMarket.id 
          },
          { 
            selection: 'Away', 
            value: parseFloat(oddsData.awayOdds),
            event_id: selectedEvent,
            market_id: matchWinnerMarket.id 
          }
        ];
        
        for (const update of matchWinnerUpdates) {
          const { error } = await supabase
            .from('odds')
            .upsert(update, { 
              onConflict: 'event_id,market_id,selection', 
              ignoreDuplicates: false 
            });
            
          if (error) throw error;
        }
      }
      
      // Update BTTS odds
      if (bttsMarket) {
        const bttsUpdates = [
          { 
            selection: 'Yes', 
            value: parseFloat(oddsData.bttsYes),
            event_id: selectedEvent,
            market_id: bttsMarket.id 
          },
          { 
            selection: 'No', 
            value: parseFloat(oddsData.bttsNo),
            event_id: selectedEvent,
            market_id: bttsMarket.id 
          }
        ];
        
        for (const update of bttsUpdates) {
          const { error } = await supabase
            .from('odds')
            .upsert(update, { 
              onConflict: 'event_id,market_id,selection', 
              ignoreDuplicates: false 
            });
            
          if (error) throw error;
        }
      }
      
      // Update Over/Under odds
      if (overUnderMarket) {
        const overUnderUpdates = [
          { 
            selection: 'Over', 
            value: parseFloat(oddsData.over25),
            event_id: selectedEvent,
            market_id: overUnderMarket.id 
          },
          { 
            selection: 'Under', 
            value: parseFloat(oddsData.under25),
            event_id: selectedEvent,
            market_id: overUnderMarket.id 
          }
        ];
        
        for (const update of overUnderUpdates) {
          const { error } = await supabase
            .from('odds')
            .upsert(update, { 
              onConflict: 'event_id,market_id,selection', 
              ignoreDuplicates: false 
            });
            
          if (error) throw error;
        }
      }
      
      toast({
        title: "Success",
        description: "Odds updated successfully.",
      });
      
      setSelectedEvent(null);
      
      // Reload events to update displayed odds
      await loadEvents();
    } catch (error) {
      console.error('Error saving odds:', error);
      toast({
        title: "Error",
        description: "Failed to save odds. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Events</h2>
      
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="create">Create Event</TabsTrigger>
          <TabsTrigger value="manage">Manage Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create">
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
              
              <div className="flex items-center space-x-8 mt-6">
                <div className="flex items-center space-x-2">
                  <Switch id="isLive" checked={formData.isLive} onCheckedChange={(checked) => handleSwitchChange('isLive', checked)} />
                  <Label htmlFor="isLive">Live Event</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="featured" checked={formData.featured} onCheckedChange={(checked) => handleSwitchChange('featured', checked)} />
                  <Label htmlFor="featured">Featured on Homepage</Label>
                </div>
              </div>
            </div>
            
            <Button className="mt-4" onClick={handleCreateEvent}>
              <Plus className="mr-2 h-4 w-4" /> Create Event
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="manage">
          {/* Events Table */}
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex justify-center">
                        <div className="w-6 h-6 border-2 border-bet-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : events.length > 0 ? (
                  events.map((event) => (
                    <React.Fragment key={event.id}>
                      <TableRow>
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
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center space-x-2">
                                  <Switch 
                                    checked={!!editData.isLive} 
                                    onCheckedChange={(checked) => handleEditSwitchChange('isLive', checked)} 
                                  />
                                  <span>Live</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch 
                                    checked={!!editData.featured} 
                                    onCheckedChange={(checked) => handleEditSwitchChange('featured', checked)} 
                                  />
                                  <span>Featured</span>
                                </div>
                              </div>
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
                                <Button variant="outline" size="sm" onClick={() => handleManageOdds(event.id)}>
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
                      
                      {/* Odds Management Panel */}
                      {selectedEvent === event.id && (
                        <TableRow>
                          <TableCell colSpan={6} className="bg-muted/30">
                            <div className="p-4">
                              <h4 className="font-semibold mb-4">Manage Odds: {event.homeTeam} vs {event.awayTeam}</h4>
                              
                              <Accordion type="single" collapsible defaultValue="match-winner">
                                <AccordionItem value="match-winner">
                                  <AccordionTrigger>Match Winner</AccordionTrigger>
                                  <AccordionContent>
                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                      <div>
                                        <Label htmlFor="homeOdds">{event.homeTeam} (Home)</Label>
                                        <Input 
                                          id="homeOdds" 
                                          name="homeOdds" 
                                          value={oddsData.homeOdds} 
                                          onChange={handleOddsInputChange} 
                                          type="number" 
                                          step="0.01" 
                                          min="1.01" 
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="drawOdds">Draw</Label>
                                        <Input 
                                          id="drawOdds" 
                                          name="drawOdds" 
                                          value={oddsData.drawOdds} 
                                          onChange={handleOddsInputChange} 
                                          type="number" 
                                          step="0.01" 
                                          min="1.01" 
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="awayOdds">{event.awayTeam} (Away)</Label>
                                        <Input 
                                          id="awayOdds" 
                                          name="awayOdds" 
                                          value={oddsData.awayOdds} 
                                          onChange={handleOddsInputChange} 
                                          type="number" 
                                          step="0.01" 
                                          min="1.01" 
                                        />
                                      </div>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                                
                                <AccordionItem value="btts">
                                  <AccordionTrigger>Both Teams to Score</AccordionTrigger>
                                  <AccordionContent>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                      <div>
                                        <Label htmlFor="bttsYes">Yes</Label>
                                        <Input 
                                          id="bttsYes" 
                                          name="bttsYes" 
                                          value={oddsData.bttsYes} 
                                          onChange={handleOddsInputChange} 
                                          type="number" 
                                          step="0.01" 
                                          min="1.01" 
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="bttsNo">No</Label>
                                        <Input 
                                          id="bttsNo" 
                                          name="bttsNo" 
                                          value={oddsData.bttsNo} 
                                          onChange={handleOddsInputChange} 
                                          type="number" 
                                          step="0.01" 
                                          min="1.01" 
                                        />
                                      </div>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                                
                                <AccordionItem value="over-under">
                                  <AccordionTrigger>Over/Under 2.5 Goals</AccordionTrigger>
                                  <AccordionContent>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                      <div>
                                        <Label htmlFor="over25">Over 2.5</Label>
                                        <Input 
                                          id="over25" 
                                          name="over25" 
                                          value={oddsData.over25} 
                                          onChange={handleOddsInputChange} 
                                          type="number" 
                                          step="0.01" 
                                          min="1.01" 
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="under25">Under 2.5</Label>
                                        <Input 
                                          id="under25" 
                                          name="under25" 
                                          value={oddsData.under25} 
                                          onChange={handleOddsInputChange} 
                                          type="number" 
                                          step="0.01" 
                                          min="1.01" 
                                        />
                                      </div>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                              
                              <div className="flex justify-end mt-4 gap-2">
                                <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleSaveOdds}>
                                  Save Odds
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">No events found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
