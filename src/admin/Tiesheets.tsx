import React, { useState, useEffect } from 'react';
import { Target, RefreshCw, Printer, AlertTriangle } from 'lucide-react';

export const Tiesheets = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [matches, setMatches] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
      if (data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0].id.toString());
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchTiesheets = async (catId: string) => {
    if (!catId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/tiesheets/${catId}`);
      if (!res.ok) throw new Error("Failed to fetch tiesheets");
      const data = await res.json();
      setMatches(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchTiesheets(selectedCategory);
    }
  }, [selectedCategory]);

  const handleGenerate = async () => {
    if (!confirm("Are you sure? This will delete all existing matches and generate fresh tiesheets for all players. This action cannot be undone.")) return;
    
    setGenerating(true);
    setError('');
    setMsg('');
    try {
      const res = await fetch('/api/tiesheets/generate', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg(data.message);
      if (selectedCategory) fetchTiesheets(selectedCategory);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Group matches by round for visualization
  // Lower round_number = closer to the final. E.g. Round 1 = Final, Round 2 = Semifinal
  const rounds = Array.from(new Set(matches.map(m => Number(m.round_number)))).sort((a: number, b: number) => b - a);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-full overflow-hidden print:overflow-visible">
      
      {/* Header - Hidden during print */}
      <div className="print:hidden">
        <h2 className="text-[32px] font-black text-white tracking-widest uppercase mb-2 drop-shadow-[0_2px_10px_rgba(255,0,0,0.2)] flex items-center gap-4">
          <div className="bg-gradient-to-br from-red-600 to-red-900 p-2.5 rounded-xl border border-red-500/50 shadow-[0_0_15px_rgba(255,0,0,0.3)]">
            <Target className="w-8 h-8 text-white" />
          </div>
          Tournament Tiesheets
        </h2>
        <p className="text-gray-400 font-medium">Generate and view match brackets for all weight categories.</p>
      </div>

      {/* Controls - Hidden during print */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-[#111] p-8 rounded-3xl shadow-[0_0_50px_rgba(255,0,0,0.1)] border border-red-500/20 print:hidden h-fit">
        <div className="flex-1 max-w-md w-full">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">View Category Brackets</label>
          <select 
            value={selectedCategory} 
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-xl px-5 py-4 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-[13px] font-bold tracking-wide transition-all select-md appearance-none cursor-pointer"
          >
            <option value="" className="bg-[#111] text-white">Select Category...</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id} className="bg-[#111] text-white">
                {cat.age_group} {cat.gender === 'Male' ? 'Boys/Men' : 'Girls/Women'} - {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4 w-full sm:w-auto mt-4 sm:mt-0">
          <button 
            onClick={handlePrint}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#0a0a0a] border border-white/5 hover:bg-white/5 hover:border-white/10 text-white font-black px-8 py-4 rounded-xl transition-all shadow-inner uppercase tracking-widest text-[11px]"
          >
            <Printer className="w-5 h-5" /> Print
          </button>
          <button 
            onClick={handleGenerate}
            disabled={generating}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-black px-8 py-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(255,0,0,0.4)] disabled:opacity-50 uppercase tracking-widest text-[11px]"
          >
            <RefreshCw className={`w-5 h-5 ${generating ? 'animate-spin' : ''}`} /> 
            {generating ? 'Processing...' : 'Generate New Tiesheets'}
          </button>
        </div>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-5 rounded-xl flex items-center gap-3 print:hidden text-sm font-bold uppercase tracking-wide"><AlertTriangle className="w-5 h-5"/> {error}</div>}
      {msg && <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-5 rounded-xl flex items-center gap-3 print:hidden text-sm font-bold uppercase tracking-wide">✅ {msg}</div>}

      {/* Bracket Visualization Area */}
      <div className="allow-print print:absolute print:left-0 print:top-0 print:w-full bg-[#111] rounded-3xl shadow-[0_0_50px_rgba(255,0,0,0.05)] border border-white/5 overflow-x-auto print:overflow-visible print:border-none print:shadow-none p-10 min-h-[600px] custom-scrollbar relative">
        
        {/* Background Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/5 blur-[120px] pointer-events-none rounded-full print:hidden"></div>

        {/* Print Header */}
        <div className="hidden print:block text-center mb-12 border-b-2 border-black pb-4">
          <h1 className="text-4xl font-black uppercase mb-3 tracking-widest">Tournament Official Tiesheet</h1>
          <h2 className="text-2xl font-bold text-gray-800 uppercase">
            {categories.find(c => c.id.toString() === selectedCategory)?.age_group} <span className="mx-2">•</span> 
            {categories.find(c => c.id.toString() === selectedCategory)?.gender} <span className="mx-2">•</span> 
            {categories.find(c => c.id.toString() === selectedCategory)?.name}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-500 font-bold uppercase tracking-widest animate-pulse relative z-10">Loading bracket topology...</div>
        ) : matches.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-64 text-gray-600 relative z-10">
             <Target className="w-16 h-16 mb-6 opacity-20" />
             <p className="font-bold text-lg uppercase tracking-widest mb-2 text-gray-400">No Bracket Generated</p>
             <p className="text-[11px] uppercase tracking-widest bg-black/50 px-4 py-2 rounded-lg">Select 'Generate New Tiesheets' to begin.</p>
           </div>
        ) : (
          <div className="flex items-stretch min-w-max gap-16 relative z-10">
            {rounds.map((roundNum, index) => {
              const roundMatches = matches.filter(m => m.round_number === roundNum);
              
              let roundName = `Round of ${Math.pow(2, Number(roundNum))}`;
              if (roundNum === 1) roundName = "Final";
              if (roundNum === 2) roundName = "Semifinals";
              if (roundNum === 3) roundName = "Quarterfinals";

              return (
                <div key={roundNum} className="flex flex-col justify-around flex-1 text-sm relative">
                  <div className="text-center font-black text-white bg-white/5 border border-white/10 rounded-xl py-3 mb-12 uppercase tracking-[0.2em] shadow-inner print:text-black print:border-none print:shadow-none print:bg-transparent">
                    {roundName}
                  </div>
                  
                  {roundMatches.map((m) => (
                    <div key={m.id} className="relative mb-12 z-10">
                        {/* Match Box */}
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.5)] w-56 flex flex-col overflow-hidden relative z-20 print:border-2 print:border-black print:shadow-none print:bg-transparent hover:border-red-500/50 transition-colors group">
                            <div className="border-b border-white/5 flex flex-col justify-center py-3 px-4 print:border-black h-1/2 group-hover:bg-white/[0.02]">
                                <span className={`truncate font-bold text-[13px] uppercase tracking-wide leading-tight ${!m.player1_name ? 'text-gray-600 italic' : 'text-white print:text-black'}`}>
                                    {m.player1_name || 'BYE / TBD'}
                                </span>
                                {m.player1_name && m.player1_address && (
                                  <span className="text-[10px] text-gray-500 truncate leading-tight mt-1 print:text-gray-700 font-medium">{m.player1_address}</span>
                                )}
                            </div>
                            <div className="flex flex-col justify-center py-3 px-4 h-1/2 group-hover:bg-white/[0.02]">
                                <span className={`truncate font-bold text-[13px] uppercase tracking-wide leading-tight ${!m.player2_name ? 'text-gray-600 italic' : 'text-white print:text-black'}`}>
                                    {m.player2_name || 'BYE / TBD'}
                                </span>
                                {m.player2_name && m.player2_address && (
                                  <span className="text-[10px] text-gray-500 truncate leading-tight mt-1 print:text-gray-700 font-medium">{m.player2_address}</span>
                                )}
                            </div>
                            <div className="absolute right-0 top-0 bottom-0 w-10 bg-[#111] flex flex-col justify-around items-center border-l border-white/5 text-xs font-black text-gray-600 print:border-black print:bg-white print:text-black group-hover:bg-red-500/10 group-hover:text-red-500 transition-colors">
                                <span>{m.player1_id ? '' : '-'}</span>
                                <span>{m.player2_id ? '' : '-'}</span>
                            </div>
                            <div className="bg-gradient-to-r from-red-600 to-red-900 border-t border-red-500/30 text-white text-[9px] uppercase font-black tracking-widest text-center py-1 print:bg-gray-200 print:text-black print:border-black">
                              Match #{m.match_number}
                            </div>
                        </div>

                        {/* Connector logic */}
                        {index < rounds.length - 1 && (
                            <div className="absolute top-1/2 -right-8 w-8 h-px bg-white/20 print:bg-black -z-10 group-hover:bg-red-500/50 transition-colors"></div>
                        )}
                    </div>
                  ))}
                </div>
              );
            })}
            
            {/* The Champion Slot */}
            <div className="flex flex-col justify-around flex-1 text-sm relative">
              <div className="text-center font-black text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 rounded-xl py-3 mb-12 uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(234,179,8,0.1)] print:text-black print:border-none print:shadow-none print:bg-transparent">
                Champion
              </div>
              <div className="relative mb-12 z-10 flex items-center">
                  <div className="absolute top-1/2 -left-8 w-8 h-px bg-white/20 print:bg-black -z-10"></div>
                  <div className="bg-[#0a0a0a] border border-yellow-500/50 rounded-xl shadow-[0_0_30px_rgba(234,179,8,0.2)] w-56 p-6 text-center print:border-2 print:border-black print:shadow-none print:bg-transparent relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-full bg-yellow-500/5 pointer-events-none print:hidden"></div>
                      <Target className="w-12 h-12 mx-auto text-yellow-500 mb-4 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] print:text-black print:drop-shadow-none" />
                      <span className="font-black text-yellow-500 uppercase tracking-widest truncate block text-[15px] print:text-black">TBD</span>
                  </div>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};
