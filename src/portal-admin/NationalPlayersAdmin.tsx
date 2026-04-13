import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, X, Upload, Trophy, Pencil, PlusCircle, MinusCircle, Medal, Star } from 'lucide-react';

const MEDAL_OPTIONS = ['Gold', 'Silver', 'Bronze', 'Participated'];
const PLAYER_CATEGORIES = ['Sub-Junior', 'Cadet', 'Junior', 'Senior'];
const ALL_TABS = ['All', ...PLAYER_CATEGORIES];

const emptyChampionship = () => ({ name: '', year: '', medal: 'Gold' });

const EMPTY_FORM = {
  name: '',
  player_category: 'Junior',
  dob: '',
  weight_category: '',
  championships: [emptyChampionship()],
};

const medalStyle: Record<string, { badge: string; dot: string }> = {
  Gold:         { badge: 'bg-yellow-400/15 text-yellow-300 border-yellow-400/40', dot: 'bg-yellow-400' },
  Silver:       { badge: 'bg-gray-300/15 text-gray-200 border-gray-300/40',       dot: 'bg-gray-300' },
  Bronze:       { badge: 'bg-orange-400/15 text-orange-300 border-orange-400/40', dot: 'bg-orange-400' },
  Participated: { badge: 'bg-blue-400/15 text-blue-300 border-blue-400/40',       dot: 'bg-blue-400' },
};

const categoryColor: Record<string, string> = {
  'Sub-Junior': 'from-red-700 to-red-950',
  'Cadet':      'from-red-600 to-red-900',
  'Junior':     'from-red-500 to-red-800',
  'Senior':     'from-rose-600 to-red-950',
};

const categoryBorder: Record<string, string> = {
  'Sub-Junior': 'border-red-800/50',
  'Cadet':      'border-red-700/50',
  'Junior':     'border-red-600/50',
  'Senior':     'border-red-500/50',
};

export const NationalPlayersAdmin = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => { fetchPlayers(); }, []);

  const fetchPlayers = async () => {
    try {
      const res = await fetch('/api/verified-entities');
      const data = await res.json();
      setPlayers(data.filter((e: any) => e.category === 'NationalPlayer'));
    } catch (err) { console.error(err); }
  };

  const openAddModal = () => {
    setEditTarget(null);
    setFormData({ ...EMPTY_FORM, championships: [emptyChampionship()] });
    setFile(null); setPreview('');
    setIsModalOpen(true);
  };

  const openEditModal = (player: any) => {
    setEditTarget(player);
    setFormData({
      name: player.name || '',
      player_category: player.player_category || 'Junior',
      dob: player.dob || '',
      weight_category: player.weight_category || '',
      championships: player.championships?.length ? player.championships : [emptyChampionship()],
    });
    setFile(null);
    setPreview(player.image_url || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false); setEditTarget(null);
    setFormData({ ...EMPTY_FORM, championships: [emptyChampionship()] });
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

  const updateChampionship = (idx: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      championships: prev.championships.map((c, i) => i === idx ? { ...c, [field]: value } : c),
    }));
  };

  const addChampionship = () => setFormData(prev => ({ ...prev, championships: [...prev.championships, emptyChampionship()] }));
  const removeChampionship = (idx: number) => {
    if (formData.championships.length === 1) return;
    setFormData(prev => ({ ...prev, championships: prev.championships.filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    if (!formData.name) return;
    setIsUploading(true);
    try {
      let imageUrl = editTarget?.image_url || '';
      if (file) imageUrl = await uploadImage();
      const payload = { ...formData, image_url: imageUrl };
      if (editTarget) {
        await fetch(`/api/verified-entities/${editTarget._id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      } else {
        await fetch('/api/verified-entities', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, category: 'NationalPlayer' }) });
      }
      closeModal(); fetchPlayers();
    } catch (err) { console.error(err); }
    setIsUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this player?')) {
      await fetch('/api/verified-entities/' + id, { method: 'DELETE' });
      fetchPlayers();
    }
  };

  const filtered = players.filter(p =>
    (activeTab === 'All' || p.player_category === activeTab) &&
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const countByCategory = (cat: string) => cat === 'All' ? players.length : players.filter(p => p.player_category === cat).length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-widest drop-shadow-[0_2px_10px_rgba(255,0,0,0.4)] flex items-center gap-3">
            <Trophy className="w-6 h-6 text-red-500" /> NATIONAL PLAYERS
          </h2>
          <p className="text-sm text-gray-400 mt-1 font-medium">Manage and highlight your national-level athletes</p>
        </div>
        <button onClick={openAddModal} className="bg-gradient-to-r from-red-600 to-red-900 border border-red-500/30 text-white px-5 py-2.5 rounded-xl uppercase tracking-widest font-bold flex shadow-[0_0_20px_rgba(255,0,0,0.3)] gap-2 items-center hover:from-red-500 hover:to-red-800 transition-all">
          <Plus className="w-4 h-4" /> Add Player
        </button>
      </div>

      {/* Stats Bars */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {ALL_TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`rounded-xl px-4 py-3 text-left border transition-all duration-200 ${
              activeTab === tab
                ? 'bg-gradient-to-br from-red-700 to-red-950 border-red-500/40 shadow-[0_0_20px_rgba(255,0,0,0.2)]'
                : 'bg-black/30 border-white/5 hover:border-red-500/20 hover:bg-red-500/5'
            }`}>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">{tab}</p>
            <p className="text-2xl font-black text-white mt-0.5">{countByCategory(tab)}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search player..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50 transition-all font-medium" />
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-600">
          <Trophy className="w-14 h-14 mb-4 opacity-20" />
          <p className="text-lg font-bold uppercase tracking-widest">No players found</p>
          <p className="text-sm mt-1">Add your first national player using the button above</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(player => {
            const cat = player.player_category || 'Junior';
            const gradient = categoryColor[cat] || categoryColor['Junior'];
            const border = categoryBorder[cat] || categoryBorder['Junior'];
            const goldCount = player.championships?.filter((c: any) => c.medal === 'Gold').length || 0;
            const silverCount = player.championships?.filter((c: any) => c.medal === 'Silver').length || 0;
            const bronzeCount = player.championships?.filter((c: any) => c.medal === 'Bronze').length || 0;

            return (
              <div key={player._id} className={`relative bg-[#0e0e0e] rounded-2xl border border-red-500/20 shadow-[0_4px_25px_rgba(0,0,0,0.6)] overflow-hidden group hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(255,0,0,0.12)] transition-all duration-300`}>

                {/* Top gradient bar */}
                <div className="h-1 w-full bg-gradient-to-r from-red-600 via-red-500 to-rose-700 shadow-[0_0_10px_rgba(255,0,0,0.4)]" />

                {/* Card Body */}
                <div className="p-5">
                  {/* Player identity */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative shrink-0">
                      {player.image_url ? (
                        <img src={player.image_url} alt={player.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-red-500/20 shadow-[0_0_12px_rgba(255,0,0,0.15)]" />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-700 to-red-950 flex items-center justify-center shadow-[0_0_15px_rgba(255,0,0,0.2)] border border-red-500/20">
                          <Trophy className="w-7 h-7 text-white/80" />
                        </div>
                      )}
                      <span className="absolute -bottom-1 -right-1 text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-red-600 to-red-900 text-white px-1.5 py-0.5 rounded-md shadow border border-red-500/30">{cat}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-black text-[17px] leading-tight truncate">{player.name}</h3>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        {player.weight_category && (
                          <span className="text-xs text-gray-400 font-medium">⚖ {player.weight_category}</span>
                        )}
                        {player.dob && (
                          <span className="text-xs text-gray-500">🎂 {player.dob}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Medal tally */}
                  {(goldCount > 0 || silverCount > 0 || bronzeCount > 0) && (
                    <div className="flex gap-2 mb-4">
                      {goldCount > 0 && <div className="flex items-center gap-1 bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-2.5 py-1"><span className="text-yellow-300 text-xs font-black">🥇 {goldCount}</span></div>}
                      {silverCount > 0 && <div className="flex items-center gap-1 bg-gray-300/10 border border-gray-300/30 rounded-lg px-2.5 py-1"><span className="text-gray-200 text-xs font-black">🥈 {silverCount}</span></div>}
                      {bronzeCount > 0 && <div className="flex items-center gap-1 bg-orange-400/10 border border-orange-400/30 rounded-lg px-2.5 py-1"><span className="text-orange-300 text-xs font-black">🥉 {bronzeCount}</span></div>}
                    </div>
                  )}

                  {/* Championships list */}
                  {player.championships?.length > 0 ? (
                    <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1 custom-scroll">
                      {player.championships.map((c: any, i: number) => {
                        const ms = medalStyle[c.medal] || medalStyle['Participated'];
                        return (
                          <div key={i} className="flex items-start gap-2">
                            <span className={`shrink-0 mt-0.5 px-1.5 py-0.5 rounded border text-[9px] font-black uppercase ${ms.badge}`}>{c.medal}</span>
                            <p className="text-gray-300 text-xs leading-snug">{c.name}{c.year ? ` (${c.year})` : ''}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-xs italic">No championships added yet</p>
                  )}
                </div>

                <div className="border-t border-white/5 px-5 py-3 flex items-center justify-between bg-black/30">
                  <span className="text-gray-600 text-[11px] font-medium">Added {new Date(player.date).toLocaleDateString()}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditModal(player)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(player._id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-500 transition-all border border-transparent hover:border-red-500/30"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#0d0d0d] border border-white/10 shadow-[0_0_60px_rgba(255,0,0,0.15)] rounded-3xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 my-4">

            {/* Modal Header */}
            <div className={`px-6 py-5 flex justify-between items-center border-b border-white/10 bg-gradient-to-r ${editTarget ? 'from-blue-900/40' : 'from-red-900/40'} to-transparent`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${editTarget ? 'bg-blue-500/20' : 'bg-red-500/20'}`}>
                  <Trophy className={`w-5 h-5 ${editTarget ? 'text-blue-400' : 'text-red-400'}`} />
                </div>
                <h3 className="text-xl font-black text-white tracking-widest">{editTarget ? 'EDIT PLAYER' : 'ADD NATIONAL PLAYER'}</h3>
              </div>
              <button onClick={closeModal} className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Player Name *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium placeholder-gray-600"
                  placeholder="E.g. Siddharth Sharma" />
              </div>

              {/* Category + Weight */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Player Category *</label>
                  <select value={formData.player_category} onChange={e => setFormData({ ...formData, player_category: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium">
                    {PLAYER_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Weight Category</label>
                  <input type="text" value={formData.weight_category} onChange={e => setFormData({ ...formData, weight_category: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium placeholder-gray-600"
                    placeholder="E.g. Under 63kg" />
                </div>
              </div>

              {/* DOB */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Date of Birth</label>
                <input type="date" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" />
              </div>

              {/* Championships */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">National Championships</label>
                  <button type="button" onClick={addChampionship} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-bold transition-colors">
                    <PlusCircle className="w-4 h-4" /> Add Entry
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.championships.map((c, idx) => (
                    <div key={idx} className="flex gap-2 items-center p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-gray-600 text-xs font-bold w-5 shrink-0 text-center">{idx + 1}</span>
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <input type="text" placeholder="Championship name" value={c.name} onChange={e => updateChampionship(idx, 'name', e.target.value)}
                          className="col-span-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:border-red-500 focus:outline-none transition-all placeholder-gray-600" />
                        <input type="text" placeholder="Year" value={c.year} onChange={e => updateChampionship(idx, 'year', e.target.value)}
                          className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:border-red-500 focus:outline-none transition-all placeholder-gray-600" />
                        <select value={c.medal} onChange={e => updateChampionship(idx, 'medal', e.target.value)}
                          className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:border-red-500 focus:outline-none transition-all">
                          {MEDAL_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                      <button type="button" onClick={() => removeChampionship(idx)} className="text-gray-600 hover:text-red-500 transition-colors shrink-0">
                        <MinusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photo */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Photo {editTarget && <span className="text-gray-600 normal-case font-normal">(leave blank to keep existing)</span>}
                </label>
                <div className="flex gap-4 items-center">
                  {preview && <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded-xl border border-white/10 shadow-lg" />}
                  <label className="flex-1 border-2 border-dashed border-white/10 hover:border-red-500/50 hover:bg-white/5 transition-all text-gray-400 rounded-xl p-4 cursor-pointer text-center">
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    <Upload className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs font-bold uppercase tracking-widest">{preview ? 'Change Photo' : 'Upload Photo'}</span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button onClick={closeModal} className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold tracking-widest uppercase transition-all border border-white/5">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={isUploading}
                  className={`flex-1 py-3.5 bg-gradient-to-r ${editTarget ? 'from-blue-600 to-blue-900 border-blue-500/50' : 'from-red-600 to-red-900 border-red-500/50'} border hover:opacity-90 text-white rounded-xl font-bold tracking-widest uppercase shadow-lg transition-all disabled:opacity-50`}>
                  {isUploading ? 'Saving...' : editTarget ? 'Update Player' : 'Save Player'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
