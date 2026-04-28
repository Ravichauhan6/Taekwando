import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Target, Zap, Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AboutMDTA = () => {
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
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen pt-12 pb-24 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16 border-b border-white/[0.06] pb-10">
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-red-500/50 overflow-hidden shadow-[0_0_30px_rgba(255,0,0,0.3)] bg-white p-1">
              <img src="/logo.png" alt="MDTA" className="w-full h-full object-cover rounded-full" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-red-600 border-4 border-[#050505]" />
          </div>
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(255,0,0,1)]" />
              <span className="text-red-400/80 text-xs font-black tracking-[0.25em] uppercase">Est. 2011 · Regd.</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase leading-tight">
              MAHARAJGANJ <br className="hidden md:block" />
              <span className="text-red-500">TAEKWONDO</span> ASSOCIATION
            </h1>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {stats.map((s, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 sm:p-8 text-center hover:border-red-500/30 hover:bg-red-500/[0.03] transition-all duration-300"
            >
              <div className="text-3xl sm:text-4xl mb-3">{s.icon}</div>
              <div className="text-2xl sm:text-3xl font-black text-white mb-1 group-hover:text-red-400 transition-colors duration-300">{s.value}</div>
              <div className="text-xs sm:text-sm text-gray-400 font-bold tracking-widest uppercase">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* About & Mission */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="text-white font-black text-sm tracking-[0.25em] uppercase">About MDTA</h2>
            </div>
            <div className="space-y-6">
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                Maharajganj District Taekwondo Association has been working for the last{' '}
                <span className="text-white font-semibold">15+ years</span> in Maharajganj district to train students for self-protection and sports. Established in{' '}
                <span className="text-red-400 font-semibold">2011</span>, MDTA is the backbone of martial arts development in the district.
              </p>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                MDTA is the <span className="text-white font-semibold">only district sports body</span> recognized by UP Taekwondo Association — accredited with the UP Olympic Association.
              </p>
              <div className="mt-8 pl-6 border-l-4 border-red-500/40 py-2">
                <p className="text-red-300/90 text-lg italic leading-relaxed font-medium">
                  "Many players in the district are illuminating the name of Maharajganj by participating at the state and national level."
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {[
              { icon: <Target className="w-5 h-5 text-red-400" />, title: 'Our Mission', desc: 'Cultivate champions at district, state & national level while promoting discipline, respect, and indomitable spirit.' },
              { icon: <Zap className="w-5 h-5 text-red-400" />, title: 'Our Vision', desc: 'Make Maharajganj a leading Taekwondo district by producing nationally recognized athletes.' },
              { icon: <Heart className="w-5 h-5 text-red-400" />, title: 'Community', desc: 'Building confidence, fitness, and a sense of community across all age groups in the district.' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-5 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:border-red-500/20 hover:bg-red-500/[0.02] transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-widest uppercase mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Three Pillars */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-white font-black text-sm tracking-[0.25em] uppercase flex-shrink-0">The Three Pillars</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-red-500/30 to-transparent" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((p, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className="bg-[#111] border border-white/[0.05] rounded-3xl p-8 hover:border-red-500/30 hover:bg-red-500/[0.02] transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-red-500/0 group-hover:via-red-500/50 to-transparent transition-all duration-500" />
                <div className="text-4xl mb-6">{p.icon}</div>
                <h3 className="text-red-400 font-black text-xs tracking-[0.2em] uppercase mb-4">{p.title}</h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-white font-black text-sm tracking-[0.25em] uppercase flex-shrink-0">Milestones</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-red-500/30 to-transparent" />
          </div>
          <div className="relative pl-10 md:pl-12 max-w-4xl">
            <div className="absolute left-[19px] top-4 bottom-4 w-1 bg-gradient-to-b from-red-600/50 via-red-600/20 to-transparent rounded-full" />
            <div className="space-y-8">
              {achievements.map((item, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={i}
                  className="relative group"
                >
                  <div className="absolute -left-[50px] md:-left-[58px] top-5 w-[26px] h-[26px] rounded-full bg-[#050505] border-4 border-red-600/50 group-hover:border-red-400/80 group-hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] transition-all duration-300 flex items-center justify-center z-10">
                    <div className="w-2 h-2 rounded-full bg-red-600/80 group-hover:bg-red-400 transition-colors duration-300" />
                  </div>
                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 sm:p-8 group-hover:border-red-500/30 group-hover:bg-red-500/[0.02] transition-colors duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                      <span className="text-red-500 font-black text-sm tracking-widest">{item.year}</span>
                      <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-red-500/40" />
                      <h3 className="text-white font-bold text-lg">{item.title}</h3>
                    </div>
                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[40px] overflow-hidden border border-red-500/20 bg-gradient-to-br from-[#150000] to-[#0a0000] px-8 py-16 md:px-16 md:py-20 text-center shadow-2xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0,rgba(255,0,0,0.15)_0%,transparent_70%)]" />
          <p className="text-xs font-black tracking-[0.4em] text-red-500 uppercase mb-4 relative z-10">Join The Legacy</p>
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-black mb-6 tracking-tight relative z-10">
            Ready to Begin Your <span className="text-red-500">Journey?</span>
          </h2>
          <p className="text-gray-300 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed relative z-10">
            Train under certified masters and become part of MDTA's proud legacy. Discover your true potential today.
          </p>
          <div className="flex justify-center relative z-10">
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white rounded-full font-bold text-sm tracking-[0.1em] uppercase shadow-[0_0_20px_rgba(255,0,0,0.3)] hover:shadow-[0_0_40px_rgba(255,0,0,0.5)] transition-all duration-300 border border-red-500/50 hover:-translate-y-1"
            >
              <ArrowRight className="w-5 h-5" />
              Enroll Now
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
