import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, AlertTriangle, CheckCircle, Lock, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';

interface CaptchaChallenge {
  id: string;
  question: string;
}

interface SecurityIndicator {
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
}

const SecureLogin: React.FC = () => {
  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [securityIndicators, setSecurityIndicators] = useState<SecurityIndicator[]>([]);
  
  // Security state
  const [captchaChallenge, setCaptchaChallenge] = useState<CaptchaChallenge | null>(null);
  const [requiresCaptcha, setRequiresCaptcha] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  
  const navigate = useNavigate();

  // Security validation
  const validateSecurityContext = useCallback(() => {
    const indicators: SecurityIndicator[] = [];
    
    // Check HTTPS
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      indicators.push({
        type: 'warning',
        message: 'Connection is not secure. Ensure you are on the official website.'
      });
    } else {
      indicators.push({
        type: 'success',
        message: 'Secure connection established'
      });
    }
    
    // Check URL authenticity
    const expectedDomains = ['localhost', process.env.VITE_APP_DOMAIN];
    if (!expectedDomains.some(domain => domain && window.location.hostname.includes(domain))) {
      indicators.push({
        type: 'error',
        message: 'Warning: Verify you are on the correct website before entering credentials'
      });
    }
    
    setSecurityIndicators(indicators);
  }, []);

  // Password strength calculation
  const calculatePasswordStrength = useCallback((pwd: string) => {
    let strength = 0;
    const checks = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[@$!%*?&]/.test(pwd)
    };
    
    strength = Object.values(checks).filter(Boolean).length / Object.keys(checks).length;
    setPasswordStrength(strength);
  }, []);

  // CAPTCHA management
  const fetchCaptcha = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/admin/captcha', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const challenge = await response.json();
        setCaptchaChallenge(challenge);
      }
    } catch (error) {
      console.error('Failed to fetch CAPTCHA:', error);
    }
  }, []);

  // Initialize security checks
  useEffect(() => {
    validateSecurityContext();
    
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('auth_status');
    if (authStatus === 'authenticated') {
      navigate('/acs-admin');
    }
  }, [navigate, validateSecurityContext]);

  // Handle password changes
  useEffect(() => {
    if (password) {
      calculatePasswordStrength(password);
    }
  }, [password, calculatePasswordStrength]);

  // Handle CAPTCHA requirement
  useEffect(() => {
    if (requiresCaptcha && !captchaChallenge) {
      fetchCaptcha();
    }
  }, [requiresCaptcha, captchaChallenge, fetchCaptcha]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const requestBody: any = { username, password };
      
      // Include CAPTCHA if required
      if (requiresCaptcha && captchaChallenge) {
        requestBody.captchaId = captchaChallenge.id;
        requestBody.captchaAnswer = captchaAnswer;
      }

      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle different error types
        switch (data.type) {
          case 'RATE_LIMIT_EXCEEDED':
            setError(data.error);
            break;
          case 'ACCOUNT_LOCKED':
            setError(data.error);
            break;
          case 'CAPTCHA_REQUIRED':
            setRequiresCaptcha(true);
            setError('Please complete the security challenge');
            break;
          case 'CAPTCHA_INVALID':
            setCaptchaChallenge(null);
            setCaptchaAnswer('');
            setError(data.error);
            break;
          case 'VALIDATION_ERROR':
            setError(`Validation failed: ${data.details?.map((d: any) => d.msg).join(', ')}`);
            break;
          default:
            setError(data.error || 'Login failed');
            setLoginAttempts(prev => prev + 1);
            
            // Require CAPTCHA after 2 failed attempts
            if (loginAttempts >= 1) {
              setRequiresCaptcha(true);
            }
        }
        return;
      }

      // Successful login
      localStorage.setItem('auth_status', 'authenticated');
      localStorage.setItem('auth_timestamp', new Date().toISOString());
      
      // Clear security state
      setLoginAttempts(0);
      setRequiresCaptcha(false);
      setCaptchaChallenge(null);
      
      setTimeout(() => {
        navigate('/acs-admin');
      }, 100);

    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 0.4) return 'bg-red-500';
    if (passwordStrength < 0.7) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 0.4) return 'Weak';
    if (passwordStrength < 0.7) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl font-bold text-center">Secure Admin Portal</CardTitle>
          </div>
          
          {/* Security Indicators */}
          <div className="space-y-2">
            {securityIndicators.map((indicator, index) => (
              <Alert key={index} className={`py-2 ${
                indicator.type === 'success' ? 'border-green-500 bg-green-50' :
                indicator.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                indicator.type === 'error' ? 'border-red-500 bg-red-50' :
                'border-blue-500 bg-blue-50'
              }`}>
                <AlertDescription className="text-sm">
                  {indicator.message}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="border-red-500 bg-red-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Username</span>
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                disabled={isLoading}
                className="transition-all duration-200"
                autoComplete="username"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium flex items-center space-x-2">
                <Lock className="h-4 w-4" />
                <span>Password</span>
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  className="pr-10 transition-all duration-200"
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Password Strength:</span>
                    <Badge variant={passwordStrength < 0.4 ? 'destructive' : passwordStrength < 0.7 ? 'secondary' : 'default'}>
                      {getPasswordStrengthText()}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${passwordStrength * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* CAPTCHA Challenge */}
            {requiresCaptcha && captchaChallenge && (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Security Challenge</span>
                </label>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-mono text-center">{captchaChallenge.question}</p>
                </div>
                <Input
                  type="text"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  placeholder="Enter your answer"
                  required
                  disabled={isLoading}
                  className="transition-all duration-200"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCaptchaChallenge(null);
                    setCaptchaAnswer('');
                    fetchCaptcha();
                  }}
                  disabled={isLoading}
                >
                  Get New Challenge
                </Button>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || (requiresCaptcha && !captchaAnswer)}
            >
              {isLoading ? 'Signing In...' : 'Sign In Securely'}
            </Button>

            {/* Security Notice */}
            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                Your connection is protected by industry-standard encryption
              </p>
              <div className="flex items-center justify-center space-x-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">SSL/TLS Secured</span>
              </div>
            </div>

            {/* Help Link */}
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={() => navigate('/forgot-password')}
                disabled={isLoading}
              >
                Forgot Password?
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecureLogin;