
import { useNavigate } from "react-router-dom";
import { Match } from "@/types";
import { useUpcomingMatches } from "@/hooks/useUpcomingMatches";
import SportsBettingHeader from "./SportsBettingHeader";
import UpcomingMatchesGrid from "./UpcomingMatchesGrid";

interface SportsBettingSectionProps {
  upcomingMatches?: Match[];
}

export default function SportsBettingSection({ upcomingMatches: propMatches }: SportsBettingSectionProps) {
  const navigate = useNavigate();
  const { upcomingMatches, loading } = useUpcomingMatches({ initialMatches: propMatches });

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-background/95">
      <div className="max-w-7xl mx-auto">
        <SportsBettingHeader />
        <UpcomingMatchesGrid 
          matches={upcomingMatches} 
          loading={loading} 
          emptyStateAction={() => navigate("/sports")}
        />
      </div>
    </section>
  );
}
