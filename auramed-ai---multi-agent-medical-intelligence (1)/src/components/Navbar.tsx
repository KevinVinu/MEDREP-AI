import React, { useState, useEffect } from 'react';
import { Activity, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onScrollToUpload: () => void;
  onScrollToReport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onScrollToUpload, onScrollToReport }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/90 backdrop-blur-md border-b border-pink-100 py-3 shadow-sm shadow-pink-100/50'
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Brand */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5 stroke-[2.5] text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-[#1e1b2e] leading-none">
              MedRep AI
            </span>
            <span className="text-[9px] font-mono tracking-widest text-pink-600 uppercase mt-0.5 font-bold">
              SMART MEDICAL REPORT CLARITY
            </span>
          </div>
        </a>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-mono tracking-widest text-[#6b5e7a] uppercase font-semibold">
          <a href="#how-it-works" className="hover:text-pink-600 transition-colors">HOW IT WORKS</a>
          <a href="#features" className="hover:text-pink-600 transition-colors">FEATURES</a>
          <a href="#upload" onClick={(e) => { e.preventDefault(); onScrollToUpload(); }} className="hover:text-pink-600 transition-colors">UPLOAD REPORT</a>
          <a href="#report" onClick={(e) => { e.preventDefault(); onScrollToReport(); }} className="hover:text-pink-600 transition-colors">EASY REPORT</a>
          <a href="#testimonials" className="hover:text-pink-600 transition-colors">REVIEWS</a>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onScrollToUpload}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-semibold shadow-md shadow-pink-500/20 transition-all cursor-pointer hover:scale-102 active:scale-98"
          >
            <span>Upload Your Report</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
};
