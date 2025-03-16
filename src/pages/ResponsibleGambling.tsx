
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Clock, Shield, HeartHandshake, Info, AlertCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const ResponsibleGambling = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 max-w-7xl mx-auto">
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Responsible Gambling</h1>
          <p className="text-muted-foreground">
            At Urban Bet, we are committed to promoting responsible gambling. We believe that gambling should 
            always be an enjoyable and entertaining experience, never a means to financial gain.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-bet-accent/20 hover:border-bet-accent/50 transition-all">
            <CardHeader className="pb-2">
              <div className="mb-4 w-12 h-12 rounded-full bg-bet-accent/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-bet-accent" />
              </div>
              <CardTitle>Set Time Limits</CardTitle>
              <CardDescription>Control how long you play in a session</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Setting a time limit is an effective way to ensure your gambling stays fun and doesn't 
                interfere with your daily life.
              </p>
              <Button variant="outline" size="sm" className="w-full">Set Time Limit</Button>
            </CardContent>
          </Card>
          
          <Card className="border-bet-primary/20 hover:border-bet-primary/50 transition-all">
            <CardHeader className="pb-2">
              <div className="mb-4 w-12 h-12 rounded-full bg-bet-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-bet-primary" />
              </div>
              <CardTitle>Deposit Limits</CardTitle>
              <CardDescription>Control your spending with deposit limits</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Set daily, weekly, or monthly deposit limits to help you manage your gambling budget and 
                prevent excessive spending.
              </p>
              <Button className="w-full bg-bet-primary hover:bg-bet-primary/90">Set Deposit Limit</Button>
            </CardContent>
          </Card>
          
          <Card className="border-bet-secondary/20 hover:border-bet-secondary/50 transition-all">
            <CardHeader className="pb-2">
              <div className="mb-4 w-12 h-12 rounded-full bg-bet-secondary/10 flex items-center justify-center">
                <HeartHandshake className="h-6 w-6 text-bet-secondary" />
              </div>
              <CardTitle>Self-Exclusion</CardTitle>
              <CardDescription>Take a break from gambling</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                If you feel you need a break, you can self-exclude for a period of your choice, from 
                one day to indefinitely.
              </p>
              <Button variant="outline" size="sm" className="w-full">Set Self-Exclusion</Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Responsible Gambling Guidelines</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Gambling is entertainment, not income</AccordionTrigger>
              <AccordionContent>
                Always view gambling as a form of entertainment, not as a way to make money. 
                Only gamble with money you can afford to lose and consider the cost of gambling 
                as the price of entertainment, similar to buying a movie ticket.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>Set time and money limits</AccordionTrigger>
              <AccordionContent>
                Decide beforehand how much time and money you can afford to spend on gambling. 
                Never exceed these limits and never chase losses. Walk away when you reach your limit, 
                whether you're winning or losing.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>Don't gamble when upset or distressed</AccordionTrigger>
              <AccordionContent>
                Avoid gambling when you're feeling down, upset, or stressed. Gambling under emotional 
                distress can lead to poor decision-making and excessive gambling.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>Balance gambling with other activities</AccordionTrigger>
              <AccordionContent>
                Ensure gambling doesn't interfere with or replace normal activities with family and friends. 
                Maintain a balance between gambling and other leisure activities.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>Avoid gambling under the influence</AccordionTrigger>
              <AccordionContent>
                Don't gamble when under the influence of alcohol or drugs. These substances impair your 
                judgment and can lead to risky betting decisions.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div className="bg-accent/20 rounded-lg p-6 mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <AlertCircle className="text-bet-primary h-10 w-10" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Signs of Problem Gambling</h3>
              <p className="text-muted-foreground mb-4">
                If you exhibit any of these warning signs, consider seeking help:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Spending more time or money than intended on gambling</li>
                <li>Gambling to escape problems or relieve feelings of helplessness</li>
                <li>Lying to family members or others about gambling habits</li>
                <li>Feeling irritable when trying to stop gambling</li>
                <li>Jeopardizing relationships or opportunities due to gambling</li>
                <li>Borrowing money to gamble or pay gambling debts</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Need Support?</h3>
          <p className="text-muted-foreground mb-4">
            If you or someone you know needs help with gambling-related issues, please reach out to:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" /> Gambling Helpline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">24/7 Confidential Support</p>
                <p className="font-medium">+250 7XX XXX XXX</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Info className="h-5 w-5 mr-2" /> Support Organizations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  <li>• Gamblers Anonymous Rwanda</li>
                  <li>• GamCare Rwanda</li>
                  <li>• BeGambleAware Rwanda</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResponsibleGambling;
