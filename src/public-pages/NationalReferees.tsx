import React, { useState, useEffect } from 'react';
import { Shield, Phone, Mail, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NationalReferees = () => {
  const [referees, setReferees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/verified-entities')
      .then(r => r.json())
      .then(data => setReferees(data.filter((e: any) => e.category === 'Referee')))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-white relative flex flex-col items-center pb-20">

      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5 mix-blend-luminosity pointer-events-none fixed" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none fixed" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none fixed" />

      {/* Header */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 relative z-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-center mb-6">
          <Link to="/" className="p-1 px-1.5 bg-white border border-red-500/30 rounded-2xl shadow-[0_0_30px_rgba(255,0,0,0.2)] inline-flex group/logo overflow-hidden h-16 w-16 items-center justify-center">
            <img src="/logo.png" alt="MDTA Logo" className="w-full h-full object-contain group-hover/logo:scale-110 transition-transform" />
          </Link>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-widest uppercase mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Our National Referees
        </h1>
        <p className="text-gray-400 font-medium tracking-wide max-w-2xl mx-auto">
          Officially registered and certified referees of Maharajganj District Taekwondo Association.
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-red-900 mx-auto mt-8 rounded-full shadow-[0_0_10px_rgba(255,0,0,0.8)]" />
      </div>

      {/* Content */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 relative z-10">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-white/10 border-t-red-500 rounded-full animate-spin" />
          </div>
        ) : referees.length === 0 ? (
          <div className="text-center py-20 bg-[#111]/80 backdrop-blur-xl border border-white/5 rounded-3xl">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2 tracking-widest uppercase">No Referees Listed Yet</h3>
            <p className="text-gray-500">Official national referees will appear here once added by MDTA.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {referees.map((ref, i) => (
              <div key={ref._id}
                className="bg-[#111]/90 backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(255,0,0,0.1)] transition-all duration-500 group animate-in fade-in zoom-in-95"
                style={{ animationDelay: `${i * 80}ms` }}>

                {/* Photo */}
                <div className="w-full aspect-[4/3] bg-black/60 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111]/90 to-transparent z-10" />
                  {ref.image_url ? (
                    <img src={ref.image_url} alt={ref.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <Shield className="w-20 h-20 text-gray-700" />
                  )}
                  <div className="absolute bottom-4 left-6 z-20">
                    <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black tracking-widest uppercase rounded shadow-[0_0_15px_rgba(255,0,0,0.5)]">
                      MDTA Referee
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-7 space-y-4">
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-wide">{ref.name}</h3>
                    <p className="text-red-500 font-bold text-sm tracking-widest mt-1">National Referee</p>
                  </div>
                  <div className="space-y-3 border-t border-white/5 pt-4">
                    {ref.mobile && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <Phone className="w-4 h-4 text-red-500" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Mobile</p>
                          <p className="text-gray-300 font-medium text-sm">{ref.mobile}</p>
                        </div>
                      </div>
                    )}
                    {ref.email && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <Mail className="w-4 h-4 text-red-500" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Email</p>
                          <p className="text-gray-300 font-medium text-sm truncate max-w-[200px]">{ref.email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
