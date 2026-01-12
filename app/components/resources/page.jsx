'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit, 
  FiTrash2, 
  FiFilter,
  FiDownload,
  FiEye,
  FiX,
  FiClock,
  FiBarChart2,
  FiUsers,
  FiPaperclip,
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
  FiSave,
  FiUpload,
  FiBook,
  FiCalendar,
  FiFileText,
  FiLink,
  FiAward,
  FiMessageSquare,
  FiRotateCw,
  FiFolder,
  FiVideo,
  FiImage,
  FiStar, 
  FiMusic,
  FiFile,
  FiGlobe,
  FiShield,
  FiUser,
  FiCheck,
  FiArchive,
  FiChevronDown,
  FiChevronUp,
  FiHardDrive,
  FiTrendingUp,
  FiArrowLeft,
  FiChevronRight as FiChevronRight2,
  FiGrid,
  FiSliders,
  FiNewspaper,
  FiSortAlphaDown,
  FiSortAlphaUp
} from 'react-icons/fi';

// Material-UI Components
import CircularProgress from '@mui/material/CircularProgress';
import { Modal, Box, TextField, TextareaAutosize, Chip, Tooltip, Button } from '@mui/material';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Filter Chip Component
const FilterChip = ({ label, value, options, onChange, icon, isOpen, setIsOpen, color = "sky" }) => {
  const selectedOption = options.find(opt => opt.id === value);
  const colorClasses = {
    sky: 'border-sky-200 bg-gradient-to-r from-sky-50 to-sky-100 text-sky-700 hover:border-sky-300',
    emerald: 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 hover:border-emerald-300',
    amber: 'border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 hover:border-amber-300',
    purple: 'border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 hover:border-purple-300',
    rose: 'border-rose-200 bg-gradient-to-r from-rose-50 to-rose-100 text-rose-700 hover:border-rose-300',
    slate: 'border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 hover:border-slate-300',
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-sm font-semibold transition-all duration-300 border-2 ${colorClasses[color]} shadow-sm hover:shadow-md active:scale-95`}
      >
        <span className="flex items-center gap-2">
          {icon}
          <span className="whitespace-nowrap">{label}:</span>
          <span className="font-bold">{selectedOption?.label || 'All'}</span>
        </span>
        <FiChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-56 sm:w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="py-2 max-h-64 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors duration-200 ${
                  value === option.id
                    ? 'bg-gradient-to-r from-sky-50 to-blue-50 text-sky-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {option.icon && (
                  <span className="flex-shrink-0">{option.icon}</span>
                )}
                <span className="flex-1 truncate">{option.label}</span>
                {value === option.id && (
                  <FiCheck className="text-sky-600 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Filter Badge Component
const FilterBadge = ({ label, onRemove }) => (
  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 rounded-full text-xs font-semibold border border-slate-300">
    <span>{label}</span>
    <button
      onClick={onRemove}
      className="p-0.5 hover:bg-slate-300 rounded-full transition-colors"
    >
      <FiX className="w-3 h-3" />
    </button>
  </div>
);

// Helper function
const getLabelFromId = (id, options) => {
  const option = options.find(opt => opt.id === id);
  return option?.label || id;
};

// ==========================================
// 1. ENHANCED CONFIGURATION
// ==========================================

const RESOURCE_TYPES = [
  { id: 'all', label: 'All Types', color: 'gray', icon: <FiFolder className="text-gray-500" /> },
  { id: 'document', label: 'Document', color: 'blue', icon: <FiFileText className="text-blue-500" /> },
  { id: 'pdf', label: 'PDF', color: 'red', icon: <FiFileText className="text-red-500" /> },
  { id: 'video', label: 'Video', color: 'purple', icon: <FiVideo className="text-purple-500" /> },
  { id: 'presentation', label: 'Presentation', color: 'orange', icon: <FiBarChart2 className="text-orange-500" /> },
  { id: 'worksheet', label: 'Worksheet', color: 'emerald', icon: <FiFile className="text-emerald-500" /> },
  { id: 'audio', label: 'Audio', color: 'indigo', icon: <FiMusic className="text-indigo-500" /> },
  { id: 'image', label: 'Image', color: 'pink', icon: <FiImage className="text-pink-500" /> },
  { id: 'archive', label: 'Archive', color: 'gray', icon: <FiArchive className="text-gray-500" /> }
];

const ACCESS_LEVELS = [
  { id: 'all', label: 'All Access', color: 'gray', icon: <FiUsers className="text-gray-500" /> },
  { id: 'student', label: 'Student', color: 'blue', icon: <FiUser className="text-blue-500" /> },
  { id: 'teacher', label: 'Teacher', color: 'green', icon: <FiUsers className="text-green-500" /> },
  { id: 'admin', label: 'Admin', color: 'purple', icon: <FiShield className="text-purple-500" /> }
];

const CATEGORIES = [
  'General', 'Lesson Notes', 'Past Papers', 'Reference Materials', 'Study Guides',
  'Worksheets', 'Presentations', 'Videos', 'Audio Resources', 'Other'
];

const SUBJECTS = [
  'Mathematics', 'English', 'Kiswahili', 'Physics', 'Chemistry', 'Biology',
  'History', 'Geography', 'Science', 'Computer Studies', 'Business Studies'
];

const CLASSES = [
 'Form 1', 'Form 2', 'Form 3', 'Form 4'
];

const ITEMS_PER_PAGE = 10;

// ==========================================
// 2. UTILITY FUNCTIONS
// ==========================================

const getBadgeColorStyles = (colorName) => {
  const map = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    violet: 'bg-violet-50 text-violet-700 border-violet-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    pink: 'bg-pink-50 text-pink-700 border-pink-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    slate: 'bg-slate-50 text-slate-700 border-slate-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    gray: 'bg-gray-50 text-gray-700 border-gray-200'
  };
  return map[colorName] || map.slate;
};

const getFileIcon = (fileName, className = "") => {
  if (!fileName) return <FiFile className={`text-gray-600 ${className}`.trim()} />;
  
  const ext = fileName.split('.').pop().toLowerCase();
  
  // Combine base className with color-specific className
  const getIcon = (IconComponent, colorClass) => {
    const combinedClass = `${colorClass} ${className}`.trim();
    return <IconComponent className={combinedClass} />;
  };
  
  switch (ext) {
    case 'pdf':
      return getIcon(FiFileText, "text-red-500");
    case 'doc':
    case 'docx':
      return getIcon(FiFileText, "text-blue-500");
    case 'ppt':
    case 'pptx':
      return getIcon(FiBarChart2, "text-orange-500");
    case 'xls':
    case 'xlsx':
      return getIcon(FiBarChart2, "text-green-500");
    case 'mp4':
    case 'mov':
    case 'avi':
      return getIcon(FiVideo, "text-purple-500");
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return getIcon(FiImage, "text-pink-500");
    case 'mp3':
    case 'wav':
      return getIcon(FiMusic, "text-indigo-500");
    case 'zip':
    case 'rar':
      return getIcon(FiArchive, "text-gray-500");
    default:
      return getIcon(FiFile, "text-gray-600");
  }
};

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// ==========================================
// 3. SUB-COMPONENTS
// ==========================================

const Badge = ({ children, color = 'slate', className = '', icon }) => (
  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${getBadgeColorStyles(color)} ${className}`}>
    {icon}
    {children}
  </span>
);

const StatsPill = ({ icon, value, label, color = 'blue' }) => (
  <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200/50">
    <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
      {icon}
    </div>
    <div className="text-center">
      <div className="text-lg font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  </div>
);

const FilterDropdown = ({ label, value, options, onChange, icon, isOpen, setIsOpen }) => (
  <div className="relative">
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700"
    >
      {icon}
      {label}: {options.find(opt => opt.id === value)?.label || 'All'}
      {isOpen ? <FiChevronUp className="ml-2" /> : <FiChevronDown className="ml-2" />}
    </button>
    
    {isOpen && (
      <div className="absolute z-10 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
        <div className="max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-4 py-2.5 text-left ${
                value === option.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              {option.icon}
              <span className="text-sm">{option.label}</span>
              {value === option.id && <FiCheck className="ml-auto text-blue-600" />}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
);

const ResourceCard = ({ resource, onEdit, onView, onDelete, onDownload }) => {
  const resourceType = RESOURCE_TYPES.find(t => t.id === resource.type) || RESOURCE_TYPES[0];
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200/50 overflow-hidden flex flex-col h-full">
      {/* Card Header */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
            {resourceType.icon}
          </div>
          <Badge color={resourceType.color} icon={resourceType.icon}>
            {resourceType.label}
          </Badge>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
          {resource.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {resource.description || 'No description available'}
        </p>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-4 flex-1">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiBook className="text-blue-500" />
            <span className="font-medium">{resource.subject}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiFolder className="text-purple-500" />
            <span className="font-medium">{resource.className}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiFile className="text-emerald-500" />
            <span className="font-medium">{resource.fileSize || formatFileSize(resource.size)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiDownload className="text-orange-500" />
            <span className="font-medium">{resource.downloads || 0} downloads</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200/50">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2">
            <FiUser className="text-gray-400" />
            Uploaded by: {resource.uploadedBy || 'System'}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FiCalendar className="text-gray-400" />
            {formatDate(resource.createdAt)}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-6 pt-0 border-t border-gray-200/50">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onView(resource)}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-sm font-semibold"
          >
            <FiEye /> View
          </button>
          <button
            onClick={() => onDownload(resource)}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold"
          >
            <FiDownload /> Download
          </button>
          <button
            onClick={() => onEdit(resource)}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 text-sm font-semibold"
          >
            <FiEdit /> Edit
          </button>
          <button
            onClick={() => onDelete(resource)}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-red-50 to-red-100 text-red-700 text-sm font-semibold"
          >
            <FiTrash2 /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. MAIN COMPONENT
// ==========================================

export default function ResourcesManager() {
  // State
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedAccessLevel, setSelectedAccessLevel] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewResource, setViewResource] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    className: '',
    description: '',
    category: 'General',
    accessLevel: 'student',
    uploadedBy: '',
    teacher: '',
    isActive: true
  });
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Filter dropdown states
  const [typeOpen, setTypeOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Active filter count function
  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedType !== 'all') count++;
    if (selectedCategory !== 'all') count++;
    if (selectedSubject !== 'all') count++;
    if (selectedClass !== 'all') count++;
    if (selectedAccessLevel !== 'all') count++;
    return count;
  };

  // Helper function
  const getLabelFromId = (id, options) => {
    const option = options.find(opt => opt.id === id);
    return option?.label || id;
  };

  // Helper function for color mapping
  const getColorFromString = (colorString) => {
    const colorMap = {
      'blue-500': '#3b82f6',
      'green-500': '#10b981',
      'purple-500': '#8b5cf6',
      'orange-500': '#f97316',
      'red-500': '#ef4444',
      'yellow-500': '#eab308',
      'sky-500': '#0ea5e9',
      'cyan-500': '#06b6d4',
      'emerald-500': '#10b981',
      'indigo-500': '#6366f1',
    };
    
    return colorMap[colorString] || '#6b7280';
  };

  // API Integration
  const fetchResources = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(`${API_BASE_URL}/api/resources`);
      const data = await response.json();
      
      if (data.success) {
        const allResources = data.resources || [];
        
        // Apply local filtering
        let filtered = allResources;
        
        if (searchTerm) {
          filtered = filtered.filter(resource =>
            resource.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.description?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        if (selectedType !== 'all') {
          filtered = filtered.filter(resource => resource.type === selectedType);
        }
        
        if (selectedCategory !== 'all') {
          filtered = filtered.filter(resource => resource.category === selectedCategory);
        }
        
        if (selectedSubject !== 'all') {
          filtered = filtered.filter(resource => resource.subject === selectedSubject);
        }
        
        if (selectedClass !== 'all') {
          filtered = filtered.filter(resource => resource.className === selectedClass);
        }
        
        if (selectedAccessLevel !== 'all') {
          filtered = filtered.filter(resource => resource.accessLevel === selectedAccessLevel);
        }
        
        setResources(allResources);
        setFilteredResources(filtered);
      } else {
        throw new Error(data.error || 'Failed to fetch resources');
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      setResources([]);
      setFilteredResources([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchResource = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/resources/${id}`);
      const data = await response.json();
      
      if (data.success) {
        return data.resource;
      } else {
        throw new Error(data.error || 'Failed to fetch resource');
      }
    } catch (error) {
      console.error('Error fetching resource:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // Apply filters when filter states change
  useEffect(() => {
    let filtered = resources;
    
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }
    
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(resource => resource.subject === selectedSubject);
    }
    
    if (selectedClass !== 'all') {
      filtered = filtered.filter(resource => resource.className === selectedClass);
    }
    
    if (selectedAccessLevel !== 'all') {
      filtered = filtered.filter(resource => resource.accessLevel === selectedAccessLevel);
    }
    
    setFilteredResources(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [resources, searchTerm, selectedType, selectedCategory, selectedSubject, selectedClass, selectedAccessLevel]);

  // Stats
  const stats = useMemo(() => [
    { 
      icon: <FiFolder className="text-blue-600 text-xl" />, 
      value: resources.length, 
      label: 'Total Resources',
      color: 'blue'
    },
    { 
      icon: <FiVideo className="text-purple-600 text-xl" />, 
      value: resources.filter(r => r.type === 'video').length, 
      label: 'Videos',
      color: 'purple'
    },
    { 
      icon: <FiFileText className="text-red-600 text-xl" />, 
      value: resources.filter(r => r.type === 'pdf').length, 
      label: 'PDFs',
      color: 'red'
    },
    { 
      icon: <FiUsers className="text-green-600 text-xl" />, 
      value: resources.filter(r => r.accessLevel === 'student').length, 
      label: 'Student Access',
      color: 'green'
    }
  ], [resources]);

  // Handlers
  const clearFilters = () => {
    setSelectedType('all');
    setSelectedCategory('all');
    setSelectedSubject('all');
    setSelectedClass('all');
    setSelectedAccessLevel('all');
    setSearchTerm('');

    setCurrentPage(1);
  };

  const handleCreate = () => {
    setFormData({
      title: '',
      subject: '',
      className: '',
      description: '',
      category: 'General',
      accessLevel: 'student',
      uploadedBy: 'Admin',
      teacher: '',
      isActive: true
    });
    setSelectedFile(null);
    setEditingResource(null);
    setShowModal(true);
  };

  const handleEdit = async (resource) => {
    try {
      const fullResource = await fetchResource(resource.id);
      if (fullResource) {
        setFormData({
          title: fullResource.title,
          subject: fullResource.subject,
          className: fullResource.className,
          description: fullResource.description,
          category: fullResource.category,
          teacher: fullResource.teacher,
          accessLevel: fullResource.accessLevel,
          uploadedBy: fullResource.uploadedBy,
          isActive: fullResource.isActive
        });
        setSelectedFile(null);
        setEditingResource(fullResource);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Failed to load resource details:', error);
    }
  };

  const handleView = async (resource) => {
    try {
      const fullResource = await fetchResource(resource.id);
      if (fullResource) {
        setViewResource(fullResource);
        setShowViewModal(true);
      }
    } catch (error) {
      console.error('Failed to load resource details:', error);
    }
  };

  const handleDelete = (resource) => {
    setResourceToDelete(resource);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!resourceToDelete) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/resources/${resourceToDelete.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchResources();
      } else {
        throw new Error(data.error || 'Failed to delete resource');
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
    } finally {
      setShowDeleteConfirm(false);
      setResourceToDelete(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim() || !formData.subject || !formData.className) {
      console.error('Title, subject, and class are required');
      return;
    }
    
    if (!selectedFile && !editingResource) {
      console.error('Please select a file to upload');
      return;
    }

    setSaving(true);
    setUploading(true);

    try {
      const submitData = new FormData();
      
      // Add form data
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      // Add file if selected
      if (selectedFile) {
        submitData.append('file', selectedFile);
      }

      let response;
      let url;
      
      if (editingResource) {
        url = `${API_BASE_URL}/api/resources/${editingResource.id}`;
        response = await fetch(url, {
          method: 'PUT',
          body: submitData,
        });
      } else {
        url = `${API_BASE_URL}/api/resources`;
        response = await fetch(url, {
          method: 'POST',
          body: submitData,
        });
      }

      const data = await response.json();

      if (data.success) {
        await fetchResources();
        setShowModal(false);
        setSelectedFile(null);
      } else {
        throw new Error(data.error || data.details);
      }
    } catch (error) {
      console.error('Error saving resource:', error);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const downloadResource = async (resource) => {
    try {
      const response = await fetch(resource.fileUrl);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = resource.fileName || resource.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const Pagination = () => {
    const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
    
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <p className="text-sm text-gray-600">
          Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredResources.length)} of {filteredResources.length} resources
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
          >
            <FiChevronLeft className="text-lg" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => 
              page === 1 || 
              page === totalPages || 
              (page >= currentPage - 1 && page <= currentPage + 1)
            )
            .map((page, index, array) => (
              <div key={page} className="flex items-center">
                {index > 0 && array[index - 1] !== page - 1 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
                <button
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg font-semibold ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                      : 'text-gray-700'
                  }`}
                >
                  {page}
                </button>
              </div>
            ))
          }

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
          >
            <FiChevronRight className="text-lg" />
          </button>
        </div>
      </div>
    );
  };

  if (loading && resources.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Loading Resources</h2>
          <p className="text-gray-600">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <main>
          {/* Modern Header for Learning Resources Manager */}
          <div className="relative mb-6 sm:mb-8 overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] bg-gradient-to-br from-sky-700 via-sky-600 to-cyan-600 p-4 sm:p-6 lg:p-8 shadow-xl sm:shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.08] sm:opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/5 to-cyan-500/5" />
            </div>
            
            {/* Cyan Glow Effects - Responsive sizes */}
            <div className="absolute -right-16 sm:-right-24 -top-16 sm:-top-24 w-48 sm:w-64 lg:w-96 h-48 sm:h-64 lg:h-96 bg-gradient-to-r from-cyan-400 to-sky-300 rounded-full opacity-15 sm:opacity-20 blur-xl sm:blur-2xl lg:blur-3xl" />
            <div className="absolute -left-16 sm:-left-24 -bottom-16 sm:-bottom-24 w-48 sm:w-64 lg:w-96 h-48 sm:h-64 lg:h-96 bg-gradient-to-r from-sky-400 to-teal-300 rounded-full opacity-10 sm:opacity-15 blur-xl sm:blur-2xl lg:blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
                {/* Left Content - Title & Description */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                    {/* Icon Container */}
                    <div className="relative self-start shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-sky-500 rounded-xl sm:rounded-2xl blur-md sm:blur-lg opacity-60 sm:opacity-70" />
                      <div className="relative p-2.5 sm:p-3 bg-gradient-to-br from-sky-500 to-cyan-600 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl">
                        <FiFolder className="text-white text-lg sm:text-xl lg:text-2xl w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                      </div>
                    </div>
                    
                    {/* Text Content */}
                    <div className="flex-1 min-w-0">
                      {/* Badge - Hidden on smallest screens */}
                      <div className="hidden xs:inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-2 sm:mb-3 max-w-max">
                        <FiGlobe className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                        <span className="text-[10px] xs:text-xs font-bold text-white uppercase tracking-wide sm:tracking-widest">Digital Library</span>
                      </div>
                      
                      {/* Title */}
                      <h1 className="text-2xl xs:text-3xl -z-20 sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight sm:leading-tight">
                        Learning <span className="block sm:inline">Resources</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-sky-200 block">
                          Manager
                        </span>
                      </h1>
                      
                      {/* Description - Responsive sizing */}
                      <p className="text-sky-100/90 mt-2 sm:mt-3 text-sm xs:text-base sm:text-lg font-medium max-w-2xl leading-relaxed line-clamp-2 sm:line-clamp-none">
                        {loading ? 'Loading educational resources...' : `Managing ${filteredResources.length} digital resources across all subjects`}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Right Content - Stats & Quick Info */}
                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between lg:flex-col lg:items-end gap-3 sm:gap-4">
                  {/* Quick Stats Counter - Mobile */}
                  <div className="flex items-center gap-2 xs:gap-3 lg:hidden">
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] xs:text-xs font-bold text-sky-200/70 uppercase tracking-wide">Total</span>
                      <span className="text-xl xs:text-2xl font-black text-white">
                        {stats.reduce((sum, stat) => sum + (stat.value || 0), 0) || 0}
                      </span>
                    </div>
                    <div className="h-6 w-px bg-white/20" />
                  </div>
                  
                  {/* Action Buttons - Responsive layout */}
                  <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full xs:w-auto">
                    {/* Upload Button - Primary CTA */}
                    <button
                      onClick={handleCreate}
                      className="group relative overflow-hidden px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-white to-cyan-100 text-sky-900 rounded-xl sm:rounded-2xl font-semibold sm:font-bold hover:shadow-lg sm:hover:shadow-xl hover:shadow-sky-500/20 active:scale-95 transition-all duration-300 w-full xs:w-auto"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-200/30 to-sky-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative flex items-center justify-center gap-2">
                        <FiUpload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm font-medium sm:font-bold whitespace-nowrap">
                          Upload Resource
                        </span>
                      </div>
                    </button>
                    
                    {/* Refresh Button */}
                    <button
                      onClick={() => fetchResources(true)}
                      disabled={refreshing}
                      className="group relative overflow-hidden px-4 sm:px-5 py-2.5 sm:py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl text-white font-semibold sm:font-bold hover:bg-white/15 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full xs:w-auto"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      <div className="relative flex items-center justify-center gap-2">
                        <FiRotateCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        <span className="text-xs sm:text-sm whitespace-nowrap">
                          {refreshing ? 'Refreshing...' : 'Refresh'}
                        </span>
                      </div>
                    </button>
                  </div>
                  
                  {/* Total Resources Counter - Desktop */}
                  <div className="hidden lg:flex flex-col items-end">
                    <span className="text-[10px] font-bold text-sky-200/70 uppercase tracking-widest">Total Resources</span>
                    <span className="text-2xl font-black text-white">
                      {stats.reduce((sum, stat) => sum + (stat.value || 0), 0) || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="group relative bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg sm:shadow-xl hover:shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-500 hover:-translate-y-1">
                {/* Background accent circle */}
                <div className="absolute -right-6 -top-6 sm:-right-8 sm:-top-8 w-16 h-16 sm:w-20 sm:h-20 rounded-full opacity-10 transition-transform group-hover:scale-150 duration-500" 
                     style={{ backgroundColor: getColorFromString(stat.color) }} />
                
                <div className="relative z-10">
                  <div className="inline-flex p-2 sm:p-3 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 transition-colors duration-300"
                       style={{ backgroundColor: getColorFromString(stat.color) + '20' }}>
                    {stat.icon}
                  </div>
                  
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {stat.value || 0}
                    </h3>
                    <div className="flex items-center text-emerald-500 text-xs sm:text-sm font-medium">
                      <FiTrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
                      <span>+{Math.floor((stat.value || 0) * 0.12)}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-50 dark:border-slate-800">
                    <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                      {stat.description || `${stat.label.toLowerCase()} resources available`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modern Search & Filters Bar - Premium Design */}
          <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
            {/* Premium Search Bar */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-cyan-500/5 rounded-2xl sm:rounded-3xl transform group-hover:scale-105 transition-transform duration-300" />
              <div className="relative">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none z-10">
                    <FiSearch className="text-sky-500 group-hover:text-sky-600 transition-colors duration-300 text-lg sm:text-xl" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search resources by title, description, subject..."
                    className="block w-full pl-10 sm:pl-12 pr-12 sm:pr-14 py-3.5 sm:py-4 border-2 border-sky-100 rounded-2xl sm:rounded-3xl leading-5 bg-white/90 backdrop-blur-sm placeholder-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 text-sm sm:text-base shadow-lg shadow-sky-500/5 transition-all duration-300"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-sky-400 hover:text-sky-600 transition-colors duration-300"
                    >
                      <FiX className="text-lg" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Modern Filter Grid */}
            <div className="space-y-4">
              {/* Filter Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-sky-100 to-cyan-100 rounded-xl">
                    <FiFilter className="text-sky-600 text-lg" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Filters
                  </span>
                  <div className="h-4 w-px bg-slate-200" />
                  <span className="text-xs text-slate-500">
                    {getActiveFilterCount()} active
                  </span>
                </div>
                
                {/* Mobile Create Button */}
                <button
                  onClick={handleCreate}
                  className="sm:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-sky-500/30 active:scale-95 transition-all"
                >
                  <FiPlus className="text-lg" /> 
                  New
                </button>
              </div>

              {/* Filter Chips Grid - Responsive */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {/* Resource Type Filter Chip */}
                <FilterChip
                  label="Type"
                  value={selectedType}
                  options={RESOURCE_TYPES}
                  onChange={setSelectedType}
                  icon={<FiFolder className="text-sky-600" />}
                  isOpen={typeOpen}
                  setIsOpen={setTypeOpen}
                  color="sky"
                />

                {/* Category Filter Chip */}
                <FilterChip
                  label="Category"
                  value={selectedCategory}
                  options={[
                    { id: 'all', label: 'All Categories', icon: <FiBook className="text-slate-500" /> },
                    ...CATEGORIES.map(cat => ({
                      id: cat,
                      label: cat,
                      icon: <FiBook className="text-sky-600" />
                    }))
                  ]}
                  onChange={setSelectedCategory}
                  icon={<FiBook className="text-emerald-600" />}
                  isOpen={categoryOpen}
                  setIsOpen={setCategoryOpen}
                  color="emerald"
                />

                {/* Subject Filter Chip */}
                <FilterChip
                  label="Subject"
                  value={selectedSubject}
                  options={[
                    { id: 'all', label: 'All Subjects', icon: <FiBook className="text-slate-500" /> },
                    ...SUBJECTS.map(sub => ({
                      id: sub,
                      label: sub,
                      icon: <FiBook className="text-amber-600" />
                    }))
                  ]}
                  onChange={setSelectedSubject}
                  icon={<FiBook className="text-amber-600" />}
                  isOpen={subjectOpen}
                  setIsOpen={setSubjectOpen}
                  color="amber"
                />

                {/* Class Filter Chip */}
                <FilterChip
                  label="Class"
                  value={selectedClass}
                  options={[
                    { id: 'all', label: 'All Classes', icon: <FiUsers className="text-slate-500" /> },
                    ...CLASSES.map(cls => ({
                      id: cls,
                      label: cls,
                      icon: <FiUsers className="text-purple-600" />
                    }))
                  ]}
                  onChange={setSelectedClass}
                  icon={<FiUsers className="text-purple-600" />}
                  isOpen={classOpen}
                  setIsOpen={setClassOpen}
                  color="purple"
                />

                {/* Access Level Filter Chip */}
                <FilterChip
                  label="Access"
                  value={selectedAccessLevel}
                  options={ACCESS_LEVELS}
                  onChange={setSelectedAccessLevel}
                  icon={<FiShield className="text-rose-600" />}
                  isOpen={accessOpen}
                  setIsOpen={setAccessOpen}
                  color="rose"
                />

                {/* Sort Filter */}
                <FilterChip
                  label="Sort"
                  value={sortBy}
                  options={[
                    { id: 'newest', label: 'Newest First', icon: <FiCalendar className="text-slate-600" /> },
                    { id: 'oldest', label: 'Oldest First', icon: <FiCalendar className="text-slate-600" /> },
                    { id: 'az', label: 'A → Z', icon: <FiSliders  className="text-slate-600" /> },
                    { id: 'za', label: 'Z → A', icon: <FiSliders  className="text-slate-600" /> },
                  ]}
                  onChange={setSortBy}
                  icon={<FiFilter className="text-slate-600" />}
                  isOpen={sortOpen}
                  setIsOpen={setSortOpen}
                  color="slate"
                />

                {/* Clear Filters Button - Modern */}
                {(selectedType !== 'all' || selectedCategory !== 'all' || selectedSubject !== 'all' || 
                  selectedClass !== 'all' || selectedAccessLevel !== 'all' || searchTerm) && (
                  <button
                    onClick={clearFilters}
                    className="group flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-rose-50 to-rose-100 text-rose-700 rounded-xl sm:rounded-2xl text-sm font-semibold hover:from-rose-100 hover:to-rose-200 active:scale-95 transition-all duration-300 border border-rose-200 hover:border-rose-300 shadow-sm"
                  >
                    <FiX className="text-rose-600 group-hover:rotate-90 transition-transform duration-300" />
                    <span className="whitespace-nowrap">Clear All</span>
                  </button>
                )}
              </div>

              {/* Active Filters Summary */}
              {(selectedType !== 'all' || selectedCategory !== 'all' || selectedSubject !== 'all' || 
                selectedClass !== 'all' || selectedAccessLevel !== 'all') && (
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Active filters:</span>
                    {selectedType !== 'all' && (
                      <FilterBadge label={`Type: ${getLabelFromId(selectedType, RESOURCE_TYPES)}`} onRemove={() => setSelectedType('all')} />
                    )}
                    {selectedCategory !== 'all' && (
                      <FilterBadge label={`Category: ${selectedCategory}`} onRemove={() => setSelectedCategory('all')} />
                    )}
                    {selectedSubject !== 'all' && (
                      <FilterBadge label={`Subject: ${selectedSubject}`} onRemove={() => setSelectedSubject('all')} />
                    )}
                    {selectedClass !== 'all' && (
                      <FilterBadge label={`Class: ${selectedClass}`} onRemove={() => setSelectedClass('all')} />
                    )}
                    {selectedAccessLevel !== 'all' && (
                      <FilterBadge label={`Access: ${getLabelFromId(selectedAccessLevel, ACCESS_LEVELS)}`} onRemove={() => setSelectedAccessLevel('all')} />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200/50 p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200/50 p-8 sm:p-12 text-center">
              <FiFolder className="text-4xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
              <button
                onClick={clearFilters}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onEdit={handleEdit}
                    onView={handleView}
                    onDelete={handleDelete}
                    onDownload={downloadResource}
                  />
                ))}
              </div>

              {/* Pagination */}
              {filteredResources.length > ITEMS_PER_PAGE && (
                <div className="mt-8 pt-6 border-t border-gray-200/50">
                  <Pagination />
                </div>
              )}
            </>
          )}

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200/50 text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-emerald-50 px-6 py-3 rounded-full border border-blue-200 mb-4">
              <FiStar className="text-blue-600" />
              <span className="font-semibold text-blue-700">Soaring for Excellence in Education</span>
            </div>
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Nyaribu Secondary School • Resources Manager v2.0
            </p>
          </div>
        </main>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <Modal open={true} onClose={() => setShowModal(false)}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '95vh', bgcolor: 'background.paper',
            borderRadius: 3, boxShadow: 24, overflow: 'hidden',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
          }}>
            <div className="p-6 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                    <FiFileText className="text-white text-xl" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingResource ? 'Edit Resource' : 'Upload New Resource'}
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-600"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(95vh-150px)] overflow-y-auto">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {editingResource ? 'Replace File (Optional)' : 'Upload File *'}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resourceFile"
                    required={!editingResource}
                  />
                  <label htmlFor="resourceFile" className="cursor-pointer block text-center">
                    <FiUpload className="text-2xl text-blue-500 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-gray-700">
                      {selectedFile ? selectedFile.name : 'Click to select a file'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supported: PDF, DOC, PPT, XLS, Images, Videos, Audio (Max 10MB)
                    </p>
                  </label>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter resource title"
                  />
                </div>
                      <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Teacher *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.teacher}
                    onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter teacher name"
                  />
                </div>


                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Subject</option>
                    {SUBJECTS.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Class *
                  </label>
                  <select
                    required
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Class</option>
                    {CLASSES.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Access Level
                  </label>
                  <select
                    value={formData.accessLevel}
                    onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {ACCESS_LEVELS.filter(l => l.id !== 'all').map(level => (
                      <option key={level.id} value={level.id}>{level.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter resource description..."
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
                  Active (Visible to users)
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t border-gray-200/50">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {(saving || uploading) ? (
                    <>
                      <CircularProgress size={20} sx={{ color: 'white' }} />
                      {editingResource ? 'Updating...' : 'Uploading...'}
                    </>
                  ) : (
                    <>
                      {editingResource ? <FiEdit /> : <FiUpload />}
                      {editingResource ? 'Update Resource' : 'Upload Resource'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </Box>
        </Modal>
      )}

      {/* Modern Resource View Modal */}
      {showViewModal && viewResource && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-slate-900/90 backdrop-blur-sm">
          {/* Modal Container */}
          <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl bg-white sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
            
            {/* Close Button - Floating & Premium */}
            <button 
              onClick={() => setShowViewModal(false)}
              className="absolute top-5 right-5 z-50 p-2 bg-black/20 backdrop-blur-md text-white rounded-full border border-white/20 transition-all active:scale-90"
            >
              <FiX size={24} />
            </button>

            {/* 1. Header with Gradient */}
            <div className="relative h-[20vh] sm:h-[180px] w-full shrink-0 bg-gradient-to-r from-blue-600 to-emerald-600">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-emerald-500/20" />
              <div className="relative h-full flex flex-col justify-end p-6 lg:p-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                    {getFileIcon(viewResource.fileName)}
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
                      Resource Details
                    </h2>
                    <p className="text-white/70 text-sm mt-1">
                      Complete educational resource information
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Content Area - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-white">
              <div className="max-w-2xl mx-auto space-y-8">
                
                {/* Resource Header Card */}
                <section className="p-6 bg-gradient-to-r from-blue-50/80 to-emerald-50/80 rounded-3xl border border-blue-200/50">
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-xl">
                        {getFileIcon(viewResource.fileName, 'text-white text-3xl')}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                        <FiCheck className="text-white text-xs" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full mb-2">
                        <FiBook className="text-blue-600" />
                        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Educational Resource</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-1 truncate">
                        {viewResource.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <span className="font-medium">{viewResource.subject}</span>
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>{viewResource.className}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <span className="font-medium">{viewResource.teacher}</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Details Grid - 2 Columns */}
                <section className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Resource Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                          <FiFileText className="text-blue-600" />
                          <p className="text-[10px] uppercase font-bold text-slate-400">File Name</p>
                        </div>
                        <p className="font-bold text-slate-900 truncate">{viewResource.fileName}</p>
                      </div>
                      
                      <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                          <FiHardDrive className="text-slate-600" />
                          <p className="text-[10px] uppercase font-bold text-slate-400">File Size</p>
                        </div>
                        <p className="font-bold text-slate-900">
                          {viewResource.fileSize || formatFileSize(viewResource.size)}
                        </p>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                          <FiUser className="text-purple-600" />
                          <p className="text-[10px] uppercase font-bold text-slate-400">Uploaded By</p>
                        </div>
                        <p className="font-bold text-slate-900">{viewResource.uploadedBy || 'System'}</p>
                      </div>
                      
                      <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                          <FiCalendar className="text-amber-600" />
                          <p className="text-[10px] uppercase font-bold text-slate-400">Upload Date</p>
                        </div>
                        <p className="font-bold text-slate-900">{formatDate(viewResource.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Tags & Stats Grid */}
                <section className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Type Badge */}
                    <div className="p-4 bg-blue-50 rounded-3xl border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <FiFile className="text-blue-600" />
                        <p className="text-[10px] uppercase font-bold text-blue-400">Type</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getFileIcon(viewResource.fileName, 'text-blue-600 text-lg')}
                        <span className="font-bold text-blue-800">
                          {viewResource.type || 'document'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Category Badge */}
                    <div className="p-4 bg-emerald-50 rounded-3xl border border-emerald-100">
                      <div className="flex items-center gap-2 mb-2">
                        <FiBook className="text-emerald-600" />
                        <p className="text-[10px] uppercase font-bold text-emerald-400">Category</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiBook className="text-emerald-600" />
                        <span className="font-bold text-emerald-800">{viewResource.category}</span>
                      </div>
                    </div>
                    
                    {/* Access Level Badge */}
                    <div className="p-4 bg-purple-50 rounded-3xl border border-purple-100">
                      <div className="flex items-center gap-2 mb-2">
                        <FiShield className="text-purple-600" />
                        <p className="text-[10px] uppercase font-bold text-purple-400">Access Level</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiShield className="text-purple-600" />
                        <span className="font-bold text-purple-800 capitalize">{viewResource.accessLevel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Downloads Counter */}
                  <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-3xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Total Downloads</p>
                        <p className="text-2xl font-black text-slate-900">{viewResource.downloads || 0}</p>
                      </div>
                      <div className="p-3 bg-white rounded-2xl">
                        <FiTrendingUp className="text-emerald-600 text-2xl" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Description Section */}
                <section className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Description</h3>
                  <div className="p-6 bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                      {viewResource.description || 'No description available for this resource.'}
                    </p>
                  </div>
                </section>
              </div>
            </div>

            {/* 3. Action Footer */}
            <div className="shrink-0 p-6 bg-slate-50/80 backdrop-blur-md border-t border-slate-100">
              <div className="max-w-2xl mx-auto flex gap-3">
                <button
                  onClick={() => {
                    downloadResource(viewResource);
                    setShowViewModal(false);
                  }}
                  className="flex-[2] h-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform hover:shadow-xl hover:shadow-blue-500/30"
                >
                  <FiDownload size={20} />
                  Download Resource
                </button>
                
                <button
                  onClick={() => setShowViewModal(false)}
                  className="flex-1 h-14 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <FiX size={20} />
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
                  <FiAlertCircle className="text-xl text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Confirm Deletion</h2>
                  <p className="text-red-100 opacity-90 mt-1 text-sm">This action cannot be undone</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3 border border-red-200">
                  <FiTrash2 className="text-red-600 text-lg" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">Delete "{resourceToDelete?.title}"?</h3>
                <p className="text-gray-600 text-sm">This will permanently delete the resource and all associated data.</p>
              </div>
            </div>

            <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
              <button 
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setResourceToDelete(null);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-sm"
              >
                <FiX /> Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-3 rounded-xl font-bold text-sm"
              >
                <FiTrash2 /> Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}