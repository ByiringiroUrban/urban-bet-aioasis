
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

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
  const [error, setError] = useState("");
  const [resendingEmail, setResendingEmail] = useState(false);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = (email: string): boolean => {
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    if (!validateEmail(loginEmail)) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }
    
    try {
      console.log("Login attempt with:", { loginEmail, loginPassword });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      
      if (error) {
        console.error("Login error:", error.message);
        
        // Handle email confirmation error specifically
        if (error.message.includes("Email not confirmed")) {
          setError("Please confirm your email address before logging in. Check your inbox for a confirmation email.");
          
          toast({
            title: "Email not confirmed",
            description: "Please check your inbox and spam folder for the confirmation email and click the link to verify your account.",
            variant: "destructive",
          });
        } else {
          setError(error.message);
          
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive",
          });
        }
        
        setIsSubmitting(false);
        return;
      }
      
      toast({
        title: "Login successful!",
        description: "Welcome back to Urban Bet.",
      });
      
      // The user session will be handled by useAuth hook, which listens to auth state changes
      navigate("/dashboard");
    } catch (error) {
      console.error("Unexpected error during login:", error);
      
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!loginEmail || !validateEmail(loginEmail)) {
      setError("Please enter a valid email address to resend confirmation");
      return;
    }

    setResendingEmail(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: loginEmail,
        options: {
          emailRedirectTo: window.location.origin + "/login"
        }
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Confirmation email sent",
        description: "Please check your inbox and spam folder for the confirmation email.",
      });
    } catch (error) {
      console.error("Error resending confirmation:", error);
      toast({
        title: "Error",
        description: "Failed to resend confirmation email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setResendingEmail(false);
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
              className={`pl-10 ${!validateEmail(loginEmail) && loginEmail ? 'border-red-500' : ''}`}
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>
          {!validateEmail(loginEmail) && loginEmail && (
            <p className="text-xs text-red-500 mt-1">Please enter a valid email address</p>
          )}
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
        
        {error && (
          <div className="text-red-500 text-sm">
            {error}
            {error.includes("Email not confirmed") && (
              <button 
                type="button" 
                onClick={handleResendConfirmation}
                className="ml-2 text-bet-primary hover:underline"
                disabled={resendingEmail}
              >
                {resendingEmail ? "Sending..." : "Resend confirmation email"}
              </button>
            )}
          </div>
        )}
        
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
          disabled={isSubmitting || !validateEmail(loginEmail) || !loginPassword}
        >
          {isSubmitting ? "Logging in..." : "Log In"} 
          {!isSubmitting && <ArrowRight size={16} className="ml-1" />}
        </Button>
      </div>
    </form>
  );
}
