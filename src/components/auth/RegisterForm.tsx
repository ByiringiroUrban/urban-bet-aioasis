
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

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
  const [error, setError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = (email: string): boolean => {
    return emailRegex.test(email);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    if (!agreeTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy");
      setIsSubmitting(false);
      return;
    }
    
    if (registerPassword.length < 6) {
      setError("Password should be at least 6 characters");
      setIsSubmitting(false);
      return;
    }
    
    if (!validateEmail(registerEmail)) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }
    
    try {
      console.log("Register attempt with:", { registerName, registerEmail, registerPassword, agreeTerms });
      
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            name: registerName,
          },
          emailRedirectTo: window.location.origin + "/login"
        },
      });
      
      if (error) {
        console.error("Registration error:", error.message);
        setError(error.message);
        
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
        
        return;
      }
      
      // Check if user or session is null (should not happen but handle it anyway)
      if (!data.user) {
        setError("Something went wrong during registration. Please try again.");
        return;
      }
      
      // Check email confirmation status
      if (data.user.identities && data.user.identities.length === 0) {
        setError("This email is already registered. Please try logging in or use a different email.");
        return;
      }
      
      setRegistrationSuccess(true);
      
      toast({
        title: "Registration successful!",
        description: "Please check your email to confirm your account before logging in.",
      });
      
    } catch (error) {
      console.error("Unexpected error during registration:", error);
      
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!registerEmail || !validateEmail(registerEmail)) {
      setError("Please enter a valid email address to resend confirmation");
      return;
    }

    setResendingEmail(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: registerEmail,
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
        description: "Please check your inbox (and spam folder) for the confirmation email.",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to resend confirmation email.",
        variant: "destructive",
      });
    } finally {
      setResendingEmail(false);
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <form onSubmit={handleRegister}>
      {registrationSuccess ? (
        <div className="text-center space-y-4">
          <div className="text-green-500 font-medium text-lg">Registration Successful!</div>
          <p>
            A confirmation email has been sent to <strong>{registerEmail}</strong>. 
            Please check your inbox and spam folder and click on the confirmation link to activate your account.
          </p>
          <div className="mt-4">
            <Button 
              type="button" 
              className="w-full bg-bet-primary hover:bg-bet-primary/90"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Didn't receive the email? Check your spam folder or 
            <button 
              type="button"
              className="text-bet-primary hover:underline ml-1"
              onClick={handleResendConfirmation}
              disabled={resendingEmail}
            >
              {resendingEmail ? "Sending..." : "resend the confirmation email"}
            </button>
          </p>
        </div>
      ) : (
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
                className={`pl-10 ${!validateEmail(registerEmail) && registerEmail ? 'border-red-500' : ''}`}
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
            </div>
            {!validateEmail(registerEmail) && registerEmail && (
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
            <p className={`text-xs mt-1 ${registerPassword.length > 0 && registerPassword.length < 6 ? 'text-red-500' : 'text-muted-foreground'}`}>
              Password must be at least 6 characters
            </p>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}
          
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
            disabled={!agreeTerms || isSubmitting || !validateEmail(registerEmail) || registerPassword.length < 6}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"} 
            {!isSubmitting && <ArrowRight size={16} className="ml-1" />}
          </Button>
        </div>
      )}
    </form>
  );
}
