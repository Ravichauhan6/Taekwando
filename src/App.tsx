import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Globe, Users, Newspaper, Bell, LogOut, Shield, Award, Building, Building2, Image as ImageIcon, FileText, Settings, Trophy, MapPin, Quote, Target, Zap, ChevronRight, Phone, Mail, Menu, X, ArrowRight, Play, CheckCircle, Check, Heart, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import heroBg from './assets/hero-bg.png';
import tcImg from './assets/tc.jpg';
import sfImg from './assets/sf.jpg';
import ticImg from './assets/tic.jpeg';

import { AdminLayout } from './admin/AdminLayout';
import { Login } from './admin/Login';
import { Players } from './admin/Players';
import { Categories } from './admin/Categories';
import { Tiesheets } from './admin/Tiesheets';
import { ReportExport } from './admin/ReportExport';
import { Registration } from './Registration';
import { PortalLogin } from './portal-admin/PortalLogin';
import { PortalAdminLayout } from './portal-admin/PortalAdminLayout';
import { Registrations } from './portal-admin/Registrations';
import { NewsUpdates } from './portal-admin/NewsUpdates';
import { Notifications } from './portal-admin/Notifications';
import { BeltManagement } from './portal-admin/BeltManagement';
import { CoachAcademy } from './portal-admin/CoachAcademy';
import { MediaGallery } from './portal-admin/MediaGallery';
import { DocumentDownloads } from './portal-admin/DocumentDownloads';
import { UserRoles } from './portal-admin/UserRoles';
import { EventCreation } from './portal-admin/EventCreation';
import { CoachNotifications } from './coach/CoachNotifications';
import { WhatWeSayAdmin } from './portal-admin/WhatWeSayAdmin';
import { RefereesAdmin } from './portal-admin/RefereesAdmin';

const ScrollToAnchor = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};
import { BlackBeltsAdmin } from './portal-admin/BlackBeltsAdmin';
import { NationalPlayersAdmin } from './portal-admin/NationalPlayersAdmin';
import { PlayerLogin } from './player/PlayerLogin';
import { PlayerDashboard } from './player/PlayerDashboard';
import { CoachLogin } from './coach/CoachLogin';
import { CoachLayout } from './coach/CoachLayout';
import { StudentManagement } from './coach/StudentManagement';
import { TournamentRegistration } from './coach/TournamentRegistration';
import { AffiliatedCoaches } from './public-pages/AffiliatedCoaches';
import { NationalReferees } from './public-pages/NationalReferees';
import { BlackBeltHolders } from './public-pages/BlackBeltHolders';
import { NationalPlayers } from './public-pages/NationalPlayers';
import { AffiliatedTrainingCenters } from './public-pages/AffiliatedTrainingCenters';
import { Gallery } from './public-pages/Gallery';
import { TrainingCentersAdmin } from './portal-admin/TrainingCentersAdmin';

// --- Components ---

const AboutMDTAModal = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate();
  const stats = [
    { value: '2011', label: 'Established', icon: '🏛️' },
    { value: '15+', label: 'Years Active', icon: '⚡' },
    { value: '1000+', label: 'Students Trained', icon: '🥋' },
    { value: '75+', label: 'Championships', icon: '🏆' },
  ];

  const achievements = [
    { year: '2011', title: 'Foundation Laid', desc: 'Maharajganj District Taekwondo Association was officially established and registered.' },
    { year: '2013', title: 'State Recognition', desc: 'Recognized as the only official district sports body by UP Taekwondo Association.' },
    { year: '2016', title: 'Olympic Affiliation', desc: 'UP Taekwondo Association accredited with the Uttar Pradesh Olympic Association.' },
    { year: '2020', title: 'District Championship', desc: 'Successfully hosted the prestigious District-Level Taekwondo Competition.' },
    { year: '2024', title: 'National Pride', desc: 'MDTA students represented UP at national level, winning multiple gold medals.' },
  ];

  const pillars = [
    { icon: '⚔️', title: 'Philosophy', desc: 'Respect, Courtesy, Goodness, Loyalty, Humility, Courage, Integrity, and Indomitable Spirit.' },
    { icon: '🌟', title: 'Principles', desc: 'Five core principles: Courtesy, Integrity, Perseverance, Self-Control and Indomitable Spirit.' },
    { icon: '🎯', title: 'Key of Success', desc: 'Good instruction, consistent practice, and unshakeable trust in your skills and your coach.' },
  ];

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-lg" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{ position: 'absolute', top: 0, left: '-10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(160,0,0,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: 0, right: '-10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(100,0,0,0.05) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 48, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={{ type: 'spring', damping: 32, stiffness: 300, mass: 0.7 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl mx-3 rounded-t-3xl sm:rounded-3xl bg-[#0d0d0d] border border-white/[0.07] shadow-2xl"
        style={{ maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
      >
        <div className="absolute top-0 left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-red-500/80 to-transparent rounded-full" />
        <div className="flex-shrink-0 flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-full border-2 border-red-500/50 overflow-hidden shadow-[0_0_18px_rgba(255,0,0,0.3)] bg-white">
                <img src="/logo.png" alt="MDTA" className="w-full h-full object-cover" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-600 border-2 border-[#0d0d0d]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_rgba(255,0,0,1)]" />
                <span className="text-red-400/80 text-[10px] font-black tracking-[0.25em] uppercase">Est. 2011 · Regd.</span>
              </div>
              <h2 className="text-white font-black text-[15px] sm:text-[17px] tracking-wide leading-none">
                MAHARAJGANJ <span className="text-red-500">TAEKWONDO</span> ASSOCIATION
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex-shrink-0 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-white hover:bg-red-600/20 hover:border-red-500/30 hover:shadow-[0_0_14px_rgba(255,0,0,0.3)] transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div
          className="flex-1 min-h-0"
          style={{ overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth' }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-6">
            {stats.map((s, i) => (
              <div
                key={i}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl px-4 py-4 text-center hover:border-red-500/30 hover:bg-red-500/[0.03] transition-colors duration-250 cursor-default group"
              >
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="text-xl sm:text-2xl font-black text-white mb-0.5 group-hover:text-red-400 transition-colors duration-300">{s.value}</div>
                <div className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="mx-6 h-px bg-white/[0.05]" />
          <div className="p-6 grid sm:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg bg-red-500/12 border border-red-500/25 flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-red-400" />
                </div>
                <h3 className="text-white font-black text-[12px] tracking-[0.22em] uppercase">About MDTA</h3>
              </div>
              <p className="text-gray-300 text-[13px] leading-[1.9] mb-3.5">
                Maharajganj District Taekwondo Association has been working for the last{' '}
                <span className="text-white font-semibold">15+ years</span> in Maharajganj district to train students for self-protection and sports. Established in{' '}
                <span className="text-red-400 font-semibold">2011</span>, MDTA is the backbone of martial arts development in the district.
              </p>
              <p className="text-gray-300 text-[13px] leading-[1.9]">
                MDTA is the <span className="text-white font-semibold">only district sports body</span> recognized by UP Taekwondo Association — accredited with the UP Olympic Association.
              </p>
              <div className="mt-5 pl-4 border-l-2 border-red-500/35 py-1">
                <p className="text-red-300/90 text-[12px] italic leading-relaxed">
                  "Many players in the district are illuminating the name of Maharajganj by participating at the state and national level."
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { icon: <Target className="w-4 h-4 text-red-400" />, title: 'Our Mission', desc: 'Cultivate champions at district, state & national level while promoting discipline, respect, and indomitable spirit.' },
                { icon: <Zap className="w-4 h-4 text-red-400" />, title: 'Our Vision', desc: 'Make Maharajganj a leading Taekwondo district by producing nationally recognized athletes.' },
                { icon: <Heart className="w-4 h-4 text-red-400" />, title: 'Community', desc: 'Building confidence, fitness, and a sense of community across all age groups in the district.' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-red-500/20 hover:bg-red-500/[0.025] transition-colors duration-250 cursor-default group"
                >
                  <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/16 transition-colors duration-250">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-[12px] tracking-wide mb-1">{item.title}</h4>
                    <p className="text-gray-300 text-[12px] leading-[1.65]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mx-6 h-px bg-white/[0.05]" />
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <h3 className="text-white font-black text-[12px] tracking-[0.22em] uppercase flex-shrink-0">The Three Pillars</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-red-500/25 to-transparent" />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {pillars.map((p, i) => (
                <div
                  key={i}
                  className="bg-[#111] border border-white/[0.05] rounded-2xl p-5 hover:border-red-500/25 hover:bg-red-500/[0.025] transition-colors duration-250 cursor-default group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-red-500/0 group-hover:via-red-500/35 to-transparent transition-all duration-400" />
                  <div className="text-3xl mb-3">{p.icon}</div>
                  <h4 className="text-red-400 font-black text-[11px] tracking-[0.18em] uppercase mb-2">{p.title}</h4>
                  <p className="text-gray-300 text-[12px] leading-[1.75]">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mx-6 h-px bg-white/[0.05]" />
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-white font-black text-[12px] tracking-[0.22em] uppercase flex-shrink-0">Milestones</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-red-500/25 to-transparent" />
            </div>
            <div className="relative pl-9">
              <div className="absolute left-[14px] top-2 bottom-2 w-px" style={{ background: 'linear-gradient(to bottom, rgba(220,38,38,0.5), rgba(220,38,38,0.15), transparent)' }} />
              <div className="space-y-4">
                {achievements.map((item, i) => (
                  <div key={i} className="relative group">
                    <div className="absolute -left-9 top-[14px] w-[18px] h-[18px] rounded-full bg-[#0d0d0d] border-2 border-red-600/50 group-hover:border-red-400/80 group-hover:shadow-[0_0_10px_rgba(255,0,0,0.4)] transition-all duration-200 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-600/80 group-hover:bg-red-400 transition-colors duration-200" />
                    </div>
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl px-5 py-4 group-hover:border-red-500/20 group-hover:bg-red-500/[0.02] transition-colors duration-200">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-red-500 font-black text-[11px] tracking-widest">{item.year}</span>
                        <div className="w-1 h-1 rounded-full bg-red-500/40" />
                        <h4 className="text-white font-bold text-[13px]">{item.title}</h4>
                      </div>
                      <p className="text-gray-300 text-[12px] leading-[1.65]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="relative rounded-2xl overflow-hidden border border-red-500/15 bg-gradient-to-br from-[#120000] to-[#0a0000] px-6 py-7 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0,rgba(200,0,0,0.08)_0%,transparent_60%)]" />
              <p className="text-[10px] font-black tracking-[0.4em] text-red-500/50 uppercase mb-2 relative z-10">Join The Legacy</p>
              <h3 className="text-white text-xl sm:text-2xl font-black mb-2 tracking-tight relative z-10">
                Ready to Begin Your <span className="text-red-500">Journey?</span>
              </h3>
              <p className="text-gray-300 text-[12px] mb-5 max-w-sm mx-auto leading-relaxed relative z-10">
                Train under certified masters and become part of MDTA's proud legacy.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
                <button
                  onClick={() => {
                    onClose();
                    navigate('/register');
                  }}
                  className="inline-flex items-center justify-center gap-2 px-7 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-full font-bold text-[12px] tracking-[0.1em] uppercase shadow-[0_0_18px_rgba(255,0,0,0.22)] hover:shadow-[0_0_30px_rgba(255,0,0,0.45)] transition-all duration-200 border border-red-500/35"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  Enroll Now
                </button>
                <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center px-7 py-2.5 text-gray-400 hover:text-white rounded-full font-bold text-[12px] tracking-[0.1em] uppercase border border-white/[0.12] hover:border-white/25 hover:bg-white/[0.06] transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-red-500/15 to-transparent rounded-full" />
      </motion.div>
    </motion.div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Our Courses', href: '/#courses' },
    {
      name: 'Verify Us',
      href: '#',
      dropdown: [
        { name: 'About MDTA', href: '/#', action: 'about-modal' },
        { name: 'Affiliated Training Centers', href: '/affiliated-training-centers' },
        { name: 'Affiliated Coaches', href: '/affiliated-coaches' },
        { name: 'Our National Referees', href: '/national-referees' },
        { name: 'Our Black Belt Holders', href: '/black-belt-holders' },
        { name: 'Our National Players', href: '/national-players' },
      ]
    },
    { name: 'Poom / Dan Check', href: 'https://tkdcon.net/portalkm/login/login.do' },
    {
      name: 'Updates',
      href: '#',
      dropdown: [
        { name: 'Latest News', href: '/#news' },
        { name: 'Gallery', href: '/gallery' },
        { name: 'Events', href: '/events' },
        { name: 'Documents & Download', href: '#' },
        { name: 'Upcoming Training Camps', href: '#' },
      ]
    },
    {
      name: 'Login',
      href: '#',
      dropdown: [
        { name: 'Portal Admin Login', href: '/portal-admin/login' },
        { name: 'Dashboard Admin Login', href: '/admin/login' },
        { name: 'Coach Login', href: '/coach/login' },
        { name: 'Player Login', href: '/player/login' },
        { name: 'Webmail Login', href: '/admin/login' },
      ]
    },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-red-500/30 shadow-[0_4px_35px_rgba(255,0,0,0.2)] py-2.5' : 'bg-transparent py-5'}`}>
      <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center group cursor-pointer shrink-0 max-w-[200px] md:max-w-[240px] lg:max-w-[300px] xl:max-w-[360px]"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-white rounded-full mr-2 md:mr-3 shadow-[0_0_15px_rgba(255,0,0,0.5)] group-hover:shadow-[0_0_30px_rgba(255,0,0,0.8)] border border-red-500/50 transition-all duration-300 overflow-hidden shrink-0 flex items-center justify-center">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[9px] md:text-[10px] lg:text-[12px] xl:text-[13px] font-black tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)] group-hover:text-red-500 transition-colors duration-300 uppercase leading-snug break-words">
                MAHARAJGANJ DISTRICT TAEKWONDO ASSOCIATION (Regd)
              </span>
            </div>
          </Link>
          <div className="hidden md:flex flex-1 items-center justify-center gap-1 lg:gap-2 xl:gap-4">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group px-1 lg:px-1.5">
                {link.href.startsWith('http') ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-[10.5px] lg:text-[11px] xl:text-[12px] font-bold tracking-widest uppercase transition-all duration-300 text-white/90 hover:text-white py-5 whitespace-nowrap"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-[3px] bg-red-500 rounded-full transition-all duration-300 group-hover:w-full shadow-[0_0_12px_rgba(255,0,0,0.9)]"></span>
                    </span>
                  </a>
                ) : (
                  <Link
                    to={link.href}
                    className="flex items-center text-[10.5px] lg:text-[11px] xl:text-[12px] font-bold tracking-widest uppercase transition-all duration-300 text-white/90 hover:text-white py-5 whitespace-nowrap"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-[3px] bg-red-500 rounded-full transition-all duration-300 group-hover:w-full shadow-[0_0_12px_rgba(255,0,0,0.9)]"></span>
                    </span>
                    {link.dropdown && <ChevronRight className="w-3.5 h-3.5 ml-1 rotate-90 transition-transform duration-300 group-hover:-rotate-90 text-red-500/70 group-hover:text-red-500 drop-shadow-md" />}
                  </Link>
                )}
                {link.dropdown && (
                  <div className={`absolute top-[90%] ${link.name === 'Login' || link.name === 'Updates' ? 'right-0' : 'left-0'} opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:top-full transition-all duration-500 min-w-[280px] bg-[#0a0a0a]/95 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_30px_rgba(255,0,0,0.15)] rounded-[20px] py-5 border border-white/10 overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-[#ff0000] before:to-[#8b0000] z-50`}>
                    <div className="absolute -top-20 -right-20 w-48 h-48 bg-red-600/10 rounded-full blur-[60px] pointer-events-none"></div>
                    {link.dropdown.map((dropLink, idx) => {
                      if ((dropLink as any).action === 'about-modal') {
                        return (
                          <button
                            key={idx}
                            onClick={() => setShowAboutModal(true)}
                            className="w-full flex items-center px-6 py-3.5 text-[12px] font-bold tracking-widest uppercase text-gray-400 hover:text-white hover:bg-white/5 transition-all border-l-2 border-transparent hover:border-red-500 group/item relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent translate-x-[-100%] group-hover/item:translate-x-0 transition-transform duration-300 ease-out"></div>
                            <span className="transform translate-x-0 group-hover/item:translate-x-2 transition-transform duration-300 flex items-center relative z-10 w-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-4 opacity-0 group-hover/item:opacity-100 transition-all duration-300 shadow-[0_0_8px_rgba(255,0,0,0.8)] group-hover/item:scale-125"></span>
                              {(dropLink as any).icon && <span className="mr-3 text-red-500">{(dropLink as any).icon}</span>}
                              {dropLink.name}
                            </span>
                          </button>
                        );
                      }

                      const hasSublinks = (dropLink as any).sublinks;
                      const LinkComponent = dropLink.href.startsWith('/') ? Link : 'a';

                      return (
                        <div key={idx} className="relative group/sub">
                          <LinkComponent
                            to={dropLink.href.startsWith('/') ? dropLink.href : undefined}
                            href={!dropLink.href.startsWith('/') ? dropLink.href : undefined}
                            className="flex items-center justify-between px-6 py-3.5 text-[12px] font-bold tracking-widest uppercase text-gray-400 hover:text-white hover:bg-white/5 transition-all border-l-2 border-transparent hover:border-red-500 group/item relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent translate-x-[-100%] group-hover/item:translate-x-0 transition-transform duration-300 ease-out"></div>
                            <span className="transform translate-x-0 group-hover/item:translate-x-2 transition-transform duration-300 flex items-center relative z-10 w-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-4 opacity-0 group-hover/item:opacity-100 transition-all duration-300 shadow-[0_0_8px_rgba(255,0,0,0.8)] group-hover/item:scale-125"></span>
                              {(dropLink as any).icon && <span className="mr-3 text-red-500">{(dropLink as any).icon}</span>}
                              {dropLink.name}
                            </span>
                            {hasSublinks && <ChevronRight className="w-3.5 h-3.5 ml-2 transition-transform duration-300 group-hover/sub:rotate-90" />}
                          </LinkComponent>
                          {hasSublinks && (
                            <div className="absolute right-full top-0 mr-1 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-300 min-w-[240px] bg-[#0a0a0a]/98 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,1)] rounded-[18px] py-4 border border-white/10 z-[60] overflow-hidden">
                              <div className="px-4 mb-2 pb-2 border-b border-white/5">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Navigate Category</span>
                              </div>
                              {(dropLink as any).sublinks.map((sub: any, sIdx: number) => (
                                <a
                                  key={sIdx}
                                  href={sub.href}
                                  className="flex items-center px-6 py-3 text-[11px] font-bold tracking-widest uppercase text-gray-400 hover:text-white hover:bg-red-600/10 transition-all group/subitem"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/30 mr-4 group-hover/subitem:bg-red-500 transition-colors"></div>
                                  {(sub as any).icon && <span className="mr-3 text-red-500/80 group-hover/subitem:text-red-500 transition-colors">{(sub as any).icon}</span>}
                                  {sub.name}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3 lg:gap-5 shrink-0">
            <button className="text-white hover:text-red-500 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:drop-shadow-[0_0_12px_rgba(255,0,0,0.8)] transform hover:scale-110 duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
            <div className="h-6 w-px bg-white/10 hidden lg:block"></div>
            <Link to="/register" className="bg-gradient-to-r from-[#ff0000] to-[#990000] hover:from-[#ff1a1a] hover:to-[#cc0000] text-white px-4 lg:px-6 py-2.5 rounded-full text-[11px] lg:text-[12px] font-black tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(255,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,0,0,0.6)] transform hover:-translate-y-0.5 border border-red-500/30 inline-flex whitespace-nowrap">
              Join Now
            </Link>
          </div>
          <div className="md:hidden flex items-center space-x-3 ml-auto">
            <button className="text-white hover:text-red-500 transition-colors drop-shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-white bg-white/5 p-2 rounded-xl hover:bg-red-600/20 hover:text-red-500 hover:border-red-500/50 transition-all border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              {isOpen ? <X className="w-6 h-6 drop-shadow-md" /> : <Menu className="w-6 h-6 drop-shadow-md" />}
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-3 bg-[#030303]/95 backdrop-blur-2xl border-t border-red-500/20 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.95)]"
          >
            <div className="px-5 py-6 space-y-4 max-h-[80vh] overflow-y-auto relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/5 rounded-full blur-[50px] pointer-events-none"></div>
              {navLinks.map((link) => (
                <div key={link.name} className="border-b border-white/5 pb-4 last:border-0 last:pb-0 relative z-10">
                  {link.href.startsWith('http') ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex justify-between items-center text-[14px] font-bold tracking-widest uppercase text-gray-200 hover:text-white transition-all group"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="flex items-center gap-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600/50 group-hover:bg-red-500 group-hover:shadow-[0_0_12px_rgba(255,0,0,0.9)] transition-all"></span>
                        {link.name}
                      </span>
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="flex justify-between items-center text-[14px] font-bold tracking-widest uppercase text-gray-200 hover:text-white transition-all group"
                      onClick={(e) => {
                        if (link.dropdown) {
                          e.preventDefault();
                          setOpenMobileDropdown(prev => prev === link.name ? null : link.name);
                        } else {
                          setIsOpen(false);
                        }
                      }}
                    >
                      <span className="flex items-center gap-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600/50 group-hover:bg-red-500 group-hover:shadow-[0_0_12px_rgba(255,0,0,0.9)] transition-all"></span>
                        {link.name}
                      </span>
                      {link.dropdown && <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${openMobileDropdown === link.name ? 'rotate-90 text-red-500' : 'text-red-500/50 group-hover:text-red-500'}`} />}
                    </Link>
                  )}
                  {link.dropdown && openMobileDropdown === link.name && (
                    <div className="pl-5 space-y-2 mt-4 mb-2 border-l-2 border-red-500/20 ml-1.5">
                      {link.dropdown.map((dropLink, idx) => {
                        if ((dropLink as any).action === 'about-modal') {
                          return (
                            <button
                              key={idx}
                              onClick={() => { setShowAboutModal(true); setIsOpen(false); }}
                              className="block w-full text-left px-5 py-3 text-[12px] font-bold tracking-widest uppercase text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-white/5 hover:to-transparent rounded-r-lg transition-all border-l border-transparent hover:border-red-500"
                            >
                              {dropLink.name}
                            </button>
                          );
                        }
                        const hasSublinks = (dropLink as any).sublinks;
                        const LinkComponent = dropLink.href.startsWith('/') ? Link : 'a';
                        return (
                          <div key={idx}>
                            <LinkComponent
                              to={dropLink.href.startsWith('/') ? dropLink.href : undefined}
                              href={!dropLink.href.startsWith('/') ? dropLink.href : undefined}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center justify-between px-5 py-3 text-[12px] font-bold tracking-widest uppercase text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-white/5 hover:to-transparent rounded-r-lg transition-all border-l border-transparent hover:border-red-500"
                            >
                              <span className="flex items-center">
                                {(dropLink as any).icon && <span className="mr-3 text-red-500">{(dropLink as any).icon}</span>}
                                {dropLink.name.replace(' >', '')}
                              </span>
                            </LinkComponent>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-6 mt-4 border-t border-white/5 relative z-10 w-full flex">
                <Link to="/register" onClick={() => setIsOpen(false)} className="w-full text-center bg-gradient-to-r from-[#ff0000] to-[#990000] hover:from-[#ff1a1a] hover:to-[#cc0000] text-white py-4 rounded-xl font-black tracking-widest uppercase shadow-[0_0_20px_rgba(255,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,0,0,0.5)] border border-red-500/50 transition-all transform active:scale-[0.98]">
                  Join Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {showAboutModal && <AboutMDTAModal onClose={() => setShowAboutModal(false)} />}
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
          src={heroBg}
          alt="Taekwondo training"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 pb-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="text-[56px] md:text-[64px] lg:text-[76px] font-sans font-bold text-white leading-[1.05] mb-2 tracking-wide uppercase shadow-black drop-shadow-lg">
            BECOME <br />
            UNSTOPPABLE
          </h1>
          <h2 className="text-[20px] md:text-[24px] lg:text-[28px] text-gray-200 font-normal mb-6 tracking-wide font-sans">
            Master the Art of Self Defense
          </h2>
          <p className="text-gray-400 mb-10 font-medium text-[12px] md:text-[14px] flex items-center gap-3 tracking-wider">
            Discipline <span className="text-[#ff1a1a]">•</span> Power <span className="text-[#ff1a1a]">•</span> Confidence
          </p>
          <div className="flex flex-row gap-4">
            <Link
              to="/register"
              className="bg-[#ff1a1a] hover:bg-red-500 text-white px-8 py-3 rounded-full text-[15px] font-medium tracking-wide flex items-center justify-center transition-all shadow-[0_0_20px_rgba(255,26,26,0.4)]"
            >
              Apply Now
            </Link>
            <button
              onClick={() => setIsVideoOpen(true)}
              className="bg-transparent hover:bg-white/5 text-gray-300 hover:text-white border border-gray-500 px-8 py-3 rounded-full text-[15px] font-medium tracking-wide flex items-center justify-center transition-all"
            >
              Watch Demo
            </button>
          </div>
        </motion.div>
      </div>
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
      <div className="absolute bottom-0 left-0 right-0 z-20 mb-4 md:mb-6">
        <div className="max-w-[1050px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col md:flex-row items-center justify-between bg-black/60 bg-gradient-to-b from-white/10 to-transparent backdrop-blur-md border border-white/5 rounded-[24px] relative py-5 md:py-6 px-6 shadow-[0_0_40px_rgba(255,0,0,0.6)]"
          >
            <div className="absolute top-0 left-[18%] w-[140px] h-[2px] bg-[#ff0000] shadow-[0_0_20px_4px_rgba(255,0,0,0.8)]"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 w-full divide-x divide-white/5">
              {[
                { label: 'Active Students', value: '1000+', icon: <Users className="w-[28px] h-[28px] text-[#ff0000]" strokeWidth={1.5} /> },
                { label: 'Expert Trainers', value: '25+', icon: <Users className="w-[28px] h-[28px] text-[#ff0000]" strokeWidth={1.5} /> },
                { label: 'Years Excellence', value: '15+', icon: <Award className="w-[28px] h-[28px] text-[#ff0000]" strokeWidth={1.5} /> },
                { label: 'Championships', value: '75+', icon: <Trophy className="w-[28px] h-[28px] text-[#ff0000]" strokeWidth={1.5} /> },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-center gap-4 py-2 px-2">
                  <div className="flex-shrink-0">{stat.icon}</div>
                  <div className="flex flex-col text-left">
                    <div className="text-[20px] md:text-[24px] font-bold text-white tracking-wide leading-none mb-1 shadow-black drop-shadow-md">{stat.value}</div>
                    <div className="text-[11px] md:text-[13px] text-gray-400 tracking-wide font-medium">{stat.label}</div>
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
    { icon: <Users className="w-6 h-6" />, title: 'FLEXIBLE BATCHES', desc: 'Strong Batches, Superlative Training' }
  ];

  return (
    <section id="about" className="pt-20 pb-12 bg-[#050505] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-[28px] font-bold text-white tracking-widest uppercase drop-shadow-[0_0_20px_rgba(255,26,26,0.4)] font-sans">
            WHY <span className="text-white">CHOOSE US</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <motion.div
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-[40%] h-[420px] relative rounded-[24px] overflow-hidden border border-white/5 shadow-2xl group flex-shrink-0"
          >
            <img
              src={ticImg}
              alt="Elite Representative"
              className="w-full h-full object-cover transition-all duration-700"
            />
          </motion.div>

          <div className="w-full lg:flex-1 space-y-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 10 }}
                className="flex items-center gap-4 md:gap-8 p-1 transition-all"
              >
                <div className="w-[48px] h-[48px] md:w-[52px] md:h-[52px] rounded-full border border-white/5 shadow-[inset_0_0_15px_rgba(255,26,26,0.2)] flex items-center justify-center flex-shrink-0 relative bg-black/40 hover:bg-red-600/10 transition-colors">
                  <div className="text-[#ff1a1a]">
                    {f.icon}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] md:text-[16px] font-bold text-white tracking-wide uppercase leading-snug">
                    {f.title} <span className="text-gray-400 font-normal normal-case ml-2">- {f.desc}</span>
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
    { title: 'TAEKWONDO', image: tcImg, desc: 'Traditional Korean martial art for all.' },
    { title: 'MMA / Self Defense', image: sfImg, desc: 'Practical combat for street awareness.' },
    { title: 'Fitness Training', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800', desc: 'Build strength, speed, and endurance.' },
    { title: 'Yoga', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800', desc: 'Mindful movement for balance and flexibility.' },
  ];

  return (
    <section id="courses" className="pt-6 pb-6 bg-[#050505]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-[24px] md:text-[28px] font-bold text-white mb-2 tracking-wide font-sans drop-shadow-[0_0_15px_rgba(255,26,26,0.4)]">
            Our Elite Training Programs
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((p, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group cursor-pointer bg-gradient-to-br from-[#4a4a4a] via-[#1a1a1a] to-[#050505] p-3 rounded-[24px] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all duration-300 hover:border-[#ff0000] hover:shadow-[0_0_40px_rgba(255,0,0,0.6)] flex flex-col"
            >
              <div className="h-[220px] rounded-[18px] overflow-hidden relative bg-[#111]">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] z-10 pointer-events-none"></div>
              </div>
              <div className="px-3 pt-5 pb-3">
                <h3 className="text-[19px] font-bold text-white mb-2 tracking-wide group-hover:text-[#ff1a1a] transition-colors">{p.title}</h3>
                <p className="text-gray-300 text-[14px] leading-relaxed font-normal">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TrainingCentersSection = () => (
  <section className="py-12 bg-[#050505] relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="grid lg:grid-cols-2 gap-0 relative z-10">
          <div className="p-12 md:p-16 flex flex-col justify-center">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-px bg-red-600" />
                <span className="text-red-500 font-bold tracking-[0.3em] uppercase text-[10px]">Strategic Locations</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-[0.9]">District <br /><span className="text-red-600">Centers</span></h2>
            </div>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed font-medium">Find our official training centers equipped with international standard mats and world-class equipment across Maharajganj district.</p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/affiliated-training-centers"
                className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-[0_10px_25px_rgba(255,0,0,0.3)] transition-all hover:scale-105"
              >
                View Directory <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="relative h-[400px] lg:h-auto overflow-hidden group">
            <div className="absolute inset-0 bg-red-600/5 mix-blend-multiply z-10" />
            <img
              src={tcImg}
              alt="Training Center"
              className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 lg:from-black/60 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const BenefitsSection = () => {
  const [activeTab, setActiveTab] = useState<'benefits' | 'self-development'>('benefits');
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section className="pt-8 pb-10 bg-[#020202] relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/[0.08] rounded-[32px] md:rounded-[48px] shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden group/container transition-all duration-700 hover:border-red-500/30 flex flex-col lg:flex-row relative">
          <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent mask-image-[linear-gradient(to_right,transparent,black,transparent)]"></div>
          <div className="w-full lg:w-[42%] relative h-[400px] sm:h-[450px] lg:h-auto overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeTab}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                src={activeTab === 'benefits' ? ticImg : tcImg}
                alt={activeTab}
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <motion.button
                onClick={() => setIsVideoOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center justify-center group/btn"
              >
                <div className="absolute inset-0 bg-red-600/30 rounded-full blur-md animate-ping" style={{ animationDuration: '2s' }}></div>
                <div className="absolute -inset-4 bg-red-600/10 rounded-full blur-xl transition-all group-hover/btn:bg-red-600/20"></div>
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 border border-red-400/50 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,0,0,0.6)] z-10">
                  <Play className="w-8 h-8 text-white ml-2 drop-shadow-md" fill="currentColor" />
                </div>
              </motion.button>
            </div>
            <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-red-500/50 rounded-tl-xl opacity-0 xl:opacity-100 transition-opacity duration-700 delay-100 hidden lg:block"></div>
          </div>
          <div className="w-full lg:w-[58%] flex flex-col p-8 sm:p-10 lg:p-14 relative z-20 bg-gradient-to-l from-transparent to-[#0a0a0a] xl:from-[#0a0a0a] xl:to-[#0a0a0a]">
            <div className="flex space-x-2 mb-10 w-fit p-1.5 bg-white/[0.02] rounded-full border border-white/5 backdrop-blur-md shadow-inner">
              <button
                onClick={() => setActiveTab('benefits')}
                className={`py-3 px-6 sm:px-8 rounded-full text-[12px] sm:text-[13px] font-black tracking-[0.2em] uppercase transition-all relative z-10 ${activeTab === 'benefits' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
              >
                Benefits
                {activeTab === 'benefits' && (
                  <motion.div layoutId="pillActiveTab" className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-900 rounded-full -z-10 shadow-[0_0_20px_rgba(255,0,0,0.3)] border border-red-500/50" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('self-development')}
                className={`py-3 px-6 sm:px-8 rounded-full text-[12px] sm:text-[13px] font-black tracking-[0.2em] uppercase transition-all relative z-10 ${activeTab === 'self-development' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
              >
                Self Development
                {activeTab === 'self-development' && (
                  <motion.div layoutId="pillActiveTab" className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-900 rounded-full -z-10 shadow-[0_0_20px_rgba(255,0,0,0.3)] border border-red-500/50" />
                )}
              </button>
            </div>
            <div className="flex-1 min-h-[280px]">
              <AnimatePresence mode="wait">
                {activeTab === 'benefits' && (
                  <motion.div
                    key="benefits"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: "backOut" }}
                  >
                    <h3 className="text-3xl sm:text-[42px] font-black text-white mb-10 tracking-tight leading-none drop-shadow-md">
                      Benefits of <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Taekwondo</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                      {[
                        'Improved muscle tone and appearance',
                        'Increased strength and stamina',
                        'Improved confidence and self-esteem',
                        'Improved flexibility',
                        'Improved agility and reflexes',
                        'Improved concentration and focus',
                        'Improved leadership skills',
                        'Greater self-discipline',
                        'Reduced stress'
                      ].map((benefit, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="flex items-start gap-4 group cursor-default"
                        >
                          <div className="mt-1 w-6 h-6 rounded-full bg-white/[0.03] border border-white/10 group-hover:bg-red-500/10 group-hover:border-red-500/50 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(255,0,0,0.4)]">
                            <svg className="w-3.5 h-3.5 text-gray-500 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          </div>
                          <span className="text-gray-400 text-[15px] sm:text-[16px] font-medium leading-[1.4] group-hover:text-white transition-colors duration-300">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {activeTab === 'self-development' && (
                  <motion.div
                    key="self-development"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: "backOut" }}
                    className="flex flex-col h-full"
                  >
                    <h3 className="text-3xl sm:text-[42px] font-black text-white mb-6 tracking-tight leading-none drop-shadow-md">
                      Self <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Development</span>
                    </h3>
                    <p className="text-gray-400 text-[16px] sm:text-[17px] leading-[1.8] font-medium my-4 max-w-xl">
                      Personal development is defined as activities that develops a person's capabilities and, build human capital and potential, facilitate employability, and enhances quality of life and the realization of dreams and aspirations.
                      <br /><br />
                      Personal development takes place over the course of an individual's entire lifespan.
                    </p>
                    <div className="mt-8 group w-fit">
                      <div className="flex items-center gap-5 p-4 pr-8 rounded-full bg-gradient-to-r from-red-600/10 to-transparent border border-red-500/20 hover:border-red-500/40 transition-all duration-500">
                        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.5)] group-hover:scale-110 transition-transform duration-500">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold tracking-wider text-[15px] uppercase">Achieve Your Potential</h4>
                          <p className="text-red-400/80 text-[13px] mt-0.5 font-medium tracking-wide">Unlock new mental & physical levels.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
      alert("Only Gmail addresses (@gmail.com) are allowed.");
      return;
    }
    if (formData.phone.replace(/\D/g, '').length !== 10) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }
    setStatus('loading');
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', course: 'Select Course', message: '' });
        alert("Message sent successfully!");
      } else {
        setStatus('error');
        alert("Failed to send message. Please try again.");
      }
    } catch (err) {
      setStatus('error');
      alert("Something went wrong. Please try again.");
    }
  };

  const newsItems = [
    { title: 'New Batch for Kids Starting Soon', date: 'March 10, 2026', category: 'Admission', desc: 'Enroll now for beginner-level taekwondo training.' },
    { title: 'MDTA Students Win Gold at State Level', date: 'February 28, 2026', category: 'Achievement', desc: 'Our students secured top positions in state championship.' },
    { title: 'District Taekwondo Championship 2026', date: 'March 15, 2026', category: 'Event', desc: 'MDTA to host district-level competition for all categories.' },
  ];

  return (
    <section id="news" className="pt-6 pb-20 bg-[#050505] relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
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
                  className="bg-gradient-to-br from-[#383838] via-[#1a1a1a] to-[#0a0a0a] p-6 rounded-[20px] border border-white/10 transition-all group flex flex-col justify-between min-h-[260px] shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-[#ff0000] hover:shadow-[0_0_50px_rgba(255,0,0,0.8),inset_0_0_20px_rgba(255,0,0,0.5)]"
                >
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wide mb-5 border bg-[#ff1a1a]/10 text-gray-100 border-[#ff1a1a]/40 transition-colors">
                      {item.category}
                    </span>
                    <h3 className="text-[17px] md:text-[19px] font-bold text-white mb-3 leading-[1.3] group-hover:text-[#ff1a1a] transition-colors drop-shadow-sm">{item.title}</h3>
                    <p className="text-[13px] md:text-[14px] text-gray-300 mb-6 leading-[1.6] font-medium">{item.desc}</p>
                  </div>
                  <div className="mt-auto">
                    <div className="h-[1px] w-full bg-white/10 mb-4"></div>
                    <div className="flex items-center text-gray-400 text-[13px] font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      {item.date}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div id="contact" className="lg:w-[42%] flex pt-12 lg:pt-0 pl-0 lg:pl-4">
            <div className="w-full bg-gradient-to-br from-[#333333] via-[#1a1a1a] to-[#0a0a0a] border border-white/10 p-8 rounded-[24px] shadow-[0_0_40px_rgba(0,0,0,0.8),inset_0_0_30px_rgba(255,26,26,0.02)] relative overflow-hidden flex flex-col justify-center transition-all hover:border-[#ff0000] hover:shadow-[0_0_50px_rgba(255,0,0,0.8),inset_0_0_20px_rgba(255,0,0,0.5)]">
              <h3 className="text-[22px] md:text-[26px] font-bold text-white mb-8 text-center drop-shadow-md">Contact Us</h3>
              <form onSubmit={handleSubmit} action="https://formsubmit.co/saabhisaabhishek@gmail.com" method="POST" className="space-y-4 relative z-10 w-full mx-auto">
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
                      onChange={(e) => setFormData({ ...formData, name: toTitleCase(e.target.value) })}
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
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
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
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-black/40 border border-white/5 hover:border-[#ff1a1a]/40 text-white focus:ring-1 focus:ring-[#ff1a1a] focus:border-[#ff1a1a] outline-none transition-all text-[13px] placeholder-gray-500 rounded-[14px]"
                      placeholder="Email Address"
                    />
                  </div>
                  <div>
                    <select
                      name="course"
                      required
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="w-full px-4 py-3 bg-black/40 border border-white/5 hover:border-[#ff1a1a]/40 text-white focus:ring-1 focus:ring-[#ff1a1a] focus:border-[#ff1a1a] outline-none transition-all text-[13px] rounded-[14px] appearance-none"
                    >
                      <option value="Select Course" disabled>Select Course</option>
                      <option value="Taekwondo">Taekwondo</option>
                      <option value="MMA / Self Defense">MMA / Self Defense</option>
                      <option value="Fitness Training">Fitness Training</option>
                      <option value="Yoga">Yoga</option>
                    </select>
                  </div>
                </div>
                <div className="relative mt-3 flex items-center gap-2 px-2">
                  <div className="w-2 h-2 rounded-full bg-[#ff1a1a] shadow-[0_0_10px_#ff1a1a]"></div>
                  <span className="text-[12px] text-gray-300 font-medium tracking-wide uppercase">Your Enquiry</span>
                </div>
                <div>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: toTitleCase(e.target.value) })}
                    className="w-full px-4 py-4 bg-black/40 border border-white/5 hover:border-[#ff1a1a]/40 text-white rounded-[16px] focus:ring-1 focus:ring-[#ff1a1a] focus:border-[#ff1a1a] outline-none transition-all text-[13px] placeholder-gray-600 resize-none"
                    placeholder="Describe your enquiry here..."
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
            {['facebook', 'instagram', 'twitter', 'youtube'].map((social, i) => (
              <a key={i} href="#" className="w-10 h-10 bg-[#151515] rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#FF0000]/20 hover:border hover:border-[#FF0000]/50 hover:shadow-[0_0_20px_rgba(255,0,0,0.5)] transition-all">
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

const toTitleCase = (str: string) => {
  return str.replace(/\b\w+/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
};

const WhatWeSay = () => {
  const [data, setData] = useState({
    president_name: 'Mr. Shardendu Kumar Pandey',
    president_title: 'President (MDTA)',
    president_message: 'This website is being dedicated by the Maharajganj District Taekwondo Association to the taekwondo players of the district. We wish all the taekwondo players a bright future.',
    president_image: 'https://images.unsplash.com/photo-1620912189865-1e8a33da4c59?auto=format&fit=crop&q=80&w=400',
    secretary_name: 'Abhishek Kumar Vishwakarma',
    secretary_title: 'Secretary (MDTA)',
    secretary_message: 'MDTA Secretary: MPED, BPED, 3rd DAN BLACK BELT, NATIONAL REFEREE, INTERNATIONAL PLAYER. Working for last 10 years to train students for self-protection and sports.',
    secretary_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'
  });

  useEffect(() => {
    fetch('/api/content/what_we_say')
      .then(res => res.json())
      .then(resData => {
        if (resData && resData.content) {
          try {
            const parsed = JSON.parse(resData.content);
            setData(prev => ({ ...prev, ...parsed }));
          } catch (e) {
            console.error('Failed to parse content', e);
          }
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="pt-10 pb-6 bg-[#050505] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-900/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-[10px] font-black tracking-[0.3em] uppercase">Leadership</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase"
          >
            What <span className="text-red-500">We Say</span>
          </motion.h2>
          <div className="w-20 h-1 bg-red-600 mx-auto mt-6 rounded-full" />
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-red-600/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative bg-[#0d0d0d] border border-white/5 rounded-[40px] p-8 md:p-10 transition-all duration-500 hover:border-red-500/30 hover:translate-y-[-8px] shadow-2xl">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                <div className="relative flex-shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-[32px] overflow-hidden border-2 border-red-500/30 shadow-[0_0_30px_rgba(255,0,0,0.2)]">
                    <img
                      src={data.president_image || "https://images.unsplash.com/photo-1620912189865-1e8a33da4c59?auto=format&fit=crop&q=80&w=400"}
                      alt="President"
                      className="w-full h-full object-cover transition-all duration-700 hover:scale-110"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-red-600 text-white p-2 rounded-xl shadow-lg">
                    <Shield className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">{data.president_name}</h3>
                  <p className="text-red-500 font-bold text-xs uppercase tracking-[0.2em] mb-6">{data.president_title}</p>
                  <p className="text-gray-400 text-sm leading-relaxed font-medium italic mb-6">
                    "{data.president_message}"
                  </p>
                  <div className="inline-flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest border-t border-white/5 pt-4">
                    <CheckCircle className="w-3 h-3 text-red-500" /> Official MDTA Statement
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Secretary Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-red-600/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative bg-[#0d0d0d] border border-white/5 rounded-[40px] p-8 md:p-10 transition-all duration-500 hover:border-red-500/30 hover:translate-y-[-8px] shadow-2xl">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                <div className="relative flex-shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-[32px] overflow-hidden border-2 border-red-500/30 shadow-[0_0_30px_rgba(255,0,0,0.2)]">
                    <img
                      src={data.secretary_image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"}
                      alt="Secretary"
                      className="w-full h-full object-cover transition-all duration-700 hover:scale-110"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-red-600 text-white p-2 rounded-xl shadow-lg">
                    <Shield className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">{data.secretary_name}</h3>
                  <p className="text-red-500 font-bold text-xs uppercase tracking-[0.2em] mb-6">{data.secretary_title}</p>
                  <p className="text-gray-400 text-sm leading-relaxed font-medium italic mb-6">
                    "{data.secretary_message}"
                  </p>
                  <div className="inline-flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest border-t border-white/5 pt-4">
                    <CheckCircle className="w-3 h-3 text-red-500" /> Official MDTA Statement
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Main App ---

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="font-sans selection:bg-red-500/30 selection:text-white bg-[#050505] min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow pt-24">
      {children}
    </main>
    <Footer />
  </div>
);

const EventsDisplay = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const upcomingEvents = events.filter((e: any) => e.type === 'Upcoming');
  const pastEvents = events.filter((e: any) => e.type === 'Past');

  // Determine which sections to show based on the URL path
  const showUpcoming = pathname.includes('upcoming') || pathname === '/events';
  const showPast = pathname.includes('past') || pathname === '/events';

  const EventCard = ({ e }: { e: any }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden group hover:border-red-500/30 transition-all duration-500 flex flex-col shadow-2xl"
    >
      <div className="h-56 relative overflow-hidden">
        {e.image ? (
          <img src={e.image} alt={e.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-600/20 to-black flex items-center justify-center">
            <Calendar className="w-12 h-12 text-red-500/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
        <div className="absolute bottom-4 left-6">
          <div className="flex items-center gap-2 text-red-500 font-bold text-[10px] tracking-[0.2em] uppercase bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
            <MapPin className="w-3 h-3" /> {e.location}
          </div>
        </div>
      </div>
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-500/20 flex flex-col items-center justify-center">
            <span className="text-red-500 font-black text-lg leading-none">{e.date.split(' ')[1]?.replace(',', '') || '??'}</span>
            <span className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter">{e.date.split(' ')[0] || 'MO'}</span>
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight group-hover:text-red-500 transition-colors uppercase">{e.title}</h3>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">{e.date}</p>
          </div>
        </div>
        <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Official MDTA Event</span>
          <button className="text-red-500 hover:text-red-400 font-black text-[10px] uppercase tracking-widest transition-colors flex items-center gap-2">
            Learn More <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section id="events-display" className="py-24 bg-[#050505] relative overflow-hidden min-h-screen">
      <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
        {showUpcoming && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            id="upcoming"
            className="scroll-mt-32"
          >
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-px bg-red-600" />
                  <span className="text-red-500 font-bold tracking-[0.3em] uppercase text-[10px]">What's Next</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">Upcoming <span className="text-red-600">Events</span></h2>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => <div key={i} className="h-[400px] bg-white/5 animate-pulse rounded-3xl"></div>)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((e: any) => <div key={e._id}><EventCard e={e} /></div>)}
                {upcomingEvents.length === 0 && (
                  <div className="col-span-full py-16 text-center bg-[#0a0a0a] border border-white/5 rounded-3xl border-dashed">
                    <Calendar className="w-12 h-12 text-gray-800 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No upcoming events at the moment.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {showPast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            id="past"
            className={`scroll-mt-32 ${showUpcoming ? 'mt-32 border-t border-white/5 pt-32' : ''}`}
          >
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-px bg-gray-600" />
                  <span className="text-gray-500 font-bold tracking-[0.3em] uppercase text-[10px]">History In Action</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">Past <span className="text-gray-600">Events</span></h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-70">
              {pastEvents.map((e: any) => <div key={e._id}><EventCard e={e} /></div>)}
              {pastEvents.length === 0 && (
                <div className="col-span-full py-16 text-center bg-[#0a0a0a] border border-white/5 rounded-3xl border-dashed">
                  <Calendar className="w-12 h-12 text-gray-800 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No past records available.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

const LandingPage = () => (
  <div className="font-sans selection:bg-red-500/30 selection:text-white bg-[#050505]">
    <Navbar />
    <main>
      <Hero />
      <WhyChooseUs />
      <TrainingPrograms />
      <BenefitsSection />
      <WhatWeSay />
      <NewsAndContact />
    </main>
    <Footer />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToAnchor />
      <div className="min-h-screen bg-transparent">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/affiliated-coaches" element={<PublicLayout><AffiliatedCoaches /></PublicLayout>} />
          <Route path="/affiliated-training-centers" element={<PublicLayout><AffiliatedTrainingCenters /></PublicLayout>} />
          <Route path="/national-referees" element={<PublicLayout><NationalReferees /></PublicLayout>} />
          <Route path="/black-belt-holders" element={<PublicLayout><BlackBeltHolders /></PublicLayout>} />
          <Route path="/national-players" element={<PublicLayout><NationalPlayers /></PublicLayout>} />
          <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
          <Route path="/register" element={<Registration />} />
          <Route path="/events" element={<PublicLayout><EventsDisplay /></PublicLayout>} />
          <Route path="/events/upcoming" element={<PublicLayout><EventsDisplay /></PublicLayout>} />
          <Route path="/events/past" element={<PublicLayout><EventsDisplay /></PublicLayout>} />

          {/* Player Routes */}
          <Route path="/player/login" element={<PlayerLogin />} />
          <Route path="/player/dashboard" element={<PlayerDashboard />} />

          {/* Portal Admin Routes */}
          <Route path="/portal-admin/login" element={<PortalLogin />} />
          <Route path="/portal-admin" element={<PortalAdminLayout />}>
            <Route index element={<Registrations />} />
            <Route path="belts" element={<BeltManagement />} />
            <Route path="academy" element={<CoachAcademy />} />
            <Route path="training-centers" element={<TrainingCentersAdmin />} />
            <Route path="events" element={<EventCreation />} />
            <Route path="gallery" element={<MediaGallery />} />
            <Route path="documents" element={<DocumentDownloads />} />
            <Route path="news" element={<NewsUpdates />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="what-we-say" element={<WhatWeSayAdmin />} />
            <Route path="referees" element={<RefereesAdmin />} />
            <Route path="black-belts" element={<BlackBeltsAdmin />} />
            <Route path="national-players" element={<NationalPlayersAdmin />} />
            <Route path="roles" element={<UserRoles />} />
          </Route>

          <Route path="/admin/login" element={<Login />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Players />} />
            <Route path="categories" element={<Categories />} />
            <Route path="tiesheets" element={<Tiesheets />} />
            <Route path="reports" element={<ReportExport />} />
          </Route>

          {/* Coach Dashboard Routes */}
          <Route path="/coach/login" element={<CoachLogin />} />
          <Route path="/coach" element={<CoachLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentManagement />} />
            <Route path="tournaments" element={<TournamentRegistration />} />
            <Route path="notifications" element={<CoachNotifications />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
