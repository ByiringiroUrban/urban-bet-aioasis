
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <ChevronDown
        size={14}
        className={cn(
          "ml-1 transition-transform",
          showMoreMarkets ? "rotate-180" : "",
          "group-hover:translate-x-1"
        )}
      />
    </Button>
  );
};

export default MatchCardFooter;
