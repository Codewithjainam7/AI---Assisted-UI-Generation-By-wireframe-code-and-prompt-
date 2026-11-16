import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Cpu,
  Layers,
  Code2,
  CheckCircle2,
  Eye,
  Activity,
  Terminal,
  Zap,
  Maximize2
} from 'lucide-react';

const SYNTHESIS_STAGES = [
  {
    step: 1,
    title: 'Scanning Spatial Blueprint & Geometry',
    desc: 'Extracting visual hierarchy, container bounds, typography tokens & component cards',
    icon: Eye,
    threshold: 20
  },
  {
    step: 2,
    title: 'Synthesizing Semantic IR & Layout Architecture',
    desc: 'Mapping responsive flex/grid layouts, color gamuts, and Lucide vector iconography',
    icon: Layers,
    threshold: 45
  },
  {
    step: 3,
    title: 'Generating Production React 18 JSX & Tailwind',
    desc: 'Compiling clean, accessible React component code with iOS 26 liquid glass styling',
    icon: Code2,
    threshold: 75
  },
  {
    step: 4,
    title: 'Binding Redux Dynamic CMS State Keys',
    desc: 'Allocating immutable field IDs and registering dynamic store selectors',
    icon: Cpu,
    threshold: 92
  },
  {
    step: 5,
    title: 'Compiling Live Interactive Canvas & Hydrating',
    desc: 'Executing client-side Babel transform and mounting responsive live interactive DOM',
    icon: Sparkles,
    threshold: 100
  }
];

const TELEMETRY_LOGS = [
  'Initializing Gemini Vision 3.1 neural tokenizer...',
  'Extracting visual semantics: layout columns, aspect ratio & card density...',
  'Resolving design tokens: Apple iOS 26 liquid glassmorphism & Lucide vectors...',
  'Synthesizing production React 18 functional component with hooks...',
  'Applying atomic Tailwind CSS utility classes and responsive breakpoints...',
  'Generating stateful user interactions: booking forms, hover sheets, tab filters...',
  'Allocating unique Redux CMS field keys for SectionStore persistence...',
  'Finalizing AST compilation and preparing live preview hydration...'
];

export default function NeuralSynthesisCanvas({ progressPercent = 0, elapsedSeconds = 0, targetPage = 'Home', sectionName = 'Custom' }) {
  const [visibleLogs, setVisibleLogs] = useState([]);

  // Compute active stage based on current percentage
  const currentStageIndex = SYNTHESIS_STAGES.findIndex(s => progressPercent <= s.threshold);
  const activeStage = SYNTHESIS_STAGES[currentStageIndex !== -1 ? currentStageIndex : SYNTHESIS_STAGES.length - 1];

  // Incrementally stream telemetry logs
  useEffect(() => {
    const logIndex = Math.min(
      Math.floor((progressPercent / 100) * TELEMETRY_LOGS.length),
      TELEMETRY_LOGS.length - 1
    );
    setVisibleLogs(TELEMETRY_LOGS.slice(0, logIndex + 1));
  }, [progressPercent]);

  return (
    <div className="w-full bg-[#02050b] rounded-3xl border border-cyan-500/30 overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] relative flex flex-col min-h-[580px]">
      
      {/* Top Neural Telemetry Bar */}
      <div className="px-5 py-3.5 bg-black/60 backdrop-blur-2xl border-b border-white/10 flex flex-wrap items-center justify-between gap-3 z-20">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping absolute opacity-75" />
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide uppercase">Neural Synthesis Engine</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-bold">
                Gemini 3.1 &bull; Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Target: <span className="text-slate-200 font-bold">{targetPage}</span> / <span className="text-cyan-400 font-bold">{sectionName}</span>
            </p>
          </div>
        </div>

        {/* Elapsed Timer & Progress Percentage */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 font-mono text-xs text-slate-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>{elapsedSeconds.toFixed(1)}s elapsed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
              {Math.min(100, Math.round(progressPercent))}%
            </span>
          </div>
        </div>
      </div>

      {/* Fluid Neural Progress Bar */}
      <div className="w-full h-1.5 bg-white/5 relative overflow-hidden z-20">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-400 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(6,182,212,0.8)]"
          style={{ width: `${Math.min(100, progressPercent)}%` }}
        />
        {/* Glow head */}
        <div
          className="absolute top-0 bottom-0 w-8 bg-white blur-[4px] -translate-x-full transition-all duration-300"
          style={{ left: `${Math.min(100, progressPercent)}%` }}
        />
      </div>

      {/* Blueprint Wireframe Canvas Area */}
      <div className="relative flex-1 bg-blueprint-grid p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
        
        {/* Sweeping Laser Beam */}
        <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_18px_rgba(6,182,212,0.9)] animate-laser-sweep pointer-events-none z-10" />

        {/* Blueprint Coordinates & Ambient Crosshairs */}
        <div className="absolute top-4 left-4 text-[10px] font-mono text-cyan-500/40 select-none">
          + LAT: 37.7749 // LNG: -122.4194 [LAYOUT_MATRIX_INIT]
        </div>
        <div className="absolute top-4 right-4 text-[10px] font-mono text-cyan-500/40 select-none">
          VIEWPORT_SCALE: 1.00 // DENSITY: 3x +
        </div>

        {/* Simulated Blueprint Wireframe Skeleton */}
        <div className="max-w-4xl mx-auto w-full my-auto flex flex-col gap-6 opacity-75">
          
          {/* Skeleton Header */}
          <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
            <div className="h-6 w-36 rounded-lg bg-cyan-500/10 border border-cyan-500/20 animate-pulse" />
            <div className="flex items-center gap-3">
              <div className="h-4 w-16 rounded bg-cyan-500/10 border border-cyan-500/15" />
              <div className="h-4 w-16 rounded bg-cyan-500/10 border border-cyan-500/15" />
              <div className="h-8 w-24 rounded-full bg-cyan-500/20 border border-cyan-500/30" />
            </div>
          </div>

          {/* Skeleton Hero Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left Column Text / Heading Skeleton */}
            <div className="md:col-span-7 flex flex-col gap-4">
              <div className="h-5 w-28 rounded-full bg-cyan-400/20 border border-cyan-400/40 animate-pulse" />
              <div className="space-y-2">
                <div className="h-9 w-full rounded-xl bg-cyan-500/15 border border-cyan-500/25 animate-wireframe-pulse" />
                <div className="h-9 w-3/4 rounded-xl bg-cyan-500/15 border border-cyan-500/25 animate-wireframe-pulse" />
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="h-3 w-5/6 rounded bg-slate-700/40" />
                <div className="h-3 w-4/6 rounded bg-slate-700/40" />
              </div>
              <div className="flex items-center gap-3 pt-3">
                <div className="h-11 w-36 rounded-2xl bg-gradient-to-r from-blue-600/40 to-cyan-500/40 border border-cyan-400/40 shadow-sm animate-pulse" />
                <div className="h-11 w-32 rounded-2xl bg-white/[0.04] border border-white/10" />
              </div>
            </div>

            {/* Right Column Interactive Cards Skeleton */}
            <div className="md:col-span-5 flex flex-col gap-3">
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 shadow-lg animate-wireframe-pulse flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 rounded bg-cyan-400/30" />
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                </div>
                <div className="h-14 w-full rounded-xl bg-cyan-500/10 border border-cyan-500/20" />
                <div className="flex justify-between items-center pt-1">
                  <div className="h-3 w-16 rounded bg-slate-600/40" />
                  <div className="h-3 w-10 rounded bg-emerald-400/40" />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/20 flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-28 rounded bg-cyan-400/20" />
                  <div className="h-2.5 w-20 rounded bg-slate-600/40" />
                </div>
              </div>
            </div>

          </div>

          {/* Active Stage Banner Overlay */}
          <div className="mt-2 p-4 rounded-2xl bg-black/75 backdrop-blur-xl border border-cyan-500/40 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-up">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center flex-shrink-0 text-cyan-300">
                <activeStage.icon className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                    Phase 0{activeStage.step} of 05
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                </div>
                <h4 className="text-sm font-bold text-white tracking-tight mt-0.5">
                  {activeStage.title}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {activeStage.desc}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-300 self-start sm:self-auto">
              <Zap className="w-3.5 h-3.5" />
              <span>Synthesizing...</span>
            </div>
          </div>

        </div>

        {/* Live Streaming Telemetry Terminal */}
        <div className="mt-4 p-3.5 rounded-2xl bg-black/80 backdrop-blur-2xl border border-white/10 font-mono text-[11px] text-slate-400 max-h-28 overflow-hidden flex flex-col justify-end">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/8 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-cyan-400" />
              <span>Real-Time Neural Telemetry Stream</span>
            </span>
            <span>Gemini 3.1 &bull; Active</span>
          </div>
          <div className="space-y-1">
            {visibleLogs.slice(-3).map((log, idx) => (
              <div key={idx} className="flex items-center gap-2 truncate">
                <span className="text-cyan-400 font-bold">&gt;</span>
                <span className={idx === visibleLogs.slice(-3).length - 1 ? 'text-cyan-200 font-semibold' : 'text-slate-400'}>
                  {log}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
