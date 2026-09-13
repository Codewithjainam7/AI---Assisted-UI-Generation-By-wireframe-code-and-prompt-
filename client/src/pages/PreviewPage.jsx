import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
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
  const [viewMode,     setViewMode]     = useState('split'); // 'preview' | 'split' | 'code'
  const [showEditor,   setShowEditor]   = useState(false);
  const [elements,     setElements]     = useState([]);
  const [loadingElems, setLoadingElems] = useState(true);
  const [jsxCode,      setJsxCode]      = useState(currentJob?.jsx || '');

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

    // If jsxCode isn't in redux state, try getting the section info
    if (!jsxCode) {
      axios.get(`${API_URL}/sections`, { params: { pageName } })
        .then(res => {
          const sections = res.data?.sections || res.data || [];
          if (sections.length > 0 && sections[0].jsx) {
            setJsxCode(sections[0].jsx);
          }
        })
        .catch(() => {});
    }
  }, [pageName, dispatch, jsxCode]);

  const downloadZip = () => {
    const sectionId = currentJob?.sectionId || 'latest';
    window.open(`${API_URL}/sections/${sectionId}/export`, '_blank');
  };

  return (
    <PageShell showNav={false}>
      {/* ── Top Control Bar ───────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 h-16 glass z-50 flex items-center justify-between px-2 sm:px-4 md:px-6 border-b border-white/10 gap-1.5 sm:gap-3">
        
        {/* Left: Back + Title */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={() => navigate('/generate')}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white flex-shrink-0"
            aria-label="Back to Generate"
          >
            <i className="pi pi-arrow-left text-xs sm:text-sm" />
          </button>
          <div>
            <p className="font-semibold text-xs sm:text-sm leading-tight text-white max-w-[85px] sm:max-w-none truncate">
              <span className="gradient-text">✦</span> {pageName}
            </p>
            <p className="hidden md:block text-[10px] text-gray-500">Live Render + Generated Code</p>
          </div>
        </div>

        {/* Center: Mode Selector + Viewport Switcher */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-black/50 rounded-full p-0.5 sm:p-1 border border-white/10">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-2 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium transition-all ${
                viewMode === 'preview' ? 'bg-red-500 text-white shadow-glow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              🖥️ <span className="hidden sm:inline">Preview Only</span><span className="sm:hidden">Preview</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-2 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium transition-all ${
                viewMode === 'split' ? 'bg-red-500 text-white shadow-glow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              🌓 <span className="hidden sm:inline">Split Screen</span><span className="sm:hidden">Split</span>
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`px-2 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium transition-all ${
                viewMode === 'code' ? 'bg-red-500 text-white shadow-glow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              💻 <span className="hidden sm:inline">Code (JSX)</span><span className="sm:hidden">Code</span>
            </button>
          </div>

          {/* Viewport (if viewing preview) */}
          {viewMode !== 'code' && (
            <div className="hidden lg:flex items-center gap-1 bg-black/40 rounded-full p-1 border border-white/10">
              <button
                onClick={() => setViewportSize('mobile')}
                className={`px-2.5 h-7 rounded-full flex items-center gap-1 text-xs font-medium transition-all ${
                  viewportSize === 'mobile' ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <i className="pi pi-mobile text-xs" /> 375px
              </button>
              <button
                onClick={() => setViewportSize('desktop')}
                className={`px-2.5 h-7 rounded-full flex items-center gap-1 text-xs font-medium transition-all ${
                  viewportSize === 'desktop' ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <i className="pi pi-desktop text-xs" /> 1280px
              </button>
            </div>
          )}
        </div>

        {/* Right: CMS Edit Toggle + Export */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            onClick={downloadZip}
            className="hidden md:flex px-3.5 py-1.5 rounded-full text-xs glass border-white/10 hover:bg-white/10 text-gray-300 items-center gap-1.5 transition-colors"
          >
            <i className="pi pi-download text-xs" />
            <span>Export ZIP</span>
          </button>
          <button
            onClick={() => setShowEditor(!showEditor)}
            className={`px-2.5 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              showEditor ? 'bg-red-500 text-white shadow-glow-sm' : 'glass border-white/10 hover:bg-white/10 text-white'
            }`}
          >
            <i className="pi pi-pencil text-xs" />
            <span className="hidden sm:inline">{showEditor ? 'Close CMS' : 'Edit Content'}</span>
            <span className="sm:hidden">{showEditor ? 'Close' : 'CMS'}</span>
          </button>
        </div>
      </div>

      {/* ── Main Area ─────────────────────────────────────── */}
      <div className="pt-20 pb-4 px-2 sm:px-4 md:px-6 flex gap-4 h-[calc(100vh)] min-h-0 overflow-hidden">

        {/* Canvas & Code Container */}
        <div className={`flex-1 flex ${viewMode === 'split' ? 'flex-col md:flex-row' : 'flex-row'} gap-4 overflow-hidden min-h-0 h-full`}>

          {/* Rendered Live Canvas */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div className={`flex-1 flex flex-col justify-start items-center overflow-y-auto overflow-x-hidden min-h-0 h-full w-full pr-1 scroll-smooth ${viewMode === 'split' ? 'h-1/2 md:h-full md:w-1/2' : 'w-full'}`}>
              <div
                className={`bg-zinc-950 transition-all duration-300 w-full flex-shrink-0 mb-12 shadow-2xl border border-white/10 ${
                  viewportSize === 'mobile' ? 'max-w-[375px] my-4 rounded-3xl overflow-hidden' : 'max-w-full rounded-2xl'
                }`}
              >
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
                fileName={`${currentJob?.sectionName || 'Custom'}Section.jsx`}
                maxHeight="calc(100vh - 120px)"
              />
            </div>
          )}

        </div>

        {/* CMS Editor Sidebar */}
        <div
          className={`h-full flex-shrink-0 transition-all duration-300 ease-out overflow-hidden min-h-0 ${
            showEditor
              ? 'fixed inset-y-16 right-0 w-80 z-40 bg-zinc-950/95 shadow-2xl md:static md:w-80 md:bg-transparent md:shadow-none opacity-100'
              : 'w-0 opacity-0 pointer-events-none'
          }`}
        >
          <GlassCard className="h-full flex flex-col p-0 overflow-hidden rounded-2xl">
            <div className="p-4 border-b border-white/10 bg-black/20 flex-shrink-0">
              <h3 className="font-bold text-sm text-white">CMS Live Editor</h3>
              <p className="text-xs text-gray-400 mt-0.5">Edit inputs to update live UI in real-time</p>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {loadingElems ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <i className="pi pi-spin pi-spinner text-2xl text-red-500" />
                  <p className="text-xs text-gray-500">Loading elements...</p>
                </div>
              ) : elements.length === 0 ? (
                <div className="text-center py-12">
                  <i className="pi pi-inbox text-3xl text-gray-600 mb-3 block" />
                  <p className="text-sm text-gray-500">No elements found.</p>
                  <p className="text-xs text-gray-600 mt-1">Generate a section first.</p>
                </div>
              ) : (
                <ElementEditor elements={elements} pageName={pageName} />
              )}
            </div>
          </GlassCard>
        </div>

      </div>
    </PageShell>
  );
}
