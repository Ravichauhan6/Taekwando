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

  const generatePDF = (categoryId: number, categoryName: string, categoryDesc: string) => {
    const categoryPlayers = players.filter(p => p.weight_category_id === categoryId);
    
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
      p.age.toString(),
      p.gender,
      p.weight.toString() + ' kg',
      p.address
    ]);

    autoTable(doc, {
      startY: 45,
      head: [['#', 'Name', 'Age', 'Gender', 'Weight', 'Address']],
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
        <h2 className="text-3xl font-bold text-gray-900">Export PDF Reports</h2>
        <p className="text-gray-500 mt-1">Download categorized sheets for tournament weigh-in and bout management.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading data...</div>
        ) : categories.length === 0 ? (
          <div className="text-center text-gray-400 py-12">No weight categories defined.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(cat => {
              const count = players.filter(p => p.weight_category_id === cat.id).length;
              return (
                <div key={cat.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-red-50 p-3 rounded-xl">
                      <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">
                      {count} Players
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{cat.name}</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    {cat.age_group} {cat.gender === 'Male' ? 'Boys' : 'Girls'} <br/>
                    ({cat.min_weight}kg - {cat.max_weight}kg)
                  </p>
                  
                  <button 
                    onClick={() => generatePDF(cat.id, cat.name, `${cat.age_group} ${cat.gender === 'Male' ? 'Boys' : 'Girls'} (${cat.min_weight}kg - ${cat.max_weight}kg)`)}
                    className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-red-600 hover:text-white text-gray-700 font-semibold py-2.5 rounded-xl transition-colors border border-gray-200 hover:border-red-600"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
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
