'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Users, 
  BookOpen, 
  Target, 
  Globe, 
  ShieldCheck, 
  Send, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  MessageSquare,
  Navigation,
  Calendar,
  Video,
  User,
  Book,
  Award,
  Star,
  ExternalLink,
  Zap,
  Heart,
  TrendingUp,
  Home,
  X,
  Loader2
} from 'lucide-react';
import CircularProgress from '@mui/material/CircularProgress';
import Image from "next/image";


export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    studentGrade: '',
    inquiryType: 'general',
    contactMethod: 'email'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isMapZoomed, setIsMapZoomed] = useState(false);

  const departments = [
    {
      id: 'admissions',
      name: 'Admissions Office',
      email: 'admissions@maryimmaculate.sc.ke',
      phone: '+254 720 123 456',
      description: 'For enrollment, applications, and admission inquiries. We guide students through the admission process.',
      icon: <User className="w-4 h-4" />,
      head: 'Mrs. Sarah Johnson',
      hours: 'Mon-Fri: 8:00 AM - 4:00 PM',
      color: 'orange'
    },
    {
      id: 'academics',
      name: 'Academic Office',
      email: 'academics@maryimmaculate.sc.ke',
      phone: '+254 720 123 457',
      description: 'Curriculum, academic programs, examinations, and teacher coordination. Ensuring academic excellence.',
      icon: <Book className="w-4 h-4" />,
      head: 'Dr. Michael Chen',
      hours: 'Mon-Fri: 7:30 AM - 3:30 PM',
      color: 'amber'
    },
    {
      id: 'student-affairs',
      name: 'Student Affairs',
      email: 'affairs@maryimmaculate.sc.ke',
      phone: '+254 720 123 458',
      description: 'Student welfare, discipline, counseling, and extracurricular activities. Building holistic students.',
      icon: <Users className="w-4 h-4" />,
      head: 'Mr. David Wilson',
      hours: 'Mon-Fri: 8:00 AM - 4:30 PM',
      color: 'red'
    },
    {
      id: 'sports',
      name: 'Sports Department',
      email: 'sports@maryimmaculate.sc.ke',
      phone: '+254 720 123 459',
      description: 'Athletics, sports programs, competitions, and physical education. Developing champions.',
      icon: <Award className="w-4 h-4" />,
      head: 'Coach Robert Garcia',
      hours: 'Mon-Sat: 6:00 AM - 6:00 PM',
      color: 'orange'
    }
  ];

  const quickActions = [
    {
      icon: <User className="w-4 h-4" />,
      title: 'Apply for Admission',
      description: 'Start your application process',
      link: '/pages/apply-for-admissions',
      color: 'orange'
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      title: 'View Events Calendar',
      description: 'See upcoming school events',
      link: '/pages/eventsandnews',
      color: 'amber'
    },
    {
      icon: <Book className="w-4 h-4" />,
      title: 'Explore Programs',
      description: 'Discover academic offerings',
      link: '/pages/admissions',
      color: 'red'
    },
    {
      icon: <Video className="w-4 h-4" />,
      title: 'Virtual Tour home page',
      description: 'Take a campus tour online',
      link: '/',
      color: 'orange'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Validate required fields (matching API validation)
      if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
        throw new Error('Name, email, phone, subject, and message are required.');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please provide a valid email address.');
      }

      // Phone validation (Kenyan format)
      const phoneRegex = /^(07|01)\d{8}$/;
      const cleanedPhone = formData.phone.replace(/\s/g, '');
      if (!phoneRegex.test(cleanedPhone)) {
        throw new Error('Invalid phone format. Use 07XXXXXXXX or 01XXXXXXXX');
      }

      // Prepare data for API
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: cleanedPhone,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        contactMethod: formData.contactMethod,
        studentGrade: formData.studentGrade?.trim() || '',
        inquiryType: formData.inquiryType,
        submittedAt: new Date().toISOString()
      };

      // Send to API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Success
      setSubmitStatus('success');
      setStatusMessage(data.message || 'Message sent successfully! Check your email for confirmation.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        studentGrade: '',
        inquiryType: 'general',
        contactMethod: 'email'
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);

    } catch (error) {
      setSubmitStatus('error');
      setStatusMessage(error.message || 'Failed to send message. Please try again.');
      
      // Hide error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMapZoom = () => {
    setIsMapZoomed(!isMapZoomed);
  };

  const closeDepartmentModal = () => {
    setSelectedDepartment(null);
  };

  const openDepartmentModal = (dept) => {
    setSelectedDepartment(dept);
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen relative">

      {/* Cinematic Hero with Optimized Background - Updated to orange gradient */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-950 via-amber-950 to-red-950 px-4 sm:px-6">
        {/* Optimized Background Engine */}
        <div className="absolute inset-0 z-0">
          {/* Background Image with reduced file size */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/90 via-amber-900/95 to-red-900/90">
            <Image
              src="/ii.jpg"
              alt="Campus"
              fill
              priority
              className="object-cover opacity-50 transition-transform duration-[10s] ease-out group-hover:scale-110"
            />
          </div>
          
          {/* Optimized Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-orange-950/40 via-amber-950/80 to-red-950 z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,#1a0f0a_80%)] opacity-60 z-10" />
        </div>

        <div className="relative z-20 max-w-6xl mx-auto text-center px-4">
          {/* Micro-Interaction Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-bold tracking-[0.2em] text-orange-200 uppercase">
              Academic Excellence Since 1998
            </span>
          </div>

          {/* Modern High-Density Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-8 tracking-tight leading-[0.95]">
            Mary Immaculate <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-400 via-orange-300 to-white/70">Girls Secondary.</span>
          </h1>

          {/* Rich Narrative Description */}
          <div className="max-w-3xl mx-auto space-y-6 px-4">
            <p className="text-base md:text-lg text-slate-200 font-medium leading-relaxed">
              Where <span className="text-amber-400">excellence meets opportunity</span> in the heart of Mweiga, Nyeri.
            </p>
            
            <p className="hidden md:block text-sm text-slate-300 leading-relaxed">
              A premier girls' institution committed to holistic education through innovative teaching, modern facilities, 
              and a nurturing environment that empowers future women leaders.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-6 border-t border-white/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">98%</div>
                <div className="text-xs uppercase tracking-wider text-slate-300 font-medium">KCSE Pass Rate</div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">1:15</div>
                <div className="text-xs uppercase tracking-wider text-slate-300 font-medium">Teacher Ratio</div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">STEM+</div>
                <div className="text-xs uppercase tracking-wider text-slate-300 font-medium">Accredited</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section - Original UI with API Integration */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Form with ALL API Fields */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl shadow-slate-200/50 border border-slate-100">
              <div className="mb-10">
                <span className="inline-block px-4 py-2 mb-5 text-xs font-bold tracking-[0.1em] text-orange-700 uppercase bg-orange-50 rounded-full">
                  Contact Support
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">
                  Get in Touch <span className="text-orange-600">Directly</span>
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed max-w-xl">
                  Have a question or need assistance? Fill out the form and our team will respond within 24 hours.
                </p>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="mb-8 p-6 bg-green-50 border-2 border-green-200 rounded-2xl animate-fade-in">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-green-800 font-bold text-lg">Success!</p>
                      <p className="text-green-700">{statusMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-8 p-6 bg-red-50 border-2 border-red-200 rounded-2xl animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
                    </div>
                    <div>
                      <p className="text-red-800 font-bold text-lg">Error</p>
                      <p className="text-red-700">{statusMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Row 1: Name & Email */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-5 font-semibold py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent transition-all outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-5 font-semibold py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent transition-all outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* Row 2: Phone & Student Grade */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 font-semibold bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent transition-all outline-none"
                      placeholder="0712 345 678"
                      pattern="(07|01)\d{8}"
                      title="Use 07XXXXXXXX or 01XXXXXXXX format"
                    />
                    <p className="text-xs text-slate-500 ml-2">Format: 07XXXXXXXX or 01XXXXXXXX</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Student Grade
                    </label>
                    <select
                      name="studentGrade"
                      value={formData.studentGrade}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none appearance-none"
                    >
                      <option value="">Select Grade</option>
                      <option value="Form 1">Form 1</option>
                      <option value="Form 2">Form 2</option>
                      <option value="Form 3">Form 3</option>
                      <option value="Form 4">Form 4</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Inquiry Type & Contact Method */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Inquiry Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="inquiryType"
                      required
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none appearance-none"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="admissions">Admissions</option>
                      <option value="academics">Academics</option>
                      <option value="fees">Fees & Payments</option>
                      <option value="sports">Sports & Activities</option>
                      <option value="facilities">Facilities</option>
                      <option value="alumni">Alumni Affairs</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Preferred Contact Method
                    </label>
                    <select
                      name="contactMethod"
                      value={formData.contactMethod}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none appearance-none"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone Call</option>
                      <option value="sms">SMS</option>
                    </select>
                  </div>
                </div>

                {/* Row 4: Subject */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-5 font-semibold py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent transition-all outline-none"
                    placeholder="What is this regarding?"
                  />
                </div>

                {/* Row 5: Message */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={10}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 font-semibold bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none resize-none"
                    placeholder="How can we help you today?"
                  />
                </div>

                {/* Submit Button with Circular Progress */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-12 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress size={20} color="inherit" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={18} className="text-orange-400" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="lg:col-span-4 space-y-8">
            {/* Departments Card */}
            <div className="bg-gradient-to-br from-orange-900 to-amber-900 rounded-3xl p-8 text-white">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Users className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold">Departments</h3>
              </div>

              <div className="space-y-5">
                {departments.map((dept) => (
                  <div 
                    key={dept.id} 
                    className="pb-5 border-b border-white/5 last:border-0 last:pb-0 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => openDepartmentModal(dept)}
                  >
                    <h4 className="font-bold text-white text-base mb-1">{dept.name}</h4>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-orange-200 flex items-center gap-2">
                        <Mail size={12} /> {dept.email}
                      </span>
                      <span className="text-xs text-orange-200 flex items-center gap-2">
                        <Phone size={12} /> {dept.phone}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-8 text-white relative overflow-hidden">
              {/* Subtle decorative circle */}
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  Quick Actions
                </h3>
                <div className="grid gap-3">
                  {quickActions.map((action, idx) => (
                    <a 
                      key={idx} 
                      href={action.link}
                      className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/15 active:scale-[0.98] transition-all"
                    >
                      <span className="font-bold text-sm">{action.title}</span>
                      <ArrowRight size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modernized Department Detail Modal */}
      {selectedDepartment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* High-quality Backdrop blur */}
          <div 
            className="absolute inset-0 bg-orange-950/60 backdrop-blur-md"
            onClick={closeDepartmentModal}
          />

          {/* Modal Container */}
          <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            
            {/* Decorative Header Background */}
            <div className={`absolute top-0 left-0 right-0 h-32 opacity-10 -z-10 ${
              selectedDepartment.color === 'orange' ? 'bg-orange-600' : 
              selectedDepartment.color === 'amber' ? 'bg-amber-600' :
              selectedDepartment.color === 'red' ? 'bg-red-600' : 'bg-orange-600'
            }`} />

            <div className="p-8 sm:p-10">
              {/* Header Section */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-5">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                    selectedDepartment.color === 'orange' ? 'bg-orange-600 text-white' : 
                    selectedDepartment.color === 'amber' ? 'bg-amber-600 text-white' :
                    selectedDepartment.color === 'red' ? 'bg-red-600 text-white' : 'bg-orange-600 text-white'
                  }`}>
                    {React.cloneElement(selectedDepartment.icon, { size: 28 })}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                      {selectedDepartment.name}
                    </h3>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      Department Profile
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeDepartmentModal}
                  className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content Body */}
              <div className="space-y-8">
                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                      Department Head
                    </p>
                    <p className="text-slate-900 font-bold">{selectedDepartment.head}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                      Office Hours
                    </p>
                    <p className="text-slate-900 font-bold">{selectedDepartment.hours}</p>
                  </div>
                </div>

                {/* Detailed Description */}
                <div className="px-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                    About the Department
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    {selectedDepartment.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <a
                    href={`mailto:${selectedDepartment.email}`}
                    className="flex items-center justify-center gap-3 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 transition-all"
                  >
                    <Mail className="w-4 h-4 text-orange-400" />
                    Email Us
                  </a>
                  <a
                    href={`tel:${selectedDepartment.phone.replace(/\s+/g, '')}`}
                    className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-600/10 hover:shadow-orange-600/20 transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    Call Office
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 shadow-lg">
        <div className="flex justify-around p-2">
          <a href="/" className="flex flex-col items-center text-slate-600 hover:text-orange-600 transition-colors p-2">
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Home</span>
          </a>
          <a href="tel:+254720123456" className="flex flex-col items-center text-slate-600 hover:text-orange-600 transition-colors p-2">
            <Phone className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Call</span>
          </a>
          <button 
            onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex flex-col items-center text-slate-600 hover:text-orange-600 transition-colors p-2"
          >
            <MessageSquare className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Message</span>
          </button>
          <a href="mailto:admissions@maryimmaculate.sc.ke" className="flex flex-col items-center text-slate-600 hover:text-orange-600 transition-colors p-2">
            <Mail className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Email</span>
          </a>
        </div>
      </div>

      {/* Global Styles for Mobile Optimization */}
      <style jsx global>{`
        /* Prevent zoom on iOS inputs */
        input, select, textarea {
          font-size: 16px !important;
        }

        /* Touch-friendly targets */
        button, a {
          min-height: 44px;
          min-width: 44px;
        }

        /* Responsive typography */
        @media (max-width: 640px) {
          html {
            font-size: 14px;
          }
          
          h1 {
            font-size: 2.5rem !important;
            line-height: 1.2 !important;
          }
          
          h2 {
            font-size: 1.75rem !important;
          }
          
          .rounded-3xl {
            border-radius: 1rem !important;
          }
          
          .p-10 {
            padding: 1.5rem !important;
          }
        }

        /* Tablet optimization */
        @media (min-width: 641px) and (max-width: 1024px) {
          html {
            font-size: 15px;
          }
        }

        /* Prevent content overflow */
        body {
          overflow-x: hidden;
          width: 100%;
        }

        /* Smooth animations */
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        /* Tailwind animation utilities */
        @keyframes zoom-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-in {
          animation-duration: 0.3s;
          animation-fill-mode: both;
        }
        
        .fade-in {
          animation-name: fade-in;
        }
        
        .zoom-in {
          animation-name: zoom-in;
        }
      `}</style>
    </div>
  );
}