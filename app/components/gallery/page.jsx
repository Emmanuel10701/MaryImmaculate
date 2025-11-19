'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  FiPlus, FiSearch, FiEdit, FiTrash2, FiImage, FiFilter, FiDownload,
  FiX, FiEye, FiUpload, FiStar, FiGrid, FiList, FiChevronLeft,
  FiChevronRight, FiCheck, FiVideo, FiUser, FiCalendar, FiRotateCw,
  FiTag, FiFolder, FiInfo,FiUsers 
} from 'react-icons/fi';

// Categories and Departments from your schema
const CATEGORIES = [
  { value: 'SPORTS', label: 'Sports', color: 'green' },
  { value: 'ADMINISTRATION', label: 'Administration', color: 'blue' },
  { value: 'STUDENT_COUNCIL', label: 'Student Council', color: 'purple' },
  { value: 'DRAMA', label: 'Drama', color: 'yellow' },
  { value: 'MUSIC', label: 'Music', color: 'pink' },
  { value: 'ART', label: 'Art', color: 'orange' },
  { value: 'OTHER', label: 'Other', color: 'gray' }
];

const DEPARTMENTS = [
  { value: 'SCIENCES', label: 'Sciences', color: 'blue' },
  { value: 'EXAMS', label: 'Exams', color: 'red' },
  { value: 'HUMANITIES', label: 'Humanities', color: 'green' },
  { value: 'ARTS', label: 'Arts', color: 'purple' },
  { value: 'OTHER', label: 'Other', color: 'gray' }
];

export default function GalleryManager() {
  // State
  const [galleryItems, setGalleryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showModal, setShowModal] = useState(false);
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

  const fileInputRef = useRef(null);
  const itemsPerPage = 12;

  // Form Data - Updated to match your schema
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'SPORTS',
    department: 'SCIENCES',
    files: []
  });

  // Fetch gallery items from API
  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/gallery');
      const result = await response.json();
      
      if (result.success && result.galleries) {
        // Transform API data to match frontend structure
        const transformedItems = result.galleries.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          category: item.category,
          department: item.department,
          files: item.files || [],
          type: determineMediaType(item.files?.[0]),
          fileUrl: item.files?.[0] || '',
          thumbnailUrl: item.files?.[0] || '',
          fileName: item.files?.[0]?.split('/').pop() || 'file',
          fileSize: 'Unknown', // You might want to calculate this
          featured: false, // Add if you want featured functionality
          uploadDate: item.createdAt,
          views: 0,
          likes: 0,
          tags: [] // Add if you want tags functionality
        }));
        
        setGalleryItems(transformedItems);
        setFilteredItems(transformedItems);
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Determine media type from file extension
  const determineMediaType = (filePath) => {
    if (!filePath) return 'image';
    const extension = filePath.split('.').pop()?.toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
    
    if (imageExtensions.includes(extension)) return 'image';
    if (videoExtensions.includes(extension)) return 'video';
    return 'image'; // Default to image
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  // Filter items with useCallback for performance
  const filterItems = useCallback(() => {
    let filtered = galleryItems.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesDepartment = selectedDepartment === 'all' || item.department === selectedDepartment;
      
      return matchesSearch && matchesCategory && matchesDepartment;
    });

    return filtered;
  }, [galleryItems, searchTerm, selectedCategory, selectedDepartment]);

  useEffect(() => {
    setFilteredItems(filterItems());
    setCurrentPage(1);
  }, [filterItems]);

  // File handling with better validation
  const handleFilesSelect = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB limit
      
      if (!isValidType) {
        alert(`File ${file.name} is not a supported image or video format`);
        return false;
      }
      if (!isValidSize) {
        alert(`File ${file.name} exceeds 50MB size limit`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      alert('Please select valid image or video files (max 50MB each)');
      return;
    }

    setFormData(prev => ({ 
      ...prev, 
      files: [...prev.files, ...validFiles].slice(0, 10) // Limit to 10 files
    }));
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
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter(file => file.name !== fileName)
    }));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileName];
      return newProgress;
    });
  };

  // Enhanced CRUD Operations - Updated for your API
  const handleCreate = async () => {
    if (!formData.title.trim() || formData.files.length === 0) {
      alert('Please provide a title and select at least one file');
      return;
    }

    setIsUploading(true);
    
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('department', formData.department);
      
      // Append all files
      formData.files.forEach(file => {
        submitData.append('files', file);
      });

      const response = await fetch('/api/gallery', {
        method: 'POST',
        body: submitData,
      });

      const result = await response.json();
      
      if (result.success) {
        showSnackbar('Gallery item created successfully!', 'success');
        setShowModal(false);
        resetForm();
        fetchGalleryItems(); // Refresh the list
      } else {
        showSnackbar(result.error || 'Failed to create gallery item', 'error');
      }
    } catch (error) {
      console.error('Error creating gallery item:', error);
      showSnackbar('Network error: Could not create gallery item', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      department: item.department,
      files: []
    });
    setShowModal(true);
  };

  const handleUpdate = async () => {
    if (!formData.title.trim()) {
      alert('Please provide a title');
      return;
    }

    // Note: You'll need to implement PUT endpoint for updates
    // For now, we'll show a message
    showSnackbar('Update functionality to be implemented', 'info');
    setShowModal(false);
    setEditingItem(null);
    resetForm();
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      try {
        // Note: You'll need to implement DELETE endpoint
        // For now, we'll update locally
        setGalleryItems(prev => prev.filter(item => item.id !== id));
        setSelectedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        setImageErrors(prev => {
          const newErrors = new Set(prev);
          newErrors.delete(id);
          return newErrors;
        });
        showSnackbar('Gallery item deleted successfully!', 'success');
      } catch (error) {
        showSnackbar('Error deleting gallery item', 'error');
      }
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.size === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedItems.size} selected items? This action cannot be undone.`)) {
      setGalleryItems(prev => prev.filter(item => !selectedItems.has(item.id)));
      setSelectedItems(new Set());
      showSnackbar(`${selectedItems.size} items deleted successfully!`, 'success');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'SPORTS',
      department: 'SCIENCES',
      files: []
    });
    setUploadProgress({});
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
    images: galleryItems.filter(item => item.type === 'image').length,
    videos: galleryItems.filter(item => item.type === 'video').length,
    totalSize: 'Unknown' // You might want to calculate this
  };

  // Snackbar function
  const showSnackbar = (message, type = 'info') => {
    // You can implement a proper snackbar component here
    console.log(`${type.toUpperCase()}: ${message}`);
    // For now, using alert
    if (type === 'error') {
      alert(`Error: ${message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Media Gallery</h1>
          <p className="text-gray-600">Upload and manage images and videos from school events</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
          >
            <FiUpload className="text-lg" />
            Upload Media
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Items', value: stats.total, icon: FiImage, color: 'blue' },
          { label: 'Images', value: stats.images, icon: FiImage, color: 'green' },
          { label: 'Videos', value: stats.videos, icon: FiVideo, color: 'red' },
          { label: 'Categories', value: CATEGORIES.length, icon: FiTag, color: 'purple' },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 transition-transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
              <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                <stat.icon className={`text-xl text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search gallery..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Departments</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept.value} value={dept.value}>{dept.label}</option>
            ))}
          </select>

          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white text-blue-600 shadow-lg' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FiGrid className="text-lg" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-lg' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FiList className="text-lg" />
              </button>
            </div>
            <button 
              onClick={selectAll}
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold whitespace-nowrap"
            >
              {selectedItems.size === currentItems.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.size > 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-4 shadow-lg transition-all">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FiCheck className="text-xl" />
              <span className="font-semibold">
                {selectedItems.size} item{selectedItems.size > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-500/80 backdrop-blur-sm rounded-xl font-semibold flex items-center gap-2 hover:bg-red-600 transition-colors"
              >
                <FiTrash2 className="text-sm" />
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedItems(new Set())}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl font-semibold flex items-center gap-2 hover:bg-white/30 transition-colors"
              >
                <FiX className="text-sm" />
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Content */}
      {currentItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200 transition-all">
          <div className="text-gray-400 text-6xl mb-4">📷</div>
          <h3 className="text-gray-800 text-xl font-semibold mb-2">No media found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedCategory !== 'all' || selectedDepartment !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Get started by uploading your first media file'
            }
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedDepartment('all');
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
          >
            <FiUpload className="inline mr-2" />
            Upload Media
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
            {currentItems.map((item, index) => (
              <GalleryItem
                key={item.id}
                item={item}
                viewMode={viewMode}
                isSelected={selectedItems.has(item.id)}
                hasError={imageErrors.has(item.id)}
                onSelect={() => toggleSelection(item.id)}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item.id)}
                onView={() => setSelectedMedia(item)}
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
                className="p-2 rounded-xl bg-white border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
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
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-white border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <FiChevronRight className="text-lg" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Upload Modal */}
      {showModal && (
        <UploadModal
          formData={formData}
          setFormData={setFormData}
          editingItem={editingItem}
          uploadProgress={uploadProgress}
          isUploading={isUploading}
          dragActive={dragActive}
          categories={CATEGORIES}
          departments={DEPARTMENTS}
          onClose={() => {
            setShowModal(false);
            setEditingItem(null);
            resetForm();
          }}
          onSubmit={editingItem ? handleUpdate : handleCreate}
          onFileSelect={handleFilesSelect}
          onDrag={handleDrag}
          onDrop={handleDrop}
          removeFile={removeFile}
          fileInputRef={fileInputRef}
        />
      )}

      {/* Preview Modal */}
      {selectedMedia && (
        <PreviewModal
          item={selectedMedia}
          onClose={() => setSelectedMedia(null)}
          onDownload={() => {
            const link = document.createElement('a');
            link.href = selectedMedia.fileUrl;
            link.download = selectedMedia.fileName;
            link.click();
          }}
        />
      )}
    </div>
  );
}

// Gallery Item Component
const GalleryItem = ({ 
  item, viewMode, isSelected, hasError, onSelect, onEdit, onDelete, onView, onImageError 
}) => {
  if (viewMode === 'list') {
    return (
      <div
        className={`bg-white rounded-2xl p-4 flex items-center gap-4 border-2 transition-all hover:border-blue-300 ${
          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
        }`}
      >
        <button 
          onClick={onSelect}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            isSelected 
              ? 'bg-blue-500 border-blue-500 text-white' 
              : 'bg-white border-gray-300 hover:border-blue-400'
          }`}
        >
          <FiCheck className="text-xs" />
        </button>

        <div 
          className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden cursor-pointer flex-shrink-0 relative"
          onClick={onView}
        >
          {hasError ? (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <FiImage className="text-gray-500 text-xl" />
            </div>
          ) : item.type === 'image' ? (
            <img
              src={item.fileUrl}
              alt={item.title}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              onError={onImageError}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
              <FiVideo className="text-white text-xl" />
              <div className="absolute bottom-1 right-1 bg-black/70 rounded px-1">
                <span className="text-white text-xs">VID</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-800 truncate">{item.title}</h3>
          </div>
          <p className="text-gray-600 text-sm mb-1 truncate">{item.description}</p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="capitalize">{item.category.toLowerCase().replace('_', ' ')}</span>
            <span>•</span>
            <span className="capitalize">{item.department.toLowerCase()}</span>
            <span>•</span>
            <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onView}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:scale-110"
            title="View"
          >
            <FiEye className="text-lg" />
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-gray-600 hover:text-green-600 transition-colors rounded-lg hover:scale-110"
            title="Edit"
          >
            <FiEdit className="text-lg" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-600 hover:text-red-600 transition-colors rounded-lg hover:scale-110"
            title="Delete"
          >
            <FiTrash2 className="text-lg" />
          </button>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden border-2 transition-all cursor-pointer hover:border-blue-300 hover:scale-105 ${
        isSelected ? 'border-blue-500 ring-4 ring-blue-200' : 'border-gray-200'
      }`}
    >
      <div className="relative group">
        {/* Selection Checkbox */}
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          className={`absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center z-20 transition-all ${
            isSelected 
              ? 'bg-blue-500 border-blue-500 text-white' 
              : 'bg-white/90 border-gray-300 text-transparent hover:border-blue-400 group-hover:text-gray-400'
          }`}
        >
          <FiCheck className="text-xs" />
        </button>

        {/* Type Badge */}
        <div className="absolute top-2 right-2 z-20">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm ${
            item.type === 'image' ? 'bg-blue-500' : 'bg-red-500'
          }`}>
            {item.type === 'image' ? 'IMG' : 'VID'}
          </span>
        </div>

        {/* Media Thumbnail */}
        <div className="aspect-square bg-gray-200 relative overflow-hidden" onClick={onView}>
          {hasError ? (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <div className="text-center">
                <FiImage className="text-gray-500 text-2xl mx-auto mb-2" />
                <p className="text-gray-500 text-xs">Failed to load image</p>
              </div>
            </div>
          ) : item.type === 'image' ? (
            <img
              src={item.fileUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={onImageError}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
              <FiVideo className="text-white text-4xl" />
            </div>
          )}

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); onView(); }}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-colors hover:scale-110"
                title="View"
              >
                <FiEye className="text-lg" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-colors hover:scale-110"
                title="Edit"
              >
                <FiEdit className="text-lg" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="p-3 bg-red-500/80 backdrop-blur-sm rounded-xl text-white hover:bg-red-600 transition-colors hover:scale-110"
                title="Delete"
              >
                <FiTrash2 className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-800 text-sm mb-1 truncate" title={item.title}>
          {item.title}
        </h3>
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span className="capitalize">{item.category.toLowerCase().replace('_', ' ')}</span>
          <span>{item.fileSize}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <FiFolder className="text-xs" />
          <span className="truncate" title={item.department}>
            {item.department.toLowerCase()}
          </span>
        </div>
      </div>
    </div>
  );
};


// Upload Modal Component - Buttons moved up slightly
const UploadModal = ({
  formData, setFormData, editingItem, uploadProgress, isUploading, dragActive,
  categories, departments, onClose, onSubmit, onFileSelect, onDrag, onDrop, removeFile, fileInputRef
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-xl font-bold text-gray-800">
            {editingItem ? 'Edit Gallery Item' : 'Upload to Gallery'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-xl transition-colors border border-gray-200"
            disabled={isUploading}
          >
            <FiX className="text-xl text-gray-600" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-180px)]"> {/* Reduced height to move buttons up */}
          <div className="p-6 space-y-6">
            {/* File Upload Section */}
            {!editingItem && (
              <div className="bg-gradient-to-br from-blue-50/50 to-cyan-50/30 rounded-2xl p-5 border border-blue-100">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiUpload className="text-blue-500" />
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Select Files
                  </span>
                </h3>
                
                {/* Drag & Drop Zone */}
                <div
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-100/50' 
                      : 'border-blue-300 hover:border-blue-400 hover:bg-blue-50/30'
                  } ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
                  onDragEnter={onDrag}
                  onDragLeave={onDrag}
                  onDragOver={onDrag}
                  onDrop={onDrop}
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                >
                  <FiUpload className="text-4xl text-blue-400 mx-auto mb-3" />
                  <p className="text-gray-700 mb-2 font-medium">
                    {isUploading ? 'Uploading...' : 'Drag and drop files here'}
                  </p>
                  <p className="text-gray-500 text-sm mb-4">
                    Supports images and videos (max 50MB each)
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
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/25"
                    >
                      Browse Files
                    </button>
                  )}
                </div>

                {/* Selected Files */}
                {formData.files.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <FiCheck className="text-green-500" />
                      <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Selected Files ({formData.files.length})
                      </span>
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {formData.files.map((file, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-green-100 shadow-sm">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            file.type.startsWith('image/') ? 'bg-blue-100' : 'bg-purple-100'
                          }`}>
                            {file.type.startsWith('image/') ? 
                              <FiImage className={`text-lg ${
                                file.type.startsWith('image/') ? 'text-blue-600' : 'text-purple-600'
                              }`} /> : 
                              <FiVideo className="text-lg text-purple-600" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 truncate">{file.name}</p>
                            <p className="text-gray-600 text-sm">
                              {(file.size / (1024 * 1024)).toFixed(1)} MB • {file.type.split('/')[1].toUpperCase()}
                            </p>
                          </div>
                          {uploadProgress[file.name] !== undefined ? (
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${uploadProgress[file.name]}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-500 font-medium">{uploadProgress[file.name]}%</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => removeFile(file.name)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                              disabled={isUploading}
                            >
                              <FiX className="text-lg" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className=" text-sm font-semibold mb-3 flex items-center gap-2">
                  <FiTag className="text-red-500" />
                  <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    Title *
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Enter gallery title"
                  disabled={isUploading}
                />
              </div>

              <div>
                <label className=" text-sm font-semibold mb-3 flex items-center gap-2">
                  <FiFolder className="text-purple-500" />
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Category
                  </span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  disabled={isUploading}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className=" text-sm font-semibold mb-3 flex items-center gap-2">
                  <FiUsers className="text-green-500" />
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Department
                  </span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  disabled={isUploading}
                >
                  {departments.map(dept => (
                    <option key={dept.value} value={dept.value}>{dept.label}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className=" text-sm font-semibold mb-3 flex items-center gap-2">
                  <FiEdit className="text-orange-500" />
                  <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    Description
                  </span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Enter gallery description..."
                  disabled={isUploading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions - Moved up with reduced padding */}
        <div className="flex items-center justify-end gap-4 p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50/30"> {/* Reduced padding from p-6 to p-4 */}
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors disabled:opacity-50 border border-gray-300 rounded-xl hover:bg-white hover:border-gray-400 hover:shadow-lg min-w-24"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isUploading || (!editingItem && formData.files.length === 0) || !formData.title.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 transition-all disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 min-w-32 justify-center"
          >
            {isUploading ? (
              <>
                <FiRotateCw className="animate-spin" />
                Uploading...
              </>
            ) : editingItem ? (
              <>
                <FiCheck />
                Update Item
              </>
            ) : (
              <>
                <FiUpload />
                Upload Media
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};