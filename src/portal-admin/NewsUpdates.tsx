import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X } from 'lucide-react';

export const NewsUpdates = () => {
  const [newsData, setNewsData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', category: 'News', status: 'Published' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      setNewsData(data);
    } catch (error) {
      console.error('Error fetching news:', error);
      alert('Failed to load news');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setFormData({ title: '', content: '', category: 'News', status: 'Published' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (news: any) => {
    setFormData({ 
      title: news.title || '', 
      content: news.content || '', 
      category: news.category || 'News', 
      status: news.status || 'Published' 
    });
    setEditingId(news._id);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`/api/news/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      setIsModalOpen(false);
      fetchNews();
    } catch (error) {
      console.error('Failed to save news:', error);
      alert('Failed to save news. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if(window.confirm('Are you sure you want to delete this news update?')) {
      try {
        await fetch(`/api/news/${id}`, { method: 'DELETE' });
        fetchNews();
      } catch (error) {
        console.error('Error deleting news:', error);
        alert('Failed to delete news.');
      }
    }
  };

  const filteredData = newsData.filter(item => 
    (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.content && item.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="relative z-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h2 className="text-[32px] font-black text-white tracking-widest uppercase mb-2 drop-shadow-[0_2px_10px_rgba(255,0,0,0.2)]">News & Updates</h2>
          <p className="text-gray-400 font-medium">Manage news articles, announcements, and achievements shown on the public site.</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-gradient-to-r from-[#ff0000] to-[#990000] hover:from-[#ff1a1a] hover:to-[#cc0000] text-white px-6 py-3 rounded-xl text-[13px] font-bold uppercase tracking-widest transition-all border border-red-500/50 shadow-[0_4px_15px_rgba(255,0,0,0.3)]"
        >
          <Plus className="w-5 h-5" /> Add News
        </button>
      </div>

      <div className="bg-[#111] border border-red-500/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#151515]">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-red-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search news..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium text-white placeholder-gray-600 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-black/40 to-transparent border-b border-red-500/10 text-[11px] uppercase tracking-widest text-gray-500 font-black">
                <th className="px-6 py-5">Title</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                 <tr><td colSpan={5} className="p-16 text-center text-gray-500 font-medium">Loading news from database...</td></tr>
              ) : filteredData.length === 0 ? (
                 <tr><td colSpan={5} className="p-16 text-center text-gray-500 font-medium">No news found. Add a new one!</td></tr>
              ) : (
                filteredData.map((news) => (
                  <tr key={news._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="font-bold text-white text-[15px] group-hover:text-red-400 transition-colors">{news.title}</div>
                      <div className="text-gray-500 text-[12px] truncate max-w-sm mt-1">{news.content}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded text-[11px] font-bold text-gray-300 tracking-wider uppercase">
                        {news.category}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-gray-400 text-[13px] font-medium">
                      {new Date(news.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md border text-center ${
                        news.status === 'Published' 
                          ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]' 
                          : 'bg-gray-500/10 text-gray-400 border-gray-500/20 shadow-[0_0_10px_rgba(156,163,175,0.1)]'
                      }`}>
                        {news.status || 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right flex items-center justify-end gap-3 opacity-100 sm:opacity-50 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEditClick(news)}
                        className="p-2.5 bg-[#0a0a0a] border border-white/5 hover:border-[#3b82f6]/50 text-[#3b82f6] hover:bg-[#3b82f6]/10 rounded-xl transition-all shadow-inner" title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(news._id)}
                        className="p-2.5 bg-[#0a0a0a] border border-white/5 hover:border-[#ef4444]/50 text-[#ef4444] hover:bg-[#ef4444]/10 rounded-xl transition-all shadow-inner" title="Delete"
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

      {/* Modal JSX */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-red-500/30 rounded-2xl shadow-[0_0_40px_rgba(255,0,0,0.15)] w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#151515]">
              <h3 className="text-xl font-black text-white tracking-widest uppercase mb-0">
                {editingId ? 'Edit News' : 'Add News'}
              </h3>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Title</label>
                <input 
                  type="text" required
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all"
                  placeholder="e.g. District Championship Updates"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Content / Description</label>
                <textarea 
                  required
                  value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all min-h-[120px]"
                  placeholder="Enter the full news details here..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                  <select 
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all appearance-none"
                  >
                    <option value="Admission">Admission</option>
                    <option value="Achievement">Achievement</option>
                    <option value="Event">Event</option>
                    <option value="News">News</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Status</label>
                  <select 
                    value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all appearance-none"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 rounded-xl uppercase tracking-widest text-xs transition-colors border border-white/10">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold py-3.5 rounded-xl uppercase tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(255,0,0,0.3)]">
                  {editingId ? 'Update' : 'Publish'} News
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
