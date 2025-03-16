
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { isAuthenticated } from "@/utils/authUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LockKeyhole, Bell, Shield, User as UserIcon } from "lucide-react";

const Account = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get user data from localStorage
  const userEmail = localStorage.getItem("userEmail") || "user@example.com";
  const userName = localStorage.getItem("userName") || "User";
  
  // Check if user is authenticated
  if (!isAuthenticated()) {
    toast({
      title: "Authentication required",
      description: "Please login to access your account settings.",
      variant: "destructive",
    });
    navigate("/login");
    return null;
  }

  const handleSaveProfile = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback className="bg-bet-accent text-2xl">
                        {userName.split(' ').map(name => name[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <h3 className="font-medium text-lg">{userName}</h3>
                      <p className="text-sm text-muted-foreground">{userEmail}</p>
                    </div>
                    <Button variant="outline" className="w-full">
                      Change Avatar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="w-full md:w-3/4">
              <Tabs defaultValue="profile">
                <TabsList className="grid grid-cols-4 w-full mb-6">
                  <TabsTrigger value="profile">
                    <UserIcon size={16} className="mr-2" /> Profile
                  </TabsTrigger>
                  <TabsTrigger value="security">
                    <LockKeyhole size={16} className="mr-2" /> Security
                  </TabsTrigger>
                  <TabsTrigger value="notifications">
                    <Bell size={16} className="mr-2" /> Notifications
                  </TabsTrigger>
                  <TabsTrigger value="privacy">
                    <Shield size={16} className="mr-2" /> Privacy
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details here.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input id="fullName" defaultValue={userName} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" defaultValue={userEmail} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" defaultValue="+250 78xxxxxxx" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input id="country" defaultValue="Rwanda" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="currency">Preferred Currency</Label>
                        <select 
                          id="currency" 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          defaultValue="RWF"
                        >
                          <option value="RWF">Rwandan Franc (RWF)</option>
                          <option value="USD">US Dollar (USD)</option>
                          <option value="EUR">Euro (EUR)</option>
                        </select>
                      </div>
                      
                      <Button 
                        onClick={handleSaveProfile} 
                        disabled={isLoading}
                        className="mt-4 bg-bet-primary hover:bg-bet-primary/90"
                      >
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>Manage your password and security options.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <h3 className="font-medium">Change Password</h3>
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input id="currentPassword" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input id="newPassword" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input id="confirmPassword" type="password" />
                        </div>
                        <Button variant="outline">Update Password</Button>
                      </div>
                      
                      <div className="pt-6 space-y-4">
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Enable 2FA</p>
                            <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Control how we contact you.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Bet Results</p>
                            <p className="text-sm text-muted-foreground">Get notified when your bets are settled</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Special Offers</p>
                            <p className="text-sm text-muted-foreground">Receive special promotions and bonuses</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Account Activity</p>
                            <p className="text-sm text-muted-foreground">Get important updates about your account</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">AI Predictions</p>
                            <p className="text-sm text-muted-foreground">Receive AI-powered betting tips</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="privacy">
                  <Card>
                    <CardHeader>
                      <CardTitle>Privacy Settings</CardTitle>
                      <CardDescription>Manage how your information is used.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Betting History Privacy</p>
                            <p className="text-sm text-muted-foreground">Show my betting activity on leaderboards</p>
                          </div>
                          <Switch />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Data Analytics</p>
                            <p className="text-sm text-muted-foreground">Allow us to analyze your betting patterns for better predictions</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Marketing Preferences</p>
                            <p className="text-sm text-muted-foreground">Allow targeted marketing based on your interests</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                      
                      <div className="pt-6">
                        <Button variant="outline" className="text-bet-danger border-bet-danger/30 hover:bg-bet-danger/10 hover:text-bet-danger">
                          Delete My Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Account;
