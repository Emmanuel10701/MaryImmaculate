'use client';
import { useState, useEffect } from 'react';
import { 
  FiCalendar,
  FiClock,
  FiMapPin,
  FiShare2,
  FiArrowRight,
  FiBookOpen,
  FiTrendingUp,
  FiAward,
  FiCheckCircle,
  FiChevronRight,
  FiUser,
  FiTag,
  FiHeart,
  FiMessageCircle,
  FiUsers,
  FiStar,
  FiMail,
  FiBriefcase
} from 'react-icons/fi';
import { IoLogoGoogle, IoRocketOutline, IoNewspaperOutline, IoPeopleOutline, IoRibbonOutline } from 'react-icons/io5';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaGoogle, FaRegClock } from 'react-icons/fa';
import { GiGraduateCap } from 'react-icons/gi';
import { TbTargetArrow } from 'react-icons/tb';
import Image from 'next/image';
import CircularProgress from '@mui/material/CircularProgress';

const ModernEventsNewsSection = () => {
  const [selectedTab, setSelectedTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(0);
  const [selectedNews, setSelectedNews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch events data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        
        if (data.success && Array.isArray(data.events)) {
          const sortedEvents = data.events
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3);
          setEvents(sortedEvents);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setEvents([]);
      }
    };

    fetchEvents();
  }, []);

  // Fetch news data - FIXED: using data.data instead of data.news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        const data = await response.json();
        
        // FIX: Access data.data instead of data.news
        if (data.success && Array.isArray(data.data)) {
          const sortedNews = data.data
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3);
          setNews(sortedNews);
        } else {
          setNews([]);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setNews([]);
      }
    };

    fetchNews();
  }, []);

  // Combined loading state
  useEffect(() => {
    if (events.length > 0 || news.length > 0) {
      setLoading(false);
    }
  }, [events, news]);

  const currentEvent = events[selectedEvent];
  const currentNews = news[selectedNews];

  // Modern color palette
  const getCategoryColor = (category) => {
    const colors = {
      'academic': { 
        bg: 'bg-blue-50', 
        text: 'text-blue-700', 
        border: 'border-blue-100',
        accent: 'bg-blue-500',
        dark: 'bg-blue-600'
      },
      'sports': { 
        bg: 'bg-emerald-50', 
        text: 'text-emerald-700', 
        border: 'border-emerald-100',
        accent: 'bg-emerald-500',
        dark: 'bg-emerald-600'
      },
      'cultural': { 
        bg: 'bg-purple-50', 
        text: 'text-purple-700', 
        border: 'border-purple-100',
        accent: 'bg-purple-500',
        dark: 'bg-purple-600'
      },
      'science': { 
        bg: 'bg-cyan-50', 
        text: 'text-cyan-700', 
        border: 'border-cyan-100',
        accent: 'bg-cyan-500',
        dark: 'bg-cyan-600'
      },
      'training': { 
        bg: 'bg-amber-50', 
        text: 'text-amber-700', 
        border: 'border-amber-100',
        accent: 'bg-amber-500',
        dark: 'bg-amber-600'
      },
      'guidance': { 
        bg: 'bg-teal-50', 
        text: 'text-teal-700', 
        border: 'border-teal-100',
        accent: 'bg-teal-500',
        dark: 'bg-teal-600'
      },
      'achievement': { 
        bg: 'bg-green-50', 
        text: 'text-green-700', 
        border: 'border-green-100',
        accent: 'bg-green-500',
        dark: 'bg-green-600'
      },
      'infrastructure': { 
        bg: 'bg-orange-50', 
        text: 'text-orange-700', 
        border: 'border-orange-100',
        accent: 'bg-orange-500',
        dark: 'bg-orange-600'
      }
    };
    return colors[category?.toLowerCase()] || colors.academic;
  };

  const getCategoryIcon = (category, isNews = false) => {
    const icons = {
      'academic': <FiBookOpen className="w-4 h-4" />,
      'sports': <FiTrendingUp className="w-4 h-4" />,
      'cultural': <GiGraduateCap className="w-4 h-4" />,
      'training': <FiAward className="w-4 h-4" />,
      'science': <IoRocketOutline className="w-4 h-4" />,
      'guidance': <TbTargetArrow className="w-4 h-4" />,
      'achievement': <FiAward className="w-4 h-4" />,
      'infrastructure': <FiCheckCircle className="w-4 h-4" />
    };
    
    if (isNews) {
      return <IoNewspaperOutline className="w-4 h-4" />;
    }
    
    return icons[category?.toLowerCase()] || <FiCalendar className="w-4 h-4" />;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      return {
        day: date.getDate(),
        month: monthNames[date.getMonth()],
        weekday: dayNames[date.getDay()],
        full: `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
    } catch {
      return {
        day: '--',
        month: '---',
        weekday: '---',
        full: 'Date not available',
        time: ''
      };
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-[600px] w-full max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
        {/* Header Skeleton */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="h-6 sm:h-8 w-40 sm:w-48 bg-gray-200 rounded-lg animate-pulse mb-3 sm:mb-4 mx-auto" />
          <div className="h-4 sm:h-6 w-48 sm:w-64 bg-gray-100 rounded-md animate-pulse mx-auto" />
        </div>
        
        {/* Tabs Skeleton */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="h-10 sm:h-12 w-56 sm:w-64 bg-gray-100 rounded-full animate-pulse" />
        </div>

        {/* Content Grid Skeleton - Main card on LEFT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Main Card on LEFT */}
          <div className="lg:col-span-8">
            <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200">
              <div className="h-48 sm:h-64 bg-gray-200 animate-pulse" />
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="h-6 sm:h-8 w-3/4 bg-gray-300 rounded animate-pulse" />
                <div className="h-3 sm:h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-3 sm:h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4">
                  <div className="h-8 sm:h-10 bg-gray-100 rounded-lg animate-pulse" />
                  <div className="h-8 sm:h-10 bg-gray-100 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar on RIGHT */}
          <div className="lg:col-span-4 space-y-3 sm:space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200 bg-white">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gray-200 animate-pulse" />
                  <div className="flex-1 space-y-1.5 sm:space-y-2">
                    <div className="h-3 sm:h-4 w-24 sm:w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 sm:h-6 w-32 sm:w-48 bg-gray-300 rounded animate-pulse" />
                    <div className="h-2.5 sm:h-3 w-28 sm:w-36 bg-gray-100 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && events.length === 0 && news.length === 0) {
    return (
      <div className="min-h-[70vh] w-full flex items-center justify-center p-3 sm:p-4 bg-[#f8f9fa]">
        {/* 80% Width Container - Clean & Editorial */}
        <div className="w-full max-w-[90%] sm:max-w-[80%] min-h-[360px] sm:min-h-[480px] relative overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[3rem] bg-white border border-gray-100 shadow-lg sm:shadow-[0_40px_100px_-30px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center p-6 sm:p-8 md:p-20 text-center">
          
          {/* Subtle Brand Accent */}
          <div className="absolute top-0 left-0 w-full h-1 sm:h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          {/* Branding Title */}
          <div className="mb-4 sm:mb-6">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gray-400">
              Katwanya High School
            </h4>
          </div>

          {/* Icon Container */}
          <div className="mb-6 sm:mb-10 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-50 rounded-xl sm:rounded-2xl lg:rounded-[2rem] flex items-center justify-center border border-gray-100 shadow-inner">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15M9 11l3 3m0 0l3-3m-3 3V8" />
            </svg>
          </div>

          {/* Main Content */}
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-black text-gray-900 mb-4 sm:mb-6 tracking-tight">
            News Feed Unavailable
          </h2>
          
          <p className="text-gray-500 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-12 px-2">
            We're currently experiencing a connection issue with our news archives. 
            Our team is working to restore the latest updates and event schedules for our community.
          </p>

          {/* Action Button - Large & Tap-Friendly */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="group flex items-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 bg-gray-900 text-white font-bold rounded-xl sm:rounded-2xl hover:bg-black transition-all hover:scale-[1.02] active:scale-95 shadow-lg sm:shadow-xl shadow-gray-200 text-sm sm:text-base"
            >
              <svg 
                className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-700" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Content
            </button>
          </div>

          {/* Status indicator */}
          <div className="mt-8 sm:mt-12 flex items-center gap-1.5 sm:gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-xs">System Error: {error || "Connection Timeout"}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-sans p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-10 text-center">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-3 sm:mb-4 md:mb-6">
            <IoNewspaperOutline className="text-blue-600 w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-blue-700 font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-widest">
              Latest Updates
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-slate-900 tracking-tight mb-2 sm:mb-3 md:mb-4 px-2">
            School <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Events & News</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-3 sm:px-4">
            Stay updated with our latest happenings, achievements, and announcements
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <div className="inline-flex p-0.5 sm:p-1 bg-slate-100 rounded-lg sm:rounded-xl border border-slate-200">
            <button
              onClick={() => setSelectedTab('events')}
              className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedTab === 'events'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <FiCalendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="whitespace-nowrap">Events ({events.length})</span>
              </div>
            </button>
            <button
              onClick={() => setSelectedTab('news')}
              className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedTab === 'news'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <IoNewspaperOutline className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="whitespace-nowrap">News ({news.length})</span>
              </div>
            </button>
          </div>
        </div>

        {/* Main Grid - Main card on LEFT, Sidebar on RIGHT */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6 items-start">
          
          {/* Main Featured Card (LEFT SIDE) */}
          <div className="lg:col-span-8 flex flex-col bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl border border-slate-100 overflow-hidden">
            
            {/* Image Section */}
            <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 2xl:h-96 overflow-hidden">
              {selectedTab === 'events' ? (
                currentEvent ? (
                  <>
                    {currentEvent.image ? (
                      <Image
                        src={currentEvent.image} 
                        alt={currentEvent.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 50vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <GiGraduateCap className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-8xl opacity-30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    
                    {/* Overlay Content */}
                    <div className="absolute bottom-0 left-0 right-0 z-20 p-3 sm:p-4 md:p-6 lg:p-8">
                      <span className={`px-2 sm:px-3 md:px-4 py-1 md:py-2 ${getCategoryColor(currentEvent.category).accent} text-white text-xs font-bold uppercase tracking-widest rounded-full inline-block mb-1.5 sm:mb-2 md:mb-3`}>
                        {currentEvent.category}
                      </span>
                      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-white leading-tight">{currentEvent.title}</h2>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3 mt-1 sm:mt-1.5 md:mt-2 text-white/90">
                        <span className="flex items-center gap-1 text-xs sm:text-sm">
                          <FiCalendar className="text-xs" />
                          {formatDate(currentEvent.date).full}
                        </span>
                        <span className="hidden sm:inline w-1 h-1 bg-white/50 rounded-full"></span>
                        <span className="flex items-center gap-1 text-xs sm:text-sm">
                          <FiMapPin className="text-xs" />
                          {currentEvent.location}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
                    <div className="text-white text-center p-4 sm:p-6 md:p-8">
                      <FiCalendar className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl mx-auto opacity-50" />
                      <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl font-bold">No Events Available</p>
                      <p className="mt-1 sm:mt-2 text-xs md:text-sm opacity-90">Check back later for updates</p>
                    </div>
                  </div>
                )
              ) : (
                currentNews ? (
                  <>
                    {currentNews.image ? (
                      <Image
                        src={currentNews.image} 
                        alt={currentNews.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 50vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                        <IoNewspaperOutline className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-8xl opacity-30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    
                    {/* Overlay Content */}
                    <div className="absolute bottom-0 left-0 right-0 z-20 p-3 sm:p-4 md:p-6 lg:p-8">
                      <span className={`px-2 sm:px-3 md:px-4 py-1 md:py-2 ${getCategoryColor(currentNews.category).accent} text-white text-xs font-bold uppercase tracking-widest rounded-full inline-block mb-1.5 sm:mb-2 md:mb-3`}>
                        {currentNews.category}
                      </span>
                      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-white leading-tight">{currentNews.title}</h2>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3 mt-1 sm:mt-1.5 md:mt-2 text-white/90">
                        <span className="flex items-center gap-1 text-xs sm:text-sm">
                          <FiUser className="text-xs" />
                          {currentNews.author || 'School Administration'}
                        </span>
                        <span className="hidden sm:inline w-1 h-1 bg-white/50 rounded-full"></span>
                        <span className="flex items-center gap-1 text-xs sm:text-sm">
                          <FiCalendar className="text-xs" />
                          {formatDate(currentNews.date).full}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center p-4">
                    <div className="text-white text-center p-4 sm:p-6 md:p-8">
                      <IoNewspaperOutline className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl mx-auto opacity-50" />
                      <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl font-bold">No News Available</p>
                      <p className="mt-1 sm:mt-2 text-xs md:text-sm opacity-90">Check back later for updates</p>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Content Section */}
            <div className="flex-grow p-3 sm:p-4 md:p-6 lg:p-8 bg-white relative">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                {/* Left Column: Description */}
                <div className="lg:col-span-3 space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
                  <div className="space-y-3 sm:space-y-4 md:space-y-6">
                    <div>
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.1em] sm:tracking-[0.2em] mb-2 sm:mb-3 md:mb-4 flex items-center gap-1.5 sm:gap-2">
                        <FiBookOpen className="text-blue-500 w-3 h-3 sm:w-4 sm:h-4" /> 
                        {selectedTab === 'events' ? 'Event Details' : 'Article Summary'}
                      </h4>
                      <p className="text-slate-600 leading-relaxed text-sm sm:text-base lg:text-lg">
                        {selectedTab === 'events' 
                          ? (currentEvent?.description || 'No description available.')
                          : (currentNews?.excerpt || currentNews?.fullContent || 'No content available.')
                        }
                      </p>
                    </div>

                    {selectedTab === 'events' && currentEvent?.speaker && (
                      <div className="relative p-3 sm:p-4 md:p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-600 rounded-r-lg sm:rounded-r-xl md:rounded-r-2xl">
                        <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 text-blue-200">
                          <FiUser className="text-lg sm:text-xl md:text-2xl lg:text-3xl" />
                        </div>
                        <p className="relative z-10 text-slate-700 font-medium leading-relaxed text-sm sm:text-base">
                          <span className="font-bold">Guest Speaker:</span> {currentEvent.speaker}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Details & Actions */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
                  <div className="space-y-3 sm:space-y-4 md:space-y-6">
                    {selectedTab === 'events' && currentEvent ? (
                      <>
                        {/* Event Info */}
                        <div>
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.1em] sm:tracking-[0.2em] mb-2 sm:mb-3 md:mb-4 flex items-center gap-1.5 sm:gap-2">
                            <FiClock className="text-green-500 w-3 h-3 sm:w-4 sm:h-4" /> Event Information
                          </h4>
                          <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                            <li className="text-sm md:text-base text-slate-700 font-medium flex items-start gap-2 sm:gap-3">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-1 sm:mt-1.5 md:mt-2 rounded-full bg-green-500 flex-shrink-0"></div>
                              <span><span className="font-bold">Time:</span> {currentEvent.time || formatDate(currentEvent.date).time}</span>
                            </li>
                            <li className="text-sm md:text-base text-slate-700 font-medium flex items-start gap-2 sm:gap-3">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-1 sm:mt-1.5 md:mt-2 rounded-full bg-green-500 flex-shrink-0"></div>
                              <span><span className="font-bold">Location:</span> {currentEvent.location}</span>
                            </li>
                            {currentEvent.type && (
                              <li className="text-sm md:text-base text-slate-700 font-medium flex items-start gap-2 sm:gap-3">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-1 sm:mt-1.5 md:mt-2 rounded-full bg-green-500 flex-shrink-0"></div>
                                <span><span className="font-bold">Type:</span> {currentEvent.type}</span>
                              </li>
                            )}
                          </ul>
                        </div>
                        {/* Action Buttons */}
                        <div className="pt-3 md:pt-4 border-t border-slate-200">
                          <div className="flex gap-2 sm:gap-3">
                            <button 
                              onClick={() => {
                                if (!currentEvent) return;
                                const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(currentEvent.title)}&dates=20260129/20260129&details=${encodeURIComponent(currentEvent.description)}&location=${encodeURIComponent(currentEvent.location)}`;
                                window.open(url, '_blank');
                              }}
                              className="flex-1 py-2.5 sm:py-3 px-2 sm:px-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 hover:shadow-lg active:scale-[0.98] transition-all min-w-0"
                            >
                              <IoLogoGoogle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                              <span className="truncate">Add to Calendar</span>
                            </button>
                            
                            <button 
                              onClick={() => setShowShareModal(true)}
                              className="flex-1 py-2.5 sm:py-3 px-2 sm:px-3 bg-white border-2 border-slate-900 text-slate-900 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-slate-50 active:scale-[0.98] transition-all min-w-0"
                            >
                              <FiShare2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                              <span className="truncate">Share Event</span>
                            </button>
                          </div>
                        </div>
                      </>
                    ) : selectedTab === 'news' && currentNews ? (
                      <>
                        {/* News Info */}
                        <div>
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.1em] sm:tracking-[0.2em] mb-2 sm:mb-3 md:mb-4 flex items-center gap-1.5 sm:gap-2">
                            <IoRibbonOutline className="text-amber-500 w-3 h-3 sm:w-4 sm:h-4" /> Article Details
                          </h4>
                          <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                            <li className="text-sm md:text-base text-slate-700 font-medium flex items-start gap-2 sm:gap-3">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-1 sm:mt-1.5 md:mt-2 rounded-full bg-amber-500 flex-shrink-0"></div>
                              <span><span className="font-bold">Published:</span> {formatDate(currentNews.date).full}</span>
                            </li>
                            <li className="text-sm md:text-base text-slate-700 font-medium flex items-start gap-2 sm:gap-3">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-1 sm:mt-1.5 md:mt-2 rounded-full bg-amber-500 flex-shrink-0"></div>
                              <span><span className="font-bold">Author:</span> {currentNews.author || 'School Administration'}</span>
                            </li>
                            <li className="text-sm md:text-base text-slate-700 font-medium flex items-start gap-2 sm:gap-3">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-1 sm:mt-1.5 md:mt-2 rounded-full bg-amber-500 flex-shrink-0"></div>
                              <span><span className="font-bold">Category:</span> {currentNews.category}</span>
                            </li>
                          </ul>
                        </div>

                        {/* News Actions */}
                        <div className="pt-3 md:pt-4 border-t border-slate-200">
                          <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <button className="flex items-center gap-1.5 sm:gap-2 text-slate-500 hover:text-red-500 transition-colors">
                              <FiHeart className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span className="text-xs sm:text-sm font-bold">{currentNews.likes || 0}</span>
                            </button>
                            <button 
                              onClick={() => setShowShareModal(true)}
                              className="flex items-center gap-1.5 sm:gap-2 text-slate-500 hover:text-blue-500 transition-colors"
                            >
                              <FiShare2 className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span className="text-xs sm:text-sm font-bold">Share</span>
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => window.location.href = "pages/eventsandnews"}
                            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg active:scale-[0.98] transition-all"
                          >
                            Read Full Article
                            <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Sidebar Cards (RIGHT SIDE) */}
          <div className="lg:col-span-4 space-y-3 sm:space-y-4 md:space-y-6 mt-4 sm:mt-5 md:mt-6 lg:mt-0">
            {/* List Items */}
            {selectedTab === 'events' ? (
              events.length > 0 ? (
                events.map((event, index) => {
                  const colors = getCategoryColor(event.category);
                  const isSelected = selectedEvent === index;
                  const date = formatDate(event.date);
                  
                  return (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(index)}
                      className={`w-full group relative bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 shadow border-2 ${
                        isSelected 
                          ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-white' 
                          : 'border-slate-100 hover:border-blue-200 hover:shadow-lg'
                      } transition-all duration-300 text-left overflow-hidden`}
                    >
                      <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                        <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex-shrink-0 rounded-lg sm:rounded-xl overflow-hidden">
                          {event.image ? (
                            <img
                              src={event.image} 
                              alt={event.title}
                              className="w-full h-full object-cover group-hover:scale-100 transition-transform duration-500"
                            />
                          ) : (
                            <div className={`absolute inset-0 ${colors.dark} flex items-center justify-center`}>
                              <FiCalendar className="text-white text-sm sm:text-lg md:text-2xl" />
                            </div>
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center justify-between mb-1 sm:mb-2">
                            <span className={`px-2 py-1 ${colors.accent} text-white text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-full`}>
                              {event.category}
                            </span>
                            {isSelected && (
                              <span className="flex items-center gap-1 text-blue-600 text-[9px] sm:text-[10px] md:text-xs font-bold">
                                <FiCheckCircle className="text-xs" /> Viewing
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate text-sm sm:text-base md:text-lg">
                            {event.title}
                          </h3>
                          <p className="text-slate-500 text-xs md:text-sm mt-1 flex items-center gap-1">
                            <FiClock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            {event.time || date.time}
                          </p>
                          <div className="flex items-center gap-1 text-[9px] sm:text-[10px] md:text-xs text-blue-600 mt-1.5 sm:mt-2 md:mt-3 font-bold tracking-tighter">
                            View Details <FiChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="w-full bg-gradient-to-br from-white to-purple-50/30 rounded-xl sm:rounded-2xl border border-purple-100 p-4 sm:p-6 md:p-8 text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <FiCalendar className="text-purple-400 text-xl sm:text-2xl md:text-3xl" />
                  </div>
                  
                  <h3 className="text-slate-800 font-bold text-base sm:text-lg mb-1 sm:mb-2">
                    No Upcoming Events
                  </h3>
                  
                  <p className="text-slate-600 text-sm sm:text-base mb-3 sm:mb-4">
                    Events will appear here once scheduled
                  </p>
                  
                  <button className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-purple-200 text-purple-600 rounded-lg text-xs sm:text-sm font-medium hover:bg-purple-50 transition-colors duration-200">
                    <span>Get Notified</span>
                    <FiCalendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>
              )
            ) : (
              news.length > 0 ? (
                news.map((newsItem, index) => {
                  const colors = getCategoryColor(newsItem.category);
                  const isSelected = selectedNews === index;
                  const date = formatDate(newsItem.date);
                  
                  return (
                    <button
                      key={newsItem.id}
                      onClick={() => setSelectedNews(index)}
                      className={`w-full group relative bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 shadow border-2 ${
                        isSelected 
                          ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-white' 
                          : 'border-slate-100 hover:border-purple-200 hover:shadow-lg'
                      } transition-all duration-300 text-left overflow-hidden`}
                    >
                      <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                        <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex-shrink-0 rounded-lg sm:rounded-xl overflow-hidden">
                          {newsItem.image ? (
                            <img
                              src={newsItem.image} 
                              alt={newsItem.title}
                              className="w-full h-full object-cover group-hover:scale-100 transition-transform duration-500"
                            />
                          ) : (
                            <div className={`absolute inset-0 ${colors.dark} flex items-center justify-center`}>
                              <IoNewspaperOutline className="text-white text-sm sm:text-lg md:text-2xl" />
                            </div>
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center justify-between mb-1 sm:mb-2">
                            <span className={`px-2 py-1 ${colors.accent} text-white text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-full`}>
                              {newsItem.category}
                            </span>
                            {isSelected && (
                              <span className="flex items-center gap-1 text-purple-600 text-[9px] sm:text-[10px] md:text-xs font-bold">
                                <FiCheckCircle className="text-xs" /> Reading
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors truncate text-sm sm:text-base md:text-lg">
                            {newsItem.title}
                          </h3>
                          <p className="text-slate-500 text-xs md:text-sm mt-1 flex items-center gap-1">
                            <FiUser className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            {newsItem.author || 'Admin'}
                          </p>
                          <div className="flex items-center gap-1 text-[9px] sm:text-[10px] md:text-xs text-purple-600 mt-1.5 sm:mt-2 md:mt-3 font-bold tracking-tighter">
                            Read Article <FiChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="w-full bg-gradient-to-br from-white via-purple-50/50 to-pink-50/30 rounded-xl sm:rounded-2xl border border-purple-100/70 p-4 sm:p-6 md:p-8 text-center shadow-sm hover:shadow-md transition-shadow duration-300 backdrop-blur-sm">
                  <div className="relative inline-flex mb-3 sm:mb-4 md:mb-5">
                    <IoNewspaperOutline className="text-purple-400 text-3xl sm:text-4xl md:text-5xl relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-200/40 to-pink-200/20 blur-xl rounded-full" />
                  </div>
                  
                  <p className="text-slate-700 font-semibold text-base sm:text-lg md:text-xl mb-1.5 sm:mb-2">
                    No News Articles Yet
                  </p>
                  
                  <p className="text-slate-500 text-sm sm:text-base max-w-xs mx-auto leading-relaxed">
                    We'll be sharing updates and announcements here soon
                  </p>
                  
                  {/* Optional decorative elements */}
                  <div className="mt-4 sm:mt-6 flex justify-center items-center gap-2 sm:gap-3 text-purple-300/50">
                    <div className="h-px w-6 sm:w-8 md:w-12 bg-gradient-to-r from-transparent to-purple-300/30" />
                    <span className="text-xs font-medium tracking-wider">COMING SOON</span>
                    <div className="h-px w-6 sm:w-8 md:w-12 bg-gradient-to-r from-purple-300/30 to-transparent" />
                  </div>
                </div>
              )
            )}

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 text-white">
              <div className="flex items-center gap-2 md:gap-3 mb-2.5 sm:mb-3 md:mb-4">
                <div className="p-1.5 sm:p-2 md:p-3 bg-white/20 rounded-lg sm:rounded-xl md:rounded-2xl">
                  <IoNewspaperOutline className="text-base sm:text-lg md:text-xl" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] opacity-90 mb-0.5 sm:mb-1">Latest Updates</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-black">
                    {selectedTab === 'events' ? `${events.length} Events` : `${news.length} News`}
                  </p>
                </div>
              </div>
              
              <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm opacity-90">Upcoming Events</span>
                  <span className="font-bold text-sm sm:text-base">{events.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm opacity-90">News Articles</span>
                  <span className="font-bold text-sm sm:text-base">{news.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm opacity-90">Active Updates</span>
                  <span className="font-bold text-sm sm:text-base">{events.length + news.length}</span>
                </div>
              </div>
              
              <div className="mt-2.5 sm:mt-3 md:mt-4 pt-2.5 sm:pt-3 md:pt-4 border-t border-white/20">
                <button 
                  onClick={() => window.location.href = selectedTab === 'events' ? '/pages/eventsandnews' : '/pages/eventsandnews'}
                  className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                >
                  <span className="truncate">View All {selectedTab === 'events' ? 'Events' : 'News'}</span>
                  <FiChevronRight className="text-xs" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-sm w-full shadow-2xl border border-slate-200">
            <div className="text-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
                Share This {selectedTab === 'events' ? 'Event' : 'Article'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Let others know about this {selectedTab === 'events' ? 'event' : 'news'}
              </p>
            </div>
            
            <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
              {[
                { platform: 'whatsapp', icon: FaWhatsapp, color: 'bg-green-100 text-green-600' },
                { platform: 'twitter', icon: FaTwitter, color: 'bg-sky-100 text-sky-600' },
                { platform: 'facebook', icon: FaFacebookF, color: 'bg-blue-100 text-blue-600' },
                { platform: 'email', icon: FaGoogle, color: 'bg-red-100 text-red-600' }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button 
                    key={item.platform}
                    onClick={() => {
                      const currentItem = selectedTab === 'events' ? currentEvent : currentNews;
                      if (!currentItem) return;
                      
                      const url = `${window.location.origin}/${selectedTab}/${currentItem.id}`;
                      const text = `Check out "${currentItem.title}"`;
                      
                      const shareUrls = {
                        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
                        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
                        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
                        email: `mailto:?subject=${encodeURIComponent(currentItem.title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`
                      };
                      
                      if (item.platform === 'email') {
                        window.location.href = shareUrls[item.platform];
                      } else {
                        window.open(shareUrls[item.platform], '_blank');
                      }
                    }}
                    className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg sm:rounded-xl hover:scale-100 active:scale-95 transition-all"
                  >
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-1.5 sm:mb-2 ${item.color}`}>
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 capitalize truncate w-full">
                      {item.platform}
                    </span>
                  </button>
                );
              })}
            </div>
            
            {/* Copy Link */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-slate-700">
                  {selectedTab === 'events' ? 'Event' : 'Article'} Link
                </span>
                <button 
                  onClick={() => {
                    const currentItem = selectedTab === 'events' ? currentEvent : currentNews;
                    if (!currentItem) return;
                    
                    navigator.clipboard.writeText(`${window.location.origin}/${selectedTab}/${currentItem.id}`);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs sm:text-sm font-bold hover:bg-slate-200 active:scale-95 transition-all"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="bg-slate-50 rounded-lg p-2 sm:p-3 text-xs sm:text-sm text-slate-600 font-mono truncate">
                {selectedTab === 'events' 
                  ? (currentEvent ? `${window.location.origin}/pages/eventsandnews` : '')
                  : (currentNews ? `${window.location.origin}/pages/eventsandnews` : '')
                }
              </div>
            </div>
            
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-4 sm:mt-6 py-2.5 sm:py-3 text-slate-500 font-bold text-xs sm:text-sm hover:text-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernEventsNewsSection;