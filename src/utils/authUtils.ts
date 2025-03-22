
import { mongoService } from '@/services/mongoService';

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
    const result: SaveUserResult = await mongoService.saveUser({
      name: userData.name,
      email: userData.email,
      provider: provider,
      providerUserId: userData.id,
      balance: 50000, // Starting balance in RWF
      currency: 'RWF'
    }) as SaveUserResult;
    
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
export const logout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userProvider');
  
  // Dispatch a custom event to notify other components about auth state change
  window.dispatchEvent(new CustomEvent('authChange'));
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
