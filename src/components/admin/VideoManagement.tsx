import React, { useState, useEffect } from 'react';
import { Plus, Video, Edit, Trash2, Eye, Search, Filter, Calendar, Tag, ExternalLink, Youtube, Loader2 } from 'lucide-react';
import { apiRequestJson } from '../../utils/api';
import { fetchYouTubeVideoData, extractVideoId, getVideoThumbnail } from '../../utils/youtube';


interface Video {
  _id: string;
  title: string;
  url: string;
  description: string;
  keywords: string[];
  category: string;
  duration: string;
  views: string;
  createdAt: string;
  status: string;
}

interface ThemeClasses {
  bg: string;
  cardBg: string;
  text: string;
  textSecondary: string;
  border: string;
  hover: string;
}

const VideoManagement = ({ isDarkMode, themeClasses }: { isDarkMode: boolean; themeClasses: ThemeClasses }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateSort, setDateSort] = useState('newest');
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    keywords: '',
    category: 'Branded Content',
    thumbnail: ''
  });
  const [loadingYouTube, setLoadingYouTube] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const data = await apiRequestJson('/api/videos') as { videos?: Video[] } | Video[];
      setVideos(Array.isArray(data) ? data : ((data as { videos?: Video[] }).videos || []));
    } catch (err) {
      console.error('Fetch videos error:', err);
      setVideos([]);
      setError(err instanceof Error ? err.message : 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  const handleYouTubeUrlChange = async (url: string) => {
    setFormData({...formData, url});
    
    if (url && (url.includes('youtube.com') || url.includes('youtu.be'))) {
      setLoadingYouTube(true);
      try {
        const videoId = extractVideoId(url);
        if (videoId) {
          const thumbnail = getVideoThumbnail(videoId);
          const youtubeData = await fetchYouTubeVideoData(url);
          
            if (youtubeData) {
              setFormData(prev => ({
                ...prev,
                url,
                title: youtubeData.title !== 'YouTube Video' ? youtubeData.title : prev.title,
                description: youtubeData.description !== 'Video from YouTube' ? youtubeData.description : prev.description,
                thumbnail
              }));
            }
        }
      } catch (error) {
        console.error('Error fetching YouTube data:', error);
      } finally {
        setLoadingYouTube(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Fetch fresh YouTube data before saving
      const youtubeData = await fetchYouTubeVideoData(formData.url);
      
      const newVideo = {
        title: youtubeData?.title || formData.title,
        url: formData.url,
        description: youtubeData?.description || formData.description,
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
        category: formData.category,
        thumbnailUrl: youtubeData?.thumbnail || formData.thumbnail || getVideoThumbnail(extractVideoId(formData.url) || ''),
        views: youtubeData?.views || '0',
        duration: youtubeData?.duration || 'N/A',
        channelTitle: youtubeData?.channelTitle || 'Unknown',
        status: 'active'
      };
      
      const data = await apiRequestJson('/api/videos', { method: 'POST', body: JSON.stringify(newVideo) }) as Video;
      setVideos([data, ...videos]);
      setFormData({ title: '', url: '', description: '', keywords: '', category: 'Branded Content', thumbnail: '' });
      setShowAddForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save video');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiRequestJson(`/api/videos/${id}`, { method: 'DELETE' });
      setVideos(videos.filter(video => video._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete video');
    }
  };

  const filteredVideos = Array.isArray(videos) ? videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || video.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) : [];

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (dateSort === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
  });

  const categories = ['Branded Content', 'Celebrity Engagement', 'Sponsorships', 'Intellectual Properties'];

  if (loading) return <div className="text-center p-8">Loading videos...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${themeClasses.cardBg} rounded-2xl p-6 ${themeClasses.border} border`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>Video Management</h1>
            <p className={themeClasses.textSecondary}>Manage your video content and URLs</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
          >
            <Plus size={20} />
            <span>Add Video</span>
          </button>
        </div>
      </div>

      {/* Add Video Form */}
      {showAddForm && (
        <div className={`${themeClasses.cardBg} rounded-2xl p-6 ${themeClasses.border} border`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold ${themeClasses.text}`}>Add New Video</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className={`px-4 py-2 ${themeClasses.textSecondary} ${themeClasses.hover} rounded-lg transition-colors`}
            >
              Cancel
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>Video Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className={`w-full px-4 py-3 ${themeClasses.cardBg} ${themeClasses.border} border rounded-xl ${themeClasses.text} focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
                  placeholder="Enter video title"
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className={`w-full px-4 py-3 ${themeClasses.cardBg} ${themeClasses.border} border rounded-xl ${themeClasses.text} focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>
                <div className="flex items-center gap-2">
                  <Youtube size={16} className="text-red-500" />
                  YouTube Video URL
                </div>
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                  className={`w-full px-4 py-3 ${themeClasses.cardBg} ${themeClasses.border} border rounded-xl ${themeClasses.text} focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all pr-12`}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
                {loadingYouTube && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 size={20} className="animate-spin text-cyan-500" />
                  </div>
                )}
              </div>
              {formData.thumbnail && (
                <div className="mt-3">
                  <img 
                    src={formData.thumbnail} 
                    alt="Video thumbnail" 
                    className="w-32 h-18 object-cover rounded-lg border border-gray-600"
                  />
                </div>
              )}
            </div>

            <div>
              <label className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className={`w-full px-4 py-3 ${themeClasses.cardBg} ${themeClasses.border} border rounded-xl ${themeClasses.text} focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none`}
                placeholder="Enter video description"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>Keywords</label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                className={`w-full px-4 py-3 ${themeClasses.cardBg} ${themeClasses.border} border rounded-xl ${themeClasses.text} focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
                placeholder="keyword1, keyword2, keyword3"
              />
              <p className={`text-xs ${themeClasses.textSecondary} mt-1`}>Separate keywords with commas</p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
              >
                <Video size={20} />
                <span>Add Video</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className={`${themeClasses.cardBg} rounded-2xl p-6 ${themeClasses.border} border`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textSecondary}`} size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search videos..."
                className={`w-full pl-10 pr-4 py-3 ${themeClasses.cardBg} ${themeClasses.border} border rounded-xl ${themeClasses.text} focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`px-4 py-3 ${themeClasses.cardBg} ${themeClasses.border} border rounded-xl ${themeClasses.text} focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Videos List */}
      <div className="space-y-4">
        {sortedVideos.map((video) => (
          <div key={video._id} className={`${themeClasses.cardBg} rounded-2xl p-6 ${themeClasses.border} border hover:border-gray-600 transition-all`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className={`text-lg font-bold ${themeClasses.text}`}>{video.title}</h3>
                  <div className="bg-gradient-to-r from-cyan-500 to-pink-600 px-3 py-1 rounded-full">
                    <span className="text-white text-xs font-semibold">{video.category}</span>
                  </div>
                </div>
                
                <p className={`${themeClasses.textSecondary} mb-4 line-clamp-2`}>{video.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {video.keywords.map((keyword, index) => (
                    <span key={index} className={`px-2 py-1 ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'} text-xs rounded-md flex items-center gap-1`}>
                      <Tag size={10} />
                      {keyword}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Eye size={14} className={themeClasses.textSecondary} />
                    <span className={themeClasses.textSecondary}>{video.views} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className={themeClasses.textSecondary} />
                    <span className={themeClasses.textSecondary}>{video.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ExternalLink size={14} className={themeClasses.textSecondary} />
                    <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                      View Video
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button className={`p-2 ${themeClasses.hover} rounded-lg transition-colors`}>
                  <Edit size={16} className={themeClasses.textSecondary} />
                </button>
                <button 
                  onClick={() => handleDelete(video._id)}
                  className={`p-2 ${themeClasses.hover} rounded-lg transition-colors`}
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedVideos.length === 0 && (
        <div className={`${themeClasses.cardBg} rounded-2xl p-12 ${themeClasses.border} border text-center`}>
          <Video size={48} className={`${themeClasses.textSecondary} mx-auto mb-4`} />
          <h3 className={`text-xl font-bold ${themeClasses.text} mb-2`}>No videos found</h3>
          <p className={themeClasses.textSecondary}>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default VideoManagement;