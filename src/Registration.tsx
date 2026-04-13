import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, ArrowLeft, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PrintableView } from './portal-admin/PrintableView';
import { load } from '@cashfreepayments/cashfree-js';

const toTitleCase = (str: string) => {
  return str.replace(/\b\w+/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
};

export const Registration = () => {
  const [trainingCenters, setTrainingCenters] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    trainingCenterId: '',
    trainingCenter: '',
    coachName: '',
    trainingCenterAddress: '',
    fullName: '',
    fatherName: '',
    fatherOccupation: '',
    dob: '',
    gender: '',
    mobile: '',
    height: '',
    weight: '',
    bloodGroup: '',
    aadhar: '',
    maritalStatus: '',
    qualification: '',
    schoolCollege: '',
    permanentAddress: '',
    localAddress: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [files, setFiles] = useState({
    aadharFile: '',
    photoFile: '',
    signatureFile: ''
  });

  const [fileObjects, setFileObjects] = useState<any>({
    aadharFile: null,
    photoFile: null,
    signatureFile: null
  });

  const [isUploading, setIsUploading] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedReg, setSubmittedReg] = useState<any>(null);
  const [showPrint, setShowPrint] = useState(false);
  const [errorData, setErrorData] = useState('');

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await fetch('/api/coaches');
        const data = await res.json();
        const mapped = data.map((c: any) => ({
          id: c._id,
          name: c.academyName || 'Independent Academy',
          coach: c.name,
          address: c.address || 'Not Provided'
        }));
        setTrainingCenters(mapped);
      } catch (err) {
        console.error('Failed to fetch coaches', err);
      }
    };
    fetchCenters();
  }, []);

  const pwMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  const handleCenterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const centerData = trainingCenters.find(c => c.id === selectedId);

    setFormData({
      ...formData,
      trainingCenterId: selectedId,
      trainingCenter: centerData ? centerData.name : '',
      coachName: centerData ? centerData.coach : '',
      trainingCenterAddress: centerData ? centerData.address : ''
    });
  };

  const uploadToCloudinary = async (file: File | null) => {
    if (!file) return '';
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      return data.url || '';
    } catch (err) {
      console.error('Upload failed', err);
      return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.fullName || !formData.trainingCenter || !formData.mobile || !formData.dob) {
      setErrorData('Please fill all required fields including Date of Birth.');
      return;
    }
    if (!files.aadharFile || !files.photoFile || !files.signatureFile) {
      setErrorData('Please upload all required documents: Aadhar, Photo, and Signature.');
      return;
    }
    if (formData.password && !pwMatch) {
      setErrorData('Passwords do not match.');
      return;
    }
    if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
      setErrorData('Only Gmail addresses (@gmail.com) are allowed.');
      return;
    }
    if (formData.mobile.length !== 10) {
      setErrorData('Mobile number must be exactly 10 digits.');
      return;
    }
    if (formData.aadhar && formData.aadhar.length !== 12) {
      setErrorData('Aadhar number must be exactly 12 digits.');
      return;
    }
    if (!formData.agreeTerms) {
      setErrorData('You must agree to the Terms & Conditions before submitting.');
      return;
    }
    
    setErrorData('');
    setIsUploading(true);

    // Upload files
    const aadharUrl = await uploadToCloudinary(fileObjects.aadharFile);
    const photoUrl = await uploadToCloudinary(fileObjects.photoFile);
    const signatureUrl = await uploadToCloudinary(fileObjects.signatureFile);

    try {
      // Setup Backend Payload
      const payload = {
        name: formData.fullName,
        father_name: formData.fatherName || 'Not Provided',
        gender: formData.gender || 'Not Provided',
        dob: formData.dob || 'Not Provided',
        address: formData.localAddress || formData.permanentAddress || 'Not Provided',
        weight: parseFloat(formData.weight) || 0,
        
        email: formData.email,
        mobile: formData.mobile,
        blood_group: formData.bloodGroup || 'Not Provided',
        aadhar_no: formData.aadhar || 'Not Provided',
        height_cm: parseFloat(formData.height) || 0,
        father_occupation: formData.fatherOccupation || 'Not Provided',
        marital_status: formData.maritalStatus || 'Not Provided',
        qualification: formData.qualification || 'Not Provided',
        school_college: formData.schoolCollege || 'Not Provided',
        permanent_address: formData.permanentAddress || 'Not Provided',
        local_address: formData.localAddress || 'Not Provided',
        coach_name: formData.coachName || 'Not Provided',
        training_center: formData.trainingCenter,
        training_center_address: formData.trainingCenterAddress || 'Not Provided',
        
        aadhar_url: aadharUrl || files.aadharFile,
        photo_url: photoUrl || files.photoFile,
        signature_url: signatureUrl || files.signatureFile,
        status: 'Pending Verification'
      };

      // 1. Create Cashfree Order
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: formData.fullName, 
          mobile: formData.mobile, 
          email: formData.email 
        })
      });
      
      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.error || 'Payment initialization failed.');
      }

      // 2. Load Cashfree SDK
      const cashfree = await load({
        mode: "production" // Updated to Production to match your .env key
      });

      // 3. Initiate Checkout
      const checkoutOptions = {
        paymentSessionId: orderData.payment_session_id,
        redirectTarget: "_modal"
      };

      cashfree.checkout(checkoutOptions).then(async (result: any) => {
        if (result.error) {
            setErrorData(result.error.message || 'Payment failed or was cancelled.');
            setIsUploading(false);
            return;
        }

        // 4. Verify Payment Status
        try {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: orderData.order_id })
          });
          const verifyData = await verifyRes.json();

          if (!verifyData.success) {
            setErrorData("Payment verification failed or incomplete.");
            setIsUploading(false);
            return;
          }

          // 5. Finalize Form Submission
          const res = await fetch('/api/players', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          
          if (!res.ok) {
            throw new Error(data.error || 'Registration failed processing on server.');
          }

          // Map to proper view fields for PrintableView
          const newReg = {
            id: data.player.id || data.player._id,
            name: data.player.name,
            email: data.player.email,
            center: data.player.training_center,
            aadhar: data.player.aadhar_no,
            dob: data.player.dob,
            bloodGroup: data.player.blood_group,
            status: data.player.status,
            password: formData.password,
            fatherName: data.player.father_name,
            fatherOccupation: data.player.father_occupation,
            gender: data.player.gender,
            mobile: data.player.mobile,
            height: data.player.height_cm,
            weight: data.player.weight,
            maritalStatus: data.player.marital_status,
            qualification: data.player.qualification,
            schoolCollege: data.player.school_college,
            permanentAddress: data.player.permanent_address,
            localAddress: data.player.local_address,
            coachName: data.player.coach_name,
            trainingCenterAddress: data.player.training_center_address,
            aadharFile: data.player.aadhar_url,
            photoFile: data.player.photo_url,
            signatureFile: data.player.signature_url,
            date: new Date(data.player.date_registered || new Date()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ')
          };

          // Generate Notification to Local Storage for Portal Admin
          const newNotif = {
            id: Date.now().toString(),
            message: `New player ${formData.fullName} applied and paid for ${formData.trainingCenter}.`,
            time: 'Just now',
            type: 'Registration'
          };
          const storedNotifsStr = localStorage.getItem('portal_notifications');
          let savedNotifs = [];
          if (storedNotifsStr) {
            savedNotifs = JSON.parse(storedNotifsStr);
          } else {
            savedNotifs = [
              { id: '1', message: 'Verification pending for Priya Patel (Gorakhpur Elite).', time: '1 hour ago', type: 'Alert' },
              { id: '2', title: 'System Maintenance at 12:00 AM tonight.', time: '5 hours ago', type: 'System' }
            ];
          }
          localStorage.setItem('portal_notifications', JSON.stringify([newNotif, ...savedNotifs]));

          setSubmittedReg(newReg);
          setIsUploading(false);
          setIsSubmitted(true);
        } catch (err: any) {
          setErrorData(err.message || "Failed during final step.");
          setIsUploading(false);
        }
      });

    } catch (err: any) {
      setErrorData(err.message);
      setIsUploading(false);
    }
  };

  const inputClass = "w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all placeholder-gray-600";
  const labelClass = "block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2";

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, mobile: val });
  };

  const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 12);
    setFormData({ ...formData, aadhar: val });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'aadharFile' | 'photoFile' | 'signatureFile', maxSizeKB: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeKB * 1024) {
      setErrorData(`${field.replace('File', '')} file size exceeds ${maxSizeKB}KB.`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFiles(prev => ({ ...prev, [field]: reader.result as string }));
      setFileObjects((prev: any) => ({ ...prev, [field]: file }));
    };
    reader.readAsDataURL(file);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#050505] font-sans flex items-center justify-center p-4">
        <div className="bg-[#111] border border-red-500/30 rounded-3xl shadow-[0_0_50px_rgba(255,0,0,0.15)] p-10 text-center max-w-md w-full animate-in zoom-in-95 duration-500">
           <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
             <CheckCircle className="text-green-500 w-10 h-10" />
           </div>
           <h2 className="text-3xl font-black text-white tracking-widest uppercase mb-4">Registration Successful!</h2>
           <p className="text-gray-400 font-medium mb-8 leading-relaxed">
             Your application for <span className="text-white font-bold">{formData.fullName}</span> has been submitted to <span className="text-[#3b82f6] font-bold">{formData.trainingCenter}</span>. You will be notified once verified!
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <button onClick={() => setShowPrint(true)} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white px-8 py-3.5 rounded-xl text-[13px] font-bold uppercase tracking-widest transition-all shadow-[0_4px_15px_rgba(37,99,235,0.3)]">
               <Printer className="w-4 h-4" /> Print Form
             </button>
             <Link to="/" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white px-8 py-3.5 rounded-xl text-[13px] font-bold uppercase tracking-widest transition-all shadow-[0_4px_15px_rgba(255,0,0,0.3)]">
               <ArrowLeft className="w-4 h-4" /> Return to Website
             </Link>
           </div>
        </div>
        
        {showPrint && (
           <PrintableView reg={submittedReg} onClose={() => setShowPrint(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] font-sans selection:bg-red-500/30 selection:text-white pb-12">
      {/* Top Banner Alert */}
      <div className="bg-gradient-to-r from-[#111] via-[#1a0505] to-[#111] py-3 text-center border-b border-red-500/20 shadow-[0_4px_20px_rgba(255,0,0,0.1)]">
        <p className="text-red-500 text-xs md:text-sm font-bold tracking-widest uppercase">Payment Stuck? Call us at 9161115569</p>
      </div>

      <div className="max-w-6xl mx-auto mt-4 mb-12 px-4 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col xl:flex-row bg-[#0a0a0a] rounded-3xl shadow-[0_0_50px_rgba(255,0,0,0.2)] overflow-hidden border border-white/5">
          
          {/* Left Sidebar (Dark Red/Aggressive) */}
          <div className="w-full xl:w-[35%] bg-gradient-to-br from-[#111] to-[#050505] border-r border-white/5 text-white p-10 lg:p-14 flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-red-600/5 blur-[100px] pointer-events-none"></div>

            <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-900 rounded-2xl flex items-center justify-center mb-8 border border-red-500/50 shadow-[0_0_30px_rgba(255,0,0,0.3)] relative z-10">
              <Shield className="text-white w-12 h-12" />
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-black mb-8 leading-tight tracking-widest uppercase relative z-10">
              Player <span className="text-red-500">Registration</span><br />
              <span className="text-xl text-gray-400 mt-2 block">Rs.500 / Player</span>
            </h2>

            <div className="space-y-6 text-[13px] leading-relaxed text-gray-400 font-medium text-justify relative z-10">
              <p>Maharajganj District Taekwondo Association has been working for the last 10 years in Maharajganj district to train students studying in the school for self-protection and sports.</p>
              <p>It is the only district sports body recognized by Uttar Pradesh Taekwondo Association and accredited with Uttar Pradesh Olympic Association.</p>
              <p>In today's environment, Taekwondo game is proving to be a better option for self-protection. Illuminating the name of the district by participating at the national level.</p>
            </div>
          </div>

          {/* Right Form Area */}
          <div className="w-full xl:w-[65%] leading-relaxed flex flex-col bg-[#0f0f0f]">
            <div className="p-8 lg:p-12">
              <div className="text-center mb-10">
                <h3 className="text-2xl font-black text-white tracking-widest uppercase mb-2">Application Form</h3>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Provide accurate details for your ID card verification</h3>
              </div>

              {errorData && (
                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-bold text-center animate-pulse shadow-inner">
                  {errorData}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className={labelClass}>Email Address *</label>
                  <input type="email" placeholder="Enter your email address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={inputClass} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Training Center *</label>
                    <select value={formData.trainingCenterId} onChange={handleCenterChange} className={`${inputClass} appearance-none cursor-pointer`}>
                      <option value="">Select Training Center ...</option>
                      {trainingCenters.map((center) => (
                        <option key={center.id} value={center.id}>{center.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Coach Name (Auto-filled)</label>
                    <input type="text" placeholder="Coach Name" value={formData.coachName} readOnly className={`${inputClass} bg-[#1a1a1a] text-[#3b82f6] font-bold opacity-70 cursor-not-allowed border-transparent`} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Training Center Address (Auto)</label>
                    <input type="text" placeholder="Address" value={formData.trainingCenterAddress} readOnly className={`${inputClass} bg-[#1a1a1a] text-[#3b82f6] font-bold opacity-70 cursor-not-allowed border-transparent`} />
                  </div>
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input type="text" placeholder="Full Name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: toTitleCase(e.target.value)})} className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Father's Name</label>
                    <input type="text" placeholder="Father Name" value={formData.fatherName} onChange={(e) => setFormData({...formData, fatherName: toTitleCase(e.target.value)})} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Father's Occupation</label>
                    <input type="text" placeholder="Father Occupation" value={formData.fatherOccupation} onChange={(e) => setFormData({...formData, fatherOccupation: toTitleCase(e.target.value)})} className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Date of Birth</label>
                    <input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} className={`${inputClass} [&::-webkit-calendar-picker-indicator]:filter-[invert(1)] cursor-pointer`} />
                  </div>
                  <div className="bg-[#111] border border-white/10 rounded-xl px-4 py-3.5 flex items-center justify-between gap-2">
                    <span className="font-bold text-gray-500 text-[10px] tracking-widest uppercase block">Gender:</span>
                    <label className="flex items-center space-x-2 text-white font-bold text-sm cursor-pointer hover:text-red-400 transition-colors">
                      <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="accent-red-500 w-4 h-4 cursor-pointer" />
                      <span>Male</span>
                    </label>
                    <label className="flex items-center space-x-2 text-white font-bold text-sm cursor-pointer hover:text-red-400 transition-colors">
                      <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="accent-red-500 w-4 h-4 cursor-pointer" />
                      <span>Female</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Mobile No. *</label>
                    <input type="tel" placeholder="Mobile Number" value={formData.mobile} onChange={handleMobileChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Height (cm)</label>
                    <input type="number" placeholder="Height in cm" value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Weight (kg)</label>
                    <input type="number" placeholder="Weight in kg" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Blood Group</label>
                    <select value={formData.bloodGroup} onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})} className={`${inputClass} appearance-none cursor-pointer`}>
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option><option value="A-">A-</option>
                      <option value="B+">B+</option><option value="B-">B-</option>
                      <option value="O+">O+</option><option value="O-">O-</option>
                      <option value="AB+">AB+</option><option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex items-center">
                  <div>
                    <label className={labelClass}>Aadhar Card No.</label>
                    <input type="text" placeholder="12 Digit Aadhar" value={formData.aadhar} onChange={handleAadharChange} className={inputClass} />
                  </div>
                  <div className="bg-[#111] border border-white/10 rounded-xl px-4 py-3.5 flex items-center justify-between gap-2 md:mt-6">
                    <span className="font-bold text-gray-500 text-[10px] tracking-widest uppercase block">Marital:</span>
                    <label className="flex items-center space-x-2 text-white font-bold text-sm cursor-pointer hover:text-red-400 transition-colors">
                      <input type="radio" name="marital" value="Married" checked={formData.maritalStatus === 'Married'} onChange={(e) => setFormData({...formData, maritalStatus: e.target.value})} className="accent-red-500 w-4 h-4 cursor-pointer" />
                      <span>Married</span>
                    </label>
                    <label className="flex items-center space-x-2 text-white font-bold text-sm cursor-pointer hover:text-red-400 transition-colors">
                      <input type="radio" name="marital" value="Unmarried" checked={formData.maritalStatus === 'Unmarried'} onChange={(e) => setFormData({...formData, maritalStatus: e.target.value})} className="accent-red-500 w-4 h-4 cursor-pointer" />
                      <span>Unmarried</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Qualification</label>
                    <input type="text" placeholder="Enter qualification" value={formData.qualification} onChange={(e) => setFormData({...formData, qualification: toTitleCase(e.target.value)})} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>School / College</label>
                    <input type="text" placeholder="School/College Name" value={formData.schoolCollege} onChange={(e) => setFormData({...formData, schoolCollege: toTitleCase(e.target.value)})} className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Permanent Address</label>
                    <textarea placeholder="Permanent Address" rows={3} value={formData.permanentAddress} onChange={(e) => setFormData({...formData, permanentAddress: toTitleCase(e.target.value)})} className={`${inputClass} resize-none`}></textarea>
                  </div>
                  <div>
                    <label className={labelClass}>Local / Present Address</label>
                    <textarea placeholder="Local Address" rows={3} value={formData.localAddress} onChange={(e) => setFormData({...formData, localAddress: toTitleCase(e.target.value)})} className={`${inputClass} resize-none`}></textarea>
                  </div>
                </div>

                {/* File Uploads */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-4">Document Uploads</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#111] border border-white/10 rounded-xl p-5 text-center group hover:border-[#3b82f6]/50 transition-colors">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4 flex items-center justify-center gap-1">Player Aadhar (200KB) {files.aadharFile && <CheckCircle className="w-3 h-3 text-green-500" />}</p>
                      <label className="inline-block bg-white/5 w-full hover:bg-white/10 text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors border border-white/10 group-hover:bg-[#3b82f6]/10 group-hover:text-[#3b82f6]">
                        {files.aadharFile ? 'Uploaded' : 'Browse'}<input type="file" onChange={(e) => handleFileUpload(e, 'aadharFile', 200)} className="hidden" accept="image/*,.pdf" />
                      </label>
                    </div>
                    <div className="bg-[#111] border border-white/10 rounded-xl p-5 text-center group hover:border-[#3b82f6]/50 transition-colors">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4 flex items-center justify-center gap-1">Photo (100KB) {files.photoFile && <CheckCircle className="w-3 h-3 text-green-500" />}</p>
                      <label className="inline-block bg-white/5 w-full hover:bg-white/10 text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors border border-white/10 group-hover:bg-[#3b82f6]/10 group-hover:text-[#3b82f6]">
                        {files.photoFile ? 'Uploaded' : 'Browse'}<input type="file" onChange={(e) => handleFileUpload(e, 'photoFile', 100)} className="hidden" accept="image/*" />
                      </label>
                    </div>
                    <div className="bg-[#111] border border-white/10 rounded-xl p-5 text-center group hover:border-[#3b82f6]/50 transition-colors">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4 flex items-center justify-center gap-1">Signature (50KB) {files.signatureFile && <CheckCircle className="w-3 h-3 text-green-500" />}</p>
                      <label className="inline-block bg-white/5 w-full hover:bg-white/10 text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors border border-white/10 group-hover:bg-[#3b82f6]/10 group-hover:text-[#3b82f6]">
                        {files.signatureFile ? 'Uploaded' : 'Browse'}<input type="file" onChange={(e) => handleFileUpload(e, 'signatureFile', 50)} className="hidden" accept="image/*" />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Password Setup */}
                <div className="space-y-4 pt-6 border-t border-white/5 mt-4">
                  <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-4">Account Security</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <input type="password" placeholder="Create Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className={inputClass} />
                    </div>
                    <div>
                      <input type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className={`${inputClass} ${pwMatch ? 'border-green-500/50 focus:border-green-500' : formData.confirmPassword ? 'border-red-500/50 focus:border-red-500' : ''}`} />
                    </div>
                  </div>
                  {pwMatch ? (
                    <div className="text-green-500 text-[10px] font-black uppercase tracking-widest">✓ Passwords matched securely</div>
                  ) : formData.confirmPassword ? (
                    <div className="text-red-500 text-[10px] font-black uppercase tracking-widest">✕ Passwords do not match</div>
                  ) : null}
                </div>

                <div className="pt-6">
                  <label className="flex items-start space-x-3 text-sm text-gray-400 cursor-pointer group">
                    <input type="checkbox" checked={formData.agreeTerms} onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})} className="mt-1 w-4 h-4 accent-red-500 cursor-pointer" />
                    <span className="group-hover:text-gray-300 transition-colors font-medium">By clicking Register, you agree to our Rules & Regulations, Declaration and Privacy Policy.</span>
                  </label>
                </div>

                <div className="pt-8">
                  <button type="submit" disabled={isUploading} className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 disabled:opacity-50 text-white px-8 py-4 rounded-xl text-sm font-black uppercase tracking-[0.2em] transition-all shadow-[0_4px_20px_rgba(255,0,0,0.4)] hover:shadow-[0_4px_30px_rgba(255,0,0,0.6)] focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#0f0f0f]">
                    {isUploading ? 'Uploading Data...' : 'Submit Registration'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
           <Link to="/" className="inline-flex items-center justify-center gap-2 text-gray-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors">
             <ArrowLeft className="w-4 h-4" /> Return to Website
           </Link>
        </div>
      </div>
    </div>
  );
};
