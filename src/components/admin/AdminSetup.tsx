
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser, addAdmin } from "@/utils/authUtils";

export default function AdminSetup() {
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleMakeAdmin = async () => {
    if (!userEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // First, find the user by email
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', userEmail)
        .limit(1);
      
      if (profileError) throw profileError;
      
      if (!profiles || profiles.length === 0) {
        toast({
          title: "User Not Found",
          description: "No user found with that email address",
          variant: "destructive",
        });
        return;
      }
      
      const userId = profiles[0].id;
      
      // Use addAdmin function which now uses create_first_admin first
      const result = await addAdmin(userId);
      
      if (result) {
        toast({
          title: "Success",
          description: "User has been made an admin successfully",
        });
        // Clear the input
        setUserEmail("");
      } else {
        toast({
          title: "Error",
          description: "Failed to make user an admin. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error making user an admin:', error);
      toast({
        title: "Error",
        description: "Failed to make user an admin. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMakeSelfAdmin = async () => {
    setLoading(true);
    
    try {
      // Get the current authenticated user directly from Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to perform this action",
          variant: "destructive",
        });
        return;
      }
      
      // Use the addAdmin function from authUtils which now uses create_first_admin
      const result = await addAdmin(user.id);
      
      if (result) {
        toast({
          title: "Success",
          description: "You are now an admin. Please refresh the page.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to make you an admin. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error making self an admin:', error);
      toast({
        title: "Error",
        description: "Failed to make you an admin. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Admin Setup</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Make Yourself an Admin</CardTitle>
            <CardDescription>
              Quickly grant yourself admin privileges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleMakeSelfAdmin} 
              disabled={loading}
              className="w-full"
            >
              {loading ? "Processing..." : "Make Me an Admin"}
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Add Another Admin</CardTitle>
            <CardDescription>
              Grant admin privileges to another user by email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="User Email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <Button 
              onClick={handleMakeAdmin} 
              disabled={loading || !userEmail}
              className="w-full"
            >
              {loading ? "Processing..." : "Make Admin"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
