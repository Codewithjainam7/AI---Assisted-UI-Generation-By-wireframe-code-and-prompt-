import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Image as ImageIcon,
  Code2,
  Sparkles,
  Layers,
  Sliders,
  Eye,
  Columns2,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
  Download,
  Copy,
  Check,
  ExternalLink,
  History,
  Trash2,
  Wand2,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileCode,
  ArrowRight,
  Activity,
  Maximize2,
  Zap,
  LayoutGrid
} from 'lucide-react';
import PageShell from '../components/layout/PageShell';
import PillTab from '../components/ui/PillTab';
import DropZone from '../components/ui/DropZone';
import CodeEditor from '../components/ui/CodeEditor';
import GlassInput from '../components/ui/GlassInput';
import GlassCard from '../components/ui/GlassCard';
import StepProgress from '../components/ui/StepProgress';
import JobHistoryCard from '../components/ui/JobHistoryCard';
import LiveComponentRenderer from '../components/ui/LiveComponentRenderer';
import NeuralSynthesisCanvas from '../components/ui/NeuralSynthesisCanvas';
import { submitGenerateJob, clearHistory } from '../features/generate/generateSlice';

const MODES = [
  { id: 'wireframe', label: 'Wireframe Sketch', iconComponent: ImageIcon },
  { id: 'prompt',    label: 'Natural Prompt',   iconComponent: Sparkles },
  { id: 'code',      label: 'Existing JSX',     iconComponent: Code2 },
  { id: 'combined',  label: 'Multimodal',       iconComponent: Layers },
];

const PRESET_PROMPTS = [
  {
    id: 'doctor',
    badge: 'Doctor Portal',
    sectionName: 'DoctorAppointmentHero',
    pageName: 'Home',
    prompt: 'Design a modern doctor appointment portal with doctor profile, specialized care departments, and an interactive booking appointment form with patient details, date, and time slot.'
  },
  {
    id: 'fitness',
    badge: 'Fitness Tracker',
    sectionName: 'WellnessDashboard',
    pageName: 'Home',
    prompt: 'Create a high-end wellness and fitness dashboard with calorie ring gauge, meal tracking cards (Breakfast, Morning Snack, Dinner), active workout log, and metrics.'
  },
  {
    id: 'portfolio',
    badge: 'Portfolio Showcase',
    sectionName: 'PortfolioShowcase',
    pageName: 'Home',
    prompt: 'Create a minimalist developer & designer portfolio with featured case studies, skills grid, interactive project cards, and an interactive contact inquiry form.'
  },
  {
    id: 'dining',
    badge: 'Luxury Dining',
    sectionName: 'LuxuryDiningExperience',
    pageName: 'Home',
    prompt: 'Design an opulent luxury fine-dining restaurant site with tasting menu showcase, chef philosophy card, and a table reservation form with party size and date.'
  },
  {
    id: 'legal',
    badge: 'Legal Counsel',
    sectionName: 'LegalCounselPortal',
    pageName: 'Home',
    prompt: 'Design an authoritative corporate and legal counsel website with practice areas, lead attorney profiles, and a consultation retainer form.'
  }
];

const SAMPLE_PROMPT = PRESET_PROMPTS[0].prompt;

const SAMPLE_CODE = `import React from 'react';

export default function HeroSection() {
  return (
    <section className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-white">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md h-72 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <span className="text-cyan-400 font-mono text-sm">Visual Asset Showcase</span>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 space-y-4">
        <span className="text-cyan-400 uppercase font-bold tracking-wider text-xs">AI UI GENERATOR</span>
        <h1 className="text-5xl font-black tracking-tight">Transform Wireframes into Code</h1>
        <p className="text-slate-400 leading-relaxed">Turn sketches and ideas into production React components in seconds.</p>
        <button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-full font-bold shadow-lg">EXPLORE CANVAS</button>
      </div>
    </section>
  );
}`;

export default function GeneratePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, currentJob, error, jobs, currentStep } = useSelector(state => state.generate);

  const [activeMode, setActiveMode] = useState('wireframe');
  const [wireframeFile, setWireframeFile] = useState(null);
  const [codeValue, setCodeValue] = useState('');
  const [promptValue, setPromptValue] = useState('');
  const [optionalPrompt, setOptionalPrompt] = useState('');
  const [pageName, setPageName] = useState('Home');
  const [sectionName, setSectionName] = useState('Custom');
  const [showOptions, setShowOptions] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [loadingSample, setLoadingSample] = useState(false);

  // Results view mode: 'preview' | 'split' | 'code'
  const [resultViewMode, setResultViewMode] = useState('preview');
  const [previewViewport, setPreviewViewport] = useState('desktop');

  // Cinematic Synthesis State
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showSuccessBloom, setShowSuccessBloom] = useState(false);
  const [synthesisDuration, setSynthesisDuration] = useState(0);

  const canvasRef = useRef(null);
  const synthesisIntervalRef = useRef(null);

  // Smooth Synthesis Progress Controller
  useEffect(() => {
    if (isSynthesizing) {
      const startTime = Date.now();
      synthesisIntervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setElapsedSeconds(elapsed);

        // Smooth asymptotic progress up to 92% while waiting for network
        setProgressPercent(prev => {
          if (prev < 30) return prev + 2.2;
          if (prev < 60) return prev + 1.2;
          if (prev < 85) return prev + 0.6;
          if (prev < 93) return prev + 0.15;
          return prev;
        });
      }, 50);
    } else {
      if (synthesisIntervalRef.current) {
        clearInterval(synthesisIntervalRef.current);
      }
    }

    return () => {
      if (synthesisIntervalRef.current) {
        clearInterval(synthesisIntervalRef.current);
      }
    };
  }, [isSynthesizing]);

  // When Redux status transitions to success, complete the synthesis animation smoothly
  useEffect(() => {
    if (status === 'success' && isSynthesizing) {
      // Rapid sweep to 100%
      setProgressPercent(100);
      setShowSuccessBloom(true);
      setSynthesisDuration(elapsedSeconds > 0 ? elapsedSeconds : 1.4);

      const finishTimer = setTimeout(() => {
        setIsSynthesizing(false);
        // Scroll canvas smoothly into view if needed
        if (canvasRef.current) {
          canvasRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 450);

      return () => clearTimeout(finishTimer);
    } else if (status === 'error' && isSynthesizing) {
      setIsSynthesizing(false);
    }
  }, [status]);

  const loadSampleWireframe = async () => {
    setLoadingSample(true);
    try {
      const storageUrl = import.meta.env.VITE_STORAGE_URL || 'http://localhost:4000/storage/';
      const res = await fetch(`${storageUrl}default/images/hero-placeholder.jpg`);
      const blob = await res.blob();
      const sampleFile = new File([blob], 'sample-hero-wireframe.jpg', { type: 'image/jpeg' });
      setWireframeFile(sampleFile);
      setOptionalPrompt('Hero section with athlete image on left, pulse fit branding and 3 stats');
      setSectionName('WellnessDashboard');
    } catch (e) {
      console.warn('Failed to load sample wireframe', e);
    } finally {
      setLoadingSample(false);
    }
  };

  const applyPresetPrompt = (preset) => {
    setActiveMode('prompt');
    setPromptValue(preset.prompt);
    setSectionName(preset.sectionName);
    setPageName(preset.pageName);
  };

  const handleGenerate = async () => {
    const formData = new FormData();
    formData.append('mode', activeMode);
    formData.append('pageName', pageName);
    formData.append('sectionName', sectionName.replace(/\s+/g, '') || 'Custom');

    if (activeMode === 'wireframe') {
      let fileToSend = wireframeFile;
      if (!fileToSend) {
        try {
          const storageUrl = import.meta.env.VITE_STORAGE_URL || 'http://localhost:4000/storage/';
          const res = await fetch(`${storageUrl}default/images/hero-placeholder.jpg`);
          const blob = await res.blob();
          fileToSend = new File([blob], 'sample-wireframe.jpg', { type: 'image/jpeg' });
          setWireframeFile(fileToSend);
        } catch (e) {
          console.warn('Failed to fallback wireframe', e);
        }
      }
      if (fileToSend) formData.append('wireframe', fileToSend);
      if (optionalPrompt.trim()) formData.append('prompt', optionalPrompt);
    }

    if (activeMode === 'code') {
      const codeToSend = codeValue.trim() || SAMPLE_CODE;
      if (!codeValue.trim()) setCodeValue(SAMPLE_CODE);
      formData.append('code', codeToSend);
      if (optionalPrompt.trim()) formData.append('prompt', optionalPrompt);
    }

    if (activeMode === 'prompt') {
      const promptToSend = promptValue.trim() || SAMPLE_PROMPT;
      if (!promptValue.trim()) setPromptValue(SAMPLE_PROMPT);
      formData.append('prompt', promptToSend);
    }

    if (activeMode === 'combined') {
      if (wireframeFile) formData.append('wireframe', wireframeFile);
      formData.append('prompt', promptValue.trim() || SAMPLE_PROMPT);
      if (codeValue.trim()) formData.append('code', codeValue);
    }

    // Trigger synthesis animation stage & smooth scroll to canvas
    setIsSynthesizing(true);
    setProgressPercent(10);
    setElapsedSeconds(0);
    setShowSuccessBloom(false);

    if (canvasRef.current) {
      canvasRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    dispatch(submitGenerateJob(formData));
  };

  const downloadZip = () => {
    if (!currentJob?.sectionId) return;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
    window.open(`${apiUrl}/sections/${currentJob.sectionId}/export`, '_blank');
  };

  const copyJsx = () => {
    const text = currentJob?.jsx || currentJob?.componentFile || '';
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        {/* Studio Workspace Header */}
        <div className="py-8 md:py-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/8 relative">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-cyan-500/25 text-xs font-semibold text-cyan-300 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-2xl">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Gemini 3.1 Flash Neural Pipeline &bull; Redux Dynamic CMS</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2.5">
              Studio <span className="gradient-text-liquid">Workspace</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
              Synthesize production React components with live Redux CMS state from wireframes, code, or natural intent.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/10 shadow-sm backdrop-blur-xl">
              <span className="text-xs text-slate-400 font-medium">Target Page:</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-xs font-bold text-cyan-300 font-mono">
                {pageName}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/10 shadow-sm backdrop-blur-xl">
              <span className="text-xs text-slate-400 font-medium">Section:</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-xs font-bold text-indigo-300 font-mono">
                {sectionName}
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid: Workspace & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">

          {/* Left Column: Generation Studio Canvas */}
          <div className="lg:col-span-3 flex flex-col gap-6">

            {/* Mode Selector & Quick Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <PillTab tabs={MODES} active={activeMode} onChange={setActiveMode} />

              <div className="flex items-center gap-2">
                {activeMode === 'wireframe' && (
                  <button
                    type="button"
                    onClick={loadSampleWireframe}
                    disabled={loadingSample}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-cyan-400 hover:text-cyan-300 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Download className={`w-3.5 h-3.5 ${loadingSample ? 'animate-spin' : ''}`} />
                    <span>Load Sample Wireframe</span>
                  </button>
                )}
                {activeMode === 'prompt' && (
                  <button
                    type="button"
                    onClick={() => applyPresetPrompt(PRESET_PROMPTS[0])}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-cyan-400 hover:text-cyan-300 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Doctor Preset</span>
                  </button>
                )}
                {activeMode === 'code' && (
                  <button
                    type="button"
                    onClick={() => setCodeValue(SAMPLE_CODE)}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-cyan-400 hover:text-cyan-300 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Load Sample JSX</span>
                  </button>
                )}
              </div>
            </div>

            {/* Input Card Container */}
            <GlassCard className="flex flex-col gap-6 shadow-2xl">

              {/* 1. Wireframe Mode */}
              {activeMode === 'wireframe' && (
                <div className="flex flex-col gap-5">
                  <div>
                    <div className="flex justify-between items-center mb-2.5">
                      <label className="text-[11px] text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-cyan-400" />
                        <span>Wireframe Sketch or Screenshot</span>
                      </label>
                      {wireframeFile && (
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Image Staged for Vision Analysis</span>
                        </span>
                      )}
                    </div>
                    <DropZone onFile={setWireframeFile} currentFile={wireframeFile} accept="image/*" maxSizeMB={8} />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-2">
                      Design Directives / Intent Overrides (Optional)
                    </label>
                    <input
                      type="text"
                      value={optionalPrompt}
                      onChange={(e) => setOptionalPrompt(e.target.value)}
                      placeholder="e.g. Include 2 highlight cards, booking appointment form, and cyan liquid buttons"
                      className="w-full bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-500/15 transition-all shadow-inner"
                    />
                  </div>
                </div>
              )}

              {/* 2. Prompt Mode with Preset Chips */}
              {activeMode === 'prompt' && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-[11px] text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>Natural Language Specification</span>
                    </label>
                    <span className="text-xs text-slate-400 font-mono">
                      {promptValue.length} characters
                    </span>
                  </div>

                  {/* Preset Domain Chips */}
                  <div className="flex flex-wrap items-center gap-2 pb-1">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>Quick Presets:</span>
                    </span>
                    {PRESET_PROMPTS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => applyPresetPrompt(preset)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 border shadow-sm ${
                          sectionName === preset.sectionName
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                            : 'bg-white/[0.04] text-slate-400 hover:text-white border-white/10 hover:bg-white/[0.08]'
                        }`}
                      >
                        <span>{preset.badge}</span>
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={5}
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    placeholder="Describe your desired layout, color scheme, sections, card metrics, or forms..."
                    className="w-full bg-black/40 backdrop-blur-2xl border border-white/12 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-500/15 transition-all resize-none shadow-inner leading-relaxed"
                  />
                </div>
              )}

              {/* 3. Code Mode */}
              {activeMode === 'code' && (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-emerald-400" />
                      <span>Existing JSX Component Code</span>
                    </label>
                    <span className="text-xs text-slate-400 font-mono">React 18 / Tailwind</span>
                  </div>
                  <textarea
                    rows={8}
                    value={codeValue}
                    onChange={(e) => setCodeValue(e.target.value)}
                    placeholder="Paste your JSX code here to parse and re-synthesize..."
                    className="w-full bg-black/50 backdrop-blur-2xl border border-white/12 rounded-2xl p-4 text-xs font-mono text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-500/15 transition-all resize-none shadow-inner leading-relaxed"
                  />
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-2">
                      Code Refactoring Directives (Optional)
                    </label>
                    <input
                      type="text"
                      value={optionalPrompt}
                      onChange={(e) => setOptionalPrompt(e.target.value)}
                      placeholder="e.g. Convert to dark glass theme and add interactive booking modal"
                      className="w-full bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-500/15 transition-all shadow-inner"
                    />
                  </div>
                </div>
              )}

              {/* 4. Combined Multimodal Mode */}
              {activeMode === 'combined' && (
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] text-slate-300 font-bold uppercase tracking-wider block mb-2">
                        Wireframe Image
                      </label>
                      <DropZone onFile={setWireframeFile} currentFile={wireframeFile} accept="image/*" maxSizeMB={8} />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-300 font-bold uppercase tracking-wider block mb-2">
                        Guiding Intent / Spec
                      </label>
                      <textarea
                        rows={6}
                        value={promptValue}
                        onChange={(e) => setPromptValue(e.target.value)}
                        placeholder="Specify brand colors, text hierarchy, or special form requirements..."
                        className="w-full bg-black/40 backdrop-blur-2xl border border-white/12 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-500/15 transition-all resize-none shadow-inner"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Collapsible Target Page & Section Configuration Drawer */}
              <div className="rounded-2xl border border-white/8 overflow-hidden bg-white/[0.02]">
                <button
                  type="button"
                  onClick={() => setShowOptions(!showOptions)}
                  className="w-full px-5 py-3.5 flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <span>Target Page & Component Architecture</span>
                    <span className="text-[11px] font-mono text-slate-500">
                      ({pageName} / {sectionName})
                    </span>
                  </span>
                  {showOptions ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {showOptions && (
                  <div className="p-5 bg-black/30 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/8 animate-fade-up">
                    <GlassInput
                      label="Page Name"
                      value={pageName}
                      onChange={(e) => setPageName(e.target.value)}
                      placeholder="Home"
                    />
                    <GlassInput
                      label="Section Name (PascalCase)"
                      value={sectionName}
                      onChange={(e) => setSectionName(e.target.value)}
                      placeholder="CustomSection"
                    />
                  </div>
                )}
              </div>

              {/* Primary Synthesize Action Button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isSynthesizing || status === 'loading'}
                className={`w-full py-4.5 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-3 relative overflow-hidden select-none ${
                  isSynthesizing || status === 'loading'
                    ? 'liquid-button-generating text-white cursor-wait'
                    : 'liquid-button text-white shadow-liquid-glow active:scale-[0.99]'
                }`}
              >
                {isSynthesizing || status === 'loading' ? (
                  <>
                    <div className="relative flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 animate-spin text-cyan-200" />
                      <span className="absolute w-2 h-2 rounded-full bg-white animate-ping opacity-75" />
                    </div>
                    <span className="tracking-wide">
                      Synthesizing Neural Blueprint... ({elapsedSeconds.toFixed(1)}s)
                    </span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 text-cyan-300 animate-pulse" />
                    <span className="tracking-wide">Synthesize React Section ✦</span>
                  </>
                )}
              </button>
            </GlassCard>

            {/* Error Message Card */}
            {status === 'error' && (
              <GlassCard className="animate-fade-up border border-rose-500/30 bg-rose-500/[0.05]">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-rose-300">Synthesis Encountered an Issue</h3>
                    <p className="text-slate-300 text-xs mt-1 leading-relaxed">{error}</p>
                    <p className="text-slate-500 text-[11px] mt-2 font-mono">Verify backend server is active on port 4000.</p>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Canvas Target Anchor */}
            <div ref={canvasRef} className="scroll-mt-8" />

            {/* Dynamic Synthesis State or Live Studio Result Panel */}
            {isSynthesizing ? (
              <div className="animate-fade-up">
                <NeuralSynthesisCanvas
                  progressPercent={progressPercent}
                  elapsedSeconds={elapsedSeconds}
                  targetPage={pageName}
                  sectionName={sectionName}
                />
              </div>
            ) : currentJob ? (
              <div className={`flex flex-col gap-5 ${showSuccessBloom ? 'animate-liquid-bloom' : 'animate-fade-up'}`}>
                
                {/* Result Status Chrome Banner */}
                <GlassCard className="border border-emerald-500/30 py-4 bg-emerald-500/[0.03]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <h3 className="text-sm font-bold text-emerald-300">
                          Section Synthesized & Hydrated to Redux CMS
                        </h3>
                        {synthesisDuration > 0 && (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                            Completed in {synthesisDuration.toFixed(1)}s
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2 font-mono">
                        <span>ID:</span>
                        <span className="font-bold text-white px-2 py-0.5 rounded bg-white/10">{currentJob.sectionId}</span>
                        <span>&bull;</span>
                        <span>Page:</span>
                        <span className="font-bold text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/10">{currentJob.pageName || pageName}</span>
                        <span>&bull;</span>
                        <span>Component:</span>
                        <span className="text-slate-300">{currentJob.componentFile || 'CustomSection.jsx'}</span>
                      </p>
                    </div>

                    {/* View mode switcher */}
                    <div className="flex items-center gap-1 bg-black/40 rounded-full p-1 border border-white/10 shadow-inner">
                      <button
                        type="button"
                        onClick={() => setResultViewMode('preview')}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          resultViewMode === 'preview'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setResultViewMode('split')}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          resultViewMode === 'split'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Columns2 className="w-3.5 h-3.5" />
                        <span>Split</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setResultViewMode('code')}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          resultViewMode === 'code'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Code</span>
                      </button>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex flex-wrap gap-2.5 pt-4 mt-4 border-t border-white/8 items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/preview/${currentJob.pageName || pageName}`)}
                        className="px-4 py-2 rounded-full bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                      >
                        <span>Open Studio Preview</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={downloadZip}
                        className="px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-white font-medium transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download ZIP</span>
                      </button>
                      <button
                        type="button"
                        onClick={copyJsx}
                        className="px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-white font-medium transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copySuccess ? 'Copied Code!' : 'Copy JSX'}</span>
                      </button>
                    </div>

                    {resultViewMode !== 'code' && (
                      <div className="flex items-center gap-1 bg-white/[0.04] rounded-full p-1 border border-white/10">
                        <button
                          type="button"
                          onClick={() => setPreviewViewport('mobile')}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                            previewViewport === 'mobile' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Smartphone className="w-3 h-3" />
                          <span>Mobile</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewViewport('tablet')}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                            previewViewport === 'tablet' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Tablet className="w-3 h-3" />
                          <span>Tablet</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewViewport('desktop')}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                            previewViewport === 'desktop' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Monitor className="w-3 h-3" />
                          <span>Desktop</span>
                        </button>
                      </div>
                    )}
                  </div>
                </GlassCard>

                {/* View Area: Live Preview / Split / Code */}
                <div className={`grid gap-6 ${resultViewMode === 'split' ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
                  
                  {/* Live Rendered Canvas */}
                  {(resultViewMode === 'split' || resultViewMode === 'preview') && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Live Interactive Rendered UI</span>
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">React 18 &bull; Redux CMS</span>
                      </div>
                      
                      {/* Window Frame with macOS traffic dots */}
                      <div className="w-full bg-[#02050b] rounded-3xl border border-white/12 overflow-hidden shadow-2xl flex flex-col min-h-[550px] max-h-[850px]">
                        <div className="px-4 py-2.5 bg-black/60 border-b border-white/8 flex items-center justify-between text-xs font-mono text-slate-400 select-none">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                            <span className="ml-2 text-slate-400 text-[11px] font-semibold">{currentJob.pageName || pageName} &bull; {currentJob.sectionName || sectionName}</span>
                          </div>
                          <span className="text-[11px] text-slate-500">
                            {previewViewport === 'mobile' ? '375px (Mobile)' : previewViewport === 'tablet' ? '768px (Tablet)' : '100% (Responsive Desktop)'}
                          </span>
                        </div>

                        <div className="flex-1 p-3.5 flex justify-center overflow-y-auto overflow-x-hidden scroll-smooth">
                          <div
                            className={`bg-slate-950 rounded-2xl transition-all duration-300 w-full pb-8 ${
                              previewViewport === 'mobile' ? 'max-w-[375px]' : previewViewport === 'tablet' ? 'max-w-[768px]' : 'max-w-full'
                            }`}
                          >
                            <LiveComponentRenderer code={currentJob?.jsx} pageName={currentJob.pageName || pageName} job={currentJob} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Generated Code Editor */}
                  {(resultViewMode === 'split' || resultViewMode === 'code') && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                          <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Production React Component</span>
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">{currentJob.componentFile || 'CustomSection.jsx'}</span>
                      </div>
                      <CodeEditor
                        value={currentJob.jsx || ''}
                        readOnly={true}
                        language="jsx"
                        fileName={currentJob.componentFile || 'CustomSection.jsx'}
                        maxHeight={resultViewMode === 'split' ? '650px' : '720px'}
                      />
                    </div>
                  )}

                </div>
              </div>
            ) : (
              /* Idle Empty Canvas Placeholder */
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.01] p-12 text-center flex flex-col items-center justify-center gap-3 min-h-[380px]">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-500 shadow-inner">
                  <LayoutGrid className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">Studio Canvas Ready</h3>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                  Drop a wireframe sketch above or select a preset prompt to synthesize a production React component with live Redux state.
                </p>
                <button
                  type="button"
                  onClick={() => applyPresetPrompt(PRESET_PROMPTS[0])}
                  className="mt-2 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-cyan-400 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Try Doctor Appointment Preset</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Generation History Sidebar */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-bold flex items-center gap-2">
                <History className="w-3.5 h-3.5 text-slate-400" />
                <span>Recent Generations</span>
              </p>
              {jobs.length > 0 && (
                <button
                  type="button"
                  onClick={() => dispatch(clearHistory())}
                  className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                  title="Clear history"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {jobs.length === 0 ? (
              <GlassCard className="text-center py-10 text-slate-500 text-xs">
                <p>No recent components generated yet.</p>
                <p className="text-[11px] mt-1 text-slate-600">Generated sections will appear here.</p>
              </GlassCard>
            ) : (
              <div className="flex flex-col gap-2">
                {jobs.map((j) => (
                  <JobHistoryCard key={j.sectionId || j.timestamp} job={j} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </PageShell>
  );
}
