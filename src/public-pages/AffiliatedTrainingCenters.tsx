import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Phone, Mail, User, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AffiliatedTrainingCenters = () => {
  const [centers, setCenters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/training-centers')
      .then(r => r.json())
      .then(data => setCenters(data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-white relative flex flex-col items-center pb-24">

      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/8 rounded-full blur-[140px] pointer-events-none fixed" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-900/8 rounded-full blur-[120px] pointer-events-none fixed" />

      {/* Page Header */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 relative z-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-center mb-6">
          <Link to="/" className="p-1 px-1.5 bg-white border border-red-500/30 rounded-2xl shadow-[0_0_30px_rgba(255,0,0,0.2)] inline-flex group/logo overflow-hidden h-16 w-16 items-center justify-center">
            <img src="/logo.png" alt="MDTA Logo" className="w-full h-full object-contain group-hover/logo:scale-110 transition-transform" />
          </Link>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-widest uppercase mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Affiliated Training Centers
        </h1>
        <p className="text-gray-400 font-medium tracking-wide max-w-2xl mx-auto leading-relaxed">
          Officially affiliated Taekwondo training centers operating under<br />
          <span className="text-red-400 font-bold">Maharajganj District Taekwondo Association (Regd.)</span>
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-red-900 mx-auto mt-8 rounded-full shadow-[0_0_10px_rgba(255,0,0,0.8)]" />
      </div>

      {/* Cards */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 relative z-10">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-white/10 border-t-red-500 rounded-full animate-spin" />
          </div>
        ) : centers.length === 0 ? (
          <div className="text-center py-20 bg-[#111]/80 backdrop-blur-xl border border-white/5 rounded-3xl">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2 tracking-widest uppercase">No Centers Listed Yet</h3>
            <p className="text-gray-500">Affiliated training centers will appear here once registered by MDTA.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {centers.map((center, i) => (
              <div
                key={center._id}
                className="relative bg-[#111]/90 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-red-500/40 hover:shadow-[0_0_50px_rgba(255,0,0,0.12)] transition-all duration-500 group animate-in fade-in zoom-in-95"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Top red accent */}
                <div className="h-1 w-full bg-gradient-to-r from-red-700 via-red-500 to-rose-700 shadow-[0_0_12px_rgba(255,0,0,0.4)]" />

                {/* Logo + Name header */}
                <div className="flex items-center gap-5 p-6 pb-5">
                  {/* Logo Circle */}
                  <div className="shrink-0 w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.15)] border-2 border-red-500/20 overflow-hidden group-hover:shadow-[0_0_30px_rgba(255,0,0,0.2)] transition-all">
                    {center.logo_url ? (
                      <img
                        src={center.logo_url}
                        alt={center.centerName}
                        className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <Building2 className="w-9 h-9 text-gray-400" />
                    )}
                  </div>

                  {/* Name + badge */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-black uppercase tracking-[3px] text-red-500 mb-1 inline-block">MDTA Affiliated</span>
                    <h3 className="text-white font-black text-[15px] leading-snug uppercase">{center.centerName}</h3>
                  </div>
                </div>

                {/* Divider */}
                <div className="mx-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Details */}
                <div className="p-6 space-y-3">
                  {center.address && (
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-red-400" />
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Address</p>
                        <p className="text-gray-300 text-sm font-medium leading-snug mt-0.5">{center.address}</p>
                      </div>
                    </div>
                  )}

                  {center.coachName && (
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5 text-red-400" />
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Incharge / Coach</p>
                        <p className="text-white text-sm font-bold mt-0.5">{center.coachName}</p>
                      </div>
                    </div>
                  )}

                  {(center.contact || center.email) && (
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-red-400" />
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Contact</p>
                        {center.contact && <p className="text-gray-300 text-sm font-medium mt-0.5">{center.contact}</p>}
                        {center.email && (
                          <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-red-500 shrink-0" />
                            {center.email}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom badge */}
                <div className="border-t border-white/5 px-6 py-3 flex items-center justify-between bg-black/30">
                  <span className="text-[9px] font-black uppercase tracking-[2px] text-red-600">✓ Officially Registered</span>
                  <span className="text-[9px] text-gray-700 font-medium">MDTA</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
