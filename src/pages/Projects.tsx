import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight, ListFilter, ExternalLink, Play, ArrowUpRight, AlertCircle, Loader, FolderOpen, Sparkles } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';
import { apiRequestJson } from '@/utils/api';

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  client: string;
  image?: string;
  images?: string[];
  status: 'active' | 'draft' | 'completed' | 'ongoing' | 'upcoming';
  createdAt: string;
  updatedAt?: string;
  keywords?: string[];
}

const categories = ['All', 'Branded Content', 'Celebrity Engagement', 'Sponsorships', 'Intellectual Properties'];
const ITEMS_PER_PAGE = 6;

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [displayedProjects, setDisplayedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastProjectRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiRequestJson('/api/projects');
      
      // Handle both array response and object with projects property
      if (Array.isArray(response)) {
        setProjects(response);
      } else if (response && typeof response === 'object' && 'projects' in response) {
        setProjects((response as any).projects || []);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError('Failed to load projects. Please try again later.');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedProjects = useMemo(() => {
    if (!Array.isArray(projects)) return [];
    
    let filtered = projects.filter(project => {
      const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
      return matchesCategory;
    });

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return filtered;
  }, [projects, activeCategory]);

  // Initialize displayed projects when filtered projects change
  useEffect(() => {
    if (filteredAndSortedProjects.length > 0) {
      const initial = filteredAndSortedProjects.slice(0, ITEMS_PER_PAGE);
      setDisplayedProjects(initial);
      setHasMore(initial.length < filteredAndSortedProjects.length);
    } else {
      setDisplayedProjects([]);
      setHasMore(false);
    }
  }, [filteredAndSortedProjects]);

  // Lazy loading setup
  const loadMoreProjects = useCallback(() => {
    if (displayedProjects.length < filteredAndSortedProjects.length && !loadingMore) {
      setLoadingMore(true);
      setTimeout(() => {
        const nextBatch = filteredAndSortedProjects.slice(0, displayedProjects.length + ITEMS_PER_PAGE);
        setDisplayedProjects(nextBatch);
        setHasMore(nextBatch.length < filteredAndSortedProjects.length);
        setLoadingMore(false);
      }, 500); // Simulate loading time
    }
  }, [displayedProjects.length, filteredAndSortedProjects, loadingMore]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreProjects();
        }
      },
      { threshold: 0.1 }
    );

    if (lastProjectRef.current) {
      observerRef.current.observe(lastProjectRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [hasMore, loadingMore, loadMoreProjects]);

  const EmptyState = () => (
    <div className="text-center py-20">
      {/* Moving card animation */}
      <div className="relative mb-12 overflow-hidden">
        <div className="flex animate-[slide-in-right_4s_ease-in-out_infinite] space-x-8">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-80 h-48 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 p-6 transform hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-pink-600 rounded-full flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-16"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-700 rounded w-4/5"></div>
                <div className="h-3 bg-gray-700 rounded w-3/5"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-6 py-3 mb-8">
          <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase">Coming Soon</span>
        </div>
        
        <h3 className="text-4xl lg:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            No Projects Found
          </span>
        </h3>
        
        <p className="text-xl text-gray-400 leading-relaxed mb-8">
          We're preparing our showcase of extraordinary projects and innovative media solutions. 
          Our portfolio of groundbreaking campaigns and strategic partnerships will be available soon.
        </p>

        <div className="flex justify-center gap-4">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-cyan-400" />
          <p className="text-lg text-gray-300">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 bg-clip-text text-transparent pb-4">
            Our Project Portfolio
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Discover our innovative projects and creative solutions that have transformed brands worldwide.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-500/50 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-red-300">{error}</p>
              <button 
                onClick={fetchProjects} 
                className="text-sm text-red-400 hover:text-red-300 underline mt-1"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        <div className={`grid grid-cols-1 ${projects.length > 10 ? 'lg:grid-cols-4' : 'lg:grid-cols-1'} gap-8`}>
          {/* Mobile Filter Button - Only show if there are more than 10 projects */}
          {projects.length > 10 && (
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

          {/* Sidebar - Only show if there are more than 10 projects */}
          {projects.length > 10 && (
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
                        onClick={() => setActiveCategory(category)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors flex justify-between items-center ${
                          activeCategory === category 
                          ? 'bg-cyan-500/20 text-cyan-300' 
                          : 'hover:bg-gray-700/50 text-gray-300'
                        }`}>
                        <span>{category}</span>
                         <span className='text-xs bg-gray-700 px-2 py-0.5 rounded-full'>
                           {category === 'All' 
                             ? projects.length 
                             : projects.filter(p => p.category === category).length}
                         </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main className={projects.length > 10 ? "lg:col-span-3" : "lg:col-span-1"}>
            {/* Disabled Search Bar - Hidden when no projects */}
            {projects.length > 0 && (
              <div className="relative mb-8 opacity-50 pointer-events-none">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search disabled - projects loading..."
                  disabled
                  className="w-full bg-gray-800/30 border border-gray-700/50 rounded-xl py-3 pl-12 pr-4 outline-none transition cursor-not-allowed"
                />
              </div>
            )}

            {/* Projects Grid */}
            {!loading && !error && displayedProjects.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                  {displayedProjects.map((project, index) => (
                    <div 
                      key={project._id} 
                      className="group relative"
                      ref={index === displayedProjects.length - 1 ? lastProjectRef : null}
                    >
                      {/* Glowing border effect */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-pink-600 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-1000"></div>
                      
                      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-500">
                        <div className="relative overflow-hidden">
                           <img 
                             src={project.image || project.images?.[0] || 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=600&fit=crop'}
                             alt={project.title}
                             className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                             onError={(e) => {
                               e.currentTarget.src = 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=600&fit=crop';
                             }}
                           />
                          
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                              <div className="flex gap-3">
                                <button className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20">
                                  <Play size={20} className="text-white" />
                                </button>
                                <button className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20">
                                  <ExternalLink size={20} className="text-white" />
                                </button>
                              </div>
                              <ArrowUpRight className="w-6 h-6 text-white/80" />
                            </div>
                          </div>
                          
                          {/* Category badge */}
                          <div className="absolute top-4 left-4">
                            <div className="bg-gradient-to-r from-cyan-500 to-pink-600 px-3 py-1 rounded-full">
                              <span className="text-white text-xs font-semibold">{project.category}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-cyan-400 group-hover:to-pink-500 transition-all duration-300">
                            {project.title}
                          </h3>
                          <p className="text-sm text-gray-400 mb-2">Client: {project.client}</p>
                          <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors line-clamp-3">
                            {project.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-3">
                            {formatTimeAgo(project.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Lazy Loading Indicator */}
                {loadingMore && (
                  <div className="text-center py-8">
                    <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-cyan-400" />
                    <p className="text-gray-400">Loading more projects...</p>
                  </div>
                )}

                {/* End of results indicator */}
                {!hasMore && displayedProjects.length > ITEMS_PER_PAGE && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">You've reached the end of our projects!</p>
                  </div>
                )}
              </>
            )}

            {/* Beautiful Empty State */}
            {!loading && !error && displayedProjects.length === 0 && (
              <EmptyState />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Projects;