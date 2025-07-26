'use client';
import { LogOut, Settings, User, FileText, BarChart2, Package, Hotel } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  setActiveSection: (section: string) => void;
}

export default function Sidebar({ setActiveSection }: SidebarProps) {
  const [active, setActive] = useState('dashboard');

  const handleSectionChange = (section: string) => {
    setActive(section);
    setActiveSection(section);
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-screen shadow-md">
      <div className="p-4">
        <div className="mb-8 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Soul of Sri Lanka
        </div>
        <nav className="space-y-2">
          <button
            onClick={() => handleSectionChange('dashboard')}
            className={`flex items-center w-full p-2 rounded-lg ${
              active === 'dashboard' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'
            } hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200`}
          >
            <BarChart2 className="mr-2 w-5 h-5" />
            Dashboard
          </button>
          <button
            onClick={() => handleSectionChange('users')}
            className={`flex items-center w-full p-2 rounded-lg ${
              active === 'users' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'
            } hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200`}
          >
            <User className="mr-2 w-5 h-5" />
            User Management
          </button>
          <button
            onClick={() => handleSectionChange('content')}
            className={`flex items-center w-full p-2 rounded-lg ${
              active === 'content' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'
            } hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200`}
          >
            <FileText className="mr-2 w-5 h-5" />
            Content Management
          </button>
          <button
            onClick={() => handleSectionChange('products')}
            className={`flex items-center w-full p-2 rounded-lg ${
              active === 'products' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'
            } hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200`}
          >
            <Package className="mr-2 w-5 h-5" />
            Update Products
          </button>
          <button
            onClick={() => handleSectionChange('hotel-services')}
            className={`flex items-center w-full p-2 rounded-lg ${
              active === 'hotel-services' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'
            } hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200`}
          >
            <Hotel className="mr-2 w-5 h-5" />
            Hotel Services
          </button>
          <button
            onClick={() => handleSectionChange('settings')}
            className={`flex items-center w-full p-2 rounded-lg ${
              active === 'settings' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'
            } hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200`}
          >
            <Settings className="mr-2 w-5 h-5" />
            Settings
          </button>
          <button
            onClick={() => alert('Logged out')}
            className="flex items-center w-full p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition-colors duration-200"
          >
            <LogOut className="mr-2 w-5 h-5" />
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
}