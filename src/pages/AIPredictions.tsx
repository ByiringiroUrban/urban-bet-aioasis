
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { isAuthenticated } from "@/utils/authUtils";

const AIPredictions = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication required",
        description: "Please login to access AI predictions.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    setIsLoading(false);
  }, [navigate, toast]);

  // Mock predictions data
  const predictions = [
    {
      id: 1,
      title: "Premier League Prediction",
      description: "Manchester City vs Liverpool",
      prediction: "Manchester City to win",
      confidence: 78,
    },
    {
      id: 2,
      title: "NBA Prediction",
      description: "Lakers vs Warriors",
      prediction: "Warriors to win",
      confidence: 65,
    },
    {
      id: 3,
      title: "Tennis Prediction",
      description: "Grand Slam Final",
      prediction: "Player A to win in straight sets",
      confidence: 82,
    },
  ];

  if (isLoading) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">AI Predictions</h1>
          <p className="text-muted-foreground mb-8">
            Our advanced AI analyzes thousands of data points to provide you with the most accurate betting predictions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictions.map((prediction) => (
              <Card key={prediction.id}>
                <CardHeader>
                  <CardTitle>{prediction.title}</CardTitle>
                  <CardDescription>{prediction.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Prediction:</p>
                      <p>{prediction.prediction}</p>
                    </div>
                    <div>
                      <p className="font-medium">Confidence:</p>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                          className="bg-bet-primary h-2.5 rounded-full" 
                          style={{ width: `${prediction.confidence}%` }}
                        ></div>
                      </div>
                      <p className="text-right text-sm text-muted-foreground mt-1">
                        {prediction.confidence}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AIPredictions;
