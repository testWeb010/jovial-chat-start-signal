import { useEffect, useCallback, useState } from 'react';

interface SecurityEvent {
  type: string;
  timestamp: number;
  details: Record<string, any>;
}

interface SecurityMetrics {
  failedAttempts: number;
  lastFailedAttempt: number | null;
  suspiciousActivity: boolean;
  sessionTimeout: number;
}

export const useSecurityMonitoring = () => {
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    failedAttempts: 0,
    lastFailedAttempt: null,
    suspiciousActivity: false,
    sessionTimeout: 15 * 60 * 1000 // 15 minutes
  });

  // Monitor for suspicious activity patterns
  const detectSuspiciousActivity = useCallback(() => {
    const events = getStoredSecurityEvents();
    const recentEvents = events.filter(event => 
      Date.now() - event.timestamp < 5 * 60 * 1000 // Last 5 minutes
    );

    // Check for rapid-fire login attempts
    const loginAttempts = recentEvents.filter(event => 
      event.type === 'login_attempt'
    );

    if (loginAttempts.length > 3) {
      setSecurityMetrics(prev => ({ ...prev, suspiciousActivity: true }));
      logSecurityEvent('suspicious_activity_detected', {
        attemptCount: loginAttempts.length,
        timeWindow: '5_minutes'
      });
    }
  }, []);

  // Log security events
  const logSecurityEvent = useCallback((type: string, details: Record<string, any>) => {
    const event: SecurityEvent = {
      type,
      timestamp: Date.now(),
      details: {
        ...details,
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer
      }
    };

    // Store locally (in production, send to security monitoring service)
    const events = getStoredSecurityEvents();
    events.push(event);
    
    // Keep only last 100 events
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }
    
    localStorage.setItem('security_events', JSON.stringify(events));
    
    // Trigger suspicious activity detection
    detectSuspiciousActivity();
  }, [detectSuspiciousActivity]);

  // Session timeout monitoring
  const startSessionTimeout = useCallback(() => {
    const timeoutId = setTimeout(() => {
      logSecurityEvent('session_timeout', {});
      
      // Clear authentication
      localStorage.removeItem('auth_status');
      localStorage.removeItem('auth_timestamp');
      
      // Redirect to login
      window.location.href = '/login';
    }, securityMetrics.sessionTimeout);

    return timeoutId;
  }, [securityMetrics.sessionTimeout, logSecurityEvent]);

  // Reset session timeout on activity
  const resetSessionTimeout = useCallback(() => {
    localStorage.setItem('auth_timestamp', new Date().toISOString());
  }, []);

  // Check for environment security
  const checkEnvironmentSecurity = useCallback(() => {
    const securityChecks = {
      https: window.location.protocol === 'https:' || window.location.hostname === 'localhost',
      secureContext: window.isSecureContext,
      cookiesEnabled: navigator.cookieEnabled,
      javaScriptEnabled: true, // If this runs, JS is enabled
      localStorage: (() => {
        try {
          localStorage.setItem('test', 'test');
          localStorage.removeItem('test');
          return true;
        } catch {
          return false;
        }
      })()
    };

    logSecurityEvent('environment_check', securityChecks);
    
    return securityChecks;
  }, [logSecurityEvent]);

  // Monitor for console tampering
  useEffect(() => {
    const originalConsole = { ...console };
    
    // Detect if console is opened (basic detection)
    let devtools = false;
    const detector = setInterval(() => {
      if (window.outerHeight - window.innerHeight > 200 || 
          window.outerWidth - window.innerWidth > 200) {
        if (!devtools) {
          devtools = true;
          logSecurityEvent('devtools_opened', {
            outerHeight: window.outerHeight,
            innerHeight: window.innerHeight,
            outerWidth: window.outerWidth,
            innerWidth: window.innerWidth
          });
        }
      } else {
        devtools = false;
      }
    }, 1000);

    return () => {
      clearInterval(detector);
    };
  }, [logSecurityEvent]);

  // Monitor for page visibility changes (potential tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logSecurityEvent('page_hidden', { timestamp: Date.now() });
      } else {
        logSecurityEvent('page_visible', { timestamp: Date.now() });
        resetSessionTimeout();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [logSecurityEvent, resetSessionTimeout]);

  // Monitor for copy/paste in password fields (potential clipboard attack)
  const monitorClipboardActivity = useCallback((element: HTMLInputElement) => {
    const handlePaste = (e: ClipboardEvent) => {
      if (element.type === 'password') {
        logSecurityEvent('password_paste_detected', {
          elementId: element.id,
          hasClipboardData: !!e.clipboardData
        });
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      if (element.type === 'password' && element.value) {
        logSecurityEvent('password_copy_attempt', {
          elementId: element.id
        });
        e.preventDefault(); // Prevent copying passwords
      }
    };

    element.addEventListener('paste', handlePaste);
    element.addEventListener('copy', handleCopy);

    return () => {
      element.removeEventListener('paste', handlePaste);
      element.removeEventListener('copy', handleCopy);
    };
  }, [logSecurityEvent]);

  return {
    securityMetrics,
    logSecurityEvent,
    checkEnvironmentSecurity,
    startSessionTimeout,
    resetSessionTimeout,
    monitorClipboardActivity,
    setSecurityMetrics
  };
};

// Helper function to get stored security events
const getStoredSecurityEvents = (): SecurityEvent[] => {
  try {
    const stored = localStorage.getItem('security_events');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Export for use in components
export default useSecurityMonitoring;
