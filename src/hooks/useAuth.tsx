
import { useState, useEffect } from 'react';
import { supabase, getCurrentUser, getCurrentSession } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { saveUser, getUser } from '@/services/userService';

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
          const userData = await getUser(supabaseUser.id);
          
          // Save user in localStorage for compatibility with existing code
          localStorage.setItem("userToken", supabaseUser.id);
          localStorage.setItem("userName", supabaseUser.user_metadata?.name || userData?.name || 'Urban Bet User');
          localStorage.setItem("userEmail", supabaseUser.email || '');
          localStorage.setItem("userProvider", 'supabase');
          
          const userObject = {
            token: supabaseUser.id,
            name: supabaseUser.user_metadata?.name || userData?.name || 'Urban Bet User',
            email: supabaseUser.email,
            provider: 'supabase',
            balance: userData?.balance || 50000,
            currency: userData?.currency || 'RWF'
          };
          
          setUser(userObject);
          setIsLoggedIn(true);
          console.log('User data fetched successfully:', userObject);
          
          // Ensure user is saved in our profiles table
          await saveUser({
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.name || 'Urban Bet User',
            email: supabaseUser.email || '',
            balance: userData?.balance || 50000,
            currency: userData?.currency || 'RWF'
          });
        } else {
          console.log('No logged in user');
          setIsLoggedIn(false);
          setUser(null);
          clearUserFromLocalStorage();
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
        clearUserFromLocalStorage();
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
      clearUserFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearUserFromLocalStorage = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userProvider");
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
        clearUserFromLocalStorage();
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
