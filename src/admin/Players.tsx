import React, { useState, useEffect, useMemo } from 'react';
import { UserPlus, Filter, Search, Trash2 } from 'lucide-react';

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/players', {
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
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccessMsg(`Successfully registered ${data.player.name} into ${data.player.category_name} (${data.player.age_group})`);
      
      // Reset form
      setName('');
      setFatherName('');
      setDob('');
      setAddress('');
      setWeight('');
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
        <h2 className="text-3xl font-bold text-gray-900">Player Management</h2>
        <p className="text-gray-500 mt-1">Register new players and view the tournament roster.</p>
      </div>

      <div className="grid xl:grid-cols-3 gap-8">
        
        {/* Registration Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-red-600" />
            New Player Registration
          </h3>

          {error && <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
          {successMsg && <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-lg text-sm">{successMsg}</div>}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" required value={name} onChange={e => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Father's Name</label>
              <input 
                type="text" required value={fatherName} onChange={e => setFatherName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                <select 
                  value={gender} onChange={e => setGender(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-500 outline-none"
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
                <input 
                  type="date" required value={dob} onChange={e => setDob(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Exact Weight (kg)</label>
                <input 
                  type="number" step="0.01" required value={weight} onChange={e => setWeight(e.target.value)}
                  placeholder="e.g. 54.7"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
              <textarea 
                rows={2} required value={address} onChange={e => setAddress(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            <button 
              type="submit" disabled={isSubmitting}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-all shadow-lg mt-2"
            >
              {isSubmitting ? 'Registering...' : 'Register Player'}
            </button>
          </form>
        </div>

        {/* Players List */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[800px]">
          
          <div className="p-6 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between bg-gray-50/50 rounded-t-2xl">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" placeholder="Search players..." 
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1">
                <Filter className="w-4 h-4 text-gray-400" />
                <select value={filterAge} onChange={e => setFilterAge(e.target.value)} className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 py-1.5 cursor-pointer">
                  <option>All Ages</option>
                  <option value="Cadet (Sub-Junior)">Sub-Junior (5-11)</option>
                  <option value="Cadet">Cadet (12-14)</option>
                  <option value="Junior">Junior (15-17)</option>
                  <option value="Senior">Senior (18+)</option>
                </select>
              </div>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1">
                <select value={filterGender} onChange={e => setFilterGender(e.target.value)} className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 py-1.5 cursor-pointer">
                  <option>All Genders</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white shadow-sm z-10">
                <tr>
                  <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Player Info</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Age Group</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Category</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Weight</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                   <tr><td colSpan={4} className="p-8 text-center text-gray-400">Loading players...</td></tr>
                ) : filteredPlayers.length === 0 ? (
                   <tr><td colSpan={4} className="p-8 text-center text-gray-400">No players found matching your criteria.</td></tr>
                ) : (
                  filteredPlayers.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-gray-900">{p.name}</div>
                        {p.father_name && <div className="text-sm text-gray-600 mt-0.5">S/D/o: {p.father_name}</div>}
                        <div className="text-xs text-gray-500 mt-0.5">
                          {p.gender} • {p.age} years old
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                          p.age_group === 'Cadet (Sub-Junior)' ? 'bg-green-100 text-green-700' :
                          p.age_group === 'Cadet' ? 'bg-blue-100 text-blue-700' : 
                          p.age_group === 'Junior' ? 'bg-purple-100 text-purple-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
                          {p.age_group}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-800">{p.category_name || 'Uncategorized'}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                          {p.weight} kg
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Player"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-gray-100 bg-gray-50 text-sm text-gray-500 text-center font-medium rounded-b-2xl">
            Showing {filteredPlayers.length} players
          </div>
        </div>

      </div>
    </div>
  );
};
