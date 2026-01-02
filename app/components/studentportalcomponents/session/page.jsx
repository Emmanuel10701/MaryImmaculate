'use client';

import { 
  useState, useEffect, useCallback, useMemo 
} from 'react';
import {
  FiCalendar, FiMessageSquare, FiMapPin, 
  FiClock, FiUsers, FiExternalLink, FiFilter,
  FiChevronRight, FiSearch, FiVideo, FiBookOpen,
  FiHome, FiFolder, FiBarChart2, FiX, FiUser,
  FiStar, FiAlertCircle, FiDownload, FiShare2,
  FiBell, FiBook, FiFileText, FiAward
} from 'react-icons/fi';
import { 
  FaBell, FaBars, FaChartBar, FaFolder, FaComments, 
  FaRocket, FaFire, FaBolt, FaCalendarCheck,
  FaSearch, FaTimes, FaSync, FaExclamationCircle, 
  FaCircleExclamation, FaSparkles, FaCloudUpload,
  FaUserFriends, FaQuestionCircle, FaHome
} from 'react-icons/fa';

import { HiSparkles } from "react-icons/hi2";
import { CircularProgress } from '@mui/material';

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

// ==================== MODERN HEADER ====================
function ModernGuidanceHeader({ 
  student, 
  searchTerm, 
  setSearchTerm, 
  onRefresh,
  onMenuToggle,
  isMenuOpen,
  activeTab,
  setActiveTab,
  refreshing
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
      default: return <FiCalendar className="text-blue-500" />;
    }
  };

  const getTabColor = (tab) => {
    switch(tab) {
      case 'events': return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'guidance': return 'bg-gradient-to-r from-purple-500 to-purple-600';
      case 'news': return 'bg-gradient-to-r from-amber-500 to-amber-600';
      default: return 'bg-gradient-to-r from-blue-500 to-blue-600';
    }
  };

  return (
    <header className="bg-gradient-to-r from-white via-gray-50 to-blue-50 border-b border-gray-200/50 shadow-xl sticky top-0 z-30 backdrop-blur-sm bg-white/80">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 shadow-sm hover:shadow-md transition-all"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <FaTimes className="text-gray-700" /> : <FaBars className="text-gray-700" />}
            </button>
            
            {/* Current Tab Title (Mobile) */}
            <div className="lg:hidden flex items-center gap-3">
              <div className={`p-2.5 ${getTabColor(activeTab)} bg-opacity-10 rounded-xl shadow-sm`}>
                <div className={`p-1.5 rounded-lg ${getTabColor(activeTab)}`}>
                  {getTabIcon(activeTab)}
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {activeTab === 'events' && 'School Events'}
                  {activeTab === 'guidance' && 'Guidance & Counseling'}
                  {activeTab === 'news' && 'School News'}
                </h1>
                <p className="text-xs text-gray-500">Stay Updated</p>
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
              {['events', 'guidance', 'news'].map((tab) => (
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
                </button>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search Bar (Desktop) */}
            <div className="hidden lg:block relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="pl-12 pr-4 py-3 w-64 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Mobile Search Button */}
            <button className="lg:hidden p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 shadow-sm hover:shadow-md transition-all">
              <FaSearch className="text-gray-600" />
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="p-3 rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 shadow-sm hover:shadow-md transition-all group"
              title="Refresh data"
              aria-label="Refresh"
            >
              <FaSync className={`text-blue-600 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            </button>

            {/* Notifications */}
            <button className="p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 shadow-sm hover:shadow-md transition-all relative">
              <FaBell className="text-gray-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                3
              </span>
            </button>

            {/* Student Avatar */}
            {student && (
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200/50">
                <div className="relative group">
                  <div
                    className={`absolute inset-0 ${getGradientColor(student.fullName)} rounded-full blur opacity-70 group-hover:opacity-100 transition-opacity`}
                  ></div>
                  <div className="relative w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-white shadow-lg">
                    {getInitials(student.fullName)}
                  </div>
                </div>

                <div className="hidden xl:flex flex-col">
                  <p className="text-sm font-bold text-gray-900">
                    {student.fullName}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500">
                      Form {student.form} • {student.stream}
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
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {['events', 'guidance', 'news'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="text-lg">
                  {getTabIcon(tab)}
                </div>
                <span className="text-xs font-medium">
                  {tab === 'events' && 'Events'}
                  {tab === 'guidance' && 'Guidance'}
                  {tab === 'news' && 'News'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

// ==================== STATISTICS CARDS ====================
function StatisticsCards({ events, guidance, news, activeTab }) {
  const stats = {
    events: {
      total: events.length,
      upcoming: events.filter(e => new Date(e.date) >= new Date()).length,
      featured: events.filter(e => e.featured).length
    },
    guidance: {
      total: guidance.length,
      highPriority: guidance.filter(g => g.priority === 'High').length,
      groupSessions: guidance.filter(g => g.type === 'Group Session').length
    },
    news: {
      total: news.length,
      featured: news.filter(n => n.featured).length,
      recent: news.filter(n => {
        const newsDate = new Date(n.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return newsDate >= thirtyDaysAgo;
      }).length
    }
  };

  const getActiveStats = () => {
    switch(activeTab) {
      case 'events':
        return [
          { label: 'Total Events', value: stats.events.total, color: 'from-blue-500 to-blue-600', icon: <FiCalendar /> },
          { label: 'Upcoming', value: stats.events.upcoming, color: 'from-emerald-500 to-emerald-600', icon: <FaCalendarCheck /> },
          { label: 'Featured', value: stats.events.featured, color: 'from-amber-500 to-amber-600', icon: <FiStar /> }
        ];
      case 'guidance':
        return [
          { label: 'Total Sessions', value: stats.guidance.total, color: 'from-purple-500 to-purple-600', icon: <FiMessageSquare /> },
          { label: 'High Priority', value: stats.guidance.highPriority, color: 'from-red-500 to-red-600', icon: <FiAlertCircle /> },
          { label: 'Group Sessions', value: stats.guidance.groupSessions, color: 'from-indigo-500 to-indigo-600', icon: <FiUsers /> }
        ];
      case 'news':
        return [
          { label: 'Total News', value: stats.news.total, color: 'from-amber-500 to-amber-600', icon: <FiBookOpen /> },
          { label: 'Featured', value: stats.news.featured, color: 'from-rose-500 to-rose-600', icon: <FiStar /> },
          { label: 'Recent (30d)', value: stats.news.recent, color: 'from-cyan-500 to-cyan-600', icon: <HiSparkles /> }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {getActiveStats().map((stat, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
              <div className="text-white text-xl">
                {stat.icon}
              </div>
            </div>
            <div className={`text-sm font-bold px-3 py-1 rounded-lg ${
              index === 0 ? 'bg-blue-100 text-blue-800' :
              index === 1 ? 'bg-red-100 text-red-800' :
              'bg-amber-100 text-amber-800'
            }`}>
              {index === 0 ? 'All' : index === 1 ? 'Priority' : 'Special'}
            </div>
          </div>
          <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</h4>
          <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

// ==================== EVENT CARD ====================
function EventCard({ event }) {
  const isUpcoming = new Date(event.date) >= new Date();
  
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      <div className="relative bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="p-5">
          {/* Event Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  event.category === 'sports' ? 'bg-red-100 text-red-800' :
                  event.category === 'academic' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {event.category?.charAt(0).toUpperCase() + event.category?.slice(1)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  event.type === 'external' ? 'bg-amber-100 text-amber-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {event.type?.charAt(0).toUpperCase() + event.type?.slice(1)}
                </span>
                {event.featured && (
                  <span className="px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{event.title}</h4>
            </div>
            {isUpcoming && (
              <span className="px-2 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                Upcoming
              </span>
            )}
          </div>
          
          {/* Event Description */}
          <p className="text-gray-600 text-sm mb-5 line-clamp-2">{event.description}</p>
          
          {/* Event Details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FiCalendar className="text-blue-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {new Date(event.date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric' 
                  })}
                </div>
                <div className="text-xs text-gray-500">Date</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <FiClock className="text-purple-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{event.time}</div>
                <div className="text-xs text-gray-500">Time</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <FiMapPin className="text-amber-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 line-clamp-1">{event.location}</div>
                <div className="text-xs text-gray-500">Location</div>
              </div>
            </div>
          </div>
          
          {/* Event Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <FiUser className="text-gray-400 text-sm" />
              <span className="text-xs text-gray-600">{event.attendees}</span>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-0.5">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== GUIDANCE CARD ====================
function GuidanceCard({ session }) {
  const isUpcoming = new Date(session.date) >= new Date();
  
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      <div className="relative bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="p-5">
          {/* Session Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  session.category === 'Academics' ? 'bg-blue-100 text-blue-800' :
                  session.category === 'Relationships' ? 'bg-pink-100 text-pink-800' :
                  session.category === 'Career' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {session.category}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  session.type === 'Counseling' ? 'bg-purple-100 text-purple-800' :
                  'bg-indigo-100 text-indigo-800'
                }`}>
                  {session.type}
                </span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Session with {session.counselor}</h4>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
              session.priority === 'High' ? 'bg-red-100 text-red-800' :
              session.priority === 'Medium' ? 'bg-amber-100 text-amber-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {session.priority} Priority
            </span>
          </div>
          
          {/* Session Description */}
          <p className="text-gray-600 text-sm mb-5 line-clamp-2">{session.description}</p>
          
          {/* Session Details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <FiCalendar className="text-purple-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {new Date(session.date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric' 
                  })}
                </div>
                <div className="text-xs text-gray-500">Date</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-50 rounded-lg">
                <FiClock className="text-pink-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{session.time}</div>
                <div className="text-xs text-gray-500">Time</div>
              </div>
            </div>
            
            {session.notes && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg mt-1">
                  <FiMessageSquare className="text-blue-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 line-clamp-2">{session.notes}</div>
                  <div className="text-xs text-gray-500">Notes</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Session Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <FiUser className="text-gray-400 text-sm" />
              <span className="text-xs text-gray-600">{session.counselor}</span>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-bold rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-0.5">
              Book Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== NEWS CARD ====================
function NewsCard({ newsItem }) {
  const isRecent = (() => {
    const newsDate = new Date(newsItem.date);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return newsDate >= sevenDaysAgo;
  })();
  
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      <div className="relative bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="p-5">
          {/* News Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  newsItem.category === 'community' ? 'bg-emerald-100 text-emerald-800' :
                  newsItem.category === 'academic' ? 'bg-blue-100 text-blue-800' :
                  newsItem.category === 'sports' ? 'bg-red-100 text-red-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {newsItem.category?.charAt(0).toUpperCase() + newsItem.category?.slice(1)}
                </span>
                {isRecent && (
                  <span className="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full">
                    New
                  </span>
                )}
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{newsItem.title}</h4>
            </div>
          </div>
          
          {/* News Excerpt */}
          <p className="text-gray-600 text-sm mb-5 line-clamp-3">{newsItem.excerpt || newsItem.fullContent}</p>
          
          {/* News Details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <FiCalendar className="text-amber-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {new Date(newsItem.date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric' 
                  })}
                </div>
                <div className="text-xs text-gray-500">Published</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FiUser className="text-blue-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{newsItem.author}</div>
                <div className="text-xs text-gray-500">Author</div>
              </div>
            </div>
            
            {newsItem.likes !== undefined && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-50 rounded-lg">
                  <FiStar className="text-pink-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{newsItem.likes} likes</div>
                  <div className="text-xs text-gray-500">Engagement</div>
                </div>
              </div>
            )}
          </div>
          
          {/* News Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              By {newsItem.author}
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-bold rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-0.5">
              Read More
            </button>
          </div>
        </div>
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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('all');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    try {
      setError(null);
      
      // Fetch events from API
      const eventsRes = await fetch('/api/events');
      const eventsData = await eventsRes.json();
      if (eventsData.success) {
        setEvents(eventsData.events || []);
      } else {
        throw new Error('Failed to fetch events');
      }

      // Fetch guidance from API
      const guidanceRes = await fetch('/api/guidance');
      const guidanceData = await guidanceRes.json();
      if (guidanceData.success) {
        setGuidance(guidanceData.events || []);
      } else {
        throw new Error('Failed to fetch guidance sessions');
      }

      // Fetch news from API
      const newsRes = await fetch('/api/news');
      const newsData = await newsRes.json();
      if (newsData.success) {
        setNews(newsData.news || []);
      } else {
        throw new Error('Failed to fetch news');
      }

      // Get student data from localStorage
      const savedStudent = localStorage.getItem('student_data');
      if (savedStudent) {
        setStudent(JSON.parse(savedStudent));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
      
      // Use sample data as fallback
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
          attendees: "All students"
        }
      ]);
      
      setGuidance([
        {
          id: 1,
          counselor: "Mr. James Kariuki",
          category: "Career Counseling",
          description: "University application guidance and course selection",
          notes: "Bring your academic records",
          date: "2026-01-27T00:00:00.000Z",
          time: "10:00 AM",
          type: "Individual Session",
          priority: "High"
        }
      ]);
      
      setNews([
        {
          id: 1,
          title: "School Announces New Library Hours",
          excerpt: "Extended library hours to support student studies",
          fullContent: "The school library will now remain open until 6:00 PM on weekdays...",
          date: "2026-01-02T00:00:00.000Z",
          category: "announcement",
          author: "School Administration",
          likes: 15
        }
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
  };

  // Filter data based on search and active tab
  const filteredData = useMemo(() => {
    if (activeTab === 'events') {
      let filtered = events;
      
      // Apply search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(event =>
          event.title.toLowerCase().includes(term) ||
          event.description.toLowerCase().includes(term) ||
          event.location.toLowerCase().includes(term) ||
          event.category.toLowerCase().includes(term)
        );
      }
      
      // Apply date filter
      if (filterDate === 'upcoming') {
        filtered = filtered.filter(event => new Date(event.date) >= new Date());
      } else if (filterDate === 'past') {
        filtered = filtered.filter(event => new Date(event.date) < new Date());
      }
      
      return filtered;
    }
    
    if (activeTab === 'guidance') {
      let filtered = guidance;
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(session =>
          session.counselor.toLowerCase().includes(term) ||
          session.category.toLowerCase().includes(term) ||
          session.description.toLowerCase().includes(term)
        );
      }
      
      return filtered;
    }
    
    if (activeTab === 'news') {
      let filtered = news;
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(item =>
          item.title.toLowerCase().includes(term) ||
          item.excerpt?.toLowerCase().includes(term) ||
          item.fullContent?.toLowerCase().includes(term) ||
          item.author.toLowerCase().includes(term)
        );
      }
      
      return filtered;
    }
    
    return [];
  }, [activeTab, events, guidance, news, searchTerm, filterDate]);

  // Toggle menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Clear search
  const clearSearch = () => setSearchTerm('');

  if (loading) {
    return <LoadingSpinner message="Loading guidance and events..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <ModernGuidanceHeader
        student={student}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onRefresh={handleRefresh}
        onMenuToggle={toggleMenu}
        isMenuOpen={isMenuOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        refreshing={refreshing}
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Welcome Banner */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30"></div>
            <div className="relative p-6 md:p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm w-fit">
                  {activeTab === 'events' && <FiCalendar className="text-2xl" />}
                  {activeTab === 'guidance' && <FiMessageSquare className="text-2xl" />}
                  {activeTab === 'news' && <FiBookOpen className="text-2xl" />}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    {activeTab === 'events' && 'School Events & Activities'}
                    {activeTab === 'guidance' && 'Guidance & Counseling'}
                    {activeTab === 'news' && 'School News & Updates'}
                  </h1>
                  <p className="text-blue-100 text-base md:text-lg">
                    {activeTab === 'events' && 'Stay informed about upcoming events, competitions, and school activities'}
                    {activeTab === 'guidance' && 'Access counseling sessions, career guidance, and support services'}
                    {activeTab === 'news' && 'Latest announcements, achievements, and important updates from school'}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <span className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm text-sm font-bold">
                  <HiSparkles className="text-yellow-300" />
                  {activeTab === 'events' && `Active Events: ${filteredData.length}`}
                  {activeTab === 'guidance' && `Available Sessions: ${filteredData.length}`}
                  {activeTab === 'news' && `Recent Updates: ${filteredData.length}`}
                </span>
                {student && (
                  <span className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm text-sm font-bold">
                    <FaUserFriends className="text-blue-200" />
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
          activeTab={activeTab} 
        />

        {/* Filter and Search Bar */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-4 md:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Search ${activeTab}...`}
                  className="w-full pl-12 pr-10 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FiX />
                  </button>
                )}
              </div>

              {/* Date Filter (Events Only) */}
              {activeTab === 'events' && (
                <div className="flex items-center gap-3">
                  <FiFilter className="text-gray-400" />
                  <select
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gradient-to-r from-gray-50 to-gray-100"
                  >
                    <option value="all">All Events</option>
                    <option value="upcoming">Upcoming Only</option>
                    <option value="past">Past Events</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-2xl">
            <div className="flex items-center gap-3">
              <FaExclamationCircle className="text-red-500 text-xl" />
              <div>
                <p className="text-red-700 font-bold">{error}</p>
                <p className="text-red-600 text-sm">Using sample data for demonstration.</p>
              </div>
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {activeTab === 'events' && 'Upcoming Events'}
              {activeTab === 'guidance' && 'Available Sessions'}
              {activeTab === 'news' && 'Latest News'}
            </h2>
            <span className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-sm font-bold rounded-full">
              {filteredData.length} Items
            </span>
          </div>

          {filteredData.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-gray-300 p-8 md:p-12 text-center">
              <div className="text-gray-300 text-5xl mx-auto mb-4">
                {activeTab === 'events' && <FiCalendar />}
                {activeTab === 'guidance' && <FiMessageSquare />}
                {activeTab === 'news' && <FiBookOpen />}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No items found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? 'Try a different search term' 
                  : 'No items available at the moment'}
              </p>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl font-bold text-sm hover:shadow-lg"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((item) => {
                if (activeTab === 'events') {
                  return <EventCard key={item.id} event={item} />;
                } else if (activeTab === 'guidance') {
                  return <GuidanceCard key={item.id} session={item} />;
                } else {
                  return <NewsCard key={item.id} newsItem={item} />;
                }
              })}
            </div>
          )}
        </div>

        {/* Quick Links/Resources */}
        <div className="mt-12">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 md:p-8 text-white shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-3">Need Assistance?</h3>
                <p className="text-gray-300">
                  Our guidance counselors and support staff are here to help with any concerns.
                </p>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                Book Appointment
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 p-5 rounded-xl backdrop-blur-sm">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <FiMessageSquare /> Guidance Office
                </h4>
                <p className="text-gray-300 text-sm">Room 12, Admin Block</p>
                <p className="text-gray-300 text-sm">Mon-Fri: 8:00 AM - 4:00 PM</p>
              </div>
              <div className="bg-white/10 p-5 rounded-xl backdrop-blur-sm">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <FiBell /> Contact
                </h4>
                <p className="text-gray-300 text-sm">guidance@school.edu</p>
                <p className="text-gray-300 text-sm">(123) 456-7890</p>
              </div>
              <div className="bg-white/10 p-5 rounded-xl backdrop-blur-sm">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <FiAlertCircle /> Emergency
                </h4>
                <p className="text-gray-300 text-sm">24/7 Student Support</p>
                <p className="text-gray-300 text-sm">(123) 456-7891</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Note */}
      <footer className="mt-12 py-6 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} School Guidance & Events Portal. All rights reserved.</p>
          <p className="mt-1">Stay connected with school activities and support services.</p>
        </div>
      </footer>
    </div>
  );
}