import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const PendingApproval: React.FC = () => {
  const navigate = useNavigate();
  const [accessDenied, setAccessDenied] = useState(false);
  const [message, setMessage] = useState('Checking access...');

  useEffect(() => {
    const checkAccess = () => {
      // Get session data from sessionStorage
      const sessionDataStr = sessionStorage.getItem('pendingApprovalSession');
      if (!sessionDataStr) {
        setAccessDenied(true);
        setMessage('No session data found. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      let sessionData;
      try {
        sessionData = JSON.parse(sessionDataStr);
        if (!sessionData.pendingSessionToken || !sessionData.timestamp) {
          throw new Error('Invalid session data');
        }
      } catch (error) {
        console.error('Error parsing session data:', error);
        setAccessDenied(true);
        setMessage('Invalid session data. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      // Check if the session has expired (15 seconds limit)
      const currentTime = new Date().getTime();
      const sessionTime = sessionData.timestamp;
      const timeElapsed = (currentTime - sessionTime) / 1000; // Convert to seconds

      if (timeElapsed > 15) {
        setAccessDenied(true);
        setMessage('Session expired. Redirecting to login...');
        sessionStorage.removeItem('pendingApprovalSession');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      // Access is granted if within time limit
    };

    checkAccess();

    // Set a timer to auto-redirect after 15 seconds
    const timer = setTimeout(() => {
      setAccessDenied(true);
      setMessage('Session time limit reached. Redirecting to login...');
      sessionStorage.removeItem('pendingApprovalSession');
      navigate('/login');
    }, 15000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleBackToLogin = () => {
    sessionStorage.removeItem('pendingApprovalSession');
    navigate('/login');
  };

  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-gray-800 bg-opacity-75 p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-3xl font-extrabold text-red-400">Access Denied</h1>
          <p className="text-gray-300 mt-2">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-gray-800 bg-opacity-75 p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-cyan-400">Pending Approval</h1>
          <p className="text-gray-300 mt-2">Your account is currently pending approval.</p>
        </div>
        <div className="bg-yellow-600 bg-opacity-30 text-yellow-200 px-4 py-4 rounded-md text-sm mb-6">
          <p>Thank you for signing up. Your account request has been sent for review. You will receive an email notification once your account is approved. Please check your email for further updates.</p>
        </div>
        <button
          onClick={handleBackToLogin}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default PendingApproval;
