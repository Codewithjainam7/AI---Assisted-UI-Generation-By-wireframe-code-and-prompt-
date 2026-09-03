import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PageShell from '../components/layout/PageShell';
import GlassCard from '../components/ui/GlassCard';
import ElementEditor from '../components/ui/ElementEditor';
import { fetchElementsByIds } from '../features/cms/cmsSlice';
import HeroSection from '../sections/generated/HeroSection';

export default function PreviewPage() {
  const { pageName } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [viewportSize, setViewportSize] = useState('desktop');
  const [showEditor, setShowEditor] = useState(false);

  // We fetch all elements for this page to populate the editor and redux state
  useEffect(() => {
    if (pageName) {
      dispatch(fetchElementsByIds({ pageName }));
    }
  }, [pageName, dispatch]);

  const { allSections } = useSelector(state => state.cms);
  
  // For the editor, we need a flat list of elements from allSections[pageName]
  // In a real app we'd fetch the schema, but we'll map current state keys to pseudo-elements for now
  const pageContent = allSections[pageName] || {};
  const editableElements = Object.keys(pageContent).map(key => ({
    fieldId: key,
    elementName: key,
    contentType: Array.isArray(pageContent[key]) ? 'Cards' : 'Text',
    content: pageContent[key],
    loop: Array.isArray(pageContent[key]) ? pageContent[key] : null
  }));

  return (
    <PageShell showNav={false}>
      {/* Top Control Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 glass z-50 flex items-center justify-between px-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/generate')}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <i className="pi pi-arrow-left"></i>
          </button>
          <span className="font-semibold text-lg">{pageName} Preview</span>
        </div>

        <div className="flex items-center gap-2 bg-black/40 rounded-full p-1">
          <button 
            onClick={() => setViewportSize('mobile')}
            className={`w-10 h-8 rounded-full flex items-center justify-center transition-colors ${viewportSize === 'mobile' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <i className="pi pi-mobile"></i>
          </button>
          <button 
            onClick={() => setViewportSize('desktop')}
            className={`w-10 h-8 rounded-full flex items-center justify-center transition-colors ${viewportSize === 'desktop' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <i className="pi pi-desktop"></i>
          </button>
        </div>

        <button 
          onClick={() => setShowEditor(!showEditor)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${showEditor ? 'bg-red-500 text-white' : 'glass border-white/10 hover:bg-white/10'}`}
        >
          <i className="pi pi-pencil mr-2"></i> Edit Content
        </button>
      </div>

      {/* Main Content Area */}
      <div className="pt-24 pb-8 px-6 flex h-screen overflow-hidden">
        
        {/* Canvas Area */}
        <div className="flex-1 flex justify-center items-start overflow-y-auto custom-scrollbar">
          <div 
            className={`bg-zinc-950 min-h-[800px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ease-in-out border border-white/5 ${
              viewportSize === 'mobile' ? 'w-[375px]' : 'w-full max-w-7xl'
            }`}
          >
            <Suspense fallback={<div className="p-20 text-center text-gray-500">Loading components...</div>}>
              {/* Dynamic Injection Point. For now, hardcoded HeroSection */}
              <HeroSection pageName={pageName} />
            </Suspense>
          </div>
        </div>

        {/* CMS Editor Sidebar */}
        <div className={`h-full transition-all duration-300 ease-in-out ${showEditor ? 'w-80 ml-6 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
          <GlassCard className="h-full flex flex-col p-0 overflow-hidden rounded-2xl">
            <div className="p-4 border-b border-white/10 bg-black/20">
              <h3 className="font-bold">CMS Editor</h3>
              <p className="text-xs text-gray-400">Live updates</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <ElementEditor elements={editableElements} pageName={pageName} />
            </div>
          </GlassCard>
        </div>

      </div>
    </PageShell>
  );
}
