import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import PageShell from '../components/layout/PageShell';
import GlassCard from '../components/ui/GlassCard';
import ElementEditor from '../components/ui/ElementEditor';
import { fetchElementsByIds } from '../features/cms/cmsSlice';
import HeroSection from '../sections/generated/HeroSection';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function PreviewPage() {
  const { pageName } = useParams();
  const navigate     = useNavigate();
  const dispatch     = useDispatch();

  const [viewportSize, setViewportSize] = useState('desktop');
  const [showEditor,   setShowEditor]   = useState(false);
  const [elements,     setElements]     = useState([]);
  const [loadingElems, setLoadingElems] = useState(true);

  // Fetch elements from API to populate the editor panel AND the Redux store
  useEffect(() => {
    if (!pageName) return;
    setLoadingElems(true);
    axios.get(`${API_URL}/elements`, { params: { pageName } })
      .then(res => {
        const elems = res.data?.elements || res.data || [];
        setElements(Array.isArray(elems) ? elems : []);

        // Hydrate Redux store — dispatch fetchElementsByIds with all fieldIds
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
  }, [pageName, dispatch]);

  return (
    <PageShell showNav={false}>
      {/* ── Top Control Bar ───────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 h-16 glass z-50 flex items-center justify-between px-4 md:px-6 border-b border-white/10">
        
        {/* Left: Back + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/generate')}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            aria-label="Back to Generate"
          >
            <i className="pi pi-arrow-left text-sm" />
          </button>
          <div>
            <p className="font-semibold text-sm leading-tight">
              <span className="gradient-text">✦</span> {pageName} Preview
            </p>
            <p className="text-xs text-gray-500">Live CMS Preview</p>
          </div>
        </div>

        {/* Center: Viewport Toggle */}
        <div className="flex items-center gap-1 bg-black/40 rounded-full p-1">
          <button
            onClick={() => setViewportSize('mobile')}
            className={`px-3 h-8 rounded-full flex items-center gap-1.5 text-xs font-medium transition-all ${
              viewportSize === 'mobile' ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <i className="pi pi-mobile text-xs" /> 375px
          </button>
          <button
            onClick={() => setViewportSize('desktop')}
            className={`px-3 h-8 rounded-full flex items-center gap-1.5 text-xs font-medium transition-all ${
              viewportSize === 'desktop' ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <i className="pi pi-desktop text-xs" /> 1280px
          </button>
        </div>

        {/* Right: Edit Toggle */}
        <button
          onClick={() => setShowEditor(!showEditor)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            showEditor ? 'bg-red-500 text-white shadow-glow-sm' : 'glass border-white/10 hover:bg-white/10'
          }`}
        >
          <i className="pi pi-pencil mr-2 text-xs" />
          {showEditor ? 'Close Editor' : 'Edit Content'}
        </button>
      </div>

      {/* ── Main Area ─────────────────────────────────────── */}
      <div className="pt-20 pb-8 px-4 md:px-6 flex gap-4 h-screen overflow-hidden">

        {/* Canvas */}
        <div className="flex-1 flex justify-center items-start overflow-y-auto">
          <div
            className={`bg-white min-h-[800px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ease-out border border-white/5 ${
              viewportSize === 'mobile' ? 'w-[375px]' : 'w-full max-w-7xl'
            }`}
          >
            <HeroSection pageName={pageName} />
          </div>
        </div>

        {/* CMS Editor Sidebar */}
        <div
          className={`h-full flex-shrink-0 transition-all duration-300 ease-out overflow-hidden ${
            showEditor ? 'w-72 md:w-80 opacity-100' : 'w-0 opacity-0'
          }`}
        >
          <GlassCard className="h-full flex flex-col p-0 overflow-hidden rounded-2xl">
            <div className="p-4 border-b border-white/10 bg-black/20 flex-shrink-0">
              <h3 className="font-bold text-sm">CMS Editor</h3>
              <p className="text-xs text-gray-400 mt-0.5">Changes update preview instantly</p>
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
