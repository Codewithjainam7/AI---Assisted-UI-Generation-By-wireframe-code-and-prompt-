import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
  { id: 'wireframe', label: 'Wireframe', icon: '🖼️' },
  { id: 'code',      label: 'Code',      icon: '💻' },
  { id: 'prompt',    label: 'Prompt',    icon: '✍️' },
  { id: 'combined',  label: 'Combined',  icon: '⚡' },
];

const STEPS = ['Parsing Input', 'Building IR', 'Synthesizing JSX', 'Allocating IDs', 'Saved to Store'];

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

  // Helper to load sample wireframe
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
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20">

        {/* Header */}
        <div className="py-8 md:py-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 text-xs font-medium text-gray-300 mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            AI-Assisted UI Studio (Nemotron 3 Ultra + Gemini 2.5 Flash)
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">
            ✦ Generation <span className="gradient-text">Studio</span>
          </h1>
          <p className="text-gray-400 text-sm">Generate production React components with live CMS bindings from wireframe, code, or prompt.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* ── Main Workspace ──────────────────────── */}
          <div className="lg:col-span-3 flex flex-col gap-6">

            {/* Mode selector */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <PillTab tabs={MODES} active={activeMode} onChange={setActiveMode} />

              {activeMode === 'wireframe' && (
                <button
                  onClick={loadSampleWireframe}
                  disabled={loadingSample}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium glass border border-white/10 text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors flex items-center gap-1.5"
                >
                  <i className={`pi ${loadingSample ? 'pi-spin pi-spinner' : 'pi-download'} text-xs`} />
                  Load Sample Wireframe
                </button>
              )}
              {activeMode === 'prompt' && (
                <button
                  onClick={() => setPromptValue(SAMPLE_PROMPT)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium glass border border-white/10 text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors flex items-center gap-1.5"
                >
                  <i className="pi pi-file-edit text-xs" />
                  Load Sample Prompt
                </button>
              )}
              {activeMode === 'code' && (
                <button
                  onClick={() => setCodeValue(SAMPLE_CODE)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium glass border border-white/10 text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors flex items-center gap-1.5"
                >
                  <i className="pi pi-code text-xs" />
                  Load Sample JSX
                </button>
              )}
            </div>

            {/* Input Panel */}
            <GlassCard className="flex flex-col gap-5">

              {/* Wireframe Mode */}
              {activeMode === 'wireframe' && (
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs text-gray-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <span>🖼️</span> Upload Wireframe Sketch or Screenshot
                      </p>
                      {wireframeFile && (
                        <span className="text-xs text-green-400 font-medium flex items-center gap-1">
                          <i className="pi pi-check text-xs" /> Ready to generate
                        </span>
                      )}
                    </div>
                    <DropZone onFile={setWireframeFile} currentFile={wireframeFile} accept="image/*" maxSizeMB={8} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-1.5 font-medium">Optional: Design Notes / Copy Tweaks</p>
                    <input
                      type="text"
                      value={optionalPrompt}
                      onChange={(e) => setOptionalPrompt(e.target.value)}
                      placeholder="e.g. Make CTA red and use 3 stat cards for a fitness brand"
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500/60"
                    />
                  </div>
                </div>
              )}

              {/* Code Mode */}
              {activeMode === 'code' && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-gray-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <span>💻</span> Paste Static React / JSX
                    </p>
                  </div>
                  <CodeEditor
                    value={codeValue}
                    onChange={setCodeValue}
                    language="jsx"
                    placeholder="Paste your static JSX here... (or click 'Load Sample JSX' above)"
                  />
                </div>
              )}

              {/* Prompt Mode */}
              {activeMode === 'prompt' && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-gray-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <span>✍️</span> Natural Language Prompt
                    </p>
                  </div>
                  <textarea
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    placeholder="Describe the section you want to generate...&#10;&#10;e.g. Create a fitness hero for Pulse Fit. Left: athlete image. Right: red badge, bold headline, 3 stats, red CTA."
                    className="w-full h-44 bg-black/20 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 resize-none text-sm leading-relaxed transition-all"
                  />
                </div>
              )}

              {/* Combined Mode */}
              {activeMode === 'combined' && (
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-xs text-gray-300 font-semibold uppercase tracking-wider mb-2">1. Wireframe Image (Spatial Layout)</p>
                    <DropZone onFile={setWireframeFile} currentFile={wireframeFile} accept="image/*" maxSizeMB={8} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-300 font-semibold uppercase tracking-wider mb-1.5">2. Prompt Overrides (Colours, Copy, CTA)</p>
                    <textarea
                      value={promptValue}
                      onChange={(e) => setPromptValue(e.target.value)}
                      placeholder="Prompt instructions take precedence for colours, copy, and CTA behaviour..."
                      className="w-full h-28 bg-black/20 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-red-500/60 resize-none text-sm transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Options Accordion */}
              <div className="border border-white/8 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="w-full bg-white/3 px-4 py-3 flex justify-between items-center hover:bg-white/6 transition-colors text-left"
                >
                  <span className="text-sm font-medium text-gray-300">⚙️ Target Page & Section Metadata</span>
                  <i className={`pi pi-chevron-${showOptions ? 'up' : 'down'} text-xs text-gray-500`} />
                </button>
                {showOptions && (
                  <div className="p-4 bg-black/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={status === 'loading'}
                className={`w-full py-4 rounded-full font-bold text-lg transition-all focus-visible:ring-2 focus-visible:ring-red-500 ${
                  status === 'loading'
                    ? 'bg-zinc-800 text-gray-500 cursor-not-allowed'
                    : 'shimmer-bg text-white hover:shadow-glow-red active:scale-[0.98]'
                }`}
              >
                {status === 'loading' ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="pi pi-spin pi-spinner" />
                    <span>Analyzing & Synthesizing React Section...</span>
                  </span>
                ) : (
                  <span>Generate Section from {MODES.find(m => m.id === activeMode)?.label} ✦</span>
                )}
              </button>
            </GlassCard>

            {/* Progress Bar */}
            {status === 'loading' && (
              <GlassCard className="animate-fade-up">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-xs text-gray-300 font-semibold uppercase tracking-wider">AI Generation Pipeline Active</p>
                  <span className="text-xs text-red-400 font-mono animate-pulse">Running Gemini Vision + Nemotron...</span>
                </div>
                <StepProgress currentStep={currentStep} steps={STEPS} />
              </GlassCard>
            )}

            {/* ── Live Generated Studio (Side-by-Side Live Preview + Code) ────────── */}
            {currentJob && (
              <div className="flex flex-col gap-4 animate-fade-up">
                {/* Result Status Banner */}
                <GlassCard className="border border-green-500/30 shadow-glow-sm py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-green-400 flex items-center gap-2">
                        <span>✅</span> Section Generated & Bound to Redux Store
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Section ID: <span className="font-mono text-white font-bold">{currentJob.sectionId}</span>
                        <span className="mx-2">•</span>
                        Page: <span className="font-mono text-white font-bold">{currentJob.pageName || pageName}</span>
                      </p>
                    </div>

                    {/* View mode switcher */}
                    <div className="flex items-center gap-1 bg-black/50 rounded-full p-1 border border-white/10">
                      <button
                        onClick={() => setResultViewMode('preview')}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          resultViewMode === 'preview' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        🖥️ Live Preview
                      </button>
                      <button
                        onClick={() => setResultViewMode('split')}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          resultViewMode === 'split' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        🌓 Split View
                      </button>
                      <button
                        onClick={() => setResultViewMode('code')}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          resultViewMode === 'code' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        💻 Code (JSX)
                      </button>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex flex-wrap gap-2.5 pt-3 mt-3 border-t border-white/10 items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => navigate(`/preview/${currentJob.pageName || pageName}`)}
                        className="px-4 py-2 rounded-full bg-white text-black font-bold text-xs hover:bg-gray-200 transition-colors flex items-center gap-1.5"
                      >
                        <span>Open Fullscreen Preview</span>
                        <i className="pi pi-arrow-up-right text-xs" />
                      </button>
                      <button
                        onClick={downloadZip}
                        className="px-4 py-2 rounded-full glass border border-white/10 text-xs hover:bg-white/10 transition-colors flex items-center gap-1.5"
                      >
                        <i className="pi pi-download text-xs" />
                        <span>Download ZIP</span>
                      </button>
                      <button
                        onClick={copyJsx}
                        className="px-4 py-2 rounded-full glass border border-white/10 text-xs hover:bg-white/10 transition-colors flex items-center gap-1.5"
                      >
                        <i className={`pi ${copySuccess ? 'pi-check text-green-400' : 'pi-copy'} text-xs`} />
                        <span>{copySuccess ? 'Copied JSX!' : 'Copy Code'}</span>
                      </button>
                    </div>

                    {resultViewMode !== 'code' && (
                      <div className="flex items-center gap-1 bg-black/40 rounded-full p-0.5 border border-white/10">
                        <button
                          onClick={() => setPreviewViewport('mobile')}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                            previewViewport === 'mobile' ? 'bg-white/20 text-white' : 'text-gray-400'
                          }`}
                        >
                          📱 375px
                        </button>
                        <button
                          onClick={() => setPreviewViewport('desktop')}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                            previewViewport === 'desktop' ? 'bg-white/20 text-white' : 'text-gray-400'
                          }`}
                        >
                          💻 Desktop
                        </button>
                      </div>
                    )}
                  </div>
                </GlassCard>

                {/* Main View Area: Split / Preview / Code */}
                <div className={`grid gap-4 ${resultViewMode === 'split' ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
                  
                  {/* Live Rendered Canvas */}
                  {(resultViewMode === 'split' || resultViewMode === 'preview') && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          Live Interactive Rendered UI
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => navigate(`/preview/${currentJob.pageName || pageName}`)}
                            className="text-[11px] text-red-400 hover:text-red-300 hover:underline flex items-center gap-1 font-medium transition"
                          >
                            <span>Open Studio Preview</span>
                            <i className="pi pi-external-link text-[10px]" />
                          </button>
                          <span className="text-[11px] text-gray-500 font-mono hidden sm:inline">React 18 + Redux CMS</span>
                        </div>
                      </div>
                      <div className="w-full bg-[#09090b] rounded-2xl border border-white/10 p-3 shadow-2xl flex justify-center min-h-[550px] max-h-[850px] overflow-y-auto overflow-x-hidden scroll-smooth">
                        <div
                          className={`bg-zinc-950 rounded-xl transition-all duration-300 w-full pb-8 ${
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
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                          <span>💻</span> Generated React Component
                        </span>
                        <span className="text-[11px] text-gray-500 font-mono">{currentJob.componentFile || 'CustomSection.jsx'}</span>
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

            {/* Error Message */}
            {status === 'error' && (
              <GlassCard className="animate-fade-up border border-red-500/30 bg-red-900/10">
                <h3 className="text-base font-bold text-red-400 mb-2 flex items-center gap-2">
                  <i className="pi pi-exclamation-triangle" />Generation Failed
                </h3>
                <p className="text-gray-300 text-sm">{error}</p>
                <p className="text-gray-500 text-xs mt-2">Make sure the backend is running on port 4000.</p>
              </GlassCard>
            )}
          </div>

          {/* ── Job History Sidebar ──────────────────── */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
                Recent Generated Sections
              </p>
              {jobs.length > 0 && (
                <button
                  onClick={() => dispatch(clearHistory())}
                  className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors hover:underline"
                  title="Clear generation history"
                >
                  <i className="pi pi-trash text-[10px]" />
                  <span>Clear</span>
                </button>
              )}
            </div>
            {jobs.length === 0 ? (
              <GlassCard className="text-center py-8">
                <i className="pi pi-history text-2xl text-gray-600 mb-2 block" />
                <p className="text-sm text-gray-500">No generation jobs yet.</p>
                <p className="text-xs text-gray-600 mt-1">Upload a wireframe or enter a prompt above.</p>
              </GlassCard>
            ) : (
              <div className="flex flex-col gap-3">
                {jobs.map((job, idx) => (
                  <JobHistoryCard key={idx} job={job} />
                ))}
              </div>
            )}

            {/* Quick reference */}
            <GlassCard className="mt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Target CMS Elements</p>
              {[
                { name: 'heroImage', type: 'Image' },
                { name: 'brandBadge', type: 'Text' },
                { name: 'headlineMain', type: 'Text' },
                { name: 'headlineSub', type: 'Text' },
                { name: 'description', type: 'Textfield' },
                { name: 'statBadges', type: 'Cards (Loop)' },
                { name: 'ctaButton', type: 'Button' }
              ].map(item => (
                <div key={item.name} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span className="text-xs font-mono text-gray-300">{item.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 uppercase">{item.type}</span>
                </div>
              ))}
            </GlassCard>
          </div>

        </div>
      </div>
    </PageShell>
  );
}
