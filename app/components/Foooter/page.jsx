'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiSend,
  FiHeart,
  FiCheckCircle,
  FiHome,
  FiBook,
  FiUser,
  FiCalendar,
  FiImage,
  FiUserCheck,
  FiBookOpen,
  FiHelpCircle,
  FiGlobe,
  FiLock,
  FiEye,
  FiDownload,
  FiBell,
  FiShield,
  FiAward,
  FiTarget,
  FiUsers,
  FiFileText,
  FiBriefcase,
  FiActivity,
  FiUserPlus 
} from 'react-icons/fi';
import { 
  SiFacebook, 
  SiX,
  SiYoutube, 
  SiLinkedin, 
  SiWhatsapp 
} from 'react-icons/si';
import { motion } from 'framer-motion';

export default function ModernFooter() {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showSitemap, setShowSitemap] = useState(false);
  const currentYear = new Date().getFullYear();

  // Floating animation data - Updated to match orange theme
  const [floatingItems, setFloatingItems] = useState([
    { id: 1, icon: '🎓', x: 10, y: 20, delay: 0 },
    { id: 2, icon: '✨', x: 25, y: 60, delay: 0.5 },
    { id: 3, icon: '📚', x: 80, y: 40, delay: 1 },
    { id: 4, icon: '🏆', x: 65, y: 15, delay: 1.5 },
    { id: 5, icon: '💡', x: 40, y: 80, delay: 2 },
    { id: 6, icon: '🌟', x: 90, y: 70, delay: 2.5 }
  ]);

  // Quick Links - Updated with correct paths
  const quickLinks = [
    { name: 'Home', href: '/', icon: FiHome, color: 'text-amber-400' },
    { name: 'About Us', href: '/pages/AboutUs', icon: FiUsers, color: 'text-orange-400' },
    { name: 'Academics', href: '/pages/academics', icon: FiBook, color: 'text-red-400' },
    { name: 'Admissions', href: '/pages/admissions', icon: FiUserCheck, color: 'text-amber-300' },
    { name: 'Gallery', href: '/pages/gallery', icon: FiImage, color: 'text-orange-300' },
    { name: 'News & Events', href: '/pages/eventsandnews', icon: FiCalendar, color: 'text-red-300' },
    { name: 'Contact', href: '/pages/contact', icon: FiPhone, color: 'text-amber-200' },
    { name: 'Careers', href: '/pages/careers', icon: FiBriefcase, color: 'text-orange-200' },
  ];

  // Resources - Updated to match navbar structure
  const resources = [
    { name: 'Student Portal', href: '/pages/StudentPortal', icon: FiFileText, color: 'text-amber-400' },
    { name: 'Apply Now', href: '/pages/apply-for-admissions', icon: FiUserPlus, color: 'text-orange-400' },
    { name: 'Guidance & Counselling', href: '/pages/Guidance-and-Councelling', icon: FiHelpCircle, color: 'text-red-400' },
    { name: 'Staff Directory', href: '/pages/staff', icon: FiUsers, color: 'text-amber-300' },
    { name: 'Admin Login', href: '/pages/adminLogin', icon: FiLock, color: 'text-orange-300' },
    { name: 'School Policies', href: '/pages/TermsandPrivacy', icon: FiShield, color: 'text-red-300' },
  ];

  // Social Media Links
  const socialLinks = [
    {
      icon: SiFacebook,
      href: 'https://facebook.com/maryimmaculategirls',
      color: 'text-[#1877F2]',
      bgColor: 'bg-[#1877F2]/10',
      label: 'Facebook'
    },
    {
      icon: SiX,
      href: 'https://twitter.com/maryimmaculategirls',
      color: 'text-[#1DA1F2]',
      bgColor: 'bg-[#1DA1F2]/10',
      label: 'Twitter'
    },
    {
      icon: SiYoutube,
      href: 'https://youtube.com/maryimmaculategirls',
      color: 'text-[#FF0000]',
      bgColor: 'bg-[#FF0000]/10',
      label: 'YouTube'
    },
    {
      icon: SiLinkedin,
      href: 'https://linkedin.com/school/maryimmaculategirls',
      color: 'text-[#0077B5]',
      bgColor: 'bg-[#0077B5]/10',
      label: 'LinkedIn'
    },
    {
      icon: SiWhatsapp,
      href: 'https://wa.me/254720123456',
      color: 'text-[#25D366]',
      bgColor: 'bg-[#25D366]/10',
      label: 'WhatsApp'
    },
  ];

  // Newsletter states
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Newsletter handler
  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/subscriber', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          subscribedAt: new Date().toISOString(),
          source: 'footer-newsletter'
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowSuccess(true);
        setEmail('');
        
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
        
        toast.success('Successfully subscribed to newsletter!', {
          icon: '✅',
          duration: 3000,
        });
      } else {
        throw new Error(data.error || 'Subscription failed');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to subscribe. Please try again.', {
        icon: '❌',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Contact Information
  const contactInfo = [
    {
      icon: FiMapPin,
      text: 'Mweiga, Nyeri County, Kenya',
      href: 'https://maps.google.com/?q=-0.416667,36.950000',
      detail: 'Along Mweiga Nyahururu Road',
      color: 'text-amber-300'
    },
    {
      icon: FiPhone,
      text: '+254 720 123 456',
      href: 'tel:+254720123456',
      detail: 'Main Office Line',
      color: 'text-orange-300'
    },
    {
      icon: FiPhone,
      text: '+254 734 567 890',
      href: 'tel:+254734567890',
      detail: 'Admissions Office',
      color: 'text-red-300'
    },
    {
      icon: FiMail,
      text: 'info@maryimmaculate.sc.ke',
      href: 'mailto:info@maryimmaculate.sc.ke',
      detail: 'General Inquiries',
      color: 'text-amber-200'
    },
    {
      icon: FiMail,
      text: 'admissions@maryimmaculate.sc.ke',
      href: 'mailto:admissions@maryimmaculate.sc.ke',
      detail: 'Admissions',
      color: 'text-orange-200'
    },
    {
      icon: FiClock,
      text: 'Mon - Fri: 7:30 AM - 5:00 PM',
      href: '#',
      detail: 'Sat: 8:00 AM - 1:00 PM',
      color: 'text-red-200'
    }
  ];

  // Achievements
  const achievements = [
    { text: 'Top Performing School in Nyeri County', color: 'text-amber-300' },
    { text: 'Excellence in Science & Mathematics', color: 'text-orange-300' },
    { text: '95% University Placement Rate', color: 'text-red-300' },
    { text: 'Sports Excellence Award 2023', color: 'text-amber-200' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-amber-700 via-orange-700 to-red-700 text-white overflow-hidden">
      
      {/* Background Pattern - Matching PortalHeader */}
      <div className="absolute inset-0 opacity-[0.08] sm:opacity-[0.1] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,_rgba(255,255,255,0.15)_1px,_transparent_0)] 
          bg-[size:20px_20px] sm:bg-[size:24px_24px] md:bg-[size:28px_28px]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/10 to-red-400/5" />
      </div>
      
      {/* Glow Effects - Matching PortalHeader */}
      <div className="absolute -right-8 -top-8 
        w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 
        bg-gradient-to-r from-amber-300 to-orange-400 rounded-full opacity-15 sm:opacity-20 blur-xl md:blur-2xl animate-pulse" />
      
      <div className="absolute -left-10 -bottom-10
        w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 
        bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-10 sm:opacity-15 blur-lg sm:blur-xl" />

      {/* Floating Educational Items Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingItems.map((item) => (
          <motion.div
            key={item.id}
            className="absolute text-2xl opacity-10"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 6,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          
          {/* Column 1: School Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-white/30 shadow-xl">
                <img 
                  src="/ll.png" 
                  alt="Mary Immaculate Girls Secondary School Logo" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              </div>
              <div>
                <h3 className="text-xl font-black bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent">
                  Mary Immaculate Girls Secondary
                </h3>
                <p className="text-amber-200 text-base flex items-center gap-1">
                  <FiTarget className="text-amber-300" />
                  Prayer, Discipline and Hardwork
                </p>
              </div>
            </div>

            <p className="text-amber-100/90 text-base leading-relaxed backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10">
              A premier learning institution in Mweiga, Nyeri, dedicated to academic excellence, 
              holistic development, and nurturing future women leaders through quality education since 1995.
            </p>

            <div className="space-y-3">
              {contactInfo.slice(0, 3).map((item, index) => {
                const ItemIcon = item.icon;
                return (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-start gap-4 text-amber-100/80 hover:text-white transition-colors text-base group p-3 rounded-lg hover:bg-white/5 backdrop-blur-sm"
                  >
                    <ItemIcon className={`${item.color} mt-1 flex-shrink-0 text-lg`} /> 
                    <div>
                      <span className="font-medium">{item.text}</span>
                      {item.detail && (
                        <p className="text-sm text-amber-200/60">{item.detail}</p> 
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <FiGlobe className="text-orange-300 text-xl" />
              <h4 className="text-lg font-bold text-white">Quick Links</h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <a 
                    key={index} 
                    href={link.href} 
                    className="flex items-center gap-3 text-amber-100/80 hover:text-white transition-all text-base p-3 rounded-xl hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/30 group"
                  >
                    <Icon className={`${link.color} flex-shrink-0 text-lg group-hover:scale-110 transition-transform`} />
                    <span className="font-medium">{link.name}</span>
                  </a>
                );
              })}
            </div>

            {/* Achievements */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <FiAward className="text-amber-300" />
                <h4 className="text-md font-bold text-white">Recent Achievements</h4>
              </div>
              {achievements.map((achievement, index) => (
                <div key={index} className={`flex items-center gap-2 text-sm ${achievement.color} p-2 rounded-lg bg-white/5 backdrop-blur-sm`}>
                  <FiCheckCircle className="flex-shrink-0" />
                  <span>{achievement.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <FiActivity className="text-red-300 text-xl" />
              <h4 className="text-lg font-bold text-white">Resources</h4>
            </div>
            <div className="space-y-2">
              {resources.map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <a
                    key={index}
                    href={resource.href}
                    className="flex items-center gap-3 text-amber-100/80 hover:text-white transition-all text-base p-3 rounded-xl hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/30 group"
                  >
                    <Icon className={`${resource.color} flex-shrink-0 text-lg group-hover:scale-110 transition-transform`} />
                    <span className="font-medium">{resource.name}</span>
                  </a>
                );
              })}
            </div>

            {/* Social Media */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2">
                <FiUsers className="text-amber-300" />
                <h5 className="text-md font-bold text-white">Connect With Us</h5>
              </div>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => {
                  const SocialIcon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`
                        w-14 h-14 rounded-xl flex items-center justify-center 
                        transition-all duration-300 transform hover:scale-110 hover:-translate-y-1
                        ${social.bgColor} backdrop-blur-sm border border-white/20
                        hover:border-white/40 hover:shadow-lg
                      `}
                      aria-label={social.label}
                    >
                      <SocialIcon 
                        className={`text-2xl ${social.color}`} 
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <FiBell className="text-amber-300 text-xl" />
              <h4 className="text-lg font-bold text-white">Stay Updated</h4>
            </div>
            
            {/* Newsletter Subscription */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-red-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl shadow-amber-900/20">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl">
                    <FiBell className="text-white text-lg" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Newsletter</h4>
                    <p className="text-amber-200/80 text-md">Get academic events & announcements</p>
                  </div>
                </div>

                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-300 text-lg" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-amber-200/50 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/20 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className="group relative w-full overflow-hidden bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3.5 rounded-xl font-bold text-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Subscribing...
                        </>
                      ) : (
                        <>
                          <FiCheckCircle className="text-lg" />
                          Subscribe 
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* Success Message */}
                {showSuccess && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl backdrop-blur-sm animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/30 rounded-lg">
                        <FiCheckCircle className="text-emerald-300 text-lg" />
                      </div>
                      <div>
                        <p className="text-emerald-300 font-medium">Successfully subscribed!</p>
                        <p className="text-emerald-200/80 text-md">You'll receive updates soon.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 pt-6 border-t border-white/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-amber-200/80 text-md text-center md:text-left">
              <p>© {currentYear} Mary Immaculate Girls Secondary School, Mweiga, Nyeri. All rights reserved.</p>
            </div>

            <div className="flex items-center gap-4 text-md">
              <button 
                onClick={() => setShowSitemap(true)} 
                className="text-amber-200/80 hover:text-white transition-colors flex items-center gap-2"
              >
                <FiGlobe />
                Sitemap
              </button>
              <button 
                onClick={() => setShowPrivacy(true)} 
                className="text-amber-200/80 hover:text-white transition-colors flex items-center gap-2"
              >
                <FiShield />
                Terms & Privacy
              </button>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-amber-200/60">
            <p>Accredited by the Ministry of Education • KNEC Centre Code: 12345678</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span>Empowering Future Leaders with</span>
              <FiHeart className="text-red-400 animate-pulse" />
              <span>since 1995</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setShowPrivacy(false)} 
            aria-hidden="true" 
          />
          <div className="relative bg-gradient-to-b from-white to-amber-50 text-gray-900 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-amber-100">
            <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <FiShield className="text-lg" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Privacy Policy & Terms of Service</h2>
                    <p className="text-amber-100 text-md">Mary Immaculate Girls Secondary</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPrivacy(false)} 
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors text-xl"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
                <h3 className="text-lg font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <FiShield className="text-amber-600" />
                  Privacy Commitment
                </h3>
                <p className="text-amber-800 text-md">
                  At Mary Immaculate Girls Secondary, we are committed to protecting the privacy and security 
                  of all personal information collected from students, parents, staff, and visitors in compliance 
                  with the Data Protection Act, 2019.
                </p>
              </section>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
                  <h3 className="text-lg font-bold text-amber-900 mb-3 flex items-center gap-2">
                    <FiEye className="text-amber-600" />
                    Information Collection
                  </h3>
                  <ul className="space-y-2 text-amber-800 text-md">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      Student academic and personal records
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      Parent/guardian contact information
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      Staff employment and qualification data
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      Medical information for emergency purposes
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
                  <h3 className="text-lg font-bold text-orange-900 mb-3 flex items-center gap-2">
                    <FiDownload className="text-orange-600" />
                    Data Protection
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['🔐 Encrypted Storage', '🛡️ Access Control', '📊 Regular Audits', '👩‍🏫 Staff Training'].map((item, index) => (
                      <div key={index} className="bg-white/80 rounded-lg p-3 text-center">
                        <div className="text-lg mb-1">{item.split(' ')[0]}</div>
                        <div className="text-sm font-medium text-orange-800">{item.split(' ').slice(1).join(' ')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button 
                  onClick={() => setShowPrivacy(false)} 
                  className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  I Understand & Accept
                </button>
                <button 
                  onClick={() => setShowPrivacy(false)} 
                  className="flex-1 bg-amber-100 text-amber-700 py-3 rounded-lg font-semibold hover:bg-amber-200 transition-colors"
                >
                  Close Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sitemap Modal */}
      {showSitemap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setShowSitemap(false)} 
            aria-hidden="true" 
          />
          <div className="relative bg-gradient-to-b from-white to-amber-50 text-gray-900 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-amber-100">
            <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <FiGlobe className="text-lg" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Site Navigation</h2>
                    <p className="text-amber-100 text-md">Mary Immaculate Girls Secondary</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSitemap(false)} 
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors text-xl"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {['Main Sections', 'Resources', 'Quick Links'].map((section, idx) => (
                  <div key={idx}>
                    <h3 className="font-bold text-amber-900 mb-3 text-lg border-b border-amber-200 pb-2">
                      {section}
                    </h3>
                    <div className="space-y-2">
                      {(section === 'Main Sections' ? quickLinks.slice(0, 4) : 
                        section === 'Resources' ? resources.slice(0, 4) : 
                        quickLinks.slice(4)).map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <a
                            key={index}
                            href={item.href}
                            className="flex items-center gap-2 p-3 rounded-lg hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 text-amber-800 hover:text-orange-600 transition-all group"
                            onClick={() => setShowSitemap(false)}
                          >
                            <Icon className={`${item.color} group-hover:scale-110 transition-transform`} />
                            <span className="font-medium">{item.name}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-amber-200">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => setShowSitemap(false)} 
                    className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    Close Sitemap
                  </button>
                  <a
                    href="/pages/contact"
                    onClick={() => setShowSitemap(false)}
                    className="flex-1 bg-amber-100 text-amber-700 py-3 rounded-lg font-semibold hover:bg-amber-200 transition-colors text-center"
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}