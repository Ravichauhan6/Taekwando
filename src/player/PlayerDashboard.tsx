import React, { useEffect, useState } from 'react';
import { 
  Shield, LogOut, CheckCircle, Clock, Printer, 
  Home, Globe, Download, Trophy, Medal, Award, 
  Newspaper, Users, Search, Bell, Menu, X, ChevronDown, ChevronRight, User as UserIcon, Calendar, MapPin
} from 'lucide-react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { PrintableView } from '../admin/PrintableView';

export const PlayerDashboard = () => {
  const [player, setPlayer] = useState<any>(() => {
    const data = localStorage.getItem('current_player');
    return data ? JSON.parse(data) : null;
  });
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    'Download': false,
    'Championship Info': false,
    'Belt Test Section': false,
    'Certificate Section': false,
    'News & Events': false,
    'Coach & Center Info': false,
  });
  const [printReg, setPrintReg] = useState<any>(null);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [coachDetails, setCoachDetails] = useState<any>(null);

  const fetchPlayerData = async () => {
    if (!player?._id && !player?.id) return;
    try {
      const res = await fetch(`/api/players/${player._id || player.id}`);
      if (res.ok) {
        const freshData = await res.json();
        setPlayer(freshData);
        localStorage.setItem('current_player', JSON.stringify(freshData));
      }
    } catch (e) {
      console.error("Failed to fetch fresh player data", e);
    }
  };

  const fetchCoachDetails = async (coachName: string) => {
    if (!coachName || coachName === 'Not Assigned') return;
    try {
      const res = await fetch('/api/coaches');
      if (res.ok) {
        const coaches = await res.json();
        const match = coaches.find((c: any) => c.name === coachName);
        if (match) setCoachDetails(match);
      }
    } catch (e) {
      console.error("Failed to fetch coach details", e);
    }
  };

  const fetchNotifications = async () => {
    if (!player) return;
    setLoadingNotifs(true);
    try {
      const [notifsRes, coachMsgsRes] = await Promise.all([
        fetch('/api/notifications'),
        fetch(`/api/coach-messages/received/${player._id || player.id}`)
      ]);
      const notifsData = await notifsRes.json();
      const coachMsgsData = await coachMsgsRes.json();
      
      const filteredNotifs = notifsData.filter((n: any) => 
        n.audience === 'All' || 
        n.audience === player.id || 
        n.audience === player.aadhar
      ).map((n: any) => ({ ...n, type: 'system' }));
      
      const formattedCoachMsgs = Array.isArray(coachMsgsData) ? coachMsgsData.map((m: any) => ({
        ...m,
        type: 'coach'
      })) : [];
      
      const combined = [...filteredNotifs, ...formattedCoachMsgs];
      combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setNotifications(combined as any);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingNotifs(false);
    }
  };

  // ✅ Fetch latest player data on mount
  useEffect(() => {
    fetchPlayerData();
  }, []);

  // ✅ Fetch coach details when player data is loaded
  useEffect(() => {
    const name = player?.coach_name || player?.coachName;
    if (name) {
      fetchCoachDetails(name);
    }
  }, [player]);

  // ✅ useEffect MUST be before any conditional return (Rules of Hooks)
  useEffect(() => {
    if (activeTab === 'News For Me') {
      fetchNotifications();
    }
  }, [activeTab]);

  // ✅ Guard check AFTER all hooks
  if (!player) {
    return <Navigate to="/player/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('current_player');
    navigate('/');
  };

  const isVerified = player.status === 'Verified';

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const menuItems: { name: string; icon: any; path?: string; submenus?: string[]; href?: string }[] = [
    { name: 'Dashboard', icon: <Home className="w-5 h-5" />, path: 'Dashboard' },
    { 
      name: 'Download', icon: <Download className="w-5 h-5" />, 
      submenus: ['Your Id Card', 'Your Registration Form']
    },
    { 
      name: 'Championship Info', icon: <Trophy className="w-5 h-5" />, 
      submenus: ['Played Championship']
    },
    { 
      name: 'Belt Test Section', icon: <Medal className="w-5 h-5" />, 
      submenus: ['My Belt Rank']
    },
    { 
      name: 'Certificate Section', icon: <Award className="w-5 h-5" />, 
      submenus: ['My Certificate']
    },
    { 
      name: 'News & Events', icon: <Newspaper className="w-5 h-5" />, 
      submenus: ['Upcoming Events', 'Past Events', 'News For Me']
    },
    { 
      name: 'Coach & Center Info', icon: <Users className="w-5 h-5" />, 
      submenus: ['My Coach Info']
    },
  ];

  const StatCard = ({ title, value, color, icon, onClick }: any) => (
    <div onClick={onClick} className={`relative overflow-hidden group bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/5 rounded-2xl p-6 shadow-xl transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_${color}] ${onClick ? 'cursor-pointer' : ''}`}>
      <div className={`absolute -right-6 -top-6 w-24 h-24 bg-${color} rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity`}></div>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">{title}</p>
          <h3 className="text-3xl font-black text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl bg-${color}/10 text-${color} border border-${color}/20`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'Dashboard':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111] p-6 rounded-2xl border border-white/5">
              <div>
                <h1 className="text-2xl font-black uppercase text-white tracking-widest">
                  Logged in as <span className="text-red-500">{player.name}</span>
                </h1>
                {!isVerified ? (
                   <div className="mt-2 text-yellow-500 text-xs font-bold inline-flex items-center gap-2">
                     <Clock className="w-4 h-4" /> Registration pending verification. ID card features restricted.
                   </div>
                ) : (
                  <div className="mt-2 text-green-500 text-xs font-bold inline-flex items-center gap-2">
                     <CheckCircle className="w-4 h-4" /> Account Verified.
                   </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Awards" value="70+" color="blue-500" icon={<Medal className="w-6 h-6 text-blue-500" />} />
              <StatCard title="Total Championship" value="50+" color="red-500" icon={<Trophy className="w-6 h-6 text-red-500" />} onClick={() => setActiveTab('Played Championship')} />
              <StatCard title="News & Events" value="189+" color="green-500" icon={<Newspaper className="w-6 h-6 text-green-500" />} onClick={() => setActiveTab('Upcoming Events')} />
              <StatCard title="Certificate Issued" value="1540+" color="yellow-500" icon={<Award className="w-6 h-6 text-yellow-500" />} onClick={() => setActiveTab('My Certificate')} />
            </div>

            <div className="w-full bg-[#111] border border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden group">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.05)_0%,transparent_70%)] opacity-50"></div>
               <Shield className="w-40 h-40 text-red-600/20 mb-6 drop-shadow-[0_0_30px_rgba(255,0,0,0.5)] group-hover:scale-110 transition-transform duration-1000" />
               <h2 className="text-3xl font-black uppercase tracking-widest text-center text-white/90 drop-shadow-lg mb-2">Maharajganj District</h2>
               <h3 className="text-xl font-bold uppercase tracking-widest text-center text-red-500 drop-shadow-lg">Taekwondo Association</h3>
            </div>
            
            <div className="w-full bg-red-600/10 border-y border-red-500/20 py-3 overflow-hidden shadow-[0_0_20px_rgba(255,0,0,0.1)]">
              <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] inline-block text-red-400 font-bold tracking-widest uppercase text-sm">
                 Dear Players, our portal is currently undergoing improvements. You may face occasional maintenance blocks. Stay updated with the latest MDTA news here!
              </div>
            </div>
          </div>
        );
      
      case 'Your Id Card':
        return (
          <div className="animate-in fade-in zoom-in-95 duration-500 h-full flex flex-col">
            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Your ID Card</h2>
            {!isVerified ? (
               <div className="flex-1 flex items-center justify-center p-12">
                 <div className="text-center bg-[#111] border border-yellow-500/20 p-8 rounded-2xl">
                   <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                   <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">Verification Pending</h3>
                   <p className="text-gray-400 text-sm">Your ID card will be available here once an admin verifies your registration documents.</p>
                 </div>
               </div>
            ) : (
              <div className="flex flex-col flex-1 items-center justify-center w-full">
                {/* ID Card Wrapper for centering and aesthetics */}
                <div className="relative w-full max-w-[380px] mx-auto print-id-card shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[24px]">
                  <div className="w-full bg-white rounded-[24px] border border-gray-400 flex flex-col overflow-hidden font-sans">
                    
                    {/* Header */}
                    <div className="flex items-center px-4 pt-6 pb-2">
                      <img src="/logo.png" alt="MDTA Logo" className="w-[72px] h-[72px] object-contain ml-2" />
                      <div className="ml-4 flex flex-col justify-center">
                        <h2 className="text-[22px] font-[900] text-black leading-none tracking-tight">Maharajganj District</h2>
                        <h3 className="text-[13px] font-bold text-black leading-tight mt-1">Taekwondo Association (Regd.)</h3>
                      </div>
                    </div>

                    {/* Photo Area */}
                    <div className="flex justify-center mt-3">
                       <div className="w-[145px] h-[145px] rounded-full overflow-hidden flex items-center justify-center bg-gray-100 z-10" style={{ boxShadow: '0 0 0 1px white, 0 0 0 2px #e5e7eb' }}>
                           {(player.photo_url || player.photoFile) ? (
                              <img src={player.photo_url || player.photoFile} alt="Player" className="w-full h-full object-cover" />
                           ) : (
                              <span className="text-gray-400 text-xs font-bold uppercase">No Photo</span>
                           )}
                       </div>
                    </div>

                    {/* Name */}
                    <div className="text-center mt-6 mb-5 px-4">
                      <h1 className="text-[26px] font-[900] text-[#ff0000] uppercase tracking-wide">
                        {player.name}
                      </h1>
                    </div>

                    {/* Info */}
                    <div className="px-7 flex flex-col gap-[7px] pb-8 text-[16px] font-black text-[#000080] tracking-wide whitespace-nowrap">
                       <div className="leading-tight">
                         ID No : <span className="uppercase">{player.id || 'N/A'}</span>
                       </div>
                       <div className="leading-tight">
                         D.O.B. : <span>{player.dob || '-'}</span>
                       </div>
                       <div className="leading-tight">
                         Blood G.: <span>{player.bloodGroup || player.blood_group || '-'}</span>
                       </div>
                       <div className="leading-tight text-wrap inline-block whitespace-normal break-words">
                         F Name :: <span className="uppercase">{player.fatherName || player.father_name || '-'}</span>
                       </div>
                       <div className="leading-tight">
                         Mobile No: <span>{player.mobile || player.phone || '-'}</span>
                       </div>
                       <div className="leading-tight whitespace-normal break-words pr-2 mt-1">
                         T. C.Name : <span className="uppercase">{player.center || player.training_center || '-'}</span>
                       </div>
                    </div>

                    {/* Authorized Signature */}
                    <div className="px-6 pt-3 pb-2 flex flex-col items-end border-t border-gray-200 mt-2">
                       <img 
                         src="/signature.png" 
                         alt="Secretary Signature" 
                         className="h-[42px] w-auto object-contain mb-0.5"
                         style={{ mixBlendMode: 'multiply' }}
                       />
                       <div className="w-32 border-t border-gray-400 mb-0.5"></div>
                       <span className="text-[10px] font-black text-gray-700 uppercase tracking-wide text-center">(Secretary MDTA Maharajganj)</span>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto bg-gradient-to-b from-[#3a4161] to-[#252a40] px-6 py-4 flex justify-between items-end border-t border-gray-600">
                       <div className="flex flex-col">
                         <span className="text-gray-200 text-[13px] font-medium leading-tight">For More Information</span>
                         <span className="text-white text-[14px] font-medium leading-tight mt-1">Visit - taekwando-cyan.vercel.app</span>
                       </div>
                       <div className="flex flex-col items-end">
                         <span className="text-[#f1c453] text-[13px] font-medium leading-tight">Emergency Number</span>
                         <span className="text-white text-[14px] font-medium leading-tight mt-1">+919161115569</span>
                       </div>
                    </div>

                  </div>
                </div>
                <div className="mt-8 flex flex-col items-center gap-3 w-full">
                  <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] print:hidden w-full max-w-[400px] justify-center"
                  >
                    <Printer className="w-4 h-4" /> Download / Print ID Card
                  </button>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest print:hidden">This is a valid virtual ID for all MDTA events.</p>
                </div>
              </div>
            )}
            
            {/* Print-only CSS injection out-of-flow */}
            <style type="text/css" media="print">
              {`
                @page { margin: 0; }
                body {
                  background: white !important;
                }
                body * {
                  visibility: hidden;
                }
                .print-id-card, .print-id-card * {
                  visibility: visible !important;
                }
                .print-id-card {
                  position: absolute;
                  left: 50% !important;
                  top: 20px !important;
                  transform: translateX(-50%) !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  width: 380px !important;
                  box-shadow: none !important;
                }
                * {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
              `}
            </style>
          </div>
        );

      case 'Your Registration Form':
        return (
          <div className="animate-in fade-in zoom-in-95 duration-500 h-full flex flex-col">
            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Your Registration Form</h2>
            {!isVerified ? (
               <div className="flex-1 flex items-center justify-center p-12">
                 <div className="text-center bg-[#111] border border-yellow-500/20 p-8 rounded-2xl">
                   <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                   <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">Verification Pending</h3>
                   <p className="text-gray-400 text-sm">Your registration form will be available for download once an admin verifies your details.</p>
                 </div>
               </div>
            ) : (
               <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#111] border border-blue-500/20 rounded-2xl py-16">
                 <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                   <Printer className="w-10 h-10 text-blue-500" />
                 </div>
                 <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-widest">Download Official Form</h3>
                 <p className="text-gray-400 max-w-md mx-auto mb-8 text-sm">Your registration has been approved. You can now view and print a copy of your official MDTA registration document.</p>
                 <button 
                  onClick={() => setPrintReg({
                     id:                   player._id || player.id,
                     name:                 player.name,
                     email:                player.email,
                     center:               player.training_center || player.center,
                     fatherName:           player.father_name || player.fatherName,
                     fatherOccupation:     player.father_occupation || player.fatherOccupation,
                     dob:                  player.dob,
                     gender:               player.gender,
                     mobile:               player.mobile,
                     height:               player.height_cm || player.height,
                     weight:               player.weight,
                     bloodGroup:           player.blood_group || player.bloodGroup,
                     aadhar:               player.aadhar_no || player.aadhar,
                     maritalStatus:        player.marital_status || player.maritalStatus,
                     qualification:        player.qualification,
                     schoolCollege:        player.school_college || player.schoolCollege,
                     permanentAddress:     player.permanent_address || player.permanentAddress,
                     localAddress:         player.local_address || player.localAddress,
                     coachName:            player.coach_name || player.coachName,
                     trainingCenterAddress:player.training_center_address || player.trainingCenterAddress,
                     photoFile:            player.photo_url || player.photoFile,
                     signatureFile:        player.signature_url || player.signatureFile,
                     aadharFile:           player.aadhar_url || player.aadharFile,
                     guardianSignatureFile: player.guardian_signature_url || player.guardianSignatureFile,
                     status:               player.status,
                     date:                 player.date_registered ? new Date(player.date_registered).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
                   })}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-[0.2em] transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] flex items-center gap-3 max-w-xs mx-auto justify-center"
                 >
                   <Printer className="w-5 h-5" /> View & Print Form
                 </button>
               </div>
            )}
          </div>
        );

      case 'Upcoming Events':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-red-500/10 p-3 rounded-2xl border border-red-500/20">
                <Calendar className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-widest uppercase">Upcoming Events</h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Register for the latest tournaments</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-[#111] border border-white/5 rounded-[24px] overflow-hidden group hover:border-red-500/30 transition-all shadow-xl">
                <div className="h-40 bg-gradient-to-br from-red-900/40 to-black relative overflow-hidden flex items-center justify-center border-b border-white/5">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                  <Trophy className="w-20 h-20 text-red-500/20 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)] group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">Registration Open</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-white uppercase tracking-wide mb-2">State Taekwondo Championship 2026</h3>
                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-gray-400 flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-500"/> Maharajganj Indoor Stadium</p>
                    <p className="text-sm text-gray-400 flex items-center gap-2"><Clock className="w-4 h-4 text-gray-500"/> Aug 15 - Aug 17, 2026</p>
                  </div>
                  <button className="w-full py-3 bg-white/5 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors border border-white/10 hover:border-red-500">View Details</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Past Events':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gray-800/50 p-3 rounded-2xl border border-white/5">
                <CheckCircle className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-widest uppercase">Past Events</h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Results and gallery of previous tournaments</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-[#111] border border-white/5 rounded-[24px] overflow-hidden group transition-all opacity-80 hover:opacity-100">
                <div className="h-32 bg-gradient-to-br from-gray-800/40 to-black relative overflow-hidden flex items-center justify-center border-b border-white/5">
                  <Trophy className="w-16 h-16 text-gray-500/20 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-gray-700 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">Completed</div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-black text-white uppercase tracking-wide mb-2 text-gray-300">Winter District Cup 2025</h3>
                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-gray-500 flex items-center gap-2"><MapPin className="w-4 h-4"/> City Sports Complex</p>
                    <p className="text-sm text-gray-500 flex items-center gap-2"><Clock className="w-4 h-4"/> Dec 10 - Dec 12, 2025</p>
                  </div>
                  <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors border border-white/5">View Results</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'News For Me':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-red-500/10 p-3 rounded-2xl border border-red-500/20">
                <Bell className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-widest uppercase">My Notifications</h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Official updates for you</p>
              </div>
            </div>

            {loadingNotifs ? (
              <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-red-500"></div></div>
            ) : (
              <div className="grid gap-4">
                {notifications.map((n: any) => (
                  <div key={n._id} className="bg-[#111] border border-white/5 rounded-[20px] p-6 hover:border-red-500/30 transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 blur-[40px] pointer-events-none"></div>
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-red-500 transition-colors uppercase">{n.title}</h3>
                        <p className="text-gray-400 mt-2 text-sm leading-relaxed font-medium">{n.message}</p>
                        <div className="mt-4 flex items-center gap-3">
                           {n.type === 'coach' ? (
                             <>
                               <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-md">From Coach: {n.coach_name}</span>
                               <span className="text-[10px] font-black text-blue-500/80 uppercase tracking-widest">{new Date(n.date).toLocaleDateString()}</span>
                             </>
                           ) : (
                             <>
                               <span className="text-[10px] font-black text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">MDTA Official</span>
                               <span className="text-[10px] font-black text-red-500/80 uppercase tracking-widest">{n.date ? new Date(n.date).toLocaleDateString() : 'New Update'}</span>
                             </>
                           )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-red-500 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="text-center py-20 bg-[#111] border border-white/5 border-dashed rounded-[32px]">
                    <Bell className="w-12 h-12 text-gray-800 mx-auto mb-4 opacity-20" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest">No individual notifications yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'My Coach Info':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-widest uppercase">My Coach & Center Info</h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Your registered training details</p>
              </div>
            </div>

            {/* Coach Card */}
            <div className="bg-[#111] border border-white/5 rounded-[24px] overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-900/30 to-[#111] px-8 py-6 border-b border-white/5 flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 overflow-hidden">
                  {coachDetails?.image_url ? (
                    <img src={coachDetails.image_url} alt="Coach" className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-8 h-8 text-blue-400" />
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Your Trainer / Coach</p>
                  <h3 className="text-2xl font-black text-white uppercase tracking-wide">
                    {player.coach_name || player.coachName || 'Not Assigned'}
                  </h3>
                  {coachDetails?.qualifications && (
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-0.5">{coachDetails.qualifications}</p>
                  )}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/5">
                {/* Training Center */}
                <div className="p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Training Center</p>
                    <p className="text-white font-bold text-base uppercase">
                      {(player.training_center || player.center || 'Not Provided').replace(/TRAINNING/g, 'TRAINING')}
                    </p>
                  </div>
                </div>

                {/* Center Address */}
                <div className="p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Center Address</p>
                    <p className="text-white font-bold text-base uppercase">
                      {(player.training_center_address || player.trainingCenterAddress || 'Not Provided').replace(/TRAINNING/g, 'TRAINING')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Registration Info */}
              <div className="border-t border-white/5 px-8 py-5 bg-white/[0.02] flex flex-wrap gap-6">
                <div>
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Registered On</p>
                  <p className="text-sm font-bold text-gray-300">
                    {player.date_registered
                      ? new Date(player.date_registered).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Account Status</p>
                  <span className={`text-sm font-black uppercase px-3 py-1 rounded-full ${
                    isVerified ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  }`}>
                    {player.status || 'Pending'}
                  </span>
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Belt / Rank</p>
                  <p className="text-sm font-bold text-gray-300">{player.belt || player.current_belt || 'Not Assigned'}</p>
                </div>
              </div>
            </div>

            {/* Contact Notice */}
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 flex items-start gap-4">
              <Bell className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-white mb-1">Need to contact your coach?</p>
                <p className="text-xs text-gray-400">Please visit your training center directly or contact MDTA at <span className="text-blue-400 font-bold">+91 9161115569</span></p>
              </div>
            </div>
          </div>
        );

      default:
        // Placeholder for unimplemented tabs like "Played Championship", "My Certificate", etc.
        return (
          <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center justify-center h-[60vh] text-center border border-white/5 bg-[#111] rounded-2xl p-8">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <LogOut className="w-10 h-10 text-gray-400 rotate-180" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-3">{activeTab}</h2>
            <p className="text-gray-400 text-sm max-w-md">This section is currently under development. Check back soon for exciting new features and updates.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] font-sans text-white overflow-hidden selection:bg-red-500/30">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static top-0 left-0 h-full w-[280px] bg-[#0a0a0a] border-r border-white/5 z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.5)]`}>
        {/* Sidebar Header */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-white/5 bg-[#0d0d0d]">
          <button onClick={handleLogout} className="relative shrink-0 block cursor-pointer group bg-transparent border-0 p-0 outline-none">
             <div className="absolute inset-0 bg-red-600 blur-xl opacity-20 rounded-full group-hover:opacity-40 transition-opacity"></div>
             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] relative z-10 overflow-hidden group-hover:scale-105 transition-transform">
               <img src="/logo.png" alt="MDTA Logo" className="w-full h-full object-contain" />
             </div>
          </button>
          <div>
          <div className="flex flex-col">
             <h1 className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest leading-snug drop-shadow-md break-words max-w-[160px]">
               MAHARAJGANJ DISTRICT TAEKWONDO ASSOCIATION (Regd)
             </h1>
          </div>
          </div>
          <button 
            className="ml-auto lg:hidden text-gray-400 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-6 px-4 space-y-1">
          {menuItems.map((item, idx) => (
            <div key={idx} className="mb-2">
              {item.href ? (
                 <a 
                   href={item.href}
                   target="_blank"
                   rel="noopener noreferrer"
                   className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all text-gray-400 hover:bg-white/5 hover:text-white`}
                 >
                   {item.icon} {item.name}
                 </a>
              ) : item.submenus ? (
                <>
                  <button 
                    onClick={() => toggleMenu(item.name)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${openMenus[item.name] || item.submenus.includes(activeTab) ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon} {item.name}
                    </div>
                    {openMenus[item.name] || item.submenus.includes(activeTab) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${(openMenus[item.name] || item.submenus.includes(activeTab)) ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                    {item.submenus.map((sub, jdx) => (
                      <button
                        key={jdx}
                        onClick={() => { setActiveTab(sub); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
                        className={`w-full text-left pl-12 pr-4 py-2.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all ${
                          activeTab === sub 
                            ? 'text-red-500 bg-red-500/10' 
                            : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full inline-block mr-3 bg-current opacity-50"></span>
                        {sub}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <button 
                  onClick={() => { setActiveTab(item.path || item.name); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-widest transition-all ${
                    activeTab === (item.path || item.name) 
                      ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-[0_0_20px_rgba(255,0,0,0.3)]' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.icon} {item.name}
                </button>
              )}
            </div>
          ))}
        </div>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 space-y-3">
            <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-center gap-2 bg-[#111] hover:bg-white/5 text-gray-400 hover:text-white border border-white/5 hover:border-white/10 px-4 py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4" /> Return to Website
            </button>
           <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-[#111] hover:bg-red-500/10 text-red-500 hover:text-red-400 border border-white/5 hover:border-red-500/30 px-4 py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] transition-all"
           >
             <LogOut className="w-4 h-4" /> Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#050505]">
        
        {/* Top Navbar */}
        <header className="h-20 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 sm:px-8 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => setActiveTab('Upcoming Events')} className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors">News & Events</button>
              <button onClick={() => setActiveTab('My Certificate')} className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors">Certificates</button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
             <div className="hidden sm:flex relative items-center">
               <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-[#111] border border-white/5 rounded-full pl-4 pr-10 py-2 text-xs font-medium text-white placeholder-gray-600 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 w-48 transition-all"
               />
               <Search className="w-4 h-4 text-gray-500 absolute right-3" />
             </div>
             
             <button 
               onClick={() => setActiveTab('News For Me')}
               className={`text-gray-400 hover:text-white relative transition-colors ${activeTab === 'News For Me' ? 'text-red-500' : ''}`}
             >
               <Bell className="w-5 h-5" />
               <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0a0a0a]"></span>
             </button>
             
             <div className="flex items-center gap-3 pl-4 sm:pl-6 border-l border-white/10 group cursor-pointer hover:opacity-80 transition-opacity">
               <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center overflow-hidden">
                  {(player.photo_url || player.photoFile) ? (
                    <img src={player.photo_url || player.photoFile} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-4 h-4 text-gray-400" />
                  )}
                </div>
               <div className="hidden md:block text-right">
                 <p className="text-xs font-bold text-white uppercase tracking-wider">{player.name.split(' ')[0]}</p>
                 <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Player</p>
               </div>
               <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />
             </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8">
           <div className="max-w-7xl mx-auto h-full">
             {renderContent()}
           </div>
        </main>
        
        {/* Footer */}
        <footer className="shrink-0 bg-[#080808] border-t border-white/5 py-3 px-6 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-widest relative z-20">
          <p>Copyright © {new Date().getFullYear()} <span className="text-[#3b82f6]">MDTAMRJ</span>. All rights reserved.</p>
          <p className="mt-1 sm:mt-0">Version 3.1.0-rc</p>
        </footer>
      </div>

      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.1);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255,255,255,0.2);
          }
          
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>
      
      {printReg && <PrintableView reg={printReg} onClose={() => setPrintReg(null)} />}
    </div>
  );
};
