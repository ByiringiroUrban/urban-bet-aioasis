
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  LogOut
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Navbar() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userBalance, setUserBalance] = useState("$0.00");

  useEffect(() => {
    // Check if user is logged in
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      setIsLoggedIn(true);
      setUserName(localStorage.getItem("userName") || "User");
      // In a real app, this would fetch the user's balance from an API
      setUserBalance("$1,250.00");
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    
    setIsLoggedIn(false);
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    
    navigate("/");
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-foreground hover:text-bet-primary transition-colors font-medium">
              Home
            </Link>
            <div className="relative group">
              <button className="flex items-center text-foreground hover:text-bet-primary transition-colors font-medium">
                Sports <ChevronDown size={16} className="ml-1" />
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg glass hidden group-hover:block transition-all">
                <div className="py-1">
                  <Link to="/sports/football" className="block px-4 py-2 text-sm hover:bg-bet-primary/10">Football</Link>
                  <Link to="/sports/basketball" className="block px-4 py-2 text-sm hover:bg-bet-primary/10">Basketball</Link>
                  <Link to="/sports/tennis" className="block px-4 py-2 text-sm hover:bg-bet-primary/10">Tennis</Link>
                  <Link to="/sports/esports" className="block px-4 py-2 text-sm hover:bg-bet-primary/10">Esports</Link>
                </div>
              </div>
            </div>
            <Link to="/casino" className="text-foreground hover:text-bet-primary transition-colors font-medium">
              Casino
            </Link>
            <Link to="/live" className="text-foreground hover:text-bet-primary transition-colors font-medium">
              Live Betting
            </Link>
            <Link to="/ai-predictions" className="text-foreground hover:text-bet-primary transition-colors font-medium">
              AI Predictions
            </Link>
          </nav>

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
            <button className="text-foreground hover:text-bet-primary transition-colors">
              <Search size={20} />
            </button>
            {isLoggedIn ? (
              <>
                <button className="relative text-foreground hover:text-bet-primary transition-colors">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-bet-primary rounded-full text-xs flex items-center justify-center">3</span>
                </button>
                <div className="relative group">
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <span className="text-sm font-medium">{userBalance}</span>
                    <Avatar className="h-8 w-8 hover-scale">
                      <AvatarFallback className="bg-bet-accent">
                        {userName.split(' ').map(name => name[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg glass hidden group-hover:block transition-all">
                    <div className="py-1">
                      <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-bet-primary/10">Dashboard</Link>
                      <Link to="/account" className="block px-4 py-2 text-sm hover:bg-bet-primary/10">Account Settings</Link>
                      <Link to="/wallet" className="block px-4 py-2 text-sm hover:bg-bet-primary/10">Wallet</Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 flex items-center"
                      >
                        <LogOut size={14} className="mr-2" /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
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
                      <span className="text-sm font-medium">{userBalance}</span>
                    </div>
                  </div>
                  <Link to="/dashboard" onClick={toggleMenu}>
                    <Button variant="outline" size="sm" className="w-full">Dashboard</Button>
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
