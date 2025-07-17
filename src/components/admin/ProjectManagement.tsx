import React, { useState, useEffect } from 'react';
import { Plus, Image, Edit, Trash2, Eye, Search, Upload, Calendar, Tag, ZoomIn, X } from 'lucide-react';
import { apiRequestJson } from '../../utils/api';

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  status: string;
  keywords: string[];
  client: string;
  createdAt: string;
}

interface ThemeClasses {
  bg: string;
  cardBg: string;
  text: string;
  textSecondary: string;
  border: string;
  hover: string;
}

const ProjectManagement = ({ isDarkMode, themeClasses }: { isDarkMode: boolean; themeClasses: ThemeClasses }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null as File | null,
    imagePreview: '',
    category: 'Branded Content',
    status: 'ongoing',
    keywords: '',
    client: '',
    createdAt: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await apiRequestJson('http://localhost:3001/api/projects');
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch projects error:', err);
      setProjects([]);
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: file,
          imagePreview: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const method = editingProject ? 'PUT' : 'POST';
      const url = editingProject ? `${apiBaseUrl}/api/projects/${editingProject._id}` : `${apiBaseUrl}/api/projects`;
      const response = await apiRequestJson(url, {
        method,
        body: JSON.stringify({
          ...formData,
          keywords: formData.keywords.split(',').map(k => k.trim()),
          image: formData.imagePreview || "https://images.pexels.com/photos/3184300/pexels-photo-3184300.jpeg?auto=compress&cs=tinysrgb&w=800",
          createdAt: editingProject ? editingProject.createdAt : new Date().toISOString().split('T')[0]
        }),
      }) as Project;
      if (editingProject) {
        setProjects(projects.map(p => p._id === editingProject._id ? response : p));
      } else {
        setProjects([...projects, response]);
      }
      setFormData({
        title: '',
        description: '',
        image: null,
        imagePreview: '',
        category: 'Branded Content',
        status: 'ongoing',
        keywords: '',
        client: '',
        createdAt: ''
      });
      setEditingProject(null);
      setShowAddForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      image: null,
      imagePreview: project.image,
      category: project.category,
      status: project.status,
      keywords: project.keywords.join(', '),
      client: project.client,
      createdAt: project.createdAt
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      await apiRequestJson(`${apiBaseUrl}/api/projects/${id}`, { method: 'DELETE' });
      setProjects(projects.filter(project => project._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    }
  };

  const filteredProjects = Array.isArray(projects) ? projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) : [];

  const categories = ['Branded Content', 'Celebrity Engagement', 'Sponsorships', 'Intellectual Properties'];

  if (loading) return <div className="text-center p-8">Loading projects...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${themeClasses.cardBg} rounded-2xl p-6 ${themeClasses.border} border`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>Project Management</h1>
            <p className={themeClasses.textSecondary}>Manage your project images and content</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
          >
            <Plus size={20} />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Add Project Form */}
      {showAddForm && (
        <div className={`${themeClasses.cardBg} rounded-2xl p-6 ${themeClasses.border} border`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold ${themeClasses.text}`}>{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
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
                <label className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>Project Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className={`w-full px-4 py-3 ${themeClasses.cardBg} ${themeClasses.border} border rounded-xl ${themeClasses.text} focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
                  placeholder="Enter project title"
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>Client</label>
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                  className={`w-full px-4 py-3 ${themeClasses.cardBg} ${themeClasses.border} border rounded-xl ${themeClasses.text} focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
                  placeholder="Enter client name"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
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
              
              <div>
                <label className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className={`w-full px-4 py-3 ${themeClasses.cardBg} ${themeClasses.border} border rounded-xl ${themeClasses.text} focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
                >
                  <option value="completed">Completed</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>Project Image</label>
              <div className={`border-2 border-dashed ${themeClasses.border} rounded-xl p-8 text-center`}>
                {formData.imagePreview ? (
                  <div className="relative">
                    <img src={formData.imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, image: null, imagePreview: ''})}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors border border-white/20"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload size={48} className={`${themeClasses.textSecondary} mx-auto mb-4`} />
                    <p className={`${themeClasses.text} mb-2`}>Upload project image</p>
                    <p className={`text-sm ${themeClasses.textSecondary} mb-4`}>PNG, JPG, GIF up to 10MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-pink-600 text-white rounded-lg cursor-pointer hover:shadow-lg transition-all"
                    >
                      <Upload size={16} />
                      Choose File
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-semibold ${themeClasses.text} mb-2`}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className={`w-full px-4 py-3 ${themeClasses.cardBg} ${themeClasses.border} border rounded-xl ${themeClasses.text} focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none`}
                placeholder="Enter project description"
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
                <Image size={20} />
                <span>{editingProject ? 'Save Changes' : 'Add Project'}</span>
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
                placeholder="Search projects..."
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

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project._id} className="group relative">
            <div className={`absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-1000`}></div>
            
            <div className={`relative ${themeClasses.cardBg} rounded-2xl overflow-hidden ${themeClasses.border} border hover:border-gray-600 transition-all duration-300`}>
              <div className="relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleEdit(project)}
                      className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20"
                    >
                      <Edit size={20} className="text-white" />
                    </button>
                    <button 
                      onClick={() => handleDelete(project._id)}
                      className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20"
                    >
                      <Trash2 size={20} className="text-red-400" />
                    </button>
                  </div>
                </div>
                
                {/* Status badge */}
                <div className="absolute top-3 right-3">
                  <div className={`bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1 rounded-full`}>
                    <span className="text-white text-xs font-semibold capitalize">{project.status}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className={`text-lg font-bold ${themeClasses.text} mb-2 line-clamp-2`}>
                  {project.title}
                </h3>
                
                <p className="text-sm text-cyan-400 mb-2 font-medium">{project.client}</p>
                
                <p className={`${themeClasses.textSecondary} text-sm mb-4 line-clamp-2`}>
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.keywords.slice(0, 3).map((keyword, index) => (
                    <span key={index} className={`px-2 py-1 ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'} text-xs rounded-md`}>
                      {keyword}
                    </span>
                  ))}
                  {project.keywords.length > 3 && (
                    <span className={`px-2 py-1 ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'} text-xs rounded-md`}>
                      +{project.keywords.length - 3}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={14} className={themeClasses.textSecondary} />
                    <span className={themeClasses.textSecondary}>{project.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className={`${themeClasses.cardBg} rounded-2xl p-12 ${themeClasses.border} border text-center`}>
          <Image size={48} className={`${themeClasses.textSecondary} mx-auto mb-4`} />
          <h3 className={`text-xl font-bold ${themeClasses.text} mb-2`}>No projects found</h3>
          <p className={themeClasses.textSecondary}>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;