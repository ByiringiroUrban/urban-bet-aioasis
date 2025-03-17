
import { useState, useEffect } from 'react';
import { isAuthenticated, getCurrentUser, listenForAuthChanges } from '@/utils/authUtils';

export interface User {
  token: string | null;
  name: string | null;
  email: string | null;
  provider: string | null;
}

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [user, setUser] = useState<User | null>(getCurrentUser());
  
  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(isAuthenticated());
      setUser(getCurrentUser());
    };
    
    // Set up listener for auth changes
    const cleanup = listenForAuthChanges(handleAuthChange);
    
    return cleanup;
  }, []);
  
  return {
    isLoggedIn,
    user,
  };
};
