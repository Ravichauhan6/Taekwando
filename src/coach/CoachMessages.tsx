import React, { useState, useEffect } from 'react';
import { Send, Users, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export const CoachMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [studentId, setStudentId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const coachId = localStorage.getItem('coachId');
  const coachName = localStorage.getItem('coachName');

  const fetchData = async () => {
    try {
      if (!coachId) return;
      const [msgsRes, stdsRes] = await Promise.all([
        fetch(`/api/coach-messages/sent/${coachId}`),
        fetch(`/api/players/coach/${coachId}`)
      ]);
      const msgs = await msgsRes.json();
      const stds = await stdsRes.json();
      setMessages(msgs);
      setStudents(stds);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [coachId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/coach-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coach_id: coachId,
          coach_name: coachName,
          student_id: studentId === 'all' ? null : studentId,
          audience: studentId === 'all' ? 'All My Students' : 'Specific',
          title,
          message
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');
      
      setSuccess('Message sent successfully!');
      setTitle('');
      setMessage('');
      setStudentId('');
      fetchData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[32px] font-black text-white tracking-widest uppercase mb-2 drop-shadow-[0_2px_10px_rgba(255,0,0,0.2)]">Message Center</h2>
          <p className="text-gray-400 font-medium">Communicate directly with your students.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Send Message Form */}
        <div className="bg-[#111] p-8 rounded-3xl shadow-[0_0_50px_rgba(255,0,0,0.1)] border border-red-500/20 h-fit">
          <h3 className="text-xl font-black text-white tracking-widest uppercase mb-6 flex items-center gap-3">
            <Send className="w-5 h-5 text-red-500" />
            Send New Message
          </h3>

          {error && (
            <div className="mb-6 bg-red-500/10 text-red-500 border border-red-500/20 p-4 rounded-xl text-xs font-bold uppercase tracking-wide flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 bg-green-500/10 text-green-500 border border-green-500/20 p-4 rounded-xl text-xs font-bold uppercase tracking-wide flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {success}
            </div>
          )}

          <form onSubmit={handleSendMessage} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Recipient</label>
              <select 
                required
                value={studentId} 
                onChange={e => setStudentId(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled className="bg-[#111] text-gray-500">Select Student</option>
                <option value="all" className="bg-[#111] text-white font-bold">ALL MY STUDENTS</option>
                {students.map(s => (
                  <option key={s._id} value={s._id} className="bg-[#111] text-white">{s.name} ({s.id})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Message Title</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Tomorrow's Practice Time Changed"
                className="w-full bg-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all placeholder-gray-700"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Message Content</label>
              <textarea 
                required
                rows={5}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full bg-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all placeholder-gray-700 resize-none"
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white px-8 py-4 rounded-xl text-sm font-black uppercase tracking-[0.2em] transition-all shadow-[0_4px_20px_rgba(255,0,0,0.4)] flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Message History */}
        <div className="lg:col-span-2 bg-[#111] rounded-3xl shadow-[0_0_50px_rgba(255,0,0,0.05)] border border-white/5 overflow-hidden p-8">
            <h3 className="text-xl font-black text-white tracking-widest uppercase mb-6 flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-500" />
              Sent Messages History
            </h3>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
              {loading ? (
                <div className="text-center py-10 animate-pulse text-gray-500 font-bold uppercase tracking-widest">Loading history...</div>
              ) : messages.length === 0 ? (
                <div className="text-center py-20 border border-white/5 border-dashed rounded-2xl">
                  <Send className="w-12 h-12 text-gray-800 mx-auto mb-4 opacity-20" />
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No messages sent yet.</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg._id} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-md font-bold text-white uppercase tracking-wide">{msg.title}</h4>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded border border-white/5 shrink-0">
                        {new Date(msg.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{msg.message}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded">
                        To: {msg.audience === 'All My Students' ? 'All My Students' : (students.find(s => s._id === msg.student_id)?.name || 'Specific Student')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
        </div>

      </div>
    </div>
  );
};
