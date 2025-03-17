
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
  
  // Store auth data in localStorage (in a real app, this would be more secure)
  localStorage.setItem('userToken', `sample-jwt-token-${provider}-${userData.id}`);
  localStorage.setItem('userName', userData.name);
  localStorage.setItem('userEmail', userData.email);
  localStorage.setItem('userProvider', provider);
  
  // Dispatch a custom event to notify other components about auth state change
  window.dispatchEvent(new Event('authChange'));
  
  return userData;
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
  window.dispatchEvent(new Event('authChange'));
};
