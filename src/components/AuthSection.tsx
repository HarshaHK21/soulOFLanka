    import React, { useState, useContext, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import axios from 'axios';
    import { AuthContext } from './context/AuthContext'; // Corrected path to AuthContext

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
      role: 'user' | 'vendor' | 'admin';
      businessName?: string;
      isVerified?: boolean; // Ensure this is included for OTP flow
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
      const [errors, setErrors] = useState<Partial<FormData & { otp?: string; api?: string }>>({}); // Added otp and api error types
      const [apiError, setApiError] = useState<string | null>(null);
      const [successMessage, setSuccessMessage] = useState<string | null>(null);

      // New states for OTP flow
      const [showOtpForm, setShowOtpForm] = useState(false);
      const [otp, setOtp] = useState('');
      const [verificationEmail, setVerificationEmail] = useState(''); // Stores email for OTP verification

      const navigate = useNavigate();
      const authContext = useContext(AuthContext);

      // Throw an error if AuthContext is not available (component rendered outside Provider)
      if (!authContext) {
        throw new Error('AuthSection must be used within an AuthContext.Provider');
      }
      const { login } = authContext;

      const API_BASE_URL = 'http://localhost:5000/api/auth'; // Your backend API base URL

      // Client-side form validation
      const validateForm = (): boolean => {
        const newErrors: Partial<FormData & { otp?: string; api?: string }> = {};
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
        setApiError(null);
        setSuccessMessage(null);

        if (!validateForm()) {
          return;
        }

        try {
          if (isLogin) {
            // --- LOGIN LOGIC ---
            const response = await axios.post(`${API_BASE_URL}/login`, {
              email: formData.email,
              password: formData.password,
            });

            // Check if the user's email is verified
            if (response.data.user && !response.data.user.isVerified) {
              setApiError('Please verify your email address. A new OTP has been sent to your email.');
              setVerificationEmail(formData.email); // Set email for OTP form
              setShowOtpForm(true); // Show OTP form
              return; // Stop here, user needs to verify
            }

            console.log('Login successful:', response.data);
            login(response.data.token, response.data.user as UserData);

            setSuccessMessage('Login successful!');

            // Redirect based on the user's role
            if (response.data.user.role === 'vendor') {
              navigate('/vendor-dashboard');
            } else if (response.data.user.role === 'admin') {
              navigate('/admin');
            } else {
              navigate('/dashboard');
            }

          } else {
            // --- SIGNUP LOGIC ---
            const role = isVendor ? 'vendor' : 'user';
            const signupData = {
              username: formData.name,
              email: formData.email,
              password: formData.password,
              ...(isVendor && { businessName: formData.businessName }),
              role: role,
            };

            const response = await axios.post(`${API_BASE_URL}/register`, signupData);
            console.log('Signup successful:', response.data);

            setSuccessMessage('Registration successful! Please check your email for an OTP to verify your account.');
            setVerificationEmail(formData.email); // Store email for OTP verification
            setShowOtpForm(true); // Show the OTP verification form
            // Do not navigate immediately, wait for OTP verification
          }

          // Clear the form fields after successful operation (either login or showing OTP form)
          setFormData({ name: '', email: '', password: '', confirmPassword: '', businessName: '' });
          setErrors({});

        } catch (err: any) {
          console.error(`${isLogin ? 'Login' : 'Signup'} error:`, err);
          setApiError(err.response?.data?.msg || `An unexpected error occurred during ${isLogin ? 'login' : 'signup'}.`);
        }
      };

      // Handler for OTP input change
      const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(e.target.value);
        setErrors((prev) => ({ ...prev, otp: '' })); // Clear OTP error
        setApiError(null); // Clear general API error on input change
        setSuccessMessage(null); // Clear success message on input change
      };

      // Handler for OTP verification submission
      const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError(null);
        setSuccessMessage(null);

        if (otp.length !== 6) {
          setErrors({ otp: 'OTP must be 6 digits.' });
          return;
        }

        try {
          const response = await axios.post(`${API_BASE_URL}/verify-otp`, {
            email: verificationEmail,
            otp: otp,
          });

          setSuccessMessage(response.data.msg || 'Email successfully verified! You can now log in.');
          setShowOtpForm(false); // Hide OTP form
          setIsLogin(true); // Switch to login form
          setOtp(''); // Clear OTP input
          setVerificationEmail(''); // Clear verification email

        } catch (err: any) {
          console.error('OTP Verification Error:', err.response ? err.response.data : err.message);
          setApiError(err.response?.data?.msg || 'OTP verification failed. Please try again.');
        }
      };

      // Handler for resending OTP
      const handleResendOtp = async () => {
        setApiError(null);
        setSuccessMessage(null);

        try {
          const response = await axios.post(`${API_BASE_URL}/resend-otp`, {
            email: verificationEmail,
          });

          setSuccessMessage(response.data.msg || 'New OTP sent to your email.');

        } catch (err: any) {
          console.error('Resend OTP Error:', err.response ? err.response.data : err.message);
          setApiError(err.response?.data?.msg || 'Failed to resend OTP. Please try again later.');
        }
      };

      // Handle input changes for the main form and clear related errors/messages
      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
        setApiError(null);
        setSuccessMessage(null);
      };

      // Effect to clear form data, errors, and messages when switching between Login/Signup or User/Vendor modes
      // Also clear OTP related states if switching away from OTP form
      useEffect(() => {
        setFormData({ name: '', email: '', password: '', confirmPassword: '', businessName: '' });
        setErrors({});
        setApiError(null);
        setSuccessMessage(null);
        // If switching from OTP form back to auth form
        if (!showOtpForm) {
          setOtp('');
          setVerificationEmail('');
        }
      }, [isLogin, isVendor, showOtpForm]);


      return (
        <section className="auth-section py-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center tracking-tight animate-[fadeIn_1s_ease-in-out]">
              {isLogin ? 'Login to Your Adventure' : 'Join Soul of Sri Lanka'}
            </h2>
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
              {/* Display API-related Error or Success Messages */}
              {apiError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4" role="alert">
                  <span className="block sm:inline">{apiError}</span>
                </div>
              )}
              {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative mb-4" role="alert">
                  <span className="block sm:inline">{successMessage}</span>
                </div>
              )}

              {/* Conditional rendering for OTP form or main auth form */}
              {showOtpForm ? (
                // OTP Verification Form
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <p className="text-center text-gray-700 mb-4">
                    An OTP has been sent to <strong>{verificationEmail}</strong>. Please enter it below to verify your account.
                  </p>
                  <div>
                    <input
                      type="text"
                      name="otp"
                      value={otp}
                      onChange={handleOtpChange}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-green-500 focus:border-green-500 transition duration-300 text-center text-lg tracking-widest"
                    />
                    {errors.otp && <p className="text-red-500 text-sm mt-1 text-center">{errors.otp}</p>}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Verify OTP
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="w-full mt-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-gray-300 transition-all duration-300 transform hover:scale-105"
                  >
                    Resend OTP
                  </button>
                  <p className="text-center text-gray-600 mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowOtpForm(false);
                        setIsLogin(true); // Go back to login if they want to try logging in again
                        setOtp('');
                        setApiError(null);
                        setSuccessMessage(null);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Go back to Login
                    </button>
                  </p>
                </form>
              ) : (
                // Main Login/Signup Form
                <>
                  {/* Tabs */}
                  <div className="flex justify-center mb-6">
                    <button
                      onClick={() => {
                        setIsLogin(true);
                        setApiError(null); // Clear errors when switching tabs
                        setSuccessMessage(null);
                        setFormData({ name: '', email: '', password: '', confirmPassword: '', businessName: '' }); // Clear form
                        setErrors({});
                      }}
                      className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                        isLogin
                          ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setIsLogin(false);
                        setApiError(null); // Clear errors when switching tabs
                        setSuccessMessage(null);
                        setFormData({ name: '', email: '', password: '', confirmPassword: '', businessName: '' }); // Clear form
                        setErrors({});
                      }}
                      className={`ml-4 px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                        !isLogin
                          ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      Signup
                    </button>
                  </div>
                  {/* User/Vendor Toggle (only for signup) */}
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
                </>
              )}
            </div>
          </div>
        </section>
      );
    };

    export default AuthSection;