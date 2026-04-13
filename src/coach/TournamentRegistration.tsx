import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, MapPin, CheckSquare, Square, Check, X } from 'lucide-react';

export const TournamentRegistration = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const coachId = localStorage.getItem('coachToken');

  useEffect(() => {
    fetchEvents();
    if (coachId) fetchStudents();
  }, [coachId]);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/coach/events');
      if (res.ok) setEvents(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch(`/api/coach/students?coachId=${coachId}`);
      if (res.ok) setStudents(await res.json());
    } catch (err) { console.error(err); }
  };

  const openEnrollment = (evt: any) => {
    setSelectedEvent(evt);
    setSelectedStudentIds([]);
    setIsModalOpen(true);
  };

  const toggleStudentSelection = (id: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const handleEnroll = async () => {
    if (selectedStudentIds.length === 0 || !selectedEvent || !coachId) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/coach/events/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: selectedEvent._id,
          coach_id: coachId,
          enrolled_students: selectedStudentIds
        })
      });
      if (res.ok) {
        setIsModalOpen(false);
        setSuccessMsg(`Successfully enrolled ${selectedStudentIds.length} students into ${selectedEvent.title}!`);
        setTimeout(() => setSuccessMsg(''), 5000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div>
         <h2 className="text-2xl font-black text-white tracking-widest uppercase">Upcoming Tournaments</h2>
         <p className="text-gray-400 text-sm mt-1">Select an event to register your students</p>
      </div>

      {successMsg && (
        <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
           <Check className="text-green-500" size={20} />
           <p className="text-green-400 font-bold tracking-wide">{successMsg}</p>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {events.map((evt) => (
          <div key={evt._id} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(255,0,0,0.2)] transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-red-600/20 transition-all"></div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-black border border-white/5 flex items-center justify-center flex-shrink-0 shadow-inner">
                 <Trophy className="text-red-500" size={20} />
              </div>
              <h3 className="text-lg font-bold text-white leading-tight">{evt.title}</h3>
            </div>
            
            <div className="space-y-2 mb-8">
              <p className="text-gray-400 text-sm flex items-center gap-2"><Calendar size={14}/> {new Date(evt.date).toDateString()}</p>
              <p className="text-gray-400 text-sm flex items-center gap-2"><MapPin size={14}/> {evt.location}</p>
              <div className="inline-block mt-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded text-[10px] uppercase font-bold tracking-widest text-red-500">
                 {evt.type} Event
              </div>
            </div>

            <button 
              onClick={() => openEnrollment(evt)}
              className="w-full py-3 bg-white/5 hover:bg-red-600 border border-white/10 hover:border-transparent text-white font-bold tracking-widest uppercase text-xs rounded-xl transition-all shadow-md group-hover:shadow-[0_0_20px_rgba(255,0,0,0.3)]"
            >
               Register Team
            </button>
          </div>
        ))}
        {events.length === 0 && (
           <div className="col-span-full py-20 text-center text-gray-500 font-medium bg-[#111] rounded-2xl border border-white/5">
              No upcoming tournaments available at this time.
           </div>
        )}
      </div>

      {/* Roster Selection Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] animate-in fade-in zoom-in-95 border border-red-500/30 rounded-2xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(255,0,0,0.1)] flex flex-col max-h-[85vh]">
            
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
               <div>
                  <h3 className="text-lg font-black text-white tracking-widest uppercase">Team Registration</h3>
                  <p className="text-gray-400 text-xs font-medium mt-1">Select students for <span className="text-white">{selectedEvent.title}</span></p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={20}/></button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
               <div className="space-y-3">
                 {students.map(s => (
                   <div 
                     key={s._id} 
                     onClick={() => toggleStudentSelection(s._id)}
                     className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${selectedStudentIds.includes(s._id) ? 'bg-red-600/10 border-red-500/50 shadow-[0_0_15px_rgba(255,0,0,0.15)]' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
                   >
                     {selectedStudentIds.includes(s._id) ? <CheckSquare className="text-red-500" size={20}/> : <Square className="text-gray-600" size={20}/>}
                     <div className="flex-1">
                        <h4 className="text-white font-bold">{s.name}</h4>
                        <div className="flex gap-4 mt-1 text-xs text-gray-400 font-medium">
                           <span>Age: {s.age}</span>
                           <span>Weight: {s.weight_category || 'N/A'}</span>
                           <span>Belt: {s.current_belt}</span>
                        </div>
                     </div>
                   </div>
                 ))}
                 {students.length === 0 && (
                    <div className="text-center py-10 text-gray-500">You must add students to your roster first!</div>
                 )}
               </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-black/40 flex items-center justify-between">
               <span className="text-sm font-bold text-gray-300">
                  <span className="text-red-500 text-xl font-black">{selectedStudentIds.length}</span> / {students.length} Selected
               </span>
               <div className="flex gap-3">
                  <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-colors">Cancel</button>
                  <button 
                    onClick={handleEnroll} 
                    disabled={selectedStudentIds.length === 0 || isSubmitting}
                    className="px-8 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(255,0,0,0.4)]"
                  >
                    {isSubmitting ? 'Processing...' : 'Submit Roster'}
                  </button>
               </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
