import React, { useState, useMemo, useEffect } from 'react';
import { Search, Play, ChevronLeft, ChevronRight, ListFilter, MoreVertical, Share2, Copy, AlertCircle, Loader } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';
import { apiRequestJson } from '@/utils/api';
import { fetchYouTubeVideoData, extractVideoId, formatViews } from '@/utils/youtube';

interface Video {
  _id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  thumbnailUrl?: string;
  views: string;
  duration?: string;
  channelTitle?: string;
  status: 'active' | 'draft';
  createdAt: string;
  updatedAt: string;
}

const categories = ['All', 'Corporate', 'Branding', 'Celebrity'];
const ITEMS_PER_PAGE = 6;

const Videos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openShareMenu, setOpenShareMenu] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiRequestJson<{
        videos: Video[];
        pagination: { page: number; limit: number; total: number; totalPages: number };
      }>('/api/videos');
      
      // Enhance videos with YouTube data
      const enhancedVideos = await Promise.all(
        (response.videos || []).map(async (video) => {
          try {
            const youtubeData = await fetchYouTubeVideoData(video.url);
            return {
              ...video,
              title: youtubeData?.title || video.title,
              description: youtubeData?.description || video.description,
              thumbnailUrl: youtubeData?.thumbnail || video.thumbnailUrl,
              views: youtubeData?.views || '0',
              duration: youtubeData?.duration || 'N/A',
              channelTitle: youtubeData?.channelTitle || 'Unknown'
            };
          } catch (error) {
            console.error('Error fetching YouTube data for video:', video._id, error);
            return {
              ...video,
              views: '0',
              duration: 'N/A',
              channelTitle: 'Unknown'
            };
          }
        })
      );
      
      setVideos(enhancedVideos);
    } catch (err) {
      console.error('Failed to fetch videos:', err);
      setError('Failed to load videos. Please try again later.');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const getVideoId = (url: string): string => {
    return extractVideoId(url) || '';
  };

  const filteredAndSortedVideos = useMemo(() => {
    if (!Array.isArray(videos)) return [];
    
    let filtered = videos.filter(video => {
      const matchesCategory = activeCategory === 'All' || video.category === activeCategory;
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           video.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch && video.status === 'active';
    });

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [videos, searchTerm, activeCategory, sortOrder]);

  const paginatedVideos = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedVideos.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedVideos, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedVideos.length / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 bg-clip-text text-transparent pb-4">
            Our Video Portfolio
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our curated collection of branded content, celebrity engagements, and corporate films.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-500/50 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-red-300">{error}</p>
              <button 
                onClick={fetchVideos} 
                className="text-sm text-red-400 hover:text-red-300 underline mt-1"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Mobile Filter Button - Only show if there are videos */}
          {videos.length > 0 && (
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
              >
                <ListFilter size={20} />
                <span>{isFilterOpen ? 'Hide' : 'Show'} Filters</span>
              </button>
            </div>
          )}

          {/* Sidebar - Only show if there are videos */}
          {videos.length > 0 && (
            <aside className={`lg:col-span-1 space-y-8 ${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-2xl">
              <h3 className="text-xl font-bold mb-6">Filters</h3>
              
              {/* Category Filter */}
              <div>
                <h4 className="font-semibold mb-4">Category</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button 
                      key={category}
                      onClick={() => { setActiveCategory(category); setCurrentPage(1); }}
                      className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors flex justify-between items-center ${
                        activeCategory === category 
                        ? 'bg-cyan-500/20 text-cyan-300' 
                        : 'hover:bg-gray-700/50 text-gray-300'
                      }`}>
                      <span>{category}</span>
                      <span className='text-xs bg-gray-700 px-2 py-0.5 rounded-full'>
                        {category === 'All' 
                          ? (Array.isArray(videos) ? videos.filter(v => v.status === 'active').length : 0)
                          : (Array.isArray(videos) ? videos.filter(v => v.category === category && v.status === 'active').length : 0)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className='h-px bg-gray-700 my-6'></div>

              {/* Sort Order */}
              <div>
                <h4 className="font-semibold mb-4">Sort by</h4>
                <div className="flex flex-col space-y-2">
                  <button onClick={() => setSortOrder('newest')} className={`text-left px-4 py-2 rounded-lg text-sm transition-colors ${sortOrder === 'newest' ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-gray-700/50 text-gray-300'}`}>Newest First</button>
                  <button onClick={() => setSortOrder('oldest')} className={`text-left px-4 py-2 rounded-lg text-sm transition-colors ${sortOrder === 'oldest' ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-gray-700/50 text-gray-300'}`}>Oldest First</button>
                </div>
              </div>
            </div>
          </aside>
          )}

          {/* Main Content */}
          <main className={`${videos.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            {/* Search Bar - Only show if there are videos */}
            {videos.length > 0 && (
              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                />
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-12">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-700 rounded-2xl aspect-video mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Video Grid */}
            {!loading && !error && paginatedVideos.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-12">
                {paginatedVideos.map(video => {
                  const videoId = getVideoId(video.url);
                  return (
                    <div key={video._id} className="bg-gray-800/30 p-4 rounded-2xl group transition-all duration-300 hover:bg-gray-800/60 hover:shadow-lg hover:shadow-cyan-500/10">
                      <div 
                        className="relative rounded-xl overflow-hidden cursor-pointer mb-4"
                        onClick={() => setSelectedVideo(videoId)}
                      >
                        <img
                          src={video.thumbnailUrl || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                          alt={video.title}
                          className="w-full h-auto object-cover aspect-video transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Play size={40} className='text-white drop-shadow-lg' />
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className='flex-1'>
                           <h3 
                            className="text-md font-bold text-white leading-snug mb-1 clamp-2-lines cursor-pointer hover:text-cyan-300 transition-colors"
                            onClick={() => setSelectedVideo(videoId)}
                          >
                            {video.title}
                          </h3>
                          <p className='text-xs text-gray-500 mb-1'>{video.channelTitle || 'AcrossMedia'}</p>
                          <p className='text-sm text-gray-400 line-clamp-2 mb-2'>{video.description}</p>
                          <div className='flex items-center gap-2 text-xs text-gray-400'>
                            <span>{video.views} views</span>
                            <span>•</span>
                            <span>{video.duration || 'N/A'}</span>
                            <span>•</span>
                            <span>{formatTimeAgo(video.createdAt)}</span>
                          </div>
                        </div>
                        <div className='relative'>
                          <button onClick={() => setOpenShareMenu(openShareMenu === video._id ? null : video._id)} className='p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-700'>
                            <MoreVertical size={20} />
                          </button>
                          {openShareMenu === video._id && (
                            <div className='absolute top-full right-0 mt-2 w-40 bg-gray-700 rounded-lg shadow-xl z-10'>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(video.url);
                                  setCopied(true);
                                  setTimeout(() => setCopied(false), 2000);
                                  setOpenShareMenu(null);
                                }}
                                className='w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-gray-600 rounded-lg'>
                                {copied ? <><Copy size={16} className='text-green-400' /> Copied!</> : <><Share2 size={16} /> Share</>}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && paginatedVideos.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No videos found</h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm || activeCategory !== 'All' 
                    ? "Try adjusting your search or filter criteria" 
                    : "No videos have been published yet"}
                </p>
                {(searchTerm || activeCategory !== 'All') && (
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setActiveCategory('All');
                      setCurrentPage(1);
                    }}
                    className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {/* Pagination - Only show if there are multiple pages */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-4">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className='p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                >
                  <ChevronLeft size={20} />
                </button>
                <span className='text-gray-300 text-sm'>
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className='p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal for Video Player */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="relative w-full max-w-4xl aspect-video mx-4" onClick={e => e.stopPropagation()}>
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&controls=1&rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-2xl shadow-2xl shadow-cyan-500/50"
            ></iframe>
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform text-2xl font-bold"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;
