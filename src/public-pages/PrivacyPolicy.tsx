import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Eye, Lock, FileText, CheckCircle, HelpCircle } from 'lucide-react';

export const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    { id: 'who-we-are', label: 'Who We Are' },
    { id: 'data-collection', label: 'Data Collection' },
    { id: 'cookies', label: 'Cookies & Tracking' },
    { id: 'data-sharing-retention', label: 'Sharing & Retention' },
    { id: 'your-rights', label: 'Your Rights' },
    { id: 'additional-info', label: 'Additional Info' }
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
              PRIVACY <span className="text-red-500">POLICY</span>
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
          <div className="w-full lg:w-3/4 space-y-12 leading-relaxed">
            
            {/* 1. Who We Are */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              id="who-we-are"
              className="bg-[#0d0d0d] border border-white/[0.05] rounded-3xl p-8 hover:border-red-500/20 hover:bg-red-500/[0.01] transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-red-500/20 group-hover:via-red-500/50 to-transparent transition-all duration-500" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-white font-black text-lg tracking-wider uppercase">Who We Are</h2>
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Our website address is:{' '}
                <a 
                  href="https://taekwando-cyan.vercel.app" 
                  className="text-red-400 hover:text-red-300 hover:underline font-semibold transition-all"
                  target="_blank" 
                  rel="noreferrer"
                >
                  taekwando-cyan.vercel.app
                </a>.
              </p>
            </motion.section>

            {/* 2. What personal data we collect and why */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              id="data-collection"
              className="bg-[#0d0d0d] border border-white/[0.05] rounded-3xl p-8 hover:border-red-500/20 hover:bg-red-500/[0.01] transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-red-500/20 group-hover:via-red-500/50 to-transparent transition-all duration-500" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-white font-black text-lg tracking-wider uppercase">What Personal Data We Collect</h2>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-red-400 font-bold text-sm tracking-wider uppercase mb-3">Comments</h3>
                  <p className="text-gray-300 text-sm sm:text-base mb-4">
                    When visitors leave comments on the site, we collect the data shown in the comments form, and also the visitor's IP address and browser user agent string to help spam detection.
                  </p>
                  <p className="text-gray-300 text-sm sm:text-base">
                    An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here:{' '}
                    <a 
                      href="https://automattic.com/privacy/" 
                      className="text-red-400 hover:text-red-300 hover:underline transition-all"
                      target="_blank" 
                      rel="noreferrer"
                    >
                      https://automattic.com/privacy/
                    </a>. After approval of your comment, your profile picture is visible to the public in the context of your comment.
                  </p>
                </div>

                <div className="border-t border-white/[0.04] pt-6">
                  <h3 className="text-red-400 font-bold text-sm tracking-wider uppercase mb-3">Media</h3>
                  <p className="text-gray-300 text-sm sm:text-base">
                    If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.
                  </p>
                </div>

                <div className="border-t border-white/[0.04] pt-6">
                  <h3 className="text-red-400 font-bold text-sm tracking-wider uppercase mb-3">Contact Forms</h3>
                  <p className="text-gray-300 text-sm sm:text-base">
                    If you use our contact form, we collect the details you provide (such as your full name, phone number, email address, course selection, and message) so we can process your enquiry and respond to you.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* 3. Cookies */}
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
                  <Lock className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-white font-black text-lg tracking-wider uppercase">Cookies & Embedded Content</h2>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-red-400 font-bold text-sm tracking-wider uppercase mb-3">Cookies Usage</h3>
                  <ul className="space-y-3.5 text-gray-300 text-sm sm:text-base">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2" />
                      <span>If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2" />
                      <span>If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2" />
                      <span>When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select "Remember Me", your login will persist for two weeks. If you log out of your account, the login cookies will be removed.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2" />
                      <span>If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after 1 day.</span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-white/[0.04] pt-6">
                  <h3 className="text-red-400 font-bold text-sm tracking-wider uppercase mb-3">Embedded content from other websites</h3>
                  <p className="text-gray-300 text-sm sm:text-base mb-4">
                    Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.
                  </p>
                  <p className="text-gray-300 text-sm sm:text-base">
                    These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with that embedded content if you have an account and are logged in to that website.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* 4. Sharing & Retention */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              id="data-sharing-retention"
              className="bg-[#0d0d0d] border border-white/[0.05] rounded-3xl p-8 hover:border-red-500/20 hover:bg-red-500/[0.01] transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-red-500/20 group-hover:via-red-500/50 to-transparent transition-all duration-500" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-white font-black text-lg tracking-wider uppercase">Data Sharing & Retention</h2>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-red-400 font-bold text-sm tracking-wider uppercase mb-3">Who we share your data with</h3>
                  <p className="text-gray-300 text-sm sm:text-base">
                    If you request a password reset, your IP address will be included in the reset email.
                  </p>
                </div>

                <div className="border-t border-white/[0.04] pt-6">
                  <h3 className="text-red-400 font-bold text-sm tracking-wider uppercase mb-3">How long we retain your data</h3>
                  <p className="text-gray-300 text-sm sm:text-base mb-4">
                    If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.
                  </p>
                  <p className="text-gray-300 text-sm sm:text-base">
                    For users that register on our website (if any), we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* 5. Your Rights */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              id="your-rights"
              className="bg-[#0d0d0d] border border-white/[0.05] rounded-3xl p-8 hover:border-red-500/20 hover:bg-red-500/[0.01] transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-red-500/20 group-hover:via-red-500/50 to-transparent transition-all duration-500" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-white font-black text-lg tracking-wider uppercase">What Rights You Have Over Your Data</h2>
              </div>

              <p className="text-gray-300 text-sm sm:text-base mb-4">
                If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us.
              </p>
              <p className="text-gray-300 text-sm sm:text-base">
                You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.
              </p>
            </motion.section>

            {/* 6. Additional Info */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              id="additional-info"
              className="bg-[#0d0d0d] border border-white/[0.05] rounded-3xl p-8 hover:border-red-500/20 hover:bg-red-500/[0.01] transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-red-500/20 group-hover:via-red-500/50 to-transparent transition-all duration-500" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-white font-black text-lg tracking-wider uppercase">Additional Information</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-red-400 font-bold text-sm tracking-wider uppercase mb-3">Where we send your data</h3>
                  <p className="text-gray-300 text-sm sm:text-base">
                    Visitor comments may be checked through an automated spam detection service.
                  </p>
                </div>

                <div className="border-t border-white/[0.04] pt-6 space-y-4">
                  <div>
                    <h4 className="text-white/80 font-bold text-xs uppercase tracking-wider mb-2">How we protect your data</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      We secure all personal data stored in our database using standard access controls and secure protocols to protect against unauthorized access, alterations, or disclosures.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-white/80 font-bold text-xs uppercase tracking-wider mb-2">What data breach procedures we have in place</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      In the event of a suspected data breach, we will initiate immediate investigation procedures and notify affected users as required by applicable laws and safety standards.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-white/80 font-bold text-xs uppercase tracking-wider mb-2">What third parties we receive data from</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      We do not receive or buy data from third-party advertising services or analytics brokers.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-white/80 font-bold text-xs uppercase tracking-wider mb-2">What automated decision making and/or profiling we do</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      We do not employ automated decision-making or run profiling algorithms on user registration details.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-white/80 font-bold text-xs uppercase tracking-wider mb-2">Industry regulatory disclosure requirements</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      All sports operations are conducted in compliance with guidelines set forth by the Maharajganj District Taekwondo Association, Uttar Pradesh Taekwondo Association, and relevant sports regulations.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

          </div>
        </div>

      </div>
    </div>
  );
};
