'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*]/.test(password)) strength++;
  return strength;
};

const STRENGTH_LABELS = ['Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['#FF6B6B', '#FFA726', '#FFD93D', '#4CAF50'];

export default function Index() {
  const { login, signup, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    profilePicture: null,
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));

    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profilePicture: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!isLogin) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted', { isLogin, formData });

    if (!validateForm()) {
      console.log('Form validation failed', errors);
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Login
        console.log('Attempting login...');
        const success = await login(formData.email, formData.password);
        console.log('Login result:', success);
        if (success) {
          router.push('/dashboard');
        } else {
          setErrors({ submit: 'Invalid email or password' });
        }
      } else {
        // Signup
        console.log('Attempting signup...');
        const success = await signup(formData);
        console.log('Signup result:', success);
        if (success) {
          router.push('/dashboard');
        } else {
          setErrors({ submit: 'User already exists with this email' });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Side - Login */}
          <div
            className={`p-8 md:p-12 transition-all duration-500 ${
              isLogin ? 'block' : 'hidden md:block md:opacity-30 md:pointer-events-none'
            }`}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600 mb-8">Sign in to your fitness journey</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E86AB]"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={16} /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E86AB]"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
                  <AlertCircle size={20} />
                  <span>{errors.submit}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2E86AB] text-white font-bold py-2 rounded-lg hover:bg-[#1f5f8a] transition-all disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <p className="text-center text-gray-600 text-sm mt-4">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setErrors({});
                  }}
                  className="text-[#2E86AB] font-semibold hover:underline"
                >
                  Sign up
                </button>
              </p>
            </form>
          </div>

          {/* Right Side - Signup */}
          <div
            className={`p-8 md:p-12 bg-gray-50 transition-all duration-500 ${
              !isLogin ? 'block' : 'hidden md:block md:opacity-30 md:pointer-events-none'
            }`}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Start Your Journey</h2>
            <p className="text-gray-600 mb-8">Create your fitness account today</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center mb-6">
                <label className="w-32 h-32 rounded-full border-4 border-dashed border-[#2E86AB] flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all overflow-hidden">
                  {preview ? (
                    <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <User size={40} className="text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Upload Photo</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E86AB]"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E86AB]"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={16} /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E86AB]"
                  />
                </div>

                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded transition-all ${
                            i < passwordStrength
                              ? 'bg-[' + STRENGTH_COLORS[passwordStrength - 1] + ']'
                              : 'bg-gray-300'
                          }`}
                          style={{
                            backgroundColor:
                              i < passwordStrength
                                ? STRENGTH_COLORS[passwordStrength - 1]
                                : '#d1d5db',
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-xs mt-1 font-semibold" style={{ color: STRENGTH_COLORS[passwordStrength - 1] || '#999' }}>
                      {STRENGTH_LABELS[passwordStrength - 1] || 'Weak'}
                    </p>
                  </div>
                )}
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2E86AB]"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
                {formData.password === formData.confirmPassword && formData.password && (
                  <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle size={16} /> Passwords match
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2E86AB] text-white font-bold py-2 rounded-lg hover:bg-[#1f5f8a] transition-all disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>

              <p className="text-center text-gray-600 text-sm mt-4">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setErrors({});
                  }}
                  className="text-[#2E86AB] font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
