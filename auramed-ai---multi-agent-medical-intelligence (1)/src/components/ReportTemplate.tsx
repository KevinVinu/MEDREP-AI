import React, { useState } from 'react';
import { 
  FileText, 
  Pill, 
  ShieldCheck, 
  Printer, 
  Download, 
  Stethoscope,
  Calendar,
  Building,
  CheckCircle2,
  Check,
  AlertTriangle,
  Activity,
  Heart,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface ReportTemplateProps {
  reportData?: any;
}

export const ReportTemplate: React.FC<ReportTemplateProps> = ({ reportData }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tests' | 'conditions' | 'medications' | 'not_found' | 'terms' | 'followup'>('overview');

  const handleDownloadPDF = () => {
    if (reportData?.pdfBase64) {
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${reportData.pdfBase64}`;
      link.download = "MedRep_AI_Easy_Medical_Report.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open('http://127.0.0.1:8000/api/download-pdf', '_blank');
    }
  };

  return (
    <section id="report" className="relative py-24 bg-[#fef6f9] border-b border-pink-100/80">
      {/* Soft ambient background glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* DOWNLOAD / READY HERO BANNER */}
        <div className="bg-gradient-to-br from-white via-pink-50/50 to-purple-50/40 rounded-3xl p-8 sm:p-10 border border-pink-200 shadow-xl shadow-pink-100/60 mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold mb-3 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>YOUR REPORT IS READY</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1e1b2e] tracking-tight">
                Medical Report — Easy Explanation
              </h2>
              <p className="mt-2 text-sm text-[#6b5e7a] leading-relaxed">
                We've transformed your medical report into a clear, easy-to-understand explanation. Your structured PDF report includes:
              </p>

              {/* Checklist */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#1e1b2e] font-medium">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  <span>Important findings</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  <span>Test results with reference ranges</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  <span>Conditions mentioned &amp; status</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  <span>Medications with dosages</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  <span>What the report did NOT find</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  <span>Medical terms explained simply</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  <span>Doctor follow-up instructions</span>
                </div>
              </div>
            </div>

            {/* Prominent Download Button */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <button
                onClick={handleDownloadPDF}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all flex items-center justify-center gap-3 cursor-pointer hover:scale-102 active:scale-98"
              >
                <Download className="w-5 h-5" />
                <span>Download Easy Medical Report</span>
              </button>

              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-5 py-2 bg-white hover:bg-pink-50 text-[#1e1b2e] rounded-xl border border-pink-200 text-xs font-semibold transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-pink-500" />
                <span>Print Web View</span>
              </button>
            </div>
          </div>
        </div>

        {/* STRUCTURED PATIENT REPORT VIEWER */}
        <div className="bg-white rounded-3xl border border-pink-200/90 shadow-xl shadow-pink-100/60 overflow-hidden">
          
          {/* Header Bar */}
          <div className="p-6 sm:p-8 bg-[#fcf8ff] border-b border-pink-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold tracking-tight text-[#1e1b2e]">
                  {reportData?.patientName
                    ? `${reportData.patientName} — Medical Report Summary`
                    : 'Your Medical Report — Easy Explanation'}
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Easy Explanation
                </span>
              </div>
              {reportData?.visitDate || reportData?.clinic || reportData?.physician ? (
                <div className="flex items-center gap-4 text-xs text-[#6b5e7a] mt-2 flex-wrap font-medium">
                  {reportData?.visitDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-pink-500" />
                      <span>Visit Date: {reportData.visitDate}</span>
                    </span>
                  )}
                  {reportData?.clinic && (
                    <><span>·</span>
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-pink-500" />
                      <span>Clinic: {reportData.clinic}</span>
                    </span></>
                  )}
                  {reportData?.physician && (
                    <><span>·</span>
                    <span className="flex items-center gap-1">
                      <Stethoscope className="w-3.5 h-3.5 text-pink-500" />
                      <span>Physician: {reportData.physician}</span>
                    </span></>
                  )}
                </div>
              ) : (
                <p className="text-xs text-[#6b5e7a] mt-1">
                  Upload a medical report above to generate your personalized summary.
                </p>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-pink-100 bg-[#fffbfc] px-6 overflow-x-auto text-xs font-semibold text-[#6b5e7a]">
            {[
              { key: 'overview', label: 'Important Findings' },
              { key: 'tests', label: 'Test Results' },
              { key: 'conditions', label: 'Conditions' },
              { key: 'medications', label: 'Medications' },
              { key: 'not_found', label: 'What Was Not Found' },
              { key: 'terms', label: 'Medical Terms' },
              { key: 'followup', label: 'Follow-up Plan' }
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key as any)}
                className={`py-3.5 px-4 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === t.key 
                    ? 'border-pink-600 text-pink-700 font-bold bg-pink-50/60' 
                    : 'border-transparent hover:text-[#1e1b2e] hover:border-pink-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* PDF COLOR CODE LEGEND */}
          <div className="p-6 sm:p-8 space-y-6">

            {/* Legend intro */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <Sparkles className="w-5 h-5 text-pink-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-[#1e1b2e] mb-1">How to Read Your Color-Coded PDF Report</h4>
                <p className="text-xs text-[#6b5e7a] leading-relaxed">
                  Your downloaded PDF uses a consistent color system to instantly show you the status of every finding, test result, and condition. Here's what each color means:
                </p>
              </div>
            </div>

            {/* Color Legend Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-3 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Color</th>
                    <th className="p-3 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Label</th>
                    <th className="p-3 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Used For</th>
                    <th className="p-3 font-bold text-slate-600 uppercase tracking-wider text-[11px]">What It Means for You</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">

                  {/* Red */}
                  <tr className="hover:bg-red-50/40 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-red-500 shadow-sm shadow-red-200" />
                        <span className="font-mono font-bold text-red-700 text-[11px]">RED</span>
                      </div>
                    </td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-red-100 text-red-800 font-bold rounded text-[11px]">ELEVATED / CRITICAL</span></td>
                    <td className="p-3 text-slate-700">Lab values significantly above normal; confirmed active conditions; urgent symptoms</td>
                    <td className="p-3 text-slate-600">Requires attention — discuss with your doctor as a priority.</td>
                  </tr>

                  {/* Orange/Amber */}
                  <tr className="hover:bg-amber-50/40 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-amber-500 shadow-sm shadow-amber-200" />
                        <span className="font-mono font-bold text-amber-700 text-[11px]">ORANGE</span>
                      </div>
                    </td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[11px]">HIGH / ABNORMAL</span></td>
                    <td className="p-3 text-slate-700">Mildly elevated values; borderline results; conditions under monitoring</td>
                    <td className="p-3 text-slate-600">Worth watching — lifestyle changes or medication adjustments may be needed.</td>
                  </tr>

                  {/* Green */}
                  <tr className="hover:bg-emerald-50/40 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
                        <span className="font-mono font-bold text-emerald-700 text-[11px]">GREEN</span>
                      </div>
                    </td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[11px]">NORMAL / HEALTHY</span></td>
                    <td className="p-3 text-slate-700">Lab values within healthy reference ranges; ruled-out conditions; clear findings</td>
                    <td className="p-3 text-slate-600">All good — no action needed for these items.</td>
                  </tr>

                  {/* Blue */}
                  <tr className="hover:bg-sky-50/40 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-sky-500 shadow-sm shadow-sky-200" />
                        <span className="font-mono font-bold text-sky-700 text-[11px]">BLUE</span>
                      </div>
                    </td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-sky-100 text-sky-800 font-bold rounded text-[11px]">MEDICATION</span></td>
                    <td className="p-3 text-slate-700">Prescribed medications, dosages, and their intended purpose</td>
                    <td className="p-3 text-slate-600">Your active medications — follow prescribed dosages carefully.</td>
                  </tr>

                  {/* Purple */}
                  <tr className="hover:bg-purple-50/40 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-purple-500 shadow-sm shadow-purple-200" />
                        <span className="font-mono font-bold text-purple-700 text-[11px]">PURPLE</span>
                      </div>
                    </td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-purple-100 text-purple-800 font-bold rounded text-[11px]">FOLLOW-UP</span></td>
                    <td className="p-3 text-slate-700">Doctor's follow-up instructions, scheduled tests, and return visit reminders</td>
                    <td className="p-3 text-slate-600">Action items — complete these before your next appointment.</td>
                  </tr>

                  {/* Grey/Slate */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-400 shadow-sm shadow-slate-200" />
                        <span className="font-mono font-bold text-slate-600 text-[11px]">GREY</span>
                      </div>
                    </td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded text-[11px]">MEDICAL TERM</span></td>
                    <td className="p-3 text-slate-700">Complex medical words with plain-language definitions below them</td>
                    <td className="p-3 text-slate-600">Jargon decoder — each term is explained in simple language.</td>
                  </tr>

                </tbody>
              </table>
            </div>

            {/* Upload CTA when no data */}
            {!reportData && (
              <div className="p-5 rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50/40 text-center">
                <HelpCircle className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#1e1b2e]">No Report Uploaded Yet</p>
                <p className="text-xs text-[#6b5e7a] mt-1">Upload your medical report above and your personalized color-coded summary will appear here.</p>
              </div>
            )}

          </div>

          {/* Footer Card */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>MedRep AI · Color-coded PDF report · Upload above to generate yours.</span>
            <button
              onClick={handleDownloadPDF}
              disabled={!reportData?.pdfBase64}
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{reportData?.pdfBase64 ? 'Download PDF' : 'Upload to Download'}</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
