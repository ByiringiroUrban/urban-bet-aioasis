
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { isAuthenticated } from "@/utils/authUtils";
import { supabaseService, BetRecord } from "@/services/supabaseService";
import UserProfile from "@/components/dashboard/UserProfile";
import DashboardTabs from "@/components/dashboard/DashboardTabs";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [betHistory, setBetHistory] = useState<BetRecord[]>([]);
  const [aiPredictions, setAiPredictions] = useState<any[]>([]);
  const [loadingBets, setLoadingBets] = useState(true);
  const [loadingPredictions, setLoadingPredictions] = useState(true);
  
  // Get user data from localStorage
  const userEmail = localStorage.getItem("userEmail");
  const userName = localStorage.getItem("userName");
  const userProvider = localStorage.getItem("userProvider");
  const userId = localStorage.getItem("userToken");
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
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
    
    // Fetch bet history
    const fetchBetHistory = async () => {
      if (userId) {
        setLoadingBets(true);
        try {
          const history = await supabaseService.getBetHistory(userId);
          setBetHistory(history);
        } catch (error) {
          console.error("Error fetching bet history:", error);
        } finally {
          setLoadingBets(false);
        }
      }
    };
    
    // Fetch AI predictions
    const fetchAIPredictions = async () => {
      setLoadingPredictions(true);
      try {
        // For now, use sample AI predictions (in a real app this would come from AI service)
        if (userId) {
          const predictions = await supabaseService.getAIPredictions(userId);
          setAiPredictions(predictions);
        }
      } finally {
        setLoadingPredictions(false);
      }
    };
    
    fetchBetHistory();
    fetchAIPredictions();
  }, [navigate, toast, userId]);

  // Mock user data
  const userData = {
    name: userName || "User",
    email: userEmail || "user@example.com",
    provider: userProvider ? `${userProvider.charAt(0).toUpperCase() + userProvider.slice(1)}` : "Email",
    balance: "$1,250.00",
  };

  if (isLoading) {
    return null; // Don't render anything while redirecting
  }

  return (
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
                aiPredictions={aiPredictions}
                loadingPredictions={loadingPredictions}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
