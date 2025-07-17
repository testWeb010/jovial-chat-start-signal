import React, { useState, useMemo, useEffect } from 'react';
import { Search, Play, Filter, Grid3X3, List, Clock, Calendar, TrendingUp, Eye, MoreVertical, Share2, Copy, Users, Star, ChevronLeft, ChevronRight, ListFilter, CheckCircle, Dot, X } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';
import { apiRequestJson } from '../utils/api';

interface Video {
  _id: string;
  title: string;
  url: string;
  description: string;
  keywords: string[];
  category: string;
  duration?: string;
  views: string;
  createdAt: string;
  status: string;
  thumbnail?: string;
}

// Enhanced Dummy Data with dynamic content support
const staticVideos = [
  { 
    id: '0P8ftvWlCUQ', 
    title: 'Corporate Showcase 2024: Building Tomorrow', 
    category: 'Corporate', 
    date: '2024-07-10', 
    views: 1200000, 
    uploader: 'AcrossMedia',
    duration: '12:45',
    thumbnail: 'https://i.ytimg.com/vi/0P8ftvWlCUQ/hqdefault.jpg',
    verified: true,
    description: 'An exclusive look into our 2024 corporate initiatives and future vision.'
  },
  { 
    id: '3tmd-ClpJxA', 
    title: 'Brand Story: Innovate Inc. Journey', 
    category: 'Branding', 
    date: '2024-06-22', 
    views: 850000, 
    uploader: 'ClientFilms',
    duration: '8:32',
    thumbnail: 'https://i.ytimg.com/vi/3tmd-ClpJxA/hqdefault.jpg',
    verified: true,
    description: 'Behind the scenes of our innovative branding approach.'
  },
  { 
    id: 'N5vJ1XN72e4', 
    title: 'Celebrity Endorsement: The Future of Entertainment', 
    category: 'Celebrity', 
    date: '2024-05-15', 
    views: 2300000, 
    uploader: 'StarPower',
    duration: '15:20',
    thumbnail: 'https://i.ytimg.com/vi/N5vJ1XN72e4/hqdefault.jpg',
    verified: true,
    description: 'Exclusive celebrity partnerships that shaped the industry.'
  },
  { 
    id: '7k_sE1-u2cs', 
    title: 'Product Launch: The Quantum Leap Revolution', 
    category: 'Corporate', 
    date: '2024-04-30', 
    views: 980000, 
    uploader: 'AcrossMedia',
    duration: '10:15',
    thumbnail: 'https://i.ytimg.com/vi/7k_sE1-u2cs/hqdefault.jpg',
    verified: true,
    description: 'Revolutionary product launch that changed everything.'
  },
  { 
    id: 'O_9V_d_I7ls', 
    title: 'Behind the Scenes: Creative Ad Campaign Process', 
    category: 'Branding', 
    date: '2024-03-18', 
    views: 560000, 
    uploader: 'ClientFilms',
    duration: '6:47',
    thumbnail: 'https://i.ytimg.com/vi/O_9V_d_I7ls/hqdefault.jpg',
    verified: false,
    description: 'Creative process behind our award-winning campaigns.'
  },
  { 
    id: 'dQw4w9WgXcQ', 
    title: 'A Musical Journey with Global Stars', 
    category: 'Celebrity', 
    date: '2024-02-29', 
    views: 3100000, 
    uploader: 'StarPower',
    duration: '11:33',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    verified: true,
    description: 'Musical collaborations with international celebrities.'
  },
  { 
    id: 'h_L4Rixya64', 
    title: 'Annual Summit Highlights: Industry Leaders Speak', 
    category: 'Corporate', 
    date: '2024-01-20', 
    views: 720000, 
    uploader: 'AcrossMedia',
    duration: '45:12',
    thumbnail: 'https://i.ytimg.com/vi/h_L4Rixya64/hqdefault.jpg',
    verified: true,
    description: 'Key highlights from our annual industry summit.'
  },
  { 
    id: 'M7lc1UVf-VE', 
    title: 'The Art of Visual Storytelling Masterclass', 
    category: 'Branding', 
    date: '2023-12-11', 
    views: 1500000, 
    uploader: 'ClientFilms',
    duration: '28:45',
    thumbnail: 'https://i.ytimg.com/vi/M7lc1UVf-VE/hqdefault.jpg',
    verified: true,
    description: 'Masterclass on creating compelling visual narratives.'
  },
  { 
    id: 'another-video-1', 
    title: 'Marketing Success Stories: Real Results', 
    category: 'Branding', 
    date: '2023-11-05', 
    views: 450000, 
    uploader: 'ClientFilms',
    duration: '14:28',
    thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=480',
    verified: false,
    description: 'Real-world marketing success stories and case studies.'
  },
  { 
    id: 'another-video-2', 
    title: 'Tech Conference Opening Keynote 2023', 
    category: 'Corporate', 
    date: '2023-10-01', 
    views: 680000, 
    uploader: 'AcrossMedia',
    duration: '32:15',
    thumbnail: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=480',
    verified: true,
    description: 'Opening keynote from our tech conference featuring industry insights.'
  },
];

const categories = ['All', 'Corporate', 'Branding', 'Celebrity'];
const sortOptions = [
  { value: 'newest', label: 'Newest first', icon: Calendar },
  { value: 'oldest', label: 'Oldest first', icon: Clock },
  { value: 'popular', label: 'Most popular', icon: TrendingUp },
  { value: 'views', label: 'Most viewed', icon: Eye }
];

const ITEMS_PER_PAGE = 12;

const VideoSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [openShareMenu, setOpenShareMenu] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [allVideos, setAllVideos] = useState<any[]>(staticVideos);
  const [loading, setLoading] = useState(false);

  // Fetch videos from API on component mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await apiRequestJson('http://localhost:3001/api/videos') as any;
        const apiVideos = Array.isArray(response?.videos) ? response.videos : (Array.isArray(response) ? response : []);
        
        // Convert API videos to display format
        const formattedVideos = apiVideos.map((video: Video) => ({
          id: video._id,
          title: video.title,
          category: video.category,
          date: video.createdAt.split('T')[0],
          views: parseInt(video.views) || 0,
          uploader: 'AcrossMedia',
          duration: video.duration || 'N/A',
          thumbnail: video.thumbnail || `https://img.youtube.com/vi/${extractVideoId(video.url)}/hqdefault.jpg`,
          verified: true,
          description: video.description,
          url: video.url
        }));
        
        // Combine with static videos
        setAllVideos([...formattedVideos, ...staticVideos]);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setAllVideos(staticVideos);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const extractVideoId = (url: string) => {
    const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : '';
  };

  const filteredAndSortedVideos = useMemo(() => {
    let videos = allVideos.filter(video => {
      const matchesCategory = activeCategory === 'All' || video.category === activeCategory;
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (video.uploader && video.uploader.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    videos.sort((a, b) => {
      switch (sortOrder) {
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'popular':
        case 'views':
          return b.views - a.views;
        default: // newest
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return videos;
  }, [searchTerm, activeCategory, sortOrder, allVideos]);

  const paginatedVideos = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedVideos.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedVideos, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedVideos.length / ITEMS_PER_PAGE);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory, sortOrder]);

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Header */}
        <div className="pt-20 pb-8 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-6 py-3 mb-8">
                <Play className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase">Video Collection</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Our Video
                </span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                  Portfolio
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
                Discover our curated collection of branded content, celebrity engagements, and corporate films 
                that have transformed brands and captivated audiences worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="w-full bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4 flex items-center justify-between hover:border-cyan-500/50 transition-all duration-300"
              >
                <span className="text-white font-medium">Filters & Search</span>
                <Filter className="w-5 h-5 text-cyan-400" />
              </button>
            </div>

            {/* Sidebar */}
            <aside className={`lg:block w-full lg:w-80 lg:flex-shrink-0 ${isSidebarOpen ? 'block' : 'hidden'}`}>
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Mobile Close Button */}
                <div className="lg:hidden flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">Filters & Search</h2>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                {/* Search */}
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-pink-600 rounded-2xl blur opacity-20"></div>
                  <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search videos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-white placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-pink-600 rounded-2xl blur opacity-20"></div>
                  <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                      <Filter className="w-5 h-5 text-cyan-400" />
                      Categories
                    </h3>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <button 
                          key={category}
                          onClick={() => setActiveCategory(category)}
                          className={`group w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex justify-between items-center ${
                            activeCategory === category 
                            ? 'bg-gradient-to-r from-cyan-500/20 to-pink-500/20 text-white border border-cyan-500/30' 
                            : 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
                          }`}>
                          <span className="font-medium">{category}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            activeCategory === category 
                            ? 'bg-cyan-500/30 text-cyan-300' 
                            : 'bg-gray-700 text-gray-400 group-hover:bg-gray-600'
                          }`}>
                            {category === 'All' ? allVideos.length : allVideos.filter(v => v.category === category).length}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sort Options */}
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-pink-600 rounded-2xl blur opacity-20"></div>
                  <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                      <List className="w-5 h-5 text-cyan-400" />
                      Sort by
                    </h3>
                    <div className="space-y-2">
                      {sortOptions.map(option => (
                        <button 
                          key={option.value}
                          onClick={() => setSortOrder(option.value)}
                          className={`group w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 ${
                            sortOrder === option.value 
                            ? 'bg-gradient-to-r from-cyan-500/20 to-pink-500/20 text-white border border-cyan-500/30' 
                            : 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
                          }`}>
                          <option.icon className={`w-4 h-4 ${
                            sortOrder === option.value ? 'text-cyan-400' : 'text-gray-400 group-hover:text-white'
                          }`} />
                          <span className="font-medium">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Video Grid */}
            <main className="flex-1">
              {/* Mobile Search */}
              <div className="lg:hidden mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search videos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-white placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Results Count */}
              <div className="mb-8 flex items-center justify-between">
                <p className="text-gray-400">
                  {loading ? 'Loading videos...' : `Showing ${filteredAndSortedVideos.length} video${filteredAndSortedVideos.length !== 1 ? 's' : ''}`}
                  {activeCategory !== 'All' && ` in ${activeCategory}`}
                </p>
                
                {/* Mobile Filters */}
                <div className="lg:hidden flex gap-2">
                  <select 
                    value={activeCategory} 
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <select 
                    value={sortOrder} 
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                  >
                    {sortOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Video Cards */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-800 rounded-2xl overflow-hidden">
                        <div className="aspect-video bg-gray-700"></div>
                        <div className="p-4 space-y-3">
                          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                  {paginatedVideos.map(video => (
                    <div key={video.id} className="group relative">
                      {/* Glowing effect */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-1000"></div>
                      
                      <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-500 backdrop-blur-sm">
                        {/* Thumbnail */}
                        <div 
                          className="relative aspect-video cursor-pointer overflow-hidden"
                          onClick={() => setSelectedVideo(video.id)}
                        >
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
                            }}
                          />
                          
                          {/* Duration Badge */}
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-mono">
                            {video.duration}
                          </div>
                          
                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
                              <Play size={24} className="text-white ml-1" fill="white" />
                            </div>
                          </div>
                          
                          {/* Category Badge */}
                          <div className="absolute top-3 left-3">
                            <span className="bg-gradient-to-r from-cyan-500 to-pink-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                              {video.category}
                            </span>
                          </div>
                        </div>
                        
                        {/* Video Info */}
                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            {/* Channel Avatar */}
                            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <Users size={16} className="text-white" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              {/* Title */}
                              <h3 
                                className="font-bold text-white text-sm leading-snug mb-1 line-clamp-2 cursor-pointer hover:text-cyan-300 transition-colors group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-cyan-400 group-hover:to-pink-500"
                                onClick={() => setSelectedVideo(video.id)}
                                title={video.title}
                              >
                                {video.title.length > 60 ? `${video.title.substring(0, 60)}...` : video.title}
                              </h3>
                              
                              {/* Channel Info */}
                              <div className="flex items-center gap-1 mb-2">
                                <p className="text-gray-400 text-sm font-medium">{video.uploader}</p>
                                {video.verified && (
                                  <CheckCircle size={14} className="text-cyan-400" />
                                )}
                              </div>
                              
                              {/* Stats */}
                              <div className="flex items-center gap-1 text-gray-400 text-xs">
                                <Eye size={12} />
                                <span>{formatViews(video.views)} views</span>
                                <Dot size={12} />
                                <span>{formatTimeAgo(video.date)}</span>
                              </div>
                            </div>
                            
                            {/* Menu Button */}
                            <div className="relative">
                              <button 
                                onClick={() => setOpenShareMenu(openShareMenu === video.id ? null : video.id)}
                                className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-700/50 transition-colors"
                              >
                                <MoreVertical size={16} />
                              </button>
                              
                              {openShareMenu === video.id && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 py-2 z-10">
                                  <button 
                                    onClick={() => {
                                      navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${video.id}`);
                                      setCopied(true);
                                      setTimeout(() => setCopied(false), 2000);
                                      setOpenShareMenu(null);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors"
                                  >
                                    {copied ? (
                                      <>
                                        <CheckCircle size={16} className="text-green-400" />
                                        <span>Copied!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Share2 size={16} />
                                        <span>Share video</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loading && filteredAndSortedVideos.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">No videos found</h3>
                  <p className="text-gray-400 mb-8">Try adjusting your search terms or filters</p>
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setActiveCategory('All');
                      setSortOrder('newest');
                    }}
                    className="bg-gradient-to-r from-cyan-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                  >
                    Clear filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6">
                  {/* Page Numbers */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="group p-3 rounded-xl bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-gray-700 hover:border-cyan-500/50"
                    >
                      <ChevronLeft size={20} className="text-gray-400 group-hover:text-white" />
                    </button>
                    
                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-12 h-12 rounded-xl font-semibold transition-all duration-300 ${
                              currentPage === pageNum
                                ? 'bg-gradient-to-r from-cyan-500 to-pink-600 text-white shadow-lg shadow-cyan-500/25'
                                : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 hover:border-cyan-500/50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="group p-3 rounded-xl bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-gray-700 hover:border-cyan-500/50"
                    >
                      <ChevronRight size={20} className="text-gray-400 group-hover:text-white" />
                    </button>
                  </div>
                  
                  {/* Page Info */}
                  <div className="text-gray-400 text-sm">
                    Page {currentPage} of {totalPages} • Showing {paginatedVideos.length} of {filteredAndSortedVideos.length} videos
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="relative w-full max-w-6xl aspect-video" onClick={e => e.stopPropagation()}>
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-pink-600 rounded-3xl blur opacity-50"></div>
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&controls=1&rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="relative w-full h-full rounded-2xl shadow-2xl"
            ></iframe>
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-cyan-500 to-pink-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform text-xl font-bold shadow-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoSection;