import React, { useEffect, useRef, useState } from 'react';
import { RotateCw, Move, Layers, Eye, RefreshCw, Code, Sparkles, Sliders, Check, ExternalLink } from 'lucide-react';

interface SplineVisualContainerProps {
  onExploreReport?: () => void;
}

export const SplineVisualContainer: React.FC<SplineVisualContainerProps> = ({ onExploreReport }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // View modes adapted from reference tabs
  const [activeTab, setActiveTab] = useState<'helix' | 'particles' | 'mesh' | 'spline_embed'>('helix');
  const [isRotating, setIsRotating] = useState(true);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(true);
  const [customSplineUrl, setCustomSplineUrl] = useState('');
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  
  // Interactive mouse coordinates
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotationAngle = 0;

    const resize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Generate DNA base nodes and floating ambient particles
    const helixNodesCount = 64;
    const ambientParticlesCount = 50;
    
    // Ambient floating particles
    const ambientParticles = Array.from({ length: ambientParticlesCount }, () => ({
      x: (Math.random() - 0.5) * 600,
      y: (Math.random() - 0.5) * 700,
      z: (Math.random() - 0.5) * 400,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      vz: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.6 ? '#3B82F6' : (Math.random() > 0.5 ? '#06B6D4' : '#93C5FD')
    }));

    const render = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const centerX = width / 2 + mouseRef.current.x * 25;
      const centerY = height / 2 + mouseRef.current.y * 25;

      if (isRotating) {
        rotationAngle += 0.015;
      }

      // Camera projection constants
      const fov = 420;
      const cameraZ = 500;

      // Draw subtle ambient background light
      const grad = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, width * 0.6);
      grad.addColorStop(0, 'rgba(59, 130, 246, 0.08)');
      grad.addColorStop(0.5, 'rgba(14, 165, 233, 0.03)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render Ambient Particles
      for (const p of ambientParticles) {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (p.x < -300) p.x = 300;
        if (p.x > 300) p.x = -300;
        if (p.y < -350) p.y = 350;
        if (p.y > 350) p.y = -350;
        if (p.z < -200) p.z = 200;
        if (p.z > 200) p.z = -200;

        const scale = fov / (cameraZ + p.z);
        const sx = centerX + p.x * scale;
        const sy = centerY + p.y * scale;

        if (sx > 0 && sx < width && sy > 0 && sy < height) {
          ctx.beginPath();
          ctx.arc(sx, sy, Math.max(0.5, p.size * scale), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0.1, Math.min(0.6, scale * 0.7));
          ctx.fill();
        }
      }

      if (activeTab === 'helix' || activeTab === 'mesh') {
        // Render 3D DNA Double Helix
        const strand1: { sx: number; sy: number; z: number; color: string }[] = [];
        const strand2: { sx: number; sy: number; z: number; color: string }[] = [];

        const radius = activeTab === 'mesh' ? 95 : 80;
        const helixHeight = 520;
        const turns = 2.8;

        for (let i = 0; i < helixNodesCount; i++) {
          const t = i / helixNodesCount;
          const y = (t - 0.5) * helixHeight;
          const theta = t * Math.PI * 2 * turns + rotationAngle;

          // Strand 1
          const x1 = Math.cos(theta) * radius;
          const z1 = Math.sin(theta) * radius;
          const scale1 = fov / (cameraZ + z1);
          const sx1 = centerX + x1 * scale1;
          const sy1 = centerY + y * scale1;

          // Strand 2 (180 deg phase shift)
          const x2 = Math.cos(theta + Math.PI) * radius;
          const z2 = Math.sin(theta + Math.PI) * radius;
          const scale2 = fov / (cameraZ + z2);
          const sx2 = centerX + x2 * scale2;
          const sy2 = centerY + y * scale2;

          strand1.push({ sx: sx1, sy: sy1, z: z1, color: '#2563EB' });
          strand2.push({ sx: sx2, sy: sy2, z: z2, color: '#0284C7' });

          // Base pair connecting rung every 2 steps
          if (i % 2 === 0) {
            const avgZ = (z1 + z2) / 2;
            const alpha = Math.max(0.15, Math.min(0.85, (avgZ + 120) / 240));

            ctx.beginPath();
            ctx.moveTo(sx1, sy1);
            ctx.lineTo(sx2, sy2);
            ctx.strokeStyle = wireframeMode 
              ? `rgba(99, 102, 241, ${alpha * 0.5})` 
              : `rgba(59, 130, 246, ${alpha * 0.6})`;
            ctx.lineWidth = wireframeMode ? 0.75 : 1.5;
            ctx.stroke();

            // Center nucleotide bond node
            const mx = (sx1 + sx2) / 2;
            const my = (sy1 + sy2) / 2;
            ctx.beginPath();
            ctx.arc(mx, my, 2.5 * ((scale1 + scale2) / 2), 0, Math.PI * 2);
            ctx.fillStyle = i % 4 === 0 ? '#38BDF8' : '#60A5FA';
            ctx.globalAlpha = alpha;
            ctx.fill();
          }
        }

        // Draw backbone strands
        const drawStrandLine = (points: typeof strand1, strokeColor: string) => {
          ctx.beginPath();
          for (let i = 0; i < points.length; i++) {
            const p = points[i];
            if (i === 0) ctx.moveTo(p.sx, p.sy);
            else ctx.lineTo(p.sx, p.sy);
          }
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = wireframeMode ? 1 : 2;
          ctx.stroke();
        };

        ctx.globalAlpha = 0.7;
        drawStrandLine(strand1, 'rgba(37, 99, 235, 0.7)');
        drawStrandLine(strand2, 'rgba(2, 132, 199, 0.7)');

        // Draw backbone nucleotide particles with depth sorting
        const allNodes = [
          ...strand1.map((p, idx) => ({ ...p, isStrand1: true, idx })),
          ...strand2.map((p, idx) => ({ ...p, isStrand1: false, idx }))
        ].sort((a, b) => a.z - b.z);

        for (const node of allNodes) {
          const depthAlpha = Math.max(0.2, Math.min(1, (node.z + 100) / 200));
          const nodeRadius = wireframeMode ? 2.5 : (node.z > 0 ? 4.5 : 3);

          if (glowIntensity && node.z > 20) {
            ctx.beginPath();
            ctx.arc(node.sx, node.sy, nodeRadius * 2, 0, Math.PI * 2);
            ctx.fillStyle = node.isStrand1 ? 'rgba(59, 130, 246, 0.25)' : 'rgba(14, 165, 233, 0.25)';
            ctx.globalAlpha = depthAlpha * 0.4;
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(node.sx, node.sy, nodeRadius, 0, Math.PI * 2);
          ctx.fillStyle = node.isStrand1 ? '#2563EB' : '#0284C7';
          ctx.globalAlpha = depthAlpha;
          ctx.fill();

          // Highlight dot
          ctx.beginPath();
          ctx.arc(node.sx - 1, node.sy - 1, nodeRadius * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.globalAlpha = depthAlpha * 0.8;
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };

    const containerEl = containerRef.current;
    if (containerEl) {
      containerEl.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (containerEl) {
        containerEl.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeTab, isRotating, wireframeMode, glowIntensity]);

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      setCustomSplineUrl(inputUrl.trim());
      setActiveTab('spline_embed');
      setIsEditingUrl(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[520px] lg:h-[620px] rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(37,99,235,0.06)] overflow-hidden flex flex-col group select-none"
    >
      {/* Top System Switcher Tabs - Adapted from reference image 1 (Full body, Skin, Muscular...) */}
      <div className="relative z-20 flex items-center justify-between px-4 sm:px-6 pt-4 pb-2 border-b border-slate-100 bg-white/70 backdrop-blur-sm">
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('helix')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'helix' 
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            DNA Helix Structure
          </button>
          <button
            onClick={() => setActiveTab('particles')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'particles' 
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Medical Particles
          </button>
          <button
            onClick={() => setActiveTab('mesh')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'mesh' 
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Genomic Matrix
          </button>
          <button
            onClick={() => {
              setActiveTab('spline_embed');
              setIsEditingUrl(true);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
              activeTab === 'spline_embed' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Code className="w-3 h-3 text-blue-400" />
            <span>Spline 3D Embed</span>
          </button>
        </div>

        {/* Integration Pill Badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Interactive 3D Stage</span>
        </div>
      </div>

      {/* Main Interactive Canvas or Spline Iframe Container */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
        {activeTab === 'spline_embed' && customSplineUrl ? (
          <div className="w-full h-full relative bg-slate-950">
            <iframe 
              src={customSplineUrl} 
              title="Spline 3D Scene"
              className="w-full h-full border-0"
              loading="lazy"
            />
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-1 rounded-md border border-white/10">
              Live Spline Viewport
            </div>
          </div>
        ) : (
          <canvas 
            ref={canvasRef} 
            className="w-full h-full cursor-grab active:cursor-grabbing block"
          />
        )}

        {/* Subtle Watermark/Developer Slot Indicator */}
        <div className="absolute top-4 left-5 pointer-events-none z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-tight text-slate-400 uppercase bg-slate-100/80 backdrop-blur px-2 py-0.5 rounded">
              Spline 3D Visual Slot
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 max-w-[200px] leading-tight">
            DNA particles & molecular lattice. Ready for Spline 3D embed.
          </p>
        </div>

        {/* Reference Image Inspired Right-Hand Floating Action Rail */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
          {/* 360 Rotation Toggle (matching the blue button in reference image 1) */}
          <button 
            onClick={() => setIsRotating(!isRotating)}
            title={isRotating ? "Pause 360 Rotation" : "Resume 360 Rotation"}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md ${
              isRotating 
                ? 'bg-blue-600 text-white shadow-blue-500/25 scale-105' 
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </button>

          {/* Wireframe / Node View Toggle */}
          <button 
            onClick={() => setWireframeMode(!wireframeMode)}
            title="Toggle Wireframe Lattice"
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md ${
              wireframeMode 
                ? 'bg-blue-600 text-white shadow-blue-500/25' 
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Glow / Particle Intensity */}
          <button 
            onClick={() => setGlowIntensity(!glowIntensity)}
            title="Toggle Nucleotide Glow"
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md ${
              glowIntensity 
                ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Reset View */}
          <button 
            onClick={() => {
              mouseRef.current.x = 0;
              mouseRef.current.y = 0;
              mouseRef.current.targetX = 0;
              mouseRef.current.targetY = 0;
            }}
            title="Recenter Camera"
            className="w-10 h-10 rounded-xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 flex items-center justify-center transition-all cursor-pointer shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Floating Report Button - Exactly matching reference image 1 ("✨ Show AI report") */}
        <div className="absolute bottom-5 left-5 z-20">
          <button
            onClick={onExploreReport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-950 hover:bg-slate-900 text-white rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-xs font-semibold cursor-pointer border border-slate-800"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Show AI report</span>
          </button>
        </div>

        {/* 360 Indicator Graphic at right top */}
        <div className="absolute right-5 top-5 pointer-events-none text-slate-400 font-mono text-[10px] flex items-center gap-1">
          <span>360°</span>
          <RotateCw className="w-2.5 h-2.5" />
        </div>
      </div>

      {/* Spline Custom URL Configuration Drawer / Bar */}
      {isEditingUrl && (
        <div className="relative z-30 p-3 bg-slate-900 text-white border-t border-slate-800 flex flex-col sm:flex-row items-center gap-2 justify-between">
          <div className="text-xs text-slate-300 flex items-center gap-2">
            <Code className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Paste your Spline 3D scene public URL (e.g. https://my.spline.design/...):</span>
          </div>
          <form onSubmit={handleApplyCustomUrl} className="flex items-center gap-2 w-full sm:w-auto">
            <input 
              type="url" 
              placeholder="https://my.spline.design/your-dna-scene/"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="px-3 py-1 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-full sm:w-64"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
              Embed Scene
            </button>
            <button
              type="button"
              onClick={() => setIsEditingUrl(false)}
              className="px-2 py-1 text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
