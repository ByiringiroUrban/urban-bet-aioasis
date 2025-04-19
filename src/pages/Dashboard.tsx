
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import UserProfile from "@/components/dashboard/UserProfile";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import { getBetHistory } from "@/services/bettingService";
import { getAIPredictions } from "@/services/predictionsService";
import { useAuth } from "@/hooks/useAuth";
import { BetRecord } from "@/services/database/types";
import { BettingProvider } from "@/contexts/BettingContext";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isLoggedIn, user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [betHistory, setBetHistory] = useState<BetRecord[]>([]);
  const [aiPredictions, setAiPredictions] = useState<any[]>([]);
  const [loadingBets, setLoadingBets] = useState(true);
  const [loadingPredictions, setLoadingPredictions] = useState(true);
  
  // Check if user is authenticated
  useEffect(() => {
    if (authLoading) {
      return; // Wait for auth to complete
    }
    
    if (!isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please login to access your dashboard.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    setIsLoading(false);
    toast({
      title: "Welcome back!",
      description: "You've successfully logged into your dashboard.",
    });
    
    // Fetch bet history from Supabase
    const fetchBetHistory = async () => {
      if (user?.token) {
        setLoadingBets(true);
        try {
          const history = await getBetHistory(user.token);
          setBetHistory(history);
        } catch (error) {
          console.error("Error fetching bet history:", error);
        } finally {
          setLoadingBets(false);
        }
      }
    };
    
    // Fetch AI predictions from Supabase - only if admin posted them
    const fetchAIPredictions = async () => {
      setLoadingPredictions(true);
      try {
        if (user?.token) {
          const predictions = await getAIPredictions(user.token);
          // Filter predictions to only show those posted by admins
          // This functionality would depend on your backend implementation
          // For now, we'll just set empty array as requested to remove all events
          setAiPredictions([]);
        }
      } finally {
        setLoadingPredictions(false);
      }
    };
    
    fetchBetHistory();
    fetchAIPredictions();
  }, [navigate, toast, isLoggedIn, user?.token, authLoading]);

  // Get user data
  const userData = {
    name: user?.name || "User",
    email: user?.email || "user@example.com",
    provider: user?.provider ? `${user.provider.charAt(0).toUpperCase() + user.provider.slice(1)}` : "Email",
    balance: user?.balance ? (user.currency === 'USD' ? `$${(user.balance / 1200).toFixed(2)}` : `RWF ${user.balance.toLocaleString()}`) : "$0.00",
  };

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <h2 className="text-2xl font-bold mb-2">Loading Dashboard...</h2>
          <p className="text-muted-foreground">Retrieving your betting information</p>
        </div>
      </div>
    );
  }

  return (
    <BettingProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="w-full md:w-1/4">
                <UserProfile userData={userData} />
              </div>
              
              <div className="w-full md:w-3/4">
                <DashboardTabs 
                  betHistory={betHistory}
                  loadingBets={loadingBets}
                  aiPredictions={[]} // Setting to empty array to remove all events
                  loadingPredictions={loadingPredictions}
                />
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </BettingProvider>
  );
};

export default Dashboard;
