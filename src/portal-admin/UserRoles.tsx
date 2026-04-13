import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, X, Activity, Circle } from 'lucide-react';

export const UserRoles = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  
  useEffect(() => { fetchUsers(); }, []);
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

  // Simulated online activity for demonstration
  const onlineActivity = [
    { user: 'portal_admin', status: 'Online', time: 'Just now', ip: '192.168.1.104' },
    { user: 'coach_ravi', status: 'Online', time: '5 mins ago', ip: '10.0.0.15' },
    { user: 'sys_admin', status: 'Away', time: '1 hour ago', ip: '192.168.1.189' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white tracking-widest drop-shadow-[0_2px_10px_rgba(255,0,0,0.4)]">USER ROLES & ACTIVITY</h2>
          <p className="text-sm text-gray-400 mt-1 font-medium">Manage administrator accounts and monitor online sessions</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-red-600 to-red-900 border border-red-500/30 text-white px-5 py-2.5 rounded-xl uppercase tracking-widest font-bold flex shadow-[0_0_20px_rgba(255,0,0,0.3)] gap-2"><UserPlus className="w-4 h-4"/> Add User</button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Roles Table */}
        <div className="lg:col-span-2 bg-[#111] rounded-2xl border border-white/5 overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex flex-col h-[calc(100vh-220px)]">
          <div className="p-4 border-b border-white/5 bg-white/5"><h3 className="text-white font-bold tracking-widest uppercase text-sm">Account Management</h3></div>
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead><tr className="bg-black/40 text-gray-400 text-xs uppercase tracking-wider"><th className="px-6 py-4">Username</th><th className="px-6 py-4 text-right">Delete</th></tr></thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {users.map((u: any) => (
                  <tr key={u._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-bold">{u.username}</td>
                    <td className="px-6 py-4 text-right"><button onClick={()=>handleDelete(u._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button></td>
                  </tr>
                ))}
                {users.length === 0 && <tr><td colSpan={2} className="p-8 text-center text-gray-500">No users found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Online Activity Panel */}
        <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex flex-col h-[calc(100vh-220px)]">
          <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <h3 className="text-white font-bold tracking-widest uppercase text-sm flex items-center gap-2"><Activity className="w-4 h-4 text-red-500"/> Live Activity</h3>
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