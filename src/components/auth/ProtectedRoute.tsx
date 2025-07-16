import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('auth_token');
  const authStatus = localStorage.getItem('auth_status');
  const authTimestamp = localStorage.getItem('auth_timestamp');
  let isAuthenticated = authStatus === 'authenticated';

  // Optionally, check if the timestamp is recent enough (e.g., within the last 24 hours)
  if (isAuthenticated && authTimestamp) {
    const timestampDate = new Date(authTimestamp);
    const now = new Date();
    const hoursSinceLogin = (now.getTime() - timestampDate.getTime()) / (1000 * 60 * 60);
    if (hoursSinceLogin > 24) { // Token expired after 24 hours
      isAuthenticated = false;
      localStorage.removeItem('auth_status');
      localStorage.removeItem('auth_timestamp');
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
