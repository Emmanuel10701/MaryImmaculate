'use client';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import { FcAdvertising, FcClock, FcOk, FcConferenceCall, FcLineChart } from 'react-icons/fc';
import { HiOutlineMail, HiOutlineClock, HiOutlineCheckCircle } from 'react-icons/hi';
import { HiOutlineSearch, HiArrowsUpDown , HiOutlineCalendar, HiOutlineSortAscending, HiOutlineRefresh } from 'react-icons/hi';
import {
  Mail, Send, Edit, Trash2, Search, Filter, X, Loader2, Clock, CheckCircle2,
  XCircle, BarChart3, Users, RefreshCw, Star, GraduationCap, Hash, TrendingUp,
  TrendingDown, Grid, List, Download, Percent, ShieldCheck, UserCheck, AlertCircle,
  Info, ChevronDown, ChevronUp, BookOpen, Target, Award, Trophy, Check,
  MoreVertical, FileUp, CheckSquare, Square, FileText, Upload, FileSpreadsheet,
  Archive, FileX, AlertTriangle, UserPlus, MailCheck, FileCheck, Columns,
  Settings, Bell, ExternalLink, Briefcase, School, Home, Globe, Map, Heart,
  TargetIcon, BookMarked, BookOpenCheck, AwardIcon, Crown, Sparkles, Zap, Rocket,
  TrendingUpIcon, ChevronRight, ChevronLeft, FileDown, Printer, Share2, Copy,
  FilterX, CalendarDays, UserCircle, MailOpen, Smartphone, MessageSquare,
  FilePlus, CheckCheck, Plus, Eye, Bold, Image, Link, Save, Calendar, Paperclip, FileText as FileText2, Users as Users2, Send as Send2
} from 'lucide-react';

import CircularProgress from "@mui/material/CircularProgress";


// Modern Scrollbar Styles
const modernScrollbarStyles = `
  .modern-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  .modern-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
  }
  
  .modern-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 10px;
  }
  
  .modern-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  }
`;

// Helper Functions
const getFileIcon = (fileType) => {
  const icons = {
    'pdf': '📄',
    'doc': '📝',
    'docx': '📝',
    'xls': '📊',
    'xlsx': '📊',
    'ppt': '📽️',
    'pptx': '📽️',
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'png': '🖼️',
    'gif': '🖼️',
    'txt': '📃',
    'zip': '🗜️',
    'rar': '🗜️',
    'mp3': '🎵',
    'mp4': '🎬',
    'avi': '🎬',
    'mov': '🎬'
  };
  
  const ext = (fileType || '').toLowerCase();
  return icons[ext] || '📎';
};

const formatFileSize = (bytes) => {
  if (!bytes) return '';
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Add this helper function at the top of the file, after the other helper functions:
const parseCampaignAttachments = (attachmentsString) => {
  if (!attachmentsString) {
    return [];
  }
  
  if (Array.isArray(attachmentsString)) {
    return attachmentsString;
  }
  
  if (typeof attachmentsString === 'string') {
    if (attachmentsString.trim() === '' || attachmentsString === 'null' || attachmentsString === 'undefined') {
      return [];
    }
    
    try {
      const parsed = JSON.parse(attachmentsString);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error parsing attachments:', error, 'String:', attachmentsString);
      return [];
    }
  }
  
  // For any other type, return empty array
  return [];
};

// Upload Attachments Component - REFINED
const UploadAttachments = ({ open, onClose, onFilesSelected, existingAttachments = [] }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => 
      file.size <= 10 * 1024 * 1024 // 10MB limit
    );
    
    if (validFiles.length !== selectedFiles.length) {
      toast.error('Some files exceed 10MB limit');
    }
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Pass selected files back to parent component
    onFilesSelected(files);
    onClose();
    setFiles([]);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <FileUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Add Attachments</h2>
                <p className="text-blue-100/80 text-sm">Files will be uploaded with your campaign</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Upload Area */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all"
          >
            <div className="mb-4">
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Drop files here or click to upload</h3>
            <p className="text-gray-600 mb-4">Maximum file size: 10MB per file</p>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium">
              Select Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Existing Attachments Preview */}
          {existingAttachments.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold text-gray-900 mb-3">Current Attachments</h3>
              <div className="space-y-2">
                {existingAttachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg border border-gray-200/60">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getFileIcon(file.fileType)}</span>
                      <div>
                        <p className="font-medium text-gray-900">{file.originalName || file.filename}</p>
                        <p className="text-sm text-gray-600">
                          {file.fileType?.toUpperCase()} • {formatFileSize(file.fileSize)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                      Already attached
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Files to Add */}
          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold text-gray-900 mb-3">Files to Add ({files.length})</h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 rounded-lg border border-blue-200/60">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getFileIcon(file.name.split('.').pop())}</span>
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-600">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1.5 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-3">
            <button
              onClick={() => {
                onClose();
                setFiles([]);
              }}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={uploading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium disabled:opacity-50"
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </span>
              ) : (
                'Add Files'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({ 
  open, 
  onClose, 
  title, 
  message, 
  confirmText = "Delete", 
  cancelText = "Cancel",
  onConfirm,
  isDanger = true,
  loading = false
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-xl ${isDanger ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium transition-colors hover:bg-gray-50"
              disabled={loading}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 text-white rounded-xl font-medium transition-all ${
                isDanger 
                  ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700' 
                  : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </span>
              ) : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Modal Component (reduced width)
const ModernModal = ({ children, open, onClose, maxWidth = '800px' }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <style>{modernScrollbarStyles}</style>
      <div 
        className="bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden"
        style={{ 
          width: '85%',
          maxWidth: '850px', // Reduced from 1100px to 650px
          maxHeight: '85vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}
      >
        {children}
      </div>
    </div>
  );
};


const CampaignCard = ({ 
  campaign, 
  isSelected, 
  onSelect, 
  onView, 
  onEdit, 
  onSend, 
  onDelete,
  loadingStates
}) => {
  const recipientCount = campaign.recipients ? campaign.recipients.split(',').length : 0;
  const attachments = parseCampaignAttachments(campaign.attachments);
  const hasAttachments = attachments.length > 0;

  const getStatusBadge = (status) => {
    if (status === 'published') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100/80 backdrop-blur-sm text-emerald-800 border border-emerald-200/50 shadow-xs">
          <CheckCircle2 className="w-3 h-3" />
          Sent
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100/80 backdrop-blur-sm text-yellow-800 border border-yellow-200/50 shadow-xs">
        <Clock className="w-3 h-3" />
        Draft
      </span>
    );
  };

  const getRecipientGroupBadge = (groupValue) => {
    const groupLabels = {
      'all': 'All',
      'parents': 'Parents',
      'teachers': 'Teachers',
      'administration': 'Admin',
      'bom': 'BOM',
      'support': 'Support',
      'staff': 'Staff'
    };
    
    return (
      <span 
        title={groupLabels[groupValue] || groupValue}
        className="inline-flex items-center justify-center px-2 py-1 rounded-lg text-[10px] font-medium bg-gradient-to-r from-blue-50/80 to-cyan-50/80 backdrop-blur-sm text-blue-800 border border-blue-200/50 min-w-[60px] shadow-xs"
      >
        {groupLabels[groupValue] || groupValue}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className={`rounded-xl border transition-all duration-300 ${
      isSelected 
        ? 'border-blue-300/50 bg-blue-50/30 backdrop-blur-sm shadow-lg shadow-blue-100/50' 
        : 'border-gray-200/60 bg-white/60 backdrop-blur-sm hover:border-gray-300/60 hover:shadow-lg hover:shadow-gray-200/50'
    }`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <div className="pt-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onSelect(campaign.id)}
              className="p-1.5 rounded-full hover:bg-gray-100/50 transition-colors"
            >
              {isSelected ? (
                <CheckSquare className="w-4 h-4 text-blue-600" />
              ) : (
                <Square className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>

          {/* Campaign Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                    <Mail className="text-white w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-gray-900 truncate text-base bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent">
                    {campaign.title || 'Untitled Campaign'}
                  </h4>
                </div>
                <p className="text-base text-gray-700 mb-3 truncate">
                  Subject: <span className="font-medium text-gray-900">{campaign.subject || 'No subject'}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                {getStatusBadge(campaign.status)}
              </div>
            </div>

            {/* Stats and Info */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">Recipients:</span>
                <span className="inline-flex items-center justify-center w-7 h-7 bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-700 rounded-full text-sm font-bold border border-blue-100">
                  {recipientCount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">Group:</span>
                {getRecipientGroupBadge(campaign.recipientType)}
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700 font-medium">
                  {formatDate(campaign.sentAt || campaign.createdAt)}
                </span>
              </div>
            </div>

            {/* Attachment Indicator */}
            {hasAttachments && (
              <div className="mb-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 backdrop-blur-sm rounded-lg border border-blue-200/50">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    {attachments.length} attachment(s)
                  </span>
                </div>
              </div>
            )}

            {/* Content Preview */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                {campaign.content?.substring(0, 150)}...
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onView(campaign)}
                  className="
                    inline-flex items-center gap-2
                    px-4 py-2 text-sm
                    text-blue-700
                    bg-blue-50
                    border border-blue-200
                    rounded-xl
                    shadow-sm
                    hover:bg-blue-100
                    hover:border-blue-300
                    hover:text-blue-800
                    transition-all duration-200
                    active:scale-98
                    font-medium
                  "
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>

                {campaign.status === 'draft' && (
                  <button
                    onClick={() => onEdit(campaign)}
                    className="
                      inline-flex items-center gap-2
                      px-4 py-2 text-sm
                      text-purple-700
                      bg-purple-50
                      border border-purple-200
                      rounded-xl
                      shadow-sm
                      hover:bg-purple-100
                      hover:border-purple-300
                      hover:text-purple-800
                      transition-all duration-200
                      active:scale-98
                      font-medium
                    "
                  >
                    <Edit className="w-4 h-4" />
                    Edit Campaign
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                {campaign.status === 'draft' && (
                  <button
                    onClick={() => onSend(campaign)}
                    disabled={loadingStates.send}
                    className="
                      inline-flex items-center gap-2
                      px-4 py-2 text-sm
                      text-emerald-700
                      bg-emerald-50
                      border border-emerald-200
                      rounded-xl
                      shadow-sm
                      hover:bg-emerald-100
                      hover:border-emerald-300
                      hover:text-emerald-800
                      transition-all duration-200
                      active:scale-98
                      disabled:opacity-50 
                      disabled:cursor-not-allowed
                      font-medium
                    "
                  >
                    <Send className="w-4 h-4" />
                    Send Now
                  </button>
                )}
                <button
                  onClick={() => onDelete(campaign)}
                  className="
                    inline-flex items-center gap-2
                    px-4 py-2 text-sm
                    text-rose-700
                    bg-rose-50
                    border border-rose-200
                    rounded-xl
                    shadow-sm
                    hover:bg-rose-100
                    hover:border-rose-300
                    hover:text-rose-800
                    transition-all duration-200
                    active:scale-98
                    font-medium
                  "
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Email Skeleton Component
const ModernEmailSkeleton = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xs border border-gray-200/60 overflow-hidden animate-pulse">
      {/* Header Skeleton */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-7 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg bg-[length:200%_100%] animate-shimmer"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-gray-200 rounded-xl"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>

      {/* View Toggle Skeleton */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="p-6 border-b border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white/50 rounded-xl border border-gray-200/60 p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                  <div className="h-5 w-12 bg-gray-300 rounded-lg"></div>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <div className="h-11 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-11 w-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Cards Skeleton */}
      <div className="p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/50 rounded-xl border border-gray-200/60 p-4">
            <div className="flex items-start gap-3">
              <div className="h-4 w-4 bg-gray-200 rounded mt-1"></div>
              <div className="flex-1 space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-3 w-48 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-3 w-full bg-gray-200 rounded"></div>
                <div className="flex justify-between pt-3">
                  <div className="h-6 w-24 bg-gray-200 rounded-lg"></div>
                  <div className="h-6 w-24 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Notification Toast Component
const NotificationToast = ({ type, message, onClose }) => {
  const icons = {
    success: CheckCircle2,
    error: XCircle,
    info: Info,
    warning: AlertTriangle
  };
  
  const colors = {
    success: 'bg-emerald-50/80 backdrop-blur-sm border-emerald-200/50 text-emerald-800',
    error: 'bg-red-50/80 backdrop-blur-sm border-red-200/50 text-red-800',
    info: 'bg-blue-50/80 backdrop-blur-sm border-blue-200/50 text-blue-800',
    warning: 'bg-yellow-50/80 backdrop-blur-sm border-yellow-200/50 text-yellow-800'
  };
  
  const Icon = icons[type] || Info;
  
  return (
    <div className={`fixed top-4 right-4 z-50 rounded-xl border p-4 shadow-lg animate-in slide-in-from-right-5 duration-300 ${colors[type]}`}>
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:opacity-70">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default function ModernEmailCampaignsManager() {
  // Main State
  const [campaigns, setCampaigns] = useState([]);
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // View States
  const [activeView, setActiveView] = useState('all');
  const [selectedCampaigns, setSelectedCampaigns] = useState(new Set());
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  
  // Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [showSendConfirmationModal, setShowSendConfirmationModal] = useState(false);
  const [campaignToSend, setCampaignToSend] = useState(null);
  
  // Notification State
  const [notification, setNotification] = useState(null);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRecipientType, setFilterRecipientType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  // Campaign Form State
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    subject: '',
    content: '',
    recipientType: 'all',
    status: 'draft',
    recipients: []
  });
  
  // Attachments State - UPDATED
  const [campaignAttachments, setCampaignAttachments] = useState([]); // Existing attachments (from DB)
  const [newAttachmentFiles, setNewAttachmentFiles] = useState([]); // New files to upload
  
  // Loading States
  const [loadingStates, setLoadingStates] = useState({
    create: false,
    send: false,
    delete: false,
    bulk: false,
    fetching: false
  });
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    published: 0,
    totalRecipients: 0,
    successRate: 0,
    openedRate: 0
  });

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };
  
  // ==================== HELPER FUNCTIONS ====================
  
  const getRecipientCount = useCallback((campaign) => {
    if (!campaign || !campaign.recipients) return 0;
    return campaign.recipients.split(',').length;
  }, []);
  
const getRecipientEmails = useCallback((recipientType) => {
  const getEmailList = (list) => 
    list
      .filter(item => item && typeof item === 'object' && item.email && typeof item.email === 'string' && item.email.trim() !== '')
      .map(item => item.email.trim());

  const safeStudents = Array.isArray(students) ? students : [];
  const safeStaff = Array.isArray(staff) ? staff : [];

  // Get emails from students - using the mapped structure
  const parentEmails = getEmailList(safeStudents);

  // Get emails from staff
  const staffEmails = getEmailList(safeStaff);

  switch (recipientType) {
    case 'parents':
      return parentEmails;
    case 'teachers':
      const teachers = safeStaff.filter(s => 
        s.role === 'Teacher' || 
        ['Sciences', 'Mathematics', 'Languages', 'Humanities', 'Sports'].includes(s.department)
      );
      return getEmailList(teachers);
    case 'administration':
      const admins = safeStaff.filter(s => 
        s.role === 'Principal' || 
        s.role === 'Deputy Principal' ||
        s.department === 'Administration'
      );
      return getEmailList(admins);
    case 'bom':
      const bom = safeStaff.filter(s => 
        s.role === 'BOM Member' || 
        (s.position && s.position.toLowerCase().includes('board'))
      );
      return getEmailList(bom);
    case 'support':
      const support = safeStaff.filter(s => 
        s.role === 'Support Staff' || 
        s.role === 'Librarian' || 
        s.role === 'Counselor'
      );
      return getEmailList(support);
    case 'staff':
      return staffEmails;
    case 'all':
    default:
      // Remove duplicates by using Set
      return [...new Set([...parentEmails, ...staffEmails])];
  }
}, [students, staff]);

const recipientGroups = useMemo(() => {
  const safeStudents = Array.isArray(students) ? students : [];
  const safeStaff = Array.isArray(staff) ? staff : [];

  // Count valid emails from students
  const getParentEmailsCount = () => 
    safeStudents.filter(s => s.email && typeof s.email === 'string' && s.email.trim() !== '').length;

  const getTeachingStaffCount = () => 
    safeStaff.filter(s => 
      s.role === 'Teacher' || 
      ['Sciences', 'Mathematics', 'Languages', 'Humanities', 'Sports'].includes(s.department)
    ).length;

  const getAdminStaffCount = () => 
    safeStaff.filter(s => 
      s.role === 'Principal' || 
      s.role === 'Deputy Principal' ||
      s.department === 'Administration'
    ).length;

  const getBOMCount = () => 
    safeStaff.filter(s => 
      s.role === 'BOM Member' || 
      (s.position && s.position.toLowerCase().includes('board'))
    ).length;

  const getSupportStaffCount = () => 
    safeStaff.filter(s => 
      s.role === 'Support Staff' || 
      s.role === 'Librarian' || 
      s.role === 'Counselor'
    ).length;

  const getAllStaffCount = () => 
    safeStaff.filter(s => s.email && typeof s.email === 'string' && s.email.trim() !== '').length;

  const calculateTotalRecipients = () => 
    getParentEmailsCount() + getAllStaffCount();

  return [
    { 
      value: 'all', 
      label: 'All Recipients',
      shortLabel: 'All',
      count: calculateTotalRecipients(),
      color: 'from-blue-500 to-cyan-500',
      icon: Users,
      gradient: 'bg-gradient-to-r from-blue-500 to-cyan-500'
    },
    { 
      value: 'parents', 
      label: 'Parents & Guardians',
      shortLabel: 'Parents',
      count: getParentEmailsCount(),
      color: 'from-green-500 to-emerald-500',
      icon: Users,
      gradient: 'bg-gradient-to-r from-green-500 to-emerald-500'
    },
    { 
      value: 'teachers', 
      label: 'Teaching Staff',
      shortLabel: 'Teachers',
      count: getTeachingStaffCount(),
      color: 'from-purple-500 to-pink-500',
      icon: GraduationCap,
      gradient: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    { 
      value: 'administration', 
      label: 'Administration',
      shortLabel: 'Admin',
      count: getAdminStaffCount(),
      color: 'from-orange-500 to-amber-500',
      icon: Award,
      gradient: 'bg-gradient-to-r from-orange-500 to-amber-500'
    },
    { 
      value: 'bom', 
      label: 'Board of Management',
      shortLabel: 'BOM',
      count: getBOMCount(),
      color: 'from-red-500 to-rose-500',
      icon: ShieldCheck,
      gradient: 'bg-gradient-to-r from-red-500 to-rose-500'
    },
    { 
      value: 'support', 
      label: 'Support Staff',
      shortLabel: 'Support',
      count: getSupportStaffCount(),
      color: 'from-indigo-500 to-violet-500',
      icon: Users,
      gradient: 'bg-gradient-to-r from-indigo-500 to-violet-500'
    },
    { 
      value: 'staff', 
      label: 'All School Staff',
      shortLabel: 'Staff',
      count: getAllStaffCount(),
      color: 'from-cyan-500 to-blue-500',
      icon: Users,
      gradient: 'bg-gradient-to-r from-cyan-500 to-blue-500'
    }
  ];
}, [students, staff]);


  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft', color: 'bg-yellow-100/80 backdrop-blur-sm text-yellow-800', icon: Clock },
    { value: 'published', label: 'Sent', color: 'bg-emerald-100/80 backdrop-blur-sm text-emerald-800 border-emerald-200/50', icon: CheckCircle2 }
  ];
  

const fetchData = useCallback(async () => {
  try {
    setLoadingStates(prev => ({ ...prev, fetching: true }));
    setRefreshing(true);
    
    // Use /api/s endpoint for student emails
    const [campaignsRes, studentRes, staffRes] = await Promise.all([
      fetch('/api/emails'),
      fetch('/api/s'),  // Changed from /api/studentupload to /api/s
      fetch('/api/staff')
    ]);
    
    const campaignsData = await campaignsRes.json();
    const studentData = await studentRes.json();
    const staffData = await staffRes.json();
    
    if (campaignsData.success) {
      const campaignsList = campaignsData.campaigns || [];
      setCampaigns(campaignsList);
      updateStats(campaignsList);
      if (refreshing) {
        showNotification('success', `Refreshed ${campaignsList.length} campaigns`);
      }
    }
    
    // Handle student data from /api/s endpoint
    let studentsArray = [];
    if (studentData.success && Array.isArray(studentData.data)) {
      // Map the data structure from /api/s endpoint
      studentsArray = studentData.data.map(student => ({
        id: student.admissionNumber || student.id,
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        email: student.email || '',  // Parent's email
        admissionNumber: student.admissionNumber || '',
        form: student.form || '',
        stream: student.stream || ''
      }));
    } else if (Array.isArray(studentData)) {
      // Fallback for array response
      studentsArray = studentData;
    } else if (Array.isArray(studentData?.data)) {
      studentsArray = studentData.data;
    } else if (Array.isArray(studentData?.students)) {
      studentsArray = studentData.students;
    }
    
    setStudents(studentsArray);
    console.log(`Loaded ${studentsArray.length} students/parents from API /api/s`);
    
    // Normalize staff data to always be an array
    let staffArray = [];
    if (Array.isArray(staffData)) {
      staffArray = staffData;
    } else if (Array.isArray(staffData?.staff)) {
      staffArray = staffData.staff;
    } else if (Array.isArray(staffData?.data)) {
      staffArray = staffData.data;
    }
    setStaff(staffArray);
    console.log(`Loaded ${staffArray.length} staff members from API`);
    
  } catch (error) {
    console.error('Error fetching data:', error);
    showNotification('error', 'Network error. Please check connection.');
  } finally {
    setLoading(false);
    setRefreshing(false);
    setLoadingStates(prev => ({ ...prev, fetching: false }));
  }
}, [refreshing]);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const updateStats = (campaignsList) => {
    const newStats = {
      total: campaignsList.length,
      draft: 0,
      published: 0,
      totalRecipients: 0,
      successRate: 0,
      openedRate: 0
    };
    
    campaignsList.forEach(campaign => {
      if (campaign.status === 'draft') newStats.draft++;
      if (campaign.status === 'published') newStats.published++;
      
      const count = getRecipientCount(campaign);
      newStats.totalRecipients += count;
      
      if (campaign.successRate) {
        newStats.successRate += campaign.successRate;
      }
    });
    
    if (newStats.published > 0) {
      newStats.successRate = Math.round(newStats.successRate / newStats.published);
    }
    
    setStats(newStats);
  };
  
  // ==================== FILTERING & SORTING ====================
  
  const filteredCampaigns = useMemo(() => {
    if (!Array.isArray(campaigns)) return [];
    
    return campaigns
      .filter(campaign => {
        if (!campaign || typeof campaign !== 'object') return false;
        
        const matchesSearch = 
          (campaign.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (campaign.subject?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === 'all' || campaign.status === filterStatus;
        const matchesRecipientType = filterRecipientType === 'all' || campaign.recipientType === filterRecipientType;
        
        let matchesDate = true;
        if (startDate || endDate) {
          const campaignDate = new Date(campaign.sentAt || campaign.createdAt);
          if (startDate) {
            const start = new Date(startDate);
            if (campaignDate < start) matchesDate = false;
          }
          if (endDate) {
            const end = new Date(endDate);
            if (campaignDate > end) matchesDate = false;
          }
        }
        
        let matchesView = true;
        if (activeView === 'draft') {
          matchesView = campaign.status === 'draft';
        } else if (activeView === 'published') {
          matchesView = campaign.status === 'published';
        }
        
        return matchesSearch && matchesStatus && matchesRecipientType && matchesDate && matchesView;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.sentAt || b.createdAt || 0) - new Date(a.sentAt || a.createdAt || 0);
          case 'oldest':
            return new Date(a.sentAt || a.createdAt || 0) - new Date(b.sentAt || b.createdAt || 0);
          case 'title-asc':
            return (a.title || '').localeCompare(b.title || '');
          case 'title-desc':
            return (b.title || '').localeCompare(a.title || '');
          case 'recipients-high':
            return getRecipientCount(b) - getRecipientCount(a);
          case 'recipients-low':
            return getRecipientCount(a) - getRecipientCount(b);
          default:
            return 0;
        }
      });
  }, [campaigns, searchTerm, filterStatus, filterRecipientType, startDate, endDate, activeView, sortBy, getRecipientCount]);
  
  // ==================== SELECTION HANDLERS ====================
  
  const toggleSelectAll = () => {
    if (selectedCampaigns.size === filteredCampaigns.length) {
      setSelectedCampaigns(new Set());
    } else {
      const allIds = new Set(filteredCampaigns.map(campaign => campaign.id).filter(Boolean));
      setSelectedCampaigns(allIds);
    }
  };
  
  const toggleSelectCampaign = (id) => {
    if (!id) return;
    const newSelection = new Set(selectedCampaigns);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedCampaigns(newSelection);
  };
  
  // ==================== CAMPAIGN OPERATIONS ====================
  
  const openCreateModal = () => {
    setCampaignForm({
      title: '',
      subject: '',
      content: '',
      recipientType: 'all',
      status: 'draft',
      recipients: []
    });
    setCampaignAttachments([]);
    setNewAttachmentFiles([]);
    setSelectedCampaign(null);
    setShowCreateModal(true);
  };
  
 const openEditModal = (campaign) => {
  if (!campaign) return;
  
  setCampaignForm({
    title: campaign.title || '',
    subject: campaign.subject || '',
    content: campaign.content || '',
    recipientType: campaign.recipientType || 'all',
    status: campaign.status || 'draft',
    recipients: []
  });
  
  // Use the helper function to parse attachments
  const existingAttachments = parseCampaignAttachments(campaign.attachments);
  
  setCampaignAttachments(existingAttachments);
  setNewAttachmentFiles([]); // Reset new files
  setSelectedCampaign(campaign);
  setShowCreateModal(true);
};
  
  const openDetailModal = (campaign) => {
    if (!campaign) return;
    setSelectedCampaign(campaign);
    setShowDetailModal(true);
  };
  
  const openDeleteModal = (campaign) => {
    if (!campaign) return;
    setCampaignToDelete(campaign);
    setShowDeleteModal(true);
  };
  
  const openSendConfirmationModal = (campaign) => {
    if (!campaign) return;
    setCampaignToSend(campaign);
    setShowSendConfirmationModal(true);
  };
  
  const openBulkDeleteModal = () => {
    if (selectedCampaigns.size === 0) {
      showNotification('error', 'Please select campaigns to delete');
      return;
    }
    setShowBulkDeleteModal(true);
  };
  
  // REFINED: Handle files selected from attachment modal
  const handleFilesSelected = (files) => {
    setNewAttachmentFiles(files);
  };
  
// In the handleCreateOrUpdateCampaign function, update the FormData creation:

const handleCreateOrUpdateCampaign = async () => {
  if (!campaignForm.title || !campaignForm.subject || !campaignForm.content) {
    showNotification('error', 'Please fill all required fields');
    return;
  }
  
  try {
    setLoadingStates(prev => ({ ...prev, create: true }));
    
    const recipientEmails = getRecipientEmails(campaignForm.recipientType);
    
    if (recipientEmails.length === 0) {
      showNotification('error', 'No recipients found for the selected group');
      setLoadingStates(prev => ({ ...prev, create: false }));
      return;
    }
    
    // Create FormData
    const formData = new FormData();
    
    // Add text fields
    formData.append('title', campaignForm.title.trim());
    formData.append('subject', campaignForm.subject.trim());
    formData.append('content', campaignForm.content);
    formData.append('recipients', recipientEmails.join(', '));
    formData.append('status', campaignForm.status);
    formData.append('recipientType', campaignForm.recipientType);
    
    // Add existing attachments as JSON string
    if (campaignAttachments.length > 0) {
      formData.append('existingAttachments', JSON.stringify(campaignAttachments));
    }
    
    // Add new files
    if (newAttachmentFiles.length > 0) {
      newAttachmentFiles.forEach((file) => {
        formData.append('attachments', file);
      });
    }
    
    const url = selectedCampaign 
      ? `/api/emails/${selectedCampaign.id}`
      : '/api/emails';
    
    const method = selectedCampaign ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      body: formData,
      // Do NOT set Content-Type header - browser will set it with boundary
    });
    
    const result = await response.json();
    
    if (result.success) {
      if (selectedCampaign) {
        setCampaigns(prev => prev.map(c => 
          c.id === selectedCampaign.id ? result.campaign : c
        ));
      } else {
        setCampaigns(prev => [result.campaign, ...prev]);
      }
      
      setShowCreateModal(false);
      setSelectedCampaign(null);
      setCampaignAttachments([]);
      setNewAttachmentFiles([]);
      
      setCampaignForm({
        title: '',
        subject: '',
        content: '',
        recipientType: 'all',
        status: 'draft',
        recipients: []
      });
      
      if (campaignForm.status === 'published' && result.emailResults?.summary?.successful > 0) {
        showNotification('success', `Campaign created and ${result.emailResults.summary.successful} emails sent successfully!`);
      } else {
        showNotification('success', `Campaign ${selectedCampaign ? 'updated' : 'created'} successfully!`);
      }
    } else {
      showNotification('error', result.error || `Failed to ${selectedCampaign ? 'update' : 'create'} campaign`);
    }
  } catch (error) {
    console.error('Error:', error);
    showNotification('error', 'Network error. Please try again.');
  } finally {
    setLoadingStates(prev => ({ ...prev, create: false }));
  }
};
  
  const handleSendCampaign = async () => {
    if (!campaignToSend) return;
    
    try {
      setLoadingStates(prev => ({ ...prev, send: true }));
      
      const response = await fetch(`/api/emails/${campaignToSend.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setCampaigns(prev => prev.map(c => 
          c.id === campaignToSend.id ? { ...c, status: 'published', sentAt: new Date().toISOString() } : c
        ));
        
        setShowSendConfirmationModal(false);
        setCampaignToSend(null);
        
        showNotification('success', `Campaign sent successfully!`);
      } else {
        showNotification('error', result.error || 'Failed to send campaign');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('error', 'Network error. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, send: false }));
    }
  };
  
  const handleDeleteCampaign = async () => {
    if (!campaignToDelete) return;
    
    try {
      setLoadingStates(prev => ({ ...prev, delete: true }));
      
      const response = await fetch(`/api/emails/${campaignToDelete.id}`, { method: 'DELETE' });
      const result = await response.json();
      
      if (result.success) {
        setCampaigns(prev => prev.filter(c => c.id !== campaignToDelete.id));
        setSelectedCampaigns(prev => {
          const newSet = new Set(prev);
          newSet.delete(campaignToDelete.id);
          return newSet;
        });
        showNotification('success', 'Campaign deleted successfully!');
        setShowDeleteModal(false);
        setCampaignToDelete(null);
      } else {
        showNotification('error', result.error || 'Failed to delete campaign');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('error', 'Network error. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, delete: false }));
    }
  };
  
  const handleBulkDelete = async () => {
    if (selectedCampaigns.size === 0) return;
    
    try {
      setLoadingStates(prev => ({ ...prev, bulk: true }));
      
      const deletePromises = Array.from(selectedCampaigns).map(id =>
        fetch(`/api/emails/${id}`, { method: 'DELETE' })
      );
      
      const results = await Promise.allSettled(deletePromises);
      
      const successfulDeletes = results.filter(result => 
        result.status === 'fulfilled' && result.value.ok
      );
      
      if (successfulDeletes.length > 0) {
        setCampaigns(prev => prev.filter(c => !selectedCampaigns.has(c.id)));
        setSelectedCampaigns(new Set());
        showNotification('success', `${successfulDeletes.length} campaign(s) deleted successfully!`);
        setShowBulkDeleteModal(false);
      } else {
        showNotification('error', 'Failed to delete campaigns');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('error', 'Network error. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, bulk: false }));
    }
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterRecipientType('all');
    setStartDate('');
    setEndDate('');
    setSortBy('newest');
    showNotification('info', 'Filters reset to default');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/20 p-4 md:p-6 modern-scrollbar">
      <style>{modernScrollbarStyles}</style>
      <Toaster position="top-right" richColors />
      
      {notification && (
        <NotificationToast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      
   {/* Modern Responsive Header – Email Campaigns */}
<div className="relative mb-6 sm:mb-8 overflow-hidden
                rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem]
                bg-gradient-to-br from-blue-700 via-cyan-700 to-emerald-700
                p-4 sm:p-6 md:p-8 shadow-xl sm:shadow-2xl">

  {/* Background Overlay */}
  <div className="absolute inset-0 opacity-[0.08] sm:opacity-10 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/10 to-emerald-400/10" />
  </div>

  {/* Glow Effects */}
  <div className="absolute -right-16 sm:-right-24 -top-16 sm:-top-24
                  w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96
                  bg-gradient-to-r from-cyan-500 to-blue-400
                  rounded-full opacity-15 sm:opacity-20
                  blur-xl sm:blur-2xl md:blur-3xl" />

  <div className="absolute -left-16 sm:-left-24 -bottom-16 sm:-bottom-24
                  w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96
                  bg-gradient-to-r from-emerald-500 to-teal-400
                  rounded-full opacity-10 sm:opacity-15
                  blur-xl sm:blur-2xl md:blur-3xl" />

  <div className="relative z-10">
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">

      {/* Left Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">

          {/* Icon */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500
                            rounded-xl sm:rounded-2xl blur-md sm:blur-lg opacity-70" />
            <div className="relative p-3 sm:p-4 bg-gradient-to-br from-blue-600 to-cyan-600
                            rounded-xl sm:rounded-2xl shadow-2xl">
              <Mail className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">

            {/* Badge */}
            <div className="hidden xs:inline-flex items-center gap-1.5 sm:gap-2
                            px-2 sm:px-3 py-1
                            bg-white/20 backdrop-blur-sm
                            rounded-full mb-2 sm:mb-3 max-w-max">
              <span className="text-[10px] xs:text-xs font-bold text-white uppercase tracking-widest">
                Communication
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl
                           font-black text-white tracking-tight leading-tight">
              Email Campaign
              <span className="block sm:inline"> </span>
              <span className="text-transparent bg-clip-text
                               bg-gradient-to-r from-cyan-200 to-emerald-200">
                Manager
              </span>
            </h1>

            {/* Description */}
            <p className="mt-2 sm:mt-3 text-sm xs:text-base sm:text-lg
                          text-cyan-100/90 font-medium
                          max-w-2xl leading-relaxed
                          line-clamp-2 sm:line-clamp-none">
              Create, schedule, and manage email campaigns for effective school communication.
            </p>

          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between
                      lg:flex-col lg:items-end gap-3 sm:gap-4">

        {/* Actions */}
        <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full xs:w-auto">

          {/* Refresh */}
          <button
            onClick={fetchData}
            disabled={refreshing || loadingStates.fetching}
            className="group relative flex items-center justify-center gap-2
                       px-4 sm:px-5 py-2.5 sm:py-3
                       bg-white/10 backdrop-blur-sm border border-white/20
                       rounded-xl sm:rounded-2xl text-white font-semibold
                       hover:bg-white/15 active:scale-95 transition-all
                       disabled:opacity-60 w-full xs:w-auto"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-xs sm:text-sm">
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </span>
          </button>

          {/* New Campaign */}
          <button
            onClick={openCreateModal}
            className="group relative overflow-hidden
                       px-4 sm:px-5 py-2.5 sm:py-3
                       bg-gradient-to-r from-cyan-500 to-emerald-500
                       text-white rounded-xl sm:rounded-2xl font-semibold
                       hover:shadow-xl hover:shadow-emerald-500/30
                       active:scale-95 transition-all w-full xs:w-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/0
                            opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="text-xs sm:text-sm whitespace-nowrap">
                New Campaign
              </span>
            </div>
          </button>

        </div>
      </div>

    </div>
  </div>
</div>


<div className="mb-8 space-y-6">

  {/* 1. Modern View Toggle - Floating Glass Tray */}
  <div className="inline-flex p-1.5 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 shadow-sm overflow-x-auto max-w-full no-scrollbar">
    <div className="flex items-center gap-1.5">
      {[
        { view: 'all', label: 'All', count: stats.total, icon: HiOutlineMail, color: 'text-slate-600', activeBg: 'bg-slate-900 text-white' },
        { view: 'draft', label: 'Draft', count: stats.draft, icon: HiOutlineClock, color: 'text-blue-500', activeBg: 'bg-blue-600 text-white' },
        { view: 'published', label: 'Sent', count: stats.published, icon: HiOutlineCheckCircle, color: 'text-emerald-500', activeBg: 'bg-emerald-600 text-white' }
      ].map((item) => (
        <button
          key={item.view}
          onClick={() => setActiveView(item.view)}
          className={`
            group flex items-center gap-2.5 
            px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold 
            whitespace-nowrap transition-all duration-300
            ${activeView === item.view 
              ? `${item.activeBg} shadow-lg shadow-blue-500/20` 
              : 'text-gray-500 hover:bg-gray-100'
            }
          `}
        >
          <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${activeView === item.view ? 'text-white' : item.color}`} />
          <span className="tracking-tight">{item.label}</span>
          <span className={`
            ml-1 px-2 py-0.5 rounded-lg text-[10px] font-black transition-colors
            ${activeView === item.view ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}
          `}>
            {item.count}
          </span>
        </button>
      ))}
    </div>
  </div>

  {/* 2. Modern Stats Grid - Zoom Responsive */}
  <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
    {[
      { label: 'Campaigns', value: stats.total, icon: <FcAdvertising />, bg: 'hover:border-blue-200' },
      { label: 'Draft', value: stats.draft, icon: <FcClock />, bg: 'hover:border-amber-200' },
      { label: 'Sent', value: stats.published, icon: <FcOk />, bg: 'hover:border-emerald-200' },
      { label: 'Recipients', value: stats.totalRecipients, icon: <FcConferenceCall />, bg: 'hover:border-purple-200' },
      { label: 'Success', value: `${stats.successRate}%`, icon: <FcLineChart />, bg: 'hover:border-cyan-200' }
    ].map((stat) => (
      <div
        key={stat.label}
        className={`
          group relative bg-white rounded-[2rem] border border-gray-100 
          p-6 transition-all duration-500 
          hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]
          ${stat.bg}
        `}
      >
        <div className="flex flex-col items-start gap-4">
          {/* Icon with Soft Glow */}
          <div className="relative">
            <div className="absolute inset-0 bg-current opacity-10 blur-xl rounded-full group-hover:opacity-20 transition-opacity" />
            <div className="relative text-3xl sm:text-4xl transition-transform duration-500 group-hover:scale-100 group-hover:rotate-3">
              {stat.icon}
            </div>
          </div>

          <div className="space-y-1 w-full">
            <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">
              {stat.label}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tighter">
                {stat.value}
              </p>
              {/* Subtle Arrow or indicator could go here */}
            </div>
          </div>
        </div>

        {/* Glossy Overlay effect */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-[2rem] pointer-events-none" />
      </div>
    ))}
  </div>

</div>


      {/* Selection Actions Bar */}
      {selectedCampaigns.size > 0 && (
        <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border border-blue-200/50 rounded-xl p-4 mb-6 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100/80 backdrop-blur-sm text-blue-700 px-3 py-1.5 rounded-lg font-medium flex items-center gap-2 shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
                {selectedCampaigns.size} selected
              </div>
              <div className="flex gap-2">
                <button
                  onClick={openBulkDeleteModal}
                  className="
                    inline-flex items-center gap-2
                    bg-gradient-to-r from-red-500 to-pink-500
                    text-white px-3 py-1.5 rounded-lg
                    transition-all duration-300
                    text-sm font-medium shadow-sm
                    hover:shadow-md hover:scale-101
                    hover:from-red-600 hover:to-pink-600
                    hover:shadow-red-500/25
                  "
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Selected
                </button>
              </div>
            </div>
            <button
              onClick={() => setSelectedCampaigns(new Set())}
              className="text-gray-500 p-1 rounded-lg hover:bg-gray-100/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}


{/* Filters Section */}
<div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-gray-200/50 p-5 mb-8 shadow-xl shadow-gray-200/20">
  <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-4">
    
    {/* 1. Search Bar - Enhanced with inner depth */}
    <div className="flex-1 relative group">
      <HiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
      <input
        type="text"
        placeholder="Search campaigns..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="
          w-full pl-12 pr-4 py-3
          bg-gray-100/50 border border-transparent
          rounded-2xl focus:outline-none
          focus:bg-white focus:ring-4 focus:ring-blue-500/10
          focus:border-blue-500/50
          transition-all duration-300
          text-sm font-medium placeholder:text-gray-400
        "
      />
    </div>

    {/* 2. Filter Controls Group */}
    <div className="flex flex-wrap items-center gap-3">
      
      {/* Status Filter */}
      <div className="relative flex-1 min-w-[140px] sm:flex-none">
        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full pl-9 pr-8 py-3 bg-gray-100/50 border-none rounded-2xl text-xs font-bold text-gray-600 appearance-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer hover:bg-gray-200/50 transition-colors"
        >
          {statusOptions.map(status => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
      </div>

      {/* Recipient Group Filter */}
      <div className="relative flex-1 min-w-[140px] sm:flex-none">
        <select 
          value={filterRecipientType}
          onChange={(e) => setFilterRecipientType(e.target.value)}
          className="w-full px-4 py-3 bg-gray-100/50 border-none rounded-2xl text-xs font-bold text-gray-600 appearance-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer hover:bg-gray-200/50 transition-colors"
        >
          <option value="all">All Groups</option>
          {recipientGroups.map(group => (
            <option key={group.value} value={group.value}>{group.label}</option>
          ))}
        </select>
      </div>

      {/* Date Range Group */}
      <div className="flex items-center gap-2 bg-gray-100/50 p-1 rounded-2xl border border-gray-200/20">
        <div className="relative">
          <HiOutlineCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="pl-9 pr-2 py-2 bg-transparent border-none text-xs font-bold text-gray-600 focus:ring-0 cursor-pointer"
          />
        </div>
        <span className="text-gray-300 font-bold text-xs">to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-2 py-2 bg-transparent border-none text-xs font-bold text-gray-600 focus:ring-0 cursor-pointer"
        />
      </div>

      {/* Sort Dropdown */}
      <div className="relative flex-1 min-w-[150px] sm:flex-none">
        <HiOutlineSortAscending className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full pl-9 pr-8 py-3 bg-gray-900 text-white border-none rounded-2xl text-xs font-bold appearance-none focus:ring-4 focus:ring-blue-500/20 cursor-pointer hover:bg-black transition-colors"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title-asc">Title A-Z</option>
          <option value="recipients-high">Most Recipients</option>
        </select>
      </div>

      {/* Reset Button - Circular and Clean */}
      <button
        onClick={resetFilters}
        title="Reset Filters"
        className="
          flex items-center justify-center
          w-11 h-11
          bg-white border border-gray-200
          rounded-2xl text-gray-500
          transition-all duration-300
          hover:bg-red-50 hover:text-red-500 hover:border-red-100
          active:scale-90
        "
      >
        <HiOutlineRefresh className="w-5 h-5" />
      </button>

    </div>
  </div>
</div>

      {/* Campaigns List */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 overflow-hidden">
        {loading ? (
          <ModernEmailSkeleton />
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-16">
            <Mail className="text-gray-400 w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Campaigns Found</h3>
            <p className="text-gray-600 mb-6">
              {activeView === 'draft' 
                ? 'No draft campaigns found'
                : activeView === 'published'
                ? 'No sent campaigns found'
                : 'No campaigns match your filters'
              }
            </p>
            <button
              onClick={openCreateModal}
              className="
                inline-flex items-center gap-2
                bg-gradient-to-r from-blue-500 to-cyan-500
                text-white px-4 py-2.5 rounded-xl
                transition-all duration-300 font-medium
                hover:scale-101
                hover:from-blue-600 hover:to-cyan-600
                hover:shadow-blue-500/25
              "
            >
              <Plus className="w-4 h-4" />
              Create Your First Campaign
            </button>
          </div>
        ) : (
          <>
            {/* List Header */}
            <div className="p-4 border-b border-gray-100/50 bg-gradient-to-r from-gray-50/80 to-gray-100/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleSelectAll}
                    className="p-1.5 rounded hover:bg-gray-100/50"
                  >
                    {selectedCampaigns.size === filteredCampaigns.length && filteredCampaigns.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                  <span className="text-sm font-medium text-gray-600">
                    Select All ({filteredCampaigns.length})
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Showing {filteredCampaigns.length} of {campaigns.length} campaigns
                </div>
              </div>
            </div>

            {/* Campaign Cards */}
            <div className="p-4 space-y-4 modern-scrollbar max-h-[600px] overflow-y-auto">
              {filteredCampaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  isSelected={selectedCampaigns.has(campaign.id)}
                  onSelect={toggleSelectCampaign}
                  onView={openDetailModal}
                  onEdit={openEditModal}
                  onSend={openSendConfirmationModal}
                  onDelete={openDeleteModal}
                  loadingStates={loadingStates}
                />
              ))}
            </div>
            
            {/* List Footer */}
            <div className="px-6 py-4 border-t border-gray-100/50 bg-gradient-to-r from-gray-50/80 to-gray-100/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{filteredCampaigns.length}</span> of{' '}
                  <span className="font-semibold">{campaigns.length}</span> campaigns
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={openBulkDeleteModal}
                    disabled={selectedCampaigns.size === 0}
                    className="
                      inline-flex items-center gap-2
                      bg-white/40 backdrop-blur-md
                      border border-gray-200/50
                      rounded-lg transition-all duration-300
                      text-sm font-medium text-gray-700
                      disabled:opacity-50
                      hover:bg-red-50/60
                      hover:text-red-600
                      hover:border-red-200/60
                      hover:shadow-sm
                    "
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Selected ({selectedCampaigns.size})
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Single Delete Confirmation Modal */}
      <ConfirmationModal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setCampaignToDelete(null);
        }}
        title="Delete Campaign"
        message={`Are you sure you want to delete "${campaignToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete Campaign"
        onConfirm={handleDeleteCampaign}
        loading={loadingStates.delete}
      />

      {/* Send Campaign Confirmation Modal */}
      <ConfirmationModal
        open={showSendConfirmationModal}
        onClose={() => {
          setShowSendConfirmationModal(false);
          setCampaignToSend(null);
        }}
        title="Send Campaign"
        message={`Send "${campaignToSend?.title}" to ${getRecipientCount(campaignToSend)} recipients? This will mark it as published and send emails immediately.`}
        confirmText="Send Campaign"
        cancelText="Cancel"
        onConfirm={handleSendCampaign}
        isDanger={false}
        loading={loadingStates.send}
      />

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmationModal
        open={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        title="Delete Multiple Campaigns"
        message={`Are you sure you want to delete ${selectedCampaigns.size} selected campaign(s)? This action cannot be undone.`}
        confirmText={`Delete ${selectedCampaigns.size} Campaigns`}
        onConfirm={handleBulkDelete}
        loading={loadingStates.bulk}
      />

      {/* Campaign Detail Modal */}
      <ModernModal open={showDetailModal} onClose={() => setShowDetailModal(false)} maxWidth="800px">
        {selectedCampaign && (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Campaign Details</h2>
                    <p className="text-blue-100 opacity-90 text-sm">
                      {selectedCampaign.title}
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="p-1 rounded-lg cursor-pointer hover:bg-white/10">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[calc(85vh-150px)] overflow-y-auto p-6 modern-scrollbar">
              <div className="space-y-6">
                {/* Campaign Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200/50">
                    <h3 className="font-bold text-gray-900 mb-2">Campaign Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          selectedCampaign.status === 'published' 
                            ? 'bg-emerald-100/80 backdrop-blur-sm text-emerald-800 border-emerald-200/50'
                            : 'bg-yellow-100/80 backdrop-blur-sm text-yellow-800 border-yellow-200/50'
                        }`}>
                          {selectedCampaign.status === 'published' ? 'Sent' : 'Draft'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Recipient Group:</span>
                        <span className="font-bold bg-gradient-to-r from-blue-700 to-blue-800 bg-clip-text text-transparent">
                          {selectedCampaign.recipientType || 'All'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Recipients:</span>
                        <span className="font-bold bg-gradient-to-r from-emerald-700 to-emerald-800 bg-clip-text text-transparent">
                          {getRecipientCount(selectedCampaign)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-bold bg-gradient-to-r from-purple-700 to-purple-800 bg-clip-text text-transparent">
                          {new Date(selectedCampaign.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      {selectedCampaign.sentAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sent:</span>
                          <span className="font-bold bg-gradient-to-r from-violet-700 to-violet-800 bg-clip-text text-transparent">
                            {new Date(selectedCampaign.sentAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200/50">
                    <h3 className="font-bold text-gray-900 mb-2">Performance</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Success Rate:</span>
                        <span className={`font-bold ${
                          (selectedCampaign.successRate || 0) >= 80 
                            ? 'bg-gradient-to-r from-emerald-700 to-emerald-800 bg-clip-text text-transparent'
                            : (selectedCampaign.successRate || 0) >= 50 
                            ? 'bg-gradient-to-r from-blue-700 to-blue-800 bg-clip-text text-transparent'
                            : 'bg-gradient-to-r from-amber-700 to-amber-800 bg-clip-text text-transparent'
                        }`}>
                          {selectedCampaign.successRate || 0}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Emails Sent:</span>
                        <span className="font-bold bg-gradient-to-r from-cyan-700 to-cyan-800 bg-clip-text text-transparent">
                          {selectedCampaign.sentCount || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Failed:</span>
                        <span className="font-bold bg-gradient-to-r from-rose-700 to-rose-800 bg-clip-text text-transparent">
                          {selectedCampaign.failedCount || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Subject */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Subject</h3>
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200/60">
                    <p className="text-gray-700 bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
                      {selectedCampaign.subject}
                    </p>
                  </div>
                </div>
                
                {selectedCampaign && parseCampaignAttachments(selectedCampaign.attachments).length > 0 && (
                  <CampaignAttachmentsDisplay campaign={selectedCampaign} />
                )}
                
                {/* Content */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Content</h3>
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200/60 max-h-64 overflow-y-auto modern-scrollbar">
                    <pre className="text-gray-700 whitespace-pre-wrap font-sans text-sm">
                      {selectedCampaign.content}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100/50">
              <div className="flex gap-2">
                {selectedCampaign?.status === 'draft' && (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      openEditModal(selectedCampaign);
                    }}
                    className="
                      flex-1
                      bg-gradient-to-r from-blue-500 to-cyan-500
                      text-white py-2.5 rounded-lg
                      transition-all duration-300
                      font-medium shadow-lg
                      hover:shadow-xl hover:scale-101
                      hover:from-blue-600 hover:to-cyan-600
                      hover:shadow-blue-500/25
                    "
                  >
                    Edit Campaign
                  </button>
                )}
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="
                    flex-1
                    border border-gray-300/60
                    text-gray-700 py-2.5 rounded-lg
                    transition-all duration-300
                    font-medium
                    hover:bg-gray-50/80
                    hover:border-gray-400/60
                    hover:shadow-sm
                  "
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}
      </ModernModal>


<ModernModal open={showCreateModal} onClose={() => setShowCreateModal(false)} maxWidth="550px">
  {/* Modern Header with enhanced gradient */}
  <div className="relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600"></div>
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10"></div>
    <div className="relative p-5 text-white">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 shadow-lg">
            {selectedCampaign ? 
              <Edit className="w-5 h-5 text-white" /> : 
              <Plus className="w-5 h-5 text-white" />
            }
          </div>
          <div>
            <h2 className="text-xl font-bold">
              {selectedCampaign ? 'Edit Campaign' : 'Create New Campaign'}
            </h2>
            <p className="text-white/90 text-sm mt-1">
              {selectedCampaign ? 'Update your campaign details' : 'Create a new email campaign'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowCreateModal(false)} 
          className="p-2.5 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-all hover:scale-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>

  {/* Content - modernized for 550px width */}
<div
  className="
    max-h-[calc(80vh-120px)]
    sm:max-h-[calc(85vh-120px)]
    lg:max-h-[calc(90vh-120px)]
    overflow-y-auto
    p-4 sm:p-5 lg:p-6
    modern-scrollbar
  "
>
    <div className="space-y-5">
      {/* Title Field - Enhanced */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
        <label className=" text-md font-bold text-gray-800 mb-2 flex items-center gap-2">
          <span className="text-red-500">*</span> Campaign Title
        </label>
        <input
          type="text"
          value={campaignForm.title}
          onChange={(e) => setCampaignForm({...campaignForm, title: e.target.value})}
          placeholder="Enter campaign title"
          className="
            w-full px-4 py-3
            bg-white
            border-2 border-emerald-200
            rounded-xl focus:outline-none
            focus:ring-2 focus:ring-emerald-500/40
            focus:border-emerald-400 text-md
            font-semibold
            shadow-sm
            transition-all duration-200
            placeholder:text-gray-400
          "
        />
      </div>
      
      {/* Subject Field - Enhanced */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
        <label className=" text-md font-bold text-gray-800 mb-2 flex items-center gap-2">
          <span className="text-red-500">*</span> Email Subject
        </label>
        <input
          type="text"
          value={campaignForm.subject}
          onChange={(e) => setCampaignForm({...campaignForm, subject: e.target.value})}
          placeholder="Enter email subject"
          className="
            w-full px-4 py-3
            bg-white
            border-2 border-blue-200
            rounded-xl focus:outline-none
            focus:ring-2 focus:ring-blue-500/40
            focus:border-blue-400 text-md
            font-semibold
            shadow-sm
            transition-all duration-200
            placeholder:text-gray-400
          "
        />
      </div>
      
      {/* Recipient Group - Enhanced */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
        <label className=" text-md font-bold text-gray-800 mb-2 flex items-center gap-2">
          <span className="text-red-500">*</span> Recipient Group
        </label>
        <div className="relative">
          <select 
            value={campaignForm.recipientType}
            onChange={(e) => setCampaignForm({...campaignForm, recipientType: e.target.value})}
            className="
              w-full px-4 py-3 pl-12
              bg-white
              border-2 border-purple-200
              rounded-xl focus:outline-none
              focus:ring-2 focus:ring-purple-500/40
              focus:border-purple-400 text-md
              font-semibold
              shadow-sm
              appearance-none
              cursor-pointer
              transition-all duration-200
            "
          >
            {recipientGroups.map(group => (
              <option key={group.value} value={group.value}>
                {group.label} ({group.count} recipients)
              </option>
            ))}
          </select>
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Content Textarea - Enhanced */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
        <div className="flex items-center justify-between mb-2">
          <label className=" text-md font-bold text-gray-800 flex items-center gap-2">
            <span className="text-red-500">*</span> Email Content
          </label>
          <div className="text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700">
            Rich Text
          </div>
        </div>
        <textarea
          value={campaignForm.content}
          onChange={(e) => setCampaignForm({...campaignForm, content: e.target.value})}
          placeholder="Write your email content here..."
          className="
            w-full px-4 py-3
            bg-white

            border-2 border-amber-200
            rounded-xl focus:outline-none
            focus:ring-2 focus:ring-amber-500/40
            focus:border-amber-400 text-md
            font-semibold
            shadow-sm
            resize-y
            rows-24
            transition-all duration-200
            placeholder:text-gray-400
            min-h-[140px]
            max-h-[200px]
          "
        />
        <div className="flex justify-between items-center text-xs text-gray-500 mt-2 px-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
            <span className="font-medium">{campaignForm.content.length}/2000 characters</span>
          </div>
          <div className="flex items-center gap-2 text-amber-600">
            <Image className="w-3.5 h-3.5" />
            <Link className="w-3.5 h-3.5" />
            <Bold className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
      
      {/* Attachments Section - Enhanced */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <label className="block text-md font-bold text-gray-800 mb-1">Attachments</label>
            <p className="text-xs text-gray-600">
              Add files (max 10MB each)
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAttachmentModal(true)}
            className="
              inline-flex items-center gap-2 
              px-4 py-2.5
              text-sm font-bold
              text-white 
              bg-gradient-to-r from-emerald-500 to-emerald-600
              border border-emerald-500
              rounded-xl 
              hover:shadow-lg 
              hover:from-emerald-600 hover:to-emerald-700
              transition-all duration-200
              shadow-sm
            "
          >
            <FileUp className="w-4 h-4" />
            {campaignAttachments.length > 0 || newAttachmentFiles.length > 0 ? (
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {campaignAttachments.length + newAttachmentFiles.length}
              </span>
            ) : (
              <span>Add Files</span>
            )}
          </button>
        </div>
        
        {/* File summary */}
        {(campaignAttachments.length > 0 || newAttachmentFiles.length > 0) && (
          <div className="mt-3 p-3 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg">
                <FileText className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <span className="text-sm font-bold text-gray-800">
                  {campaignAttachments.length + newAttachmentFiles.length} files attached
                </span>
                <p className="text-xs text-gray-500 mt-0.5">
                  {campaignAttachments.length} existing, {newAttachmentFiles.length} new
                </p>
              </div>
              <div className="ml-auto text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700">
                Ready
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Status Toggle - Enhanced */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="checkbox"
                checked={campaignForm.status === 'draft'}
                onChange={(e) => setCampaignForm({...campaignForm, status: e.target.checked ? 'draft' : 'published'})}
                className="sr-only peer"
                id="status-toggle"
              />
              <label 
                htmlFor="status-toggle"
                className="
                  w-12 h-6
                  bg-gradient-to-r from-gray-300 to-gray-400
                  peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-green-600
                  rounded-full
                  transition-all
                  duration-300
                  cursor-pointer
                  shadow-inner
                  relative
                  block
                  after:absolute
                  after:top-0.5
                  after:left-0.5
                  after:w-5
                  after:h-5
                  after:bg-white
                  after:rounded-full
                  after:transition-all
                  after:duration-300
                  after:shadow-md
                  peer-checked:after:translate-x-6
                "
              ></label>
            </div>
            <div>
              <span className="text-sm font-bold text-gray-800">
                Save as Draft
              </span>
              <p className="text-xs text-gray-600 mt-0.5">
                {campaignForm.status === 'draft' ? 'Save for later editing' : 'Publish immediately'}
              </p>
            </div>
          </div>
          <div className={`text-xs font-bold px-3 py-1.5 rounded-full ${
            campaignForm.status === 'draft' 
              ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700' 
              : 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700'
          }`}>
            {campaignForm.status === 'draft' ? 'DRAFT MODE' : 'PUBLISH MODE'}
          </div>
          
        </div>
          {/* Footer - Enhanced */}
  <div className="p-5 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-100 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full"></div>
          <span className="font-bold">Required fields marked with *</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowCreateModal(false)}
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
          Cancel
        </button>

        <button
          onClick={handleCreateOrUpdateCampaign}
          disabled={loadingStates.create}
          className="
            px-8
            py-2.5
            rounded-xl
            font-bold
            text-sm
            text-white
            bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600
            hover:from-emerald-600 hover:via-green-600 hover:to-teal-700
            disabled:opacity-60
            disabled:cursor-not-allowed
            shadow-lg
            hover:shadow-xl
            transition-all duration-200
            min-w-[120px]
            hover:scale-100
          "
        >
          {loadingStates.create ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              {selectedCampaign ? (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Campaign</span>
                </>
              ) : campaignForm.status === "draft" ? (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Draft</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Campaign</span>
                </>
              )}
            </span>
          )}
        </button>
      </div>
    </div>
  </div>
      </div>
    </div>
  </div>


</ModernModal>
<ModernModal open={showDetailModal} onClose={() => setShowDetailModal(false)} maxWidth="700px">
  {selectedCampaign && (
    <>
      {/* Enhanced Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
        <div className="relative p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 shadow-lg">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Campaign Details</h2>
                <p className="text-blue-100 opacity-90 text-sm mt-1">
                  {selectedCampaign.title}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowDetailModal(false)} 
              className="p-2.5 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-all hover:scale-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Content */}
      <div className="max-h-[calc(85vh-130px)] overflow-y-auto p-5 modern-scrollbar">
        <div className="space-y-5">
          {/* Campaign Info Card - Enhanced */}
          <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 rounded-xl p-5 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <Info className="w-4 h-4 text-white" />
                </div>
                Campaign Information
              </h3>
              <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                selectedCampaign.status === 'published' 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md'
                  : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
              }`}>
                {selectedCampaign.status === 'published' ? 'SENT' : 'DRAFT'}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="p-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Recipient Group</p>
                    <p className="text-sm font-bold text-blue-700">
                      {selectedCampaign.recipientType || 'All'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="p-2 bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Recipients</p>
                    <p className="text-sm font-bold text-emerald-700">
                      {getRecipientCount(selectedCampaign)} people
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Created</p>
                    <p className="text-sm font-bold text-purple-700">
                      {new Date(selectedCampaign.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                {selectedCampaign.sentAt && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="p-2 bg-gradient-to-r from-violet-100 to-indigo-100 rounded-lg">
                      <Send className="w-4 h-4 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Sent</p>
                      <p className="text-sm font-bold text-violet-700">
                        {new Date(selectedCampaign.sentAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Subject Card - Enhanced */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200">
            <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg">
                <Mail className="w-4 h-4 text-white" />
              </div>
              Subject Line
            </h3>
            <div className="bg-white rounded-lg p-4 border-2 border-gray-200 shadow-sm">
              <p className="text-gray-800 font-medium">
                {selectedCampaign.subject}
              </p>
            </div>
          </div>
          
          {/* Content Card - Enhanced */}
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-slate-500 to-slate-600 rounded-lg">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                Email Content
              </h3>
              <div className="text-xs font-medium px-3 py-1.5 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700">
                {selectedCampaign.content.length} characters
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border-2 border-slate-200 shadow-sm max-h-60 overflow-y-auto modern-scrollbar">
              <div className="text-gray-700 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {selectedCampaign.content}
              </div>
            </div>
            {selectedCampaign.attachments && selectedCampaign.attachments.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Paperclip className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-bold text-gray-700">Attachments</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCampaign.attachments.slice(0, 3).map((attachment, index) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                      <FileText className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-xs font-medium text-blue-700">
                        {attachment.name}
                      </span>
                    </div>
                  ))}
                  {selectedCampaign.attachments.length > 3 && (
                    <div className="px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg border border-gray-300">
                      <span className="text-xs font-bold text-gray-600">
                        +{selectedCampaign.attachments.length - 3} more
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Performance Stats (if published) */}
          {selectedCampaign.status === 'published' && selectedCampaign.stats && (
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-200">
              <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                Campaign Performance
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 border border-emerald-200 text-center">
                  <p className="text-xs text-gray-500 mb-1">Open Rate</p>
                  <p className="text-lg font-bold text-emerald-700">
                    {selectedCampaign.stats.openRate || 'N/A'}%
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-emerald-200 text-center">
                  <p className="text-xs text-gray-500 mb-1">Click Rate</p>
                  <p className="text-lg font-bold text-emerald-700">
                    {selectedCampaign.stats.clickRate || 'N/A'}%
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-emerald-200 text-center">
                  <p className="text-xs text-gray-500 mb-1">Delivered</p>
                  <p className="text-lg font-bold text-emerald-700">
                    {selectedCampaign.stats.delivered || getRecipientCount(selectedCampaign)}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-emerald-200 text-center">
                  <p className="text-xs text-gray-500 mb-1">Bounces</p>
                  <p className="text-lg font-bold text-emerald-700">
                    {selectedCampaign.stats.bounces || '0'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Footer */}
      <div className="p-5 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-100 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full"></div>
              <span className="font-bold">Campaign ID: #{selectedCampaign.id?.slice(0, 8) || 'N/A'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {selectedCampaign?.status === 'draft' && (
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setTimeout(() => openEditModal(selectedCampaign), 100);
                }}
                className="
                  px-6
                  py-2.5
                  rounded-xl
                  text-sm
                  font-bold
                  text-white
                  bg-gradient-to-r from-blue-500 to-cyan-500
                  hover:from-blue-600 hover:to-cyan-600
                  transition-all duration-200
                  shadow-lg
                  hover:shadow-xl
                  flex items-center gap-2
                "
              >
                <Edit className="w-4 h-4" />
                Edit Campaign
              </button>
            )}
            <button
              onClick={() => setShowDetailModal(false)}
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
                shadow-sm
                hover:shadow-md
              "
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  )}
</ModernModal>
      {/* Attachment Upload Modal - REFINED */}
      <UploadAttachments
        open={showAttachmentModal}
        onClose={() => setShowAttachmentModal(false)}
        onFilesSelected={handleFilesSelected}
        existingAttachments={campaignAttachments}
      />
    </div>
  );
}


