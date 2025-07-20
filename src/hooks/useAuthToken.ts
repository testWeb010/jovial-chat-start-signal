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
    const token = localStorage.getItem('auth_token');
    const authStatus = localStorage.getItem('auth_status');
    const authTimestamp = localStorage.getItem('auth_timestamp');

    if (!token || authStatus !== 'authenticated') {
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: 'Authentication token missing',
        token: null
      });
      return false;
    }

    // Check token expiration (24 hours)
    if (authTimestamp) {
      const timestampDate = new Date(authTimestamp);
      const now = new Date();
      const hoursSinceLogin = (now.getTime() - timestampDate.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLogin > 24) {
        // Clear expired auth data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_status');
        localStorage.removeItem('auth_timestamp');
        
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          error: 'Session expired. Please login again.',
          token: null
        });
        return false;
      }
    }

    setAuthState({
      isAuthenticated: true,
      isLoading: false,
      error: null,
      token
    });
    return true;
  }, []);

  const redirectToLogin = useCallback(() => {
    const adminPath = import.meta.env.VITE_ADMIN_PATH || '/admin';
    const loginPath = import.meta.env.VITE_LOGIN_PATH || '/login';
    
    // Clear any remaining auth data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_status');
    localStorage.removeItem('auth_timestamp');
    
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