'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiUser, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiLogIn, 
  FiShield,
  FiSettings,
  FiDatabase,
  FiBarChart2,
  FiUsers,
  FiBook,
  FiCalendar,
  FiMail,
  FiPhone,
  FiMapPin
} from 'react-icons/fi';
import { 
  IoRocketOutline,
  IoStatsChartOutline,
  IoPeopleOutline
} from 'react-icons/io5';

export default function AdminLogin() { // Added component function
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Handle successful login here
      console.log('Login successful', formData);
    } catch (error) {
      setErrors({ submit: 'Invalid credentials. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const adminFeatures = [
    {
      icon: FiUsers,
      title: 'Student Management',
      description: 'Manage student records, attendance, and academic progress'
    },
    {
      icon: FiBook,
      title: 'Academic Planning',
      description: 'Create timetables, assign teachers, and manage curriculum'
    },
    {
      icon: IoStatsChartOutline,
      title: 'Analytics Dashboard',
      description: 'Real-time insights and performance analytics'
    },
    {
      icon: FiDatabase,
      title: 'Data Management',
      description: 'Secure storage and management of institutional data'
    }
  ];

  const quickStats = [
    { label: 'Active Students', value: '1,247', change: '+5.2%' },
    { label: 'Teaching Staff', value: '58', change: '+2' },
    { label: 'Classes Today', value: '42', change: 'On Schedule' },
    { label: 'Pending Tasks', value: '12', change: '-3' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            {/* Left Side - Login Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center"
            >
              <div className="w-full max-w-lg">
                {/* Login Card - Increased height to match right side */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-10 shadow-2xl h-full flex flex-col justify-center min-h-[700px]" // Increased height
                >
                  {/* Header */}
                  <div className="text-center mb-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                      className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6"
                    >
                      <FiShield className="text-white text-3xl" />
                    </motion.div>
                    <h1 className="text-4xl font-bold text-white mb-3">
                      Admin Portal
                    </h1>
                    <p className="text-white/60 text-lg">
                      Secure access to school management system
                    </p>
                  </div>

                  {/* Login Form */}
                  <form onSubmit={handleSubmit} className="space-y-8 flex-1 flex flex-col justify-center">
                    {/* Username Field */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 text-white/80 text-base font-medium">
                        <FiUser className="text-blue-400 text-lg" />
                        Username
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className={`w-full bg-white/5 border ${
                            errors.username ? 'border-red-400/50' : 'border-white/10'
                          } rounded-xl px-5 py-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-lg`}
                          placeholder="Enter your username"
                        />
                        {errors.username && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-400 text-sm mt-2"
                          >
                            {errors.username}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 text-white/80 text-base font-medium">
                        <FiLock className="text-purple-400 text-lg" />
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full bg-white/5 border ${
                            errors.password ? 'border-red-400/50' : 'border-white/10'
                          } rounded-xl px-5 py-4 pr-14 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-lg`}
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors p-2"
                        >
                          {showPassword ? <FiEyeOff className="text-xl" /> : <FiEye className="text-xl" />}
                        </button>
                        {errors.password && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-400 text-sm mt-2"
                          >
                            {errors.password}
                          </motion.p>
                        )}
                      </div>
                    
                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-3 text-white/60 text-base cursor-pointer">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                          className="w-5 h-5 bg-white/5 border border-white/20 rounded focus:ring-2 focus:ring-blue-500/50"
                        />
                        Remember me
                      </label>
                      <button
                        type="button"
                        className="text-blue-400 hover:text-blue-300 text-base transition-colors"
                        onClick={() => router.push('/pages/forgotpassword')}
                      >
                        Forgot password?
                      </button>
                    </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: isLoading ? 1 : 1.02 }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        <>
                          <FiLogIn className="text-2xl" />
                          Sign In
                        </>
                      )}
                    </motion.button>

                    {errors.submit && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-400 text-center text-base bg-red-400/10 py-3 rounded-lg mt-4"
                      >
                        {errors.submit}
                      </motion.p>
                    )}
                  </form>

                  {/* Security Notice */}
                  <div className="mt-8 p-5 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-4 text-white/60 text-base">
                      <FiShield className="text-green-400 flex-shrink-0 text-xl" />
                      <span>Your login is secured with end-to-end encryption</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Side - Features & Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Welcome Section */}
              <div className="text-white">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20"
                >
                  <IoRocketOutline className="text-blue-400" />
                  <span className="text-sm font-medium">Katwanyaa High School Admin</span>
                </motion.div>

                <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  Manage Your
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Institution
                  </span>
                </h2>
                <p className="text-xl text-white/80 mb-8 leading-relaxed">
                  Access powerful tools to streamline academic operations, 
                  monitor student progress, and enhance institutional efficiency.
                </p>
              </div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-2 gap-4"
              >
                {quickStats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
                  >
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-white/60 text-sm">{stat.label}</div>
                    <div className="text-green-400 text-xs mt-1">{stat.change}</div>
                  </div>
                ))}
              </motion.div>

              {/* Features Grid */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="grid sm:grid-cols-2 gap-4"
              >
                {adminFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.15)' }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 cursor-pointer group transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-white/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <feature.icon className="text-blue-400 text-xl" />
                      </div>
                      <h3 className="text-white font-semibold text-sm">{feature.title}</h3>
                    </div>
                    <p className="text-white/60 text-xs leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Contact Support */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <FiSettings className="text-blue-400" />
                  Need Help?
                </h3>
                <div className="space-y-2 text-white/60 text-sm">
                  <div className="flex items-center gap-2">
                    <FiMail className="text-blue-400" />
                    <span>support@katwanyaa.ac.ke</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone className="text-green-400" />
                    <span>+254 700 000 000</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} // Added closing brace for the component
