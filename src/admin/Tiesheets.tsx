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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-full overflow-hidden">
      
      {/* Header - Hidden during print */}
      <div className="print:hidden">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Target className="w-8 h-8 text-red-600" />
          Tournament Tiesheets
        </h2>
        <p className="text-gray-500 mt-1">Generate and view match brackets for all weight categories.</p>
      </div>

      {/* Controls - Hidden during print */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 print:hidden">
        <div className="flex-1 max-w-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-2">View Category</label>
          <select 
            value={selectedCategory} 
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-500 outline-none select-md"
          >
            <option value="">Select Category...</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.age_group} {cat.gender === 'Male' ? 'Boys/Men' : 'Girls/Women'} - {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-6 py-3 rounded-xl transition-all"
          >
            <Printer className="w-5 h-5" /> Print Bracket
          </button>
          <button 
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-red-500/30"
          >
            <RefreshCw className={`w-5 h-5 ${generating ? 'animate-spin' : ''}`} /> 
            {generating ? 'Generating...' : 'Generate All Tiesheets'}
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 print:hidden"><AlertTriangle/> {error}</div>}
      {msg && <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-2 print:hidden">✅ {msg}</div>}

      {/* Bracket Visualization Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto print:border-none print:shadow-none p-8 min-h-[500px]">
        
        {/* Print Header */}
        <div className="hidden print:block text-center mb-10">
          <h1 className="text-3xl font-bold uppercase mb-2">Tournament Official Tiesheet</h1>
          <h2 className="text-xl text-gray-700">
            {categories.find(c => c.id.toString() === selectedCategory)?.age_group} - 
            {categories.find(c => c.id.toString() === selectedCategory)?.gender} - 
            {categories.find(c => c.id.toString() === selectedCategory)?.name}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400">Loading bracket...</div>
        ) : matches.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-64 text-gray-400">
             <Target className="w-12 h-12 mb-4 opacity-20" />
             <p>No matches generated for this category yet.</p>
             <p className="text-sm mt-2">Click "Generate All Tiesheets" to create the brackets.</p>
           </div>
        ) : (
          <div className="flex items-stretch min-w-max gap-12">
            {rounds.map((roundNum, index) => {
              const roundMatches = matches.filter(m => m.round_number === roundNum);
              
              let roundName = `Round of ${Math.pow(2, Number(roundNum))}`;
              if (roundNum === 1) roundName = "Final";
              if (roundNum === 2) roundName = "Semifinals";
              if (roundNum === 3) roundName = "Quarterfinals";

              return (
                <div key={roundNum} className="flex flex-col justify-around flex-1 text-sm relative">
                  <div className="text-center font-bold text-gray-500 mb-8 uppercase tracking-wider print:text-black">
                    {roundName}
                  </div>
                  
                  {roundMatches.map((m) => (
                    <div key={m.id} className="relative mb-8 z-10">
                        {/* Match Box */}
                        <div className="bg-white border-2 border-slate-200 rounded-lg shadow-sm w-48 flex flex-col overflow-hidden relative z-20 print:border-black print:shadow-none">
                            <div className="border-b border-slate-100 flex items-center justify-between print:border-black">
                                <span className={`p-2 flex-1 truncate font-medium ${!m.player1_name ? 'text-gray-400 italic' : 'text-gray-800 print:text-black'}`}>
                                    {m.player1_name || 'BYE / TBD'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className={`p-2 flex-1 truncate font-medium ${!m.player2_name ? 'text-gray-400 italic' : 'text-gray-800 print:text-black'}`}>
                                    {m.player2_name || 'BYE / TBD'}
                                </span>
                            </div>
                            <div className="absolute right-0 top-0 bottom-0 w-8 bg-slate-50 flex flex-col justify-around items-center border-l border-slate-100 text-xs font-mono text-slate-400 print:border-black print:bg-white print:text-black">
                                <span>{m.player1_id ? '' : '-'}</span>
                                <span>{m.player2_id ? '' : '-'}</span>
                            </div>
                            <div className="bg-slate-800 text-white text-[10px] uppercase font-bold text-center py-0.5 print:bg-gray-200 print:text-black print:border-t print:border-black">
                              Match #{m.match_number}
                            </div>
                        </div>

                        {/* Connector logic (Draws connecting lines to the next match) */}
                        {index < rounds.length - 1 && (
                            <div className="absolute top-1/2 -right-6 w-6 h-px bg-slate-400 print:bg-black -z-10"></div>
                        )}
                    </div>
                  ))}
                </div>
              );
            })}
            
            {/* The Champion Slot */}
            <div className="flex flex-col justify-around flex-1 text-sm relative">
              <div className="text-center font-bold text-yellow-600 mb-8 uppercase tracking-wider print:text-black">
                Champion
              </div>
              <div className="relative mb-8 z-10 flex items-center">
                  <div className="absolute top-1/2 -left-6 w-6 h-px bg-slate-400 print:bg-black -z-10"></div>
                  <div className="bg-gradient-to-r from-yellow-50 to-white border-2 border-yellow-400 rounded-lg shadow-md w-48 p-4 text-center print:border-black print:shadow-none print:bg-none">
                      <Target className="w-8 h-8 mx-auto text-yellow-500 mb-2 print:text-black" />
                      <span className="font-bold text-yellow-800 truncate block print:text-black">To Be Decided</span>
                  </div>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};
