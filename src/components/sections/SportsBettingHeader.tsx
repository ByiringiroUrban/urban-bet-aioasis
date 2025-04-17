
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SportsBettingHeaderProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonPath?: string;
}

export default function SportsBettingHeader({
  title = "Sports Betting",
  description = "Upcoming matches with AI-enhanced odds",
  buttonText = "View All Sports",
  buttonPath = "/sports"
}: SportsBettingHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>
      <Button variant="outline" onClick={() => navigate(buttonPath)}>
        {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
