import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, Search, X, ChevronLeft, ChevronRight, Calendar, Eye, Heart, ExternalLink, ZoomIn, Award, Users, Handshake, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { apiRequestJson } from '../utils/api';

const ProjectsSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const projectsPerPage = 12;

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await apiRequestJson('http://localhost:3001/api/projects') as any;
        const apiProjects = Array.isArray(response?.projects) ? response.projects : (Array.isArray(response) ? response : []);
        
        // Convert API projects to display format
        const formattedProjects = apiProjects.map((project: any) => ({
          id: project._id,
          title: project.title,
          category: project.category,
          year: new Date(project.createdAt).getFullYear().toString(),
          status: project.status,
          client: project.client || 'AcrossMedia Client',
          views: "2.5M", // Default view count
          likes: "89K", // Default like count
          image: project.image, // Cloudinary URL already optimized
          description: project.description,
          tags: project.keywords || []
        }));
        
        setProjects(formattedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]); // Show empty state instead of static projects
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const categories = ['all', 'Branded Content', 'Celebrity Engagement', 'Sponsorships', 'Intellectual Properties'];
  const years = ['all', '2024', '2023', '2022'];
  const statuses = ['all', 'completed', 'ongoing', 'upcoming'];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Branded Content': return Award;
      case 'Celebrity Engagement': return Users;
      case 'Sponsorships': return Handshake;
      case 'Intellectual Properties': return Lightbulb;
      default: return Award;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'from-green-500 to-emerald-600';
      case 'ongoing': return 'from-yellow-500 to-orange-600';
      case 'upcoming': return 'from-blue-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  // Filter projects based on selected filters and search
  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesYear = selectedYear === 'all' || project.year === selectedYear;
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesYear && matchesStatus && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, startIndex + projectsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedYear, selectedStatus, searchQuery]);

  const FilterSidebar = ({ isMobile = false }) => (
    <div className={`${isMobile ? 'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm' : ''}`}>
      <div className={`${
        isMobile 
          ? 'fixed right-0 top-0 h-full w-80 bg-gray-900 transform transition-transform duration-300 overflow-y-auto' 
          : 'sticky top-24'
      }`}>
        {isMobile && (
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Filters</h3>
            <button 
              onClick={() => setShowMobileFilters(false)}
              className="p-2 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        )}
        
        <div className="p-6 space-y-8">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">Search Projects</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, clients, tags..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">Category</label>
            <div className="space-y-2">
              {categories.map(category => {
                const IconComponent = getCategoryIcon(category);
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-cyan-500 to-pink-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <IconComponent size={16} />
                    <span>{category === 'all' ? 'All Categories' : category}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">Year</label>
            <div className="space-y-2">
              {years.map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                    selectedYear === year
                      ? 'bg-gradient-to-r from-cyan-500 to-pink-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Calendar size={16} />
                  <span>{year === 'all' ? 'All Years' : year}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">Status</label>
            <div className="space-y-2">
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                    selectedStatus === status
                      ? 'bg-gradient-to-r from-cyan-500 to-pink-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getStatusColor(status)}`}></div>
                  <span>{status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedYear('all');
              setSelectedStatus('all');
              setSearchQuery('');
            }}
            className="w-full px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 hover:text-white transition-all"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );

  const ProjectCard = ({ project, isListView = false, index = 0 }) => {
    const IconComponent = getCategoryIcon(project.category);
    
    return (
      <div 
        className={`group relative ${
        isListView 
          ? 'flex gap-6 bg-gray-900 rounded-2xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300' 
          : 'bg-gray-900 rounded-2xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300'
      }`}>
        {/* Glowing effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-1000"></div>
        
        <div className={`relative ${isListView ? 'flex-shrink-0 w-80' : ''}`}>
          <div className={`relative overflow-hidden ${isListView ? 'h-48' : 'aspect-[4/3]'}`}>
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&auto=format&fit=crop&q=80';
              }}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedImage(project)}
                  className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20"
                >
                  <ZoomIn size={20} className="text-white" />
                </button>
                <button className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20">
                  <ExternalLink size={20} className="text-white" />
                </button>
              </div>
            </div>
            
            {/* Category badge */}
            <div className="absolute top-3 left-3">
              <div className="bg-gradient-to-r from-cyan-500 to-pink-600 px-3 py-1 rounded-full flex items-center gap-2">
                <IconComponent size={12} className="text-white" />
                <span className="text-white text-xs font-semibold">{project.category}</span>
              </div>
            </div>
            
            {/* Status badge */}
            <div className="absolute top-3 right-3">
              <div className={`bg-gradient-to-r ${getStatusColor(project.status)} px-3 py-1 rounded-full`}>
                <span className="text-white text-xs font-semibold capitalize">{project.status}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`p-6 ${isListView ? 'flex-1' : ''}`}>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-cyan-400 group-hover:to-pink-500 transition-all duration-300 line-clamp-2" title={project.title}>
            {project.title.length > 50 ? `${project.title.substring(0, 50)}...` : project.title}
          </h3>
          
          <p className="text-sm text-cyan-400 mb-2 font-medium">{project.client}</p>
          
          <p className="text-gray-400 text-sm mb-4 line-clamp-3" title={project.description}>
            {project.description.length > 120 ? `${project.description.substring(0, 120)}...` : project.description}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags && project.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-md truncate max-w-[80px]" title={tag}>
                {tag.length > 10 ? `${tag.substring(0, 10)}...` : tag}
              </span>
            )) || []}
            {project.tags && project.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded-md">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye size={14} />
                <span>{project.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart size={14} />
                <span>{project.likes}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{project.year}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Pagination = () => (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="p-3 rounded-xl bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={20} />
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-4 py-3 rounded-xl font-medium transition-all ${
            currentPage === page
              ? 'bg-gradient-to-r from-cyan-500 to-pink-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="p-3 rounded-xl bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );

  // Image Modal
  const ImageModal = () => {
    if (!selectedImage) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="relative max-w-4xl w-full">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="bg-gray-900 rounded-2xl overflow-hidden">
            <img 
              src={selectedImage.image} 
              alt={selectedImage.title}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h3>
                  <p className="text-cyan-400 font-medium">{selectedImage.client}</p>
                </div>
                <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getStatusColor(selectedImage.status)}`}>
                  <span className="text-white text-sm font-semibold capitalize">{selectedImage.status}</span>
                </div>
              </div>
              
              <p className="text-gray-300 mb-4">{selectedImage.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedImage.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Eye size={16} />
                    <span>{selectedImage.views} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart size={16} />
                    <span>{selectedImage.likes} likes</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{selectedImage.year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="min-h-screen bg-black py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Our Project
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
              Portfolio
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Explore our comprehensive collection of branded content, celebrity collaborations, 
            sponsorships, and original intellectual properties across various industries.
          </p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80">
            <FilterSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <span className="text-gray-400">
                  {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:text-white hover:bg-gray-700 transition-all"
                >
                  <Filter size={16} />
                  <span>Filters</span>
                </button>
                
                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === 'grid' 
                        ? 'bg-gradient-to-r from-cyan-500 to-pink-600 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === 'list' 
                        ? 'bg-gradient-to-r from-cyan-500 to-pink-600 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Projects Grid/List */}
            {currentProjects.length > 0 ? (
              <div className={
                viewMode === 'grid' 
                  ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-8' 
                  : 'space-y-6'
              }>
                {currentProjects.map(project => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    isListView={viewMode === 'list'} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No projects found</h3>
                <p className="text-gray-400 mb-8">Try adjusting your filters or search terms</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedYear('all');
                    setSelectedStatus('all');
                    setSearchQuery('');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-pink-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {currentProjects.length > 0 && totalPages > 1 && <Pagination />}
          </div>
        </div>

        {/* Mobile Filter Sidebar */}
        {showMobileFilters && <FilterSidebar isMobile={true} />}
        
        {/* Image Modal */}
        <ImageModal />
      </div>
    </section>
  );
};

export default ProjectsSection;