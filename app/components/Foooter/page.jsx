'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiHome,
  FiBook,
  FiUsers,
  FiCalendar,
  FiImage,
  FiUserCheck,
  FiBookOpen,
  FiHelpCircle,
  FiGlobe,
  FiLock,
  FiShield,
  FiAward,
  FiTarget,
  FiBriefcase,
  FiActivity,
  FiUserPlus,
  FiBell,
  FiCheckCircle,
  FiDownload,
  FiEye
} from 'react-icons/fi';
import { 
  SiFacebook, 
  SiX,
  SiYoutube, 
  SiLinkedin, 
  SiWhatsapp 
} from 'react-icons/si';

export default function ModernFooter() {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showSitemap, setShowSitemap] = useState(false);
  const currentYear = new Date().getFullYear();

  // Quick Links
  const quickLinks = [
    { name: 'Home', href: '/', icon: FiHome },
    { name: 'About Us', href: '/pages/AboutUs', icon: FiUsers },
    { name: 'Academics', href: '/pages/academics', icon: FiBook },
    { name: 'Admissions', href: '/pages/admissions', icon: FiUserCheck },
    { name: 'Gallery', href: '/pages/gallery', icon: FiImage },
    { name: 'News & Events', href: '/pages/eventsandnews', icon: FiCalendar },
    { name: 'Contact', href: '/pages/contact', icon: FiPhone },
    { name: 'Careers', href: '/pages/careers', icon: FiBriefcase },
  ];

  // Resources
  const resources = [
    { name: 'Student Portal', href: '/pages/StudentPortal', icon: FiBookOpen },
    { name: 'Apply Now', href: '/pages/apply-for-admissions', icon: FiUserPlus },
    { name: 'Guidance & Counselling', href: '/pages/Guidance-and-Councelling', icon: FiHelpCircle },
    { name: 'Staff Directory', href: '/pages/staff', icon: FiUsers },
    { name: 'Admin Login', href: '/pages/adminLogin', icon: FiLock },
    { name: 'School Policies', href: '/pages/TermsandPrivacy', icon: FiShield },
  ];

  // Social Media Links
  const socialLinks = [
    {
      icon: SiFacebook,
      href: 'https://facebook.com/maryimmaculategirls',
      label: 'Facebook'
    },
    {
      icon: SiX,
      href: 'https://twitter.com/maryimmaculategirls',
      label: 'Twitter'
    },
    {
      icon: SiYoutube,
      href: 'https://youtube.com/maryimmaculategirls',
      label: 'YouTube'
    },
    {
      icon: SiLinkedin,
      href: 'https://linkedin.com/school/maryimmaculategirls',
      label: 'LinkedIn'
    },
    {
      icon: SiWhatsapp,
      href: 'https://wa.me/254720123456',
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
      detail: 'Along Mweiga Nyahururu Road'
    },
    {
      icon: FiPhone,
      text: '+254 720 123 456',
      href: 'tel:+254720123456',
      detail: 'Main Office Line'
    },
    {
      icon: FiPhone,
      text: '+254 734 567 890',
      href: 'tel:+254734567890',
      detail: 'Admissions Office'
    },
    {
      icon: FiMail,
      text: 'info@maryimmaculate.sc.ke',
      href: 'mailto:info@maryimmaculate.sc.ke',
      detail: 'General Inquiries'
    },
    {
      icon: FiMail,
      text: 'admissions@maryimmaculate.sc.ke',
      href: 'mailto:admissions@maryimmaculate.sc.ke',
      detail: 'Admissions'
    },
    {
      icon: FiClock,
      text: 'Mon - Fri: 7:30 AM - 5:00 PM',
      href: '#',
      detail: 'Sat: 8:00 AM - 1:00 PM'
    }
  ];

  // Achievements
  const achievements = [
    'Top Performing School in Nyeri County',
    'Excellence in Science & Mathematics',
    '95% University Placement Rate',
    'Sports Excellence Award 2023',
  ];

  return (
    <footer className="w-full bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Grid Layout - Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full">
            
            {/* Column 1: School Information */}
            <div className="space-y-4 min-w-0">
              <div className="flex items-start gap-3 flex-wrap md:flex-nowrap">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-white flex-shrink-0">
                  <img 
                    src="/ll.png" 
                    alt="Mary Immaculate Girls Secondary School Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg lg:text-xl font-black text-white leading-snug break-words">
                    Mary Immaculate Girls Secondary
                  </h3>
                  <p className="text-white text-sm font-semibold flex items-center gap-1 mt-1 flex-wrap">
                    <FiTarget className="text-white flex-shrink-0 w-4 h-4" />
                    <span className="break-words">Prayer, Discipline & Hardwork</span>
                  </p>
                </div>
              </div>

              <p className="text-white text-sm sm:text-base font-medium leading-relaxed break-words">
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
                      className="flex items-start gap-3 text-white hover:text-gray-300 transition-colors text-sm sm:text-base font-semibold group break-words"
                    >
                      <ItemIcon className="mt-1 flex-shrink-0 text-lg group-hover:scale-110 transition-transform" /> 
                      <div className="min-w-0">
                        <span className="block break-words">{item.text}</span>
                        {item.detail && (
                          <p className="text-sm text-gray-300 font-normal break-words">{item.detail}</p> 
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-4 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <FiGlobe className="text-white text-lg sm:text-xl flex-shrink-0" />
                <h4 className="text-base sm:text-lg lg:text-xl font-black text-white break-words">Quick Links</h4>
              </div>
              <div className="space-y-2">
                {quickLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <a 
                      key={index} 
                      href={link.href} 
                      className="flex items-center gap-3 text-white hover:text-gray-300 transition-all text-sm sm:text-base font-semibold group hover:translate-x-1 break-words"
                    >
                      <Icon className="flex-shrink-0 text-lg group-hover:scale-125 transition-transform" />
                      <span className="break-words">{link.name}</span>
                    </a>
                  );
                })}
              </div>

              {/* Achievements */}
              <div className="mt-6 pt-6 border-t border-gray-700 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <FiAward className="text-white text-lg flex-shrink-0" />
                  <h4 className="text-sm sm:text-base lg:text-lg font-black text-white break-words">Achievements</h4>
                </div>
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-2 text-white text-sm font-semibold break-words">
                    <FiCheckCircle className="flex-shrink-0 text-lg mt-0.5" />
                    <span className="break-words">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Resources */}
            <div className="space-y-4 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <FiActivity className="text-white text-lg sm:text-xl flex-shrink-0" />
                <h4 className="text-base sm:text-lg lg:text-xl font-black text-white break-words">Resources</h4>
              </div>
              <div className="space-y-2">
                {resources.map((resource, index) => {
                  const Icon = resource.icon;
                  return (
                    <a
                      key={index}
                      href={resource.href}
                      className="flex items-center gap-3 text-white hover:text-gray-300 transition-all text-sm sm:text-base font-semibold group hover:translate-x-1 break-words"
                    >
                      <Icon className="flex-shrink-0 text-lg group-hover:scale-125 transition-transform" />
                      <span className="break-words">{resource.name}</span>
                    </a>
                  );
                })}
              </div>

              {/* Social Media */}
              <div className="mt-6 pt-6 border-t border-gray-700 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <FiUsers className="text-white text-lg flex-shrink-0" />
                  <h5 className="text-sm sm:text-base lg:text-lg font-black text-white break-words">Connect With Us</h5>
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
                        className="w-12 h-12 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all transform hover:scale-125 border border-white/30 flex-shrink-0"
                        aria-label={social.label}
                      >
                        <SocialIcon className="text-xl text-white" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Column 4: Newsletter */}
            <div className="space-y-4 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <FiBell className="text-white text-lg sm:text-xl flex-shrink-0" />
                <h4 className="text-base sm:text-lg lg:text-xl font-black text-white break-words">Stay Updated</h4>
              </div>
              
              {/* Newsletter Subscription */}
              <div className="bg-slate-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-5 flex-wrap">
                  <div className="p-3 bg-blue-600 rounded-lg flex-shrink-0">
                    <FiBell className="text-white text-lg" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base sm:text-lg font-black text-white break-words">Newsletter</h4>
                    <p className="text-white text-sm font-semibold break-words">Get academic events & announcements</p>
                  </div>
                </div>

                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-lg flex-shrink-0" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-gray-800 border-2 border-gray-700 hover:border-gray-600 focus:border-blue-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm sm:text-base font-semibold"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-black text-sm sm:text-base transition-all disabled:cursor-not-allowed hover:scale-105 active:scale-95 transform"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Subscribing...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <FiCheckCircle className="text-lg" />
                        <span>Subscribe</span>
                      </span>
                    )}
                  </button>
                </form>

                {/* Success Message */}
                {showSuccess && (
                  <div className="mt-4 p-4 bg-emerald-600/30 border border-emerald-500 rounded-lg animate-pulse">
                    <div className="flex items-center gap-3 flex-wrap">
                      <FiCheckCircle className="text-emerald-300 text-lg flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-emerald-300 font-black text-sm sm:text-base break-words">Successfully subscribed!</p>
                        <p className="text-emerald-200 text-sm font-semibold break-words">You'll receive updates soon.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="mt-12 lg:mt-16 pt-8 border-t border-gray-700">
            <div className="flex flex-col gap-6 w-full">
              <div className="text-white text-sm font-semibold text-center break-words">
                <p>© {currentYear} Mary Immaculate Girls Secondary School, Mweiga, Nyeri. All rights reserved.</p>
              </div>

              <div className="flex items-center gap-6 text-sm font-semibold flex-wrap justify-center">
                <button 
                  onClick={() => setShowSitemap(true)} 
                  className="text-white hover:text-gray-300 transition-colors flex items-center gap-2 hover:scale-110 whitespace-nowrap flex-shrink-0"
                >
                  <FiGlobe className="text-lg" />
                  <span className="break-words">Sitemap</span>
                </button>
                <button 
                  onClick={() => setShowPrivacy(true)} 
                  className="text-white hover:text-gray-300 transition-colors flex items-center gap-2 hover:scale-110 whitespace-nowrap flex-shrink-0"
                >
                  <FiShield className="text-lg" />
                  <span className="break-words">Terms & Privacy</span>
                </button>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-white font-semibold break-words">
              <p>Accredited by the Ministry of Education • KNEC Centre Code: 12345678</p>
              <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
                <span>Empowering Future Leaders with</span>
                <span className="text-lg">❤️</span>
                <span>since 1995</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div 
            className="absolute inset-0 bg-black/80" 
            onClick={() => setShowPrivacy(false)} 
          />
          <div className="relative bg-slate-900 text-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700 p-6 sm:p-8 my-auto">
            <div className="flex justify-between items-start gap-3 mb-6 flex-wrap">
              <div className="flex items-center gap-3 min-w-0">
                <FiShield className="text-2xl text-white flex-shrink-0" />
                <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-white break-words">Privacy Policy & Terms</h2>
              </div>
              <button 
                onClick={() => setShowPrivacy(false)} 
                className="text-2xl text-white hover:text-gray-300 transition-colors font-bold flex-shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <section className="bg-slate-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg sm:text-xl font-black text-white mb-3 flex items-center gap-2 break-words">
                  <FiShield className="flex-shrink-0" />
                  Privacy Commitment
                </h3>
                <p className="text-white text-sm sm:text-base font-semibold break-words leading-relaxed">
                  At Mary Immaculate Girls Secondary, we are committed to protecting the privacy and security 
                  of all personal information collected from students, parents, staff, and visitors in compliance 
                  with the Data Protection Act, 2019.
                </p>
              </section>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-base sm:text-lg font-black text-white mb-3 flex items-center gap-2 break-words">
                    <FiEye className="flex-shrink-0" />
                    Information Collection
                  </h3>
                  <ul className="space-y-2 text-white text-sm font-semibold">
                    <li className="flex items-start gap-2 break-words">
                      <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0 mt-1.5"></div>
                      <span>Student academic and personal records</span>
                    </li>
                    <li className="flex items-start gap-2 break-words">
                      <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0 mt-1.5"></div>
                      <span>Parent/guardian contact information</span>
                    </li>
                    <li className="flex items-start gap-2 break-words">
                      <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0 mt-1.5"></div>
                      <span>Staff employment and qualification data</span>
                    </li>
                    <li className="flex items-start gap-2 break-words">
                      <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0 mt-1.5"></div>
                      <span>Medical information for emergency purposes</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-base sm:text-lg font-black text-white mb-3 flex items-center gap-2 break-words">
                    <FiDownload className="flex-shrink-0" />
                    Data Protection
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['🔐 Encrypted', '🛡️ Secure', '📊 Audits', '👩‍🏫 Training'].map((item, index) => (
                      <div key={index} className="bg-slate-900 rounded-lg p-3 text-center border border-gray-700 break-words">
                        <div className="text-lg mb-1">{item.split(' ')[0]}</div>
                        <div className="text-sm font-bold text-white break-words">{item.split(' ')[1]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button 
                  onClick={() => setShowPrivacy(false)} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-black text-sm sm:text-base hover:scale-105 transition-all"
                >
                  I Understand & Accept
                </button>
                <button 
                  onClick={() => setShowPrivacy(false)} 
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-black text-sm sm:text-base hover:scale-105 transition-all"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div 
            className="absolute inset-0 bg-black/80" 
            onClick={() => setShowSitemap(false)} 
          />
          <div className="relative bg-slate-900 text-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700 p-6 sm:p-8 my-auto">
            <div className="flex justify-between items-start gap-3 mb-6 flex-wrap">
              <div className="flex items-center gap-3 min-w-0">
                <FiGlobe className="text-2xl text-white flex-shrink-0" />
                <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-white break-words">Site Navigation</h2>
              </div>
              <button 
                onClick={() => setShowSitemap(false)} 
                className="text-2xl text-white hover:text-gray-300 transition-colors font-bold flex-shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {['Main Sections', 'Resources', 'Quick Links'].map((section, idx) => (
                <div key={idx}>
                  <h3 className="font-black text-white mb-4 text-base sm:text-lg border-b border-gray-700 pb-3 break-words">
                    {section}
                  </h3>
                  <div className="space-y-3">
                    {(section === 'Main Sections' ? quickLinks.slice(0, 4) : 
                      section === 'Resources' ? resources.slice(0, 4) : 
                      quickLinks.slice(4)).map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={index}
                          href={item.href}
                          className="flex items-center gap-2.5 p-3 rounded-lg hover:bg-gray-800 text-white hover:text-gray-100 transition-all group font-semibold text-sm sm:text-base hover:translate-x-1 break-words"
                          onClick={() => setShowSitemap(false)}
                        >
                          <Icon className="group-hover:scale-125 transition-transform flex-shrink-0" />
                          <span className="break-words">{item.name}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setShowSitemap(false)} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-black text-sm sm:text-base hover:scale-105 transition-all"
                >
                  Close Sitemap
                </button>
                <a
                  href="/pages/contact"
                  onClick={() => setShowSitemap(false)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-black text-sm sm:text-base hover:scale-105 transition-all text-center"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}