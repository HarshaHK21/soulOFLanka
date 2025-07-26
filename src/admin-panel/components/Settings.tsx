'use client';
import { useState } from 'react';
import { dummySettings } from './data/dummyData'; // Adjusted path
import { UserCircle2, Mail, Shield, Save, Lock, Eye, EyeOff } from 'lucide-react';

interface UserProfile {
  username: string;
  email: string;
  role: string;
}

export default function Settings() {
  const [profile, setProfile] = useState<UserProfile>({
    username: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const validateProfileForm = () => {
    const newErrors: { username?: string; email?: string } = {};
    if (!profile.username.trim()) {
      newErrors.username = 'Username is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!profile.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(profile.email)) {
      newErrors.email = 'Invalid email format';
    }
    return newErrors;
  };

  const validatePasswordForm = () => {
    const newErrors: { currentPassword?: string; newPassword?: string; confirmPassword?: string } = {};
    if (!passwords.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!passwords.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (passwords.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSaveProfile = () => {
    const profileErrors = validateProfileForm();
    setErrors(profileErrors);
    if (Object.keys(profileErrors).length === 0) {
      alert(`Profile updated: ${JSON.stringify(profile)}`);
    }
  };

  const handleSavePassword = () => {
    const passwordErrors = validatePasswordForm();
    setErrors(passwordErrors);
    if (Object.keys(passwordErrors).length === 0) {
      alert('Password updated successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 container max-w-5xl mx-auto">
      <h2 className="text-5xl font-extrabold mb-12 text-gray-900 dark:text-gray-100 tracking-tight">
        Settings
      </h2>

      {/* User Profile Settings */}
      <div className="mb-12 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 hover:shadow-xl transition-all duration-300">
        <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">User Profile</h3>
        <div className="flex flex-col sm:flex-row sm:space-x-6">
          <div className="flex-shrink-0 mb-6 sm:mb-0">
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-blue-500 dark:border-blue-400 hover:scale-105 transition-all duration-200">
              <UserCircle2 className="w-12 h-12 text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">Profile Picture</p>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 font-semibold mb-2">
                <UserCircle2 className="w-5 h-5" />
                <span>Username</span>
              </label>
              <input
                type="text"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                placeholder="Enter username"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>
            <div>
              <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 font-semibold mb-2">
                <Mail className="w-5 h-5" />
                <span>Email</span>
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 font-semibold mb-2">
                <Shield className="w-5 h-5" />
                <span>Role</span>
              </label>
              <select
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
              >
                <option value="admin">Admin</option>
                <option value="vendor">Vendor</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={handleSaveProfile}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-200 transform hover:scale-105"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Profile
          </button>
        </div>
      </div>

      {/* Password Change */}
      <div className="mb-12 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 hover:shadow-xl transition-all duration-300">
        <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Change Password</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="relative">
            <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 font-semibold mb-2">
              <Lock className="w-5 h-5" />
              <span>Current Password</span>
            </label>
            <input
              type={showPasswords.current ? 'text' : 'password'}
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-all"
              placeholder="Enter current password"
            />
            <button
              onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
              className="absolute right-3 top-10 text-gray-500 dark:text-gray-400"
            >
              {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
            )}
          </div>
          <div className="relative">
            <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 font-semibold mb-2">
              <Lock className="w-5 h-5" />
              <span>New Password</span>
            </label>
            <input
              type={showPasswords.new ? 'text' : 'password'}
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-all"
              placeholder="Enter new password"
            />
            <button
              onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
              className="absolute right-3 top-10 text-gray-500 dark:text-gray-400"
            >
              {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>
          <div className="relative">
            <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 font-semibold mb-2">
              <Lock className="w-5 h-5" />
              <span>Confirm New Password</span>
            </label>
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-all"
              placeholder="Confirm new password"
            />
            <button
              onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
              className="absolute right-3 top-10 text-gray-500 dark:text-gray-400"
            >
              {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={handleSavePassword}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-all duration-200 transform hover:scale-105"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Password
          </button>
        </div>
      </div>

      {/* Site-Wide Settings */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:shadow-xl transition-all duration-300">
        <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Site-Wide Settings</h3>
        <p className="text-red-600 dark:text-red-400 mb-6">
          Note: These are dummy values and cannot be modified in this version.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Site Name</h4>
            <p className="text-gray-600 dark:text-gray-400">{dummySettings.siteName}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Admin Contact Email</h4>
            <p className="text-gray-600 dark:text-gray-400">{dummySettings.adminEmail}</p>
          </div>
        </div>
      </div>
    </div>
  );
}