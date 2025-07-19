import React from 'react';
import { Shield, AlertTriangle, Lock, Eye, Smartphone, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';

const SecurityEducation: React.FC = () => {
  const securityTips = [
    {
      icon: <Globe className="h-5 w-5" />,
      title: "Verify Website URL",
      description: "Always check that you're on the correct website before entering credentials. Look for 'https://' and the correct domain name.",
      importance: "critical"
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: "Use Strong Passwords",
      description: "Create passwords with at least 8 characters, including uppercase, lowercase, numbers, and special characters.",
      importance: "high"
    },
    {
      icon: <Eye className="h-5 w-5" />,
      title: "Keep Credentials Private",
      description: "Never share your login credentials with anyone. Our staff will never ask for your password.",
      importance: "critical"
    },
    {
      icon: <Smartphone className="h-5 w-5" />,
      title: "Enable Two-Factor Authentication",
      description: "Add an extra layer of security by enabling 2FA when available.",
      importance: "high"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Secure Your Device",
      description: "Keep your device updated and use antivirus software to protect against keyloggers and malware.",
      importance: "medium"
    },
    {
      icon: <AlertTriangle className="h-5 w-5" />,
      title: "Beware of Phishing",
      description: "Be cautious of emails or messages asking you to click links and enter credentials. Always navigate directly to our site.",
      importance: "critical"
    }
  ];

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge variant="secondary">High</Badge>;
      case 'medium':
        return <Badge variant="outline">Medium</Badge>;
      default:
        return <Badge variant="outline">Info</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span>Security Best Practices</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your security is our priority. Following these guidelines helps protect your account and data.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-2">
            {securityTips.map((tip, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardContent className="pt-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-primary mt-1">
                      {tip.icon}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{tip.title}</h3>
                        {getImportanceBadge(tip.importance)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to Identify Phishing Attempts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold text-green-600 mb-2">✓ Legitimate Signs</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Correct domain name in URL</li>
                <li>• Valid SSL certificate (green padlock)</li>
                <li>• Professional design and language</li>
                <li>• No urgent pressure to act immediately</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-600 mb-2">⚠ Warning Signs</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Suspicious or misspelled URLs</li>
                <li>• Urgent threats or pressure tactics</li>
                <li>• Requests for sensitive information via email</li>
                <li>• Poor grammar or unprofessional appearance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password Security Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Strong Password Requirements:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• At least 8 characters long</li>
                <li>• Mix of uppercase and lowercase letters</li>
                <li>• Include numbers and special characters</li>
                <li>• Avoid common words or personal information</li>
                <li>• Use a unique password for each account</li>
              </ul>
            </div>
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Consider using a password manager to generate and store strong, unique passwords for all your accounts.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityEducation;