
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { socialLogin } from "@/utils/authUtils";

export default function SocialLoginButtons() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      setSocialLoading(provider);
      
      await socialLogin(provider);
      
      toast({
        title: "Login successful!",
        description: `You've successfully logged in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}.`,
      });
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: `There was a problem logging in with ${provider}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="text-center space-y-2 w-full">
      <div className="text-xs text-muted-foreground">Or continue with</div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => handleSocialLogin('google')}
          disabled={socialLoading !== null}
        >
          {socialLoading === 'google' ? 'Loading...' : 'Google'}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => handleSocialLogin('facebook')}
          disabled={socialLoading !== null}
        >
          {socialLoading === 'facebook' ? 'Loading...' : 'Facebook'}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => handleSocialLogin('apple')}
          disabled={socialLoading !== null}
        >
          {socialLoading === 'apple' ? 'Loading...' : 'Apple'}
        </Button>
      </div>
    </div>
  );
}
