import React, { useState } from 'react';
import { X, Info, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import emailjs from '@emailjs/browser';
import { api } from '../services/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState<'login' | 'signup' | 'verify' | 'forgot-password' | 'forgot-otp' | 'reset-password'>('login');
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', password: '' });
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const getUsers = async () => {
    try {
      return await api.getData('registered_users', []);
    } catch (e) {
      console.warn("Storage blocked:", e);
      return [];
    }
  };

  const saveUser = async (newUser: any) => {
    try {
      const users = await getUsers();
      users.push(newUser);
      await api.setData('registered_users', users);
    } catch (e) {
      console.warn("Storage blocked:", e);
    }
  };

  const logCustomerLogin = async (customer: any, method: string) => {
    try {
      const logs = await api.getData('customer_logs', []);
      const sessionId = Date.now().toString();
      logs.push({
        sessionId,
        name: customer.name || customer.email?.split('@')[0] || 'Unknown',
        email: customer.email,
        phone: customer.mobile || 'N/A',
        method,
        timestamp: new Date().toISOString(),
        logoutTime: null,
        status: 'logged_in'
      });
      await api.setData('customer_logs', logs);
      
      const activeCustomer = { ...customer, sessionId };
      await api.setData('active_customer', activeCustomer);
      window.dispatchEvent(new Event('auth_changed'));
    } catch (e) {
      console.warn("Storage blocked:", e);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    // Check if user already exists
    const users = await getUsers();
    if (users.find((u: any) => u.email === formData.email)) {
      setAuthError('An account with this email already exists.');
      return;
    }

    setIsLoading(true);
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);

    const serviceId = 'service_q471ivi';
    const templateId = 'template_zo2z33w';
    const publicKey = 'wuETGLekOGfeGychV';

    const templateParams = {
      fullName: formData.name,
      businessName: 'Registration',
      email: formData.email,
      phone: formData.mobile,
      productInterest: 'OTP Verification',
      monthlyVolume: 'N/A',
      customSpecs: `Your OTP for Registration is: ${newOtp}`,
      to_email: formData.email,
      passcode: newOtp,
      otp_code: newOtp,
      otp: newOtp,
      message: `Your OTP for Registration is: ${newOtp}`,
    };

    try {
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      setView('verify');
      setOtp('');
    } catch (error) {
      setAuthError('Failed to send OTP email. Please check your email address or try again later.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (otp !== generatedOtp) {
      setAuthError('Invalid OTP. Please try again.');
      return;
    }

    // Save user
    const newUser = {
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password, // In a real app, hash this!
    };
    await saveUser(newUser);

    setUser({ name: newUser.name, email: newUser.email });
    await logCustomerLogin(newUser, 'Email Registration');
    setView('login');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    const form = e.target as HTMLFormElement;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    const passwordInput = form.elements.namedItem('password') as HTMLInputElement;

    const users = await getUsers();
    const foundUser = users.find((u: any) => u.email === emailInput.value);

    if (!foundUser || foundUser.password !== passwordInput.value) {
      setAuthError('Invalid email or password.');
      return;
    }

    setUser({ name: foundUser.name, email: foundUser.email });
    await logCustomerLogin(foundUser, 'Email');
    onClose();
  };

  const handleSendForgotPasswordOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    const users = await getUsers();
    if (!users.find((u: any) => u.email === resetEmail)) {
      setAuthError('No account found with this email address.');
      return;
    }

    setIsLoading(true);
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);

    const templateParams = {
      fullName: 'Customer',
      businessName: 'Password Reset',
      email: resetEmail,
      phone: 'N/A',
      productInterest: 'OTP Verification',
      monthlyVolume: 'N/A',
      customSpecs: `Your OTP for Password Reset is: ${newOtp}`,
      to_email: resetEmail,
      passcode: newOtp,
      otp_code: newOtp,
      otp: newOtp,
      message: `Your OTP for Password Reset is: ${newOtp}`,
    };

    try {
      await emailjs.send('service_q471ivi', 'template_zo2z33w', templateParams, 'wuETGLekOGfeGychV');
      setView('forgot-otp');
      setOtp('');
    } catch (error) {
      setAuthError('Failed to send OTP email. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyForgotOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (otp !== generatedOtp) {
      setAuthError('Invalid OTP. Please try again.');
      return;
    }

    setView('reset-password');
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      const users = await getUsers();
      const updatedUsers = users.map((u: any) => {
        if (u.email === resetEmail) {
          return { ...u, password: newPassword };
        }
        return u;
      });
      await api.setData('registered_users', updatedUsers);
      setView('login');
      setResetEmail('');
      setNewPassword('');
    } catch (e) {
      setAuthError('Failed to reset password.');
    }
  };

  const handleResendOtp = async () => {
    setAuthError('');
    setIsLoading(true);
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);

    const templateParams = {
      fullName: formData.name,
      businessName: 'Registration Resend',
      email: formData.email,
      phone: formData.mobile,
      productInterest: 'OTP Verification',
      monthlyVolume: 'N/A',
      customSpecs: `Your new OTP for Registration is: ${newOtp}`,
      to_email: formData.email,
      passcode: newOtp,
      otp_code: newOtp,
      otp: newOtp,
      message: `Your new OTP for Registration is: ${newOtp}`,
    };

    try {
      await emailjs.send('service_q471ivi', 'template_zo2z33w', templateParams, 'wuETGLekOGfeGychV');
    } catch (error) {
      setAuthError('Failed to resend OTP.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
        >
          {/* Close button */}
          <button 
            onClick={() => {
              setView('login');
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8">
            {user ? (
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden mb-4 border border-gray-200">
                  {user.picture ? (
                    <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-gray-400">{user.name?.charAt(0)}</span>
                  )}
                </div>
                <h3 className="font-semibold text-lg text-gray-900">Signed in as {user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
                <button
                  onClick={() => setUser(null)}
                  className="mt-6 w-full text-tiger-orange font-medium hover:text-orange-700 transition"
                >
                  Sign Out
                </button>
              </div>
            ) : view === 'login' ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-2 leading-tight">WELCOME TO Q.S TIGER GARMENTS</h2>
                  <p className="text-gray-500 text-sm">Please sign in to your account</p>
                </div>
                <div className="flex justify-center mb-4">
                  <GoogleLogin
                    onSuccess={credentialResponse => {
                      if (credentialResponse.credential) {
                        const decoded = jwtDecode(credentialResponse.credential);
                        setUser(decoded);
                        logCustomerLogin(decoded, 'Google');
                      }
                    }}
                    onError={() => {
                      console.log('Login Failed');
                    }}
                  />
                </div>

                <div className="mt-8 relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative bg-white px-4 text-xs text-gray-400 uppercase tracking-wider">
                    Or continue with email
                  </div>
                </div>

                <form className="mt-6 space-y-4" onSubmit={handleLogin}>
                  {authError && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                      {authError}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-tiger-orange focus:border-tiger-orange outline-none transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        name="password"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-tiger-orange focus:border-tiger-orange outline-none transition-all pr-12"
                        placeholder="••••••••"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="remember" className="h-4 w-4 text-tiger-orange focus:ring-tiger-orange border-gray-300 rounded" />
                      <label htmlFor="remember" className="ml-2 block text-sm text-gray-500">
                        Remember me
                      </label>
                    </div>
                    <button type="button" onClick={() => { setView('forgot-password'); setAuthError(''); }} className="text-sm font-medium text-tiger-orange hover:text-orange-600">
                      Forgot password?
                    </button>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-tiger-dark text-white rounded-xl py-3 font-semibold mt-4 hover:bg-gray-800 transition-colors"
                  >
                    Sign In
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                  Don't have an account? <button type="button" onClick={() => setView('signup')} className="font-semibold text-tiger-orange hover:text-orange-600">Sign up</button>
                </p>
              </>
            ) : view === 'signup' ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Create Account</h2>
                  <p className="text-gray-500 text-sm">Join us for a better experience</p>
                </div>
                
                <form className="space-y-4" onSubmit={handleSendOtp}>
                  {authError && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                      {authError}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-tiger-orange focus:border-tiger-orange outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-tiger-orange focus:border-tiger-orange outline-none transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <input 
                      type="tel" 
                      required
                      maxLength={10}
                      value={formData.mobile}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 10) setFormData({...formData, mobile: val});
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-tiger-orange focus:border-tiger-orange outline-none transition-all"
                      placeholder="e.g. 9876543210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        required
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-tiger-orange focus:border-tiger-orange outline-none transition-all pr-12"
                        placeholder="••••••••"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className={`w-full text-white rounded-xl py-3 font-semibold mt-4 transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-tiger-dark hover:bg-gray-800'}`}
                  >
                    {isLoading ? 'Sending...' : 'Send OTP to Email'}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                  Already have an account? <button type="button" onClick={() => setView('login')} className="font-semibold text-tiger-orange hover:text-orange-600">Sign in</button>
                </p>
              </>
            ) : view === 'verify' ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Verify Email</h2>
                  <p className="text-gray-500 text-sm">We've sent a code to <span className="font-semibold text-gray-900">{formData.email}</span></p>
                </div>
                
                <div className="mb-6 bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start space-x-3 text-left shadow-sm">
                  <div className="flex-shrink-0 mt-0.5">
                    <Info className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-sm font-medium text-blue-800 leading-relaxed">
                    <strong>Note:</strong> Please check your Gmail's "Spam Folder" or "All Mail" section if you cannot find the OTP in your main inbox. Sometimes the verification email gets filtered there.
                  </p>
                </div>
                
                <form className="space-y-6" onSubmit={handleVerifyOtp}>
                  {authError && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                      {authError}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-center">Enter OTP Code</label>
                    <input 
                      type="text" 
                      required
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      maxLength={6}
                      className="w-full px-4 py-4 text-center tracking-[0.5em] text-2xl font-bold rounded-xl border border-gray-300 focus:ring-2 focus:ring-tiger-orange focus:border-tiger-orange outline-none transition-all"
                      placeholder="123456"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-tiger-orange text-white rounded-xl py-3 font-semibold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
                  >
                    Verify & Create Account
                  </button>
                </form>

                <div className="mt-6 text-center space-y-2">
                  <p className="text-sm text-gray-500">
                    Didn't receive the code?{' '}
                    <button 
                      type="button" 
                      onClick={handleResendOtp}
                      disabled={isLoading}
                      className={`font-semibold transition-colors ${isLoading ? 'text-gray-400 cursor-not-allowed' : 'text-tiger-orange hover:text-orange-600'}`}
                    >
                      {isLoading ? 'Sending...' : 'Resend OTP'}
                    </button>
                  </p>
                  <button type="button" onClick={() => setView('signup')} className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">
                    Back to Sign Up
                  </button>
                </div>
              </>
            ) : view === 'forgot-password' ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Forgot Password</h2>
                  <p className="text-gray-500 text-sm">Enter your email to receive an OTP</p>
                </div>
                
                <form className="space-y-4" onSubmit={handleSendForgotPasswordOTP}>
                  {authError && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                      {authError}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-tiger-orange focus:border-tiger-orange outline-none transition-all"
                      placeholder="you@example.com"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className={`w-full text-white rounded-xl py-3 font-semibold mt-4 transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-tiger-dark hover:bg-gray-800'}`}
                  >
                    {isLoading ? 'Sending...' : 'Send OTP to Email'}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                  Remembered your password? <button type="button" onClick={() => { setView('login'); setAuthError(''); }} className="font-semibold text-tiger-orange hover:text-orange-600">Sign in</button>
                </p>
              </>
            ) : view === 'forgot-otp' ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Verify Reset OTP</h2>
                  <p className="text-gray-500 text-sm">We've sent a code to <span className="font-semibold text-gray-900">{resetEmail}</span></p>
                </div>

                <div className="mb-6 bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start space-x-3 text-left shadow-sm">
                  <div className="flex-shrink-0 mt-0.5">
                    <Info className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-sm font-medium text-blue-800 leading-relaxed">
                    <strong>Note:</strong> Please check your Gmail's "Spam Folder" or "All Mail" section if you cannot find the OTP in your main inbox. Sometimes the verification email gets filtered there.
                  </p>
                </div>
                
                <form className="space-y-6" onSubmit={handleVerifyForgotOTP}>
                  {authError && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                      {authError}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-center">Enter OTP Code</label>
                    <input 
                      type="text" 
                      required
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      maxLength={6}
                      className="w-full px-4 py-4 text-center tracking-[0.5em] text-2xl font-bold rounded-xl border border-gray-300 focus:ring-2 focus:ring-tiger-orange focus:border-tiger-orange outline-none transition-all"
                      placeholder="123456"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-tiger-orange text-white rounded-xl py-3 font-semibold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
                  >
                    Verify OTP
                  </button>
                </form>

                <div className="mt-6 text-center space-y-2">
                  <button type="button" onClick={() => { setView('forgot-password'); setAuthError(''); setOtp(''); }} className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">
                    Back to Email
                  </button>
                </div>
              </>
            ) : view === 'reset-password' ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Set New Password</h2>
                  <p className="text-gray-500 text-sm">Create a new password for your account</p>
                </div>
                
                <form className="space-y-4" onSubmit={handleResetPasswordSubmit}>
                  {authError && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                      {authError}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input 
                      type="password" 
                      required
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-tiger-orange focus:border-tiger-orange outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-tiger-dark text-white rounded-xl py-3 font-semibold mt-4 hover:bg-gray-800 transition-colors"
                  >
                    Update Password
                  </button>
                </form>
              </>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}