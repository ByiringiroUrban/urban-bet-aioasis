
import React from "react";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAdmin } from "@/utils/authUtils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
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

  const enableDevMode = () => {
    setDevModeActive(true);
    
    toast({
      title: "Development Mode Activated",
      description: "You now have temporary access to the admin dashboard.",
    });
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
            <Button onClick={enableDevMode} variant="outline">
              Enable Development Mode
            </Button>
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
        {children}
      </div>
    </Layout>
  );
}
