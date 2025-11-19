'use client';
import { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { 
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiUsers, 
  FiArrowRight,
  FiShare2,
  FiSearch,
  FiHeart,
  FiX,
  FiLink,
  FiMessageCircle
} from 'react-icons/fi';
import { 
  IoNewspaperOutline,
  IoCalendarClearOutline
} from 'react-icons/io5';
import { 
  FaFacebook,
  FaFacebookMessenger,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaTelegram,
  FaReddit,
  FaInstagram,
  FaEnvelope
} from 'react-icons/fa';

// Loading Spinner Component
const LoadingSpinner = ({ size = 40 }) => (
  <div className="flex justify-center items-center p-8">
    <CircularProgress size={size} style={{ color: '#3b82f6' }} />
  </div>
);

// Date formatting utility
const formatDisplayDate = (isoString) => {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

// Time formatting utility
const formatTime = (timeString) => {
  if (!timeString) return '';
  
  // If it's already in AM/PM format, return as is
  if (timeString.includes('AM') || timeString.includes('PM')) {
    return timeString;
  }
  
  // If it's in 24-hour format, convert to 12-hour
  try {
    const [hours, minutes] = timeString.split(':');
    const hourNum = parseInt(hours);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const twelveHour = hourNum % 12 || 12;
    return `${twelveHour}:${minutes} ${ampm}`;
  } catch (error) {
    return timeString;
  }
};

export default function EventsNewsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showNewsShareModal, setShowNewsShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [eventsData, setEventsData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Essential Social Platforms with comprehensive sharing options
  const socialPlatforms = [
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'bg-white hover:bg-green-50 border border-green-200',
      textColor: 'text-gray-800',
      iconColor: '#25D366',
      shareUrl: (url, title, text) => `https://wa.me/?text=${encodeURIComponent(title + '\n\n' + text + '\n\n' + url)}`,
      description: 'Share via WhatsApp'
    },
    {
      name: 'WhatsApp Group',
      icon: FaWhatsapp,
      color: 'bg-white hover:bg-green-50 border border-green-200',
      textColor: 'text-gray-800',
      iconColor: '#25D366',
      shareUrl: (url, title, text) => `https://web.whatsapp.com/send?text=${encodeURIComponent(title + ' - ' + url)}`,
      description: 'Share to WhatsApp group'
    },
    {
      name: 'Facebook',
      icon: FaFacebook,
      color: 'bg-white hover:bg-blue-50 border border-blue-200',
      textColor: 'text-gray-800',
      iconColor: '#1877F2',
      shareUrl: (url, title, text) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
      description: 'Share on Facebook'
    },
    {
      name: 'Messenger',
      icon: FaFacebookMessenger,
      color: 'bg-white hover:bg-blue-50 border border-blue-200',
      textColor: 'text-gray-800',
      iconColor: '#0084FF',
      shareUrl: (url, title, text) => `fb-messenger://share?link=${encodeURIComponent(url)}&app_id=your_app_id`,
      description: 'Share via Messenger'
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      color: 'bg-white hover:bg-blue-50 border border-blue-200',
      textColor: 'text-gray-800',
      iconColor: '#1DA1F2',
      shareUrl: (url, title, text) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&hashtags=SchoolEvents`,
      description: 'Tweet about this'
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      color: 'bg-white hover:bg-blue-50 border border-blue-200',
      textColor: 'text-gray-800',
      iconColor: '#0A66C2',
      shareUrl: (url, title, text) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      description: 'Share on LinkedIn'
    },
    {
      name: 'Instagram',
      icon: FaInstagram,
      color: 'bg-white hover:bg-pink-50 border border-pink-200',
      textColor: 'text-gray-800',
      iconColor: '#E4405F',
      shareUrl: (url, title, text) => `instagram://library?AssetPath=${encodeURIComponent(url)}&InstagramCaption=${encodeURIComponent(title)}`,
      description: 'Share on Instagram'
    },
    {
      name: 'Telegram',
      icon: FaTelegram,
      color: 'bg-white hover:bg-blue-50 border border-blue-200',
      textColor: 'text-gray-800',
      iconColor: '#0088CC',
      shareUrl: (url, title, text) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      description: 'Share on Telegram'
    },
    {
      name: 'Reddit',
      icon: FaReddit,
      color: 'bg-white hover:bg-orange-50 border border-orange-200',
      textColor: 'text-gray-800',
      iconColor: '#FF4500',
      shareUrl: (url, title, text) => `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      description: 'Share on Reddit'
    },
    {
      name: 'Email',
      icon: FaEnvelope,
      color: 'bg-white hover:bg-gray-50 border border-gray-200',
      textColor: 'text-gray-800',
      iconColor: '#EA4335',
      shareUrl: (url, title, text) => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`,
      description: 'Share via Email'
    }
  ];

  // Categories
  const categories = [
    { id: 'all', name: 'All Events' },
    { id: 'academic', name: 'Academic' },
    { id: 'cultural', name: 'Cultural' },
    { id: 'sports', name: 'Sports' }
  ];

  // Fetch data from APIs
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      if (data.success) {
        setEventsData(data.events || []);
      } else {
        throw new Error(data.error || 'Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEventsData([]);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      if (data.success) {
        setNewsData(data.news || []);
      } else {
        throw new Error(data.error || 'Failed to fetch news');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setNewsData([]);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchEvents(), fetchNews()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fixed calendar integration
  const handleAddToCalendar = (event) => {
    try {
      // Parse the date from the backend format (ISO string)
      const eventDate = new Date(event.date);
      
      // Extract time parts (assuming format like "06:00 PM")
      const timeParts = event.time.split(' - ')[0]; // Get start time
      const [time, modifier] = timeParts.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      
      // Convert to 24-hour format
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      
      // Create start and end dates
      const startDate = new Date(eventDate);
      startDate.setHours(hours, minutes, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setHours(hours + 2, minutes, 0, 0); // Assuming 2-hour duration
      
      // Format for Google Calendar (remove milliseconds and timezone offset)
      const formatForGoogle = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };
      
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatForGoogle(startDate)}/${formatForGoogle(endDate)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
      
      window.open(googleCalendarUrl, '_blank');
    } catch (error) {
      console.error('Error creating calendar event:', error);
      alert('Could not add to calendar. Please check event details.');
    }
  };

  // Enhanced sharing function with platform-specific handling
  const handleShare = (platform, item, type = 'event') => {
    const shareUrl = window.location.href;
    let title, text;
    
    if (type === 'event') {
      title = item.title;
      text = `${item.description}\n\n📅 Date: ${formatDisplayDate(item.date)}\n⏰ Time: ${formatTime(item.time)}\n📍 Location: ${item.location}`;
    } else {
      title = item.title;
      text = `${item.excerpt || item.description}\n\n📰 Published: ${formatDisplayDate(item.date)}\n👤 Author: ${item.author}`;
    }
    
    const platformUrl = platform.shareUrl(shareUrl, title, text);
    
    // Handle different platform types
    if (platform.name === 'Email') {
      window.location.href = platformUrl;
    } else if (platform.name === 'Messenger' || platform.name === 'Instagram') {
      // For mobile apps, try to open the app
      window.open(platformUrl, '_blank');
      // Fallback for desktop
      setTimeout(() => {
        if (!document.hidden) {
          const webUrl = platform.name === 'Messenger' 
            ? `https://www.messenger.com/t/` 
            : `https://www.instagram.com/`;
          window.open(webUrl, '_blank');
        }
      }, 500);
    } else {
      window.open(platformUrl, '_blank', 'width=600,height=400');
    }
  };

  // Copy link to clipboard with enhanced text
  const copyToClipboard = (item, type = 'event') => {
    let text;
    
    if (type === 'event') {
      text = `🎉 ${item.title}\n\n${item.description}\n\n📅 Date: ${formatDisplayDate(item.date)}\n⏰ Time: ${formatTime(item.time)}\n📍 Location: ${item.location}\n\n🔗 ${window.location.href}`;
    } else {
      text = `📰 ${item.title}\n\n${item.excerpt || item.description}\n\n📅 Published: ${formatDisplayDate(item.date)}\n👤 Author: ${item.author}\n\n🔗 ${window.location.href}`;
    }
    
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Open share modal
  const openShareModal = (item, type = 'event') => {
    if (type === 'event') {
      setSelectedEvent(item);
      setShowShareModal(true);
    } else {
      setSelectedNews(item);
      setShowNewsShareModal(true);
    }
  };

  // Search and filter functionality
  const searchFilteredEvents = eventsData.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === 'all' || event.category?.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const searchFilteredNews = newsData.filter(news => {
    return news.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           news.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           news.category?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination
  const totalPages = Math.ceil(searchFilteredEvents.length / itemsPerPage);
  const paginatedEvents = searchFilteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get default image if none provided
  const getImageUrl = (imagePath, type = 'event') => {
    if (!imagePath) {
      return type === 'event' 
        ? '/images/default-event.jpg'
        : '/images/default-news.jpg';
    }
    return imagePath.startsWith('http') ? imagePath : `/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-gray-600 mt-4 text-lg">Loading News & Events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 mb-8">
            <IoCalendarClearOutline className="text-xl" />
            <span className="font-semibold">School Updates</span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Events & News
          </h1>
          <p className="text-xl text-blue-100 max-w-4xl mx-auto mb-8 leading-relaxed">
            Stay updated with the latest happenings, achievements, and upcoming events
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-2xl mx-auto mt-12">
            {[
              { number: eventsData.length, label: 'Upcoming Events', icon: IoCalendarClearOutline },
              { number: newsData.length, label: 'News Articles', icon: IoNewspaperOutline },
              { number: eventsData.filter(e => e.featured).length, label: 'Featured', icon: FiHeart },
              { number: '100%', label: 'Community', icon: FiUsers }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 text-center transition-all duration-300">
                  <Icon className="text-2xl text-white mb-2 mx-auto" />
                  <div className="text-xl lg:text-2xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-blue-100 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Area */}
          <div className="lg:w-2/3">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 lg:mb-0">Upcoming Events</h2>
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <div className="relative flex-1 lg:flex-none">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search events..." 
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full lg:w-64"
                  />
                </div>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveTab(category.id);
                    setCurrentPage(1);
                  }}
                  className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 ${
                    activeTab === category.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Events Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {paginatedEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-xl"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getImageUrl(event.image, 'event')}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500"
                    />
                    {event.featured && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openShareModal(event, 'event');
                        }}
                        className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                      >
                        <FiShare2 className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        event.category === 'academic' ? 'bg-blue-100 text-blue-800' :
                        event.category === 'cultural' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {event.type || event.category}
                      </span>
                      {event.attendees && (
                        <span className="text-sm text-gray-500">{event.attendees} attendees</span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">{event.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-3 text-gray-600">
                        <FiCalendar className="text-blue-500" />
                        <span className="text-sm">{formatDisplayDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <FiClock className="text-green-500" />
                        <span className="text-sm">{formatTime(event.time)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <FiMapPin className="text-red-500" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCalendar(event);
                        }}
                        className={`px-6 py-2 rounded-xl font-semibold text-white transition-colors ${
                          event.registration 
                            ? 'bg-blue-600 hover:bg-blue-700' 
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                        disabled={!event.registration}
                      >
                        Add to Calendar
                      </button>
                      <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
                        Details <FiArrowRight className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}

            {paginatedEvents.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <IoCalendarClearOutline className="mx-auto text-6xl text-gray-400 mb-4" />
                <p className="text-gray-600 text-xl mb-2">No events found</p>
                <p className="text-gray-500">Try changing your search or filter criteria</p>
              </div>
            )}
          </div>

          {/* Sidebar - News & Updates */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <IoNewspaperOutline className="text-blue-600" />
                Latest News
              </h3>
              
              <div className="space-y-6">
                {searchFilteredNews.slice(0, 3).map((news) => (
                  <div
                    key={news.id}
                    className="pb-6 border-b border-gray-200 last:border-b-0 last:pb-0 cursor-pointer transition-all duration-300 hover:bg-gray-50 rounded-lg p-3 -mx-3"
                    onClick={() => setSelectedNews(news)}
                  >
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={getImageUrl(news.image, 'news')}
                          alt={news.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-2 ${
                          news.category === 'achievement' ? 'bg-green-100 text-green-800' :
                          news.category === 'development' ? 'bg-blue-100 text-blue-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {news.category}
                        </span>
                        <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                          {news.title}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{formatDisplayDate(news.date)}</span>
                          {news.likes && (
                            <div className="flex items-center gap-1">
                              <FiHeart className="text-gray-400" />
                              {news.likes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                <h4 className="font-bold mb-3">School Updates</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{eventsData.length}+</div>
                    <div className="text-sm text-blue-100">Events</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{newsData.length}+</div>
                    <div className="text-sm text-blue-100">News</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && !showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="relative h-80 flex-shrink-0">
              <img
                src={getImageUrl(selectedEvent.image, 'event')}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
              >
                <FiX className="text-gray-600 text-xl" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">{selectedEvent.title}</h2>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">{selectedEvent.description}</p>
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 text-xl">Event Details</h4>
                    <div className="flex items-center gap-4 text-gray-600 text-lg">
                      <FiCalendar className="text-blue-500 text-xl" />
                      <span>{formatDisplayDate(selectedEvent.date)}</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600 text-lg">
                      <FiClock className="text-green-500 text-xl" />
                      <span>{formatTime(selectedEvent.time)}</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600 text-lg">
                      <FiMapPin className="text-red-500 text-xl" />
                      <span>{selectedEvent.location}</span>
                    </div>
                    {selectedEvent.attendees && (
                      <div className="flex items-center gap-4 text-gray-600 text-lg">
                        <FiUsers className="text-purple-500 text-xl" />
                        <span>{selectedEvent.attendees} expected attendees</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 text-xl">Additional Info</h4>
                    <div className="text-lg">
                      <strong>Event Type:</strong> {selectedEvent.type || selectedEvent.category}
                    </div>
                    {selectedEvent.speaker && (
                      <div className="text-lg">
                        <strong>Featured Speaker:</strong> {selectedEvent.speaker}
                      </div>
                    )}
                    <div className="text-lg">
                      <strong>Registration:</strong> {selectedEvent.registration ? 'Required' : 'Free Entry'}
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => handleAddToCalendar(selectedEvent)}
                    className="flex-1 max-w-[200px] bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-lg flex items-center justify-center gap-3"
                  >
                    <FiCalendar className="text-xl" />
                    Add to Calendar
                  </button>
                  <button
                    onClick={() => openShareModal(selectedEvent, 'event')}
                    className="flex-1 max-w-[200px] border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 text-lg"
                  >
                    <FiShare2 className="text-gray-600 text-xl" />
                    Share Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* News Detail Modal */}
      {selectedNews && !showNewsShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="relative h-80 flex-shrink-0">
              <img
                src={getImageUrl(selectedNews.image, 'news')}
                alt={selectedNews.title}
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setSelectedNews(null)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
              >
                <FiX className="text-gray-600 text-xl" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedNews.category === 'achievement' ? 'bg-green-100 text-green-800' :
                    selectedNews.category === 'development' ? 'bg-blue-100 text-blue-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {selectedNews.category}
                  </span>
                  <span className="text-gray-500 text-sm">{formatDisplayDate(selectedNews.date)}</span>
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-6">{selectedNews.title}</h2>
                
                <div className="prose prose-lg max-w-none mb-8">
                  {(selectedNews.fullContent || selectedNews.description).split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-600 mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Published by <span className="font-semibold text-gray-700">{selectedNews.author}</span>
                  </div>
                  {selectedNews.likes && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <FiHeart className="text-red-400" />
                      <span className="text-sm">{selectedNews.likes} likes</span>
                    </div>
                  )}
                </div>
                
                {/* Share Button */}
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => openShareModal(selectedNews, 'news')}
                    className="max-w-[200px] w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-lg flex items-center justify-center gap-3"
                  >
                    <FiShare2 className="text-xl" />
                    Share News
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Share Modals */}
      {(showShareModal && selectedEvent) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Share Event</h3>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="text-gray-600 text-lg" />
                </button>
              </div>
              <p className="text-gray-600 mt-2 line-clamp-2">{selectedEvent.title}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {socialPlatforms.map((platform, index) => {
                  const IconComponent = platform.icon;
                  return (
                    <button
                      key={`${platform.name}-${index}`}
                      onClick={() => handleShare(platform, selectedEvent, 'event')}
                      className={`p-4 rounded-xl ${platform.color} transition-all duration-300 flex flex-col items-center justify-center gap-2 min-h-[100px]`}
                      title={platform.description}
                    >
                      <IconComponent 
                        className="text-2xl" 
                        style={{ color: platform.iconColor }}
                      />
                      <span className={`text-xs font-semibold ${platform.textColor} text-center`}>
                        {platform.name}
                      </span>
                      {platform.description && (
                        <span className="text-xs text-gray-500 text-center mt-1">
                          {platform.description}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 border-t border-gray-200 pt-6">
                <button
                  onClick={() => copyToClipboard(selectedEvent, 'event')}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-3"
                >
                  <FiLink className="text-lg" />
                  {copied ? 'Copied!' : 'Copy Event Link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {(showNewsShareModal && selectedNews) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Share News</h3>
                <button 
                  onClick={() => setShowNewsShareModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="text-gray-600 text-lg" />
                </button>
              </div>
              <p className="text-gray-600 mt-2 line-clamp-2">{selectedNews.title}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {socialPlatforms.map((platform, index) => {
                  const IconComponent = platform.icon;
                  return (
                    <button
                      key={`${platform.name}-${index}`}
                      onClick={() => handleShare(platform, selectedNews, 'news')}
                      className={`p-4 rounded-xl ${platform.color} transition-all duration-300 flex flex-col items-center justify-center gap-2 min-h-[100px]`}
                      title={platform.description}
                    >
                      <IconComponent 
                        className="text-2xl" 
                        style={{ color: platform.iconColor }}
                      />
                      <span className={`text-xs font-semibold ${platform.textColor} text-center`}>
                        {platform.name}
                      </span>
                      {platform.description && (
                        <span className="text-xs text-gray-500 text-center mt-1">
                          {platform.description}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 border-t border-gray-200 pt-6">
                <button
                  onClick={() => copyToClipboard(selectedNews, 'news')}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-3"
                >
                  <FiLink className="text-lg" />
                  {copied ? 'Copied!' : 'Copy News Link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}