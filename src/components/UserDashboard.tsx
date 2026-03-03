import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';

// --- Interfaces ---
interface FetchedBooking {
  _id: string;
  hotel: {
    _id: string;
    name: string;
  };
  checkIn: string;
  checkOut: string;
  bookingStatus: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

interface CustomerInquiry {
  id: string; // Changed from number to string to match MongoDB _id
  subject: string;
  message: string;
  status: 'pending' | 'new' | 'replied' | 'closed';
  createdAt?: string;
}

interface UserProfile {
  username: string;
  email: string;
  bio: string;
  dob: string;
  gender: string;
  mobile: string;
}

const UserDashboard: React.FC = () => {
  const authContext = useContext(AuthContext);
  const { user } = authContext || {};

  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<FetchedBooking[]>([]);
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [newInquiry, setNewInquiry] = useState({ subject: '', message: '' });
  const [editingInquiry, setEditingInquiry] = useState<CustomerInquiry | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (activeTab === 'profile') {
          setUserProfile({
            username: user.username,
            email: user.email,
            bio: 'Lover of tea plantations and pristine beaches.',
            dob: 'Not Provided',
            gender: 'Not Provided',
            mobile: 'Not Provided',
          });
        } else if (activeTab === 'bookingHistory') {
          const response = await axios.get(`http://localhost:5000/api/bookings/user/${user.id}`);
          setBookings(response.data);
        } else if (activeTab === 'inquiries') {
          // later you can fetch from API
          // const res = await axios.get(`/api/inquiries/user/${user.id}`);
          // setInquiries(res.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || `Failed to load ${activeTab}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, user]);

  useEffect(() => {
    if (activeTab === 'inquiries') {
        fetchUserInquiries();
    }
  }, [activeTab]);

  if (!user) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">
          Please log in to view your dashboard.
        </h2>
      </div>
    );
  }

  // --- Handlers ---
  const handleCancelBooking = (id: string) => {
    setBookings(bookings.map(b => (b._id === id ? { ...b, bookingStatus: 'cancelled' } : b)));
    alert(`Booking ${id} has been cancelled.`);
  };

  const handleEditBooking = (id: string) => {
    alert(`Editing booking ${id}.`);
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newInquiry.subject && newInquiry.message && user) {
        try {
            const payload = {
                customer: user.id,
                customerName: user.username,
                subject: newInquiry.subject,
                message: newInquiry.message,
                // assignedTo: '...' // Logic to assign to specific agent can be added here or handled by backend
            };

            const res = await axios.post('http://localhost:5000/api/inquiries', payload);
            
            // Convert to frontend interface format if needed or just use consistent types
            // For simplicity, re-fetching or adding locally 
            const createdInquiry: CustomerInquiry = { 
                id: res.data._id, // Mapping _id to id if interface requires number (need to fix interface)
                // actually interface says number, let's fix interface to string or any
                subject: res.data.subject,
                message: res.data.message,
                status: res.data.status,
                createdAt: res.data.createdAt
            };

            // Re-fetch or append
            // ideally we change interface to match backend
            // setInquiries([...inquiries, createdInquiry]); 
             
            // Better: Re-fetch list
            alert('Your inquiry has been submitted!');
            setNewInquiry({ subject: '', message: '' });
            // re-fetch logic called here if accessible or simply manual update
            fetchUserInquiries();

        } catch (err) {
            console.error("Failed to submit inquiry", err);
            alert("Failed to submit inquiry.");
        }
    }
  };

  const fetchUserInquiries = async () => {
    if(!user) return;
    try {
        const res = await axios.get(`http://localhost:5000/api/inquiries/my?customer=${user.id}`);
        // Transform data if necessary to match CustomerInquiry interface or update interface
        setInquiries(res.data.map((item: any) => ({
            id: item._id,
            subject: item.subject,
            message: item.message,
            status: item.status,
            createdAt: item.createdAt
        })));
    } catch(err) {
        console.error("Error fetching inquiries", err);
    }
  };



  const handleEditInquiry = (inquiry: CustomerInquiry) => {
    setEditingInquiry(inquiry);
    setNewInquiry({ subject: inquiry.subject, message: inquiry.message });
  };

  const handleUpdateInquiry = () => {
    if (editingInquiry) {
      setInquiries(
        inquiries.map(i =>
          i.id === editingInquiry.id
            ? { ...i, subject: newInquiry.subject, message: newInquiry.message }
            : i
        )
      );
      setEditingInquiry(null);
      setNewInquiry({ subject: '', message: '' });
      alert('Your inquiry has been updated.');
    }
  };

  // --- Content Renderer ---
  const renderContent = () => {
    if (loading) return <p className="text-center text-gray-600">Loading...</p>;
    if (error) return <p className="text-center text-red-600">{error}</p>;

    switch (activeTab) {
      case 'profile':
        return (
          userProfile && (
            <div>
              <h3 className="text-2xl font-semibold mb-4">Basic Information</h3>
              <div className="space-y-4">
                <p><strong>Name:</strong> {userProfile.username}</p>
                <p><strong>Email:</strong> {userProfile.email}</p>
                <p><strong>Bio:</strong> {userProfile.bio}</p>
              </div>
            </div>
          )
        );
      case 'bookingHistory':
        return (
          <div>
            <h3 className="text-2xl font-semibold mb-4">Booking History</h3>
            {bookings.length > 0 ? (
              bookings.map(b => (
                <div key={b._id} className="p-4 border rounded-xl mb-2">
                  <p><strong>{b.hotel.name}</strong></p>
                  <p>{new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}</p>
                  <p>Status: {b.bookingStatus}</p>
                  <div className="mt-2 space-x-2">
                    <button onClick={() => handleEditBooking(b._id)} disabled={b.bookingStatus !== 'confirmed'} className="px-3 py-1 bg-gray-200 rounded">Edit</button>
                    <button onClick={() => handleCancelBooking(b._id)} disabled={b.bookingStatus !== 'confirmed'} className="px-3 py-1 bg-red-500 text-white rounded">Cancel</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No bookings yet.</p>
            )}
          </div>
        );
      case 'inquiries':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-4">Customer Support Inquiries</h3>
            <form
              onSubmit={editingInquiry ? (e) => { e.preventDefault(); handleUpdateInquiry(); } : handleSubmitInquiry}
              className="space-y-4 p-4 border rounded-xl bg-gray-50"
            >
              <div>
                <label className="block text-sm font-medium">Subject</label>
                <input
                  type="text"
                  value={newInquiry.subject}
                  onChange={e => setNewInquiry({ ...newInquiry, subject: e.target.value })}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Message</label>
                <textarea
                  value={newInquiry.message}
                  onChange={e => setNewInquiry({ ...newInquiry, message: e.target.value })}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="space-x-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                  {editingInquiry ? 'Update Inquiry' : 'Submit Inquiry'}
                </button>
                {editingInquiry && (
                  <button type="button" onClick={() => { setEditingInquiry(null); setNewInquiry({ subject: '', message: '' }); }} className="px-4 py-2 bg-gray-300 rounded">
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <h4 className="font-semibold text-lg">Your Inquiries</h4>
            {inquiries.length > 0 ? (
              inquiries.map(inq => (
                <div key={inq.id} className="p-4 border rounded-xl bg-white shadow flex justify-between items-center">
                  <div>
                    <p className="font-bold">{inq.subject}</p>
                    <p>{inq.message}</p>
                    <span className={`px-2 py-1 rounded text-xs ${inq.status === 'pending' ? 'bg-yellow-200' : 'bg-green-200'}`}>
                      {inq.status}
                    </span>
                  </div>
                  <button
                    onClick={() => handleEditInquiry(inq)}
                    disabled={inq.status !== 'pending'}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Edit
                  </button>
                </div>
              ))
            ) : (
              <p>No inquiries yet.</p>
            )}
          </div>
        );
      case 'reviews':
        return <p>Reviews coming soon...</p>;
      case 'settings':
        return <p>Settings coming soon...</p>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1 bg-white p-6 rounded-xl shadow-lg h-min">
          <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-xl text-center mb-6">
            <h4 className="font-bold">{user.username}</h4>
            <p className="text-sm">{user.email}</p>
          </div>
          <nav className="space-y-2">
            <button onClick={() => setActiveTab('profile')} className={`w-full text-left px-4 py-2 rounded ${activeTab==='profile'?'bg-blue-600 text-white':'bg-gray-100'}`}>Profile</button>
            <button onClick={() => setActiveTab('inquiries')} className={`w-full text-left px-4 py-2 rounded ${activeTab==='inquiries'?'bg-blue-600 text-white':'bg-gray-100'}`}>Customer Inquiries</button>
            <button onClick={() => setActiveTab('bookingHistory')} className={`w-full text-left px-4 py-2 rounded ${activeTab==='bookingHistory'?'bg-blue-600 text-white':'bg-gray-100'}`}>Booking History</button>
            <button onClick={() => setActiveTab('payments')} className={`w-full text-left px-4 py-2 rounded ${activeTab==='payments'?'bg-blue-600 text-white':'bg-gray-100'}`}>Payments</button>
            <button onClick={() => setActiveTab('reviews')} className={`w-full text-left px-4 py-2 rounded ${activeTab==='reviews'?'bg-blue-600 text-white':'bg-gray-100'}`}>Reviews</button>
            <button onClick={() => setActiveTab('settings')} className={`w-full text-left px-4 py-2 rounded ${activeTab==='settings'?'bg-blue-600 text-white':'bg-gray-100'}`}>Settings</button>
          </nav>
        </aside>

        <main className="md:col-span-3 bg-white p-6 rounded-xl shadow-lg">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
