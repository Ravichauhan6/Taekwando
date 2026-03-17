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
          <h2 className="text-3xl font-bold text-gray-900">Weight Categories</h2>
          <p className="text-gray-500 mt-1">Manage tournament weight divisions.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Form Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-red-600" />
            Add New Category
          </h3>

          {error && (
            <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleAddCategory} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Age Group</label>
                <select 
                  value={ageGroup} 
                  onChange={e => setAgeGroup(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                >
                  <option value="Cadet (Sub-Junior)">Cadet (Sub-Junior)</option>
                  <option value="Cadet">Cadet</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Sub-Junior: 5-11 | Cadet: 12-14 | Junior: 15-17 | Senior: 18+
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                <select 
                  value={gender} 
                  onChange={e => setGender(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Min. Weight (kg)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={minWeight}
                  onChange={e => setMinWeight(e.target.value)}
                  placeholder="e.g. 48.0"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Max. Weight (kg)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={maxWeight}
                  onChange={e => setMaxWeight(e.target.value)}
                  placeholder="e.g. 54.0"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category Label</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Leave blank to auto-generate"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-500 outline-none transition-all"
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-4"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : 'Save Category'}
            </button>
          </form>
        </div>

        {/* List Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Group & Gender</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Label</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Weight Range</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                   <tr><td colSpan={4} className="p-8 text-center text-gray-400">Loading categories...</td></tr>
                ) : categories.length === 0 ? (
                   <tr><td colSpan={4} className="p-8 text-center text-gray-400">No categories found. Start adding some!</td></tr>
                ) : (
                  categories.map(cat => (
                    <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                         <div className="font-semibold text-gray-800">{cat.age_group}</div>
                         <div className="text-xs text-gray-500">{cat.gender === 'Male' ? 'Boys' : 'Girls'}</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium border border-red-100">
                          {cat.name}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-gray-700">
                        {cat.min_weight}kg - {cat.max_weight}kg
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        </div>

      </div>
    </div>
  );
};
