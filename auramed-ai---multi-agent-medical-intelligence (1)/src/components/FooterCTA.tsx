import React from 'react';
import { Sparkles, ArrowRight, Shield } from 'lucide-react';

interface FooterCTAProps {
  onScrollToUpload: () => void;
}

export const FooterCTA: React.FC<FooterCTAProps> = ({ onScrollToUpload }) => {
  return (
    <footer className="bg-[#fcf8ff] text-[#1e1b2e] relative overflow-hidden border-t border-pink-100">
      {/* Soft DNA particle glow in Footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-pink-300/20 via-purple-300/20 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-14 relative z-10">
        
        {/* Main CTA Block */}
        <div className="bg-white/95 rounded-3xl p-8 sm:p-14 border border-pink-200/90 text-center max-w-4xl mx-auto shadow-xl shadow-pink-100/60"
          style={{ boxShadow: '0 10px 40px rgba(244,114,182,0.12), 0 2px 10px rgba(168,85,247,0.06)' }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-semibold mb-5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>MedRep AI · Medical Report Clarification</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1e1b2e] text-balance leading-tight">
            Understand Your Medical Report in Seconds
          </h2>

          <p className="mt-4 text-[#6b5e7a] text-sm sm:text-base max-w-xl mx-auto text-balance leading-relaxed">
            Upload your clinical PDF, doctor note, or laboratory chart and get an easy-to-read, color-coded medical explanation instantly.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onScrollToUpload}
              className="px-8 py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all cursor-pointer flex items-center gap-2 hover:scale-102 active:scale-98"
            >
              <span>Upload Your Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#how-it-works"
              className="px-6 py-3.5 bg-white hover:bg-pink-50 text-[#1e1b2e] font-semibold text-sm rounded-2xl border border-pink-200 transition-all shadow-xs"
            >
              How It Works
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-pink-100 flex items-center justify-center gap-2 text-xs text-[#6b5e7a] max-w-lg mx-auto">
            <Shield className="w-4 h-4 text-pink-500 shrink-0" />
            <span>MedRep AI helps you understand your medical report. It does not replace professional medical advice.</span>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-16 pt-8 border-t border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6b5e7a]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white flex items-center justify-center font-bold text-[10px] shadow-xs">
              M
            </div>
            <span className="font-bold text-[#1e1b2e]">MedRep AI</span>
            <span>—</span>
            <span>Plain-Language Medical Report Intelligence</span>
          </div>

          <p className="text-[11px] text-[#a89bb8]">
            Designed for patient understanding and healthcare clarity.
          </p>
        </div>

      </div>
    </footer>
  );
};
