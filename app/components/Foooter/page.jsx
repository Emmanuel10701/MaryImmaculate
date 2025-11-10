'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiSend,
  FiHeart,
  FiCheckCircle
} from 'react-icons/fi';
import {
  IoLogoWhatsapp,
  IoLogoInstagram,
  IoLogoTwitter,
  IoLogoFacebook,
  IoLogoYoutube,
  IoLogoLinkedin
} from 'react-icons/io5';

export default function ModernFooter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showSitemap, setShowSitemap] = useState(false);
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About Us', href: '/pages/AboutUs' },
    { name: 'Academics', href: '/pages/academics' },
    { name: 'Admissions', href: '/pages/admissions' },
    { name: 'Assigments', href: '/pages/assigments' },
    { name: 'Contact ', href: '/pages/contact' },
    { name: 'News & Events', href: '/pages/eventsandnews' },
  ];

  const resources = [
    { name: 'Student Portal', href: '/pages/' },
    { name: 'Career Counseling', href: '/counseling' },
    { name: 'School Policies', href: '/policies' },
    { name: 'Guidance & Counseling', href: '/guidance' },
    { name: 'Sports Facilities', href: '/sports-facilities' },
  ];

  const socialLinks = [
    {
      icon: IoLogoFacebook,
      href: 'https://facebook.com/katwanyaahigh',
      color: 'text-blue-600 hover:text-blue-700',
      bgColor: 'bg-blue-500/20 hover:bg-blue-500/30'
    },
    {
      icon: IoLogoTwitter,
      href: 'https://twitter.com/katwanyaahigh',
      color: 'text-sky-500 hover:text-sky-600',
      bgColor: 'bg-sky-500/20 hover:bg-sky-500/30'
    },
    {
      icon: IoLogoInstagram,
      href: 'https://instagram.com/katwanyaahigh',
      color: 'text-pink-600 hover:text-pink-700',
      bgColor: 'bg-pink-500/20 hover:bg-pink-500/30'
    },
    {
      icon: IoLogoYoutube,
      href: 'https://youtube.com/katwanyaahigh',
      color: 'text-red-600 hover:text-red-700',
      bgColor: 'bg-red-500/20 hover:bg-red-500/30'
    },
    {
      icon: IoLogoLinkedin,
      href: 'https://linkedin.com/school/katwanyaahigh',
      color: 'text-blue-700 hover:text-blue-800',
      bgColor: 'bg-blue-600/20 hover:bg-blue-600/30'
    },
    {
      icon: IoLogoWhatsapp,
      href: 'https://wa.me/254712345678',
      color: 'text-green-600 hover:text-green-700',
      bgColor: 'bg-green-500/20 hover:bg-green-500/30'
    },
  ];

  const contactInfo = [
    {
      icon: FiMapPin,
      text: 'Kambusu, Along Kangundo Road, Tala, Machakos County',
      href: 'https://maps.google.com/?q=-1.246601,37.345945'
    },
    {
      icon: FiPhone,
      text: '+254 712 345 678',
      href: 'tel:+254712345678'
    },
    {
      icon: FiMail,
      text: 'info@katwanyaa.ac.ke',
      href: 'mailto:info@katwanyaa.ac.ke'
    },
    {
      icon: FiClock,
      text: 'Mon - Fri: 7:30 AM - 4:30 PM',
      href: '#'
    }
  ];

  const awards = [
    '🏆 Top Performing School in Machakos',
    '⭐ Excellence in STEM Education',
    '🎓 98% University Placement',
    '🏅 Sports Excellence Award'
  ];

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      // simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setShowSuccess(true);
      setEmail('');
      setTimeout(() => setShowSuccess(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-slate-800 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="lg:col-span-1">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">KH</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Katwanyaa High</h3>
                <p className="text-blue-300 text-sm">Excellence in Education</p>
              </div>
            </motion.div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering students through quality education, modern facilities, and a nurturing community that fosters academic excellence and character development.
            </p>

            <div className="space-y-3 mb-6">
              {contactInfo.map((item, index) => {
                const ItemIcon = item.icon;
                return (
                  <motion.a
                    key={index}
                    href={item.href}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
                  >
                    <ItemIcon className="text-blue-400 group-hover:text-blue-300 transition-colors flex-shrink-0" />
                    <span className="text-sm">{item.text}</span>
                  </motion.a>
                );
              })}
            </div>

            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <h4 className="font-semibold mb-3 text-blue-300">Achievements</h4>
              <div className="space-y-2">
                {awards.map((award, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 text-sm text-gray-300"
                  >
                    {award}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-6 text-blue-300">Quick Links</h4>
                <ul className="space-y-3">
                  {quickLinks.map((link, index) => (
                    <motion.li key={index} whileHover={{ x: 5 }}>
                      <a href={link.href} className="text-gray-300 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full group-hover:bg-blue-300 transition-colors flex-shrink-0"></div>
                        {link.name}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-6 text-blue-300">Resources</h4>
                <div className="grid grid-cols-1 gap-3">
                  {resources.map((resource, index) => (
                    <motion.a
                      key={index}
                      href={resource.href}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.1)' }}
                      className="text-gray-300 hover:text-white transition-all duration-300 text-sm flex items-center gap-2 group py-2 px-3 rounded-lg hover:bg-white/5"
                    >
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full group-hover:bg-purple-300 transition-colors flex-shrink-0"></div>
                      {resource.name}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
                 <button onClick={() => setShowPrivacy(true)} className="text-white text-base hover:text-blue-400 transition-colors hover:underline">Terms and Privacy Policy</button>

            <div className="mt-8 pt-8 border-t border-white/10">
              <h5 className="font-semibold mb-4 text-blue-300 text-center">Follow Us</h5>
              <div className="flex gap-3 justify-center">
                {socialLinks.map((social, index) => {
                  const SocialIcon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-14 h-14 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all duration-300 ${social.bgColor} ${social.color}`}
                      style={{ transform: 'scale(1.01)' }}
                    >
                      <SocialIcon className="text-2xl" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-1">
            <h4 className="text-lg font-semibold mb-6 text-blue-300">Stay Updated</h4>

            <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm mb-6 w-full">
              <h5 className="font-semibold mb-3 text-lg">School Newsletter</h5>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                Get updates on academic events, achievements, and important announcements delivered to your inbox.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="flex flex-col gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-4 text-white placeholder-gray-300 text-sm focus:outline-none focus:border-blue-400 transition-colors"
                  />
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || !email}
                    whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      <>
                        <FiSend className="text-lg" />
                        <span>Subscribe Now</span>
                      </>
                    )}
                  </motion.button>

                  {showSuccess && (
                    <div className="text-green-300 text-sm flex items-center gap-2 mt-2">
                      <FiCheckCircle />
                      Subscription successful.
                    </div>
                  )}
                </div>
              </form>

            </div>

            <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl p-6 border border-blue-400/30">
              <h5 className="font-semibold mb-3 text-sm">Need Immediate Assistance?</h5>
              <motion.a
                href="tel:+254712345678"
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl text-sm font-semibold transition-colors hover:bg-blue-50 w-full justify-center"
              >
                <FiPhone className="text-blue-600" />
                Contact Support
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showTerms && (
          <motion.div key="terms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowTerms(false)} aria-hidden="true" />
            <motion.div initial={{ y: 20, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.98 }} role="dialog" aria-modal="true" className="relative bg-white text-gray-900 rounded-2xl max-w-3xl w-full p-6 mx-4 shadow-xl">
              <h3 className="text-xl font-bold mb-3">Terms of Service</h3>
              <div className="prose max-h-72 overflow-auto text-sm text-gray-700 mb-4">
                <p>Terms of service content goes here. Please replace with your actual terms.</p>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowTerms(false)} className="px-4 py-2 rounded-lg bg-gray-200">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}

     {showPrivacy && (
  <motion.div
    key="privacy"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
  >
    {/* Backdrop */}
    <div 
      className="absolute inset-0 bg-black/60 backdrop-blur-lg" 
      onClick={() => setShowPrivacy(false)} 
      aria-hidden="true" 
    />
    
    {/* Modal Container */}
    <motion.div
      initial={{ y: 20, scale: 0.98, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      exit={{ y: 20, scale: 0.98, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-policy-title"
      className="relative bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-3xl max-w-6xl w-full max-h-[90vh] shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-purple-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h1 id="privacy-policy-title" className="text-2xl font-bold">Privacy Policy & Terms of Service</h1>
              <p className="text-blue-100 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowPrivacy(false)}
            className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200"
            aria-label="Close privacy policy"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col lg:flex-row h-[calc(90vh-120px)]">
        {/* Navigation Sidebar */}
        <div className="lg:w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
          <nav className="space-y-2">
            <button
              onClick={() => document.getElementById('privacy-policy')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full text-left p-3 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              📄 Privacy Policy
            </button>
            <button
              onClick={() => document.getElementById('terms-of-service')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full text-left p-3 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              📝 Terms of Service
            </button>
            <button
              onClick={() => document.getElementById('data-collection')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full text-left p-3 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              🔍 Data Collection
            </button>
            <button
              onClick={() => document.getElementById('user-rights')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full text-left p-3 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              ⚖️ User Rights
            </button>
            <button
              onClick={() => document.getElementById('cookies')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full text-left p-3 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              🍪 Cookies Policy
            </button>
            <button
              onClick={() => document.getElementById('security')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full text-left p-3 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              🔒 Security Measures
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full text-left p-3 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              📞 Contact Information
            </button>
          </nav>
          
          {/* Quick Actions */}
          <div className="mt-8 p-4 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-sm mb-3 text-gray-800 dark:text-white">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full text-left p-2 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                Download PDF Version
              </button>
              <button className="w-full text-left p-2 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                Print Policy
              </button>
              <button className="w-full text-left p-2 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                Share Policy
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Privacy Policy Section */}
            <section id="privacy-policy" className="scroll-mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <span className="text-2xl">📄</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy Policy</h2>
              </div>
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  At Katwanyaa High School, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our administrative portal.
                </p>

                <div className="grid gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Information We Collect</h3>
                    <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                      <li>• Personal identification information (Name, email address, phone number)</li>
                      <li>• Academic records and performance data</li>
                      <li>• Attendance and behavioral records</li>
                      <li>• Medical information for emergency purposes</li>
                      <li>• Parent/guardian contact details</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6">
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3">How We Use Your Information</h3>
                    <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                      <li>• To provide and maintain educational services</li>
                      <li>• To communicate important school updates</li>
                      <li>• To monitor academic progress and attendance</li>
                      <li>• To ensure student safety and well-being</li>
                      <li>• To comply with legal and regulatory requirements</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Terms of Service Section */}
            <section id="terms-of-service" className="scroll-mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <span className="text-2xl">📝</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Terms of Service</h2>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Acceptable Use Policy</h3>
                  <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    <p>Users of the Katwanyaa High School administrative portal agree to:</p>
                    <ul className="space-y-2 ml-4">
                      <li>• Use the system only for legitimate educational purposes</li>
                      <li>• Maintain the confidentiality of login credentials</li>
                      <li>• Not attempt to access unauthorized data or systems</li>
                      <li>• Report any security vulnerabilities immediately</li>
                      <li>• Comply with all school policies and procedures</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Collection Section */}
            <section id="data-collection" className="scroll-mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <span className="text-2xl">🔍</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Collection & Processing</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-6">
                  <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3">Data We Collect</h4>
                  <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-200">
                    <li>• Student demographic information</li>
                    <li>• Academic performance records</li>
                    <li>• Attendance and disciplinary records</li>
                    <li>• Medical and health information</li>
                    <li>• Parent/guardian contact details</li>
                    <li>• System usage analytics</li>
                  </ul>
                </div>

                <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-2xl p-6">
                  <h4 className="font-semibold text-teal-900 dark:text-teal-100 mb-3">Legal Basis for Processing</h4>
                  <ul className="space-y-2 text-sm text-teal-800 dark:text-teal-200">
                    <li>• Performance of educational contracts</li>
                    <li>• Legal compliance requirements</li>
                    <li>• Legitimate educational interests</li>
                    <li>• Protection of vital interests</li>
                    <li>• User consent where applicable</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* User Rights Section */}
            <section id="user-rights" className="scroll-mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <span className="text-2xl">⚖️</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Rights</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: '👁️', title: 'Right to Access', desc: 'View your personal data' },
                  { icon: '✏️', title: 'Right to Rectification', desc: 'Correct inaccurate data' },
                  { icon: '🗑️', title: 'Right to Erasure', desc: 'Request data deletion' },
                  { icon: '⏸️', title: 'Right to Restrict', desc: 'Limit data processing' },
                  { icon: '📤', title: 'Data Portability', desc: 'Receive your data' },
                  { icon: '🚫', title: 'Right to Object', desc: 'Object to processing' }
                ].map((right, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">{right.icon}</div>
                    <h4 className="font-semibold text-sm mb-1 text-gray-900 dark:text-white">{right.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{right.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Cookies Policy */}
            <section id="cookies" className="scroll-mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <span className="text-2xl">🍪</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cookies Policy</h2>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3">Essential Cookies</h4>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Required for basic site functionality and security. These cannot be disabled.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3">Analytical Cookies</h4>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Help us understand how visitors interact with our website to improve user experience.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Security Measures */}
            <section id="security" className="scroll-mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <span className="text-2xl">🔒</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security Measures</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                  <h4 className="font-semibold text-red-900 dark:text-red-100 mb-3">Technical Safeguards</h4>
                  <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
                    <li>• End-to-end encryption</li>
                    <li>• Regular security audits</li>
                    <li>• Multi-factor authentication</li>
                    <li>• Secure data backups</li>
                    <li>• intrusion detection systems</li>
                  </ul>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-6">
                  <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-3">Organizational Measures</h4>
                  <ul className="space-y-2 text-sm text-indigo-800 dark:text-indigo-200">
                    <li>• Staff training on data protection</li>
                    <li>• Access control policies</li>
                    <li>• Regular policy reviews</li>
                    <li>• Incident response plans</li>
                    <li>• Data protection officer</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section id="contact" className="scroll-mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <span className="text-2xl">📞</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Information</h2>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Data Protection Officer</h4>
                    <p className="text-sm opacity-90">Email: dpo@katwanyaa.ac.ke</p>
                    <p className="text-sm opacity-90">Phone: +254 XXX XXX XXX</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">General Inquiries</h4>
                    <p className="text-sm opacity-90">Email: info@katwanyaa.ac.ke</p>
                    <p className="text-sm opacity-90">Phone: +254 XXX XXX XXX</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowPrivacy(false)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg"
              >
                I Understand & Accept
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowPrivacy(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300"
              >
                Close Policy
              </motion.button>
            </div>

            {/* Last Updated */}
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              <p>This policy was last updated on {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
)}

        {showSitemap && (
          <motion.div key="sitemap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowSitemap(false)} aria-hidden="true" />
            <motion.div initial={{ y: 20, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.98 }} role="dialog" aria-modal="true" className="relative bg-white text-gray-900 rounded-2xl max-w-3xl w-full p-6 mx-4 shadow-xl">
              <h3 className="text-xl font-bold mb-3">Sitemap</h3>
              <div className="prose max-h-72 overflow-auto text-sm text-gray-700 mb-4">
                <ul className="list-disc pl-5">
                  <li><a href="/pages/AboutUs" className="text-blue-600">About</a></li>
                  <li><a href="/pages/admissions" className="text-blue-600">Admissions</a></li>
                  <li><a href="/pages/academics" className="text-blue-600">Academics</a></li>
                  <li><a href="/pages/eventsandnews" className="text-blue-600">News & Events</a></li>

                </ul>

              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowSitemap(false)} className="px-4 py-2 rounded-lg bg-gray-200">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-gray-300 text-sm text-center sm:text-left">
              <span>© {currentYear} Katwanyaa High School. All rights reserved.</span>
              <div className="flex gap-4">
                <button onClick={() => setShowSitemap(true)} className="hover:text-white transition-colors text-sm">Sitemap</button>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 text-gray-300 text-sm">
              <span>Empowering future leaders with</span>
              <FiHeart className="text-red-400 animate-pulse" />
            </motion.div>
          </div>

          <div className="mt-4 text-center text-xs text-gray-400">
            Designed and developed by Emmanuell Makau — 073472960
          </div>
        </div>
      </div>
    </footer>
  );
}