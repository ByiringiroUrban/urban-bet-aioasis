
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export default function LoginForm({ isSubmitting, setIsSubmitting }: LoginFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log("Login attempt with:", { loginEmail, loginPassword });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem("userToken", "sample-jwt-token");
      localStorage.setItem("userEmail", loginEmail);
      
      toast({
        title: "Login successful!",
        description: "Welcome back to Urban Bet.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <form onSubmit={handleLogin}>
      <div className="space-y-4">
        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email Address"
              className="pl-10"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="pl-10 pr-10"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
            <button 
              type="button"
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              onClick={toggleShowPassword}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>
          <Link to="/forgot-password" className="text-sm text-bet-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-bet-primary hover:bg-bet-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Log In"} 
          {!isSubmitting && <ArrowRight size={16} className="ml-1" />}
        </Button>
      </div>
    </form>
  );
}
