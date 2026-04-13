import React, { useState, useEffect } from 'react';
import { FileText, Save, CheckCircle } from 'lucide-react';

export const AboutMDTAAdmin = () => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/content/about_mdta')
      .then(res => res.json())
      .then(data => {
        if (data && data.content) {
          setContent(data.content);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSuccess(false);
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section_name: 'about_mdta', content })
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch(err) {
      console.error(err);
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white tracking-widest drop-shadow-[0_2px_10px_rgba(255,0,0,0.4)]">ABOUT MDTA</h2>
          <p className="text-sm text-gray-400 mt-1 font-medium">Manage the content that appears on the About MDTA page</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-gradient-to-r from-red-600 to-red-900 border border-red-500/30 text-white px-6 py-3 rounded-xl uppercase tracking-widest font-bold flex flex-row items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.3)] gap-2 disabled:opacity-50"
        >
          {isSaving ? <span className="animate-spin text-xl leading-none">⟳</span> : <Save className="w-5 h-5"/>} 
          {isSaving ? 'Saving...' : 'Save Content'}
        </button>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-500 px-4 py-3 rounded-xl flex items-center gap-2 font-bold mb-4 animate-in fade-in zoom-in">
          <CheckCircle className="w-5 h-5" /> Content saved successfully!
        </div>
      )}

      <div className="bg-[#111] rounded-2xl border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col p-6">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Page Content</label>
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-[500px] bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium resize-none leading-relaxed"
          placeholder="Write the about MDTA content here..."
        />
      </div>
    </div>
  );
};
