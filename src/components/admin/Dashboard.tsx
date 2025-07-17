import React, { useState, useEffect } from 'react';
import { Video, Image, Eye, Heart, TrendingUp, Calendar, Users, BarChart3 } from 'lucide-react';
import { apiRequestJson } from '../../utils/api';


interface DashboardData {
  totalVideos: number;
  totalProjects: number;
  totalUsers: number;
  totalViews: number;
  recentActivity: { type: string; title: string; time: string }[];
  analytics: { month: string; views: number }[];
}

interface ThemeClasses {
  bg: string;
  cardBg: string;
  text: string;
  textSecondary: string;
  border: string;
  hover: string;
}

const Dashboard = ({ isDarkMode, themeClasses }: { isDarkMode: boolean; themeClasses: ThemeClasses }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalVideos: 0,
    totalProjects: 0,
    totalUsers: 0,
    totalViews: 0,
    recentActivity: [],
    analytics: []
  });

  const stats = [
    {
      title: 'Total Videos',
      value: dashboardData.totalVideos.toString(),
      change: '+12%',
      icon: Video,
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      title: 'Total Projects',
      value: dashboardData.totalProjects.toString(),
      change: '+8%',
      icon: Image,
      gradient: 'from-pink-500 to-purple-600'
    },
    {
      title: 'Total Views',
      value: dashboardData.totalViews.toLocaleString(),
      change: '+24%',
      icon: Eye,
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Total Users',
      value: dashboardData.totalUsers.toString(),
      change: '+5%',
      icon: Users,
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  const recentActivity = dashboardData.recentActivity.length > 0 ? dashboardData.recentActivity : [
    { type: 'video', title: 'New video added: "Brand Campaign 2024"', time: '2 hours ago' },
    { type: 'project', title: 'Project updated: "Celebrity Collaboration"', time: '4 hours ago' },
    { type: 'video', title: 'Video published: "Sports Sponsorship"', time: '6 hours ago' },
    { type: 'project', title: 'New project created: "Tech Innovation"', time: '1 day ago' },
    { type: 'video', title: 'Video analytics updated', time: '2 days ago' }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await apiRequestJson('http://localhost:3001/api/admin/dashboard');
      setDashboardData(data as DashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-8">Loading dashboard data...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className={`${themeClasses.cardBg} rounded-2xl p-8 ${themeClasses.border} border`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${themeClasses.text} mb-2`}>
              Welcome back, Admin! 👋
            </h1>
            <p className={themeClasses.textSecondary}>
              Here's what's happening with your AcrossMedia content today.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={16} />
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="group relative">
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-1000`}></div>
            <div className={`relative ${themeClasses.cardBg} rounded-2xl p-6 ${themeClasses.border} border hover:border-gray-600 transition-all duration-300`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center`}>
                  <stat.icon size={24} className="text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                  <TrendingUp size={14} />
                  <span>{stat.change}</span>
                </div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${themeClasses.text} mb-1`}>{stat.value}</div>
                <div className={`text-sm ${themeClasses.textSecondary}`}>{stat.title}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className={`${themeClasses.cardBg} rounded-2xl p-6 ${themeClasses.border} border`}>
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-cyan-400" size={24} />
            <h2 className={`text-xl font-bold ${themeClasses.text}`}>Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'video' 
                    ? 'bg-cyan-500/20 text-cyan-400' 
                    : 'bg-pink-500/20 text-pink-400'
                }`}>
                  {activity.type === 'video' ? <Video size={14} /> : <Image size={14} />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${themeClasses.text} mb-1`}>{activity.title}</p>
                  <p className={`text-xs ${themeClasses.textSecondary}`}>{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`${themeClasses.cardBg} rounded-2xl p-6 ${themeClasses.border} border`}>
          <h2 className={`text-xl font-bold ${themeClasses.text} mb-6`}>Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-500 to-pink-600 rounded-xl text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
              <Video size={20} />
              <span className="font-medium">Add New Video</span>
            </button>
            <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-white hover:shadow-lg hover:shadow-pink-500/25 transition-all">
              <Image size={20} />
              <span className="font-medium">Create New Project</span>
            </button>
            <button className={`w-full flex items-center gap-3 p-4 ${themeClasses.border} border rounded-xl ${themeClasses.textSecondary} ${themeClasses.hover} transition-all`}>
              <BarChart3 size={20} />
              <span className="font-medium">View Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;