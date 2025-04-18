
import { Clock, BarChart2 } from "lucide-react";

interface LiveBettingStatsProps {
  activeMatchesCount: number;
}

export default function LiveBettingStats({ activeMatchesCount }: LiveBettingStatsProps) {
  return (
    <div className="bg-gradient-to-r from-bet-primary/20 to-bet-accent/20 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-6 text-center">
        <div className="flex items-center gap-2">
          <Clock className="text-bet-primary" size={20} />
          <span>{activeMatchesCount} Live Events</span>
        </div>
        <div className="flex items-center gap-2">
          <BarChart2 className="text-bet-accent" size={20} />
          <span>Real-time Analytics</span>
        </div>
      </div>
    </div>
  );
}
