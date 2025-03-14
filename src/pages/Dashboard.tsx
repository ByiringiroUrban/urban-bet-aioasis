
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { isAuthenticated } from "@/utils/authUtils";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  // Get user data from localStorage
  const userEmail = localStorage.getItem("userEmail");
  const userName = localStorage.getItem("userName");
  const userProvider = localStorage.getItem("userProvider");
  
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
  }, [navigate, toast]);

  // Mock user data
  const userData = {
    name: userName || "User",
    email: userEmail || "user@example.com",
    provider: userProvider ? `${userProvider.charAt(0).toUpperCase() + userProvider.slice(1)}` : "Email",
    balance: "$1,250.00",
    activeBets: 3,
    wonBets: 12,
    totalBets: 20
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
                    <Button className="w-full bg-bet-primary hover:bg-bet-primary/90">Deposit Funds</Button>
                    <Button variant="outline" className="w-full">Withdraw</Button>
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
                      <div className="bg-muted/50 p-4 rounded-md text-center">
                        <p>Your bet details will appear here</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="history">
                  <Card>
                    <CardHeader>
                      <CardTitle>Betting History</CardTitle>
                      <CardDescription>
                        Win rate: {Math.round((userData.wonBets / userData.totalBets) * 100)}%
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted/50 p-4 rounded-md text-center">
                        <p>Your betting history will appear here</p>
                      </div>
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
                      <div className="bg-muted/50 p-4 rounded-md text-center">
                        <p>AI predictions will appear here</p>
                      </div>
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
