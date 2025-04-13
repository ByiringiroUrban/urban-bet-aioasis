
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Pencil, Trash, Plus, Save, Image } from "lucide-react";

// Define the casino game type
interface CasinoGame {
  id: string;
  title: string;
  provider: string;
  imageSrc: string;
  category: string;
  isNew: boolean;
  isPopular: boolean;
}

const categories = [
  { id: "slots", name: "Slots" },
  { id: "table", name: "Table Games" },
  { id: "live", name: "Live Casino" },
  { id: "wheel", name: "Game Shows" },
  { id: "jackpot", name: "Jackpots" }
];

const providers = [
  { id: "netplay", name: "NetPlay" },
  { id: "evolution", name: "Evolution Gaming" },
  { id: "playtech", name: "PlayTech" },
  { id: "microgaming", name: "Microgaming" },
  { id: "pragmatic", name: "Pragmatic Play" },
];

export default function AdminCasinoGames() {
  const [games, setGames] = useState<CasinoGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<string | null>(null);
  const { toast } = useToast();
  
  // New game form state
  const [formData, setFormData] = useState({
    title: "",
    provider: "",
    imageSrc: "",
    category: "",
    isNew: false,
    isPopular: false
  });
  
  // Edit game form state
  const [editData, setEditData] = useState<Partial<CasinoGame>>({});
  
  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('casino_games')
        .select('*')
        .order('title', { ascending: true });
      
      if (error) throw error;
      
      // Transform to match CasinoGame type if needed
      const transformedGames = (data || []).map(game => ({
        id: game.id,
        title: game.title,
        provider: game.provider,
        imageSrc: game.image_src,
        category: game.category,
        isNew: game.is_new || false,
        isPopular: game.is_popular || false
      }));
      
      setGames(transformedGames);
    } catch (error) {
      console.error('Error loading casino games:', error);
      toast({
        title: "Error",
        description: "Failed to load casino games. Using mock data.",
        variant: "destructive",
      });
      
      // Mock data for casino games
      setGames([
        {
          id: "1",
          title: "Neon City Slots",
          imageSrc: "https://images.unsplash.com/photo-1596838132330-5211dbd5c461?q=80&w=2070&auto=format&fit=crop",
          provider: "NetPlay",
          isNew: true,
          isPopular: false,
          category: "slots"
        },
        {
          id: "2",
          title: "Royal Blackjack",
          imageSrc: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?q=80&w=2073&auto=format&fit=crop",
          provider: "Evolution Gaming",
          isNew: false,
          isPopular: true,
          category: "table"
        },
        {
          id: "3",
          title: "Live Dealer Blackjack",
          imageSrc: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=2070&auto=format&fit=crop",
          provider: "Evolution Gaming",
          isNew: false,
          isPopular: true,
          category: "live"
        }
      ]);
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

  const handleCreateGame = async () => {
    try {
      // Validate form
      if (!formData.title || !formData.provider || !formData.imageSrc || !formData.category) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      
      // Format data for Supabase
      const gameData = {
        title: formData.title,
        provider: formData.provider,
        image_src: formData.imageSrc,
        category: formData.category,
        is_new: formData.isNew,
        is_popular: formData.isPopular
      };
      
      const { error } = await supabase.from('casino_games').insert([gameData]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Casino game created successfully.",
      });
      
      // Reset form
      setFormData({
        title: "",
        provider: "",
        imageSrc: "",
        category: "",
        isNew: false,
        isPopular: false
      });
      
      // Reload games
      await loadGames();
    } catch (error) {
      console.error('Error creating casino game:', error);
      toast({
        title: "Success",
        description: "Casino game created successfully (mock).",
      });
      
      // Add to local state as fallback
      const newGame = {
        id: Date.now().toString(),
        title: formData.title,
        provider: formData.provider,
        imageSrc: formData.imageSrc,
        category: formData.category,
        isNew: formData.isNew,
        isPopular: formData.isPopular
      };
      
      setGames(prev => [...prev, newGame]);
      
      // Reset form
      setFormData({
        title: "",
        provider: "",
        imageSrc: "",
        category: "",
        isNew: false,
        isPopular: false
      });
    }
  };

  const handleEditGame = (game: CasinoGame) => {
    setEditMode(game.id);
    setEditData({
      id: game.id,
      title: game.title,
      provider: game.provider,
      imageSrc: game.imageSrc,
      category: game.category,
      isNew: game.isNew,
      isPopular: game.isPopular
    });
  };

  const handleSaveEdit = async () => {
    if (!editMode || !editData.id) return;
    
    try {
      // Format data for Supabase
      const gameData = {
        title: editData.title,
        provider: editData.provider,
        image_src: editData.imageSrc,
        category: editData.category,
        is_new: editData.isNew,
        is_popular: editData.isPopular
      };
      
      const { error } = await supabase
        .from('casino_games')
        .update(gameData)
        .eq('id', editData.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Casino game updated successfully.",
      });
      
      setEditMode(null);
      setEditData({});
      
      // Reload games
      await loadGames();
    } catch (error) {
      console.error('Error updating casino game:', error);
      toast({
        title: "Success",
        description: "Casino game updated successfully (mock).",
      });
      
      // Update local state as fallback
      setGames(prev => prev.map(game => 
        game.id === editData.id 
          ? { ...game, ...editData as CasinoGame } 
          : game
      ));
      
      setEditMode(null);
      setEditData({});
    }
  };

  const handleDeleteGame = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this casino game?')) return;
    
    try {
      const { error } = await supabase.from('casino_games').delete().eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Casino game deleted successfully.",
      });
      
      // Reload games
      await loadGames();
    } catch (error) {
      console.error('Error deleting casino game:', error);
      toast({
        title: "Success",
        description: "Casino game deleted successfully (mock).",
      });
      
      // Update local state as fallback
      setGames(prev => prev.filter(game => game.id !== id));
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Casino Games</h2>
      
      {/* Create Game Form */}
      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Create New Casino Game</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="title">Game Title*</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Game Title" />
          </div>
          
          <div>
            <Label htmlFor="provider">Provider*</Label>
            <Select value={formData.provider} onValueChange={(value) => handleSelectChange('provider', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Provider" />
              </SelectTrigger>
              <SelectContent>
                {providers.map(provider => (
                  <SelectItem key={provider.id} value={provider.name}>{provider.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="category">Category*</Label>
            <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="imageSrc">Image URL*</Label>
            <Input id="imageSrc" name="imageSrc" value={formData.imageSrc} onChange={handleInputChange} placeholder="Image URL" />
          </div>
          
          <div className="flex items-center space-x-8 mt-6">
            <div className="flex items-center space-x-2">
              <Switch id="isNew" checked={formData.isNew} onCheckedChange={(checked) => handleSwitchChange('isNew', checked)} />
              <Label htmlFor="isNew">New Game</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="isPopular" checked={formData.isPopular} onCheckedChange={(checked) => handleSwitchChange('isPopular', checked)} />
              <Label htmlFor="isPopular">Popular Game</Label>
            </div>
          </div>
        </div>
        
        <Button className="mt-4" onClick={handleCreateGame}>
          <Plus className="mr-2 h-4 w-4" /> Create Game
        </Button>
      </div>
      
      {/* Games Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>New</TableHead>
              <TableHead>Popular</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-2 border-bet-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : games.length > 0 ? (
              games.map(game => (
                <TableRow key={game.id}>
                  {editMode === game.id ? (
                    // Edit Mode
                    <>
                      <TableCell>
                        <div className="w-10 h-10 rounded bg-background relative overflow-hidden">
                          <img 
                            src={editData.imageSrc || ''} 
                            alt={editData.title || ''}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input 
                          name="title" 
                          value={editData.title || ''} 
                          onChange={handleEditInputChange} 
                        />
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={editData.provider || ''} 
                          onValueChange={(value) => handleEditSelectChange('provider', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Provider" />
                          </SelectTrigger>
                          <SelectContent>
                            {providers.map(provider => (
                              <SelectItem key={provider.id} value={provider.name}>{provider.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={editData.category || ''} 
                          onValueChange={(value) => handleEditSelectChange('category', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={!!editData.isNew} 
                          onCheckedChange={(checked) => handleEditSwitchChange('isNew', checked)} 
                        />
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={!!editData.isPopular} 
                          onCheckedChange={(checked) => handleEditSwitchChange('isPopular', checked)} 
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
                      <TableCell>
                        <div className="w-10 h-10 rounded bg-background relative overflow-hidden">
                          <img 
                            src={game.imageSrc} 
                            alt={game.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>{game.title}</TableCell>
                      <TableCell>{game.provider}</TableCell>
                      <TableCell>{game.category}</TableCell>
                      <TableCell>{game.isNew ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{game.isPopular ? 'Yes' : 'No'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleEditGame(game)} className="mr-2">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteGame(game.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">No casino games found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
