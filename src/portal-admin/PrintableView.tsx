import React from 'react';
import { createPortal } from 'react-dom';
import { Printer, X } from 'lucide-react';

export const PrintableView = ({ reg, onClose }: { reg: any; onClose: () => void }) => {
  if (!reg) return null;
  
  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-gray-200 text-black overflow-y-auto print:bg-white font-sans">
      {/* Top Navbar */}
      <div className="flex justify-between items-center p-4 bg-gray-100 border-b border-gray-200 print:hidden sticky top-0 z-50 shadow-sm">
        <button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-[13px] font-bold transition-colors shadow-sm flex items-center gap-2">
          <Printer className="w-4 h-4"/> Print Registration Form
        </button>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors"><X className="w-6 h-6"/></button>
      </div>

      {/* ======================= */}
      {/* UNIFIED PRINT & PREVIEW */}
      {/* ======================= */}
      <div className="flex flex-col items-center w-full py-8 gap-8 print:py-0 print:gap-0 print:bg-white">
        
        {/* Page 1 */}
        <div className="print-page w-[210mm] min-h-[297mm] bg-white p-8 box-border relative overflow-hidden text-[13px] shadow-lg print:shadow-none print:w-full print:min-h-0 print:h-[297mm] print:p-8">
            <div className="relative text-center mb-6 border-b-[2px] border-black pb-2">
              <div className="w-full text-center px-1">
                 <h1 className="text-[30px] font-[900] tracking-wide mb-0 leading-[1.1] text-black drop-shadow-sm" style={{fontFamily: "'Tiro Devanagari Hindi', serif"}}>महाराजगंज डिस्ट्रिक्ट ताईक्वांडो एसोसिएशन</h1>
                 <h2 className="text-[27px] font-black uppercase tracking-tighter mb-2 font-sans whitespace-nowrap text-black drop-shadow-sm" style={{transform: "scaleY(1.15)"}}>Maharajganj District Taekwondo Association</h2>
              </div>
              
              <div className="flex justify-between items-center w-full mb-1 mt-2">
                 {/* Left Logo */}
                 <div className="w-[140px] flex-shrink-0 flex justify-center self-start">
                    <img src="/logo.png" className="w-[115px] h-[115px] object-contain mix-blend-multiply" alt="MDTA" />
                 </div>
                 
                 {/* Center Affiliations */}
                 <div className="flex-1 flex flex-col items-center justify-center px-1">
                    <div className="text-[11px] font-bold mt-1 text-[#000] leading-none">(Regd. no.- 150/2012)</div>
                    <div className="text-[15px] font-black tracking-widest mt-1 mb-1.5 text-[#000]">*AFFILIATED TO*</div>
                    <div className="text-[15.5px] sm:text-[17px] font-black uppercase tracking-tight leading-[1.2] text-[#000] text-center w-full whitespace-nowrap">Uttar Pradesh Taekwondo Association (UPTA)</div>
                    <div className="text-[15.5px] sm:text-[17px] font-black uppercase tracking-tight leading-[1.2] text-[#000] text-center w-full whitespace-nowrap">Taekwondo Federation of India (TFI)</div>
                    <div className="w-[100%] h-[1.5px] bg-black my-2"></div>
                 </div>

                 {/* Right Logo */}
                 <div className="w-[140px] flex-shrink-0 flex justify-center self-start pt-1">
                    <img src="/upta-logo.png" className="w-[160px] h-auto object-contain mix-blend-multiply origin-top scale-110 translate-x-1" alt="UPTA" />
                 </div>
              </div>
              
              <div className="text-[14px] font-black tracking-widest mb-1.5 mt-0 text-[#000]">*RECOGNIZED BY*</div>
              <div className="text-[11.5px] font-bold uppercase tracking-wider underline underline-offset-2 decoration-[1.5px] mb-2 text-[#000]">*U.P. OLYMPIC ASSO. *INDIAN OLYMPIC ASSO. *ASIAN TAEKWONDO UNION. *WORLD TAEKWONDO</div>
              <div className="text-[12px] font-black uppercase tracking-wide mb-2 mt-2 text-[#000]">* THE MINISTRY OF YOUTH AFFAIRS & SPORTS, GOVERNMENT OF INDIA *</div>
              <div className="w-full h-[2.5px] bg-black mb-1.5 mt-1"></div>
              <div className="bg-black text-white inline-block px-10 py-1.5 font-black text-[16px] uppercase tracking-widest rounded-md mt-1 mb-2 shadow-sm" style={{WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>Application Form of Registration & Admission</div>
           </div>
           
           <div className="text-xs font-medium mb-2 pl-1">Registration Number <span className="text-[14px] font-black ml-1 uppercase">{reg.id}</span></div>
           <table className="w-full border-collapse border border-gray-400 text-[13px] font-medium" style={{tableLayout: 'fixed'}}>
             <tbody>
               <tr className="border-[1px] border-gray-400 h-10">
                 <td className="p-2 border-[1px] border-gray-400 align-top w-[50%]" colSpan={2}><span className="text-gray-700 text-[12px] mr-1">Name of the Candidate :</span><span className="font-extrabold text-[14px] uppercase">{reg.name}</span></td>
                 <td className="p-2 border-[1px] border-gray-400 align-top w-[50%]" colSpan={2}><span className="text-gray-700 text-[12px] mr-1">Father's Name :</span><span className="font-bold text-[13px] uppercase">{reg.fatherName && reg.fatherName !== 'Not Provided' ? reg.fatherName : '______________________'}</span></td>
               </tr>
               <tr className="border-[1px] border-gray-400 h-10">
                 <td className="p-2 border-[1px] border-gray-400 align-top w-[25%]" colSpan={2}><span className="text-gray-700 text-[12px] mr-1">Father's Occ:</span><span className="font-bold uppercase">{reg.fatherOccupation && reg.fatherOccupation !== 'Not Provided' ? reg.fatherOccupation : '______________________'}</span></td>
                 <td className="p-2 border-[1px] border-gray-400 align-top w-[25%]" colSpan={1}><span className="text-gray-700 text-[12px] mr-1">DOB :</span><span className="font-bold">{reg.dob && reg.dob !== 'Not Provided' ? reg.dob : '_________'}</span></td>
                 <td className="p-0 border-[1px] border-gray-400 w-[150px] text-center align-top relative bg-gray-100" rowSpan={6} style={{WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
                   <div className="absolute inset-x-2 inset-y-2 flex flex-col items-center">
                     <div className="w-full h-[145px] border border-gray-300 bg-[#00aaff] flex items-center justify-center overflow-hidden">{reg.photoFile ? <img src={reg.photoFile} className="w-full h-full object-cover"/> : ''}</div>
                     <div className="w-full h-[35px] bg-gray-200 flex items-center justify-center overflow-hidden border-x border-b border-gray-300">{reg.signatureFile ? <img src={reg.signatureFile} className="w-full h-full object-contain mix-blend-multiply"/> : ''}</div>
                   </div>
                 </td>
               </tr>
               <tr className="border-[1px] border-gray-400 h-10"><td className="p-2 border-[1px] border-gray-400 align-top" colSpan={2}><span className="text-gray-700 text-[12px] mr-1">Gender:</span><span className="font-bold uppercase">{reg.gender && reg.gender !== 'Not Provided' ? reg.gender : '__________'}</span></td><td className="p-2 border-[1px] border-gray-400 align-top"><span className="text-gray-700 text-[12px] mr-1">Mobile:</span><span className="font-bold">{reg.mobile && reg.mobile !== 'Not Provided' ? reg.mobile : '__________'}</span></td></tr>
               <tr className="border-[1px] border-gray-400 h-10"><td className="p-2 border-[1px] border-gray-400 align-top" colSpan={2}><span className="text-gray-700 text-[12px] mr-1">Height:</span><span className="font-bold">{reg.height && reg.height !== 'Not Provided' ? reg.height : '_______'}</span></td><td className="p-2 border-[1px] border-gray-400 align-top"><span className="text-gray-700 text-[12px] mr-1">Weight:</span><span className="font-bold">{reg.weight && reg.weight !== 'Not Provided' ? reg.weight : '_______'}</span></td></tr>
               <tr className="border-[1px] border-gray-400"><td className="p-2 border-[1px] border-gray-400 align-top h-[50px]" colSpan={3}><div className="text-gray-700 text-[12px] mb-1">Training Center :</div><div className="font-extrabold text-[13px] uppercase tracking-wide">{reg.center}</div></td></tr>
               <tr className="border-[1px] border-gray-400"><td className="p-2 border-[1px] border-gray-400 align-top h-[60px]" colSpan={3}><div className="text-gray-700 text-[12px] mb-1">Training Centre Address :</div><div className="font-bold uppercase">{reg.trainingCenterAddress && reg.trainingCenterAddress !== 'Not Provided' ? reg.trainingCenterAddress : '________________________________________'}</div></td></tr>
               <tr className="border-[1px] border-gray-400"><td className="p-2 border-[1px] border-gray-400 align-top h-[50px]" colSpan={3}><div className="text-gray-700 text-[12px] mb-1">Trainer Name:</div><div className="font-bold uppercase tracking-wide">{reg.coachName && reg.coachName !== 'Not Provided' ? reg.coachName : '______________________'}</div></td></tr>
               <tr className="border-[1px] border-gray-400 h-10"><td className="p-2 border-[1px] border-gray-400 align-middle font-bold text-[13px] w-[35%]">Blood Group</td><td className="p-2 border-[1px] border-gray-400 align-middle font-black text-sm" colSpan={3}>{reg.bloodGroup && reg.bloodGroup !== 'Not Provided' ? reg.bloodGroup : '_______'}</td></tr>
               <tr className="border-[1px] border-gray-400 h-10"><td className="p-2 border-[1px] border-gray-400 align-middle text-[13px]">Aadhar</td><td className="p-2 border-[1px] border-gray-400 align-middle font-bold" colSpan={3}>{reg.aadhar && reg.aadhar !== 'Not Provided' ? reg.aadhar : '________________'}</td></tr>
               <tr className="border-[1px] border-gray-400 h-10"><td className="p-2 border-[1px] border-gray-400 align-middle text-[13px]">Qual</td><td className="p-2 border-[1px] border-gray-400 align-middle font-bold" colSpan={3}>{reg.qualification && reg.qualification !== 'Not Provided' ? reg.qualification : '_________________________'}</td></tr>
               <tr className="border-[1px] border-gray-400 h-10"><td className="p-2 border-[1px] border-gray-400 align-middle text-[13px]">School</td><td className="p-2 border-[1px] border-gray-400 align-middle font-bold" colSpan={3}>{reg.schoolCollege && reg.schoolCollege !== 'Not Provided' ? reg.schoolCollege : '_________________________'}</td></tr>
               <tr className="border-[1px] border-gray-400 h-10"><td className="p-2 border-[1px] border-gray-400 align-middle text-[13px]">Perm Address</td><td className="p-2 border-[1px] border-gray-400 align-middle font-bold" colSpan={3}>{reg.permanentAddress && reg.permanentAddress !== 'Not Provided' ? reg.permanentAddress : '________________________________________'}</td></tr>
               <tr className="border-[1px] border-gray-400 h-10"><td className="p-2 border-[1px] border-gray-400 align-middle text-[13px]">Local Address</td><td className="p-2 border-[1px] border-gray-400 align-middle font-bold" colSpan={3}>{reg.localAddress && reg.localAddress !== 'Not Provided' ? reg.localAddress : '________________________________________'}</td></tr>
             </tbody>
           </table>
           <div className="absolute bottom-6 right-8 text-[11px] font-bold text-black mt-4 w-full text-right">1/2</div>
        </div>

        {/* Page 2 */}
        <div className="print-page w-[210mm] min-h-[297mm] bg-white p-8 box-border relative overflow-hidden flex flex-col text-[13px] shadow-lg print:shadow-none print:w-full print:min-h-0 print:h-[297mm] print:p-8">
           <div className="flex-1 mt-4">
             <div className="border border-black text-[12px] leading-[1.6] text-black text-justify mb-0 bg-transparent">
               <div className="px-5 py-6 font-medium">
                  <strong className="text-[13px]">Declaration</strong> - I hereby declare that all entries made in the above columns are true to the best of my knowledge and belief.<br/>
                  <strong className="text-[13px]">Rules &amp; Regulations -</strong>
                  <ol className="list-decimal pl-5 space-y-3.5 mt-2">
                    <li>Trainees should always be neat and clean in Taekwondo Uniform.</li>
                    <li>Strict discipline will be maintained.</li>
                    <li>Maharajganj District Taekwondo Association's Training Centers and Instructor will not be responsible in any way for the injuries or accidents sustained by trainees during the training period.</li>
                    <li>Weapons are prohibited in the class.</li>
                    <li>Show of Taekwondo (Art) is prohibited in public places.</li>
                    <li>Use of Taekwondo Art for self-defense: Maharajganj District Taekwondo Association and Instructor will not be responsible in your personal cases.</li>
                  </ol>
               </div>
             </div>
             
             <div className="grid grid-cols-2 border border-black border-t-0 text-[14px] font-bold text-black h-[140px] bg-transparent">
               <div className="border-r border-black p-4 flex flex-col justify-between"><div className="text-left">Parent / Guaerdian Signature</div></div>
               <div className="p-4 flex flex-col justify-between items-end relative">
                 <div className="text-right w-full flex justify-between pr-2"><span></span><span>Authorized Signature</span></div>
                 <div className="text-center w-56 flex flex-col items-end mr-2 absolute bottom-2 right-4">
                     <img src="/signature.png" alt="Sig" className="h-[55px] w-auto object-contain mix-blend-multiply mb-1" />
                     <div className="text-[12px] font-black tracking-wide">(Secretary MDTA Maharajganj)</div>
                 </div>
               </div>
             </div>
           </div>
           
           <div className="mt-8 relative bottom-10 w-full">
             <div className="border-[2px] border-black rounded-sm overflow-hidden text-center text-black">
               <div className="bg-black text-white font-black py-2 text-[14px] tracking-wide uppercase" style={{WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
                 Our Moto : Devlopment Of Disciplined &amp; Dynamic System Of Self-Defense &amp; Sports.
               </div>
               <div className="bg-[#9fa8da] py-2 border-t-[2px] border-black text-[14px] font-bold leading-relaxed" style={{WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
                 <span className="underline decoration-[1.5px] underline-offset-2 text-[#444] text-[16px] block mb-1 font-serif italic tracking-wider drop-shadow-[0_0_1px_#fff]" style={{textShadow: "0 0 1px #fff"}}>*Head Office Address*</span>
                 Shastri Nagar, Nagar Palika Parishad, Ward No. 19, District-Maharajganj. U.P. (273303)<br/>
                 Mob. No. +919161115569 E-mail- tkdabhi@gmail.com www.mdtamrj.com
               </div>
             </div>
           </div>
           <div className="absolute bottom-6 right-8 text-[11px] font-bold text-black w-full text-right mt-4">2/2</div>
        </div>
      </div>
    </div>,
    document.body
  );
};
