import React, { useState, useEffect } from 'react';
import { Award, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BlackBeltHolders = () => {
  const [holders, setHolders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/verified-entities')
      .then(r => r.json())
      .then(data => setHolders(data.filter((e: any) => e.category === 'BlackBelt')))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-white relative flex flex-col items-center pb-20">

      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5 mix-blend-luminosity pointer-events-none fixed" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none fixed" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-900/8 rounded-full blur-[120px] pointer-events-none fixed" />

      {/* Header */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 relative z-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-center mb-6">
          <Link to="/" className="p-1 px-1.5 bg-white border border-red-500/30 rounded-2xl shadow-[0_0_30px_rgba(255,0,0,0.2)] inline-flex group/logo overflow-hidden h-16 w-16 items-center justify-center">
            <img src="/logo.png" alt="MDTA Logo" className="w-full h-full object-contain group-hover/logo:scale-110 transition-transform" />
          </Link>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-widest uppercase mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Our Black Belt Holders
        </h1>
        <p className="text-gray-400 font-medium tracking-wide max-w-2xl mx-auto">
          Kukkiwon certified black belt holders registered under Maharajganj District Taekwondo Association.
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-red-900 mx-auto mt-8 rounded-full shadow-[0_0_10px_rgba(255,0,0,0.8)]" />
      </div>

      {/* Content */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 relative z-10">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-white/10 border-t-red-500 rounded-full animate-spin" />
          </div>
        ) : holders.length === 0 ? (
          <div className="text-center py-20 bg-[#111]/80 backdrop-blur-xl border border-white/5 rounded-3xl">
            <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2 tracking-widest uppercase">No Records Listed Yet</h3>
            <p className="text-gray-500">Black belt holders will appear here once registered by MDTA.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {holders.map((holder, i) => (
              <div key={holder._id}
                className="bg-[#111]/90 backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(255,0,0,0.12)] transition-all duration-500 group animate-in fade-in zoom-in-95"
                style={{ animationDelay: `${i * 80}ms` }}>

                {/* Photo */}
                <div className="w-full aspect-[4/3] bg-black/60 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111]/90 to-transparent z-10" />
                  {holder.image_url ? (
                    <img src={holder.image_url} alt={holder.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <Award className="w-20 h-20 text-gray-700" />
                  )}
                  <div className="absolute bottom-4 left-6 z-20">
                    <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black tracking-widest uppercase rounded shadow-[0_0_15px_rgba(255,0,0,0.5)]">
                      {holder.dan_level || 'Black Belt Holder'}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-7 space-y-4">
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-wide uppercase">{holder.name}</h3>
                    {holder.dan_level && (
                      <p className="text-red-400 font-bold text-sm tracking-widest mt-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                        {holder.dan_level}
                      </p>
                    )}
                  </div>

                  {holder.dan_poom_no && (
                    <div className="bg-black/40 border border-white/8 rounded-xl px-4 py-3">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">DAN / POOM No.</p>
                      <p className="text-white font-mono font-black text-lg tracking-[4px]">{holder.dan_poom_no}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
