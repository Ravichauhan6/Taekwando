import sys
with open('src/portal-admin/PrintableView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = "      {/* ======================= */\n      {/* DIGITAL PREVIEW ONLY    */\n      {/* ======================= */"
end_marker = "      {/* ======================= */\n      {/* PERFECT PRINT 2-PAGE    */\n      {/* ======================= */"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + content[end_idx:]

content = content.replace("      {/* PERFECT PRINT 2-PAGE    */", "      {/* UNIFIED PRINT & PREVIEW */")
content = content.replace("<div className=\"hidden print:flex flex-col items-center w-full bg-white print:p-0 print:m-0\">", "<div className=\"flex flex-col items-center w-full py-8 gap-8 print:py-0 print:gap-0 print:bg-white\">")
content = content.replace("<div className=\"print-page w-[210mm] min-h-[297mm] bg-white p-8 box-border relative overflow-hidden text-[13px]\">", "<div className=\"print-page w-[210mm] min-h-[297mm] bg-white p-8 box-border relative overflow-hidden text-[13px] shadow-[0_0_15px_rgba(0,0,0,0.1)] print:shadow-none print:w-full print:min-h-0 print:h-[297mm] print:p-8\">")
content = content.replace("<div className=\"print-page w-[210mm] min-h-[297mm] bg-white p-8 box-border relative overflow-hidden flex flex-col text-[13px]\">", "<div className=\"print-page w-[210mm] min-h-[297mm] bg-white p-8 box-border relative overflow-hidden flex flex-col text-[13px] shadow-[0_0_15px_rgba(0,0,0,0.1)] print:shadow-none print:w-full print:min-h-0 print:h-[297mm] print:p-8\">")

with open('src/portal-admin/PrintableView.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
