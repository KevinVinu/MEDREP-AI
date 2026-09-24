import React, { useEffect } from 'react';
import { ArrowUpRight, FileCheck, CheckCircle2 } from 'lucide-react';

// Extend JSX to recognise the <spline-viewer> web component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { url?: string; 'loading-anim-type'?: string }, HTMLElement>;
    }
  }
}

interface HeroSectionProps {
  onScrollToUpload: () => void;
  onScrollToReport: () => void;
}

const SPLINE_SCENE = 'https://prod.spline.design/VLQ0MAhNWqAvJKpf/scene.splinecode';

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToUpload, onScrollToReport }) => {

  // Load the Spline viewer web component from CDN
  useEffect(() => {
    if (customElements.get('spline-viewer')) return;
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.9.27/build/spline-viewer.js';
    document.head.appendChild(script);
  }, []);

  return (
    <section className="relative min-h-[90vh] pt-28 pb-16 flex flex-col justify-between overflow-hidden bg-[#fdf8ff]">
      {/* Pastel grid */}
      <div className="absolute inset-0 bg-grid-columns pointer-events-none opacity-100 -z-10" />
      {/* Ambient pastel glow blobs */}
      <div className="absolute inset-0 hero-dna-ambient animate-dna-glow -z-10" />

      {/* Main Two-Column Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">

            {/* Live Tag */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-pink-200 text-xs font-mono text-pink-600 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-pink-700">MedRep AI · Medical Report Clarity</span>
              <span className="text-pink-400">→</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1e1b2e] leading-[1.15]">
              <span>Understand Your Medical Report.</span>
              <br />
              <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-transparent">
                Without the Medical Jargon.
              </span>
            </h1>

            {/* Subtext */}
            <p className="mt-6 text-base sm:text-lg text-[#6b5e7a] max-w-xl leading-relaxed">
              Upload your medical report and <strong>MedRep AI</strong> turns complex medical information into a clear, easy-to-understand explanation — complete with important findings, test results, medications and follow-up information.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex items-center gap-4 flex-wrap">
              <button
                onClick={onScrollToUpload}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm transition-all shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 cursor-pointer active:scale-95"
              >
                <span>Upload Your Report</span>
                <span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </button>

              <button
                onClick={onScrollToReport}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-pink-50/60 text-[#1e1b2e] font-semibold text-sm border border-pink-200 hover:border-pink-300 transition-all cursor-pointer shadow-sm"
              >
                <FileCheck className="w-4 h-4 text-pink-500" />
                <span>View Easy Report Sample</span>
              </button>
            </div>

            {/* Feature Bullets */}
            <div className="mt-10 flex items-center gap-6 text-xs text-[#6b5e7a] flex-wrap font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Supports PDF, DOCX, TXT &amp; Images</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-500" />
                <span>Color-Coded Findings</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-500" />
                <span>Instant PDF Download</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN — 3D Visual Scene */}
          <div className="lg:col-span-6 w-full flex items-center justify-center">
            <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-pink-100/40 via-purple-100/30 to-white border border-pink-200/80 shadow-2xl shadow-pink-200/50 p-2 flex items-center justify-center" style={{ maxWidth: '580px', height: '640px' }}>
              {/* Spline 3D Embed */}
              <div className="w-full h-full rounded-2xl overflow-hidden">
                <spline-viewer 
                  url={SPLINE_SCENE}
                  loading-anim-type="spinner-small-dark"
                  style={{ width: '100%', height: '100%', background: 'transparent' }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
