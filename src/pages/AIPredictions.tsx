
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { isAuthenticated } from "@/utils/authUtils";
import { BettingProvider } from "@/contexts/BettingContext";
import AIInsightCard from "@/components/AIInsightCard";

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

  // Enhanced prediction data to match AIInsightCard requirements
  const enhancedPredictions = [
    {
      match: "Manchester City vs Liverpool",
      prediction: "Manchester City to win",
      confidence: 78,
      analysis: "Based on recent form and head-to-head statistics, Manchester City has a significant advantage in this fixture.",
      trend: "City won 7 of the last 10 meetings",
      odds: "1.85"
    },
    {
      match: "Lakers vs Warriors",
      prediction: "Warriors to win",
      confidence: 65,
      analysis: "Warriors have shown better offensive efficiency and shooting percentage in recent games.",
      trend: "Warriors won last 3 away games",
      odds: "2.10"
    },
    {
      match: "Djokovic vs Nadal",
      prediction: "Djokovic to win in straight sets",
      confidence: 82,
      analysis: "Djokovic has dominated hard court matches against Nadal in their recent encounters.",
      trend: "Djokovic won 5 of last 7 matches",
      odds: "1.75"
    },
    {
      match: "Arsenal vs Tottenham",
      prediction: "Over 2.5 goals",
      confidence: 75,
      analysis: "North London derbies historically produce high-scoring games with both teams finding the net.",
      trend: "Last 6 meetings averaged 3.2 goals",
      odds: "1.90"
    },
    {
      match: "Bayern Munich vs Dortmund",
      prediction: "Both teams to score",
      confidence: 80,
      analysis: "Der Klassiker consistently features goals from both sides regardless of venue or form.",
      trend: "BTTS hit in 8 of last 10 meetings",
      odds: "1.65"
    },
    {
      match: "Patriots BBC vs REG",
      prediction: "Patriots BBC +5.5",
      confidence: 68,
      analysis: "Patriots have been keeping games close and covering the spread in recent Rwanda Basketball League matches.",
      trend: "Covered in 7 of last 9 games",
      odds: "1.95"
    },
  ];

  return (
    <BettingProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">AI Predictions</h1>
            <p className="text-muted-foreground mb-8">
              Our advanced AI analyzes thousands of data points to provide you with the most accurate betting predictions.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enhancedPredictions.map((prediction, index) => (
                <AIInsightCard
                  key={index}
                  match={prediction.match}
                  prediction={prediction.prediction}
                  confidence={prediction.confidence}
                  analysis={prediction.analysis}
                  trend={prediction.trend}
                  odds={prediction.odds}
                />
              ))}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </BettingProvider>
  );
};

export default AIPredictions;
