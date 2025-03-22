
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAdmin } from "@/utils/authUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import AdminEvents from "@/components/admin/AdminEvents";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminBets from "@/components/admin/AdminBets";
import AdminSetup from "@/components/admin/AdminSetup";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);
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

  if (!isAdminUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="bets">Bets</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="setup">Setup</TabsTrigger>
          </TabsList>
          
          <Card>
            <CardContent className="p-6">
              <TabsContent value="events" className="mt-0">
                <AdminEvents />
              </TabsContent>
              
              <TabsContent value="bets" className="mt-0">
                <AdminBets />
              </TabsContent>
              
              <TabsContent value="users" className="mt-0">
                <AdminUsers />
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
