import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  ArrowLeft,
  Eye,
  Columns2,
  Code2,
  Smartphone,
  Monitor,
  Download,
  Edit3,
  X,
  Sparkles,
  Layers
} from 'lucide-react';
import PageShell from '../components/layout/PageShell';
import GlassCard from '../components/ui/GlassCard';
import ElementEditor from '../components/ui/ElementEditor';
import CodeEditor from '../components/ui/CodeEditor';
import { fetchElementsByIds } from '../features/cms/cmsSlice';
import LiveComponentRenderer from '../components/ui/LiveComponentRenderer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function PreviewPage() {
  const { pageName } = useParams();
  const navigate     = useNavigate();
  const dispatch     = useDispatch();

  const { currentJob } = useSelector(state => state.generate);

  const [viewportSize, setViewportSize] = useState('desktop');
  const [viewMode,     setViewMode]     = useState('preview'); // 'preview' | 'split' | 'code'
  const [showEditor,   setShowEditor]   = useState(false);
  const [elements,     setElements]     = useState([]);
  const [loadingElems, setLoadingElems] = useState(true);
  const [jsxCode,      setJsxCode]      = useState(currentJob?.jsx || '');

  // Keep jsxCode synchronized with currentJob
  useEffect(() => {
    if (currentJob?.jsx) {
      setJsxCode(currentJob.jsx);
    }
  }, [currentJob?.jsx]);

  // Fetch elements and latest section metadata
  useEffect(() => {
    if (!pageName) return;
    setLoadingElems(true);

    axios.get(`${API_URL}/elements`, { params: { pageName } })
      .then(res => {
        const elems = res.data?.elements || res.data || [];
        setElements(Array.isArray(elems) ? elems : []);

        // Hydrate Redux store
        const allIds = [];
        elems.forEach(el => {
          allIds.push(el.fieldId);
          if (el.contentType === 'Cards' && Array.isArray(el.loop)) {
            el.loop.forEach(item => {
              if (item.fieldId1) allIds.push(item.fieldId1);
              if (item.fieldId2) allIds.push(item.fieldId2);
            });
          }
        });
        if (allIds.length > 0) {
          dispatch(fetchElementsByIds({ elementIds: allIds, pageName }));
        }
      })
      .catch(() => setElements([]))
      .finally(() => setLoadingElems(false));

    // Fetch latest section code for pageName
    axios.get(`${API_URL}/sections`, { params: { pageName } })
      .then(res => {
        const sections = res.data?.sections || res.data || [];
        if (sections.length > 0 && sections[0].jsx) {
          setJsxCode(sections[0].jsx);
        }
      })
      .catch(() => {});
  }, [pageName, dispatch]);

  const downloadZip = () => {
    const sectionId = currentJob?.sectionId || 'latest';
    window.open(`${API_URL}/sections/${sectionId}/export`, '_blank');
  };

  return (
    <PageShell showNav={false}>
      {/* ── Top Floating Liquid Dock Bar ───────────────────────────────── */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 w-[96%] max-w-7xl h-14 glass-dock rounded-full z-50 flex items-center justify-between px-4 sm:px-6 shadow-2xl">
        
        {/* Left: Back Navigation + Target Page */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => navigate('/generate')}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center transition-all text-slate-300 hover:text-white border border-white/10"
            aria-label="Back to Studio"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <p className="font-bold text-xs sm:text-sm text-white font-mono tracking-tight">
              {pageName}
            </p>
            <span className="hidden md:inline text-[10px] text-slate-500 font-mono border-l border-white/10 pl-2">Live Render</span>
          </div>
        </div>

        {/* Center: Mode Switcher + Viewport Switcher */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-white/[0.04] rounded-full p-1 border border-white/10 shadow-inner">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'preview'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'split'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split</span>
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'code'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Code</span>
            </button>
          </div>

          {/* Viewport Toggles (only when previewing) */}
          {viewMode !== 'code' && (
            <div className="hidden lg:flex items-center gap-0.5 bg-white/[0.04] rounded-full p-1 border border-white/10">
              <button
                onClick={() => setViewportSize('mobile')}
                className={`px-2.5 h-6 rounded-full flex items-center gap-1 text-[11px] font-semibold transition-all ${
                  viewportSize === 'mobile' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>375px</span>
              </button>
              <button
                onClick={() => setViewportSize('desktop')}
                className={`px-2.5 h-6 rounded-full flex items-center gap-1 text-[11px] font-semibold transition-all ${
                  viewportSize === 'desktop' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3 h-3" />
                <span>Desktop</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: CMS Edit Drawer Toggle + Export */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={downloadZip}
            className="hidden md:flex px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white items-center gap-1.5 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export ZIP</span>
          </button>
          <button
            onClick={() => setShowEditor(!showEditor)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm ${
              showEditor
                ? 'bg-blue-600 text-white'
                : 'bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white'
            }`}
          >
            {showEditor ? <X className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5 text-cyan-400" />}
            <span className="hidden sm:inline">{showEditor ? 'Close CMS' : 'Edit CMS Data'}</span>
            <span className="sm:hidden">{showEditor ? 'Close' : 'CMS'}</span>
          </button>
        </div>
      </div>

      {/* ── Main Preview Area ─────────────────────────────────────── */}
      <div className="pt-20 pb-4 px-4 sm:px-6 flex gap-6 h-screen min-h-0 overflow-hidden">

        {/* Canvas & Code Container */}
        <div className={`flex-1 flex ${viewMode === 'split' ? 'flex-col md:flex-row' : 'flex-row'} gap-6 overflow-hidden min-h-0 h-full`}>

          {/* Rendered Live Canvas with Apple Device Glass Frame */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div className={`flex-1 flex flex-col justify-start items-center overflow-y-auto overflow-x-hidden min-h-0 h-full w-full py-4 pr-1 scroll-smooth ${viewMode === 'split' ? 'h-1/2 md:h-full md:w-1/2' : 'w-full'}`}>
              <div
                className={`transition-all duration-300 flex-shrink-0 mb-12 ${
                  viewportSize === 'mobile'
                    ? 'w-[390px] max-w-[390px] my-4 rounded-[3.2rem] overflow-hidden border-[9px] border-[#1c1d22] shadow-[0_25px_80px_rgba(0,0,0,0.8)] bg-white relative'
                    : 'w-full max-w-6xl mx-auto rounded-[2.5rem] overflow-hidden border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.65)] bg-white'
                }`}
              >
                {/* Mobile Dynamic Island Bar */}
                {viewportSize === 'mobile' && (
                  <div className="w-full bg-white h-7 flex items-center justify-center pt-1.5 pb-0.5 px-6">
                    <div className="w-24 h-4 bg-black rounded-full shadow-inner" />
                  </div>
                )}
                <LiveComponentRenderer code={jsxCode || currentJob?.jsx} pageName={pageName} job={currentJob} />
              </div>
            </div>
          )}

          {/* Generated Code Panel */}
          {(viewMode === 'split' || viewMode === 'code') && (
            <div className={`flex flex-col min-h-0 h-full overflow-hidden ${viewMode === 'split' ? 'h-1/2 md:h-full md:w-1/2' : 'w-full'}`}>
              <CodeEditor
                value={jsxCode || currentJob?.jsx || '// Generated section code will appear here'}
                readOnly={true}
                language="jsx"
                fileName={`${pageName}Section.jsx`}
                maxHeight="100%"
              />
            </div>
          )}

        </div>

        {/* CMS Live Element Editor Drawer */}
        {showEditor && (
          <div className="w-80 sm:w-96 flex-shrink-0 h-full min-h-0 animate-slide-in">
            <GlassCard className="h-full flex flex-col overflow-hidden p-0 border border-white/15">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Redux CMS Live Editor</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Live synchronized with store</p>
                </div>
                <button
                  onClick={() => setShowEditor(false)}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 min-h-0">
                <ElementEditor
                  elements={elements}
                  pageName={pageName}
                  loading={loadingElems}
                />
              </div>
            </GlassCard>
          </div>
        )}

      </div>
    </PageShell>
  );
}
