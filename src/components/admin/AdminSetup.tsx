
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/utils/authUtils";

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
      
      // Make user an admin
      const { error } = await supabase
        .from('user_roles')
        .insert([{ user_id: userId, role: 'admin' }]);
      
      if (error) {
        // If it's a unique constraint error, the user might already be an admin
        if (error.code === '23505') {
          toast({
            title: "Already Admin",
            description: "This user is already an admin",
          });
          return;
        }
        throw error;
      }
      
      toast({
        title: "Success",
        description: "User has been made an admin successfully",
      });
      
      // Clear the input
      setUserEmail("");
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
      const user = getCurrentUser();
      
      if (!user || !user.email) {
        toast({
          title: "Error",
          description: "You must be logged in to perform this action",
          variant: "destructive",
        });
        return;
      }
      
      // Find your user ID
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', user.email)
        .limit(1);
      
      if (profileError) throw profileError;
      
      if (!profiles || profiles.length === 0) {
        toast({
          title: "User Not Found",
          description: "Your profile could not be found",
          variant: "destructive",
        });
        return;
      }
      
      const userId = profiles[0].id;
      
      // Make yourself an admin
      const { error } = await supabase
        .from('user_roles')
        .insert([{ user_id: userId, role: 'admin' }]);
      
      if (error) {
        // If it's a unique constraint error, you might already be an admin
        if (error.code === '23505') {
          toast({
            title: "Already Admin",
            description: "You are already an admin",
          });
          return;
        }
        throw error;
      }
      
      toast({
        title: "Success",
        description: "You are now an admin. Please refresh the page.",
      });
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
