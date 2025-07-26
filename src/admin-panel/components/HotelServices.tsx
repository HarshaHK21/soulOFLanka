import { useState } from 'react';
import { dummyHotelServices } from './data/dummyHotelServices';

export default function HotelServices() {
  const [services, setServices] = useState(dummyHotelServices);

  const handleUpdate = (id: string, field: string, value: string | number) => {
    setServices(
      services.map((service) =>
        service.id === id ? { ...service, [field]: value } : service
      )
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 container">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 tracking-tight">
        Hotel Services
      </h2>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-x-auto border border-gray-200 dark:border-gray-700">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-4 text-left text-gray-800 dark:text-gray-200 font-semibold">Service Name</th>
              <th className="p-4 text-left text-gray-800 dark:text-gray-200 font-semibold">Hotel</th>
              <th className="p-4 text-left text-gray-800 dark:text-gray-200 font-semibold">Price (LKR)</th>
              <th className="p-4 text-left text-gray-800 dark:text-gray-200 font-semibold">Availability</th>
              <th className="p-4 text-left text-gray-800 dark:text-gray-200 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-t border-gray-200 dark:border-gray-700">
                <td className="p-4">
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) => handleUpdate(service.id, 'name', e.target.value)}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="text"
                    value={service.hotel}
                    onChange={(e) => handleUpdate(service.id, 'hotel', e.target.value)}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="number"
                    value={service.price}
                    onChange={(e) => handleUpdate(service.id, 'price', Number(e.target.value))}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  />
                </td>
                <td className="p-4">
                  <select
                    value={service.availability}
                    onChange={(e) => handleUpdate(service.id, 'availability', e.target.value)}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  >
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => alert(`Updated service: ${service.name}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
