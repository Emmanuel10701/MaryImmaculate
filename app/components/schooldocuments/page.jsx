"use client";
import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Toaster, toast } from 'sonner';
import { 
  FaFilePdf, FaUpload, FaTimes, FaTrash, FaEye,
  FaDownload, FaPlus, FaChartBar, FaSync,
  FaBook, FaMoneyBillWave, FaUniversity, FaAward,
  FaGraduationCap, FaFileAlt, FaFileVideo, FaFile,
  FaExternalLinkAlt, FaCheck, FaTimesCircle, 
  FaExclamationTriangle, FaCheckCircle, FaSave,
  FaArrowRight, FaArrowDown, FaCog, FaBuilding,
  FaShieldAlt, FaInfoCircle, FaCalendar, 
  FaUsers, FaChalkboardTeacher, FaDollarSign,
  FaUserCheck, FaClock, FaMapMarkerAlt, FaPhone,
  FaEnvelope, FaGlobe, FaChevronRight, FaChevronLeft,
  FaPercentage, FaTasks, FaClipboardList, FaUser,
  FaTag, FaCogs, FaBlackTie, FaPlay, FaPlayCircle,
  FaCamera, FaImage, FaHourglassHalf, FaBookOpen,
  FaUsersCog, FaRocket, FaArrowLeft, FaEyeDropper,
  FaEdit, FaList, FaCaretDown, FaCaretUp,
  FaSort, FaSortUp, FaSortDown, FaCalculator,
  FaInfo, FaQuestionCircle, FaDatabase,
  FaPencilAlt, FaEllipsisV, FaExclamationCircle, FaAlignLeft 
} from 'react-icons/fa';

import { 
  CircularProgress, Modal, Box, TextField,
  IconButton, Button, Chip, Stack, FormControl,
  InputLabel, Select, MenuItem, Divider,
  Paper, Typography, Card, CardContent,
  Grid, Tooltip, Alert, Collapse,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// File Size Manager Context
const FileSizeContext = createContext();

function FileSizeProvider({ children }) {
  const [totalSize, setTotalSize] = useState(0);
  const [maxTotalSize] = useState(50 * 1024 * 1024); // 50MB total limit
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileCount, setFileCount] = useState(0);

  const addFile = (file, fileId = null) => {
    if (!file || !file.size) {
      toast.error('Invalid file');
      return false;
    }
    
    const newTotal = totalSize + file.size;
    if (newTotal > maxTotalSize) {
      toast.error(`Total file size would exceed ${(maxTotalSize / (1024 * 1024)).toFixed(0)}MB limit`);
      return false;
    }
    
    const fileWithId = {
      file,
      id: fileId || `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      size: file.size,
      name: file.name
    };
    
    setUploadedFiles(prev => [...prev, fileWithId]);
    setTotalSize(newTotal);
    setFileCount(prev => prev + 1);
    return true;
  };

  const removeFile = (fileId) => {
    const fileToRemove = uploadedFiles.find(f => f.id === fileId);
    if (!fileToRemove) return;
    
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    setTotalSize(prev => prev - (fileToRemove.size || 0));
    setFileCount(prev => prev - 1);
  };

  const replaceFile = (oldFileId, newFile) => {
    const oldFile = uploadedFiles.find(f => f.id === oldFileId);
    if (!oldFile || !newFile) return false;
    
    const newTotal = totalSize - (oldFile.size || 0) + (newFile.size || 0);
    if (newTotal > maxTotalSize) {
      toast.error(`Total file size would exceed ${(maxTotalSize / (1024 * 1024)).toFixed(0)}MB limit`);
      return false;
    }
    
    setUploadedFiles(prev => 
      prev.map(f => f.id === oldFileId ? { ...f, file: newFile, size: newFile.size, name: newFile.name } : f)
    );
    setTotalSize(newTotal);
    return true;
  };

  const getTotalSizeMB = () => (totalSize / (1024 * 1024)).toFixed(2);
  const getMaxSizeMB = () => (maxTotalSize / (1024 * 1024)).toFixed(0);
  const getRemainingMB = () => Math.max(0, ((maxTotalSize - totalSize) / (1024 * 1024)).toFixed(2));
  const getPercentage = () => Math.min(100, (totalSize / maxTotalSize) * 100);

  return (
    <FileSizeContext.Provider value={{
      totalSize,
      maxTotalSize,
      uploadedFiles,
      fileCount,
      addFile,
      removeFile,
      replaceFile,
      getTotalSizeMB,
      getMaxSizeMB,
      getRemainingMB,
      getPercentage,
      reset: () => {
        setTotalSize(0);
        setUploadedFiles([]);
        setFileCount(0);
      }
    }}>
      {children}
    </FileSizeContext.Provider>
  );
}

function useFileSize() {
  const context = useContext(FileSizeContext);
  if (!context) {
    throw new Error('useFileSize must be used within FileSizeProvider');
  }
  return context;
}

// Modern Loading Spinner Component
function ModernLoadingSpinner({ message = "Loading school documents...", size = "medium" }) {
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
            Please wait while we fetch school documents
          </p>
        </div>
      </div>
    </div>
  );
}

// Dynamic Fee Category Component
function DynamicFeeCategory({ category, index, onChange, onRemove, type = 'day' }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-gradient-to-br ${type === 'boarding' ? 'from-blue-50 to-blue-100 border-blue-200' : 'from-green-50 to-green-100 border-green-200'} rounded-2xl p-4 border-2 mb-3`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            {isExpanded ? <FaCaretUp /> : <FaCaretDown />}
          </button>
          <div className="flex items-center gap-2">
            <div className={`p-2 ${type === 'boarding' ? 'bg-blue-500' : 'bg-green-500'} text-white rounded-xl`}>
              <FaMoneyBillWave className="text-sm" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">
                {category.name || `Fee Category ${index + 1}`}
              </h4>
              <p className="text-xs text-gray-600 font-bold">
                Amount: KES {category.amount?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1.5 text-xs font-bold bg-white/80 text-gray-700 rounded-lg hover:bg-white transition-colors border border-gray-200"
          >
            {isExpanded ? 'Collapse' : 'Edit'}
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            title="Remove category"
          >
            <FaTrash className="text-sm" />
          </button>
        </div>
      </div>
      
      <Collapse in={isExpanded}>
        <div className="mt-4 space-y-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                value={category.name || ''}
                onChange={(e) => onChange(index, 'name', e.target.value)}
                placeholder="e.g., Tuition, Uniform, Books, etc."
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-bold transition-all"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Amount (KES) *
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={category.amount || ''}
                onChange={(e) => onChange(index, 'amount', parseFloat(e.target.value) || 0)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-bold transition-all"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={category.description || ''}
              onChange={(e) => onChange(index, 'description', e.target.value)}
              placeholder="Brief description of this fee category..."
              rows="2"
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-bold transition-all resize-none"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={category.optional || false}
                  onChange={(e) => onChange(index, 'optional', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                Optional Fee
              </label>
            </div>
            
            {type === 'boarding' && (
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={category.boardingOnly || false}
                    onChange={(e) => onChange(index, 'boardingOnly', e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  Boarding Specific
                </label>
              </div>
            )}
          </div>
        </div>
      </Collapse>
    </div>
  );
}

function FeeBreakdownModal({ 
  open, 
  onClose, 
  onSave, 
  title = "Fee Structure Breakdown",
  existingBreakdown = [],
  type = 'day'
}) {
  // FIXED: Initialize with existing data or empty array, never with placeholders in edit mode
  const [categories, setCategories] = useState(() => {
    console.log('FeeBreakdownModal initializing with existingBreakdown:', existingBreakdown);
    
    // Only use existingBreakdown if it's a valid array with data
    if (Array.isArray(existingBreakdown) && existingBreakdown.length > 0) {
      console.log('Edit Mode: Loading existing fee breakdown data', existingBreakdown);
      return existingBreakdown.map((cat, index) => ({
        ...cat,
        id: cat.id || `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: parseFloat(cat.amount) || 0,
        order: cat.order || index,
        // Ensure proper boolean values
        optional: Boolean(cat.optional),
        boardingOnly: Boolean(cat.boardingOnly && type === 'boarding')
      }));
    }
    console.log('Add Mode: Starting with empty categories');
    return []; // Start with empty array for new entries
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [errors, setErrors] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const total = Array.isArray(categories) 
      ? categories.reduce((sum, cat) => sum + (parseFloat(cat.amount) || 0), 0) 
      : 0;
    setTotalAmount(total);
  }, [categories]);

  // FIXED: Detect edit mode and prevent preset loading
  useEffect(() => {
    if (open && existingBreakdown && existingBreakdown.length > 0) {
      setIsEditMode(true);
      console.log('Edit Mode detected with', existingBreakdown.length, 'existing categories');
    } else {
      setIsEditMode(false);
    }
  }, [open, existingBreakdown]);

  const handleAddCategory = () => {
    const newCategory = {
      id: `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      amount: 0,
      description: '',
      optional: false,
      boardingOnly: type === 'boarding',
      order: categories.length
    };
    setCategories([...categories, newCategory]);
  };

  const handleCategoryChange = (index, field, value) => {
    const updated = [...categories];
    updated[index] = { ...updated[index], [field]: value };
    setCategories(updated);
  };

  const handleRemoveCategory = (index) => {
    if (categories.length <= 1) {
      toast.warning('At least one fee category is required');
      return;
    }
    const updated = categories.filter((_, i) => i !== index);
    setCategories(updated);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    const orderedItems = items.map((item, index) => ({ ...item, order: index }));
    setCategories(orderedItems);
  };

  const handleSave = () => {
    const validationErrors = [];
    categories.forEach((cat, index) => {
      if (!cat.name?.trim()) {
        validationErrors.push(`Category ${index + 1} requires a name`);
      }
      if (!cat.amount || cat.amount <= 0) {
        validationErrors.push(`Category "${cat.name || index + 1}" requires a valid amount`);
      }
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix all validation errors');
      return;
    }

    setErrors([]);
    onSave(categories);
    onClose();
  };

  const presetCategories = type === 'day' ? [
    { name: 'Tuition', amount: 0, description: 'Academic tuition fees' },
    { name: 'Uniform', amount: 0, description: 'School uniform costs' },
    { name: 'Books', amount: 0, description: 'Textbooks and stationery' },
    { name: 'Activity Fee', amount: 0, description: 'Extra-curricular activities' },
    { name: 'Development Levy', amount: 0, description: 'School development fund' },
  ] : [
    { name: 'Tuition', amount: 0, description: 'Academic tuition fees' },
    { name: 'Boarding Fee', amount: 0, description: 'Accommodation and meals', boardingOnly: true },
    { name: 'Uniform', amount: 0, description: 'School uniform costs' },
    { name: 'Books', amount: 0, description: 'Textbooks and stationery' },
    { name: 'Medical Fee', amount: 0, description: 'Medical services for boarders', boardingOnly: true },
    { name: 'Activity Fee', amount: 0, description: 'Extra-curricular activities' },
    { name: 'Development Levy', amount: 0, description: 'School development fund' },
  ];

  // FIXED: Preset loading only allowed when no existing data
  const loadPreset = (preset) => {
    // Only allow preset loading if there are NO existing categories
    if (categories.length === 0 && !isEditMode) {
      const loaded = preset.map((cat, index) => ({
        ...cat,
        id: `preset_${Date.now()}_${index}`,
        order: index,
        optional: cat.optional || false,
        boardingOnly: cat.boardingOnly || false
      }));
      setCategories(loaded);
      toast.success('Preset categories loaded. Update amounts as needed.');
    } else {
      toast.info('Cannot load preset when editing existing fee structure. Edit current categories instead.');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '95vw',
        maxWidth: '700px',
        maxHeight: '85vh',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
        <div className={`bg-gradient-to-r ${type === 'boarding' ? 'from-blue-600 via-blue-700 to-indigo-700' : 'from-green-600 via-green-700 to-emerald-700'} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <FaCalculator className="text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="text-white/90 text-sm mt-1 font-bold">
                  {type === 'day' ? 'Day School' : 'Boarding School'} Fee Structure Breakdown
                </p>
                {isEditMode && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-white/30 px-2 py-1 rounded-full font-bold">
                      📝 Edit Mode
                    </span>
                    <span className="text-xs text-white/80">
                      Editing {categories.length} existing categories
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(85vh-180px)] overflow-y-auto p-6">
          {errors.length > 0 && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaExclamationTriangle className="text-red-600" />
                <h4 className="text-sm font-bold text-red-700">Validation Errors</h4>
              </div>
              <ul className="space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-xs text-red-600 font-bold">• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Fee Categories</h3>
              <div className="flex gap-2">
                {/* FIXED: Show Load Preset button only when NOT in edit mode */}
                {!isEditMode && categories.length === 0 && (
                  <button
                    type="button"
                    onClick={() => loadPreset(presetCategories)}
                    className="px-4 py-2 text-sm font-bold bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Load Preset
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-colors flex items-center gap-2"
                >
                  <FaPlus /> Add Category
                </button>
              </div>
            </div>

            {categories.length === 0 ? (
              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                <FaMoneyBillWave className="mx-auto text-4xl text-gray-400 mb-4" />
                <h4 className="text-lg font-bold text-gray-700 mb-2">No Fee Categories</h4>
                <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto font-bold">
                  {isEditMode 
                    ? 'No existing fee categories found. Start by adding new categories.' 
                    : 'Start by adding fee categories or load a preset to get started.'}
                </p>
                <button
                  onClick={handleAddCategory}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-colors font-bold shadow-lg flex items-center gap-2 mx-auto"
                >
                  <FaPlus /> Add First Category
                </button>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="fee-categories">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-3"
                    >
                      {categories.map((category, index) => (
                        <Draggable 
                          key={category.id} 
                          draggableId={category.id} 
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="relative"
                            >
                              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 cursor-move" {...provided.dragHandleProps}>
                                <FaSort className="text-gray-400" />
                              </div>
                              <div className="ml-8">
                                <DynamicFeeCategory
                                  category={category}
                                  index={index}
                                  onChange={handleCategoryChange}
                                  onRemove={() => handleRemoveCategory(index)}
                                  type={type}
                                />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border-2 border-emerald-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500 text-white rounded-xl">
                  <FaCalculator className="text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Fee Summary</h3>
                  <p className="text-sm text-gray-600 font-bold">
                    {categories.length} categories defined
                    {isEditMode && <span className="text-blue-600 ml-2">(Editing existing)</span>}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-emerald-700">
                  KES {totalAmount.toLocaleString()}
                </div>
                <p className="text-xs text-gray-600 font-bold mt-1">
                  Total Amount
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-emerald-200">
                <p className="text-xs text-gray-600 font-bold uppercase tracking-wider mb-1">Required Fees</p>
                <p className="text-lg font-bold text-gray-900">
                  KES {categories.filter(c => !c.optional).reduce((sum, cat) => sum + (cat.amount || 0), 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-600 mt-1 font-bold">
                  {categories.filter(c => !c.optional).length} categories
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-emerald-200">
                <p className="text-xs text-gray-600 font-bold uppercase tracking-wider mb-1">Optional Fees</p>
                <p className="text-lg font-bold text-gray-900">
                  KES {categories.filter(c => c.optional).reduce((sum, cat) => sum + (cat.amount || 0), 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-600 mt-1 font-bold">
                  {categories.filter(c => c.optional).length} categories
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6 bg-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 font-bold">
              <p>Total: <span className="text-emerald-700">KES {totalAmount.toLocaleString()}</span></p>
              <p className="text-xs mt-1 font-bold">
                {categories.length} fee categories configured
                {isEditMode && <span className="text-blue-600 ml-2">(Edit Mode)</span>}
              </p>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition duration-200 font-bold w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={categories.length === 0}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition duration-200 font-bold shadow disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                {isEditMode ? 'Update Breakdown' : 'Save Breakdown'}
              </button>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

function AdmissionFeeBreakdownModal({ 
  open, 
  onClose, 
  onSave, 
  existingBreakdown = []
}) {
  // FIXED: Initialize with existing data in edit mode
  const [categories, setCategories] = useState(() => {
    console.log('AdmissionFeeBreakdownModal initializing with:', existingBreakdown);
    
    // Only use existingBreakdown if it's a valid array with admission-specific data
    if (Array.isArray(existingBreakdown) && existingBreakdown.length > 0) {
      console.log('Edit Mode: Loading existing admission fee breakdown', existingBreakdown);
      // Filter out any non-admission specific fields that might have been inherited
      return existingBreakdown.map((cat, index) => ({
        ...cat,
        boardingOnly: false, // Ensure boardingOnly is false for admission fees
        optional: Boolean(cat.optional || false),
        amount: parseFloat(cat.amount) || 0,
        id: cat.id || `admission_category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        order: cat.order || index
      }));
    }
    console.log('Add Mode: Starting with empty admission categories');
    return []; // Start with empty array
  });
  
  const [totalAmount, setTotalAmount] = useState(0);
  const [errors, setErrors] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const total = Array.isArray(categories) 
      ? categories.reduce((sum, cat) => sum + (parseFloat(cat.amount) || 0), 0) 
      : 0;
    setTotalAmount(total);
  }, [categories]);

  // FIXED: Detect edit mode and load existing data
  useEffect(() => {
    if (open) {
      if (Array.isArray(existingBreakdown) && existingBreakdown.length > 0) {
        setIsEditMode(true);
        console.log('Admission Edit Mode detected with', existingBreakdown.length, 'existing categories');
        // Load existing data when modal opens
        setCategories(existingBreakdown.map((cat, index) => ({
          ...cat,
          boardingOnly: false,
          optional: Boolean(cat.optional || false),
          amount: parseFloat(cat.amount) || 0,
          id: cat.id || `admission_category_${Date.now()}_${index}`,
          order: cat.order || index
        })));
      } else {
        setIsEditMode(false);
        setCategories([]);
      }
    }
  }, [open, existingBreakdown]);

  const handleAddCategory = () => {
    const newCategory = {
      id: `admission_category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      amount: 0,
      description: '',
      optional: false,
      boardingOnly: false, // Explicitly false for admission fees
      order: categories.length
    };
    setCategories([...categories, newCategory]);
  };

  const handleCategoryChange = (index, field, value) => {
    const updated = [...categories];
    updated[index] = { ...updated[index], [field]: value };
    
    // Ensure boardingOnly is always false for admission fees
    if (field === 'boardingOnly') {
      updated[index].boardingOnly = false;
    }
    
    setCategories(updated);
  };

  const handleRemoveCategory = (index) => {
    if (categories.length <= 1) {
      toast.warning('At least one fee category is required');
      return;
    }
    const updated = categories.filter((_, i) => i !== index);
    setCategories(updated);
  };

  const handleSave = () => {
    const validationErrors = [];
    
    // Validate all categories
    categories.forEach((cat, index) => {
      if (!cat.name?.trim()) {
        validationErrors.push(`Category ${index + 1} requires a name`);
      }
      if (!cat.amount || cat.amount <= 0) {
        validationErrors.push(`Category "${cat.name || index + 1}" requires a valid amount`);
      }
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix all validation errors');
      return;
    }

    // Clean up data before saving - remove boardingOnly flag and ensure proper structure
    const cleanedCategories = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      amount: parseFloat(cat.amount) || 0,
      description: cat.description || '',
      optional: Boolean(cat.optional),
      boardingOnly: false, // Force false for admission
      order: cat.order || 0
    }));

    setErrors([]);
    onSave(cleanedCategories);
    onClose();
  };

  const presetCategories = [
    { 
      name: 'Application Fee', 
      amount: 0, 
      description: 'Non-refundable application processing fee',
      optional: false,
      boardingOnly: false
    },
    { 
      name: 'Registration Fee', 
      amount: 0, 
      description: 'Student registration fee',
      optional: false,
      boardingOnly: false
    },
    { 
      name: 'Acceptance Fee', 
      amount: 0, 
      description: 'Fee to secure admission spot',
      optional: false,
      boardingOnly: false
    },
    { 
      name: 'Uniform Deposit', 
      amount: 0, 
      description: 'Uniform purchase deposit',
      optional: true,
      boardingOnly: false
    },
    { 
      name: 'Medical Fee', 
      amount: 0, 
      description: 'Medical examination and records',
      optional: false,
      boardingOnly: false
    },
    { 
      name: 'Development Fee', 
      amount: 0, 
      description: 'School infrastructure development',
      optional: false,
      boardingOnly: false
    },
  ];

  // FIXED: Prevent preset loading in edit mode
  const loadPreset = (preset) => {
    if (categories.length === 0 && !isEditMode) {
      const loaded = preset.map((cat, index) => ({
        ...cat,
        id: `admission_preset_${Date.now()}_${index}`,
        order: index,
        boardingOnly: false, // Ensure no boarding flags
        optional: cat.optional || false
      }));
      setCategories(loaded);
      toast.success('Preset admission categories loaded. Update amounts as needed.');
    } else {
      toast.warning('Cannot load preset when editing existing admission fees.');
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    const orderedItems = items.map((item, index) => ({ 
      ...item, 
      order: index,
      boardingOnly: false // Maintain admission-specific structure
    }));
    setCategories(orderedItems);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '95vw',
        maxWidth: '700px',
        maxHeight: '85vh',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <FaUserCheck className="text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Admission Fee Breakdown</h2>
                <p className="text-white/90 text-sm mt-1 font-bold">
                  Define admission-related fees and charges
                </p>
                {isEditMode && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-white/30 px-2 py-1 rounded-full font-bold">
                      📝 Edit Mode
                    </span>
                    <span className="text-xs text-white/80">
                      Editing {categories.length} existing admission fee categories
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-h-[calc(85vh-180px)] overflow-y-auto p-6">
          {errors.length > 0 && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaExclamationTriangle className="text-red-600" />
                <h4 className="text-sm font-bold text-red-700">Validation Errors</h4>
              </div>
              <ul className="space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-xs text-red-600 font-bold">• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Admission Fee Categories</h3>
              <div className="flex gap-2">
                {/* FIXED: Show Load Preset only when NOT in edit mode */}
                {!isEditMode && categories.length === 0 && (
                  <button
                    type="button"
                    onClick={() => loadPreset(presetCategories)}
                    className="px-4 py-2 text-sm font-bold bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Load Preset
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-colors flex items-center gap-2"
                >
                  <FaPlus /> Add Category
                </button>
              </div>
            </div>

            {categories.length === 0 ? (
              <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-dashed border-purple-300">
                <FaUserCheck className="mx-auto text-4xl text-purple-400 mb-4" />
                <h4 className="text-lg font-bold text-gray-700 mb-2">No Admission Fees</h4>
                <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto font-bold">
                  {isEditMode 
                    ? 'No existing admission fees found. Start by adding new categories.' 
                    : 'Define the admission fees that new students need to pay. Start fresh with empty fields or load a preset.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {!isEditMode && (
                    <button
                      onClick={() => loadPreset(presetCategories)}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-colors font-bold shadow-lg flex items-center gap-2"
                    >
                      <FaFileAlt /> Load Preset
                    </button>
                  )}
                  <button
                    onClick={handleAddCategory}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-colors font-bold shadow-lg flex items-center gap-2"
                  >
                    <FaPlus /> Add First Category
                  </button>
                </div>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="admission-fee-categories">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-3"
                    >
                      {categories.map((category, index) => (
                        <Draggable 
                          key={category.id} 
                          draggableId={category.id} 
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="relative"
                            >
                              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 cursor-move" {...provided.dragHandleProps}>
                                <FaSort className="text-gray-400" />
                              </div>
                              <div className="ml-8">
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border-2 border-purple-200">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                      <div className="p-2 bg-purple-500 text-white rounded-xl">
                                        <FaMoneyBillWave className="text-sm" />
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-bold text-gray-900">{category.name || `Admission Fee ${index + 1}`}</h4>
                                        <p className="text-xs text-gray-600 font-bold">
                                          Amount: KES {category.amount?.toLocaleString() || '0'}
                                          {category.optional && <span className="text-gray-500 ml-2">(Optional)</span>}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveCategory(index)}
                                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                      title="Remove category"
                                    >
                                      <FaTrash className="text-sm" />
                                    </button>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-xs font-bold text-gray-700 mb-2">Category Name *</label>
                                      <input
                                        type="text"
                                        value={category.name || ''}
                                        onChange={(e) => handleCategoryChange(index, 'name', e.target.value)}
                                        placeholder="e.g., Application Fee"
                                        className="w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm font-bold"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-bold text-gray-700 mb-2">Amount (KES) *</label>
                                      <input
                                        type="number"
                                        min="0"
                                        step="100"
                                        value={category.amount || ''}
                                        onChange={(e) => handleCategoryChange(index, 'amount', parseFloat(e.target.value) || 0)}
                                        placeholder="Enter amount"
                                        className="w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm font-bold"
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="mt-3">
                                    <label className="block text-xs font-bold text-gray-700 mb-2">Description</label>
                                    <textarea
                                      value={category.description || ''}
                                      onChange={(e) => handleCategoryChange(index, 'description', e.target.value)}
                                      placeholder="Description of this admission fee..."
                                      rows="2"
                                      className="w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm font-bold resize-none"
                                    />
                                  </div>
                                  
                                  <div className="mt-3">
                                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                      <input
                                        type="checkbox"
                                        checked={category.optional || false}
                                        onChange={(e) => handleCategoryChange(index, 'optional', e.target.checked)}
                                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                      />
                                      Optional Fee (Not required for admission)
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>

          {/* Summary Section */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500 text-white rounded-xl">
                  <FaCalculator className="text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Admission Fee Summary</h3>
                  <p className="text-sm text-gray-600 font-bold">
                    {categories.length} admission fee categories
                    {isEditMode && <span className="text-blue-600 ml-2">(Editing existing)</span>}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-700">
                  KES {totalAmount.toLocaleString()}
                </div>
                <p className="text-xs text-gray-600 font-bold mt-1">
                  Total Admission Fees
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-purple-200">
                <p className="text-xs text-gray-600 font-bold uppercase tracking-wider mb-1">Required Fees</p>
                <p className="text-lg font-bold text-gray-900">
                  KES {categories.filter(c => !c.optional).reduce((sum, cat) => sum + (cat.amount || 0), 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-600 mt-1 font-bold">
                  {categories.filter(c => !c.optional).length} categories
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-purple-200">
                <p className="text-xs text-gray-600 font-bold uppercase tracking-wider mb-1">Optional Fees</p>
                <p className="text-lg font-bold text-gray-900">
                  KES {categories.filter(c => c.optional).reduce((sum, cat) => sum + (cat.amount || 0), 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-600 mt-1 font-bold">
                  {categories.filter(c => c.optional).length} categories
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 bg-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 font-bold">
              <p>Total Admission Fees: <span className="text-purple-700">KES {totalAmount.toLocaleString()}</span></p>
              <p className="text-xs mt-1 font-bold">
                {categories.length} admission fee categories configured
                {isEditMode && <span className="text-blue-600 ml-2">(Edit Mode)</span>}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {isEditMode 
                  ? 'Editing existing admission fee categories' 
                  : 'All fields start empty to prevent autofill from other fee types'}
              </p>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto mb-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition duration-200 font-bold w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={categories.length === 0}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition duration-200 font-bold shadow disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                {isEditMode ? 'Update Fees' : 'Save Fees'}
              </button>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
// Document Metadata Modal for Exam Results and Additional Files with Term Field
function DocumentMetadataModal({ 
  open, 
  onClose, 
  onSave, 
  fileName,
  existingData = {}
}) {
  const [year, setYear] = useState(existingData.year || '');
  const [term, setTerm] = useState(existingData.term || '');
  const [description, setDescription] = useState(existingData.description || '');

  const handleSave = () => {
    if (!year || !term || !description) {
      toast.error('Please fill in year, term, and description');
      return;
    }

    onSave({ year, term, description });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '95vw',
        maxWidth: '500px',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <FaFileAlt className="text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Document Metadata</h2>
                <p className="text-white/90 text-sm mt-1 font-bold">
                  {fileName}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Year *
                </label>
                <input
                  type="number"
                  min="2000"
                  max="2100"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g., 2024"
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-bold"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Term *
                </label>
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-bold"
                  required
                >
                  <option value="">Select Term</option>
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
                  <option value="Term 3">Term 3</option>
                  <option value="Annual">Annual</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this document contains..."
                rows="4"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-bold resize-none"
                required
              />
            </div>
            
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaInfoCircle className="text-blue-600" />
                <h4 className="text-sm font-bold text-gray-900">Why this information is important</h4>
              </div>
              <p className="text-xs text-gray-600 font-bold">
                Adding year, term, and description helps organize documents by academic year and term.
                This ensures proper categorization and makes document management more efficient.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6 bg-white">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition duration-200 font-bold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition duration-200 font-bold shadow"
            >
              Save Metadata
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

// Enhanced Modern PDF Upload with all fixes for edit mode
function ModernPdfUpload({ 
  pdfFile, 
  onPdfChange, 
  onRemove,
  feeBreakdown = null,
  onFeeBreakdownChange,
  label = "PDF File",
  required = false,
  existingPdf = null,
  existingFeeBreakdown = null,
  type = 'curriculum',
  onCancelExisting = null,
  onRemoveExisting = null,
  description = ""
}) {
  const fileSizeManager = useFileSize();
  const [previewName, setPreviewName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isReplacing, setIsReplacing] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [showAdmissionFeeModal, setShowAdmissionFeeModal] = useState(false);
  const [localFeeBreakdown, setLocalFeeBreakdown] = useState(() => {
    // Use existingFeeBreakdown if provided (edit mode)
    if (existingFeeBreakdown && Array.isArray(existingFeeBreakdown) && existingFeeBreakdown.length > 0) {
      console.log(`Edit Mode: Loading existing fee breakdown for ${type}`, existingFeeBreakdown);
      return existingFeeBreakdown;
    }
    return feeBreakdown || [];
  });
  
  const [fileSelected, setFileSelected] = useState(false);
  const [fileId, setFileId] = useState(null);
  const fileInputRef = useRef(null);
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [selectedFileForMetadata, setSelectedFileForMetadata] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // File size limit (0.5 MB individual file limit)
  const MAX_INDIVIDUAL_SIZE = 0.5 * 1024 * 1024;
  
  // Allowed file types
  const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

  // FIXED: Enhanced initialization for edit mode
  useEffect(() => {
    if (existingPdf) {
      setIsEditMode(true);
      console.log(`Edit Mode activated for ${type} with existing PDF:`, existingPdf);
    }
    
    if (pdfFile && typeof pdfFile === 'object') {
      setPreviewName(pdfFile.name);
      setFileSelected(true);
      if (!fileId) {
        const newFileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setFileId(newFileId);
      }
    } else if (existingPdf) {
      setPreviewName(existingPdf.name || existingPdf.filename || 'Existing PDF');
      setFileSelected(true);
      // Preserve existing fee breakdown in edit mode
      if (existingFeeBreakdown && existingFeeBreakdown.length > 0) {
        setLocalFeeBreakdown(existingFeeBreakdown);
      }
    } else {
      setPreviewName('');
      setFileSelected(false);
    }
  }, [pdfFile, existingPdf, fileId, existingFeeBreakdown, type]);

  const validateFile = (file) => {
    // Check file type by extension
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      toast.error('Only PDF, DOC, and DOCX files are allowed');
      return false;
    }
    
    // Check individual file size
    if (file.size > MAX_INDIVIDUAL_SIZE) {
      toast.error(`Individual file must not exceed ${(MAX_INDIVIDUAL_SIZE / (1024 * 1024)).toFixed(1)} MB`);
      return false;
    }
    
    return true;
  };

  // FIXED: Enhanced file change handler for edit mode metadata preservation
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 1);
    
    if (files.length === 0) return;

    const file = files[0];
    
    // Validate file
    if (!validateFile(file)) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Check if it's an exam result type
    if (type === 'results') {
      setSelectedFileForMetadata(file);
      setShowMetadataModal(true);
    } else {
      // For non-exam files - preserve existing metadata in edit mode
      const existingMetadata = existingPdf ? {
        year: existingPdf.year || '',
        description: existingPdf.description || '',
        term: existingPdf.term || ''
      } : {};

      // Update parent with file and preserved metadata
      onPdfChange(file, existingMetadata.year, existingMetadata.description, existingMetadata.term);
      
      // Update local state
      setPreviewName(file.name);
      setFileSelected(true);
      
      toast.success(isEditMode ? 'Replacement file selected' : 'File selected successfully');
    }
  };

  // FIXED: Enhanced metadata save handler for edit mode
  const handleMetadataSave = (metadata) => {
    if (selectedFileForMetadata) {
      // Preserve existing metadata if not overridden
      const existingMetadata = existingPdf ? {
        year: existingPdf.year || '',
        description: existingPdf.description || '',
        term: existingPdf.term || ''
      } : {};
      
      const finalMetadata = {
        year: metadata.year || existingMetadata.year,
        description: metadata.description || existingMetadata.description,
        term: metadata.term || existingMetadata.term
      };

      onPdfChange(selectedFileForMetadata, finalMetadata.year, finalMetadata.description, finalMetadata.term);
      setPreviewName(selectedFileForMetadata.name);
      setFileSelected(true);
      setShowMetadataModal(false);
      setSelectedFileForMetadata(null);
      
      toast.success(isEditMode ? 'File with metadata updated successfully' : 'File with metadata saved successfully');
    }
  };

  const handleFeeBreakdownSave = (breakdown) => {
    setLocalFeeBreakdown(breakdown);
    if (onFeeBreakdownChange) {
      onFeeBreakdownChange(breakdown);
    }
    toast.success(isEditMode ? 'Fee breakdown updated successfully' : 'Fee breakdown saved successfully');
  };

  const handleAdmissionFeeSave = (breakdown) => {
    setLocalFeeBreakdown(breakdown);
    if (onFeeBreakdownChange) {
      onFeeBreakdownChange(breakdown);
    }
    toast.success(isEditMode ? 'Admission fees updated successfully' : 'Admission fees saved successfully');
  };

  const calculateTotal = (breakdown) => {
    if (!breakdown || !Array.isArray(breakdown)) return 0;
    return breakdown.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const handleRemove = () => {
    if (isEditMode && existingPdf) {
      // In edit mode, mark existing file for deletion
      if (onRemoveExisting) {
        onRemoveExisting();
      }
    } else {
      // In add mode or for new files
      if (fileId) {
        fileSizeManager.removeFile(fileId);
      }
      onRemove();
    }
    setPreviewName('');
    setFileSelected(false);
    setFileId(null);
    setUploadProgress(0);
    toast.info(isEditMode ? 'File marked for deletion' : 'File removed');
  };

  const handleRemoveExisting = () => {
    if (onRemoveExisting) {
      onRemoveExisting();
    }
    setPreviewName('');
    setFileSelected(false);
    setFileId(null);
    toast.success('Existing PDF marked for removal');
  };

  const totalAmount = calculateTotal(localFeeBreakdown);
  const hasExistingPdf = existingPdf && !pdfFile;
  const hasNewPdf = pdfFile && typeof pdfFile === 'object';
  const hasFeeBreakdown = localFeeBreakdown && localFeeBreakdown.length > 0;

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).slice(0, 1);
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        handleFileChange({ target: { files } });
      }
    }
  };

  const getDescription = () => {
    switch(type) {
      case 'curriculum':
        return "Upload the official school curriculum document outlining all subjects, courses, and academic programs offered.";
      case 'day':
        return "Upload the fee structure for day scholars. This document should detail all applicable fees for students who don't board at the school.";
      case 'boarding':
        return "Upload the fee structure for boarding students. This document should include accommodation, meals, and all boarding-related charges.";
      case 'admission':
        return "Upload the admission fee document outlining all charges new students need to pay upon admission.";
      case 'results':
        return "Upload the examination results document. Ensure it includes proper grading, subject scores, and student performance data.";
      default:
        return description;
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Section with Edit Mode Indicator */}
      <div className="w-full max-w-2xl">
        {/* EDIT MODE NOTIFICATION */}
        {isEditMode && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2">
              <FaPencilAlt className="text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-bold text-blue-800">
                  📝 Edit Mode - Editing Existing Document
                </p>
                <p className="text-xs text-blue-700 font-bold mt-1">
                  You can replace the file or edit metadata. Existing metadata will be preserved unless changed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* FILE SIZE NOTIFICATION */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2">
            <FaExclamationTriangle className="text-yellow-600" />
            <p className="text-sm font-bold text-yellow-800">
              Each file must not exceed 500kB. Allowed types: PDF, DOC, DOCX
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            {type === 'curriculum' && <FaBook className="text-red-500" />}
            {type === 'day' && <FaMoneyBillWave className="text-green-500" />}
            {type === 'boarding' && <FaBuilding className="text-blue-500" />}
            {type === 'admission' && <FaUserCheck className="text-purple-500" />}
            {type === 'results' && <FaAward className="text-orange-500" />}
            <span className="text-base">{label}</span>
            {required && <span className="text-red-500 ml-1">*</span>}
            {fileSelected && (
              <span className="flex items-center gap-1 text-green-600 text-xs bg-green-50 px-2 py-1 rounded-full">
                <FaCheck className="text-xs" />
                {isEditMode ? 'Editing' : 'Selected'}
              </span>
            )}
            {isEditMode && (
              <span className="flex items-center gap-1 text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded-full">
                <FaPencilAlt className="text-xs" />
                Edit Mode
              </span>
            )}
          </label>
          
          {(type === 'day' || type === 'boarding' || type === 'admission') && (
            <button
              type="button"
              onClick={() => {
                if (type === 'admission') {
                  setShowAdmissionFeeModal(true);
                } else {
                  setShowFeeModal(true);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition duration-200 font-bold text-sm shadow-lg"
            >
              <FaCalculator className="text-xs" />
              {hasFeeBreakdown 
                ? (isEditMode ? 'Edit Existing Breakdown' : 'Edit Breakdown') 
                : 'Add Fee Breakdown'}
            </button>
          )}
        </div>
        
        {/* EXISTING METADATA DISPLAY IN EDIT MODE */}
        {hasExistingPdf && (
          <div className="mb-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border-2 border-blue-200">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="text-blue-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-900 mb-2">Existing Document Information</h4>
                <div className="grid grid-cols-2 gap-3">
                  {existingPdf.year && (
                    <div className="bg-white p-2 rounded-lg border border-blue-200">
                      <p className="text-xs text-gray-500 font-bold">Year</p>
                      <p className="text-sm font-bold text-gray-900">{existingPdf.year}</p>
                    </div>
                  )}
                  {existingPdf.term && (
                    <div className="bg-white p-2 rounded-lg border border-blue-200">
                      <p className="text-xs text-gray-500 font-bold">Term</p>
                      <p className="text-sm font-bold text-gray-900">{existingPdf.term}</p>
                    </div>
                  )}
                  {existingPdf.description && (
                    <div className="col-span-2 bg-white p-2 rounded-lg border border-blue-200">
                      <p className="text-xs text-gray-500 font-bold">Description</p>
                      <p className="text-sm font-bold text-gray-900">{existingPdf.description}</p>
                    </div>
                  )}
                  {existingPdf.size && (
                    <div className="bg-white p-2 rounded-lg border border-blue-200">
                      <p className="text-xs text-gray-500 font-bold">File Size</p>
                      <p className="text-sm font-bold text-gray-900">
                        {formatFileSize(existingPdf.size)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border-2 border-gray-200">
          <div className="flex items-start gap-3">
            <FaInfoCircle className="text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-1">Why upload this document?</h4>
              <p className="text-xs text-gray-700 font-bold leading-relaxed">
                {getDescription()}
              </p>
            </div>
          </div>
        </div>

        {hasFeeBreakdown && (type === 'day' || type === 'boarding' || type === 'admission') && (
          <div className={`mb-4 bg-gradient-to-br ${type === 'admission' ? 'from-purple-50 to-purple-100 border-purple-200' : type === 'boarding' ? 'from-blue-50 to-blue-100 border-blue-200' : 'from-green-50 to-green-100 border-green-200'} rounded-2xl p-4 border-2`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FaMoneyBillWave className={type === 'admission' ? 'text-purple-600' : type === 'boarding' ? 'text-blue-600' : 'text-green-600'} />
                <h4 className="text-sm font-bold text-gray-900">
                  {type === 'admission' ? 'Admission Fees' : `${type.charAt(0).toUpperCase() + type.slice(1)} School Fees`}
                  {isEditMode && <span className="text-blue-600 text-xs ml-2">(Editing Existing)</span>}
                </h4>
              </div>
              <span className={`text-lg font-bold ${type === 'admission' ? 'text-purple-700' : type === 'boarding' ? 'text-blue-700' : 'text-green-700'}`}>
                KES {totalAmount.toLocaleString()}
              </span>
            </div>
            
            <div className="space-y-2">
              {localFeeBreakdown.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100">
                  <div className="flex-1">
                    <span className="text-sm font-bold text-gray-800">{item.name}</span>
                    {item.optional && (
                      <span className="text-xs text-gray-500 ml-2 font-bold">(Optional)</span>
                    )}
                    {item.boardingOnly && (
                      <span className="text-xs text-green-600 ml-2 font-bold">(Boarding)</span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-gray-700">
                    KES {item.amount?.toLocaleString()}
                  </span>
                </div>
              ))}
              
              {localFeeBreakdown.length > 3 && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={type === 'admission' ? () => setShowAdmissionFeeModal(true) : () => setShowFeeModal(true)}
                    className={`text-sm font-bold ${type === 'admission' ? 'text-purple-600 hover:text-purple-700' : type === 'boarding' ? 'text-blue-600 hover:text-blue-700' : 'text-green-600 hover:text-green-700'}`}
                  >
                    + {localFeeBreakdown.length - 3} more categories
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* File Upload Section */}
      <div className="w-full max-w-2xl">
        {(hasNewPdf || hasExistingPdf) ? (
          <div className="relative group">
            <div className={`relative overflow-hidden rounded-2xl border-2 ${fileSelected ? 'border-green-400 bg-green-50/20' : 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100'} shadow-lg transition-all duration-300 p-5`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 ${fileSelected ? 'bg-green-500' : type === 'curriculum' ? 'bg-red-500' : type === 'day' ? 'bg-green-500' : type === 'boarding' ? 'bg-blue-500' : type === 'admission' ? 'bg-purple-500' : 'bg-orange-500'} rounded-xl text-white`}>
                    {fileSelected ? <FaCheck className="text-lg" /> : <FaFilePdf className="text-lg" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm truncate max-w-[180px]">
                      {hasNewPdf ? pdfFile.name : (existingPdf.name || existingPdf.filename || 'Existing PDF')}
                    </p>
                    <p className="text-xs text-gray-600 font-bold">
                      {fileSelected ? (isEditMode ? '✓ Editing Existing File' : '✓ File Selected') : 'No file selected'}
                      {hasNewPdf && pdfFile.size && ` • ${(pdfFile.size / 1024).toFixed(0)} KB`}
                      {hasFeeBreakdown && ` • ${localFeeBreakdown.length} categories`}
                      {isEditMode && hasExistingPdf && ` • ${isEditMode ? 'Edit Mode' : ''}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {hasExistingPdf && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          // Clear the current file reference
                          setPreviewName('');
                          setFileSelected(false);
                          
                          // Create and trigger file input
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = '.pdf,.doc,.docx';
                          input.onchange = (e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              // Validate and handle the file
                              if (validateFile(file)) {
                                // Preserve existing metadata
                                const existingMetadata = existingPdf ? {
                                  year: existingPdf.year || '',
                                  description: existingPdf.description || '',
                                  term: existingPdf.term || ''
                                } : {};
                                
                                // Update parent state with replacement
                                onPdfChange(file, existingMetadata.year, existingMetadata.description, existingMetadata.term);
                                
                                // Update local state
                                setPreviewName(file.name);
                                setFileSelected(true);
                                
                                // If this is an existing file, mark it for replacement
                                if (existingPdf && onCancelExisting) {
                                  onCancelExisting(existingPdf);
                                }
                                
                                toast.success('File selected for replacement');
                              }
                            }
                          };
                          input.click();
                        }}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow hover:shadow-md hover:from-blue-600 hover:to-blue-700 flex items-center gap-1 text-sm font-bold"
                      >
                        <FaUpload className="text-xs" />
                        Replace File
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          // Mark for deletion
                          if (onRemoveExisting) {
                            onRemoveExisting();
                          }
                          // Clear local state
                          setPreviewName('');
                          setFileSelected(false);
                          toast.warning('File marked for deletion');
                        }}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow hover:shadow-md hover:from-red-600 hover:to-red-700 flex items-center gap-1 text-sm font-bold"
                      >
                        <FaTrash className="text-xs" />
                        Delete
                      </button>
                    </div>
                  )}
                  {hasNewPdf && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsReplacing(true);
                          setPreviewName('');
                          setFileSelected(false);
                          setUploadProgress(0);
                          toast.info('Select a replacement file');
                          setTimeout(() => fileInputRef.current?.click(), 100);
                        }}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow hover:shadow-md hover:from-blue-600 hover:to-blue-700 flex items-center gap-1 text-sm font-bold"
                      >
                        <FaUpload className="text-xs" />
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={handleRemove}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white p-2 rounded-xl transition-all duration-300 shadow hover:shadow-md hover:from-red-600 hover:to-red-700"
                        title="Remove PDF"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {fileSelected && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="w-full bg-green-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full"></div>
                  </div>
                  <span className="text-xs font-bold text-green-700">
                    {isEditMode ? 'Editing ✓' : 'Selected ✓'}
                  </span>
                </div>
              )}
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-4">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Uploading...</span>
                    <span className="text-xs font-bold text-red-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-orange-500 h-full transition-all duration-500"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer group w-full max-w-2xl ${
              dragOver 
                ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 ring-4 ring-blue-50' 
                : 'border-gray-200 hover:border-blue-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => { 
              e.preventDefault(); 
              e.stopPropagation();
              setDragOver(true); 
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragOver(false);
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="relative">
              <FaUpload className={`mx-auto text-2xl mb-3 transition-all duration-300 ${
                dragOver ? 'text-blue-500 scale-110' : 'text-gray-400 group-hover:text-blue-500'
              }`} />
            </div>
            <p className="text-gray-700 mb-1.5 font-bold transition-colors duration-300 group-hover:text-gray-800 text-base">
              {dragOver ? '📄 Drop file here!' : isReplacing ? 'Select replacement file' : 'Click to upload file'}
            </p>
            <p className="text-xs text-gray-600 transition-colors duration-300 group-hover:text-gray-700 font-bold">
              Max: 500KB • PDF, DOC, DOCX only
            </p>
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".pdf,.doc,.docx" 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {(type === 'day' || type === 'boarding') && showFeeModal && (
        <FeeBreakdownModal
          open={showFeeModal}
          onClose={() => setShowFeeModal(false)}
          onSave={handleFeeBreakdownSave}
          title={`${type === 'day' ? 'Day School' : 'Boarding School'} Fee Breakdown`}
          existingBreakdown={localFeeBreakdown}
          type={type}
        />
      )}

      {type === 'admission' && showAdmissionFeeModal && (
        <AdmissionFeeBreakdownModal
          open={showAdmissionFeeModal}
          onClose={() => setShowAdmissionFeeModal(false)}
          onSave={handleAdmissionFeeSave}
          existingBreakdown={localFeeBreakdown}
        />
      )}

      {type === 'results' && showMetadataModal && selectedFileForMetadata && (
        <DocumentMetadataModal
          open={showMetadataModal}
          onClose={() => {
            setShowMetadataModal(false);
            setSelectedFileForMetadata(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
          onSave={handleMetadataSave}
          fileName={selectedFileForMetadata.name}
        />
      )}
    </div>
  );
}

// Helper function for file size formatting

// First, update the AdditionalResultsUpload component to properly pass data to parent
function AdditionalResultsUpload({ 
  files = [], 
  onFilesChange, 
  label = "Additional Documents",
  existingFiles = [],
  onCancelExisting = null,
  onRemoveExisting = null,
  additionalFilesState = [],
  onAdditionalFilesStateChange = null
}) {
  const fileSizeManager = useFileSize();
  const [dragOver, setDragOver] = useState(false);
  const [localFiles, setLocalFiles] = useState([]);
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // File size limit (0.5 MB individual file limit)
  const MAX_INDIVIDUAL_SIZE = 0.5 * 1024 * 1024;
  
  // Allowed file types for additional documents
  const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

  // Initialize localFiles from props - FIXED VERSION
  useEffect(() => {
    // Ensure existingFiles is an array
    const safeExistingFiles = Array.isArray(existingFiles) ? existingFiles : [];
    
    const existingFileObjects = safeExistingFiles.map((file, index) => ({
      ...file,
      id: file.id || `existing_${Date.now()}_${index}`,
      isExisting: true,
      isModified: false,
      isRemoved: false,
      isReplaced: false,
      originalFilePath: file.filepath,
      year: file.year || '',
      description: file.description || '',
      term: file.term || '',
      filesize: file.filesize || file.size || 0,
      filetype: file.filetype || 'document',
      status: 'existing'
    }));
    
    // Ensure files is an array
    const safeFiles = Array.isArray(files) ? files : [];
    
    const newFileObjects = safeFiles.filter(file => {
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
      term: file.term || '',
      isNew: true,
      isModified: false,
      filetype: file.type?.split('/')[1] || 'file',
      filesize: file.size || 0,
      status: 'uploaded'
    }));
    
    const allFiles = [...existingFileObjects, ...newFileObjects];
    const uniqueFiles = [];
    const seenIds = new Set();
    
    allFiles.forEach(file => {
      if (!seenIds.has(file.id)) {
        seenIds.add(file.id);
        uniqueFiles.push(file);
      }
    });
    
    setLocalFiles(uniqueFiles);
    
    // Update parent state if prop is provided
    if (onAdditionalFilesStateChange && typeof onAdditionalFilesStateChange === 'function') {
      onAdditionalFilesStateChange(uniqueFiles);
    }
  }, [existingFiles, files]);

  // Update localFiles when additionalFilesState changes
  useEffect(() => {
    if (additionalFilesState && Array.isArray(additionalFilesState)) {
      setLocalFiles(additionalFilesState);
    }
  }, [additionalFilesState]);

  const validateFile = (file) => {
    if (!file || !file.name) {
      toast.error('Invalid file');
      return false;
    }
    
    // Check file type by extension
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      toast.error('Only PDF, DOC, and DOCX files are allowed');
      return false;
    }
    
    // Check individual file size
    if (file.size > MAX_INDIVIDUAL_SIZE) {
      toast.error(`Individual file must not exceed ${(MAX_INDIVIDUAL_SIZE / (1024 * 1024)).toFixed(1)} MB`);
      return false;
    }
    
    return true;
  };

  const simulateUpload = (file) => {
    return new Promise((resolve) => {
      setIsUploading(true);
      setUploadProgress(0);
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setUploadProgress(0);
              setIsUploading(false);
            }, 1000);
            return 100;
          }
          return prev + 20;
        });
      }, 100);
      
      setTimeout(() => {
        resolve(file);
      }, 600);
    });
  };

  const handleFileChange = async (e) => {
    const newFileList = Array.from(e.target.files);
    if (newFileList.length > 0) {
      const newFile = newFileList[0];
      
      if (!validateFile(newFile)) {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      await simulateUpload(newFile);
      
      setSelectedFile({
        file: newFile,
        id: `new_${Date.now()}`,
        filename: newFile.name
      });
      setShowMetadataModal(true);
    }
  };

  const handleMetadataSave = async (metadata) => {
    if (selectedFile && selectedFile.file) {
      // Check total size
      const success = fileSizeManager.addFile(selectedFile.file, selectedFile.id);
      if (!success) {
        setSelectedFile(null);
        setShowMetadataModal(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      await simulateUpload(selectedFile.file);

      const newFileObject = {
        ...selectedFile,
        year: metadata.year,
        term: metadata.term,
        description: metadata.description,
        isNew: true,
        isModified: true,
        status: 'uploaded',
        uploadDate: new Date().toISOString(),
        filesize: selectedFile.file.size
      };
      
      const updatedFiles = [...localFiles, newFileObject];
      setLocalFiles(updatedFiles);
      
      // Notify parent of new file
      if (onFilesChange && typeof onFilesChange === 'function') {
        onFilesChange([selectedFile.file]);
      }
      
      // Update parent state via callback with the complete object
      if (onAdditionalFilesStateChange && typeof onAdditionalFilesStateChange === 'function') {
        onAdditionalFilesStateChange(updatedFiles);
      }
      
      toast.success('Document added with metadata');
      
      setSelectedFile(null);
      setShowMetadataModal(false);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const newFiles = Array.from(e.dataTransfer.files);
    if (newFiles.length > 0) {
      const newFile = newFiles[0];
      
      if (!validateFile(newFile)) {
        return;
      }
      
      await simulateUpload(newFile);
      
      setSelectedFile({
        file: newFile,
        id: `new_${Date.now()}`,
        filename: newFile.name
      });
      setShowMetadataModal(true);
    }
  };

  const handleReplaceExisting = (id) => {
    const fileToReplace = localFiles.find(f => f.id === id);
    
    if (fileToReplace && fileToReplace.isExisting) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.doc,.docx';
      input.onchange = async (e) => {
        const replacementFile = e.target.files[0];
        if (replacementFile) {
          if (!validateFile(replacementFile)) {
            return;
          }
          
          await simulateUpload(replacementFile);
          
          // Check total size for replacement
          const success = fileSizeManager.replaceFile(id, replacementFile);
          if (!success) {
            return;
          }
          
          setSelectedFile({
            file: replacementFile,
            id: `replacement_${Date.now()}`,
            filename: replacementFile.name,
            replacesFileId: id
          });
          setShowMetadataModal(true);
          
          if (onCancelExisting && typeof onCancelExisting === 'function') {
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
      const updatedFiles = localFiles.map(file => 
        file.id === id ? { ...file, isRemoved: true, status: 'removed' } : file
      );
      
      setLocalFiles(updatedFiles);
      
      // Update parent state via callback
      if (onAdditionalFilesStateChange && typeof onAdditionalFilesStateChange === 'function') {
        onAdditionalFilesStateChange(updatedFiles);
      }
      
      if (onRemoveExisting && typeof onRemoveExisting === 'function') {
        onRemoveExisting(fileToRemove);
      }
      
      toast.warning('File marked for removal. Save changes to delete permanently.');
    }
  };

  const handleRemoveNewFile = (id) => {
    const fileToRemove = localFiles.find(f => f.id === id);
    
    if (fileToRemove && fileToRemove.isNew) {
      // Remove from size manager
      fileSizeManager.removeFile(id);
      
      const updatedFiles = localFiles.filter(file => file.id !== id);
      setLocalFiles(updatedFiles);
      
      // Update parent state via callback
      if (onAdditionalFilesStateChange && typeof onAdditionalFilesStateChange === 'function') {
        onAdditionalFilesStateChange(updatedFiles);
      }
      
      if (fileToRemove.file) {
        const updatedFilesList = files.filter(f => 
          f !== fileToRemove.file && 
          f.name !== fileToRemove.filename
        );
        if (onFilesChange && typeof onFilesChange === 'function') {
          onFilesChange(updatedFilesList);
        }
      }
      
      toast.info('New file removed from list.');
    }
  };

  const handleViewFile = (file) => {
    if (file.file) {
      // For new files, create object URL for preview
      const url = URL.createObjectURL(file.file);
      window.open(url, '_blank');
    } else if (file.filepath) {
      // For existing files, open from server path
      window.open(file.filepath, '_blank');
    }
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return <FaFile className="text-gray-500" />;
    const type = fileType.toLowerCase();
    if (type.includes('pdf')) return <FaFilePdf className="text-red-500" />;
    if (type.includes('image')) return <FaFileAlt className="text-green-500" />;
    if (type.includes('word') || type.includes('doc')) return <FaFileAlt className="text-blue-500" />;
    return <FaFile className="text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const displayFiles = localFiles.filter(file => !file.isRemoved);
  const hasFiles = displayFiles.length > 0;

  return (
    <div className="space-y-4 w-full max-w-2xl">
      {/* FILE SIZE NOTIFICATION */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2">
          <FaExclamationTriangle className="text-yellow-600" />
          <p className="text-sm font-bold text-yellow-800">
            Each file must not exceed 600 kB. Allowed types: PDF, DOC, DOCX
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <FaFile className="text-gray-600" />
          <span className="text-base">{label}</span>
          {hasFiles && (
            <span className="flex items-center gap-1 text-green-600 text-xs bg-green-50 px-2 py-1 rounded-full">
              <FaCheck className="text-xs" />
              {displayFiles.length} document{displayFiles.length !== 1 ? 's' : ''} selected
            </span>
          )}
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition duration-200 font-bold shadow-lg text-sm"
        >
          <FaPlus className="text-sm" /> Add Document
        </button>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border-2 border-gray-200">
        <div className="flex items-start gap-3">
          <FaInfoCircle className="text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-1">Why upload additional documents?</h4>
            <p className="text-xs text-gray-700 font-bold leading-relaxed">
              Upload supplementary documents like school policies, extra-curricular activity information, 
              special programs, or any other relevant school documentation. Each document requires year, 
              term, and description for proper organization.
            </p>
          </div>
        </div>
      </div>

      {/* PREVIEW SECTION */}
      {hasFiles && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <FaEye className="text-blue-500" />
              Preview Selected Documents ({displayFiles.length})
            </h3>
            <span className="text-xs text-gray-500 font-bold">
              {localFiles.filter(f => f.isNew).length} new, {localFiles.filter(f => f.isExisting).length} existing
            </span>
          </div>
          
          <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
            {displayFiles.map((file) => (
              <div key={file.id} className={`bg-white rounded-2xl p-4 border-2 ${
                file.isReplaced ? 'border-amber-200 bg-amber-50/30' : 
                file.isNew ? 'border-emerald-200 bg-emerald-50/30' : 
                'border-gray-200 hover:border-blue-200'
              } transition-all duration-300`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl cursor-pointer"
                       onClick={() => handleViewFile(file)}>
                    {getFileIcon(file.filetype)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-gray-900 text-sm truncate cursor-pointer hover:text-blue-600"
                         onClick={() => handleViewFile(file)}>
                        {file.filename || file.name || 'Document'}
                      </p>
                      <div className="flex gap-1">
                        {file.isReplaced && (
                          <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded font-bold uppercase">
                            Replaced
                          </span>
                        )}
                        {file.isNew && !file.isReplacement && (
                          <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded font-bold uppercase">
                            New
                          </span>
                        )}
                        {file.isExisting && (
                          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded font-bold uppercase">
                            Existing
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-700 space-y-1 mt-1 font-bold">
                      {file.year && (
                        <div className="flex items-center gap-1">
                          <FaCalendar className="text-gray-400" />
                          Year: <span className="text-blue-600">{file.year}</span>
                        </div>
                      )}
                      {file.term && (
                        <div className="flex items-center gap-1">
                          <FaClock className="text-gray-400" />
                          Term: <span className="text-green-600">{file.term}</span>
                        </div>
                      )}
                      {file.description && (
                        <div className="flex items-start gap-1 mt-1">
                          <FaAlignLeft className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{file.description}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-xs text-gray-500 font-bold">
                        {formatFileSize(file.filesize || file.size)}
                      </p>
                      <p className="text-xs text-gray-400 font-bold">•</p>
                      <p className="text-xs text-gray-500 font-bold">
                        {file.filetype?.toUpperCase() || 'DOCUMENT'}
                      </p>
                      {file.uploadDate && (
                        <>
                          <p className="text-xs text-gray-400 font-bold">•</p>
                          <p className="text-xs text-gray-500 font-bold">
                            Uploaded: {new Date(file.uploadDate).toLocaleDateString()}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleViewFile(file)}
                      className="p-2 text-blue-600 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors"
                      title="View document"
                    >
                      <FaEye size={12} />
                    </button>
                    {file.isExisting && !file.isReplaced ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleReplaceExisting(file.id)}
                          className="p-2 text-amber-600 bg-amber-50 rounded-xl border border-amber-200 hover:bg-amber-100 transition-colors"
                          title="Replace file"
                        >
                          <FaUpload size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveExisting(file.id)}
                          className="p-2 text-red-600 bg-red-50 rounded-xl border border-red-200 hover:bg-red-100 transition-colors"
                          title="Delete file"
                        >
                          <FaTrash size={12} />
                        </button>
                      </>
                    ) : file.isNew ? (
                      <button
                        type="button"
                        onClick={() => handleRemoveNewFile(file.id)}
                        className="p-2 text-red-600 bg-red-50 rounded-xl border border-red-200 hover:bg-red-100 transition-colors"
                        title="Remove file"
                      >
                        <FaTimes size={12} />
                      </button>
                    ) : null}
                  </div>
                </div>
                
                {isUploading && file.id === selectedFile?.id && (
                  <div className="mt-2">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Uploading...</span>
                      <span className="text-xs font-bold text-blue-600">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-500"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UPLOAD AREA */}
      <div
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer group w-full max-w-2xl ${
          dragOver 
            ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 ring-4 ring-blue-50' 
            : 'border-gray-200 hover:border-blue-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg'
        } ${hasFiles ? 'mt-4' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="relative">
          <FaUpload className={`mx-auto text-2xl mb-3 transition-all duration-300 ${
            dragOver ? 'text-blue-500 scale-110' : 'text-gray-400 group-hover:text-blue-500'
          }`} />
        </div>
        <p className="text-gray-700 mb-1.5 font-bold transition-colors duration-300 group-hover:text-gray-800 text-base">
          {dragOver ? '📁 Drop files here!' : 'Drag & drop or click to upload documents'}
        </p>
        <p className="text-xs text-gray-600 transition-colors duration-300 group-hover:text-gray-700 font-bold">
          PDF, DOC, DOCX only • Max 500kb each
        </p>
        <input 
          ref={fileInputRef}
          type="file" 
          onChange={handleFileChange} 
          className="hidden" 
          id="additional-files-upload" 
        />
        
        {isUploading && (
          <div className="mt-4">
            <div className="flex justify-between mb-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Preparing...</span>
              <span className="text-xs font-bold text-blue-600">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-500"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Metadata Modal */}
      {showMetadataModal && selectedFile && (
        <DocumentMetadataModal
          open={showMetadataModal}
          onClose={() => {
            setShowMetadataModal(false);
            setSelectedFile(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
          onSave={handleMetadataSave}
          fileName={selectedFile.filename}
        />
      )}
    </div>
  );
}


// Updated ModernDocumentCard Component with View Details
function ModernDocumentCard({ 
  title, 
  description, 
  pdfUrl, 
  pdfName, 
  year = null,
  term = null,
  feeBreakdown = null,
  admissionBreakdown = null,
  onReplace = null,
  onRemove = null,
  existing = false,
  type = 'default',
  fileSize = null,
  uploadDate = null
}) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const breakdown = feeBreakdown || admissionBreakdown;
  const totalAmount = breakdown?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  const categoriesCount = breakdown?.length || 0;

  // Prepare document data for the details modal
  const documentData = {
    title,
    description,
    pdfUrl,
    pdfName,
    year,
    term,
    feeBreakdown,
    admissionBreakdown,
    type,
    fileSize,
    uploadDate
  };

  return (
    <>
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-5 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-blue-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 ${type.includes('curriculum') ? 'bg-red-500' : type.includes('day' ? 'bg-green-500' : type.includes('boarding') ? 'bg-blue-500' : type.includes('admission') ? 'bg-purple-500' : 'bg-orange-500')} rounded-xl text-white`}>
              <FaFilePdf className="text-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-900">{title}</h4>
              <p className="text-xs text-gray-600 font-bold mt-1">{description}</p>
              {(year || term) && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {year && (
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                      Year: {year}
                    </span>
                  )}
                  {term && (
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                      Term: {term}
                    </span>
                  )}
                </div>
              )}
              {breakdown && categoriesCount > 0 && (
                <button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="mt-2 flex items-center gap-2 text-xs font-bold text-purple-600 hover:text-purple-700"
                >
                  <FaCalculator className="text-xs" />
                  {showBreakdown ? 'Hide' : 'Show'} {type.includes('admission') ? 'Admission Fees' : 'Fee Breakdown'} ({categoriesCount} categories)
                </button>
              )}
            </div>
          </div>
          
          {existing && (onReplace || onRemove) && (
            <div className="flex gap-2">
              <button
                onClick={onReplace}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-blue-200"
                title="Replace PDF"
              >
                <FaUpload size={14} />
              </button>
              <button
                onClick={onRemove}
                className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-200"
                title="Remove PDF"
              >
                <FaTrash size={14} />
              </button>
            </div>
          )}
        </div>
        
        {showBreakdown && breakdown && categoriesCount > 0 && (
          <div className={`mb-4 bg-gradient-to-br ${type.includes('admission') ? 'from-purple-50 to-purple-100 border-purple-200' : type.includes('boarding') ? 'from-blue-50 to-blue-100 border-blue-200' : 'from-green-50 to-green-100 border-green-200'} rounded-xl p-4 border`}>
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-bold text-gray-900">
                {type.includes('admission') ? 'Admission Fee' : 'Fee'} Breakdown
              </h5>
              <span className={`text-lg font-bold ${type.includes('admission') ? 'text-purple-700' : type.includes('boarding') ? 'text-blue-700' : 'text-green-700'}`}>
                KES {totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="space-y-2">
              {breakdown.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-800">{item.name}</span>
                      {item.optional && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-bold">Optional</span>
                      )}
                      {item.boardingOnly && (
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded font-bold">Boarding</span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-gray-600 mt-1 font-bold">{item.description}</p>
                    )}
                  </div>
                  <span className="text-sm font-bold text-gray-700">
                    KES {item.amount?.toLocaleString()}
                  </span>
                </div>
              ))}
              {breakdown.length > 3 && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => setShowDetailsModal(true)}
                    className="text-xs text-purple-600 hover:text-purple-700 font-bold"
                  >
                    + {breakdown.length - 3} more categories (View all)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setShowDetailsModal(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-colors shadow-lg"
          >
            <FaEye /> View Details
          </button>
          <a
            href={pdfUrl}
            download={pdfName || `${title}.pdf`}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-colors shadow-lg"
          >
            <FaDownload /> Download
          </a>
        </div>
      </div>

      <DocumentDetailsModal 
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        documentData={documentData}
      />
    </>
  );
}

// Document Details Modal Component
function DocumentDetailsModal({ 
  open, 
  onClose, 
  documentData 
}) {
  if (!documentData) return null;
  
  const { 
    title, 
    description, 
    pdfUrl, 
    pdfName, 
    year, 
    term,
    feeBreakdown,
    admissionBreakdown,
    type,
    fileSize,
    uploadDate
  } = documentData;

  const breakdown = feeBreakdown || admissionBreakdown;
  const categoriesCount = breakdown?.length || 0;
  const totalAmount = breakdown?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;

  const getDocumentTypeIcon = () => {
    switch(type) {
      case 'curriculum': return <FaBook className="text-red-500" />;
      case 'day': return <FaMoneyBillWave className="text-green-500" />;
      case 'boarding': return <FaBuilding className="text-blue-500" />;
      case 'admission': return <FaUserCheck className="text-purple-500" />;
      case 'results': return <FaAward className="text-orange-500" />;
      default: return <FaFilePdf className="text-gray-500" />;
    }
  };

  const getDocumentTypeLabel = () => {
    switch(type) {
      case 'curriculum': return 'Curriculum Document';
      case 'day': return 'Day School Fees';
      case 'boarding': return 'Boarding School Fees';
      case 'admission': return 'Admission Fees';
      case 'results': return 'Examination Results';
      default: return 'Document';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '95vw',
        maxWidth: '800px',
        maxHeight: '90vh',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                {getDocumentTypeIcon()}
              </div>
              <div>
                <h2 className="text-xl font-bold">Document Details</h2>
                <p className="text-white/90 text-sm mt-1 font-bold">
                  {getDocumentTypeLabel()}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-180px)] overflow-y-auto p-6">
          {/* Basic Information */}
          <div className="mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                <p className="text-gray-600 text-sm font-bold mt-1">{description}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-blue-600">
                  {pdfName || 'Document'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatFileSize(fileSize)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {year && (
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 font-bold">Year</p>
                  <p className="text-sm font-bold text-gray-900">{year}</p>
                </div>
              )}
              
              {term && (
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 font-bold">Term</p>
                  <p className="text-sm font-bold text-gray-900">{term}</p>
                </div>
              )}
              
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 font-bold">File Type</p>
                <p className="text-sm font-bold text-gray-900">PDF Document</p>
              </div>
              
              {uploadDate && (
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 font-bold">Upload Date</p>
                  <p className="text-sm font-bold text-gray-900">{formatDate(uploadDate)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Fee Breakdown Section (if available) */}
          {breakdown && categoriesCount > 0 && (
            <div className={`mb-6 bg-gradient-to-br ${
              type === 'admission' ? 'from-purple-50 to-purple-100 border-purple-200' : 
              type === 'boarding' ? 'from-blue-50 to-blue-100 border-blue-200' : 
              type === 'day' ? 'from-green-50 to-green-100 border-green-200' : 
              'from-gray-50 to-gray-100 border-gray-200'
            } rounded-xl p-5 border`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {type === 'admission' ? 'Admission Fee Breakdown' : 'Fee Structure Breakdown'}
                </h3>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    type === 'admission' ? 'text-purple-700' : 
                    type === 'boarding' ? 'text-blue-700' : 
                    'text-green-700'
                  }`}>
                    KES {totalAmount.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-600 mt-1 font-bold">
                    {categoriesCount} categories • {breakdown.filter(c => !c.optional).length} required
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {breakdown.map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">{item.name}</span>
                        {item.optional && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-bold">
                            Optional
                          </span>
                        )}
                        {item.boardingOnly && (
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-bold">
                            Boarding Only
                          </span>
                        )}
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        KES {item.amount?.toLocaleString()}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-2 font-bold">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Information */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500 text-white rounded-lg">
                <FaFilePdf className="text-lg" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">File Information</h3>
                <p className="text-sm text-gray-600 font-bold">Access and download options</p>
              </div>
            </div>

            <div className="space-y-3">
              {pdfUrl && (
                <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-blue-200">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Document URL</p>
                    <p className="text-xs text-gray-600 font-bold truncate max-w-md">
                      {pdfUrl}
                    </p>
                  </div>
                  <button
                    onClick={() => window.open(pdfUrl, '_blank')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-2"
                  >
                    <FaExternalLinkAlt /> Open in new tab
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4 sm:p-6 bg-gray-50/50 backdrop-blur-sm sticky bottom-0">
          <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
            
            {/* Close Button - Secondary Style */}
            <button
              type="button"
              onClick={onClose}
              className="order-3 sm:order-1 px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-xl 
                       hover:border-gray-400 hover:bg-white active:scale-95 
                       transition-all duration-200 font-semibold text-sm"
            >
              Close Details
            </button>

            {/* Preview Button - Ghost/Outline Style */}
            <button
              onClick={() => window.open(pdfUrl, '_blank')}
              className="order-2 flex-1 sm:flex-none bg-white text-gray-700 px-6 py-3 rounded-xl border border-gray-200 
                       hover:border-blue-400 hover:text-blue-600 hover:shadow-md active:scale-95 
                       transition-all duration-200 flex items-center justify-center gap-2 font-bold"
            >
              <FaEye className="text-blue-500" />
              <span className="whitespace-nowrap">Preview</span>
            </button>

            <a
              href={pdfUrl}
              download={pdfName || `${title}.pdf`}
              className="order-1 sm:order-3 flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-indigo-700 
                       text-white px-8 py-3 rounded-xl shadow-lg shadow-blue-200 
                       hover:shadow-blue-300 hover:scale-[1.02] active:scale-95 
                       transition-all duration-200 flex items-center justify-center gap-2 font-bold"
            >
              <FaDownload />
              <span className="whitespace-nowrap">Download PDF</span>
            </a>
            
          </div>
        </div>
      </Box>
    </Modal>
  );
}

// Documents Modal Component - UPDATED VERSION with complete fixes
function DocumentsModal({ onClose, onSave, documents, loading }) {
  const fileSizeManager = useFileSize();
  const [currentStep, setCurrentStep] = useState(0);
  
// FIXED: Correct formData initialization that matches API response structure
const [formData, setFormData] = useState(() => {
  // Create a base structure
  const baseFormData = {};
  
  // Define all possible fields with their getters
  const documentFields = [
    // Main documents
    { 
      key: 'curriculumPDF',
      nameField: 'curriculumPdfName',
      sizeField: 'curriculumPdfSize',
      yearField: 'curriculumYear',
      descriptionField: 'curriculumDescription',
      termField: 'curriculumTerm'
    },
    { 
      key: 'feesDayDistributionPdf',
      nameField: 'feesDayPdfName',
      sizeField: 'feesDayPdfSize',
      yearField: 'feesDayYear',
      descriptionField: 'feesDayDescription',
      termField: 'feesDayTerm'
    },
    { 
      key: 'feesBoardingDistributionPdf',
      nameField: 'feesBoardingPdfName',
      sizeField: 'feesBoardingPdfSize',
      yearField: 'feesBoardingYear',
      descriptionField: 'feesBoardingDescription',
      termField: 'feesBoardingTerm'
    },
    { 
      key: 'admissionFeePdf',
      nameField: 'admissionFeePdfName',
      sizeField: 'admissionFeePdfSize',
      yearField: 'admissionFeeYear',
      descriptionField: 'admissionFeeDescription',
      termField: 'admissionFeeTerm'
    },
    // Exam results
    { 
      key: 'form1ResultsPdf',
      nameField: 'form1ResultsPdfName',
      sizeField: 'form1ResultsPdfSize',
      yearField: 'form1ResultsYear',
      descriptionField: 'form1ResultsDescription',
      termField: 'form1ResultsTerm'
    },
    { 
      key: 'form2ResultsPdf',
      nameField: 'form2ResultsPdfName',
      sizeField: 'form2ResultsPdfSize',
      yearField: 'form2ResultsYear',
      descriptionField: 'form2ResultsDescription',
      termField: 'form2ResultsTerm'
    },
    { 
      key: 'form3ResultsPdf',
      nameField: 'form3ResultsPdfName',
      sizeField: 'form3ResultsPdfSize',
      yearField: 'form3ResultsYear',
      descriptionField: 'form3ResultsDescription',
      termField: 'form3ResultsTerm'
    },
    { 
      key: 'form4ResultsPdf',
      nameField: 'form4ResultsPdfName',
      sizeField: 'form4ResultsPdfSize',
      yearField: 'form4ResultsYear',
      descriptionField: 'form4ResultsDescription',
      termField: 'form4ResultsTerm'
    },
    { 
      key: 'mockExamsResultsPdf',
      nameField: 'mockExamsPdfName',
      sizeField: 'mockExamsPdfSize',
      yearField: 'mockExamsYear',
      descriptionField: 'mockExamsDescription',
      termField: 'mockExamsTerm'
    },
    { 
      key: 'kcseResultsPdf',
      nameField: 'kcsePdfName',
      sizeField: 'kcsePdfSize',
      yearField: 'kcseYear',
      descriptionField: 'kcseDescription',
      termField: 'kcseTerm'
    }
  ];

  // Initialize each field properly
  documentFields.forEach(field => {
    if (documents && documents[field.key]) {
      baseFormData[field.key] = {
        file: null, // Will be set if user uploads a new file
        name: documents[field.nameField] || '',
        filename: documents[field.nameField] || '',
        size: documents[field.sizeField] || 0,
        year: documents[field.yearField] || '',
        description: documents[field.descriptionField] || '',
        term: documents[field.termField] || '',
        isExisting: true,
        markedForDeletion: false,
        url: documents[field.key] // Store the actual URL
      };
    } else {
      baseFormData[field.key] = null;
    }
  });

  console.log('FormData initialized from documents:', baseFormData);
  return baseFormData;
});

  // COMPLETE FIX: Preload existing fee breakdowns
  const [feeBreakdowns, setFeeBreakdowns] = useState({
    feesDay: Array.isArray(documents?.feesDayDistributionJson) ? documents.feesDayDistributionJson : [],
    feesBoarding: Array.isArray(documents?.feesBoardingDistributionJson) ? documents.feesBoardingDistributionJson : [],
    admissionFee: Array.isArray(documents?.admissionFeeDistribution) ? documents.admissionFeeDistribution : []
  });

  // COMPLETE FIX: Preload existing exam metadata
  const [examMetadata, setExamMetadata] = useState({
    form1ResultsYear: documents?.form1ResultsYear?.toString() || '',
    form1ResultsTerm: documents?.form1ResultsTerm || '',
    form1ResultsDescription: documents?.form1ResultsDescription || '',
    
    form2ResultsYear: documents?.form2ResultsYear?.toString() || '',
    form2ResultsTerm: documents?.form2ResultsTerm || '',
    form2ResultsDescription: documents?.form2ResultsDescription || '',
    
    form3ResultsYear: documents?.form3ResultsYear?.toString() || '',
    form3ResultsTerm: documents?.form3ResultsTerm || '',
    form3ResultsDescription: documents?.form3ResultsDescription || '',
    
    form4ResultsYear: documents?.form4ResultsYear?.toString() || '',
    form4ResultsTerm: documents?.form4ResultsTerm || '',
    form4ResultsDescription: documents?.form4ResultsDescription || '',
    
    mockExamsYear: documents?.mockExamsYear?.toString() || '',
    mockExamsTerm: documents?.mockExamsTerm || '',
    mockExamsDescription: documents?.mockExamsDescription || '',
    
    kcseYear: documents?.kcseYear?.toString() || '',
    kcseTerm: documents?.kcseTerm || '',
    kcseDescription: documents?.kcseDescription || ''
  });

  const [actionLoading, setActionLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const steps = [
    { 
      id: 'curriculum', 
      label: 'Curriculum', 
      icon: FaBook, 
      description: 'Academic curriculum documents' 
    },
    { 
      id: 'fees', 
      label: 'Fee Structures', 
      icon: FaMoneyBillWave, 
      description: 'Day and boarding fee documents' 
    },
    { 
      id: 'admission', 
      label: 'Admission', 
      icon: FaUserCheck, 
      description: 'Admission fee documents' 
    },
    { 
      id: 'exams', 
      label: 'Exam Results', 
      icon: FaAward, 
      description: 'Academic results documents' 
    },
    { 
      id: 'review', 
      label: 'Review', 
      icon: FaClipboardList, 
      description: 'Review all documents before submission' 
    }
  ];

  useEffect(() => {
    // Reset file size manager when modal opens
    fileSizeManager.reset();
    
    // Initialize file size manager with existing files
    Object.keys(formData).forEach(key => {
      const fileData = formData[key];
      if (fileData && fileData.isExisting && !fileData.markedForDeletion) {
        // Create a dummy file object for size tracking
        const dummyFile = new File([], fileData.name, { 
          type: 'application/pdf',
          lastModified: Date.now()
        });
        Object.defineProperty(dummyFile, 'size', { value: fileData.size || 0 });
        
        const fileId = `existing_${key}_${Date.now()}`;
        fileSizeManager.addFile(dummyFile, fileId);
      }
    });
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await handleSubmitAfterReview();
  };

  const handleSubmitAfterReview = async () => {
    if (!confirmed) {
      toast.error('Please confirm review before submitting');
      return;
    }

    try {
      setActionLoading(true);
      
      const data = new FormData();
      
      // Add all files and metadata
      Object.keys(formData).forEach(key => {
        const fileData = formData[key];
        
        if (!fileData) return;
        
        if (fileData.markedForDeletion) {
          // Mark file for deletion
          data.append(`${key}_delete`, 'true');
        } else if (fileData.file && fileData.file instanceof File) {
          // New file upload or replacement
          data.append(key, fileData.file);
          
          // Add metadata
          if (fileData.year) data.append(`${key}_year`, fileData.year);
          if (fileData.term) data.append(`${key}_term`, fileData.term);
          if (fileData.description) data.append(`${key}_description`, fileData.description);
        } else if (fileData.isExisting && !fileData.markedForDeletion) {
          // Existing file kept - only update metadata if changed
          if (fileData.year) data.append(`${key}_year`, fileData.year);
          if (fileData.term) data.append(`${key}_term`, fileData.term);
          if (fileData.description) data.append(`${key}_description`, fileData.description);
        }
      });
      
      // Add fee breakdowns as JSON
      if (feeBreakdowns.feesDay && feeBreakdowns.feesDay.length > 0) {
        data.append('feesDayDistributionJson', JSON.stringify(feeBreakdowns.feesDay));
      }
      if (feeBreakdowns.feesBoarding && feeBreakdowns.feesBoarding.length > 0) {
        data.append('feesBoardingDistributionJson', JSON.stringify(feeBreakdowns.feesBoarding));
      }
      if (feeBreakdowns.admissionFee && feeBreakdowns.admissionFee.length > 0) {
        data.append('admissionFeeDistribution', JSON.stringify(feeBreakdowns.admissionFee));
      }
      
      // Add exam metadata for all exam PDFs
      Object.keys(examMetadata).forEach(key => {
        if (examMetadata[key] && examMetadata[key].trim() !== '') {
          data.append(key, examMetadata[key]);
        }
      });
      
      // Add school ID if exists
      if (documents?.schoolId) {
        data.append('schoolId', documents.schoolId);
      }
      
      console.log('=== FORM DATA BEING SENT TO BACKEND ===');
      for (let [key, value] of data.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      const response = await fetch('/api/schooldocuments', {
        method: 'POST',
        body: data
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`Failed to save documents: ${response.status}`);
      }

      const result = await response.json();
      
      console.log('Save API response:', result);
      
      if (result.success) {
        toast.success(result.message || 'Documents saved successfully!');
        if (onSave && result.document) {
          onSave(result.document);
        }
        onClose();
      } else {
        toast.error(result.error || 'Failed to save documents');
      }
      
    } catch (error) {
      console.error('Save failed:', error);
      toast.error(error.message || 'Failed to save documents');
    } finally {
      setActionLoading(false);
    }
  };

  // FIXED: Handle file change properly for both new and existing files
  const handleFileChange = (field, file, year, description, term) => {
    if (file instanceof File) {
      // New file upload or replacement
      const fileData = {
        file,
        name: file.name,
        filename: file.name,
        size: file.size,
        year: year || '',
        description: description || '',
        term: term || '',
        isNew: true,
        isExisting: formData[field]?.isExisting || false,
        markedForDeletion: false,
        isReplacement: formData[field]?.isExisting || false
      };
      
      setFormData(prev => ({ 
        ...prev, 
        [field]: fileData 
      }));
    } else if (year || description || term) {
      // Update metadata for existing file
      setFormData(prev => {
        const existing = prev[field];
        if (existing) {
          return {
            ...prev,
            [field]: {
              ...existing,
              year: year || existing.year,
              description: description || existing.description,
              term: term || existing.term
            }
          };
        }
        return prev;
      });
    }
  };

  // FIXED: Handle file removal with proper deletion marking
  const handleFileRemove = (field) => {
    setFormData(prev => {
      const current = prev[field];
      if (!current) return prev;
      
      if (current.isExisting) {
        // Mark existing file for deletion
        return {
          ...prev,
          [field]: {
            ...current,
            markedForDeletion: true,
            file: null
          }
        };
      } else {
        // Remove new file
        return {
          ...prev,
          [field]: null
        };
      }
    });
    
    // Remove from file size manager
    const fileIds = Object.keys(fileSizeManager.uploadedFiles).filter(id => 
      id.includes(field)
    );
    fileIds.forEach(id => fileSizeManager.removeFile(id));
  };

  // FIXED: Cancel existing file replacement
  const handleCancelExisting = (field, existingFile) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        markedForDeletion: false,
        isReplacement: false,
        file: null
      }
    }));
  };

  // FIXED: Remove existing file permanently
  const handleRemoveExisting = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        markedForDeletion: true,
        isReplacement: false,
        file: null
      }
    }));
    
    toast.warning('File marked for deletion. Save to confirm.');
  };

  const handleFeeBreakdownChange = (type, breakdown) => {
    setFeeBreakdowns(prev => ({ ...prev, [type]: breakdown }));
  };

  const handleExamMetadataChange = (field, value) => {
    setExamMetadata(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

const getExistingPdfData = (field) => {
  const fileData = formData[field];
  if (fileData && fileData.isExisting && !fileData.markedForDeletion) {
    return {
      name: fileData.name,
      filename: fileData.filename,
      size: fileData.size,
      year: fileData.year,
      description: fileData.description,
      term: fileData.term,
      isExisting: true,
      url: fileData.url // Add this for viewing existing files
    };
  }
  return null;
};

  // Helper to count total documents
  const countTotalDocuments = () => {
    let count = 0;
    Object.keys(formData).forEach(key => {
      const fileData = formData[key];
      if (fileData && !fileData.markedForDeletion) {
        count++;
      }
    });
    return count;
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 0: // Curriculum
        return (
          <div className="space-y-6">
            <div className="w-full max-w-2xl">
              <ModernPdfUpload
                pdfFile={formData.curriculumPDF?.file || null}
                onPdfChange={(file, year, description, term) => 
                  handleFileChange('curriculumPDF', file, year, description, term)
                }
                onRemove={() => handleFileRemove('curriculumPDF')}
                label="Curriculum PDF"
                required={true}
                existingPdf={getExistingPdfData('curriculumPDF')}
                onCancelExisting={(existingFile) => handleCancelExisting('curriculumPDF', existingFile)}
                onRemoveExisting={() => handleRemoveExisting('curriculumPDF')}
                type="curriculum"
              />
            </div>
          </div>
        );
      
      case 1: // Fee Structures
        return (
          <div className="space-y-8">
            <div className="w-full max-w-2xl">
              <ModernPdfUpload
                pdfFile={formData.feesDayDistributionPdf?.file || null}
                onPdfChange={(file, year, description, term) => 
                  handleFileChange('feesDayDistributionPdf', file, year, description, term)
                }
                onRemove={() => handleFileRemove('feesDayDistributionPdf')}
                label="Day School Fees PDF"
                existingPdf={getExistingPdfData('feesDayDistributionPdf')}
                onCancelExisting={(existingFile) => handleCancelExisting('feesDayDistributionPdf', existingFile)}
                onRemoveExisting={() => handleRemoveExisting('feesDayDistributionPdf')}
                feeBreakdown={feeBreakdowns.feesDay}
                onFeeBreakdownChange={(breakdown) => handleFeeBreakdownChange('feesDay', breakdown)}
                type="day"
              />
            </div>
            
            <div className="w-full max-w-2xl">
              <ModernPdfUpload
                pdfFile={formData.feesBoardingDistributionPdf?.file || null}
                onPdfChange={(file, year, description, term) => 
                  handleFileChange('feesBoardingDistributionPdf', file, year, description, term)
                }
                onRemove={() => handleFileRemove('feesBoardingDistributionPdf')}
                label="Boarding School Fees PDF"
                existingPdf={getExistingPdfData('feesBoardingDistributionPdf')}
                onCancelExisting={(existingFile) => handleCancelExisting('feesBoardingDistributionPdf', existingFile)}
                onRemoveExisting={() => handleRemoveExisting('feesBoardingDistributionPdf')}
                feeBreakdown={feeBreakdowns.feesBoarding}
                onFeeBreakdownChange={(breakdown) => handleFeeBreakdownChange('feesBoarding', breakdown)}
                type="boarding"
              />
            </div>
          </div>
        );
      
      case 2: // Admission
        return (
          <div className="space-y-6">
            <div className="w-full max-w-2xl">
              <ModernPdfUpload
                pdfFile={formData.admissionFeePdf?.file || null}
                onPdfChange={(file, year, description, term) => 
                  handleFileChange('admissionFeePdf', file, year, description, term)
                }
                onRemove={() => handleFileRemove('admissionFeePdf')}
                label="Admission Fee PDF"
                existingPdf={getExistingPdfData('admissionFeePdf')}
                onCancelExisting={(existingFile) => handleCancelExisting('admissionFeePdf', existingFile)}
                onRemoveExisting={() => handleRemoveExisting('admissionFeePdf')}
                feeBreakdown={feeBreakdowns.admissionFee}
                onFeeBreakdownChange={(breakdown) => handleFeeBreakdownChange('admissionFee', breakdown)}
                type="admission"
              />
            </div>
          </div>
        );
      
      case 3: // Exam Results
        return (
          <div className="space-y-8">
            {[
              { key: 'form1Results', label: 'Form 1 Results', field: 'form1ResultsPdf' },
              { key: 'form2Results', label: 'Form 2 Results', field: 'form2ResultsPdf' },
              { key: 'form3Results', label: 'Form 3 Results', field: 'form3ResultsPdf' },
              { key: 'form4Results', label: 'Form 4 Results', field: 'form4ResultsPdf' },
              { key: 'mockExams', label: 'Mock Exams Results', field: 'mockExamsResultsPdf' },
              { key: 'kcse', label: 'KCSE Results', field: 'kcseResultsPdf' }
            ].map((exam) => (
              <div key={exam.key} className="w-full max-w-2xl">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <FaAward className="text-orange-600" />
                    <span className="text-base">{exam.label}</span>
                  </label>
                  
                  {/* Display existing metadata if available */}
                  {getExistingPdfData(exam.field) && (
                    <div className="text-xs text-gray-600 font-bold">
                      {examMetadata[`${exam.key}Year`] && `Year: ${examMetadata[`${exam.key}Year`]}`}
                      {examMetadata[`${exam.key}Term`] && ` • Term: ${examMetadata[`${exam.key}Term`]}`}
                    </div>
                  )}
                </div>
                
                <ModernPdfUpload
                  pdfFile={formData[exam.field]?.file || null}
                  onPdfChange={(file, year, description, term) => {
                    handleFileChange(exam.field, file, year, description, term);
                    if (year || description || term) {
                      if (year) handleExamMetadataChange(`${exam.key}Year`, year);
                      if (term) handleExamMetadataChange(`${exam.key}Term`, term);
                      if (description) handleExamMetadataChange(`${exam.key}Description`, description);
                    }
                  }}
                  onRemove={() => handleFileRemove(exam.field)}
                  label={`${exam.label} PDF`}
                  existingPdf={getExistingPdfData(exam.field)}
                  onCancelExisting={(existingFile) => handleCancelExisting(exam.field, existingFile)}
                  onRemoveExisting={() => handleRemoveExisting(exam.field)}
                  type="results"
                />
              </div>
            ))}
          </div>
        );

      case 4: // Review
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500 text-white rounded-xl">
                  <FaClipboardList className="text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Document Review</h3>
                  <p className="text-sm text-gray-600 font-bold">
                    Review all selected documents before submission
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-blue-200">
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wider mb-1">Total Documents</p>
                  <p className="text-xl font-bold text-blue-700">{countTotalDocuments()}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-blue-200">
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wider mb-1">File Size</p>
                  <p className="text-xl font-bold text-blue-700">{fileSizeManager.getTotalSizeMB()} MB</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-blue-200">
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wider mb-1">Remaining</p>
                  <p className="text-xl font-bold text-blue-700">{fileSizeManager.getRemainingMB()} MB</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <FaList className="text-blue-600" />
                  Document Summary
                </h4>
                
                <div className="space-y-3">
                  {Object.keys(formData).map((key) => {
                    const fileData = formData[key];
                    if (!fileData || fileData.markedForDeletion) return null;
                    
                    const labels = {
                      curriculumPDF: 'Curriculum Document',
                      feesDayDistributionPdf: 'Day School Fees',
                      feesBoardingDistributionPdf: 'Boarding School Fees',
                      admissionFeePdf: 'Admission Fees',
                      form1ResultsPdf: 'Form 1 Results',
                      form2ResultsPdf: 'Form 2 Results',
                      form3ResultsPdf: 'Form 3 Results',
                      form4ResultsPdf: 'Form 4 Results',
                      mockExamsResultsPdf: 'Mock Exams Results',
                      kcseResultsPdf: 'KCSE Results'
                    };
                    
                    return (
                      <div key={key} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-2">
                          {fileData.isExisting ? (
                            <FaCheckCircle className="text-green-500" />
                          ) : (
                            <FaFile className="text-blue-500" />
                          )}
                          <div>
                            <p className="text-sm font-bold text-gray-900">{labels[key] || key}</p>
                            <p className="text-xs text-gray-600">
                              {fileData.filename || fileData.name}
                              {fileData.year && ` • ${fileData.year}`}
                              {fileData.term && ` • ${fileData.term}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-gray-700">
                            {fileData.isExisting ? 'Existing' : 'New Upload'}
                          </p>
                          {fileData.size && (
                            <p className="text-xs text-gray-500">
                              {formatFileSize(fileData.size)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mt-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">
                      I confirm that I have reviewed all documents and they are accurate
                    </p>
                    <p className="text-xs text-gray-600">
                      By checking this box, I confirm that all uploaded documents, metadata, and fee breakdowns are accurate and complete.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '95vw',
        maxWidth: '1000px',
        maxHeight: '95vh',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
        {/* HEADER WITH TOTAL SIZE PROGRESS */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <FaFilePdf className="text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Manage School Documents</h2>
                <p className="text-white/90 text-sm mt-1 font-bold">
                  Step {currentStep + 1} of {steps.length}: {steps[currentStep].description}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200">
              <FaTimes className="text-lg" />
            </button>
          </div>
          
          {/* File Size Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Total Size: {fileSizeManager.getTotalSizeMB()} MB / {fileSizeManager.getMaxSizeMB()} MB</span>
              <span>{fileSizeManager.getPercentage().toFixed(0)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${fileSizeManager.getPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(index)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 text-sm font-bold ${
                    index === currentStep 
                      ? 'bg-blue-500 text-white shadow-lg scale-105' 
                      : index < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <step.icon className="text-xs" />
                  <span className="font-bold hidden sm:inline">{step.label}</span>
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

        <div className="max-h-[calc(95vh-280px)] overflow-y-auto scrollbar-custom p-6">
          <form onSubmit={handleFormSubmit} className="space-y-8">
            {renderStepContent()}

            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-200 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 font-bold">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="font-bold">Step {currentStep + 1} of {steps.length}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {currentStep > 0 && (
                  <button 
                    type="button"
                    onClick={handlePrevStep}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition duration-200 font-bold w-full sm:w-auto"
                  >
                    ← Previous
                  </button>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <button 
                    type="button"
                    onClick={handleNextStep}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition duration-200 font-bold shadow flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    Continue →
                  </button>
                ) : (
                  <button 
                    type="submit"
                    disabled={actionLoading || !confirmed}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition duration-200 font-bold shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    {actionLoading ? (
                      <>
                        <CircularProgress size={16} className="text-white" />
                        <span>Saving Documents...</span>
                      </>
                    ) : (
                      <>
                        <FaSave className="text-sm" />
                        <span>Save All Documents</span>
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


// Helper functions for file display


const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Main School Documents Page Component with Complete CRUD
export default function SchoolDocumentsPage() {
  const [documents, setDocuments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

const loadData = async () => {
  try {
    setLoading(true);
    const docsResponse = await fetch(`/api/schooldocuments`);
    
    console.log('Response status:', docsResponse.status);
    console.log('Response headers:', Object.fromEntries(docsResponse.headers.entries()));
    
    // First, get the response as text to debug
    const responseText = await docsResponse.text();
    console.log('Raw response:', responseText.substring(0, 200)); // First 200 chars
    
    // Check if response is HTML
    if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
      console.error('API returned HTML instead of JSON. API route might not exist.');
      setDocuments(null);
      return;
    }
    
    // Try to parse as JSON
    const docsData = JSON.parse(responseText);
    
    if (docsData.success && docsData.document) {
      setDocuments(docsData.document);
    } else if (docsData.success && docsData) {
      setDocuments(docsData);
    } else {
      setDocuments(null);
    }
  } catch (error) {
    console.error('Error loading data:', error);
    setDocuments(null);
  } finally {
    setLoading(false);
  }
};

  const handleDeleteDocument = async () => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/schooldocuments${documents?.id ? `?id=${documents.id}` : ''}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      const result = await response.json();
      toast.success(result.message || 'Document deleted successfully');
      setDeleteDialogOpen(false);
      await loadData();
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error(error.message || 'Failed to delete document');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveDocuments = async (documentData) => {
    try {
      setActionLoading(true);
      toast.success('Documents saved successfully!');
      setShowModal(false);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to save documents');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <ModernLoadingSpinner message="Loading school documents..." size="medium" />;
  }

const hasDocuments = documents && (
  documents.curriculumPDF ||
  documents.feesDayDistributionPdf ||
  documents.feesBoardingDistributionPdf ||
  documents.admissionFeePdf ||
  documents.form1ResultsPdf ||
  documents.form2ResultsPdf ||
  documents.form3ResultsPdf ||
  documents.form4ResultsPdf ||
  documents.mockExamsResultsPdf ||
  documents.kcseResultsPdf
);

  return (
    <FileSizeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 md:p-6">
        <Toaster position="top-right" richColors />
        
        {/* MODERN HEADER WITH INTEGRATED ACTIONS */}
        <div className="relative bg-gradient-to-br from-[#1e40af] via-[#7c3aed] to-[#2563eb] rounded-[2.5rem] shadow-[0_20px_50px_rgba(31,38,135,0.37)] p-6 md:p-10 mb-10 border border-white/20 overflow-hidden transition-all duration-500">
          {/* Decorative Background Elements */}
          <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-5%] w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md ring-1 ring-white/40 shadow-inner group transition-all duration-500 hover:bg-white/20">
                  <FaFilePdf className="text-white text-3xl group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-md border border-emerald-400/30 backdrop-blur-md">
                      Document Management
                    </span>
                    <FaShieldAlt className="text-blue-300 text-[10px]" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tighter drop-shadow-sm">
                    School Documents
                  </h1>
                </div>
              </div>
              
              <p className="text-blue-50/80 text-sm md:text-lg font-medium max-w-2xl leading-relaxed">
                Manage all school documents including curriculum, dynamic fee structures, admission forms, and exam results.
              </p>
            </div>

            {/* ACTION BUTTON GROUP */}
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              
              {/* 1. REFRESH BUTTON (Always Visible) */}
              <button 
                onClick={loadData} 
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-5 py-2.5 rounded-xl transition-all duration-200 font-bold text-sm shadow-lg active:scale-95 disabled:opacity-50"
              >
                {loading ? <CircularProgress size={14} color="inherit" /> : <FaSync className="text-xs" />}
                <span>{loading ? 'Syncing...' : 'Refresh'}</span>
              </button>

              {/* 2. UPLOAD/EDIT BUTTON (Conditional Style) */}
              <button 
                onClick={() => setShowModal(true)} 
                className="flex items-center justify-center gap-2 bg-white text-blue-600 px-6 py-2.5 rounded-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-200 font-bold text-sm shadow-lg active:scale-95"
              >
                {hasDocuments ? <FaPencilAlt className="text-xs" /> : <FaUpload className="text-xs" />}
                <span>{hasDocuments ? 'Edit Documents' : 'Upload Documents'}</span>
              </button>

              {/* 3. DELETE BUTTON (ONLY IF DOCUMENTS EXIST) */}
              {hasDocuments && (
                <button 
                  onClick={() => setDeleteDialogOpen(true)} 
                  className="group flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500 backdrop-blur-md text-red-200 hover:text-white border border-red-500/30 px-5 py-2.5 rounded-xl transition-all duration-300 font-bold text-sm shadow-lg active:scale-95"
                >
                  <FaTrash className="text-xs group-hover:animate-bounce" />
                  <span>Delete All</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {!hasDocuments ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center my-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-blue-200">
              <FaFilePdf className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No School Documents Yet</h3>
            <p className="text-gray-600 text-base mb-6 max-w-md mx-auto font-bold">
              Start by uploading school documents to showcase your institution's curriculum, fee structures, and academic results
            </p>
            <button 
              onClick={() => setShowModal(true)} 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition duration-200 font-bold shadow-lg flex items-center gap-3 mx-auto text-base"
            >
              <FaUpload className="text-lg" /> 
              <span>Upload School Documents</span>
            </button>
          </div>
        ) : (
          // GRID LAYOUT FOR DOCUMENT CARDS
          <div className="my-6">
            {/* Document Categories Header (Optional) */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">School Documents</h2>
                <p className="text-gray-600 font-bold mt-1">Manage all your school documents in one place</p>
              </div>
              <button 
                onClick={() => setShowModal(true)} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition duration-200 font-bold shadow-lg flex items-center gap-2 text-sm"
              >
                <FaPlus className="text-sm" /> 
                <span>Add New Document</span>
              </button>
            </div>

            {/* GRID CONTAINER */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* CURRICULUM DOCUMENT */}
              {documents.curriculumPDF && (
                <ModernDocumentCard
                  title="Curriculum Document"
                  description="Official school curriculum and syllabus"
                  pdfUrl={documents.curriculumPDF}
                  pdfName={documents.curriculumPdfName || "curriculum.pdf"}
                  year={documents.curriculumYear}
                  type="curriculum"
                  fileSize={documents.curriculumPdfSize}
                  uploadDate={documents.curriculumUploadDate}
                  existing={true}
                  onReplace={() => setShowModal(true)}
                  onRemove={() => {
                    if (confirm("Remove curriculum document?")) {
                      // Handle removal
                    }
                  }}
                />
              )}
              
              {/* DAY SCHOOL FEES DOCUMENT */}
              {documents.feesDayDistributionPdf && (
                <ModernDocumentCard
                  title="Day School Fee Structure"
                  description="Day school fees breakdown and payment terms"
                  pdfUrl={documents.feesDayDistributionPdf}
                  pdfName={documents.feesDayPdfName || "day-fees.pdf"}
                  year={documents.feesDayYear}
                  term={documents.feesDayTerm}
                  feeBreakdown={documents.feesDayDistributionJson || []}
                  type="day"
                  fileSize={documents.feesDayPdfSize}
                  uploadDate={documents.feesDayUploadDate}
                  existing={true}
                  onReplace={() => setShowModal(true)}
                  onRemove={() => {
                    if (confirm("Remove day school fees document?")) {
                      // Handle removal
                    }
                  }}
                />
              )}
              
              {/* BOARDING SCHOOL FEES DOCUMENT */}
              {documents.feesBoardingDistributionPdf && (
                <ModernDocumentCard
                  title="Boarding School Fee Structure"
                  description="Boarding school fees including accommodation"
                  pdfUrl={documents.feesBoardingDistributionPdf}
                  pdfName={documents.feesBoardingPdfName || "boarding-fees.pdf"}
                  year={documents.feesBoardingYear}
                  term={documents.feesBoardingTerm}
                  feeBreakdown={documents.feesBoardingDistributionJson || []}
                  type="boarding"
                  fileSize={documents.feesBoardingPdfSize}
                  uploadDate={documents.feesBoardingUploadDate}
                  existing={true}
                  onReplace={() => setShowModal(true)}
                  onRemove={() => {
                    if (confirm("Remove boarding fees document?")) {
                      // Handle removal
                    }
                  }}
                />
              )}
              
              {/* ADMISSION FEES DOCUMENT */}
              {documents.admissionFeePdf && (
                <ModernDocumentCard
                  title="Admission Fees"
                  description="Admission and registration fees structure"
                  pdfUrl={documents.admissionFeePdf}
                  pdfName={documents.admissionFeePdfName || "admission-fees.pdf"}
                  year={documents.admissionFeeYear}
                  term={documents.admissionFeeTerm}
                  admissionBreakdown={documents.admissionFeeDistribution || []}
                  type="admission"
                  fileSize={documents.admissionFeePdfSize}
                  uploadDate={documents.admissionFeeUploadDate}
                  existing={true}
                  onReplace={() => setShowModal(true)}
                  onRemove={() => {
                    if (confirm("Remove admission fees document?")) {
                      // Handle removal
                    }
                  }}
                />
              )}
              
              {/* EXAM RESULTS DOCUMENTS */}
              {/* Form 1 Results */}
              {documents.form1ResultsPdf && (
                <ModernDocumentCard
                  title="Form 1 Results"
                  description={documents.form1ResultsDescription || "Form 1 examination results"}
                  pdfUrl={documents.form1ResultsPdf}
                  pdfName={documents.form1ResultsPdfName || "form1-results.pdf"}
                  year={documents.form1ResultsYear}
                  term={documents.form1ResultsTerm}
                  type="results"
                  fileSize={documents.form1ResultsPdfSize}
                  uploadDate={documents.form1ResultsUploadDate}
                  existing={true}
                  onReplace={() => setShowModal(true)}
                  onRemove={() => {
                    if (confirm("Remove Form 1 results?")) {
                      // Handle removal
                    }
                  }}
                />
              )}
              
              {/* Form 2 Results */}
              {documents.form2ResultsPdf && (
                <ModernDocumentCard
                  title="Form 2 Results"
                  description={documents.form2ResultsDescription || "Form 2 examination results"}
                  pdfUrl={documents.form2ResultsPdf}
                  pdfName={documents.form2ResultsPdfName || "form2-results.pdf"}
                  year={documents.form2ResultsYear}
                  term={documents.form2ResultsTerm}
                  type="results"
                  fileSize={documents.form2ResultsPdfSize}
                  uploadDate={documents.form2ResultsUploadDate}
                  existing={true}
                  onReplace={() => setShowModal(true)}
                  onRemove={() => {
                    if (confirm("Remove Form 2 results?")) {
                      // Handle removal
                    }
                  }}
                />
              )}
              
              {/* Form 3 Results */}
              {documents.form3ResultsPdf && (
                <ModernDocumentCard
                  title="Form 3 Results"
                  description={documents.form3ResultsDescription || "Form 3 examination results"}
                  pdfUrl={documents.form3ResultsPdf}
                  pdfName={documents.form3ResultsPdfName || "form3-results.pdf"}
                  year={documents.form3ResultsYear}
                  term={documents.form3ResultsTerm}
                  type="results"
                  fileSize={documents.form3ResultsPdfSize}
                  uploadDate={documents.form3ResultsUploadDate}
                  existing={true}
                  onReplace={() => setShowModal(true)}
                  onRemove={() => {
                    if (confirm("Remove Form 3 results?")) {
                      // Handle removal
                    }
                  }}
                />
              )}
              
              {/* Form 4 Results */}
              {documents.form4ResultsPdf && (
                <ModernDocumentCard
                  title="Form 4 Results"
                  description={documents.form4ResultsDescription || "Form 4 examination results"}
                  pdfUrl={documents.form4ResultsPdf}
                  pdfName={documents.form4ResultsPdfName || "form4-results.pdf"}
                  year={documents.form4ResultsYear}
                  term={documents.form4ResultsTerm}
                  type="results"
                  fileSize={documents.form4ResultsPdfSize}
                  uploadDate={documents.form4ResultsUploadDate}
                  existing={true}
                  onReplace={() => setShowModal(true)}
                  onRemove={() => {
                    if (confirm("Remove Form 4 results?")) {
                      // Handle removal
                    }
                  }}
                />
              )}
              
              {/* Mock Exams Results */}
              {documents.mockExamsResultsPdf && (
                <ModernDocumentCard
                  title="Mock Exams Results"
                  description={documents.mockExamsDescription || "Mock examination results"}
                  pdfUrl={documents.mockExamsResultsPdf}
                  pdfName={documents.mockExamsPdfName || "mock-exams-results.pdf"}
                  year={documents.mockExamsYear}
                  term={documents.mockExamsTerm}
                  type="results"
                  fileSize={documents.mockExamsPdfSize}
                  uploadDate={documents.mockExamsUploadDate}
                  existing={true}
                  onReplace={() => setShowModal(true)}
                  onRemove={() => {
                    if (confirm("Remove mock exams results?")) {
                      // Handle removal
                    }
                  }}
                />
              )}
              
              {/* KCSE Results */}
              {documents.kcseResultsPdf && (
                <ModernDocumentCard
                  title="KCSE Results"
                  description={documents.kcseDescription || "KCSE examination results"}
                  pdfUrl={documents.kcseResultsPdf}
                  pdfName={documents.kcsePdfName || "kcse-results.pdf"}
                  year={documents.kcseYear}
                  term={documents.kcseTerm}
                  type="results"
                  fileSize={documents.kcsePdfSize}
                  uploadDate={documents.kcseUploadDate}
                  existing={true}
                  onReplace={() => setShowModal(true)}
                  onRemove={() => {
                    if (confirm("Remove KCSE results?")) {
                      // Handle removal
                    }
                  }}
                />
              )}
            </div>

{/* REMOVE THIS ENTIRE SECTION */}
{documents.additionalDocuments && documents.additionalDocuments.length > 0 && (
  <div className="mt-8">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-bold text-gray-900">Additional Documents</h3>
      <span className="text-sm text-gray-500 font-bold">
        {documents.additionalDocuments.length} document{documents.additionalDocuments.length !== 1 ? 's' : ''}
      </span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.additionalDocuments.map((doc, index) => (
        <ModernDocumentCard
          key={doc.id || index}
          title={doc.filename || `Document ${index + 1}`}
          description={doc.description || "Additional school document"}
          pdfUrl={doc.filepath}
          pdfName={doc.filename}
          year={doc.year}
          term={doc.term}
          type="additional"
          fileSize={doc.filesize}
          uploadDate={doc.uploadDate}
          existing={true}
          onReplace={() => setShowModal(true)}
          onRemove={() => {
            if (confirm("Remove this document?")) {
              // Handle removal
            }
          }}
        />
      ))}
    </div>
  </div>
)}
            {/* EMPTY STATE IF NO DOCUMENTS IN GRID (edge case) */}
            {!documents.curriculumPDF && 
             !documents.feesDayDistributionPdf && 
             !documents.feesBoardingDistributionPdf && 
             !documents.admissionFeePdf && 
             !documents.form1ResultsPdf && 
             !documents.form2ResultsPdf && 
             !documents.form3ResultsPdf && 
             !documents.form4ResultsPdf && 
             !documents.mockExamsResultsPdf && 
             !documents.kcseResultsPdf && 
             (!documents.additionalDocuments || documents.additionalDocuments.length === 0) && (
<div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-12 text-center transition-all duration-300 hover:shadow-2xl">
  <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-blue-50 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-inner">
    <FaFile className="w-8 h-8 md:w-12 md:h-12 text-blue-400/80" />
  </div>

  {/* Text Content */}
  <h3 className="text-lg md:text-2xl font-black text-gray-800 mb-3 tracking-tight">
    No Documents Found
  </h3>
  
  <p className="text-gray-500 text-xs md:text-base mb-8 max-w-[250px] md:max-w-md mx-auto font-medium leading-relaxed">
    Add documents to showcase your school's information and keep your resources organized.
  </p>

  {/* Action Button - Full width on mobile, auto width on desktop */}
  <button 
    onClick={() => setShowModal(true)} 
    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl 
               hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.03] active:scale-95 
               transition-all duration-200 font-bold shadow-blue-200 shadow-lg 
               flex items-center justify-center gap-3 mx-auto text-sm md:text-base"
  >
    <FaUpload className="text-lg" /> 
    <span>Upload Documents</span>
  </button>
</div>
            )}
          </div>
        )}

        <Dialog 
          open={deleteDialogOpen} 
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            className: "rounded-2xl p-0 w-[95vw] max-w-sm shadow-2xl overflow-hidden border border-gray-300 mx-auto" 
          }}
        >
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-red-600 to-orange-500 p-5 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/25 rounded-xl backdrop-blur-sm shrink-0">
                <FaExclamationTriangle className="text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Confirm Deletion</h2>
                <p className="text-red-100 text-sm font-semibold mt-0.5">
                  This action is permanent and cannot be undone
                </p>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-5 space-y-5 max-h-[65vh] overflow-y-auto">
            {/* Main Warning */}
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-red-300">
                <FaTrash className="text-red-700 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Delete All School Documents?
              </h3>
              <p className="text-red-600 text-sm font-semibold">
                You are about to permanently delete all uploaded documents
              </p>
            </div>

            {/* Data Loss Details */}
            <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
              <div className="mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                  <p className="text-sm font-bold text-red-800">
                    Permanent data loss includes:
                  </p>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  'All curriculum documents and syllabi',
                  'Complete fee structures (day & boarding)',
                  'Admission fee breakdowns and policies',
                  'All examination results and reports',
                  'Additional school documents and files',
                  'Upload history and file metadata'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></div>
                    <span className="text-sm text-gray-800 font-medium leading-snug">
                      <span className="font-bold">{item}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirmation Input */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-gray-800">
                  Type to confirm deletion:
                </label>
                <span className="text-red-700 font-bold text-sm select-none bg-red-100 px-2 py-0.5 rounded">
                  "DELETE"
                </span>
              </div>
              <input 
                type="text" 
                value={confirmText} 
                onChange={(e) => setConfirmText(e.target.value)} 
                placeholder='Type "DELETE" here...'
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-base font-medium placeholder-gray-400"
                autoFocus
              />
              <p className="text-xs text-gray-500 font-medium text-center">
                This prevents accidental deletion of important documents
              </p>
            </div>

            {/* Final Warning */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 border-2 border-amber-300 rounded-xl">
              <FaExclamationCircle className="text-amber-700 shrink-0 text-base mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-900 mb-1">
                  Important Warning
                </p>
                <p className="text-xs text-amber-800 font-medium leading-tight">
                  No backup copies are maintained. Once deleted, all document data will be permanently removed from the system with no recovery options available.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 p-5 bg-gray-50 border-t-2 border-gray-300">
            <button 
              onClick={() => {
                setDeleteDialogOpen(false);
                setConfirmText('');
              }}
              disabled={actionLoading}
              className="order-2 sm:order-1 flex-1 px-5 py-3 border-2 border-gray-400 text-gray-800 rounded-xl hover:bg-white hover:border-gray-500 transition font-bold text-sm"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                if (confirmText === "DELETE") {
                  handleDeleteDocument();
                } else {
                  toast.error('Please type "DELETE" exactly to confirm deletion');
                }
              }}
              disabled={actionLoading || confirmText !== "DELETE"}
              className="order-1 sm:order-2 flex-1 px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {actionLoading ? (
                <>
                  <CircularProgress size={16} color="inherit" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <FaTrash className="text-sm" />
                  <span>Delete Permanently</span>
                </>
              )}
            </button>
          </div>
        </Dialog>

        {showModal && (
          <DocumentsModal 
            onClose={() => setShowModal(false)} 
            onSave={handleSaveDocuments}
            documents={documents}
            loading={actionLoading}
          />
        )}
      </div>
    </FileSizeProvider>
  );
}

// CSS for custom scrollbar
const customScrollbarStyles = `
  .scrollbar-custom::-webkit-scrollbar {
    width: 8px;
  }
  .scrollbar-custom::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  .scrollbar-custom::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  .scrollbar-custom::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

// Add custom styles to head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = customScrollbarStyles;
  document.head.appendChild(style);
}