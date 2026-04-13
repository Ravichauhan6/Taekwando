const fs = require('fs');

let content = fs.readFileSync('src/portal-admin/PrintableView.tsx', 'utf8');

const startMarker = "      {/* ======================= */\r\n      {/* DIGITAL PREVIEW ONLY    */\r\n      {/* ======================= */";
const endMarker = "      {/* ======================= */\r\n      {/* PERFECT PRINT 2-PAGE    */\r\n      {/* ======================= */";

// try both \r\n and \n just in case
let startIdx = content.indexOf(startMarker);
if (startIdx === -1) {
  startIdx = content.indexOf("      {/* ======================= */\n      {/* DIGITAL PREVIEW ONLY    */\n      {/* ======================= */");
}

let endIdx = content.indexOf(endMarker);
if (endIdx === -1) {
  endIdx = content.indexOf("      {/* ======================= */\n      {/* PERFECT PRINT 2-PAGE    */\n      {/* ======================= */");
}

if (startIdx !== -1 && endIdx !== -1) {
    content = content.substring(0, startIdx) + content.substring(endIdx);
}

content = content.replace("      {/* PERFECT PRINT 2-PAGE    */", "      {/* UNIFIED PRINT & PREVIEW */");
content = content.replace("<div className=\"hidden print:flex flex-col items-center w-full bg-white print:p-0 print:m-0\">", "<div className=\"flex flex-col items-center w-full py-8 gap-8 print:py-0 print:gap-0 print:bg-white\">");
content = content.replace("<div className=\"print-page w-[210mm] min-h-[297mm] bg-white p-8 box-border relative overflow-hidden text-[13px]\">", "<div className=\"print-page w-[210mm] min-h-[297mm] bg-white p-8 box-border relative overflow-hidden text-[13px] shadow-[0_0_15px_rgba(0,0,0,0.1)] print:shadow-none print:w-full print:min-h-0 print:h-[297mm] print:p-8\">");
content = content.replace("<div className=\"print-page w-[210mm] min-h-[297mm] bg-white p-8 box-border relative overflow-hidden flex flex-col text-[13px]\">", "<div className=\"print-page w-[210mm] min-h-[297mm] bg-white p-8 box-border relative overflow-hidden flex flex-col text-[13px] shadow-[0_0_15px_rgba(0,0,0,0.1)] print:shadow-none print:w-full print:min-h-0 print:h-[297mm] print:p-8\">");

fs.writeFileSync('src/portal-admin/PrintableView.tsx', content);

console.log('Done');
