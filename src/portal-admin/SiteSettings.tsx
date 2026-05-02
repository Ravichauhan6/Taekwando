import React, { useState, useEffect } from 'react';
import { Globe, Save, CheckCircle, Settings2 } from 'lucide-react';

export const SiteSettings = () => {
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/content/social_links')
      .then(res => res.json())
      .then(data => {
        if (data && data.content) {
          try { setSocialLinks(prev => ({ ...prev, ...JSON.parse(data.content) })); } catch (e) {}
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section_name: 'social_links', content: JSON.stringify(socialLinks) })
      });
      setSuccess('Social links saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: 'facebook',  label: 'Facebook',  color: 'text-blue-400',  placeholder: 'https://facebook.com/yourpage' },
    { key: 'instagram', label: 'Instagram', color: 'text-pink-400',  placeholder: 'https://instagram.com/yourhandle' },
    { key: 'twitter',   label: 'Twitter / X', color: 'text-sky-400', placeholder: 'https://twitter.com/yourhandle' },
    { key: 'youtube',   label: 'YouTube',   color: 'text-red-400',   placeholder: 'https://youtube.com/@yourchannel' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tighter uppercase mb-2 flex items-center gap-3 drop-shadow-[0_2px_10px_rgba(255,0,0,0.2)]">
          <Settings2 className="w-6 h-6 text-red-600" />
          Site <span className="text-red-600">Settings</span>
        </h2>
        <p className="text-gray-400 font-medium">Manage website social media links shown in the footer.</p>
      </div>

      <div className="bg-[#111] p-8 rounded-3xl border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <h3 className="text-lg font-black text-white tracking-widest uppercase mb-6 flex items-center gap-3">
          <Globe className="w-5 h-5 text-blue-400" /> Social Media Links
        </h3>

        {success && (
          <div className="mb-6 bg-green-500/10 text-green-500 border border-green-500/20 p-4 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> {success}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {fields.map(f => (
            <div key={f.key}>
              <label className={`block text-[11px] font-black uppercase tracking-widest mb-2 flex items-center gap-2 ${f.color}`}>
                <Globe className="w-3.5 h-3.5" /> {f.label}
              </label>
              <input
                type="url"
                value={(socialLinks as any)[f.key]}
                onChange={e => setSocialLinks(prev => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full bg-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all placeholder-gray-700"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={saving}
            className="w-full mt-2 bg-gradient-to-r from-red-600 to-red-900 hover:from-red-500 hover:to-red-800 text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,0,0,0.3)] transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Social Links'}
          </button>
        </form>
      </div>
    </div>
  );
};
