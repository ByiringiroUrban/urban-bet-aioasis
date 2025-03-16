
export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  country: string;
  time: string;
  date: string;
  homeOdds: number;
  drawOdds?: number; // Make this optional since not all sports have draws
  awayOdds: number;
  isLive?: boolean;
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
