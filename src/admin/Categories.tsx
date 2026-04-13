import React, { useState, useEffect } from 'react';
import { Trash2, Plus, AlertCircle, Save } from 'lucide-react';

export const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [ageGroup, setAgeGroup] = useState('Cadet (Sub-Junior)');
  const [gender, setGender] = useState('Male');
  const [minWeight, setMinWeight] = useState('');
  const [maxWeight, setMaxWeight] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    // Auto complete name if left blank (e.g. Cadet Boys -33kg)
    const gen = gender === 'Male' ? 'Boys' : 'Girls';
    const computedName = name || `${ageGroup} ${gen} -${maxWeight}kg`;

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age_group: ageGroup,
          gender,
          min_weight: parseFloat(minWeight),
          max_weight: parseFloat(maxWeight),
          name: computedName
        })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to add');
      
      setMinWeight('');
      setMaxWeight('');
      setName('');
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to delete');
      } else {
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[32px] font-black text-white tracking-widest uppercase mb-2 drop-shadow-[0_2px_10px_rgba(255,0,0,0.2)]">Weight Categories</h2>
          <p className="text-gray-400 font-medium">Manage tournament weight divisions.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Form Panel */}
        <div className="bg-[#111] p-8 rounded-3xl shadow-[0_0_50px_rgba(255,0,0,0.1)] border border-red-500/20 h-fit">
          <h3 className="text-xl font-black text-white tracking-widest uppercase mb-6 flex items-center gap-3">
            <Plus className="w-5 h-5 text-red-500" />
            Add New Category
          </h3>

          {error && (
            <div className="mb-6 bg-red-500/10 text-red-500 border border-red-500/20 p-4 rounded-xl text-xs font-bold uppercase tracking-wide flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleAddCategory} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Age Group</label>
                <select 
                  value={ageGroup} 
                  onChange={e => setAgeGroup(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all appearance-none cursor-pointer"
                >
                  <option value="Cadet (Sub-Junior)" className="bg-[#111] text-white">Cadet (Sub-Junior)</option>
                  <option value="Cadet" className="bg-[#111] text-white">Cadet</option>
                  <option value="Junior" className="bg-[#111] text-white">Junior</option>
                  <option value="Senior" className="bg-[#111] text-white">Senior</option>
                </select>
                <p className="text-[10px] font-bold text-gray-600 mt-2 uppercase tracking-wide">
                  5-11 | 12-14 | 15-17 | 18+
                </p>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Gender</label>
                <select 
                  value={gender} 
                  onChange={e => setGender(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all appearance-none cursor-pointer"
                >
                  <option className="bg-[#111] text-white">Male</option>
                  <option className="bg-[#111] text-white">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Min. Weight (kg)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={minWeight}
                  onChange={e => setMinWeight(e.target.value)}
                  placeholder="e.g. 48.0"
                  className="w-full bg-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all placeholder-gray-700"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Max. Weight (kg)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={maxWeight}
                  onChange={e => setMaxWeight(e.target.value)}
                  placeholder="e.g. 54.0"
                  className="w-full bg-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all placeholder-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Category Label (Optional)</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Leave blank to auto-generate"
                className="w-full bg-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all placeholder-gray-700"
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white px-8 py-4 rounded-xl text-sm font-black uppercase tracking-[0.2em] transition-all shadow-[0_4px_20px_rgba(255,0,0,0.4)] flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : 'Save Category'}
            </button>
          </form>
        </div>

        {/* List Panel */}
        <div className="lg:col-span-2 bg-[#111] rounded-3xl shadow-[0_0_50px_rgba(255,0,0,0.05)] border border-white/5 overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#0a0a0a] border-b border-red-500/20">
                <tr>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Group & Gender</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Label</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Weight Range</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                   <tr><td colSpan={4} className="p-16 text-center text-gray-600 font-medium animate-pulse">Loading categories...</td></tr>
                ) : categories.length === 0 ? (
                   <tr><td colSpan={4} className="p-16 text-center text-gray-600 font-medium">No categories found. Start adding some!</td></tr>
                ) : (
                  categories.map(cat => (
                    <tr key={cat.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-5 py-4">
                         <div className="font-bold text-white text-[15px] group-hover:text-red-400 transition-colors">{cat.age_group}</div>
                         <div className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-1">{cat.gender === 'Male' ? 'Boys' : 'Girls'}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center justify-center px-3 py-1.5 bg-red-500/10 text-red-500 rounded-md text-[10px] font-black uppercase tracking-widest border border-red-500/20">
                          {cat.name}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono font-bold text-white text-xs">
                        <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                          {cat.min_weight}kg - {cat.max_weight}kg
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          className="p-2.5 text-gray-500 hover:text-red-500 bg-white/5 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 rounded-xl transition-all shadow-inner opacity-0 group-hover:opacity-100"
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
        </div>

      </div>
    </div>
  );
};
