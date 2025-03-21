
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface UserProfileProps {
  userData: {
    name: string;
    email: string;
    provider?: string;
    balance: string;
  };
}

const UserProfile = ({ userData }: UserProfileProps) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Account Overview</CardTitle>
        <CardDescription>
          Welcome back, {userData.name}
          {userData.provider && (
            <span className="block text-xs mt-1">
              Logged in with {userData.provider}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Balance</span>
            <span className="text-xl font-semibold">{userData.balance}</span>
          </div>
          <Button className="w-full bg-bet-primary hover:bg-bet-primary/90" onClick={() => navigate("/wallet")}>
            Deposit Funds
          </Button>
          <Button variant="outline" className="w-full" onClick={() => navigate("/wallet")}>
            Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
