
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AIInsightCard from "@/components/AIInsightCard";
import { BettingProvider } from "@/contexts/BettingContext";

interface AIInsight {
  match: string;
  prediction: string;
  confidence: number;
  analysis: string;
  trend?: string;
  odds: string;
}

export default function AIInsightsSection({ aiInsights }: { aiInsights: AIInsight[] }) {
  // The content that needs a BettingProvider
  const content = (
    <section className="py-12 px-4 bg-bet-dark-accent">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">AI Betting Insights</h2>
            <p className="text-muted-foreground">Data-driven predictions to enhance your betting strategy</p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0" asChild>
            <Link to="/ai-predictions">
              View All Insights <ArrowRight size={16} className="ml-1" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiInsights.map((insight, index) => (
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
      </div>
    </section>
  );

  // We need to wrap the content in a BettingProvider directly in this component
  // since we don't control how this component is used in various pages
  return (
    <BettingProvider>
      {content}
    </BettingProvider>
  );
}
