import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './context/AuthContext'; // Make sure path is correct
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Connect to backend

// ================== Interfaces for our data ==================
interface AgentProfileData {
  username: string;
  email: string;
  agentLicense?: string;
  bio?: string;
  mobile?: string;
}

interface Package {
  _id: string;
  name: string;
  description: string;
  price: number;
}

interface Inquiry {
  _id: string;
  customerName: string;
  subject: string;
  message: string;
  status: 'new' | 'replied' | 'closed';
  createdAt: string;
}



// ================== Main Agent Dashboard Component ==================
const AgentDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const authContext = useContext(AuthContext);
  const { user } = authContext || {};
  
  // Stats state
  const [stats, setStats] = useState({
      totalListings: 0,
      totalBookings: 0,
      pendingRequests: 0,
      totalEarnings: 0
  });

  useEffect(() => {
      if (user?.id) {
          axios.get(`http://localhost:5000/api/bookings/agent-stats/${user.id}`)
              .then(res => setStats(res.data))
              .catch(err => console.error("Error fetching stats:", err));
      }
  }, [user]);

  // If the user isn't logged in, don't render the dashboard
  if (!user) {
    return <div className="p-8 text-center">Please log in to view the agent dashboard.</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col fixed h-full z-10">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Agent Dashboard</h1>
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg border border-gray-200 text-center mb-6">
            <h4 className="font-bold text-md truncate">{user.username}</h4>
            <p className="text-xs text-gray-600 truncate">{user.email}</p>
        </div>
        <nav className="space-y-3">
          <button onClick={() => setActiveSection("profile")} className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeSection === "profile" ? "bg-blue-600 text-white" : "hover:bg-gray-200"}`}>
            Profile
          </button>
          <button onClick={() => setActiveSection("inquiries")} className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeSection === "inquiries" ? "bg-blue-600 text-white" : "hover:bg-gray-200"}`}>
            Manage Inquiries
          </button>
          <button onClick={() => setActiveSection("packages")} className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeSection === "packages" ? "bg-blue-600 text-white" : "hover:bg-gray-200"}`}>
            Manage Packages
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 ml-64">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-blue-500">
                <h3 className="text-gray-500 text-sm font-medium uppercase">Total Listings</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalListings}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-green-500">
                <h3 className="text-gray-500 text-sm font-medium uppercase">Total Bookings</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalBookings}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-yellow-500">
                <h3 className="text-gray-500 text-sm font-medium uppercase">Pending Requests</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.pendingRequests}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-purple-500">
                <h3 className="text-gray-500 text-sm font-medium uppercase">Total Earnings</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">${stats.totalEarnings.toLocaleString()}</p>
            </div>
        </div>

        {activeSection === "profile" && <AgentProfile agent={user} />}
        {activeSection === "inquiries" && <ManageInquiries agentId={user.id} />}
        {activeSection === "packages" && <ManagePackages agentId={user.id} />}
      </main>
    </div>
  );
};

// ================== Child Components ==================

const AgentProfile: React.FC<{ agent: any }> = ({ agent }) => (
  <div className="p-6 bg-white shadow-lg rounded-2xl">
    <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>
    <div className="mb-8 border-b pb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Agent Information</h2>
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-gray-500">Agent Name</p>
          <p className="font-medium text-gray-900">{agent.username}</p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Agent License</p>
          <p className="font-medium text-gray-900">{agent.agentLicense || 'Not Provided'}</p>
        </div>
      </div>
    </div>
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact</h2>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium text-gray-900">{agent.email}</p>
        </div>
        <button className="text-blue-600 hover:underline">Edit</button>
      </div>
    </div>
  </div>
);

const ManageInquiries: React.FC<{ agentId: string }> = ({ agentId }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!agentId) return;

    // Fetch initial inquiries
    const fetchInquiries = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/inquiries/agent/${agentId}`);
        setInquiries(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch inquiries", err);
        setLoading(false);
      }
    };

    fetchInquiries();

    // Listen for new inquiries
    socket.on('new_inquiry', (newInquiry: Inquiry) => {
        // Ideally checking if assigned to this agent, but for now showing all relevant
        setInquiries(prev => [newInquiry, ...prev]);
        // Optional: Show notification toast
        alert(`New Inquiry from ${newInquiry.customerName}: ${newInquiry.subject}`);
    });

    return () => {
        socket.off('new_inquiry');
    };
  }, [agentId]);

  const handleReply = async (id: string) => {
      // Logic to reply (e.g., open modal)
      // For now just update status locally or call API
      alert(`Reply functionality for inquiry ${id} coming soon!`);
  };

  if (loading) return <div>Loading inquiries...</div>;

  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Manage Customer Inquiries
      </h1>
      <div className="space-y-4">
        {inquiries.length === 0 ? (
            <p>No inquiries found.</p>
        ) : (
            inquiries.map((inq) => (
                <div key={inq._id} className="p-4 border rounded-lg shadow-sm">
                  <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-lg">{inq.customerName}</p>
                        <p className="text-sm text-gray-400 mb-1">{new Date(inq.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${inq.status === 'new' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {inq.status}
                      </span>
                  </div>
                  <p className="font-semibold text-gray-700 mt-2">{inq.subject}</p>
                  <p className="text-sm text-gray-500 mt-1">{inq.message}</p>
                  <button 
                    onClick={() => handleReply(inq._id)}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Reply
                  </button>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

const ManagePackages: React.FC<{ agentId: string }> = ({ agentId }) => {
  // State for the form can be added here
  const handleSavePackage = (e: React.FormEvent) => {
      e.preventDefault();
      // Logic to POST form data to /api/packages
      alert('Saving package...');
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create & Modify Packages</h1>
      <form onSubmit={handleSavePackage} className="space-y-4">
        {/* Form fields (name, description, price) */}
        <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Save Package</button>
      </form>
    </div>
  );
};

export default AgentDashboard;