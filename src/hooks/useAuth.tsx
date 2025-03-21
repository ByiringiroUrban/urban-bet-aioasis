
import { useState, useEffect } from 'react';
import { supabase, getCurrentUser, getCurrentSession } from '@/lib/supabase';
import { mongoService } from '@/services/mongoService';
import { useToast } from '@/hooks/use-toast';

export interface User {
  token: string | null;
  name: string | null;
  email: string | null;
  provider: string | null;
  balance?: number;
  currency?: 'USD' | 'RWF';
}

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Fetch user data from Supabase
  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const session = await getCurrentSession();
      
      if (session.data.session) {
        const supabaseUser = await getCurrentUser();
        
        if (supabaseUser) {
          // Get additional user data from our service
          const userData = await mongoService.getUser(supabaseUser.id);
          
          setUser({
            token: supabaseUser.id,
            name: supabaseUser.user_metadata?.name || userData?.name || 'Urban Bet User',
            email: supabaseUser.email,
            provider: 'supabase',
            balance: userData?.balance || 50000,
            currency: userData?.currency || 'RWF'
          });
          
          setIsLoggedIn(true);
          console.log('User data fetched successfully:', userData);
        } else {
          console.log('No logged in user');
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Authentication Error",
        description: "Could not fetch your account information. Using guest mode.",
        variant: "destructive",
      });
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUserData();
    
    // Set up listener for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_IN') {
        fetchUserData();
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setUser(null);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  return {
    isLoggedIn,
    user,
    isLoading,
    refreshUserData: fetchUserData
  };
};
