import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Target, 
  Users, 
  Zap, 
  ChevronRight, 
  Phone, 
  Mail, 
  MapPin, 
  Menu, 
  X,
  Award,
  Heart,
  ArrowRight,
  Play
} from 'lucide-react';

import { AdminLayout } from './admin/AdminLayout';
import { Login } from './admin/Login';
import { Players } from './admin/Players';
import { Categories } from './admin/Categories';
import { Tiesheets } from './admin/Tiesheets';
import { ReportExport } from './admin/ReportExport';

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Our Courses', href: '#courses' },
    { 
      name: 'Verify Us', 
      href: '#',
      dropdown: [
        { name: 'Certificate Verification', href: '#' },
      ]
    },
    { name: 'Poom / Dan Check', href: '#' },
    { 
      name: 'Updates', 
      href: '#',
      dropdown: [
        { name: 'Latest News', href: '#news' },
        { name: 'Gallery', href: '#' },
        { name: 'Events >', href: '#' },
        { name: 'Documents & Download', href: '#' },
        { name: 'Upcoming Training Camps', href: '#' },
      ]
    },
    { 
      name: 'Login', 
      href: '#',
      dropdown: [
        { name: 'Portal Admin Login', href: '/admin/login' },
        { name: 'Dashboard Admin Login', href: '/admin/login' },
        { name: 'Coach Login', href: '/admin/login' },
        { name: 'Player Login', href: '/admin/login' },
        { name: 'Webmail Login', href: '/admin/login' },
      ]
    },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-red-600 p-2 rounded-lg mr-2">
              <Shield className="text-white w-6 h-6" />
            </div>
            <span className={`text-xl font-bold tracking-tight ${scrolled ? 'text-gray-900' : 'text-white'}`}>MDTA</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6 lg:space-x-8 items-center">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                <a 
                  href={link.href}
                  className={`flex items-center text-sm font-medium transition-colors hover:text-green-500 py-4 ${scrolled ? 'text-gray-900' : 'text-white/90'}`}
                >
                  {link.name}
                  {link.dropdown && <ChevronRight className="w-4 h-4 ml-1 rotate-90 transition-transform group-hover:-rotate-90" />}
                </a>

                {/* Dropdown Menu */}
                {link.dropdown && (
                  <div className="absolute top-full left-0 hidden group-hover:block min-w-[240px] bg-[#f0f0f0] shadow-lg rounded-sm py-2 border-t-4 border-green-500 z-50">
                    {link.dropdown.map((dropLink, idx) => (
                      dropLink.href.startsWith('/') ? (
                        <Link 
                          key={idx}
                          to={dropLink.href}
                          className="block px-6 py-3 text-sm text-gray-700 hover:text-green-600 transition-colors border-b border-gray-200/50 last:border-0"
                        >
                          {dropLink.name}
                        </Link>
                      ) : (
                        <a 
                          key={idx}
                          href={dropLink.href}
                          className="block px-6 py-3 text-sm text-gray-700 hover:text-green-600 transition-colors border-b border-gray-200/50 last:border-0"
                        >
                          {dropLink.name}
                        </a>
                      )
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
             <button className={`${scrolled ? 'text-gray-900' : 'text-white'} hover:text-green-500 transition-colors`}>
                <svg xmlns="http://www.w3.org/0000000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
             </button>
             <button className={`${scrolled ? 'text-gray-900' : 'text-white'} hover:text-green-500 transition-colors md:hidden lg:block`}>
                 <Menu className="w-6 h-6" />
             </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
             <button className={scrolled ? 'text-gray-900' : 'text-white'}>
                <svg xmlns="http://www.w3.org/0000000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
             </button>
            <button onClick={() => setIsOpen(!isOpen)} className={scrolled ? 'text-gray-900' : 'text-white'}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#f0f0f0] border-b border-gray-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <a 
                    href={link.href}
                    className="flex justify-between items-center px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-200 rounded-md"
                    onClick={(e) => {
                      if(link.dropdown) e.preventDefault();
                      else setIsOpen(false);
                    }}
                  >
                    {link.name}
                    {link.dropdown && <ChevronRight className="w-4 h-4" />}
                  </a>
                  {link.dropdown && (
                    <div className="pl-6 space-y-1 mt-1 border-l-2 border-green-500/30 ml-3">
                       {link.dropdown.map((dropLink, idx) => (
                         dropLink.href.startsWith('/') ? (
                           <Link 
                             key={idx}
                             to={dropLink.href}
                             onClick={() => setIsOpen(false)}
                             className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-md"
                           >
                             {dropLink.name}
                           </Link>
                         ) : (
                           <a 
                             key={idx}
                             href={dropLink.href}
                             onClick={() => setIsOpen(false)}
                             className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-md"
                           >
                             {dropLink.name}
                           </a>
                         )
                       ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#000000]">
      {/* Background Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=2000" 
          alt="Taekwondo training" 
          className="w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/80 via-[#000000]/60 to-[#000000]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 pb-40">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="text-[56px] md:text-[64px] lg:text-[76px] font-sans font-bold text-white leading-[1.05] mb-2 tracking-wide uppercase shadow-black drop-shadow-lg">
            BECOME <br/>
            UNSTOPPABLE
          </h1>
          <h2 className="text-[20px] md:text-[24px] lg:text-[28px] text-gray-200 font-normal mb-6 tracking-wide font-sans">
            Master the Art of Self Defense
          </h2>
          <p className="text-gray-400 mb-10 font-medium text-[12px] md:text-[14px] flex items-center gap-3 tracking-wider">
            Discipline <span className="text-[#ff1a1a]">•</span> Power <span className="text-[#ff1a1a]">•</span> Confidence
          </p>
          <div className="flex flex-row gap-4">
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#ff1a1a] hover:bg-red-500 text-white px-8 py-3 rounded-full text-[15px] font-medium tracking-wide flex items-center justify-center transition-all shadow-[0_0_20px_rgba(255,26,26,0.4)]"
            >
              Apply Now
            </button>
            <button 
              onClick={() => setIsVideoOpen(true)}
              className="bg-transparent hover:bg-white/5 text-gray-300 hover:text-white border border-gray-500 px-8 py-3 rounded-full text-[15px] font-medium tracking-wide flex items-center justify-center transition-all"
            >
              Watch Demo
            </button>
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(255,0,0,0.3)] border border-[#FF0000]/50">
              <button 
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-[#FF0000] p-2 rounded-full text-white backdrop-blur-md transition-all shadow-[0_0_15px_rgba(255,0,0,0.5)]"
              >
                <X className="w-6 h-6" />
              </button>
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Stats Bar */}
      <div className="absolute bottom-12 md:bottom-16 left-0 right-0 z-20">
        <div className="max-w-[1050px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col md:flex-row items-center justify-between bg-[#111111]/90 backdrop-blur-xl border border-white/5 rounded-[24px] relative py-5 md:py-6 px-6 shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
          >
            {/* Top red glow line like in reference */}
            <div className="absolute top-0 left-[20%] w-[120px] h-[2px] bg-[#ff1a1a] shadow-[0_0_20px_4px_rgba(255,26,26,0.8)]"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 w-full divide-x divide-white/5">
              {[
                { label: 'Active Students', value: '1000+', icon: <Users className="w-[24px] h-[24px] text-[#ff1a1a]" strokeWidth={1.5} /> },
                { label: 'Expert Trainers', value: '25+', icon: <Users className="w-[24px] h-[24px] text-[#ff1a1a]" strokeWidth={1.5} /> },
                { label: 'Years Excellence', value: '15+', icon: <Award className="w-[24px] h-[24px] text-[#ff1a1a]" strokeWidth={1.5} /> },
                { label: 'Championships', value: '75+', icon: <Award className="w-[24px] h-[24px] text-[#ff1a1a]" strokeWidth={1.5} /> },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-center gap-4 py-2 px-2">
                  <div className="flex-shrink-0 opacity-80">{stat.icon}</div>
                  <div className="flex flex-col text-left">
                    <div className="text-[20px] md:text-[24px] font-bold text-white tracking-wide leading-none mb-1 shadow-black drop-shadow-md">{stat.value}</div>
                    <div className="text-[11px] md:text-[12px] text-gray-400 tracking-wide font-normal">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const WhyChooseUs = () => {
  const features = [
    { icon: <Shield className="w-6 h-6" />, title: 'CERTIFIED MASTERS', desc: 'Train Under Elite International Instructors' },
    { icon: <Target className="w-6 h-6" />, title: 'OLYMPIC TRAINING STANDARDS', desc: 'Olympic Training Solutions' },
    { icon: <Zap className="w-6 h-6" />, title: 'MODERN EQUIPMENT', desc: 'Build strength, speed, endurance' },
    { icon: <Users className="w-6 h-6" />, title: 'FLEXIBLE BATCHES', desc: 'Strong Batches, Superlative Training' },
  ];

  return (
    <section id="about" className="pt-20 pb-20 bg-[#050505] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-[28px] font-bold text-white tracking-widest uppercase drop-shadow-[0_0_20px_rgba(255,26,26,0.4)] font-sans">
            WHY CHOOSE US
          </h2>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="w-full lg:w-[50%] xl:w-[45%] relative rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(255,26,26,0.05)] border border-white/5"
          >
            <div className="absolute inset-0 bg-[#ff1a1a]/5 mix-blend-overlay hover:bg-transparent transition-all duration-500"></div>
            <img 
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000" 
              alt="Athlete holding trophy" 
              className="w-full h-[400px] object-cover grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <div className="w-full lg:w-[50%] xl:w-[55%] space-y-6">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ x: 10 }}
                className="flex items-center gap-5 p-2 transition-all mt-3"
              >
                <div className="w-[52px] h-[52px] rounded-full border border-white/10 shadow-[inset_0_0_15px_rgba(255,26,26,0.3)] flex items-center justify-center flex-shrink-0 relative bg-[radial-gradient(ellipse_at_center,rgba(255,26,26,0.2)_0%,rgba(0,0,0,0)_70%)]">
                  <div className="text-[#ff1a1a] opacity-80 backdrop-blur-sm">
                    {f.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-[14px] md:text-[15px] font-bold text-white tracking-wide uppercase leading-snug">
                    {f.title} <span className="text-gray-400 font-normal normal-case">- {f.desc}</span>
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const TrainingPrograms = () => {
  const programs = [
    { title: 'TAEKWONDO', image: 'https://images.unsplash.com/photo-1509563268479-0f004cf3f58b?auto=format&fit=crop&q=80&w=800', desc: 'Traditional Korean martial art for all.' },
    { title: 'MMA / Self Defense', image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=800', desc: 'Practical combat for street awareness.' },
    { title: 'Fitness Training', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800', desc: 'Build strength, speed, and endurance.' },
    { title: 'Yoga', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800', desc: 'Mindful movement for balance and flexibility.' },
  ];

  return (
    <section id="courses" className="pt-20 pb-20 bg-[#050505]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-[24px] md:text-[28px] font-bold text-white mb-2 tracking-wide font-sans drop-shadow-[0_0_15px_rgba(255,26,26,0.4)]">
            Our Elite Training Programs
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {programs.map((p, i) => (
            <motion.div 
              key={i} 
              whileHover={{ scale: 1.02, y: -5 }}
              className={`group cursor-pointer bg-[#151515] rounded-[24px] overflow-hidden border transition-all duration-300 relative pb-5 flex flex-col justify-start
                ${i === 1 ? 'border-[#ff1a1a] shadow-[0_0_25px_rgba(255,26,26,0.3),inset_0_0_15px_rgba(255,26,26,0.1)]' : 'border-white/10 hover:border-[#ff1a1a]/40 hover:shadow-[0_0_20px_rgba(255,26,26,0.15)]'}
              `}
            >
              <div className="h-[200px] overflow-hidden m-2 rounded-[18px] relative bg-[#111]">
                <img 
                  src={p.image} 
                  alt={p.title} 
                  className={`w-full h-full object-cover relative z-0 ${i === 1 ? 'grayscale-0' : 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'} transition-all duration-500`}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="px-5 pt-3 relative z-20">
                <h3 className="text-[16px] xl:text-[17px] font-bold text-white mb-1 tracking-wide group-hover:text-[#ff1a1a] transition-colors drop-shadow-sm">{p.title}</h3>
                <p className="text-gray-400 text-[12px] xl:text-[13px] leading-[1.4] font-medium">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const NewsAndContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: 'Select Course',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const newsItems = [
    { title: 'New Batch for Kids Starting Soon', date: 'March 10, 2026', category: 'Admission', desc: 'Enroll now for beginner-level taekwondo training.' },
    { title: 'MDTA Students Win Gold at State Level', date: 'February 28, 2026', category: 'Achievement', desc: 'Our students secured top positions in state championship.' },
    { title: 'District Taekwondo Championship 2026', date: 'March 15, 2026', category: 'Event', desc: 'MDTA to host district-level competition for all categories.' },
  ];

  return (
    <section id="news" className="pt-10 pb-20 bg-[#050505] relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* Latest News Side */}
          <div className="lg:w-[58%] flex flex-col justify-start">
            <div className="text-center lg:text-left mb-8 w-full">
              <h2 className="text-[26px] md:text-[32px] font-bold text-white mb-2 tracking-wide font-sans drop-shadow-[0_0_15px_rgba(255,26,26,0.3)]">
                LATEST NEWS & UPDATES
              </h2>
              <p className="text-gray-400 text-[13px] md:text-[15px] font-medium">Stay updated with the latest happenings at MDTA</p>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-5">
              {newsItems.map((item, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  className={`bg-[#151515] p-5 rounded-[20px] border transition-all group flex flex-col justify-between min-h-[260px]
                    ${i === 1 ? 'border-[#ff1a1a] shadow-[0_0_25px_rgba(255,26,26,0.15),inset_0_0_15px_rgba(255,26,26,0.05)]' : 'border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.02)] hover:border-[#ff1a1a]/40 hover:shadow-[0_0_20px_rgba(255,26,26,0.1)]'}
                  `}
                >
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wide mb-5 border transition-colors
                      ${i === 1 ? 'bg-[#ff1a1a]/10 text-[#ff1a1a] border-[#ff1a1a]/30' : 'bg-transparent text-gray-400 border-white/10 group-hover:border-[#ff1a1a]/30'}
                    `}>
                      {item.category}
                    </span>
                    <h3 className="text-[14px] md:text-[16px] font-bold text-white mb-3 leading-[1.4] group-hover:text-[#ff1a1a] transition-colors drop-shadow-sm">{item.title}</h3>
                    <p className="text-[11px] md:text-[12px] text-gray-400 mb-6 leading-[1.6] font-medium">{item.desc}</p>
                  </div>
                  <div className="flex items-center text-gray-500 text-[11px] mt-auto font-medium">
                    <svg xmlns="http://www.w3.org/0000000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    {item.date}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Form Side */}
          <div id="contact" className="lg:w-[42%] flex pt-12 lg:pt-0 pl-0 lg:pl-4">
            <div className="w-full bg-[#151515] border border-white/10 p-8 rounded-[24px] shadow-[0_0_40px_rgba(0,0,0,0.8),inset_0_0_30px_rgba(255,26,26,0.02)] relative overflow-hidden flex flex-col justify-center transition-all hover:border-[#ff1a1a]/30 hover:shadow-[0_0_30px_rgba(255,26,26,0.1)]">
              
              <h3 className="text-[22px] md:text-[26px] font-bold text-white mb-8 text-center drop-shadow-md">Contact Us</h3>
              
              <form action="https://formsubmit.co/saabhisaabhishek@gmail.com" method="POST" className="space-y-4 relative z-10 w-full mx-auto">
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_subject" value="New Website Contact!" />
                <input type="hidden" name="_template" value="table" />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-white/5 hover:border-[#ff1a1a]/40 text-white focus:ring-1 focus:ring-[#ff1a1a] focus:border-[#ff1a1a] outline-none transition-all text-[13px] placeholder-gray-500 rounded-[14px]"
                      placeholder="Full Name"
                    />
                  </div>
                  <div>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-white/5 hover:border-[#ff1a1a]/40 text-white focus:ring-1 focus:ring-[#ff1a1a] focus:border-[#ff1a1a] outline-none transition-all text-[13px] placeholder-gray-500 rounded-[14px]"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-white/5 hover:border-[#ff1a1a]/40 text-white focus:ring-1 focus:ring-[#ff1a1a] focus:border-[#ff1a1a] outline-none transition-all text-[13px] placeholder-gray-500 rounded-[14px]"
                      placeholder="Email Address"
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      name="message_small"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-white/5 hover:border-[#ff1a1a]/40 text-white focus:ring-1 focus:ring-[#ff1a1a] focus:border-[#ff1a1a] outline-none transition-all text-[13px] placeholder-gray-500 rounded-[14px]"
                      placeholder="Message"
                    />
                  </div>
                </div>
                <div className="relative mt-3 flex items-center gap-2 px-2">
                  <div className="w-2 h-2 rounded-full bg-[#ff1a1a] shadow-[0_0_10px_#ff1a1a]"></div>
                  <span className="text-[12px] text-gray-300 font-medium tracking-wide">Select Course</span>
                </div>
                <div>
                  <textarea 
                    name="message"
                    rows={4}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-4 bg-black/40 border border-white/5 hover:border-[#ff1a1a]/40 text-white rounded-[16px] focus:ring-1 focus:ring-[#ff1a1a] focus:border-[#ff1a1a] outline-none transition-all text-[13px] placeholder-gray-600 resize-none"
                    placeholder="Message"
                  ></textarea>
                </div>
                <div className="pt-4 flex justify-center">
                  <button 
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-transparent hover:bg-[#ff1a1a]/10 hover:border-[#ff1a1a] text-white border border-[#ff1a1a] px-12 py-3 rounded-full text-[14px] font-bold transition-all shadow-[0_0_15px_rgba(255,26,26,0.2)] hover:shadow-[0_0_25px_rgba(255,26,26,0.4)] flex items-center justify-center tracking-wide"
                  >
                    Contact Us
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#000000] text-white py-12 border-t border-white/10 relative shadow-[0_-10px_30px_rgba(255,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center">
            <div className="bg-[#FF0000]/10 p-2 rounded-lg mr-3 border border-[#FF0000]/30 shadow-[0_0_15px_rgba(255,0,0,0.3)]">
              <Shield className="text-[#FF0000] w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-widest text-white">MDTA</span>
          </div>
          
          <div className="flex space-x-6">
            {/* Socials */}
            {['facebook', 'instagram', 'twitter', 'youtube'].map((social, i) => (
              <a key={i} href="#" className="w-10 h-10 bg-[#151515] rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#FF0000]/20 hover:border hover:border-[#FF0000]/50 hover:shadow-[0_0_20px_rgba(255,0,0,0.5)] transition-all">
                {/* Simplified placeholder icons since lucide doesn't have specific brand icons by default out of the box without importing them individually, using initial */}
                <span className="uppercase text-xs font-bold">{social[0]}</span>
              </a>
            ))}
          </div>

          <div className="flex flex-col items-center md:items-end text-sm text-gray-400 space-y-2 font-medium">
            <div className="flex items-center hover:text-[#FF0000] transition-colors">
              <Phone className="w-4 h-4 mr-2 text-[#FF0000]" />
              +91 9101112229
            </div>
            <div className="flex items-center hover:text-[#FF0000] transition-colors text-right max-w-xs">
              <MapPin className="w-4 h-4 mr-2 text-[#FF0000] shrink-0" />
              Sheetal Nagar, Ward No. 19, Maharajganj, UP 273303
            </div>
          </div>

        </div>
        
        <div className="mt-12 pt-6 border-t border-white/10 text-center text-gray-600 text-xs tracking-wide">
          <p>© {new Date().getFullYear()} Maharajganj District Taekwondo Association. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

const LandingPage = () => (
  <div className="font-sans selection:bg-red-500/30 selection:text-white bg-[#050505]">
    <Navbar />
    <main>
      <Hero />
      <WhyChooseUs />
      <TrainingPrograms />
      <NewsAndContact />
    </main>
    <Footer />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/admin/login" element={<Login />} />
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Players />} />
            <Route path="categories" element={<Categories />} />
            <Route path="tiesheets" element={<Tiesheets />} />
            <Route path="reports" element={<ReportExport />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
