
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CasinoGameCard from "@/components/CasinoGameCard";

// Mock data for casino games
const casinoGames = [
  {
    title: "Neon City Slots",
    imageSrc: "https://images.unsplash.com/photo-1596838132330-5211dbd5c461?q=80&w=2070&auto=format&fit=crop",
    provider: "NetPlay",
    isNew: true,
    category: "slots"
  },
  {
    title: "Royal Blackjack",
    imageSrc: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?q=80&w=2073&auto=format&fit=crop",
    provider: "Evolution Gaming",
    isPopular: true,
    category: "table"
  },
  {
    title: "Mega Fortune Wheel",
    imageSrc: "https://images.unsplash.com/photo-1629895218613-a532fd7a8313?q=80&w=1932&auto=format&fit=crop",
    provider: "PlayTech",
    isPopular: true,
    category: "wheel"
  },
  {
    title: "Mystic Gems",
    imageSrc: "https://images.unsplash.com/photo-1619967435599-80c18fb1604c?q=80&w=1974&auto=format&fit=crop",
    provider: "NetPlay",
    isNew: true,
    category: "slots"
  },
  {
    title: "Golden Poker",
    imageSrc: "https://images.unsplash.com/photo-1541278107931-e006523892df?q=80&w=2071&auto=format&fit=crop",
    provider: "Evolution Gaming",
    category: "table"
  },
  {
    title: "Asian Fortune",
    imageSrc: "https://images.unsplash.com/photo-1596838132330-5211dbd5c461?q=80&w=2070&auto=format&fit=crop",
    provider: "PlayTech",
    category: "slots"
  },
  {
    title: "Ultra Roulette",
    imageSrc: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=2071&auto=format&fit=crop",
    provider: "Evolution Gaming",
    isPopular: true,
    category: "table"
  },
  {
    title: "Crypto Miner",
    imageSrc: "https://images.unsplash.com/photo-1642794816460-74f3e2e1d9b5?q=80&w=1932&auto=format&fit=crop",
    provider: "NetPlay",
    isNew: true,
    category: "slots"
  },
  {
    title: "Live Dealer Blackjack",
    imageSrc: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=2070&auto=format&fit=crop",
    provider: "Evolution Gaming",
    isPopular: true,
    category: "live"
  },
  {
    title: "VIP Live Roulette",
    imageSrc: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=2070&auto=format&fit=crop",
    provider: "Evolution Gaming",
    isPopular: true,
    category: "live"
  },
  {
    title: "Mega Diamond Jackpot",
    imageSrc: "https://images.unsplash.com/photo-1596838132830-8535ef812c75?q=80&w=2070&auto=format&fit=crop",
    provider: "NetPlay",
    isNew: true,
    category: "jackpot"
  },
  {
    title: "Millionaire Maker",
    imageSrc: "https://images.unsplash.com/photo-1518893883800-45cd0954574b?q=80&w=1974&auto=format&fit=crop",
    provider: "PlayTech",
    isPopular: true,
    category: "jackpot"
  }
];

export default function Casino() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const location = useLocation();
  
  // Map URL paths to tab values
  useEffect(() => {
    const path = location.pathname;
    
    // Set the appropriate tab based on the URL
    if (path === "/casino/slots") {
      setActiveTab("slots");
    } else if (path === "/casino/table-games") {
      setActiveTab("table");
    } else if (path === "/casino/live-casino") {
      // Assuming we might add this category later
      setActiveTab("live");
    } else if (path === "/casino/jackpots") {
      setActiveTab("jackpot");
    } else if (path === "/casino/game-shows") {
      setActiveTab("wheel"); // Using wheel for game shows
    }
  }, [location.pathname]);
  
  // Filter games based on search query and active tab
  const filteredGames = casinoGames.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          game.provider.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Handle category filtering with special cases
    let matchesCategory = activeTab === "all";
    if (!matchesCategory) {
      if (activeTab === "table" && game.category === "table") {
        matchesCategory = true;
      } else if (activeTab === "slots" && game.category === "slots") {
        matchesCategory = true;
      } else if (activeTab === "wheel" && game.category === "wheel") {
        matchesCategory = true;
      } else if (activeTab === "jackpot" && game.category === "jackpot") {
        matchesCategory = true;
      } else if (activeTab === "live" && game.category === "live") {
        matchesCategory = true;
      }
    }
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-bet-dark-accent py-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Urban Casino</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Experience the thrill of our premium casino games with realistic graphics and fair play algorithms powered by AI.
            </p>
            
            {/* Search & Filter */}
            <div className="max-w-md mx-auto">
              <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Search for games..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Tabs 
                defaultValue="all" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="mb-8"
              >
                <TabsList className="grid grid-cols-6 w-full">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="slots">Slots</TabsTrigger>
                  <TabsTrigger value="table">Table Games</TabsTrigger>
                  <TabsTrigger value="live">Live Casino</TabsTrigger>
                  <TabsTrigger value="jackpot">Jackpots</TabsTrigger>
                  <TabsTrigger value="wheel">Game Shows</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
        
        {/* Games Grid */}
        <div className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredGames.length > 0 ? (
                filteredGames.map((game, index) => (
                  <CasinoGameCard
                    key={index}
                    title={game.title}
                    imageSrc={game.imageSrc}
                    provider={game.provider}
                    isNew={game.isNew}
                    isPopular={game.isPopular}
                    category={game.category}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No games found matching your search criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
