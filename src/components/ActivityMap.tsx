import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LocationDetails from './LocationDetails'; 

// Fix Leaflet default marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const SelectedIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'selected-marker',
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
  id: number;
  name: string;
  position: [number, number];
  description: string;
  imageUrl: string;
}

const locations: Location[] = [
  { id: 1, name: 'Sigiriya', position: [7.957, 80.76], description: 'Ancient rock fortress', imageUrl: 'https://th.bing.com/th/id/R.dade39779e7549015f83af8f8782e6e8?rik=IHFleItx%2by2chw&riu=http%3a%2f%2fwww.pearlceylon.com%2fimages%2fdestination%2fsigiriya%2fsigiriya-by-air.jpg&ehk=qBvBwGXJvH%2fks4lehtxalJjDvmSDg8BAUkxTRWpI%2bWo%3d&risl=&pid=ImgRaw&r=0' },
  { id: 2, name: 'Kandy', position: [7.2906, 80.6337], description: 'Temple of the Tooth', imageUrl: 'https://tse3.mm.bing.net/th/id/OIP.PKScifEaFHhGCmxtbWS0LwHaEh?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
  { id: 3, name: 'Galle', position: [6.0535, 80.221], description: 'Historic fort', imageUrl: 'https://img.freepik.com/premium-photo/historic-gall-fort-lighthouse-sri-lanka_114775-301.jpg' },
  { id: 4, name: 'Ella', position: [6.8667, 81.0466], description: 'Scenic hill country', imageUrl: 'https://th.bing.com/th/id/R.2739a468157fcd0437e7e51ff5b82536?rik=FAWsga0o4sEtmg&pid=ImgRaw&r=0' },
  { id: 5, name: 'Yala National Park', position: [6.3754, 81.5105], description: 'Wildlife safari', imageUrl: 'https://tse4.mm.bing.net/th/id/OIF.bxLoS6ZFPT7bKjRHpE5yKA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
  { id: 6, name: 'Mirissa', position: [5.9485, 80.4718], description: 'Whale watching beach', imageUrl: 'https://tse1.mm.bing.net/th/id/OIP.0AazyGzjGTTkZKnyK9uYDwHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
  { id: 7, name: 'Anuradhapura', position: [8.3114, 80.4037], description: 'Ancient city', imageUrl: 'https://th.bing.com/th?id=OIF.iJxEdz%2b2%2fkuZKWh%2f4s0TVQ&r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
  { id: 8, name: 'Polonnaruwa', position: [7.9403, 81.0188], description: 'Medieval ruins', imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.j-huh8-6odxo4CTx_z-KIAHaC6?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
  { id: 9, name: 'Nuwara Eliya', position: [6.9497, 80.7891], description: 'Tea plantations', imageUrl: 'https://tse3.mm.bing.net/th/id/OIP.m5mB5RBSwlOSX4wpza8tVwHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
  { id: 10, name: 'Unawatuna', position: [6.0097, 80.2484], description: 'Tropical beach', imageUrl: 'https://tse1.mm.bing.net/th/id/OIP.GHwNml05pvLpUu_kF_VAXQHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
  { id: 11, name: 'Arugam Bay', position: [6.839, 81.83], description: 'Famous surf beach', imageUrl: 'https://tse1.mm.bing.net/th/id/OIP.A61eTdWylV98nIm7kML9rAHaDF?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
  { id: 12, name: 'Trincomalee', position: [8.5711, 81.2335], description: 'Beautiful beaches and Koneswaram Temple', imageUrl: 'https://tse1.mm.bing.net/th/id/OIP.ekmOwl33Wy-PJyUoFfcsegHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
  { id: 13, name: 'Bentota', position: [6.4214, 80.0048], description: 'Luxury beach resort town', imageUrl: 'https://th.bing.com/th/id/R.fb5b4273556f6dec851c97333228cfb0?rik=kt0nqu3QBNNT%2fQ&pid=ImgRaw&r=0' },
  { id: 14, name: 'Jaffna', position: [9.6685, 80.0074], description: 'Cultural capital of the north', imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.MHIr1qBBMbcd56PBYp2HgAHaEU?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
  { id: 15, name: 'Horton Plains', position: [6.8021, 80.7998], description: 'National park with World’s End cliff', imageUrl: 'https://tse1.mm.bing.net/th/id/OIP.To7QP_xgdIrRfkllS_MxhgHaEc?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
  { id: 16, name: 'Adam’s Peak (Sri Pada)', position: [6.8096, 80.4994], description: 'Sacred pilgrimage mountain', imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.NBsH5hLmfkQ0vpYKTA39VQHaDc?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
  { id: 17, name: 'Udawalawe National Park', position: [6.4753, 80.8881], description: 'Elephant safari destination', imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.-K9IT6Zz7iMxLcefT9stjAHaE5?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
  { id: 18, name: 'Kalpitiya', position: [8.232, 79.759], description: 'Kite surfing and dolphin watching', imageUrl: 'https://th.bing.com/th/id/R.32ff9220281fefdb142961198980ec0e?rik=bRYh5RbQQ7siDQ&pid=ImgRaw&r=0' },
  { id: 19, name: 'Dambulla Cave Temple', position: [7.856, 80.649], description: 'UNESCO cave temple complex', imageUrl: 'https://tse2.mm.bing.net/th/id/OIP.dyzrizJgepaW0fpd6n_dvQHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
  { id: 20, name: 'Colombo', position: [6.9271, 79.8612], description: 'Commercial capital city', imageUrl: 'https://www.andbeyond.com/wp-content/uploads/sites/5/colombo-sri-lanka.jpg' }
  
];

const MapUpdater: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom = 10 }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const ActivityMap: React.FC = () => {
  const [search, setSearch] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([7.8731, 80.7718]);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  
  // The state to control the new LocationDetails component
  const [showLocationDetails, setShowLocationDetails] = useState(false);

  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = () => {
    setError(null);
    const matchedLocation = locations.find((loc) =>
      loc.name.toLowerCase().includes(search.toLowerCase())
    );
    if (matchedLocation) {
      setSelectedLocation(matchedLocation);
      setMapCenter(matchedLocation.position);
    } else {
      setError('No matching location found. Try "Sigiriya", "Kandy", or "Hikkaduwa".');
      setSelectedLocation(null);
    }
  };

  const handleGeolocation = () => {
    setError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
          setSelectedLocation(null);
        },
        (err) => {
          setError('Unable to fetch location. Please enable location services or try again.');
          console.error(err);
        },
        { timeout: 10000 }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const openLocationDetails = (loc: Location) => {
    setSelectedLocation(loc);
    setShowLocationDetails(true);
  };

  const closeLocationDetails = () => {
    setShowLocationDetails(false);
    setSelectedLocation(null);
  };

  return (
    <section className="map-section py-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center tracking-tight">
          Explore 100 Sri Lankan Destinations
        </h2>
        <div className="flex flex-col sm:flex-row justify-center items-center mb-8 gap-4 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search destinations (e.g., Sigiriya, Kandy, Hikkaduwa)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full sm:w-3/5 border-gray-300 rounded-full p-3 shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-300"
          />
          <button
            onClick={handleSearch}
            className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Search
          </button>
          <button
            onClick={handleGeolocation}
            className="w-full sm:w-auto bg-gray-200 text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-gray-300 transition-all duration-300 shadow-md"
          >
            My Location
          </button>
        </div>
        {error && (
          <p className="text-center text-red-500 mb-4">{error}</p>
        )}
        <div className="map-container bg-white rounded-xl shadow-lg overflow-hidden">
          <MapContainer
            center={mapCenter}
            zoom={8}
            style={{ height: '600px', width: '100%' }}
            className="leaflet-map"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {filteredLocations.map((loc) => (
              <Marker
                key={loc.id}
                position={loc.position}
                icon={loc === selectedLocation ? SelectedIcon : DefaultIcon}
              >
                <Popup>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900">{loc.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{loc.description}</p>
                    <button
                      onClick={() => openLocationDetails(loc)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Location
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
            {userLocation && !selectedLocation && (
              <Marker position={userLocation} icon={SelectedIcon}>
                <Popup>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900">Your Location</h3>
                    <p className="text-gray-600 text-sm">You are here!</p>
                  </div>
                </Popup>
              </Marker>
            )}
            <MapUpdater center={mapCenter} zoom={selectedLocation ? 12 : 10} />
          </MapContainer>
        </div>
      </div>
      {showLocationDetails && selectedLocation && (
        <LocationDetails location={selectedLocation} onClose={closeLocationDetails} />
      )}
    </section>
  );
};

export default ActivityMap;