import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  businessName: string;
}

const AuthSection: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isVendor, setIsVendor] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!isLogin && !formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      newErrors.email = 'Invalid email format';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!isLogin && isVendor && !formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required for vendors';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulate API call (replace with actual backend integration)
      console.log(`${isLogin ? 'Login' : 'Signup'} submitted:`, { ...formData, type: isVendor ? 'vendor' : 'user' });
      // Reset form
      setFormData({ name: '', email: '', password: '', confirmPassword: '', businessName: '' });
      setErrors({});
      // Navigate to home or dashboard
      navigate(isVendor ? '/vendor-dashboard' : '/');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <section className="auth-section py-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center tracking-tight animate-[fadeIn_1s_ease-in-out]">
          {isLogin ? 'Login to Your Adventure' : 'Join Soul of Sri Lanka'}
        </h2>
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                isLogin
                  ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`ml-4 px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                !isLogin
                  ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              Signup
            </button>
          </div>
          {/* User/Vendor Toggle */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setIsVendor(false)}
              className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                !isVendor ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              User
            </button>
            <button
              onClick={() => setIsVendor(true)}
              className={`ml-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                isVendor ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              Vendor
            </button>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-green-500 focus:border-green-500 transition duration-300"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
            )}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-green-500 focus:border-green-500 transition duration-300"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-green-500 focus:border-green-500 transition duration-300"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            {!isLogin && (
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-green-500 focus:border-green-500 transition duration-300"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            )}
            {!isLogin && isVendor && (
              <div>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Business Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-green-500 focus:border-green-500 transition duration-300"
                />
                {errors.businessName && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
                )}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
          {isLogin && (
            <p className="text-center text-gray-600 mt-4">
              Forgot password?{' '}
              <a href="/forgot-password" className="text-blue-600 hover:underline">
                Reset here
              </a>
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AuthSection;