
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./auth/LoginForm";
import RegisterForm from "./auth/RegisterForm";
import SocialLoginButtons from "./auth/SocialLoginButtons";

export default function AuthForm({ defaultTab = "login" }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Card className="w-full max-w-md mx-auto card-highlight bg-card border-border/50">
      <Tabs defaultValue={defaultTab}>
        <CardHeader>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <CardContent>
          <TabsContent value="login">
            <LoginForm 
              isSubmitting={isSubmitting} 
              setIsSubmitting={setIsSubmitting} 
            />
          </TabsContent>
          
          <TabsContent value="register">
            <RegisterForm 
              isSubmitting={isSubmitting} 
              setIsSubmitting={setIsSubmitting}
            />
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="flex justify-center border-t border-border pt-4">
        <SocialLoginButtons />
      </CardFooter>
    </Card>
  );
}
