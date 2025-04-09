import { mongoService } from '@/services/mongoService';
import { supabase } from '@/lib/supabase';

// Interface for the return type of saveUser
interface SaveUserResult {
  success: boolean;
  id?: string;
}

// Mock function to simulate social provider auth
export const socialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
  console.log(`Authenticating with ${provider}...`);
  
  // In a real implementation, this would integrate with the actual provider SDKs
  // For now, we'll simulate a successful login with mock data
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock user data based on provider
  const userData = {
    id: `user-${Math.random().toString(36).substring(2, 9)}`,
    name: provider === 'google' ? 'Google User' : 
          provider === 'facebook' ? 'Facebook User' : 'Apple User',
    email: `user.${provider}@example.com`,
    provider
  };
  
  try {
    // Save user to MongoDB
    const saveResult = await mongoService.saveUser({
      name: userData.name,
      email: userData.email,
      provider: provider,
      providerUserId: userData.id,
      balance: 50000, // Starting balance in RWF
      currency: 'RWF'
    });
    
    // Create a proper SaveUserResult object with null checks
    let result: SaveUserResult = {
      success: false
    };
    
    // Handle various types of saveResult with proper null checking
    if (saveResult !== null) {
      if (typeof saveResult === 'object') {
        result.success = true;
        // Only add id if saveResult has an id property
        if (saveResult && typeof saveResult === 'object' && 'id' in saveResult) {
          result.id = String(saveResult.id);
        }
      } else if (typeof saveResult === 'boolean') {
        result.success = saveResult;
      }
    }
    
    if (result.success) {
      // Store auth data in localStorage (in a real app, this would be more secure)
      localStorage.setItem('userToken', result.id || `sample-jwt-token-${provider}-${userData.id}`);
      localStorage.setItem('userName', userData.name);
      localStorage.setItem('userEmail', userData.email);
      localStorage.setItem('userProvider', provider);
      
      console.log('User logged in successfully, stored in MongoDB:', result);
      
      // Dispatch a custom event to notify other components about auth state change
      window.dispatchEvent(new CustomEvent('authChange'));
      
      return {
        ...userData,
        id: result.id || userData.id
      };
    }
    
    console.error('Error in MongoDB save:', result);
    return userData;
  } catch (error) {
    console.error('Error during login process:', error);
    
    // Fall back to local storage only if MongoDB fails
    localStorage.setItem('userToken', `sample-jwt-token-${provider}-${userData.id}`);
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userProvider', provider);
    
    window.dispatchEvent(new CustomEvent('authChange'));
    
    return userData;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('userToken') !== null;
};

// Logout function
export const logout = async () => {
  try {
    // First try to sign out from Supabase
    await supabase.auth.signOut();
    
    // Then clear local storage
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userProvider');
    
    // Dispatch a custom event to notify other components about auth state change
    window.dispatchEvent(new CustomEvent('authChange'));
    
    return true;
  } catch (error) {
    console.error("Error during logout:", error);
    return false;
  }
};

// Function to get current user data
export const getCurrentUser = () => {
  if (!isAuthenticated()) return null;
  
  return {
    token: localStorage.getItem('userToken'),
    name: localStorage.getItem('userName'),
    email: localStorage.getItem('userEmail'),
    provider: localStorage.getItem('userProvider'),
  };
};

// Listen for auth changes
export const listenForAuthChanges = (callback: () => void) => {
  window.addEventListener('authChange', callback);
  window.addEventListener('storage', callback); // For cross-tab sync
  
  return () => {
    window.removeEventListener('authChange', callback);
    window.removeEventListener('storage', callback);
  };
};

// Check if current user is an admin
export const isAdmin = async (): Promise<boolean> => {
  try {
    // First check if user is authenticated
    if (!isAuthenticated()) {
      return false;
    }
    
    const { data, error } = await supabase.rpc('has_role', {
      '_role': 'admin'
    });
    
    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
    
    return data === true;
  } catch (error) {
    console.error("Error in admin check:", error);
    return false;
  }
};

// Function to add a user as an admin (only callable by admins)
export const addAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .insert([
        { user_id: userId, role: 'admin' }
      ]);
    
    if (error) {
      console.error("Error adding admin:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in addAdmin:", error);
    return false;
  }
};
