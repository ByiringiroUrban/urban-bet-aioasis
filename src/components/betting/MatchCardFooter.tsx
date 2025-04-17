
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface MatchCardFooterProps {
  showMoreMarkets: boolean;
  onToggleMarkets: () => void;
  isLoadingMarkets: boolean;
}

const MatchCardFooter = ({
  showMoreMarkets,
  onToggleMarkets,
  isLoadingMarkets,
}: MatchCardFooterProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full text-xs group"
      onClick={onToggleMarkets}
      disabled={isLoadingMarkets}
    >
      {showMoreMarkets ? "Hide Markets" : (isLoadingMarkets ? "Loading..." : "More Markets")}
      <ArrowRight
        size={14}
        className={`ml-1 ${showMoreMarkets ? "rotate-90" : ""} group-hover:translate-x-1 transition-transform`}
      />
    </Button>
  );
};

export default MatchCardFooter;
