'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  FiPlus, FiSearch, FiEdit, FiTrash2, FiImage, FiFilter, FiDownload,
  FiX, FiEye, FiUpload, FiStar, FiGrid, FiList, FiChevronLeft,
  FiChevronRight, FiCheck, FiVideo, FiUser, FiCalendar, FiRotateCw,
  FiTag, FiFolder, FiInfo, FiUsers, FiAlertCircle, FiExternalLink,
  FiChevronUp, FiChevronDown, FiShare2, FiCopy, FiMaximize2, FiMinimize2,
  FiEdit2, FiSave, FiXCircle, FiEyeOff, FiLock, FiUnlock, FiLink,
  FiRefreshCw, FiFile, FiCheckCircle, FiUploadCloud, FiReplace,
  FiCloud, FiDatabase, FiServer, FiMonitor, FiHardDrive
} from 'react-icons/fi';
import { Toaster, toast } from 'sonner';
import { CircularProgress } from '@mui/material';

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

// Modern Loading Spinner
function ModernLoadingSpinner({ message = "Loading gallery data...", size = "medium" }) {
  const sizes = {
    small: { outer: 48, inner: 24 },
    medium: { outer: 64, inner: 32 },
    large: { outer: 80, inner: 40 }
  }

  const { outer, inner } = sizes[size] || sizes.medium;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/20 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="relative">
            <CircularProgress 
              size={outer} 
              thickness={5}
              className="text-indigo-600"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full animate-ping opacity-25"
                   style={{ width: inner, height: inner }}></div>
            </div>
          </div>
          <div className="absolute -inset-6 bg-gradient-to-r from-indigo-100 to-violet-100 rounded-full blur-xl opacity-30 animate-pulse"></div>
        </div>
        
        <div className="mt-6 space-y-3">
          <span className="block text-lg font-semibold text-gray-800">
            {message}
          </span>
          
          <div className="flex justify-center space-x-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" 
                   style={{ animationDelay: `${i * 0.15}s` }}></div>
            ))}
          </div>
          
          <p className="text-gray-500 text-sm mt-2">
            Please wait while we fetch media files
          </p>
        </div>
      </div>
    </div>
  );
}

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
  const [filesToRemove, setFilesToRemove] = useState([]);
  const [showExistingFiles, setShowExistingFiles] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [removingFile, setRemovingFile] = useState(null);
  const [selectedPreviewItems, setSelectedPreviewItems] = useState(new Set());

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
  const fetchGalleryItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/gallery');
      const result = await response.json();
      
      if (result.success && result.galleries) {
        // Ensure galleries is an array
        let galleriesArray = [];
        
        if (Array.isArray(result.galleries)) {
          galleriesArray = result.galleries;
        } else if (result.galleries && typeof result.galleries === 'object') {
          // Handle object response
          if (Array.isArray(result.galleries.data)) {
            galleriesArray = result.galleries.data;
          } else {
            // Convert object to array
            galleriesArray = Object.values(result.galleries);
          }
        }
        
        const transformedItems = galleriesArray.map(gallery => ({
          id: gallery.id || gallery._id || String(Math.random()).slice(2, 10),
          title: gallery.title || '',
          description: gallery.description || '',
          category: gallery.category || 'GENERAL',
          files: Array.isArray(gallery.files) ? gallery.files : [],
          fileType: 'image',
          previewUrl: Array.isArray(gallery.files) && gallery.files.length > 0 ? gallery.files[0] : '',
          fileCount: Array.isArray(gallery.files) ? gallery.files.length : 0,
          uploadDate: gallery.createdAt || gallery.uploadDate || new Date(),
          updatedAt: gallery.updatedAt || new Date(),
          views: Math.floor(Math.random() * 1000),
          likes: Math.floor(Math.random() * 500),
          isPublic: true
        }));
        
        // Sort items
        const sortedItems = transformedItems.sort((a, b) => {
          switch(sortBy) {
            case 'newest': 
              return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
            case 'oldest': 
              return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
            case 'title': 
              return (a.title || '').localeCompare(b.title || '');
            case 'mostFiles': 
              return (b.fileCount || 0) - (a.fileCount || 0);
            default: 
              return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
          }
        });
        
        setGalleryItems(sortedItems);
        setFilteredItems(sortedItems);
        toast.success(`Loaded ${sortedItems.length} galleries`);
      } else {
        setGalleryItems([]);
        setFilteredItems([]);
        toast.info('No galleries found');
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      toast.error('Failed to load gallery items');
      setGalleryItems([]);
      setFilteredItems([]);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  useEffect(() => {
    fetchGalleryItems();
  }, [fetchGalleryItems]);

  // Filter items
  useEffect(() => {
    let filtered = galleryItems.filter(item => {
      const matchesSearch = searchTerm === '' || 
        (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [galleryItems, searchTerm, selectedCategory]);

  const handleFilesSelect = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      if (!file || !file.type) {
        toast.error('Invalid file selected');
        return false;
      }
      
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024;
      
      if (!isValidType) {
        toast.error(`${file.name || 'Unknown file'}: Unsupported format - images only`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name || 'Unknown file'}: Exceeds 10MB limit`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      toast.warning('Please select valid image files (max 10MB)');
      return;
    }

    // Create file objects with unique IDs and safe preview creation
    const filesWithIds = validFiles.map(file => {
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.name || 'file'}`;
      let previewUrl = null;
      
      // Only create preview for images
      if (file.type.startsWith('image/')) {
        try {
          previewUrl = URL.createObjectURL(file);
        } catch (err) {
          console.error('Failed to create preview URL:', err);
          previewUrl = null;
        }
      }
      
      return {
        id: fileId,
        file: file,
        preview: previewUrl,
        type: file.type,
        name: file.name || 'Unknown file',
        size: file.size
      };
    });

    // Update previews state
    const newPreviews = {};
    filesWithIds.forEach(fileObj => {
      if (fileObj.preview) {
        newPreviews[fileObj.id] = fileObj.preview;
      }
    });

    setSelectedFilePreviews(prev => ({ ...prev, ...newPreviews }));
    
    setFormData(prev => ({ 
      ...prev, 
      files: [...(Array.isArray(prev.files) ? prev.files : []), ...filesWithIds].slice(0, 20)
    }));
    
    toast.success(`${validFiles.length} image(s) added`);
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

  // Remove file function
  const removeFile = useCallback((fileId) => {
    setRemovingFile(fileId);
    
    const fileToRemove = formData.files.find(f => f.id === fileId);
    
    if (!fileToRemove) {
      setRemovingFile(null);
      return;
    }

    // Revoke the object URL if it exists
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    
    // Update selected file previews
    setSelectedFilePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[fileId];
      return newPreviews;
    });
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      files: (Array.isArray(prev.files) ? prev.files : []).filter(file => file.id !== fileId)
    }));
    
    // Update upload progress
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
    
    setRemovingFile(null);
    toast.info('File removed');
  }, [formData.files]);

  // Remove existing file from gallery during edit
  const removeExistingFile = useCallback((fileUrl, itemId) => {
    if (editingItem && editingItem.id === itemId) {
      setFilesToRemove(prev => [...prev, fileUrl]);
      toast.info('File marked for removal. Click Save Changes to confirm.');
    }
  }, [editingItem]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    const previews = selectedFilePreviews;
    return () => {
      Object.values(previews).forEach(url => {
        if (url && url.startsWith('blob:')) {
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
      
      formData.files.forEach(fileObj => {
        submitData.append('files', fileObj.file);
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
    setFilesToRemove([]);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      category: item.category || 'GENERAL',
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
        formData.files.forEach(fileObj => {
          submitData.append('files', fileObj.file);
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

  const resetForm = useCallback(() => {
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
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    setSelectedFilePreviews({});
    setRemovingFile(null);
  }, [selectedFilePreviews]);

  // Preview handling
  const handlePreview = (item) => {
    setPreviewItem(item);
    setSelectedPreviewItems(new Set());
    setShowPreviewModal(true);
  };

  // Preview existing file
  const previewExistingFile = (fileUrl) => {
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

  const togglePreviewSelection = (index) => {
    setSelectedPreviewItems(prev => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  };

  const selectAllPreviewItems = () => {
    if (!previewItem || !previewItem.files) return;
    
    setSelectedPreviewItems(prev => {
      if (prev.size === previewItem.files.length) {
        return new Set();
      } else {
        return new Set([...Array(previewItem.files.length).keys()]);
      }
    });
  };

  const selectAll = () => {
    if (!Array.isArray(currentItems)) {
      setSelectedItems(new Set());
      return;
    }
    
    setSelectedItems(selectedItems.size === currentItems.length ? 
      new Set() : 
      new Set(currentItems.map(item => item.id).filter(id => id))
    );
  };

  // Image error handling
  const handleImageError = (id) => {
    setImageErrors(prev => new Set(prev).add(id));
  };

  // Refresh dashboard data
  const refreshDashboard = async () => {
    setRefreshing(true);
    await fetchGalleryItems();
    setRefreshing(false);
  };

  // Download selected files from preview
  const downloadSelectedFiles = () => {
    if (selectedPreviewItems.size === 0 || !previewItem || !previewItem.files) {
      toast.warning('No files selected');
      return;
    }

    selectedPreviewItems.forEach(index => {
      const fileUrl = previewItem.files[index];
      if (fileUrl) {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileUrl.split('/').pop() || `file-${index + 1}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
    
    toast.success(`Downloaded ${selectedPreviewItems.size} file(s)`);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(filteredItems) ? 
    filteredItems.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = Math.ceil((Array.isArray(filteredItems) ? filteredItems.length : 0) / itemsPerPage);

  // Stats
  const stats = {
    total: Array.isArray(galleryItems) ? galleryItems.length : 0,
    totalFiles: Array.isArray(galleryItems) ? 
      galleryItems.reduce((acc, item) => acc + (Array.isArray(item.files) ? item.files.length : 0), 0) : 0,
    images: Array.isArray(galleryItems) ? 
      galleryItems.reduce((acc, item) => acc + (Array.isArray(item.files) ? item.files.length : 0), 0) : 0,
    categories: new Set(Array.isArray(galleryItems) ? galleryItems.map(item => item.category) : []).size
  };

  if (loading) {
    return <ModernLoadingSpinner />;
  }

  return (
    <>
      <Toaster position="top-right" expand={false} richColors />
      
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="relative bg-[#0F172A] rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 text-white overflow-hidden shadow-2xl border border-white/5">
          
          {/* Abstract Mesh Gradient Background */}
          <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-600/30 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
              <div>
                {/* Institutional Branding */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-1 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,99,235,0.5)]" />
                  <div>
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">
                      Katwanyaa High School
                    </h2>
                    <p className="text-[10px] italic font-medium text-white/60 tracking-widest uppercase">
                      "Media Gallery"
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
                  <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/10 w-fit">
                    <FiImage className="text-2xl sm:text-3xl text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                  </div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                    Media Gallery <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 via-white to-purple-200">Manager</span>
                  </h1>
                </div>
              </div>
              
              {/* Modern Glass Refresh Button */}
              <button
                onClick={refreshDashboard}
                disabled={refreshing}
                className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-sm tracking-wide transition-all hover:bg-white/20 disabled:opacity-50 w-full sm:w-fit"
              >
                <FiRefreshCw className={`text-lg transition-transform ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'UPDATING...' : 'REFRESH DATA'}</span>
              </button>
            </div>
            
            {/* Summary Text */}
            <div className="mb-8">
              <p className="text-blue-100/80 text-base sm:text-md font-medium leading-relaxed">
                Managing <span className="text-white font-bold underline decoration-cyan-500/50 decoration-2 underline-offset-4">{stats.total} galleries</span> with <span className="text-white font-bold underline decoration-purple-500/50 decoration-2 underline-offset-4">{stats.totalFiles} files</span>. 
                You have <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-lg bg-cyan-400/20 text-cyan-300 border border-cyan-400/20 mx-1">{stats.images} images</span> 
              </p>
            </div>
            
            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl sm:rounded-2xl font-bold sm:font-black text-sm uppercase tracking-widest shadow-lg transition-all w-full sm:w-auto"
              >
                <FiUpload />
                Upload Gallery
              </button>
              
              <div className="h-[1px] w-full sm:h-10 sm:w-[1px] bg-white/10 sm:mx-2" />
              
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest text-center sm:text-left">
                Storage Status: <span className="text-emerald-400">{(stats.totalFiles * 5).toLocaleString()} MB used</span>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { 
              label: 'Total Galleries', 
              value: stats.total, 
              icon: FiHardDrive, 
              color: 'blue',
              change: 12,
              calculation: 'Galleries in system'
            },
            { 
              label: 'Media Files', 
              value: stats.totalFiles, 
              icon: FiFile, 
              color: 'emerald',
              change: 24,
              calculation: 'Images files'
            },
            { 
              label: 'Images', 
              value: stats.images, 
              icon: FiImage, 
              color: 'purple',
              change: 8,
              calculation: 'Photo galleries'
            }
          ].map((stat, index) => {
            const isPositive = stat.change >= 0;
            
            const colorStyles = {
              blue: 'bg-blue-50 border-blue-100 text-blue-600',
              emerald: 'bg-emerald-50 border-emerald-100 text-emerald-600',
              purple: 'bg-purple-50 border-purple-100 text-purple-600',
              rose: 'bg-rose-50 border-rose-100 text-rose-600'
            };
            
            const style = colorStyles[stat.color] || colorStyles.blue;
            
            return (
              <div 
                key={index} 
                className="group relative bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] overflow-hidden"
              >
                {/* Background Accent Blur */}
                <div className={`absolute -right-2 -top-2 h-20 w-20 rounded-full blur-2xl opacity-10 group-hover:opacity-30 transition-opacity ${style}`} />
                
                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-1">
                    <span className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">
                      {stat.label}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums">
                        {stat.value.toLocaleString()}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 italic">
                        {stat.calculation}
                      </span>
                    </div>
                  </div>
                  
                  {/* Modern Icon Pod */}
                  <div className={`p-3.5 rounded-2xl border shadow-sm transition-transform group-hover:scale-100 duration-500 ${style}`}>
                    <stat.icon className="text-xl" />
                  </div>
                </div>
                
                {/* Trend Footer */}
                <div className="mt-6 flex items-center justify-between relative z-10">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-tight border ${
                    isPositive 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-rose-50 text-rose-600 border-rose-100'
                  }`}>
                    {isPositive ? <FiCheck size={14} /> : <FiX size={14} />}
                    <span>{isPositive ? '+' : ''}{stat.change}%</span>
                  </div>
                  
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Last 30 days
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Filters Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-4 lg:p-6 shadow-lg border border-slate-100/50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-slate-400 text-lg" />
              <input
                type="text"
                placeholder="Search galleries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm font-medium"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm font-medium"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
              <option value="mostFiles">Most Files</option>
            </select>

            <div className="flex items-center gap-4">
              <div className="flex bg-slate-100 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-lg' : 'text-slate-600'}`}
                >
                  <FiGrid className="text-lg" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-lg' : 'text-slate-600'}`}
                >
                  <FiList className="text-lg" />
                </button>
              </div>
              <button 
                onClick={selectAll}
                className="text-blue-600 text-xs font-semibold whitespace-nowrap"
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
                <span className="font-semibold text-sm">
                  {selectedItems.size} gallery{selectedItems.size > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkDelete}
                  className="px-4 sm:px-6 py-2 bg-red-500/80 rounded-full font-semibold flex items-center gap-2 text-xs sm:text-sm"
                >
                  <FiTrash2 />
                  <span className="hidden sm:inline">Delete Selected</span>
                  <span className="sm:hidden">Delete</span>
                </button>
                <button
                  onClick={() => setSelectedItems(new Set())}
                  className="px-4 sm:px-6 py-2 bg-white/20 rounded-full font-semibold flex items-center gap-2 text-xs sm:text-sm"
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
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-100/50">
            <div className="text-slate-300 text-6xl mb-4">📷</div>
            <h3 className="text-slate-800 text-xl font-semibold mb-2">No galleries found</h3>
            <p className="text-slate-600 mb-6 text-sm">
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
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full font-semibold shadow-lg text-xs sm:text-sm"
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
                  className="p-2 rounded-2xl bg-white border border-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronLeft className="text-lg" />
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-2xl font-semibold ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-2xl bg-white border border-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronRight className="text-lg" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <ModernModal
          mode="create"
          formData={formData}
          setFormData={setFormData}
          uploadProgress={uploadProgress}
          isUploading={isUploading}
          dragActive={dragActive}
          categories={CATEGORIES}
          selectedFilePreviews={selectedFilePreviews}
          removingFile={removingFile}
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

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <ModernModal
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
          removingFile={removingFile}
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

      {/* Preview Modal */}
      {showPreviewModal && previewItem && (
        <ModernPreviewModal
          item={previewItem}
          selectedItems={selectedPreviewItems}
          onSelect={togglePreviewSelection}
          onSelectAll={selectAllPreviewItems}
          onDownloadSelected={downloadSelectedFiles}
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
        <ModernDeleteModal
          item={itemToDelete}
          onClose={() => {
            setShowDeleteModal(false);
            setItemToDelete(null);
          }}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}

// Modern Gallery Item Component
const ModernGalleryItem = ({ 
  item, viewMode, isSelected, hasError, 
  onSelect, onPreview, onImageError
}) => {
  const formatCategory = (category) => {
    if (!category) return '';
    return category.toLowerCase().replace(/_/g, ' ');
  };

  // Grid View
  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden border border-slate-100/50 group transition-all duration-300 hover:shadow-xl hover:border-slate-200 ${
        isSelected ? 'border-blue-500 ring-4 ring-blue-100/50' : ''
      }`}
    >
      <div className="relative">
        {/* Selection Checkbox - Enhanced */}
        <button
          onClick={onSelect}
          className={`absolute top-3 left-3 w-7 h-7 rounded-full border-2 flex items-center justify-center z-30 transition-all duration-200  ${
            isSelected 
              ? 'bg-gradient-to-br from-blue-500 to-cyan-500 border-blue-500 text-white shadow-lg' 
              : 'bg-white/90 backdrop-blur-sm border-slate-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          <FiCheck className={`text-sm transition-all ${isSelected ? 'scale-100' : 'scale-90 opacity-0'}`} />
        </button>

        {/* Category Badge - Enhanced */}
        <div className="absolute top-3 right-3 z-20">
          <span className="px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wide shadow-md bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            {formatCategory(item.category)}
          </span>
        </div>

        {/* Media Preview - Enhanced */}
        <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden cursor-pointer" onClick={onPreview}>
          {hasError ? (
            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex flex-col items-center justify-center p-6">
              <FiImage className="text-slate-400 text-3xl mb-3" />
              <p className="text-slate-500 text-sm font-medium">Failed to load image</p>
              <p className="text-slate-400 text-xs mt-1">Tap to refresh</p>
            </div>
          ) : (
            <>
              {item.files && item.files[0] ? (
                <>
                  <img
                    src={item.files[0]}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 "
                    onError={onImageError}
                  />
                  {/* Multiple Images Indicator - Enhanced */}
                  {item.files.length > 1 && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1.5 rounded-full shadow-xl font-bold">
                      +{item.files.length - 1} more
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex flex-col items-center justify-center p-6">
                  <FiImage className="text-slate-400 text-3xl mb-3" />
                  <p className="text-slate-500 text-sm font-medium">No image available</p>
                </div>
              )}
              {/* View Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="flex items-center gap-2 text-white">
                  <FiEye className="text-lg" />
                  <span className="text-sm font-medium">View Gallery</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content - Enhanced */}
      <div className="p-5">
        <div className="mb-4">
          <h3 
            className="font-bold text-slate-900 text-base mb-2 truncate cursor-pointer hover:text-blue-600 transition-colors" 
            onClick={onPreview} 
            title={item.title}
          >
            {item.title}
          </h3>
          
          <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed" title={item.description}>
            {item.description || 'No description provided for this gallery'}
          </p>
        </div>
        
        {/* View Button - Enhanced */}
        <button
          onClick={onPreview}
          className="w-full py-3.5 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white rounded-xl font-bold text-sm hover:from-amber-700 hover:via-orange-700 hover:to-red-700 transition-all duration-300 hover:shadow-lg  flex items-center justify-center gap-2"
        >
          <FiEye className="text-base" />
          <span>VIEW GALLERY</span>
        </button>

        {/* Stats & Info - Enhanced */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
              <FiCalendar className="text-blue-500 text-sm" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Uploaded</p>
              <p className="text-sm font-bold text-slate-800">
                {item.uploadDate ? new Date(item.uploadDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                }) : 'Unknown'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <FiImage className="text-purple-500 text-sm" />
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Files</p>
              <p className="text-sm font-bold text-slate-800">
                {item.files ? item.files.length : 0} {item.files ? (item.files.length === 1 ? 'file' : 'files') : 'files'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Modal Component
const ModernModal = ({
  mode, formData, setFormData, editingItem, uploadProgress, isUploading, dragActive,
  categories, selectedFilePreviews, filesToRemove, setFilesToRemove, removingFile, onClose, onSubmit, 
  onFileSelect, onDrag, onDrop, removeFile, removeExistingFile, previewExistingFile,
  fileInputRef, onRefresh, showExistingFiles, setShowExistingFiles,
  dropdownOpen, setDropdownOpen, dropdownRef
}) => {
  const isFileMarkedForRemoval = (fileUrl) => {
    return filesToRemove.includes(fileUrl);
  };

  const handleRemoveExisting = (fileUrl) => {
    removeExistingFile(fileUrl, editingItem?.id);
  };

  const handlePreviewExisting = (fileUrl) => {
    previewExistingFile(fileUrl);
  };

  const handleCategorySelect = (category) => {
    setFormData({ ...formData, category });
    setDropdownOpen(false);
  };

return (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl my-auto">
      {/* Modern Gradient Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-600"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10"></div>
        <div className="relative p-5 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 shadow-lg">
                {mode === 'create' ? 
                  <FiUpload className="w-5 h-5 text-white" /> : 
                  <FiEdit2 className="w-5 h-5 text-white" />
                }
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {mode === 'create' ? 'Create New Gallery' : 'Edit Gallery'}
                </h2>
                <p className="text-white/90 text-sm mt-1">
                  {mode === 'create' ? 'Upload and organize your media' : 'Update gallery details and media'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onRefresh}
                className="p-2 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium flex items-center gap-1 sm:gap-2 hover:bg-white/30 transition-all"
              >
                <FiRefreshCw className="text-sm" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={onClose}
                className="p-2.5 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-all hover:scale-100"
                disabled={isUploading}
              >
                <FiX className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="max-h-[calc(90vh-180px)] overflow-y-auto p-4 sm:p-5 lg:p-6 modern-scrollbar">
        <div className="space-y-5">
          
          {/* Existing Files Section - Enhanced */}
          {mode === 'edit' && editingItem && editingItem.files && editingItem.files.length > 0 && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowExistingFiles(!showExistingFiles)}
                    className="p-2.5 hover:bg-white rounded-xl transition-all"
                  >
                    {showExistingFiles ? <FiChevronUp className="text-gray-600" /> : <FiChevronDown className="text-gray-600" />}
                  </button>
                  <div>
                    <h3 className=" text-md font-bold text-gray-800 flex items-center gap-2">
                      <FiImage className="text-purple-500" />
                      <span>Existing Files ({editingItem.files.length})</span>
                    </h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Click to view • Click X to remove
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-800">
                    {filesToRemove.length} file{filesToRemove.length !== 1 ? 's' : ''} marked
                  </span>
                  <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
                </div>
              </div>
              
              {showExistingFiles && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {editingItem.files.map((fileUrl, index) => {
                    const isVideo = fileUrl && fileUrl.toLowerCase().match(/\.(mp4|avi|mov|wmv|flv|webm|mkv)$/);
                    const isMarkedForRemoval = isFileMarkedForRemoval(fileUrl);
                    
                    return (
                      <div 
                        key={index} 
                        className={`relative bg-white rounded-xl border overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md ${
                          isMarkedForRemoval 
                            ? 'border-red-300 bg-red-50/50' 
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="aspect-square relative">
                          {isVideo ? (
                            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                              <FiVideo className="text-3xl text-purple-500" />
                            </div>
                          ) : (
                            <img
                              src={fileUrl}
                              alt={`Existing file ${index + 1}`}
                              className="w-full h-full object-cover cursor-pointer transition-transform "
                              onClick={() => handlePreviewExisting(fileUrl)}
                            />
                          )}
                          
                          {isMarkedForRemoval && (
                            <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                              <div className="text-center">
                                <FiXCircle className="text-red-600 text-2xl mx-auto mb-1" />
                                <p className="text-red-700 text-xs font-bold">Will be removed</p>
                              </div>
                            </div>
                          )}
                          
                          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center gap-2 transition-all">
                            <button
                              onClick={() => handlePreviewExisting(fileUrl)}
                              className="p-2.5 bg-white/90 backdrop-blur-sm rounded-lg text-gray-800"
                              title="Preview"
                            >
                              <FiEye className="text-sm" />
                            </button>
                            {!isMarkedForRemoval && (
                              <button
                                onClick={() => handleRemoveExisting(fileUrl)}
                                className="p-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg"
                                title="Remove file"
                              >
                                <FiX className="text-sm" />
                              </button>
                            )}
                          </div>
                          
                          {isMarkedForRemoval && (
                            <button
                              onClick={() => setFilesToRemove(prev => prev.filter(url => url !== fileUrl))}
                              className="absolute top-2 right-2 p-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-lg hover:shadow-xl"
                              title="Keep this file"
                            >
                              <FiCheck className="text-xs" />
                            </button>
                          )}
                        </div>
                        
                        <div className="p-3">
                          <p className="text-sm font-bold text-gray-800 truncate">
                            {isVideo ? 'Video File' : 'Image'} {index + 1}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className={`w-2 h-2 rounded-full ${isMarkedForRemoval ? 'bg-red-500' : 'bg-green-500'}`}></div>
                            <p className="text-xs font-bold text-gray-500">
                              {isMarkedForRemoval ? 'To be removed' : 'Keeping'}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* File Upload Section - Enhanced */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-dashed border-blue-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className=" text-md font-bold text-gray-800 flex items-center gap-2">
                  <FiUpload className="text-blue-500" />
                  <span>
                    {mode === 'edit' ? 'Add New Files (Optional)' : 'Upload Files *'}
                  </span>
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  Max 10MB per file • Supported: Images only
                </p>
              </div>
              <div className="text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700">
                {formData.files.length} SELECTED
              </div>
            </div>
            
            {/* Drag & Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
                dragActive 
                  ? 'border-blue-500 bg-blue-100/30 shadow-inner' 
                  : 'border-blue-300'
              } ${isUploading ? 'pointer-events-none opacity-60' : 'hover:border-blue-400 hover:bg-blue-50/50'}`}
              onDragEnter={onDrag}
              onDragLeave={onDrag}
              onDragOver={onDrag}
              onDrop={onDrop}
              onClick={() => !isUploading && fileInputRef.current?.click()}
            >
              <div className="max-w-sm mx-auto">
                <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl inline-block mb-4 shadow-sm">
                  <FiUploadCloud className="text-3xl sm:text-4xl text-blue-500" />
                </div>
                <p className="text-gray-700 mb-2 font-bold text-base sm:text-lg">
                  {isUploading ? 'Uploading...' : 'Drag & drop files here'}
                </p>
                <p className="text-gray-500 mb-6 text-sm sm:text-base">
                  or click to browse files from your computer
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => onFileSelect(e.target.files)}
                  className="hidden"
                  ref={fileInputRef}
                  disabled={isUploading}
                />
                {!isUploading && (
                  <button
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full font-bold text-sm sm:text-base hover:shadow-lg hover:from-indigo-700 hover:to-violet-700 transition-all duration-200"
                  >
                    Browse Files
                  </button>
                )}
              </div>
            </div>

            {/* Selected Files Preview */}
            {formData.files.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span>New Files to Add ({formData.files.length})</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {formData.files.map((file, index) => {
                    // Proper file ID handling
                    const fileObj = file.file ? file : { id: `temp-${index}`, file: file, type: file.type };
                    const fileId = fileObj.id || `file-${index}`;
                    
                    // Safe URL creation
                    let previewUrl = null;
                    if (fileObj.file && fileObj.file.type && fileObj.file.type.startsWith('image/')) {
                      try {
                        previewUrl = URL.createObjectURL(fileObj.file);
                      } catch (err) {
                        console.error('Failed to create preview URL:', err);
                        previewUrl = null;
                      }
                    }
                    
                    return (
                      <div key={fileId} className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="aspect-square relative">
                          {previewUrl ? (
                            <img
                              src={previewUrl}
                              alt={fileObj.file?.name || `File ${index + 1}`}
                              className="w-full h-full object-cover transition-transform "
                              onLoad={() => {
                                // Clean up URL after image loads
                                setTimeout(() => {
                                  if (previewUrl && previewUrl.startsWith('blob:')) {
                                    URL.revokeObjectURL(previewUrl);
                                  }
                                }, 100);
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <FiFile className="text-3xl text-gray-400" />
                            </div>
                          )}
                          
                          {/* Upload Progress */}
                          {uploadProgress[fileId] !== undefined && (
                            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-200/80">
                              <div 
                                className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                                style={{ width: `${uploadProgress[fileId]}%` }}
                              />
                            </div>
                          )}
                          
                          {/* Remove Button */}
                          <button
                            onClick={() => removeFile(fileId)}
                            className="absolute top-2 right-2 p-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full opacity-0 group-hover:opacity-100 shadow-lg hover:shadow-xl transition-all"
                            title="Remove file"
                            disabled={removingFile === fileId}
                          >
                            {removingFile === fileId ? (
                              <FiRotateCw className="text-xs animate-spin" />
                            ) : (
                              <FiX className="text-xs" />
                            )}
                          </button>
                        </div>
                        
                        {/* File Info */}
                        <div className="p-3">
                          <p className="text-sm font-bold text-gray-800 truncate" title={fileObj.file?.name}>
                            {fileObj.file?.name || `File ${index + 1}`}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs font-bold text-gray-500">
                              {fileObj.file?.size ? `${(fileObj.file.size / (1024 * 1024)).toFixed(1)} MB` : 'Unknown size'}
                            </p>
                            <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Title Field - Enhanced */}
            <div className="md:col-span-2">
              <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-4 border border-indigo-200">
                <label className=" text-md font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-red-500">*</span>
                  <FiTag className="text-indigo-500" />
                  <span>Gallery Title</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="
                    w-full px-4 py-3
                    bg-white
                    border-2 border-indigo-200
                    rounded-xl focus:outline-none
                    focus:ring-2 focus:ring-indigo-500/40
                    focus:border-indigo-400 text-md
                    font-bold
                    shadow-sm
                    transition-all duration-200
                    placeholder:text-gray-400
                  "
                  placeholder="Enter a descriptive title"
                  disabled={isUploading}
                  required
                />
              </div>
            </div>

            {/* Category Dropdown - Enhanced */}
            <div className="md:col-span-2" ref={dropdownRef}>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                <label className=" text-md font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-red-500">*</span>
                  <FiFolder className="text-purple-500" />
                  <span>Category</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="
                      w-full px-4 py-3
                      bg-white
                      border-2 border-purple-200
                      rounded-xl text-left flex items-center justify-between
                      focus:ring-2 focus:ring-purple-500/40
                      focus:border-purple-400 text-md
                      font-bold
                      shadow-sm
                      transition-all duration-200
                      cursor-pointer
                    "
                    disabled={isUploading}
                  >
                    <span className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-${categories.find(cat => cat.value === formData.category)?.color || 'gray'}-500`} />
                      {categories.find(cat => cat.value === formData.category)?.label || 'Select Category'}
                    </span>
                    <FiChevronDown className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border-2 border-purple-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                      <div className="p-2">
                        {categories.map(cat => (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => handleCategorySelect(cat.value)}
                            className={`
                              w-full text-left px-4 py-3 rounded-lg flex items-center gap-2 text-md font-bold
                              transition-all duration-200 ${
                                formData.category === cat.value
                                  ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                          >
                            <div className={`w-3 h-3 rounded-full bg-${cat.color}-500`} />
                            <span>{cat.label}</span>
                            {formData.category === cat.value && (
                              <FiCheck className="ml-auto text-purple-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description Field - Enhanced */}
            <div className="md:col-span-2">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                <label className=" text-md font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <FiEdit2 className="text-amber-500" />
                  <span>Description</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="
                    w-full px-4 py-3
                    bg-white
                    border-2 border-amber-200
                    rounded-xl focus:outline-none
                    focus:ring-2 focus:ring-amber-500/40
                    focus:border-amber-400 text-md
                    font-bold
                    shadow-sm
                    transition-all duration-200
                    placeholder:text-gray-400
                    resize-vertical
                    min-h-[120px]
                  "
                  placeholder="Describe what this gallery contains..."
                  disabled={isUploading}
                />
                <div className="flex items-center gap-2 mt-2 px-1">
                  <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
                  <span className="text-xs font-bold text-gray-500">{formData.description.length}/500 characters</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer Actions */}
      <div className="p-5 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-violet-100 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full"></div>
              <span className="font-bold">
                {mode === 'edit' ? (
                  <>
                    {editingItem?.files?.length || 0} existing • 
                    {filesToRemove.length} to remove • 
                    {formData.files.length} to add
                  </>
                ) : (
                  <>
                    {formData.files.length} file{formData.files.length !== 1 ? 's' : ''} selected
                  </>
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="
                px-6
                py-2.5
                rounded-xl
                text-sm
                font-bold
                border-2 border-gray-300
                text-gray-700
                bg-white
                hover:bg-gray-50
                hover:border-gray-400
                transition-all duration-200
                min-w-[100px]
                shadow-sm
              "
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={isUploading || (mode === 'create' && formData.files.length === 0) || !formData.title.trim()}
              className="
                px-8
                py-2.5
                rounded-xl
                font-bold
                text-sm
                text-white
                bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600
                hover:from-indigo-700 hover:via-purple-700 hover:to-violet-700
                disabled:opacity-60
                disabled:cursor-not-allowed
                shadow-lg
                hover:shadow-xl
                transition-all duration-200
                min-w-[120px]
              "
            >
              {isUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <FiRotateCw className="w-4 h-4 animate-spin" />
                  <span>{mode === 'create' ? 'Uploading...' : 'Updating...'}</span>
                </span>
              ) : mode === 'edit' ? (
                <span className="flex items-center justify-center gap-2">
                  <FiSave className="w-4 h-4" />
                  <span>Save Changes</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FiUpload className="w-4 h-4" />
                  <span>Create Gallery</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

// Modern Preview Modal Component - UPDATED WITH CHECKBOX SELECTION
const ModernPreviewModal = ({ 
  item, 
  selectedItems, 
  onSelect, 
  onSelectAll,
  onDownloadSelected,
  onClose, 
  onEdit, 
  onDelete 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const copyUrl = () => {
    const targetPath = "/pages/gallery";
    const fullUrl = `${window.location.origin}${targetPath}`;

    navigator.clipboard.writeText(fullUrl);
    
    toast.success('Gallery link copied to clipboard!');
  };

  const downloadAllFiles = () => {
    if (!item.files || item.files.length === 0) {
      toast.warning('No files to download');
      return;
    }

    item.files.forEach((fileUrl, index) => {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileUrl.split('/').pop() || `file-${index + 1}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
    
    toast.success(`Downloaded ${item.files.length} files`);
  };

  const openFile = (fileUrl) => {
    window.open(fileUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl my-auto">
        {/* Modern Gradient Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10"></div>
          <div className="relative p-5 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 shadow-lg">
                  <FiEye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    Gallery Preview
                  </h2>
                  <p className="text-white/90 text-sm mt-1">
                    Select files to download or manage
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium flex items-center gap-1 sm:gap-2 hover:bg-white/30 transition-all"
                >
                  {isFullscreen ? <FiMinimize2 className="text-sm" /> : <FiMaximize2 className="text-sm" />}
                  <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2.5 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-all "
                >
                  <FiX className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[calc(90vh-180px)] overflow-y-auto p-4 sm:p-5 lg:p-6 modern-scrollbar">
          <div className="space-y-5">
            
            {/* Gallery Info Section */}
            <div className="grid md:grid-cols-2 gap-5">
              {/* Title Field */}
              <div className="md:col-span-2">
                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-4 border border-indigo-200">
                  <label className="text-md font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <FiTag className="text-indigo-500" />
                    <span>Gallery Title</span>
                  </label>
                  <div className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-md font-bold text-gray-800">
                    {item.title}
                  </div>
                </div>
              </div>

              {/* Category Display */}
              <div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                  <label className="text-md font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <FiFolder className="text-purple-500" />
                    <span>Category</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-${CATEGORIES.find(cat => cat.value === item.category)?.color || 'gray'}-500`} />
                    <span className="px-4 py-3 bg-white border-2 border-purple-200 rounded-xl text-md font-bold text-gray-800 flex-1">
                      {CATEGORIES.find(cat => cat.value === item.category)?.label || item.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Upload Date */}
              <div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                  <label className="text-md font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <FiCalendar className="text-amber-500" />
                    <span>Upload Date</span>
                  </label>
                  <div className="w-full px-4 py-3 bg-white border-2 border-amber-200 rounded-xl text-md font-bold text-gray-800">
                    {item.uploadDate ? new Date(item.uploadDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Unknown'}
                  </div>
                </div>
              </div>

              {/* Description Field */}
              <div className="md:col-span-2">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                  <label className="text-md font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <FiEdit2 className="text-emerald-500" />
                    <span>Description</span>
                  </label>
                  <div className="w-full px-4 py-3 bg-white border-2 border-emerald-200 rounded-xl text-md font-bold text-gray-800 min-h-[120px]">
                    {item.description || 'No description provided'}
                  </div>
                </div>
              </div>
            </div>

            {/* Files Grid with Checkboxes */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-md font-bold text-gray-800 flex items-center gap-2">
                    <FiGrid className="text-blue-500" />
                    <span>Gallery Files ({item.files ? item.files.length : 0})</span>
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Select files using checkboxes • Click to preview
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700">
                    {selectedItems.size} SELECTED
                  </div>
                  <button
                    onClick={onSelectAll}
                    className="text-sm font-bold text-blue-600 hover:text-blue-700"
                  >
                    {selectedItems.size === (item.files ? item.files.length : 0) ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
              </div>
              
              {item.files && item.files.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {item.files.map((fileUrl, index) => {
                    const isSelected = selectedItems.has(index);
                    const isVideo = fileUrl && fileUrl.toLowerCase().match(/\.(mp4|avi|mov|wmv|flv|webm|mkv)$/);
                    
                    return (
                      <div 
                        key={index} 
                        className={`relative bg-white rounded-xl border overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md ${
                          isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                        }`}
                      >
                        {/* Selection Checkbox */}
                        <div className="absolute top-2 left-2 z-10">
                          <button
                            onClick={() => onSelect(index)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              isSelected 
                                ? 'bg-gradient-to-br from-blue-500 to-cyan-500 border-blue-500 text-white' 
                                : 'bg-white/90 backdrop-blur-sm border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            <FiCheck className={`text-xs transition-all ${isSelected ? 'scale-100' : 'scale-90 opacity-0'}`} />
                          </button>
                        </div>
                        
                        {/* File Preview */}
                        <div className="aspect-square relative">
                          {isVideo ? (
                            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                              <FiVideo className="text-3xl text-purple-500" />
                            </div>
                          ) : (
                            <img
                              src={fileUrl}
                              alt={`File ${index + 1}`}
                              className="w-full h-full object-cover cursor-pointer"
                              onClick={() => openFile(fileUrl)}
                            />
                          )}
                          
                          {/* File Info Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-white">
                            <p className="text-xs font-bold truncate">
                              File {index + 1}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiImage className="text-gray-300 text-4xl mx-auto mb-3" />
                  <p className="text-gray-500">No files in this gallery</p>
                </div>
              )}
            </div>

            {/* Quick Actions Section */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-5 border border-slate-200 shadow-sm">
              <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiShare2 className="text-slate-500" />
                <span>Quick Actions</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={onDownloadSelected}
                  disabled={selectedItems.size === 0}
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-3 rounded-xl font-bold text-sm hover:from-slate-700 hover:to-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiDownload className="text-lg" />
                  <span>Download Selected ({selectedItems.size})</span>
                </button>
                
                <button
                  onClick={downloadAllFiles}
                  className="flex items-center justify-center gap-3 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:from-amber-800 hover:via-orange-800 hover:to-red-800 transition-all duration-200"
                >
                  <FiDownload className="text-lg" />
                  <span>Download All</span>
                </button>
                
                <button
                  onClick={copyUrl}
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-violet-700 transition-all duration-200"
                >
                  <FiCopy className="text-lg" />
                  <span>Copy Gallery URL</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer Actions */}
        <div className="p-5 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-violet-100 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full"></div>
                <span className="font-bold">
                  Gallery {item.id ? `#${String(item.id).slice(0, 8)}` : 'Unknown'} • {item.files ? item.files.length : 0} files • Created {item.uploadDate ? new Date(item.uploadDate).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="
                  px-6
                  py-2.5
                  rounded-xl
                  text-sm
                  font-bold
                  border-2 border-gray-300
                  text-gray-700
                  bg-white
                  hover:bg-gray-50
                  hover:border-gray-400
                  transition-all duration-200
                  min-w-[100px]
                  shadow-sm
                "
              >
                Close
              </button>
              <button
                onClick={onEdit}
                className="
                  px-6
                  py-2.5
                  rounded-xl
                  font-bold
                  text-sm
                  text-white
                  bg-gradient-to-r from-green-500 to-emerald-600
                  hover:from-green-600 hover:to-emerald-700
                  shadow-lg
                  hover:shadow-xl
                  transition-all duration-200
                  min-w-[120px]
                  hover:scale-100
                  flex items-center justify-center gap-2
                "
              >
                <FiEdit2 className="w-4 h-4" />
                <span>Edit Gallery</span>
              </button>
              <button
                onClick={onDelete}
                className="
                  px-6
                  py-2.5
                  rounded-xl
                  font-bold
                  text-sm
                  text-white
                  bg-gradient-to-r from-rose-500 to-pink-600
                  hover:from-rose-600 hover:to-pink-700
                  shadow-lg
                  hover:shadow-xl
                  transition-all duration-200
                  min-w-[120px]
                  hover:scale-100
                  flex items-center justify-center gap-2
                "
              >
                <FiTrash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Delete Modal Component
const ModernDeleteModal = ({ item, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-slate-200">
          <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl">
            <FiAlertCircle className="text-white text-2xl" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-800">Delete Gallery</h3>
            <p className="text-slate-600 text-sm">This action cannot be undone</p>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <p className="text-slate-600 mb-4 text-sm sm:text-base">
            Are you sure you want to delete the gallery 
            <span className="font-semibold text-slate-800"> "{item.title}"</span>?
          </p>
          
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3 text-rose-700">
              <FiAlertCircle className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm sm:text-base">This will permanently delete:</p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                    <span>{item.files ? item.files.length : 0} file{(item.files && item.files.length > 1) ? 's' : ''}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                    <span>Gallery title and description</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                    <span>All associated metadata</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Gallery Preview */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0">
              {item.files && item.files[0] && (
                <img
                  src={item.files[0]}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-medium text-slate-800 truncate">{item.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  {item.category ? item.category.replace(/_/g, ' ') : 'Unknown'}
                </span>
                <span className="text-xs text-slate-600">
                  {item.files ? item.files.length : 0} file{(item.files && item.files.length > 1) ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className="flex gap-3 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-full font-medium text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium text-sm sm:text-base"
          >
            Delete Gallery
          </button>
        </div>
      </div>
    </div>
  );
};