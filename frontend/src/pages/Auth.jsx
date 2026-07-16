import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, Phone, Mail, Lock, User, KeyRound, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const { login, register, requestOTP, verifyOTP } = useAuth();

  const [mode, setMode] = useState('LOGIN'); // LOGIN, REGISTER, OTP
  const [loading, setLoading] = useState(false);
  const [successDelay, setSuccessDelay] = useState(false);
  const [error, setError] = useState('');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // OTP Flow
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const loggedUser = await login(email, password);
      setSuccessDelay(true);
      // Wait for 400ms loading animation
      await new Promise(resolve => setTimeout(resolve, 400));
      
      if (loggedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials');
      setLoading(false);
    }
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(name, email, phone, password);
      setSuccessDelay(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      navigate(redirect);
    } catch (err) {
      setError(err.message || 'Registration failed');
      setLoading(false);
    }
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await requestOTP(phone);
      setOtpSent(true);
    } catch (err) {
      setError(err.message || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await verifyOTP(phone, otpCode);
      setSuccessDelay(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      navigate(redirect);
    } catch (err) {
      setError(err.message || 'Invalid OTP code. Use 123456');
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-cream min-h-[85vh] flex items-center justify-center py-16 px-6">
      <div className="max-w-md w-full bg-white border border-brand-beige p-6 md:p-8 rounded-sm shadow-md space-y-6">
        
        {/* Success delay state */}
        {successDelay ? (
          <div className="text-center py-12 space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <RefreshCw className="w-10 h-10 animate-spin text-brand-gold mx-auto" />
            <h3 className="font-serif text-lg text-brand-chocolate font-light">Verifying Security Credentials...</h3>
            <p className="text-[10px] text-brand-gold uppercase tracking-[0.2em] font-semibold">Welcome to the Royal Palace</p>
          </div>
        ) : (
          <>
            {/* Header Monogram */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 border border-brand-gold/30 rounded-full flex items-center justify-center bg-brand-warm/30 text-brand-gold mx-auto">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <h2 className="font-serif text-2xl text-brand-chocolate font-light tracking-wide">Royal Portal</h2>
              <p className="font-sans text-[10px] text-brand-gold uppercase tracking-[0.2em] font-semibold">Join Jodhpur Sweet Home</p>
            </div>

            {/* Tab Selection */}
            {mode !== 'OTP' && (
              <div className="flex border-b border-brand-beige text-xs uppercase font-bold tracking-wider text-brand-chocolate/40">
                <button 
                  onClick={() => { setMode('LOGIN'); setError(''); }}
                  className={`flex-1 pb-3 text-center transition-all ${mode === 'LOGIN' ? 'border-b-2 border-brand-maroon text-brand-maroon' : 'hover:text-brand-chocolate'}`}
                >
                  Sign In
                </button>
                <button 
                  onClick={() => { setMode('REGISTER'); setError(''); }}
                  className={`flex-1 pb-3 text-center transition-all ${mode === 'REGISTER' ? 'border-b-2 border-brand-maroon text-brand-maroon' : 'hover:text-brand-chocolate'}`}
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Errors display */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-[10px] rounded text-center font-medium font-sans">
                {error}
              </div>
            )}

            {/* Standard Email Login */}
            {mode === 'LOGIN' && (
              <form onSubmit={handleEmailLogin} className="space-y-4 text-xs text-brand-chocolate">
                <div className="space-y-1">
                  <label className="block font-semibold">Email Address</label>
                  <div className="flex items-center border border-brand-beige px-2.5 py-1.5 focus-within:border-brand-gold bg-white">
                    <Mail className="w-4 h-4 text-brand-chocolate/40 mr-2 shrink-0" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. admin@jodhpur.com or customer@mail.com"
                      className="w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold">Security Password</label>
                  <div className="flex items-center border border-brand-beige px-2.5 py-1.5 focus-within:border-brand-gold bg-white">
                    <Lock className="w-4 h-4 text-brand-chocolate/40 mr-2 shrink-0" />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="e.g. AdminPassword123"
                      className="w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-brand-maroon hover:bg-brand-maroon/95 text-brand-cream text-xs uppercase tracking-luxury font-semibold transition-colors mt-2"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>

                <div className="text-center pt-2">
                  <button 
                    type="button"
                    onClick={() => { setMode('OTP'); setOtpSent(false); setError(''); }}
                    className="text-[10px] text-brand-gold hover:text-brand-maroon font-semibold underline tracking-wider uppercase"
                  >
                    Sign In with Mobile OTP instead
                  </button>
                </div>
              </form>
            )}

            {/* Email Register */}
            {mode === 'REGISTER' && (
              <form onSubmit={handleEmailRegister} className="space-y-4 text-xs text-brand-chocolate">
                <div className="space-y-1">
                  <label className="block font-semibold">Full Name</label>
                  <div className="flex items-center border border-brand-beige px-2.5 py-1.5 focus-within:border-brand-gold bg-white">
                    <User className="w-4 h-4 text-brand-chocolate/40 mr-2 shrink-0" />
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Maharana Rathore"
                      className="w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold">Email Address</label>
                  <div className="flex items-center border border-brand-beige px-2.5 py-1.5 focus-within:border-brand-gold bg-white">
                    <Mail className="w-4 h-4 text-brand-chocolate/40 mr-2 shrink-0" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@mailbox.com"
                      className="w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold">Phone Contact</label>
                  <div className="flex items-center border border-brand-beige px-2.5 py-1.5 focus-within:border-brand-gold bg-white">
                    <Phone className="w-4 h-4 text-brand-chocolate/40 mr-2 shrink-0" />
                    <input 
                      type="tel" 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 99999 88888"
                      className="w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold">Security Password</label>
                  <div className="flex items-center border border-brand-beige px-2.5 py-1.5 focus-within:border-brand-gold bg-white">
                    <Lock className="w-4 h-4 text-brand-chocolate/40 mr-2 shrink-0" />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create password"
                      className="w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-brand-maroon hover:bg-brand-maroon/95 text-brand-cream text-xs uppercase tracking-luxury font-semibold transition-colors mt-2"
                >
                  {loading ? 'Creating Credentials...' : 'Create Account'}
                </button>
              </form>
            )}

            {/* Mobile Passwordless OTP Login */}
            {mode === 'OTP' && (
              <div className="space-y-4 text-xs text-brand-chocolate">
                {!otpSent ? (
                  <form onSubmit={handleRequestOTP} className="space-y-4">
                    <div className="space-y-1">
                      <label className="block font-semibold">Phone Contact Number</label>
                      <div className="flex items-center border border-brand-beige px-2.5 py-1.5 focus-within:border-brand-gold bg-white">
                        <Phone className="w-4 h-4 text-brand-chocolate/40 mr-2 shrink-0" />
                        <input 
                          type="tel" 
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-brand-maroon hover:bg-brand-maroon/95 text-brand-cream text-xs uppercase tracking-luxury font-semibold transition-colors mt-2"
                    >
                      {loading ? 'Sending Code...' : 'Request Verification OTP'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div className="bg-green-50 border border-green-200 text-green-800 text-[10px] p-2.5 rounded font-sans flex items-center space-x-1.5 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                      <span>OTP code simulated on server logs. Use **123456**</span>
                    </div>

                    <div className="space-y-1">
                      <label className="block font-semibold">Enter 6-Digit OTP</label>
                      <div className="flex items-center border border-brand-beige px-2.5 py-1.5 focus-within:border-brand-gold bg-white">
                        <KeyRound className="w-4 h-4 text-brand-chocolate/40 mr-2 shrink-0" />
                        <input 
                          type="text" 
                          required
                          maxLength="6"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                          placeholder="e.g. 123456"
                          className="w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0 font-mono tracking-widest text-center"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-brand-maroon hover:bg-brand-maroon/95 text-brand-cream text-xs uppercase tracking-luxury font-semibold transition-colors mt-2"
                    >
                      {loading ? 'Verifying Code...' : 'Verify OTP & Login'}
                    </button>
                  </form>
                )}

                <div className="text-center pt-2">
                  <button 
                    type="button"
                    onClick={() => { setMode('LOGIN'); setError(''); }}
                    className="text-[10px] text-brand-gold hover:text-brand-maroon font-semibold underline tracking-wider uppercase"
                  >
                    Back to Standard Password Sign In
                  </button>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};
export default Auth;
