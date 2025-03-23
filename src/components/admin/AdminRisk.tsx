
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, TrendingUp, DollarSign, Percent, Save } from "lucide-react";

export default function AdminRisk() {
  const [riskSettings, setRiskSettings] = useState({
    maxBetAmount: 500000,
    maxPotentialWinnings: 5000000,
    maxOdds: 500,
    maxBetsPerUser: 20,
    maxBetsPerEvent: 5,
    suspiciousActivityDetection: true,
    automaticLimiting: true,
    highRiskEventsMonitoring: true
  });
  
  const [flaggedUsers, setFlaggedUsers] = useState([
    { 
      id: "user-" + Math.random().toString(36).substring(2, 10),
      name: "John Doe",
      email: "john@example.com",
      riskScore: 85,
      status: "flagged",
      reason: "Multiple high-stake bets on underdogs",
      registeredDays: 12
    },
    { 
      id: "user-" + Math.random().toString(36).substring(2, 10),
      name: "Alice Smith",
      email: "alice@example.com",
      riskScore: 92,
      status: "restricted",
      reason: "Suspicious deposit patterns",
      registeredDays: 5
    },
    { 
      id: "user-" + Math.random().toString(36).substring(2, 10),
      name: "Bob Johnson",
      email: "bob@example.com",
      riskScore: 75,
      status: "flagged",
      reason: "Multiple accounts suspected",
      registeredDays: 30
    }
  ]);
  
  const [highRiskEvents, setHighRiskEvents] = useState([
    {
      id: "event-" + Math.random().toString(36).substring(2, 10),
      name: "FC Barcelona vs Real Madrid",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      riskLevel: "high",
      reason: "Unusual betting patterns",
      action: "monitoring"
    },
    {
      id: "event-" + Math.random().toString(36).substring(2, 10),
      name: "Manchester United vs Liverpool",
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      riskLevel: "medium",
      reason: "High volume of bets on underdog",
      action: "odds_adjusted"
    }
  ]);
  
  const { toast } = useToast();
  
  const handleSettingChange = (key: string, value: any) => {
    setRiskSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const saveSettings = () => {
    // In a real app, this would save to the database
    toast({
      title: "Settings Saved",
      description: "Risk management settings have been updated successfully.",
    });
  };
  
  const handleUserAction = (id: string, action: 'restrict' | 'clear' | 'monitor') => {
    // Update user status based on action
    setFlaggedUsers(prev => 
      prev.map(user => {
        if (user.id === id) {
          return {
            ...user,
            status: action === 'restrict' ? 'restricted' : 
                   action === 'clear' ? 'cleared' : 'flagged'
          };
        }
        return user;
      })
    );
    
    toast({
      title: "User Action Applied",
      description: `User has been ${action === 'restrict' ? 'restricted' : 
                     action === 'clear' ? 'cleared' : 'flagged for monitoring'}.`,
    });
  };
  
  const handleEventAction = (id: string, action: 'suspend' | 'adjust_odds' | 'clear') => {
    // Update event action based on selection
    setHighRiskEvents(prev => 
      prev.map(event => {
        if (event.id === id) {
          return {
            ...event,
            action: action === 'suspend' ? 'suspended' : 
                   action === 'adjust_odds' ? 'odds_adjusted' : 'monitoring'
          };
        }
        return event;
      })
    );
    
    toast({
      title: "Event Action Applied",
      description: `Event has been ${action === 'suspend' ? 'suspended' : 
                     action === 'adjust_odds' ? 'adjusted for odds' : 'cleared'}.`,
    });
  };
  
  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'high':
        return "destructive";
      case 'medium':
        return "default";
      default:
        return "secondary";
    }
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'restricted':
        return "destructive";
      case 'flagged':
        return "default";
      default:
        return "secondary";
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Risk Management</h2>
      
      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="users">Flagged Users</TabsTrigger>
          <TabsTrigger value="events">High-Risk Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Risk Management Settings</CardTitle>
              <CardDescription>
                Configure limits and automated risk management features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-muted-foreground" />
                    Betting Limits
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxBetAmount">Maximum Bet Amount (RWF)</Label>
                    <Input
                      id="maxBetAmount"
                      type="number"
                      value={riskSettings.maxBetAmount}
                      onChange={(e) => handleSettingChange('maxBetAmount', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxPotentialWinnings">Maximum Potential Winnings (RWF)</Label>
                    <Input
                      id="maxPotentialWinnings"
                      type="number"
                      value={riskSettings.maxPotentialWinnings}
                      onChange={(e) => handleSettingChange('maxPotentialWinnings', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxOdds">Maximum Odds</Label>
                    <Input
                      id="maxOdds"
                      type="number"
                      value={riskSettings.maxOdds}
                      onChange={(e) => handleSettingChange('maxOdds', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxBetsPerUser">Maximum Bets Per User (Daily)</Label>
                    <Input
                      id="maxBetsPerUser"
                      type="number"
                      value={riskSettings.maxBetsPerUser}
                      onChange={(e) => handleSettingChange('maxBetsPerUser', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxBetsPerEvent">Maximum Bets Per Event Per User</Label>
                    <Input
                      id="maxBetsPerEvent"
                      type="number"
                      value={riskSettings.maxBetsPerEvent}
                      onChange={(e) => handleSettingChange('maxBetsPerEvent', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-muted-foreground" />
                    Automated Risk Detection
                  </h3>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="suspiciousActivityDetection"
                      checked={riskSettings.suspiciousActivityDetection}
                      onCheckedChange={(checked) => handleSettingChange('suspiciousActivityDetection', checked)}
                    />
                    <Label htmlFor="suspiciousActivityDetection">Suspicious Activity Detection</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="automaticLimiting"
                      checked={riskSettings.automaticLimiting}
                      onCheckedChange={(checked) => handleSettingChange('automaticLimiting', checked)}
                    />
                    <Label htmlFor="automaticLimiting">Automatic User Limiting</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="highRiskEventsMonitoring"
                      checked={riskSettings.highRiskEventsMonitoring}
                      onCheckedChange={(checked) => handleSettingChange('highRiskEventsMonitoring', checked)}
                    />
                    <Label htmlFor="highRiskEventsMonitoring">High-Risk Events Monitoring</Label>
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={saveSettings} className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      Save Settings
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="mt-0">
          {/* Flagged Users Table */}
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flaggedUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${user.riskScore > 80 ? 'text-red-500' : 'text-amber-500'}`}>
                        {user.riskScore}/100
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeColor(user.status)}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.registeredDays} days ago</TableCell>
                    <TableCell>{user.reason}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {user.status !== 'restricted' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleUserAction(user.id, 'restrict')}
                            className="border-red-500 hover:bg-red-500 hover:text-white"
                          >
                            Restrict
                          </Button>
                        )}
                        {user.status !== 'cleared' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleUserAction(user.id, 'clear')}
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="events" className="mt-0">
          {/* High-Risk Events Table */}
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Current Action</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {highRiskEvents.map(event => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={getRiskBadgeColor(event.riskLevel)}>
                        {event.riskLevel.charAt(0).toUpperCase() + event.riskLevel.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{event.reason}</TableCell>
                    <TableCell>
                      <span className="capitalize">
                        {event.action === 'odds_adjusted' ? 'Odds Adjusted' : event.action}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Select 
                        onValueChange={(value) => handleEventAction(event.id, value as any)} 
                        defaultValue={event.action}
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monitoring">Monitor</SelectItem>
                          <SelectItem value="adjust_odds">Adjust Odds</SelectItem>
                          <SelectItem value="suspend">Suspend Event</SelectItem>
                          <SelectItem value="clear">Clear Flag</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
