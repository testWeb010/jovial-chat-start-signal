import React, { useState } from 'react';
import { Plus, Video, Image, Settings as SettingsIcon, Moon, Sun, BarChart3, Users, Calendar, Search } from 'lucide-react';
import VideoManagement from './VideoManagement';
import ProjectManagement from './ProjectManagement';
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import Settings from './Settings';
import LogoutButton from '../auth/LogoutButton';
import { apiRequestJson } from '../../utils/api';

interface ThemeClasses {
  bg: string;
  cardBg: string;
  text: string;
  textSecondary: string;
  border: string;
  hover: string;
}

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'projects', label: 'Projects', icon: Image },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  const themeClasses: ThemeClasses = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard isDarkMode={isDarkMode} themeClasses={themeClasses} />;
      case 'users':
        return <UserManagement isDarkMode={isDarkMode} themeClasses={themeClasses} />;
      case 'videos':
        return <VideoManagement isDarkMode={isDarkMode} themeClasses={themeClasses} />;
      case 'projects':
        return <ProjectManagement isDarkMode={isDarkMode} themeClasses={themeClasses} />;
      case 'settings':
        return <Settings isDarkMode={isDarkMode} themeClasses={themeClasses} />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${themeClasses.bg} transition-colors duration-300`}>
      {/* Header */}
      <header className={`${themeClasses.cardBg} ${themeClasses.border} border-b sticky top-0 z-40 backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold">
                <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Across</span>
                <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">Media</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
              }`}>
                Admin Panel
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-xl ${themeClasses.hover} transition-colors ${themeClasses.border} border`}
              >
                {isDarkMode ? (
                  <Sun size={20} className="text-yellow-400" />
                ) : (
                  <Moon size={20} className="text-gray-600" />
                )}
              </button>
              
              <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-pink-600 flex items-center justify-center`}>
                <Users size={16} className="text-white" />
              </div>
              <div className="flex justify-end mb-4">
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className={`${themeClasses.cardBg} rounded-2xl p-4 ${themeClasses.border} border sticky top-24`}>
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-cyan-500 to-pink-600 text-white shadow-lg'
                        : `${themeClasses.textSecondary} ${themeClasses.hover}`
                    }`}
                  >
                    <tab.icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;