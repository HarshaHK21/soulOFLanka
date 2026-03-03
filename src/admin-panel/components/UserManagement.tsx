'use client';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../components/context/AuthContext';

// Define User interface to match backend User model
interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'agent' | 'admin';
  agentLicense?: string;
  isVerified: boolean;
  date: string;
}

// Define form data for add/edit
interface UserFormData {
  username: string;
  email: string;
  password?: string;
  role: 'user' | 'agent' | 'admin';
  agentLicense: string;
  isVerified: boolean;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    password: '',
    role: 'user',
    agentLicense: '',
    isVerified: false,
  });
  const [formErrors, setFormErrors] = useState<Partial<UserFormData>>({});
  const authContext = useContext(AuthContext);
  const { token } = authContext!;

  const API_BASE_URL = 'http://localhost:5000/api/users';

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<User[]>(API_BASE_URL, {
        headers: { 'x-auth-token': token },
      });
      setUsers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  // Handle input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Validate form before submit
  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';

    if (!editingUser && (!formData.password || formData.password.length < 6)) {
      newErrors.password = 'Password must be at least 6 characters for new users';
    }

    if (formData.role === 'agent' && !formData.agentLicense?.trim()) {
      newErrors.agentLicense = 'Agent License is required for agents';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add / Edit user
  const handleAddEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError(null);

    const url = editingUser ? `${API_BASE_URL}/${editingUser._id}` : API_BASE_URL;
    const method = editingUser ? 'put' : 'post';

    try {
      await axios[method](url, formData, { headers: { 'x-auth-token': token } });
      fetchUsers();
      closeModal();
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to save user.');
    }
  };

  // Delete user
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setError(null);
      try {
        await axios.delete(`${API_BASE_URL}/${id}`, {
          headers: { 'x-auth-token': token },
        });
        fetchUsers();
      } catch (err: any) {
        setError(err.response?.data?.msg || 'Failed to delete user.');
      }
    }
  };

  // Modal open/close
  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ username: '', email: '', password: '', role: 'user', agentLicense: '', isVerified: false });
    setFormErrors({});
    setShowAddEditModal(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      agentLicense: user.agentLicense || '',
      isVerified: user.isVerified,
      password: '',
    });
    setFormErrors({});
    setShowAddEditModal(true);
  };

  const closeModal = () => {
    setShowAddEditModal(false);
    setEditingUser(null);
    setFormData({ username: '', email: '', password: '', role: 'user', agentLicense: '', isVerified: false });
    setFormErrors({});
  };

  if (loading) return <div className="p-6 text-center text-gray-600">Loading users...</div>;
  if (error) return <div className="p-6 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">User Management</h2>

      <div className="mb-6">
        <button
          onClick={openAddModal}
          className="bg-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
        >
          Add New User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
              <th className="py-3 px-6 text-left">Username</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-left">Verified</th>
              <th className="py-3 px-6 text-left">Agent License</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">No users found.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6">{user.username}</td>
                  <td className="py-3 px-6">{user.email}</td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : user.role === 'agent'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.isVerified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.isVerified ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="py-3 px-6">{user.agentLicense || 'N/A'}</td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => openEditModal(user)}
                      className="text-blue-600 hover:text-blue-800 mr-3 transition duration-150"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:text-red-800 transition duration-150"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showAddEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h3>
            <form onSubmit={handleAddEditSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleFormChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {formErrors.username && <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
              </div>
              {!editingUser && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
                </div>
              )}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="user">User</option>
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {formData.role === 'agent' && (
                <div>
                  <label htmlFor="agentLicense" className="block text-sm font-medium text-gray-700">Agent License</label>
                  <input
                    type="text"
                    id="agentLicense"
                    name="agentLicense"
                    value={formData.agentLicense}
                    onChange={handleFormChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {formErrors.agentLicense && <p className="text-red-500 text-sm mt-1">{formErrors.agentLicense}</p>}
                </div>
              )}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isVerified"
                  name="isVerified"
                  checked={formData.isVerified}
                  onChange={handleFormChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isVerified" className="ml-2 block text-sm text-gray-900">Is Verified?</label>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-sm hover:bg-gray-300 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                >
                  {editingUser ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
