'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  FiPlus, FiSearch, FiEdit, FiTrash2, FiImage, FiFilter, FiDownload,
  FiX, FiEye, FiUpload, FiStar, FiGrid, FiList, FiChevronLeft,
  FiChevronRight, FiCheck, FiVideo, FiUser, FiCalendar, FiRotateCw,
  FiTag, FiFolder, FiInfo, FiUsers, FiAlertCircle, FiExternalLink,
  FiChevronUp, FiChevronDown, FiShare2, FiCopy, FiMaximize2, FiMinimize2,
  FiEdit2, FiSave, FiXCircle, FiEyeOff, FiLock, FiUnlock, FiLink,
  FiRefreshCw, FiFile, FiCheckCircle, FiUploadCloud, FiReplace
} from 'react-icons/fi';
import { Toaster, toast } from 'sonner';

// Categories from your backend API
const CATEGORIES = [
  { value: 'GENERAL', label: 'General', color: 'gray' },
  { value: 'CLASSROOMS', label: 'Classrooms', color: 'blue' },
  { value: 'LABORATORIES', label: 'Laboratories', color: 'purple' },
  { value: 'DORMITORIES', label: 'Dormitories', color: 'green' },
  { value: 'DINING_HALL', label: 'Dining Hall', color: 'orange' },
  { value: 'SPORTS_FACILITIES', label: 'Sports Facilities', color: 'red' },
  { value: 'TEACHING', label: 'Teaching', color: 'cyan' },
  { value: 'SCIENCE_LAB', label: 'Science Lab', color: 'indigo' },
  { value: 'COMPUTER_LAB', label: 'Computer Lab', color: 'teal' },
  { value: 'SPORTS_DAY', label: 'Sports Day', color: 'emerald' },
  { value: 'MUSIC_FESTIVAL', label: 'Music Festival', color: 'pink' },
  { value: 'DRAMA_PERFORMANCE', label: 'Drama Performance', color: 'yellow' },
  { value: 'ART_EXHIBITION', label: 'Art Exhibition', color: 'amber' },
  { value: 'DEBATE_COMPETITION', label: 'Debate Competition', color: 'rose' },
  { value: 'SCIENCE_FAIR', label: 'Science Fair', color: 'violet' },
  { value: 'ADMIN_OFFICES', label: 'Admin Offices', color: 'slate' },
  { value: 'STAFF', label: 'Staff', color: 'stone' },
  { value: 'PRINCIPAL', label: 'Principal', color: 'zinc' },
  { value: 'BOARD', label: 'Board', color: 'neutral' },
  { value: 'GRADUATION', label: 'Graduation', color: 'sky' },
  { value: 'AWARD_CEREMONY', label: 'Award Ceremony', color: 'fuchsia' },
  { value: 'PARENTS_DAY', label: 'Parents Day', color: 'lime' },
  { value: 'OPEN_DAY', label: 'Open Day', color: 'cyan' },
  { value: 'VISITORS', label: 'Visitors', color: 'orange' },
  { value: 'STUDENT_ACTIVITIES', label: 'Student Activities', color: 'green' },
  { value: 'CLUBS', label: 'Clubs', color: 'purple' },
  { value: 'COUNCIL', label: 'Council', color: 'blue' },
  { value: 'LEADERSHIP', label: 'Leadership', color: 'red' },
  { value: 'OTHER', label: 'Other', color: 'gray' }
];

export default function ModernGalleryManager() {
  // State
  const [galleryItems, setGalleryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imageErrors, setImageErrors] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedFilePreviews, setSelectedFilePreviews] = useState({});
  const [filesToRemove, setFilesToRemove] = useState([]); // Track files to remove during edit
  const [showExistingFiles, setShowExistingFiles] = useState(true); // Toggle existing files view
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const itemsPerPage = 12;

  // Form Data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'GENERAL',
    files: []
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch gallery items from API
  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/gallery');
      const result = await response.json();
      
      if (result.success && result.galleries) {
        const transformedItems = result.galleries.map(gallery => ({
          id: gallery.id,
          title: gallery.title,
          description: gallery.description || '',
          category: gallery.category,
          files: gallery.files || [],
          fileType: determineMediaType(gallery.files?.[0]),
          previewUrl: gallery.files?.[0] || '',
          fileCount: gallery.files?.length || 0,
          uploadDate: gallery.createdAt,
          updatedAt: gallery.updatedAt,
          views: Math.floor(Math.random() * 1000),
          likes: Math.floor(Math.random() * 500),
          isPublic: true
        }));
        
        // Sort items
        const sortedItems = transformedItems.sort((a, b) => {
          switch(sortBy) {
            case 'newest': return new Date(b.uploadDate) - new Date(a.uploadDate);
            case 'oldest': return new Date(a.uploadDate) - new Date(b.uploadDate);
            case 'title': return a.title.localeCompare(b.title);
            case 'mostFiles': return b.fileCount - a.fileCount;
            default: return new Date(b.uploadDate) - new Date(a.uploadDate);
          }
        });
        
        setGalleryItems(sortedItems);
        setFilteredItems(sortedItems);
        toast.success(`Loaded ${sortedItems.length} galleries`);
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      toast.error('Failed to load gallery items');
    } finally {
      setLoading(false);
    }
  };

  // Determine media type
  const determineMediaType = (filePath) => {
    if (!filePath) return 'image';
    const extension = filePath.split('.').pop()?.toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
    
    if (imageExtensions.includes(extension)) return 'image';
    if (videoExtensions.includes(extension)) return 'video';
    return 'image';
  };

  useEffect(() => {
    fetchGalleryItems();
  }, [sortBy]);

  // Filter items
  useEffect(() => {
    let filtered = galleryItems.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [galleryItems, searchTerm, selectedCategory]);

  // File handling with previews
  const handleFilesSelect = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 10 * 1024 * 1024;
      
      if (!isValidType) {
        toast.error(`${file.name}: Unsupported format`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name}: Exceeds 10MB limit`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      toast.warning('Please select valid files (images/videos, max 10MB)');
      return;
    }

    // Create preview URLs for images
    const newPreviews = {};
    validFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        newPreviews[file.name] = URL.createObjectURL(file);
      }
    });

    setSelectedFilePreviews(prev => ({ ...prev, ...newPreviews }));
    
    setFormData(prev => ({ 
      ...prev, 
      files: [...prev.files, ...validFiles].slice(0, 20)
    }));
    
    toast.success(`${validFiles.length} file(s) added`);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelect(e.dataTransfer.files);
    }
  };

  const removeFile = (fileName) => {
    // Revoke object URL if it exists
    if (selectedFilePreviews[fileName]) {
      URL.revokeObjectURL(selectedFilePreviews[fileName]);
    }
    
    setSelectedFilePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[fileName];
      return newPreviews;
    });
    
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter(file => file.name !== fileName)
    }));
    
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileName];
      return newProgress;
    });
    
    toast.info('File removed');
  };

  // Remove existing file from gallery during edit
  const removeExistingFile = (fileUrl, itemId) => {
    if (editingItem && editingItem.id === itemId) {
      setFilesToRemove(prev => [...prev, fileUrl]);
      toast.info('File marked for removal. Click Save Changes to confirm.');
    }
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(selectedFilePreviews).forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [selectedFilePreviews]);

  // CRUD Operations
  const handleCreate = async () => {
    if (!formData.title.trim() || formData.files.length === 0) {
      toast.warning('Please provide a title and select files');
      return;
    }

    setIsUploading(true);
    
    toast.loading('Uploading gallery...');
    
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      
      formData.files.forEach(file => {
        submitData.append('files', file);
      });

      const response = await fetch('/api/gallery', {
        method: 'POST',
        body: submitData,
      });

      const result = await response.json();
      
      if (result.success) {
        toast.dismiss();
        toast.success('Gallery created successfully!');
        setShowCreateModal(false);
        resetForm();
        fetchGalleryItems();
      } else {
        throw new Error(result.error || 'Failed to create gallery');
      }
    } catch (error) {
      toast.dismiss();
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFilesToRemove([]); // Reset files to remove
    setFormData({
      title: item.title,
      description: item.description || '',
      category: item.category,
      files: []
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!formData.title.trim()) {
      toast.warning('Please provide a title');
      return;
    }

    setIsUploading(true);
    
    toast.loading('Updating gallery...');
    
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      
      // Append files to remove
      filesToRemove.forEach(fileUrl => {
        submitData.append('filesToRemove', fileUrl);
      });
      
      // Append new files
      if (formData.files.length > 0) {
        formData.files.forEach(file => {
          submitData.append('files', file);
        });
      }

      const response = await fetch(`/api/gallery/${editingItem.id}`, {
        method: 'PUT',
        body: submitData,
      });

      const result = await response.json();
      
      if (result.success) {
        toast.dismiss();
        toast.success('Gallery updated successfully!');
        setShowEditModal(false);
        setEditingItem(null);
        setFilesToRemove([]);
        resetForm();
        fetchGalleryItems();
      } else {
        throw new Error(result.error || 'Failed to update gallery');
      }
    } catch (error) {
      toast.dismiss();
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    toast.loading('Deleting gallery...');
    
    try {
      const response = await fetch(`/api/gallery/${itemToDelete.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        setGalleryItems(prev => prev.filter(item => item.id !== itemToDelete.id));
        setSelectedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemToDelete.id);
          return newSet;
        });
        
        toast.dismiss();
        toast.success('Gallery deleted successfully!');
      } else {
        throw new Error(result.error || 'Failed to delete gallery');
      }
    } catch (error) {
      toast.dismiss();
      toast.error(`Error: ${error.message}`);
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return;
    
    if (!window.confirm(`Delete ${selectedItems.size} selected galleries? This cannot be undone.`)) {
      return;
    }

    toast.loading(`Deleting ${selectedItems.size} galleries...`);
    const deletePromises = Array.from(selectedItems).map(id => 
      fetch(`/api/gallery/${id}`, { method: 'DELETE' }).then(res => res.json())
    );

    try {
      const results = await Promise.all(deletePromises);
      const successful = results.filter(result => result.success).length;
      
      if (successful > 0) {
        setGalleryItems(prev => prev.filter(item => !selectedItems.has(item.id)));
        setSelectedItems(new Set());
        
        toast.dismiss();
        toast.success(`${successful} galleries deleted successfully!`);
      } else {
        throw new Error('Failed to delete galleries');
      }
    } catch (error) {
      toast.dismiss();
      toast.error(`Error: ${error.message}`);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'GENERAL',
      files: []
    });
    setUploadProgress({});
    setFilesToRemove([]);
    // Clean up preview URLs
    Object.values(selectedFilePreviews).forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    setSelectedFilePreviews({});
  };

  // Preview handling
  const handlePreview = (item) => {
    setPreviewItem(item);
    setShowPreviewModal(true);
  };

  // Preview existing file
  const previewExistingFile = (fileUrl) => {
    // For now, just open in new tab
    window.open(fileUrl, '_blank');
  };

  // Selection handling
  const toggleSelection = (id) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const selectAll = () => {
    setSelectedItems(selectedItems.size === currentItems.length ? new Set() : new Set(currentItems.map(item => item.id)));
  };

  // Image error handling
  const handleImageError = (id) => {
    setImageErrors(prev => new Set(prev).add(id));
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Stats
  const stats = {
    total: galleryItems.length,
    totalFiles: galleryItems.reduce((acc, item) => acc + item.files.length, 0),
    images: galleryItems.filter(item => item.fileType === 'image').reduce((acc, item) => acc + item.files.length, 0),
    videos: galleryItems.filter(item => item.fileType === 'video').reduce((acc, item) => acc + item.files.length, 0),
    categories: new Set(galleryItems.map(item => item.category)).size
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-4 lg:p-6 space-y-6">
      <Toaster position="top-right" expand={false} richColors />

      {/* Modern Header with Refresh Button */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
              <FiImage className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                Media Gallery
              </h1>
              <p className="text-gray-600">Manage all your school media in one place</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchGalleryItems}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full font-medium flex items-center gap-2 shadow-lg"
          >
            <FiRefreshCw className="text-sm sm:text-lg" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full font-semibold flex items-center gap-2 shadow-lg"
          >
            <FiUpload className="text-sm sm:text-lg" />
            <span className="hidden sm:inline">Upload Gallery</span>
            <span className="sm:hidden">Upload</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Galleries', value: stats.total, icon: FiFolder, color: 'blue', bg: 'from-blue-500 to-cyan-500' },
          { label: 'Total Files', value: stats.totalFiles, icon: FiImage, color: 'green', bg: 'from-green-500 to-emerald-500' },
          { label: 'Images', value: stats.images, icon: FiImage, color: 'purple', bg: 'from-purple-500 to-pink-500' },
          { label: 'Videos', value: stats.videos, icon: FiVideo, color: 'red', bg: 'from-red-500 to-orange-500' },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value.toLocaleString()}</p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bg} shadow-md`}>
                <stat.icon className="text-xl text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Filters Bar */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search galleries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title A-Z</option>
            <option value="mostFiles">Most Files</option>
          </select>

          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-lg' : 'text-gray-600'}`}
              >
                <FiGrid className="text-lg" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-lg' : 'text-gray-600'}`}
              >
                <FiList className="text-lg" />
              </button>
            </div>
            <button 
              onClick={selectAll}
              className="text-blue-600 text-sm font-semibold whitespace-nowrap"
            >
              {selectedItems.size === currentItems.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.size > 0 && (
        <div className="bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 text-white rounded-2xl p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FiCheck className="text-xl" />
              </div>
              <span className="font-semibold">
                {selectedItems.size} gallery{selectedItems.size > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleBulkDelete}
                className="px-4 sm:px-6 py-2 bg-red-500/80 rounded-full font-semibold flex items-center gap-2 text-sm sm:text-base"
              >
                <FiTrash2 />
                <span className="hidden sm:inline">Delete Selected</span>
                <span className="sm:hidden">Delete</span>
              </button>
              <button
                onClick={() => setSelectedItems(new Set())}
                className="px-4 sm:px-6 py-2 bg-white/20 rounded-full font-semibold flex items-center gap-2 text-sm sm:text-base"
              >
                <FiX />
                <span className="hidden sm:inline">Clear Selection</span>
                <span className="sm:hidden">Clear</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Content */}
      {currentItems.length === 0 ? (
        <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
          <div className="text-gray-300 text-6xl mb-4">📷</div>
          <h3 className="text-gray-800 text-xl font-semibold mb-2">No galleries found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Start by uploading your first gallery'
            }
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setShowCreateModal(true);
            }}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full font-semibold shadow-lg text-sm sm:text-base"
          >
            <FiUpload className="inline mr-2" />
            Upload Gallery
          </button>
        </div>
      ) : (
        <>
          {/* Gallery Grid/List */}
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4' 
              : 'space-y-3'
          }`}>
            {currentItems.map((item) => (
              <ModernGalleryItem
                key={item.id}
                item={item}
                viewMode={viewMode}
                isSelected={selectedItems.has(item.id)}
                hasError={imageErrors.has(item.id)}
                onSelect={() => toggleSelection(item.id)}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item)}
                onPreview={() => handlePreview(item)}
                onImageError={() => handleImageError(item.id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-white border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft className="text-lg" />
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl font-semibold ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg'
                        : 'bg-white text-gray-600 border border-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-white border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronRight className="text-lg" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateEditModal
          mode="create"
          formData={formData}
          setFormData={setFormData}
          uploadProgress={uploadProgress}
          isUploading={isUploading}
          dragActive={dragActive}
          categories={CATEGORIES}
          selectedFilePreviews={selectedFilePreviews}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          dropdownRef={dropdownRef}
          onClose={() => {
            setShowCreateModal(false);
            resetForm();
          }}
          onSubmit={handleCreate}
          onFileSelect={handleFilesSelect}
          onDrag={handleDrag}
          onDrop={handleDrop}
          removeFile={removeFile}
          fileInputRef={fileInputRef}
          onRefresh={fetchGalleryItems}
        />
      )}

      {/* Edit Modal - Full modal with existing files management */}
      {showEditModal && editingItem && (
        <CreateEditModal
          mode="edit"
          formData={formData}
          setFormData={setFormData}
          editingItem={editingItem}
          uploadProgress={uploadProgress}
          isUploading={isUploading}
          dragActive={dragActive}
          categories={CATEGORIES}
          selectedFilePreviews={selectedFilePreviews}
          filesToRemove={filesToRemove}
          setFilesToRemove={setFilesToRemove}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          dropdownRef={dropdownRef}
          onClose={() => {
            setShowEditModal(false);
            setEditingItem(null);
            resetForm();
          }}
          onSubmit={handleUpdate}
          onFileSelect={handleFilesSelect}
          onDrag={handleDrag}
          onDrop={handleDrop}
          removeFile={removeFile}
          removeExistingFile={removeExistingFile}
          previewExistingFile={previewExistingFile}
          fileInputRef={fileInputRef}
          onRefresh={fetchGalleryItems}
          showExistingFiles={showExistingFiles}
          setShowExistingFiles={setShowExistingFiles}
        />
      )}

      {/* Preview Modal with Edit/Delete buttons - UPDATED STYLING */}
      {showPreviewModal && previewItem && (
        <PreviewModal
          item={previewItem}
          onClose={() => setShowPreviewModal(false)}
          onEdit={() => {
            setShowPreviewModal(false);
            handleEdit(previewItem);
          }}
          onDelete={() => {
            setShowPreviewModal(false);
            handleDelete(previewItem);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && itemToDelete && (
        <DeleteConfirmationModal
          item={itemToDelete}
          onClose={() => {
            setShowDeleteModal(false);
            setItemToDelete(null);
          }}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

// Modern Gallery Item Component with Updated Design
const ModernGalleryItem = ({ 
  item, viewMode, isSelected, hasError, 
  onSelect, onEdit, onDelete, onPreview,
  onImageError
}) => {
  const formatCategory = (category) => {
    if (!category) return '';
    return category.toLowerCase().replace(/_/g, ' ');
  };

  if (viewMode === 'list') {
    return (
      <div
        className={`bg-white rounded-2xl p-4 flex items-center gap-4 border border-gray-200/50 ${
          isSelected ? 'border-blue-500 bg-blue-50/30' : ''
        }`}
      >
        <button 
          onClick={onSelect}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            isSelected 
              ? 'bg-blue-500 border-blue-500 text-white' 
              : 'bg-white border-gray-300'
          }`}
        >
          {isSelected && <FiCheck className="text-xs" />}
        </button>

        {/* Thumbnail */}
        <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 relative cursor-pointer" onClick={onPreview}>
          {hasError ? (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <FiImage className="text-gray-400 text-xl" />
            </div>
          ) : item.fileType === 'image' ? (
            <>
              <img
                src={item.files[0]}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={onImageError}
              />
              {item.files.length > 1 && (
                <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                  +{item.files.length - 1}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
              <FiVideo className="text-white text-2xl" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-800 truncate cursor-pointer" onClick={onPreview}>{item.title}</h3>
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              {formatCategory(item.category)}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-1 truncate">{item.description || 'No description'}</p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className={`px-2 py-1 rounded ${item.fileType === 'image' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
              {item.fileType === 'image' ? 'GALLERY' : 'VIDEO'}
            </span>
            <span>•</span>
            <span>{item.files.length} file{item.files.length > 1 ? 's' : ''}</span>
            <span>•</span>
            <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPreview}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 text-white rounded-full text-xs sm:text-sm font-medium"
          >
            <span className="hidden sm:inline">View</span>
            <FiEye className="sm:hidden" />
          </button>
          <button
            onClick={onEdit}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs sm:text-sm font-medium"
          >
            <span className="hidden sm:inline">Edit</span>
            <FiEdit className="sm:hidden" />
          </button>
          <button
            onClick={onDelete}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-xs sm:text-sm font-medium"
          >
            <span className="hidden sm:inline">Delete</span>
            <FiTrash2 className="sm:hidden" />
          </button>
        </div>
      </div>
    );
  }

  // Grid View - UPDATED DESIGN
  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden border border-gray-200/50 group ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : ''
      }`}
    >
      <div className="relative">
        {/* Selection Checkbox */}
        <button
          onClick={onSelect}
          className={`absolute top-3 left-3 w-6 h-6 rounded-full border-2 flex items-center justify-center z-20 ${
            isSelected 
              ? 'bg-blue-500 border-blue-500 text-white' 
              : 'bg-white/90 border-gray-300'
          }`}
        >
          <FiCheck className="text-xs" />
        </button>

        {/* Category Badge */}
        <div className="absolute top-3 right-3 z-20">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm bg-blue-100 text-blue-800">
            {formatCategory(item.category)}
          </span>
        </div>

        {/* Media Preview */}
        <div className="aspect-square bg-gray-100 relative overflow-hidden cursor-pointer" onClick={onPreview}>
          {hasError ? (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <FiImage className="text-gray-400 text-2xl mx-auto mb-2" />
                <p className="text-gray-500 text-xs">Failed to load</p>
              </div>
            </div>
          ) : item.fileType === 'image' ? (
            <>
              <img
                src={item.files[0]}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={onImageError}
              />
              {/* Multiple Images Indicator */}
              {item.files.length > 1 && (
                <div className="absolute top-2 left-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                  +{item.files.length - 1}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
              <div className="text-center">
                <FiVideo className="text-white text-4xl mb-2" />
                <p className="text-white/80 text-sm">Video Gallery</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm mb-2 truncate cursor-pointer" onClick={onPreview} title={item.title}>
          {item.title}
        </h3>
        
        <p className="text-xs text-gray-600 mb-3 line-clamp-2" title={item.description}>
          {item.description || 'No description provided'}
        </p>
        
        {/* Action Buttons */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={onPreview}
            className="flex-1 py-2 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 text-white rounded-full text-xs font-medium"
          >
            <span className="hidden sm:inline">View</span>
            <FiEye className="sm:hidden mx-auto" />
          </button>
          <button
            onClick={onEdit}
            className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs font-medium"
          >
            <span className="hidden sm:inline">Edit</span>
            <FiEdit className="sm:hidden mx-auto" />
          </button>
          <button
            onClick={onDelete}
            className="flex-1 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-xs font-medium"
          >
            <span className="hidden sm:inline">Delete</span>
            <FiTrash2 className="sm:hidden mx-auto" />
          </button>
        </div>

        {/* Stats & Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <FiCalendar className="text-xs" />
            <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiImage className="text-xs" />
            <span>{item.files.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Create/Edit Modal Component with Modern Dropdown
const CreateEditModal = ({
  mode, formData, setFormData, editingItem, uploadProgress, isUploading, dragActive,
  categories, selectedFilePreviews, filesToRemove, setFilesToRemove, onClose, onSubmit, 
  onFileSelect, onDrag, onDrop, removeFile, removeExistingFile, previewExistingFile,
  fileInputRef, onRefresh, showExistingFiles, setShowExistingFiles,
  dropdownOpen, setDropdownOpen, dropdownRef
}) => {
  const [localEditMode, setLocalEditMode] = useState(false);

  // Determine if a file is marked for removal
  const isFileMarkedForRemoval = (fileUrl) => {
    return filesToRemove.includes(fileUrl);
  };

  // Handle removing existing file
  const handleRemoveExisting = (fileUrl) => {
    removeExistingFile(fileUrl, editingItem?.id);
  };

  // Handle previewing existing file
  const handlePreviewExisting = (fileUrl) => {
    previewExistingFile(fileUrl);
  };

  const handleCategorySelect = (category) => {
    setFormData({ ...formData, category });
    setDropdownOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl my-auto">
        {/* Header with Refresh button */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${mode === 'create' ? 'bg-gradient-to-br from-indigo-600 to-violet-600' : 'bg-gradient-to-br from-green-500 to-emerald-500'}`}>
              {mode === 'create' ? <FiUpload className="text-white text-xl" /> : <FiEdit2 className="text-white text-xl" />}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {mode === 'create' ? 'Create New Gallery' : 'Edit Gallery'}
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm">
                {mode === 'create' ? 'Upload and organize your media' : 'Update gallery details and media'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="p-2 sm:px-4 sm:py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium flex items-center gap-1 sm:gap-2"
            >
              <FiRefreshCw className="text-sm" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-gray-200"
              disabled={isUploading}
            >
              <FiX className="text-xl text-gray-600" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="p-4 sm:p-6 space-y-6">
            {/* Existing Files Section (Edit Mode Only) */}
            {mode === 'edit' && editingItem && editingItem.files.length > 0 && (
              <div className="rounded-2xl p-4 sm:p-5 border border-gray-200 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowExistingFiles(!showExistingFiles)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      {showExistingFiles ? <FiChevronUp className="text-gray-600" /> : <FiChevronDown className="text-gray-600" />}
                    </button>
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm sm:text-base">
                      <FiImage className="text-purple-500" />
                      <span>Existing Files ({editingItem.files.length})</span>
                    </h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full hidden sm:inline">
                      Click to view • Click X to remove
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm text-gray-600">
                      {filesToRemove.length} file{filesToRemove.length !== 1 ? 's' : ''} marked
                    </span>
                  </div>
                </div>
                
                {showExistingFiles && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {editingItem.files.map((fileUrl, index) => {
                      const isVideo = fileUrl.toLowerCase().match(/\.(mp4|avi|mov|wmv|flv|webm|mkv)$/);
                      const isMarkedForRemoval = isFileMarkedForRemoval(fileUrl);
                      
                      return (
                        <div 
                          key={index} 
                          className={`relative bg-white rounded-xl border overflow-hidden ${
                            isMarkedForRemoval 
                              ? 'border-red-300 bg-red-50/50' 
                              : 'border-gray-200'
                          }`}
                        >
                          {/* File Preview */}
                          <div className="aspect-square relative">
                            {isVideo ? (
                              <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                                <FiVideo className="text-3xl text-purple-500" />
                              </div>
                            ) : (
                              <img
                                src={fileUrl}
                                alt={`Existing file ${index + 1}`}
                                className="w-full h-full object-cover cursor-pointer"
                                onClick={() => handlePreviewExisting(fileUrl)}
                              />
                            )}
                            
                            {/* Marked for removal overlay */}
                            {isMarkedForRemoval && (
                              <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                                <div className="text-center">
                                  <FiXCircle className="text-red-600 text-2xl mx-auto mb-1" />
                                  <p className="text-red-700 text-xs font-medium">Will be removed</p>
                                </div>
                              </div>
                            )}
                            
                            {/* Action Buttons */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center gap-2">
                              <button
                                onClick={() => handlePreviewExisting(fileUrl)}
                                className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-800"
                                title="Preview"
                              >
                                <FiEye className="text-sm" />
                              </button>
                              {!isMarkedForRemoval && (
                                <button
                                  onClick={() => handleRemoveExisting(fileUrl)}
                                  className="p-2 bg-red-500/90 backdrop-blur-sm rounded-lg text-white"
                                  title="Remove file"
                                >
                                  <FiX className="text-sm" />
                                </button>
                              )}
                            </div>
                            
                            {/* Restore button if marked for removal */}
                            {isMarkedForRemoval && (
                              <button
                                onClick={() => setFilesToRemove(prev => prev.filter(url => url !== fileUrl))}
                                className="absolute top-2 right-2 p-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-lg"
                                title="Keep this file"
                              >
                                <FiCheck className="text-xs" />
                              </button>
                            )}
                          </div>
                          
                          {/* File info */}
                          <div className="p-2">
                            <p className="text-xs font-medium text-gray-800 truncate">
                              {isVideo ? 'Video File' : 'Image'} {index + 1}
                            </p>
                            <p className="text-xs text-gray-500">
                              {isMarkedForRemoval ? (
                                <span className="text-red-600 font-medium">To be removed</span>
                              ) : (
                                <span className="text-green-600 font-medium">Keeping</span>
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* File Upload Section */}
            <div className="rounded-2xl p-4 sm:p-5 border border-dashed border-blue-200 bg-gradient-to-br from-blue-50/50 to-cyan-50/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm sm:text-base">
                  <FiUpload className="text-blue-500" />
                  <span>
                    {mode === 'edit' ? 'Add New Files (Optional)' : 'Upload Files *'}
                  </span>
                </h3>
                <span className="text-xs text-gray-500">
                  Max 10MB per file
                </span>
              </div>
              
              {/* Drag & Drop Zone */}
              <div
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-100/30' 
                    : 'border-blue-300'
                } ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
                onDragEnter={onDrag}
                onDragLeave={onDrag}
                onDragOver={onDrag}
                onDrop={onDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
              >
                <div className="max-w-sm mx-auto">
                  <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl inline-block mb-4">
                    <FiUploadCloud className="text-3xl sm:text-4xl text-blue-500" />
                  </div>
                  <p className="text-gray-700 mb-2 font-medium text-base sm:text-lg">
                    {isUploading ? 'Uploading...' : 'Drag & drop files here'}
                  </p>
                  <p className="text-gray-500 mb-6 text-sm sm:text-base">
                    or click to browse files from your computer
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={(e) => onFileSelect(e.target.files)}
                    className="hidden"
                    ref={fileInputRef}
                    disabled={isUploading}
                  />
                  {!isUploading && (
                    <button
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full font-semibold text-sm sm:text-base"
                    >
                      Browse Files
                    </button>
                  )}
                </div>
              </div>

              {/* Selected Files Preview - ACTUAL IMAGES */}
              {formData.files.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <FiCheckCircle className="text-green-500" />
                    <span>New Files to Add ({formData.files.length})</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {formData.files.map((file, index) => {
                      const previewUrl = selectedFilePreviews[file.name] || (file.type.startsWith('image/') ? URL.createObjectURL(file) : null);
                      
                      return (
                        <div key={index} className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden">
                          {/* Preview Image or Video Icon */}
                          <div className="aspect-square relative">
                            {file.type.startsWith('image/') && previewUrl ? (
                              <img
                                src={previewUrl}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : file.type.startsWith('video/') ? (
                              <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                                <FiVideo className="text-3xl text-purple-500" />
                              </div>
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <FiFile className="text-3xl text-gray-400" />
                              </div>
                            )}
                            
                            {/* Progress bar overlay */}
                            {uploadProgress[file.name] !== undefined && (
                              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200/80">
                                <div 
                                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                                  style={{ width: `${uploadProgress[file.name]}%` }}
                                />
                              </div>
                            )}
                            
                            {/* Remove button */}
                            <button
                              onClick={() => removeFile(file.name)}
                              className="absolute top-2 right-2 p-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full opacity-0 group-hover:opacity-100 shadow-lg"
                              title="Remove file"
                            >
                              <FiX className="text-xs" />
                            </button>
                          </div>
                          
                          {/* File info */}
                          <div className="p-2">
                            <p className="text-xs font-medium text-gray-800 truncate" title={file.name}>
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(file.size / (1024 * 1024)).toFixed(1)} MB
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <FiTag className="text-blue-500" />
                  <span>Gallery Title *</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter a descriptive title"
                  disabled={isUploading}
                  required
                />
              </div>

              {/* Modern Dropdown for Category Selection */}
              <div className="md:col-span-2" ref={dropdownRef}>
                <label className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <FiFolder className="text-purple-500" />
                  <span>Category *</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-left flex items-center justify-between focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm sm:text-base"
                    disabled={isUploading}
                  >
                    <span>{categories.find(cat => cat.value === formData.category)?.label || 'Select Category'}</span>
                    <FiChevronDown className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                      <div className="p-2">
                        {categories.map(cat => (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => handleCategorySelect(cat.value)}
                            className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 text-sm sm:text-base ${
                              formData.category === cat.value
                                ? 'bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 font-medium'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <div className={`w-3 h-3 rounded-full bg-${cat.color}-500`} />
                            <span>{cat.label}</span>
                            {formData.category === cat.value && (
                              <FiCheck className="ml-auto text-indigo-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <FiEdit2 className="text-orange-500" />
                  <span>Description</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Describe what this gallery contains..."
                  disabled={isUploading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-4 p-4 sm:p-6 border-t border-gray-200 bg-gray-50/50">
          <div className="text-xs sm:text-sm text-gray-600">
            {mode === 'edit' ? (
              <>
                {editingItem?.files.length || 0} existing • 
                {filesToRemove.length} to remove • 
                {formData.files.length} to add
              </>
            ) : (
              <>
                {formData.files.length} file{formData.files.length !== 1 ? 's' : ''} selected
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-2 sm:py-3 text-gray-600 font-semibold border border-gray-300 rounded-full min-w-20 sm:min-w-24 text-sm sm:text-base"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={isUploading || (mode === 'create' && formData.files.length === 0) || !formData.title.trim()}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center gap-2 min-w-24 sm:min-w-32 justify-center text-sm sm:text-base ${
                mode === 'create' 
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
              }`}
            >
              {isUploading ? (
                <>
                  <FiRotateCw className="animate-spin" />
                  {mode === 'create' ? 'Uploading...' : 'Updating...'}
                </>
              ) : mode === 'edit' ? (
                <>
                  <FiSave />
                  <span className="hidden sm:inline">Save Changes</span>
                  <span className="sm:hidden">Save</span>
                </>
              ) : (
                <>
                  <FiUpload />
                  <span className="hidden sm:inline">Create Gallery</span>
                  <span className="sm:hidden">Create</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Preview Modal Component - MOBILE RESPONSIVE AND CENTERED
const PreviewModal = ({ item, onClose, onEdit, onDelete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentFile = item.files[currentIndex];
  const isImage = item.fileType === 'image';

  const nextFile = () => {
    setCurrentIndex((prev) => (prev + 1) % item.files.length);
  };

  const prevFile = () => {
    setCurrentIndex((prev) => (prev - 1 + item.files.length) % item.files.length);
  };

const copyUrl = () => {
  // window.location.origin gives you "http://localhost:3000"
  const targetPath = "/pages/gallery";
  const fullUrl = `${window.location.origin}${targetPath}`;

  navigator.clipboard.writeText(fullUrl);
  
  toast.success('Gallery link copied to clipboard!');
};

  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = currentFile;
    link.download = currentFile.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600">
              <FiEye className="text-white text-xl" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                {item.title}
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm truncate">
                {currentIndex + 1} of {item.files.length} • {item.category.replace(/_/g, ' ')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl border border-gray-200 hidden sm:flex"
            >
              {isFullscreen ? <FiMinimize2 className="text-gray-600" /> : <FiMaximize2 className="text-gray-600" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-gray-200"
            >
              <FiX className="text-xl text-gray-600" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="p-4 sm:p-6">
            <div className="relative">
              {/* Navigation Buttons */}
              {item.files.length > 1 && (
                <>
                  <button
                    onClick={prevFile}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-40 p-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-gray-600"
                  >
                    <FiChevronLeft className="text-xl" />
                  </button>
                  
                  <button
                    onClick={nextFile}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-40 p-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-gray-600"
                  >
                    <FiChevronRight className="text-xl" />
                  </button>
                </>
              )}

              {/* Media Display */}
              <div className="flex items-center justify-center p-2 sm:p-4">
                {isImage ? (
                  <img
                    src={currentFile}
                    alt={`${item.title} - ${currentIndex + 1}`}
                    className="max-w-full max-h-[50vh] sm:max-h-[60vh] object-contain rounded-lg"
                  />
                ) : (
                  <video
                    src={currentFile}
                    controls
                    autoPlay
                    className="max-w-full max-h-[50vh] sm:max-h-[60vh] rounded-lg"
                  />
                )}
              </div>
            </div>

            {/* Gallery Info */}
            <div className="mt-4 sm:mt-6 p-4 border border-gray-200 rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-3">{item.description}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {item.category.replace(/_/g, ' ')}
                    </span>
                    <span>{item.files.length} files</span>
                    <span>•</span>
                    <span>Uploaded {new Date(item.uploadDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 sm:flex-col">
                  <button
                    onClick={downloadFile}
                    className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full text-sm font-medium flex items-center justify-center gap-2"
                    title="Download"
                  >
                    <FiDownload className="text-sm" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                  <button
                    onClick={copyUrl}
                    className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 text-white rounded-full text-sm font-medium flex items-center justify-center gap-2"
                    title="Copy URL"
                  >
                    <FiCopy className="text-sm" />
                    <span className="hidden sm:inline">Copy URL</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {item.files.length > 1 && (
              <div className="mt-4 sm:mt-6">
                <h4 className="font-medium text-gray-800 mb-3 text-sm sm:text-base">All Files ({item.files.length})</h4>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {item.files.map((file, index) => {
                    const isVideo = file.toLowerCase().match(/\.(mp4|avi|mov|wmv|flv|webm|mkv)$/);
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-16 h-16 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                          index === currentIndex 
                            ? 'border-indigo-500' 
                            : 'border-transparent'
                        }`}
                      >
                        {isVideo ? (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <FiVideo className="text-gray-400 text-lg sm:text-2xl" />
                          </div>
                        ) : (
                          <img
                            src={file}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6 border-t border-gray-200 bg-gray-50/50">
          <div className="text-xs sm:text-sm text-gray-600">
            {item.fileType === 'image' ? 'Image Gallery' : 'Video Gallery'} • File {currentIndex + 1} of {item.files.length}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onEdit}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <FiEdit2 />
              <span className="hidden sm:inline">Edit Gallery</span>
              <span className="sm:hidden">Edit</span>
            </button>
            <button
              onClick={onDelete}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <FiTrash2 />
              <span className="hidden sm:inline">Delete Gallery</span>
              <span className="sm:hidden">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// NEW: Mobile-Responsive Delete Confirmation Modal
const DeleteConfirmationModal = ({ item, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-200">
          <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl">
            <FiAlertCircle className="text-white text-2xl" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Delete Gallery</h3>
            <p className="text-gray-600 text-sm">This action cannot be undone</p>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Are you sure you want to delete the gallery 
            <span className="font-semibold text-gray-800"> "{item.title}"</span>?
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3 text-red-700">
              <FiAlertCircle className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm sm:text-base">This will permanently delete:</p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    <span>{item.files.length} file{item.files.length > 1 ? 's' : ''}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    <span>Gallery title and description</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    <span>All associated metadata</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Gallery Preview */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
              {item.files[0] && (
                <img
                  src={item.files[0]}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-medium text-gray-800 truncate">{item.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  {item.category.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-gray-600">
                  {item.files.length} file{item.files.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full font-medium text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-medium text-sm sm:text-base"
          >
            Delete Gallery
          </button>
        </div>
      </div>
    </div>
  );
};