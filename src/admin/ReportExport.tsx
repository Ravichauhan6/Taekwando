import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FileText, Download } from 'lucide-react';

export const ReportExport = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then(res => res.json()),
      fetch('/api/players').then(res => res.json())
    ]).then(([cats, pls]) => {
      setCategories(cats);
      setPlayers(pls);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const generatePDF = (categoryId: string, categoryName: string, categoryDesc: string) => {
    const categoryPlayers = players.filter(p => {
      const pCatId = p.weight_category_id && typeof p.weight_category_id === 'object' ? (p.weight_category_id._id || p.weight_category_id.id) : p.weight_category_id;
      return pCatId === categoryId;
    });
    
    if (categoryPlayers.length === 0) {
      alert("No players registered in this category yet.");
      return;
    }

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(220, 38, 38); // Red-600
    doc.text("Maharajganj District Taekwondo Association", 14, 20);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Category Report: ${categoryName}`, 14, 30);
    
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Details: ${categoryDesc} | Total Players: ${categoryPlayers.length}`, 14, 38);

    // Table
    const tableData = categoryPlayers.map((p, index) => [
      index + 1,
      p.name,
      p.dob ? `${p.dob} (${p.age}y)` : `${p.age}y`,
      p.gender,
      p.weight.toString() + ' kg',
      p.address || ''
    ]);

    autoTable(doc, {
      startY: 45,
      head: [['#', 'Name', 'DOB (Age)', 'Gender', 'Weight', 'Address']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [220, 38, 38] }, // Red header
      styles: { fontSize: 10, cellPadding: 3 },
    });

    const filename = `MDTA_Report_${categoryName.replace(/\s+/g, '_')}.pdf`;
    doc.save(filename);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-[32px] font-black text-white tracking-widest uppercase mb-2 drop-shadow-[0_2px_10px_rgba(255,0,0,0.2)]">Export PDF Reports</h2>
        <p className="text-gray-400 font-medium">Download categorized sheets for tournament weigh-in and bout management.</p>
      </div>

      <div className="bg-[#111] rounded-3xl shadow-[0_0_50px_rgba(255,0,0,0.1)] border border-red-500/20 p-10 relative overflow-hidden">
        
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[80px] pointer-events-none rounded-full"></div>

        {loading ? (
          <div className="text-center text-gray-500 font-bold uppercase tracking-widest py-16 animate-pulse relative z-10">Loading catalog data...</div>
        ) : categories.length === 0 ? (
          <div className="text-center text-gray-500 py-16 relative z-10">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-bold text-lg uppercase tracking-widest">No Categories Defined</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {categories.map(cat => {
              const catId = cat._id || cat.id;
              const count = players.filter(p => {
                const pCatId = p.weight_category_id && typeof p.weight_category_id === 'object' ? (p.weight_category_id._id || p.weight_category_id.id) : p.weight_category_id;
                return pCatId === catId;
              }).length;
              return (
                <div key={catId} className="bg-[#0a0a0a] border border-white/5 hover:border-red-500/50 rounded-2xl p-8 transition-colors group shadow-inner">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-red-500/10 p-3.5 rounded-xl border border-red-500/20 group-hover:bg-red-500/20 transition-colors">
                      <FileText className="w-6 h-6 text-red-500" />
                    </div>
                    <span className="bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/10 group-hover:text-white transition-colors">
                      {count} Players
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2 group-hover:text-red-400 transition-colors">{cat.name}</h3>
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-8 leading-relaxed">
                    {cat.age_group} <span className="mx-1">•</span> {cat.gender === 'Male' ? 'Boys' : 'Girls'} <br/>
                    <span className="text-red-500/70">{cat.min_weight}kg - {cat.max_weight}kg</span>
                  </p>
                  
                  <button 
                    onClick={() => generatePDF(catId, cat.name, `${cat.age_group} ${cat.gender === 'Male' ? 'Boys' : 'Girls'} (${cat.min_weight}kg - ${cat.max_weight}kg)`)}
                    className="w-full flex items-center justify-center gap-2 bg-[#111] hover:bg-gradient-to-r hover:from-red-600 hover:to-red-800 hover:text-white text-gray-400 font-black py-3.5 rounded-xl transition-all border border-white/10 hover:border-red-500/50 uppercase tracking-[0.2em] text-[10px] shadow-sm hover:shadow-[0_4px_15px_rgba(255,0,0,0.3)]"
                  >
                    <Download className="w-4 h-4" />
                    Export PDF
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
