
import { Match } from "@/types";

export const sportsData: Record<string, Match[]> = {
  football: [
    {
      id: "1",
      homeTeam: "Arsenal",
      awayTeam: "Chelsea",
      league: "Premier League",
      country: "England",
      time: "19:45",
      date: "2025-04-18",
      homeOdds: 2.10,
      drawOdds: 3.40,
      awayOdds: 3.75,
      isLive: false
    },
    {
      id: "2",
      homeTeam: "Barcelona",
      awayTeam: "Real Madrid",
      league: "La Liga",
      country: "Spain",
      time: "20:00",
      date: "2025-04-18",
      homeOdds: 1.95,
      drawOdds: 3.50,
      awayOdds: 4.00,
      isLive: false
    }
  ],
  basketball: [
    {
      id: "3",
      homeTeam: "Lakers",
      awayTeam: "Celtics",
      league: "NBA",
      country: "USA",
      time: "02:00",
      date: "2025-04-19",
      homeOdds: 1.85,
      awayOdds: 2.05,
      isLive: false
    }
  ]
};
