import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, Video } from 'lucide-react';

export const PromoVideoAdmin = () => {
  const [data, setData] = useState({
    hero_video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
    benefits_video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
    self_development_video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1'
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/content/promo_videos')
      .then(res => res.json())
      .then(resData => {
        if (resData && resData.content) {
          try {
            const parsed = JSON.parse(resData.content);
            setData(prev => ({ ...prev, ...parsed }));
          } catch (e) {
            console.error('Failed to parse content', e);
          }
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
        body: JSON.stringify({ section_name: 'promo_videos', content: JSON.stringify(data) })
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch(err) {
      console.error(err);
      alert("Failed to save changes.");
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="sticky top-0 z-20 flex justify-between items-center bg-black/60 backdrop-blur-xl p-6 rounded-[24px] border border-white/5 shadow-2xl">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
            <Video className="w-6 h-6 text-red-600" />
            Promo <span className="text-red-600">Videos</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1.5 font-bold tracking-widest uppercase opacity-70">Manage Website Video Links</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-gradient-to-br from-red-600 to-red-950 border border-red-500/30 text-white px-8 py-3.5 rounded-2xl uppercase tracking-[0.15em] font-black flex flex-row items-center justify-center shadow-[0_10px_40px_rgba(255,0,0,0.3)] gap-3 disabled:opacity-50 hover:scale-105 transition-all"
        >
          {isSaving ? 'Saving...' : 'Save Videos'}
        </button>
      </div>

      {success && (
        <div className="bg-red-600/10 border border-red-600/30 text-red-500 px-6 py-4 rounded-2xl flex items-center gap-4 font-black uppercase tracking-widest text-[11px]">
          <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(255,0,0,0.4)]">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
          Video links updated successfully!
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-widest">Watch Demo Video URL</h3>
            <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase tracking-wider">Embed URL (YouTube, FB, Insta) or Drive Preview Link</p>
          </div>
          <input 
            type="text" 
            value={data.hero_video_url}
            onChange={(e) => setData({...data, hero_video_url: e.target.value})}
            className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3.5 text-white focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600/50 transition-all font-medium text-sm placeholder-gray-600"
            placeholder="e.g. https://www.youtube.com/embed/..."
          />
        </div>

        <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-widest">Benefits Section Video URL</h3>
            <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase tracking-wider">Embed URL for the Benefits play button</p>
          </div>
          <input 
            type="text" 
            value={data.benefits_video_url}
            onChange={(e) => setData({...data, benefits_video_url: e.target.value})}
            className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3.5 text-white focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600/50 transition-all font-medium text-sm placeholder-gray-600"
            placeholder="e.g. https://www.youtube.com/embed/..."
          />
        </div>

        <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden md:col-span-2">
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-widest">Self Development Video URL</h3>
            <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase tracking-wider">Embed URL for the Self Development play button</p>
          </div>
          <input 
            type="text" 
            value={data.self_development_video_url}
            onChange={(e) => setData({...data, self_development_video_url: e.target.value})}
            className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3.5 text-white focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600/50 transition-all font-medium text-sm placeholder-gray-600"
            placeholder="e.g. https://www.youtube.com/embed/..."
          />
        </div>
      </div>
    </div>
  );
};
