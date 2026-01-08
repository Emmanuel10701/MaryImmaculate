'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Toaster, toast } from 'sonner';
import { 
  FaSchool, FaEdit, FaTrash, FaPlus, FaSearch, FaSync,
  FaEye, FaCalendar, FaUsers, FaChalkboardTeacher, FaDollarSign,
  FaBook, FaGraduationCap, FaFilePdf, FaVideo, FaMapMarkerAlt,
  FaPhone, FaEnvelope, FaGlobe, FaClock, FaChevronRight, FaChevronLeft,
  FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaChartBar,FaCheckDouble, 
  FaUpload, FaTimes, FaCog, FaSave,
  FaExternalLinkAlt, FaRocket, FaShieldAlt,
  FaHashtag, FaPalette, FaMagic, FaBolt,
  FaCrown, FaGem, FaFire, FaRegClock, FaRegFileAlt,
  FaTh, FaList, FaUserGraduate, FaBuilding,
  FaAward, FaCalendarAlt, FaFileInvoice, FaFileDownload, FaFileImport,
  FaPercentage, FaTasks, FaClipboardList,
  FaUserCheck, FaMoneyBillWave, FaReceipt, FaCalculator, FaArrowDown, FaBookOpen, FaUsersCog,
  FaChartLine, FaChartPie, FaChartArea,
  FaShareAlt, FaDownload, FaPaperclip, FaCheckSquare,
  FaListUl, FaQuoteLeft, FaQuoteRight, FaStarHalfAlt,
  FaLightbulb, FaNewspaper, FaStickyNote, FaSun, FaMoon,
  FaYoutube, FaFileVideo, FaFileAlt, FaFileExport,
  FaFileUpload, FaFileCode, FaFileAudio, FaFile, FaCheck,
  FaUser, FaTag, FaCogs, FaUniversity, FaBlackTie,
  FaPlay, FaPlayCircle, FaCamera, FaImage, FaInfoCircle,
  FaArrowRight, FaHourglassHalf // Added from your second import block
} from 'react-icons/fa';

import { FiTrash2, FiEdit2 } from 'react-icons/fi';

import { CircularProgress, Modal, Box, TextField, TextareaAutosize } from '@mui/material';

// Modern Loading Spinner Component
function ModernLoadingSpinner({ message = "Loading sessions from the database…", size = "medium" }) {
  const sizes = {
    small: { outer: 48, inner: 24 },
    medium: { outer: 64, inner: 32 },
    large: { outer: 80, inner: 40 }
  }

  const { outer, inner } = sizes[size]

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/20 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative inline-block">
          {/* Main spinner */}
          <div className="relative">
            <CircularProgress 
              size={outer} 
              thickness={5}
              className="text-indigo-600"
            />
            {/* Pulsing inner circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full animate-ping opacity-25"
                   style={{ width: inner, height: inner }}></div>
            </div>
          </div>
          {/* Outer glow effect */}
          <div className="absolute -inset-6 bg-gradient-to-r from-indigo-100 to-violet-100 rounded-full blur-xl opacity-30 animate-pulse"></div>
        </div>
        
        {/* Text content */}
        <div className="mt-6 space-y-3">
          <span className="block text-lg font-semibold text-gray-800">
            {message}
          </span>
          
          {/* Bouncing dots */}
          <div className="flex justify-center space-x-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" 
                   style={{ animationDelay: `${i * 0.15}s` }}></div>
            ))}
          </div>
          
          {/* Optional subtitle */}
          <p className="text-gray-500 text-sm mt-2">
            Please wait while we fetch school public data
          </p>
        </div>
      </div>
    </div>
  )
}

// Tag Input Component for dynamic list
function TagInput({ label, tags, onTagsChange, placeholder = "Type and press Enter..." }) {
  const [inputValue, setInputValue] = useState('')

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      const newTags = [...tags, inputValue.trim()]
      onTagsChange(newTags)
      setInputValue('')
    }
  }

  const handleRemoveTag = (indexToRemove) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove)
    onTagsChange(newTags)
  }

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
          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-sm"
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
              className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200 text-sm font-medium"
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
  )
}

// Modern PDF Upload Component with Remove functionality
function ModernPdfUpload({ 
  pdfFile, 
  onPdfChange, 
  onRemove, 
  label = "PDF File", 
  required = false, 
  showPreview = true,
  existingPdf = null,
  onCancelExisting = null,
  onRemoveExisting = null
}) {
  const [previewName, setPreviewName] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isReplacing, setIsReplacing] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (pdfFile && typeof pdfFile === 'object') {
      setPreviewName(pdfFile.name)
    } else if (existingPdf) {
      setPreviewName(existingPdf.name || existingPdf.filename || 'Existing PDF')
    } else {
      setPreviewName('')
    }
  }, [pdfFile, existingPdf])

  const simulateUpload = () => {
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 20
      })
    }, 100)
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 1)
    
    if (files.length === 0) return

    setUploadProgress(0)

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 20
      })
    }, 100)

    if (files.length > 0) {
      const file = files[0]
      
      if (file.type !== 'application/pdf') {
        toast.error('Only PDF files are allowed')
        setUploadProgress(0)
        return
      }

      if (file.size > 20 * 1024 * 1024) {
        toast.error('PDF file too large. Maximum size: 20MB')
        setUploadProgress(0)
        return
      }

      simulateUpload()
      onPdfChange(file)
      setPreviewName(file.name)
      setUploadProgress(100)
      setIsReplacing(false)
      
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files).slice(0, 1)
    if (files.length > 0) handleFileChange({ target: { files } })
  }

  const handleRemove = () => {
    setPreviewName('')
    setUploadProgress(0)
    if (onRemove) {
      onRemove()
    }
  }

  const handleReplaceExisting = () => {
    setIsReplacing(true)
    
    if (pdfFile && typeof pdfFile === 'object' && onRemove) {
      onRemove()
    }
    
    if (existingPdf && onCancelExisting) {
      onCancelExisting()
    }
    
    setPreviewName('')
    setUploadProgress(0)
    
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.click()
      }
    }, 100)
  }

  const handleRemoveExisting = () => {
    if (existingPdf && onRemoveExisting) {
      onRemoveExisting()
    }
    
    setPreviewName('')
    setUploadProgress(0)
    
    toast.success('Existing PDF marked for removal. Save changes to confirm.')
  }

  const hasExistingPdf = existingPdf && !pdfFile
  const hasNewPdf = pdfFile && typeof pdfFile === 'object'

  return (
    <div className="space-y-3">
      <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
        <FaFilePdf className="text-red-500" />
        <span>{label}</span>
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {(hasNewPdf || hasExistingPdf) ? (
        <div className="relative group">
          <div className="relative overflow-hidden rounded-xl border-2 border-gray-300 shadow-sm transition-all duration-300 bg-gradient-to-br from-red-50 to-orange-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FaFilePdf className="text-red-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm truncate max-w-[180px]">
                    {hasNewPdf ? pdfFile.name : (existingPdf.name || existingPdf.filename || 'Existing PDF')}
                  </p>
                  <p className="text-xs text-gray-600">
                    {hasNewPdf ? 'New PDF Document' : 'Existing PDF Document'}
                    {existingPdf?.size && ` • ${(existingPdf.size / 1024).toFixed(0)} KB`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {hasExistingPdf && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleReplaceExisting}
                      className="bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-all duration-300 shadow hover:shadow-md cursor-pointer hover:bg-blue-600 flex items-center gap-1 text-sm"
                    >
                      <FaUpload className="text-xs" />
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveExisting}
                      className="bg-red-500 text-white px-3 py-1.5 rounded-lg transition-all duration-300 shadow hover:shadow-md cursor-pointer hover:bg-red-600 flex items-center gap-1 text-sm"
                    >
                      <FaTrash className="text-xs" />
                      Remove
                    </button>
                  </div>
                )}
                {hasNewPdf && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="bg-red-500 text-white p-1.5 rounded-lg transition-all duration-300 shadow hover:shadow-md cursor-pointer hover:bg-red-600"
                    title="Remove PDF"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                )}
              </div>
            </div>
            
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="absolute bottom-0 left-0 right-0 bg-gray-200 h-1">
                <div 
                  className="bg-gradient-to-r from-red-500 to-orange-600 h-1 transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
            
            {hasExistingPdf && (
              <div className="mt-2 text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                <FaInfoCircle className="inline mr-1" />
                Click "Replace" to upload a new PDF or "Remove" to delete this file
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-300 cursor-pointer group ${
            dragOver 
              ? 'border-red-400 bg-gradient-to-br from-red-50 to-red-100' 
              : 'border-gray-300 hover:border-red-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-sm'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="relative">
            <FaUpload className={`mx-auto text-2xl mb-2 transition-all duration-300 ${
              dragOver ? 'text-red-500 scale-110' : 'text-gray-400 group-hover:text-red-500'
            }`} />
          </div>
          <p className="text-gray-700 mb-1 font-medium transition-colors duration-300 group-hover:text-gray-800 text-sm">
            {dragOver ? '📄 Drop PDF here!' : isReplacing ? 'Select new PDF file' : 'Click to upload PDF'}
          </p>
          <p className="text-xs text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
            Max: 20MB • PDF only
          </p>
          <input 
            ref={fileInputRef}
            type="file" 
            accept=".pdf" 
            onChange={handleFileChange} 
            className="hidden" 
            id={`pdf-upload-${label.replace(/\s+/g, '-').toLowerCase()}`} 
          />
        </div>
      )}
    </div>
  )
}

// Video Thumbnail Options Component
function VideoThumbnailOptions({ videoFile, onThumbnailSelect, onClose }) {
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState(null);
  const videoURLRef = useRef(null);

  useEffect(() => {
    return () => {
      if (videoURLRef.current) {
        URL.revokeObjectURL(videoURLRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!videoFile) {
      setError('No video file provided');
      setIsGenerating(false);
      return;
    }

    const generateThumbnails = async () => {
      try {
        setIsGenerating(true);
        setError(null);
        
        const videoURL = URL.createObjectURL(videoFile);
        videoURLRef.current = videoURL;
        
        const video = document.createElement('video');
        video.src = videoURL;
        
        await new Promise((resolve, reject) => {
          video.onloadedmetadata = () => {
            if (video.duration && video.videoWidth && video.videoHeight) {
              resolve();
            } else {
              reject(new Error('Could not load video metadata'));
            }
          };
          video.onerror = () => reject(new Error('Failed to load video'));
          video.load();
        });

        const duration = video.duration;
        
        if (!duration || duration <= 0) {
          throw new Error('Invalid video duration');
        }

        const thumbnailTimes = [
          0,
          duration * 0.25,
          duration * 0.5,
          duration * 0.75
        ];

        const generatedThumbnails = [];
        
        for (let i = 0; i < thumbnailTimes.length; i++) {
          const time = thumbnailTimes[i];
          
          try {
            const thumbnail = await generateThumbnailAtTime(video, time);
            generatedThumbnails.push({
              url: thumbnail,
              time: time,
              index: i
            });
          } catch (err) {
            console.warn(`Failed to generate thumbnail at ${time}s:`, err);
            generatedThumbnails.push({
              url: createPlaceholderImage(),
              time: time,
              index: i,
              isPlaceholder: true
            });
          }
        }

        setThumbnails(generatedThumbnails);
        setIsGenerating(false);
        
      } catch (err) {
        console.error('Failed to generate thumbnails:', err);
        setError(err.message || 'Failed to generate thumbnails');
        setIsGenerating(false);
        
        const fallbackThumbnails = Array.from({ length: 4 }, (_, i) => ({
          url: createPlaceholderImage(i),
          time: i * 5,
          index: i,
          isPlaceholder: true
        }));
        setThumbnails(fallbackThumbnails);
      }
    };

    generateThumbnails();
  }, [videoFile]);

  const generateThumbnailAtTime = (video, time) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = 320;
      canvas.height = 180;
      
      video.currentTime = time;
      
      const timeout = setTimeout(() => {
        reject(new Error(`Timeout generating thumbnail at ${time}s`));
      }, 5000);
      
      video.onseeked = () => {
        try {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
          clearTimeout(timeout);
          resolve(thumbnailUrl);
        } catch (err) {
          clearTimeout(timeout);
          reject(err);
        }
      };
      
      video.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Video seek error'));
      };
    });
  };

  const createPlaceholderImage = (index = 0) => {
    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];
    const color = colors[index % colors.length];
    
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = color + '20';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = color;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Frame ${index + 1}`, canvas.width / 2, canvas.height / 2);
    
    ctx.font = '12px Arial';
    ctx.fillText('Preview unavailable', canvas.width / 2, canvas.height / 2 + 25);
    
    return canvas.toDataURL('image/png');
  };

  const handleThumbnailSelect = (index) => {
    setSelectedIndex(index);
  };

  const handleConfirm = () => {
    if (thumbnails[selectedIndex]) {
      onThumbnailSelect(thumbnails[selectedIndex].url);
    }
    onClose();
  };

  const handleRetry = () => {
    setError(null);
    setThumbnails([]);
    setIsGenerating(true);
    
    setTimeout(() => {
      const event = new Event('retry');
      window.dispatchEvent(event);
    }, 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaCamera className="text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">Select Video Thumbnail</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Choose a thumbnail from the video or use the default
          </p>
        </div>

        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700 mb-2">
                <FaExclamationTriangle className="text-red-500" />
                <span className="font-medium">Error: {error}</span>
              </div>
              <button
                onClick={handleRetry}
                className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          )}

          {isGenerating ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Generating thumbnails from video...</p>
              <p className="text-xs text-gray-500 mt-2">This may take a moment</p>
              <button
                onClick={handleRetry}
                className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                <FaSync className="inline mr-2" /> Regenerate
              </button>
            </div>
          ) : thumbnails.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {thumbnails.map((thumbnail, index) => (
                  <div
                    key={index}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      selectedIndex === index
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleThumbnailSelect(index)}
                  >
                    <img
                      src={thumbnail.url}
                      alt={`Thumbnail at ${thumbnail.time.toFixed(1)}s`}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <p className="text-xs text-white font-medium">
                        {thumbnail.isPlaceholder ? 'Fallback' : `${thumbnail.time.toFixed(1)}s`}
                      </p>
                    </div>
                    {selectedIndex === index && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full">
                        <FaCheck className="text-xs" />
                      </div>
                    )}
                    {thumbnail.isPlaceholder && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                        Fallback
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaInfoCircle className="text-blue-500" />
                <span>
                  {thumbnails[selectedIndex]?.isPlaceholder 
                    ? 'Using fallback image'
                    : `Selected frame at ${thumbnails[selectedIndex]?.time.toFixed(1)} seconds`
                  }
                </span>
              </div>
              
              <div className="flex justify-center gap-2">
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <FaSync /> Regenerate Thumbnails
                </button>
                {thumbnails.some(t => t.isPlaceholder) && (
                  <button
                    onClick={() => {
                      onThumbnailSelect(thumbnails[0].url);
                      onClose();
                    }}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                  >
                    Use Default
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaCamera className="text-gray-400 text-xl" />
              </div>
              <p className="text-gray-600">No thumbnails generated</p>
              <button
                onClick={handleRetry}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-2 p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-bold"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={thumbnails.length === 0}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Use Selected Thumbnail
          </button>
        </div>
      </div>
    </div>
  );
}

// Modern Video Upload Component with Remove functionality
function ModernVideoUpload({ 
  videoType, 
  videoPath, 
  youtubeLink, 
  onVideoChange, 
  onYoutubeLinkChange, 
  onRemove, 
  onThumbnailSelect, 
  label = "Video Tour",
  existingVideo = null,
  onCancelExisting = null,
  onRemoveExisting = null
}) {
  const [dragOver, setDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [localYoutubeLink, setLocalYoutubeLink] = useState(youtubeLink || '')
  const [previewName, setPreviewName] = useState('')
  const [fileToUpload, setFileToUpload] = useState(null)
  const [selectedThumbnail, setSelectedThumbnail] = useState(null)
  const [showThumbnailOptions, setShowThumbnailOptions] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (videoType === 'file' && videoPath) {
      const fileName = videoPath.split('/').pop() || 'Video File'
      setPreviewName(fileName)
    } else if (videoType === 'youtube' && youtubeLink) {
      setLocalYoutubeLink(youtubeLink)
    }
  }, [videoType, videoPath, youtubeLink])

  const hasExistingVideo = existingVideo || (videoType === 'file' && videoPath);
  const hasNewVideo = fileToUpload;
  const hasYouTubeLink = localYoutubeLink && isValidYouTubeUrl(localYoutubeLink);
  const showUploadUI = !hasExistingVideo || (hasExistingVideo && !hasNewVideo && !hasYouTubeLink);

  const handleYoutubeLinkChange = (e) => {
    const url = e.target.value;
    setLocalYoutubeLink(url);
    
    if (url.trim()) {
      setFileToUpload(null)
      setPreviewName('')
      setUploadProgress(0)
      setSelectedThumbnail(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
    
    if (onYoutubeLinkChange) {
      onYoutubeLinkChange(url);
    }
  };

  const simulateUpload = () => {
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 20
      })
    }, 100)
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 1)
    
    if (files.length === 0) return

    setUploadProgress(0)

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 20
      })
    }, 100)

    if (files.length > 0) {
      const file = files[0]
      
      const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-m4v']
      if (!allowedVideoTypes.includes(file.type)) {
        toast.error('Invalid video format. Only MP4, WebM, OGG, MOV, and M4V files are allowed.')
        setUploadProgress(0)
        return
      }

      if (file.size > 100 * 1024 * 1024) {
        toast.error('Video file too large. Maximum size: 100MB')
        setUploadProgress(0)
        return
      }

      simulateUpload()
      setFileToUpload(file)
      setPreviewName(file.name)
      setLocalYoutubeLink('')
      if (onVideoChange) {
        onVideoChange(file)
      }
      setUploadProgress(100)
      
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileChange({ target: { files: [file] } });
    }
  };

  const handleRemove = () => {
    setFileToUpload(null);
    setPreviewName('');
    setLocalYoutubeLink('');
    setUploadProgress(0);
    setSelectedThumbnail(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    if (onRemove) {
      onRemove();
    }
    
    if (onYoutubeLinkChange) {
      onYoutubeLinkChange('');
    }
  };

  const handleRemoveExisting = () => {
    if (hasExistingVideo && onRemoveExisting) {
      onRemoveExisting();
    }
    
    setFileToUpload(null);
    setPreviewName('');
    setLocalYoutubeLink('');
    setUploadProgress(0);
    setSelectedThumbnail(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    if (onYoutubeLinkChange) {
      onYoutubeLinkChange('');
    }
    
    toast.success('Existing video marked for removal. Save changes to confirm.');
  };

  const handleReplaceExisting = () => {
    setFileToUpload(null);
    setPreviewName('');
    setLocalYoutubeLink('');
    setUploadProgress(0);
    setSelectedThumbnail(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    if (hasExistingVideo && !hasNewVideo && onCancelExisting) {
      onCancelExisting();
    } else if (hasNewVideo && onRemove) {
      onRemove();
    }
    
    if (onYoutubeLinkChange) {
      onYoutubeLinkChange('');
    }
    
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }, 100);
  };

  const handleThumbnailSelect = (thumbnailUrl) => {
    if (thumbnailUrl && thumbnailUrl.startsWith('data:image/')) {
      const base64Data = thumbnailUrl.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      
      const file = new File([blob], `thumbnail_${Date.now()}.jpg`, { 
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      
      setSelectedThumbnail(thumbnailUrl);
      if (onThumbnailSelect) {
        onThumbnailSelect(file);
      }
      toast.success('Thumbnail selected! It will be saved when you update the school info.');
    } else {
      setSelectedThumbnail(thumbnailUrl);
      if (onThumbnailSelect) {
        onThumbnailSelect(thumbnailUrl);
      }
      toast.success('Thumbnail selected!');
    }
  };

  const isValidYouTubeUrl = (url) => {
    if (!url || url.trim() === '') return false
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    return youtubeRegex.test(url.trim())
  };

  const handleUploadAreaClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
        <FaVideo className="text-purple-500" />
        <span>{label}</span>
      </label>
      
      {selectedThumbnail && !hasYouTubeLink && (
        <div className="mb-3">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Selected Thumbnail (MP4 only)
          </label>
          <div className="relative group rounded-lg overflow-hidden border border-gray-200">
            <img
              src={selectedThumbnail}
              alt="Video thumbnail"
              className="w-full h-40 object-cover"
            />
            <button
              type="button"
              onClick={() => {
                setSelectedThumbnail(null);
                if (onThumbnailSelect) onThumbnailSelect(null);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">YouTube URL</label>
          <div className="relative">
            <FaYoutube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" />
            <input
              type="url"
              value={localYoutubeLink}
              onChange={handleYoutubeLinkChange}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white text-sm"
            />
          </div>
          {localYoutubeLink && !isValidYouTubeUrl(localYoutubeLink) && (
            <p className="text-red-500 text-[10px] mt-1 font-bold italic">Please enter a valid YouTube URL</p>
          )}
        </div>

        <div className="text-center text-gray-300 text-[10px] font-bold">OR</div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Local Video File (MP4)</label>
          
          {hasExistingVideo || hasNewVideo ? (
            <div className="space-y-3">
              <div className="relative group">
                <div className="relative overflow-hidden rounded-xl border-2 border-blue-400 shadow-sm transition-all duration-300 bg-gradient-to-br from-blue-50 to-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500 rounded-lg shadow-md">
                        <FaFileVideo className="text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm truncate max-w-[180px]">
                          {hasNewVideo ? fileToUpload.name : (previewName || (videoPath ? videoPath.split('/').pop() : 'Video File'))}
                        </p>
                        <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tighter">
                          {hasNewVideo ? 'New Upload' : 'Existing Video'}
                        </p>
                        {hasNewVideo && (
                          <p className="text-xs text-gray-600 mt-1">
                            {(fileToUpload.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasExistingVideo && !hasNewVideo && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleReplaceExisting}
                            className="bg-blue-500 text-white px-3 py-2 rounded-xl transition-all duration-300 shadow-sm border border-blue-100 cursor-pointer hover:bg-blue-600 flex items-center gap-1 text-sm"
                            title="Replace video"
                          >
                            <FaUpload className="text-xs" />
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveExisting}
                            className="bg-red-500 text-white px-3 py-2 rounded-xl transition-all duration-300 shadow-sm border border-red-100 cursor-pointer hover:bg-red-600 flex items-center gap-1 text-sm"
                            title="Remove video"
                          >
                            <FaTrash className="text-xs" />
                            Remove
                          </button>
                        </div>
                      )}
                      {hasNewVideo && (
                        <button
                          type="button"
                          onClick={handleRemove}
                          className="bg-red-500 text-white p-2 rounded-xl transition-all duration-300 shadow-sm border border-red-100 cursor-pointer hover:bg-red-600"
                          title="Remove video"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {hasExistingVideo && !hasNewVideo && (
                    <div className="mt-2 text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                      <FaInfoCircle className="inline mr-1" />
                      Click "Replace" to upload a new video or "Remove" to delete this file
                    </div>
                  )}
                  
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gray-200 h-1">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
              
              {(hasNewVideo || (hasExistingVideo && videoType === 'file')) && !hasYouTubeLink && (
                <button
                  type="button"
                  onClick={() => setShowThumbnailOptions(true)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 text-purple-700 px-4 py-2.5 rounded-lg hover:from-purple-100 hover:to-blue-100 transition-all duration-300 font-bold"
                >
                  <FaCamera />
                  Select Thumbnail from Video (MP4 only)
                </button>
              )}
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer group ${
                dragOver 
                  ? 'border-blue-400 bg-blue-50 ring-4 ring-blue-50' 
                  : 'border-gray-200 hover:border-blue-300 bg-gray-50/50'
              } ${hasYouTubeLink ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onDrop={!hasYouTubeLink ? handleDrop : undefined}
              onDragOver={!hasYouTubeLink ? (e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); } : undefined}
              onDragLeave={!hasYouTubeLink ? () => setDragOver(false) : undefined}
              onClick={!hasYouTubeLink ? handleUploadAreaClick : undefined}
            >
              <div className="relative">
                <FaUpload className={`mx-auto text-2xl mb-2 transition-all duration-300 ${
                  dragOver ? 'text-blue-500 scale-110' : 'text-gray-400 group-hover:text-blue-500'
                }`} />
              </div>
              <p className="text-gray-700 mb-1 font-bold text-xs uppercase">
                {hasYouTubeLink ? 'YouTube link selected' : dragOver ? 'Drop Video Now' : 'Click to Upload Video'}
              </p>
              <p className="text-[10px] text-gray-500">MP4, WebM, MOV, M4V (Max 100MB)</p>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="video/mp4,video/x-m4v,video/*,video/quicktime" 
                onChange={handleFileChange} 
                className="hidden" 
                id="video-upload"
                disabled={hasYouTubeLink}
              />
            </div>
          )}
        </div>
      </div>
      
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Uploading...</span>
            <span className="text-xs font-black text-purple-600">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-500"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {showThumbnailOptions && (hasNewVideo || (hasExistingVideo && videoType === 'file')) && !hasYouTubeLink && (
        <VideoThumbnailOptions
          videoFile={hasNewVideo ? fileToUpload : null}
          onThumbnailSelect={handleThumbnailSelect}
          onClose={() => setShowThumbnailOptions(false)}
        />
      )}
      
      <input 
        ref={fileInputRef}
        type="file" 
        accept="video/mp4,video/x-m4v,video/*,video/quicktime" 
        onChange={handleFileChange} 
        className="hidden" 
        id="video-upload-input"
        disabled={hasYouTubeLink}
      />
    </div>
  )
}



// Additional Results Upload Component with PROPER add/replace/remove functionality
function AdditionalResultsUpload({ 
  files = [], 
  onFilesChange, 
  label = "Additional Results Files",
  existingFiles = [],
  onCancelExisting = null,
  onRemoveExisting = null
}) {
  const [dragOver, setDragOver] = useState(false);
  const [localFiles, setLocalFiles] = useState([]);
  const [filesToAdd, setFilesToAdd] = useState([]);
  const [filesToReplace, setFilesToReplace] = useState([]);
  const [filesToRemove, setFilesToRemove] = useState([]);
  const fileInputRef = useRef(null);

  // Initialize local files state
  useEffect(() => {
    // Load existing files from props
    const existingFileObjects = (existingFiles || []).map((file, index) => ({
      ...file,
      id: file.filepath || file.filename || `existing_${index}`,
      isExisting: true,
      isModified: false,
      isRemoved: false,
      isReplaced: false,
      originalFilePath: file.filepath || file.filename
    }));
    
    // Load new files from props that haven't been added yet
    const newFileObjects = (files || []).filter(file => {
      // Check if this file is already in local state
      return !localFiles.some(lf => 
        (lf.file && file.name === lf.file.name && file.size === lf.file.size) ||
        (lf.filename === file.name)
      );
    }).map((file, index) => ({
      id: `new_${Date.now()}_${index}`,
      file: file,
      filename: file.name,
      year: file.year || '',
      description: file.description || '',
      isNew: true,
      isModified: true,
      filetype: file.type?.split('/')[1] || 'file',
      filesize: file.size || file.filesize || 0
    }));
    
    // Combine all files
    const allFiles = [...existingFileObjects, ...newFileObjects];
    
    // Remove duplicates
    const uniqueFiles = [];
    const seenIds = new Set();
    
    allFiles.forEach(file => {
      if (!seenIds.has(file.id)) {
        seenIds.add(file.id);
        uniqueFiles.push(file);
      }
    });
    
    setLocalFiles(uniqueFiles);
  }, [existingFiles, files]);

  const handleFileChange = (e) => {
    const newFileList = Array.from(e.target.files);
    if (newFileList.length > 0) {
      addNewFiles(newFileList, false); // false = not replacing
    }
  };

  const addNewFiles = (fileList, isReplacement = false, replaceFileId = null) => {
    const newFileObjects = fileList.map((file, index) => {
      const fileId = `new_${Date.now()}_${index}`;
      return {
        id: fileId,
        file: file,
        filename: file.name,
        year: '',
        description: '',
        isNew: true,
        isModified: true,
        isReplacement: isReplacement,
        replacesFileId: replaceFileId,
        filetype: file.type.split('/')[1] || 'file',
        filesize: file.size
      };
    });
    
    // Add to filesToAdd state for tracking
    if (!isReplacement) {
      setFilesToAdd(prev => [...prev, ...newFileObjects.map(f => f.file)]);
    } else {
      setFilesToReplace(prev => [...prev, ...newFileObjects.map(f => ({
        newFile: f.file,
        originalFileId: replaceFileId
      }))]);
    }
    
    // Update local files state
    if (isReplacement && replaceFileId) {
      // For replacements, remove the old file and add new one
      setLocalFiles(prev => {
        // Mark old file as replaced
        const updated = prev.map(file => 
          file.id === replaceFileId ? { ...file, isReplaced: true } : file
        );
        // Add new files
        return [...updated, ...newFileObjects];
      });
    } else {
      // For new additions, just add to the list
      setLocalFiles(prev => [...prev, ...newFileObjects]);
    }
    
    // Notify parent about new files
    const newFilesForParent = newFileObjects.map(f => f.file);
    onFilesChange([...files, ...newFilesForParent]);
    
    toast.success(`${fileList.length} file(s) ${isReplacement ? 'replaced' : 'added'}. Fill in year and description.`);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const newFiles = Array.from(e.dataTransfer.files);
    if (newFiles.length > 0) {
      addNewFiles(newFiles, false);
    }
  };

  const handleYearChange = (id, year) => {
    setLocalFiles(prev => prev.map(file => 
      file.id === id ? { 
        ...file, 
        year,
        isModified: true
      } : file
    ));
  };

  const handleDescriptionChange = (id, description) => {
    setLocalFiles(prev => prev.map(file => 
      file.id === id ? { 
        ...file, 
        description,
        isModified: true
      } : file
    ));
  };

  const handleReplaceExisting = (id) => {
    const fileToReplace = localFiles.find(f => f.id === id);
    
    if (fileToReplace && fileToReplace.isExisting) {
      // Open file dialog for replacement
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.txt';
      input.onchange = (e) => {
        const replacementFile = e.target.files[0];
        if (replacementFile) {
          // Add the replacement file
          addNewFiles([replacementFile], true, id);
          
          // Notify parent about cancelled existing file
          if (onCancelExisting) {
            onCancelExisting(fileToReplace);
          }
        }
      };
      input.click();
    }
  };

  const handleRemoveExisting = (id) => {
    const fileToRemove = localFiles.find(f => f.id === id);
    
    if (fileToRemove && fileToRemove.isExisting) {
      // Mark file for removal
      setLocalFiles(prev => prev.map(file => 
        file.id === id ? { ...file, isRemoved: true } : file
      ));
      
      // Add to removal tracking
      setFilesToRemove(prev => [...prev, fileToRemove]);
      
      // Notify parent
      if (onRemoveExisting) {
        onRemoveExisting(fileToRemove);
      }
      
      toast.warning('File marked for removal. Save changes to delete permanently.');
    }
  };

  const handleRemoveNewFile = (id) => {
    const fileToRemove = localFiles.find(f => f.id === id);
    
    if (fileToRemove && fileToRemove.isNew) {
      // Remove from local state
      setLocalFiles(prev => prev.filter(file => file.id !== id));
      
      // Remove from tracking states
      setFilesToAdd(prev => prev.filter(f => 
        f !== fileToRemove.file && 
        f.name !== fileToRemove.filename
      ));
      
      setFilesToReplace(prev => prev.filter(f => 
        f.newFile !== fileToRemove.file &&
        f.originalFileId !== fileToRemove.replacesFileId
      ));
      
      // Remove from parent state
      if (fileToRemove.file) {
        const updatedFiles = files.filter(f => 
          f !== fileToRemove.file && 
          f.name !== fileToRemove.filename
        );
        onFilesChange(updatedFiles);
      }
      
      toast.info('New file removed from list.');
    }
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return <FaFile className="text-gray-500" />;
    const type = fileType.toLowerCase();
    if (type.includes('pdf')) return <FaFilePdf className="text-red-500" />;
    if (type.includes('image')) return <FaFileAlt className="text-green-500" />;
    if (type.includes('word') || type.includes('doc')) return <FaFileAlt className="text-blue-500" />;
    if (type.includes('excel') || type.includes('sheet') || type.includes('xls')) return <FaFileAlt className="text-green-600" />;
    return <FaFile className="text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Filter files for display (excluding removed ones)
  const displayFiles = localFiles.filter(file => !file.isRemoved);

 
}


// Modern Admission Curriculum Layout
function ModernAdmissionCurriculumView({ curriculumPDF, curriculumPdfName }) {
  if (!curriculumPDF) return null;

return (
  <div className="group bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-2xl shadow-slate-200/40 relative overflow-hidden transition-all duration-500 hover:shadow-blue-100/50">
    {/* Decorative Mesh Gradient Background */}
    <div className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />

    {/* Header Section */}
    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
      <div className="flex items-start gap-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-400 flex items-center justify-center shadow-xl shadow-blue-200 ring-4 ring-blue-50 transition-transform group-hover:scale-110">
          <FaBook className="text-white text-2xl" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-2">
            School Curriculum
          </h3>
          <p className="text-sm font-medium text-slate-500 max-w-sm leading-relaxed">
            Download the official academic roadmap and learning standards for the current session.
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-col items-end">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Format</span>
        <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black tracking-tighter">
          <FaFilePdf className="text-red-400" />
          ADOBE PDF DOCUMENT
        </div>
      </div>
    </div>

    {/* The Interactive Asset Card */}
    <div className="relative z-10 bg-slate-50/50 rounded-[2rem] border border-slate-200 p-6 transition-all group-hover:bg-white group-hover:shadow-lg group-hover:shadow-slate-100">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
        
        {/* File Info */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
              <FaFilePdf size={32} className="text-red-500" />
            </div>
            {/* Tiny Check Badge */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
          </div>
          
          <div className="min-w-0">
            <p className="text-base font-black text-slate-900 mb-1 truncate">
              {curriculumPdfName || 'Academic_Curriculum_Standard.pdf'}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Certified Document</span>
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-[11px] font-bold text-blue-600">v2025.1.0</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Vertical on Mobile, Row on XL */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full xl:w-auto">
          <a
            href={curriculumPDF}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 xl:flex-none inline-flex items-center justify-center gap-3 bg-white hover:bg-slate-900 hover:text-white text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl text-xs font-black transition-all duration-300 shadow-sm"
          >
            <FaEye className="text-blue-500" />
            Preview Standard
          </a>
          <a
            href={curriculumPDF}
            download={curriculumPdfName || 'curriculum.pdf'}
            className="flex-1 xl:flex-none inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-xs font-black shadow-xl shadow-blue-200 transition-all duration-300 group/btn"
          >
            <FaDownload />
            Get Curriculum
            <FaArrowRight className="hidden sm:block text-[10px] opacity-50 group-hover/btn:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  </div>
);
}

// Modern Admission Requirements Layout
function ModernAdmissionRequirementsView({ 
  admissionRequirements,
  admissionFee,
  admissionFeeDistribution,
  admissionFeePdf,
  admissionFeePdfName,
  admissionDocumentsRequired = []
}) {
  const hasRequirements = admissionRequirements || admissionFee || admissionFeePdf || admissionDocumentsRequired.length > 0;
  
  if (!hasRequirements) return null;

return (
  <div className="space-y-8">
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-2xl shadow-slate-200/40 relative overflow-hidden transition-all duration-500 hover:shadow-emerald-100/50 group">
      {/* Decorative Background Element */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity" />

      {/* Header & Primary Fee Badge */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between pb-8 mb-8 border-b border-slate-100 gap-6">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-xl shadow-emerald-200 ring-4 ring-emerald-50 transition-transform group-hover:-rotate-2">
            <FaUserCheck className="text-white text-2xl" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-2">
              Admission Requirements
            </h3>
            <p className="text-sm font-medium text-slate-500 max-w-sm leading-relaxed">
              Eligibility criteria, mandatory documentation, and one-time enrollment fee distribution.
            </p>
          </div>
        </div>

        {admissionFee && (
          <div className="flex flex-col items-start lg:items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1 lg:ml-0">Registration Fee</span>
            <div className="inline-flex items-baseline gap-1.5 bg-emerald-900 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-emerald-900/20">
              <span className="text-xs font-bold text-emerald-400 uppercase">KES</span>
              <span className="text-2xl font-black tabular-nums tracking-tighter">
                {admissionFee.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* General Requirements Info Box */}
      {admissionRequirements && (
        <div className="relative z-10 mb-8 p-5 bg-slate-50 rounded-3xl border border-slate-100 flex gap-4 items-start">
          <div className="mt-1 p-2 bg-white rounded-lg shadow-sm">
            <FaInfoCircle className="text-emerald-500 text-sm" />
          </div>
          <div>
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">General Eligibility</h4>
            <p className="text-sm font-medium text-slate-700 leading-relaxed italic">"{admissionRequirements}"</p>
          </div>
        </div>
      )}

      {/* Breakdown and Documents Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10 relative z-10">
        
        {/* Fee Distribution */}
        {admissionFeeDistribution && Object.keys(admissionFeeDistribution).length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <FaReceipt className="text-emerald-400 text-xs" />
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Fee Allocation</h4>
              <div className="h-px flex-1 bg-slate-100" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(admissionFeeDistribution).map(([key, value]) => (
                <div key={key} className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all group/item">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className="text-sm font-black text-slate-800">
                    <span className="text-[10px] text-emerald-600 mr-1">KES</span>
                    {parseFloat(value).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Required Documents */}
        {admissionDocumentsRequired.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <FaClipboardList className="text-emerald-400 text-xs" />
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Documentation Checklist</h4>
              <div className="h-px flex-1 bg-slate-100" />
            </div>
            <div className="flex flex-wrap gap-2">
              {admissionDocumentsRequired.map((doc, index) => (
                <div key={index} className="flex items-center gap-2 px-4 py-2 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                  <FaCheckDouble size={10} className="text-emerald-600" />
                  <span className="text-xs font-bold text-slate-700">{doc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PDF Control Section */}
      {admissionFeePdf && (
        <div className="relative group/pdf">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-[2rem] blur opacity-10 group-hover/pdf:opacity-20 transition duration-500" />
          <div className="relative bg-slate-900 rounded-[2rem] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                <FaFilePdf size={28} className="text-red-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-white mb-1 truncate">
                  {admissionFeePdfName || 'Entry_Requirements_V1.pdf'}
                </p>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-bold text-slate-400 uppercase">Verified Guide</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-[9px] font-black text-emerald-400 uppercase">Archive Ready</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <a
                href={admissionFeePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-3.5 rounded-xl text-xs font-black transition-all"
              >
                <FaEye className="text-emerald-400" />
                Preview
              </a>
              <a
                href={admissionFeePdf}
                download={admissionFeePdfName || 'admission-requirements.pdf'}
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3.5 rounded-xl text-xs font-black shadow-xl shadow-emerald-900/40 transition-all"
              >
                <FaDownload />
                Get PDF
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
}

// Modern Day School Fee Component
function ModernDaySchoolFeeView({ 
  feesDay, 
  feesDayDistribution, 
  feesDayDistributionPdf, 
  feesDayPdfName 
}) {
  if (!feesDay && !feesDayDistributionPdf) return null;


return (
  <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-2xl shadow-slate-200/40 relative overflow-hidden transition-all duration-500 hover:shadow-blue-100/50">
    {/* Decorative Soft-UI Accent */}
    <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl opacity-60" />

    {/* Header & Total Summary Section */}
    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between pb-8 mb-8 border-b border-slate-100/80 gap-6">
      <div className="flex items-start gap-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-xl shadow-blue-200 ring-4 ring-blue-50">
          <FaMoneyBillWave className="text-white text-2xl" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-2">
            Day School Fees
          </h3>
          <p className="text-sm font-medium text-slate-500 max-w-sm leading-relaxed">
            Annual cost breakdown for day scholars, structured by institutional service requirements.
          </p>
        </div>
      </div>
      
      {feesDay && (
        <div className="flex flex-col items-start lg:items-end">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1 lg:ml-0">Aggregate Annual Total</span>
          <div className="inline-flex items-baseline gap-1.5 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-blue-900/20">
            <span className="text-xs font-bold text-blue-400 uppercase">KES</span>
            <span className="text-2xl font-black tabular-nums tracking-tighter">
              {feesDay.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>

    {/* High-Visibility Fee Distribution Grid */}
    {feesDayDistribution && Object.keys(feesDayDistribution).length > 0 && (
      <div className="mb-10 relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <FaChartPie className="text-slate-400 text-sm" />
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Expense Distribution</h4>
          <div className="h-px flex-1 bg-slate-100" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(feesDayDistribution).map(([key, value]) => {
            const percentage = Math.round((parseFloat(value) / feesDay) * 100);
            return (
              <div 
                key={key} 
                className="group bg-white hover:bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-blue-300 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2.5">
                    <FaCheckCircle className="text-blue-100 group-hover:text-blue-500 transition-colors text-sm" />
                    <span className="text-sm font-bold text-slate-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                    {percentage}%
                  </span>
                </div>
                
                <div className="flex items-end justify-between">
                  <div className="w-full max-w-[120px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${percentage}%` }} 
                    />
                  </div>
                  <span className="text-base font-black text-slate-900">
                    <span className="text-[10px] font-bold text-slate-400 mr-1 font-sans">KES</span>
                    {parseFloat(value).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )}

    {/* Premium PDF Control Section */}
    {feesDayDistributionPdf && (
      <div className="relative group/pdf">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2rem] blur opacity-10 group-hover/pdf:opacity-20 transition duration-500" />
        <div className="relative bg-slate-50 rounded-[1.75rem] border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
              <FaFilePdf className="text-red-500 text-3xl" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 mb-1">
                {feesDayPdfName || 'Day School Fee Ledger.pdf'}
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-500">Official Release</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Verified Assets</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <a
              href={feesDayDistributionPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-900 hover:text-white text-slate-700 border border-slate-200 px-6 py-3 rounded-xl text-xs font-black transition-all duration-300 shadow-sm"
            >
              <FaEye className="text-blue-500 group-hover:text-white" />
              Preview Document
            </a>
            <a
              href={feesDayDistributionPdf}
              download={feesDayPdfName || 'day-school-fees.pdf'}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-xs font-black shadow-xl shadow-blue-200 transition-all duration-300"
            >
              <FaDownload />
              Get PDF
            </a>
          </div>
        </div>
      </div>
    )}
  </div>
);
}

// Modern Exam Mapping Section - UPDATED with proper file handling
function ModernExamMappingView({ 
  examResults, 
  additionalResultsFiles = [],
  onUpdateExamResults 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedYears, setEditedYears] = useState({});
  const [localAdditionalFiles, setLocalAdditionalFiles] = useState([]);
  const [filesToAdd, setFilesToAdd] = useState([]);
  const [filesToReplace, setFilesToReplace] = useState([]);
  const [filesToRemove, setFilesToRemove] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (examResults) {
      const initialYears = {};
      Object.entries(examResults).forEach(([key, result]) => {
        if (result.year) {
          initialYears[key] = result.year;
        }
      });
      setEditedYears(initialYears);
    }
    
    if (additionalResultsFiles && additionalResultsFiles.length > 0) {
      setLocalAdditionalFiles(additionalResultsFiles.map(file => ({
        ...file,
        isExisting: true,
        id: file.filepath || file.filename || `existing_${Date.now()}_${Math.random()}`,
        isModified: false,
        isRemoved: false,
        isReplaced: false,
        originalFilePath: file.filepath || file.filename
      })));
    }
  }, [examResults, additionalResultsFiles]);

  const handleYearChange = (examKey, year) => {
    setEditedYears(prev => ({
      ...prev,
      [examKey]: year
    }));
  };

  const handleFileYearChange = (id, year) => {
    setLocalAdditionalFiles(prev => prev.map(file => 
      file.id === id ? { 
        ...file, 
        year,
        isModified: true
      } : file
    ));
  };

  const handleFileDescriptionChange = (id, description) => {
    setLocalAdditionalFiles(prev => prev.map(file => 
      file.id === id ? { 
        ...file, 
        description,
        isModified: true
      } : file
    ));
  };

  const handleAddNewFile = (newFiles, isReplacement = false, replaceFileId = null) => {
    const fileObjects = Array.from(newFiles).map((file, index) => ({
      file,
      filename: file.name,
      year: '',
      description: '',
      isNew: true,
      isReplacement: isReplacement,
      replacesFileId: replaceFileId,
      id: `new_${Date.now()}_${index}`,
      filesize: file.size,
      filetype: file.type.split('/')[1] || 'file',
      isModified: true
    }));
    
    if (!isReplacement) {
      setFilesToAdd(prev => [...prev, ...fileObjects.map(f => f.file)]);
    } else {
      setFilesToReplace(prev => [...prev, ...fileObjects.map(f => ({
        newFile: f.file,
        originalFileId: replaceFileId
      }))]);
    }
    
    // Update local files
    if (isReplacement && replaceFileId) {
      setLocalAdditionalFiles(prev => {
        const updated = prev.map(file => 
          file.id === replaceFileId ? { ...file, isReplaced: true } : file
        );
        return [...updated, ...fileObjects];
      });
    } else {
      setLocalAdditionalFiles(prev => [...prev, ...fileObjects]);
    }
    
    toast.success(`${newFiles.length} new file(s) ${isReplacement ? 'replaced' : 'added'}. Fill in year and description.`);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files);
    if (newFiles.length > 0) {
      handleAddNewFile(newFiles, false);
    }
  };

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length > 0) {
      handleAddNewFile(newFiles, false);
      e.target.value = '';
    }
  };

  const handleRemoveLocalFile = (id) => {
    const fileToRemove = localAdditionalFiles.find(f => f.id === id);
    
    if (!fileToRemove) return;
    
    if (fileToRemove.isExisting) {
      // For existing files, mark for removal
      setLocalAdditionalFiles(prev => prev.map(file => 
        file.id === id ? { ...file, isRemoved: true } : file
      ));
      setFilesToRemove(prev => [...prev, fileToRemove]);
      toast.warning('Existing file marked for removal. Save changes to delete permanently.');
    } else {
      // For new files, remove immediately
      setLocalAdditionalFiles(prev => prev.filter(file => file.id !== id));
      
      // Remove from tracking states
      setFilesToAdd(prev => prev.filter(f => 
        f !== fileToRemove.file && 
        f.name !== fileToRemove.filename
      ));
      
      setFilesToReplace(prev => prev.filter(f => 
        f.newFile !== fileToRemove.file &&
        f.originalFileId !== fileToRemove.replacesFileId
      ));
      
      toast.info('New file removed from list.');
    }
  };

  const handleReplaceFile = (id) => {
    const fileToReplace = localAdditionalFiles.find(f => f.id === id);
    
    if (fileToReplace && fileToReplace.isExisting) {
      // Open file dialog for replacement
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.txt';
      input.onchange = (e) => {
        const replacementFile = e.target.files[0];
        if (replacementFile) {
          handleAddNewFile([replacementFile], true, id);
        }
      };
      input.click();
    }
  };

  const handleSaveYears = async () => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      
      // Add year changes for main exam results
      Object.entries(editedYears).forEach(([key, year]) => {
        if (year && year !== (examResults[key]?.year || '')) {
          formData.append(`${key}Year`, year);
        }
      });
      
      // Add new additional files (non-replacements)
      const newAdditionalFiles = localAdditionalFiles.filter(file => 
        file.isNew && file.file && !file.isReplacement && !file.isRemoved
      );
      
      newAdditionalFiles.forEach((fileObj, index) => {
        if (fileObj.file) {
          formData.append(`additionalResultsFile_${index}`, fileObj.file);
          formData.append(`additionalResultsYear_${index}`, fileObj.year || '');
          formData.append(`additionalResultsDesc_${index}`, fileObj.description || '');
        }
      });
      
      // Add replacement files (these replace existing ones)
      const replacementFiles = localAdditionalFiles.filter(file => 
        file.isNew && file.isReplacement && file.file && !file.isRemoved
      );
      
      replacementFiles.forEach((fileObj, index) => {
        if (fileObj.file && fileObj.replacesFileId) {
          const originalFile = localAdditionalFiles.find(f => f.id === fileObj.replacesFileId);
          if (originalFile) {
            formData.append(`additionalResultsFile_${newAdditionalFiles.length + index}`, fileObj.file);
            formData.append(`additionalResultsYear_${newAdditionalFiles.length + index}`, fileObj.year || '');
            formData.append(`additionalResultsDesc_${newAdditionalFiles.length + index}`, fileObj.description || '');
            formData.append(`replacesAdditionalFilepath_${newAdditionalFiles.length + index}`, originalFile.filepath || originalFile.filename);
          }
        }
      });
      
      // Add updates for existing additional files (non-modified, non-removed)
      const existingFilesWithUpdates = localAdditionalFiles.filter(file => 
        file.isExisting && 
        !file.isRemoved && 
        !file.isReplaced &&
        (file.year || file.description || file.isModified)
      );
      
      existingFilesWithUpdates.forEach((fileObj, index) => {
        if (fileObj.filepath || fileObj.filename) {
          formData.append(`existingAdditionalFilepath_${index}`, fileObj.filepath || fileObj.filename);
          formData.append(`existingAdditionalYear_${index}`, fileObj.year || '');
          formData.append(`existingAdditionalDesc_${index}`, fileObj.description || '');
        }
      });
      
      // Handle removed files
      const removedFiles = localAdditionalFiles.filter(file => 
        file.isExisting && file.isRemoved
      );
      
      if (removedFiles.length > 0) {
        formData.append('removedAdditionalFiles', JSON.stringify(
          removedFiles.map(f => ({
            filepath: f.filepath || f.filename,
            filename: f.filename || f.name
          }))
        ));
      }
      
      // Handle replaced files
      const replacedFiles = localAdditionalFiles.filter(file => 
        file.isExisting && file.isReplaced
      );
      
      if (replacedFiles.length > 0) {
        formData.append('cancelledAdditionalFiles', JSON.stringify(
          replacedFiles.map(f => ({
            filepath: f.filepath || f.filename,
            filename: f.filename || f.name
          }))
        ));
      }
      
      // Flag to indicate we're updating additional files
      if (newAdditionalFiles.length > 0 || replacementFiles.length > 0 || 
          existingFilesWithUpdates.length > 0 || removedFiles.length > 0 || replacedFiles.length > 0) {
        formData.append('updateAdditionalFiles', 'true');
      }
      
      console.log('📤 FormData for exam results update:');
      console.log(`  - New files: ${newAdditionalFiles.length}`);
      console.log(`  - Replacement files: ${replacementFiles.length}`);
      console.log(`  - Updated existing files: ${existingFilesWithUpdates.length}`);
      console.log(`  - Removed files: ${removedFiles.length}`);
      console.log(`  - Replaced files: ${replacedFiles.length}`);
      
      await onUpdateExamResults(formData);
      setIsEditing(false);
      // Reset tracking states
      setFilesToAdd([]);
      setFilesToReplace([]);
      setFilesToRemove([]);
      toast.success('Exam results updated successfully!');
    } catch (error) {
      toast.error('Failed to update exam results');
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFilesToAdd([]);
    setFilesToReplace([]);
    setFilesToRemove([]);
    // Reset local additional files to original state
    if (additionalResultsFiles && additionalResultsFiles.length > 0) {
      setLocalAdditionalFiles(additionalResultsFiles.map(file => ({
        ...file,
        isExisting: true,
        id: file.filepath || file.filename,
        isModified: false,
        isRemoved: false,
        isReplaced: false
      })));
    } else {
      setLocalAdditionalFiles([]);
    }
    toast.success('All changes cancelled.');
  };

  const getFileIcon = (filetype) => {
    if (!filetype) return <FaFile className="text-gray-500" />;
    const type = filetype.toLowerCase();
    if (type.includes('pdf')) return <FaFilePdf className="text-red-500" />;
    if (type.includes('image')) return <FaFileAlt className="text-green-500" />;
    if (type.includes('word') || type.includes('doc')) return <FaFileAlt className="text-blue-500" />;
    if (type.includes('excel') || type.includes('sheet') || type.includes('xls')) return <FaFileAlt className="text-green-600" />;
    return <FaFile className="text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Filter files for display (excluding removed ones)
  const displayFiles = localAdditionalFiles.filter(file => !file.isRemoved);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-purple-500 to-indigo-400 flex items-center justify-center shadow-xl shadow-purple-200 ring-4 ring-purple-50">
              <FaAward className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-slate-900">Exam Results Mapping</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-sm font-medium text-slate-500">Verified Academic performance records</p>
              </div>
            </div>
          </div>
          
          {!isEditing && (
            <div className="hidden md:block px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Global Status: Synchronized</p>
            </div>
          )}
        </div>

        {/* Results Grid Mapping */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {Object.entries(examResults).map(([key, result]) => {
            const displayName = key.replace(/([A-Z])/g, ' $1').trim();
            
            return (
              <div
                key={key}
                className="group relative bg-white rounded-3xl p-6 border border-slate-200 hover:border-purple-300 shadow-sm hover:shadow-2xl hover:shadow-purple-100 transition-all duration-500 flex flex-col gap-5 overflow-hidden"
              >
                {/* Subtle Background Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-[100px] -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-500" />

                <div className="relative flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold text-slate-900 truncate group-hover:text-purple-700 transition-colors">
                      {displayName}
                    </h4>
                    <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">
                      Official Transcript
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:rotate-6 transition-all duration-300">
                    <FaFilePdf className="text-purple-500 group-hover:text-white text-xl" />
                  </div>
                </div>

                <div className="relative">
                  {isEditing ? (
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase ml-1">Examination Year</label>
                      <input
                        type="number"
                        min="2000"
                        max="2100"
                        value={editedYears[key] || ''}
                        onChange={(e) => handleYearChange(key, e.target.value)}
                        placeholder="YYYY"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 text-sm font-semibold transition-all outline-none"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-slate-50/50 rounded-2xl px-4 py-3 border border-slate-100">
                      <span className="text-xs font-bold text-slate-400">Year of Completion</span>
                      <span className="text-sm font-black text-slate-900 bg-white px-3 py-1 rounded-lg shadow-sm border border-slate-100">
                        {result.year || '----'}
                      </span>
                    </div>
                  )}
                </div>

                {result.pdf && (
                  <div className="relative space-y-4">
                    <div className="flex items-center gap-3 py-2">
                      <div className="w-1 h-8 rounded-full bg-purple-200" />
                      <p className="text-xs font-medium text-slate-600 truncate">
                        {result.name || `${displayName}_Results.pdf`}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <a
                        href={result.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-purple-200 transition-all shadow-sm"
                      >
                        <FaEye className="text-purple-500" /> View
                      </a>
                      <a
                        href={result.pdf}
                        download
                        className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-purple-600 shadow-lg shadow-slate-200 hover:shadow-purple-200 transition-all"
                      >
                        <FaDownload /> Save
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="pt-8 border-t border-slate-100/80">
          {/* Modern Header & Description Section */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="space-y-4 flex-1">
              {/* Title with Edit Button for Desktop */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 rounded-full bg-gradient-to-t from-amber-600 to-amber-300" />
                  <h4 className="text-lg font-bold tracking-tight text-slate-900">
                    Additional Results Files
                  </h4>
                </div>
                
                {/* Edit Button - Desktop */}
                <div className="hidden sm:block">
                 <button
  onClick={() => setIsEditing(prev => !prev)}
  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200
    ${isEditing
      ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm'
      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}
  `}
>
  {isEditing ? 'Done' : 'Edit  and Add Files'}
</button>

                </div>
              </div>
              
              <p className="text-sm leading-relaxed text-slate-500 max-w-2xl">
                Manage your academic portfolio by organizing supplementary transcripts and examination records. 
                All files are stored securely and can be previewed or downloaded instantly.
              </p>
              
              {/* Edit Button - Mobile (below description) */}
              <div className="sm:hidden pt-2">
              <button
  onClick={() => setIsEditing(prev => !prev)}
  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200
    ${isEditing
      ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm'
      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}
  `}
>
  {isEditing ? 'Done' : 'Edit Files'}
</button>

              </div>
            </div>
            
            <div className="flex items-center gap-2 self-start lg:self-center">
              <div className="flex -space-x-2">
                {/* Decorative file stack effect */}
                {[...Array(Math.min(displayFiles.length, 3))].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-lg border-2 border-white bg-slate-100 flex items-center justify-center shadow-sm">
                    <FaFile className="text-[10px] text-slate-400" />
                  </div>
                ))}
              </div>
              <span className="ml-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
                {displayFiles.length} {displayFiles.length === 1 ? 'Resource' : 'Resources'}
              </span>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-6">
              {/* Upload Area for Edit Mode */}
              <div 
                className="border-2 border-dashed border-amber-300 rounded-3xl p-8 text-center transition-all duration-300 cursor-pointer bg-gradient-to-br from-amber-50/50 to-orange-50/30 hover:border-amber-400 hover:bg-amber-50"
                onDrop={handleFileDrop}
                onDragOver={(e) => { e.preventDefault(); }}
                onDragLeave={(e) => { e.preventDefault(); }}
                onClick={handleFileUploadClick}
              >
                <div className="relative">
                  <FaUpload className="mx-auto text-3xl mb-3 text-amber-500" />
                </div>
                <p className="text-gray-700 mb-1 font-medium text-sm">
                  Click to upload or drag & drop new files
                </p>
                <p className="text-xs text-gray-600">
                  PDF, Images, Documents • Max 50MB each
                </p>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  multiple
                  onChange={handleFileInputChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                />
              </div>

              {/* Files List in Edit Mode */}
              {displayFiles.length > 0 && (
                <div className="space-y-4">
                  <h5 className="text-sm font-bold text-gray-700">
                    Files to be saved ({displayFiles.length} files):
                    {filesToRemove.length > 0 && <span className="ml-2 text-red-600">({filesToRemove.length} marked for deletion)</span>}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayFiles.map((file) => (
                      <div 
                        key={file.id} 
                        className={`bg-white rounded-xl p-4 border ${file.isReplaced ? 'border-yellow-200 bg-yellow-50' : file.isNew ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {getFileIcon(file.filetype)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 text-sm truncate">
                              {file.filename || file.name || 'Document'}
                              {file.isReplaced && <span className="ml-2 text-xs text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded">(Replaced)</span>}
                              {file.isNew && !file.isReplacement && <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">(New)</span>}
                              {file.isNew && file.isReplacement && <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">(Replacement)</span>}
                            </p>
                            <p className="text-xs text-gray-600">
                              {formatFileSize(file.filesize || file.size)} • 
                              {file.isExisting ? ' Existing' : ' New'} • 
                              {file.isModified && ' Modified'}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {file.isExisting && !file.isReplaced ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleReplaceFile(file.id)}
                                  className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                                  title="Replace file"
                                >
                                  <FaUpload className="text-xs" /> Replace
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveLocalFile(file.id)}
                                  className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1"
                                  title="Remove file"
                                >
                                  <FaTrash className="text-xs" /> Delete
                                </button>
                              </>
                            ) : file.isNew ? (
                              <button
                                type="button"
                                onClick={() => handleRemoveLocalFile(file.id)}
                                className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1"
                                title="Remove file"
                              >
                                <FaTimes className="text-xs" /> Remove
                              </button>
                            ) : null}
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">
                              Year
                            </label>
                            <input
                              type="number"
                              min="2000"
                              max="2100"
                              value={file.year || ''}
                              onChange={(e) => handleFileYearChange(file.id, e.target.value)}
                              placeholder="YYYY"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">
                              Description
                            </label>
                            <input
                              type="text"
                              value={file.description || ''}
                              onChange={(e) => handleFileDescriptionChange(file.id, e.target.value)}
                              placeholder="Brief description..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {displayFiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {displayFiles.map((file) => (
                    <div 
                      key={file.id} 
                      className="group bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-amber-200 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="flex items-start gap-4">
                        {/* Modern File Branding */}
                        <div className={`relative w-12 h-14 rounded-xl flex flex-col items-center justify-center transition-transform group-hover:scale-110 duration-300 ${
                          file.filetype === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'
                        }`}>
                          <FaFilePdf className="text-xl" />
                          <span className="absolute -bottom-1 text-[8px] font-black uppercase px-1 rounded bg-white border shadow-sm">
                            {file.filetype || 'FILE'}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h5 className="text-sm font-bold text-slate-800 truncate max-w-[140px]">
                              {file.filename || file.name || 'Document'}
                              {file.isNew && <span className="ml-1 text-[10px] text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">NEW</span>}
                            </h5>
                            {file.year && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white">
                                {file.year}
                              </span>
                            )}
                          </div>
                          
                          {file.description && (
                            <p className="text-[11px] text-slate-500 line-clamp-2 mb-2 leading-snug">
                              {file.description}
                            </p>
                          )}

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-medium text-slate-400">
                              {formatFileSize(file.filesize || file.size)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {file.filepath ? (
                        <div className="mt-5 grid grid-cols-2 gap-2">
                          <a
                            href={file.filepath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 py-2 text-[11px] font-bold rounded-lg bg-slate-50 text-slate-700 border border-slate-100 hover:bg-slate-100 transition-colors"
                          >
                            <FaExternalLinkAlt className="text-[10px]" />
                            Preview
                          </a>

                          <a
                            href={file.filepath}
                            download={file.filename || 'document.pdf'}
                            className="flex items-center justify-center gap-2 py-2 text-[11px] font-bold rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-200 hover:brightness-110 transition-all"
                          >
                            <FaDownload className="text-[10px]" />
                            Get File
                          </a>
                        </div>
                      ) : file.file && file.isNew ? (
                        <div className="mt-4 flex items-center gap-2">
                          <button
                            onClick={() => handleRemoveLocalFile(file.id)}
                            className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg font-bold hover:bg-red-200 transition-colors"
                          >
                            Remove
                          </button>
                          <a
                            href={URL.createObjectURL(file.file)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 text-xs bg-white border border-slate-200 rounded-lg font-bold hover:bg-slate-50 transition-colors"
                          >
                            Preview
                          </a>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-16 px-4 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-inner mb-4">
                    <FaFile className="text-slate-200 text-3xl" />
                  </div>
                  <h5 className="text-slate-900 font-bold">No documents attached</h5>
                  <p className="text-slate-400 text-xs mt-2 max-w-xs mx-auto leading-relaxed">
                    Your supplementary result files will appear here once uploaded in the editor.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {isEditing && (
          <div className="flex justify-end gap-3 pt-5 border-t border-gray-100 mt-6">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-bold cursor-pointer text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveYears}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition duration-200 font-bold shadow disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm flex items-center gap-2"
            >
              {loading ? (
                <>
                  <CircularProgress size={16} className="text-white" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FaSave className="text-sm" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Hidden file input for replacements */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
        onChange={handleFileInputChange}
      />
    </div>
  );
}


// Customizable Fee Breakdown Component
function CustomFeeBreakdown({ 
  title, 
  color, 
  fees = [], 
  onFeesChange, 
  totalField,
  onTotalChange 
}) {
  const [newFeeName, setNewFeeName] = useState('');
  const [newFeeAmount, setNewFeeAmount] = useState('');

  const calculatedTotal = fees.reduce((sum, fee) => sum + (parseFloat(fee.amount) || 0), 0);

  useEffect(() => {
    if (onTotalChange && Math.abs(calculatedTotal - (parseFloat(totalField) || 0)) > 0.01) {
      onTotalChange(calculatedTotal.toString());
    }
  }, [calculatedTotal, totalField, onTotalChange]);

  const handleAddFee = () => {
    if (newFeeName.trim() && newFeeAmount) {
      const newFee = {
        name: newFeeName.trim(),
        amount: parseFloat(newFeeAmount) || 0
      };
      
      onFeesChange([...fees, newFee]);
      setNewFeeName('');
      setNewFeeAmount('');
    }
  };

  const handleRemoveFee = (index) => {
    const updatedFees = fees.filter((_, i) => i !== index);
    onFeesChange(updatedFees);
  };

  const updateFeeAmount = (index, amount) => {
    const updatedFees = [...fees];
    updatedFees[index] = { 
      ...updatedFees[index], 
      amount: parseFloat(amount) || 0 
    };
    onFeesChange(updatedFees);
  };

  const updateFeeName = (index, name) => {
    const updatedFees = [...fees];
    updatedFees[index] = { 
      ...updatedFees[index], 
      name: name.trim() 
    };
    onFeesChange(updatedFees);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newFeeName && newFeeAmount) {
      e.preventDefault();
      handleAddFee();
    }
  };

  return (
    <div className={`bg-gradient-to-br ${color} rounded-lg p-4 border ${color.includes('green') ? 'border-green-200' : color.includes('blue') ? 'border-blue-200' : 'border-orange-200'}`}>
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-gray-900 text-sm">{title} Breakdown</h4>
        <div className="text-sm font-bold text-gray-700">
          Total: KES {calculatedTotal.toLocaleString()}
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-3 mb-4 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">
              Fee Name
            </label>
            <input
              type="text"
              value={newFeeName}
              onChange={(e) => setNewFeeName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Tuition, Activity, Library"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">
              Amount (KES)
            </label>
            <input
              type="number"
              min="0"
              value={newFeeAmount}
              onChange={(e) => setNewFeeAmount(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter amount"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleAddFee}
              disabled={!newFeeName.trim() || !newFeeAmount}
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <FaPlus className="inline mr-1" /> Add Fee
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {fees.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            No fees added yet. Add your first fee item above.
          </div>
        ) : (
          fees.map((fee, index) => (
            <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <input
                    type="text"
                    value={fee.name}
                    onChange={(e) => updateFeeName(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium"
                  />
                </div>
                
                <div>
                  <input
                    type="number"
                    min="0"
                    value={fee.amount || ''}
                    onChange={(e) => updateFeeAmount(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">
                    KES {(parseFloat(fee.amount) || 0).toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFee(index)}
                    className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                    title="Remove fee"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Additional Files Upload Component
function AdditionalFilesUpload({ files, onFilesChange, label = "Additional Files" }) {
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length > 0) {
      onFilesChange([...files, ...newFiles]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const newFiles = Array.from(e.dataTransfer.files);
    if (newFiles.length > 0) {
      onFilesChange([...files, ...newFiles]);
    }
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    onFilesChange(updatedFiles);
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return <FaFilePdf className="text-red-500" />;
    if (fileType.includes('image')) return <FaFileAlt className="text-green-500" />;
    if (fileType.includes('video')) return <FaFileVideo className="text-blue-500" />;
    if (fileType.includes('audio')) return <FaFileAudio className="text-purple-500" />;
    return <FaFile className="text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <FaPaperclip className="text-gray-500" />
          <span>{label}</span>
        </label>
        <button
          type="button"
          onClick={() => document.getElementById('additional-files-upload').click()}
          className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-200 font-bold shadow cursor-pointer text-xs"
        >
          <FaPlus className="text-xs" /> Add File
        </button>
      </div>

      <div
        className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-300 cursor-pointer group ${
          dragOver 
            ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100' 
            : 'border-gray-300 hover:border-blue-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-sm'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => document.getElementById('additional-files-upload').click()}
      >
        <div className="relative">
          <FaUpload className={`mx-auto text-2xl mb-2 transition-all duration-300 ${
            dragOver ? 'text-blue-500 scale-110' : 'text-gray-400 group-hover:text-blue-500'
          }`} />
        </div>
        <p className="text-gray-700 mb-1 font-medium transition-colors duration-300 group-hover:text-gray-800 text-sm">
          {dragOver ? '📁 Drop files here!' : 'Drag & drop or click to upload additional files'}
        </p>
        <p className="text-xs text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
          PDF, Images, Videos • Max 20MB each
        </p>
        <input 
          type="file" 
          multiple
          onChange={handleFileChange} 
          className="hidden" 
          id="additional-files-upload" 
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {files.map((file, index) => (
            <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getFileIcon(file.type)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm truncate max-w-[180px]">{file.name}</p>
                    <p className="text-xs text-gray-600">{formatFileSize(file.size)} • {file.type}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                  title="Remove file"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// VideoModal Component
function VideoModal({ open, onClose, videoType, videoPath, videoThumbnail }) {
  const extractYouTubeId = (url) => {
    if (!url || typeof url !== 'string') return null;
    
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

  const videoId = videoType === 'youtube' ? extractYouTubeId(videoPath) : null;

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl bg-black rounded-lg overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-black bg-opacity-70 text-white rounded-full w-8 h-8 flex items-center justify-center z-10 hover:bg-opacity-100 transition"
        >
          ✕
        </button>
        
        {videoType === 'youtube' && videoId && (
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="School Video Tour"
            />
          </div>
        )}
        
        {videoType === 'file' && videoPath && (
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <video
              controls
              autoPlay
              className="absolute top-0 left-0 w-full h-full"
              src={videoPath}
              poster={videoThumbnail}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}
        
        {(!videoPath || !videoId) && videoType === 'youtube' && (
          <div className="p-8 text-center text-white">
            <FaVideo className="text-4xl mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400">No video available</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Modern Delete Confirmation Modal
function ModernDeleteModal({ onClose, onConfirm, loading }) {
  const [confirmText, setConfirmText] = useState('')

  const handleConfirm = () => {
    if (confirmText === "DELETE SCHOOL INFO") {
      onConfirm()
    } else {
      toast.error('Please type "DELETE SCHOOL INFO" exactly to confirm deletion')
    }
  }

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
            <p className="text-gray-600 text-xs">This will permanently delete ALL school information and all uploaded files.</p>
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
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 text-sm"
            />
          </div>

          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-2 border border-red-200">
            <h4 className="font-bold text-gray-900 text-xs mb-1 flex items-center gap-1">
              <FaExclamationTriangle className="text-red-600 text-xs" />
              What will be deleted:
            </h4>
            <div className="space-y-0.5 text-xs text-gray-700">
              {[
                'All school information',
                'Video tours and media',
                'Curriculum PDF',
                'Fee structure PDFs',
                'Admission information',
                'All exam results PDFs',
                'Contact details'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 p-3 border-t border-gray-200 bg-gray-50">
          <button 
            onClick={onClose} 
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border-2 border-gray-300 text-gray-700 rounded-lg transition-all duration-300 font-bold disabled:opacity-50 cursor-pointer text-sm"
          >
            <FaTimesCircle className="text-sm" /> Cancel
          </button>
          <button 
            onClick={handleConfirm} 
            disabled={loading || confirmText !== "DELETE SCHOOL INFO"}
            className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-red-600 to-orange-600 text-white px-3 py-2 rounded-lg transition-all duration-300 font-bold shadow disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
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
  )
}

// Video Thumbnail Component
function VideoThumbnail({ videoType, videoPath, videoThumbnail, onClick }) {
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

  const thumbnail = videoType === 'youtube' 
    ? getYouTubeThumbnail(videoPath) 
    : videoThumbnail || '/cumpus.jpg';

  return (
    <div 
      className="relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow max-w-md"
      onClick={onClick}
    >
      <div className="relative pb-[56.25%]">
        {thumbnail ? (
          <img 
            src={thumbnail}
            alt="Video Thumbnail" 
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <FaVideo className={`text-4xl ${videoType === 'youtube' ? 'text-red-500' : 'text-blue-500'}`} />
          </div>
        )}
        
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center hover:bg-opacity-20 transition">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${videoType === 'youtube' ? 'bg-red-600' : 'bg-blue-600'}`}>
            <FaPlay className="text-white ml-1" />
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          {videoType === 'youtube' ? (
            <>
              <FaYoutube className="text-red-500" />
              <span className="text-sm font-medium text-gray-700">YouTube Video</span>
            </>
          ) : (
            <>
              <FaVideo className="text-blue-500" />
              <span className="text-sm font-medium text-gray-700">School Video</span>
            </>
          )}
        </div>
        <span className="text-sm text-blue-600 font-medium hover:text-blue-800 transition">
          Watch Now
        </span>
      </div>
    </div>
  );
}

// School API Service
const schoolApiService = {
  async getSchoolInfo() {
    const response = await fetch('/api/school')
    if (!response.ok) throw new Error('Failed to fetch school information')
    const data = await response.json()
    return data.school
  },

  async createSchoolInfo(formData) {
    const response = await fetch('/api/school', {
      method: 'POST',
      body: formData,
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to create school information')
    }
    return await response.json()
  },

  async updateSchoolInfo(formData) {
    const response = await fetch('/api/school', {
      method: 'PUT',
      body: formData,
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to update school information')
    }
    return await response.json()
  },

  async deleteSchoolInfo() {
    const response = await fetch('/api/school', {
      method: 'DELETE',
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to delete school information')
    }
    return await response.json()
  }
}

// Modern School Info Modal with 3 steps
function ModernSchoolModal({ onClose, onSave, school, loading }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    name: school?.name || '',
    description: school?.description || '',
    motto: school?.motto || '',
    vision: school?.vision || '',
    mission: school?.mission || '',
    studentCount: school?.studentCount?.toString() || '',
    staffCount: school?.staffCount?.toString() || '',
    openDate: school?.openDate ? new Date(school.openDate).toISOString().split('T')[0] : '',
    closeDate: school?.closeDate ? new Date(school.closeDate).toISOString().split('T')[0] : '',
    subjects: school?.subjects || [],
    departments: school?.departments || [],
    youtubeLink: school?.videoType === 'youtube' ? school.videoTour : '',
    feesDay: school?.feesDay?.toString() || '',
    feesDayDistributionJson: school?.feesDayDistribution ? JSON.stringify(school.feesDayDistribution) : '[]',
    feesBoarding: school?.feesBoarding?.toString() || '',
    feesBoardingDistributionJson: school?.feesBoardingDistribution ? JSON.stringify(school.feesBoardingDistribution) : '[]',
    admissionOpenDate: school?.admissionOpenDate ? new Date(school.admissionOpenDate).toISOString().split('T')[0] : '',
    admissionCloseDate: school?.admissionCloseDate ? new Date(school.admissionCloseDate).toISOString().split('T')[0] : '',
    admissionRequirements: school?.admissionRequirements || '',
    admissionFee: school?.admissionFee?.toString() || '',
    admissionFeeDistribution: school?.admissionFeeDistribution ? JSON.stringify(school.admissionFeeDistribution) : '[]',
    admissionCapacity: school?.admissionCapacity?.toString() || '',
    admissionContactEmail: school?.admissionContactEmail || '',
    admissionContactPhone: school?.admissionContactPhone || '',
    admissionWebsite: school?.admissionWebsite || '',
    admissionLocation: school?.admissionLocation || '',
    admissionOfficeHours: school?.admissionOfficeHours || '',
    admissionDocumentsRequired: school?.admissionDocumentsRequired || []
  })

  const [files, setFiles] = useState({
    videoFile: null,
    curriculumPDF: null,
    feesDayDistributionPdf: null,
    feesBoardingDistributionPdf: null,
    admissionFeePdf: null,
    form1ResultsPdf: null,
    form2ResultsPdf: null,
    form3ResultsPdf: null,
    form4ResultsPdf: null,
    mockExamsResultsPdf: null,
    kcseResultsPdf: null
  })

  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [cancelledExistingFiles, setCancelledExistingFiles] = useState([]);
  const [cancelledPdfs, setCancelledPdfs] = useState({});
  const [cancelledVideo, setCancelledVideo] = useState(false);
  const [replacedPdfs, setReplacedPdfs] = useState({});
  
  const [removedPdfs, setRemovedPdfs] = useState({});
  const [removedVideo, setRemovedVideo] = useState(false);
  const [removedAdditionalFiles, setRemovedAdditionalFiles] = useState([]);

  const [examYears, setExamYears] = useState({
    form1ResultsYear: school?.examResults?.form1?.year?.toString() || '',
    form2ResultsYear: school?.examResults?.form2?.year?.toString() || '',
    form3ResultsYear: school?.examResults?.form3?.year?.toString() || '',
    form4ResultsYear: school?.examResults?.form4?.year?.toString() || '',
    mockExamsYear: school?.examResults?.mockExams?.year?.toString() || '',
    kcseYear: school?.examResults?.kcse?.year?.toString() || ''
  })

  const [selectedThumbnail, setSelectedThumbnail] = useState(null);

  const [dayFees, setDayFees] = useState(
    school?.feesDayDistribution && Object.keys(school.feesDayDistribution).length > 0 
      ? Object.entries(school.feesDayDistribution).map(([name, amount]) => ({ name, amount }))
      : []
  );

  const [boardingFees, setBoardingFees] = useState(
    school?.feesBoardingDistribution && Object.keys(school.feesBoardingDistribution).length > 0 
      ? Object.entries(school.feesBoardingDistribution).map(([name, amount]) => ({ name, amount }))
      : []
  );

  const [admissionFees, setAdmissionFees] = useState(
    school?.admissionFeeDistribution && Object.keys(school.admissionFeeDistribution).length > 0 
      ? Object.entries(school.admissionFeeDistribution).map(([name, amount]) => ({ name, amount }))
      : []
  );

  const steps = [
    { 
      id: 'basic', 
      label: 'Basic Info', 
      icon: FaBuilding, 
      description: 'School identity and values' 
    },
    { 
      id: 'academic', 
      label: 'Academic', 
      icon: FaGraduationCap, 
      description: 'Academic calendar and media' 
    },
    { 
      id: 'financial', 
      label: 'Financial & Admission', 
      icon: FaDollarSign, 
      description: 'Fees and admission details' 
    }
  ]

  useEffect(() => {
    if (school?.videoType === 'file' && school?.videoTour) {
      setFormData(prev => ({ ...prev, youtubeLink: '' }))
    }
  }, [school])

  const handleCancelExistingPdf = (pdfField) => {
    console.log(`Cancelling PDF: ${pdfField}`);
    setCancelledPdfs(prev => ({ ...prev, [pdfField]: true }));
    setReplacedPdfs(prev => ({ ...prev, [pdfField]: true }));
    setFiles(prev => ({ ...prev, [pdfField]: null }));
    toast.success(`Existing PDF marked for replacement. Select a new file.`);
  };

  const handleRemoveExistingPdf = (pdfField) => {
    console.log(`Removing PDF: ${pdfField}`);
    setRemovedPdfs(prev => ({ ...prev, [pdfField]: true }));
    setReplacedPdfs(prev => ({ ...prev, [pdfField]: true }));
    setFiles(prev => ({ ...prev, [pdfField]: null }));
    toast.success(`Existing PDF marked for removal. Save changes to confirm.`);
  };

  const handleCancelExistingVideo = () => {
    console.log('Cancelling existing video');
    setCancelledVideo(true);
    setFiles(prev => ({ ...prev, videoFile: null }));
    setSelectedThumbnail(null);
    setFormData(prev => ({ ...prev, youtubeLink: '' }));
    toast.success('Existing video marked for replacement. Select a new video.');
  };

  const handleRemoveExistingVideo = () => {
    console.log('Removing existing video');
    setRemovedVideo(true);
    setFiles(prev => ({ ...prev, videoFile: null }));
    setSelectedThumbnail(null);
    setFormData(prev => ({ ...prev, youtubeLink: '' }));
    toast.success('Existing video marked for removal. Save changes to confirm.');
  };

  const handleCancelExistingAdditionalFile = (file) => {
    console.log('Cancelling existing additional file:', file);
    setCancelledExistingFiles(prev => [...prev, file]);
    setAdditionalFiles(prev => prev.filter(f => 
      f.filepath !== file.filepath && f.filename !== file.filename
    ));
    toast.success('Additional file marked for removal. Select a new file.');
  };

  const handleRemoveExistingAdditionalFile = (file) => {
    console.log('Removing existing additional file:', file);
    setRemovedAdditionalFiles(prev => [...prev, file]);
    setAdditionalFiles(prev => prev.filter(f => 
      f.filepath !== file.filepath && f.filename !== file.filename
    ));
    toast.success('Additional file marked for removal. Save changes to confirm.');
  };

  const shouldShowExistingPdf = (pdfField) => {
    if (replacedPdfs[pdfField]) {
      return false;
    }
    
    if (files[pdfField]) {
      return false;
    }
    
    return true;
  };

  const getExistingPdfData = (pdfField) => {
    if (!shouldShowExistingPdf(pdfField)) {
      return null;
    }
    
    switch (pdfField) {
      case 'curriculumPDF':
        return school?.curriculumPDF ? {
          name: school.curriculumPdfName,
          filename: school.curriculumPdfName,
          size: school.curriculumPdfSize
        } : null;
        
      case 'feesDayDistributionPdf':
        return school?.feesDayDistributionPdf ? {
          name: school.feesDayPdfName,
          filename: school.feesDayPdfName,
          size: school.feesDayPdfSize
        } : null;
        
      case 'feesBoardingDistributionPdf':
        return school?.feesBoardingDistributionPdf ? {
          name: school.feesBoardingPdfName,
          filename: school.feesBoardingPdfName,
          size: school.feesBoardingPdfSize
        } : null;
        
      case 'admissionFeePdf':
        return school?.admissionFeePdf ? {
          name: school.admissionFeePdfName,
          filename: school.admissionFeePdfName,
          size: null
        } : null;
        
      case 'form1ResultsPdf':
        return school?.examResults?.form1?.pdf ? {
          name: school.examResults.form1.name,
          filename: school.examResults.form1.name,
          size: school.examResults.form1.size
        } : null;
        
      case 'form2ResultsPdf':
        return school?.examResults?.form2?.pdf ? {
          name: school.examResults.form2.name,
          filename: school.examResults.form2.name,
          size: school.examResults.form2.size
        } : null;
        
      case 'form3ResultsPdf':
        return school?.examResults?.form3?.pdf ? {
          name: school.examResults.form3.name,
          filename: school.examResults.form3.name,
          size: school.examResults.form3.size
        } : null;
        
      case 'form4ResultsPdf':
        return school?.examResults?.form4?.pdf ? {
          name: school.examResults.form4.name,
          filename: school.examResults.form4.name,
          size: school.examResults.form4.size
        } : null;
        
      case 'mockExamsResultsPdf':
        return school?.examResults?.mockExams?.pdf ? {
          name: school.examResults.mockExams.name,
          filename: school.examResults.mockExams.name,
          size: school.examResults.mockExams.size
        } : null;
        
      case 'kcseResultsPdf':
        return school?.examResults?.kcse?.pdf ? {
          name: school.examResults.kcse.name,
          filename: school.examResults.kcse.name,
          size: school.examResults.kcse.size
        } : null;
        
      default:
        return null;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    
    if (currentStep < steps.length - 1) {
      return
    }

    try {
      const formDataToSend = new FormData()
      
      Object.keys(formData).forEach(key => {
        if (key === 'subjects' || key === 'departments' || key === 'admissionDocumentsRequired') {
          const items = formData[key]
          if (Array.isArray(items) && items.length > 0) {
            formDataToSend.append(key, JSON.stringify(items))
          }
        } else if (key === 'youtubeLink') {
          if (formData.youtubeLink.trim()) {
            formDataToSend.append('youtubeLink', formData.youtubeLink.trim())
          }
        } else if (key.includes('DistributionJson') || key === 'admissionFeeDistribution') {
          let feeObject = {};
          if (key === 'feesDayDistributionJson') {
            dayFees.forEach(fee => {
              feeObject[fee.name] = fee.amount;
            });
          } else if (key === 'feesBoardingDistributionJson') {
            boardingFees.forEach(fee => {
              feeObject[fee.name] = fee.amount;
            });
          } else if (key === 'admissionFeeDistribution') {
            admissionFees.forEach(fee => {
              feeObject[fee.name] = fee.amount;
            });
          }
          
          if (Object.keys(feeObject).length > 0) {
            formDataToSend.append(key, JSON.stringify(feeObject));
          }
        } else {
          formDataToSend.append(key, formData[key] || '')
        }
      })

      if (files.videoFile) {
        formDataToSend.append('videoTour', files.videoFile)
        
        if (selectedThumbnail && !formData.youtubeLink.trim()) {
          if (selectedThumbnail instanceof File) {
            formDataToSend.append('videoThumbnail', selectedThumbnail)
          }
        }
      }

      if (cancelledVideo) {
        formDataToSend.append('cancelVideo', 'true');
      }

      if (removedVideo) {
        formDataToSend.append('removeVideo', 'true');
      }

      const pdfFields = [
        'curriculumPDF',
        'feesDayDistributionPdf',
        'feesBoardingDistributionPdf',
        'admissionFeePdf',
        'form1ResultsPdf',
        'form2ResultsPdf',
        'form3ResultsPdf',
        'form4ResultsPdf',
        'mockExamsResultsPdf',
        'kcseResultsPdf'
      ]

      pdfFields.forEach(field => {
        if (files[field]) {
          formDataToSend.append(field, files[field])
        }
        if (cancelledPdfs[field]) {
          formDataToSend.append(`cancel_${field}`, 'true');
        }
        if (removedPdfs[field]) {
          formDataToSend.append(`remove_${field}`, 'true');
        }
      })

      const newAdditionalFiles = additionalFiles.filter(file => file.isNew && file.file);
      newAdditionalFiles.forEach((fileObj, index) => {
        if (fileObj.file) {
          formDataToSend.append(`additionalResultsFile_${index}`, fileObj.file);
          if (fileObj.year || fileObj.description) {
            formDataToSend.append(`additionalResultsYear_${index}`, fileObj.year || '');
            formDataToSend.append(`additionalResultsDesc_${index}`, fileObj.description || '');
          }
        }
      });

      const existingFilesWithUpdates = additionalFiles.filter(file => 
        file.isExisting && (file.year || file.description || file.isModified)
      );

      existingFilesWithUpdates.forEach((fileObj, index) => {
        if (fileObj.filepath || fileObj.filename) {
          formDataToSend.append(`existingAdditionalFilepath_${index}`, fileObj.filepath || fileObj.filename);
          formDataToSend.append(`existingAdditionalYear_${index}`, fileObj.year || '');
          formDataToSend.append(`existingAdditionalDesc_${index}`, fileObj.description || '');
        }
      });

      if (cancelledExistingFiles.length > 0) {
        formDataToSend.append('cancelledAdditionalFiles', JSON.stringify(
          cancelledExistingFiles.map(f => ({
            filepath: f.filepath || f.filename,
            filename: f.filename || f.name
          }))
        ));
      }

      if (removedAdditionalFiles.length > 0) {
        formDataToSend.append('removedAdditionalFiles', JSON.stringify(
          removedAdditionalFiles.map(f => ({
            filepath: f.filepath || f.filename,
            filename: f.filename || f.name
          }))
        ));
      }

      if (newAdditionalFiles.length > 0 || existingFilesWithUpdates.length > 0 || cancelledExistingFiles.length > 0 || removedAdditionalFiles.length > 0) {
        formDataToSend.append('updateAdditionalFiles', 'true');
      }

      Object.keys(examYears).forEach(yearField => {
        if (examYears[yearField]) {
          formDataToSend.append(yearField, examYears[yearField])
        }
      })

      console.log('FormData contents for debugging:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      await onSave(formDataToSend)
    } catch (error) {
      console.error('Form submission error:', error);
      throw error
    }
  }

  const handleNextStep = (e) => {
    e.preventDefault()
    if (currentStep < steps.length - 1 && isStepValid()) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevStep = (e) => {
    e.preventDefault()
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleTagsChange = (field, tags) => {
    setFormData(prev => ({ ...prev, [field]: tags }))
  }

  const handleExamYearChange = (field, value) => {
    setExamYears(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field, file) => {
    console.log(`File changed for ${field}:`, file?.name);
    setFiles(prev => ({ ...prev, [field]: file }));
    
    if (file) {
      setReplacedPdfs(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  }

  const handleFileRemove = (field) => {
    console.log(`Removing file from ${field}`);
    setFiles(prev => ({ ...prev, [field]: null }));
  }

  const handleVideoRemove = () => {
    console.log('Removing video file');
    setFiles(prev => ({ ...prev, videoFile: null }));
    setFormData(prev => ({ 
      ...prev, 
      youtubeLink: '' 
    }));
    setSelectedThumbnail(null);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.name.trim() && formData.studentCount.trim() && formData.staffCount.trim()
      case 1:
        return formData.openDate.trim() && formData.closeDate.trim()
      case 2:
        return true
      default:
        return true
    }
  }

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '95vw',
        maxWidth: '1080px',
        maxHeight: '95vh',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <FaSchool className="text-lg" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold">{school ? 'Update School Information' : 'Create School Information'}</h2>
                <p className="text-blue-100 opacity-90 text-xs mt-0.5">
                  Step {currentStep + 1} of {steps.length}: {steps[currentStep].description}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200 cursor-pointer">
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        <div className="bg-white border-b border-gray-200 p-3">
          <div className="flex flex-wrap justify-center items-center gap-2 md:space-x-3">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(index)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 text-sm ${
                    index === currentStep 
                      ? 'bg-blue-500 text-white shadow' 
                      : index < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <step.icon className="text-xs" />
                  <span className="font-bold">{step.label}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className={`w-4 h-0.5 mx-1.5 md:w-6 ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="max-h-[calc(95vh-160px)] overflow-y-auto scrollbar-custom p-2 md:p-4">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">
                        School Name <span className="text-red-500">*</span>
                      </label>
                   <TextField
  fullWidth
  value={formData.name}
  onChange={(e) => handleChange('name', e.target.value)}
  placeholder="Enter school name..."
  required
  sx={{
    '& .MuiOutlinedInput-root': {
      width: '100%',
      fontSize: '1rem',               // text-base
      paddingLeft: '0px',             // handled by input
      borderRadius: '12px',            // rounded-xl
      backgroundColor: '#fff',

      '& fieldset': {
        borderWidth: '2px',            // border-2
        borderColor: '#d1d5db',         // border-gray-300
      },

      '&:hover fieldset': {
        borderColor: '#d1d5db',
      },

      '&.Mui-focused fieldset': {
        borderColor: '#6366f1',         // indigo-500
      },
    },

    '& .MuiOutlinedInput-input': {
      padding: '14px 16px',             // py-3.5 px-4
    },
  }}
/>

                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">
                        Student Count <span className="text-red-500">*</span>
                      </label>
                    <TextField
  fullWidth
  type="number"
  inputProps={{ min: 1 }}
  value={formData.studentCount}
  onChange={(e) => handleChange('studentCount', e.target.value)}
  placeholder="Enter number of students..."
  required
  sx={{
    '& .MuiOutlinedInput-root': {
      fontSize: '1rem',
      borderRadius: '12px',
      backgroundColor: '#fff',

      '& fieldset': {
        borderWidth: '2px',
        borderColor: '#d1d5db',
      },

      '&:hover fieldset': {
        borderColor: '#d1d5db',
      },

      '&.Mui-focused fieldset': {
        borderColor: '#6366f1',
      },

      '&.Mui-focused': {
        boxShadow: '0 0 0 1px #6366f1',
      },
    },

    '& .MuiOutlinedInput-input': {
      padding: '14px 16px',
    },
  }}
/>

                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">
                        Staff Count <span className="text-red-500">*</span>
                      </label>
                   <TextField
  fullWidth
  type="number"
  inputProps={{ min: 1 }}
  value={formData.staffCount}
  onChange={(e) => handleChange('staffCount', e.target.value)}
  placeholder="Enter number of staff..."
  required
  sx={{
    '& .MuiOutlinedInput-root': {
      fontSize: '1rem',
      borderRadius: '12px',
      backgroundColor: '#fff',

      '& fieldset': {
        borderWidth: '2px',
        borderColor: '#d1d5db',
      },

      '&:hover fieldset': {
        borderColor: '#d1d5db',
      },

      '&.Mui-focused fieldset': {
        borderColor: '#6366f1',
      },

      '&.Mui-focused': {
        boxShadow: '0 0 0 1px #6366f1',
      },
    },

    '& .MuiOutlinedInput-input': {
      padding: '14px 16px',
    },
  }}
/>

                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">
                        School Motto
                      </label>
                  <TextField
  fullWidth
  value={formData.motto}
  onChange={(e) => handleChange('motto', e.target.value)}
  placeholder="Enter school motto..."
  sx={{
    '& .MuiOutlinedInput-root': {
      fontSize: '1rem',
      borderRadius: '12px',
      backgroundColor: '#fff',

      '& fieldset': {
        borderWidth: '2px',
        borderColor: '#d1d5db',
      },

      '&:hover fieldset': {
        borderColor: '#d1d5db',
      },

      '&.Mui-focused fieldset': {
        borderColor: '#6366f1',
      },

      '&.Mui-focused': {
        boxShadow: '0 0 0 1px #6366f1',
      },
    },

    '& .MuiOutlinedInput-input': {
      padding: '14px 16px',
    },
  }}
/>

                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">
                        Vision Statement
                      </label>
             <TextareaAutosize
  minRows={2}
  value={formData.vision}
  onChange={(e) => handleChange('vision', e.target.value)}
  placeholder="Enter vision statement..."
  style={{
    width: '100%',
    padding: '14px 16px',           // py-3.5 px-4
    fontSize: '1rem',               // text-base
    fontFamily: 'inherit',
    borderRadius: '12px',           // rounded-xl
    border: '2px solid #d1d5db',    // border-gray-300
    backgroundColor: '#fff',
    resize: 'none',
    outline: 'none',
  }}
  onFocus={(e) => {
    e.target.style.borderColor = '#6366f1';     // indigo-500
    e.target.style.boxShadow = '0 0 0 1px #6366f1';
  }}
  onBlur={(e) => {
    e.target.style.borderColor = '#d1d5db';
    e.target.style.boxShadow = 'none';
  }}
/>

                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">
                        Mission Statement
                      </label>
                <TextareaAutosize
  minRows={2}
  value={formData.mission}
  onChange={(e) => handleChange('mission', e.target.value)}
  placeholder="Enter mission statement..."
  style={{
    width: '100%',
    padding: '14px 16px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    borderRadius: '12px',
    border: '2px solid #d1d5db',
    backgroundColor: '#fff',
    resize: 'none',
    outline: 'none',
  }}
  onFocus={(e) => {
    e.target.style.borderColor = '#6366f1';
    e.target.style.boxShadow = '0 0 0 1px #6366f1';
  }}
  onBlur={(e) => {
    e.target.style.borderColor = '#d1d5db';
    e.target.style.boxShadow = 'none';
  }}
/>

                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    School Description
                  </label>
             <TextareaAutosize
  minRows={3}
  value={formData.description}
  onChange={(e) => handleChange('description', e.target.value)}
  placeholder="Describe your school... Write about history, achievements, facilities, etc."
  style={{
    width: '100%',
    padding: '14px 16px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    borderRadius: '12px',
    border: '2px solid #d1d5db',
    backgroundColor: '#fff',
    resize: 'none',
    outline: 'none',
  }}
  onFocus={(e) => {
    e.target.style.borderColor = '#6366f1';
    e.target.style.boxShadow = '0 0 0 1px #6366f1';
  }}
  onBlur={(e) => {
    e.target.style.borderColor = '#d1d5db';
    e.target.style.boxShadow = 'none';
  }}
/>

                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FaCalendar className="text-blue-600" />
                        Academic Calendar
                      </h3>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1.5">
                            Opening Date <span className="text-red-500">*</span>
                          </label>
                          <TextField 
                            fullWidth 
                            size="small"
                            type="date"
                            value={formData.openDate} 
                            onChange={(e) => handleChange('openDate', e.target.value)}
                            required
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                backgroundColor: 'white',
                                fontSize: '0.875rem'
                              }
                            }}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1.5">
                            Closing Date <span className="text-red-500">*</span>
                          </label>
                          <TextField 
                            fullWidth 
                            size="small"
                            type="date"
                            value={formData.closeDate} 
                            onChange={(e) => handleChange('closeDate', e.target.value)}
                            required
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                backgroundColor: 'white',
                                fontSize: '0.875rem'
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FaBook className="text-purple-600" />
                        Academic Programs
                      </h3>
                      
                      <div className="space-y-3">
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
                  
                  <div className="space-y-4">
                    <ModernVideoUpload 
                      videoType={school?.videoType}
                      videoPath={school?.videoTour}
                      youtubeLink={formData.youtubeLink}
                      onVideoChange={(file) => handleFileChange('videoFile', file)}
                      onYoutubeLinkChange={(link) => handleChange('youtubeLink', link)}
                      onRemove={handleVideoRemove}
                      onThumbnailSelect={setSelectedThumbnail}
                      label="School Video Tour"
                      existingVideo={school?.videoTour && !cancelledVideo && !removedVideo ? school.videoTour : null}
                      onCancelExisting={handleCancelExistingVideo}
                      onRemoveExisting={handleRemoveExistingVideo}
                    />

                    <ModernPdfUpload 
                      pdfFile={files.curriculumPDF}
                      onPdfChange={(file) => handleFileChange('curriculumPDF', file)}
                      onRemove={() => handleFileRemove('curriculumPDF')}
                      label="Curriculum PDF"
                      existingPdf={getExistingPdfData('curriculumPDF')}
                      onCancelExisting={() => handleCancelExistingPdf('curriculumPDF')}
                      onRemoveExisting={() => handleRemoveExistingPdf('curriculumPDF')}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 md:p-6 border border-green-200">
                      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FaDollarSign className="text-green-600" />
                        Day School Fee Structure
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Total Day School Fees (KES)
                          </label>
                          <TextField 
                            fullWidth 
                            size="small"
                            type="number"
                            min="0"
                            value={formData.feesDay} 
                            onChange={(e) => handleChange('feesDay', e.target.value)}
                            placeholder="Enter total day school fees"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '10px',
                                backgroundColor: 'white',
                                fontSize: '0.875rem',
                                fontWeight: 'bold'
                              }
                            }}
                          />
                        </div>

                        <CustomFeeBreakdown
                          title="Day School Fee"
                          color="from-green-50 to-green-100"
                          fees={dayFees}
                          onFeesChange={setDayFees}
                          totalField={formData.feesDay}
                          onTotalChange={(value) => handleChange('feesDay', value)}
                        />

                        <div className="mt-4">
                          <ModernPdfUpload 
                            pdfFile={files.feesDayDistributionPdf}
                            onPdfChange={(file) => handleFileChange('feesDayDistributionPdf', file)}
                            onRemove={() => handleFileRemove('feesDayDistributionPdf')}
                            label="Day Fees Breakdown PDF"
                            existingPdf={getExistingPdfData('feesDayDistributionPdf')}
                            onCancelExisting={() => handleCancelExistingPdf('feesDayDistributionPdf')}
                            onRemoveExisting={() => handleRemoveExistingPdf('feesDayDistributionPdf')}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 md:p-6 border border-purple-200">
                      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FaAward className="text-purple-600" />
                        Form 1 & 2 Results
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <label className="text-sm font-bold text-gray-700">Form 1 Results</label>
                            <div className="w-full sm:w-28">
                              <TextField 
                                fullWidth 
                                size="small"
                                type="number"
                                min="2000"
                                max="2100"
                                value={examYears.form1ResultsYear} 
                                onChange={(e) => handleExamYearChange('form1ResultsYear', e.target.value)}
                                placeholder="Year"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    backgroundColor: 'white',
                                    fontSize: '0.875rem'
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <ModernPdfUpload 
                            pdfFile={files.form1ResultsPdf}
                            onPdfChange={(file) => handleFileChange('form1ResultsPdf', file)}
                            onRemove={() => handleFileRemove('form1ResultsPdf')}
                            label="Form 1 Results PDF"
                            existingPdf={getExistingPdfData('form1ResultsPdf')}
                            onCancelExisting={() => handleCancelExistingPdf('form1ResultsPdf')}
                            onRemoveExisting={() => handleRemoveExistingPdf('form1ResultsPdf')}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <label className="text-sm font-bold text-gray-700">Form 2 Results</label>
                            <div className="w-full sm:w-28">
                              <TextField 
                                fullWidth 
                                size="small"
                                type="number"
                                min="2000"
                                max="2100"
                                value={examYears.form2ResultsYear} 
                                onChange={(e) => handleExamYearChange('form2ResultsYear', e.target.value)}
                                placeholder="Year"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    backgroundColor: 'white',
                                    fontSize: '0.875rem'
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <ModernPdfUpload 
                            pdfFile={files.form2ResultsPdf}
                            onPdfChange={(file) => handleFileChange('form2ResultsPdf', file)}
                            onRemove={() => handleFileRemove('form2ResultsPdf')}
                            label="Form 2 Results PDF"
                            existingPdf={getExistingPdfData('form2ResultsPdf')}
                            onCancelExisting={() => handleCancelExistingPdf('form2ResultsPdf')}
                            onRemoveExisting={() => handleRemoveExistingPdf('form2ResultsPdf')}
                          />
                        </div>

                        <div className="pt-4 border-t border-purple-200">
                          <AdditionalResultsUpload
                            files={additionalFiles.filter(f => f.isNew)}
                            onFilesChange={(newFiles) => {
                              const existingFiles = additionalFiles.filter(f => f.isExisting);
                              setAdditionalFiles([...existingFiles, ...newFiles]);
                            }}
                            label="Additional Files (Form 1 & 2)"
                            existingFiles={school?.additionalResultsFiles || []}
                            onCancelExisting={handleCancelExistingAdditionalFile}
                            onRemoveExisting={handleRemoveExistingAdditionalFile}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 md:p-6 border border-blue-200">
                      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FaUniversity className="text-blue-600" />
                        Boarding Fee Structure
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Total Boarding Fees (KES)
                          </label>
                          <TextField 
                            fullWidth 
                            size="small"
                            type="number"
                            min="0"
                            value={formData.feesBoarding} 
                            onChange={(e) => handleChange('feesBoarding', e.target.value)}
                            placeholder="Enter total boarding fees"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '10px',
                                backgroundColor: 'white',
                                fontSize: '0.875rem',
                                fontWeight: 'bold'
                              }
                            }}
                          />
                        </div>

                        <CustomFeeBreakdown
                          title="Boarding Fee"
                          color="from-blue-50 to-blue-100"
                          fees={boardingFees}
                          onFeesChange={setBoardingFees}
                          totalField={formData.feesBoarding}
                          onTotalChange={(value) => handleChange('feesBoarding', value)}
                        />

                        <div className="mt-4">
                          <ModernPdfUpload 
                            pdfFile={files.feesBoardingDistributionPdf}
                            onPdfChange={(file) => handleFileChange('feesBoardingDistributionPdf', file)}
                            onRemove={() => handleFileRemove('feesBoardingDistributionPdf')}
                            label="Boarding Fees Breakdown PDF"
                            existingPdf={getExistingPdfData('feesBoardingDistributionPdf')}
                            onCancelExisting={() => handleCancelExistingPdf('feesBoardingDistributionPdf')}
                            onRemoveExisting={() => handleRemoveExistingPdf('feesBoardingDistributionPdf')}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 md:p-6 border border-orange-200">
                      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FaUserCheck className="text-orange-600" />
                        Admission Information
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Admission Opens
                            </label>
                            <TextField 
                              fullWidth 
                              size="small"
                              type="date"
                              value={formData.admissionOpenDate} 
                              onChange={(e) => handleChange('admissionOpenDate', e.target.value)}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px',
                                  backgroundColor: 'white',
                                  fontSize: '0.875rem'
                                }
                              }}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Admission Closes
                            </label>
                            <TextField 
                              fullWidth 
                              size="small"
                              type="date"
                              value={formData.admissionCloseDate} 
                              onChange={(e) => handleChange('admissionCloseDate', e.target.value)}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px',
                                  backgroundColor: 'white',
                                  fontSize: '0.875rem'
                                }
                              }}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Admission Fee and Uniform Breakdown (KES)
                          </label>
                          <TextField 
                            fullWidth 
                            size="small"
                            type="number"
                            inputProps={{ min: 0, step: 1 }} 
                            value={formData.admissionFee} 
                            onChange={(e) => {
                              const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                              handleChange('admissionFee', val);
                            }}
                            placeholder="Enter admission and uniform fee"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '10px',
                                backgroundColor: 'white',
                                fontSize: '0.875rem',
                                fontWeight: 'bold'
                              }
                            }}
                          />
                        </div>

                        <CustomFeeBreakdown
                          title="Admission Fee"
                          color="from-orange-50 to-orange-100"
                          fees={admissionFees}
                          onFeesChange={setAdmissionFees}
                          totalField={formData.admissionFee}
                          onTotalChange={(value) => handleChange('admissionFee', value)}
                        />

                        <div className="mt-4">
                          <ModernPdfUpload 
                            pdfFile={files.admissionFeePdf}
                            onPdfChange={(file) => handleFileChange('admissionFeePdf', file)}
                            onRemove={() => handleFileRemove('admissionFeePdf')}
                            label="Admission Requirements Breakdown PDF"
                            existingPdf={getExistingPdfData('admissionFeePdf')}
                            onCancelExisting={() => handleCancelExistingPdf('admissionFeePdf')}
                            onRemoveExisting={() => handleRemoveExistingPdf('admissionFeePdf')}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Admission Capacity
                          </label>
                          <TextField 
                            fullWidth 
                            size="small"
                            type="number"
                            min="1"
                            value={formData.admissionCapacity} 
                            onChange={(e) => handleChange('admissionCapacity', e.target.value)}
                            placeholder="Enter admission capacity"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '10px',
                                backgroundColor: 'white',
                                fontSize: '0.875rem'
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>


                    // Add this in the academic step or create a new contact info section
<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
    <FaPhone className="text-blue-600" />
    Admission Contact Information
  </h3>
  
  <div className="space-y-3">
    <div>
      <label className="block text-xs font-bold text-gray-600 mb-1.5">
        Admission Contact Email
      </label>
      <TextField 
        fullWidth 
        size="small"
        type="email"
        value={formData.admissionContactEmail} 
        onChange={(e) => handleChange('admissionContactEmail', e.target.value)}
        placeholder="admissions@school.edu"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: 'white',
            fontSize: '0.875rem'
          }
        }}
      />
    </div>
    
    <div>
      <label className="block text-xs font-bold text-gray-600 mb-1.5">
        Admission Contact Phone
      </label>
      <TextField 
        fullWidth 
        size="small"
        type="tel"
        value={formData.admissionContactPhone} 
        onChange={(e) => handleChange('admissionContactPhone', e.target.value)}
        placeholder="+254 123 456 789"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: 'white',
            fontSize: '0.875rem'
          }
        }}
      />
    </div>
    
    <div>
      <label className="block text-xs font-bold text-gray-600 mb-1.5">
        Admission Website
      </label>
      <TextField 
        fullWidth 
        size="small"
        type="url"
        value={formData.admissionWebsite} 
        onChange={(e) => handleChange('admissionWebsite', e.target.value)}
        placeholder="https://school.edu/admissions"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: 'white',
            fontSize: '0.875rem'
          }
        }}
      />
    </div>
    
    <div>
      <label className="block text-xs font-bold text-gray-600 mb-1.5">
        Admission Location
      </label>
      <TextField 
        fullWidth 
        size="small"
        value={formData.admissionLocation} 
        onChange={(e) => handleChange('admissionLocation', e.target.value)}
        placeholder="School Campus, Room 101"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: 'white',
            fontSize: '0.875rem'
          }
        }}
      />
    </div>
    
    <div>
      <label className="block text-xs font-bold text-gray-600 mb-1.5">
        Admission Office Hours
      </label>
      <TextField 
        fullWidth 
        size="small"
        value={formData.admissionOfficeHours} 
        onChange={(e) => handleChange('admissionOfficeHours', e.target.value)}
        placeholder="Mon-Fri: 8:00 AM - 4:00 PM"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: 'white',
            fontSize: '0.875rem'
          }
        }}
      />
    </div>
  </div>
</div>

                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 md:p-6 border border-indigo-200">
                      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FaGraduationCap className="text-indigo-600" />
                        Other Important Documents
                      </h3>
                      
                      <div className="space-y-4">
                        {[
                          { key: 'form3ResultsPdf', label: 'Form 3 Results', yearKey: 'form3ResultsYear', examKey: 'form3' },
                          { key: 'form4ResultsPdf', label: 'Form 4 Results', yearKey: 'form4ResultsYear', examKey: 'form4' },
                          { key: 'mockExamsResultsPdf', label: 'Mock Exams', yearKey: 'mockExamsYear', examKey: 'mockExams' },
                          { key: 'kcseResultsPdf', label: 'KCSE Results', yearKey: 'kcseYear', examKey: 'kcse' }
                        ].map((exam) => (
                          <div key={exam.key} className="space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <label className="text-sm font-bold text-gray-700">{exam.label}</label>
                              <div className="w-full sm:w-28">
                                <TextField 
                                  fullWidth 
                                  size="small"
                                  type="number"
                                  min="2000"
                                  max="2100"
                                  value={examYears[exam.yearKey]} 
                                  onChange={(e) => handleExamYearChange(exam.yearKey, e.target.value)}
                                  placeholder="Year"
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: '8px',
                                      backgroundColor: 'white',
                                      fontSize: '0.875rem'
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            <ModernPdfUpload 
                              pdfFile={files[exam.key]}
                              onPdfChange={(file) => handleFileChange(exam.key, file)}
                              onRemove={() => handleFileRemove(exam.key)}
                              label={`${exam.label} PDF`}
                              existingPdf={getExistingPdfData(exam.key)}
                              onCancelExisting={() => handleCancelExistingPdf(exam.key)}
                              onRemoveExisting={() => handleRemoveExistingPdf(exam.key)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-200 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span className="font-semibold">Step {currentStep + 1} of {steps.length}</span>
                </div>
                {currentStep === steps.length - 1 && (
                  <div className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                    <FaCheck className="text-sm" /> Ready to {school ? 'Update' : 'Create'}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {currentStep > 0 && (
                  <button 
                    type="button"
                    onClick={handlePrevStep}
                    className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition duration-200 font-bold disabled:opacity-50 cursor-pointer text-sm w-full sm:w-auto"
                  >
                    ← Previous
                  </button>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <button 
                    type="button"
                    onClick={handleNextStep}
                    disabled={!isStepValid()}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200 font-bold shadow disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
                  >
                    Continue →
                  </button>
                ) : (
                  <button 
                    type="submit"
                    disabled={loading || !isStepValid()}
                    className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition duration-200 font-bold shadow disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={16} className="text-white" />
                        <span>{school ? 'Updating...' : 'Creating...'}</span>
                      </>
                    ) : (
                      <>
                        <FaSave className="text-sm" />
                        <span>{school ? 'Update School Info' : 'Create School Info'}</span>
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
  )
}

// Main School Information Management Component
export default function ModernSchoolInformation() {
  const [schoolInfo, setSchoolInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)

  useEffect(() => {
    loadSchoolInfo()
  }, [])

  const loadSchoolInfo = async () => {
    try {
      setLoading(true)
      const data = await schoolApiService.getSchoolInfo()
      setSchoolInfo(data)
    } catch (error) {
      console.error('Error loading school info:', error)
      setSchoolInfo(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSchool = async (formData) => {
    try {
      setActionLoading(true)
      let result
      if (schoolInfo) {
        result = await schoolApiService.updateSchoolInfo(formData)
        toast.success('School information updated successfully!')
      } else {
        result = await schoolApiService.createSchoolInfo(formData)
        toast.success('School information created successfully!')
      }
      setSchoolInfo(result.school)
      setShowModal(false)
    } catch (error) {
      toast.error(error.message || 'Failed to save school information!')
      throw error
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteSchool = async () => {
    try {
      setActionLoading(true)
      await schoolApiService.deleteSchoolInfo()
      setSchoolInfo(null)
      setShowDeleteModal(false)
      toast.success('School information deleted successfully!')
    } catch (error) {
      toast.error(error.message || 'Failed to delete school information!')
    } finally {
      setActionLoading(false)
    }
  }

const handleUpdateExamResults = async (formData) => {
  try {
    setActionLoading(true);
    const result = await schoolApiService.updateSchoolInfo(formData);
    setSchoolInfo(result.school);
    toast.success('Exam results updated successfully!');
  } catch (error) {
    toast.error(error.message || 'Failed to update exam results!');
    throw error;
  } finally {
    setActionLoading(false);
  }
};

  if (loading && !schoolInfo) {
    return <ModernLoadingSpinner message="Loading school information..." size="medium" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 md:p-6">
      <Toaster position="top-right" richColors />

      <style jsx global>{`
        .scrollbar-custom {
          scrollbar-width: thin;
          scrollbar-color: #4f46e5 #e5e7eb;
        }
        
        .scrollbar-custom::-webkit-scrollbar {
          width: 8px;
        }
        
        .scrollbar-custom::-webkit-scrollbar-track {
          background: #e5e7eb;
          border-radius: 4px;
        }
        
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: #4f46e5;
          border-radius: 4px;
        }
        
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: #4338ca;
        }
      `}</style>

      {schoolInfo?.videoTour && (
        <VideoModal
          open={showVideoModal}
          onClose={() => setShowVideoModal(false)}
          videoType={schoolInfo.videoType}
          videoPath={schoolInfo.videoTour}
          videoThumbnail={schoolInfo.videoThumbnail}
        />
      )}


<div className="relative bg-gradient-to-br from-[#1e40af] via-[#7c3aed] to-[#2563eb] rounded-[2.5rem] shadow-[0_20px_50px_rgba(31,38,135,0.37)] p-6 md:p-10 mb-10 border border-white/20 overflow-hidden">
  {/* Modern Decorative Elements */}
  <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
  <div className="absolute bottom-[-20%] right-[-5%] w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
  
  <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
    
    {/* Left Side: Identity & Meta */}
    <div className="flex-1 min-w-0">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md ring-1 ring-white/40 shadow-inner group transition-all duration-500 hover:bg-white/20">
          <FaMapMarkerAlt className="text-white text-3xl group-hover:scale-110 transition-transform" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md border border-emerald-400/30 backdrop-blur-md">
              Verified Institution
            </span>
            <FaShieldAlt className="text-blue-300 text-[10px]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter drop-shadow-sm">
            Nyaribu Secondary School
          </h1>
        </div>
      </div>
      
      <p className="text-blue-50/80 text-sm md:text-lg font-medium max-w-2xl leading-relaxed">
        Orchestrate institutional assets, monitor fee structures, and synchronize 
        <span className="text-white font-bold"> admission intelligence </span> 
        through this unified administrative gateway.
      </p>
    </div>

    {/* Right Side: Your exact button collection preserved */}
    <div className="-z-100 bottom-4 left-0 right-0 sm:static flex flex-wrap sm:flex-nowrap items-center gap-3 w-full xl:w-auto sm:w-auto bg-white/10 backdrop-blur-lg sm:bg-transparent p-4 sm:p-0 rounded-[2rem] sm:rounded-none shadow-lg sm:shadow-none border border-white/20 sm:border-none z-50">
      
      <button 
        onClick={loadSchoolInfo} 
        disabled={loading}
        className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white text-blue-600 px-5 py-3 sm:py-2.5 rounded-xl hover:bg-white/90 transition-all duration-200 font-semibold text-sm shadow-lg active:scale-[0.98] disabled:opacity-60"
      >
        {loading ? (
          <CircularProgress size={16} color="inherit" thickness={6} />
        ) : (
          <FaChartBar className="text-sm" /> 
        )}
        <span className="whitespace-nowrap">
          {loading ? 'Syncing...' : 'Refresh Info'}
        </span>
      </button>
      
      {schoolInfo && (
        <button 
          onClick={() => setShowDeleteModal(true)} 
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/30 px-5 py-3 sm:py-2.5 rounded-xl hover:bg-white/20 transition-all duration-200 font-semibold text-sm active:scale-[0.98]"
        >
          <FaTrash className="text-sm" /> 
          <span className="whitespace-nowrap">Delete</span>
        </button>
      )}
      
      <button 
        onClick={() => setShowModal(true)} 
        className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl hover:bg-white/90 transition-all duration-200 font-semibold text-sm shadow-lg active:scale-[0.98]"
      >
        {schoolInfo ? (
          <>
            <FaEdit className="text-sm" />
            <span className="whitespace-nowrap">Update Profile</span>
          </>
        ) : (
          <>
            <FaPlus className="text-sm" />
            <span className="whitespace-nowrap">Initialize</span>
          </>
        )}
      </button>
    </div>
  </div>
</div>

      {schoolInfo ? (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow border border-gray-200 p-4 md:p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2.5 px-4 py-2 bg-white border-2 border-blue-50 rounded-xl shadow-sm hover:border-blue-200 transition-colors">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <FaGraduationCap className="text-blue-600 text-lg" />
                    </div>
                    <span className="text-slate-800 text-[15px] font-bold tracking-tight">
                      {schoolInfo.studentCount?.toLocaleString()} <span className="text-slate-500 font-semibold">Students</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 px-4 py-2 bg-white border-2 border-green-50 rounded-xl shadow-sm hover:border-green-200 transition-colors">
                    <div className="p-1.5 bg-green-100 rounded-lg">
                      <FaChalkboardTeacher className="text-green-600 text-lg" />
                    </div>
                    <span className="text-slate-800 text-[15px] font-bold tracking-tight">
                      {schoolInfo.staffCount?.toLocaleString()} <span className="text-slate-500 font-semibold">Staff</span>
                    </span>
                  </div>

                  {schoolInfo.motto && (
                    <div className="flex items-center gap-2.5 px-4 py-2 bg-amber-50/40 border-2 border-amber-100/50 rounded-xl shadow-sm">
                      <FaQuoteLeft className="text-amber-500 text-sm" />
                      <span className="text-amber-900 text-[15px] font-bold italic tracking-wide">
                        "{schoolInfo.motto}"
                      </span>
                    </div>
                  )}

                  {schoolInfo.videoType === 'file' && schoolInfo.videoThumbnail && (
                    <div className="flex items-center gap-2.5 px-4 py-2 bg-indigo-600 rounded-xl shadow-md shadow-indigo-200">
                      <FaCamera className="text-white text-sm" />
                      <span className="text-white text-[14px] font-bold uppercase tracking-wider">
                        Video Enabled
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {schoolInfo.description && (
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                  <h3 className="text-base font-bold text-gray-900">School Overview</h3>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                  <p className="text-gray-700 text-base leading-relaxed tracking-tight">{schoolInfo.description}</p>
                </div>
              </div>
            )}

            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                <h3 className="text-base font-bold text-gray-900">Our Guiding Principles</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {schoolInfo.vision && (
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-blue-50/50 p-6 border border-blue-100/80 shadow-[0_4px_20px_rgba(59,130,246,0.08)]">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-bl-full"></div>
                    
                    <div className="relative flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                        <FaEye className="text-white text-lg" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-base font-bold text-gray-900">Our Vision</h4>
                          <div className="w-8 h-0.5 bg-blue-200 rounded-full"></div>
                        </div>
                        <p className="text-gray-700 text-base leading-relaxed pl-0.5">{schoolInfo.vision}</p>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 w-8 h-1 bg-gradient-to-r from-blue-500/30 to-blue-400/10 rounded-full"></div>
                  </div>
                )}
                
                {schoolInfo.mission && (
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-emerald-50/50 p-6 border border-emerald-100/80 shadow-[0_4px_20px_rgba(16,185,129,0.08)]">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-full"></div>
                    
                    <div className="relative flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md">
                        <FaRocket className="text-white text-lg" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-base font-bold text-gray-900">Our Mission</h4>
                          <div className="w-8 h-0.5 bg-emerald-200 rounded-full"></div>
                        </div>
                        <p className="text-gray-700 text-base leading-relaxed pl-0.5">{schoolInfo.mission}</p>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 w-8 h-1 bg-gradient-to-r from-emerald-500/30 to-emerald-400/10 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>

            {schoolInfo.videoTour && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <FaVideo className="text-red-500" />
                  Video Tour
                  {schoolInfo.videoType === 'file' && schoolInfo.videoThumbnail && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <FaCamera className="text-xs" />
                      Custom Thumbnail
                    </span>
                  )}
                </h3>
                <div className="max-w-md">
                  <VideoThumbnail
                    videoType={schoolInfo.videoType}
                    videoPath={schoolInfo.videoTour}
                    videoThumbnail={schoolInfo.videoThumbnail}
                    onClick={() => setShowVideoModal(true)}
                  />
                  {schoolInfo.videoType === 'file' && !schoolInfo.videoThumbnail && (
                    <p className="text-xs text-gray-500 mt-2">
                      <FaInfoCircle className="inline mr-1" />
                      This MP4 video is using the default thumbnail
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="mb-6">
              <ModernAdmissionCurriculumView 
                curriculumPDF={schoolInfo.curriculumPDF}
                curriculumPdfName={schoolInfo.curriculumPdfName}
              />
            </div>

            <div className="mb-6">
              <ModernAdmissionRequirementsView 
                admissionRequirements={schoolInfo.admissionRequirements}
                admissionFee={schoolInfo.admissionFee}
                admissionFeeDistribution={schoolInfo.admissionFeeDistribution}
                admissionFeePdf={schoolInfo.admissionFeePdf}
                admissionFeePdfName={schoolInfo.admissionFeePdfName}
                admissionDocumentsRequired={schoolInfo.admissionDocumentsRequired}
              />
            </div>

            <div className="mb-6">
              <ModernDaySchoolFeeView 
                feesDay={schoolInfo.feesDay}
                feesDayDistribution={schoolInfo.feesDayDistribution}
                feesDayDistributionPdf={schoolInfo.feesDayDistributionPdf}
                feesDayPdfName={schoolInfo.feesDayPdfName}
              />
            </div>

            {schoolInfo.examResults && (
              <div className="mb-6">
                <ModernExamMappingView 
                  examResults={schoolInfo.examResults}
                  additionalResultsFiles={schoolInfo.additionalResultsFiles}
                  onUpdateExamResults={handleUpdateExamResults}
                />
              </div>
            )}

{schoolInfo.feesBoarding && (
  <div className="mb-8">
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-2xl shadow-slate-200/40 relative overflow-hidden transition-all duration-500 hover:shadow-purple-100/50 group">
      {/* Decorative Soft-UI Accent for Boarding */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity" />

      {/* Header & Total Summary Section */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between pb-8 mb-8 border-b border-slate-100/80 gap-6">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-purple-500 to-indigo-400 flex items-center justify-center shadow-xl shadow-purple-200 ring-4 ring-purple-50 transition-transform group-hover:rotate-3">
            <FaUniversity className="text-white text-2xl" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-2">
              Boarding Fee Structure
            </h3>
            <p className="text-sm font-medium text-slate-500 max-w-sm leading-relaxed">
              Complete residential fee breakdown including tuition, accommodation, and full-term care.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-start lg:items-end">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1 lg:ml-0">Total Residential Liability</span>
          <div className="inline-flex items-baseline gap-1.5 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-purple-900/20">
            <span className="text-xs font-bold text-purple-400 uppercase">KES</span>
            <span className="text-2xl font-black tabular-nums tracking-tighter">
              {schoolInfo.feesBoarding.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Boarding-Specific Fee Distribution Grid */}
      {schoolInfo.feesBoardingDistribution && Object.keys(schoolInfo.feesBoardingDistribution).length > 0 && (
        <div className="mb-10 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <FaChartPie className="text-purple-300 text-sm" />
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Residency Cost Allocation</h4>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(schoolInfo.feesBoardingDistribution).map(([key, value]) => {
              const percentage = Math.round((parseFloat(value) / schoolInfo.feesBoarding) * 100);
              return (
                <div 
                  key={key} 
                  className="group/item bg-white hover:bg-purple-50/50 rounded-2xl p-4 border border-slate-100 hover:border-purple-200 transition-all duration-300"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2.5">
                      <FaCheckCircle className="text-purple-200 group-hover/item:text-purple-500 transition-colors text-sm" />
                      <span className="text-sm font-bold text-slate-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                      {percentage}%
                    </span>
                  </div>
                  
                  <div className="flex items-end justify-between">
                    <div className="w-full max-w-[100px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-indigo-600 h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${percentage}%` }} 
                      />
                    </div>
                    <span className="text-base font-black text-slate-900">
                      <span className="text-[10px] font-bold text-slate-400 mr-1 font-sans">KES</span>
                      {parseFloat(value).toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile-Responsive PDF Control Section */}
      {schoolInfo.feesBoardingDistributionPdf && (
        <div className="relative group/pdf">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-[2rem] blur opacity-10 group-hover/pdf:opacity-20 transition duration-500" />
          <div className="relative bg-slate-50 rounded-[1.75rem] border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
                <FaFilePdf className="text-red-500 text-3xl" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-slate-900 mb-1 truncate">
                  {schoolInfo.feesBoardingPdfName || 'Boarding Fee Structure.pdf'}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-500 whitespace-nowrap">Official Doc</span>
                  <span className="px-2 py-0.5 rounded-md bg-purple-50 border border-purple-100 text-[10px] font-bold text-purple-600 uppercase tracking-tighter">Verified</span>
                </div>
              </div>
            </div>
            
            {/* Buttons: Stack on mobile, side-by-side on desktop */}
            <div className="flex flex-col xs:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
              <a
                href={schoolInfo.feesBoardingDistributionPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-900 hover:text-white text-slate-700 border border-slate-200 px-6 py-3.5 md:py-3 rounded-xl text-xs font-black transition-all duration-300 shadow-sm"
              >
                <FaEye className="text-purple-500 group-hover:text-white" />
                Preview
              </a>
              <a
                href={schoolInfo.feesBoardingDistributionPdf}
                download={schoolInfo.feesBoardingPdfName || 'boarding-fees.pdf'}
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3.5 md:py-3 rounded-xl text-xs font-black shadow-xl shadow-purple-200 transition-all duration-300"
              >
                <FaDownload />
                Get PDF
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)}

<div className="mb-10 space-y-6">
  <div className="flex items-center gap-4 mb-8">
    <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100 shadow-sm transition-transform hover:scale-110">
      <FaGraduationCap className="text-purple-600 text-xl" />
    </div>
    <div>
      <h3 className="text-xl font-black text-slate-900 tracking-tight">Academic Information</h3>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Institutional Milestones & Curriculum</p>
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50/50 rounded-bl-[60px] -z-0 group-hover:bg-blue-100/60 transition-colors" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-5">
          <FaCalendarAlt className="text-blue-500" />
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tighter">Academic Calendar</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2">
              <FaClock className="text-[10px] text-emerald-500" />
              <span className="text-[11px] font-black text-slate-400 uppercase">Opening</span>
            </div>
            <span className="text-sm font-black text-slate-900">
              {new Date(schoolInfo.openDate).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              })}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2">
              <FaClock className="text-[10px] text-rose-500" />
              <span className="text-[11px] font-black text-slate-400 uppercase">Closing</span>
            </div>
            <span className="text-sm font-black text-slate-900">
              {new Date(schoolInfo.closeDate).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* 2. Subjects Card */}
    {Array.isArray(schoolInfo.subjects) && schoolInfo.subjects.length > 0 && (
      <div className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-50/50 rounded-bl-[60px] -z-0 group-hover:bg-purple-100/60 transition-colors" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <FaBookOpen className="text-purple-500" />
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tighter">Subjects Offered</h4>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {schoolInfo.subjects.map((subject, index) => (
              <span 
                key={index} 
                className="bg-white hover:bg-purple-600 hover:text-white border border-purple-100 text-purple-700 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-default shadow-sm"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>
      </div>
    )}

    {/* 3. Departments Card */}
    {Array.isArray(schoolInfo.departments) && schoolInfo.departments.length > 0 && (
      <div className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-orange-50/50 rounded-bl-[60px] -z-0 group-hover:bg-orange-100/60 transition-colors" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <FaUsersCog className="text-orange-500" />
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tighter">Departments</h4>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {schoolInfo.departments.map((dept, index) => (
              <span 
                key={index} 
                className="bg-slate-900 text-white px-3 py-1.5 rounded-xl text-[11px] font-bold hover:bg-orange-500 transition-colors shadow-lg shadow-slate-200"
              >
                {dept}
              </span>
            ))}
          </div>
        </div>
      </div>
    )}
  </div>
</div>

{(schoolInfo.admissionOpenDate || schoolInfo.admissionContactEmail) && (
  <div className="mb-10 relative">
    {/* Section Header with Status Badge */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-200">
          <FaUserCheck className="text-white text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Admission Details</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Enrolment & Direct Inquiry</p>
        </div>
      </div>
      
      {/* Dynamic Status Indicator */}
      {schoolInfo.admissionCloseDate && (
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-tighter">Admissions Active</span>
        </div>
      )}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Timeline Card - Spans 2 cols */}
      <div className="lg:col-span-2 group bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
          <FaCalendarAlt size={120} className="text-white" />
        </div>
        
        <div className="relative z-10">
          <h4 className="text-xs font-black text-orange-400 uppercase tracking-[0.2em] mb-6">Timeline</h4>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                <FaArrowRight className="text-white text-xs rotate-[-45deg]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Registration Opens</p>
                <p className="text-lg font-black text-white">
                  {new Date(schoolInfo.admissionOpenDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                <FaHourglassHalf className="text-orange-400 text-xs" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Closing Deadline</p>
                <p className="text-lg font-black text-white">
                  {new Date(schoolInfo.admissionCloseDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry & Capacity Card - Spans 3 cols */}
      <div className="lg:col-span-3 bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Inquiry Suite</h4>
            {schoolInfo.admissionCapacity && (
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                <FaUsers className="text-slate-400 text-xs" />
                <span className="text-[11px] font-black text-slate-700">{schoolInfo.admissionCapacity.toLocaleString()} Slots</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Actionable Contact Tiles */}
            {schoolInfo.admissionContactEmail && (
              <a href={`mailto:${schoolInfo.admissionContactEmail}`} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover:text-blue-600 transition-colors">
                  <FaEnvelope size={12} />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-slate-400 uppercase">Email Registry</p>
                  <p className="text-xs font-bold text-slate-700 truncate">{schoolInfo.admissionContactEmail}</p>
                </div>
              </a>
            )}

            {schoolInfo.admissionContactPhone && (
              <a href={`tel:${schoolInfo.admissionContactPhone}`} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover:text-emerald-600 transition-colors">
                  <FaPhone size={12} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Direct Line</p>
                  <p className="text-xs font-bold text-slate-700">{schoolInfo.admissionContactPhone}</p>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Website Action Button */}
        {schoolInfo.admissionWebsite && (
          <div className="mt-6">
            <a 
              href={schoolInfo.admissionWebsite} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-between bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-2xl transition-all group shadow-lg shadow-slate-200"
            >
              <div className="flex items-center gap-3">
                <FaGlobe className="text-blue-400" />
                <span className="text-xs font-black uppercase tracking-widest">Portal Access</span>
              </div>
              <FaArrowRight className="text-slate-500 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        )}
      </div>
    </div>
  </div>
)}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-100">
            <FaSchool className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No School Information Found</h3>
          <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
            Set up your school information to showcase your institution to students and parents.
          </p>
          <button 
            onClick={() => setShowModal(true)} 
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-200 font-bold shadow flex items-center gap-1 mx-auto text-sm cursor-pointer"
          >
            <FaPlus /> Create School Information
          </button>
        </div>
      )}

      {showModal && (
        <ModernSchoolModal 
          onClose={() => setShowModal(false)} 
          onSave={handleSaveSchool} 
          school={schoolInfo} 
          loading={actionLoading} 
        />
      )}
      {showDeleteModal && (
        <ModernDeleteModal 
          onClose={() => setShowDeleteModal(false)} 
          onConfirm={handleDeleteSchool} 
          loading={actionLoading} 
        />
      )}
    </div>
  )
}   

