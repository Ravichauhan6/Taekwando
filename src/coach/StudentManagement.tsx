import React, { useState, useEffect } from 'react';
import { Search, Medal, Clock, X, Phone, MapPin, Activity } from 'lucide-react';

export const StudentManagement = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [nextBelt, setNextBelt] = useState('');
  
  const coachId = localStorage.getItem('coachToken');

  const belts = ['White', 'Yellow', 'Green', 'Blue', 'Red', 'Black'];

  useEffect(() => { 
    if(coachId) fetchStudents(); 
  }, [coachId]);

  const fetchStudents = async () => {
    try {
      const res = await fetch(`/api/coach/students?coachId=${coachId}`);
      if(res.ok) setStudents(await res.json());
    } catch(err) { console.error(err); }
  };

  const handleBeltPromote = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!selectedStudent || !nextBelt) return;
    try {
      await fetch(`/api/coach/students/${selectedStudent._id}/belt`, {
         method: 'PUT',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({ nextBelt })
      });
      setIsGradingModalOpen(false);
      setSelectedStudent(null);
      setNextBelt('');
      fetchStudents();
    } catch(err) { console.error(err); }
  };

  const openGrading = (s: any) => {
    setSelectedStudent(s);
    setNextBelt('');
    setIsGradingModalOpen(true);
  };

  const getBeltColorCode = (belt: string) => {
    if(!belt) return 'bg-gray-100 text-gray-800 border-gray-300';
    const b = belt.toLowerCase();
    if(b.includes('white')) return 'bg-gray-100 text-gray-800 border-gray-300';
    if(b.includes('yellow')) return 'bg-yellow-400 text-yellow-900 border-yellow-500';
    if(b.includes('green')) return 'bg-green-500 text-white border-green-600';
    if(b.includes('blue')) return 'bg-blue-500 text-white border-blue-600';
    if(b.includes('red')) return 'bg-red-500 text-white border-red-600';
    if(b.includes('black')) return 'bg-black text-white border-gray-700 shadow-sm shadow-white/20';
    return 'bg-gray-500 text-white border-gray-600';
  };

  // Filter
  const filtered = students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || (s.current_belt && s.current_belt.toLowerCase().includes(searchTerm.toLowerCase())));

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h2 className="text-2xl font-black text-white tracking-widest uppercase">Student Roster</h2>
            <p className="text-gray-400 text-sm mt-1">
               Official enrolled MDTA players assigned to your Academy ({students.length})
            </p>
         </div>
      </div>

      {/* Roster Table */}
      <div className="bg-[#111] rounded-2xl border border-white/5 shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
        {/* Search */}
        <div className="p-4 border-b border-white/5 bg-white/[0.02]">
           <div className="relative max-w-sm">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
             <input type="text" placeholder="Search by name or belt..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-sm font-medium transition-all" />
           </div>
        </div>

        <div className="flex-1 overflow-x-auto">
           <table className="w-full text-left whitespace-nowrap">
             <thead>
               <tr className="bg-black/30 border-b border-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                 <th className="px-6 py-4">Student Identity</th>
                 <th className="px-6 py-4">Physical Details</th>
                 <th className="px-6 py-4">Contact Info</th>
                 <th className="px-6 py-4">Current Belt</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-white/5 text-sm">
               {filtered.map(s => (
                 <tr key={s._id} className="hover:bg-white/[0.02] transition-colors group">
                   <td className="px-6 py-4">
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center overflow-hidden">
                         {s.photo_url ? (
                            <img src={s.photo_url} alt={s.name} className="w-full h-full object-cover" />
                         ) : (
                            <span className="font-bold text-gray-300">{s.name.charAt(0).toUpperCase()}</span>
                         )}
                       </div>
                       <div className="flex flex-col">
                         <span className="text-white font-bold tracking-wide text-[15px]">{s.name}</span>
                         <span className="text-[11px] text-gray-500 font-medium">Joined {new Date(s.date_registered).toLocaleDateString()}</span>
                       </div>
                     </div>
                   </td>
                   
                   <td className="px-6 py-4">
                     <div className="flex flex-col">
                        <span className="text-gray-300 font-medium text-sm">{s.age} yrs <span className="text-gray-600 mx-1">|</span> {s.weight} kg</span>
                        <span className="text-[11px] font-bold text-red-500 mt-0.5 flex items-center gap-1"><Activity size={10}/> Blood: {s.blood_group || 'N/A'}</span>
                     </div>
                   </td>
                   
                   <td className="px-6 py-4">
                     <div className="flex flex-col gap-1 max-w-[200px] whitespace-normal">
                        <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5"><Phone size={12}/> {s.mobile || 'No Mobile'}</span>
                        <span className="text-[11px] text-gray-500 flex items-start gap-1.5 leading-snug"><MapPin size={12} className="shrink-0 mt-0.5"/> {s.local_address || s.address || 'No Address'}</span>
                     </div>
                   </td>
                   
                   <td className="px-6 py-4">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold border drop-shadow-md ${getBeltColorCode(s.current_belt)}`}>
                       {s.current_belt || 'White'}
                     </span>
                     <button onClick={() => openGrading(s)} className="ml-3 px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-[10px] uppercase font-bold text-white tracking-wider border border-red-400/30 transition-all">Promote</button>
                   </td>
                 </tr>
               ))}
               {filtered.length === 0 && <tr><td colSpan={4} className="p-12 text-center text-gray-500 font-medium">No official students have registered under your Academy Name yet.</td></tr>}
             </tbody>
           </table>
        </div>
      </div>

      {/* Belt Grading Tracker Modal */}
      {isGradingModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] animate-in fade-in zoom-in-95 border border-red-500/30 rounded-2xl w-full max-w-lg overflow-hidden shadow-[0_0_50px_rgba(255,0,0,0.1)]">
             <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
                <div>
                  <h3 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-2"><Medal className="text-yellow-500"/> Belt Grading</h3>
                  <p className="text-gray-400 text-sm font-medium mt-1">Promoting: <span className="text-white font-bold">{selectedStudent.name}</span></p>
                </div>
                <button onClick={() => setIsGradingModalOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={20}/></button>
             </div>
             
             {/* History Timeline */}
             <div className="bg-white/[0.02] p-6 max-h-60 overflow-y-auto">
                <h4 className="text-[10px] font-black tracking-widest uppercase text-gray-500 mb-4 ml-2">Promotion History</h4>
                
                {(!selectedStudent.belt_history || selectedStudent.belt_history.length === 0) ? (
                   <div className="text-gray-500 text-sm italic ml-2">No past promotions recorded. Starting Belt: {selectedStudent.current_belt || 'White'}</div>
                ) : (
                   <div className="space-y-4 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                      {selectedStudent.belt_history.map((h: any, idx: number) => (
                         <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 bg-black text-gray-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                               <div className={`w-3 h-3 rounded-full ${getBeltColorCode(h.belt_color)} border-0`}></div>
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-black/40 p-3 rounded-lg border border-white/5">
                               <div className="flex justify-between items-center mb-1">
                                  <h5 className="font-bold text-white text-sm">{h.belt_color} Belt</h5>
                                  <span className="text-[10px] tracking-wider text-gray-500 bg-white/5 px-2 py-0.5 rounded flex items-center gap-1"><Clock size={10}/> {new Date(h.promotion_date).toLocaleDateString()}</span>
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>
                )}
             </div>

             <form onSubmit={handleBeltPromote} className="p-6 border-t border-white/5 space-y-4">
                <div>
                   <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Award Next Belt</label>
                   <select required value={nextBelt} onChange={(e)=>setNextBelt(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none">
                      <option value="">Select Target Belt...</option>
                      {belts.map(b => (
                         <option key={b} value={b} disabled={b === (selectedStudent.current_belt || 'White')}>{b} Belt {(b === (selectedStudent.current_belt || 'White')) ? '(Current)' : ''}</option>
                      ))}
                   </select>
                </div>
                <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-900 border border-red-500/50 hover:from-red-500 hover:to-red-800 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(255,0,0,0.3)] text-sm">Save Promotion</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};
