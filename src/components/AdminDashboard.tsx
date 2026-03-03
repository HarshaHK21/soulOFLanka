'use client';
import { useState } from 'react';
import Sidebar from '../admin-panel/components/Sidebar';
import DashboardOverview from '../admin-panel/components/DashboardOverview';
import UserManagement from '../admin-panel/components/UserManagement';
import ContentManagement from '../admin-panel/components/ContentManagement';
import UpdateProducts from '../admin-panel/components/UpdateProducts';
import HotelServices from '../admin-panel/components/HotelServices';
import Settings from '../admin-panel/components/Settings';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <div className="flex min-h-screen">
      <Sidebar setActiveSection={setActiveSection} />
      <div className="flex-1">
        <header className="bg-white dark:bg-gray-800 shadow p-4">
          
        </header>
        <main className="bg-gray-100 dark:bg-gray-900 min-h-[calc(100vh-64px)]">
          {activeSection === 'dashboard' && <DashboardOverview />}
          {activeSection === 'users' && <UserManagement />}
          {activeSection === 'content' && <ContentManagement />}
          {activeSection === 'products' && <UpdateProducts />}
          {activeSection === 'hotel-services' && <HotelServices />}
          {activeSection === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
}

