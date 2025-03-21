
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AIInsightCard from "@/components/AIInsightCard";
import { useNavigate } from "react-router-dom";

interface AIPrediction {
  match: string;
  prediction: string;
  confidence: number;
  analysis: string;
  trend?: string;
  odds: string;
}

interface AIPredictionsTabProps {
  aiPredictions: AIPrediction[];
  loading: boolean;
}

const AIPredictionsTab = ({ aiPredictions, loading }: AIPredictionsTabProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Predictions</CardTitle>
        <CardDescription>Personalized insights based on your betting patterns</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
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
  );
};

export default AIPredictionsTab;
