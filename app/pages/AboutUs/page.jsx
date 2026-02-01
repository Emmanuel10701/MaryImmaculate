"use client";
import React from 'react';
import { MapPin, Users, BookOpen, Trophy, Target, Globe,Clock , TrendingUp , Lightbulb , ExternalLink , ShieldCheck, ArrowRight, Phone, Sparkles, Heart, Zap } from 'lucide-react';
import MapComponent from '../../components/mapcomponent/page';
import Image from 'next/image';
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    { icon: <Users className="w-5 h-5" />, label: "Students", value: "1200+" },
    { icon: <BookOpen className="w-5 h-5" />, label: "Curriculums", value: "12" },
    { icon: <Trophy className="w-5 h-5" />, label: "Awards", value: "45" },
    { icon: <ShieldCheck className="w-5 h-5" />, label: "Success", value: "98%" },
  ];

  const values = [
    { title: "Integrity", icon: <ShieldCheck size={16}/> },
    { title: "Leadership", icon: <Zap size={16}/> },
    { title: "Compassion", icon: <Heart size={16}/> },
    { title: "Innovation", icon: <Sparkles size={16}/> }
  ];


  const date = new Date(); // Add this line!

  return (
    <div className="bg-white text-slate-900">
      {/* Hero Section */}
      {/* Modern Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-950 via-orange-950 to-red-950">
        {/* Background with Zoom Effect */}
        <div className="absolute inset-0 group">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-950/40 via-orange-950/80 to-orange-950 z-10"></div>
          <Image
            src="/ii.jpg"
            alt="Campus"
            fill
            className="object-cover opacity-50 transition-transform duration-[10s] ease-out group-hover:scale-101"
            priority
          />
          {/* Animated Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] z-0"></div>
        </div>

        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
          {/* Modern Static Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-orange-500/10 border border-orange-400/20 backdrop-blur-md mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="text-[10px] font-black tracking-[0.3em] text-orange-200 uppercase">
Registration Open • {new Date().getFullYear()} Academic Year            </span>
          </div>

          {/* Refined Title - Significantly Smaller & Tighter */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-6 tracking-tighter leading-none">
            Mary Immaculate <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-white/70">Girls Secondary.</span>
          </h1>

          {/* Expanded Rich Description */}
          <div className="max-w-3xl mx-auto space-y-6 mb-12">
            <p className="text-sm md:text-base text-slate-200 font-medium leading-relaxed mb-8">
              Since 1998, a cornerstone of <span className="text-amber-400">academic distinction</span>, 
              crafting a holistic pathway for future women leaders.
            </p>

            <div className="grid md:grid-cols-2 gap-6 text-left border-y border-white/10 py-8">
              <div className="space-y-2">
                <h4 className="text-amber-400 font-black text-[10px] uppercase tracking-widest">Why Us</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  We leverage modern STEM-based learning and state-of-the-art digital infrastructure to ensure our students are not just competitive, but are the innovators of tomorrow's global economy.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-amber-400 font-black text-[10px] uppercase tracking-widest">Core Excellence</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Beyond the classroom, our community thrives on character development, sports leadership, and artistic expression, fostering well-rounded individuals ready for university and beyond.
                </p>
              </div>
            </div>

            <p className="text-xs md:text-sm text-slate-400 italic">
              "Empowering girls through discipline, integrity, and a passion for lifelong learning."
            </p>
          </div>

       {/* MODERN ACTION DOCK - Always Flex & Height-Efficient */}
<div className="flex flex-row gap-2 sm:gap-4 justify-center items-center w-full px-2">
  
  <Link href="/pages/apply-for-admissions" passHref className="flex-1 sm:flex-none">
    <button className="w-full sm:w-auto px-4 sm:px-10 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[11px] sm:text-sm font-black rounded-xl sm:rounded-2xl shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2 transition-transform active:scale-95 whitespace-nowrap">
      Admission <ArrowRight size={16} className="shrink-0" />
    </button>
  </Link>

  <Link href="/pages/admissions" passHref className="flex-1 sm:flex-none">
    <button className="w-full sm:w-auto px-4 sm:px-10 py-3 bg-slate-900 text-white text-[11px] sm:text-sm font-black rounded-xl sm:rounded-2xl border border-white/10 shadow-xl flex items-center justify-center transition-transform active:scale-95 whitespace-nowrap">
      Curriculum
    </button>
  </Link>
  
</div>

          {/* Trust Indicators */}
          <div className="mt-12 flex justify-center gap-8 opacity-40 grayscale">
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Government Accredited</span>
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">STEM Certified</span>
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">National Champion 2025</span>
          </div>
        </div>
      </section>

{/* Modernized Static Stats Section */}
<section className="relative z-30 max-w-6xl mx-auto px-4 sm:px-6 -mt-8 md:-mt-16">
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
    {stats.map((stat, idx) => (
      <div 
        key={idx} 
        className="relative bg-white rounded-[1.5rem] sm:rounded-[2.5rem] p-4 sm:p-7 shadow-xl shadow-slate-900/5 border border-slate-100 flex flex-col items-start overflow-hidden transition-transform hover:-translate-y-1 duration-300"
      >
        {/* Subtle Background Accent - Scaled for mobile */}
        <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-orange-50/50 rounded-bl-[2.5rem] sm:rounded-bl-[4rem] -z-0" />

        <div className="relative z-10 w-full">
          {/* Icon Container - Scaled for mobile */}
          <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl sm:rounded-2xl text-white flex items-center justify-center mb-3 sm:mb-6 shadow-lg shadow-orange-900/20">
            {React.cloneElement(stat.icon, { size: 16, className: "sm:w-[20px] sm:h-[20px]" })}
          </div>
          
          {/* Value - Scaled Fluidly */}
          <div className="text-2xl sm:text-4xl font-black text-slate-900 mb-0.5 sm:mb-1 tracking-tighter">
            {stat.value}
          </div>
          
          {/* Label - Tightened for small screens */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-3 h-[2px] sm:w-4 bg-orange-500 rounded-full" />
            <div className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest sm:tracking-[0.2em] truncate">
              {stat.label}
            </div>
          </div>
        </div>

        {/* Informative Sub-description - Hidden on tiny screens to maintain card height balance */}
        <p className="hidden xs:block mt-3 sm:mt-4 text-[9px] sm:text-[11px] text-slate-500 leading-tight sm:leading-relaxed relative z-10">
          Maintaining standards of excellence.
        </p>
      </div>
    ))}
  </div>
</section>

    {/* Vision Section */}
<section className="py-12 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
  <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
    
    {/* Left Side: Content & Feature Grid */}
    <div className="order-2 lg:order-1 text-center lg:text-left">
      <div className="mb-8 sm:mb-10">
        <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 mb-4 text-[9px] sm:text-[10px] font-black tracking-[0.2em] text-orange-600 uppercase bg-orange-50 rounded-full border border-orange-100">
          Future Outlook
        </span>
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 sm:mb-6 leading-[1.1]">
          Empowering Minds, <br />
          <span className="text-orange-600">Enriching Lives.</span>
        </h3>
        <p className="text-sm sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
          Our vision is to bridge traditional education with 21st-century needs through holistic development.
        </p>
      </div>

      {/* Expanded Vision Items - Optimized Padding */}
      <div className="grid gap-3 sm:gap-4 text-left">
        {[
          { title: "Elite Faculty", icon: <Target size={18} />, desc: "Mentors from world-class institutions.", color: "orange" },
          { title: "Holistic Growth", icon: <Zap size={18} />, desc: "Emotional intelligence and academic mastery.", color: "amber" },
          { title: "Infrastructure", icon: <Globe size={18} />, desc: "Smart classrooms and collaborative labs.", color: "orange" }
        ].map((item, i) => (
          <div key={i} className="group flex gap-4 p-4 sm:p-6 rounded-2xl bg-slate-50 border border-transparent transition-all hover:bg-white hover:shadow-xl hover:shadow-orange-900/5 hover:border-slate-100">
            <div className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${i % 2 === 0 ? 'bg-orange-600' : 'bg-amber-600'} text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-101`}>
              {item.icon}
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-sm sm:text-lg mb-0.5">{item.title}</h4>
              <p className="text-slate-500 text-xs sm:text-sm leading-tight sm:leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Right Side: Image Container */}
    <div className="relative order-1 lg:order-2 group px-2 sm:px-0">
      <div className="absolute -inset-6 bg-gradient-to-tr from-orange-100 to-amber-100 rounded-full opacity-40 blur-3xl -z-10"></div>
      
      <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl bg-white p-2 sm:p-3">
        <div className="overflow-hidden rounded-[1.6rem] sm:rounded-[1.8rem]">
          <img 
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1000" 
            className="w-full aspect-square object-cover transition-transform duration-[1.5s] group-hover:scale-100" 
            alt="Innovative Learning"
          />
        </div>

        {/* Scaled Stat Card for Mobile */}
        <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 bg-white/95 backdrop-blur-md p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-xl border border-white/20 -rotate-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-1.5 h-8 sm:h-10 bg-amber-600 rounded-full"></div>
            <div>
<div className="text-lg sm:text-2xl font-black text-slate-900 leading-none">
  {date.getFullYear()}
</div>
              <div className="text-[8px] sm:text-[10px] uppercase font-black text-slate-500 tracking-widest mt-1">Vision Target</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* Mission Section */}
<section className="py-12 sm:py-20 px-3 sm:px-8 max-w-7xl mx-auto">
  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-16 overflow-hidden">
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
      
      <div className="relative group px-2">
        <div className="absolute -inset-2 bg-orange-100/50 rounded-[2.5rem] -rotate-1 -z-10"></div>
        <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl aspect-square sm:aspect-video lg:aspect-square">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            alt="Students collaborating"
          />
        </div>
      </div>

      <div className="flex flex-col text-center lg:text-left items-center lg:items-start">
        <h2 className="text-orange-600 font-black uppercase text-[9px] sm:text-xs tracking-[0.2em] mb-4 bg-white/80 border border-orange-100 w-fit px-3 py-1 rounded-full shadow-sm">
          Our Mission
        </h2>
        <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 sm:mb-6 leading-[1.2]">
          Fostering Excellence <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">Through Innovation.</span>
        </h3>
        <p className="text-slate-600 text-sm sm:text-lg mb-8 sm:mb-10 leading-relaxed font-medium">
          We provide a supportive environment where students lead with integrity.
        </p>

        <div className="grid gap-3 w-full text-left">
          {[
            { title: "Global Perspective", icon: <Globe size={20} />, text: "Preparing for a borderless future." },
            { title: "Agile Learning", icon: <Zap size={20} />, text: "Adapting to new technologies." }
          ].map((item, i) => (
            <div key={i} className="group flex gap-4 p-4 rounded-xl sm:rounded-2xl transition-all hover:bg-white hover:shadow-xl hover:shadow-orange-900/5 border border-transparent">
              <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white text-orange-600 flex items-center justify-center shadow-sm group-hover:bg-orange-600 group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm sm:text-lg">{item.title}</h4>
                <p className="text-slate-500 text-xs sm:text-sm">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>
      
{/* Values Section */}
<section className="py-12 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
  <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
    
    {/* Left Side: Content & Values Grid */}
    <div className="order-2 lg:order-1">
      <div className="mb-8 sm:mb-10 text-center lg:text-left">
        <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 mb-4 text-[9px] sm:text-[10px] font-black tracking-[0.2em] text-orange-700 uppercase bg-orange-50 rounded-full border border-orange-100">
          Our Foundation
        </span>
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 sm:mb-6 leading-[1.1]">
          Character Over <br />
          <span className="text-orange-600 italic">Everything.</span>
        </h3>
        <p className="text-sm sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
          Integrity, Discipline, and Resilience aren't just words here—they are the pillars of our community's DNA.
        </p>
      </div>

      {/* Values Grid - Compact on Mobile */}
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
        {[
          { title: "Integrity", icon: <ShieldCheck size={18} />, desc: "Doing right always." },
          { title: "Discipline", icon: <Clock size={18} />, desc: "Consistency in effort." },
          { title: "Resilience", icon: <TrendingUp size={18} />, desc: "Bouncing back stronger." },
          { title: "Empathy", icon: <Heart size={18} />, desc: "Understanding others." },
          { title: "Innovation", icon: <Lightbulb size={18} />, desc: "Thinking beyond limits." },
          { title: "Leadership", icon: <Users size={18} />, desc: "Inspiring the collective." }
        ].map((val, i) => (
          <div 
            key={i} 
            className="group flex flex-col p-3 sm:p-4 bg-white border border-slate-100 rounded-xl sm:rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-orange-900/5 hover:-translate-y-1 hover:border-orange-100"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300 shrink-0">
                {val.icon}
              </div>
              <span className="font-black text-xs sm:text-sm text-slate-800 tracking-tight">{val.title}</span>
            </div>
            {/* Hidden on very small screens to save space, visible from 'xs' up */}
            <p className="hidden xs:block text-[10px] sm:text-xs text-slate-500 mt-2 ml-11 leading-tight">{val.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Right Side: Image with Mobile-Friendly Scale */}
    <div className="relative order-1 lg:order-2 group">
      {/* Background decoration - dimmed for mobile focus */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-orange-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10"></div>
      
      {/* Main Image Container */}
      <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border-[4px] sm:border-[8px] border-white">
        <img 
          src="https://images.unsplash.com/photo-1511629091441-ee46146481b6?auto=format&fit=crop&q=80&w=1000" 
          className="w-full aspect-square sm:aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-100" 
          alt="Culture and community"
        />
        
        {/* Floating Detail Badge - Scaled for Mobile */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white/95 backdrop-blur-md px-4 py-2 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl border border-white/20">
          <div className="text-orange-600 font-black text-xl sm:text-2xl tracking-tighter">100%</div>
          <div className="text-[8px] sm:text-[10px] uppercase font-black text-slate-500 tracking-widest">Commitment</div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Location Section */}
<section className="py-12 sm:py-24 bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
  <div className="max-w-7xl mx-auto px-4 sm:px-6">
    <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
      
      {/* 1. Contact Card - High Contrast & Mobile Responsive */}
      <div className="lg:col-span-4 group relative overflow-hidden bg-gradient-to-br from-orange-600 to-amber-600 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl shadow-orange-200/50 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2">
        
        {/* Decorative background circle - scaled for mobile */}
        <div className="absolute -top-10 -right-10 w-40 h-40 sm:w-64 sm:h-64 bg-orange-500 rounded-full opacity-40 transition-transform duration-700 group-hover:scale-100"></div>
        
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 mb-4 sm:mb-6 text-[9px] sm:text-[10px] font-black tracking-widest text-orange-100 uppercase bg-orange-700/50 rounded-full border border-orange-400/30">
            Find Us
          </span>
          <h4 className="text-2xl sm:text-3xl font-black text-white mb-6 sm:mb-10 tracking-tight leading-tight">
            Get in <br className="hidden sm:block" /> Touch
          </h4>
          
          <div className="space-y-6 sm:space-y-8">
            <div className="flex gap-4 sm:gap-5 group/item items-start">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-orange-500/50 flex items-center justify-center text-white border border-orange-400/30 group-hover/item:bg-white group-hover/item:text-orange-600 transition-all shadow-lg">
                <MapPin size={20} className="sm:w-[24px] sm:h-[24px]" />
              </div>
              <div>
                <p className="text-orange-100 text-[9px] sm:text-xs uppercase font-black tracking-tighter mb-0.5 sm:mb-1 opacity-80">Campus Address</p>
                <p className="text-white text-sm sm:text-base font-bold leading-snug sm:leading-relaxed">
                  Main School, Mweiga, Nyeri
                </p>
              </div>
            </div>

            <div className="flex gap-4 sm:gap-5 group/item items-start">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-orange-500/50 flex items-center justify-center text-white border border-orange-400/30 group-hover/item:bg-white group-hover/item:text-orange-600 transition-all shadow-lg">
                <Phone size={20} className="sm:w-[24px] sm:h-[24px]" />
              </div>
              <div>
                <p className="text-orange-100 text-[9px] sm:text-xs uppercase font-black tracking-tighter mb-0.5 sm:mb-1 opacity-80">Direct Line</p>
                <p className="text-white text-sm sm:text-base font-bold">+254 123 456 789</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-8 sm:mt-12">
          <button className="w-full py-3 sm:py-4 bg-white text-orange-600 font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-xl hover:bg-orange-50 active:scale-95 transition-all flex items-center justify-center gap-2 group uppercase tracking-wider">
            Google Maps
            <ExternalLink size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </div>
      </div>

      {/* 2. Map Container - Fully Optimized */}
      <div className="lg:col-span-8 group relative bg-white rounded-[2rem] sm:rounded-[2.5rem] p-3 sm:p-4 border border-slate-200 shadow-xl shadow-slate-200/40 transition-all duration-500 hover:border-orange-200">
        
        <div className="flex items-center justify-between mb-3 sm:mb-4 px-2 sm:px-4 pt-1 sm:pt-2">
          <h3 className="text-sm sm:text-lg lg:text-xl font-black text-slate-900 flex items-center gap-2 tracking-tight uppercase">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Interactive Map
          </h3>
          
          <div className="hidden xs:flex gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100"></div>
            <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100"></div>
          </div>
        </div>
        
        <div className="relative h-[280px] sm:h-[400px] lg:h-full min-h-[280px] sm:min-h-[400px] rounded-[1.5rem] sm:rounded-[1.8rem] overflow-hidden border border-slate-100 shadow-inner">
          <div className="absolute inset-0 transition-transform duration-[2000ms] group-hover:scale-100">
            <MapComponent />
          </div>
          
          <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-2xl border border-white/10">
            <p className="text-[8px] sm:text-[10px] font-black text-white uppercase tracking-widest">
              Mweiga, Nyeri
            </p>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

      {/* Modern Institutional Section - Refined Small Text Edition */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 overflow-hidden bg-gradient-to-br from-orange-950 via-amber-950 to-red-950">
        <div className="relative w-full bg-[#1a0f0a] rounded-[2rem] md:rounded-[3.5rem] p-8 sm:p-12 md:p-16 text-center border border-white/5 shadow-2xl overflow-hidden">
        
          {/* Small Refined Icon */}
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="relative p-4 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl">
              <ShieldCheck className="text-orange-400 w-6 h-6 md:w-7 md:h-7" />
            </div>
          </div>

          <div className="relative z-10 w-full">
            {/* Title - Reduced to Original Proportions */}
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-black text-white mb-6 md:mb-10 tracking-tighter leading-[1.1] md:leading-[0.95] max-w-4xl mx-auto">
              Integrity & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-white/70">Wellbeing.</span>
            </h2>
            
            {/* Info Grid - Text sizes back to sm/base */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-10 md:mb-16 max-w-5xl mx-auto text-left items-start border-t border-white/5 pt-8 md:pt-12">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-orange-500 rounded-full" />
                  <h4 className="text-orange-400 font-black text-[10px] uppercase tracking-[0.2em]">Institutional Policy</h4>
                </div>
                <p className="text-white text-base md:text-lg leading-tight font-bold">
                  Standardizing excellence through discipline.
                </p>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
                  Our institutional policies ensure a focused environment. We uphold a strict code of conduct that prioritizes academic integrity and mutual respect as the bedrock of our campus culture.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-amber-500 rounded-full" />
                  <h4 className="text-amber-400 font-black text-[10px] uppercase tracking-[0.2em]">Guidance & Counselling</h4>
                </div>
                <p className="text-white text-base md:text-lg leading-tight font-bold">
                  Nurturing the mind beyond the classroom.
                </p>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
                  Through professional Guidance and Counselling, we provide students with the emotional tools and support necessary to navigate the challenges of global leadership and personal growth.
                </p>
              </div>
            </div>

{/* SECONDARY ACTION ROW - Constrained Width & Modern Tracking */}
<div className="flex flex-row gap-3 sm:gap-6 justify-center items-center w-full px-4 mt-6">
  
  {/* Link width is now 'fit-content' (auto) instead of flex-1 */}
  <Link href="/pages/TermsandPrivacy" className="w-auto">
    <button className="px-5 sm:px-10 py-3.5 bg-white text-slate-950 font-black text-[9px] sm:text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-white/5 active:scale-95 flex items-center justify-center gap-2 transition-all hover:bg-slate-50 whitespace-nowrap border border-white">
      Policies <ArrowRight size={14} className="shrink-0 opacity-70" />
    </button>
  </Link>

  <Link href="/pages/Guidance-and-Coucelling" className="w-auto">
    <button className="px-5 sm:px-10 py-3.5 bg-slate-900/40 text-white font-black text-[9px] sm:text-[11px] uppercase tracking-[0.2em] rounded-2xl border border-white/20 backdrop-blur-md active:scale-95 transition-all hover:bg-white/10 whitespace-nowrap">
      Guidance
    </button>
  </Link>
  
</div>

            {/* Stats Grid - Reduced Sizes */}
            <div className="pt-8 border-t border-white/5 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                { label: 'Safety Rating', val: '100%' },
                { label: 'Student Support', val: '24/7' },
                { label: 'Certified Mentors', val: '15+' },
                { label: 'Ethics Standard', val: 'Gold' }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <span className="text-xl md:text-3xl font-black text-white tracking-tighter">{stat.val}</span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-orange-400/80 font-bold mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}