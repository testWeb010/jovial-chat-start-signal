import React, { useState, useMemo } from 'react';
import { Search, Play, ChevronLeft, ChevronRight, ListFilter, MoreVertical, Share2, Copy } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';

// Dummy Data
const allVideos = [
  { id: '0P8ftvWlCUQ', title: 'Corporate Showcase 2024', category: 'Corporate', date: '2024-07-10', views: 1200000, uploader: 'AcrossMedia' },
  { id: '3tmd-ClpJxA', title: 'Brand Story: Innovate Inc.', category: 'Branding', date: '2024-06-22', views: 850000, uploader: 'ClientFilms' },
  { id: 'N5vJ1XN72e4', title: 'Celebrity Endorsement: The Future', category: 'Celebrity', date: '2024-05-15', views: 2300000, uploader: 'StarPower' },
  { id: '7k_sE1-u2cs', title: 'Product Launch: The Quantum Leap', category: 'Corporate', date: '2024-04-30', views: 980000, uploader: 'AcrossMedia' },
  { id: 'O_9V_d_I7ls', title: 'Behind the Scenes: Ad Campaign', category: 'Branding', date: '2024-03-18', views: 560000, uploader: 'ClientFilms' },
  { id: 'dQw4w9WgXcQ', title: 'A Musical Journey with a Star', category: 'Celebrity', date: '2024-02-29', views: 3100000, uploader: 'StarPower' },
  { id: 'h_L4Rixya64', title: 'Annual Summit Highlights', category: 'Corporate', date: '2024-01-20', views: 720000, uploader: 'AcrossMedia' },
  { id: 'M7lc1UVf-VE', title: 'The Art of Visual Storytelling', category: 'Branding', date: '2023-12-11', views: 1500000, uploader: 'ClientFilms' },
  { id: 'another-video-1', title: 'Marketing Success Stories', category: 'Branding', date: '2023-11-05', views: 450000, uploader: 'ClientFilms' },
  { id: 'another-video-2', title: 'Tech Conference Opening', category: 'Corporate', date: '2023-10-01', views: 680000, uploader: 'AcrossMedia' },
];

const categories = ['All', 'Corporate', 'Branding', 'Celebrity'];
const ITEMS_PER_PAGE = 6;

const Videos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openShareMenu, setOpenShareMenu] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredAndSortedVideos = useMemo(() => {
    let videos = allVideos.filter(video => {
      const matchesCategory = activeCategory === 'All' || video.category === activeCategory;
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    videos.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return videos;
  }, [searchTerm, activeCategory, sortOrder]);

  const paginatedVideos = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedVideos.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedVideos, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedVideos.length / ITEMS_PER_PAGE);

  return (
    <div className="text-white">
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
            >
              <ListFilter size={20} />
              <span>{isFilterOpen ? 'Hide' : 'Show'} Filters</span>
            </button>
          </div>

          {/* Sidebar */}
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
                        {category === 'All' ? allVideos.length : allVideos.filter(v => v.category === category).length}
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

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Search Bar */}
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

            {/* Video Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-12">
              {paginatedVideos.map(video => (
                <div key={video.id} className="bg-gray-800/30 p-4 rounded-2xl group transition-all duration-300 hover:bg-gray-800/60 hover:shadow-lg hover:shadow-cyan-500/10">
                  <div 
                    className="relative rounded-xl overflow-hidden cursor-pointer mb-4"
                    onClick={() => setSelectedVideo(video.id)}
                  >
                    <img
                      src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-auto object-cover aspect-video transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Play size={40} className='text-white drop-shadow-lg' />
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className='flex-1'>
                      <h3 
                        className="text-md font-bold text-white leading-snug mb-1 clamp-2-lines cursor-pointer hover:text-cyan-300 transition-colors"
                        onClick={() => setSelectedVideo(video.id)}
                      >
                        {video.title}
                      </h3>
                      <p className='text-sm text-gray-400'>{video.uploader}</p>
                      <p className='text-sm text-gray-400'>
                        {`${(video.views / 1000).toFixed(0)}K views`}
                        <span className='mx-1'>•</span>
                        {formatTimeAgo(video.date)}
                      </p>
                    </div>
                    <div className='relative'>
                      <button onClick={() => setOpenShareMenu(openShareMenu === video.id ? null : video.id)} className='p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-700'>
                        <MoreVertical size={20} />
                      </button>
                      {openShareMenu === video.id && (
                        <div className='absolute top-full right-0 mt-2 w-40 bg-gray-700 rounded-lg shadow-xl z-10'>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${video.id}`);
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
              ))}
            </div>

            {filteredAndSortedVideos.length === 0 && (
              <div className="text-center py-16 col-span-full">
                <p className="text-gray-400 text-lg">No videos found. Try a different search or filter.</p>
              </div>
            )}

            {/* Pagination */}
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
