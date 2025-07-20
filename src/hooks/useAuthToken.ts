import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

export const useAuthToken = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
    token: null
  });
  const navigate = useNavigate();

  const validateAuth = useCallback(() => {
    const authStatus = localStorage.getItem('auth_status');
    const authTimestamp = localStorage.getItem('auth_timestamp');


    if (authStatus !== 'authenticated') {
      console.log('useAuthToken: Authentication invalid, setting state to not authenticated');
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: 'Authentication required',
        token: null
      });
      return false;
    }

    // Check token expiration
    if (authTimestamp) {
      const timestampDate = new Date(authTimestamp);
      const now = new Date();
      const hoursSinceLogin = (now.getTime() - timestampDate.getTime()) / (1000 * 60 * 60);
      
      // Get session timeout from localStorage (in milliseconds)
      const sessionTimeoutStr = localStorage.getItem('session_timeout');
      const sessionTimeoutMs = sessionTimeoutStr ? parseInt(sessionTimeoutStr, 10) : (24 * 60 * 60 * 1000); // Default to 24 hours if not set
      const sessionTimeoutHours = sessionTimeoutMs / (1000 * 60 * 60);

      if (hoursSinceLogin > sessionTimeoutHours) {
        console.log('useAuthToken: Authentication expired, clearing data');
        // Clear expired auth data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_status');
        localStorage.removeItem('auth_timestamp');
        localStorage.removeItem('session_timeout');
        
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          error: 'Session expired',
          token: null
        });
        return false;
      }
    }

    setAuthState({
      isAuthenticated: true,
      isLoading: false,
      error: null,
      token: localStorage.getItem('auth_token')
    });
    return true;
  }, []);

  const redirectToLogin = useCallback(() => {
    console.log('useAuthToken: Redirecting to login');
    const adminPath = import.meta.env.VITE_ADMIN_PATH || '/admin';
    const loginPath = import.meta.env.VITE_LOGIN_PATH || '/login';
    
    // Clear any remaining auth data
    console.log('useAuthToken: Clearing authentication data');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_status');
    localStorage.removeItem('auth_timestamp');
    localStorage.removeItem('session_timeout');
    
    navigate(loginPath, { 
      state: { from: adminPath },
      replace: true 
    });
  }, [navigate]);

  useEffect(() => {
    const isValid = validateAuth();
    
    if (!isValid) {
      // Don't redirect immediately, let components handle the error display
      // Only redirect after a short delay to show the error message
      const timer = setTimeout(() => {
        redirectToLogin();
      }, 2000);
      
      return () => clearTimeout(timer);
    }

    // Set up periodic validation every 5 minutes
    const interval = setInterval(() => {
      const isStillValid = validateAuth();
      if (!isStillValid) {
        redirectToLogin();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [validateAuth, redirectToLogin]);

  const forceRefresh = () => {
    validateAuth();
  };

  return {
    ...authState,
    validateAuth,
    redirectToLogin,
    forceRefresh
  };
};