import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Pill, 
  HelpCircle, 
  Printer, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  ShieldCheck, 
  Stethoscope, 
  Calendar, 
  Building, 
  User, 
  ArrowUpRight,
  Sparkles,
  Info,
  ChevronDown
} from 'lucide-react';
import { MedicalRecordData } from '../types/medical';

interface MedicalReportViewProps {
  record: MedicalRecordData;
}

export const MedicalReportView: React.FC<MedicalReportViewProps> = ({ record }) => {
  const [viewMode, setViewMode] = useState<'patient' | 'clinical' | 'json'>('patient');
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    navigator.clipboard.writeText(record.plainSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'urgent':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-700',
          dot: 'bg-rose-500',
          label: 'Urgent Attention Needed'
        };
      case 'moderate':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-700',
          dot: 'bg-amber-500',
          label: 'Moderate Attention / Follow-up'
        };
      default:
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          dot: 'bg-emerald-500',
          label: 'Normal Baseline / Routine'
        };
    }
  };

  const severityBadge = getSeverityBadge(record.overallSeverity);

  return (
    <section id="report-section" className="relative py-20 lg:py-28 bg-[#F6F8FC] border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Synthesized Patient Report</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Clear, Human-Understandable Report
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Organized for peace of mind, with zero medical jargon and clear doctor questions.
            </p>
          </div>

          {/* View Mode Switcher and Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="p-1 bg-white rounded-xl border border-slate-200 flex items-center shadow-2xs">
              <button
                onClick={() => setViewMode('patient')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  viewMode === 'patient' 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Patient View
              </button>
              <button
                onClick={() => setViewMode('clinical')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  viewMode === 'clinical' 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Raw Clinical EHR
              </button>
              <button
                onClick={() => setViewMode('json')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  viewMode === 'json' 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                JSON/FHIR
              </button>
            </div>

            <button
              onClick={handleCopySummary}
              className="p-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 transition-colors shadow-2xs cursor-pointer"
              title="Copy Summary"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handlePrint}
              className="p-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 transition-colors shadow-2xs cursor-pointer"
              title="Print Report"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Clean Report Document Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_15px_40px_rgba(0,0,0,0.04)] overflow-hidden">
          
          {/* Document Header Bar */}
          <div className="p-6 sm:p-8 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {record.patientName}
                </h3>
                <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
                  {record.patientAge} y.o. · {record.patientGender}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{record.date}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  <span>{record.facility}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5 text-slate-500" />
                  <span>{record.physician}</span>
                </span>
              </p>
            </div>

            {/* Severity Pill */}
            <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2 ${severityBadge.bg}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${severityBadge.dot} animate-pulse`} />
              <div>
                <span className="text-xs font-bold block leading-none">
                  {severityBadge.label}
                </span>
                <span className="text-[10px] opacity-80 font-medium">
                  {record.severityHeadline}
                </span>
              </div>
            </div>
          </div>

          {/* Conditional View Rendering */}
          {viewMode === 'json' && (
            <div className="p-6 bg-slate-950 text-slate-300 font-mono text-xs overflow-x-auto max-h-[600px]">
              <pre>{JSON.stringify(record, null, 2)}</pre>
            </div>
          )}

          {viewMode === 'clinical' && (
            <div className="p-6 sm:p-8 bg-slate-50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Raw Unprocessed Clinical Chart Excerpt:
              </h4>
              <div className="p-5 bg-white rounded-2xl border border-slate-200 font-mono text-xs leading-relaxed text-slate-800 whitespace-pre-wrap">
                {record.rawExcerpt}
              </div>
            </div>
          )}

          {viewMode === 'patient' && (
            <div className="p-6 sm:p-8 space-y-10">
              
              {/* Section 1: Executive Plain-English Summary */}
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">
                  <FileText className="w-4 h-4" />
                  <span>Plain-English Summary</span>
                </div>
                <div className="p-5 sm:p-6 rounded-2xl bg-blue-50/50 border border-blue-100">
                  <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
                    {record.plainSummary}
                  </p>

                  <div className="mt-4 pt-4 border-t border-blue-100/80">
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Key Takeaways For You:
                    </h5>
                    <ul className="space-y-1.5">
                      {record.whatItMeansForYou.map((point, idx) => (
                        <li key={idx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 2: Key Vitals & Biomarkers (Adapted directly from Reference Image 1 cards) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                    <Stethoscope className="w-4 h-4 text-blue-600" />
                    <span>Key Vitals & Lab Biomarkers</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    Reference ranges calibrated
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {record.vitalsAndBiomarkers.map((bio, idx) => {
                    const isElevated = bio.status === 'elevated';
                    const isLow = bio.status === 'low';

                    return (
                      <div 
                        key={idx}
                        className={`p-4 rounded-2xl border transition-all ${
                          isElevated 
                            ? 'bg-rose-50/40 border-rose-200' 
                            : (isLow 
                                ? 'bg-amber-50/40 border-amber-200' 
                                : 'bg-slate-50/70 border-slate-200')
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-600 truncate max-w-[170px]">
                            {bio.name}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            isElevated 
                              ? 'bg-rose-100 text-rose-700' 
                              : (isLow 
                                  ? 'bg-amber-100 text-amber-700' 
                                  : 'bg-emerald-100 text-emerald-700')
                          }`}>
                            {bio.statusLabel}
                          </span>
                        </div>

                        <div className="mt-2 flex items-baseline gap-1.5">
                          <span className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
                            {bio.value}
                          </span>
                          <span className="text-xs font-mono text-slate-500">
                            {bio.unit}
                          </span>
                        </div>

                        <div className="mt-2 text-[11px] text-slate-500 font-mono">
                          Goal: {bio.referenceRange}
                        </div>

                        <p className="mt-2 text-[11px] text-slate-600 leading-tight pt-2 border-t border-slate-200/50">
                          {bio.plainExplanation}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Active Medications & Prescriptions */}
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                  <Pill className="w-4 h-4 text-blue-600" />
                  <span>Prescriptions & Medications</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {record.medications.map((med, idx) => (
                    <div 
                      key={idx}
                      className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h5 className="text-base font-bold text-slate-900">
                            {med.name}
                          </h5>
                          <span className="text-xs font-mono text-blue-600 font-semibold">
                            {med.dosage} · {med.frequency}
                          </span>
                        </div>
                        {med.takeWithFood && (
                          <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full shrink-0">
                            Take with food
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                        <strong className="text-slate-800">Why prescribed:</strong> {med.purpose}
                      </p>

                      {med.warning && (
                        <div className="mt-3 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-[11px] text-amber-800 flex items-start gap-1.5">
                          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{med.warning}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Clinical Negations (What Was Ruled OUT) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Ruled-Out Conditions (Zero Evidence Detected)</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    High Confidence Negations
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {record.negations.map((neg, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/80"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{neg.condition}</span>
                      </div>
                      <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                        {neg.patientClarification}
                      </p>
                      <div className="mt-3 pt-2 border-t border-emerald-200/50 text-[10px] text-slate-500 font-mono italic">
                        "{neg.clinicalQuote}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 5: Questions for Your Doctor at Next Visit */}
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span>Prepared Questions for Your Doctor</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  {record.questionsForDoctor.map((question, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200/80">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                        {question}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Follow-Up Footer */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold">Recommended Follow-up:</span>
                  <span className="text-xs text-slate-300">{record.recommendedFollowUp}</span>
                </div>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0"
                >
                  Print Patient Summary
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
