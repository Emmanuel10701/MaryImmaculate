'use client';

import { useState, useEffect, useMemo } from 'react';
import { toast, Toaster } from 'sonner';
import { 
  FiPlus, 
  FiSearch, 
  FiFilter,
  FiEdit3,
  FiTrash2,
  FiBook,
  FiBarChart2,
  FiUser,
  FiUsers,
  FiAlertTriangle,
  FiMessageCircle,
  FiClock,
  FiCalendar,
  FiSave,
  FiX,
  FiImage,
  FiUpload,
  FiRotateCw,
  FiEye,
  FiChevronRight,
  FiCheck
} from 'react-icons/fi';

// Modern Modal Component
const ModernModal = ({ children, open, onClose, maxWidth = '700px' }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden"
        style={{ 
          width: '85%',
          maxWidth: maxWidth,
          maxHeight: '85vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Modern Card Component
const CounselingEventCard = ({ event, onEdit, onDelete, onView, index }) => {
  const [imageError, setImageError] = useState(false);

  const getPriorityColor = (priority) => {
    const colors = {
      High: 'from-red-500 to-rose-500',
      Medium: 'from-amber-500 to-orange-500',
      Low: 'from-emerald-500 to-green-500'
    };
    return colors[priority] || 'from-gray-500 to-gray-600';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Drugs: <FiAlertTriangle className="text-red-500" />,
      Relationships: <FiUsers className="text-pink-500" />,
      Worship: <FiUser className="text-purple-500" />,
      Discipline: <FiBarChart2 className="text-orange-500" />,
      Academics: <FiBook className="text-blue-500" />,
    };
    return icons[category] || <FiMessageCircle className="text-gray-500" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      Drugs: 'bg-red-100 text-red-800 border-red-200',
      Relationships: 'bg-pink-100 text-pink-800 border-pink-200',
      Worship: 'bg-purple-100 text-purple-800 border-purple-200',
      Discipline: 'bg-orange-100 text-orange-800 border-orange-200',
      Academics: 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 overflow-hidden transition-all duration-300 cursor-pointer">
      {/* Image Section */}
      {event?.image && !imageError ? (
        <div className="relative h-40 overflow-hidden">
          <img
            src={event.image}
            alt={`Counseling session with ${event.counselor}`}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
          <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getPriorityColor(event.priority)}`}>
              {event.priority}
            </span>
          </div>
        </div>
      ) : (
        <div className="relative h-24 bg-gradient-to-r from-blue-500 to-cyan-500">
          <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getPriorityColor(event?.priority)}`}>
              {event?.priority}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 text-white">
            <h3 className="font-bold text-sm">{event?.counselor}</h3>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border mb-3 ${getCategoryColor(event?.category)}`}>
          {getCategoryIcon(event?.category)}
          {event?.category || 'General'}
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-3 min-h-10 text-sm leading-relaxed font-medium">
          {event?.description?.length > 60 ? event.description.substring(0, 60) + '...' : event?.description}
        </p>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <FiCalendar className="text-gray-400 flex-shrink-0" />
            <span className="truncate">
              {event?.date ? new Date(event.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              }) : 'No date'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <FiClock className="text-gray-400 flex-shrink-0" />
            <span>{event?.time || 'No time'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <FiUser className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{event?.counselor || 'Not specified'}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            className="p-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full transition-colors"
            title="View Details"
          >
            <FiEye className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full transition-colors"
            title="Edit"
          >
            <FiEdit3 className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full transition-colors"
            title="Delete"
          >
            <FiTrash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Loading spinner
const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
  </div>
);

// Enhanced Edit Dialog
const GuidanceEditDialog = ({ event, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    counselor: '',
    category: 'Academics',
    description: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    type: 'Guidance',
    priority: 'Medium'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (event) {
      setFormData({
        counselor: event.counselor || '',
        category: event.category || 'Academics',
        description: event.description || '',
        notes: event.notes || '',
        date: event.date ? new Date(event.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        time: event.time || '09:00',
        type: event.type || 'Guidance',
        priority: event.priority || 'Medium'
      });
      if (event.image) {
        setImagePreview(event.image);
      }
    }
  }, [event]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      toast.success('Image selected successfully');
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setImageFile(null);
  };

  const handleSave = async () => {
    if (!formData.counselor.trim()) {
      toast.error('Please enter counselor name');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter session description');
      return;
    }

    setIsSaving(true);
    try {
      const submitData = new FormData();
      
      submitData.append('counselor', formData.counselor);
      submitData.append('category', formData.category);
      submitData.append('description', formData.description);
      submitData.append('notes', formData.notes);
      submitData.append('date', formData.date);
      submitData.append('time', formData.time);
      submitData.append('type', formData.type);
      submitData.append('priority', formData.priority);

      if (imageFile) {
        submitData.append('image', imageFile);
      }

      let url = '/api/guidance';
      let method = 'POST';

      if (event?.id) {
        url = `/api/guidance/${event.id}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method: method,
        body: submitData,
      });

      const result = await response.json();
      if (result.success) {
        toast.success(event ? 'Session updated successfully!' : 'Session created successfully!');
        onSave();
      } else {
        throw new Error(result.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ModernModal open={true} onClose={onCancel}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
              <FiUser className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{event ? 'Edit' : 'Create'} Counseling Session</h2>
            </div>
          </div>
          <button onClick={onCancel} className="p-1 rounded-lg cursor-pointer">
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[calc(85vh-150px)] overflow-y-auto">
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="p-4 space-y-4">
          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Session Image
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiImage className="text-gray-400 text-xl" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl transition-all duration-200 flex items-center gap-2">
                    <FiUpload className="text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {imageFile ? 'Change Image' : 'Upload Image'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  </div>
                </label>
                {imageFile && (
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-xs text-emerald-600 font-medium">
                      ✓ {imageFile.name}
                    </p>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="text-xs text-rose-600 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Counselor Name *
              </label>
              <input
                type="text"
                required
                value={formData.counselor}
                onChange={(e) => updateField('counselor', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm"
                placeholder="Enter counselor name"
                disabled={isSaving}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm cursor-pointer"
                disabled={isSaving}
              >
                <option value="Academics">📚 Academics</option>
                <option value="Drugs">🚫 Drugs</option>
                <option value="Relationships">💕 Relationships</option>
                <option value="Worship">🙏 Worship</option>
                <option value="Discipline">⚖️ Discipline</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Type *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => updateField('type', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm cursor-pointer"
                disabled={isSaving}
              >
                <option value="Guidance">💬 Guidance</option>
                <option value="Counseling">🧠 Counseling</option>
                <option value="Group Session">👥 Group Session</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => updateField('date', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm"
                disabled={isSaving}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Time *
              </label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => updateField('time', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm"
                disabled={isSaving}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Priority *
              </label>
              <select
                required
                value={formData.priority}
                onChange={(e) => updateField('priority', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm cursor-pointer"
                disabled={isSaving}
              >
                <option value="Low">💚 Low</option>
                <option value="Medium">💛 Medium</option>
                <option value="High">🧡 High</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows="3"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm resize-none"
                placeholder="Describe the counseling session..."
                disabled={isSaving}
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                rows="3"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm resize-none"
                placeholder="Any additional notes..."
                disabled={isSaving}
              />
            </div>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg transition-all duration-200 font-medium disabled:opacity-50"
          >
            <span className="text-sm">Cancel</span>
          </button>
          <button
            type="submit"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-2.5 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span className="text-sm">Processing...</span>
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4" />
                <span className="text-sm">{event ? 'Update Session' : 'Create Session'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </ModernModal>
  );
};

// View Modal Component
const ViewEventModal = ({ event, onClose, onEdit }) => {
  if (!event) return null;

  const getCategoryIcon = (category) => {
    const icons = {
      Drugs: <FiAlertTriangle className="text-red-500" />,
      Relationships: <FiUsers className="text-pink-500" />,
      Worship: <FiUser className="text-purple-500" />,
      Discipline: <FiBarChart2 className="text-orange-500" />,
      Academics: <FiBook className="text-blue-500" />,
    };
    return icons[category] || <FiMessageCircle className="text-gray-500" />;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      High: 'from-red-500 to-rose-500',
      Medium: 'from-amber-500 to-orange-500',
      Low: 'from-emerald-500 to-green-500'
    };
    return colors[priority] || 'from-gray-500 to-gray-600';
  };

  return (
    <ModernModal open={true} onClose={onClose}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-700 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
              <FiUser className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Session Details</h2>
              <p className="text-blue-100 opacity-90 text-sm">
                {event?.counselor || 'No counselor'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg cursor-pointer">
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[calc(85vh-150px)] overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Image */}
          {event.image && (
            <div className="relative h-48 rounded-lg overflow-hidden">
              <img
                src={event.image}
                alt={`Counseling session with ${event.counselor}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <FiUser className="text-blue-500" />
              <div>
                <p className="text-xs text-blue-600 font-medium">Counselor</p>
                <p className="text-sm font-bold text-gray-800">{event.counselor}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
              {getCategoryIcon(event.category)}
              <div>
                <p className="text-xs text-purple-600 font-medium">Category</p>
                <p className="text-sm font-bold text-gray-800">{event.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg">
              <FiCalendar className="text-emerald-500" />
              <div>
                <p className="text-xs text-emerald-600 font-medium">Date</p>
                <p className="text-sm font-bold text-gray-800">
                  {new Date(event.date).toLocaleDateString('en-US', { 
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
              <FiClock className="text-amber-500" />
              <div>
                <p className="text-xs text-amber-600 font-medium">Time</p>
                <p className="text-sm font-bold text-gray-800">{event.time}</p>
              </div>
            </div>
          </div>

          {/* Priority and Type */}
          <div className="flex gap-3">
            <div className="flex-1 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 font-medium">Session Type</p>
              <p className="text-sm font-bold text-gray-800">{event.type}</p>
            </div>
            <div className="flex-1 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 font-medium">Priority</p>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getPriorityColor(event.priority)}`}>
                {event.priority}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
              {event.description}
            </p>
          </div>

          {/* Notes */}
          {event.notes && (
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-2">Notes</h3>
              <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                {event.notes}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500">Created</p>
              <p className="text-xs font-medium text-gray-700">
                {new Date(event.createdAt).toLocaleDateString()} at {new Date(event.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Updated</p>
              <p className="text-xs font-medium text-gray-700">
                {new Date(event.updatedAt).toLocaleDateString()} at {new Date(event.updatedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg transition-all duration-200 font-medium"
          >
            <span className="text-sm">Close</span>
          </button>
          <button
            onClick={onEdit}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2.5 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            <FiEdit3 className="w-4 h-4" />
            <span className="text-sm">Edit Session</span>
          </button>
        </div>
      </div>
    </ModernModal>
  );
};

// Main Component
export default function GuidanceCounselingTab() {
  const [events, setEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch events from API
  const fetchEvents = async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const response = await fetch('/api/guidance');
      const result = await response.json();
      
      if (result.success) {
        setEvents(result.events || []);
        if (showRefresh) {
          toast.success('Data refreshed successfully!');
        }
      } else {
        throw new Error(result.error || 'Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load counseling sessions');
      setEvents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleNewEvent = () => {
    setCurrentEvent(null);
    setIsEditing(true);
  };

  const handleEdit = (event) => {
    setCurrentEvent(event);
    setIsEditing(true);
  };

  const handleView = (event) => {
    setCurrentEvent(event);
    setIsViewing(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this counseling session? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/guidance/${id}`, {
          method: 'DELETE' 
        });
        const result = await response.json();
        if (result.success) {
          await fetchEvents();
          toast.success('Counseling session deleted successfully!');
        } else {
          toast.error(result.error || 'Error deleting session');
        }
      } catch (error) {
        toast.error('Error deleting session');
      }
    }
  };

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (!event) return false;
      
      const matchesSearch = 
        (event.counselor?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (event.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (event.notes?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (event.category?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
      const matchesPriority = filterPriority === 'all' || event.priority === filterPriority;
      
      return matchesSearch && matchesCategory && matchesPriority;
    });
  }, [events, searchTerm, filterCategory, filterPriority]);

  // Stats for the header
  const stats = {
    total: events.length,
    high: events.filter(e => e?.priority === 'High').length,
    today: events.filter(e => {
      if (!e?.date) return false;
      const eventDate = new Date(e.date);
      const today = new Date();
      return eventDate.toDateString() === today.toDateString();
    }).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/20 flex items-center justify-center p-4">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-gray-600 text-sm mt-3 font-medium">Loading Counseling Sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/20 p-4 md:p-6">
      <Toaster position="top-right" richColors />
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="mb-4 lg:mb-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <FiMessageCircle className="text-white text-lg w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
                  Guidance & Counseling
                </h1>
                <p className="text-gray-600 mt-1">Manage student counseling sessions</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 md:gap-3 flex-wrap">
            <button
              onClick={() => fetchEvents(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 bg-white text-gray-700 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all duration-200 shadow-xs border border-gray-200 font-medium disabled:opacity-50 text-sm md:text-base"
            >
              <FiRotateCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={handleNewEvent}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all duration-200 shadow-lg font-medium text-sm md:text-base"
            >
              <FiPlus className="w-4 h-4" />
              Create Session
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">Total Sessions</p>
                <p className="text-lg md:text-xl font-bold text-gray-900 mb-1">{stats.total}</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <FiMessageCircle className="text-purple-600 text-base w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">High Priority</p>
                <p className="text-lg md:text-xl font-bold text-gray-900 mb-1">{stats.high}</p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <FiAlertTriangle className="text-red-600 text-base w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">Today</p>
                <p className="text-lg md:text-xl font-bold text-gray-900 mb-1">{stats.today}</p>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <FiCalendar className="text-emerald-600 text-base w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">View Mode</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`text-xs px-2 py-1 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`text-xs px-2 py-1 rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    List
                  </button>
                </div>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <FiBarChart2 className="text-gray-600 text-base w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 md:gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search counseling sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="Academics">Academics</option>
                <option value="Drugs">Drugs</option>
                <option value="Relationships">Relationships</option>
                <option value="Worship">Worship</option>
                <option value="Discipline">Discipline</option>
              </select>
              
              <select 
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm cursor-pointer"
              >
                <option value="all">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('all');
                  setFilterPriority('all');
                }}
                className="inline-flex items-center gap-2 px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-lg transition-all duration-200 text-sm font-medium text-gray-700"
              >
                <FiFilter className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <FiMessageCircle className="text-gray-400 w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Counseling Sessions</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm || filterCategory !== 'all' || filterPriority !== 'all' 
                  ? 'No sessions match your current filters. Try adjusting your search criteria.' 
                  : 'Start by creating your first counseling session.'
                }
              </p>
              <button
                onClick={handleNewEvent}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2.5 rounded-xl transition-all duration-200 font-medium"
              >
                <FiPlus className="w-4 h-4" />
                Create First Session
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredEvents.map((event, index) => (
                <CounselingEventCard 
                  key={event?.id || index}
                  event={event}
                  index={index}
                  onEdit={() => handleEdit(event)}
                  onDelete={() => handleDelete(event?.id)}
                  onView={() => handleView(event)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEvents.map((event, index) => (
                <div
                  key={event?.id || index}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  onClick={() => handleView(event)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        event?.category === 'Academics' ? 'bg-blue-100' :
                        event?.category === 'Drugs' ? 'bg-red-100' :
                        event?.category === 'Relationships' ? 'bg-pink-100' :
                        event?.category === 'Worship' ? 'bg-purple-100' :
                        'bg-gray-100'
                      }`}>
                        {event?.category === 'Academics' && <FiBook className="text-blue-600" />}
                        {event?.category === 'Drugs' && <FiAlertTriangle className="text-red-600" />}
                        {event?.category === 'Relationships' && <FiUsers className="text-pink-600" />}
                        {event?.category === 'Worship' && <FiUser className="text-purple-600" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{event?.counselor}</h3>
                        <p className="text-gray-600 text-xs">{event?.description?.length > 60 ? event.description.substring(0, 60) + '...' : event?.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {event?.date ? new Date(event.date).toLocaleDateString() : 'No date'} • {event?.time}
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white mt-1 ${
                        event?.priority === 'High' ? 'bg-gradient-to-r from-red-500 to-rose-500' :
                        event?.priority === 'Medium' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                        'bg-gradient-to-r from-emerald-500 to-green-500'
                      }`}>
                        {event?.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Results Count */}
          {filteredEvents.length > 0 && (
            <div className="pt-4 mt-4 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredEvents.length}</span> of{' '}
                <span className="font-semibold">{events.length}</span> sessions
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      {isEditing && (
        <GuidanceEditDialog
          event={currentEvent}
          onSave={() => {
            setIsEditing(false);
            setCurrentEvent(null);
            fetchEvents();
          }}
          onCancel={() => {
            setIsEditing(false);
            setCurrentEvent(null);
          }}
        />
      )}

      {/* View Dialog */}
      {isViewing && (
        <ViewEventModal
          event={currentEvent}
          onClose={() => {
            setIsViewing(false);
            setCurrentEvent(null);
          }}
          onEdit={() => {
            setIsViewing(false);
            setIsEditing(true);
          }}
        />
      )}
    </div>
  );
}