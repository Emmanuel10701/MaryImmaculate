'use client';
import { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiMail, 
  FiTrash2, 
  FiDownload,
  FiTrendingUp,
  FiUsers,
  FiBarChart2,
  FiX,
  FiSend,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiCheck,
  FiAlertCircle,
  FiInfo
} from 'react-icons/fi';
import { toast } from 'sonner';
import CircularProgress from '@mui/material/CircularProgress';

export default function SubscriberManager() {
  const [subscribers, setSubscribers] = useState([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [selectedSubscribers, setSelectedSubscribers] = useState(new Set());
  const itemsPerPage = 8;

  const [emailData, setEmailData] = useState({
    subject: '',
    template: 'admission',
    audience: 'all',
    customMessage: '',
    templateData: {
      schoolYear: '2025',
      deadline: 'January 31, 2025',
      month: new Date().toLocaleString('default', { month: 'long' }),
      eventName: 'Annual Science Fair',
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: '9:00 AM - 3:00 PM'
    }
  });

  // Enhanced Email Templates
  const emailTemplates = {
    admission: {
      name: 'Admission Tips & Updates',
      subject: '🎓 Important Admission Updates & Tips for {schoolYear} - Katwanyaa High  School',
      description: 'Send admission tips, deadlines, and important updates',
      color: 'bg-blue-50 border-blue-200',
      icon: '🎯'
    },
    newsletter: {
      name: 'Monthly Newsletter',
      subject: '📰 {month} Newsletter - Katwanyaa High SchoolUpdates',
      description: 'Share monthly news, achievements, and announcements',
      color: 'bg-purple-50 border-purple-200',
      icon: '📬'
    },
    event: {
      name: 'Event Announcement',
      subject: '🎉 Event Invitation: {eventName} - Katwanyaa High  School',
      description: 'Announce school events and activities',
      color: 'bg-green-50 border-green-200',
      icon: '📅'
    },
    reminder: {
      name: 'Important Reminder',
      subject: '⏰ Important Reminder - Katwanyaa High  School',
      description: 'Send important reminders and notifications',
      color: 'bg-amber-50 border-amber-200',
      icon: '🔔'
    }
  };

  // Fetch subscribers from API
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/subscriber');
      const data = await response.json();
      
      if (data.success) {
        setSubscribers(data.subscribers);
        setFilteredSubscribers(data.subscribers);
      } else {
        throw new Error(data.error || 'Failed to fetch subscribers');
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('Failed to fetch subscribers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  // Calculate statistics with growth comparison
  const calculateStats = () => {
    const totalSubscribers = subscribers.length;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonthSubscribers = subscribers.filter(sub => {
      const subDate = new Date(sub.createdAt);
      return subDate.getMonth() === currentMonth && subDate.getFullYear() === currentYear;
    }).length;
    
    const lastMonthSubscribers = subscribers.filter(sub => {
      const subDate = new Date(sub.createdAt);
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const year = currentMonth === 0 ? currentYear - 1 : currentYear;
      return subDate.getMonth() === lastMonth && subDate.getFullYear() === year;
    }).length;
    
    const growthRate = lastMonthSubscribers > 0 
      ? ((thisMonthSubscribers - lastMonthSubscribers) / lastMonthSubscribers * 100).toFixed(1)
      : thisMonthSubscribers > 0 ? 100 : 0;

    return {
      totalSubscribers,
      thisMonthSubscribers,
      lastMonthSubscribers,
      growthRate: parseFloat(growthRate),
      growthCount: thisMonthSubscribers - lastMonthSubscribers
    };
  };

  const stats = calculateStats();

  // Filter subscribers by email search
  useEffect(() => {
    let filtered = subscribers;

    if (searchTerm) {
      filtered = subscribers.filter(subscriber =>
        subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSubscribers(filtered);
    setCurrentPage(1);
  }, [searchTerm, subscribers]);

  // Responsive pagination logic
  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSubscribers = filteredSubscribers.slice(startIndex, startIndex + itemsPerPage);

  // Handle subscriber selection
  const toggleSubscriberSelection = (subscriberId) => {
    const newSelected = new Set(selectedSubscribers);
    if (newSelected.has(subscriberId)) {
      newSelected.delete(subscriberId);
    } else {
      newSelected.add(subscriberId);
    }
    setSelectedSubscribers(newSelected);
  };

  const selectAllSubscribers = () => {
    if (selectedSubscribers.size === currentSubscribers.length) {
      setSelectedSubscribers(new Set());
    } else {
      setSelectedSubscribers(new Set(currentSubscribers.map(sub => sub.id)));
    }
  };

  // Handle subscriber deletion
  const handleDelete = (subscriber) => {
    setSubscriberToDelete(subscriber);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!subscriberToDelete) return;
    
    try {
      const response = await fetch(`/api/subscriber/${subscriberToDelete.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchSubscribers();
        toast.success('Subscriber deleted successfully');
      } else {
        throw new Error(data.error || 'Failed to delete subscriber');
      }
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      toast.error('Failed to delete subscriber');
    } finally {
      setShowDeleteConfirm(false);
      setSubscriberToDelete(null);
    }
  };

  // Export to CSV logic
  const exportToCSV = () => {
    try {
      const headers = ['Email', 'Subscription Date'];
      const csvData = filteredSubscribers.map(sub => [
        sub.email,
        new Date(sub.createdAt).toLocaleDateString()
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('CSV exported successfully');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export CSV');
    }
  };

  // Handle email sending
  const handleSendEmail = async (e) => {
    e.preventDefault();
    setSendingEmail(true);

    try {
      const targetSubscribers = selectedSubscribers.size > 0 
        ? subscribers.filter(sub => selectedSubscribers.has(sub.id))
        : subscribers;

      if (targetSubscribers.length === 0) {
        throw new Error('No subscribers selected');
      }

      const campaignPayload = {
        subscribers: targetSubscribers,
        template: emailData.template,
        subject: emailData.subject,
        customMessage: emailData.customMessage,
        templateData: emailData.templateData
      };

      const response = await fetch('/api/campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send campaign');
      }

      if (data.success) {
        toast.success(data.message || 'Campaign sent successfully');
        setShowEmailModal(false);
        setEmailData({
          subject: '',
          template: 'admission',
          audience: 'all',
          customMessage: '',
          templateData: {
            schoolYear: '2025',
            deadline: 'January 31, 2025',
            month: new Date().toLocaleString('default', { month: 'long' }),
            eventName: 'Annual Science Fair',
            date: new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }),
            time: '9:00 AM - 3:00 PM'
          }
        });
        setSelectedSubscribers(new Set());
      } else {
        throw new Error(data.error || 'Failed to send campaign');
      }
    } catch (error) {
      console.error('Error sending campaign:', error);
      toast.error(error.message);
    } finally {
      setSendingEmail(false);
    }
  };

  // Update template and auto-fill subject
  const updateCampaignTemplate = (template) => {
    const templateConfig = emailTemplates[template];
    setEmailData({
      ...emailData,
      template,
      subject: templateConfig.subject
        .replace('{schoolYear}', emailData.templateData.schoolYear)
        .replace('{month}', emailData.templateData.month)
        .replace('{eventName}', emailData.templateData.eventName)
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <CircularProgress size={60} sx={{ color: '#3b82f6' }} />
          <p className="text-gray-600 text-lg mt-4 font-medium">Loading subscribers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl lg:rounded-2xl p-6 shadow-sm border">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-blue-600 rounded-xl">
                <FiMail className="text-white text-xl lg:text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Subscriber Manager
                </h1>
                <p className="text-gray-600 mt-1 text-sm lg:text-base">Manage and communicate with your audience</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={exportToCSV}
              className="px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium flex items-center justify-center gap-2 text-sm lg:text-base hover:bg-gray-50 transition-colors"
            >
              <FiDownload className="text-base" />
              Export CSV
            </button>
            
            <button
              onClick={() => setShowEmailModal(true)}
              disabled={subscribers.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiSend className="text-base" />
              Send Email
            </button>
          </div>
        </div>
      </div>

      {/* Modern Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-blue-100 rounded-lg">
              <FiUsers className="text-blue-600 text-xl" />
            </div>
            <div className="text-right">
              <div className="text-2xl lg:text-3xl font-bold text-gray-900">{stats.totalSubscribers}</div>
              <div className="text-blue-600 text-sm font-medium">Total Subscribers</div>
            </div>
          </div>
          <div className="text-gray-600 text-sm mt-3">All active subscribers</div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-green-100 rounded-lg">
              <FiBarChart2 className="text-green-600 text-xl" />
            </div>
            <div className="text-right">
              <div className="text-2xl lg:text-3xl font-bold text-gray-900">{stats.thisMonthSubscribers}</div>
              <div className="text-green-600 text-sm font-medium">This Month</div>
            </div>
          </div>
          <div className="text-gray-600 text-sm mt-3">New subscriptions</div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-orange-100 rounded-lg">
              <FiTrendingUp className="text-orange-600 text-xl" />
            </div>
            <div className="text-right">
              <div className="text-2xl lg:text-3xl font-bold text-gray-900">{stats.growthRate}%</div>
              <div className="text-orange-600 text-sm font-medium">
                {stats.growthCount >= 0 ? '+' : ''}{stats.growthCount}
              </div>
            </div>
          </div>
          <div className="text-gray-600 text-sm mt-3">Growth rate</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl lg:rounded-2xl p-6 shadow-sm border">
        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base" />
            <input
              type="text"
              placeholder="Search subscribers by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-gray-600 text-sm font-medium">
              {selectedSubscribers.size > 0 
                ? `${selectedSubscribers.size} selected` 
                : `${filteredSubscribers.length} total`
              }
            </div>
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedSubscribers.size === currentSubscribers.length && currentSubscribers.length > 0}
                      onChange={selectAllSubscribers}
                      className="w-4 h-4 rounded border-gray-300 bg-white text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 text-xs lg:text-sm font-semibold uppercase tracking-wider">Email</span>
                  </div>
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-gray-700 text-xs lg:text-sm font-semibold uppercase tracking-wider whitespace-nowrap">Subscription Date</th>
                <th className="px-4 lg:px-6 py-3 text-left text-gray-700 text-xs lg:text-sm font-semibold uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedSubscribers.has(subscriber.id)}
                        onChange={() => toggleSubscriberSelection(subscriber.id)}
                        className="w-4 h-4 rounded border-gray-300 bg-white text-blue-600 focus:ring-blue-500"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm lg:text-base truncate">
                          {subscriber.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <FiCalendar className="text-gray-400 flex-shrink-0" />
                      <span className="whitespace-nowrap">
                        {new Date(subscriber.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <button
                      onClick={() => handleDelete(subscriber)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-200"
                      aria-label="Delete subscriber"
                    >
                      <FiTrash2 className="text-base" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSubscribers.length === 0 && (
            <div className="text-center py-12">
              <FiMail className="text-5xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'No subscribers found matching your search.' : 'No subscribers yet.'}
              </p>
            </div>
          )}
        </div>

        {/* Modern Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-gray-600 text-sm">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredSubscribers.length)} of {filteredSubscribers.length}
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 disabled:opacity-30 transition-colors hover:bg-gray-50"
                aria-label="Previous page"
              >
                <FiChevronLeft className="text-base" />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3.5 py-2.5 rounded-lg font-medium transition-colors text-sm ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 disabled:opacity-30 transition-colors hover:bg-gray-50"
                aria-label="Next page"
              >
                <FiChevronRight className="text-base" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl lg:rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-xl border">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-600 rounded-xl">
                    <FiSend className="text-white text-xl" />
                  </div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Create Email Campaign</h2>
                    <p className="text-gray-600 mt-1 text-sm">Send communications to your subscribers</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                  aria-label="Close modal"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>

            {/* Content */}
            <form onSubmit={handleSendEmail} className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Template Selection */}
              <div>
                <label className="block text-gray-900 font-semibold mb-3">Email Template</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(emailTemplates).map(([key, template]) => (
                    <div
                      key={key}
                      onClick={() => updateCampaignTemplate(key)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${template.color} ${
                        emailData.template === key
                          ? 'ring-2 ring-blue-500 border-blue-500'
                          : 'hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl">{template.icon}</span>
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      </div>
                      <p className="text-gray-600 text-sm">{template.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Template-specific fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emailData.template === 'admission' && (
                  <>
                    <div>
                      <label className="block text-gray-900 font-medium mb-2">School Year</label>
                      <input
                        type="text"
                        value={emailData.templateData.schoolYear}
                        onChange={(e) => setEmailData({
                          ...emailData,
                          templateData: { ...emailData.templateData, schoolYear: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="2025"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-900 font-medium mb-2">Application Deadline</label>
                      <input
                        type="text"
                        value={emailData.templateData.deadline}
                        onChange={(e) => setEmailData({
                          ...emailData,
                          templateData: { ...emailData.templateData, deadline: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="January 31, 2025"
                      />
                    </div>
                  </>
                )}

                {emailData.template === 'event' && (
                  <>
                    <div>
                      <label className="block text-gray-900 font-medium mb-2">Event Name</label>
                      <input
                        type="text"
                        value={emailData.templateData.eventName}
                        onChange={(e) => setEmailData({
                          ...emailData,
                          templateData: { ...emailData.templateData, eventName: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Annual Science Fair"
                      />
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-900 font-medium mb-2">Date</label>
                        <input
                          type="text"
                          value={emailData.templateData.date}
                          onChange={(e) => setEmailData({
                            ...emailData,
                            templateData: { ...emailData.templateData, date: e.target.value }
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="November 30, 2024"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-900 font-medium mb-2">Time</label>
                        <input
                          type="text"
                          value={emailData.templateData.time}
                          onChange={(e) => setEmailData({
                            ...emailData,
                            templateData: { ...emailData.templateData, time: e.target.value }
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="9:00 AM - 3:00 PM"
                        />
                      </div>
                    </div>
                  </>
                )}

                {emailData.template === 'newsletter' && (
                  <div>
                    <label className="block text-gray-900 font-medium mb-2">Month</label>
                    <input
                      type="text"
                      value={emailData.templateData.month}
                      onChange={(e) => setEmailData({
                        ...emailData,
                        templateData: { ...emailData.templateData, month: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="December"
                    />
                  </div>
                )}
              </div>

              {/* Campaign Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-900 font-medium mb-2">Email Subject *</label>
                  <input
                    type="text"
                    required
                    value={emailData.subject}
                    onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email subject line"
                  />
                </div>

                <div>
                  <label className="block text-gray-900 font-medium mb-2">Target Audience</label>
                  <select
                    value={emailData.audience}
                    onChange={(e) => setEmailData({ ...emailData, audience: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Subscribers ({subscribers.length})</option>
                    <option value="selected">Selected Subscribers ({selectedSubscribers.size})</option>
                  </select>
                </div>
              </div>

              {/* Custom Message */}
              <div>
                <label className="block text-gray-900 font-medium mb-2">
                  {emailData.template === 'custom' ? 'Email Content *' : 'Additional Message'}
                </label>
                <textarea
                  value={emailData.customMessage}
                  onChange={(e) => setEmailData({ ...emailData, customMessage: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm lg:text-base"
                  placeholder={
                    emailData.template === 'custom' 
                      ? 'Write your email content here...' 
                      : 'Add any additional message here...'
                  }
                  required={emailData.template === 'custom'}
                />
              </div>

              {/* Recipient Info */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-gray-900 font-semibold mb-1">Ready to Send</h3>
                    <p className="text-gray-600 text-sm">
                      {emailData.audience === 'selected' && selectedSubscribers.size > 0
                        ? `${selectedSubscribers.size} selected subscribers`
                        : `All ${subscribers.length} subscribers`
                      }
                    </p>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {emailData.audience === 'selected' && selectedSubscribers.size > 0 
                        ? selectedSubscribers.size 
                        : subscribers.length
                      }
                    </div>
                    <div className="text-gray-600 text-sm">subscribers</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 px-6 py-3.5 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingEmail}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sendingEmail ? (
                    <>
                      <CircularProgress size={20} sx={{ color: 'white' }} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend className="text-base" />
                      Send Campaign
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 border shadow-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-200">
                <FiTrash2 className="text-2xl text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Delete Subscriber</h3>
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete <strong className="text-gray-900">{subscriberToDelete?.email}</strong>?
              </p>
              <p className="text-gray-500 text-sm">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}