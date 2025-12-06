'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  FiPlus, FiSearch, FiEdit, FiTrash2, FiImage, FiFilter, FiDownload,
  FiX, FiEye, FiUpload, FiStar, FiGrid, FiList, FiChevronLeft,
  FiChevronRight, FiCheck, FiVideo, FiUser, FiCalendar, FiRotateCw,
  FiTag, FiFolder, FiInfo, FiUsers, FiAlertCircle, FiExternalLink,
  FiChevronUp, FiChevronDown, FiShare2, FiCopy, FiMaximize2, FiMinimize2,
  FiEdit2, FiSave, FiXCircle, FiEyeOff, FiLock, FiUnlock, FiLink,
  FiRefreshCw, FiFile, FiCheckCircle, FiUploadCloud, FiReplace, FiEyeOn
} from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  const fileInputRef = useRef(null);
  const itemsPerPage = 12;

  // Form Data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'GENERAL',
    files: []
  });

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
    const uploadToast = toast.loading('Uploading gallery...');
    
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
        toast.update(uploadToast, {
          render: 'Gallery created successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        });
        setShowCreateModal(false);
        resetForm();
        fetchGalleryItems();
      } else {
        throw new Error(result.error || 'Failed to create gallery');
      }
    } catch (error) {
      toast.update(uploadToast, {
        render: `Error: ${error.message}`,
        type: 'error',
        isLoading: false,
        autoClose: 4000
      });
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
    const updateToast = toast.loading('Updating gallery...');
    
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
        toast.update(updateToast, {
          render: 'Gallery updated successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        });
        setShowEditModal(false);
        setEditingItem(null);
        setFilesToRemove([]);
        resetForm();
        fetchGalleryItems();
      } else {
        throw new Error(result.error || 'Failed to update gallery');
      }
    } catch (error) {
      toast.update(updateToast, {
        render: `Error: ${error.message}`,
        type: 'error',
        isLoading: false,
        autoClose: 4000
      });
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

    const deleteToast = toast.loading('Deleting gallery...');
    
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
        
        toast.update(deleteToast, {
          render: 'Gallery deleted successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        });
      } else {
        throw new Error(result.error || 'Failed to delete gallery');
      }
    } catch (error) {
      toast.update(deleteToast, {
        render: `Error: ${error.message}`,
        type: 'error',
        isLoading: false,
        autoClose: 4000
      });
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

    const deleteToast = toast.loading(`Deleting ${selectedItems.size} galleries...`);
    const deletePromises = Array.from(selectedItems).map(id => 
      fetch(`/api/gallery/${id}`, { method: 'DELETE' }).then(res => res.json())
    );

    try {
      const results = await Promise.all(deletePromises);
      const successful = results.filter(result => result.success).length;
      
      if (successful > 0) {
        setGalleryItems(prev => prev.filter(item => !selectedItems.has(item.id)));
        setSelectedItems(new Set());
        
        toast.update(deleteToast, {
          render: `${successful} galleries deleted successfully!`,
          type: 'success',
          isLoading: false,
          autoClose: 3000
        });
      } else {
        throw new Error('Failed to delete galleries');
      }
    } catch (error) {
      toast.update(deleteToast, {
        render: `Error: ${error.message}`,
        type: 'error',
        isLoading: false,
        autoClose: 4000
      });
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
      <ToastContainer position="top-right" autoClose={4000} />

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
            className="px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            <FiRefreshCw className="text-lg" />
            Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            <FiUpload className="text-lg" />
            Upload Gallery
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
            className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200/50 backdrop-blur-sm"
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
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-lg' : 'text-gray-600 hover:text-gray-800'}`}
              >
                <FiGrid className="text-lg" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-lg' : 'text-gray-600 hover:text-gray-800'}`}
              >
                <FiList className="text-lg" />
              </button>
            </div>
            <button 
              onClick={selectAll}
              className="text-blue-600 text-sm font-semibold whitespace-nowrap hover:text-blue-700"
            >
              {selectedItems.size === currentItems.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.size > 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl p-4 shadow-lg animate-fadeIn">
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
                className="px-4 py-2 bg-red-500/80 backdrop-blur-sm rounded-xl font-semibold flex items-center gap-2 hover:bg-red-600 transition-colors"
              >
                <FiTrash2 />
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedItems(new Set())}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl font-semibold flex items-center gap-2 hover:bg-white/30 transition-colors"
              >
                <FiX />
                Clear Selection
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
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
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
                className="p-2 rounded-xl bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft className="text-lg" />
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                        : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

      {/* Preview Modal with Edit/Delete buttons */}
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

// Modern Gallery Item Component with Text Buttons
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
        className={`bg-white rounded-2xl p-4 flex items-center gap-4 border border-gray-200/50 hover:border-blue-300 transition-all ${
          isSelected ? 'border-blue-500 bg-blue-50/30' : ''
        }`}
      >
        <button 
          onClick={onSelect}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            isSelected 
              ? 'bg-blue-500 border-blue-500 text-white' 
              : 'bg-white border-gray-300 hover:border-blue-400'
          }`}
        >
          {isSelected && <FiCheck className="text-xs" />}
        </button>

        {/* Thumbnail */}
        <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 relative group cursor-pointer" onClick={onPreview}>
          {hasError ? (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <FiImage className="text-gray-400 text-xl" />
            </div>
          ) : item.fileType === 'image' ? (
            <>
              <img
                src={item.files[0]}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
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
            className="px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-medium transition-colors"
          >
            View
          </button>
          <button
            onClick={onEdit}
            className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-sm font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden border border-gray-200/50 hover:border-blue-300 transition-all duration-300 hover:shadow-xl group ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : ''
      }`}
    >
      <div className="relative">
        {/* Selection Checkbox */}
        <button
          onClick={onSelect}
          className={`absolute top-3 left-3 w-6 h-6 rounded-full border-2 flex items-center justify-center z-20 transition-all ${
            isSelected 
              ? 'bg-blue-500 border-blue-500 text-white' 
              : 'bg-white/90 border-gray-300 text-transparent group-hover:text-gray-400 hover:border-blue-400'
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

        {/* Preview Button Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={onPreview}
            className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-white transition-all"
          >
            <FiEye className="text-lg" />
            View Gallery
          </button>
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
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
        
        {/* Action Buttons - Text only, visible always */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={onPreview}
            className="flex-1 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-medium transition-colors"
          >
            View
          </button>
          <button
            onClick={onEdit}
            className="flex-1 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex-1 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-medium transition-colors"
          >
            Delete
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

// Create/Edit Modal Component with existing files management
const CreateEditModal = ({
  mode, formData, setFormData, editingItem, uploadProgress, isUploading, dragActive,
  categories, selectedFilePreviews, filesToRemove, setFilesToRemove, onClose, onSubmit, 
  onFileSelect, onDrag, onDrop, removeFile, removeExistingFile, previewExistingFile,
  fileInputRef, onRefresh, showExistingFiles, setShowExistingFiles
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header with Refresh button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${mode === 'create' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-green-500 to-emerald-500'}`}>
              {mode === 'create' ? <FiUpload className="text-white text-xl" /> : <FiEdit2 className="text-white text-xl" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {mode === 'create' ? 'Create New Gallery' : 'Edit Gallery'}
              </h2>
              <p className="text-gray-600 text-sm">
                {mode === 'create' ? 'Upload and organize your media' : 'Update gallery details and media'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <FiRefreshCw className="text-sm" />
              Refresh
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              disabled={isUploading}
            >
              <FiX className="text-xl text-gray-600" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="p-6 space-y-6">
            {/* Existing Files Section (Edit Mode Only) */}
            {mode === 'edit' && editingItem && editingItem.files.length > 0 && (
              <div className="rounded-2xl p-5 border border-gray-200 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowExistingFiles(!showExistingFiles)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {showExistingFiles ? <FiChevronUp className="text-gray-600" /> : <FiChevronDown className="text-gray-600" />}
                    </button>
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <FiImage className="text-purple-500" />
                      <span>Existing Files ({editingItem.files.length})</span>
                    </h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Click to view • Click X to remove
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {filesToRemove.length} file{filesToRemove.length !== 1 ? 's' : ''} marked for removal
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
                          className={`relative bg-white rounded-xl border overflow-hidden transition-all ${
                            isMarkedForRemoval 
                              ? 'border-red-300 bg-red-50/50' 
                              : 'border-gray-200 hover:border-blue-300'
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
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                onClick={() => handlePreviewExisting(fileUrl)}
                                className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-800 hover:bg-white transition-colors"
                                title="Preview"
                              >
                                <FiEye className="text-sm" />
                              </button>
                              {!isMarkedForRemoval && (
                                <button
                                  onClick={() => handleRemoveExisting(fileUrl)}
                                  className="p-2 bg-red-500/90 backdrop-blur-sm rounded-lg text-white hover:bg-red-600 transition-colors"
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
                                className="absolute top-2 right-2 p-1.5 bg-green-500 text-white rounded-full shadow-lg"
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
            <div className="rounded-2xl p-5 border border-dashed border-blue-200 bg-gradient-to-br from-blue-50/50 to-cyan-50/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <FiUpload className="text-blue-500" />
                  <span>
                    {mode === 'edit' ? 'Add New Files (Optional)' : 'Upload Files *'}
                  </span>
                </h3>
                <span className="text-xs text-gray-500">
                  Max 10MB per file • Supports images & videos
                </span>
              </div>
              
              {/* Drag & Drop Zone */}
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-100/30 scale-[1.01]' 
                    : 'border-blue-300 hover:border-blue-400'
                } ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
                onDragEnter={onDrag}
                onDragLeave={onDrag}
                onDragOver={onDrag}
                onDrop={onDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
              >
                <div className="max-w-sm mx-auto">
                  <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl inline-block mb-4">
                    <FiUploadCloud className="text-4xl text-blue-500" />
                  </div>
                  <p className="text-gray-700 mb-2 font-medium text-lg">
                    {isUploading ? 'Uploading...' : 'Drag & drop files here'}
                  </p>
                  <p className="text-gray-500 mb-6">
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
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Browse Files
                    </button>
                  )}
                </div>
              </div>

              {/* Selected Files Preview - ACTUAL IMAGES */}
              {formData.files.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
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
                                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-300"
                                  style={{ width: `${uploadProgress[file.name]}%` }}
                                />
                              </div>
                            )}
                            
                            {/* Remove button */}
                            <button
                              onClick={() => removeFile(file.name)}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter a descriptive title"
                  disabled={isUploading}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <FiFolder className="text-purple-500" />
                  <span>Category *</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  disabled={isUploading}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Describe what this gallery contains..."
                  disabled={isUploading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-4 p-6 border-t border-gray-200 bg-gray-50/50">
          <div className="text-sm text-gray-600">
            {mode === 'edit' ? (
              <>
                {editingItem?.files.length || 0} existing files • 
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
              className="px-6 py-3 text-gray-600 font-semibold border border-gray-300 rounded-xl min-w-24 hover:bg-gray-50 transition-colors"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={isUploading || (mode === 'create' && formData.files.length === 0) || !formData.title.trim()}
              className={`px-6 py-3 rounded-xl font-semibold disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center gap-2 min-w-32 justify-center transition-all ${
                mode === 'create' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg'
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
                  Save Changes
                </>
              ) : (
                <>
                  <FiUpload />
                  Create Gallery
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Preview Modal Component with Edit/Delete buttons
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
    navigator.clipboard.writeText(currentFile);
    toast.success('URL copied to clipboard!');
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
    <div className={`fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] ${isFullscreen ? 'p-0' : 'p-4'}`}>
      <div className={`relative ${isFullscreen ? 'w-full h-full' : 'w-full max-w-6xl max-h-[90vh]'}`}>
        {/* Header with Edit/Delete buttons */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                <FiX className="text-xl" />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-white">{item.title}</h2>
                <p className="text-gray-300 text-sm">
                  {currentIndex + 1} of {item.files.length} • {item.category.replace(/_/g, ' ')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Edit/Delete buttons */}
              <button
                onClick={onEdit}
                className="px-3 py-2 bg-green-500/80 backdrop-blur-sm text-white rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-green-600 transition-colors"
              >
                <FiEdit2 />
                Edit
              </button>
              <button
                onClick={onDelete}
                className="px-3 py-2 bg-red-500/80 backdrop-blur-sm text-white rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-red-600 transition-colors"
              >
                <FiTrash2 />
                Delete
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
              </button>
              <button
                onClick={copyUrl}
                className="p-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-colors"
                title="Copy URL"
              >
                <FiLink />
              </button>
              <button
                onClick={downloadFile}
                className="p-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-colors"
                title="Download"
              >
                <FiDownload />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full h-full flex items-center justify-center p-4">
          {/* Navigation Buttons */}
          {item.files.length > 1 && (
            <>
              <button
                onClick={prevFile}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
              >
                <FiChevronLeft className="text-2xl" />
              </button>
              
              <button
                onClick={nextFile}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-40 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
              >
                <FiChevronRight className="text-2xl" />
              </button>
            </>
          )}

          {/* Media Display */}
          <div className="w-full h-full flex items-center justify-center">
            {isImage ? (
              <img
                src={currentFile}
                alt={`${item.title} - ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            ) : (
              <video
                src={currentFile}
                controls
                autoPlay
                className="max-w-full max-h-full rounded-lg"
              />
            )}
          </div>
        </div>

        {/* Thumbnail Strip */}
        {item.files.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex gap-2 overflow-x-auto">
              {item.files.map((file, index) => {
                const isVideo = file.toLowerCase().match(/\.(mp4|avi|mov|wmv|flv|webm|mkv)$/);
                
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      index === currentIndex 
                        ? 'border-white scale-105' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    {isVideo ? (
                      <div className="w-full h-full bg-gradient-to-br from-purple-700 to-pink-700 flex items-center justify-center">
                        <FiVideo className="text-white text-xl" />
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

        {/* Gallery Info Overlay */}
        {!isFullscreen && (
          <div className="absolute bottom-20 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-4 max-w-md">
            <h3 className="font-semibold text-white mb-2">{item.title}</h3>
            <p className="text-gray-300 text-sm mb-2">{item.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>{item.files.length} files</span>
              <span>•</span>
              <span>Uploaded {new Date(item.uploadDate).toLocaleDateString()}</span>
              <span>•</span>
              <span>{isImage ? 'Images' : 'Videos'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ item, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-red-100 to-red-200 rounded-xl">
            <FiAlertCircle className="text-red-600 text-2xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Delete Gallery</h3>
            <p className="text-gray-600 text-sm">This action cannot be undone</p>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete the gallery 
            <span className="font-semibold text-gray-800"> "{item.title}"</span>?
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-red-700 text-sm">
              <FiAlertCircle className="flex-shrink-0" />
              <span>This will permanently delete {item.files.length} file{item.files.length > 1 ? 's' : ''}.</span>
            </div>
          </div>
          
          {/* Gallery Preview */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
              {item.files[0] && (
                <img
                  src={item.files[0]}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
              <p className="text-xs text-gray-600">{item.files.length} files • {item.category.replace(/_/g, ' ')}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl font-medium text-sm hover:from-red-600 hover:to-red-700 transition-all"
          >
            Delete Gallery
          </button>
        </div>
      </div>
    </div>
  );
};