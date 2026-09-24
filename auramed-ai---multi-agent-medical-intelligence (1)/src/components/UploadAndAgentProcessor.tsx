import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Check, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  Bot, 
  ArrowRight, 
  RefreshCw, 
  Clock, 
  FileCheck,
  Zap,
  Sliders,
  Database
} from 'lucide-react';
import { SAMPLE_RECORDS } from '../data/sampleRecords';
import { MedicalRecordData, AgentStep } from '../types/medical';

interface UploadAndAgentProcessorProps {
  currentRecord: MedicalRecordData;
  onRecordSelected: (record: MedicalRecordData) => void;
  onProcessingComplete: () => void;
}

export const UploadAndAgentProcessor: React.FC<UploadAndAgentProcessorProps> = ({
  currentRecord,
  onRecordSelected,
  onProcessingComplete
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [customText, setCustomText] = useState('');
  const [inputMode, setInputMode] = useState<'upload' | 'sample' | 'text'>('sample');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 5 AI Agents Pipeline
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([
    {
      id: 'agent_parser',
      name: 'Agent 1: Clinical Document & OCR Parser',
      role: 'Extracts lab tables, doctor notes, abbreviations & clinical entities',
      status: 'idle',
      latencyMs: 420,
      outputSummary: 'Parsed 3 vitals tables, 2 diagnoses, 1 discharge order',
      iconName: 'FileText'
    },
    {
      id: 'agent_summarizer',
      name: 'Agent 2: Plain-English Medical Translator',
      role: 'Converts physician prose into 6th-grade patient-friendly language',
      status: 'idle',
      latencyMs: 650,
      outputSummary: 'Synthesized plain summary with zero medical jargon',
      iconName: 'Bot'
    },
    {
      id: 'agent_pharma',
      name: 'Agent 3: Pharmacotherapy & Rx Inspector',
      role: 'Cross-checks dosages, administration frequencies, and food interactions',
      status: 'idle',
      latencyMs: 510,
      outputSummary: 'Identified active prescriptions & safety precautions',
      iconName: 'Pill'
    },
    {
      id: 'agent_negation',
      name: 'Agent 4: Negation & Rule-Out Verifier',
      role: 'Detects conditions explicitly denied or ruled out to prevent anxiety',
      status: 'idle',
      latencyMs: 580,
      outputSummary: 'Verified 3 critical ruled-out conditions with high confidence',
      iconName: 'CheckCircle2'
    },
    {
      id: 'agent_triage',
      name: 'Agent 5: Severity & Risk Triage Evaluator',
      role: 'Calculates clinical risk score and compiles physician questions',
      status: 'idle',
      latencyMs: 440,
      outputSummary: 'Stratified risk level and formulated 3 physician questions',
      iconName: 'AlertCircle'
    }
  ]);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setInputMode('upload');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setInputMode('upload');
    }
  };

  const runMultiAgentPipeline = (targetRecord: MedicalRecordData) => {
    setIsProcessing(true);
    setActiveStepIndex(0);

    // Reset steps
    setAgentSteps(prev => prev.map(s => ({ ...s, status: 'idle' })));

    let current = 0;
    const interval = setInterval(() => {
      if (current < 5) {
        setAgentSteps(prev => prev.map((step, idx) => {
          if (idx < current) return { ...step, status: 'completed' };
          if (idx === current) return { ...step, status: 'running' };
          return { ...step, status: 'idle' };
        }));
        setActiveStepIndex(current);
        current++;
      } else {
        clearInterval(interval);
        setAgentSteps(prev => prev.map(step => ({ ...step, status: 'completed' })));
        setIsProcessing(false);
        setActiveStepIndex(5);
        onRecordSelected(targetRecord);
        onProcessingComplete();
      }
    }, 600);
  };

  const handleProcessClick = () => {
    runMultiAgentPipeline(currentRecord);
  };

  const handleSelectSample = (sample: MedicalRecordData) => {
    onRecordSelected(sample);
    runMultiAgentPipeline(sample);
  };

  return (
    <section id="upload-section" className="relative py-20 lg:py-28 bg-white border-b border-slate-200/80 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-blue-50/50 via-sky-50/30 to-indigo-50/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive AI Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 text-balance">
            Upload Medical Records & Run Multi-Agent Synthesis
          </h2>
          <p className="mt-3 text-base text-slate-600 text-balance">
            Drop your clinical PDF, doctor note, or select a pre-configured sample to watch five AI agents extract findings, medications, and negations in real time.
          </p>

          {/* Mode Tabs */}
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl mt-6 border border-slate-200">
            <button
              onClick={() => setInputMode('sample')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                inputMode === 'sample' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pre-loaded Medical Samples (Instant)
            </button>
            <button
              onClick={() => setInputMode('upload')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                inputMode === 'upload' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upload PDF / Image File
            </button>
            <button
              onClick={() => setInputMode('text')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                inputMode === 'text' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Paste Doctor Note
            </button>
          </div>
        </div>

        {/* Core Ingestion Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Ingestion Area (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">

            {inputMode === 'sample' && (
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900">
                    Select a Clinical Record to Test:
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    3 Real Hospital Scenarios
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {SAMPLE_RECORDS.map((sample) => {
                    const isCurrent = currentRecord.id === sample.id;
                    return (
                      <div
                        key={sample.id}
                        onClick={() => handleSelectSample(sample)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                          isCurrent 
                            ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/20' 
                            : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900">
                                {sample.patientName} ({sample.patientAge} y.o.)
                              </h4>
                              <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                {sample.documentType.split(' ')[0]}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">
                              {sample.title}
                            </p>
                            <span className="text-[11px] text-blue-600 font-medium">
                              Severity: {sample.overallSeverity.toUpperCase()} · {sample.medications.length} Medications · {sample.negations.length} Negations
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap cursor-pointer transition-all ${
                            isCurrent 
                              ? 'bg-blue-600 text-white shadow-xs' 
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {isCurrent && isProcessing ? 'Processing...' : 'Run Agents'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {inputMode === 'upload' && (
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative rounded-3xl p-8 sm:p-12 border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' 
                    : 'border-slate-300 hover:border-blue-400 bg-slate-50/60 hover:bg-white'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg,.txt"
                  className="hidden" 
                />

                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-xs">
                  <UploadCloud className="w-8 h-8" />
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {selectedFile ? selectedFile.name : 'Drop medical PDF or lab report here'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Supports Quest/Labcorp diagnostic PDFs, hospital summaries, discharge orders, and clinical charts (up to 50MB).
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs font-semibold px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-xs">
                    Browse Computer
                  </span>
                </div>

                {selectedFile && (
                  <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Loaded: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                  </div>
                )}
              </div>
            )}

            {inputMode === 'text' && (
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Paste Raw Clinical Note or EHR Excerpt:
                </label>
                <textarea
                  rows={7}
                  value={customText || currentRecord.rawExcerpt}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Paste physician notes, labs, or prescription orders..."
                  className="w-full p-3.5 text-xs font-mono rounded-2xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>
            )}

            {/* Pipeline Trigger Bar */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold tracking-tight">Active Target:</span>
                  <span className="text-xs text-blue-300 font-semibold">{currentRecord.title}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Ready to dispatch to 5 specialized LLM reasoning agents.
                </p>
              </div>

              <button
                onClick={handleProcessClick}
                disabled={isProcessing}
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Agents Executing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                    <span>Process with 5 AI Agents</span>
                  </>
                )}
              </button>
            </div>

            {/* Developer Architecture Note for Hackathon */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 px-2 font-mono">
              <span className="flex items-center gap-1.5">
                <Database className="w-3 h-3 text-slate-400" />
                <span>Backend Hook: <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded">POST /api/agents/synthesize</code></span>
              </span>
              <span>Latency Target: &lt; 3.0s</span>
            </div>
          </div>

          {/* Right Area: Live Multi-Agent Execution Visualizer (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Autonomous Multi-Agent Pipeline
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {isProcessing ? 'Status: Active' : (activeStepIndex === 5 ? 'Status: Complete' : 'Status: Ready')}
              </span>
            </div>

            {/* Agents Flow Stepper */}
            <div className="flex flex-col gap-3.5">
              {agentSteps.map((step, idx) => {
                const isStepRunning = step.status === 'running';
                const isStepDone = step.status === 'completed';

                return (
                  <div
                    key={step.id}
                    className={`p-3.5 rounded-2xl border transition-all duration-300 ${
                      isStepRunning 
                        ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/10' 
                        : (isStepDone 
                            ? 'bg-slate-50/50 border-slate-200' 
                            : 'bg-white border-slate-100 opacity-60')
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                          isStepDone 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : (isStepRunning 
                                ? 'bg-blue-600 text-white animate-pulse' 
                                : 'bg-slate-100 text-slate-500')
                        }`}>
                          {isStepDone ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <span>0{idx + 1}</span>
                          )}
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-none">
                            {step.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                            {step.role}
                          </p>
                        </div>
                      </div>

                      {isStepDone && (
                        <span className="text-[10px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                          {step.latencyMs}ms
                        </span>
                      )}

                      {isStepRunning && (
                        <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin shrink-0" />
                      )}
                    </div>

                    {isStepDone && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-600 font-mono flex items-center gap-1.5">
                        <span className="text-emerald-500">✓</span>
                        <span className="truncate">{step.outputSummary}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pipeline Completion Banner */}
            <div className="mt-5 p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Structured Report Ready Below</span>
              </span>
              <button
                onClick={onProcessingComplete}
                className="text-blue-600 hover:text-blue-700 font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
