'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Toaster, toast } from 'sonner';
import { 
  FaSchool, FaEdit, FaTrash, FaPlus, FaSearch, FaSync,
  FaEye, FaCalendar, FaUsers, FaChalkboardTeacher, FaDollarSign,
  FaBook, FaGraduationCap, FaFilePdf, FaVideo, FaMapMarkerAlt,
  FaPhone, FaEnvelope, FaGlobe, FaClock, FaChevronRight, FaChevronLeft,
  FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaChartBar,
  FaUpload, FaTimes, FaCog, FaSave,
  FaExternalLinkAlt, FaRocket, FaShieldAlt,
  FaHashtag, FaPalette, FaMagic, FaBolt,
  FaCrown, FaGem, FaFire, FaRegClock, FaRegFileAlt,
  FaTh, FaList, FaUserGraduate, FaBuilding,
  FaAward, FaCalendarAlt, FaFileInvoice, FaFileDownload, FaFileImport,
  FaPercentage, FaTasks, FaClipboardList,
  FaUserCheck, FaMoneyBillWave, FaReceipt, FaCalculator,
  FaChartLine, FaChartPie, FaChartArea,
  FaShareAlt, FaDownload, FaPaperclip, FaCheckSquare,
  FaListUl, FaQuoteLeft, FaQuoteRight, FaStarHalfAlt,
  FaLightbulb, FaNewspaper, FaStickyNote, FaSun, FaMoon,
  FaYoutube, FaFileVideo, FaFileAlt, FaFileExport,
  FaFileUpload, FaFileCode, FaFileAudio, FaFile, FaCheck,
  FaUser, FaTag, FaCogs, FaUniversity, FaBlackTie,
  FaPlay, FaPlayCircle
} from 'react-icons/fa';
import { CircularProgress, Modal, Box, TextField, TextareaAutosize, FormControlLabel, Switch } from '@mui/material';
import { debounce } from 'lodash';

// Modern Loading Spinner Component
function ModernLoadingSpinner({ message = "Loading...", size = "medium" }) {
  const sizes = {
    small: { outer: 60, inner: 24 },
    medium: { outer: 100, inner: 40 },
    large: { outer: 120, inner: 48 }
  }

  const { outer, inner } = sizes[size]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="relative">
            <CircularProgress 
              size={outer} 
              thickness={4}
              className="text-blue-600"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-ping opacity-20`}
                   style={{ width: inner, height: inner }}></div>
            </div>
          </div>
          <div className="absolute -inset-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-2xl opacity-30 animate-pulse"></div>
        </div>
        <div className="mt-8 space-y-2">
          <span className="block text-xl font-semibold text-gray-700 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            {message}
          </span>
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" 
                   style={{ animationDelay: `${i * 0.2}s` }}></div>
            ))}
          </div>
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

  // Calculate total from fees
  const calculatedTotal = fees.reduce((sum, fee) => sum + (parseFloat(fee.amount) || 0), 0);

  // Update total when fees change
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
      
      {/* Add New Fee Form */}
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

      {/* Existing Fees List */}
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

// Modern PDF Upload Component
function ModernPdfUpload({ pdfFile, onPdfChange, onRemove, label = "PDF File", required = false }) {
  const [previewName, setPreviewName] = useState(pdfFile?.name || '')
  const [dragOver, setDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    if (pdfFile && typeof pdfFile === 'object') {
      setPreviewName(pdfFile.name)
    }
  }, [pdfFile])

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
    onRemove()
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
        <FaFilePdf className="text-red-500" />
        <span>{label}</span>
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {previewName ? (
        <div className="relative group">
          <div className="relative overflow-hidden rounded-xl border-2 border-gray-300 shadow-sm transition-all duration-300 bg-gradient-to-br from-red-50 to-orange-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FaFilePdf className="text-red-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm truncate max-w-[180px]">{previewName}</p>
                  <p className="text-xs text-gray-600">PDF Document</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="bg-red-500 text-white p-1.5 rounded-lg transition-all duration-300 shadow hover:shadow-md cursor-pointer hover:bg-red-600"
                title="Remove PDF"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>
            
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="absolute bottom-0 left-0 right-0 bg-gray-200 h-1">
                <div 
                  className="bg-gradient-to-r from-red-500 to-orange-600 h-1 transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
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
          onClick={() => document.getElementById(`pdf-upload-${label.replace(/\s+/g, '-').toLowerCase()}`).click()}
        >
          <div className="relative">
            <FaUpload className={`mx-auto text-2xl mb-2 transition-all duration-300 ${
              dragOver ? 'text-red-500 scale-110' : 'text-gray-400 group-hover:text-red-500'
            }`} />
          </div>
          <p className="text-gray-700 mb-1 font-medium transition-colors duration-300 group-hover:text-gray-800 text-sm">
            {dragOver ? '📄 Drop PDF here!' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-xs text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
            Max: 20MB • PDF only
          </p>
          <input 
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

// Modern Video Upload Component
function ModernVideoUpload({ videoType, videoPath, youtubeLink, onVideoChange, onYoutubeLinkChange, onRemove, label = "Video Tour" }) {
  const [dragOver, setDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [localYoutubeLink, setLocalYoutubeLink] = useState(youtubeLink || '')

  const handleYoutubeLinkChange = (e) => {
    const value = e.target.value
    setLocalYoutubeLink(value)
    if (value.trim() === '') {
      onYoutubeLinkChange('')
    } else {
      onYoutubeLinkChange(value)
    }
  }

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
      
      const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg']
      if (!allowedVideoTypes.includes(file.type)) {
        toast.error('Invalid video format. Only MP4, WebM, and OGG files are allowed.')
        setUploadProgress(0)
        return
      }

      if (file.size > 100 * 1024 * 1024) {
        toast.error('Video file too large. Maximum size: 100MB')
        setUploadProgress(0)
        return
      }

      simulateUpload()
      onVideoChange(file)
      setUploadProgress(100)
      
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
    onRemove()
    setLocalYoutubeLink('')
  }

  const isValidYouTubeUrl = (url) => {
    if (!url || url.trim() === '') return false
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    return youtubeRegex.test(url.trim())
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
        <FaVideo className="text-purple-500" />
        <span>{label}</span>
      </label>
      
      <div className="space-y-3">
        {/* YouTube URL Input */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">YouTube URL</label>
          <div className="relative">
            <FaYoutube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" />
            <input
              type="url"
              value={localYoutubeLink}
              onChange={handleYoutubeLinkChange}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white text-sm"
            />
          </div>
          {localYoutubeLink && !isValidYouTubeUrl(localYoutubeLink) && (
            <p className="text-red-500 text-xs mt-1">Please enter a valid YouTube URL</p>
          )}
        </div>

        <div className="text-center text-gray-400 text-xs font-medium">OR</div>

        {/* Video File Upload */}
        {videoType === 'file' && videoPath ? (
          <div className="relative group">
            <div className="relative overflow-hidden rounded-xl border-2 border-gray-300 shadow-sm transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FaFileVideo className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Video File Uploaded</p>
                    <p className="text-xs text-gray-600">Local MP4 file</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="bg-red-500 text-white p-1.5 rounded-lg transition-all duration-300 shadow hover:shadow-md cursor-pointer hover:bg-red-600"
                  title="Remove Video"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-300 cursor-pointer group ${
              dragOver 
                ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100' 
                : 'border-gray-300 hover:border-blue-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-sm'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => document.getElementById('video-upload').click()}
          >
            <div className="relative">
              <FaUpload className={`mx-auto text-2xl mb-2 transition-all duration-300 ${
                dragOver ? 'text-blue-500 scale-110' : 'text-gray-400 group-hover:text-blue-500'
              }`} />
            </div>
            <p className="text-gray-700 mb-1 font-medium transition-colors duration-300 group-hover:text-gray-800 text-sm">
              {dragOver ? '🎬 Drop video file here!' : 'Drag & drop MP4 video file'}
            </p>
            <p className="text-xs text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
              MP4, WebM, OGG • Max 100MB
            </p>
            <input 
              type="file" 
              accept="video/*" 
              onChange={handleFileChange} 
              className="hidden" 
              id="video-upload" 
            />
          </div>
        )}
      </div>
      
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-700">Uploading...</span>
            <span className="text-xs font-bold text-blue-600">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
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

// Video Modal Component
function VideoModal({ open, onClose, videoType, videoPath }) {
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    // Extract video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : url;
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '800px',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        overflow: 'hidden',
        outline: 'none'
      }}>
        <div className="bg-gradient-to-r from-gray-900 to-black p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaVideo className="text-red-500" />
              <h2 className="text-lg font-bold">School Video Tour</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>
        
        <div className="p-4 bg-black">
          {videoType === 'youtube' ? (
            <div className="relative pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
              <iframe
                src={getYouTubeEmbedUrl(videoPath)}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="School Video Tour"
              />
            </div>
          ) : videoType === 'file' ? (
            <video
              controls
              autoPlay
              className="w-full rounded-lg"
              src={videoPath}
              title="School Video Tour"
            />
          ) : (
            <div className="text-center py-8 text-white">
              <FaVideo className="text-4xl mx-auto mb-4 text-gray-400" />
              <p className="text-lg">No video available</p>
            </div>
          )}
        </div>
      </Box>
    </Modal>
  );
}

// Enhanced Modern Delete Confirmation Modal
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

// Modern School Info Modal with 3 steps - UPDATED WITH CUSTOM FEE BREAKDOWN
function ModernSchoolModal({ onClose, onSave, school, loading }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    name: school?.name || '',
    description: school?.description || '',
    motto: school?.motto || '',
    vision: school?.vision || '',
    mission: school?.mission || '',
    studentCount: school?.studentCount?.toString() || '',
    staffCount: school?.staffCount?.toString() || '',
    
    // Step 2: Academic & Media
    openDate: school?.openDate ? new Date(school.openDate).toISOString().split('T')[0] : '',
    closeDate: school?.closeDate ? new Date(school.closeDate).toISOString().split('T')[0] : '',
    subjects: school?.subjects || [],
    departments: school?.departments || [],
    youtubeLink: school?.videoType === 'youtube' ? school.videoTour : '',
    
    // Step 3: Financial & Admission
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
    // Media
    videoFile: null,
    
    // PDFs
    curriculumPDF: null,
    feesDayDistributionPdf: null,
    feesBoardingDistributionPdf: null,
    admissionFeePdf: null,
    
    // Exam Results PDFs
    form1ResultsPdf: null,
    form2ResultsPdf: null,
    form3ResultsPdf: null,
    form4ResultsPdf: null,
    mockExamsResultsPdf: null,
    kcseResultsPdf: null
  })

  // Additional Files State
  const [additionalFiles, setAdditionalFiles] = useState([]);

  const [examYears, setExamYears] = useState({
    form1ResultsYear: school?.examResults?.form1?.year?.toString() || '',
    form2ResultsYear: school?.examResults?.form2?.year?.toString() || '',
    form3ResultsYear: school?.examResults?.form3?.year?.toString() || '',
    form4ResultsYear: school?.examResults?.form4?.year?.toString() || '',
    mockExamsYear: school?.examResults?.mockExams?.year?.toString() || '',
    kcseYear: school?.examResults?.kcse?.year?.toString() || ''
  })

  // Custom Fee Breakdown States
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

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    
    if (currentStep < steps.length - 1) {
      return
    }

    try {
      const formDataToSend = new FormData()
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (key === 'subjects' || key === 'departments' || key === 'admissionDocumentsRequired') {
          // Handle arrays
          const items = formData[key]
          if (Array.isArray(items) && items.length > 0) {
            formDataToSend.append(key, JSON.stringify(items))
          }
        } else if (key === 'youtubeLink') {
          // Handle YouTube link separately
          if (formData.youtubeLink.trim()) {
            formDataToSend.append('youtubeLink', formData.youtubeLink.trim())
          }
        } else if (key.includes('DistributionJson') || key === 'admissionFeeDistribution') {
          // Convert custom fee arrays to JSON objects
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

      // Add video file if present
      if (files.videoFile) {
        formDataToSend.append('videoTour', files.videoFile)
      }

      // Add all PDF files
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
      })

      // Add additional files
      additionalFiles.forEach((file, index) => {
        formDataToSend.append(`additionalFile_${index}`, file);
      });

      // Add exam years
      Object.keys(examYears).forEach(yearField => {
        if (examYears[yearField]) {
          formDataToSend.append(yearField, examYears[yearField])
        }
      })

      await onSave(formDataToSend)
    } catch (error) {
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
    setFiles(prev => ({ ...prev, [field]: file }))
  }

  const handleFileRemove = (field) => {
    setFiles(prev => ({ ...prev, [field]: null }))
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return formData.name.trim() && formData.studentCount.trim() && formData.staffCount.trim()
      case 1: // Academic
        return formData.openDate.trim() && formData.closeDate.trim()
      case 2: // Financial & Admission
        return true // All fields are optional in this step
      default:
        return true
    }
  }

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '1080px',
        maxHeight: '95vh',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <FaSchool className="text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{school ? 'Update School Information' : 'Create School Information'}</h2>
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

        {/* Progress Steps */}
        <div className="bg-white border-b border-gray-200 p-3">
          <div className="flex justify-center items-center space-x-3">
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
                  <div className={`w-6 h-0.5 mx-1.5 ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="max-h-[calc(95vh-160px)] overflow-y-auto scrollbar-custom">
          <form onSubmit={handleFormSubmit} className="p-4 space-y-4">
            {/* Step 1: Basic Information */}
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
                        size="small"
                        value={formData.name} 
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Enter school name..." 
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            backgroundColor: '#f9fafb',
                            fontSize: '0.875rem'
                          }
                        }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">
                        Student Count <span className="text-red-500">*</span>
                      </label>
                      <TextField 
                        fullWidth 
                        size="small"
                        type="number"
                        min="1"
                        value={formData.studentCount} 
                        onChange={(e) => handleChange('studentCount', e.target.value)}
                        placeholder="Enter number of students..." 
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            backgroundColor: '#f9fafb',
                            fontSize: '0.875rem'
                          }
                        }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">
                        Staff Count <span className="text-red-500">*</span>
                      </label>
                      <TextField 
                        fullWidth 
                        size="small"
                        type="number"
                        min="1"
                        value={formData.staffCount} 
                        onChange={(e) => handleChange('staffCount', e.target.value)}
                        placeholder="Enter number of staff..." 
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            backgroundColor: '#f9fafb',
                            fontSize: '0.875rem'
                          }
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
                        size="small"
                        value={formData.motto} 
                        onChange={(e) => handleChange('motto', e.target.value)}
                        placeholder="Enter school motto..." 
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            backgroundColor: '#f9fafb',
                            fontSize: '0.875rem'
                          }
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
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-gray-50 font-medium text-sm"
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
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-gray-50 font-medium text-sm"
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
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-gray-50 font-medium text-sm"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Academic & Media */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    {/* Academic Calendar */}
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

                    {/* Academic Programs */}
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
                    {/* Video Tour */}
                    <ModernVideoUpload 
                      videoType={school?.videoType}
                      videoPath={school?.videoTour}
                      youtubeLink={formData.youtubeLink}
                      onVideoChange={(file) => handleFileChange('videoFile', file)}
                      onYoutubeLinkChange={(link) => handleChange('youtubeLink', link)}
                      onRemove={() => {
                        handleFileChange('videoFile', null)
                        handleChange('youtubeLink', '')
                      }}
                      label="School Video Tour"
                    />

                    {/* Curriculum PDF */}
                    <ModernPdfUpload 
                      pdfFile={files.curriculumPDF}
                      onPdfChange={(file) => handleFileChange('curriculumPDF', file)}
                      onRemove={() => handleFileRemove('curriculumPDF')}
                      label="Curriculum PDF"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Financial & Admission - WITH CUSTOM FEE BREAKDOWN AND ADDITIONAL FILES */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* LEFT COLUMN: Day Fees, Form 1-2 Results & Additional Files */}
                  <div className="space-y-6">
                    {/* Day Fee Structure */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
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
                            size="medium"
                            type="number"
                            min="0"
                            value={formData.feesDay} 
                            onChange={(e) => handleChange('feesDay', e.target.value)}
                            placeholder="Enter total day school fees"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '10px',
                                backgroundColor: 'white',
                                fontSize: '1rem',
                                fontWeight: 'bold'
                              }
                            }}
                          />
                        </div>

                        {/* Custom Day Fee Breakdown */}
                        <CustomFeeBreakdown
                          title="Day School Fee"
                          color="from-green-50 to-green-100"
                          fees={dayFees}
                          onFeesChange={setDayFees}
                          totalField={formData.feesDay}
                          onTotalChange={(value) => handleChange('feesDay', value)}
                        />

                        {/* Day Fee PDF Upload */}
                        <div className="mt-4">
                          <ModernPdfUpload 
                            pdfFile={files.feesDayDistributionPdf}
                            onPdfChange={(file) => handleFileChange('feesDayDistributionPdf', file)}
                            onRemove={() => handleFileRemove('feesDayDistributionPdf')}
                            label="Day Fees Breakdown PDF"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Form 1 & 2 Results with Additional Files */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FaAward className="text-purple-600" />
                        Form 1 & 2 Results
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Form 1 Results */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-gray-700">Form 1 Results</label>
                            <div className="w-28">
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
                          />
                        </div>

                        {/* Form 2 Results */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-gray-700">Form 2 Results</label>
                            <div className="w-28">
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
                          />
                        </div>

                        {/* Additional Files Upload */}
                        <div className="pt-4 border-t border-purple-200">
                          <AdditionalFilesUpload
                            files={additionalFiles}
                            onFilesChange={setAdditionalFiles}
                            label="Additional Files (Form 1 & 2)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Boarding Fees, Admission & Other Results */}
                  <div className="space-y-6">
                    {/* Boarding Fee Structure */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
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
                            size="medium"
                            type="number"
                            min="0"
                            value={formData.feesBoarding} 
                            onChange={(e) => handleChange('feesBoarding', e.target.value)}
                            placeholder="Enter total boarding fees"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '10px',
                                backgroundColor: 'white',
                                fontSize: '1rem',
                                fontWeight: 'bold'
                              }
                            }}
                          />
                        </div>

                        {/* Custom Boarding Fee Breakdown */}
                        <CustomFeeBreakdown
                          title="Boarding Fee"
                          color="from-blue-50 to-blue-100"
                          fees={boardingFees}
                          onFeesChange={setBoardingFees}
                          totalField={formData.feesBoarding}
                          onTotalChange={(value) => handleChange('feesBoarding', value)}
                        />

                        {/* Boarding Fee PDF Upload */}
                        <div className="mt-4">
                          <ModernPdfUpload 
                            pdfFile={files.feesBoardingDistributionPdf}
                            onPdfChange={(file) => handleFileChange('feesBoardingDistributionPdf', file)}
                            onRemove={() => handleFileRemove('feesBoardingDistributionPdf')}
                            label="Boarding Fees Breakdown PDF"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Admission Information */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
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
                            Admission Fee (KES)
                          </label>
                          <TextField 
                            fullWidth 
                            size="medium"
                            type="number"
                            min="0"
                            value={formData.admissionFee} 
                            onChange={(e) => handleChange('admissionFee', e.target.value)}
                            placeholder="Enter admission fee"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '10px',
                                backgroundColor: 'white',
                                fontSize: '1rem',
                                fontWeight: 'bold'
                              }
                            }}
                          />
                        </div>

                        {/* Custom Admission Fee Breakdown */}
                        <CustomFeeBreakdown
                          title="Admission Fee"
                          color="from-orange-50 to-orange-100"
                          fees={admissionFees}
                          onFeesChange={setAdmissionFees}
                          totalField={formData.admissionFee}
                          onTotalChange={(value) => handleChange('admissionFee', value)}
                        />

                        {/* Admission Fee PDF Upload */}
                        <div className="mt-4">
                          <ModernPdfUpload 
                            pdfFile={files.admissionFeePdf}
                            onPdfChange={(file) => handleFileChange('admissionFeePdf', file)}
                            onRemove={() => handleFileRemove('admissionFeePdf')}
                            label="Admission Fee Breakdown PDF"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Admission Capacity
                          </label>
                          <TextField 
                            fullWidth 
                            size="medium"
                            type="number"
                            min="1"
                            value={formData.admissionCapacity} 
                            onChange={(e) => handleChange('admissionCapacity', e.target.value)}
                            placeholder="Enter admission capacity"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '10px',
                                backgroundColor: 'white',
                                fontSize: '1rem'
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Other Exam Results - Right Side */}
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 border border-indigo-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FaGraduationCap className="text-indigo-600" />
                        Other Exam Results
                      </h3>
                      
                      <div className="space-y-4">
                        {[
                          { key: 'form3ResultsPdf', label: 'Form 3 Results', yearKey: 'form3ResultsYear' },
                          { key: 'form4ResultsPdf', label: 'Form 4 Results', yearKey: 'form4ResultsYear' },
                          { key: 'mockExamsResultsPdf', label: 'Mock Exams', yearKey: 'mockExamsYear' },
                          { key: 'kcseResultsPdf', label: 'KCSE Results', yearKey: 'kcseYear' }
                        ].map((exam) => (
                          <div key={exam.key} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-bold text-gray-700">{exam.label}</label>
                              <div className="w-28">
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
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
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

              <div className="flex items-center gap-3">
                {currentStep > 0 && (
                  <button 
                    type="button"
                    onClick={handlePrevStep}
                    className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition duration-200 font-bold disabled:opacity-50 cursor-pointer text-sm"
                  >
                    ← Previous
                  </button>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <button 
                    type="button"
                    onClick={handleNextStep}
                    disabled={!isStepValid()}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200 font-bold shadow disabled:opacity-50 cursor-pointer flex items-center gap-2 text-sm"
                  >
                    Continue →
                  </button>
                ) : (
                  <button 
                    type="submit"
                    disabled={loading || !isStepValid()}
                    className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition duration-200 font-bold shadow disabled:opacity-50 cursor-pointer flex items-center gap-2 text-sm"
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

// Video Thumbnail Component
function VideoThumbnail({ videoType, videoPath, onClick }) {
  const getYouTubeThumbnail = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  };

  const thumbnail = videoType === 'youtube' ? getYouTubeThumbnail(videoPath) : null;

  return (
    <div 
      className="relative group cursor-pointer overflow-hidden rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
      onClick={onClick}
    >
      {thumbnail ? (
        <div className="relative aspect-video">
          <img 
            src={thumbnail} 
            alt="Video Thumbnail" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <FaPlay className="text-white ml-1" />
            </div>
          </div>
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-center">
            <FaVideo className="text-gray-400 text-3xl mx-auto mb-2" />
            <p className="text-gray-600 text-sm">Video Preview</p>
          </div>
        </div>
      )}
      
      <div className="p-3 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {videoType === 'youtube' ? (
              <>
                <FaYoutube className="text-red-500" />
                <span className="text-xs font-medium text-gray-700">YouTube Video</span>
              </>
            ) : (
              <>
                <FaVideo className="text-blue-500" />
                <span className="text-xs font-medium text-gray-700">Local Video</span>
              </>
            )}
          </div>
          <button className="text-xs text-blue-600 font-medium hover:text-blue-800 transition-colors">
            Watch Video
          </button>
        </div>
      </div>
    </div>
  );
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

  if (loading && !schoolInfo) {
    return <ModernLoadingSpinner message="Loading school information..." size="medium" />
  }

  // Helper function to render fee distribution
  const renderFeeDistribution = (distribution, title, color) => {
    if (!distribution || Object.keys(distribution).length === 0) return null
    
    return (
      <div className="mt-4">
        <h4 className="text-sm font-bold text-gray-700 mb-3">{title} Breakdown</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(distribution).map(([key, value]) => (
            value > 0 && (
              <div key={key} className={`bg-gradient-to-br ${color} rounded-lg p-3 border ${color.includes('green') ? 'border-green-200' : 'border-blue-200'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">{key}</span>
                  <span className="text-sm font-bold text-gray-900">KES {parseFloat(value).toLocaleString()}</span>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 md:p-6">
      <Toaster position="top-right" richColors />

      {/* Custom scrollbar styles */}
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

      {/* Video Modal */}
      {schoolInfo?.videoTour && (
        <VideoModal
          open={showVideoModal}
          onClose={() => setShowVideoModal(false)}
          videoType={schoolInfo.videoType}
          videoPath={schoolInfo.videoTour}
        />
      )}

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl shadow border border-blue-200 p-4 md:p-6 mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">School Information Management</h1>
            <p className="text-gray-600 text-xs lg:text-sm">Manage all school details, fees, admissions, and academic information</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={loadSchoolInfo} className="flex items-center gap-1 bg-gray-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition duration-200 font-bold shadow cursor-pointer text-xs">
              <FaSync className={`text-xs ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            
            {/* Delete button */}
            {schoolInfo && (
              <button 
                onClick={() => setShowDeleteModal(true)} 
                className="flex items-center gap-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1.5 rounded-lg hover:from-red-700 hover:to-red-800 transition duration-200 font-bold shadow cursor-pointer text-xs"
              >
                <FaTrash className="text-xs" /> Delete
              </button>
            )}
            
            <button 
              onClick={() => setShowModal(true)} 
              className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-200 font-bold shadow cursor-pointer text-xs"
            >
              <FaPlus className="text-xs" /> {schoolInfo ? 'Update Information' : 'Create Information'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - SHOWING DATA DIRECTLY */}
      {schoolInfo ? (
        <div className="space-y-6">
          {/* School Overview Card */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-4 md:p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{schoolInfo.name}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                    <FaGraduationCap className="inline mr-1" /> {schoolInfo.studentCount?.toLocaleString()} Students
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                    <FaChalkboardTeacher className="inline mr-1" /> {schoolInfo.staffCount?.toLocaleString()} Staff
                  </span>
                  {schoolInfo.motto && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
                      <FaQuoteLeft className="inline mr-1" /> "{schoolInfo.motto}"
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowModal(true)} 
                  className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200 font-bold shadow cursor-pointer text-xs"
                >
                  <FaEdit className="text-xs" /> Update Information
                </button>
              </div>
            </div>

            {/* Description */}
            {schoolInfo.description && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600 text-sm">{schoolInfo.description}</p>
              </div>
            )}

            {/* Vision & Mission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {schoolInfo.vision && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <FaEye className="text-blue-600" />
                    Vision
                  </h3>
                  <p className="text-gray-700 text-sm">{schoolInfo.vision}</p>
                </div>
              )}
              
              {schoolInfo.mission && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <FaRocket className="text-green-600" />
                    Mission
                  </h3>
                  <p className="text-gray-700 text-sm">{schoolInfo.mission}</p>
                </div>
              )}
            </div>

            {/* Video Tour - THUMBNAIL VERSION */}
            {schoolInfo.videoTour && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <FaVideo className="text-red-500" />
                  Video Tour
                </h3>
                <div className="max-w-md">
                  <VideoThumbnail
                    videoType={schoolInfo.videoType}
                    videoPath={schoolInfo.videoTour}
                    onClick={() => setShowVideoModal(true)}
                  />
                </div>
              </div>
            )}

            {/* Academic Information */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <FaGraduationCap className="text-purple-600" />
                Academic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Academic Calendar */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Academic Calendar</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Opening Date:</span>
                      <span className="text-sm font-bold text-gray-900">
                        {new Date(schoolInfo.openDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Closing Date:</span>
                      <span className="text-sm font-bold text-gray-900">
                        {new Date(schoolInfo.closeDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subjects */}
                {Array.isArray(schoolInfo.subjects) && schoolInfo.subjects.length > 0 && (
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Subjects</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {schoolInfo.subjects.map((subject, index) => (
                        <span 
                          key={index} 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded text-xs font-bold"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Departments */}
                {Array.isArray(schoolInfo.departments) && schoolInfo.departments.length > 0 && (
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Departments</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {schoolInfo.departments.map((dept, index) => (
                        <span 
                          key={index} 
                          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 py-1 rounded text-xs font-bold"
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Fee Structure - WITH CUSTOM FEE BREAKDOWN */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <FaDollarSign className="text-green-600" />
                Fee Structure
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Day Fees Section */}
                {schoolInfo.feesDay && (
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 md:p-6 border border-green-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">Day School Fees</h4>
                        <p className="text-xs text-gray-600">Annual tuition fees</p>
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        KES {schoolInfo.feesDay?.toLocaleString()}
                      </div>
                    </div>
                    
                    {/* Custom Fee Distribution Display */}
                    {schoolInfo.feesDayDistribution && renderFeeDistribution(
                      schoolInfo.feesDayDistribution,
                      'Day School Fee',
                      'from-green-50 to-green-100'
                    )}

                    {/* PDF Section */}
                    {schoolInfo.feesDayDistributionPdf && (
                      <div className="mt-4 pt-4 border-t border-green-200">
                        <h4 className="text-sm font-bold text-gray-900 mb-2">Fee Breakdown Document</h4>
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FaFilePdf className="text-red-500" />
                              <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                {schoolInfo.feesDayPdfName || 'Fee Breakdown PDF'}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <a
                                href={schoolInfo.feesDayDistributionPdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold hover:bg-blue-600 transition"
                              >
                                View
                              </a>
                              <a
                                href={schoolInfo.feesDayDistributionPdf}
                                download
                                className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold hover:bg-green-600 transition"
                              >
                                Download
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Boarding Fees Section */}
                {schoolInfo.feesBoarding && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 md:p-6 border border-blue-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">Boarding Fees</h4>
                        <p className="text-xs text-gray-600">Annual boarding fees</p>
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        KES {schoolInfo.feesBoarding?.toLocaleString()}
                      </div>
                    </div>
                    
                    {/* Custom Fee Distribution Display */}
                    {schoolInfo.feesBoardingDistribution && renderFeeDistribution(
                      schoolInfo.feesBoardingDistribution,
                      'Boarding Fee',
                      'from-blue-50 to-blue-100'
                    )}

                    {/* PDF Section */}
                    {schoolInfo.feesBoardingDistributionPdf && (
                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <h4 className="text-sm font-bold text-gray-900 mb-2">Fee Breakdown Document</h4>
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FaFilePdf className="text-red-500" />
                              <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                {schoolInfo.feesBoardingPdfName || 'Boarding Fee Breakdown PDF'}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <a
                                href={schoolInfo.feesBoardingDistributionPdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold hover:bg-blue-600 transition"
                              >
                                View
                              </a>
                              <a
                                href={schoolInfo.feesBoardingDistributionPdf}
                                download
                                className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold hover:bg-green-600 transition"
                              >
                                Download
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Admission Information */}
            {(schoolInfo.admissionOpenDate || schoolInfo.admissionFee) && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <FaUserCheck className="text-orange-600" />
                  Admission Information
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {/* Admission Timeline */}
                    {(schoolInfo.admissionOpenDate || schoolInfo.admissionCloseDate) && (
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                        <h4 className="text-sm font-bold text-gray-900 mb-3">Admission Timeline</h4>
                        <div className="space-y-2">
                          {schoolInfo.admissionOpenDate && (
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">Opens:</span>
                              <span className="text-sm font-bold text-gray-900">
                                {new Date(schoolInfo.admissionOpenDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          )}
                          {schoolInfo.admissionCloseDate && (
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">Closes:</span>
                              <span className="text-sm font-bold text-gray-900">
                                {new Date(schoolInfo.admissionCloseDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Admission Fee */}
                    {schoolInfo.admissionFee && (
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-sm font-bold text-gray-900">Admission Fee</h4>
                            <p className="text-xs text-gray-600">One-time admission fee</p>
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            KES {schoolInfo.admissionFee?.toLocaleString()}
                          </div>
                        </div>
                        
                        {/* Custom Admission Fee Distribution Display */}
                        {schoolInfo.admissionFeeDistribution && renderFeeDistribution(
                          schoolInfo.admissionFeeDistribution,
                          'Admission Fee',
                          'from-green-50 to-green-100'
                        )}

                        {/* Admission Fee PDF */}
                        {schoolInfo.admissionFeePdf && (
                          <div className="mt-4 pt-4 border-t border-green-200">
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <FaFilePdf className="text-red-500" />
                                  <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                    {schoolInfo.admissionFeePdfName || 'Admission Fee PDF'}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <a
                                    href={schoolInfo.admissionFeePdf}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold hover:bg-blue-600 transition"
                                  >
                                    View
                                  </a>
                                  <a
                                    href={schoolInfo.admissionFeePdf}
                                    download
                                    className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold hover:bg-green-600 transition"
                                  >
                                    Download
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Admission Details */}
                    {(schoolInfo.admissionCapacity || schoolInfo.admissionContactEmail) && (
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                        <h4 className="text-sm font-bold text-gray-900 mb-3">Admission Details</h4>
                        <div className="space-y-3">
                          {schoolInfo.admissionCapacity && (
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">Capacity:</span>
                              <span className="text-sm font-bold text-gray-900">{schoolInfo.admissionCapacity?.toLocaleString()} Students</span>
                            </div>
                          )}
                          {schoolInfo.admissionContactEmail && (
                            <div className="flex items-center gap-2">
                              <FaEnvelope className="text-gray-400 text-xs" />
                              <span className="text-xs text-gray-600 truncate">{schoolInfo.admissionContactEmail}</span>
                            </div>
                          )}
                          {schoolInfo.admissionContactPhone && (
                            <div className="flex items-center gap-2">
                              <FaPhone className="text-gray-400 text-xs" />
                              <span className="text-xs text-gray-600">{schoolInfo.admissionContactPhone}</span>
                            </div>
                          )}
                          {schoolInfo.admissionWebsite && (
                            <div className="flex items-center gap-2">
                              <FaGlobe className="text-gray-400 text-xs" />
                              <a href={schoolInfo.admissionWebsite} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate">
                                {schoolInfo.admissionWebsite}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Required Documents */}
                    {Array.isArray(schoolInfo.admissionDocumentsRequired) && schoolInfo.admissionDocumentsRequired.length > 0 && (
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                        <h4 className="text-sm font-bold text-gray-900 mb-3">Required Documents</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {schoolInfo.admissionDocumentsRequired.map((doc, index) => (
                            <span 
                              key={index} 
                              className="bg-white text-gray-700 border border-gray-300 px-2 py-1 rounded text-xs font-medium"
                            >
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Curriculum PDF */}
            {schoolInfo.curriculumPDF && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <FaBook className="text-blue-600" />
                  Curriculum
                </h3>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaFilePdf className="text-red-500 text-lg" />
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{schoolInfo.curriculumPdfName || 'Curriculum PDF'}</p>
                        <p className="text-xs text-gray-600">Curriculum Document</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={schoolInfo.curriculumPDF}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition font-bold text-xs"
                      >
                        View PDF
                      </a>
                      <a
                        href={schoolInfo.curriculumPDF}
                        download
                        className="bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition font-bold text-xs"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Exam Results */}
            {schoolInfo.examResults && Object.keys(schoolInfo.examResults).length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <FaAward className="text-purple-600" />
                  Exam Results
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(schoolInfo.examResults).map(([key, result]) => (
                    <div key={key} className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-sm font-bold text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                        {result.year && (
                          <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-0.5 rounded-full">
                            {result.year}
                          </span>
                        )}
                      </div>
                      {result.pdf && (
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FaFilePdf className="text-red-500 text-sm" />
                              <span className="text-xs font-medium text-gray-900 truncate max-w-[120px]">
                                {result.name || 'Results PDF'}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <a
                                href={result.pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold hover:bg-blue-600 transition"
                              >
                                View
                              </a>
                              <a
                                href={result.pdf}
                                download
                                className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold hover:bg-green-600 transition"
                              >
                                Download
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty State */
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

      {/* Modals */}
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