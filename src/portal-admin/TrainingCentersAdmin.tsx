import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, X, Upload, Building2, Phone, Mail, MapPin, User, Pencil } from 'lucide-react';

const toTitleCase = (str: string) => {
  return str.replace(/\b\w+/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
};

const EMPTY_FORM = {
  centerName: '',
  address: '',
  coachName: '',
  contact: '',
  email: '',
};

export const TrainingCentersAdmin = () => {
  const [centers, setCenters] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => { fetchCenters(); }, []);

  const fetchCenters = async () => {
    try {
      const res = await fetch('/api/training-centers');
      const data = await res.json();
      setCenters(data);
    } catch (err) { console.error(err); }
  };

  const openAddModal = () => {
    setEditTarget(null);
    setFormData(EMPTY_FORM);
    setFile(null); setPreview('');
    setIsModalOpen(true);
  };

  const openEditModal = (center: any) => {
    setEditTarget(center);
    setFormData({
      centerName: center.centerName || '',
      address: center.address || '',
      coachName: center.coachName || '',
      contact: center.contact || '',
      email: center.email || '',
    });
    setFile(null);
    setPreview(center.logo_url || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false); setEditTarget(null);
    setFormData(EMPTY_FORM); setFile(null); setPreview('');
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
    if (!formData.centerName) return;
    if (formData.email && !formData.email.toLowerCase().endsWith('@gmail.com')) {
      alert("Only Gmail addresses (@gmail.com) are allowed.");
      return;
    }
    if (formData.contact && formData.contact.replace(/\D/g, '').length !== 10) {
      alert("Contact number must be exactly 10 digits.");
      return;
    }
    setIsUploading(true);
    try {
      let logo_url = editTarget?.logo_url || '';
      if (file) logo_url = await uploadImage();
      const payload = { ...formData, logo_url };

      if (editTarget) {
        await fetch(`/api/training-centers/${editTarget._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/training-centers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      closeModal(); fetchCenters();
    } catch (err) { console.error(err); }
    setIsUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this training center?')) {
      await fetch('/api/training-centers/' + id, { method: 'DELETE' });
      fetchCenters();
    }
  };

  const filtered = centers.filter(c =>
    c.centerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.coachName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const field = (label: string, val: string) => (
    <div>
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</label>
      <input
        type="text" value={val}
        onChange={e => setFormData({ ...formData, [label === 'Training Center Name *' ? 'centerName' : label === 'Address' ? 'address' : label === 'Coach / Incharge Name' ? 'coachName' : label === 'Contact Number' ? 'contact' : 'email']: e.target.value })}
        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium placeholder-gray-600"
        placeholder={
          label === 'Training Center Name *' ? 'E.g. Maharajganj Taekwondo Training Center & Club' :
          label === 'Address' ? 'E.g. Dhanewa Dhanei, Maharajganj, U.P.' :
          label === 'Coach / Incharge Name' ? 'E.g. Abhishek Kumar Vishwakarma' :
          label === 'Contact Number' ? 'E.g. 9161115569' : 'E.g. tkdabhi@gmail.com'
        }
      />
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white tracking-widest drop-shadow-[0_2px_10px_rgba(255,0,0,0.4)] flex items-center gap-3">
            <Building2 className="w-6 h-6 text-red-500" /> AFFILIATED TRAINING CENTERS
          </h2>
          <p className="text-sm text-gray-400 mt-1 font-medium">Manage all officially affiliated training centers</p>
        </div>
        <button onClick={openAddModal}
          className="bg-gradient-to-r from-red-600 to-red-900 border border-red-500/30 text-white px-5 py-2.5 rounded-xl uppercase tracking-widest font-bold flex shadow-[0_0_20px_rgba(255,0,0,0.3)] gap-2 items-center hover:from-red-500 hover:to-red-800 transition-all">
          <Plus className="w-4 h-4" /> Add Center
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#0e0e0e] rounded-2xl border border-red-500/10 shadow-[0_4px_30px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col h-[calc(100vh-220px)]">
        <div className="p-4 border-b border-white/5 flex gap-4 bg-white/[0.02]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" placeholder="Search by center or coach name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50 transition-all font-medium" />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/50 text-gray-500 text-xs uppercase tracking-wider border-b border-white/5">
                <th className="px-6 py-4 font-bold">Training Center</th>
                <th className="px-6 py-4 font-bold">Address</th>
                <th className="px-6 py-4 font-bold">Coach / Incharge</th>
                <th className="px-6 py-4 font-bold">Contact</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-sm">
              {filtered.map((center: any) => (
                <tr key={center._id} className="hover:bg-red-500/[0.03] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {center.logo_url ? (
                        <img src={center.logo_url} alt="" className="w-14 h-14 object-contain rounded-xl border-2 border-red-500/20 bg-white/5 p-1 shadow-[0_0_10px_rgba(255,0,0,0.1)]" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-700 to-red-950 border border-red-500/20 flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-white/70" />
                        </div>
                      )}
                      <div>
                        <p className="text-white font-black text-[14px] leading-tight">{center.centerName}</p>
                        <p className="text-gray-600 text-xs mt-0.5">Added {new Date(center.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-xs leading-snug max-w-[180px]">{center.address || <span className="text-gray-600 italic">Not set</span>}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span className="text-gray-300 font-medium text-sm">{center.coachName || <span className="text-gray-600 italic">Not set</span>}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {center.contact && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-red-500 shrink-0" />
                          <span className="text-gray-300 text-xs">{center.contact}</span>
                        </div>
                      )}
                      {center.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-red-500 shrink-0" />
                          <span className="text-gray-400 text-xs truncate max-w-[140px]">{center.email}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(center)}
                        className="p-2.5 bg-white/5 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded-xl transition-all border border-transparent hover:border-red-500/20">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(center._id)}
                        className="p-2.5 bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-red-500/30">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="p-16 text-center">
                  <Building2 className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-600 font-bold uppercase tracking-widest text-sm">No training centers found</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#0d0d0d] border border-red-500/20 shadow-[0_0_60px_rgba(255,0,0,0.12)] rounded-3xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 my-4">

            {/* Modal Header */}
            <div className="px-6 py-5 flex justify-between items-center border-b border-white/10 bg-gradient-to-r from-red-900/30 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-500/15">
                  <Building2 className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-xl font-black text-white tracking-widest">
                  {editTarget ? 'EDIT CENTER' : 'ADD TRAINING CENTER'}
                </h3>
              </div>
              <button onClick={closeModal} className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Training Center Name *</label>
                <input type="text" value={formData.centerName}
                  onChange={e => setFormData({ ...formData, centerName: toTitleCase(e.target.value) })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium placeholder-gray-600"
                  placeholder="E.g. Maharajganj Taekwondo Training Center & Club" />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Address</label>
                <input type="text" value={formData.address}
                  onChange={e => setFormData({ ...formData, address: toTitleCase(e.target.value) })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium placeholder-gray-600"
                  placeholder="E.g. Dhanewa Dhanei, Maharajganj, U.P." />
              </div>

              {/* Coach / Incharge */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Training Center Incharge / Coach</label>
                <input type="text" value={formData.coachName}
                  onChange={e => setFormData({ ...formData, coachName: toTitleCase(e.target.value) })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium placeholder-gray-600"
                  placeholder="E.g. Abhishek Kumar Vishwakarma" />
              </div>

              {/* Contact + Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Contact Number</label>
                  <input type="tel" value={formData.contact}
                    onChange={e => setFormData({ ...formData, contact: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium placeholder-gray-600"
                    placeholder="9161115569" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email</label>
                  <input type="email" value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium placeholder-gray-600"
                    placeholder="tkdabhi@gmail.com" />
                </div>
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Center Logo {editTarget && <span className="text-gray-600 normal-case font-normal">(leave blank to keep existing)</span>}
                </label>
                <div className="flex gap-4 items-center">
                  {preview && (
                    <img src={preview} alt="Logo Preview"
                      className="w-20 h-20 object-contain rounded-xl border border-red-500/20 bg-white/5 p-1 shadow-[0_0_12px_rgba(255,0,0,0.1)]" />
                  )}
                  <label className="flex-1 border-2 border-dashed border-white/10 hover:border-red-500/40 hover:bg-red-500/5 transition-all text-gray-500 rounded-xl p-4 cursor-pointer text-center">
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    <Upload className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs font-bold uppercase tracking-widest">{preview ? 'Change Logo' : 'Upload Logo'}</span>
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
                  {isUploading ? 'Saving...' : editTarget ? 'Update Center' : 'Save Center'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
