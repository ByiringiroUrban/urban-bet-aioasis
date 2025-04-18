import { useState } from "react";
import { useParams } from "react-router-dom";
import { SidebarProvider, Sidebar } from "@/components/ui/sidebar";
import { sportsCategories } from "@/data/sportsData";
import { sportsData } from "@/data/mockSportsData";
import Layout from "@/components/Layout";
import SportsSidebar from "@/components/sports/SportsSidebar";
import SportsContent from "@/components/sports/SportsContent";
import { useSportsData } from "@/hooks/useSportsData";

export default function Sports() {
  const { sport = "football", country, league } = useParams();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const {
    searchQuery,
    setSearchQuery,
    matchesView,
    setMatchesView,
    filteredMatches,
    pageTitle,
    validSport
  } = useSportsData({
    sport,
    country,
    league,
    initialMatches: sportsData
  });

  return (
    <Layout>
      <div className="flex-grow flex">
        <SidebarProvider defaultOpen={!isCollapsed}>
          <Sidebar variant="inset" className="bg-background border-r">
            <SportsSidebar
              categories={sportsCategories}
              activeSport={validSport}
              activeCountry={country}
              activeLeague={league}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </Sidebar>
          
          <main className="flex-1 p-4">
            <SportsContent
              pageTitle={pageTitle}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              matchesView={matchesView}
              onMatchesViewChange={setMatchesView}
              matches={filteredMatches}
            />
          </main>
        </SidebarProvider>
      </div>
    </Layout>
  );
}
