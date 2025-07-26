export const dummyUsers = [
  {
    id: '1',
    username: 'Kasun Silva',
    email: 'kasun@example.com',
    role: 'user',
  },
  {
    id: '2',
    username: 'Nimal Perera',
    email: 'nimal@example.com',
    role: 'vendor',
  },
  {
    id: '3',
    username: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
  },
];

export const dummyContent = [
  {
    id: '1',
    title: 'Sigiriya Rock Fortress',
    type: 'Destination',
    status: 'Published',
  },
  {
    id: '2',
    title: 'Safari Adventure',
    type: 'Activity',
    status: 'Draft',
  },
  {
    id: '3',
    title: 'Cinnamon Grand Hotel',
    type: 'Hotel',
    status: 'Published',
  },
  {
    id: '4',
    title: 'Exploring Sri Lankan Culture',
    type: 'Blog Post',
    status: 'Draft',
  },
];

export const dummyMetrics = {
  monthlyRevenue: 150000,
  weeklyRevenue: 35000,
  totalContent: 48,
  totalBookings: 320,
  totalPurchasingRequests: 45,
  latestUser: { username: 'New User', email: 'new@example.com' },
  latestContent: { title: 'Yala National Park', type: 'Destination' },
  latestBooking: { id: 'B123', user: 'Kasun Silva' },
};

export const dummySettings = {
  siteName: 'Soul of Sri Lanka',
  adminEmail: 'admin@soulofsrilanka.com',
};

export const dummyProducts = [
  {
    id: '1',
    name: 'Ceylon Tea',
    category: 'Beverage',
    price: 2500,
    status: 'Available',
  },
  {
    id: '2',
    name: 'Handwoven Sarong',
    category: 'Clothing',
    price: 4500,
    status: 'Available',
  },
  {
    id: '3',
    name: 'Spice Gift Set',
    category: 'Food',
    price: 3500,
    status: 'Out of Stock',
  },
];

export const dummyHotelServices = [
  {
    id: '1',
    name: 'Spa Treatment',
    hotel: 'Cinnamon Grand',
    price: 10000,
    availability: 'Available',
  },
  {
    id: '2',
    name: 'Airport Shuttle',
    hotel: 'Jetwing Blue',
    price: 5000,
    availability: 'Available',
  },
  {
    id: '3',
    name: 'Guided City Tour',
    hotel: 'Galle Face Hotel',
    price: 7500,
    availability: 'Unavailable',
  },
];