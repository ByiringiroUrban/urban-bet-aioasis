import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAdmin, addAdmin, getCurrentUser } from "@/utils/authUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import AdminEvents from "@/components/admin/AdminEvents";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminBets from "@/components/admin/AdminBets";
import AdminSetup from "@/components/admin/AdminSetup";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminRisk from "@/components/admin/AdminRisk";
import AdminTransactions from "@/components/admin/AdminTransactions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [devModeActive, setDevModeActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      setLoading(true);
      const adminStatus = await isAdmin();
      setIsAdminUser(adminStatus);
      
      if (!adminStatus) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin dashboard.",
          variant: "destructive",
        });
      }
      
      setLoading(false);
    };
    
    checkAdminStatus();
  }, [toast]);

  const enableDevMode = async () => {
    setDevModeActive(true);
    
    toast({
      title: "Development Mode Activated",
      description: "You now have temporary access to the admin dashboard.",
    });
  };

  const makeSelfAdmin = async () => {
    const user = getCurrentUser();
    
    if (!user || !user.email) {
      toast({
        title: "Error",
        description: "You must be logged in to perform this action",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const result = await addAdmin(user.token || "");
      
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
      console.error("Error making self admin:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container max-w-7xl mx-auto py-10">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Checking permissions...</h2>
              <div className="w-8 h-8 border-4 border-bet-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAdminUser && !devModeActive) {
    return (
      <Layout>
        <div className="container max-w-7xl mx-auto py-10">
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground mb-4">You don't have permission to access the admin dashboard.</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button onClick={enableDevMode} variant="outline">
                Enable Development Mode
              </Button>
              <Button onClick={makeSelfAdmin}>
                Make Me an Admin
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto py-10">
        {devModeActive && !isAdminUser && (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mb-6">
            <h3 className="text-yellow-800 dark:text-yellow-200 font-medium">Development Mode Active</h3>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
              You are viewing the admin dashboard in development mode. 
              This provides temporary access to administrative features.
            </p>
          </div>
        )}
        
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="dashboard">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="bets">Bets</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="risk">Risk Management</TabsTrigger>
            <TabsTrigger value="setup">Setup</TabsTrigger>
          </TabsList>
          
          <Card>
            <CardContent className="p-6">
              <TabsContent value="dashboard" className="mt-0">
                <AdminDashboard />
              </TabsContent>
              
              <TabsContent value="events" className="mt-0">
                <AdminEvents />
              </TabsContent>
              
              <TabsContent value="bets" className="mt-0">
                <AdminBets />
              </TabsContent>
              
              <TabsContent value="users" className="mt-0">
                <AdminUsers />
              </TabsContent>
              
              <TabsContent value="transactions" className="mt-0">
                <AdminTransactions />
              </TabsContent>
              
              <TabsContent value="risk" className="mt-0">
                <AdminRisk />
              </TabsContent>
              
              <TabsContent value="setup" className="mt-0">
                <AdminSetup />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </Layout>
  );
}
