import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PromiseOfValue } from './components/PromiseOfValue';
import { UploadSection } from './components/UploadSection';
import { ReportTemplate } from './components/ReportTemplate';
import { MovingTestimonials } from './components/MovingTestimonials';
import { FooterCTA } from './components/FooterCTA';

export default function App() {
  const [reportData, setReportData] = useState<any>(null);

  const scrollToUpload = () => {
    const el = document.getElementById('upload');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToReport = () => {
    const el = document.getElementById('report');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProcessComplete = (data?: any) => {
    if (data) {
      setReportData(data);
    }
    setTimeout(() => {
      scrollToReport();
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#fdf8ff] text-[#1e1b2e] selection:bg-pink-200 selection:text-pink-900 font-['Plus_Jakarta_Sans',sans-serif] antialiased overflow-x-hidden">
      {/* Top Header Navbar */}
      <Navbar 
        onScrollToUpload={scrollToUpload} 
        onScrollToReport={scrollToReport} 
      />

      <main>
        {/* 1. Hero Section */}
        <HeroSection 
          onScrollToUpload={scrollToUpload} 
          onScrollToReport={scrollToReport} 
        />

        {/* 2. How It Works & Core Features */}
        <PromiseOfValue />

        {/* 3. Upload & ML Pipeline Execution */}
        <UploadSection 
          onProcessComplete={handleProcessComplete} 
        />

        {/* 4. Synthesized Easy Explanation Report & Download Section */}
        <ReportTemplate 
          reportData={reportData} 
        />

        {/* 5. Moving Testimonials Marquee */}
        <MovingTestimonials />

        {/* 6. Call To Action & Clean Footer */}
        <FooterCTA 
          onScrollToUpload={scrollToUpload} 
        />
      </main>
    </div>
  );
}
