import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext, UserData } from './context/AuthContext';

// Define form data
interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agentLicense: string; 
}

const AuthSection: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAgent, setIsAgent] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agentLicense: '',
  });
  const [errors, setErrors] = useState<Partial<FormData & { otp?: string; api?: string }>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // OTP states
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState('');
  const [verificationEmail, setVerificationEmail] = useState('');

  // --- Password Reset States ---
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  // --- Password Reset Handlers ---
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetSuccess(null);
    try {
      await axios.post(`${API_BASE_URL}/forgot-password`, { email: resetEmail });
      setResetStep(2);
      setResetSuccess('OTP sent to your email.');
    } catch (err: any) {
      setResetError(err.response?.data?.msg || 'Failed to send OTP.');
    }
  };

  const handleVerifyResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetSuccess(null);
    try {
      await axios.post(`${API_BASE_URL}/verify-reset-otp`, { email: resetEmail, otp: resetOtp });
      setResetStep(3);
      setResetSuccess('OTP verified. Please enter your new password.');
    } catch (err: any) {
      setResetError(err.response?.data?.msg || 'Invalid OTP.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetSuccess(null);

    if (newPassword.length < 6) {
      setResetError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setResetError('Passwords do not match.');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/reset-password`, {
        email: resetEmail,
        otp: resetOtp,
        newPassword
      });
      setResetSuccess('Password reset successfully! You can now login.');
      setTimeout(() => {
        closeResetModal();
      }, 3000);
    } catch (err: any) {
      setResetError(err.response?.data?.msg || 'Failed to reset password.');
    }
  };

  const closeResetModal = () => {
    setShowResetModal(false);
    setResetStep(1);
    setResetEmail('');
    setResetOtp('');
    setNewPassword('');
    setConfirmNewPassword('');
    setResetError(null);
    setResetSuccess(null);
  };

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthSection must be used within an AuthContext.Provider');
  }
  const { login } = authContext;

  const API_BASE_URL = 'http://localhost:5000/api/auth';

  // Validation
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
    if (!isLogin && isAgent && !formData.agentLicense.trim()) {
      newErrors.agentLicense = 'Travel Agent License is required for agents';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler (login/signup)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMessage(null);

    if (!validateForm()) return;

    try {
      if (isLogin) {
        const response = await axios.post(`${API_BASE_URL}/login`, {
          email: formData.email,
          password: formData.password,
        });

        if (response.data.user && !response.data.user.isVerified) {
          setApiError('Please verify your email address. A new OTP has been sent to your email.');
          setVerificationEmail(formData.email);
          setShowOtpForm(true);
          return;
        }

        login(response.data.token, response.data.user as UserData);
        setSuccessMessage('Login successful!');

        if (response.data.user.role === 'agent') {
          navigate('/AgentDashboard');
        } else if (response.data.user.role === 'admin') {
          navigate('/AdminDashboard');
        } else {
          navigate('/UserDashboard');
        }
      } else {
        const role = isAgent ? 'agent' : 'user';
        const signupData = {
          username: formData.name,
          email: formData.email,
          password: formData.password,
          ...(isAgent && { agentLicense: formData.agentLicense }),
          role: role,
        };

        await axios.post(`${API_BASE_URL}/register`, signupData);

        setSuccessMessage('Registration successful! Please check your email for an OTP to verify your account.');
        setVerificationEmail(formData.email);
        setShowOtpForm(true);
      }

      // Reset form
      setFormData({ name: '', email: '', password: '', confirmPassword: '', agentLicense: '' });
      setErrors({});
    } catch (err: any) {
      console.error(`${isLogin ? 'Login' : 'Signup'} error:`, err);
      setApiError(err.response?.data?.msg || `An unexpected error occurred during ${isLogin ? 'login' : 'signup'}.`);
    }
  };

  //  OTP Handlers
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
    setErrors((prev) => ({ ...prev, otp: '' }));
    setApiError(null);
    setSuccessMessage(null);
  };

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
      setShowOtpForm(false);
      setIsLogin(true);
      setOtp('');
      setVerificationEmail('');
    } catch (err: any) {
      console.error('OTP Verification Error:', err.response ? err.response.data : err.message);
      setApiError(err.response?.data?.msg || 'OTP verification failed. Please try again.');
    }
  };

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError(null);
    setSuccessMessage(null);
  };

  useEffect(() => {
    setFormData({ name: '', email: '', password: '', confirmPassword: '', agentLicense: '' });
    setErrors({});
    setApiError(null);
    setSuccessMessage(null);
    if (!showOtpForm) {
      setOtp('');
      setVerificationEmail('');
    }
  }, [isLogin, isAgent, showOtpForm]);


  return (
    <section className="auth-section py-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center tracking-tight animate-[fadeIn_1s_ease-in-out]">
          {isLogin ? 'Login to Your Adventure' : 'Join Soul of Sri Lanka'}
        </h2>
        
        {/* --- Password Reset Modal --- */}
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-[scaleIn_0.3s_ease-out]">
              <button 
                onClick={closeResetModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
                {resetStep === 1 && 'Reset Password'}
                {resetStep === 2 && 'Enter OTP'}
                {resetStep === 3 && 'New Password'}
              </h3>

              {resetError && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{resetError}</div>}
              {resetSuccess && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">{resetSuccess}</div>}

              {resetStep === 1 && (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <p className="text-gray-600 text-sm mb-2">Enter your email address to receive a verification code.</p>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                  <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                    Send Code
                  </button>
                </form>
              )}

              {resetStep === 2 && (
                <form onSubmit={handleVerifyResetOtp} className="space-y-4">
                  <p className="text-gray-600 text-sm mb-2">Enter the 6-digit code sent to <strong>{resetEmail}</strong></p>
                  <input
                    type="text"
                    placeholder="6-Digit OTP"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-center tracking-widest text-lg"
                    maxLength={6}
                    required
                  />
                  <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                    Verify Code
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setResetStep(1)} 
                    className="w-full text-gray-500 text-sm hover:underline"
                  >
                    Change Email
                  </button>
                </form>
              )}

              {resetStep === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                  <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
                    Reset Password
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
          {apiError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4" role="alert">
              {apiError}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-4" role="alert">
              {successMessage}
            </div>
          )}

          {/* OTP Form */}
          {showOtpForm ? (
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-full text-center text-lg tracking-widest focus:ring-green-500"
                />
                {errors.otp && <p className="text-red-500 text-sm mt-1 text-center">{errors.otp}</p>}
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all">
                Verify OTP
              </button>
              <button type="button" onClick={handleResendOtp} className="w-full mt-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-gray-300">
                Resend OTP
              </button>
              <p className="text-center text-gray-600 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpForm(false);
                    setIsLogin(true);
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
            <>
              {/* Tabs */}
              <div className="flex justify-center mb-6">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${isLogin ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`ml-4 px-6 py-2 rounded-full font-semibold transition-all ${!isLogin ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  Signup
                </button>
              </div>

              {/* User/Agent Toggle */}
              {!isLogin && (
                <div className="flex justify-center mb-6">
                  <button onClick={() => setIsAgent(false)} className={`px-4 py-2 rounded-full font-semibold transition-all ${!isAgent ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                    User
                  </button>
                  <button onClick={() => setIsAgent(true)} className={`ml-2 px-4 py-2 rounded-full font-semibold transition-all ${isAgent ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                    Agent
                  </button>
                </div>
              )}

              {/* Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-green-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-green-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-green-500"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-green-500"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                )}
                {!isLogin && isAgent && (
                  <div>
                    <input
                      type="text"
                      name="agentLicense"
                      value={formData.agentLicense}
                      onChange={handleInputChange}
                      placeholder="Travel Agent License Number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-green-500"
                    />
                    {errors.agentLicense && <p className="text-red-500 text-sm mt-1">{errors.agentLicense}</p>}
                  </div>
                )}
                <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all">
                  {isLogin ? 'Login' : 'Sign Up'}
                </button>
              </form>
              {isLogin && (
                <div className="text-center mt-4">
                  <button 
                    type="button"
                    onClick={() => setShowResetModal(true)}
                    className="text-gray-600 hover:text-blue-600 hover:underline transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};


export default AuthSection;
