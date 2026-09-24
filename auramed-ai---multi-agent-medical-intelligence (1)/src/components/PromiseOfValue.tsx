import React from 'react';
import { 
  FileText, 
  Pill, 
  ShieldCheck, 
  Activity, 
  BarChart3, 
  Download,
  UploadCloud,
  BrainCircuit,
  FileCheck2
} from 'lucide-react';

export const PromiseOfValue: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Upload Your Report',
      description: 'Upload your medical report as a PDF, document or image.',
      icon: UploadCloud,
      color: 'from-pink-500 to-rose-500',
      bg: 'bg-pink-50 border-pink-200 text-pink-600'
    },
    {
      step: '02',
      title: 'MedRep AI Understands It',
      description: 'Our AI pipeline extracts important medical information, test results, conditions and medications and explains complex terminology in simpler language.',
      icon: BrainCircuit,
      color: 'from-purple-500 to-indigo-500',
      bg: 'bg-purple-50 border-purple-200 text-purple-600'
    },
    {
      step: '03',
      title: 'Get Your Easy Report',
      description: 'Receive a structured, color-coded PDF that you can download and read on your own device.',
      icon: FileCheck2,
      color: 'from-emerald-500 to-teal-500',
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-600'
    }
  ];

  const features = [
    {
      id: 'easy-to-understand',
      title: 'Easy-to-Understand',
      description: 'Complex medical language is explained in simpler terms so anyone can follow along.',
      icon: FileText,
      tag: 'Plain Language',
      cardBg: 'bg-white hover:bg-pink-50/30 border-pink-100/90 hover:border-pink-300'
    },
    {
      id: 'important-findings',
      title: 'Important Findings',
      description: 'The most important information from the report is highlighted with clear priority.',
      icon: Activity,
      tag: 'Key Highlights',
      cardBg: 'bg-white hover:bg-rose-50/30 border-rose-100/90 hover:border-rose-300'
    },
    {
      id: 'test-results',
      title: 'Test Results',
      description: 'Important laboratory results are organized clearly with their reported ranges and status.',
      icon: BarChart3,
      tag: 'Lab Values',
      cardBg: 'bg-white hover:bg-purple-50/30 border-purple-100/90 hover:border-purple-300'
    },
    {
      id: 'conditions',
      title: 'Conditions',
      description: 'Conditions mentioned in the report are separated based on their context (confirmed, historical, suspected, or ruled out).',
      icon: ShieldCheck,
      tag: 'Context Aware',
      cardBg: 'bg-white hover:bg-amber-50/30 border-amber-100/90 hover:border-amber-300'
    },
    {
      id: 'medications',
      title: 'Medications',
      description: 'Medications mentioned in the report are clearly separated with dosage and purpose for easy reading.',
      icon: Pill,
      tag: 'Rx Clarity',
      cardBg: 'bg-white hover:bg-sky-50/30 border-sky-100/90 hover:border-sky-300'
    },
    {
      id: 'downloadable-report',
      title: 'Downloadable Report',
      description: 'Get a professionally structured PDF that you can save, print, and read later at your own pace.',
      icon: Download,
      tag: 'Color-Coded PDF',
      cardBg: 'bg-white hover:bg-emerald-50/30 border-emerald-100/90 hover:border-emerald-300'
    }
  ];

  return (
    <div id="how-it-works" className="relative py-24 bg-[#fef6f9] border-y border-pink-100/80 overflow-hidden">
      {/* Ambient background glow elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-200/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SECTION 1: HOW IT WORKS (3 Simple Steps) */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-pink-200/70 text-[#6b5e7a] text-xs font-mono mb-4 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
            <span className="font-semibold text-pink-700">SIMPLE 3-STEP PROCESS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1e1b2e]">
            How MedRep AI Works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6b5e7a]">
            Turning complicated medical documents into simple, actionable explanations in seconds.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-pink-100 shadow-md shadow-pink-100/40 hover:shadow-xl hover:shadow-pink-100/60 transition-all flex flex-col justify-between group hover:-translate-y-1 relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${s.bg} border flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-3xl font-extrabold font-mono text-pink-300 group-hover:text-pink-500 transition-colors">
                      {s.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#1e1b2e] mb-3">
                    {s.title}
                  </h3>
                  <p className="text-sm text-[#6b5e7a] leading-relaxed">
                    {s.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-pink-50 flex items-center gap-2 text-xs font-semibold text-pink-600">
                  <span>Step {s.step}</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* SECTION 2: FEATURES */}
        <div id="features" className="text-center max-w-3xl mx-auto mb-14 pt-6 border-t border-pink-100/80">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-pink-200/70 text-[#6b5e7a] text-xs font-mono mb-4 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            <span className="font-semibold text-purple-700">CORE FEATURES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1e1b2e]">
            Everything You Need to Understand Your Health
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6b5e7a]">
            Designed to answer your questions without overwhelming you with clinical jargon.
          </p>
        </div>

        {/* Features 6-Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                className={`rounded-3xl p-7 border transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-lg ${f.cardBg}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-pink-100/70 text-pink-700 border border-pink-200">
                      {f.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#1e1b2e] mb-2">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6b5e7a] leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
