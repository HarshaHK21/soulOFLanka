import React from 'react';
import HotelSection from './HotelSection';

interface Location {
  id: number;
  name: string;
  position: [number, number];
  description: string;
  imageUrl: string;
}

interface LocationDetailsProps {
  location: Location;
  onClose: () => void;
}

const LocationDetails: React.FC<LocationDetailsProps> = ({ location, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 relative shadow-xl z-[10000] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-[10001] pb-2">
          <h3 className="text-2xl font-bold text-gray-900">{location.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-3xl font-light"
          >
            ✕
          </button>
        </div>
        <img
          src={location.imageUrl}
          alt={location.name}
          className="w-full h-64 object-cover rounded-lg mb-4"
          onError={(e) =>
            (e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found')
          }
        />
        <p className="text-gray-700 text-lg mb-8">{location.description}</p>
        
        {/* Render the HotelSection and pass the location name for filtering */}
        <h4 className="text-2xl font-bold text-gray-900 mb-4">Hotels in {location.name}</h4>
        <HotelSection initialLocation={location.name} />
      </div>
    </div>
  );
};

export default LocationDetails;