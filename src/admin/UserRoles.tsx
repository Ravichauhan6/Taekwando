import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, X, Activity, Circle, Users, Search, Shield } from 'lucide-react';

export const UserRoles = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [onlineActivity, setOnlineActivity] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const fetchActivity = async (query = searchQuery) => {
    try {
      const res = await fetch(`/api/admin/online-activity?search=${encodeURIComponent(query)}`);
      if (res.ok) {
        setOnlineActivity(await res.json());
      }
    } catch(err) { console.error(err); }
  };

  useEffect(() => { 
    fetchUsers(); 
  }, []);

  useEffect(() => {
    fetchActivity(searchQuery);
    const interval = setInterval(() => {
      fetchActivity(searchQuery);
    }, 30000);
    return () => clearInterval(interval);
  }, [searchQuery]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      setUsers(await res.json());
    } catch(err) { console.error(err); }
  };

  const handleAddUser = async () => {
    if(!formData.username || !formData.password) return;
    try {
      await fetch('/api/admin/users', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(formData) });
      setIsModalOpen(false);
      setFormData({ username: '', password: '' });
      fetchUsers();
    } catch(err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if(window.confirm("Delete this admin user?")) {
      await fetch('/api/admin/users/'+id, { method: 'DELETE' });
      fetchUsers();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase mb-2 flex items-center gap-3 drop-shadow-[0_2px_10px_rgba(255,0,0,0.2)]">
            <Users className="w-6 h-6 text-red-600" />
            User Roles <span className="text-red-600">& Activity</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1 font-medium">Manage administrator accounts and monitor online sessions</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Admin Accounts Panel */}
        <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex flex-col h-[calc(100vh-220px)]">
          <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <h3 className="text-white font-bold tracking-widest uppercase text-sm flex items-center gap-2"><Shield className="w-4 h-4 text-red-500"/> Admin Accounts</h3>
            <button onClick={() => setIsModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors"><UserPlus className="w-3.5 h-3.5"/> Add Admin</button>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar p-4 space-y-3">
            {users.map((u: any, i) => (
              <div key={i} className="bg-black/40 border border-white/5 p-4 rounded-xl flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold tracking-wide">{u.username}</h4>
                    <span className="text-gray-500 text-[10px] font-mono tracking-widest uppercase mt-0.5 block">Sub-Admin</span>
                  </div>
                </div>
                {u.username !== 'admin' && (
                  <button onClick={() => handleDelete(u._id)} className="text-gray-500 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            {users.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-10 font-medium">No sub-admins found</div>
            )}
          </div>
        </div>

        {/* Online Activity Panel */}
        <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex flex-col h-[calc(100vh-220px)]">
          <div className="p-4 border-b border-white/5 bg-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="text-white font-bold tracking-widest uppercase text-sm flex items-center gap-2 w-full sm:w-auto"><Activity className="w-4 h-4 text-red-500"/> Live Activity</h3>
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search user, email or IP..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-white text-xs font-bold outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder-gray-600"
              />
            </div>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar p-4 space-y-4">
            {onlineActivity.map((act, i) => (
              <div key={i} className="bg-black/40 border border-white/5 p-4 rounded-xl flex items-start gap-3">
                <Circle className={`w-3 h-3 mt-1 ${act.status === 'Online' ? 'text-green-500 fill-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'text-yellow-500 fill-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)]'}`} />
                <div>
                  <h4 className="text-white font-bold text-sm tracking-wide">{act.user}</h4>
                  <div className="text-gray-400 text-xs font-medium mt-1 flex justify-between w-full gap-4">
                    <span>{act.time}</span>
                    <span className="text-gray-500 font-mono text-[10px]">{act.ip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-red-500/30 shadow-[0_0_40px_rgba(255,0,0,0.2)] rounded-3xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 flex justify-between items-center border-b border-white/10">
              <h3 className="text-xl font-black text-white tracking-widest">ADD NEW ADMIN</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Username</label>
                <input type="text" value={formData.username} onChange={(e)=>setFormData({...formData, username: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="e.g. admin_xyz"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
                <input type="password" value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="••••••••"/>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold tracking-widest uppercase transition-all">Cancel</button>
                <button onClick={handleAddUser} className="flex-1 py-3.5 bg-gradient-to-r from-red-600 to-red-900 border border-red-500/50 hover:from-red-500 hover:to-red-800 text-white rounded-xl font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
