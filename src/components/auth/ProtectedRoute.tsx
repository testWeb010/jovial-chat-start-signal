import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }>({
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const validateAuth = () => {
      const token = localStorage.getItem('auth_token');
      const authStatus = localStorage.getItem('auth_status');
      const authTimestamp = localStorage.getItem('auth_timestamp');

      // Check if basic auth data exists
      if (!token || authStatus !== 'authenticated') {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          error: 'Authentication required'
        });
        return;
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
            error: 'Session expired. Please login again.'
          });
          return;
        }
      }

      // Authentication is valid
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    };

    validateAuth();
  }, []);

  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 size={48} className="text-cyan-400 animate-spin" />
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">Verifying Access</h3>
              <p className="text-gray-400">Please wait while we verify your authentication...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    const loginPath = import.meta.env.VITE_LOGIN_PATH || '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
