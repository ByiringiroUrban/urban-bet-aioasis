
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CasinoGameCard from "@/components/CasinoGameCard";
import { CasinoGame } from "@/types";

interface CasinoGamesSectionProps {
  casinoGames: CasinoGame[];
}

export default function CasinoGamesSection({ casinoGames }: CasinoGamesSectionProps) {
  return (
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
  );
}
