'use client';
import React from 'react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiX, 
  FiHome,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiShare2,
  FiHeart,
  FiImage,
  FiVideo,
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiGrid,
  FiList,
  FiChevronUp,
  FiChevronDown,
  FiUsers,
  FiBook,
  FiAward,
  FiMusic,
  FiMic,
  FiCamera,
  FiCalendar,
  FiUser,
  FiBookOpen,
  FiTarget,
  FiStar,
  FiGlobe,
  FiMessageSquare,
  FiFacebook,
  FiTwitter,
  FiFileText,
  FiInfo
} from 'react-icons/fi';
import { FaWhatsapp, FaFacebookF, FaTwitter, FaCopy } from 'react-icons/fa';
import { 
  IoClose,
  IoMenu
} from 'react-icons/io5';
import { CircularProgress, Backdrop } from '@mui/material';
import Image from 'next/image';

// Modern color palette
const COLORS = {
  primary: '#1d4ed8', // blue-700
  secondary: '#3b82f6', // blue-600
  accent: '#f59e0b', // amber-500
  background: '#f8fafc', // slate-50
  surface: '#ffffff',
  text: '#1e293b', // slate-800
  textLight: '#64748b', // slate-600
  border: '#e2e8f0', // slate-200
  success: '#10b981', // emerald-500
  warning: '#f59e0b', // amber-500
  error: '#ef4444', // red-500
  info: '#3b82f6', // blue-500
  overlay: 'rgba(0, 0, 0, 0.85)'
};

// Modern typography scale
const TYPOGRAPHY = {
  h1: 'text-2xl lg:text-3xl font-bold',
  h2: 'text-xl lg:text-2xl font-bold',
  h3: 'text-lg lg:text-xl font-semibold',
  h4: 'text-base lg:text-lg font-semibold',
  body1: 'text-sm lg:text-base',
  body2: 'text-xs lg:text-sm',
  caption: 'text-xs',
  small: 'text-xs'
};

// Modern spacing scale
const SPACING = {
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem'    // 48px
};

// Card elevation styles
const ELEVATION = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow',
  lg: 'shadow-lg',
  xl: 'shadow-xl'
};

// Button variants
const BUTTON_VARIANTS = {
  primary: `bg-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%) text-white`,
  secondary: `bg-${COLORS.surface} text-${COLORS.text} border border-${COLORS.border}`,
  outline: `border border-${COLORS.border} text-${COLORS.text} bg-transparent`,
  ghost: `text-${COLORS.text} bg-transparent hover:bg-${COLORS.background}/50`,
  danger: `bg-gradient(135deg, ${COLORS.error} 0%, #dc2626 100%) text-white`
};

// Helper function to clean up file names
const cleanFileName = (filename) => {
  if (!filename) return 'File';
  const name = filename.split('/').pop();
  // Remove UUID and random characters
  const cleanName = name.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/i, '');
  const withoutExt = cleanName.split('.').slice(0, -1).join('.');
  // Capitalize first letter of each word
  return withoutExt
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ') || 'Image';
};

export default function ModernGallery() {
  const [activeCategory, setActiveCategory] = useState('GENERAL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('Mary-Immaculate-gallery-favorites');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });
  const [sortBy, setSortBy] = useState('newest');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedYear, setSelectedYear] = useState('all');
  const [showSidebar, setShowSidebar] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState('GENERAL');
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  
  const videoRef = useRef(null);
  const autoPlayRef = useRef(null);
  const sidebarRef = useRef(null);

  // School Information
  const schoolInfo = {
    name: "Mary ImmaculateSecondary School",
    motto: "Discipline, Diligence, Excellence",
    established: 1982,
    students: 1450,
    teachers: 95,
    classrooms: 52,
    motto2: "Education for Life"
  };

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('Mary-Immaculate-gallery-favorites', JSON.stringify(Array.from(favorites)));
    }
  }, [favorites]);

  // Fetch galleries from API
  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/gallery');
        const data = await response.json();
        if (data.success) {
          setGalleries(data.galleries || []);
        }
      } catch (error) {
        console.error('Failed to fetch galleries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalFiles = galleries.reduce((acc, gallery) => acc + (gallery?.files?.length || 0), 0);
    const uniqueCategories = new Set(galleries.map(g => g?.category).filter(Boolean)).size;
    const thisMonth = galleries.filter(g => {
      if (!g?.createdAt) return false;
      const galleryDate = new Date(g.createdAt);
      const now = new Date();
      return galleryDate.getMonth() === now.getMonth() && galleryDate.getFullYear() === now.getFullYear();
    }).length;

    return {
      totalGalleries: galleries.length,
      totalFiles,
      totalCategories: uniqueCategories,
      thisMonth
    };
  }, [galleries]);

  // Auto-slide functionality
  useEffect(() => {
    if (selectedMedia && autoPlay && selectedMedia.files && selectedMedia.files.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setLightboxIndex(prev => (prev + 1) % selectedMedia.files.length);
      }, 4000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [selectedMedia, autoPlay, lightboxIndex]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && 
          !event.target.closest('.mobile-sidebar-toggle')) {
        setShowSidebar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Category structure based on your API valid categories
  const categoryStructure = [
    {
      title: "General",
      categories: [
        { 
          id: 'GENERAL', 
          name: 'General Gallery', 
          icon: FiGlobe,
          color: 'from-blue-700 to-blue-600',
          emoji: '🏫'
        }
      ]
    },
    {
      title: "Academic Activities",
      categories: [
        { 
          id: 'CLASSROOMS', 
          name: 'Classrooms', 
          icon: FiBookOpen,
          color: 'from-emerald-600 to-emerald-500',
          emoji: '📚'
        },
        { 
          id: 'TEACHING', 
          name: 'Teaching Activities', 
          icon: FiBook,
          color: 'from-green-600 to-green-500',
          emoji: '👨‍🏫'
        }
      ]
    },
    {
      title: "Laboratories",
      categories: [
        { 
          id: 'LABORATORIES', 
          name: 'Laboratories', 
          icon: FiTarget,
          color: 'from-teal-600 to-teal-500',
          emoji: '🔬'
        },
        { 
          id: 'SCIENCE_LAB', 
          name: 'Science Lab', 
          icon: FiTarget,
          color: 'from-teal-700 to-teal-600',
          emoji: '🧪'
        },
        { 
          id: 'COMPUTER_LAB', 
          name: 'Computer Lab', 
          icon: FiTarget,
          color: 'from-cyan-600 to-cyan-500',
          emoji: '💻'
        }
      ]
    },
    {
      title: "Administration",
      categories: [
        { 
          id: 'ADMIN_OFFICES', 
          name: 'Admin Offices', 
          icon: FiTarget,
          color: 'from-slate-600 to-slate-500',
          emoji: '🏢'
        },
        { 
          id: 'PRINCIPAL', 
          name: 'Principal\'s Office', 
          icon: FiUser,
          color: 'from-blue-800 to-blue-700',
          emoji: '👑'
        },
        { 
          id: 'STAFF', 
          name: 'Teaching Staff', 
          icon: FiUsers,
          color: 'from-blue-700 to-blue-600',
          emoji: '👨‍🏫'
        },
        { 
          id: 'BOARD', 
          name: 'Board of Management', 
          icon: FiTarget,
          color: 'from-blue-900 to-blue-800',
          emoji: '👥'
        }
      ]
    },
    {
      title: "Co-curricular Activities",
      categories: [
        { 
          id: 'SPORTS_FACILITIES', 
          name: 'Sports Facilities', 
          icon: FiTarget,
          color: 'from-orange-600 to-orange-500',
          emoji: '⚽'
        },
        { 
          id: 'SPORTS_DAY', 
          name: 'Sports Day', 
          icon: FiAward,
          color: 'from-red-600 to-red-500',
          emoji: '🏆'
        },
        { 
          id: 'CLUBS', 
          name: 'Clubs & Societies', 
          icon: FiUsers,
          color: 'from-purple-600 to-purple-500',
          emoji: '🎭'
        },
        { 
          id: 'STUDENT_ACTIVITIES', 
          name: 'Student Activities', 
          icon: FiTarget,
          color: 'from-pink-600 to-pink-500',
          emoji: '🎪'
        }
      ]
    },
    {
      title: "Arts & Culture",
      categories: [
        { 
          id: 'MUSIC_FESTIVAL', 
          name: 'Music Festival', 
          icon: FiMusic,
          color: 'from-rose-600 to-rose-500',
          emoji: '🎵'
        },
        { 
          id: 'DRAMA_PERFORMANCE', 
          name: 'Drama Performances', 
          icon: FiMic,
          color: 'from-amber-600 to-amber-500',
          emoji: '🎭'
        },
        { 
          id: 'ART_EXHIBITION', 
          name: 'Art Exhibitions', 
          icon: FiCamera,
          color: 'from-purple-600 to-purple-500',
          emoji: '🎨'
        }
      ]
    },
    {
      title: "Academic Competitions",
      categories: [
        { 
          id: 'DEBATE_COMPETITION', 
          name: 'Debate Competitions', 
          icon: FiMic,
          color: 'from-indigo-600 to-indigo-500',
          emoji: '🗣️'
        },
        { 
          id: 'SCIENCE_FAIR', 
          name: 'Science Fair', 
          icon: FiTarget,
          color: 'from-cyan-700 to-cyan-600',
          emoji: '🔭'
        }
      ]
    },
    {
      title: "Events & Ceremonies",
      categories: [
        { 
          id: 'GRADUATION', 
          name: 'Graduation', 
          icon: FiAward,
          color: 'from-purple-700 to-purple-600',
          emoji: '🎓'
        },
        { 
          id: 'AWARD_CEREMONY', 
          name: 'Award Ceremonies', 
          icon: FiStar,
          color: 'from-amber-600 to-amber-500',
          emoji: '🏅'
        },
        { 
          id: 'PARENTS_DAY', 
          name: 'Parents Day', 
          icon: FiUsers,
          color: 'from-blue-600 to-blue-500',
          emoji: '👨‍👩‍👧‍👦'
        },
        { 
          id: 'OPEN_DAY', 
          name: 'Open Day', 
          icon: FiGlobe,
          color: 'from-teal-600 to-teal-500',
          emoji: '🚪'
        }
      ]
    },
    {
      title: "Campus Facilities",
      categories: [
        { 
          id: 'DORMITORIES', 
          name: 'Dormitories', 
          icon: FiHome,
          color: 'from-blue-500 to-blue-400',
          emoji: '🛏️'
        },
        { 
          id: 'DINING_HALL', 
          name: 'Dining Hall', 
          icon: FiCalendar,
          color: 'from-orange-500 to-orange-400',
          emoji: '🍽️'
        }
      ]
    },
    {
      title: "Leadership",
      categories: [
        { 
          id: 'COUNCIL', 
          name: 'School Council', 
          icon: FiTarget,
          color: 'from-indigo-600 to-indigo-500',
          emoji: '🤝'
        },
        { 
          id: 'LEADERSHIP', 
          name: 'Leadership', 
          icon: FiTarget,
          color: 'from-blue-900 to-blue-800',
          emoji: '🌟'
        }
      ]
    },
    {
      title: "Others",
      categories: [
        { 
          id: 'VISITORS', 
          name: 'Visitors', 
          icon: FiUser,
          color: 'from-slate-600 to-slate-500',
          emoji: '👋'
        },
        { 
          id: 'OTHER', 
          name: 'Other Activities', 
          icon: FiGrid,
          color: 'from-gray-500 to-gray-400',
          emoji: '📦'
        }
      ]
    }
  ];

  // Flatten all categories for search
  const allCategories = useMemo(() => {
    return categoryStructure.flatMap(layer => layer.categories);
  }, []);

  // Get available years from galleries
  const years = useMemo(() => {
    const yearSet = new Set();
    galleries.forEach(gallery => {
      if (gallery?.createdAt) {
        const year = new Date(gallery.createdAt).getFullYear();
        yearSet.add(year);
      }
    });
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [galleries]);

  // Transform API data
  const transformedGalleries = useMemo(() => {
    return (galleries || []).map(gallery => ({
      id: gallery.id || Math.random().toString(),
      category: gallery.category || 'GENERAL',
      title: gallery.title || 'Untitled Gallery',
      description: gallery.description || 'No description available',
      files: gallery.files || [],
      date: gallery.createdAt || new Date().toISOString(),
      year: gallery.createdAt ? new Date(gallery.createdAt).getFullYear() : new Date().getFullYear()
    }));
  }, [galleries]);

  // Filter function for galleries
  const filteredImages = useMemo(() => {
    let filtered = transformedGalleries.filter(item => {
      // Filter by category
      const matchesCategory = activeCategory === 'GENERAL' || item.category === activeCategory;
      
      // Filter by year
      const matchesYear = selectedYear === 'all' || item.year.toString() === selectedYear;
      
      // Search in title and description
      const matchesSearch = searchTerm === '' || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesCategory && matchesYear && matchesSearch;
    });

    // Sort by selected option
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'mostFiles':
        filtered.sort((a, b) => (b.files?.length || 0) - (a.files?.length || 0));
        break;
      default:
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return filtered;
  }, [activeCategory, searchTerm, sortBy, selectedYear, transformedGalleries]);

  // Filter categories based on search
  const filteredCategoryStructure = useMemo(() => {
    if (!categorySearch.trim()) return categoryStructure;
    
    const searchLower = categorySearch.toLowerCase();
    return categoryStructure.map(layer => {
      const filteredCategories = layer.categories.filter(category => 
        category.name.toLowerCase().includes(searchLower) ||
        category.id.toLowerCase().includes(searchLower)
      );
      
      if (filteredCategories.length === 0) return null;
      
      return {
        ...layer,
        categories: filteredCategories
      };
    }).filter(Boolean);
  }, [categorySearch, categoryStructure]);

  // Check if file is video
  const isVideoFile = (filename) => {
    if (!filename) return false;
    const videoExtensions = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.webm', '.mkv', '.m4v', '.3gp'];
    return videoExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  // Check if file is image
  const isImageFile = (filename) => {
    if (!filename) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.avif', '.svg'];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setCategorySearch('');
    setSortBy('newest');
    setSelectedYear('all');
    setActiveCategory('GENERAL');
    setExpandedCategory('GENERAL');
  };

  // Media functions
  const openLightbox = (media, index) => {
    if (!media?.files || media.files.length === 0) return;
    
    setSelectedMedia(media);
    setLightboxIndex(index);
    setIsPlaying(false);
    setAutoPlay(true);
  };

  const closeLightbox = () => {
    setSelectedMedia(null);
    setIsPlaying(false);
    setAutoPlay(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const nextMedia = () => {
    if (selectedMedia && selectedMedia.files && selectedMedia.files.length > 1) {
      const nextIndex = (lightboxIndex + 1) % selectedMedia.files.length;
      setLightboxIndex(nextIndex);
      setIsPlaying(false);
      setAutoPlay(true);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  };

  const prevMedia = () => {
    if (selectedMedia && selectedMedia.files && selectedMedia.files.length > 1) {
      const prevIndex = (lightboxIndex - 1 + selectedMedia.files.length) % selectedMedia.files.length;
      setLightboxIndex(prevIndex);
      setIsPlaying(false);
      setAutoPlay(true);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  };

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Download single file
  const downloadFile = async (fileUrl) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileUrl.split('/').pop();
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  // Download all files from selected gallery
  const downloadAllFiles = async () => {
    if (!selectedMedia || !selectedMedia.files || selectedMedia.files.length === 0) {
      alert('No files to download');
      return;
    }

    setDownloadingAll(true);
    
    try {
      for (let i = 0; i < selectedMedia.files.length; i++) {
        const fileUrl = selectedMedia.files[i];
        try {
          const response = await fetch(fileUrl);
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = fileUrl.split('/').pop();
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          // Small delay between downloads to avoid browser issues
          if (i < selectedMedia.files.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } catch (error) {
          console.error(`Failed to download file ${i + 1}:`, error);
        }
      }
      
      alert(`Downloaded ${selectedMedia.files.length} files successfully!`);
    } catch (error) {
      console.error('Download all failed:', error);
      alert('Failed to download all files. Please try again.');
    } finally {
      setDownloadingAll(false);
    }
  };

  // Share functions
  const shareOnWhatsApp = () => {
    if (!selectedMedia) return;
    const text = `Check out "${selectedMedia.title}" from Mary Immaculate GirlsSchool Gallery!`;
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnTwitter = () => {
    if (!selectedMedia) return;
    const text = `Check out "${selectedMedia.title}" from Mary Immaculate GirlsSchool Gallery!`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const copyToClipboard = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Failed to copy link. Please try again.');
    }
  };

  // Modern Button Component
  const ModernButton = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    icon: Icon, 
    onClick, 
    disabled, 
    className = '',
    type = 'button'
  }) => {
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-sm',
      lg: 'px-6 py-4 text-base'
    };

    const baseClasses = 'rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
    
    const variantClasses = {
      primary: 'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-md',
      secondary: 'bg-white text-slate-800 border border-slate-200 shadow-sm',
      outline: 'border border-slate-200 text-slate-700 bg-transparent',
      ghost: 'text-slate-700 bg-transparent hover:bg-slate-100/50',
      danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md'
    };

    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      >
        {Icon && <Icon className="text-current" />}
        {children}
      </button>
    );
  };

  // Modern Card Component
  const ModernCard = ({ children, className = '', elevation = 'md' }) => (
    <div className={`bg-white rounded-xl ${ELEVATION[elevation]} border border-slate-100 ${className}`}>
      {children}
    </div>
  );

  // Modern Badge Component
  const ModernBadge = ({ children, color = 'blue', className = '', icon: Icon }) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-700',
      green: 'bg-emerald-100 text-emerald-700',
      red: 'bg-red-100 text-red-700',
      yellow: 'bg-amber-100 text-amber-700',
      purple: 'bg-purple-100 text-purple-700',
      slate: 'bg-slate-100 text-slate-700'
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colorClasses[color]} ${className}`}>
        {Icon && <Icon className="text-xs" />}
        {children}
      </span>
    );
  };

  // Gallery Card Component
  const GalleryCard = ({ item, viewMode, allCategories, favorites, toggleFavorite, openLightbox, activeCategory }) => {
    const category = allCategories.find(c => c.id === item.category);
    const Icon = category?.icon || FiImage;
    const isActiveCategory = activeCategory === item.category;
    const isFavorite = favorites.has(item.id);
    
    if (viewMode === 'grid') {
      return (
        <ModernCard elevation="sm" className="overflow-hidden transition-all duration-200">
          <div 
            className="cursor-pointer"
            onClick={() => openLightbox(item, 0)}
          >
            {/* Media Container */}
            <div className="relative aspect-square overflow-hidden">
              {item.files && item.files.length > 0 && isImageFile(item.files[0]) ? (
                <Image
                  src={item.files[0]}
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized={item.files[0]?.includes('/gallery/')}
                />
              ) : item.files && item.files.length > 0 && isVideoFile(item.files[0]) ? (
                <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                  <div className="text-center p-4">
                    <FiVideo className="text-2xl text-white mb-2 mx-auto" />
                    <span className="text-white font-medium text-xs">Video</span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                  <div className="text-center p-4">
                    <FiImage className="text-2xl text-slate-400 mb-2 mx-auto" />
                    <span className="text-slate-500 font-medium text-xs">Media</span>
                  </div>
                </div>
              )}
              
              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <ModernBadge 
                  color={isActiveCategory ? 'blue' : 'slate'}
                  icon={Icon}
                >
                  {category?.name || item.category}
                </ModernBadge>
              </div>

              {/* Favorite Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item.id);
                }}
                className="absolute top-3 right-3 bg-white p-2 rounded-lg shadow-sm"
              >
                <FiHeart className={`text-sm ${isFavorite ? 'text-red-500 fill-current' : 'text-slate-400'}`} />
              </button>

              {/* File Count Badge */}
              {item.files && item.files.length > 1 && (
                <div className="absolute bottom-3 right-3">
                  <ModernBadge color="slate" icon={FiImage}>
                    {item.files.length}
                  </ModernBadge>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-base font-semibold text-slate-800 mb-2 line-clamp-1">
                {item.title}
              </h3>
              
              {/* Description */}
              <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-3">
                {item.description || 'No description available'}
              </p>
              
              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <FiCalendar className="text-xs" />
                    <span>{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                    {item.year}
                  </span>
                </div>
                
                <div className="text-xs">
                  {item.files?.length || 0} file{item.files?.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        </ModernCard>
      );
    } else {
      // List View
      return (
        <ModernCard elevation="sm" className="p-4">
          <div 
            className="flex flex-col md:flex-row gap-4 cursor-pointer"
            onClick={() => openLightbox(item, 0)}
          >
            {/* Thumbnail */}
            <div className="md:w-32 md:h-32 w-full aspect-square md:aspect-auto rounded-lg overflow-hidden relative">
              {item.files && item.files.length > 0 && isImageFile(item.files[0]) ? (
                <Image
                  src={item.files[0]}
                  alt={item.title}
                  width={500}
                  height={300}
                  className="w-full h-full object-cover"
                  unoptimized={item.files[0]?.includes('/gallery/')}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                  <FiImage className="text-xl text-slate-400" />
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <ModernBadge 
                      color={isActiveCategory ? 'blue' : 'slate'}
                      icon={Icon}
                    >
                      {category?.name || item.category}
                    </ModernBadge>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                      {item.year}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mt-2 md:mt-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    className="p-2 rounded-lg"
                  >
                    <FiHeart className={`text-sm ${isFavorite ? 'text-red-500 fill-current' : 'text-slate-400'}`} />
                  </button>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Files</div>
                    <div className="font-semibold text-slate-800">{item.files?.length || 0}</div>
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                {item.description || 'No description available'}
              </p>
              
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <FiCalendar className="text-xs" />
                    <span>{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.files?.some(isVideoFile) && (
                    <ModernBadge color="blue" icon={FiVideo}>
                      Video
                    </ModernBadge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ModernCard>
      );
    }
  };

// In your main component file, replace your existing LoadingSpinner with this:

// Loading Spinner Component
const LoadingSpinner = () => (
  <Backdrop
    sx={{ 
      color: '#fff', 
      zIndex: (theme) => theme.zIndex.drawer + 1,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(8px)',
    }}
    open={loading}
  >
    <div className="text-center">
      <div className="relative inline-flex mb-6">
        <CircularProgress
          variant="determinate"
          value={100}
          size={80}
          thickness={4}
          sx={{ color: 'rgba(0, 0, 0, 0.1)' }}
        />
        <CircularProgress
          color="primary"
          size={80}
          thickness={4}
          className="absolute left-0"
        />
      </div>
      
      <div className="text-gray-800 text-lg font-semibold mb-2">
       Mary Immaculate GirlsSchool
      </div>
      <div className="text-gray-600">
        Loading Gallery...
      </div>
    </div>
  </Backdrop>
);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Fixed Sidebar - Modern Design */}
          <div 
            ref={sidebarRef}
            className={`
              fixed lg:sticky 
              top-0 lg:top-6
              h-screen lg:h-[calc(100vh-3rem)] 
              w-80 lg:w-72 
              bg-white 
              rounded-xl 
              shadow-xl 
              border border-slate-200 
              p-5 
              transform transition-transform duration-300 ease-out
              ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
              z-40 lg:z-auto
              overflow-y-auto
              [scrollbar-width:none]
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
            `}
          >
            {/* Close button for mobile */}
            <button
              onClick={() => setShowSidebar(false)}
              className="absolute top-4 right-4 lg:hidden text-slate-500 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <IoClose className="text-xl" />
            </button>

            {/* Sidebar Header */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg">
                  <FiFilter className="text-white text-sm" />
                </div>
                <span>Gallery Categories</span>
              </h3>
              <p className="text-slate-500 text-sm">Filter by school activities</p>
            </div>

            {/* Search Categories */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-slate-400 text-sm" />
                </div>
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {categorySearch && (
                  <button
                    onClick={() => setCategorySearch('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <FiX className="text-slate-400 text-sm" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Layers */}
            <div className="space-y-4 mb-6">
              {filteredCategoryStructure.map((layer, layerIndex) => {
                const isExpanded = expandedCategory === layer.categories[0]?.id;
                
                return (
                  <div key={layerIndex} className="border border-slate-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? '' : layer.categories[0]?.id)}
                      className="w-full text-left p-3 bg-slate-50 flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-slate-800 text-sm">{layer.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{layer.categories.length} categories</div>
                      </div>
                      {isExpanded ? (
                        <FiChevronUp className="text-slate-500" />
                      ) : (
                        <FiChevronDown className="text-slate-500" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="p-2 bg-white">
                        {layer.categories.map((category) => {
                          const Icon = category.icon;
                          const count = transformedGalleries.filter(g => g.category === category.id).length;
                          const isActive = activeCategory === category.id;
                          
                          return (
                            <button
                              key={category.id}
                              onClick={() => {
                                setActiveCategory(category.id);
                                if (window.innerWidth < 1024) {
                                  setShowSidebar(false);
                                }
                              }}
                              className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 mb-1 ${
                                isActive
                                  ? `bg-gradient-to-r ${category.color} text-white shadow-md`
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div className={`p-2 rounded ${
                                isActive 
                                  ? 'bg-white/20' 
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                <Icon className="text-sm" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{category.name}</div>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {count}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Year Filter */}
            <div className="mb-6">
              <h4 className="font-semibold text-slate-800 mb-3 text-sm flex items-center gap-2">
                <FiCalendar className="text-slate-500" />
                Filter by Year
              </h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedYear('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    selectedYear === 'all'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  All Years
                </button>
                {years.map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year.toString())}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      selectedYear === year.toString()
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="mb-6">
              <h4 className="font-semibold text-slate-800 mb-3 text-sm flex items-center gap-2">
                <FiFilter className="text-slate-500" />
                Sort By
              </h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Alphabetical</option>
                <option value="mostFiles">Most Files</option>
              </select>
            </div>

            {/* Clear Filters */}
            <ModernButton
              variant="outline"
              size="md"
              icon={FiX}
              onClick={clearAllFilters}
              className="w-full"
            >
              Clear All Filters
            </ModernButton>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* School Hero Section */}
            <ModernCard className="overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                  <div className="lg:w-2/3 mb-4 lg:mb-0">
                    <div className="flex items-start justify-between lg:block">
                      <div>
                        <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                         Mary Immaculate GirlsSchool Gallery
                        </h1>
                        <p className="text-lg opacity-90 mb-3">
                          <span className="font-bold">{schoolInfo.motto}</span> • {schoolInfo.motto2}
                        </p>
                        <p className="opacity-80 text-sm">
                          A visual journey through {schoolInfo.students}+ students' academic excellence, 
                          co-curricular achievements, and memorable moments since {schoolInfo.established}.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        className="lg:hidden p-2 rounded-lg bg-white/10"
                      >
                        <FiFilter className="text-white text-lg" />
                      </button>
                    </div>
                  </div>
                  <div className="text-center lg:text-right mt-4 lg:mt-0">
                    <div className="text-4xl lg:text-5xl font-bold mb-2">{stats.totalFiles.toLocaleString()}+</div>
                    <div className="text-sm opacity-80">Media Files</div>
                  </div>
                </div>
              </div>
            </ModernCard>

            {/* Search Bar */}
            <div className="mb-6">
              <ModernCard className="p-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-slate-400 text-sm" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search galleries by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm focus:outline-none"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <FiX className="text-slate-400 text-sm" />
                    </button>
                  )}
                </div>
              </ModernCard>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="flex bg-slate-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-sm' 
                        : 'text-slate-600'
                    }`}
                  >
                    <FiGrid className="text-lg" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-sm' 
                        : 'text-slate-600'
                    }`}
                  >
                    <FiList className="text-lg" />
                  </button>
                </div>
                
                <div className="text-sm text-slate-600 flex-1 lg:flex-none">
                  <span className="font-semibold text-slate-800">{filteredImages.length}</span> galleries
                  {activeCategory !== 'GENERAL' && (
                    <span className="hidden sm:inline"> in <span className="font-semibold text-slate-800">
                      {allCategories.find(c => c.id === activeCategory)?.name || activeCategory}
                    </span></span>
                  )}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="mobile-sidebar-toggle lg:hidden w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 shadow-md"
              >
                <FiFilter />
                Filter Categories
              </button>
            </div>

            {/* Hierarchical Gallery Display */}
            {filteredImages.length > 0 ? (
              <div className="space-y-8">
                {/* Show hierarchical sections when not searching or when in "General" category */}
                {(searchTerm === '' && activeCategory === 'GENERAL') ? (
                  <>
                    {categoryStructure.map((layer, layerIndex) => {
                      const layerGalleries = filteredImages.filter(gallery =>
                        layer.categories.some(cat => cat.id === gallery.category)
                      );
                      
                      if (layerGalleries.length === 0) return null;
                      
                      return (
                        <div key={layerIndex} className={`${layerIndex === 0 ? '' : 'mt-8'}`}>
                          {/* Layer Header */}
                          <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl">
                              <span className="text-white text-xl">{layer.emoji }</span>
                            </div>
                            <div>
                              <h2 className="text-xl font-semibold text-slate-800">{layer.title}</h2>
                              <p className="text-slate-500 text-sm">{layerGalleries.length} galler{layerGalleries.length !== 1 ? 'ies' : 'y'}</p>
                            </div>
                          </div>
                          
                          {/* Gallery Grid/List for this layer */}
                          {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {layerGalleries.map((item) => (
                                <GalleryCard 
                                  key={item.id} 
                                  item={item} 
                                  viewMode={viewMode} 
                                  allCategories={allCategories}
                                  favorites={favorites}
                                  toggleFavorite={toggleFavorite}
                                  openLightbox={openLightbox}
                                  activeCategory={activeCategory}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {layerGalleries.map((item) => (
                                <GalleryCard 
                                  key={item.id} 
                                  item={item} 
                                  viewMode={viewMode} 
                                  allCategories={allCategories}
                                  favorites={favorites}
                                  toggleFavorite={toggleFavorite}
                                  openLightbox={openLightbox}
                                  activeCategory={activeCategory}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                ) : (
                  /* Flat list when a specific category is selected or searching */
                  viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredImages.map((item) => (
                        <GalleryCard 
                          key={item.id} 
                          item={item} 
                          viewMode={viewMode} 
                          allCategories={allCategories}
                          favorites={favorites}
                          toggleFavorite={toggleFavorite}
                          openLightbox={openLightbox}
                          activeCategory={activeCategory}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredImages.map((item) => (
                        <GalleryCard 
                          key={item.id} 
                          item={item} 
                          viewMode={viewMode} 
                          allCategories={allCategories}
                          favorites={favorites}
                          toggleFavorite={toggleFavorite}
                          openLightbox={openLightbox}
                          activeCategory={activeCategory}
                        />
                      ))}
                    </div>
                  )
                )}
              </div>
            ) : (
              // Empty State
              <ModernCard className="text-center py-12">
                <div className="text-6xl mb-4 opacity-20 text-slate-400">📷</div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">No galleries found</h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto text-sm">
                  {searchTerm || selectedYear !== 'all' || activeCategory !== 'GENERAL' 
                    ? 'Try adjusting your search criteria or filters to find what you\'re looking for.'
                    : 'No galleries available yet. Check back soon!'}
                </p>
                {(searchTerm || selectedYear !== 'all' || activeCategory !== 'GENERAL') && (
                  <ModernButton
                    variant="primary"
                    onClick={clearAllFilters}
                    className="mx-auto"
                  >
                    Clear All Filters
                  </ModernButton>
                )}
              </ModernCard>
            )}

            {/* Load More */}
            {filteredImages.length > 0 && (
              <div className="mt-8 text-center">
                <p className="text-xs text-slate-500">
                  Showing {filteredImages.length} of {transformedGalleries.length} galleries
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modern Lightbox Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex flex-col">
            {/* Header Bar */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-md border-b border-slate-700">
              <div className="flex items-center gap-3">
                <ModernButton
                  variant="ghost"
                  size="sm"
                  icon={IoClose}
                  onClick={closeLightbox}
                  className="text-white/80"
                />
                <div>
                  <h2 className="text-lg font-semibold text-white">{selectedMedia.title}</h2>
                  <p className="text-white/60 text-xs">
                    {allCategories.find(c => c.id === selectedMedia.category)?.name || selectedMedia.category}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <ModernButton
                  variant={favorites.has(selectedMedia.id) ? 'danger' : 'ghost'}
                  size="sm"
                  icon={FiHeart}
                  onClick={() => toggleFavorite(selectedMedia.id)}
                  className={favorites.has(selectedMedia.id) ? '' : 'text-white/60'}
                />
                
                <ModernButton
                  variant="primary"
                  size="sm"
                  icon={FiShare2}
                  onClick={() => setShowShareModal(true)}
                >
                  Share
                </ModernButton>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:flex-row gap-4 p-2 lg:p-4 overflow-hidden">
              {/* Media Display */}
              <div className="flex-1 relative rounded-lg overflow-hidden bg-black flex items-center justify-center min-h-[40vh] lg:min-h-0">
                {selectedMedia.files && selectedMedia.files[lightboxIndex] && (
                  isVideoFile(selectedMedia.files[lightboxIndex]) ? (
                    <div className="relative w-full h-full">
                      <video
                        ref={videoRef}
                        src={selectedMedia.files[lightboxIndex]}
                        className="w-full h-full object-contain"
                        controls={false}
                        muted={isMuted}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={() => setIsPlaying(false)}
                      />
                      {/* Custom Video Controls */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-3 bg-black/50 p-3 rounded-lg backdrop-blur-md border border-white/10">
                        <ModernButton
                          variant="ghost"
                          size="sm"
                          icon={isPlaying ? FiPause : FiPlay}
                          onClick={togglePlayPause}
                          className="text-white"
                        />
                        <ModernButton
                          variant="ghost"
                          size="sm"
                          icon={isMuted ? FiVolumeX : FiVolume2}
                          onClick={toggleMute}
                          className="text-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={selectedMedia.files[lightboxIndex]}
                      alt={selectedMedia.title}
                      fill
                      className="object-contain"
                      unoptimized={selectedMedia.files[lightboxIndex]?.includes('/gallery/')}
                    />
                  )
                )}

                {/* Navigation Arrows */}
                {selectedMedia.files && selectedMedia.files.length > 1 && (
                  <>
                    <ModernButton
                      variant="ghost"
                      size="sm"
                      icon={FiChevronLeft}
                      onClick={prevMedia}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/80"
                    />

                    <ModernButton
                      variant="ghost"
                      size="sm"
                      icon={FiChevronRight}
                      onClick={nextMedia}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/80"
                    />
                  </>
                )}
              </div>

              {/* Side Panel */}
              <ModernCard className="lg:w-80 w-full h-auto lg:h-full flex flex-col">
                {/* Description */}
                <div className="flex-1 overflow-y-auto p-4">
                  <h3 className="font-semibold text-slate-800 mb-2 text-sm">Description</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {selectedMedia.description || 'No description available'}
                  </p>

                  {/* File List */}
                  {selectedMedia.files && selectedMedia.files.length > 1 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-slate-800 text-sm">Current File</h4>
                        <button
                          onClick={() => setAutoPlay(!autoPlay)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            autoPlay 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {autoPlay ? 'Auto: ON' : 'Auto: OFF'}
                        </button>
                      </div>
                      <div className="space-y-2">
                        <div className="p-3 rounded-lg bg-slate-50 text-slate-700 flex items-center gap-2 text-sm">
                          {isVideoFile(selectedMedia.files[lightboxIndex]) ? (
                            <FiVideo className="text-slate-500 flex-shrink-0" />
                          ) : (
                            <FiImage className="text-slate-500 flex-shrink-0" />
                          )}
                          <span className="truncate flex-1 text-left">
                            {cleanFileName(selectedMedia.files[lightboxIndex])}
                          </span>
                          <span className="text-slate-500 text-xs">
                            {lightboxIndex + 1}/{selectedMedia.files.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Date:</span>
                      <span className="text-slate-800">{new Date(selectedMedia.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Year:</span>
                      <span className="text-slate-800">{selectedMedia.year}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Total Files:</span>
                      <span className="text-slate-800">{selectedMedia.files?.length || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 border-t border-slate-200">
                  <ModernButton 
                    variant="primary"
                    size="md"
                    icon={FiDownload}
                    onClick={downloadAllFiles}
                    disabled={downloadingAll}
                    className="w-full mb-3"
                  >
                    {downloadingAll ? 'Downloading...' : 'Download All Files'}
                  </ModernButton>
                  
                  <ModernButton 
                    variant="secondary"
                    size="md"
                    icon={FiDownload}
                    onClick={() => downloadFile(selectedMedia.files[lightboxIndex])}
                    className="w-full"
                  >
                    Download Current
                  </ModernButton>
                </div>
              </ModernCard>
            </div>

            {/* Footer Bar */}
            <div className="p-3 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-md border-t border-slate-700">
              <div className="flex items-center justify-between">
                <div className="text-white/60 text-xs">
                  {selectedMedia.files && `${lightboxIndex + 1} of ${selectedMedia.files.length}`}
                </div>
                
                {autoPlay && selectedMedia.files && selectedMedia.files.length > 1 && (
                  <div className="flex items-center gap-2 text-emerald-400 text-xs">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    Auto-playing
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && selectedMedia && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <ModernCard className="max-w-sm w-full mx-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Share Gallery</h3>
                <ModernButton
                  variant="ghost"
                  size="sm"
                  icon={IoClose}
                  onClick={() => setShowShareModal(false)}
                />
              </div>
              
              <p className="text-slate-600 mb-6 text-center text-sm">
                Share "{selectedMedia.title}" from Mary Immaculate Girls School Gallery
              </p>
      
<div className="grid grid-cols-2 gap-3">
  <ModernButton
    variant="secondary"
    size="md"
    icon={FaWhatsapp}
    onClick={shareOnWhatsApp}
    className="text-green-600 hover:text-green-700"
  >
    WhatsApp
  </ModernButton>
  
  <ModernButton
    variant="secondary"
    size="md"
    icon={FaFacebookF}
    onClick={shareOnFacebook}
    className="text-blue-600 hover:text-blue-700"
  >
    Facebook
  </ModernButton>
  
  <ModernButton
    variant="secondary"
    size="md"
    icon={FaTwitter}
    onClick={shareOnTwitter}
    className="text-sky-500 hover:text-sky-600"
  >
    Twitter
  </ModernButton>
  
  <ModernButton
    variant="secondary"
    size="md"
    icon={FaCopy}
    onClick={copyToClipboard}
    className="text-gray-600 hover:text-gray-700"
  >
    Copy Link
  </ModernButton>
</div>
            </div>
          </ModernCard>
        </div>
      )}
    </div>
  );
}