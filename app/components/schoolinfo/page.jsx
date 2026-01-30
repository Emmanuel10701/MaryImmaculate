'use client';
import { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'sonner';
// 1. Font Awesome Icons (Fa)
import { 
  FaSchool, FaEdit, FaTrash, FaPlus, FaChartBar,
  FaGraduationCap, FaVideo, FaMapMarkerAlt, FaPhone, 
  FaEnvelope, FaGlobe, FaClock, FaChevronRight, 
  FaChevronLeft, FaExclamationTriangle, FaCheckCircle, 
  FaTimesCircle, FaSave, FaTimes, FaEye, FaCalendar, 
  FaUsers, FaChalkboardTeacher, FaBook, FaRocket,
  FaArrowRight, FaBuilding, FaQuoteLeft, FaPlay,
  FaShieldAlt, FaAward, FaUserCheck, FaHourglassHalf,
  FaBookOpen, FaUsersCog, FaFileAlt, FaCalendarAlt,
  FaImage, FaList, FaFileMedical,
  FaCertificate, FaUserGraduate, FaUserTie,
  FaFlask, FaLaptopCode, FaSeedling, FaMusic,
  FaPalette, FaFutbol, FaLanguage, FaHistory,
  FaBusinessTime, FaHome, FaChurch, FaMosque,
  FaHandsHelping, FaCalculator, FaChartLine,
  FaUniversity, FaDoorOpen, FaDoorClosed,
  FaIdCard, FaStethoscope, FaSyringe, FaExchangeAlt, FaMoneyBill
} from 'react-icons/fa';

// 2. Feather Icons (Fi)
import { 
  FiUsers, FiBook, FiCalendar, FiFileText, FiTrendingDown, FiTrendingUp,
  FiEye, FiDownload, FiMail, FiUserPlus, FiArrowUpRight, FiStar,
  FiUser, FiImage as FiImageIcon, FiMessageCircle, FiX, FiPlay as FiPlayIcon,
  FiBarChart2, FiAward as FiAwardIcon, FiTarget, FiActivity, FiRefreshCw 
} from 'react-icons/fi';
import { CircularProgress, Modal, Box, TextareaAutosize } from '@mui/material';

// Modern Loading Spinner Component
function ModernLoadingSpinner({ message = "Loading school information...", size = "medium" }) {
  const sizes = {
    small: { outer: 48, inner: 24 },
    medium: { outer: 64, inner: 32 },
    large: { outer: 80, inner: 40 }
  };

  const { outer, inner } = sizes[size];

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
          <span className="block text-lg font-bold text-gray-800">
            {message}
          </span>
          
          <div className="flex justify-center space-x-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" 
                   style={{ animationDelay: `${i * 0.15}s` }}></div>
            ))}
          </div>
          
          <p className="text-gray-500 text-sm mt-2">
            Please wait while we fetch school information
          </p>
        </div>
      </div>
    </div>
  );
}

// Tag Input Component
function TagInput({ label, tags, onTagsChange, placeholder = "Type and press Enter..." }) {
  const [inputValue, setInputValue] = useState('');

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTags = [...tags, inputValue.trim()];
      onTagsChange(newTags);
      setInputValue('');
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    onTagsChange(newTags);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-sm font-bold"
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
          Press Enter to add
        </span>
      </div>
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-3 py-2 rounded-lg border border-blue-200 text-sm font-bold"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(index)}
                className="ml-1 text-blue-500 hover:text-blue-700 transition-colors"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Modern Video Upload Component
function ModernVideoUpload({ 
  videoType, 
  videoPath, 
  youtubeLink, 
  onVideoChange, 
  onYoutubeLinkChange, 
  onRemove, 
  onThumbnailSelect, 
  label = "School Video Tour",
  existingVideo = null
}) {
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [localYoutubeLink, setLocalYoutubeLink] = useState(youtubeLink || '');
  const [customThumbnail, setCustomThumbnail] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  
  const allowedVideoTypes = [
    'video/mp4', 'video/x-m4v', 'video/quicktime',
    'video/webm', 'video/ogg'
  ];
  
  const allowedImageTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'
  ];

  const isValidYouTubeUrl = (url) => {
    if (!url || url.trim() === '') return false;
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(url.trim());
  };

  const showToast = (message, type = 'success') => {
    toast[type](message, {
      duration: 5000,
    });
  };

  const handleYoutubeLinkChange = (e) => {
    const url = e.target.value;
    setLocalYoutubeLink(url);
    
    if (onYoutubeLinkChange) {
      onYoutubeLinkChange(url);
    }
    
    if (url.trim() !== '') {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
      setVideoPreview(null);
      setCustomThumbnail(null);
      if (onVideoChange) {
        onVideoChange(null);
      }
      if (onThumbnailSelect) {
        onThumbnailSelect(null);
      }
    }
  };

  const handleVideoFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const file = files[0];
    setIsProcessing(true);

    // Remove strict size rejection — we still warn for extremely large files but will keep here.
    const MAX_VIDEO_SIZE = 12 * 1024 * 1024; // allow larger uploads; backend still validates
    if (file.size > MAX_VIDEO_SIZE) {
      showToast('Video file is large. It will be uploaded but consider compressing.', 'warning');
    }

    // Validate basic mime types
    const allowedVideoTypes = ['video/mp4', 'video/x-m4v', 'video/quicktime', 'video/webm', 'video/ogg'];
    if (!allowedVideoTypes.includes(file.type)) {
      showToast('Invalid video format! Allowed: MP4, MOV, M4V, WebM, OGG', 'error');
      setIsProcessing(false);
      return;
    }

    setUploadProgress(0);
    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);

    // Progress simulation
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 20;
      });
    }, 200);

    try {
      if (onVideoChange) onVideoChange(file);

      // auto-generate thumbnail if none selected
      if (!customThumbnail && onThumbnailSelect) {
        try {
          const thumbFile = await generateThumbnailFromVideoFile(file, 1280, 720, 0.85);
          if (thumbFile) {
            setCustomThumbnail(URL.createObjectURL(thumbFile));
            onThumbnailSelect(thumbFile);
            showToast('Generated thumbnail from video', 'success');
          }
        } catch (genErr) {
          console.warn('Failed to generate thumbnail:', genErr);
        }
      }

      setLocalYoutubeLink('');
      if (onYoutubeLinkChange) onYoutubeLinkChange('');
      showToast('Video ready', 'success');

    } catch (error) {
      console.error('Video processing error:', error);
      showToast('Failed to process video file', 'error');
      setVideoPreview(null);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setUploadProgress(0);
        setIsProcessing(false);
      }, 500);
    }
  };

  const handleThumbnailUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const file = files[0];

    // Automatically resize/normalize thumbnails (remove strict size requirement)
    try {
      const resized = await resizeImageFile(file, 1280, 720, 0.88);
      setCustomThumbnail(URL.createObjectURL(resized));
      if (onThumbnailSelect) onThumbnailSelect(resized);
      showToast('Thumbnail uploaded and resized', 'success');
    } catch (err) {
      console.error('Thumbnail resize error:', err);
      showToast('Failed to process thumbnail', 'error');
    }
  };

  const handleRemoveThumbnail = () => {
    if (customThumbnail) {
      URL.revokeObjectURL(customThumbnail);
    }
    setCustomThumbnail(null);
    
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = '';
    }
    
    if (onThumbnailSelect) {
      onThumbnailSelect(null);
    }
    
    showToast('Thumbnail removed', 'warning');
  };

  const handleRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = '';
    }
    
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    if (customThumbnail) {
      URL.revokeObjectURL(customThumbnail);
    }
    
    setVideoPreview(null);
    setCustomThumbnail(null);
    setLocalYoutubeLink('');
    
    if (onRemove) {
      onRemove();
    }
    
    if (onYoutubeLinkChange) {
      onYoutubeLinkChange('');
    }
    
    if (onThumbnailSelect) {
      onThumbnailSelect(null);
    }
    
    showToast('Video removed successfully!', 'success');
  };

  const getYouTubeThumbnail = (url) => {
    if (!url) return null;
    
    const patterns = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
      }
    }
    return null;
  };

  const existingThumbnail = videoType === 'youtube' && videoPath 
    ? getYouTubeThumbnail(videoPath) 
    : null;

  const displayThumbnail = customThumbnail || existingThumbnail;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-lg font-bold text-gray-900 flex items-center gap-3">
          <FaVideo className="text-purple-600 text-xl" />
          <span className="text-xl">{label}</span>
        </label>
        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Max 4.25MB
        </span>
      </div>
      
      <div className="space-y-6">
        {/* YouTube URL Section */}
        <div>
          <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
            YouTube URL
          </label>
          <div className="relative">
            <FaVideo className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-600 text-base" />
            <input
              type="url"
              value={localYoutubeLink}
              onChange={handleYoutubeLinkChange}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-purple-500 focus:border-purple-600 transition-all duration-300 bg-white text-base font-bold placeholder-gray-400"
            />
          </div>
          {localYoutubeLink && !isValidYouTubeUrl(localYoutubeLink) && (
            <p className="text-red-600 text-sm mt-2 font-bold italic flex items-center gap-2">
              <FaExclamationTriangle className="text-sm" />
              Please enter a valid YouTube URL
            </p>
          )}
        </div>

        {/* OR Separator */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 text-sm font-bold">OR</span>
          </div>
        </div>

        {/* Video and Thumbnail in Flex Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Upload Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaVideo className="text-blue-600" />
              Upload Video
            </h3>
            
            <div
              className={`border-3 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer group ${
                dragOver 
                  ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-100' 
                  : 'border-gray-300 hover:border-blue-400 bg-gray-50/50'
              } ${localYoutubeLink ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onDrop={!localYoutubeLink ? (e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  const file = e.dataTransfer.files[0];
                  handleVideoFileChange({ target: { files: [file] } });
                }
              } : undefined}
              onDragOver={!localYoutubeLink ? (e) => { 
                e.preventDefault(); 
                e.stopPropagation(); 
                setDragOver(true); 
              } : undefined}
              onDragLeave={!localYoutubeLink ? () => setDragOver(false) : undefined}
              onClick={!localYoutubeLink ? () => fileInputRef.current?.click() : undefined}
            >
              <div className="relative">
                <FaVideo className={`mx-auto text-4xl mb-4 transition-all duration-300 ${
                  dragOver ? 'text-blue-600 scale-110' : 'text-gray-500 group-hover:text-blue-500'
                }`} />
              </div>
              <p className="text-gray-800 mb-2 font-bold">
                {localYoutubeLink ? 'YouTube link selected' : dragOver ? 'Drop Video Now' : 'Click to Upload Video'}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                MP4, MOV, M4V, WebM, OGG (Max 4.25MB)
              </p>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="video/mp4,video/x-m4v,video/*,video/quicktime,video/webm,video/ogg" 
                onChange={handleVideoFileChange} 
                className="hidden" 
                disabled={localYoutubeLink || isProcessing}
              />
            </div>
            
            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span>{isProcessing ? 'Processing...' : 'Uploading...'}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Video Preview */}
            {videoPreview && (
              <div className="mt-4">
                <p className="text-sm font-bold text-gray-700 mb-2">Video Preview:</p>
                <video 
                  src={videoPreview} 
                  className="w-full rounded-lg max-h-48 object-contain"
                  controls
                />
              </div>
            )}
          </div>

          {/* Thumbnail Upload Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FaImage className="text-purple-600" />
                Video Thumbnail
              </h3>
              {displayThumbnail && (
                <button
                  type="button"
                  onClick={handleRemoveThumbnail}
                  className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1"
                >
                  <FaTrash className="text-xs" /> Remove
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              {/* Thumbnail Preview */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 min-h-[200px] flex flex-col items-center justify-center">
                {displayThumbnail ? (
                  <>
                    <img 
                      src={displayThumbnail} 
                      alt="Thumbnail Preview" 
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <p className="text-sm font-bold text-gray-700">
                      {customThumbnail ? 'Custom Thumbnail' : 'YouTube Thumbnail'}
                    </p>
                  </>
                ) : (
                  <>
                    <FaImage className="text-gray-400 text-4xl mb-4" />
                    <p className="text-gray-600 font-bold mb-2">No thumbnail available</p>
                    <p className="text-sm text-gray-500 text-center">
                      Upload a custom image or use YouTube thumbnail
                    </p>
                  </>
                )}
              </div>
              
              {/* Upload Custom Thumbnail Button */}
              <button
                type="button"
                onClick={() => thumbnailInputRef.current?.click()}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 rounded-xl hover:from-purple-600 hover:to-blue-700 transition-all duration-300 font-bold flex items-center justify-center gap-2"
              >
                <FaEdit className="text-sm" />
                <span>Upload Thumbnail</span>
              </button>
              
              <input 
                ref={thumbnailInputRef}
                type="file" 
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" 
                onChange={handleThumbnailUpload}
                className="hidden"
              />
              
              <div className="text-xs text-gray-500">
                <p className="font-bold mb-1">Recommended:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Size: 1280x720 pixels (16:9 ratio)</li>
                  <li>Max file size: 2MB</li>
                  <li>Formats: JPG, PNG, GIF, WebP</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Remove Button */}
        {(videoPreview || localYoutubeLink) && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleRemove}
              className="px-6 py-3 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-xl transition-colors font-bold"
            >
              <FaTrash className="inline mr-2" />
              Remove Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Video Modal Component - FIXED
function VideoModal({ open, onClose, videoType, videoPath, thumbnail }) {
  const extractYouTubeId = (url) => {
    if (!url) return null;
    
    const patterns = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  // ✅ CRITICAL FIX: Always return valid JSX, never undefined
  if (!open || !videoPath) {
    return null;  // ✅ Explicitly return null instead of undefined
  }

  const youtubeId = videoType === 'youtube' ? extractYouTubeId(videoPath) : null;

  // ✅ CRITICAL FIX: Validate video type before rendering
  const isValidVideo = (videoType === 'youtube' && youtubeId) || (videoType === 'file' && videoPath);

  if (!isValidVideo) {
    return null;  // ✅ Return null for invalid videos
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-6xl bg-black rounded-xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black bg-opacity-70 text-white rounded-full w-10 h-10 flex items-center justify-center z-10 hover:bg-opacity-100 transition"
        >
          ✕
        </button>
        
        {/* YouTube Video */}
        {videoType === 'youtube' && youtubeId && (
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="School Video Tour"
            />
          </div>
        )}
        
        {/* File Video */}
        {videoType === 'file' && videoPath && (
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <video
              controls
              autoPlay
              className="absolute top-0 left-0 w-full h-full"
              src={videoPath}
              poster={thumbnail}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Modern Delete Confirmation Modal
function ModernDeleteModal({ onClose, onConfirm, loading }) {
  const [confirmText, setConfirmText] = useState('');

  const handleConfirm = () => {
    if (confirmText === "DELETE SCHOOL INFO") {
      onConfirm();
    } else {
      toast.error('Please type "DELETE SCHOOL INFO" exactly to confirm deletion');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-xl">
              <FaExclamationTriangle className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Confirm Deletion</h2>
              <p className="text-red-100 opacity-90 text-xs mt-0.5">This action cannot be undone</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="text-center">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2 border border-red-200">
              <FaTrash className="text-red-600" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Delete All School Information?</h3>
            <p className="text-gray-600 text-xs">This will permanently delete ALL school information.</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
              Type <span className="font-mono text-red-600 bg-red-50 px-2 py-0.5 rounded text-xs">"DELETE SCHOOL INFO"</span> to confirm:
            </label>
            <input 
              type="text" 
              value={confirmText} 
              onChange={(e) => setConfirmText(e.target.value)} 
              placeholder='Type "DELETE SCHOOL INFO" here'
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 text-sm font-bold"
            />
          </div>
        </div>

        <div className="flex gap-2 p-3 border-t border-gray-200 bg-gray-50">
          <button 
            onClick={onClose} 
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg transition-all duration-300 font-bold disabled:opacity-50 cursor-pointer text-sm"
          >
            <FaTimesCircle className="text-sm" /> Cancel
          </button>
          <button 
            onClick={handleConfirm} 
            disabled={loading || confirmText !== "DELETE SCHOOL INFO"}
            className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-3 rounded-lg transition-all duration-300 font-bold shadow disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
          >
            {loading ? (
              <>
                <CircularProgress size={12} className="text-white" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <FaTrash /> Delete Forever
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// School Info Modal Component - DYNAMIC
function ModernSchoolModal({ onClose, onSave, school, loading: parentLoading }) {
  const isUpdateMode = !!school && school.id;
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(() => ({
    name: school?.name || '',
    description: school?.description || '',
    motto: school?.motto || '',
    vision: school?.vision || '',
    mission: school?.mission || '',
    studentCount: school?.studentCount?.toString() || '',
    staffCount: school?.staffCount?.toString() || '',
    
    // Fee fields
    feesDay: school?.feesDay?.toString() || '',
    feesBoarding: school?.feesBoarding?.toString() || '',
    admissionFee: school?.admissionFee?.toString() || '',
    
    openDate: school?.openDate ? new Date(school.openDate).toISOString().split('T')[0] : '',
    closeDate: school?.closeDate ? new Date(school.closeDate).toISOString().split('T')[0] : '',
    subjects: school?.subjects || [],
    departments: school?.departments || [],
    youtubeLink: school?.videoType === 'youtube' ? school.videoTour : '',
    admissionOpenDate: school?.admissionOpenDate ? new Date(school.admissionOpenDate).toISOString().split('T')[0] : '',
    admissionCloseDate: school?.admissionCloseDate ? new Date(school.admissionCloseDate).toISOString().split('T')[0] : '',
    admissionRequirements: school?.admissionRequirements || '',
    admissionCapacity: school?.admissionCapacity?.toString() || '',
    admissionContactEmail: school?.admissionContactEmail || '',
    admissionContactPhone: school?.admissionContactPhone || '',
    admissionWebsite: school?.admissionWebsite || '',
    admissionLocation: school?.admissionLocation || '',
    admissionOfficeHours: school?.admissionOfficeHours || '',
    admissionDocumentsRequired: school?.admissionDocumentsRequired || []
  }));

  const [videoFile, setVideoFile] = useState(null);
  const [videoThumbnail, setVideoThumbnail] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const steps = [
    { id: 'basic', label: 'Basic Info', icon: FaBuilding },
    { id: 'academic', label: 'Academic', icon: FaGraduationCap },
    { id: 'admission', label: 'Admission', icon: FaUserCheck }
  ];

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setActionLoading(true);
      
      const formDataObj = new FormData();
      
      // Add form data - arrays stringified
      Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key])) {
          formDataObj.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] !== null && formData[key] !== undefined) {
          // Add other values
          formDataObj.append(key, formData[key]);
        }
      });
      
      // Add video file if present
      if (videoFile) {
        // Ensure it's a proper File object
        let videoToUpload = videoFile;
        if (videoFile instanceof Blob && !(videoFile instanceof File)) {
          videoToUpload = new File([videoFile], 'video.mp4', { 
            type: videoFile.type || 'video/mp4',
            lastModified: Date.now()
          });
        }
        formDataObj.append('videoTour', videoToUpload);
      }
      
      // Add thumbnail if present
      if (videoThumbnail) {
        let thumbnailToUpload = videoThumbnail;
        if (videoThumbnail instanceof Blob && !(videoThumbnail instanceof File)) {
          thumbnailToUpload = new File([videoThumbnail], 'thumbnail.jpg', { 
            type: videoThumbnail.type || 'image/jpeg',
            lastModified: Date.now()
          });
        }
        formDataObj.append('videoThumbnail', thumbnailToUpload);
      }
      
      // ✅ DYNAMIC METHOD SELECTION: POST for CREATE, PUT for UPDATE
      const method = isUpdateMode ? 'PUT' : 'POST';
      const endpoint = '/api/school';
      
      console.log(`Submitting school data with ${method} method`, {
        isUpdateMode,
        hasSchoolId: school?.id,
        hasVideoFile: !!videoFile,
        hasThumbnail: !!videoThumbnail,
        formData: Object.fromEntries(formDataObj.entries())
      });
      
      const response = await fetch(endpoint, {
        method: method,
        body: formDataObj
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        // Handle API-specific errors
        if (response.status === 409 && method === 'POST') {
          throw new Error('School already exists. Please use Edit instead.');
        }
        if (response.status === 404 && method === 'PUT') {
          throw new Error('School not found. Please create school first.');
        }
        throw new Error(responseData.error || `Failed to ${isUpdateMode ? 'update' : 'create'} school information`);
      }

      toast.success(responseData.message || (isUpdateMode ? 'School updated successfully!' : 'School created successfully!'));
      
      // Call onSave with the updated/created school data
      if (responseData.school) {
        onSave(responseData.school);
      }
      
      onClose();
      
    } catch (error) {
      console.error('Save failed:', error);
      toast.error(error.message || `Failed to ${isUpdateMode ? 'update' : 'create'} school information`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = (e) => {
    e.preventDefault();
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagsChange = (field, tags) => {
    setFormData(prev => ({ ...prev, [field]: tags }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.name.trim() && formData.studentCount.trim() && formData.staffCount.trim();
      case 1:
        return formData.openDate.trim() && formData.closeDate.trim();
      case 2:
        return true;
      default:
        return true;
    }
  };

  // Clear video and thumbnail when YouTube link is entered
  useEffect(() => {
    if (formData.youtubeLink && formData.youtubeLink.trim() !== '') {
      setVideoFile(null);
      setVideoThumbnail(null);
    }
  }, [formData.youtubeLink]);

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '95vw',
        maxWidth: '1200px',
        maxHeight: '95vh',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
        {/* DYNAMIC HEADER - Green for CREATE, Blue for UPDATE */}
        <div className={`p-4 text-white ${isUpdateMode ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700' : 'bg-gradient-to-r from-green-600 via-emerald-700 to-teal-700'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <FaSchool className="text-lg" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold">
                  {isUpdateMode ? 'Update School Information' : 'Create School Information'}
                </h2>
                <p className="text-blue-100 opacity-90 text-xs mt-0.5">
                  {isUpdateMode ? 'Modify existing school details' : 'Set up your school profile for the first time'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition">
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="bg-white border-b border-gray-200 p-3">
          <div className="flex flex-wrap justify-center items-center gap-2 md:space-x-3">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(index)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 text-sm font-bold ${
                    index === currentStep 
                      ? isUpdateMode 
                        ? 'bg-blue-500 text-white shadow-lg' 
                        : 'bg-green-500 text-white shadow-lg'
                      : index < currentStep
                      ? isUpdateMode
                        ? 'bg-blue-400 text-white'
                        : 'bg-green-400 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <step.icon className="text-xs" />
                  <span className="font-bold">{step.label}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className={`w-4 h-0.5 mx-1.5 md:w-6 ${
                    index < currentStep 
                      ? isUpdateMode ? 'bg-blue-400' : 'bg-green-400'
                      : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="max-h-[calc(95vh-160px)] overflow-y-auto p-4 md:p-6">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border border-blue-200">
                      <label className=" text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FaBuilding className="text-blue-600" /> School Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Enter school name..."
                        className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base font-bold placeholder-gray-500"
                        required
                      />
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5 border border-green-200">
                      <label className=" text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FaUsers className="text-green-600" /> Student Count <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.studentCount}
                        onChange={(e) => handleChange('studentCount', e.target.value)}
                        placeholder="Enter number of students..."
                        className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-base font-bold placeholder-gray-500"
                        required
                      />
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-5 border border-orange-200">
                      <label className=" text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FaChalkboardTeacher className="text-orange-600" /> Staff Count <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.staffCount}
                        onChange={(e) => handleChange('staffCount', e.target.value)}
                        placeholder="Enter number of staff..."
                        className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-base font-bold placeholder-gray-500"
                        required
                      />
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-5 border border-emerald-200">
                      <label className=" text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FaRocket className="text-emerald-600" /> Mission Statement
                      </label>
                      <TextareaAutosize
                        minRows={3}
                        value={formData.mission}
                        onChange={(e) => handleChange('mission', e.target.value)}
                        placeholder="Enter mission statement..."
                        className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none bg-white text-base font-bold placeholder-gray-500"
                      />
                    </div>

                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5 border border-purple-200">
                      <label className=" text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FaQuoteLeft className="text-purple-600" /> School Motto
                      </label>
                      <input
                        type="text"
                        value={formData.motto}
                        onChange={(e) => handleChange('motto', e.target.value)}
                        placeholder="Enter school motto..."
                        className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-base font-bold placeholder-gray-500"
                      />
                    </div>
                    
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-5 border border-indigo-200">
                      <label className=" text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FaEye className="text-indigo-600" /> Vision Statement
                      </label>
                      <TextareaAutosize
                        minRows={3}
                        value={formData.vision}
                        onChange={(e) => handleChange('vision', e.target.value)}
                        placeholder="Enter vision statement..."
                        className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none bg-white text-base font-bold placeholder-gray-500"
                      />
                    </div>
                    
               

                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200">
                  <label className=" text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FaFileAlt className="text-gray-600" /> School Description
                  </label>
                  <TextareaAutosize
                    minRows={4}
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Describe your school..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-none bg-white text-base font-bold placeholder-gray-500"
                  />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border border-blue-200">
                      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FaCalendar className="text-blue-600" />
                        Academic Calendar
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Opening Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={formData.openDate}
                            onChange={(e) => handleChange('openDate', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base font-bold"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Closing Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={formData.closeDate}
                            onChange={(e) => handleChange('closeDate', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base font-bold"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5 border border-purple-200">
                      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FaBook className="text-purple-600" />
                        Academic Programs
                      </h3>
                      
                      <div className="space-y-4">
                        <TagInput 
                          label="Subjects"
                          tags={formData.subjects}
                          onTagsChange={(tags) => handleTagsChange('subjects', tags)}
                          placeholder="Type subject and press Enter..."
                        />
                        
                        <TagInput 
                          label="Departments"
                          tags={formData.departments}
                          onTagsChange={(tags) => handleTagsChange('departments', tags)}
                          placeholder="Type department and press Enter..."
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <ModernVideoUpload 
                      videoType={school?.videoType}
                      videoPath={school?.videoTour}
                      youtubeLink={formData.youtubeLink}
                      onVideoChange={setVideoFile}
                      onYoutubeLinkChange={(link) => handleChange('youtubeLink', link)}
                      onThumbnailSelect={setVideoThumbnail}
                      onRemove={() => {
                        setVideoFile(null);
                        setVideoThumbnail(null);
                        handleChange('youtubeLink', '');
                      }}
                      existingVideo={school?.videoTour}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border border-blue-200">
                      <label className=" text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FaCalendarAlt className="text-blue-600" /> Admission Opening Date
                      </label>
                      <input
                        type="date"
                        value={formData.admissionOpenDate}
                        onChange={(e) => handleChange('admissionOpenDate', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base font-bold"
                      />
                    </div>
                    
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-5 border border-red-200">
                      <label className=" text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FaHourglassHalf className="text-red-600" /> Admission Closing Date
                      </label>
                      <input
                        type="date"
                        value={formData.admissionCloseDate}
                        onChange={(e) => handleChange('admissionCloseDate', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-base font-bold"
                      />
                    </div>
                    
                    <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-5 border border-cyan-200">
                      <label className=" text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FaUsers className="text-cyan-600" /> Admission Capacity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.admissionCapacity}
                        onChange={(e) => handleChange('admissionCapacity', e.target.value)}
                        placeholder="Number of available slots"
                        className="w-full px-4 py-3 border-2 border-cyan-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-base font-bold placeholder-gray-500"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-5 border border-indigo-200">
                      <label className=" text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FaEnvelope className="text-indigo-600" /> Admission Contact Email
                      </label>
                      <input
                        type="email"
                        value={formData.admissionContactEmail}
                        onChange={(e) => handleChange('admissionContactEmail', e.target.value)}
                        placeholder="admissions@school.edu"
                        className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-base font-bold placeholder-gray-500"
                      />
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5 border border-purple-200">
                      <label className=" text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FaPhone className="text-purple-600" /> Admission Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.admissionContactPhone}
                        onChange={(e) => handleChange('admissionContactPhone', e.target.value)}
                        placeholder="+254 XXX XXX XXX"
                        className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-base font-bold placeholder-gray-500"
                      />
                    </div>
                    
                    <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-5 border border-teal-200">
                      <label className=" text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FaGlobe className="text-teal-600" /> Admission Website
                      </label>
                      <input
                        type="url"
                        value={formData.admissionWebsite}
                        onChange={(e) => handleChange('admissionWebsite', e.target.value)}
                        placeholder="https://school.edu/admissions"
                        className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white text-base font-bold placeholder-gray-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-5 border border-orange-200">
                    <label className=" text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-orange-600" /> Admission Location
                    </label>
                    <input
                      type="text"
                      value={formData.admissionLocation}
                      onChange={(e) => handleChange('admissionLocation', e.target.value)}
                      placeholder="Admission office location"
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-base font-bold placeholder-gray-500"
                    />
                  </div>
                  
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-5 border border-pink-200">
                    <label className=" text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <FaClock className="text-pink-600" /> Admission Office Hours
                    </label>
                    <input
                      type="text"
                      value={formData.admissionOfficeHours}
                      onChange={(e) => handleChange('admissionOfficeHours', e.target.value)}
                      placeholder="e.g., 8:00 AM - 5:00 PM"
                      className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-base font-bold placeholder-gray-500"
                    />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-5 border border-yellow-200">
                  <TagInput 
                    label="Required Documents for Admission"
                    tags={formData.admissionDocumentsRequired}
                    onTagsChange={(tags) => handleTagsChange('admissionDocumentsRequired', tags)}
                    placeholder="Type document name and press Enter..."
                  />
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200">
                  <label className=" text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FaFileAlt className="text-gray-600" /> Admission Requirements
                  </label>
                  <TextareaAutosize
                    minRows={4}
                    value={formData.admissionRequirements}
                    onChange={(e) => handleChange('admissionRequirements', e.target.value)}
                    placeholder="Describe admission requirements..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-none bg-white text-base font-bold placeholder-gray-500"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-200 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 font-bold">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${isUpdateMode ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                  <span className="font-bold">Step {currentStep + 1} of {steps.length}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {currentStep > 0 && (
                  <button 
                    type="button"
                    onClick={handlePrevStep}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition duration-200 font-bold disabled:opacity-50 cursor-pointer text-base w-full sm:w-auto"
                  >
                    ← Previous
                  </button>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <button 
                    type="button"
                    onClick={handleNextStep}
                    disabled={!isStepValid()}
                    className={`px-8 py-3 rounded-xl transition duration-200 font-bold shadow disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-base w-full sm:w-auto ${
                      isUpdateMode 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                    }`}
                  >
                    Continue →
                  </button>
                ) : (
                  // ✅ DYNAMIC SUBMIT BUTTON - Changes based on mode
                  <button 
                    type="submit"
                    disabled={actionLoading || !isStepValid()}
                    className={`px-8 py-3 rounded-xl transition duration-200 font-bold shadow disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-base w-full sm:w-auto ${
                      isUpdateMode 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                        : 'bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700'
                    }`}
                  >
                    {actionLoading ? (
                      <>
                        <CircularProgress size={16} className="text-white" />
                        <span>{isUpdateMode ? 'Updating...' : 'Creating...'}</span>
                      </>
                    ) : (
                      <>
                        <FaSave className="text-sm" />
                        <span>{isUpdateMode ? 'Update School Info' : 'Create School Info'}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
}

// StatCard Component
const StatCard = ({ icon: Icon, label, value, change, color, subtitle, trend }) => {
  const isPositive = trend === 'up' || (change && change > 0);
  
  const colorMap = {
    blue: 'from-blue-500/10 to-blue-500/5 text-blue-600 border-blue-100',
    green: 'from-emerald-500/10 to-emerald-500/5 text-emerald-600 border-emerald-100',
    red: 'from-rose-500/10 to-rose-500/5 text-rose-600 border-rose-100',
    purple: 'from-purple-500/10 to-purple-500/5 text-purple-600 border-purple-100',
    orange: 'from-orange-500/10 to-orange-500/5 text-orange-600 border-orange-100',
    yellow: 'from-yellow-500/10 to-yellow-500/5 text-yellow-600 border-yellow-100',
    indigo: 'from-indigo-500/10 to-indigo-500/5 text-indigo-600 border-indigo-100',
    teal: 'from-teal-500/10 to-teal-500/5 text-teal-600 border-teal-100'
  };
  
  const selectedColor = colorMap[color] || colorMap.blue;
  
  // ✅ FIX: Safely convert value to number
  const displayValue = typeof value === 'number' ? value : (Number(value) || 0);
  const displayChange = typeof change === 'number' ? change : (Number(change) || 0);
  
  return (
    <div className="group relative bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] overflow-hidden">
      
      {/* Background Decorative Glow */}
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${selectedColor} blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`} />
      
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-3">
          {/* Label Section */}
          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">
              {label}
            </span>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
              {displayValue.toLocaleString()}
            </h3>
          </div>
          
          {/* Change & Subtitle Section */}
          <div className="flex flex-col gap-1.5">
            {displayChange !== 0 && (
              <div className={`inline-flex items-center w-fit gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                isPositive 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                  : 'bg-rose-50 text-rose-600 border-rose-100'
              }`}>
                {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
                <span>{displayChange > 0 ? '+' : ''}{displayChange}%</span>
              </div>
            )}
            
            {subtitle && (
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                {subtitle}
              </span>
            )}
          </div>
        </div>
        
        {/* Modern Icon Container */}
        <div className={`p-4 rounded-2xl bg-gradient-to-br border shadow-sm ${selectedColor}`}>
          <Icon className="text-2xl" />
        </div>
      </div>
    </div>
  );
};

export default function SchoolInfoPage() {
  const [schoolInfo, setSchoolInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSchoolInfo();
  }, []);

  const loadSchoolInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/school');
      if (!response.ok) throw new Error('Failed to fetch school information');
      const data = await response.json();
      
      // ✅ CRITICAL: Properly handle school data - use school property from API
      setSchoolInfo(data.school || null);
      
      console.log('School data loaded:', data.school ? 'Exists' : 'No school data');
    } catch (error) {
      console.error('Error loading school info:', error);
      setSchoolInfo(null);
    } finally {
      setLoading(false);
    }
  };

  // Function to check if school info exists - check for ID and required fields
  const hasSchoolInfo = schoolInfo && (
    schoolInfo.id ||
    schoolInfo.name ||
    schoolInfo.description ||
    schoolInfo.studentCount ||
    schoolInfo.staffCount
  );

  const handleSaveSchool = async (schoolData) => {
    try {
      // Update local state with new school data
      setSchoolInfo(schoolData);
      
      // Refresh data from server to ensure consistency
      await loadSchoolInfo();
      
      toast.success('School information saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save school information');
    }
  };

  const handleDeleteSchool = async () => {
    try {
      const response = await fetch('/api/school', { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete');
      }
      setSchoolInfo(null);
      setShowDeleteModal(false);
      toast.success('School information deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete school information!');
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return 'Not set';
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get subject icons mapping
  const getSubjectIcon = (subject) => {
    const subjectIcons = {
      'Mathematics': FaCalculator,
      'English': FaLanguage,
      'Kiswahili': FaLanguage,
      'Biology': FaFlask,
      'Chemistry': FaFlask,
      'Physics': FaFlask,
      'Geography': FaMapMarkerAlt,
      'History': FaHistory,
      'CRE': FaChurch,
      'IRE': FaMosque,
      'HRE': FaHandsHelping,
      'Business Studies': FaBusinessTime,
      'Computer Studies': FaLaptopCode,
      'Agriculture': FaSeedling,
      'Home Science': FaHome,
      'French': FaLanguage,
      'Music': FaMusic,
      'Art & Design': FaPalette,
      'Physical Education': FaFutbol
    };

    for (const [key, icon] of Object.entries(subjectIcons)) {
      if (subject.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }
    return FaBookOpen;
  };

  // Get department icons mapping
  const getDepartmentIcon = (department) => {
    const departmentIcons = {
      'Mathematics': FaCalculator,
      'Languages': FaLanguage,
      'Sciences': FaFlask,
      'Humanities': FaBook,
      'Technical': FaLaptopCode,
      'Administration': FaUsersCog,
      'Guidance': FaHandsHelping
    };

    for (const [key, icon] of Object.entries(departmentIcons)) {
      if (department.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }
    return FaUsersCog;
  };

  // Get document icons mapping
  const getDocumentIcon = (document) => {
    const documentIcons = {
      'Birth Certificate': FaIdCard,
      'Result Slip': FaFileAlt,
      'Photos': FaImage,
      'Medical': FaStethoscope,
      'Transfer': FaExchangeAlt,
      'Reports': FaChartLine,
      'National ID': FaIdCard,
      'Immunization': FaSyringe,
      'Certificate': FaCertificate
    };

    for (const [key, icon] of Object.entries(documentIcons)) {
      if (document.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }
    return FaFileAlt;
  };

  if (loading && !schoolInfo) {
    return <ModernLoadingSpinner message="Loading school information..." size="medium" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 md:p-6">
      <Toaster position="top-right" richColors />

      {/* MODERN HEADER */}
      <div className="relative bg-gradient-to-br from-[#1e40af] via-[#7c3aed] to-[#2563eb] rounded-[2.5rem] shadow-[0_20px_50px_rgba(31,38,135,0.37)] p-6 md:p-10 mb-10 border border-white/20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-5%] w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md ring-1 ring-white/40 shadow-inner group transition-all duration-500 hover:bg-white/20">
                <FaSchool className="text-white text-3xl group-hover:scale-100 transition-transform" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md border border-emerald-400/30 backdrop-blur-md">
                    School Management
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter drop-shadow-sm">
                  School Information
                </h1>
              </div>
            </div>
            
            <p className="text-blue-50/80 text-sm md:text-lg font-bold max-w-2xl leading-relaxed">
              {hasSchoolInfo ? 'Manage your school profile and information' : 'Set up your school information to get started'}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full xl:w-auto bg-white/10 backdrop-blur-lg sm:bg-transparent p-4 sm:p-0 rounded-[2rem] sm:rounded-none shadow-lg sm:shadow-none border border-white/20 sm:border-none">
            
            <button 
              onClick={loadSchoolInfo} 
              disabled={refreshing}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white text-blue-600 px-6 py-3 sm:py-2.5 rounded-xl hover:bg-white/90 transition-all duration-200 font-bold text-sm shadow-lg active:scale-[0.98] disabled:opacity-60"
            >
              {refreshing ? (
                <CircularProgress size={16} color="inherit" thickness={6} />
              ) : (
                <FaChartBar className="text-sm" /> 
              )}
              <span className="whitespace-nowrap font-bold">
                {refreshing ? 'Syncing...' : 'Refresh'}
              </span>
            </button>
            
            {hasSchoolInfo && (
              <button 
                onClick={() => setShowDeleteModal(true)} 
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/30 px-6 py-3 sm:py-2.5 rounded-xl hover:bg-white/20 transition-all duration-200 font-bold text-sm active:scale-[0.98]"
              >
                <FaTrash className="text-sm" /> 
                <span className="whitespace-nowrap font-bold">Delete</span>
              </button>
            )}
            
            {/* ✅ DYNAMIC MODAL BUTTON - "Add School Info" when none exists, "Edit School Info" when exists */}
            <button 
              onClick={() => setShowModal(true)} 
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-xl hover:bg-white/90 transition-all duration-200 font-bold text-sm shadow-lg active:scale-[0.98]"
            >
              {hasSchoolInfo ? (
                <>
                  <FaEdit className="text-sm" />
                  <span className="whitespace-nowrap font-bold">Edit School Info</span>
                </>
              ) : (
                <>
                  <FaPlus className="text-sm" />
                  <span className="whitespace-nowrap font-bold">Add School Info</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {!hasSchoolInfo ? (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-14 text-center my-8 transition-all duration-300">
          <div className="w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg shadow-blue-200/50">
            <FaSchool className="w-10 h-10 md:w-14 md:h-14 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600" />
          </div>

          <h3 className="text-xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight">
            No School Information Yet
          </h3>
          
          <p className="text-gray-500 text-sm md:text-lg mb-8 max-w-[280px] md:max-w-lg mx-auto font-medium leading-relaxed">
            Start by adding your school details to showcase your institution to students and staff.
          </p>

          <button 
            onClick={() => setShowModal(true)} 
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 
                     text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-blue-200/50
                     hover:shadow-indigo-300/50 hover:scale-[1.03] active:scale-95 
                     transition-all duration-300 flex items-center justify-center gap-3 mx-auto text-base"
          >
            <FaPlus className="text-xl" /> 
            <span>Create School Information</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* QUICK STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {schoolInfo?.studentCount !== undefined && schoolInfo?.studentCount !== null && (
              <StatCard 
                icon={FaUserGraduate} 
                label="Total Students" 
                value={schoolInfo.studentCount} 
                change={0}
                trend="up"
                color="green" 
                subtitle="Enrolled students" 
              />
            )}
            
            {schoolInfo?.staffCount !== undefined && schoolInfo?.staffCount !== null && (
              <StatCard 
                icon={FaUserTie} 
                label="Staff Members" 
                value={schoolInfo.staffCount} 
                change={0}
                trend="up"
                color="blue" 
                subtitle="Teaching & support" 
              />
            )}
          </div>

          {/* SCHOOL OVERVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="group relative bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-blue-500/10 to-transparent blur-2xl opacity-50 group-hover:opacity-80 transition-opacity" />

                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">School Overview</h3>
                    <p className="text-xs text-slate-400 font-medium">Core information and mission</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 shadow-sm">
                    <FaSchool className="text-xl" />
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-xl">
                        <FaBuilding className="text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-800">{schoolInfo.name || 'Unnamed School'}</h4>
                        {schoolInfo.motto && (
                          <p className="text-sm text-slate-600 italic">"{schoolInfo.motto}"</p>
                        )}
                      </div>
                    </div>
                    
                    {schoolInfo.description && (
                      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                        <p className="text-slate-700 leading-relaxed">{schoolInfo.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {schoolInfo.vision && (
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                        <div className="flex items-center gap-2 mb-2">
                          <FaEye className="text-indigo-600" />
                          <h5 className="font-bold text-slate-700">Vision</h5>
                        </div>
                        <p className="text-sm text-slate-600">{schoolInfo.vision}</p>
                      </div>
                    )}
                    
                    {schoolInfo.mission && (
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-100">
                        <div className="flex items-center gap-2 mb-2">
                          <FaRocket className="text-emerald-600" />
                          <h5 className="font-bold text-slate-700">Mission</h5>
                        </div>
                        <p className="text-sm text-slate-600">{schoolInfo.mission}</p>
                      </div>
                    )}
                  </div>

          
                </div>
              </div>
            </div>
            
            {/* VIDEO TOUR */}
            <div>
              <div className="group relative bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-red-500/10 to-transparent blur-2xl opacity-50 group-hover:opacity-80 transition-opacity" />

                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">Video Tour</h3>
                    <p className="text-xs text-slate-400 font-medium">school experience</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 shadow-sm">
                    <FaVideo className="text-xl" />
                  </div>
                </div>

                {schoolInfo?.videoTour ? (
                  <div className="relative z-10">
                    <div className="relative rounded-xl overflow-hidden cursor-pointer group/video" onClick={() => setShowVideoModal(true)}>
                      <div className="relative pb-[56.25%]">
                        {/* ✅ FIX: Show thumbnail for both YouTube and file videos */}
                        <img 
                          src={schoolInfo.videoThumbnail || (schoolInfo.videoType === 'youtube' ? `https://img.youtube.com/vi/${schoolInfo.videoTour?.split('v=')[1] || 'default'}/hqdefault.jpg` : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720"%3E%3Crect fill="%23000" width="1280" height="720"/%3E%3C/svg%3E')}
                          alt="Video Thumbnail" 
                          className="absolute top-0 left-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover/video:bg-opacity-30 transition">
                          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover/video:scale-110 transition-transform">
                            <FaPlay className="text-white text-xl ml-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowVideoModal(true)}
                      className="w-full mt-4 bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 rounded-xl font-bold hover:from-red-700 hover:to-orange-700 transition-all"
                    >
                      Watch School Tour
                    </button>
                  </div>
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <FaVideo className="text-3xl text-slate-300 mb-2" />
                    <p className="text-slate-400 text-sm font-medium">No video available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ACADEMIC INFORMATION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SUBJECTS */}
            <div className="group relative bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500/10 to-transparent blur-2xl opacity-50 group-hover:opacity-80 transition-opacity" />

              <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">Subjects Offered</h3>
                  <p className="text-xs text-slate-400 font-medium">Comprehensive curriculum</p>
                </div>
                <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 shadow-sm">
                  <FaBook className="text-xl" />
                </div>
              </div>

              <div className="relative z-10">
                {schoolInfo.subjects && schoolInfo.subjects.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {schoolInfo.subjects.map((subject, index) => {
                      const Icon = getSubjectIcon(subject);
                      return (
                        <div 
                          key={index}
                          className="flex items-center gap-3 p-3 bg-slate-50/50 hover:bg-blue-50 rounded-xl border border-slate-100 transition-colors group/subject"
                        >
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Icon className="text-blue-600 text-sm" />
                          </div>
                          <span className="text-sm font-bold text-slate-700">{subject}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <FaBook className="text-3xl text-slate-300 mb-2" />
                    <p className="text-slate-400 text-sm font-medium">No subjects added yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* DEPARTMENTS */}
            <div className="group relative bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-teal-500/10 to-transparent blur-2xl opacity-50 group-hover:opacity-80 transition-opacity" />

              <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">Departments</h3>
                  <p className="text-xs text-slate-400 font-medium">Academic structure</p>
                </div>
                <div className="p-3 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 shadow-sm">
                  <FaUsersCog className="text-xl" />
                </div>
              </div>

              <div className="relative z-10">
                {schoolInfo.departments && schoolInfo.departments.length > 0 ? (
                  <div className="space-y-3">
                    {schoolInfo.departments.map((department, index) => {
                      const Icon = getDepartmentIcon(department);
                      return (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-white hover:from-blue-50 hover:to-white rounded-xl border border-slate-100 transition-all group/dept"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <Icon className="text-teal-600 text-sm" />
                            </div>
                            <span className="font-bold text-slate-700">{department}</span>
                          </div>
                          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">Dept</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <FaUsersCog className="text-3xl text-slate-300 mb-2" />
                    <p className="text-slate-400 text-sm font-medium">No departments added yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ACADEMIC CALENDAR */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="group relative bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-blue-500/10 to-transparent blur-2xl opacity-50 group-hover:opacity-80 transition-opacity" />

              <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">Academic Calendar</h3>
                  <p className="text-xs text-slate-400 font-medium">Term dates</p>
                </div>
                <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 shadow-sm">
                  <FaCalendar className="text-xl" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <FaDoorOpen className="text-blue-600" />
                    <h5 className="font-bold text-slate-700">Term Opens</h5>
                  </div>
                  <p className="text-lg font-black text-slate-900">{formatDate(schoolInfo.openDate)}</p>
                </div>
                
                <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border border-red-100">
                  <div className="flex items-center gap-2 mb-2">
                    <FaDoorClosed className="text-red-600" />
                    <h5 className="font-bold text-red-700">Term Closes</h5>
                  </div>
                  <p className="text-lg font-black text-slate-900">{formatDate(schoolInfo.closeDate)}</p>
                </div>
              </div>
            </div>

            {/* ADMISSION CALENDAR */}
            <div className="group relative bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-green-500/10 to-transparent blur-2xl opacity-50 group-hover:opacity-80 transition-opacity" />

              <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">Admission Timeline</h3>
                  <p className="text-xs text-slate-400 font-medium">Application schedule</p>
                </div>
                <div className="p-3 rounded-2xl bg-green-50 border border-green-100 text-green-600 shadow-sm">
                  <FaUserCheck className="text-xl" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <FaCalendarAlt className="text-green-600" />
                    <h5 className="font-bold text-green-700">Applications Open</h5>
                  </div>
                  <p className="text-lg font-black text-slate-900">{formatDate(schoolInfo.admissionOpenDate)}</p>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-100">
                  <div className="flex items-center gap-2 mb-2">
                    <FaHourglassHalf className="text-orange-600" />
                    <h5 className="font-bold text-orange-700">Applications Close</h5>
                  </div>
                  <p className="text-lg font-black text-slate-900">{formatDate(schoolInfo.admissionCloseDate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ADMISSION REQUIREMENTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="group relative bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500/10 to-transparent blur-2xl opacity-50 group-hover:opacity-80 transition-opacity" />

                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">Admission Requirements</h3>
                    <p className="text-xs text-slate-400 font-medium">Application criteria</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-sm">
                    <FaFileAlt className="text-xl" />
                  </div>
                </div>

                <div className="relative z-10">
                  {schoolInfo.admissionRequirements && (
                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 mb-6">
                      <div className="prose prose-sm max-w-none">
                        {schoolInfo.admissionRequirements.split('\r\n').map((line, index) => (
                          <p key={index} className="text-slate-700 mb-2">{line}</p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {schoolInfo.admissionDocumentsRequired && schoolInfo.admissionDocumentsRequired.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {schoolInfo.admissionDocumentsRequired.map((doc, index) => {
                        const Icon = getDocumentIcon(doc);
                        return (
                          <div 
                            key={index}
                            className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 hover:shadow-sm transition-shadow"
                          >
                            <div className="p-2 bg-indigo-50 rounded-lg">
                              <Icon className="text-indigo-600 text-sm" />
                            </div>
                            <span className="text-sm font-bold text-slate-700">{doc}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                      <FaFileAlt className="text-3xl text-slate-300 mb-2" />
                      <p className="text-slate-400 text-sm font-medium">No documents required listed</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* CONTACT INFORMATION */}
            <div>
              <div className="group relative bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-cyan-500/10 to-transparent blur-2xl opacity-50 group-hover:opacity-80 transition-opacity" />

                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">Contact Information</h3>
                    <p className="text-xs text-slate-400 font-medium">Admission office</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-cyan-50 border border-cyan-100 text-cyan-600 shadow-sm">
                    <FaPhone className="text-xl" />
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  {schoolInfo.admissionContactEmail ? (
                    <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                      <div className="p-2 bg-white rounded-lg">
                        <FaEnvelope className="text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400">Email</p>
                        <p className="text-sm font-bold text-slate-700">{schoolInfo.admissionContactEmail}</p>
                      </div>
                    </div>
                  ) : null}
                  
                  {schoolInfo.admissionContactPhone ? (
                    <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                      <div className="p-2 bg-white rounded-lg">
                        <FaPhone className="text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400">Phone</p>
                        <p className="text-sm font-bold text-slate-700">{schoolInfo.admissionContactPhone}</p>
                      </div>
                    </div>
                  ) : null}
                  
                  {schoolInfo.admissionWebsite ? (
                    <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                      <div className="p-2 bg-white rounded-lg">
                        <FaGlobe className="text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400">Website</p>
                        <p className="text-sm font-bold text-slate-700">{schoolInfo.admissionWebsite}</p>
                      </div>
                    </div>
                  ) : null}
                  
                  {schoolInfo.admissionLocation ? (
                    <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                      <div className="p-2 bg-white rounded-lg">
                        <FaMapMarkerAlt className="text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400">Location</p>
                        <p className="text-sm font-bold text-slate-700">{schoolInfo.admissionLocation}</p>
                      </div>
                    </div>
                  ) : null}
                  
                  {schoolInfo.admissionOfficeHours ? (
                    <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                      <div className="p-2 bg-white rounded-lg">
                        <FaClock className="text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400">Office Hours</p>
                        <p className="text-sm font-bold text-slate-700">{schoolInfo.admissionOfficeHours}</p>
                      </div>
                    </div>
                  ) : null}
                  
                  {/* Fallback when no contact info */}
                  {!schoolInfo.admissionContactEmail && 
                   !schoolInfo.admissionContactPhone && 
                   !schoolInfo.admissionWebsite && 
                   !schoolInfo.admissionLocation && 
                   !schoolInfo.admissionOfficeHours && (
                    <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                      <FaPhone className="text-3xl text-slate-300 mb-2" />
                      <p className="text-slate-400 text-sm font-medium">No contact information added</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ MODAL - Dynamically passes school data only when it exists */}
      {showModal && (
        <ModernSchoolModal 
          onClose={() => setShowModal(false)} 
          onSave={handleSaveSchool}
          school={hasSchoolInfo ? schoolInfo : null} // ✅ Pass null when no school exists
          loading={false}
        />
      )}

      {showDeleteModal && (
        <ModernDeleteModal 
          onClose={() => setShowDeleteModal(false)} 
          onConfirm={handleDeleteSchool} 
          loading={false}
        />
      )}

      {showVideoModal && schoolInfo?.videoTour ? (
        <VideoModal 
          open={showVideoModal}
          onClose={() => setShowVideoModal(false)}
          videoType={schoolInfo.videoType || 'file'}
          videoPath={schoolInfo.videoTour}
          thumbnail={schoolInfo.videoThumbnail}
        />
      ) : null}
    </div>
  );
}

// Add helper utilities (place near top of file inside the same module)
async function resizeImageFile(file, maxWidth = 1280, maxHeight = 720, quality = 0.85) {
  if (!file || !file.type.startsWith('image/')) return file;
  const img = await new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const i = new Image();
    i.onload = () => { URL.revokeObjectURL(url); resolve(i); };
    i.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
    i.src = url;
  });

  let { width, height } = img;
  const aspect = width / height;
  if (width > maxWidth) {
    width = maxWidth;
    height = Math.round(width / aspect);
  }
  if (height > maxHeight) {
    height = maxHeight;
    width = Math.round(height * aspect);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
  return new File([blob], (file.name || 'thumbnail.jpg').replace(/\s+/g,'_'), { type: 'image/jpeg' });
}

async function generateThumbnailFromVideoFile(file, maxWidth = 1280, maxHeight = 720, quality = 0.8) {
  if (!file || !file.type.startsWith('video/')) return null;
  const url = URL.createObjectURL(file);
  const video = document.createElement('video');
  video.preload = 'metadata';
  video.src = url;

  await new Promise((resolve, reject) => {
    video.onloadedmetadata = () => { resolve(); };
    video.onerror = reject;
  });

  // Seek to 0.75s to capture a frame (some videos need to buffer)
  const seekTime = Math.min(1, Math.max(0.1, (video.duration || 1) * 0.1));
  await new Promise((resolve) => {
    const handler = () => { video.removeEventListener('seeked', handler); resolve(); };
    video.addEventListener('seeked', handler);
    video.currentTime = seekTime;
  });

  const canvas = document.createElement('canvas');
  const aspect = video.videoWidth / video.videoHeight || 16/9;
  let width = Math.min(maxWidth, video.videoWidth || maxWidth);
  let height = Math.round(width / aspect);
  if (height > maxHeight) { height = maxHeight; width = Math.round(height * aspect); }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, width, height);

  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
  URL.revokeObjectURL(url);
  return new File([blob], 'video-generated-thumbnail.jpg', { type: 'image/jpeg' });
}