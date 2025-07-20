import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Attempt to call logout endpoint to invalidate server-side session
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/admin/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensure cookies are sent with the request
      });
      if (!response.ok) {
        throw new Error(`Backend logout failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error during backend logout:', error);
    }
    
    // Clear all authentication data regardless of backend call result
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_status');
    localStorage.removeItem('auth_timestamp');
    Cookies.remove('auth_token');
    
    // Navigate to home page
    navigate('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
