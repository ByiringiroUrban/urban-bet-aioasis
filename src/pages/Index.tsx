
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BettingSlip from "@/components/BettingSlip";
import Footer from "@/components/Footer";
import AIInsightCard from "@/components/AIInsightCard";
import UpcomingMatchCard from "@/components/UpcomingMatchCard";
import CasinoGameCard from "@/components/CasinoGameCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Brain, TrendingUp, Zap, Shield } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("featured");
  
  const aiInsights = [
    {
      match: "Manchester United vs Liverpool",
      prediction: "Liverpool to win",
      confidence: 78,
      analysis: "Based on recent form, Liverpool has won 4 out of their last 5 matches, while Manchester United has struggled with consistency.",
      trend: "Liverpool has won the last 3 head-to-head matches",
      odds: "1.95"
    },
    {
      match: "Lakers vs Warriors",
      prediction: "Over 220.5 points",
      confidence: 65,
      analysis: "Both teams have been scoring at a high rate in their recent games, with an average of 225 points in their last 5 meetings.",
      trend: "4 out of 5 recent games went over 220 points",
      odds: "1.87"
    },
    {
      match: "Novak Djokovic vs Carlos Alcaraz",
      prediction: "Alcaraz to win",
      confidence: 55,
      analysis: "Alcaraz has shown excellent form on this surface, while Djokovic is returning from a minor injury.",
      odds: "2.10"
    }
  ];
  
  const upcomingMatches = [
    {
      homeTeam: "Chelsea",
      awayTeam: "Arsenal",
      league: "Premier League",
      time: "15:00",
      date: "Sat, 15 Oct",
      homeOdds: 2.40,
      drawOdds: 3.25,
      awayOdds: 2.90
    },
    {
      homeTeam: "PSG",
      awayTeam: "Bayern Munich",
      league: "Champions League",
      time: "20:00",
      date: "Wed, 19 Oct",
      homeOdds: 2.10,
      drawOdds: 3.50,
      awayOdds: 3.20,
      isLive: true
    },
    {
      homeTeam: "Lakers",
      awayTeam: "Celtics",
      league: "NBA",
      time: "19:30",
      date: "Thu, 20 Oct",
      homeOdds: 1.85,
      awayOdds: 1.95
    },
    {
      homeTeam: "Nadal",
      awayTeam: "Federer",
      league: "ATP Masters",
      time: "14:00",
      date: "Fri, 21 Oct",
      homeOdds: 1.75,
      awayOdds: 2.05
    }
  ];
  
  const casinoGames = [
    {
      title: "Fortune Tiger",
      imageSrc: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=500&auto=format&fit=crop",
      provider: "PG Soft",
      isNew: true,
      category: "slots"
    },
    {
      title: "Lightning Roulette",
      imageSrc: "https://images.unsplash.com/photo-1559582930-bb01987cf4dd?q=80&w=500&auto=format&fit=crop",
      provider: "Evolution",
      isPopular: true,
      category: "table"
    },
    {
      title: "Sweet Bonanza",
      imageSrc: "https://images.unsplash.com/photo-1586899028174-e7098604235b?q=80&w=500&auto=format&fit=crop",
      provider: "Pragmatic Play",
      isPopular: true,
      category: "slots"
    },
    {
      title: "Blackjack VIP",
      imageSrc: "https://images.unsplash.com/photo-1601370690183-1c7964158180?q=80&w=500&auto=format&fit=crop",
      provider: "Evolution",
      category: "table"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        
        {/* Features Section */}
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
        
        {/* AI Insights Section */}
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
        
        {/* Sports Betting Section */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Sports Betting</h2>
                <p className="text-muted-foreground">Browse upcoming matches and place your bets</p>
              </div>
              
              <Tabs 
                defaultValue="featured" 
                className="mt-4 md:mt-0"
                onValueChange={setActiveTab}
              >
                <TabsList>
                  <TabsTrigger value="featured">Featured</TabsTrigger>
                  <TabsTrigger value="live">Live Now</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {upcomingMatches.map((match, index) => (
                <UpcomingMatchCard
                  key={index}
                  homeTeam={match.homeTeam}
                  awayTeam={match.awayTeam}
                  league={match.league}
                  time={match.time}
                  date={match.date}
                  homeOdds={match.homeOdds}
                  drawOdds={match.drawOdds}
                  awayOdds={match.awayOdds}
                  isLive={match.isLive}
                />
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Button asChild>
                <Link to="/sports">
                  View All Sports <ArrowRight size={16} className="ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Casino Games Section */}
        <section className="py-12 px-4 bg-bet-dark-accent">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Casino Games</h2>
                <p className="text-muted-foreground">Enjoy our premium selection of casino games</p>
              </div>
              
              <Button variant="outline" className="mt-4 md:mt-0" asChild>
                <Link to="/casino">
                  View All Games <ArrowRight size={16} className="ml-1" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {casinoGames.map((game, index) => (
                <CasinoGameCard
                  key={index}
                  title={game.title}
                  imageSrc={game.imageSrc}
                  provider={game.provider}
                  isNew={game.isNew}
                  isPopular={game.isPopular}
                  category={game.category}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-4 relative overflow-hidden">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: "linear-gradient(to right, rgba(17, 24, 39, 0.9), rgba(17, 24, 39, 0.7)), url('https://images.unsplash.com/photo-1562016600-ece13e8ba570?q=80&w=1600&auto=format&fit=crop')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: -1
            }}
          />
          
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Ready to Experience Smarter Betting?</h2>
            <p className="text-lg text-white/80 mb-8">Join Urban Bet today and get access to AI-powered predictions, competitive odds, and a secure betting platform.</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-bet-primary hover:bg-bet-primary/90" asChild>
                <Link to="/register">
                  Create Account <ArrowRight size={16} className="ml-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10" asChild>
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <BettingSlip />
      <Footer />
    </div>
  );
};

export default Index;
