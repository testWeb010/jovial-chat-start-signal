import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, ListFilter, ExternalLink, Play, ArrowUpRight, AlertCircle, Loader } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';
import { apiRequestJson } from '@/utils/api';

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  client: string;
  images: string[];
  status: 'active' | 'draft';
  createdAt: string;
  updatedAt: string;
}

const categories = ['All', 'Branded Content', 'Celebrity Engagement', 'Sponsorships', 'Intellectual Properties'];
const ITEMS_PER_PAGE = 6;

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiRequestJson<{
        projects: Project[];
        pagination: { page: number; limit: number; total: number; totalPages: number };
      }>('/api/projects');
      
      setProjects(response.projects || []);
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
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch && project.status === 'active';
    });

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return filtered;
  }, [projects, searchTerm, activeCategory]);

  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedProjects, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedProjects.length / ITEMS_PER_PAGE);

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
                        {category === 'All' 
                          ? projects.filter(p => p.status === 'active').length 
                          : projects.filter(p => p.category === category && p.status === 'active').length}
                      </span>
                    </button>
                  ))}
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
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
              />
            </div>

            {/* Projects Grid */}
            {!loading && !error && paginatedProjects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {paginatedProjects.map((project) => (
                  <div key={project._id} className="group relative">
                    {/* Glowing border effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-pink-600 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-1000"></div>
                    
                    <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-500">
                      <div className="relative overflow-hidden">
                        <img 
                          src={project.images?.[0] || 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=600&fit=crop'}
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
            )}

            {/* Empty State */}
            {!loading && !error && paginatedProjects.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No projects found</h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm || activeCategory !== 'All' 
                    ? "Try adjusting your search or filter criteria" 
                    : "No projects have been published yet"}
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
    </div>
  );
};

export default Projects;