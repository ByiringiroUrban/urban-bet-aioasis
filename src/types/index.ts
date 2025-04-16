
export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  country?: string;  // Changed from required to optional
  time: string;
  date: string;
  homeOdds: number;
  drawOdds?: number; // Optional since not all sports have draws
  awayOdds: number;
  isLive?: boolean;
  featured?: boolean;
  sportId?: string;
  startTime?: string;
}

export interface CasinoGame {
  title: string;
  imageSrc: string;
  provider: string;
  isNew?: boolean;
  isPopular?: boolean;
  category: string;
}

export interface AIInsight {
  match: string;
  prediction: string;
  confidence: number;
  analysis: string;
  trend?: string;
  odds: string;
}
