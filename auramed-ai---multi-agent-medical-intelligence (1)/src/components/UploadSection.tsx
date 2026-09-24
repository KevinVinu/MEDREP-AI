import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  ArrowUpRight,
  FileText,
  AlertCircle,
  Download
} from 'lucide-react';

interface UploadSectionProps {
  onProcessComplete: (data?: any) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onProcessComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [downloadReady, setDownloadReady] = useState(false);
  const [pdfBase64Data, setPdfBase64Data] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const progressSteps = [
    { title: 'Uploading your report...', desc: 'Sending document securely to processing engine' },
    { title: 'Reading your document...', desc: 'Extracting text, lab tables, and clinical notes' },
    { title: 'Understanding the medical information...', desc: 'Parsing clinical sections and detecting medical entities' },
    { title: 'Identifying important findings...', desc: 'Evaluating normal ranges, abnormal values, and ruled-out conditions' },
    { title: 'Preparing your easy explanation...', desc: 'Translating complex medical terminology into clear language' },
    { title: 'Creating your report...', desc: 'Formatting your color-coded downloadable PDF summary' }
  ];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setErrorMessage(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const triggerDownload = (b64Data: string, filename = "MedRep_AI_Easy_Medical_Report.pdf") => {
    try {
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${b64Data}`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.warn('Auto-download was blocked by browser, fallback button available.', err);
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      fileInputRef.current?.click();
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setActiveStepIndex(0);

    // Step animation interval
    let step = 0;
    const stepInterval = setInterval(() => {
      if (step < progressSteps.length - 1) {
        step++;
        setActiveStepIndex(step);
      }
    }, 1800);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Call the Python FastAPI ML backend
      const response = await fetch('http://127.0.0.1:8000/api/process-report', {
        method: 'POST',
        body: formData,
      });

      clearInterval(stepInterval);
      setActiveStepIndex(progressSteps.length - 1);

      if (!response.ok) {
        throw new Error('Processing failed');
      }

      const result = await response.json();

      if (result.success) {
        setIsProcessing(false);
        setDownloadReady(true);
        if (result.pdfBase64) {
          setPdfBase64Data(result.pdfBase64);
          // 4. AUTOMATIC PDF DOWNLOAD
          triggerDownload(result.pdfBase64, "MedRep_AI_Easy_Medical_Report.pdf");
        }
        onProcessComplete(result);
      } else {
        throw new Error(result.error || 'Pipeline error');
      }

    } catch (err) {
      clearInterval(stepInterval);
      setIsProcessing(false);
      console.error(err);
      setErrorMessage("Sorry, we couldn't process this report. Please check the file and try again.");
    }
  };

  return (
    <section id="upload" className="relative py-24 bg-[#fdf8ff] border-b border-pink-100/80">
      {/* Soft ambient background blooms */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-pink-200/80 text-[#6b5e7a] text-xs font-mono mb-4 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-pink-700">MEDREP AI · REPORT PROCESSING ENGINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1e1b2e]">
            Upload Medical Report &amp; Get Easy Explanation
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6b5e7a] leading-relaxed">
            Drag and drop your PDF, DOCX, TXT, or scan image. MedRep AI turns complex medical data into a clear, patient-friendly PDF report.
          </p>
        </div>

        {/* Upload Container Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Drag & Drop Ingestion Zone (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-3xl p-10 sm:p-14 border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center flex-1 shadow-sm ${
                isDragging
                  ? 'border-pink-500 bg-pink-50/90 scale-[0.99]'
                  : 'border-pink-200 hover:border-pink-400 bg-white hover:bg-pink-50/40'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                className="hidden" 
              />

              <div className="w-16 h-16 rounded-3xl bg-pink-50 border border-pink-200 text-pink-500 flex items-center justify-center mb-4 shadow-xs">
                <UploadCloud className="w-8 h-8 text-pink-600" />
              </div>

              <h3 className="text-lg font-bold text-[#1e1b2e]">
                {selectedFile ? selectedFile.name : 'Drag & drop medical report here'}
              </h3>
              
              <p className="text-xs text-[#6b5e7a] mt-1.5 max-w-sm">
                Supports <strong>PDF, DOCX, TXT, JPG, JPEG, and PNG</strong> medical documents.
              </p>

              <div className="mt-5 flex items-center gap-2">
                <span className="text-xs font-semibold px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white shadow-sm transition-colors">
                  {selectedFile ? 'Change File' : 'Choose File'}
                </span>
                <span className="text-xs text-[#a89bb8]">or click to browse your device</span>
              </div>

              {selectedFile && (
                <div className="mt-4 p-2.5 bg-pink-50 border border-pink-200 rounded-xl text-xs text-pink-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pink-600" />
                  <span>Ready to analyze: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
              )}
            </div>

            {/* Error state */}
            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <p>{errorMessage}</p>
              </div>
            )}

            {/* Pipeline Trigger Bar */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-[#1e1b2e]">MedRep AI Pipeline Ready</span>
                </div>
                <p className="text-[11px] text-[#6b5e7a] mt-0.5">
                  OCR · Clinical NLP · Lab Range Analysis · Plain Language Generation
                </p>
              </div>

              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-pink-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transition-all hover:scale-102"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Analyzing Medical Report...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>Generate Easy Explanation PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Processing State & Live Step Tracker (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-pink-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-pink-50">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-pink-600" />
                  <h3 className="text-sm font-bold text-[#1e1b2e]">
                    Processing Progress
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#6b5e7a] bg-pink-50 border border-pink-100 px-2.5 py-0.5 rounded-full font-semibold">
                  {isProcessing ? 'Status: In Progress...' : (downloadReady ? 'Status: Completed' : 'Status: Ready')}
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {progressSteps.map((stepItem, index) => {
                  const isCurrent = isProcessing && activeStepIndex === index;
                  const isDone = activeStepIndex > index || (downloadReady && !isProcessing);

                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-2xl border transition-all ${
                        isCurrent 
                          ? 'bg-pink-50/90 border-pink-400 ring-2 ring-pink-300/30' 
                          : (isDone 
                              ? 'bg-emerald-50/70 border-emerald-200' 
                              : 'bg-[#fcf8ff] border-pink-50 opacity-60')
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isDone 
                              ? 'bg-emerald-500 text-white' 
                              : (isCurrent ? 'bg-pink-600 text-white animate-pulse' : 'bg-pink-100 text-pink-700')
                          }`}>
                            {isDone ? '✓' : index + 1}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#1e1b2e] leading-tight">
                              {stepItem.title}
                            </h4>
                            <p className="text-[10px] text-[#6b5e7a] mt-0.5">
                              {stepItem.desc}
                            </p>
                          </div>
                        </div>

                        {isCurrent && (
                          <RefreshCw className="w-3.5 h-3.5 text-pink-600 animate-spin" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Download or Jump Button */}
            <div className="mt-6 pt-4 border-t border-pink-50 flex items-center justify-between text-xs">
              {downloadReady && pdfBase64Data ? (
                <button
                  onClick={() => triggerDownload(pdfBase64Data)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Again</span>
                </button>
              ) : (
                <span className="text-[#a89bb8] text-[11px] font-mono">
                  Upload file above to trigger pipeline
                </span>
              )}

              <button
                onClick={() => onProcessComplete()}
                className="text-pink-600 hover:text-pink-700 font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View Summary</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
