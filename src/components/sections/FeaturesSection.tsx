
import { Brain, TrendingUp, Zap, Shield } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Urban Bet</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-card rounded-lg p-6 card-highlight">
            <div className="w-12 h-12 bg-bet-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Brain size={24} className="text-bet-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Predictions</h3>
            <p className="text-muted-foreground">Our advanced AI analyzes historical data to provide smart betting recommendations.</p>
          </div>
          
          <div className="bg-card rounded-lg p-6 card-highlight">
            <div className="w-12 h-12 bg-bet-secondary/10 rounded-lg flex items-center justify-center mb-4">
              <Zap size={24} className="text-bet-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Live Betting</h3>
            <p className="text-muted-foreground">Bet on games in real-time with constantly updated odds and statistics.</p>
          </div>
          
          <div className="bg-card rounded-lg p-6 card-highlight">
            <div className="w-12 h-12 bg-bet-accent/10 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp size={24} className="text-bet-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Competitive Odds</h3>
            <p className="text-muted-foreground">Enjoy some of the most competitive odds in the industry across all sports.</p>
          </div>
          
          <div className="bg-card rounded-lg p-6 card-highlight">
            <div className="w-12 h-12 bg-bet-warning/10 rounded-lg flex items-center justify-center mb-4">
              <Shield size={24} className="text-bet-warning" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Trusted</h3>
            <p className="text-muted-foreground">Your data and transactions are protected with bank-grade security measures.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
