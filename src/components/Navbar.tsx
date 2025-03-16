
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Menu, 
  X, 
  ChevronDown, 
  Trophy, 
  Activity, 
  Zap, 
  Search, 
  Bell,
  LogOut,
  Wallet,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { isAuthenticated, logout } from "@/utils/authUtils";
import { useBetting } from "@/contexts/BettingContext";

export default function Navbar() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userBalance, setUserBalance] = useState("0");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { currency } = useBetting();

  // Mock notifications data
  const notifications = [
    { id: 1, message: "Your deposit was successful", time: "5 minutes ago", isRead: false },
    { id: 2, message: "Arsenal vs Chelsea match starts in 30 minutes", time: "30 minutes ago", isRead: false },
    { id: 3, message: "Congratulations! You won 25,000 RWF", time: "2 hours ago", isRead: true }
  ];

  useEffect(() => {
    // Check if user is logged in
    const authenticated = isAuthenticated();
    setIsLoggedIn(authenticated);
    
    if (authenticated) {
      setUserName(localStorage.getItem("userName") || "User");
      // In a real app, this would fetch the user's balance from an API
      setUserBalance(currency === "RWF" ? "1,500,000" : "1,250.00");
    }
  }, [location.pathname, currency]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    // Clear user data
    logout();
    
    setIsLoggedIn(false);
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    
    navigate("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Search initiated",
        description: `Searching for: ${searchQuery}`,
      });
      // In a real app, this would navigate to search results page
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-bet-primary to-bet-accent flex items-center justify-center mr-2">
                <Zap size={18} className="text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">UrbanBet</span>
            </Link>
          </div>

          {/* Desktop Navigation - Using NavigationMenu from shadcn */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className="text-foreground hover:text-bet-primary transition-colors font-medium px-3 py-2">
                  Home
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/sports/football" className="text-foreground hover:text-bet-primary transition-colors font-medium px-3 py-2">
                  Sports
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/casino" className="text-foreground hover:text-bet-primary transition-colors font-medium px-3 py-2">
                  Casino
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/live" className="text-foreground hover:text-bet-primary transition-colors font-medium px-3 py-2">
                  Live Betting
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/ai-predictions" className="text-foreground hover:text-bet-primary transition-colors font-medium px-3 py-2">
                  AI Predictions
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-foreground hover:text-bet-primary transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Dialog */}
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DialogTrigger asChild>
                <button className="text-foreground hover:text-bet-primary transition-colors">
                  <Search size={20} />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Search UrbanBet</DialogTitle>
                  <DialogDescription>
                    Search for events, teams, or games
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSearch} className="flex space-x-2">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="flex-1"
                  />
                  <Button type="submit">Search</Button>
                </form>
              </DialogContent>
            </Dialog>
            
            {isLoggedIn ? (
              <>
                {/* Notifications Popover */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="relative text-foreground hover:text-bet-primary transition-colors">
                      <Bell size={20} />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-bet-primary rounded-full text-xs flex items-center justify-center">
                        {notifications.filter(n => !n.isRead).length}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <div className="p-4 border-b border-border">
                      <h4 className="font-medium">Notifications</h4>
                    </div>
                    <div className="max-h-80 overflow-auto">
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className={`p-3 border-b border-border last:border-0 hover:bg-accent/5 ${notification.isRead ? 'opacity-70' : ''}`}
                          >
                            <div className="text-sm">{notification.message}</div>
                            <div className="text-xs text-muted-foreground mt-1">{notification.time}</div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          No notifications
                        </div>
                      )}
                    </div>
                    <div className="p-2 border-t border-border">
                      <Button variant="ghost" size="sm" className="w-full">
                        View all notifications
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <div className="flex items-center space-x-2 cursor-pointer">
                      <span className="text-sm font-medium">
                        {currency === "RWF" ? "RWF " : "$"}{userBalance}
                      </span>
                      <Avatar className="h-8 w-8 hover:scale-105 transition-transform">
                        <AvatarFallback className="bg-bet-accent">
                          {userName.split(' ').map(name => name[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        <Trophy size={14} className="mr-2" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/account" className="cursor-pointer">
                        <Settings size={14} className="mr-2" /> Account Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/wallet" className="cursor-pointer">
                        <Wallet size={14} className="mr-2" /> Wallet
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-500 focus:text-red-500 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut size={14} className="mr-2" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button className="bg-bet-primary hover:bg-bet-primary/90" asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass py-4">
          <div className="px-4 space-y-3">
            <Link to="/" className="block font-medium hover:text-bet-primary" onClick={toggleMenu}>
              Home
            </Link>
            <Link to="/sports/football" className="block font-medium hover:text-bet-primary" onClick={toggleMenu}>
              Football
            </Link>
            <Link to="/sports/basketball" className="block font-medium hover:text-bet-primary" onClick={toggleMenu}>
              Basketball
            </Link>
            <Link to="/casino" className="block font-medium hover:text-bet-primary" onClick={toggleMenu}>
              Casino
            </Link>
            <Link to="/live" className="block font-medium hover:text-bet-primary" onClick={toggleMenu}>
              Live Betting
            </Link>
            <Link to="/ai-predictions" className="block font-medium hover:text-bet-primary" onClick={toggleMenu}>
              AI Predictions
            </Link>
            
            <div className="pt-4 space-y-2">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-bet-accent">
                          {userName.split(' ').map(name => name[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {currency === "RWF" ? "RWF " : "$"}{userBalance}
                      </span>
                    </div>
                  </div>
                  <Link to="/dashboard" onClick={toggleMenu}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Trophy size={14} className="mr-2" /> Dashboard
                    </Button>
                  </Link>
                  <Link to="/account" onClick={toggleMenu}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings size={14} className="mr-2" /> Account Settings
                    </Button>
                  </Link>
                  <Link to="/wallet" onClick={toggleMenu}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Wallet size={14} className="mr-2" /> Wallet
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-red-500 hover:text-red-600"
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                  >
                    <LogOut size={14} className="mr-2" /> Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/login" onClick={toggleMenu}>Log In</Link>
                  </Button>
                  <Button className="w-full bg-bet-primary hover:bg-bet-primary/90" asChild>
                    <Link to="/register" onClick={toggleMenu}>Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
