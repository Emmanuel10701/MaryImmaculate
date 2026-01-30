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
            className="object-cover opacity-50 transition-transform duration-[10s] ease-out group-hover:scale-110"
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
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-none">
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
      <section className="relative z-30 max-w-6xl mx-auto px-6 -mt-12 md:-mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="relative bg-white rounded-[2.5rem] p-7 shadow-xl shadow-slate-900/5 border border-slate-100 flex flex-col items-start overflow-hidden"
            >
              {/* Subtle Background Accent (Static) */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50/50 rounded-bl-[4rem] -z-0" />

              <div className="relative z-10 w-full">
                {/* Static Icon Container */}
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl text-white flex items-center justify-center mb-6 shadow-lg shadow-orange-900/20">
                  {React.cloneElement(stat.icon, { size: 20 })}
                </div>
                
                {/* Value with tightened tracking */}
                <div className="text-4xl font-black text-slate-900 mb-1 tracking-tighter">
                  {stat.value}
                </div>
                
                {/* Label with modern styling */}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-[2px] bg-orange-500 rounded-full" />
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    {stat.label}
                  </div>
                </div>
              </div>

              {/* Informative Sub-description */}
              <p className="mt-4 text-[11px] text-slate-500 leading-relaxed relative z-10">
                Consistently maintaining high standards of excellence across all departments.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Content & Feature Grid */}
          <div className="order-2 lg:order-1">
            <div className="mb-10">
              <span className="inline-block px-4 py-1.5 mb-4 text-[10px] font-bold tracking-[0.2em] text-orange-600 uppercase bg-orange-50 rounded-full border border-orange-100">
                Future Outlook
              </span>
              <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-[1.15]">
                Empowering Minds, <br />
                <span className="text-orange-600">Enriching Lives.</span>
              </h3>
              <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                Our vision is to bridge traditional education with 21st-century needs through holistic development, creating a launchpad for the next generation of global thinkers.
              </p>
            </div>

            {/* Expanded Vision Items */}
            <div className="grid gap-4 sm:grid-cols-1">
              {[
                { 
                  title: "Elite Faculty", 
                  icon: <Target size={20} />, 
                  desc: "Mentors from world-class institutions and industry giants.",
                  color: "orange"
                },
                { 
                  title: "Holistic Growth", 
                  icon: <Zap size={20} />, 
                  desc: "Focusing on emotional intelligence alongside academic mastery.",
                  color: "amber"
                },
                { 
                  title: "Modern Infrastructure", 
                  icon: <Globe size={20} />, 
                  desc: "Smart classrooms and labs designed for collaborative research.",
                  color: "orange"
                }
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="group flex gap-5 p-6 rounded-[2rem] bg-slate-50 border border-transparent transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-orange-900/5 hover:border-slate-100"
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-2xl ${i % 2 === 0 ? 'bg-orange-600' : 'bg-amber-600'} text-white flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-1">{item.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Image with Dynamic Zoom & Floating Elements */}
          <div className="relative order-1 lg:order-2 group">
            {/* Decorative Gradient Glow */}
            <div className="absolute -inset-10 bg-gradient-to-tr from-orange-100 to-amber-100 rounded-full opacity-40 blur-3xl group-hover:opacity-60 transition-opacity duration-700 -z-10"></div>
            
            {/* Image Container with Zoom */}
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl bg-white p-3">
              <div className="overflow-hidden rounded-[1.8rem]">
                <img 
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1000" 
                  className="w-full aspect-square object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110" 
                  alt="Innovative Learning"
                />
              </div>

              {/* Floating Stat Card (Bottom Left) */}
              <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/20 transform -rotate-3 group-hover:rotate-0 transition-all duration-500">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-10 bg-amber-600 rounded-full"></div>
                  <div>
                    <div className="text-2xl font-black text-slate-900 leading-none">{new Date().getFullYear()} </div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-1">Vision Target</div>
                  </div>
                </div>
              </div>

              {/* Floating Badge (Top Right) */}
              <div className="absolute top-10 right-10 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center p-1 transform group-hover:scale-110 transition-transform duration-500">
                <div className="w-full h-full rounded-full border-2 border-dashed border-amber-200 animate-spin-slow absolute"></div>
                <Sparkles className="text-amber-600 w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-[2.5rem] p-8 md:p-16 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* 1. Image Side: Modernized with Zoom and Floating Effects */}
            <div className="relative group">
              {/* Decorative background shape */}
              <div className="absolute -inset-4 bg-orange-100/50 rounded-[3rem] -rotate-2 group-hover:rotate-1 transition-transform duration-500 -z-10"></div>
              
              {/* Image Container with Zoom */}
              <div className="relative overflow-hidden rounded-[2rem] shadow-2xl aspect-square sm:aspect-video lg:aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" 
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110" 
                  alt="Students collaborating"
                />
                {/* Subtle Glassmorphism Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>

            {/* 2. Content Side: Modernized Text and New Items */}
            <div className="flex flex-col">
              <h2 className="text-orange-600 font-bold uppercase text-xs tracking-[0.2em] mb-4 bg-orange-50 w-fit px-3 py-1 rounded-full">
                Our Mission
              </h2>
              <h3 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Fostering Excellence <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                  Through Innovation.
                </span>
              </h3>
              <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                We provide a supportive environment where students solve real-world problems and lead with integrity in an ever-changing landscape.
              </p>

              {/* Dynamic Item List */}
              <div className="grid gap-4">
                {/* Item 1 */}
                <div className="group flex gap-5 p-5 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-orange-900/5 border border-transparent hover:border-slate-100">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                    <Globe size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Global Perspective</h4>
                    <p className="text-slate-500 text-sm">Preparing students for a connected, borderless future.</p>
                  </div>
                </div>

                {/* Item 2 - New Added Item */}
                <div className="group flex gap-5 p-5 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-orange-900/5 border border-transparent hover:border-slate-100">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                    <Zap size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Agile Learning</h4>
                    <p className="text-slate-500 text-sm">Adapting quickly to new technologies and methodologies.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Content & Values Grid */}
          <div className="order-2 lg:order-1">
            <div className="mb-10">
              <span className="inline-block px-4 py-1.5 mb-4 text-[10px] font-bold tracking-[0.2em] text-orange-700 uppercase bg-orange-50 rounded-full border border-orange-100">
                Our Foundation
              </span>
              <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                Character Over <br />
                <span className="text-orange-600 italic">Everything.</span>
              </h3>
              <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                Integrity, Discipline, and Resilience aren't just words here—they are the pillars of the Mary Immaculate experience and the DNA of our community.
              </p>
            </div>

            {/* Expanded Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Integrity", icon: <ShieldCheck size={20} />, desc: "Doing right always." },
                { title: "Discipline", icon: <Clock size={20} />, desc: "Consistency in effort." },
                { title: "Resilience", icon: <TrendingUp size={20} />, desc: "Bouncing back stronger." },
                { title: "Empathy", icon: <Heart size={20} />, desc: "Understanding others." },
                { title: "Innovation", icon: <Lightbulb size={20} />, desc: "Thinking beyond limits." },
                { title: "Leadership", icon: <Users size={20} />, desc: "Inspiring the collective." }
              ].map((val, i) => (
                <div 
                  key={i} 
                  className="group flex flex-col p-4 bg-white border border-slate-100 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-orange-900/5 hover:-translate-y-1 hover:border-orange-100"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 rounded-lg bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                      {val.icon}
                    </div>
                    <span className="font-bold text-slate-800">{val.title}</span>
                  </div>
                  <p className="text-xs text-slate-500 ml-11">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Image with Zoom Effect */}
          <div className="relative order-1 lg:order-2 group">
            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10"></div>
            
            {/* Main Image Container */}
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl border-[8px] border-white">
              <img 
                src="https://images.unsplash.com/photo-1511629091441-ee46146481b6?auto=format&fit=crop&q=80&w=1000" 
                className="w-full aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-110" 
                alt="Culture and community"
              />
              
              {/* Floating Detail Badge */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-white/20 transform group-hover:-translate-y-2 transition-transform duration-500">
                <div className="text-orange-600 font-black text-2xl tracking-tighter">100%</div>
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Commitment</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-24 bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            
            {/* 1. Contact Card - High Contrast */}
            <div className="lg:col-span-4 group relative overflow-hidden bg-gradient-to-br from-orange-600 to-amber-600 p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-orange-200 flex flex-col justify-between transition-transform duration-500 hover:-translate-y-2">
              {/* Decorative background circle */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500 rounded-full opacity-50 transition-transform duration-700 group-hover:scale-150"></div>
              
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 mb-6 text-[10px] font-bold tracking-widest text-orange-100 uppercase bg-orange-700/50 rounded-full border border-orange-400/30">
                  Find Us
                </span>
                <h4 className="text-3xl font-extrabold text-white mb-10 tracking-tight">Get in Touch</h4>
                
                <div className="space-y-8">
                  <div className="flex gap-5 group/item">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-orange-500/50 flex items-center justify-center text-white border border-orange-400/30 group-hover/item:bg-white group-hover/item:text-orange-600 transition-all">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-orange-100 text-xs uppercase font-bold tracking-tighter mb-1">Campus Address</p>
                      <p className="text-white font-medium leading-relaxed">
                        Main Campus, Mweiga, Nyeri<br />Mary Immaculate Girls Secondary
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-5 group/item">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-orange-500/50 flex items-center justify-center text-white border border-orange-400/30 group-hover/item:bg-white group-hover/item:text-orange-600 transition-all">
                      <Phone size={24} />
                    </div>
                    <div>
                      <p className="text-orange-100 text-xs uppercase font-bold tracking-tighter mb-1">Direct Line</p>
                      <p className="text-white font-medium">+254 123 456 789</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-12">
                <button className="w-full py-4 bg-white text-orange-600 font-bold rounded-2xl shadow-lg hover:bg-orange-50 active:scale-95 transition-all flex items-center justify-center gap-2 group">
                  Open in Google Maps
                  <ExternalLink size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              </div>
            </div>

            {/* 2. Map Container - Zoom Responsive */}
            <div className="lg:col-span-8 group relative bg-white rounded-[2.5rem] p-4 border border-slate-200 shadow-xl shadow-slate-200/50 transition-all duration-500 hover:border-orange-200">
              <div className="flex items-center justify-between mb-4 px-4 pt-2">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  Interactive Map
                </h3>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100"></div>
                  <div className="w-8 h-8 rounded-lg bg-slate-100"></div>
                </div>
              </div>
              
              {/* The "Zoom" effect is handled by overflow-hidden on the parent and scale on the child */}
              <div className="relative h-[400px] lg:h-full min-h-[400px] rounded-[1.8rem] overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105">
                  <MapComponent />
                </div>
                
                {/* Modern Floating Map Overlay */}
                <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/20 hidden md:block">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mweiga, Nyeri</p>
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 md:mb-10 tracking-tighter leading-[1.1] md:leading-[0.95] max-w-4xl mx-auto">
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

         {/* SECONDARY ACTION ROW - Fixed Flex & Modern Tracking */}
<div className="flex flex-row gap-2 sm:gap-4 justify-center items-center w-full max-w-full px-2 overflow-hidden">
  
  <Link href="/pages/TermsandPrivacy" className="flex-1 sm:w-auto">
    <button className="w-full px-3 sm:px-8 py-3 bg-white text-slate-950 font-black text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.1em] sm:tracking-[0.15em] rounded-xl shadow-lg active:scale-95 flex items-center justify-center gap-1.5 transition-all whitespace-nowrap">
      Policies <ArrowRight size={14} className="shrink-0" />
    </button>
  </Link>

  <Link href="/pages/Guidance-and-Coucelling" className="flex-1 sm:w-auto">
    <button className="w-full px-3 sm:px-8 py-3 bg-slate-900/40 text-white font-black text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.1em] sm:tracking-[0.15em] rounded-xl border border-white/10 backdrop-blur-md active:scale-95 transition-all whitespace-nowrap">
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