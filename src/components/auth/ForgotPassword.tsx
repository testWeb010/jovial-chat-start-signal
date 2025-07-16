import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [accountStatus, setAccountStatus] = useState<'unknown' | 'pending' | 'approved' | 'notfound'>('unknown');
  const navigate = useNavigate();

  const handleCheckAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    setAccountStatus('unknown');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/admin/check-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to check account status');
      }

      if (data.status === 'notfound') {
        setAccountStatus('notfound');
        setError('No account found with this email address');
      } else if (data.status === 'pending') {
        setAccountStatus('pending');
        setError('Your account is pending approval. You cannot reset your password until approved.');
      } else if (data.status === 'approved') {
        setAccountStatus('approved');
        setMessage('Account verified. You can proceed with password reset.');
        // In a real app, here we would send a reset link to the email
        // For now, we'll just simulate a success message
        setTimeout(() => {
          setMessage('A password reset link has been sent to your email. Please check your inbox.');
          setEmail('');
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while checking account status');
      setAccountStatus('unknown');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-gray-800 bg-opacity-75 p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-cyan-400">Reset Password</h1>
          <p className="text-gray-300 mt-2">Enter your email to receive a password reset link</p>
        </div>
        <form onSubmit={handleCheckAccount} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading || accountStatus === 'approved'}
                className="pl-10 w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>
          </div>
          {error && <div className="bg-red-600 bg-opacity-30 text-red-200 px-4 py-2 rounded-md text-sm">{error}</div>}
          {message && <div className="bg-green-600 bg-opacity-30 text-green-200 px-4 py-2 rounded-md text-sm">{message}</div>}
          <button
            type="submit"
            className={`w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-cyan-400 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 ${isLoading || accountStatus === 'approved' ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isLoading || accountStatus === 'approved'}
          >
            {isLoading ? 'Checking Account...' : 'Request Reset Link'}
          </button>
          <div className="text-center text-sm text-gray-300">
            Remember your password? <button className="text-cyan-400 hover:text-cyan-300 font-medium" onClick={navigateToLogin} disabled={isLoading}>Sign In</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
