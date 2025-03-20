
import { useState, useEffect } from 'react';
import { isAuthenticated, getCurrentUser, listenForAuthChanges } from '@/utils/authUtils';
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
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Fetch user data from MongoDB
  const fetchUserData = async () => {
    if (!isAuthenticated()) return;
    
    const basicUser = getCurrentUser();
    if (!basicUser || !basicUser.token) return;
    
    setIsLoading(true);
    try {
      const userData = await mongoService.getUser(basicUser.token);
      
      if (userData) {
        // Merge local storage data with MongoDB data
        setUser({
          ...basicUser,
          balance: userData.balance || 0,
          currency: userData.currency || 'RWF'
        });
        
        console.log('User data fetched successfully:', userData);
      } else {
        console.warn('No user data found in database');
        toast({
          title: "Account Information",
          description: "Your account details are being set up. Please complete your profile.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Could not fetch your account information. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const handleAuthChange = () => {
      const isLoggedInNow = isAuthenticated();
      setIsLoggedIn(isLoggedInNow);
      setUser(getCurrentUser());
      
      if (isLoggedInNow) {
        fetchUserData();
      }
    };
    
    // Set up listener for auth changes
    const cleanup = listenForAuthChanges(handleAuthChange);
    
    // Initial fetch
    if (isLoggedIn) {
      fetchUserData();
    }
    
    return cleanup;
  }, []);
  
  return {
    isLoggedIn,
    user,
    isLoading,
    refreshUserData: fetchUserData
  };
};
