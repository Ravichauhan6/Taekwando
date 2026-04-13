import React, { useState, useEffect } from 'react';
import { Trophy, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const MEDAL_STYLE: Record<string, string> = {
  Gold:         'bg-yellow-400/15 text-yellow-300 border-yellow-400/40',
  Silver:       'bg-gray-300/15 text-gray-200 border-gray-300/40',
  Bronze:       'bg-orange-400/15 text-orange-300 border-orange-400/40',
  Participated: 'bg-blue-400/15 text-blue-300 border-blue-400/40',
};

const CAT_COLOR: Record<string, string> = {
  'Sub-Junior': 'bg-red-700/80',
  'Cadet':      'bg-red-600/80',
  'Junior':     'bg-red-500/80',
  'Senior':     'bg-rose-600/80',
};

const TABS = ['All', 'Sub-Junior', 'Cadet', 'Junior', 'Senior'];

export const NationalPlayers = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    fetch('/api/verified-entities')
      .then(r => r.json())
      .then(data => setPlayers(data.filter((e: any) => e.category === 'NationalPlayer')))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = players.filter(p => activeTab === 'All' || p.player_category === activeTab);

  return (
    <div className="bg-[#050505] min-h-screen text-white relative flex flex-col items-center pb-20">

      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5 mix-blend-luminosity pointer-events-none fixed" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none fixed" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none fixed" />

      {/* Header */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 relative z-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-br from-red-600/20 to-red-900/20 border border-red-500/30 rounded-2xl shadow-[0_0_30px_rgba(255,0,0,0.2)] inline-flex">
            <Trophy className="w-10 h-10 text-red-500" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-widest uppercase mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Our National Players
        </h1>
        <p className="text-gray-400 font-medium tracking-wide max-w-2xl mx-auto">
          Pride of Maharajganj — athletes who have represented at national-level championships.
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-red-900 mx-auto mt-8 rounded-full shadow-[0_0_10px_rgba(255,0,0,0.8)]" />
      </div>

      {/* Category Filter */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 relative z-10">
        <div className="flex flex-wrap gap-3 justify-center">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest border transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-red-600 to-red-900 border-red-500/50 text-white shadow-[0_0_15px_rgba(255,0,0,0.3)]'
                  : 'bg-black/30 border-white/10 text-gray-400 hover:border-red-500/30 hover:text-white'
              }`}>
              {tab}
              <span className="ml-2 text-xs opacity-60">
                ({tab === 'All' ? players.length : players.filter(p => p.player_category === tab).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 relative z-10">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-white/10 border-t-red-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-[#111]/80 backdrop-blur-xl border border-white/5 rounded-3xl">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2 tracking-widest uppercase">No Players Listed Yet</h3>
            <p className="text-gray-500">National players will appear here once registered by MDTA.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((player, i) => {
              const cat = player.player_category || 'Junior';
              const goldCount = player.championships?.filter((c: any) => c.medal === 'Gold').length || 0;
              const silverCount = player.championships?.filter((c: any) => c.medal === 'Silver').length || 0;
              const bronzeCount = player.championships?.filter((c: any) => c.medal === 'Bronze').length || 0;

              return (
                <div key={player._id}
                  className="bg-[#111]/90 backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(255,0,0,0.1)] transition-all duration-500 group animate-in fade-in zoom-in-95"
                  style={{ animationDelay: `${i * 80}ms` }}>

                  {/* Red top bar */}
                  <div className="h-1 w-full bg-gradient-to-r from-red-600 via-red-500 to-rose-700" />

                  {/* Photo */}
                  <div className="w-full aspect-[4/3] bg-black/60 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111]/90 to-transparent z-10" />
                    {player.image_url ? (
                      <img src={player.image_url} alt={player.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <Trophy className="w-20 h-20 text-gray-700" />
                    )}
                    <div className="absolute bottom-4 left-6 z-20 flex items-center gap-2">
                      <span className={`px-3 py-1 text-white text-[10px] font-black tracking-widest uppercase rounded shadow-[0_0_15px_rgba(255,0,0,0.5)] ${CAT_COLOR[cat] || 'bg-red-600/80'}`}>
                        {cat}
                      </span>
                    </div>
                    {/* Medal tally floating */}
                    {(goldCount > 0 || silverCount > 0 || bronzeCount > 0) && (
                      <div className="absolute bottom-4 right-4 z-20 flex gap-1.5">
                        {goldCount > 0 && <span className="bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-[10px] font-black px-2 py-0.5 rounded">🥇{goldCount}</span>}
                        {silverCount > 0 && <span className="bg-gray-300/20 border border-gray-300/40 text-gray-200 text-[10px] font-black px-2 py-0.5 rounded">🥈{silverCount}</span>}
                        {bronzeCount > 0 && <span className="bg-orange-400/20 border border-orange-400/40 text-orange-300 text-[10px] font-black px-2 py-0.5 rounded">🥉{bronzeCount}</span>}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-7 space-y-4">
                    <div>
                      <h3 className="text-xl font-black text-white tracking-wide">{player.name}</h3>
                      <div className="flex flex-wrap gap-3 mt-2">
                        {player.weight_category && (
                          <span className="text-xs text-gray-400 font-medium">⚖ {player.weight_category}</span>
                        )}
                        {player.dob && (
                          <span className="text-xs text-gray-500">🎂 {player.dob}</span>
                        )}
                      </div>
                    </div>

                    {/* Championships */}
                    {player.championships?.length > 0 && (
                      <div className="border-t border-white/5 pt-4 space-y-2">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">National Championships</p>
                        <div className="space-y-1.5 max-h-32 overflow-y-auto">
                          {player.championships.map((c: any, idx: number) => (
                            <div key={idx} className="flex items-start gap-2">
                              <span className={`shrink-0 mt-0.5 px-1.5 py-0.5 rounded border text-[9px] font-black uppercase ${MEDAL_STYLE[c.medal] || MEDAL_STYLE['Participated']}`}>
                                {c.medal}
                              </span>
                              <p className="text-gray-300 text-xs leading-snug">{c.name}{c.year ? ` (${c.year})` : ''}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
