
import { Match, CasinoGame, AIInsight } from "@/types";

export const aiInsights: AIInsight[] = [
  {
    id: "insight1",
    match: "Manchester United vs Liverpool",
    prediction: "Liverpool to win",
    confidence: 78,
    analysis: "Based on recent form, Liverpool has won 4 out of their last 5 matches, while Manchester United has struggled with consistency.",
    trend: "Liverpool has won the last 3 head-to-head matches",
    odds: "1.95",
    date: "2025-04-15"
  },
  {
    id: "insight2",
    match: "Lakers vs Warriors",
    prediction: "Over 220.5 points",
    confidence: 65,
    analysis: "Both teams have been scoring at a high rate in their recent games, with an average of 225 points in their last 5 meetings.",
    trend: "4 out of 5 recent games went over 220 points",
    odds: "1.87",
    date: "2025-04-16"
  },
  {
    id: "insight3",
    match: "Novak Djokovic vs Carlos Alcaraz",
    prediction: "Alcaraz to win",
    confidence: 55,
    analysis: "Alcaraz has shown excellent form on this surface, while Djokovic is returning from a minor injury.",
    odds: "2.10",
    date: "2025-04-17"
  }
];

export const upcomingMatches: Match[] = [
  {
    id: "match1",
    homeTeam: "Chelsea",
    awayTeam: "Arsenal",
    league: "Premier League",
    country: "England",
    time: "15:00",
    date: "Sat, 15 Oct",
    homeOdds: 2.40,
    drawOdds: 3.25,
    awayOdds: 2.90
  },
  {
    id: "match2",
    homeTeam: "PSG",
    awayTeam: "Bayern Munich",
    league: "Champions League",
    country: "Europe",
    time: "20:00",
    date: "Wed, 19 Oct",
    homeOdds: 2.10,
    drawOdds: 3.50,
    awayOdds: 3.20,
    isLive: true
  },
  {
    id: "match3",
    homeTeam: "Lakers",
    awayTeam: "Celtics",
    league: "NBA",
    country: "USA",
    time: "19:30",
    date: "Thu, 20 Oct",
    homeOdds: 1.85,
    drawOdds: 0,
    awayOdds: 1.95
  },
  {
    id: "match4",
    homeTeam: "Nadal",
    awayTeam: "Federer",
    league: "ATP Masters",
    country: "International",
    time: "14:00",
    date: "Fri, 21 Oct",
    homeOdds: 1.75,
    drawOdds: 0,
    awayOdds: 2.05
  }
];

export const casinoGames: CasinoGame[] = [
  {
    id: "game1",
    name: "Aviator",
    title: "Aviator",
    imageSrc: "https://images.unsplash.com/photo-1436891620584-47fd0e565afb?q=80&w=1000&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1436891620584-47fd0e565afb?q=80&w=1000&auto=format&fit=crop",
    provider: "Urban Games",
    isNew: true,
    new: true,
    isPopular: true,
    popular: true,
    category: "aviator",
    description: "Experience the thrill of the most popular aviator game."
  },
  {
    id: "game2",
    name: "Fortune Tiger",
    title: "Fortune Tiger",
    imageSrc: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=500&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=500&auto=format&fit=crop",
    provider: "PG Soft",
    isNew: true,
    new: true,
    category: "slots",
    description: "Discover the mystery of the Fortune Tiger slot game."
  },
  {
    id: "game3",
    name: "Lightning Roulette",
    title: "Lightning Roulette",
    imageSrc: "https://images.unsplash.com/photo-1559582930-bb01987cf4dd?q=80&w=500&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1559582930-bb01987cf4dd?q=80&w=500&auto=format&fit=crop",
    provider: "Evolution",
    isPopular: true,
    popular: true,
    category: "table",
    description: "Play the electrifying version of the classic roulette game."
  },
  {
    id: "game4",
    name: "Sweet Bonanza",
    title: "Sweet Bonanza",
    imageSrc: "https://images.unsplash.com/photo-1586899028174-e7098604235b?q=80&w=500&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1586899028174-e7098604235b?q=80&w=500&auto=format&fit=crop",
    provider: "Pragmatic Play",
    isPopular: true,
    popular: true,
    category: "slots",
    description: "Enjoy the sweet taste of winning in this candy-themed slot game."
  },
  {
    id: "game5",
    name: "Blackjack VIP",
    title: "Blackjack VIP",
    imageSrc: "https://images.unsplash.com/photo-1601370690183-1c7964158180?q=80&w=500&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1601370690183-1c7964158180?q=80&w=500&auto=format&fit=crop",
    provider: "Evolution",
    category: "table",
    description: "Experience premium blackjack with high stakes and exclusive features."
  }
];
