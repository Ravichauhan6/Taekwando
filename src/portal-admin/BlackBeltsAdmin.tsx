import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, X, Upload, Award, Pencil } from 'lucide-react';

const DAN_OPTIONS = [
  'BLACK BELT 1st DAN',
  'BLACK BELT 2nd DAN',
  'BLACK BELT 3rd DAN',
  'BLACK BELT 4th DAN',
  'BLACK BELT 5th DAN',
  'BLACK BELT 6th DAN',
  'BLACK BELT 7th DAN',
  'BLACK BELT 8th DAN',
  'BLACK BELT 9th DAN',
  '1st POOM',
  '2nd POOM',
  '3rd POOM',
];

const EMPTY_FORM = { name: '', dan_level: 'BLACK BELT 1st DAN', dan_poom_no: '' };

export const BlackBeltsAdmin = () => {
  const [blackBelts, setBlackBelts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => { fetchBlackBelts(); }, []);

  const fetchBlackBelts = async () => {
    try {
      const res = await fetch('/api/verified-entities');
      const data = await res.json();
      setBlackBelts(data.filter((e: any) => e.category === 'BlackBelt'));
    } catch (err) { console.error(err); }
  };

  const openAddModal = () => {
    setEditTarget(null);
    setFormData(EMPTY_FORM);
    setFile(null); setPreview('');
    setIsModalOpen(true);
  };

  const openEditModal = (belt: any) => {
    setEditTarget(belt);
    setFormData({
      name: belt.name || '',
      dan_level: belt.dan_level || 'BLACK BELT 1st DAN',
      dan_poom_no: belt.dan_poom_no || '',
    });
    setFile(null);
    setPreview(belt.image_url || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditTarget(null);
    setFormData(EMPTY_FORM);
    setFile(null); setPreview('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const uploadImage = async () => {
    if (!file) return '';
    const form = new FormData();
    form.append('image', file);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    return (await res.json()).url || '';
  };

  const handleSave = async () => {
    if (!formData.name) return;
    setIsUploading(true);
    try {
      let imageUrl = editTarget?.image_url || '';
      if (file) imageUrl = await uploadImage();
      const payload = { ...formData, image_url: imageUrl };

      if (editTarget) {
        await fetch(`/api/verified-entities/${editTarget._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/verified-entities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, category: 'BlackBelt' }),
        });
      }
      closeModal();
      fetchBlackBelts();
    } catch (err) { console.error(err); }
    setIsUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this profile?')) {
      await fetch('/api/verified-entities/' + id, { method: 'DELETE' });
      fetchBlackBelts();
    }
  };

  const filtered = blackBelts.filter((r: any) =>
    r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.dan_level?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white tracking-widest drop-shadow-[0_2px_10px_rgba(255,0,0,0.4)] flex items-center gap-3">
            <Award className="w-6 h-6 text-red-500" /> BLACK BELT HOLDERS
          </h2>
          <p className="text-sm text-gray-400 mt-1 font-medium">Manage affiliated black belt holders</p>
        </div>
        <button onClick={openAddModal} className="bg-gradient-to-r from-red-600 to-red-900 border border-red-500/30 text-white px-5 py-2.5 rounded-xl uppercase tracking-widest font-bold flex shadow-[0_0_20px_rgba(255,0,0,0.3)] gap-2 items-center hover:from-red-500 hover:to-red-800 transition-all">
          <Plus className="w-4 h-4" /> Add Profile
        </button>
      </div>

      <div className="bg-[#0e0e0e] rounded-2xl border border-red-500/10 shadow-[0_4px_30px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col h-[calc(100vh-220px)]">
        <div className="p-4 border-b border-white/5 flex gap-4 bg-white/[0.02]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" placeholder="Search by name or Dan level..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50 transition-all font-medium" />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/50 text-gray-500 text-xs uppercase tracking-wider border-b border-white/5">
                <th className="px-6 py-4 font-bold">Holder Details</th>
                <th className="px-6 py-4 font-bold">Black Belt Level</th>
                <th className="px-6 py-4 font-bold">DAN / POOM No.</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-sm">
              {filtered.map((belt: any) => (
                <tr key={belt._id} className="hover:bg-red-500/[0.03] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {belt.image_url ? (
                        <img src={belt.image_url} alt="" className="w-12 h-12 object-cover rounded-full border-2 border-red-500/20 shadow-[0_0_10px_rgba(255,0,0,0.1)]" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-700 to-red-950 border border-red-500/20 flex items-center justify-center shadow-inner">
                          <Award className="w-5 h-5 text-white/70" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-[15px]">{belt.name}</span>
                        <span className="text-gray-600 text-xs font-medium mt-0.5">Added {new Date(belt.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {belt.dan_level ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-700/20 to-red-900/20 border border-red-500/30 text-red-300 rounded-lg text-xs font-black uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                        {belt.dan_level}
                      </span>
                    ) : <span className="text-gray-600 italic text-xs">Not set</span>}
                  </td>
                  <td className="px-6 py-4">
                    {belt.dan_poom_no ? (
                      <span className="font-mono text-gray-300 text-sm font-bold tracking-widest">{belt.dan_poom_no}</span>
                    ) : <span className="text-gray-600 italic text-xs">Not set</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(belt)} title="Edit"
                        className="p-2.5 bg-white/5 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded-xl transition-all border border-transparent hover:border-red-500/20">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(belt._id)} title="Delete"
                        className="p-2.5 bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-red-500/30">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-16 text-center">
                    <Award className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-600 font-bold uppercase tracking-widest text-sm">No records found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d0d0d] border border-red-500/20 shadow-[0_0_60px_rgba(255,0,0,0.12)] rounded-3xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300">

            {/* Modal Header */}
            <div className="px-6 py-5 flex justify-between items-center border-b border-white/10 bg-gradient-to-r from-red-900/30 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-500/15">
                  <Award className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-xl font-black text-white tracking-widest">
                  {editTarget ? 'EDIT PROFILE' : 'ADD BLACK BELT'}
                </h3>
              </div>
              <button onClick={closeModal} className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Student / Master Name *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium placeholder-gray-600"
                  placeholder="E.g. Abhishek Kumar Vishwakrma" />
              </div>

              {/* Dan Level */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Black Belt Level *</label>
                <select value={formData.dan_level} onChange={e => setFormData({ ...formData, dan_level: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium">
                  {DAN_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* DAN / POOM No */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">DAN / POOM No.</label>
                <input type="text" value={formData.dan_poom_no} onChange={e => setFormData({ ...formData, dan_poom_no: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-mono font-bold tracking-widest placeholder-gray-600"
                  placeholder="E.g. 05379384" />
              </div>

              {/* Photo */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Photo {editTarget && <span className="text-gray-600 normal-case font-normal">(leave blank to keep existing)</span>}
                </label>
                <div className="flex gap-4 items-center">
                  {preview && <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded-xl border border-red-500/20 shadow-[0_0_12px_rgba(255,0,0,0.1)]" />}
                  <label className="flex-1 border-2 border-dashed border-white/10 hover:border-red-500/40 hover:bg-red-500/5 transition-all text-gray-500 rounded-xl p-4 cursor-pointer text-center">
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    <Upload className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs font-bold uppercase tracking-widest">{preview ? 'Change Photo' : 'Upload Photo'}</span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button onClick={closeModal}
                  className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold tracking-widest uppercase transition-all border border-white/5">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={isUploading}
                  className="flex-1 py-3.5 bg-gradient-to-r from-red-600 to-red-900 border border-red-500/50 hover:from-red-500 hover:to-red-800 text-white rounded-xl font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(255,0,0,0.25)] transition-all disabled:opacity-50">
                  {isUploading ? 'Saving...' : editTarget ? 'Update Profile' : 'Save Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
