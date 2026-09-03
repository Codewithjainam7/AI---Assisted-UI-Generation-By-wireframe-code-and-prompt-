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
import { submitGenerateJob } from '../features/generate/generateSlice';

const MODES = [
  { id: 'wireframe', label: 'Wireframe', icon: '🖼️' },
  { id: 'code',      label: 'Code',      icon: '💻' },
  { id: 'prompt',    label: 'Prompt',    icon: '✍️' },
  { id: 'combined',  label: 'Combined',  icon: '⚡' },
];

const STEPS = ['Parsing', 'Building IR', 'Generating JSX', 'Saving', 'Done'];

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

  const [activeMode,     setActiveMode]     = useState('prompt');
  const [wireframeFile,  setWireframeFile]  = useState(null);
  const [codeValue,      setCodeValue]      = useState('');
  const [promptValue,    setPromptValue]    = useState('');
  const [pageName,       setPageName]       = useState('Home');
  const [sectionName,    setSectionName]    = useState('Custom');
  const [showOptions,    setShowOptions]    = useState(false);
  const [copySuccess,    setCopySuccess]    = useState(false);

  const handleGenerate = () => {
    const formData = new FormData();
    formData.append('mode',        activeMode);
    formData.append('pageName',    pageName);
    formData.append('sectionName', sectionName.replace(/\s+/g, ''));

    if (activeMode === 'wireframe' || activeMode === 'combined') {
      if (wireframeFile) formData.append('wireframe', wireframeFile);
    }
    if (activeMode === 'code' || activeMode === 'combined') {
      if (codeValue.trim()) formData.append('code', codeValue);
    }
    if (activeMode === 'prompt' || activeMode === 'combined') {
      if (promptValue.trim()) formData.append('prompt', promptValue);
    }

    dispatch(submitGenerateJob(formData));
  };

  const downloadZip = () => {
    if (!currentJob?.sectionId) return;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
    window.open(`${apiUrl}/sections/${currentJob.sectionId}/export`, '_blank');
  };

  const copyJsx = () => {
    const text = currentJob?.componentFile || '';
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const isDisabled = status === 'loading' || (
    activeMode === 'wireframe' && !wireframeFile ||
    activeMode === 'code'      && !codeValue.trim() ||
    activeMode === 'prompt'    && !promptValue.trim() ||
    activeMode === 'combined'  && !wireframeFile && !promptValue.trim() && !codeValue.trim()
  );

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-16">

        {/* Header */}
        <div className="py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">
            ✦ Generation <span className="gradient-text">Studio</span>
          </h1>
          <p className="text-gray-400 text-sm">Generate CMS-ready React sections in seconds.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* ── Main Workspace ──────────────────────── */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* Mode selector */}
            <div className="flex justify-start">
              <PillTab tabs={MODES} active={activeMode} onChange={setActiveMode} />
            </div>

            {/* Input Panel */}
            <GlassCard className="flex flex-col gap-5">

              {/* Wireframe */}
              {(activeMode === 'wireframe') && (
                <div>
                  <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">Upload Wireframe</p>
                  <DropZone onFile={setWireframeFile} accept="image/png,image/jpeg,image/webp" maxSizeMB={8} />
                </div>
              )}

              {/* Code */}
              {activeMode === 'code' && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Paste JSX / React Code</p>
                    <button
                      onClick={() => setCodeValue(SAMPLE_CODE)}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Load Sample ↓
                    </button>
                  </div>
                  <CodeEditor
                    value={codeValue}
                    onChange={setCodeValue}
                    language="jsx"
                    placeholder="Paste your static JSX here..."
                  />
                </div>
              )}

              {/* Prompt */}
              {activeMode === 'prompt' && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Natural Language Prompt</p>
                    <button
                      onClick={() => setPromptValue(SAMPLE_PROMPT)}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Load Sample ↓
                    </button>
                  </div>
                  <textarea
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    placeholder="Describe the section you want to generate...&#10;&#10;e.g. Create a fitness hero. Left: athlete image. Right: red badge, bold headline, 3 stats, red CTA."
                    className="w-full h-48 bg-black/20 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 resize-none text-sm leading-relaxed transition-all"
                  />
                </div>
              )}

              {/* Combined */}
              {activeMode === 'combined' && (
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">Wireframe Image</p>
                    <DropZone onFile={setWireframeFile} accept="image/png,image/jpeg,image/webp" maxSizeMB={8} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">Additional Prompt Instructions</p>
                    <textarea
                      value={promptValue}
                      onChange={(e) => setPromptValue(e.target.value)}
                      placeholder="Override colours, copy, CTA label, stat count..."
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
                  <span className="text-sm font-medium text-gray-300">⚙️ Generation Options</span>
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
                      label="Section Name (no spaces)"
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
                  <><i className="pi pi-spin pi-spinner mr-2" />Generating...</>
                ) : (
                  'Generate Section ✦'
                )}
              </button>
            </GlassCard>

            {/* Progress */}
            {status === 'loading' && (
              <GlassCard className="animate-fade-up">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-4">Generation Progress</p>
                <StepProgress currentStep={currentStep} steps={STEPS} />
              </GlassCard>
            )}

            {/* Results */}
            {status === 'success' && currentJob && (
              <GlassCard className="animate-fade-up border border-green-500/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-green-400 flex items-center gap-2">
                      <span>✅</span> Section Generated
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      ID: <span className="font-mono text-gray-400">{currentJob.sectionId}</span>
                      {currentJob.warnings?.length > 0 && (
                        <span className="ml-2 text-yellow-500">⚠️ {currentJob.warnings.length} warning(s)</span>
                      )}
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-gray-400">
                    {currentJob.componentFile}
                  </span>
                </div>

                {/* Warnings */}
                {currentJob.warnings?.length > 0 && (
                  <div className="mb-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                    {currentJob.warnings.map((w, i) => (
                      <p key={i} className="text-xs text-yellow-400">⚠️ {w}</p>
                    ))}
                  </div>
                )}

                {/* Element IDs summary */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {(currentJob.elementIds || []).slice(0, 7).map(id => (
                    <span key={id} className="text-xs font-mono px-2 py-1 rounded-lg bg-white/5 text-gray-400">
                      {id}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate(`/preview/${currentJob.pageName || pageName}`)}
                    className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-gray-100 transition-colors"
                  >
                    View Preview →
                  </button>
                  <button
                    onClick={downloadZip}
                    className="px-5 py-2.5 rounded-full glass border border-white/10 text-sm hover:bg-white/10 transition-colors"
                  >
                    <i className="pi pi-download mr-2 text-xs" />Download ZIP
                  </button>
                  <button
                    onClick={copyJsx}
                    className="px-5 py-2.5 rounded-full glass border border-white/10 text-sm hover:bg-white/10 transition-colors"
                  >
                    <i className={`pi ${copySuccess ? 'pi-check text-green-400' : 'pi-copy'} mr-2 text-xs`} />
                    {copySuccess ? 'Copied!' : 'Copy Path'}
                  </button>
                </div>
              </GlassCard>
            )}

            {/* Error */}
            {status === 'error' && (
              <GlassCard className="animate-fade-up border border-red-500/30 bg-red-900/10">
                <h3 className="text-base font-bold text-red-400 mb-2">
                  <i className="pi pi-exclamation-triangle mr-2" />Generation Failed
                </h3>
                <p className="text-gray-300 text-sm">{error}</p>
                <p className="text-gray-500 text-xs mt-2">Check your API keys in .env and that MongoDB is running.</p>
              </GlassCard>
            )}
          </div>

          {/* ── Job History Sidebar ──────────────────── */}
          <div className="lg:col-span-1">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3 px-1">
              Recent Jobs
            </p>
            {jobs.length === 0 ? (
              <GlassCard className="text-center py-8">
                <i className="pi pi-history text-2xl text-gray-600 mb-2 block" />
                <p className="text-sm text-gray-600">No jobs yet.</p>
                <p className="text-xs text-gray-700 mt-1">Generate your first section above.</p>
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
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">DOM IDs</p>
              {['heroImage','brandBadge','headlineMain','headlineSub','description','statBadges','ctaButton'].map(id => (
                <div key={id} className="flex items-center gap-2 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  <span className="text-xs font-mono text-gray-500">{id}</span>
                </div>
              ))}
            </GlassCard>
          </div>

        </div>
      </div>
    </PageShell>
  );
}
