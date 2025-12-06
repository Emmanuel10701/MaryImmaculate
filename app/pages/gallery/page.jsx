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
  FiEye,
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
  FiTwitter
} from 'react-icons/fi';
import { 
  IoClose,
  IoMenu
} from 'react-icons/io5';
import { CircularProgress, Backdrop } from '@mui/material';
import Image from 'next/image';

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
    // Load favorites from localStorage on initial render
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('katwanyaa-gallery-favorites');
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
    name: "Katwanyaa High School",
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
      localStorage.setItem('katwanyaa-gallery-favorites', JSON.stringify(Array.from(favorites)));
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
          color: 'from-blue-600 to-cyan-600'
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
          color: 'from-emerald-600 to-green-700'
        },
        { 
          id: 'TEACHING', 
          name: 'Teaching Activities', 
          icon: FiBook,
          color: 'from-green-600 to-emerald-700'
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
          color: 'from-teal-600 to-green-700'
        },
        { 
          id: 'SCIENCE_LAB', 
          name: 'Science Lab', 
          icon: FiTarget,
          color: 'from-teal-700 to-green-800'
        },
        { 
          id: 'COMPUTER_LAB', 
          name: 'Computer Lab', 
          icon: FiTarget,
          color: 'from-cyan-600 to-blue-700'
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
          color: 'from-slate-600 to-gray-600'
        },
        { 
          id: 'PRINCIPAL', 
          name: 'Principal\'s Office', 
          icon: FiUser,
          color: 'from-blue-700 to-blue-900'
        },
        { 
          id: 'STAFF', 
          name: 'Teaching Staff', 
          icon: FiUsers,
          color: 'from-blue-600 to-blue-800'
        },
        { 
          id: 'BOARD', 
          name: 'Board of Management', 
          icon: FiTarget,
          color: 'from-blue-800 to-navy-900'
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
          color: 'from-orange-600 to-red-600'
        },
        { 
          id: 'SPORTS_DAY', 
          name: 'Sports Day', 
          icon: FiAward,
          color: 'from-red-700 to-orange-700'
        },
        { 
          id: 'CLUBS', 
          name: 'Clubs & Societies', 
          icon: FiUsers,
          color: 'from-purple-600 to-pink-600'
        },
        { 
          id: 'STUDENT_ACTIVITIES', 
          name: 'Student Activities', 
          icon: FiTarget,
          color: 'from-pink-600 to-rose-600'
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
          color: 'from-rose-600 to-pink-700'
        },
        { 
          id: 'DRAMA_PERFORMANCE', 
          name: 'Drama Performances', 
          icon: FiMic,
          color: 'from-yellow-600 to-amber-700'
        },
        { 
          id: 'ART_EXHIBITION', 
          name: 'Art Exhibitions', 
          icon: FiCamera,
          color: 'from-purple-600 to-violet-700'
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
          color: 'from-indigo-600 to-purple-600'
        },
        { 
          id: 'SCIENCE_FAIR', 
          name: 'Science Fair', 
          icon: FiTarget,
          color: 'from-cyan-700 to-blue-800'
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
          color: 'from-purple-700 to-indigo-700'
        },
        { 
          id: 'AWARD_CEREMONY', 
          name: 'Award Ceremonies', 
          icon: FiStar,
          color: 'from-yellow-600 to-amber-600'
        },
        { 
          id: 'PARENTS_DAY', 
          name: 'Parents Day', 
          icon: FiUsers,
          color: 'from-blue-600 to-cyan-600'
        },
        { 
          id: 'OPEN_DAY', 
          name: 'Open Day', 
          icon: FiGlobe,
          color: 'from-teal-600 to-emerald-600'
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
          color: 'from-blue-500 to-cyan-500'
        },
        { 
          id: 'DINING_HALL', 
          name: 'Dining Hall', 
          icon: FiCalendar,
          color: 'from-orange-500 to-amber-500'
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
          color: 'from-indigo-600 to-blue-800'
        },
        { 
          id: 'LEADERSHIP', 
          name: 'Leadership', 
          icon: FiTarget,
          color: 'from-navy-700 to-blue-900'
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
          color: 'from-gray-600 to-slate-600'
        },
        { 
          id: 'OTHER', 
          name: 'Other Activities', 
          icon: FiGrid,
          color: 'from-slate-500 to-gray-500'
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
    const text = `Check out "${selectedMedia.title}" from Katwanyaa High School Gallery!`;
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnTwitter = () => {
    if (!selectedMedia) return;
    const text = `Check out "${selectedMedia.title}" from Katwanyaa High School Gallery!`;
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

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
      <div className="text-center">
        <CircularProgress color="inherit" size={60} thickness={4} />
        <div className="mt-4 text-white text-lg font-semibold">
          Loading Katwanyaa High School Gallery...
        </div>
      </div>
    </Backdrop>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Category Filter Only */}
          <div 
            ref={sidebarRef}
            className={`fixed lg:sticky top-0 lg:top-24 h-screen lg:h-auto w-80 lg:w-72 bg-white rounded-xl shadow-lg border border-blue-100 p-5 transform transition-transform duration-300 ${
              showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            } lg:translate-x-0 z-40 lg:z-auto`}
          >
            {/* Close button for mobile */}
            <button
              onClick={() => setShowSidebar(false)}
              className="absolute top-4 right-4 lg:hidden text-gray-500 hover:text-gray-700"
            >
              <IoClose className="text-2xl" />
            </button>

            {/* Sidebar Header */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
                <FiFilter className="text-blue-600" />
                Gallery Categories
              </h3>
              <p className="text-sm text-blue-600">Filter by school activities</p>
            </div>

            {/* Search Categories */}
            <div className="mb-6">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full bg-blue-50 border border-blue-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {categorySearch && (
                  <button
                    onClick={() => setCategorySearch('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600"
                  >
                    <FiX className="text-sm" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Layers - Collapsible with no scrollbar */}
            <div className="space-y-4 overflow-y-visible">
              {filteredCategoryStructure.map((layer, layerIndex) => {
                const isExpanded = expandedCategory === layer.categories[0]?.id;
                
                return (
                  <div key={layerIndex} className="border border-blue-100 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? '' : layer.categories[0]?.id)}
                      className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-blue-900 text-sm">{layer.title}</div>
                        <div className="text-xs text-blue-600 mt-0.5">{layer.categories.length} categories</div>
                      </div>
                      {isExpanded ? (
                        <FiChevronUp className="text-blue-600" />
                      ) : (
                        <FiChevronDown className="text-blue-600" />
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
                              className={`w-full text-left p-2.5 rounded-lg transition-all duration-300 flex items-center gap-3 mb-1 group ${
                                isActive
                                  ? `bg-gradient-to-r ${category.color} text-white shadow-md`
                                  : 'hover:bg-blue-50 text-blue-900'
                              }`}
                            >
                              <div className={`p-1.5 rounded ${
                                isActive 
                                  ? 'bg-white/20' 
                                  : 'bg-blue-100 text-blue-600'
                              }`}>
                                <Icon className="text-sm" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{category.name}</div>
                              </div>
                              <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-blue-100 text-blue-700'
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
            <div className="mt-6 mb-6">
              <h4 className="font-semibold text-blue-900 mb-3 text-sm">Filter by Year</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedYear('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    selectedYear === 'all'
                      ? 'bg-blue-700 text-white'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  All Years
                </button>
                {years.map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year.toString())}
                    className={`px-3 py-1.5 rounded-lg text-sm ${
                      selectedYear === year.toString()
                        ? 'bg-blue-700 text-white'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="mb-6">
              <h4 className="font-semibold text-blue-900 mb-3 text-sm">Sort By</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Alphabetical</option>
                <option value="mostFiles">Most Files</option>
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearAllFilters}
              className="w-full mt-4 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <FiX className="text-sm" />
              Clear All Filters
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* School Hero Section - Mobile Optimized */}
            <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 rounded-xl p-4 lg:p-6 text-white mb-6">
              <div className="flex flex-col lg:flex-row items-center justify-between">
                <div className="lg:w-2/3 mb-4 lg:mb-0">
                  <div className="flex items-center justify-between lg:block">
                    <h1 className="text-xl lg:text-3xl font-bold mb-2 lg:mb-3">
                      Katwanyaa High School Gallery
                    </h1>
                    <button
                      onClick={() => setShowSidebar(!showSidebar)}
                      className="lg:hidden bg-white/20 p-2 rounded-lg"
                    >
                      <FiFilter className="text-white text-lg" />
                    </button>
                  </div>
                  <p className="text-base lg:text-lg opacity-90 mb-2 lg:mb-3">
                    <span className="font-bold">{schoolInfo.motto}</span> • {schoolInfo.motto2}
                  </p>
                  <p className="opacity-80 text-xs lg:text-sm line-clamp-3">
                    A visual journey through {schoolInfo.students}+ students' academic excellence, 
                    co-curricular achievements, and memorable moments since {schoolInfo.established}.
                  </p>
                </div>
                <div className="text-center lg:text-right mt-4 lg:mt-0">
                  <div className="text-3xl lg:text-5xl font-bold mb-1 lg:mb-2">{stats.totalFiles.toLocaleString()}+</div>
                  <div className="text-xs lg:text-sm opacity-80">Media Files</div>
                </div>
              </div>
            </div>

            {/* Search Bar for Gallery Content */}
            <div className="mb-6">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                <input
                  type="text"
                  placeholder="Search galleries by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600"
                  >
                    <FiX className="text-sm" />
                  </button>
                )}
              </div>
            </div>

            {/* Controls Bar - Mobile Optimized */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="flex bg-blue-50 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-600 hover:text-blue-800'}`}
                  >
                    <FiGrid className="text-lg" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-all ${viewMode === 'list' ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-600 hover:text-blue-800'}`}
                  >
                    <FiList className="text-lg" />
                  </button>
                </div>
                
                <div className="text-sm text-blue-700 flex-1 lg:flex-none">
                  <span className="font-bold text-blue-900">{filteredImages.length}</span> galleries
                  {activeCategory !== 'GENERAL' && (
                    <span className="hidden sm:inline"> in <span className="font-bold text-blue-800">
                      {allCategories.find(c => c.id === activeCategory)?.name || activeCategory}
                    </span></span>
                  )}
                  {selectedYear !== 'all' && (
                    <span className="hidden sm:inline"> from <span className="font-bold text-blue-800">{selectedYear}</span></span>
                  )}
                  {searchTerm && (
                    <span className="hidden sm:inline"> matching "<span className="font-bold text-blue-800">{searchTerm}</span>"</span>
                  )}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="mobile-sidebar-toggle lg:hidden w-full bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <FiFilter />
                Filter Categories
              </button>
            </div>

            {/* Gallery Grid - Mobile Optimized with larger images */}
            {filteredImages.length > 0 ? (
              <div className={`${viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4' 
                : 'space-y-4'
              }`}>
                {filteredImages.map((item) => {
                  const category = allCategories.find(c => c.id === item.category);
                  const Icon = category?.icon || FiImage;
                  const isActiveCategory = activeCategory === item.category;
                  const isFavorite = favorites.has(item.id);
                  
                  return (
                    <div
                      key={item.id}
                      className={`group cursor-pointer transform transition-all duration-300 hover:scale-[1.01] ${
                        viewMode === 'list' ? 'flex flex-col sm:flex-row gap-4 bg-white rounded-lg p-4 shadow-sm border border-blue-100' : ''
                      }`}
                      onClick={() => openLightbox(item, 0)}
                    >
                      {/* Grid View */}
                      {viewMode === 'grid' ? (
                        <div className="bg-white rounded-lg border border-blue-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                          {/* Media Container - Larger on mobile (2/3 of card) */}
                          <div className="relative h-64 sm:h-56 lg:h-64 overflow-hidden">
                            {item.files && item.files.length > 0 && isImageFile(item.files[0]) ? (
                              <Image
                                src={item.files[0]}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                unoptimized={item.files[0]?.includes('/gallery/')}
                              />
                            ) : item.files && item.files.length > 0 && isVideoFile(item.files[0]) ? (
                              <div className="w-full h-full bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center">
                                <div className="text-center p-4">
                                  <FiVideo className="text-3xl text-white mb-2 mx-auto" />
                                  <span className="text-white font-medium text-xs">Video</span>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                                <div className="text-center p-4">
                                  <FiImage className="text-3xl text-blue-600 mb-2 mx-auto" />
                                  <span className="text-blue-700 font-medium text-xs">Media</span>
                                </div>
                              </div>
                            )}
                            
                            {/* Category Badge - Smaller on mobile */}
                            <div className="absolute top-2 left-2">
                              <span className={`px-2 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1 backdrop-blur-sm ${
                                isActiveCategory
                                  ? `bg-gradient-to-r ${category?.color || 'from-blue-600 to-blue-800'} text-white`
                                  : 'bg-white/90 text-blue-900'
                              }`}>
                                <Icon className="text-xs" />
                                <span className="hidden sm:inline">{category?.name || item.category}</span>
                                <span className="sm:hidden text-xs">{category?.name?.split(' ')[0] || item.category}</span>
                              </span>
                            </div>

                            {/* Favorite Heart */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(item.id);
                              }}
                              className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-lg shadow-sm hover:bg-white transition-colors"
                            >
                              <FiHeart className={`text-sm ${isFavorite ? 'text-red-500 fill-current' : 'text-blue-400'}`} />
                            </button>

                            {/* File Count */}
                            {item.files && item.files.length > 1 && (
                              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-1.5 py-0.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
                                <FiImage className="text-xs" />
                                {item.files.length}
                              </div>
                            )}
                          </div>

                          {/* Content - Smaller on mobile (1/3 of card) */}
                          <div className="p-3 lg:p-4 flex-1 flex flex-col">
                            <h3 className="text-sm lg:text-base font-bold text-blue-900 mb-1 lg:mb-2 line-clamp-2 leading-tight flex-shrink-0">
                              {item.title}
                            </h3>
                            
                            {/* Description - Very small on mobile, limited to 2 lines */}
                            <div className="flex-1 min-h-[2.5rem]">
                              <p className="text-blue-700 text-xs lg:text-sm leading-relaxed line-clamp-2">
                                {item.description || 'No description available'}
                              </p>
                            </div>
                            
                            {/* Meta Info - Compact on mobile */}
                            <div className="flex items-center justify-between text-xs text-blue-600 pt-2 border-t border-blue-100 mt-2 flex-shrink-0">
                              <div className="flex items-center gap-2 lg:gap-3">
                                <div className="flex items-center gap-1">
                                  <FiCalendar className="text-xs" />
                                  <span className="text-xs">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                </div>
                                <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                  {item.year}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <div className="text-xs">
                                  {item.files?.length || 0} {item.files?.length === 1 ? 'file' : 'files'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* List View - Mobile Optimized */
                        <div className="flex flex-col sm:flex-row gap-4 bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                          {/* Thumbnail - Larger on mobile */}
                          <div className="w-full h-48 sm:w-32 sm:h-32 rounded-lg overflow-hidden flex-shrink-0 relative">
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
                              <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                                <FiImage className="text-xl text-blue-600" />
                              </div>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(item.id);
                              }}
                              className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-lg shadow-sm hover:bg-white transition-colors"
                            >
                              <FiHeart className={`text-sm ${isFavorite ? 'text-red-500 fill-current' : 'text-blue-400'}`} />
                            </button>
                          </div>
                          
                          {/* Content - Mobile Optimized */}
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
                              <div className="flex-1">
                                <h3 className="text-base font-bold text-blue-900 mb-1">
                                  {item.title}
                                </h3>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                    isActiveCategory
                                      ? `bg-gradient-to-r ${category?.color || 'from-blue-600 to-blue-800'} text-white`
                                      : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    {category?.name || item.category}
                                  </span>
                                  <span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                                    {item.year}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="text-right mt-2 sm:mt-0">
                                <div className="text-xs text-blue-600">Files</div>
                                <div className="font-bold text-blue-900">{item.files?.length || 0}</div>
                              </div>
                            </div>
                            
                            {/* Description - Smaller on mobile */}
                            <p className="text-blue-700 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
                              {item.description || 'No description available'}
                            </p>
                            
                            <div className="flex items-center justify-between text-xs text-blue-600">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                  <FiCalendar className="text-xs" />
                                  <span>{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              // Empty State
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-blue-100">
                <div className="text-6xl mb-4 opacity-20 text-blue-400">📷</div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">No galleries found</h3>
                <p className="text-blue-700 mb-6 max-w-md mx-auto text-sm">
                  {searchTerm || selectedYear !== 'all' || activeCategory !== 'GENERAL' 
                    ? 'Try adjusting your search criteria or filters to find what you\'re looking for.'
                    : 'No galleries available yet. Check back soon!'}
                </p>
                {(searchTerm || selectedYear !== 'all' || activeCategory !== 'GENERAL') && (
                  <button
                    onClick={clearAllFilters}
                    className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-6 py-3 rounded-lg font-medium text-sm shadow-sm hover:shadow transition-all duration-300"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}

            {/* Load More */}
            {filteredImages.length > 0 && (
              <div className="mt-8 text-center">
                <p className="text-xs text-blue-600 mt-3">
                  Showing {filteredImages.length} of {transformedGalleries.length} galleries
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modern Lightbox Modal with Download All - MOBILE FIXED */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex flex-col">
            {/* Header Bar */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-900/90 to-blue-800/90 backdrop-blur-md border-b border-blue-700">
              <div className="flex items-center gap-3">
                <button
                  onClick={closeLightbox}
                  className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <IoClose className="text-xl" />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedMedia.title}</h2>
                  <p className="text-white/60 text-xs">
                    {allCategories.find(c => c.id === selectedMedia.category)?.name || selectedMedia.category}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFavorite(selectedMedia.id)}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    favorites.has(selectedMedia.id) 
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                      : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20 border border-white/10'
                  }`}
                >
                  <FiHeart className={`text-lg ${favorites.has(selectedMedia.id) ? 'fill-current' : ''}`} />
                </button>
                
                <button 
                  onClick={() => setShowShareModal(true)}
                  className="bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 font-medium text-sm"
                >
                  <FiShare2 className="text-sm" />
                  Share
                </button>
              </div>
            </div>

            {/* Main Content Area - MOBILE FIXED LAYOUT */}
            <div className="flex-1 flex flex-col lg:flex-row gap-4 p-2 lg:p-4 overflow-hidden">
              {/* Media Display - Takes most space on mobile */}
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
                      <div className="absolute bottom-2 lg:bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 lg:gap-3 bg-black/50 p-2 lg:p-3 rounded-lg backdrop-blur-md border border-white/10">
                        <button
                          onClick={togglePlayPause}
                          className="text-white hover:text-blue-300 transition-colors p-1.5 lg:p-2 rounded hover:bg-white/10"
                        >
                          {isPlaying ? <FiPause className="text-base lg:text-lg" /> : <FiPlay className="text-base lg:text-lg" />}
                        </button>
                        <button
                          onClick={toggleMute}
                          className="text-white hover:text-blue-300 transition-colors p-1.5 lg:p-2 rounded hover:bg-white/10"
                        >
                          {isMuted ? <FiVolumeX className="text-base lg:text-lg" /> : <FiVolume2 className="text-base lg:text-lg" />}
                        </button>
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
                    <button
                      onClick={prevMedia}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white z-10 bg-black/50 p-2 lg:p-3 rounded-lg backdrop-blur-md border border-white/10 hover:bg-black/70 transition-all duration-300"
                    >
                      <FiChevronLeft className="text-lg lg:text-xl" />
                    </button>

                    <button
                      onClick={nextMedia}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white z-10 bg-black/50 p-2 lg:p-3 rounded-lg backdrop-blur-md border border-white/10 hover:bg-black/70 transition-all duration-300"
                    >
                      <FiChevronRight className="text-lg lg:text-xl" />
                    </button>
                  </>
                )}
              </div>

              {/* Side Panel - VISIBLE ON MOBILE */}
              <div className="lg:w-64 w-full bg-blue-900/80 backdrop-blur-md rounded-lg border border-blue-700 p-3 lg:p-4 text-white flex flex-col">
                {/* Description - Compact on mobile */}
                <div className="flex-1 overflow-y-auto max-h-[20vh] lg:max-h-none">
                  <h3 className="font-bold text-sm mb-2">Description</h3>
                  <p className="text-white/70 text-xs leading-relaxed mb-3">
                    {selectedMedia.description || 'No description available'}
                  </p>

                  {/* File List with clean names */}
                  {selectedMedia.files && selectedMedia.files.length > 1 && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-xs">Current File</h4>
                        <button
                          onClick={() => setAutoPlay(!autoPlay)}
                          className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
                            autoPlay 
                              ? 'bg-green-500 text-white' 
                              : 'bg-white/10 text-white/60 hover:text-white'
                          }`}
                        >
                          {autoPlay ? 'Auto: ON' : 'Auto: OFF'}
                        </button>
                      </div>
                      <div className="space-y-1">
                        <div className="w-full text-left p-2 rounded bg-blue-600 text-white shadow flex items-center gap-2 text-xs">
                          {isVideoFile(selectedMedia.files[lightboxIndex]) ? (
                            <FiVideo className="text-xs flex-shrink-0" />
                          ) : (
                            <FiImage className="text-xs flex-shrink-0" />
                          )}
                          <span className="truncate flex-1 text-left">
                            {cleanFileName(selectedMedia.files[lightboxIndex])}
                          </span>
                          <span className="text-white/60 text-xs">
                            {lightboxIndex + 1}/{selectedMedia.files.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-white/60">Date:</span>
                      <span>{new Date(selectedMedia.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Year:</span>
                      <span>{selectedMedia.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Total Files:</span>
                      <span>{selectedMedia.files?.length || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons with Download All - ALWAYS VISIBLE */}
                <div className="pt-3 border-t border-blue-700 mt-2 flex-shrink-0">
                  <button 
                    onClick={downloadAllFiles}
                    disabled={downloadingAll}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2 rounded transition-all duration-300 flex items-center justify-center gap-1.5 font-medium text-sm mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiDownload className="text-sm" />
                    {downloadingAll ? 'Downloading...' : 'Download All Files'}
                  </button>
                  
                  <button 
                    onClick={() => downloadFile(selectedMedia.files[lightboxIndex])}
                    className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded transition-all duration-300 flex items-center justify-center gap-1.5 font-medium text-sm"
                  >
                    <FiDownload className="text-sm" />
                    Download Current
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Bar */}
            <div className="p-2 lg:p-3 bg-blue-900/80 backdrop-blur-md border-t border-blue-700">
              <div className="flex items-center justify-between">
                <div className="text-white/60 text-xs">
                  {selectedMedia.files && `${lightboxIndex + 1} of ${selectedMedia.files.length}`}
                </div>
                
                {autoPlay && selectedMedia.files && selectedMedia.files.length > 1 && (
                  <div className="flex items-center gap-1 text-green-400 text-xs">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    Auto-playing
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal with cleaned icons */}
      {showShareModal && selectedMedia && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-auto shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-blue-900">Share Gallery</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-blue-400 hover:text-blue-600 p-1.5 rounded hover:bg-blue-50"
              >
                <IoClose className="text-lg" />
              </button>
            </div>
            
            <p className="text-blue-700 mb-5 text-center text-sm">
              Share "{selectedMedia.title}" from Katwanyaa High School Gallery
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                onClick={shareOnWhatsApp}
                className="flex items-center justify-center gap-2 p-3 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors border border-green-200"
              >
                <FiMessageSquare className="text-lg" />
                <span className="font-medium text-sm">WhatsApp</span>
              </button>
              
              <button
                onClick={shareOnFacebook}
                className="flex items-center justify-center gap-2 p-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
              >
                <FiFacebook className="text-lg" />
                <span className="font-medium text-sm">Facebook</span>
              </button>
              
              <button
                onClick={shareOnTwitter}
                className="flex items-center justify-center gap-2 p-3 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors border border-sky-200"
              >
                <FiTwitter className="text-lg" />
                <span className="font-medium text-sm">Twitter</span>
              </button>
              
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center gap-2 p-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-200"
              >
                <FiShare2 className="text-lg" />
                <span className="font-medium text-sm">Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}