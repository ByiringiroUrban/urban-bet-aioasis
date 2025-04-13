
import { useLocation } from "react-router-dom";
import BettingSlip from "@/components/BettingSlip";

// Pages where we don't want to show the betting slip
const EXCLUDED_PATHS = [
  '/admin',
  '/login',
  '/register',
];

export default function GlobalBettingSlip() {
  const location = useLocation();
  
  // Check if current route is in the excluded paths
  const shouldShowBettingSlip = !EXCLUDED_PATHS.some(path => 
    location.pathname.startsWith(path)
  );

  if (!shouldShowBettingSlip) {
    return null;
  }

  return <BettingSlip />;
}
