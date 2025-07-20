import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean | null;
    isLoading: boolean;
    error: string | null;
  }>({
    isAuthenticated: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    const validateAuth = () => {
      const authStatus = localStorage.getItem('auth_status');
      const authTimestamp = localStorage.getItem('auth_timestamp');

      // console.log('ProtectedRoute: Checking authentication status');
      // console.log('Auth status:', authStatus);
      // console.log('Auth timestamp:', authTimestamp);

      // Check if basic auth data exists - now only checking auth_status
      if (authStatus !== 'authenticated') {
        if (isMounted) {
          setAuthState(prevState => {
            if (!prevState.isAuthenticated && !prevState.isLoading && prevState.error === 'Authentication required') {
              return prevState;
            }
            return {
              isAuthenticated: false,
              isLoading: false,
              error: 'Authentication required'
            };
          });
        }
        return;
      }

      // Check token expiration (24 hours)
      if (authTimestamp) {
        const timestampDate = new Date(authTimestamp);
        const now = new Date();
        const hoursSinceLogin = (now.getTime() - timestampDate.getTime()) / (1000 * 60 * 60);
        
        // Get session timeout from localStorage (in milliseconds)
        const sessionTimeoutStr = localStorage.getItem('session_timeout');
        const sessionTimeoutMs = sessionTimeoutStr ? parseInt(sessionTimeoutStr, 10) : (24 * 60 * 60 * 1000); // Default to 24 hours if not set
        const sessionTimeoutHours = sessionTimeoutMs / (1000 * 60 * 60);
        
        if (hoursSinceLogin > sessionTimeoutHours) {
          console.log('Session expired, clearing localStorage data');
          // Add a small delay to ensure this isn't a race condition
          setTimeout(() => {
            // Clear expired auth data
            localStorage.removeItem('auth_status');
            localStorage.removeItem('auth_timestamp');
            localStorage.removeItem('session_timeout');
            
            if (isMounted) {
              setAuthState(prevState => {
                if (!prevState.isAuthenticated && !prevState.isLoading && prevState.error === 'Session expired') {
                  return prevState;
                }
                return {
                  isAuthenticated: false,
                  isLoading: false,
                  error: 'Session expired'
                };
              });
            }
          }, 5000); // 5 second delay before clearing
          return;
        }
      }

      // If all checks pass
      if (isMounted) {
        setAuthState(prevState => {
          if (prevState.isAuthenticated && !prevState.isLoading && !prevState.error) {
            return prevState;
          }
          return {
            isAuthenticated: true,
            isLoading: false,
            error: null
          };
        });
      }
    };

    validateAuth();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]); // Re-validate on route change

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