import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Visa: React.FC = () => {
  const [formData, setFormData] = useState({
    nationality: '',
    visaType: 'tourist',
    duration: '30',
    fullName: '',
    passportNumber: '',
    email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for form submission logic
    console.log('Visa Application Submitted:', formData);
    alert('Visa application submitted! (This is a placeholder)');
  };

  return (
    <section className="visa-section py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Apply for Your Sri Lanka Visa
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Plan your trip to Sri Lanka with ease. Learn about visa requirements or apply for your Electronic Travel Authorization (ETA) directly through our platform.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Visa Information */}
          <div className="visa-info bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Visa Information</h3>
            <p className="text-gray-600 mb-4">
              Most travelers to Sri Lanka require an Electronic Travel Authorization (ETA) or a visa. The ETA is available for tourists, business travelers, and transit passengers.
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6">
              <li>Tourist ETA: Up to 30 days, extendable to 6 months.</li>
              <li>Business ETA: Up to 30 days, multiple entries.</li>
              <li>Transit ETA: Free for stays up to 48 hours.</li>
              <li>Visa exemptions apply for citizens of Maldives, Singapore, and Seychelles.</li>
            </ul>
            <Link
              to="/chat"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300"
            >
              Ask Our ChatBot for Help
            </Link>
          </div>

          {/* Visa Application Form */}
          <div className="visa-form bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Visa Application</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                  Nationality
                </label>
                <input
                  type="text"
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="visaType" className="block text-sm font-medium text-gray-700">
                  Visa Type
                </label>
                <select
                  id="visaType"
                  name="visaType"
                  value={formData.visaType}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="tourist">Tourist ETA</option>
                  <option value="business">Business ETA</option>
                  <option value="transit">Transit ETA</option>
                </select>
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Duration of Stay (days)
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="30">Up to 30 days</option>
                  <option value="48">Up to 48 hours (Transit)</option>
                  <option value="180">Up to 6 months (Tourist Extension)</option>
                </select>
              </div>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="passportNumber" className="block text-sm font-medium text-gray-700">
                  Passport Number
                </label>
                <input
                  type="text"
                  id="passportNumber"
                  name="passportNumber"
                  value={formData.passportNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Visa;