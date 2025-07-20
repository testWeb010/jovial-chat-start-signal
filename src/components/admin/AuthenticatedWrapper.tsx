import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useAuthToken } from '../../hooks/useAuthToken';

interface AuthenticatedWrapperProps {
  children: React.ReactNode;
  themeClasses?: {
    bg: string;
    cardBg: string;
    text: string;
    textSecondary: string;
    border: string;
    hover: string;
  };
}

const AuthenticatedWrapper: React.FC<AuthenticatedWrapperProps> = ({ 
  children, 
  themeClasses = {
    bg: 'bg-gray-900',
    cardBg: 'bg-gray-800',
    text: 'text-white',
    textSecondary: 'text-gray-400',
    border: 'border-gray-700',
    hover: 'hover:bg-gray-700'
  }
}) => {
  const { isAuthenticated, isLoading, error, forceRefresh } = useAuthToken();

  if (isLoading) {
    return (
      <div className={`${themeClasses.cardBg} rounded-2xl p-12 ${themeClasses.border} border`}>
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <Loader2 size={48} className={`${themeClasses.textSecondary} animate-spin`} />
          <div>
            <h3 className={`text-xl font-bold ${themeClasses.text} mb-2`}>Verifying Authentication</h3>
            <p className={themeClasses.textSecondary}>Please wait while we verify your session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || error) {
    return (
      <div className={`${themeClasses.cardBg} rounded-2xl p-12 ${themeClasses.border} border`}>
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertCircle size={32} className="text-red-400" />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${themeClasses.text} mb-2`}>Access Denied</h3>
            <p className={`${themeClasses.textSecondary} mb-4`}>
              {error || 'Authentication required to access this section'}
            </p>
            <button
              onClick={forceRefresh}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all mx-auto"
            >
              <Loader2 size={16} />
              Retry
            </button>
          </div>
          <div className={`text-xs ${themeClasses.textSecondary} mt-4`}>
            You will be automatically redirected to login in a few seconds...
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthenticatedWrapper;