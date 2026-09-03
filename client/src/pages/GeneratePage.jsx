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
  { id: 'wireframe', label: 'Wireframe', icon: <i className="pi pi-image text-xs"></i> },
  { id: 'code', label: 'Code', icon: <i className="pi pi-code text-xs"></i> },
  { id: 'prompt', label: 'Prompt', icon: <i className="pi pi-pencil text-xs"></i> },
  { id: 'combined', label: 'Combined', icon: <i className="pi pi-th-large text-xs"></i> },
];

const STEPS = ['Parsing', 'Building IR', 'Generating JSX', 'Saving', 'Done'];

export default function GeneratePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { status, currentJob, error, jobs, currentStep } = useSelector(state => state.generate);

  const [activeMode, setActiveMode] = useState('wireframe');
  const [wireframeFile, setWireframeFile] = useState(null);
  const [codeValue, setCodeValue] = useState('');
  const [promptValue, setPromptValue] = useState('');
  
  const [pageName, setPageName] = useState('Home');
  const [sectionName, setSectionName] = useState('Custom Section');
  const [accentColor, setAccentColor] = useState('red-500');
  const [showOptions, setShowOptions] = useState(false);

  const handleGenerate = () => {
    const formData = new FormData();
    formData.append('mode', activeMode);
    formData.append('pageName', pageName);
    formData.append('sectionName', sectionName);
    formData.append('accentColor', accentColor);

    if (activeMode === 'wireframe' || activeMode === 'combined') {
      if (wireframeFile) formData.append('image', wireframeFile);
    }
    if (activeMode === 'code' || activeMode === 'combined') {
      formData.append('code', codeValue);
    }
    if (activeMode === 'prompt' || activeMode === 'combined') {
      formData.append('prompt', promptValue);
    }

    dispatch(submitGenerateJob(formData));
  };

  const downloadZip = async () => {
    if (!currentJob?.sectionId) return;
    window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/sections/${currentJob.sectionId}/export`, '_blank');
  };

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Workspace */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="flex justify-between items-end mb-4">
            <h1 className="text-3xl font-bold tracking-tight">✦ Generation <span className="gradient-text">Studio</span></h1>
          </div>

          <div className="flex justify-center md:justify-start">
            <PillTab tabs={MODES} active={activeMode} onChange={setActiveMode} />
          </div>

          <GlassCard className="flex flex-col gap-6">
            {/* Input Areas based on mode */}
            {activeMode === 'wireframe' && (
              <DropZone onFile={setWireframeFile} />
            )}

            {activeMode === 'code' && (
              <CodeEditor 
                value={codeValue} 
                onChange={setCodeValue} 
                language="jsx"
                placeholder="Paste static JSX here..."
              />
            )}

            {activeMode === 'prompt' && (
              <textarea
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
                placeholder="Describe the UI section you want to build..."
                className="w-full h-48 bg-black/20 border border-gray-700 rounded-2xl p-4 text-white focus:outline-none focus:border-red-500 resize-none"
              />
            )}

            {activeMode === 'combined' && (
              <div className="grid md:grid-cols-2 gap-4">
                <DropZone onFile={setWireframeFile} />
                <textarea
                  value={promptValue}
                  onChange={(e) => setPromptValue(e.target.value)}
                  placeholder="Additional instructions..."
                  className="w-full h-full min-h-[200px] bg-black/20 border border-gray-700 rounded-2xl p-4 text-white focus:outline-none focus:border-red-500 resize-none"
                />
              </div>
            )}

            {/* Options Accordion */}
            <div className="border border-white/10 rounded-2xl overflow-hidden">
              <button 
                onClick={() => setShowOptions(!showOptions)}
                className="w-full bg-white/5 px-4 py-3 flex justify-between items-center hover:bg-white/10 transition-colors"
              >
                <span className="text-sm font-medium">Generation Options</span>
                <i className={`pi pi-chevron-${showOptions ? 'up' : 'down'} text-xs text-gray-400`}></i>
              </button>
              
              {showOptions && (
                <div className="p-4 bg-black/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <GlassInput label="Page Name" value={pageName} onChange={(e) => setPageName(e.target.value)} />
                  <GlassInput label="Section Name" value={sectionName} onChange={(e) => setSectionName(e.target.value)} />
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={handleGenerate}
              disabled={status === 'loading'}
              className={`w-full py-4 rounded-full font-bold text-lg transition-all ${
                status === 'loading' ? 'bg-gray-800 text-gray-400 cursor-not-allowed' : 'shimmer-bg text-white hover:shadow-glow-red'
              }`}
            >
              {status === 'loading' ? (
                <><i className="pi pi-spin pi-spinner mr-2"></i> Generating...</>
              ) : (
                'Generate Section ✦'
              )}
            </button>
          </GlassCard>

          {/* Progress */}
          {status === 'loading' && (
            <GlassCard>
              <StepProgress currentStep={currentStep} steps={STEPS} />
            </GlassCard>
          )}

          {/* Results */}
          {status === 'success' && currentJob && (
            <GlassCard glow className="animate-fade-up border-green-500/30">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-green-400">✅ Section Generated Successfully</h3>
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-gray-300">
                  {currentJob.sectionId}
                </span>
              </div>
              
              <CodeEditor value={currentJob.jsx || '// Generated JSX will appear here'} readOnly language="jsx" />
              
              <div className="flex flex-wrap gap-3 mt-4">
                <button 
                  onClick={() => navigate(`/preview/${pageName}`)}
                  className="px-6 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors"
                >
                  View Preview →
                </button>
                <button 
                  onClick={downloadZip}
                  className="px-6 py-2 rounded-full glass border-white/10 hover:bg-white/10 transition-colors"
                >
                  <i className="pi pi-download mr-2"></i> Download ZIP
                </button>
              </div>
            </GlassCard>
          )}

          {/* Error */}
          {status === 'error' && (
            <GlassCard className="border-red-500/50 bg-red-900/10">
              <h3 className="text-lg font-bold text-red-500 mb-2"><i className="pi pi-exclamation-triangle mr-2"></i> Generation Failed</h3>
              <p className="text-gray-300 text-sm">{error}</p>
            </GlassCard>
          )}

        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Recent Jobs</h3>
          {jobs.length === 0 ? (
            <p className="text-sm text-gray-600 italic">No recent jobs.</p>
          ) : (
            <div>
              {jobs.map((job, idx) => (
                <JobHistoryCard key={idx} job={job} />
              ))}
            </div>
          )}
        </div>

      </div>
    </PageShell>
  );
}
