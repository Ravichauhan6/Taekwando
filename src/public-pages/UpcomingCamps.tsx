import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, ChevronRight, Clock, ShieldCheck } from 'lucide-react';

export const UpcomingCamps = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/training-camps')
      .then(res => res.json())
      .then(data => {
        // Filter for Upcoming and Ongoing
        setCamps(data.filter((c: any) => c.status !== 'Completed'));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="min-h-screen bg-[#050505] py-24 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-900/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className="w-12 h-px bg-red-600"></span>
            <span className="text-red-500 font-bold tracking-[0.4em] uppercase text-[12px]">Elite Training</span>
            <span className="w-12 h-px bg-red-600"></span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase mb-6"
          >
            Upcoming <span className="text-red-600">Training Camps</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-gray-400 text-lg leading-relaxed"
          >
            Level up your skills with our intensive training sessions led by certified masters. 
            Join the elite circle of taekwondo athletes.
          </motion.p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[450px] bg-white/5 animate-pulse rounded-3xl border border-white/10"></div>
            ))}
          </div>
        ) : camps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {camps.map((camp: any, idx: number) => (
              <motion.div
                key={camp._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] overflow-hidden group hover:border-red-500/30 transition-all duration-500 flex flex-col shadow-2xl relative"
              >
                {/* Status Badge */}
                <div className="absolute top-6 left-6 z-20">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${
                    camp.status === 'Ongoing' 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {camp.status || 'Upcoming'}
                  </span>
                </div>

                {/* Image Section */}
                <div className="h-64 relative overflow-hidden">
                  {camp.image_url ? (
                    <img 
                      src={camp.image_url} 
                      alt={camp.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-900/40 to-black flex items-center justify-center">
                      <Calendar className="w-16 h-16 text-red-500/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90"></div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-red-500 font-bold text-[10px] tracking-[0.2em] uppercase mb-4">
                    <Clock className="w-3.5 h-3.5" /> {camp.date}
                  </div>
                  
                  <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-red-500 transition-colors uppercase mb-4 line-clamp-2">
                    {camp.title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3">
                    {camp.description || "Join us for an intensive training session focusing on advanced techniques, physical conditioning, and mental discipline."}
                  </p>

                  <div className="mt-auto space-y-4">
                    <div className="flex items-center gap-3 text-gray-400 text-sm bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:border-red-500/20 transition-all">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-red-500" />
                      </div>
                      <span className="font-medium truncate">{camp.location || "TBA"}</span>
                    </div>

                    <button className="w-full bg-white/5 hover:bg-red-600 text-white font-black py-4 rounded-2xl text-[12px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border border-white/10 hover:border-red-500 group-hover:shadow-[0_10px_30px_rgba(255,0,0,0.2)]">
                      Register Now <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-[#0a0a0a] border border-white/5 rounded-[3rem] border-dashed">
            <Calendar className="w-16 h-16 text-gray-800 mx-auto mb-6 opacity-50" />
            <h3 className="text-xl font-bold text-gray-500 uppercase tracking-widest">No training camps scheduled</h3>
            <p className="text-gray-600 mt-2">Check back later for new training opportunities.</p>
          </div>
        )}

        {/* Association Footer */}
        <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white rounded-2xl p-1.5 shadow-[0_0_20px_rgba(255,0,0,0.2)]">
               <img src="/logo.png" alt="MDTA Logo" className="w-full h-full object-contain" />
             </div>
             <div>
               <p className="text-white font-black text-sm tracking-widest uppercase">MDTA OFFICIAL</p>
               <p className="text-gray-600 text-[10px] font-bold tracking-[0.2em] uppercase">Certified Training Programs</p>
             </div>
           </div>
           <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">
             <ShieldCheck className="w-4 h-4 text-red-500" /> All sessions are conducted under supervised safety guidelines
           </div>
        </div>
      </div>
    </section>
  );
};
