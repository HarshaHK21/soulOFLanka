import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App'; // Make sure this path is correct based on your App.tsx location

// Define the shape of your form data
interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  businessName: string;
}

// Define the shape of the user data expected from the backend
interface UserData {
    id: string;
    username: string;
    email: string;
    role: 'user' | 'vendor' | 'admin'; // Ensure 'admin' is included if you plan to register admins
    businessName?: string; // Optional for vendors
}

const AuthSection: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isVendor, setIsVendor] = useState(false); // Default to regular user initially for signup toggle
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [apiError, setApiError] = useState<string | null>(null); // To display backend errors
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // For success messages

  const navigate = useNavigate();
  const authContext = useContext(AuthContext); // Get the whole context object

  // Throw an error if AuthContext is not available (component rendered outside Provider)
  if (!authContext) {
    throw new Error('AuthSection must be used within an AuthContext.Provider');
  }
  const { login } = authContext; // Destructure the login function from the context

  // Client-side form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!isLogin && !formData.name.trim()) newErrors.name = 'Full Name is required';
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

  // Handle form submission (Login or Signup)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null); // Clear previous API errors
    setSuccessMessage(null); // Clear previous success messages

    if (validateForm()) {
      try {
        if (isLogin) {
          // --- LOGIN LOGIC (POST request to backend) ---
          const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: formData.email,
            password: formData.password,
          });
          console.log('Login successful:', response.data);

          // Call the login function from AuthContext to update global state and localStorage
          login(response.data.token, response.data.user as UserData); // Cast response.data.user to UserData

          setSuccessMessage('Login successful!');
          
          // Redirect based on the user's role received from the backend
          if (response.data.user.role === 'vendor') {
            navigate('/vendor-dashboard'); // Redirect to vendor dashboard
          } else if (response.data.user.role === 'admin') {
            navigate('/admin'); // Redirect to admin dashboard
          } else {
            navigate('/dashboard'); // Redirect to general user dashboard or home
          }

        } else {
          // --- SIGNUP LOGIC (POST request to backend) ---
          const role = isVendor ? 'vendor' : 'user'; // Determine role based on toggle

          const signupData = {
            username: formData.name, // 'name' from frontend maps to 'username' on backend
            email: formData.email,
            password: formData.password,
            ...(isVendor && { businessName: formData.businessName }), // Conditionally add businessName for vendors
            role: role // Send the determined role to the backend
          };

          const response = await axios.post('http://localhost:5000/api/auth/register', signupData);
          console.log('Signup successful:', response.data);

          setSuccessMessage('Registration successful! Please log in.');
          setIsLogin(true); // Automatically switch to the login form after successful signup
          // Clear the form fields after successful signup
          setFormData({ name: '', email: '', password: '', confirmPassword: '', businessName: '' }); 
        }
      } catch (err: any) { // Use 'any' for error type for flexibility with axios error structure
        console.error(`${isLogin ? 'Login' : 'Signup'} error:`, err);
        // Display error message from the backend response, or a generic message
        setApiError(err.response?.data?.msg || `An unexpected error occurred during ${isLogin ? 'login' : 'signup'}.`);
      }
    }
  };

  // Handle input changes and clear related errors/messages
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // Clear specific input error
    setApiError(null); // Clear general API error on input change
    setSuccessMessage(null); // Clear success message on input change
  };

  // Effect to clear form data, errors, and messages when switching between Login/Signup or User/Vendor modes
  useEffect(() => {
    setFormData({ name: '', email: '', password: '', confirmPassword: '', businessName: '' });
    setErrors({});
    setApiError(null);
    setSuccessMessage(null);
  }, [isLogin, isVendor]); // Dependencies: run this effect when isLogin or isVendor state changes

  return (
    <section className="auth-section py-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center tracking-tight animate-[fadeIn_1s_ease-in-out]">
          {isLogin ? 'Login to Your Adventure' : 'Join Soul of Sri Lanka'}
        </h2>
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
          {/* Tabs for Login/Signup */}
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
          {/* User/Vendor Toggle (only visible in Signup mode) */}
          {!isLogin && (
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
          )}
          
          {/* Display API-related Error or Success Messages */}
          {apiError && <p className="text-red-500 text-center mb-4">{apiError}</p>}
          {successMessage && <p className="text-green-600 text-center mb-4">{successMessage}</p>}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name input (only for Signup) */}
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
            {/* Email Address input */}
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
            {/* Password input */}
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
            {/* Confirm Password input (only for Signup) */}
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
            {/* Business Name input (only for Signup as Vendor) */}
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
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
          {/* Forgot Password link (only for Login) */}
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
