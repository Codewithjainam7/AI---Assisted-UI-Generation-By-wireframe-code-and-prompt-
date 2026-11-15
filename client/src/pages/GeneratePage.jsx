import React, { useState } from 'react';
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
  ArrowRight
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
import { submitGenerateJob, clearHistory } from '../features/generate/generateSlice';

const MODES = [
  { id: 'wireframe', label: 'Wireframe', iconComponent: ImageIcon },
  { id: 'code',      label: 'Code',      iconComponent: Code2 },
  { id: 'prompt',    label: 'Prompt',    iconComponent: Sparkles },
  { id: 'combined',  label: 'Combined',  iconComponent: Layers },
];

const STEPS = ['Parsing Vision/AST', 'Synthesizing IR', 'Generating JSX', 'Allocating Field IDs', 'Syncing CMS Store'];

const SAMPLE_PROMPT = `Create a fitness hero for Pulse Fit. Layout: two columns on desktop, stacked on mobile.
Left: athlete image. Right: uppercase red badge "PULSE FIT", bold headline "CHALLENGE YOUR LIMITS",
subheading "Be a part of the tribe that's limitless.", body paragraph about trainer-led workout sessions,
three stat cards (1000+ Community Members / 40+ Fitness Programmes / 150+ Fitness Channels),
and a red filled CTA button "FIND A WORKOUT". White background, red accent.`;

const SAMPLE_CODE = `import React from 'react';

export default function HeroSection() {
  return (
    <section className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <img src="/hero.jpg" alt="Athlete" className="max-w-full h-auto" />
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 space-y-4">
        <span className="text-red-500 uppercase font-bold">PULSE FIT</span>
        <h1 className="text-5xl font-black">CHALLENGE YOUR LIMITS</h1>
        <p className="text-gray-500">Join our community of fitness enthusiasts.</p>
        <button className="bg-red-500 text-white px-8 py-3 rounded-full">FIND A WORKOUT</button>
      </div>
    </section>
  );
}`;

export default function GeneratePage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const { status, currentJob, error, jobs, currentStep } = useSelector(state => state.generate);

  const [activeMode,     setActiveMode]     = useState('wireframe');
  const [wireframeFile,  setWireframeFile]  = useState(null);
  const [codeValue,      setCodeValue]      = useState('');
  const [promptValue,    setPromptValue]    = useState('');
  const [optionalPrompt, setOptionalPrompt] = useState('');
  const [pageName,       setPageName]       = useState('Home');
  const [sectionName,    setSectionName]    = useState('Custom');
  const [showOptions,    setShowOptions]    = useState(false);
  const [copySuccess,    setCopySuccess]    = useState(false);
  const [loadingSample,  setLoadingSample]  = useState(false);

  // Results view mode: 'split' | 'preview' | 'code'
  const [resultViewMode, setResultViewMode] = useState('split');
  const [previewViewport, setPreviewViewport] = useState('desktop');

  const loadSampleWireframe = async () => {
    setLoadingSample(true);
    try {
      const storageUrl = import.meta.env.VITE_STORAGE_URL || 'http://localhost:4000/storage/';
      const res = await fetch(`${storageUrl}default/images/hero-placeholder.jpg`);
      const blob = await res.blob();
      const sampleFile = new File([blob], 'sample-hero-wireframe.jpg', { type: 'image/jpeg' });
      setWireframeFile(sampleFile);
      setOptionalPrompt('Hero section with athlete image on left, pulse fit branding and 3 stats');
    } catch (e) {
      console.warn('Failed to load sample wireframe', e);
    } finally {
      setLoadingSample(false);
    }
  };

  const handleGenerate = async () => {
    const formData = new FormData();
    formData.append('mode',        activeMode);
    formData.append('pageName',    pageName);
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
        <div className="py-8 md:py-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold text-cyan-300 mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Neural Vision 3.1 &bull; Redux CMS Pipeline</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">
              Studio <span className="gradient-text-liquid">Workspace</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
              Synthesize production-grade React components with live Redux CMS state from wireframes, code, or natural language prompts.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs text-slate-400 font-medium">Target Page:</span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-bold text-white font-mono shadow-sm">
              {pageName}
            </span>
          </div>
        </div>

        {/* Main Grid: Workspace & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">

          {/* Left Column: Generation Studio Canvas */}
          <div className="lg:col-span-3 flex flex-col gap-6">

            {/* Mode Selector & Quick Fill Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <PillTab tabs={MODES} active={activeMode} onChange={setActiveMode} />

              <div className="flex items-center gap-2">
                {activeMode === 'wireframe' && (
                  <button
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
                    onClick={() => setPromptValue(SAMPLE_PROMPT)}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-cyan-400 hover:text-cyan-300 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Load Sample Prompt</span>
                  </button>
                )}
                {activeMode === 'code' && (
                  <button
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
            <GlassCard className="flex flex-col gap-6">

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
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Image Staged</span>
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
                      placeholder="e.g. Ensure 2 large meal cards, pink profile sidebar, and calorie gauge"
                      className="w-full bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/15 transition-all shadow-inner"
                    />
                  </div>
                </div>
              )}

              {/* 2. Code Mode */}
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
                    value={codeValue}
                    onChange={(e) => setCodeValue(e.target.value)}
                    placeholder="Paste JSX code here. The parser extracts content elements, binds CMS IDs, and outputs clean dynamic components..."
                    className="w-full h-52 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-white font-mono text-xs placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/15 resize-none transition-all shadow-inner leading-relaxed"
                  />
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-2">
                      Enhancement Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={optionalPrompt}
                      onChange={(e) => setOptionalPrompt(e.target.value)}
                      placeholder="e.g. Add 3 responsive stat badges and upgrade styling"
                      className="w-full bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/15 transition-all shadow-inner"
                    />
                  </div>
                </div>
              )}

              {/* 3. Prompt Mode */}
              {activeMode === 'prompt' && (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Natural Language Design Specification</span>
                    </label>
                  </div>
                  <textarea
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    placeholder="Describe the desired layout, hierarchy, sections, content copy, brand colors, and interactive elements..."
                    className="w-full h-44 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/15 resize-none transition-all shadow-inner leading-relaxed"
                  />
                </div>
              )}

              {/* 4. Combined Mode */}
              {activeMode === 'combined' && (
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="text-[11px] text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2 mb-2.5">
                      <ImageIcon className="w-4 h-4 text-cyan-400" />
                      <span>1. Spatial Blueprint (Wireframe Image)</span>
                    </label>
                    <DropZone onFile={setWireframeFile} currentFile={wireframeFile} accept="image/*" maxSizeMB={8} />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>2. Visual Polish & Copy Overrides (Prompt)</span>
                    </label>
                    <textarea
                      value={promptValue}
                      onChange={(e) => setPromptValue(e.target.value)}
                      placeholder="Prompt instructions take precedence for colors, typography, button copy, and interactive behavior..."
                      className="w-full h-28 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/15 resize-none transition-all shadow-inner leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* Target Metadata Configuration Drawer */}
              <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02]">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="w-full px-5 py-3.5 flex justify-between items-center hover:bg-white/[0.04] transition-colors text-left"
                >
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-slate-400" />
                    <span>Target Page & Component Architecture</span>
                  </span>
                  {showOptions ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {showOptions && (
                  <div className="p-5 bg-black/20 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/8 animate-fade-up">
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
                      placeholder="Custom"
                    />
                  </div>
                )}
              </div>

              {/* Primary Synthesize Action Button */}
              <button
                onClick={handleGenerate}
                disabled={status === 'loading'}
                className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2.5 ${
                  status === 'loading'
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                    : 'liquid-button text-white shadow-liquid-glow active:scale-[0.99]'
                }`}
              >
                {status === 'loading' ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-cyan-300" />
                    <span>Analyzing Blueprint & Synthesizing React Section...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 text-cyan-300" />
                    <span>Synthesize React Section ✦</span>
                  </>
                )}
              </button>
            </GlassCard>

            {/* Pipeline Step Progress Bar */}
            {status === 'loading' && (
              <GlassCard className="animate-fade-up">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[11px] text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>Neural Pipeline Active</span>
                  </p>
                  <span className="text-xs text-cyan-400 font-mono animate-pulse">Running Gemini Vision 3.1...</span>
                </div>
                <StepProgress currentStep={currentStep} steps={STEPS} />
              </GlassCard>
            )}

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

            {/* Live Studio Result Panel */}
            {currentJob && (
              <div className="flex flex-col gap-5 animate-fade-up">
                
                {/* Result Status Banner */}
                <GlassCard className="border border-emerald-500/30 py-4.5 bg-emerald-500/[0.03]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Section Generated & Bound to Redux Store</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 font-mono">
                        <span>Section ID:</span>
                        <span className="font-bold text-white px-2 py-0.5 rounded bg-white/10">{currentJob.sectionId}</span>
                        <span>•</span>
                        <span>Page:</span>
                        <span className="font-bold text-white px-2 py-0.5 rounded bg-white/10">{currentJob.pageName || pageName}</span>
                      </p>
                    </div>

                    {/* View mode switcher */}
                    <div className="flex items-center gap-1 bg-white/[0.05] rounded-full p-1 border border-white/10 shadow-inner">
                      <button
                        onClick={() => setResultViewMode('preview')}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          resultViewMode === 'preview'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>
                      <button
                        onClick={() => setResultViewMode('split')}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          resultViewMode === 'split'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Columns2 className="w-3.5 h-3.5" />
                        <span>Split</span>
                      </button>
                      <button
                        onClick={() => setResultViewMode('code')}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          resultViewMode === 'code'
                            ? 'bg-blue-600 text-white shadow-sm'
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
                        onClick={() => navigate(`/preview/${currentJob.pageName || pageName}`)}
                        className="px-4 py-2 rounded-full bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                      >
                        <span>Open Studio Preview</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={downloadZip}
                        className="px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-white font-medium transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download ZIP</span>
                      </button>
                      <button
                        onClick={copyJsx}
                        className="px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-white font-medium transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copySuccess ? 'Copied Code!' : 'Copy JSX'}</span>
                      </button>
                    </div>

                    {resultViewMode !== 'code' && (
                      <div className="flex items-center gap-1 bg-white/[0.04] rounded-full p-0.5 border border-white/10">
                        <button
                          onClick={() => setPreviewViewport('mobile')}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                            previewViewport === 'mobile' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Smartphone className="w-3 h-3" />
                          <span>375px</span>
                        </button>
                        <button
                          onClick={() => setPreviewViewport('desktop')}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                            previewViewport === 'desktop' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
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
                      <div className="w-full bg-[#030508] rounded-3xl border border-white/12 p-3.5 shadow-2xl flex justify-center min-h-[550px] max-h-[850px] overflow-y-auto overflow-x-hidden scroll-smooth">
                        <div
                          className={`bg-slate-950 rounded-2xl transition-all duration-300 w-full pb-8 ${
                            previewViewport === 'mobile' ? 'max-w-[375px]' : 'max-w-full'
                          }`}
                        >
                          <LiveComponentRenderer code={currentJob?.jsx} pageName={currentJob.pageName || pageName} job={currentJob} />
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
                        maxHeight={resultViewMode === 'split' ? '650px' : '700px'}
                      />
                    </div>
                  )}

                </div>
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
