import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Medal, Users, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AffiliatedCoaches = () => {
  const [coaches, setCoaches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    try {
      const res = await fetch('/api/coaches');
      if (res.ok) {
        const data = await res.json();
        // Only show strictly connected and active coaches publicly
        setCoaches(data.filter((c: any) => c.status === 'Active'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white relative flex flex-col items-center pb-20">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5 mix-blend-luminosity pointer-events-none fixed"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none fixed"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none fixed"></div>

      {/* Header Profile Title */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-4 relative z-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-center mb-6">
            <Link to="/" className="p-1 px-1.5 bg-white border border-red-500/30 rounded-2xl shadow-[0_0_30px_rgba(255,0,0,0.2)] inline-flex group/logo overflow-hidden h-16 w-16 items-center justify-center">
               <img src="/logo.png" alt="MDTA Logo" className="w-full h-full object-contain group-hover/logo:scale-110 transition-transform" />
            </Link>
          </div>
         <h1 className="text-4xl md:text-5xl font-black tracking-widest uppercase title-gradient mb-4">Affiliated Coaches</h1>
         <p className="text-gray-400 font-medium tracking-wide max-w-2xl mx-auto">
            Meet the officially registered and certified masters of the district leading the next generation of MDTA champions.
         </p>
         <div className="w-24 h-1 bg-red-600 mx-auto mt-8 rounded-full shadow-[0_0_10px_rgba(255,0,0,0.8)]"></div>
      </div>

      {/* Grid Canvas */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 relative z-10">
         {isLoading ? (
            <div className="flex justify-center py-20">
               <div className="w-12 h-12 border-4 border-white/10 border-t-red-500 rounded-full animate-spin"></div>
            </div>
         ) : coaches.length === 0 ? (
            <div className="text-center py-20 bg-[#111]/80 backdrop-blur-xl border border-white/5 rounded-3xl">
               <Users className="w-16 h-16 text-gray-500 md:mx-auto mb-4 mx-auto" />
               <h3 className="text-xl font-bold text-white mb-2 tracking-widest uppercase">No Coaches Registered</h3>
               <p className="text-gray-400">Official affiliated coaches will appear here once verified by MDTA.</p>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {coaches.map((coach, i) => (
                  <div 
                     key={coach._id} 
                     className="bg-[#111]/90 backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden hover:border-red-500/50 transition-all duration-500 group animate-in fade-in zoom-in-95"
                     style={{ animationDelay: `${i * 100}ms` }}
                  >
                     {/* Image Frame */}
                     <div className="w-full aspect-[4/3] bg-black/60 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111]/90 to-transparent z-10"></div>
                        {coach.image_url ? (
                           <img 
                              src={coach.image_url} 
                              alt={coach.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                           />
                        ) : (
                           <Users className="w-16 h-16 text-gray-600" />
                        )}
                        <div className="absolute bottom-4 left-6 z-20">
                           <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black tracking-widest uppercase rounded shadow-[0_0_15px_rgba(255,0,0,0.5)]">Verified ID: {coach._id.slice(-6).toUpperCase()}</span>
                        </div>
                     </div>

                     {/* Profile Data */}
                     <div className="p-8 pt-4 space-y-6">
                        <div>
                           <h3 className="text-2xl font-black text-white tracking-wide">{coach.name}</h3>
                           <p className="text-red-500 font-bold text-sm tracking-widest mt-1 flex items-center gap-2">
                              {coach.academyName || 'MDTA Affiliated'}教练
                           </p>
                        </div>

                        <div className="space-y-3">
                           <div className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                                 <Medal className="w-4 h-4 text-red-500" />
                              </div>
                              <div className="flex flex-col pt-1.5">
                                 <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Qualifications</span>
                                 <span className="text-gray-300 font-medium text-sm leading-snug">{coach.qualifications || 'Certified Combatant'}</span>
                              </div>
                           </div>

                           <div className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                                 <MapPin className="w-4 h-4 text-red-500" />
                              </div>
                              <div className="flex flex-col pt-1.5">
                                 <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Training Center</span>
                                 <span className="text-gray-300 font-medium text-sm leading-snug">{coach.address || 'Address Withheld'}</span>
                              </div>
                           </div>

                           <div className="flex items-start gap-4 group/contact">
                              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0 group-hover/contact:bg-red-500/20 group-hover/contact:border-red-500/50 transition-colors">
                                 <Phone className="w-4 h-4 text-red-500" />
                              </div>
                              <div className="flex flex-col pt-1.5">
                                 <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Direct Contact</span>
                                 <span className="text-gray-300 font-medium text-sm">{coach.contactNumber || 'On Request'}</span>
                              </div>
                           </div>

                           <div className="flex items-start gap-4 group/contact">
                              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0 group-hover/contact:bg-red-500/20 group-hover/contact:border-red-500/50 transition-colors">
                                 <Mail className="w-4 h-4 text-red-500" />
                              </div>
                              <div className="flex flex-col pt-1.5">
                                 <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Email Access</span>
                                 <span className="text-gray-300 font-medium text-sm truncate max-w-[200px]">{coach.email && coach.email.length > 25 ? coach.email.substring(0,22)+'...' : coach.email || 'Not Provided'}</span>
                              </div>
                           </div>
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
