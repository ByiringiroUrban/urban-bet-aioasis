
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { isAuthenticated } from "@/utils/authUtils";
import { mongoService, BetRecord } from "@/services/mongoService";
import { Badge } from "@/components/ui/badge";
import AIInsightCard from "@/components/AIInsightCard";
import { Skeleton } from "@/components/ui/skeleton";

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
          const history = await mongoService.getBetHistory(userId);
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
        setAiPredictions([
          {
            match: "Arsenal vs Liverpool",
            prediction: "Arsenal to win",
            confidence: 75,
            analysis: "Arsenal has won 4 out of their last 5 home games against Liverpool",
            trend: "Arsenal winning streak at home",
            odds: "1.95"
          },
          {
            match: "PSG vs Bayern Munich",
            prediction: "Over 2.5 goals",
            confidence: 82,
            analysis: "Both teams have scored in the last 7 encounters",
            trend: "High scoring matches in Champions League",
            odds: "1.75"
          }
        ]);
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
    activeBets: betHistory.filter(bet => bet.status === 'pending').length,
    wonBets: betHistory.filter(bet => bet.status === 'won').length,
    totalBets: betHistory.length || 0
  };

  const renderBetStatus = (status: 'pending' | 'won' | 'lost' | 'cancelled') => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case 'won':
        return <Badge className="bg-green-500 hover:bg-green-600">Won</Badge>;
      case 'lost':
        return <Badge className="bg-red-500 hover:bg-red-600">Lost</Badge>;
      case 'cancelled':
        return <Badge>Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
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
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle>Account Overview</CardTitle>
                  <CardDescription>
                    Welcome back, {userData.name}
                    {userData.provider && (
                      <span className="block text-xs mt-1">
                        Logged in with {userData.provider}
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Balance</span>
                      <span className="text-xl font-semibold">{userData.balance}</span>
                    </div>
                    <Button className="w-full bg-bet-primary hover:bg-bet-primary/90" onClick={() => navigate("/wallet")}>
                      Deposit Funds
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => navigate("/wallet")}>
                      Withdraw
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="w-full md:w-3/4">
              <Tabs defaultValue="bets">
                <TabsList className="grid grid-cols-3 w-full mb-6">
                  <TabsTrigger value="bets">My Bets</TabsTrigger>
                  <TabsTrigger value="history">Betting History</TabsTrigger>
                  <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
                </TabsList>
                <TabsContent value="bets">
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Bets</CardTitle>
                      <CardDescription>You have {userData.activeBets} active bets</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loadingBets ? (
                        <div className="space-y-3">
                          {[1, 2].map(i => (
                            <Skeleton key={i} className="w-full h-32 rounded-md" />
                          ))}
                        </div>
                      ) : betHistory.filter(bet => bet.status === 'pending').length > 0 ? (
                        <div className="space-y-4">
                          {betHistory
                            .filter(bet => bet.status === 'pending')
                            .map((bet) => (
                              <Card key={bet.id} className="bg-background/50 shadow-sm">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="font-medium">Bet #{bet.id.substring(0, 8)}</div>
                                    <div>{renderBetStatus(bet.status)}</div>
                                  </div>
                                  
                                  <div className="space-y-2 text-sm">
                                    {bet.items.map((item, index) => (
                                      <div key={index} className="px-2 py-1 bg-muted/50 rounded">
                                        <div>{item.event}</div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">{item.selection}</span>
                                          <span>{item.odds.toFixed(2)}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  
                                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-border">
                                    <div>
                                      <div className="text-xs text-muted-foreground">Total Stake</div>
                                      <div className="font-medium">{bet.currency === 'RWF' ? 'RWF' : '$'} {bet.amount.toLocaleString()}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-xs text-muted-foreground">Potential Win</div>
                                      <div className="font-medium text-bet-secondary">
                                        {bet.currency === 'RWF' ? 'RWF' : '$'} {bet.potentialWinnings.toLocaleString(undefined, {maximumFractionDigits: 2})}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      ) : (
                        <div className="bg-muted/50 p-4 rounded-md text-center">
                          <p>You don't have any active bets</p>
                          <Button variant="outline" className="mt-2" onClick={() => navigate('/sports')}>
                            Place a Bet
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="history">
                  <Card>
                    <CardHeader>
                      <CardTitle>Betting History</CardTitle>
                      <CardDescription>
                        Win rate: {userData.totalBets ? Math.round((userData.wonBets / userData.totalBets) * 100) : 0}%
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loadingBets ? (
                        <div className="space-y-3">
                          {[1, 2, 3].map(i => (
                            <Skeleton key={i} className="w-full h-24 rounded-md" />
                          ))}
                        </div>
                      ) : betHistory.length > 0 ? (
                        <div className="space-y-4">
                          {betHistory.map((bet) => (
                            <Card key={bet.id} className="bg-background/50 shadow-sm">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <div className="font-medium">Bet #{bet.id.substring(0, 8)}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {new Date(bet.timestamp).toLocaleDateString()} at {new Date(bet.timestamp).toLocaleTimeString()}
                                    </div>
                                  </div>
                                  <div>{renderBetStatus(bet.status)}</div>
                                </div>
                                
                                <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                                  <div>
                                    <div className="text-xs text-muted-foreground">Stake</div>
                                    <div>{bet.currency === 'RWF' ? 'RWF' : '$'} {bet.amount.toLocaleString()}</div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-muted-foreground">Total Odds</div>
                                    <div>{bet.totalOdds.toFixed(2)}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xs text-muted-foreground">
                                      {bet.status === 'won' ? 'Won' : 'Potential Win'}
                                    </div>
                                    <div className={bet.status === 'won' ? 'font-medium text-bet-secondary' : ''}>
                                      {bet.currency === 'RWF' ? 'RWF' : '$'} {bet.potentialWinnings.toLocaleString(undefined, {maximumFractionDigits: 2})}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-muted/50 p-4 rounded-md text-center">
                          <p>No betting history available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="predictions">
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Predictions</CardTitle>
                      <CardDescription>Personalized insights based on your betting patterns</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loadingPredictions ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[1, 2].map(i => (
                            <Skeleton key={i} className="w-full h-64 rounded-md" />
                          ))}
                        </div>
                      ) : aiPredictions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {aiPredictions.map((insight, index) => (
                            <AIInsightCard 
                              key={index}
                              match={insight.match}
                              prediction={insight.prediction}
                              confidence={insight.confidence}
                              analysis={insight.analysis}
                              trend={insight.trend}
                              odds={insight.odds}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="bg-muted/50 p-4 rounded-md text-center">
                          <p>AI predictions will appear here</p>
                          <Button variant="outline" className="mt-2" onClick={() => navigate('/ai-predictions')}>
                            View All AI Predictions
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
