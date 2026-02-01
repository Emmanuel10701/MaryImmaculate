'use client';
import React from 'react'; // Add this import at the very top
import { 
  useState, useEffect, useCallback, useMemo 
} from 'react';
import {
  FiCalendar, FiMessageSquare, FiMapPin, 
  FiClock, FiUsers, FiExternalLink, FiFilter,
  FiChevronRight, FiSearch, FiVideo, FiBookOpen,
  FiHome, FiFolder, FiBarChart2, FiX, FiUser,
  FiStar, FiAlertCircle, FiDownload, FiShare2,
  FiBell, FiBook, FiFileText, FiAward, FiMail,
  FiPhone, FiSave, FiPlus, FiTrash2, FiEdit,
  FiCheck, FiLoader, FiAlertTriangle, FiInfo,
  FiPrinter, FiCopy, FiLink, FiGlobe,FiPhoneCall, FiArrowRight, FiHeart  
} from 'react-icons/fi';
import { IoClose, IoCalendarClearOutline } from "react-icons/io5"; // or /io for v4

import { 
  FaBell, FaBars, FaChartBar, FaFolder, FaComments, 
  FaRocket, FaFire, FaBolt, FaCalendarCheck,
  FaSearch, FaTimes, FaSync, FaExclamationCircle, 
  FaCircleExclamation, FaCloudUpload,
  FaUserFriends, FaQuestionCircle, FaHome,
  FaGoogle, FaRegCalendarPlus
} from 'react-icons/fa';
import { HiSparkles as FaSparkles } from "react-icons/hi2";


import { HiSparkles } from "react-icons/hi2";
import { CircularProgress, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

// Helper functions for default sessions
const getNextThursday = () => {
  const today = new Date();
  const daysUntilThursday = (4 - today.getDay() + 7) % 7 || 7;
  const nextThursday = new Date(today);
  nextThursday.setDate(today.getDate() + daysUntilThursday);
  return nextThursday.toISOString().split('T')[0];
};

const getNextSunday = () => {
  const today = new Date();
  const daysUntilSunday = (0 - today.getDay() + 7) % 7 || 7;
  const nextSunday = new Date(today);
  nextSunday.setDate(today.getDate() + daysUntilSunday);
  return nextSunday.toISOString().split('T')[0];
};

// Default Devotion sessions (static, not from API)
const DEFAULT_SESSIONS = [
  {
    id: 'devotion-thursday',
    title: 'Thursday Devotion Session',
    counselor: 'School Chaplain',
    date: getNextThursday(),
    time: '10:00 AM - 11:00 AM',
    type: 'Spiritual Session',
    category: 'devotion',
    status: 'scheduled',
    description: 'Weekly devotion session to strengthen students in religious study and worship. Strengthen your faith and build spiritual resilience.',
    notes: 'Focus on spiritual growth and moral development. Bring your Bible and notebook.',
    priority: 'high',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
    featured: true,
    location: 'School Chapel'
  },
  {
    id: 'devotion-sunday',
    title: 'Sunday Youth Worship',
    counselor: 'Youth Leaders & CU',
    date: getNextSunday(),
    time: '2:00 PM - 4:00 PM',
    type: 'Youth Worship',
    category: 'worship',
    status: 'scheduled',
    description: 'Youth worship session with CU and YCS active worship groups. Experience powerful praise and worship with fellow students.',
    notes: 'Music, praise, and fellowship. All students welcome.',
    priority: 'high',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    featured: true,
    location: 'Mary Immculate Girls Church'
  }
];

// ==================== LOADING SPINNER ====================
function LoadingSpinner({ message = "Loading content..." }) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="relative">
            <CircularProgress 
              size={64} 
              thickness={5}
              className="text-blue-600"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full w-8 h-8"></div>
            </div>
          </div>
          <div className="absolute -inset-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full blur-xl opacity-30"></div>
        </div>
        
        <div className="mt-8 space-y-3">
          <span className="block text-lg font-semibold text-gray-800">
            {message}
          </span>
          <div className="flex justify-center space-x-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== TEAMS SECTION ====================
function TeamsSection({ teamMembers = [] }) {
  const [selectedMember, setSelectedMember] = useState(null);
  const [showTeamModal, setShowTeamModal] = useState(false);

  const getRoleGradient = (role) => {
    switch(role?.toLowerCase()) {
      case 'teacher':
        return 'from-blue-500 to-cyan-600';
      case 'matron':
        return 'from-purple-500 to-pink-600';
      case 'patron':
        return 'from-emerald-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getRoleLabel = (role) => {
    switch(role?.toLowerCase()) {
      case 'teacher':
        return 'Guidance Teacher';
      case 'matron':
        return 'Matron';
      case 'patron':
        return 'Patron';
      default:
        return 'Team Member';
    }
  };

  const handleViewMember = (member) => {
    setSelectedMember(member);
    setShowTeamModal(true);
  };

  return (
    <>
      <div className="mb-8 md:mb-12">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
            Guidance & Counseling Team
          </h2>
          <span className="px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-purple-100 to-pink-200 text-purple-800 text-xs md:text-sm font-bold rounded-full">
            {teamMembers.length} Members
          </span>
        </div>

        {teamMembers.length === 0 ? (
          <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 md:border-2 p-6 md:p-8 lg:p-12 text-center">
            <div className="text-gray-300 text-4xl md:text-5xl mx-auto mb-3 md:mb-4">
              <FiUsers />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-2">No Team Members</h3>
            <p className="text-gray-600 text-sm md:text-base">
              Team information will be available soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {teamMembers.map((member) => (
              <div key={member.id} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl md:rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative bg-white rounded-xl md:rounded-2xl border border-gray-200 md:border-2 overflow-hidden shadow-sm md:shadow-lg hover:shadow-md md:hover:shadow-xl transition-all duration-300 mobile-scroll-hide">
                  {/* Team Member Image */}
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    {member.image ? (
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-100"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gradient-to-r ${getRoleGradient(member.role)}">
                              <div class="text-white text-center p-4">
                                <FiUser class="text-4xl mx-auto mb-2" />
                                <p class="text-sm font-medium">${member.name?.split(' ')[0] || 'Member'}</p>
                              </div>
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-r ${getRoleGradient(member.role)}`}>
                        <div className="text-white text-center p-4">
                          <FiUser className="text-4xl mx-auto mb-2" />
                          <p className="text-sm font-medium">{member.name?.split(' ')[0] || 'Member'}</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 bg-gradient-to-r ${getRoleGradient(member.role)} text-white text-xs font-bold rounded-full`}>
                        {getRoleLabel(member.role)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-6 mobile-card-spacing">
                    {/* Team Member Info */}
                    <div className="mb-4 md:mb-5">
                      <h4 className="text-base md:text-lg font-bold text-gray-900 mb-1 md:mb-2 line-clamp-1 mobile-text-ellipsis">
                        {member.name}
                      </h4>
                      <p className="text-sm md:text-base text-gray-600 font-medium mb-2 line-clamp-2 mobile-text-ellipsis">
                        {member.title || getRoleLabel(member.role)}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-3 mobile-text-ellipsis">
                        {member.bio || 'Dedicated professional providing guidance and support to students.'}
                      </p>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="space-y-2 mb-4 md:mb-6">
                      {member.phone && (
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="p-1.5 md:p-2 bg-blue-50 rounded-lg flex-shrink-0">
                            <FiPhone className="text-blue-500 text-sm md:text-base" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs md:text-sm font-medium text-gray-900 truncate">
                              {member.phone}
                            </div>
                            <div className="text-xs text-gray-500">Phone</div>
                          </div>
                        </div>
                      )}
                      
                      {member.email && (
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="p-1.5 md:p-2 bg-purple-50 rounded-lg flex-shrink-0">
                            <FiMail className="text-purple-500 text-sm md:text-base" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs md:text-sm font-medium text-gray-900 truncate">
                              {member.email}
                            </div>
                            <div className="text-xs text-gray-500">Email</div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* View Button */}
                    <button
                      onClick={() => handleViewMember(member)}
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs md:text-sm font-bold rounded-lg md:rounded-xl hover:shadow-md md:hover:shadow-lg transition-all transform hover:-translate-y-0.5 mobile-touch-target"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Team Member Modal */}
      {showTeamModal && selectedMember && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border-2 border-gray-300 shadow-2xl mobile-full-width">
            {/* Header */}
            <div className={`p-4 md:p-6 text-white bg-gradient-to-r ${getRoleGradient(selectedMember.role)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                  <div className="p-2 md:p-3 bg-white/20 rounded-2xl flex-shrink-0">
                    <FiUser className="text-xl md:text-2xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg md:text-2xl font-bold truncate">
                      {selectedMember.name}
                    </h2>
                    <p className="opacity-90 text-sm md:text-base mt-1 truncate">
                      {selectedMember.title || getRoleLabel(selectedMember.role)}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowTeamModal(false)}
                  className="p-2 bg-white/20 rounded-2xl hover:bg-white/30 transition-colors ml-2 mobile-touch-target"
                >
                  <FaTimes className="text-lg md:text-xl" />
                </button>
              </div>
            </div>

            <div className="max-h-[calc(90vh-80px)] overflow-y-auto mobile-scroll-hide p-4 md:p-6 space-y-4 md:space-y-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
                  {selectedMember.image ? (
                    <img 
                      src={selectedMember.image} 
                      alt={selectedMember.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center bg-gradient-to-r ${getRoleGradient(selectedMember.role)}">
                            <div class="text-white text-center">
                              <FiUser class="text-3xl mx-auto mb-1" />
                              <p class="text-xs">${selectedMember.name?.split(' ')[0] || 'M'}</p>
                            </div>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-r ${getRoleGradient(selectedMember.role)}`}>
                      <div className="text-white text-center">
                        <FiUser className="text-3xl mx-auto mb-1" />
                        <p className="text-xs">{selectedMember.name?.split(' ')[0] || 'M'}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">{selectedMember.name}</h3>
                  <p className={`inline-block px-4 py-1.5 bg-gradient-to-r ${getRoleGradient(selectedMember.role)} text-white rounded-full text-sm font-bold mt-2`}>
                    {getRoleLabel(selectedMember.role)}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 md:p-6 border border-gray-300">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Contact Information</h3>
                <div className="space-y-3 md:space-y-4">
                  {selectedMember.phone && (
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="p-2 md:p-3 bg-blue-100 rounded-xl flex-shrink-0">
                        <FiPhone className="text-blue-600 text-lg md:text-xl" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700">Phone Number</p>
                        <p className="text-base md:text-lg font-bold text-gray-900 truncate">{selectedMember.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedMember.email && (
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="p-2 md:p-3 bg-purple-100 rounded-xl flex-shrink-0">
                        <FiMail className="text-purple-600 text-lg md:text-xl" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700">Email Address</p>
                        <p className="text-base md:text-lg font-bold text-gray-900 truncate">{selectedMember.email}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              {selectedMember.bio && (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 md:p-6 border border-blue-300">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">About</h3>
                  <div className="text-gray-700 whitespace-pre-line text-sm md:text-base leading-relaxed">
                    {selectedMember.bio}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => setShowTeamModal(false)}
                  className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl font-bold text-sm md:text-base hover:from-gray-200 hover:to-gray-300 transition-all mobile-touch-target"
                >
                  <FaTimes className="inline mr-2" />
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Custom CSS for mobile scrollbar hiding and responsive improvements
const mobileStyles = `
  @media (max-width: 768px) {
    /* Hide scrollbar for cards and modals but keep functionality */
    .mobile-scroll-hide::-webkit-scrollbar {
      display: none;
    }
    .mobile-scroll-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
      overflow: auto;
    }
    
    /* Improve touch targets on mobile */
    .mobile-touch-target {
      min-height: 44px;
      min-width: 44px;
    }
    
    /* Prevent text overflow on mobile */
    .mobile-text-ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    
    /* Better spacing for mobile cards */
    .mobile-card-spacing {
      padding: 1rem !important;
    }
    
    /* Stack elements vertically on mobile */
    .mobile-stack {
      flex-direction: column !important;
    }
    
    /* Full width on mobile */
    .mobile-full-width {
      width: 100% !important;
      max-width: 100% !important;
    }
    
    /* Responsive image container */
    .mobile-image-container {
      height: 180px !important;
    }
    
    /* Smaller text on mobile */
    .mobile-text-sm {
      font-size: 0.875rem !important;
      line-height: 1.25rem !important;
    }
    
    /* Better modal padding on mobile */
    .mobile-modal-padding {
      padding: 1rem !important;
    }
    
    /* Adjust grid for mobile */
    .mobile-grid-adjust {
      grid-template-columns: 1fr !important;
      gap: 0.75rem !important;
    }
    
    /* Compact form inputs on mobile */
    .mobile-form-compact .MuiFormControl-root {
      margin-bottom: 0.5rem !important;
    }
    
    /* Hide decorative elements on mobile */
    .mobile-hide-decorative {
      display: none !important;
    }
    
    /* Better button spacing */
    .mobile-button-spacing {
      margin-top: 0.5rem !important;
    }
  }
  
  /* Small screen specific adjustments (below 640px) */
  @media (max-width: 640px) {
    .xs-mobile-stack {
      flex-direction: column !important;
    }
    
    .xs-mobile-full {
      width: 100% !important;
    }
    
    .xs-mobile-text-xs {
      font-size: 0.75rem !important;
    }
    
    .xs-mobile-p-2 {
      padding: 0.5rem !important;
    }
  }
`;

// ==================== MODERN DETAIL MODAL ====================
function ModernDetailModal({ session, onClose, onContact }) {
  if (!session) return null;

  const getCategoryStyle = (category) => {
    const styles = {
      academic: { gradient: 'from-blue-500 to-cyan-500', icon: FiCalendar },
      emotional: { gradient: 'from-purple-500 to-pink-500', icon: FiMessageSquare },
      devotion: { gradient: 'from-indigo-500 to-purple-500', icon: FiStar },
      worship: { gradient: 'from-amber-500 to-orange-500', icon: FiStar },
      support: { gradient: 'from-emerald-500 to-green-500', icon: FiPhoneCall },
      drugs: { gradient: 'from-red-500 to-rose-500', icon: FiAlertTriangle }
    };
    return styles[category] || { gradient: 'from-slate-500 to-slate-600', icon: FiBookOpen };
  };

  const categoryStyle = getCategoryStyle(session.category);

  const formatFullDate = (dateString) => {
    if (dateString === 'Always Available' || dateString === 'Monday - Friday') {
      return dateString;
    }
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Calendar functionality
  const addToCalendar = () => {
    try {
      if (!session.date || session.date === 'Always Available' || session.date === 'Monday - Friday') {
        toast.error('Cannot add flexible schedules to calendar');
        return;
      }

      const startDate = new Date(session.date);
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 1); // Default 1 hour duration

      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(session.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(session.description)}&location=${encodeURIComponent(session.location || 'School Counseling Office')}`;
      
      window.open(googleCalendarUrl, '_blank');
      toast.success('Added to Google Calendar');
    } catch (error) {
      toast.error('Failed to add to calendar');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-900/90 backdrop-blur-sm">
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl bg-white sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-50 p-2 bg-black/20 backdrop-blur-md text-white rounded-full border border-white/20 transition-all active:scale-90 mobile-touch-target"
        >
          <IoClose size={20} />
        </button>

        {/* Hero Image */}
        <div className="relative h-[30vh] sm:h-[350px] w-full shrink-0">
          {session.image ? (
            <img
              src={session.image}
              alt={session.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-r ${categoryStyle.gradient}`} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
          
          {/* Badge Overlays */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex gap-2">
            <span className="px-3 py-1 sm:px-4 sm:py-1.5 bg-white shadow-xl rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest text-blue-600">
              {session.category || 'Counseling'}
            </span>
            {session.featured && (
              <span className="px-3 py-1 sm:px-4 sm:py-1.5 bg-slate-900 text-white rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest flex items-center gap-1">
                <HiSparkles className="text-amber-400 w-3 h-3 sm:w-4 sm:h-4" /> 
                <span className="hidden sm:inline">Featured</span>
                <span className="sm:hidden">★</span>
              </span>
            )}
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 bg-white">
          <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
            
            {/* Title & Category */}
            <section className="space-y-3 sm:space-y-4">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-col sm:flex-row">
                <div className={`p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-gradient-to-r ${categoryStyle.gradient}`}>
                  {React.createElement(categoryStyle.icon, { className: "text-white text-xl sm:text-2xl" })}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight tracking-tight">
                    {session.title}
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-lg mt-1">{session.type || 'Counseling Session'}</p>
                </div>
              </div>

              {/* Quick Info Bar - Responsive */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-y-2 sm:gap-y-3 gap-x-6 text-xs sm:text-sm font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-blue-500 text-base sm:text-lg" />
                  {formatFullDate(session.date)}
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="text-emerald-500 text-base sm:text-lg" />
                  {session.time || 'Flexible'}
                </div>
                <div className="flex items-center gap-2">
                  <FiUser className="text-purple-500 text-base sm:text-lg" />
                  {session.counselor || 'School Counselor'}
                </div>
                {session.location && (
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-rose-500 text-base sm:text-lg" />
                    {session.location}
                  </div>
                )}
              </div>
            </section>

            {/* Description Block */}
            <section className="space-y-3 sm:space-y-4">
              <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400">
                About this session
              </h3>
              <div className="text-slate-700 leading-relaxed text-sm sm:text-base md:text-lg">
                {session.description || 'Professional counseling and support session.'}
              </div>
              
              {/* Additional Notes */}
              {session.notes && (
                <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-slate-100 text-slate-600 text-xs sm:text-sm md:text-base whitespace-pre-line italic">
                  {session.notes}
                </div>
              )}
            </section>

            {/* Session Stats Grid - Reduced items for mobile */}
            <section className="grid grid-cols-2 gap-3 sm:gap-4 pt-4">
              <div className="p-3 sm:p-4 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-100">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <div className={`w-2 h-2 rounded-full ${
                    session.priority === 'high' ? 'bg-red-500' :
                    session.priority === 'medium' ? 'bg-amber-500' :
                    'bg-emerald-500'
                  }`} />
                  <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">Priority</p>
                </div>
                <p className="font-bold text-slate-900 text-xs sm:text-sm md:text-base capitalize">{session.priority || 'medium'}</p>
              </div>
              
              <div className="p-3 sm:p-4 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-100">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-xl ${
                  session.status === 'active' ? 'bg-emerald-100 text-emerald-600' :
                  session.status === 'completed' ? 'bg-blue-100 text-blue-600' :
                  'bg-amber-100 text-amber-600'
                } flex items-center justify-center mb-1 sm:mb-2`}>
                  <FiCalendar size={14} className="sm:w-4 sm:h-4" />
                </div>
                <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">Status</p>
                <p className="font-bold text-slate-900 text-xs sm:text-sm md:text-base capitalize">{session.status || 'scheduled'}</p>
              </div>
            </section>
          </div>
        </div>

        {/* Action Footer - Sticky at bottom */}
        <div className="shrink-0 p-4 sm:p-6 bg-slate-50/80 backdrop-blur-md border-t border-slate-100">
<div className="max-w-2xl mx-auto flex flex-row gap-2 sm:gap-3 px-1">
  <button
    onClick={addToCalendar}
    disabled={
      !session.date ||
      session.date === "Always Available" ||
      session.date === "Monday - Friday"
    }
    className="
      flex-1 min-w-0
      h-11 sm:h-14
      bg-slate-900 text-white
      rounded-xl sm:rounded-2xl
      font-semibold sm:font-bold
      text-[11px] sm:text-sm
      flex items-center justify-center gap-1.5 sm:gap-2
      active:scale-95 transition-all
      disabled:opacity-50 disabled:cursor-not-allowed
    "
  >
    <IoCalendarClearOutline className="shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
    <span className="truncate">Add to Calendar</span>
  </button>

  <button
    onClick={onClose}
    className="
      flex-1 min-w-0
      h-11 sm:h-14
      bg-white border-2 border-slate-200
      text-slate-900
      rounded-xl sm:rounded-2xl
      font-semibold sm:font-bold
      text-[11px] sm:text-sm
      flex items-center justify-center gap-1.5 sm:gap-2
      active:scale-95 transition-all
    "
  >
    <IoClose className="shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
    <span className="truncate">Close</span>
  </button>
</div>

        </div>
      </div>
    </div>
  );
}

// ==================== EMERGENCY MODAL COMPONENT ====================
function EmergencyModal({ student, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    emergencyType: '',
    description: '',
    urgency: 'medium',
    contactPhone: '',
    contactEmail: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  // Initialize form with student data if available
  useEffect(() => {
    if (student) {
      setFormData(prev => ({
        ...prev,
        contactEmail: student.email || '',
        contactPhone: student.phone || ''
      }));
    }
  }, [student]);

  const emergencyTypes = [
    { value: 'academic', label: 'Academic Emergency' },
    { value: 'health', label: 'Health/Medical Emergency' },
    { value: 'emotional', label: 'Emotional Crisis' },
    { value: 'safety', label: 'Safety Concern' },
    { value: 'family', label: 'Family Emergency' },
    { value: 'other', label: 'Other Emergency' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low Priority', color: 'from-green-500 to-green-600' },
    { value: 'medium', label: 'Medium Priority', color: 'from-amber-500 to-amber-600' },
    { value: 'high', label: 'High Priority', color: 'from-red-500 to-red-600' },
    { value: 'critical', label: 'Critical Emergency', color: 'from-red-600 to-red-800' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const emergencyData = {
        ...formData,
        studentId: student?.id,
        studentName: student?.fullName,
        studentForm: student?.form,
        studentStream: student?.stream,
        timestamp: new Date().toISOString()
      };

      const response = await fetch('/api/emergency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emergencyData)
      });

      const result = await response.json();

      if (result.success) {
        setSubmitSuccess(true);
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            emergencyType: '',
            description: '',
            urgency: 'medium',
            contactPhone: '',
            contactEmail: ''
          });
          setSubmitSuccess(false);
          onClose();
        }, 2000);
      } else {
        throw new Error(result.message || 'Failed to submit emergency');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4">
      <style jsx global>{mobileStyles}</style>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border-2 border-red-300 shadow-2xl mobile-full-width">
        {/* Header */}
        <div className="p-4 md:p-6 text-white bg-gradient-to-r from-red-500 to-pink-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-white/20 rounded-2xl">
                <FaExclamationCircle className="text-xl md:text-2xl" />
              </div>
              <div>
                <h2 className="text-lg md:text-2xl font-bold">Emergency Appointment</h2>
                <p className="opacity-90 text-sm md:text-base mt-1">Request immediate assistance</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-white/20 rounded-2xl hover:bg-white/30 transition-colors mobile-touch-target"
              disabled={submitting}
            >
              <FaTimes className="text-lg md:text-xl" />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(90vh-80px)] overflow-y-auto mobile-scroll-hide p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Student Info */}
          {student && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-300">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FiUser className="text-blue-500" />
                Student Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium ml-2">{student.fullName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Class:</span>
                  <span className="font-medium ml-2">Form {student.form} {student.stream}</span>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {submitSuccess && (
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-emerald-300 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <FiCheck className="text-emerald-600 text-xl" />
                <div>
                  <p className="font-bold text-emerald-800">Emergency request submitted successfully!</p>
                  <p className="text-emerald-700 text-sm mt-1">Our team will contact you shortly.</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-gradient-to-r from-red-100 to-pink-100 border border-red-300 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <FiAlertCircle className="text-red-600 text-xl" />
                <div>
                  <p className="font-bold text-red-800">Error: {error}</p>
                  <p className="text-red-700 text-sm mt-1">Please try again or contact support directly.</p>
                </div>
              </div>
            </div>
          )}

          {/* Emergency Form */}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 mobile-form-compact">
            {/* Emergency Type */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Emergency Type <span className="text-red-500">*</span>
              </label>
              <FormControl fullWidth variant="outlined" size="small">
                <Select
                  name="emergencyType"
                  value={formData.emergencyType}
                  onChange={handleChange}
                  required
                  displayEmpty
                  className="bg-white"
                >
                  <MenuItem value="" disabled>
                    <span className="text-gray-400">Select emergency type</span>
                  </MenuItem>
                  {emergencyTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Urgency Level */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Urgency Level
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {urgencyLevels.map(level => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => handleChange({ target: { name: 'urgency', value: level.value } })}
                    className={`p-2 rounded-lg border-2 transition-all mobile-touch-target ${
                      formData.urgency === level.value
                        ? `border-red-500 font-bold bg-gradient-to-r ${level.color} text-white`
                        : 'border-gray-300 font-bold bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xs font-bold">{level.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Please describe the emergency situation in detail..."
                className="w-full px-3 py-2 font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 text-sm">Contact Information</h4>
              
              <div>
                <label className="block text-xs font-bold  text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="Enter phone number for immediate contact"
                  className="w-full px-3 py-2 border font-bold border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold  text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Terms & Emergency Contact */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-300">
              <div className="flex items-start gap-2">
                <FiAlertTriangle className="text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs  text-gray-700">
                    <span className="font-bold">Important:</span> For immediate life-threatening emergencies, 
                    please call Our Ofiice Direct 0789384922 or your local emergency number first. This form is for urgent school-related 
                    matters that require immediate administrative attention.
                  </p>
                </div>
              </div>
            </div>

  {/* Action Buttons */}
<div className="
  flex  
  gap-4
  mt-6 pb-4
  pt-6
  mb-7
  border-t border-gray-200
">
  <button
    type="button"
    onClick={onClose}
    disabled={submitting}
    className="
      w-full sm:w-auto
      px-4 py-3
      bg-gradient-to-r from-gray-100 to-gray-200
      text-gray-700
      rounded-xl
      font-bold text-sm
      hover:from-gray-200 hover:to-gray-300
      transition-all
      flex items-center justify-center gap-2
      mobile-touch-target
    "
  >
    <FaTimes />
    Cancel
  </button>

  <button
    type="submit"
    disabled={submitting || submitSuccess}
    className="
      w-full sm:w-auto
      px-4 py-3
      bg-gradient-to-r from-red-600 to-pink-600
      text-white
      rounded-xl
      font-bold text-sm
      shadow-lg hover:shadow-xl
      transition-all
      flex items-center justify-center gap-2
      disabled:opacity-70
      mobile-touch-target
    "
  >
    {submitting ? (
      <>
        <FiLoader className="animate-spin" />
        Submitting...
      </>
    ) : (
      <>
        <FaExclamationCircle />
        Submit 
      </>
    )}
  </button>
</div>

          </form>
        </div>
      </div>
    </div>
  );
}

// ==================== MODERN HEADER ====================
function ModernGuidanceHeader({ 
  student, 
  onMenuToggle,
  isMenuOpen,
  activeTab,
  setActiveTab,
  onBookEmergency
}) {
  
  const getInitials = (name) => {
    if (!name) return 'ST';
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const getGradientColor = (name) => {
    const char = name?.trim().charAt(0).toUpperCase() || 'S';
    const gradients = {
      A: "bg-gradient-to-r from-red-500 to-pink-600",
      B: "bg-gradient-to-r from-blue-500 to-cyan-600",
      C: "bg-gradient-to-r from-green-500 to-emerald-600",
      D: "bg-gradient-to-r from-purple-500 to-pink-600",
      E: "bg-gradient-to-r from-emerald-500 to-teal-600",
      F: "bg-gradient-to-r from-pink-500 to-rose-600",
      G: "bg-gradient-to-r from-orange-500 to-amber-600",
      H: "bg-gradient-to-r from-indigo-500 to-violet-600",
      I: "bg-gradient-to-r from-cyan-500 to-blue-600",
      J: "bg-gradient-to-r from-rose-500 to-red-600",
      K: "bg-gradient-to-r from-amber-500 to-yellow-600",
      L: "bg-gradient-to-r from-violet-500 to-purple-600",
      M: "bg-gradient-to-r from-lime-500 to-green-600",
      N: "bg-gradient-to-r from-sky-500 to-blue-600",
      O: "bg-gradient-to-r from-fuchsia-500 to-purple-600",
      P: "bg-gradient-to-r from-teal-500 to-emerald-600",
      Q: "bg-gradient-to-r from-slate-600 to-gray-700",
      R: "bg-gradient-to-r from-red-400 to-pink-500",
      S: "bg-gradient-to-r from-blue-400 to-cyan-500",
      T: "bg-gradient-to-r from-emerald-400 to-green-500",
      U: "bg-gradient-to-r from-indigo-400 to-purple-500",
      V: "bg-gradient-to-r from-purple-400 to-pink-500",
      W: "bg-gradient-to-r from-orange-400 to-amber-500",
      X: "bg-gradient-to-r from-gray-500 to-slate-600",
      Y: "bg-gradient-to-r from-yellow-400 to-amber-500",
      Z: "bg-gradient-to-r from-zinc-700 to-gray-900",
    };
    return gradients[char] || "bg-gradient-to-r from-blue-500 to-purple-600";
  };

  const getTabIcon = (tab) => {
    switch(tab) {
      case 'events': return <FiCalendar className="text-blue-500" />;
      case 'guidance': return <FiMessageSquare className="text-purple-500" />;
      case 'news': return <FiBookOpen className="text-amber-500" />;
      case 'teams': return <FiUsers className="text-green-500" />;
      default: return <FiCalendar className="text-blue-500" />;
    }
  };

  const getTabColor = (tab) => {
    switch(tab) {
      case 'events': return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'guidance': return 'bg-gradient-to-r from-purple-500 to-purple-600';
      case 'news': return 'bg-gradient-to-r from-amber-500 to-amber-600';
      case 'teams': return 'bg-gradient-to-r from-green-500 to-emerald-600';
      default: return 'bg-gradient-to-r from-blue-500 to-blue-600';
    }
  };

  return (
    <>
      <style jsx global>{mobileStyles}</style>
      <header className="bg-gradient-to-r from-white via-gray-50 to-blue-50 border-b border-gray-200/50 shadow-xl sticky top-0 z-30 backdrop-blur-sm bg-white/80">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Left Section */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={onMenuToggle}
                className="lg:hidden p-2.5 md:p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 shadow-sm hover:shadow-md transition-all mobile-touch-target"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <FaTimes className="text-gray-700 text-lg" /> : <FaBars className="text-gray-700 text-lg" />}
              </button>
              
              {/* Current Tab Title (Mobile) */}
              <div className="lg:hidden flex items-center gap-2 md:gap-3">
                <div className={`p-2 ${getTabColor(activeTab)} bg-opacity-10 rounded-xl shadow-sm`}>
                  <div className={`p-1 rounded-lg ${getTabColor(activeTab)}`}>
                    {getTabIcon(activeTab)}
                  </div>
                </div>
                <div className="max-w-[120px] md:max-w-none">
                  <h1 className="text-sm md:text-lg font-bold text-gray-900 truncate">
                    {activeTab === 'events' && 'School Events'}
                    {activeTab === 'guidance' && 'Guidance'}
                    {activeTab === 'news' && 'School News'}
                    {activeTab === 'teams' && 'Teams'}
                  </h1>
                  <p className="text-xs text-gray-500 hidden md:block">Stay Updated</p>
                </div>
              </div>

              {/* Desktop Logo/Title */}
              <div className="hidden lg:flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <FaCalendarCheck className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Guidance & Events Portal</h1>
                  <p className="text-sm text-gray-600">Stay connected with school activities</p>
                </div>
              </div>
            </div>

            {/* Tab Navigation (Desktop) */}
            <div className="hidden lg:flex flex-1 justify-center">
              <div className="flex items-center gap-2 bg-gray-100 rounded-2xl p-1.5">
                {['events', 'guidance', 'news', 'teams'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                      activeTab === tab 
                        ? 'bg-white text-gray-900 shadow-lg' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {getTabIcon(tab)}
                    {tab === 'events' && 'School Events'}
                    {tab === 'guidance' && 'Guidance'}
                    {tab === 'news' && 'News'}
                    {tab === 'teams' && 'Teams'}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1 md:gap-3">
              {/* Emergency Button (Mobile) */}
              <button
                onClick={onBookEmergency}
                className="lg:hidden p-2.5 md:p-3 rounded-xl bg-gradient-to-r from-red-100 to-pink-200 shadow-sm hover:shadow-md transition-all mobile-touch-target"
                title="Emergency"
              >
                <FaExclamationCircle className="text-red-600 text-base md:text-lg" />
              </button>

              {/* Student Avatar */}
              {student && (
                <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-3 border-l border-gray-200/50">
                  <div className="relative group">
                    <div
                      className={`absolute inset-0 ${getGradientColor(student.fullName)} rounded-full blur opacity-70 group-hover:opacity-100 transition-opacity`}
                    ></div>
                    <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-white text-xs md:text-sm bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-white shadow-lg">
                      {getInitials(student.fullName)}
                    </div>
                  </div>

                  <div className="hidden xl:flex flex-col">
                    <p className="text-sm font-bold text-gray-900">
                      {student.fullName}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">
                         {student.form} • {student.stream}
                      </span>
                      <span className="w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation (Mobile) */}
        <div className="lg:hidden border-t border-gray-200/50">
          <div className="container mx-auto px-2 md:px-4 py-2 md:py-3">
            <div className="flex items-center justify-between">
              {['events', 'guidance', 'news', 'teams'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex flex-col items-center gap-0.5 md:gap-1 px-2 md:px-4 py-1.5 md:py-2 rounded-lg transition-all mobile-touch-target mobile-full-width ${
                    activeTab === tab 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="text-base md:text-lg">
                    {getTabIcon(tab)}
                  </div>
                  <span className="text-xs font-medium truncate w-full text-center">
                    {tab === 'events' && 'Events'}
                    {tab === 'guidance' && 'Guidance'}
                    {tab === 'news' && 'News'}
                    {tab === 'teams' && 'Teams'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

// ==================== STATISTICS CARDS ====================
function StatisticsCards({ events, guidance, news, teams, activeTab }) {
  const stats = {
    events: {
      total: events.length,
      upcoming: events.filter(e => new Date(e.date) >= new Date()).length,
      featured: events.filter(e => e.featured).length,
      withImages: events.filter(e => e.image).length
    },
    guidance: {
      total: guidance.length,
      highPriority: guidance.filter(g => g.priority === 'High').length,
      groupSessions: guidance.filter(g => g.type === 'Group Session').length,
      withImages: guidance.filter(g => g.image).length
    },
    news: {
      total: news.length,
      featured: news.filter(n => n.featured).length,
      recent: news.filter(n => {
        const newsDate = new Date(n.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return newsDate >= thirtyDaysAgo;
      }).length,
      withImages: news.filter(n => n.image).length
    },
    teams: {
      total: teams.length,
      teachers: teams.filter(t => t.role === 'teacher').length,
      matrons: teams.filter(t => t.role === 'matron').length,
      patrons: teams.filter(t => t.role === 'patron').length
    }
  };

  const getActiveStats = () => {
    switch(activeTab) {
      case 'events':
        return [
          { label: 'Total Events', value: stats.events.total, color: 'from-blue-500 to-blue-600', icon: <FiCalendar /> },
          { label: 'Upcoming', value: stats.events.upcoming, color: 'from-emerald-500 to-emerald-600', icon: <FaCalendarCheck /> },
          { label: 'With Images', value: stats.events.withImages, color: 'from-cyan-500 to-cyan-600', icon: <FiFileText /> }
        ];
      case 'guidance':
        return [
          { label: 'Total Sessions', value: stats.guidance.total, color: 'from-purple-500 to-purple-600', icon: <FiMessageSquare /> },
          { label: 'High Priority', value: stats.guidance.highPriority, color: 'from-red-500 to-red-600', icon: <FiAlertCircle /> },
          { label: 'With Images', value: stats.guidance.withImages, color: 'from-indigo-500 to-indigo-600', icon: <FiFileText /> }
        ];
      case 'news':
        return [
          { label: 'Total News', value: stats.news.total, color: 'from-amber-500 to-amber-600', icon: <FiBookOpen /> },
          { label: 'Featured', value: stats.news.featured, color: 'from-rose-500 to-rose-600', icon: <FiStar /> },
          { label: 'With Images', value: stats.news.withImages, color: 'from-pink-500 to-pink-600', icon: <FiFileText /> }
        ];
      case 'teams':
        return [
          { label: 'Total Members', value: stats.teams.total, color: 'from-green-500 to-emerald-600', icon: <FiUsers /> },
          { label: 'Teachers', value: stats.teams.teachers, color: 'from-blue-500 to-cyan-600', icon: <FiUser /> },
          { label: 'Matrons & Patrons', value: stats.teams.matrons + stats.teams.patrons, color: 'from-purple-500 to-pink-600', icon: <FaUserFriends /> }
        ];
      default:
        return [];
    }
  };

  return (
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
  {getActiveStats().map((stat, index) => (
    <div key={index} className="relative bg-white rounded-[24px] md:rounded-[32px] p-4 md:p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col">
      
      {/* Header with Icon and Badge */}
      <div className="flex items-start justify-between mb-4 md:mb-6">
        <div className={`p-2.5 md:p-3.5 rounded-xl md:rounded-2xl bg-gradient-to-br ${stat.color} shadow-sm`}>
          <div className="text-white text-lg md:text-2xl">
            {stat.icon}
          </div>
        </div>
        
        <span className={`px-2.5 py-1 rounded-full text-[10px] md:text-xs font-black uppercase tracking-wider ${
          index === 0 ? 'bg-blue-50 text-blue-600 border border-blue-200' :
          index === 1 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
          'bg-purple-50 text-purple-600 border border-purple-200'
        }`}>
          {index === 0 ? 'All' : index === 1 ? 'Active' : 'Visual'}
        </span>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h4 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-1 md:mb-2 tracking-tight">
          {stat.value}
        </h4>
        
        <p className="text-[11px] md:text-sm font-bold text-slate-600 mb-2 uppercase tracking-wider">
          {stat.label}
        </p>
        
        {stat.sublabel && (
          <p className="text-[10px] md:text-xs text-slate-400 font-medium mt-auto">
            {stat.sublabel}
          </p>
        )}
      </div>
      
      {/* Decorative Element */}
      <div className={`absolute -bottom-2 -right-2 w-12 h-12 md:w-16 md:h-16 opacity-[0.03] rounded-full bg-gradient-to-br ${
        index === 0 ? 'from-blue-500 to-cyan-500' :
        index === 1 ? 'from-emerald-500 to-green-500' :
        'from-purple-500 to-pink-500'
      } hidden md:block`} />
    </div>
  ))}
</div>
  );
}

// ==================== EVENT CARD ====================
// ==================== MODERNIZED EVENT CARD ====================
function EventCard({ event, onViewDetails }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getCategoryStyle = (category) => {
    const styles = {
      sports: { 
        gradient: 'from-red-500 to-orange-500', 
        bg: 'bg-red-50', 
        text: 'text-red-700',
        border: 'border-red-200',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600'
      },
      academic: { 
        gradient: 'from-blue-500 to-cyan-500', 
        bg: 'bg-blue-50', 
        text: 'text-blue-700',
        border: 'border-blue-200',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      cultural: { 
        gradient: 'from-purple-500 to-pink-500', 
        bg: 'bg-purple-50', 
        text: 'text-purple-700',
        border: 'border-purple-200',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600'
      },
      workshop: { 
        gradient: 'from-amber-500 to-orange-500', 
        bg: 'bg-amber-50', 
        text: 'text-amber-700',
        border: 'border-amber-200',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600'
      }
    };
    return styles[category] || styles.academic;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Scheduled';
    }
  };

  const categoryStyle = getCategoryStyle(event.category);
  const isUpcoming = new Date(event.date) >= new Date();

  return (
    <div 
      onClick={() => onViewDetails?.(event)}
      className="relative bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden cursor-pointer"
    >
      {/* Image Header */}
      <div className="relative h-48 w-full shrink-0">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <FiCalendar className="text-white text-3xl" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}>
            {event.category?.charAt(0).toUpperCase() + event.category?.slice(1) || 'Event'}
          </span>
          {isUpcoming && (
            <span className="px-3 py-1 bg-slate-900/90 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <FiClock className="text-emerald-400" /> Upcoming
            </span>
          )}
        </div>

        {/* Type Badge */}
        {event.type && (
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
              event.type === 'external' ? 'bg-amber-50 border border-amber-200 text-amber-700' :
              'bg-emerald-50 border border-emerald-200 text-emerald-700'
            }`}>
              {event.type}
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 leading-tight">
            {event.title}
          </h3>
          <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
            {event.description || 'Join us for this upcoming school event and explore new opportunities.'}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-50 border border-slate-100/50">
            <div className={`p-1.5 rounded-lg ${categoryStyle.iconBg}`}>
              <FiCalendar className={`${categoryStyle.iconColor}`} size={14} />
            </div>
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
              {formatDate(event.date)}
            </span>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-50 border border-slate-100/50">
            <div className={`p-1.5 rounded-lg ${categoryStyle.iconBg}`}>
              <FiClock className={`${categoryStyle.iconColor}`} size={14} />
            </div>
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight truncate">
              {event.time || 'All Day'}
            </span>
          </div>

          <div className="col-span-2 flex items-center gap-2.5 p-2 rounded-2xl bg-slate-50 border border-slate-100/50">
            <div className={`p-1.5 rounded-lg ${categoryStyle.iconBg}`}>
              <FiMapPin className={`${categoryStyle.iconColor}`} size={14} />
            </div>
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight truncate">
              {event.location || 'Main Campus Hall'}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          View Event Details
          <FiArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

// ==================== MODERNIZED GUIDANCE CARD ====================
function GuidanceCard({ session, onViewDetails }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getCategoryStyle = (category) => {
    const styles = {
      Academics: { 
        gradient: 'from-blue-500 to-cyan-500', 
        bg: 'bg-blue-50', 
        text: 'text-blue-700',
        border: 'border-blue-200',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      Relationships: { 
        gradient: 'from-purple-500 to-pink-500', 
        bg: 'bg-purple-50', 
        text: 'text-purple-700',
        border: 'border-purple-200',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600'
      },
      Career: { 
        gradient: 'from-emerald-500 to-green-500', 
        bg: 'bg-emerald-50', 
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600'
      }
    };
    return styles[category] || styles.Academics;
  };

  const getPriorityStyle = (priority) => {
    const styles = {
      High: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
      Medium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
      Low: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' }
    };
    return styles[priority] || styles.Medium;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Scheduled';
    }
  };

  const categoryStyle = getCategoryStyle(session.category);
  const priorityStyle = getPriorityStyle(session.priority);

  return (
    <div 
      onClick={() => onViewDetails?.(session)}
      className="relative bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden cursor-pointer"
    >
      {/* Image Header */}
      <div className="relative h-48 w-full shrink-0">
        {session.image ? (
          <img
            src={session.image}
            alt={`Session with ${session.counselor}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <FiMessageSquare className="text-white text-3xl" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}>
            {session.category || 'Session'}
          </span>
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}>
            {session.priority || 'Medium'}
          </span>
        </div>

        {/* Type Badge */}
        {session.type && (
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
              session.type === 'Counseling' ? 'bg-purple-50 border border-purple-200 text-purple-700' :
              'bg-indigo-50 border border-indigo-200 text-indigo-700'
            }`}>
              {session.type}
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 leading-tight">
            Session with {session.counselor || 'Counselor'}
          </h3>
          <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
            {session.description || 'Guidance session for student support and development.'}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-50 border border-slate-100/50">
            <div className={`p-1.5 rounded-lg ${categoryStyle.iconBg}`}>
              <FiCalendar className={`${categoryStyle.iconColor}`} size={14} />
            </div>
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
              {formatDate(session.date)}
            </span>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-50 border border-slate-100/50">
            <div className={`p-1.5 rounded-lg ${categoryStyle.iconBg}`}>
              <FiClock className={`${categoryStyle.iconColor}`} size={14} />
            </div>
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight truncate">
              {session.time || 'Scheduled'}
            </span>
          </div>

          {session.notes && (
            <div className="col-span-2 flex items-center gap-2.5 p-2 rounded-2xl bg-slate-50 border border-slate-100/50">
              <div className={`p-1.5 rounded-lg ${categoryStyle.iconBg}`}>
                <FiMessageSquare className={`${categoryStyle.iconColor}`} size={14} />
              </div>
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight truncate">
                {session.notes.length > 20 ? session.notes.substring(0, 20) + '...' : session.notes}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          View Session Details
          <FiArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

// ==================== MODERNIZED NEWS CARD ====================
function NewsCard({ newsItem, onViewDetails }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getCategoryStyle = (category) => {
    const styles = {
      community: { 
        gradient: 'from-emerald-500 to-green-500', 
        bg: 'bg-emerald-50', 
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600'
      },
      academic: { 
        gradient: 'from-blue-500 to-cyan-500', 
        bg: 'bg-blue-50', 
        text: 'text-blue-700',
        border: 'border-blue-200',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      sports: { 
        gradient: 'from-red-500 to-orange-500', 
        bg: 'bg-red-50', 
        text: 'text-red-700',
        border: 'border-red-200',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600'
      },
      announcement: { 
        gradient: 'from-amber-500 to-orange-500', 
        bg: 'bg-amber-50', 
        text: 'text-amber-700',
        border: 'border-amber-200',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600'
      }
    };
    return styles[category] || styles.announcement;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      
      if (diff === 0) return 'Today';
      if (diff === 1) return 'Yesterday';
      if (diff < 7) return `${diff} days ago`;
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Recent';
    }
  };

  const categoryStyle = getCategoryStyle(newsItem.category);
  const isRecent = (() => {
    try {
      const newsDate = new Date(newsItem.date);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return newsDate >= sevenDaysAgo;
    } catch {
      return false;
    }
  })();

  return (
    <div 
      onClick={() => onViewDetails?.(newsItem)}
      className="relative bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden cursor-pointer"
    >
      {/* Image Header */}
      <div className="relative h-48 w-full shrink-0">
        {newsItem.image ? (
          <img
            src={newsItem.image}
            alt={newsItem.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <FiBookOpen className="text-white text-3xl" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}>
            {newsItem.category?.charAt(0).toUpperCase() + newsItem.category?.slice(1) || 'News'}
          </span>
          {isRecent && (
            <span className="px-3 py-1 bg-slate-900/90 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <FiStar className="text-amber-400" /> New
            </span>
          )}
        </div>

        {/* Date Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-slate-700 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
            {formatDate(newsItem.date)}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 leading-tight">
            {newsItem.title}
          </h3>
          <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed">
            {newsItem.excerpt || newsItem.fullContent || 'Stay updated with the latest news and announcements.'}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-50 border border-slate-100/50">
            <div className={`p-1.5 rounded-lg ${categoryStyle.iconBg}`}>
              <FiUser className={`${categoryStyle.iconColor}`} size={14} />
            </div>
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight truncate">
              {newsItem.author || 'School Admin'}
            </span>
          </div>

          {newsItem.likes !== undefined && (
            <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-50 border border-slate-100/50">
              <div className={`p-1.5 rounded-lg ${categoryStyle.iconBg}`}>
                <FiHeart className={`${categoryStyle.iconColor}`} size={14} />
              </div>
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                {newsItem.likes} likes
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          Read Full Story
          <FiArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function GuidanceEventsView() {
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [guidance, setGuidance] = useState([]);
  const [news, setNews] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [error, setError] = useState(null);
  
  // New state for modals
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  // Fetch all data with image handling
// Replace your current fetchAllData function with this updated version
const fetchAllData = useCallback(async () => {
  try {
    setError(null);
    
    // Fetch events from API
    const eventsRes = await fetch('/api/events');
    const eventsData = await eventsRes.json();
    
    if (eventsData.success) {
      // Process events with comprehensive image mapping
      const processedEvents = (eventsData.events || []).map(event => {
        // Try multiple possible image property names
        const imageSource = 
          event.image || 
          event.imageUrl || 
          event.image_url || 
          event.thumbnail || 
          event.cover_image || 
          event.photo_url;
        
        return {
          ...event,
          // Convert to complete URL if needed
          image: imageSource ? 
            (imageSource.startsWith('http') ? imageSource : 
             imageSource.startsWith('/') ? imageSource : 
             `/${imageSource}`) : null
        };
      });
      setEvents(processedEvents);
    } else {
      throw new Error('Failed to fetch events');
    }

    // Fetch guidance from API
    const guidanceRes = await fetch('/api/guidance');
    const guidanceData = await guidanceRes.json();
    
    if (guidanceData.success) {
      // Process guidance sessions
      const processedGuidance = (guidanceData.events || []).map(session => {
        const imageSource = 
          session.image || 
          session.imageUrl || 
          session.image_url || 
          session.thumbnail;
        
        return {
          ...session,
          image: imageSource ? 
            (imageSource.startsWith('http') ? imageSource : 
             imageSource.startsWith('/') ? imageSource : 
             `/${imageSource}`) : null
        };
      });
      // Add default devotion sessions to the beginning
      setGuidance([...DEFAULT_SESSIONS, ...processedGuidance]);
    } else {
      throw new Error('Failed to fetch guidance sessions');
    }

    // Fetch news from API
    const newsRes = await fetch('/api/news');
    const newsData = await newsRes.json();
    
    if (newsData.success) {
      // IMPORTANT: Your API returns data.data, not data.news
      const newsItems = newsData.data || newsData.news || [];
      
      // Process news items with comprehensive image mapping
      const processedNews = newsItems.map(newsItem => {
        // Try all possible image property names
        const imageSource = 
          newsItem.image || 
          newsItem.imageUrl || 
          newsItem.image_url || 
          newsItem.thumbnail || 
          newsItem.cover_image || 
          newsItem.featured_image ||
          newsItem.photo;
        
        return {
          id: newsItem.id || newsItem._id,
          title: newsItem.title || newsItem.headline,
          excerpt: newsItem.excerpt || newsItem.summary || newsItem.description,
          fullContent: newsItem.content || newsItem.full_content || newsItem.description,
          date: newsItem.date || newsItem.createdAt || newsItem.published_date,
          category: newsItem.category || newsItem.type,
          author: newsItem.author || newsItem.created_by || 'School Admin',
          likes: newsItem.likes || newsItem.like_count || 0,
          // Handle image paths
          image: imageSource ? 
            (imageSource.startsWith('http') ? imageSource : 
             imageSource.startsWith('/') ? imageSource : 
             `/${imageSource}`) : null
        };
      });
      setNews(processedNews);
    } else {
      throw new Error('Failed to fetch news');
    }

    // Fetch teams
    try {
      const teamsRes = await fetch('/api/guidanceteam');
      const teamsData = await teamsRes.json();
      if (teamsData.success) {
        const processedTeams = (teamsData.members || []).map(member => {
          const imageSource = 
            member.image || 
            member.photo || 
            member.avatar || 
            member.profile_picture;
          
          return {
            ...member,
            image: imageSource ? 
              (imageSource.startsWith('http') ? imageSource : 
               imageSource.startsWith('/') ? imageSource : 
               `/${imageSource}`) : null
          };
        });
        setTeams(processedTeams);
      } else {
        setTeams([]);
      }
    } catch (teamsError) {
      console.warn('Error fetching team members:', teamsError);
      setTeams([]);
    }

    // Get student data
    const savedStudent = localStorage.getItem('student_data');
    if (savedStudent) {
      setStudent(JSON.parse(savedStudent));
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    setError('Failed to load data. Please try again.');
    
    // Use sample data with proper images as fallback
    setEvents([
      {
        id: 1,
        title: "Annual Sports Day",
        description: "Join us for our annual sports competition with various track and field events.",
        date: "2026-01-23T00:00:00.000Z",
        time: "9:00am - 4:00pm",
        location: "School Playground",
        category: "sports",
        type: "external",
        featured: true,
        attendees: "All students",
        image: "/images/events/sports-day.jpg" // Add proper fallback image
      }
    ]);
    
    setGuidance([...DEFAULT_SESSIONS]);
    
    setNews([
      {
        id: 1,
        title: "School Announces New Library Hours",
        excerpt: "Extended library hours to support student studies",
        fullContent: "The school library will now remain open until 6:00 PM on weekdays...",
        date: "2026-01-02T00:00:00.000Z",
        category: "announcement",
        author: "School Administration",
        likes: 15,
        image: "/images/news/library-announcement.jpg"
      }
    ]);
    
    setTeams([]);
  } finally {
    setLoading(false);
  }
}, []);

  // Initial fetch
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Toggle menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Handle view details
  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setSelectedItemType(activeTab);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setSelectedItem(null);
    setSelectedItemType(null);
  };

  // Handle book appointment from modal
  const handleBookAppointment = (item) => {
    // You can implement specific booking logic here
    console.log('Booking appointment for:', item);
    // For now, show emergency modal
    setShowEmergencyModal(true);
  };

  // Handle book emergency appointment
  const handleBookEmergency = () => {
    setShowEmergencyModal(true);
  };

  // Handle close emergency modal
  const handleCloseEmergencyModal = () => {
    setShowEmergencyModal(false);
  };

  if (loading) {
    return <LoadingSpinner message="Loading guidance and events..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <style jsx global>{mobileStyles}</style>
      
      {/* Header */}
      <ModernGuidanceHeader
        student={student}
        onMenuToggle={toggleMenu}
        isMenuOpen={isMenuOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onBookEmergency={handleBookEmergency}
      />

      <main className="container mx-auto px-3 sm:px-4 py-4 md:py-6 max-w-7xl">
        {/* Welcome Banner */}
        <div className="mb-6 md:mb-8">
          <div className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mobile-scroll-hide">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30"></div>
            <div className="relative p-4 md:p-6 lg:p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="p-3 md:p-4 bg-white/20 rounded-xl md:rounded-2xl backdrop-blur-sm w-fit">
                  {activeTab === 'events' && <FiCalendar className="text-xl md:text-2xl" />}
                  {activeTab === 'guidance' && <FiMessageSquare className="text-xl md:text-2xl" />}
                  {activeTab === 'news' && <FiBookOpen className="text-xl md:text-2xl" />}
                  {activeTab === 'teams' && <FiUsers className="text-xl md:text-2xl" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold mb-1 md:mb-2">
                    {activeTab === 'events' && 'School Events & Activities'}
                    {activeTab === 'guidance' && 'Guidance & Counseling'}
                    {activeTab === 'news' && 'School News & Updates'}
                    {activeTab === 'teams' && 'Guidance & Counseling Team'}
                  </h1>
                  <p className="text-blue-100 text-sm md:text-base lg:text-lg mobile-text-ellipsis">
                    {activeTab === 'events' && 'Stay informed about upcoming events, competitions, and school activities'}
                    {activeTab === 'guidance' && 'Access counseling sessions, career guidance, and support services'}
                    {activeTab === 'news' && 'Latest announcements, achievements, and important updates from school'}
                    {activeTab === 'teams' && 'Meet our dedicated team of guidance teachers, matrons, and patrons'}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-4 md:mt-6">
                <span className="inline-flex items-center gap-1 md:gap-2 bg-white/20 px-3 md:px-4 py-1.5 md:py-2 rounded-full backdrop-blur-sm text-xs md:text-sm font-bold">
                  <HiSparkles className="text-yellow-300 text-sm md:text-base" />
                  {activeTab === 'events' && `Active Events: ${events.length}`}
                  {activeTab === 'guidance' && `Available Sessions: ${guidance.length}`}
                  {activeTab === 'news' && `Recent Updates: ${news.length}`}
                  {activeTab === 'teams' && `Team Members: ${teams.length}`}
                </span>
                {student && (
                  <span className="inline-flex items-center gap-1 md:gap-2 bg-white/20 px-3 md:px-4 py-1.5 md:py-2 rounded-full backdrop-blur-sm text-xs md:text-sm font-bold">
                    <FaUserFriends className="text-blue-200 text-sm md:text-base" />
                    Form {student.form} {student.stream}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <StatisticsCards 
          events={events} 
          guidance={guidance} 
          news={news} 
          teams={teams}
          activeTab={activeTab} 
        />

        {/* Emergency Button (Desktop) */}
        <div className="mb-6 md:mb-8 flex justify-end">
          <button
            onClick={handleBookEmergency}
            className="hidden md:flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all mobile-touch-target"
          >
            <FaExclamationCircle />
            Emergency Support
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 md:border-2 rounded-xl md:rounded-2xl">
            <div className="flex items-center gap-2 md:gap-3">
              <FaExclamationCircle className="text-red-500 text-lg md:text-xl" />
              <div className="flex-1 min-w-0">
                <p className="text-red-700 font-bold text-sm md:text-base">{error}</p>
                <p className="text-red-600 text-xs md:text-sm">Using sample data for demonstration.</p>
              </div>
            </div>
          </div>
        )}

        {/* Content Grid */}
        {activeTab === 'teams' ? (
          <TeamsSection teamMembers={teams} />
        ) : (
          <div className="mb-8 md:mb-12">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                {activeTab === 'events' && 'Upcoming Events'}
                {activeTab === 'guidance' && 'Available Sessions'}
                {activeTab === 'news' && 'Latest News'}
              </h2>
              <span className="px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs md:text-sm font-bold rounded-full">
                {activeTab === 'events' && `${events.length} Events`}
                {activeTab === 'guidance' && `${guidance.length} Sessions`}
                {activeTab === 'news' && `${news.length} News`}
              </span>
            </div>

            {(
              (activeTab === 'events' && events.length === 0) ||
              (activeTab === 'guidance' && guidance.length === 0) ||
              (activeTab === 'news' && news.length === 0)
            ) ? (
              <div className="bg-white rounded-xl md:rounded-2xl border border-gray-300 md:border-2 p-6 md:p-8 lg:p-12 text-center">
                <div className="text-gray-300 text-4xl md:text-5xl mx-auto mb-3 md:mb-4">
                  {activeTab === 'events' && <FiCalendar />}
                  {activeTab === 'guidance' && <FiMessageSquare />}
                  {activeTab === 'news' && <FiBookOpen />}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-2">No items found</h3>
                <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">
                  No items available at the moment
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {activeTab === 'events' && events.map((item) => (
                  <EventCard key={item.id} event={item} onViewDetails={handleViewDetails} />
                ))}
                {activeTab === 'guidance' && guidance.map((item) => (
                  <GuidanceCard key={item.id} session={item} onViewDetails={handleViewDetails} />
                ))}
                {activeTab === 'news' && news.map((item) => (
                  <NewsCard key={item.id} newsItem={item} onViewDetails={handleViewDetails} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Links/Resources */}
        <div className="mt-8 md:mt-12">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 text-white shadow-lg md:shadow-2xl mobile-scroll-hide">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Need Assistance?</h3>
                <p className="text-gray-300 text-sm md:text-base">
                  Our guidance counselors and support staff are here to help with any concerns.
                </p>
              </div>
        
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-white/10 p-3 md:p-5 rounded-lg md:rounded-xl backdrop-blur-sm">
                <h4 className="font-bold mb-2 md:mb-3 flex items-center gap-1 md:gap-2 text-sm md:text-base">
                  <FiMessageSquare className="text-sm md:text-base" /> Guidance Office
                </h4>
                <p className="text-gray-300 text-xs md:text-sm">Room 12, Admin Block</p>
                <p className="text-gray-300 text-xs md:text-sm">Mon-Fri: 8:00 AM - 4:00 PM</p>
              </div>
              <div className="bg-white/10 p-3 md:p-5 rounded-lg md:rounded-xl backdrop-blur-sm">
                <h4 className="font-bold mb-2 md:mb-3 flex items-center gap-1 md:gap-2 text-sm md:text-base">
                  <FiBell className="text-sm md:text-base" /> Contact
                </h4>
                <p className="text-gray-300 text-xs md:text-sm">guidance@school.edu</p>
                <p className="text-gray-300 text-xs md:text-sm">(123) 456-7890</p>
              </div>
              <div className="bg-white/10 p-3 md:p-5 rounded-lg md:rounded-xl backdrop-blur-sm">
                <h4 className="font-bold mb-2 md:mb-3 flex items-center gap-1 md:gap-2 text-sm md:text-base">
                  <FiAlertCircle className="text-sm md:text-base" /> Emergency
                </h4>
                <p className="text-gray-300 text-xs md:text-sm">24/7 Student Support</p>
                <p className="text-gray-300 text-xs md:text-sm">(123) 456-7891</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Note */}
      <footer className="mt-6 md:mt-12 py-4 md:py-6 border-t border-gray-200">
        <div className="container mx-auto px-3 sm:px-4 text-center text-gray-600 text-xs md:text-sm">
          <p>© {new Date().getFullYear()} School Guidance & Events Portal. All rights reserved.</p>
          <p className="mt-1">Stay connected with school activities and support services.</p>
        </div>
      </footer>

      {/* Detail Modal */}
      {selectedItem && selectedItemType !== 'teams' && (
        <ModernDetailModal
          session={selectedItem}
          onClose={handleCloseModal}
          onContact={() => setShowEmergencyModal(true)}
        />
      )}

      {/* Emergency Modal */}
      {showEmergencyModal && (
        <EmergencyModal
          student={student}
          onClose={handleCloseEmergencyModal}
          onSubmit={() => {
            // Success handling is done inside EmergencyModal
            console.log('Emergency submitted');
          }}
        />
      )}
    </div>
  );
}