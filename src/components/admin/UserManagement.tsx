import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, CheckCircle, XCircle, UserCheck, UserX, Trash2, Shield, ShieldCheck, AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiRequestJson } from '../../utils/api';
import { toast } from 'sonner';

interface User {
  _id: string;
  username: string;
  email: string;
  role: 'pending' | 'admin' | 'superadmin' | 'user';
  status?: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  approvedAt?: string;
  blockUntil?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ThemeClasses {
  bg: string;
  cardBg: string;
  text: string;
  textSecondary: string;
  border: string;
  hover: string;
}

const UserManagement = ({ isDarkMode, themeClasses }: { isDarkMode: boolean; themeClasses: ThemeClasses }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: searchTerm,
        role: roleFilter,
        status: statusFilter
      });

      const response = await apiRequestJson<{users: User[], pagination: Pagination}>(
        `http://localhost:3001/api/users?${params}`,
        { credentials: 'include' }
      );
      
      setUsers(response.users);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      await apiRequestJson(`http://localhost:3001/api/users/approve/${userId}`, {
        method: 'POST',
        credentials: 'include'
      });
      
      toast.success('User approved successfully');
      fetchUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to approve user';
      toast.error(message);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await apiRequestJson(`http://localhost:3001/api/users/role/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
        credentials: 'include'
      });
      
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update user role';
      toast.error(message);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await apiRequestJson(`http://localhost:3001/api/users/status/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include'
      });
      
      toast.success('User status updated successfully');
      fetchUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update user status';
      toast.error(message);
    }
  };

  const handleDelete = async (userId: string, username: string) => {
    if (!confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiRequestJson(`http://localhost:3001/api/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete user';
      toast.error(message);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'superadmin':
        return <ShieldCheck size={16} className="text-red-400" />;
      case 'admin':
        return <Shield size={16} className="text-blue-400" />;
      case 'pending':
        return <AlertCircle size={16} className="text-yellow-400" />;
      default:
        return <Users size={16} className="text-gray-400" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'admin':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'suspended':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="animate-spin mr-2" size={20} />
        <span>Loading users...</span>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="text-center p-8 text-red-500">
        <AlertCircle size={48} className="mx-auto mb-4" />
        <p>Error: {error}</p>
        <button 
          onClick={fetchUsers}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${themeClasses.cardBg} rounded-2xl p-6 ${themeClasses.border} border`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>User Management</h1>
            <p className={themeClasses.textSecondary}>Manage user accounts, roles, and permissions</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users size={16} className="text-cyan-400" />
            <span className="text-cyan-400 font-medium">{pagination.total} total users</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`${themeClasses.cardBg} rounded-2xl p-6 ${themeClasses.border} border`}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textSecondary}`} size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by username or email..."
                className={`w-full pl-10 pr-4 py-3 ${themeClasses.cardBg} ${themeClasses.border} border rounded-xl ${themeClasses.text} focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className={`px-4 py-3 ${themeClasses.cardBg} ${themeClasses.border} border rounded-xl ${themeClasses.text} focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
            >
              <option value="all">All Roles</option>
              <option value="pending">Pending</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-4 py-3 ${themeClasses.cardBg} ${themeClasses.border} border rounded-xl ${themeClasses.text} focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>

            <button
              onClick={fetchUsers}
              disabled={loading}
              className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50"
            >
              {loading ? <RefreshCw className="animate-spin" size={16} /> : <Filter size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className={`${themeClasses.cardBg} rounded-2xl overflow-hidden ${themeClasses.border} border`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} border-b ${themeClasses.border}`}>
              <tr>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${themeClasses.text} uppercase tracking-wider`}>
                  User
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${themeClasses.text} uppercase tracking-wider`}>
                  Role
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${themeClasses.text} uppercase tracking-wider`}>
                  Status
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${themeClasses.text} uppercase tracking-wider`}>
                  Joined
                </th>
                <th className={`px-6 py-4 text-right text-xs font-semibold ${themeClasses.text} uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${themeClasses.border}`}>
              {users.map((user) => (
                <tr key={user._id} className={`${themeClasses.hover} transition-colors`}>
                  <td className="px-6 py-4">
                    <div>
                      <div className={`font-medium ${themeClasses.text}`}>{user.username}</div>
                      <div className={`text-sm ${themeClasses.textSecondary}`}>{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      {user.role}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(user.status || 'active')}`}>
                      {user.status || 'active'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm ${themeClasses.textSecondary}`}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {user.role === 'pending' && (
                        <button
                          onClick={() => handleApprove(user._id)}
                          className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                          title="Approve user"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      
                      {user.role !== 'pending' && user.role !== 'superadmin' && (
                        <>
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            className={`px-2 py-1 text-xs ${themeClasses.cardBg} ${themeClasses.border} border rounded ${themeClasses.text}`}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                          
                          <select
                            value={user.status || 'active'}
                            onChange={(e) => handleStatusChange(user._id, e.target.value)}
                            className={`px-2 py-1 text-xs ${themeClasses.cardBg} ${themeClasses.border} border rounded ${themeClasses.text}`}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                          </select>
                        </>
                      )}
                      
                      {user.role !== 'superadmin' && (
                        <button
                          onClick={() => handleDelete(user._id, user.username)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                          title="Delete user"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users size={48} className={`${themeClasses.textSecondary} mx-auto mb-4`} />
            <h3 className={`text-lg font-medium ${themeClasses.text} mb-2`}>No users found</h3>
            <p className={themeClasses.textSecondary}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className={`${themeClasses.cardBg} rounded-2xl p-4 ${themeClasses.border} border`}>
          <div className="flex items-center justify-between">
            <div className={`text-sm ${themeClasses.textSecondary}`}>
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${themeClasses.hover}`}
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const page = Math.max(1, Math.min(pagination.pages - 4, pagination.page - 2)) + i;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      page === pagination.page
                        ? 'bg-gradient-to-r from-cyan-500 to-pink-600 text-white'
                        : themeClasses.hover
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${themeClasses.hover}`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;