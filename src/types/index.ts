
export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  country: string;
  time: string;
  date: string;
  homeOdds: number;
  drawOdds?: number;
  awayOdds: number;
  isLive?: boolean;
  featured?: boolean;
  startTime?: string;
}

export interface CasinoGame {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  provider: string;
  popular?: boolean;
  new?: boolean;
  rtp?: number;
}

export interface AIInsight {
  id: string;
  match: string;
  prediction: string;
  confidence: number;
  analysis: string;
  date: string;
  odds?: string;
  trend?: string;
}
