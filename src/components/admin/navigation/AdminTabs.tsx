
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import AdminEvents from "@/components/admin/AdminEvents";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminBets from "@/components/admin/AdminBets";
import AdminSetup from "@/components/admin/AdminSetup";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminRisk from "@/components/admin/AdminRisk";
import AdminTransactions from "@/components/admin/AdminTransactions";
import AdminCasinoGames from "@/components/admin/AdminCasinoGames";

export default function AdminTabs() {
  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className="grid w-full grid-cols-8 mb-8">
        <TabsTrigger value="dashboard">Overview</TabsTrigger>
        <TabsTrigger value="events">Events</TabsTrigger>
        <TabsTrigger value="casino">Casino Games</TabsTrigger>
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
          
          <TabsContent value="casino" className="mt-0">
            <AdminCasinoGames />
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
  );
}
