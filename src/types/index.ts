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
