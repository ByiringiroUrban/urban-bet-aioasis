
export interface League {
  id: string;
  name: string;
  country: string;
  sport: string;
}

export interface Country {
  id: string;
  name: string;
  leagues: League[];
}

export interface SportCategory {
  id: string;
  name: string;
  icon: string;
  countries: Country[];
}

// Mock data for sports categories, countries, and leagues
export const sportsCategories: SportCategory[] = [
  {
    id: "football",
    name: "Football",
    icon: "football",
    countries: [
      {
        id: "england",
        name: "England",
        leagues: [
          { id: "premier-league", name: "Premier League", country: "England", sport: "football" },
          { id: "championship", name: "Championship", country: "England", sport: "football" },
          { id: "league-one", name: "League One", country: "England", sport: "football" },
          { id: "fa-cup", name: "FA Cup", country: "England", sport: "football" }
        ]
      },
      {
        id: "spain",
        name: "Spain",
        leagues: [
          { id: "la-liga", name: "La Liga", country: "Spain", sport: "football" },
          { id: "copa-del-rey", name: "Copa del Rey", country: "Spain", sport: "football" }
        ]
      },
      {
        id: "europe",
        name: "Europe",
        leagues: [
          { id: "champions-league", name: "UEFA Champions League", country: "Europe", sport: "football" },
          { id: "europa-league", name: "UEFA Europa League", country: "Europe", sport: "football" },
          { id: "conference-league", name: "UEFA Conference League", country: "Europe", sport: "football" }
        ]
      },
      {
        id: "france",
        name: "France",
        leagues: [
          { id: "ligue-1", name: "Ligue 1", country: "France", sport: "football" },
          { id: "ligue-2", name: "Ligue 2", country: "France", sport: "football" }
        ]
      },
      {
        id: "rwanda",
        name: "Rwanda",
        leagues: [
          { id: "rwanda-premier", name: "Rwanda Premier League", country: "Rwanda", sport: "football" },
          { id: "rwanda-second", name: "Rwanda Second Division", country: "Rwanda", sport: "football" }
        ]
      }
    ]
  },
  {
    id: "basketball",
    name: "Basketball",
    icon: "dribbble",
    countries: [
      {
        id: "usa",
        name: "USA",
        leagues: [
          { id: "nba", name: "NBA", country: "USA", sport: "basketball" },
          { id: "ncaa", name: "NCAA", country: "USA", sport: "basketball" }
        ]
      },
      {
        id: "europe",
        name: "Europe",
        leagues: [
          { id: "euroleague", name: "EuroLeague", country: "Europe", sport: "basketball" },
          { id: "eurocup", name: "EuroCup", country: "Europe", sport: "basketball" }
        ]
      },
      {
        id: "rwanda",
        name: "Rwanda",
        leagues: [
          { id: "rwanda-basketball", name: "Rwanda Basketball League", country: "Rwanda", sport: "basketball" }
        ]
      }
    ]
  },
  {
    id: "tennis",
    name: "Tennis",
    icon: "circle",
    countries: [
      {
        id: "international",
        name: "International",
        leagues: [
          { id: "grand-slams", name: "Grand Slams", country: "International", sport: "tennis" },
          { id: "atp-tour", name: "ATP Tour", country: "International", sport: "tennis" },
          { id: "wta-tour", name: "WTA Tour", country: "International", sport: "tennis" }
        ]
      },
      {
        id: "rwandan-open",
        name: "Rwanda",
        leagues: [
          { id: "rwandan-open", name: "Rwandan Open", country: "Rwanda", sport: "tennis" }
        ]
      }
    ]
  }
];
