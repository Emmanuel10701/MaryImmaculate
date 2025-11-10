'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit, 
  FiTrash2, 
  FiSend,
  FiUsers,
  FiBarChart2,
  FiEye,
  FiClock,
  FiTrendingUp,
  FiMail,
  FiX,
  FiSave,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiUser
} from 'react-icons/fi';

export default function EmailManager() {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    recipients: 'all',
    schedule: 'immediate',
    scheduledDate: '',
    scheduledTime: '',
    status: 'draft'
  });

  useEffect(() => {
    const sampleCampaigns = Array.from({ length: 24 }, (_, i) => ({
      id: i + 1,
      subject: `Campaign ${i + 1}: ${['Weekly Newsletter', 'Event Invitation', 'Important Announcement', 'Academic Update', 'Sports News'][i % 5]}`,
      recipients: ['All Subscribers', 'Parents Only', 'Students Only', 'Staff Members', 'Board of Management'][i % 5],
      sentDate: `2024-03-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      openRate: Math.floor(Math.random() * 30) + 60,
      clickRate: Math.floor(Math.random() * 20) + 15,
      status: ['sent', 'scheduled', 'draft'][i % 3],
      sentTo: [2345, 1247, 1247, 68, 12][i % 5],
      unsubscribes: Math.floor(Math.random() * 10) + 1,
      replies: Math.floor(Math.random() * 20) + 5,
      createdAt: `2024-03-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      scheduledFor: i % 3 === 1 ? `2024-04-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}` : null
    }));
    setCampaigns(sampleCampaigns);
    setFilteredCampaigns(sampleCampaigns);
  }, []);

  // Filtering and pagination
  useEffect(() => {
    let filtered = campaigns;

    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.recipients.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(campaign => campaign.status === selectedStatus);
    }

    setFilteredCampaigns(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, campaigns]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCampaigns = filteredCampaigns.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // CRUD Operations
  const handleCreate = () => {
    setFormData({
      subject: '',
      content: '',
      recipients: 'all',
      schedule: 'immediate',
      scheduledDate: '',
      scheduledTime: '',
      status: 'draft'
    });
    setEditingCampaign(null);
    setShowModal(true);
  };

  const handleEdit = (campaign) => {
    setFormData({
      subject: campaign.subject,
      content: 'Sample email content...', // In real app, this would be the actual content
      recipients: campaign.recipients.split(' ')[0].toLowerCase(),
      schedule: campaign.scheduledFor ? 'scheduled' : 'immediate',
      scheduledDate: campaign.scheduledFor || '',
      scheduledTime: '09:00',
      status: campaign.status
    });
    setEditingCampaign(campaign);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this email campaign?')) {
      setCampaigns(campaigns.filter(campaign => campaign.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCampaign) {
      // Update campaign
      setCampaigns(campaigns.map(campaign => 
        campaign.id === editingCampaign.id 
          ? { ...campaign, ...formData }
          : campaign
      ));
    } else {
      // Create new campaign
      const newCampaign = {
        id: Date.now(),
        subject: formData.subject,
        recipients: recipientGroups.find(g => g.value === formData.recipients)?.label || 'All Subscribers',
        sentDate: formData.schedule === 'immediate' ? new Date().toISOString().split('T')[0] : null,
        openRate: 0,
        clickRate: 0,
        status: formData.status,
        sentTo: recipientGroups.find(g => g.value === formData.recipients)?.count || 2345,
        unsubscribes: 0,
        replies: 0,
        createdAt: new Date().toISOString().split('T')[0],
        scheduledFor: formData.schedule === 'scheduled' ? formData.scheduledDate : null
      };
      setCampaigns([...campaigns, newCampaign]);
    }
    setShowModal(false);
  };

  const recipientGroups = [
    { value: 'all', label: 'All Subscribers', count: 2345, color: 'blue' },
    { value: 'parents', label: 'Parents Only', count: 1247, color: 'green' },
    { value: 'students', label: 'Students Only', count: 1247, color: 'purple' },
    { value: 'staff', label: 'Staff Members', count: 68, color: 'orange' },
    { value: 'bom', label: 'Board of Management', count: 12, color: 'red' },
    { value: 'alumni', label: 'Alumni', count: 456, color: 'indigo' }
  ];

  const stats = [
    { label: 'Total Sent', value: '15,234', change: 12, icon: FiSend, color: 'blue' },
    { label: 'Open Rate', value: '72%', change: 5, icon: FiEye, color: 'green' },
    { label: 'Click Rate', value: '34%', change: 8, icon: FiTrendingUp, color: 'purple' },
    { label: 'Bounce Rate', value: '2.1%', change: -1, icon: FiBarChart2, color: 'orange' }
  ];

  const Pagination = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <p className="text-sm text-gray-700">
        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCampaigns.length)} of {filteredCampaigns.length} campaigns
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
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
                onClick={() => paginate(page)}
                className={`px-3 py-2 rounded-lg font-semibold transition-colors ${
                  currentPage === page
                    ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/25'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            </div>
          ))
        }

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          <FiChevronRight className="text-lg" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            Email Campaigns
          </h1>
          <p className="text-gray-600 mt-2">Create and manage email campaigns for different groups</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreate}
          className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white px-4 lg:px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg shadow-pink-500/25 w-full lg:w-auto justify-center"
        >
          <FiPlus className="text-lg" />
          New Campaign
        </motion.button>
      </div>

      {/* Email Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.change > 0 ? (
                    <FiTrendingUp className="text-green-500 text-sm" />
                  ) : (
                    <FiTrendingUp className="text-red-500 text-sm" style={{ transform: 'rotate(180deg)' }} />
                  )}
                  <span className={`text-sm font-semibold ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change > 0 ? '+' : ''}{stat.change}%
                  </span>
                </div>
              </div>
              <div className={`p-2 lg:p-3 rounded-xl bg-${stat.color}-100`}>
                <stat.icon className={`text-lg lg:text-xl text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Compose Email */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200/50">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FiMail className="text-pink-500" />
            Compose Email
          </h2>
          
          <div className="space-y-4 lg:space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Recipients
              </label>
              <select
                value={selectedRecipients}
                onChange={(e) => setSelectedRecipients(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
              >
                {recipientGroups.map(group => (
                  <option key={group.value} value={group.value}>
                    {group.label} ({group.count.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                placeholder="Enter email subject"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Content
              </label>
              <textarea
                rows="8"
                placeholder="Write your email content here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                <FiSave className="text-lg" />
                Save Draft
              </button>
              <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-green-500/25">
                <FiSend className="text-lg" />
                Send Now
              </button>
            </div>
          </div>
        </div>

        {/* Campaign Stats & Groups */}
        <div className="space-y-4 lg:space-y-6">
          {/* Recipient Groups */}
          <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200/50">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiUsers className="text-blue-500" />
              Recipient Groups
            </h3>
            <div className="space-y-3">
              {recipientGroups.map(group => (
                <motion.div
                  key={group.value}
                  whileHover={{ x: 4 }}
                  className={`flex items-center justify-between p-3 border border-${group.color}-200 rounded-xl cursor-pointer transition-all duration-200 hover:border-${group.color}-300 hover:bg-${group.color}-50`}
                >
                  <span className="font-medium text-gray-700 text-sm">{group.label}</span>
                  <span className={`bg-${group.color}-100 text-${group.color}-800 px-2 py-1 rounded-full text-xs font-semibold`}>
                    {group.count.toLocaleString()}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200/50">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiBarChart2 className="text-green-500" />
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Total Subscribers</p>
                <p className="text-xl font-bold text-gray-800">2,345</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Open Rate</p>
                <p className="text-xl font-bold text-gray-800">72%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Campaigns This Month</p>
                <p className="text-xl font-bold text-gray-800">8</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-xl font-bold text-gray-800">3</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
            >
              <option value="all">All Status</option>
              <option value="sent">Sent</option>
              <option value="scheduled">Scheduled</option>
              <option value="draft">Draft</option>
            </select>

            <button className="px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg">
              <FiBarChart2 className="text-lg" />
              <span className="hidden lg:inline">Reports</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Recipients</th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentCampaigns.map((campaign) => (
                <motion.tr
                  key={campaign.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="px-4 lg:px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-800 group-hover:text-pink-600 transition-colors text-sm lg:text-base">
                        {campaign.subject}
                      </p>
                      <p className="text-xs text-gray-500">Sent to: {campaign.sentTo.toLocaleString()}</p>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      {campaign.recipients}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiCalendar className="text-gray-400" />
                      {campaign.sentDate || campaign.scheduledFor || 'Draft'}
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-600">Open:</span>
                        <span className="font-semibold text-green-600">{campaign.openRate}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-600">Click:</span>
                        <span className="font-semibold text-blue-600">{campaign.clickRate}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      campaign.status === 'sent' 
                        ? 'bg-green-100 text-green-800'
                        : campaign.status === 'scheduled'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex items-center gap-1 lg:gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(campaign)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FiEdit className="text-sm lg:text-base" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(campaign.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 className="text-sm lg:text-base" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="View Analytics"
                      >
                        <FiBarChart2 className="text-sm lg:text-base" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 lg:p-6 border-t border-gray-200">
          <Pagination />
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiX className="text-xl text-gray-600" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Enter email subject"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Recipients *
                    </label>
                    <select
                      required
                      value={formData.recipients}
                      onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      {recipientGroups.map(group => (
                        <option key={group.value} value={group.value}>{group.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Schedule *
                    </label>
                    <select
                      required
                      value={formData.schedule}
                      onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="immediate">Send Immediately</option>
                      <option value="scheduled">Schedule for Later</option>
                    </select>
                  </div>

                  {formData.schedule === 'scheduled' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.scheduledDate}
                          onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Time *
                        </label>
                        <input
                          type="time"
                          required
                          value={formData.scheduledTime}
                          onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Content *
                  </label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows="8"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                    placeholder="Write your email content here..."
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.status === 'draft'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'draft' : 'scheduled' })}
                      className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-sm font-semibold text-gray-700">Save as Draft</span>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}