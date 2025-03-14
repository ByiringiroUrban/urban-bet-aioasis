
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RegisterFormProps {
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export default function RegisterForm({ isSubmitting, setIsSubmitting }: RegisterFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log("Register attempt with:", { registerName, registerEmail, registerPassword, agreeTerms });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem("userToken", "sample-jwt-token");
      localStorage.setItem("userName", registerName);
      localStorage.setItem("userEmail", registerEmail);
      
      toast({
        title: "Registration successful!",
        description: "Welcome to Urban Bet. Your account has been created.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <form onSubmit={handleRegister}>
      <div className="space-y-4">
        <div>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Full Name"
              className="pl-10"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email Address"
              className="pl-10"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
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
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
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
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            checked={agreeTerms}
            onCheckedChange={(checked) => setAgreeTerms(checked === true)}
          />
          <label
            htmlFor="terms"
            className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the{" "}
            <Link to="/terms" className="text-bet-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-bet-primary hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-bet-primary hover:bg-bet-primary/90"
          disabled={!agreeTerms || isSubmitting}
        >
          {isSubmitting ? "Creating Account..." : "Create Account"} 
          {!isSubmitting && <ArrowRight size={16} className="ml-1" />}
        </Button>
      </div>
    </form>
  );
}
