import React, { useState } from 'react';
import { Search, Filter, Eye, Trash2, Download, X, Printer } from 'lucide-react';
import { PrintableView } from './PrintableView';

export const Registrations = () => {
  const [dummyData, setDummyData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStr, setFilterStr] = useState('All');
  const [selectedReg, setSelectedReg] = useState<any>(null);
  const [printReg, setPrintReg] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      const res = await fetch('/api/players');
      const data = await res.json();
      
      // Filter out players registered via Dashboard Admin (only full Applications have email)
      const portalRegistrations = data.filter((p: any) => p.email);

      const mapped = portalRegistrations.map((p: any) => ({
         id: p.id || p._id,
         name: p.name,
         email: p.email,
         center: p.training_center,
         aadhar: p.aadhar_no,
         dob: p.dob,
         bloodGroup: p.blood_group,
         status: p.status,
         fatherName: p.father_name,
         fatherOccupation: p.father_occupation,
         gender: p.gender,
         mobile: p.mobile,
         height: p.height_cm,
         weight: p.weight,
         maritalStatus: p.marital_status,
         qualification: p.qualification,
         schoolCollege: p.school_college,
         permanentAddress: p.permanent_address,
         localAddress: p.local_address,
         coachName: p.coach_name,
         trainingCenterAddress: p.training_center_address,
         aadharFile: p.aadhar_url,
         photoFile: p.photo_url,
         signatureFile: p.signature_url,
         date: new Date(p.date_registered || new Date()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ')
      }));
      setDummyData(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRecords();
  }, []);

// Reusable print component moved to external file PrintableView.tsx


  const handleDelete = async (id: string) => {
    if(window.confirm('Are you sure you want to delete this registration?')) {
      try {
        await fetch(`/api/players/${id}`, { method: 'DELETE' });
        const filtered = dummyData.filter((item) => item.id !== id);
        setDummyData(filtered);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/players/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Verified' })
      });
      if (!res.ok) throw new Error('Failed to update status');

      const updatedData = dummyData.map((item) => 
        item.id === id ? { ...item, status: 'Verified' } : item
      );
      setDummyData(updatedData);
      if (selectedReg && selectedReg.id === id) {
        setSelectedReg({ ...selectedReg, status: 'Verified' });
      }
    } catch (err) {
      console.error(err);
      alert('Failed to verify player. Please try again.');
    }
  };

  const handleExport = () => {
    try {
      const csvContent = "data:text/csv;charset=utf-8,ID,Name,Email,Training Center,Aadhar,Status,Date\n" + 
        dummyData.map(e => `${e.id},${e.name},${e.email},${e.center},${e.aadhar},${e.status},${e.date}`).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "registrations_export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Failed to export CSV.");
    }
  };

  const handleFilterClick = () => {
    const states = ['All', 'Pending Verification', 'Verified', 'Missing Documents'];
    const nextIdx = (states.indexOf(filterStr) + 1) % states.length;
    setFilterStr(states[nextIdx]);
  };

  const filteredData = dummyData.filter(item => {
    const searchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const filterMatch = filterStr === 'All' ? true : item.status === filterStr;
    return searchMatch && filterMatch;
  });

  return (
    <div className="relative z-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h2 className="text-[32px] font-black text-white tracking-widest uppercase mb-2 drop-shadow-[0_2px_10px_rgba(255,0,0,0.2)]">Player Registrations</h2>
          <p className="text-gray-400 font-medium">View and manage all new player registration forms submitted via the portal.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl text-[13px] font-bold uppercase tracking-widest transition-all border border-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.5)]"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-[#111] border border-red-500/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#151515]">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-red-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, email or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium text-white placeholder-gray-600 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-inner"
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={handleFilterClick}
              className="flex items-center justify-center gap-2 bg-[#0a0a0a] border border-[#3b82f6]/30 hover:border-[#3b82f6]/60 text-[#3b82f6] hover:bg-[#3b82f6]/10 px-6 py-3.5 rounded-xl text-[13px] font-bold uppercase tracking-widest transition-all w-full sm:w-auto shadow-[0_0_15px_rgba(59,130,246,0.1)]"
            >
              <Filter className="w-4 h-4" /> {filterStr === 'All' ? 'Filter Status' : filterStr}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-black/40 to-transparent border-b border-red-500/10 text-[11px] uppercase tracking-widest text-gray-500 font-black">
                <th className="px-6 py-5">Reg ID / Date</th>
                <th className="px-6 py-5">Player Info</th>
                <th className="px-6 py-5">Training Center</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.map((reg) => (
                <tr key={reg.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="font-bold text-white mb-1.5 text-[15px]">{reg.id}</div>
                    <div className="text-gray-500 text-[12px] font-medium">{reg.date}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-bold text-white mb-1.5 text-[15px] group-hover:text-red-400 transition-colors">{reg.name}</div>
                    <div className="text-gray-400 text-[12px] flex items-center gap-2 font-medium">
                      {reg.email} <span className="w-1 h-1 bg-gray-600 rounded-full"></span> Aadhar: {reg.aadhar}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-gray-300 font-medium text-[13px]">{reg.center}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md border text-center ${
                      reg.status === 'Verified' 
                        ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]' 
                        : reg.status === 'Missing Documents'
                        ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                        : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]'
                    }`}>
                      {reg.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right flex items-center justify-end gap-3 opacity-100 sm:opacity-50 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setPrintReg(reg)}
                      className="p-2.5 bg-[#0a0a0a] border border-white/5 hover:border-[#10b981]/50 text-[#10b981] hover:bg-[#10b981]/10 rounded-xl transition-all shadow-inner" title="Print Form Format"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setSelectedReg(reg)}
                      className="p-2.5 bg-[#0a0a0a] border border-white/5 hover:border-[#3b82f6]/50 text-[#3b82f6] hover:bg-[#3b82f6]/10 rounded-xl transition-all shadow-inner" title="View Document Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(reg.id)}
                      className="p-2.5 bg-[#0a0a0a] border border-white/5 hover:border-[#ef4444]/50 text-[#ef4444] hover:bg-[#ef4444]/10 rounded-xl transition-all shadow-inner" title="Delete Form"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading ? (
            <div className="p-16 text-center text-gray-400 font-medium text-[15px] animate-pulse">
               Loading registrations from database...
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-16 text-center text-gray-500 font-medium text-[15px]">
              No registrations found.
            </div>
          ) : null}
        </div>
      </div>

      {/* View Details Modal JSX */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-[#3b82f6]/30 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.15)] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#151515]">
              <h3 className="text-xl font-black text-white tracking-widest uppercase mb-0 flex items-center gap-3">
                <span className="p-2 bg-[#3b82f6]/10 text-[#3b82f6] rounded-xl"><Eye className="w-5 h-5" /></span>
                Registration Details
              </h3>
              <button onClick={() => setSelectedReg(null)} className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm bg-gradient-to-b from-[#111] to-[#0a0a0a]">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <span className="block text-gray-500 font-bold text-[10px] tracking-widest uppercase mb-1">Registration ID / Date</span>
                  <span className="text-white font-bold">{selectedReg.id} <span className="text-gray-500 font-medium ml-2">{selectedReg.date}</span></span>
                </div>
                <div>
                  <span className="block text-gray-500 font-bold text-[10px] tracking-widest uppercase mb-1">Player Name</span>
                  <span className="text-white font-bold">{selectedReg.name}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-gray-500 font-bold text-[10px] tracking-widest uppercase mb-1">Email Address</span>
                  <span className="text-white font-medium">{selectedReg.email}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-gray-500 font-bold text-[10px] tracking-widest uppercase mb-1">Training Center</span>
                  <span className="text-[#3b82f6] font-bold">{selectedReg.center}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-white/5">
                  <span className="block text-gray-500 font-bold text-[10px] tracking-widest uppercase mb-3">Verification Details</span>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-gray-600 font-bold text-[10px] tracking-widest uppercase mb-1">Aadhar</span>
                      <span className="text-gray-300 font-medium font-mono">{selectedReg.aadhar}</span>
                    </div>
                    <div>
                      <span className={`inline-flex px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-md border text-center ${
                          selectedReg.status === 'Verified' 
                            ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]' 
                            : selectedReg.status === 'Missing Documents'
                            ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]'
                        }`}>
                          {selectedReg.status}
                        </span>
                    </div>
                  </div>
                </div>

                {/* Uploaded Documents */}
                <div className="col-span-2 pt-2 border-t border-white/5">
                  <span className="block text-gray-500 font-bold text-[10px] tracking-widest uppercase mb-3">Uploaded Documents</span>
                  <div className="flex gap-4">
                    {!selectedReg.photoFile && !selectedReg.signatureFile && !selectedReg.aadharFile && (
                      <span className="text-gray-500 text-xs italic">No documents uploaded.</span>
                    )}
                    {selectedReg.photoFile && (
                      <a href={selectedReg.photoFile} target="_blank" rel="noreferrer" className="block w-16 h-16 rounded-lg overflow-hidden border border-white/10 hover:border-[#3b82f6] transition-colors"><img src={selectedReg.photoFile} alt="Photo" className="w-full h-full object-cover" /></a>
                    )}
                    {selectedReg.signatureFile && (
                      <a href={selectedReg.signatureFile} target="_blank" rel="noreferrer" className="block h-16 rounded-lg overflow-hidden border border-white/10 hover:border-[#3b82f6] transition-colors bg-white"><img src={selectedReg.signatureFile} alt="Signature" className="h-full object-contain" /></a>
                    )}
                    {selectedReg.aadharFile && (
                      <a href={selectedReg.aadharFile} target="_blank" rel="noreferrer" className="flex items-center justify-center p-4 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-[#3b82f6] border border-[#3b82f6]/30 transition-colors">View Aadhar</a>
                    )}
                  </div>
                </div>
              </div>
              <div className="pt-6">
                {selectedReg.status !== 'Verified' && (
                  <button 
                    onClick={() => handleApprove(selectedReg.id)} 
                    className="w-full bg-green-500/10 hover:bg-green-500/20 text-green-500 font-bold py-3.5 rounded-xl uppercase tracking-widest text-xs transition-colors border border-green-500/30 mb-3"
                  >
                    Approve / Verify Player
                  </button>
                )}
                <button 
                  onClick={() => setSelectedReg(null)} 
                  className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 rounded-xl uppercase tracking-widest text-xs transition-colors border border-white/10 hover:border-[#3b82f6]/50"
                >
                  Close Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print View Component */}
      <PrintableView reg={printReg} onClose={() => setPrintReg(null)} />

    </div>
  );
};
