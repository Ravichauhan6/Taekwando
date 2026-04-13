import React, { useState, useEffect, useMemo } from 'react';
import { UserPlus, Filter, Search, Trash2, Edit2, XCircle } from 'lucide-react';

const toTitleCase = (str: string) => {
  return str.replace(/\b\w+/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
};

export const Players = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterAge, setFilterAge] = useState('All');
  const [filterGender, setFilterGender] = useState('All');
  const [search, setSearch] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [weight, setWeight] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchInitialData = async () => {
    try {
      const [playersRes, categoriesRes] = await Promise.all([
        fetch('/api/players'),
        fetch('/api/categories')
      ]);
      const playersData = await playersRes.json();
      const categoriesData = await categoriesRes.json();
      
      setPlayers(playersData);
      setCategories(categoriesData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setFatherName('');
    setDob('');
    setAddress('');
    setWeight('');
    setGender('Male');
  };

  const handleEditClick = (p: any) => {
    setEditingId(p._id);
    setName(p.name);
    setFatherName(p.father_name || '');
    setDob(p.dob);
    setAddress(p.address || '');
    setWeight(p.weight?.toString() || '');
    setGender(p.gender || 'Male');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/players/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            father_name: fatherName,
            gender,
            dob,
            address,
            weight: parseFloat(weight)
          })
        });
      } else {
        res = await fetch('/api/players', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            father_name: fatherName,
            gender,
            dob,
            address,
            weight: parseFloat(weight)
          })
        });
      }
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccessMsg(`Successfully ${editingId ? 'updated' : 'registered'} ${data.player.name} into ${data.player.category_name} (${data.player.age_group})`);
      
      // Reset form
      handleCancelEdit();
      fetchInitialData();
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) return;
    
    try {
      const res = await fetch(`/api/players/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete player");
      
      setSuccessMsg(`${name} deleted successfully!`);
      // Refresh the list
      fetchInitialData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredPlayers = useMemo(() => {
    return players.filter(p => {
      const matchAge = filterAge === 'All' || p.age_group === filterAge;
      const matchGender = filterGender === 'All' || p.gender === filterGender;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchAge && matchGender && matchSearch;
    });
  }, [players, filterAge, filterGender, search]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-[32px] font-black text-white tracking-widest uppercase mb-2 drop-shadow-[0_2px_10px_rgba(255,0,0,0.2)]">Player Management</h2>
        <p className="text-gray-400 font-medium">Register tournament players and view the current roster.</p>
      </div>

      <div className="grid xl:grid-cols-3 gap-8">
        
        {/* Registration Form */}
        <div className="bg-[#111] p-8 rounded-3xl shadow-[0_0_50px_rgba(255,0,0,0.1)] border border-red-500/20 h-fit">
          <h3 className="text-xl font-black text-white tracking-widest uppercase mb-6 flex items-center gap-3">
            {editingId ? <Edit2 className="w-5 h-5 text-red-500" /> : <UserPlus className="w-5 h-5 text-red-500" />}
            {editingId ? 'Edit Player Info' : 'Quick Registration'}
          </h3>

          {error && <div className="mb-6 bg-red-500/10 text-red-500 border border-red-500/20 p-4 rounded-xl text-xs font-bold uppercase tracking-wide">{error}</div>}
          {successMsg && <div className="mb-6 bg-green-500/10 text-green-500 border border-green-500/20 p-4 rounded-xl text-xs font-bold uppercase tracking-wide">{successMsg}</div>}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
              <input 
                type="text" required value={name} onChange={e => setName(toTitleCase(e.target.value))}
                className="w-full bg-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Father's Name</label>
              <input 
                type="text" required value={fatherName} onChange={e => setFatherName(toTitleCase(e.target.value))}
                className="w-full bg-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Gender</label>
                <select 
                  value={gender} onChange={e => setGender(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all appearance-none cursor-pointer"
                >
                  <option className="bg-[#111] text-white">Male</option>
                  <option className="bg-[#111] text-white">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Date of Birth</label>
                <input 
                  type="date" required value={dob} onChange={e => setDob(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Exact Weight (kg)</label>
                <input 
                  type="number" step="0.01" required value={weight} onChange={e => setWeight(e.target.value)}
                  placeholder="e.g. 54.7"
                  className="w-full bg-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all placeholder-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Address</label>
              <textarea 
                rows={2} required value={address} onChange={e => setAddress(toTitleCase(e.target.value))}
                className="w-full bg-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all resize-none"
              />
            </div>

            <div className="flex gap-3 mt-4 mb-2">
              <button 
                type="submit" disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white px-8 py-4 rounded-xl text-sm font-black uppercase tracking-[0.2em] transition-all shadow-[0_4px_20px_rgba(255,0,0,0.4)] disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : (editingId ? 'Update Player' : 'Register Player')}
              </button>
              {editingId && (
                <button 
                  type="button" onClick={handleCancelEdit} disabled={isSubmitting}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white px-4 py-4 rounded-xl transition-all" title="Cancel Edit"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Players List */}
        <div className="xl:col-span-2 bg-[#111] rounded-3xl shadow-[0_0_50px_rgba(255,0,0,0.05)] border border-white/5 flex flex-col h-[850px] overflow-hidden">
          
          <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 items-center justify-between bg-[#0a0a0a]">
            <div className="relative flex-1 min-w-[200px] group">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-500 transition-colors" />
              <input 
                type="text" placeholder="Search roster..." 
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#111] border border-white/5 group-hover:border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium text-white placeholder-gray-600 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              />
            </div>
            
            <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-[#111] border border-white/5 hover:border-white/10 rounded-xl px-4 py-2 transition-colors">
                <Filter className="w-4 h-4 text-red-500" />
                <select value={filterAge} onChange={e => setFilterAge(e.target.value)} className="bg-transparent border-none outline-none text-[11px] font-black uppercase tracking-widest text-gray-300 py-1.5 cursor-pointer appearance-none">
                  <option className="bg-[#111] text-white">All Ages</option>
                  <option value="Cadet (Sub-Junior)" className="bg-[#111] text-white">Sub-Junior (5-11)</option>
                  <option value="Cadet" className="bg-[#111] text-white">Cadet (12-14)</option>
                  <option value="Junior" className="bg-[#111] text-white">Junior (15-17)</option>
                  <option value="Senior" className="bg-[#111] text-white">Senior (18+)</option>
                </select>
              </div>
              <div className="flex items-center gap-2 bg-[#111] border border-white/5 hover:border-white/10 rounded-xl px-4 py-2 transition-colors">
                <select value={filterGender} onChange={e => setFilterGender(e.target.value)} className="bg-transparent border-none outline-none text-[11px] font-black uppercase tracking-widest text-gray-300 py-1.5 cursor-pointer appearance-none pl-2">
                  <option className="bg-[#111] text-white">All Genders</option>
                  <option className="bg-[#111] text-white">Male</option>
                  <option className="bg-[#111] text-white">Female</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#0a0a0a] z-10 border-b border-red-500/20">
                <tr>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Player Info</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Age Group</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Category</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Weight</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                   <tr><td colSpan={5} className="p-16 text-center text-gray-600 font-medium animate-pulse">Loading players...</td></tr>
                ) : filteredPlayers.length === 0 ? (
                   <tr><td colSpan={5} className="p-16 text-center text-gray-600 font-medium">No players found matching your criteria.</td></tr>
                ) : (
                  filteredPlayers.map(p => (
                    <tr key={p._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white text-[15px] group-hover:text-red-400 transition-colors">{p.name}</div>
                        {p.father_name && <div className="text-[12px] text-gray-500 mt-1 font-medium">S/D/o: <span className="text-gray-400">{p.father_name}</span></div>}
                        <div className="text-[11px] text-gray-600 mt-1 font-bold uppercase tracking-widest">
                          {p.gender} <span className="mx-1 text-red-500/50">•</span> {p.age} YRS
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${
                          p.age_group === 'Cadet (Sub-Junior)' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                          p.age_group === 'Cadet' ? 'bg-blue-500/10 text-[#3b82f6] border-[#3b82f6]/20' : 
                          p.age_group === 'Junior' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                          'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                          {p.age_group}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-300 text-[13px]">{p.category_name || 'Uncategorized'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-white font-bold bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs">
                          {p.weight} kg
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-2 opacity-100 sm:opacity-50 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEditClick(p)}
                          className="p-2.5 text-gray-400 hover:text-blue-400 bg-white/5 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/30 rounded-xl transition-all shadow-inner"
                          title="Edit Player"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(p._id, p.name)}
                          className="p-2.5 text-gray-400 hover:text-red-500 bg-white/5 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 rounded-xl transition-all shadow-inner"
                          title="Delete Player"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-5 border-t border-white/5 bg-[#0a0a0a] text-[11px] text-gray-500 uppercase tracking-widest text-center font-black">
            Total Matches Found: <span className="text-white ml-2">{filteredPlayers.length}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
