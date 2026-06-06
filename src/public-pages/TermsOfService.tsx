import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Cookie, FileText, Link2, Monitor, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    { id: 'introduction', label: 'Introduction' },
    { id: 'cookies', label: 'Cookies Policy' },
    { id: 'license', label: 'License' },
    { id: 'hyperlinking', label: 'Hyperlinking' },
    { id: 'content-liability', label: 'Liability & iFrames' },
    { id: 'disclaimer', label: 'Disclaimer' }
  ];

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // account for fixed navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen pt-12 pb-24 text-white font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16 border-b border-white/[0.06] pb-10">
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-red-500/50 overflow-hidden shadow-[0_0_30px_rgba(255,0,0,0.3)] bg-white p-1">
              <img src="/logo.png" alt="MDTA" className="w-full h-full object-cover rounded-full" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-red-600 border-4 border-[#050505]" />
          </div>
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(255,0,0,1)]" />
              <span className="text-red-400/80 text-xs font-black tracking-[0.25em] uppercase">Maharajganj District Taekwondo Association</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase leading-tight">
              TERMS OF <span className="text-red-500">SERVICE</span>
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm font-medium mt-1">Effective Date: May 17, 2026</p>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Left Sticky Sidebar Navigation */}
          <div className="w-full lg:w-1/4 lg:sticky lg:top-28 space-y-2 bg-white/[0.02] border border-white/[0.05] p-6 rounded-3xl">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-red-500" /> Sections
            </h3>
            <div className="space-y-1.5">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => handleScrollTo(sec.id)}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.03] active:bg-white/[0.05] transition-all duration-200 border border-transparent hover:border-white/[0.05] flex items-center justify-between group"
                >
                  <span>{sec.label}</span>
                  <span className="opacity-0 group-hover:opacity-100 text-red-500 transition-opacity duration-200">→</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Main Text Content */}
          <div className="w-full lg:w-3/4 space-y-12 leading-relaxed text-gray-300 text-sm sm:text-base">
            
            {/* 1. Introduction */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              id="introduction"
              className="bg-[#0d0d0d] border border-white/[0.05] rounded-3xl p-8 hover:border-red-500/20 hover:bg-red-500/[0.01] transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-red-500/20 group-hover:via-red-500/50 to-transparent transition-all duration-500" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-white font-black text-lg tracking-wider uppercase">Welcome to MDTA</h2>
              </div>
              
              <div className="space-y-4">
                <p>
                  Welcome to{' '}
                  <a href="https://taekwando-cyan.vercel.app/" className="text-red-400 hover:underline">
                    https://taekwando-cyan.vercel.app/
                  </a>
                </p>
                <p>
                  These terms and conditions outline the rules and regulations for the use of Maharajganj District Taekwondo Association’s Website, located at{' '}
                  <a href="https://taekwando-cyan.vercel.app/" className="text-red-400 hover:underline">
                    https://taekwando-cyan.vercel.app/
                  </a>
                </p>
                <p className="font-semibold text-white">
                  By accessing this website we assume you accept these terms and conditions. Do not continue to use mdta.com if you do not agree to take all of the terms and conditions stated on this page.
                </p>
                <p className="text-gray-400 text-xs sm:text-sm pt-2 leading-relaxed border-t border-white/[0.04]">
                  The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: “Client”, “You” and “Your” refers to you, the person log on this website and compliant to the Company’s terms and conditions. “The Company”, “Ourselves”, “We”, “Our” and “Us”, refers to our Company. “Party”, “Parties”, or “Us”, refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services, in accordance with and subject to, prevailing law of Netherlands.
                </p>
              </div>
            </motion.section>

            {/* 2. Cookies */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              id="cookies"
              className="bg-[#0d0d0d] border border-white/[0.05] rounded-3xl p-8 hover:border-red-500/20 hover:bg-red-500/[0.01] transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-red-500/20 group-hover:via-red-500/50 to-transparent transition-all duration-500" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-white font-black text-lg tracking-wider uppercase">Cookies</h2>
              </div>
              
              <div className="space-y-4">
                <p>
                  We employ the use of cookies. By accessing mdta.com, you agreed to use cookies in agreement with the Maharajganj District Taekwondo Association’s Privacy Policy.
                </p>
                <p>
                  Most interactive websites use cookies to let us retrieve the user’s details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.
                </p>
              </div>
            </motion.section>

            {/* 3. License */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              id="license"
              className="bg-[#0d0d0d] border border-white/[0.05] rounded-3xl p-8 hover:border-red-500/20 hover:bg-red-500/[0.01] transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-red-500/20 group-hover:via-red-500/50 to-transparent transition-all duration-500" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-white font-black text-lg tracking-wider uppercase">License & IP Rights</h2>
              </div>
              
              <div className="space-y-6">
                <p>
                  Unless otherwise stated, Maharajganj District Taekwondo Association and/or its licensors own the intellectual property rights for all material on mdta.com. All intellectual property rights are reserved. You may access this from mdta.com for your own personal use subjected to restrictions set in these terms and conditions.
                </p>
                
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">You must not:</h4>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2" />
                      <span>Republish material from mdta.com</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2" />
                      <span>Sell, rent or sub-license material from https://taekwando-cyan.vercel.app/</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2" />
                      <span>Reproduce, duplicate or copy material from https://taekwando-cyan.vercel.app/</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2" />
                      <span>Redistribute content from mdta.com</span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-white/[0.04] pt-6 space-y-3">
                  <h4 className="text-red-400 font-bold text-sm tracking-wider uppercase">User Comments</h4>
                  <p className="text-sm">
                    Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. Maharajganj District Taekwondo Association does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of Maharajganj District Taekwondo Association, its agents and/or affiliates.
                  </p>
                  <p className="text-sm">
                    Maharajganj District Taekwondo Association reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive or causes breach of these Terms and Conditions.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* 4. Hyperlinking */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              id="hyperlinking"
              className="bg-[#0d0d0d] border border-white/[0.05] rounded-3xl p-8 hover:border-red-500/20 hover:bg-red-500/[0.01] transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-red-500/20 group-hover:via-red-500/50 to-transparent transition-all duration-500" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-white font-black text-lg tracking-wider uppercase">Hyperlinking to our Content</h2>
              </div>
              
              <div className="space-y-6">
                <p>
                  The following organizations may link to our Website without prior written approval:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-400 pl-4">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span> Government agencies
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span> Search engines
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span> News organizations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span> Online directory distributors
                  </li>
                </ul>

                <p>
                  We may consider and approve other link requests from commonly-known consumer/business information sources, dot.com community sites, charity groups, educational institutions, and portals.
                </p>
                <p>
                  If you are interested in linking to our website, you must inform us by sending an e-mail to Maharajganj District Taekwondo Association. Please wait 2-3 weeks for a response.
                </p>
              </div>
            </motion.section>

            {/* 5. iFrames & Content Liability */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              id="content-liability"
              className="bg-[#0d0d0d] border border-white/[0.05] rounded-3xl p-8 hover:border-red-500/20 hover:bg-red-500/[0.01] transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-red-500/20 group-hover:via-red-500/50 to-transparent transition-all duration-500" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-white font-black text-lg tracking-wider uppercase">iFrames & Liability</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">iFrames</h4>
                  <p className="text-sm">
                    Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.
                  </p>
                </div>

                <div className="border-t border-white/[0.04] pt-6">
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">Content Liability</h4>
                  <p className="text-sm">
                    We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website.
                  </p>
                </div>

                <div className="border-t border-white/[0.04] pt-6">
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">Your Privacy</h4>
                  <p className="text-sm">
                    Please read our{' '}
                    <Link to="/privacy-policy" className="text-red-500 hover:text-red-400 hover:underline font-bold transition-all">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
            </motion.section>

            {/* 6. Disclaimer */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              id="disclaimer"
              className="bg-[#0d0d0d] border border-white/[0.05] rounded-3xl p-8 hover:border-red-500/20 hover:bg-red-500/[0.01] transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-red-500/20 group-hover:via-red-500/50 to-transparent transition-all duration-500" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-white font-black text-lg tracking-wider uppercase">Disclaimer</h2>
              </div>
              
              <div className="space-y-4">
                <p>
                  To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website.
                </p>
                <p>
                  The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.
                </p>
                <p className="font-semibold text-white/95">
                  As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.
                </p>
              </div>
            </motion.section>

          </div>
        </div>

      </div>
    </div>
  );
};
