import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Save, RefreshCw, AlertCircle, CheckCircle, Globe, Mail, Shield, Clock } from 'lucide-react';
import { apiRequestJson } from '../../utils/api';
import { toast } from 'sonner';
import AuthenticatedWrapper from './AuthenticatedWrapper';

interface SiteSettings {
  _id?: string;
  type: string;
  siteName: string;
  siteDescription: string;
  theme: 'light' | 'dark';
  emailNotifications: boolean;
  autoApprove: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  timezone: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt?: string;
}

interface ThemeClasses {
  bg: string;
  cardBg: string;
  text: string;
  textSecondary: string;
  border: string;
  hover: string;
}

const Settings = ({ isDarkMode, themeClasses }: { isDarkMode: boolean; themeClasses: ThemeClasses }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUserProfile();
    fetchSiteSettings();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const profile = await apiRequestJson<UserProfile>(
        'http://localhost:3001/api/settings/profile',
        { credentials: 'include' }
      );
      setUserProfile(profile);
      setProfileForm(prev => ({
        ...prev,
        username: profile.username,
        email: profile.email
      }));
    } catch (err) {
      toast.error('Failed to load profile');
    }
  };

  const fetchSiteSettings = async () => {
    try {
      const settings = await apiRequestJson<SiteSettings>(
        'http://localhost:3001/api/settings',
        { credentials: 'include' }
      );
      setSiteSettings(settings);
    } catch (err) {
      toast.error('Failed to load site settings');
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (profileForm.newPassword && !profileForm.currentPassword) {
      toast.error('Current password is required to change password');
      return;
    }

    try {
      setLoading(true);
      const updateData: any = {
        username: profileForm.username,
        email: profileForm.email
      };

      if (profileForm.newPassword) {
        updateData.currentPassword = profileForm.currentPassword;
        updateData.newPassword = profileForm.newPassword;
      }

      await apiRequestJson('http://localhost:3001/api/settings/profile', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        credentials: 'include'
      });

      toast.success('Profile updated successfully');
      setProfileForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      fetchUserProfile();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSiteSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!siteSettings) return;

    try {
      setLoading(true);
      await apiRequestJson('http://localhost:3001/api/settings', {
        method: 'PUT',
        body: JSON.stringify(siteSettings),
        credentials: 'include'
      });

      toast.success('Site settings updated successfully');
      fetchSiteSettings();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update site settings';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'site', label: 'Site Settings', icon: Globe }
  ];

  return (
    <AuthenticatedWrapper themeClasses={themeClasses}>
      <div className="space-y-6">
      {/* Header */}
      <div className={`${themeClasses.cardBg} rounded-2xl p-6 ${themeClasses.border} border`}>
        <div className="flex items-center gap-3">
          <SettingsIcon className="text-cyan-400" size={24} />
          <div>
            <h1 className={`text-2xl font-bold ${themeClasses.text}`}>Settings</h1>
            <p className={themeClasses.textSecondary}>Manage your profile and application settings</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`${themeClasses.cardBg} rounded-2xl ${themeClasses.border} border overflow-hidden`}>
        <div className="flex border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500/20 to-pink-600/20 text-cyan-400 border-b-2 border-cyan-400'
                  : `${themeClasses.textSecondary} ${themeClasses.hover}`
              }`}
            >
              <tab.icon size={18} />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <div className="mb-6">
                <h2 className={`text-xl font-bold ${themeClasses.text} mb-2`}>Profile Information</h2>
                <p className={themeClasses.textSecondary}>Update your account details and password</p>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>
                      Username
                    </label>
                    <input
                      type="text"
                      value={profileForm.username}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
                      className={`w-full px-4 py-3 ${themeClasses.cardBg} ${themeClasses.border} border rounded-xl ${themeClasses.text} focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full px-4 py-3 ${themeClasses.cardBg} ${themeClasses.border} border rounded-xl ${themeClasses.text} focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
                      required
                    />
                  </div>
                </div>

                <div className={`border-t ${themeClasses.border} pt-6`}>
                  <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={profileForm.currentPassword}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className={`w-full px-4 py-3 ${themeClasses.cardBg} ${themeClasses.border} border rounded-xl ${themeClasses.text} focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
                        placeholder="Enter current password to change"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>
                          New Password
                        </label>
                        <input
                          type="password"
                          value={profileForm.newPassword}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, newPassword: e.target.value }))}
                          className={`w-full px-4 py-3 ${themeClasses.cardBg} ${themeClasses.border} border rounded-xl ${themeClasses.text} focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
                          placeholder="Enter new password"
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          value={profileForm.confirmPassword}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className={`w-full px-4 py-3 ${themeClasses.cardBg} ${themeClasses.border} border rounded-xl ${themeClasses.text} focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'site' && siteSettings && (
            <div className="max-w-2xl">
              <div className="mb-6">
                <h2 className={`text-xl font-bold ${themeClasses.text} mb-2`}>Site Configuration</h2>
                <p className={themeClasses.textSecondary}>Configure global application settings (Superadmin only)</p>
              </div>

              <form onSubmit={handleSiteSettingsUpdate} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={siteSettings.siteName}
                      onChange={(e) => setSiteSettings(prev => prev ? { ...prev, siteName: e.target.value } : null)}
                      className={`w-full px-4 py-3 ${themeClasses.cardBg} ${themeClasses.border} border rounded-xl ${themeClasses.text} focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>
                      Theme
                    </label>
                    <select
                      value={siteSettings.theme}
                      onChange={(e) => setSiteSettings(prev => prev ? { ...prev, theme: e.target.value as 'light' | 'dark' } : null)}
                      className={`w-full px-4 py-3 ${themeClasses.cardBg} ${themeClasses.border} border rounded-xl ${themeClasses.text} focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>
                    Site Description
                  </label>
                  <textarea
                    value={siteSettings.siteDescription}
                    onChange={(e) => setSiteSettings(prev => prev ? { ...prev, siteDescription: e.target.value } : null)}
                    rows={3}
                    className={`w-full px-4 py-3 ${themeClasses.cardBg} ${themeClasses.border} border rounded-xl ${themeClasses.text} focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none`}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>
                      Max File Size (MB)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={siteSettings.maxFileSize}
                      onChange={(e) => setSiteSettings(prev => prev ? { ...prev, maxFileSize: parseInt(e.target.value) } : null)}
                      className={`w-full px-4 py-3 ${themeClasses.cardBg} ${themeClasses.border} border rounded-xl ${themeClasses.text} focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>
                      Timezone
                    </label>
                    <select
                      value={siteSettings.timezone}
                      onChange={(e) => setSiteSettings(prev => prev ? { ...prev, timezone: e.target.value } : null)}
                      className={`w-full px-4 py-3 ${themeClasses.cardBg} ${themeClasses.border} border rounded-xl ${themeClasses.text} focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${themeClasses.text}`}>Preferences</h3>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Mail className="text-blue-400" size={20} />
                      <div>
                        <div className={`font-medium ${themeClasses.text}`}>Email Notifications</div>
                        <div className={`text-sm ${themeClasses.textSecondary}`}>Send email notifications for important events</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={siteSettings.emailNotifications}
                        onChange={(e) => setSiteSettings(prev => prev ? { ...prev, emailNotifications: e.target.checked } : null)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-pink-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-green-400" size={20} />
                      <div>
                        <div className={`font-medium ${themeClasses.text}`}>Auto Approve Users</div>
                        <div className={`text-sm ${themeClasses.textSecondary}`}>Automatically approve new user registrations</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={siteSettings.autoApprove}
                        onChange={(e) => setSiteSettings(prev => prev ? { ...prev, autoApprove: e.target.checked } : null)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-pink-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                    <span>Save Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      </div>
    </AuthenticatedWrapper>
  );
};

export default Settings;