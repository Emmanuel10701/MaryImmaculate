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
  FiBell
} from 'react-icons/fi';
 import { 
  SiFacebook, 
SiX,           // Changed from SiTwitter  SiInstagram, 
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

  // Floating animation data
  const [floatingItems, setFloatingItems] = useState([
    { id: 1, icon: '📚', x: 10, y: 20, delay: 0 },
    { id: 2, icon: '✏️', x: 25, y: 60, delay: 0.5 },
    { id: 3, icon: '📖', x: 80, y: 40, delay: 1 },
    { id: 4, icon: '🎓', x: 65, y: 15, delay: 1.5 },
    { id: 5, icon: '📝', x: 40, y: 80, delay: 2 },
    { id: 6, icon: '🔬', x: 90, y: 70, delay: 2.5 }
  ]);

  const quickLinks = [
    { name: 'About Us', href: '/pages/AboutUs', icon: FiHome, color: 'text-amber-500' },
    { name: 'Academics', href: '/pages/admissions', icon: FiBook, color: 'text-orange-500 0 0 0 0 0 0 0 ' },
    { name: 'Admissions', href: '/pages/admissions', icon: FiUserCheck, color: 'text-red-500' },
    { name: 'Careers', href: '/pages/careers', icon: FiBookOpen, color: 'text-yellow-500' },
    { name: 'Staff', href: '/pages/staff', icon: FiUser, color: 'text-amber-400' },
    { name: 'Contact', href: '/pages/contact', icon: FiPhone, color: 'text-orange-400' },
    { name: 'Gallery', href: '/pages/gallery', icon: FiImage, color: 'text-red-400' },
    { name: 'News & Events', href: '/pages/eventsandnews', icon: FiCalendar, color: 'text-yellow-400' },
  ];

  const resources = [
    { name: 'Student Portal', href: '/pages/StudentPortal', icon: FiHelpCircle, color: 'text-amber-400' },
    { name: 'School Policies', href: '/pages/TermsandPrivacy', icon: FiLock, color: 'text-orange-400' },
    { name: 'Library Resources', href: '/pages/StudentPortal', icon: FiBookOpen, color: 'text-red-400' },
    { name: 'Apply Now', href: '/pages/apply-for-admissions', icon: FiGlobe, color: 'text-yellow-400' },
    { name: 'Student Guidance', href: '/pages/Guidance-and-Councelling', icon: FiUserCheck, color: 'text-amber-300' },
  ];



const socialLinks = [
  {
    icon: SiFacebook,
    href: 'https://facebook.com/katwanyaahighschool',
    color: 'text-[#1877F2]', // Official Facebook Blue
    bgColor: 'bg-[#1877F2]/10',
    label: 'Facebook'
  },
  {
    icon: SiX,
    href: 'https://twitter.com/katwanyaahighschool',
    color: 'text-[#1DA1F2]', // Official Twitter Blue
    bgColor: 'bg-[#1DA1F2]/10',
    label: 'Twitter'
  },
  {
    icon: SiYoutube,
    href: 'https://youtube.com/katwanyaahighschool',
    color: 'text-[#FF0000]', // Official YouTube Red
    bgColor: 'bg-[#FF0000]/10',
    label: 'YouTube'
  },
  {
    icon: SiLinkedin,
    href: 'https://linkedin.com/school/katwanyaahighschool',
    color: 'text-[#0077B5]', // Official LinkedIn Blue
    bgColor: 'bg-[#0077B5]/10',
    label: 'LinkedIn'
  },
  {
    icon: SiWhatsapp,
    href: 'https://wa.me/254720123456',
    color: 'text-[#25D366]', // Official WhatsApp Green
    bgColor: 'bg-[#25D366]/10',
    label: 'WhatsApp'
  },
];

  // Add these states near your other states
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Add this handler function
  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Call your API endpoint
      const response = await fetch('/api/subscriber', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          subscribedAt: new Date().toISOString(),
          source: 'guidance-portal'
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Success
        setShowSuccess(true);
        setEmail('');
        
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
        
        // Optional: Show a toast notification
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

  // Optional: Add email validation
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const contactInfo = [
    {
      icon: FiMapPin,
      text: 'Matungulu, Machakos County, Kenya',
      href: 'https://maps.google.com/?q=-0.416667,36.950000',
      detail: 'Along Matungulu Road',
      color: 'text-amber-400'
    },
    {
      icon: FiPhone,
      text: '+254 720 123 456',
      href: 'tel:+254720123456',
      detail: 'Office Line',
      color: 'text-orange-400'
    },
    {
      icon: FiPhone,
      text: '+254 734 567 890',
      href: 'tel:+254734567890',
      detail: 'Admissions Office',
      color: 'text-red-400'
    },
    {
      icon: FiMail,
      text: 'info@maryimmaculate.sc.ke',
      href: 'mailto:info@maryimmaculate.sc.ke',
      detail: 'General Inquiries',
      color: 'text-yellow-400'
    },
    {
      icon: FiMail,
      text: 'admissions@maryimmaculate.sc.ke',
      href: 'mailto:admissions@maryimmaculate.sc.ke',
      detail: 'Admissions',
      color: 'text-amber-300'
    },
    {
      icon: FiClock,
      text: 'Mon - Fri: 7:30 AM - 5:00 PM',
      href: '#',
      detail: 'Sat: 8:00 AM - 1:00 PM',
      color: 'text-orange-300'
    }
  ];

  const achievements = [
    { text: 'Top Performing schhool School in Matungulu', color: 'text-amber-300' },
    { text: 'Excellence in Science & Mathematics', color: 'text-orange-300' },
    { text: '95% University Placement Rate', color: 'text-red-300' },
    { text: 'Sports Excellence Award 2023', color: 'text-yellow-300' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-800 via-indigo-900 to-purple-900 bg-fixed  text-white overflow-hidden">
      
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
          
          {/* School Information - POSITION CHANGED: Now 2nd column */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg overflow-hidden">
                <img 
                  src="/katz.png" 
                  alt="Katwanyaa High  Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">Katwanyaa High school</h3>
                <p className="text-amber-300 text-base">Education is Light</p>
              </div>
            </div>

            <p className="text-gray-300 text-base leading-relaxed">
              A premier Mixed learning institution in Matungulu, Machakos, dedicated to academic excellence, 
              holistic development, and nurturing future women leaders through quality education.
            </p>

            <div className="space-y-3">
              {contactInfo.slice(0, 4).map((item, index) => {
                const ItemIcon = item.icon;
                return (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-start gap-4 text-gray-300 hover:text-white transition-colors text-base group" 
                  >
                    <ItemIcon className={`${item.color} mt-1 flex-shrink-0`} /> 
                    <div>
                      <span>{item.text}</span>
                      {item.detail && (
                        <p className="text-md text-gray-400">{item.detail}</p> 
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Resources - POSITION CHANGED: Now 1st column */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-amber-300">Resources</h4>
            <div className="space-y-2">
              {resources.map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <a
                    key={index}
                    href={resource.href}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-md p-2 rounded hover:bg-white/5"
                  >
                    <Icon className={`${resource.color} flex-shrink-0`} />
                    <span>{resource.name}</span>
                  </a>
                );
              })}
            </div>

            {/* Achievements */}
            <div className="mt-4 space-y-2">
              <h4 className="text-md font-semibold text-orange-300">Recent Achievements</h4>
              {achievements.map((achievement, index) => (
                <div key={index} className={`text-xs ${achievement.color} flex items-center gap-1`}>
                  <FiCheckCircle className="flex-shrink-0" />
                  <span>{achievement.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links - POSITION CHANGED: Now 3rd column */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-orange-300">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <a 
                    key={index} 
                    href={link.href} 
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-md p-2 rounded hover:bg-white/5"
                  >
                    <Icon className={`${link.color} flex-shrink-0`} />
                    <span>{link.name}</span>
                  </a>
                );
              })}
            </div>

          </div>

          {/* Newsletter & Social - POSITION CHANGED: Now 4th column (Subscribe moved here) */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-red-300">Stay Updated</h4>
            
            {/* Newsletter Subscription */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-amber-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl shadow-orange-900/20">
                {/* Header with icon */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                    <FiBell className="text-white text-lg" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Newsletter</h4>
                    <p className="text-amber-200/80 text-md">Get academic events & announcements</p>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-300 text-lg" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-amber-200/50 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className="group relative w-full overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 text-white py-3.5 rounded-xl font-bold text-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
{/* Social Media */}
<div className="space-y-3">
  <h5 className="text-md font-medium text-slate-300">Connect With Us</h5>
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
            transition-all duration-300 transform hover:scale-100 hover:-translate-y-1
            ${social.bgColor} 
          `}
          aria-label={social.label}
        >
          <SocialIcon 
            className={`text-2xl ${social.color}`} 
            style={{ color: social.color.startsWith('text-[#') ? social.color.replace('text-[', '').replace(']', '') : '' }}
          />
        </a>
      );
    })}
  </div>
</div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-300 text-md text-center md:text-left">
              <p>© {currentYear} Katwanyaa High school, Matungulu, Machakos. All rights reserved.</p>
            </div>

            <div className="flex items-center gap-4 text-md">
              <button 
                onClick={() => setShowSitemap(true)} 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sitemap
              </button>
              <button 
                onClick={() => setShowPrivacy(true)} 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Terms & Privacy
              </button>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-gray-400">
            <p>Accredited by the Ministry of Education • KNEC Centre Code: 12345678</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <span>Educating with passion and</span>
              <FiHeart className="text-red-400" />
              <span>since 1998</span>
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
          <div className="relative bg-white text-gray-900 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-red-700 text-white p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <FiLock className="text-lg" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Privacy Policy & Terms of Service</h2>
                    <p className="text-amber-100 text-md">Last updated: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPrivacy(false)} 
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FiEye className="text-orange-500 0 0 0 0 0 0 " />
                  Privacy Commitment
                </h3>
                <p className="text-gray-700 text-md">
                  At Katwanyaa High school, we are committed to protecting the privacy and security 
                  of all personal information collected from students, parents, staff, and visitors. 
                  This policy outlines our practices regarding data collection, usage, and protection 
                  in compliance with the Data Protection Act, 2019.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FiDownload className="text-orange-500 " />
                  Information Collection & Usage
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-md">
                  <div className="bg-amber-50 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-900 mb-2">Collected Information</h4>
                    <ul className="space-y-1 text-orange-800">
                      <li>• Student academic and personal records</li>
                      <li>• Parent/guardian contact information</li>
                      <li>• Staff employment and qualification data</li>
                      <li>• Medical information for emergency purposes</li>
                      <li>• Financial information for fee payment</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-900 mb-2">Purpose of Collection</h4>
                    <ul className="space-y-1 text-orange-800">
                      <li>• Academic administration and reporting</li>
                      <li>• Student safety and welfare monitoring</li>
                      <li>• Communication with parents and guardians</li>
                      <li>• Compliance with educational regulations</li>
                      <li>• School improvement and planning</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Data Protection Measures</h3>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-md">
                    <div className="text-center p-2 bg-white rounded">
                      <div className="text-lg">🔐</div>
                      <div className="font-medium text-red-800">Encrypted Storage</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded">
                      <div className="text-lg">🛡️</div>
                      <div className="font-medium text-red-800">Access Control</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded">
                      <div className="text-lg">📊</div>
                      <div className="font-medium text-red-800">Regular Audits</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded">
                      <div className="text-lg">👩‍🏫</div>
                      <div className="font-medium text-red-800">Staff Training</div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Contact Information</h3>
                <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-4 text-white">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Data Protection Officer</h4>
                      <p className="text-md opacity-90">Email: dpo@maryimmaculate.sc.ke</p>
                      <p className="text-md opacity-90">Phone: +254 720 123 456</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">General Inquiries</h4>
                      <p className="text-md opacity-90">Email: info@maryimmaculate.sc.ke</p>
                      <p className="text-md opacity-90">Phone: +254 734 567 890</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-md opacity-90">
                      Katwanyaa High school, Matungulu, Machakos County, Kenya
                    </p>
                  </div>
                </div>
              </section>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button 
                  onClick={() => setShowPrivacy(false)} 
                  className="flex-1 bg-gradient-to-r from-orange-600 to-red-700 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  I Understand & Accept
                </button>
                <button 
                  onClick={() => setShowPrivacy(false)} 
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Close Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Sitemap Modal */}
      {showSitemap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setShowSitemap(false)} 
            aria-hidden="true" 
          />
          <div className="relative bg-white text-gray-900 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-red-700 text-white p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <FiGlobe className="text-lg" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Complete Site Navigation</h2>
                    <p className="text-amber-100 text-md">Explore all sections of our website</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSitemap(false)} 
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg border-b pb-2">Main Sections</h3>
                  <div className="space-y-2">
                    {quickLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.href}
                        className="flex items-center gap-2 p-2 rounded hover:bg-amber-50 text-gray-700 hover:text-orange-600 transition-colors"
                        onClick={() => setShowSitemap(false)}
                      >
                        <link.icon className={link.color} />
                        <span>{link.name}</span>
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg border-b pb-2">Resources</h3>
                  <div className="space-y-2">
                    {resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.href}
                        className="flex items-center gap-2 p-2 rounded hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-colors"
                        onClick={() => setShowSitemap(false)}
                      >
                        <resource.icon className={resource.color} />
                        <span>{resource.name}</span>
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg border-b pb-2">Contact & Support</h3>
                  <div className="space-y-2">
                    {contactInfo.slice(0, 4).map((item, index) => (
                      <div key={index} className="p-2">
                        <div className="flex items-center gap-2 text-gray-700">
                          <item.icon className={item.color} />
                          <span className="font-medium">{item.text}</span>
                        </div>
                        {item.detail && (
                          <p className="text-xs text-gray-500 ml-6">{item.detail}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => setShowSitemap(false)} 
                    className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                  >
                    Close Sitemap
                  </button>
                  <a
                    href="/pages/contact"
                    onClick={() => setShowSitemap(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center"
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