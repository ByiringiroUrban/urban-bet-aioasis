
import { Brain, TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBetting } from "@/contexts/BettingContext";
import { useState } from "react";

interface AIInsightCardProps {
  match: string;
  prediction: string;
  confidence: number;
  analysis: string;
  trend?: string;
  odds: string;
}

export default function AIInsightCard({ 
  match, 
  prediction, 
  confidence, 
  analysis, 
  trend,
  odds
}: AIInsightCardProps) {
  const betting = useBetting();
  const [isAdded, setIsAdded] = useState(false);
  
  // Determine confidence color
  const getConfidenceColor = () => {
    if (confidence >= 75) return "text-bet-secondary";
    if (confidence >= 50) return "text-bet-warning";
    return "text-bet-danger";
  };
  
  // Handle adding to betting slip
  const handleAddToBettingSlip = () => {
    // Parse odds from string (example: "2.10")
    const numericOdds = parseFloat(odds.split(' ')[0]);
    
    if (!isNaN(numericOdds)) {
      betting.addBet({
        event: match,
        selection: prediction,
        odds: numericOdds
      });
      
      setIsAdded(true);
      
      // Reset button after 3 seconds
      setTimeout(() => {
        setIsAdded(false);
      }, 3000);
    }
  };

  return (
    <Card className="card-highlight overflow-hidden hover-scale transition-all duration-300 bg-card border-border/50 bet-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{match}</CardTitle>
          <Badge className="bg-bet-accent/20 text-bet-accent hover:bg-bet-accent/30">
            <Brain size={14} className="mr-1" /> AI Insight
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="mb-3">
          <div className="text-sm text-muted-foreground mb-1">AI Prediction:</div>
          <div className="font-medium text-bet-primary">{prediction}</div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between items-center text-sm text-muted-foreground mb-1">
            <span>Confidence:</span>
            <span className={`font-medium ${getConfidenceColor()}`}>{confidence}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${confidence >= 75 ? 'bg-bet-secondary' : confidence >= 50 ? 'bg-bet-warning' : 'bg-bet-danger'}`}
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-3">
          <div className="text-sm text-muted-foreground mb-1">Analysis:</div>
          <p className="text-sm text-foreground/90">{analysis}</p>
        </div>

        {trend && (
          <div className="flex items-center text-sm text-bet-secondary mb-3">
            <TrendingUp size={16} className="mr-1" />
            <span>{trend}</span>
          </div>
        )}

        <div className="text-sm text-muted-foreground mb-1">Recommended Odds:</div>
        <div className="font-semibold">{odds}</div>
      </CardContent>
      <CardFooter>
        <Button 
          variant={isAdded ? "default" : "outline"} 
          className={`w-full ${isAdded ? 'bg-bet-secondary hover:bg-bet-secondary/90' : ''}`}
          onClick={handleAddToBettingSlip}
        >
          {isAdded ? "Added to Slip ✓" : "Add to Betting Slip"} 
          {!isAdded && <ArrowRight size={16} className="ml-1" />}
        </Button>
      </CardFooter>
    </Card>
  );
}
