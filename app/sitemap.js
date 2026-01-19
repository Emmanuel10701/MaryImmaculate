// app/sitemap.js - Enhanced version with logo image
export default function sitemap() {
  const baseUrl = 'https://mary-immaculate.vercel.app';
  const currentDate = new Date();
  
  // Single logo image used for all pages
  const schoolLogo = `${baseUrl}/ll.png`;

  // Define categories for better organization
  const pages = [
    // Primary Pages (High Priority)
    {
      path: '',
      priority: 1.0,
      changeFrequency: 'yearly',
      title: 'Home - Mary Immaculate Girls Secondary School',
      description: 'Premier Catholic girls secondary school in Mweiga, Nyeri County',
      image: schoolLogo
    },
    {
      path: 'pages/AboutUs',
      priority: 0.9,
      changeFrequency: 'monthly',
      title: 'About Us - Mary Immaculate School',
      description: 'Learn about our history, mission, vision, and core values',
      image: schoolLogo
    },
    {
      path: 'pages/admissions',
      priority: 0.9,
      changeFrequency: 'weekly',
      title: 'Admissions - Mary Immaculate School',
      description: 'Admissions process, requirements, and important dates',
      image: schoolLogo
    },
    {
      path: 'pages/apply-for-admissions',
      priority: 0.9,
      changeFrequency: 'weekly',
      title: 'Apply for Admissions - Mary Immaculate School',
      description: 'Online application form for new students',
      image: schoolLogo
    },
    
    // Academic Pages (Medium-High Priority)
    {
      path: 'pages/academics',
      priority: 0.8,
      changeFrequency: 'monthly',
      title: 'Academics - Mary Immaculate School',
      description: 'Academic programs, curriculum, and learning resources',
      image: schoolLogo
    },
    {
      path: 'pages/Guidance-and-Coucelling',
      priority: 0.7,
      changeFrequency: 'monthly',
      title: 'Guidance and Counselling - Mary Immaculate School',
      description: 'Student support services and career guidance',
      image: schoolLogo
    },
    {
      path: 'pages/carreer',
      priority: 0.6,
      changeFrequency: 'monthly',
      title: 'Career Opportunities - Mary Immaculate School',
      description: 'Job vacancies and career information',
      image: schoolLogo
    },
    
    // Community Pages (Medium Priority)
    {
      path: 'pages/eventsandnews',
      priority: 0.7,
      changeFrequency: 'daily',
      title: 'Events & News - Mary Immaculate School',
      description: 'Latest school events, news, and announcements',
      image: schoolLogo
    },
    {
      path: 'pages/staff',
      priority: 0.7,
      changeFrequency: 'monthly',
      title: 'Staff & Faculty - Mary Immaculate School',
      description: 'Meet our teaching and administrative staff',
      image: schoolLogo
    },
    {
      path: 'pages/gallery',
      priority: 0.6,
      changeFrequency: 'weekly',
      title: 'Photo Gallery - Mary Immaculate School',
      description: 'Photos of school activities, events, and facilities',
      image: schoolLogo
    },
    
    // Support Pages (Medium-Low Priority)
    {
      path: 'pages/contact',
      priority: 0.5,
      changeFrequency: 'yearly',
      title: 'Contact Us - Mary Immaculate School',
      description: 'Contact information and location',
      image: schoolLogo
    },
    {
      path: 'pages/TermsandPrivacy',
      priority: 0.3,
      changeFrequency: 'yearly',
      title: 'Terms & Privacy - Mary Immaculate School',
      description: 'Terms of use and privacy policy',
      image: schoolLogo
    },
    
    // Portal Pages (Low Priority - Authentication Required)
    {
      path: 'pages/StudentPortal',
      priority: 0.4,
      changeFrequency: 'monthly',
      title: 'Student Portal - Mary Immaculate School',
      description: 'Student login and resources portal',
      image: schoolLogo
    },
    {
      path: 'pages/adminLogin',
      priority: 0.3,
      changeFrequency: 'monthly',
      title: 'Admin Login - Mary Immaculate School',
      description: 'Administrator login portal',
      image: schoolLogo
    },
    {
      path: 'MainDashboard',
      priority: 0.3,
      changeFrequency: 'monthly',
      title: 'Dashboard - Mary Immaculate School',
      description: 'Main dashboard for authenticated users',
      image: schoolLogo
    },
  ];

  // Generate sitemap entries with image
  return pages.map(page => ({
    url: `${baseUrl}/${page.path}`,
    lastModified: currentDate,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
    // Add the single logo image to all pages
    images: [page.image]
  }));
}