import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'primereact/button';
import { fetchElementsByIds } from '../../features/cms/cmsSlice';
import { getImage, errorImage } from '../../utils/getImage';

export default function DynamicSectionPreview({ pageName = 'Home', job = null }) {
  const dispatch = useDispatch();

  const cmsData = useSelector((state) => state.cms?.allSections?.[pageName]) || {};
  const cmsCss  = useSelector((state) => state.cms?.allSectionsCss?.[pageName]) || {};

  const ir = job?.ir;
  const layout = ir?.layout || {};
  const elements = ir?.elements || [];

  const getElementDefault = (name, fallback) => {
    const el = elements.find((e) => e.elementName === name);
    return el?.defaultContent || fallback;
  };

  const brandBadge = ir?.navbar?.logoText || getElementDefault('brandBadge', (job?.sectionName || 'DASHBOARD').toUpperCase());
  const headlineMain = getElementDefault('headlineMain', 'Dashboard Overview');
  const headlineSub = getElementDefault('headlineSub', 'Manage and monitor your primary metrics and system activity.');
  const description = getElementDefault('description', 'Centralized interface for high-velocity teams.');
  const ctaButton = getElementDefault('ctaButton', 'GET STARTED');
  const heroImage = getElementDefault('heroImage', 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80');

  // Look for CMS live value overrides
  const liveValues = {};
  elements.forEach((el) => {
    if (el.fieldId && cmsData[el.fieldId] !== undefined) {
      liveValues[el.elementName] = cmsData[el.fieldId];
    }
  });

  const displayBrand = liveValues.brandBadge || brandBadge;
  const displayHeadline = liveValues.headlineMain || headlineMain;
  const displaySub = liveValues.headlineSub || headlineSub;
  const displayDesc = liveValues.description || description;
  const displayCta = liveValues.ctaButton || ctaButton;

  // Detect fitness / calories specifically
  const isFitness = ir?.domain === 'fitness' ||
    /calor|nutrition|diet|meal/i.test((job?.sectionName || '') + ' ' + (ir?.domain || '') + ' ' + (ir?.imageConcept || ''));

  // Detect whether this is a dashboard / multi-panel wireframe
  const isDashboard = ir?.screenType === 'desktop-dashboard' ||
    ir?.sectionType === 'dashboard-hero' ||
    layout.hasSidebar ||
    layout.hasTabs ||
    layout.hasDetailPanel ||
    layout.sidebarType === 'icon-rail' ||
    layout.sidebarType === 'profile-sidebar';

  // Cards to render
  const featureCards = Array.isArray(ir?.featureCards) && ir.featureCards.length > 0
    ? ir.featureCards
    : (Array.isArray(ir?.content?.featureCards) && ir.content.featureCards.length > 0 ? ir.content.featureCards : [
      { title: 'Module 1', description: 'System asset module' },
      { title: 'Module 2', description: 'System asset module' },
      { title: 'Module 3', description: 'System asset module' }
    ]);

  const sidebarItems = layout.sidebarItems || ['Dashboard', 'Assets', 'Analytics', 'Settings'];
  const sidebarUser = layout.sidebarUser?.name || 'User Profile';
  const tabs = layout.tabs || ['Overview', 'Activity', 'Reports', 'Settings'];
  const dateNav = layout.dateNavigator ? layout.dateNavigator.replace(/today/i, '').trim() : null;

  useEffect(() => {
    if (job?.elementIds?.length > 0) {
      dispatch(fetchElementsByIds({ elementIds: job.elementIds, pageName }));
    }
  }, [dispatch, pageName, job?.sectionId]);

  // 1. Dynamic Dashboard / Multi-Panel Wireframe View
  if (isDashboard) {
    return (
      <div className="w-full min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans overflow-x-hidden text-slate-900 rounded-2xl">
        <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative text-slate-900">
          
          {/* Top Header Bar */}
          <header className="w-full bg-slate-200 border-b border-slate-300 px-6 py-3.5 flex items-center justify-between text-slate-900 font-bold text-base">
            <div className="flex items-center gap-2 font-black text-lg text-slate-900">
              <span dangerouslySetInnerHTML={{ __html: displayBrand }} />
            </div>
            {layout.hasSearchOrForm && (
              <input type="text" placeholder="Search..." className="w-64 bg-white/90 border border-slate-300 rounded-full px-4 py-1.5 text-xs text-slate-800" />
            )}
          </header>

          {/* Window Body: Sidebar + Main Content */}
          <div className="flex flex-col md:flex-row w-full items-stretch">
            
            {/* Sidebar */}
            {layout.hasSidebar !== false && (
              layout.sidebarType === 'icon-rail' ? (
                <aside className="w-16 min-w-[4rem] max-w-[4rem] bg-amber-400 rounded-3xl py-6 px-2 flex flex-col items-center justify-between shadow-lg flex-shrink-0 self-stretch my-3 ml-3">
                  <div className="space-y-6 text-slate-900">
                    <svg className="w-5 h-5 min-w-[20px] min-h-[20px]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                    <svg className="w-5 h-5 min-w-[20px] min-h-[20px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4l-8 14h16z"/></svg>
                    <svg className="w-5 h-5 min-w-[20px] min-h-[20px]" fill="currentColor" viewBox="0 0 24 24"><path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/></svg>
                  </div>
                  <div className="space-y-6 text-slate-900">
                    <svg className="w-5 h-5 min-w-[20px] min-h-[20px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <div className="bg-white/30 p-2 rounded-xl">
                      <svg className="w-5 h-5 min-w-[20px] min-h-[20px]" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"/></svg>
                    </div>
                    <svg className="w-5 h-5 min-w-[20px] min-h-[20px]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>
                  </div>
                  <svg className="w-5 h-5 min-w-[20px] min-h-[20px] text-slate-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l8 4.5v9L12 20l-8-4.5v-9z"/></svg>
                </aside>
              ) : layout.sidebarType === 'profile-sidebar' ? (
                <aside className="w-full sm:w-60 md:w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 self-stretch">
                  <div className="bg-pink-100 border-b border-pink-200 p-6 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center border-2 border-pink-200 text-slate-400 overflow-hidden">
                      <svg className="w-12 h-12 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    </div>
                    <h2 className="text-center font-bold text-slate-800 text-base mt-2.5">{sidebarUser}</h2>
                  </div>
                  <nav className="p-5 flex flex-col gap-3.5">
                    {sidebarItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-slate-700 hover:text-slate-950 font-medium text-sm transition-colors cursor-pointer py-1">
                        <span className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0"></span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </nav>
                </aside>
              ) : (
                <aside className="w-full sm:w-56 bg-slate-50 border-r border-slate-200 p-4 flex flex-col gap-3 flex-shrink-0">
                  {sidebarItems.map((item, idx) => (
                    <div key={idx} className="text-slate-700 font-semibold text-sm hover:text-slate-950 py-1.5 cursor-pointer">{item}</div>
                  ))}
                </aside>
              )
            )}

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 flex flex-col">
              
              {/* Sub-Header Bar with Tabs & Date Switcher */}
              {(layout.hasTabs || dateNav) && (
                <div className="border-b border-slate-200 px-6 pt-4 pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    {tabs.map((t, i) => (
                      <button key={i} className={`pb-3 text-base tracking-tight ${i === 0 ? "text-slate-900 font-extrabold border-b-2 border-slate-900" : "text-slate-400 hover:text-slate-600 font-semibold transition-colors"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                  {dateNav && (
                    <div className="flex flex-col items-end pb-2 text-right">
                      <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-sm">
                        <span className="text-slate-400 font-bold cursor-pointer hover:text-slate-700">&lt;</span>
                        <span>{dateNav}</span>
                        <span className="text-slate-400 font-bold cursor-pointer hover:text-slate-700">&gt;</span>
                      </div>
                      <span className="text-xs text-slate-500 font-bold">Today</span>
                    </div>
                  )}
                </div>
              )}

              {/* Main Content Body */}
              <div className="p-6 sm:p-8 flex flex-col gap-8">
                
                {isFitness ? (
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-extrabold text-rose-500 tracking-tight" dangerouslySetInnerHTML={{ __html: displayHeadline }} />
                    <div className="flex items-center gap-4">
                      <svg className="w-14 h-14 text-slate-800 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {ir?.statCards?.[0]?.field1 || '1999'} {ir?.statCards?.[0]?.field2 || 'Calories'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight" dangerouslySetInnerHTML={{ __html: displayHeadline }} />
                    <p className="text-sm text-slate-600 mt-1" dangerouslySetInnerHTML={{ __html: displaySub }} />
                  </div>
                )}

                {/* Cards Grid */}
                <div className={`grid grid-cols-1 ${featureCards.length === 2 ? 'sm:grid-cols-2' : featureCards.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                  {featureCards.map((card, idx) => (
                    <div key={idx} className="bg-slate-300 rounded-2xl overflow-hidden relative shadow-sm border border-slate-300 flex flex-col p-4">
                      <div className="h-32 sm:h-36 rounded-xl bg-slate-200 mb-3 flex items-center justify-center">
                        <svg className="w-12 h-12 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                      </div>
                      <div className="text-sm font-bold text-slate-900">{card.title}</div>
                      <div className="text-xs text-slate-600 mt-1">{card.description || 'System asset module'}</div>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <Button className="w-full sm:w-auto px-8 py-3 rounded-full font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm self-start" label={displayCta} aria-label="Action button" />
                </div>

              </div>
            </main>

            {/* Right Inspector Panel */}
            {layout.hasDetailPanel && (
              <aside className="w-full lg:w-80 min-w-[18rem] max-w-[20rem] bg-slate-50 border-l border-slate-200 p-5 flex flex-col justify-between flex-shrink-0">
                <div>
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-200 mb-4 flex items-center justify-center">
                    <svg className="w-12 h-12 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Actionable Data Insights</h3>
                  <div className="flex items-center gap-1.5 text-xs text-amber-500 my-1">
                    <span>★★★★★</span>
                    <span className="text-slate-600 font-semibold">4.9/5</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed my-2">Monitor performance metrics and system health in real-time.</p>
                </div>
                <div className="pt-4 flex flex-col gap-2">
                  <Button className="w-full py-2.5 rounded-xl font-bold text-xs bg-amber-400 text-slate-900 border-none" label="View Analytics" />
                  <button className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-200 text-slate-700 hover:bg-slate-300 transition">Export</button>
                </div>
              </aside>
            )}

          </div>

          {/* Bottom Activity Row */}
          {layout.hasBottomRow && (
            <div className="bg-slate-50 border-t border-slate-200 p-4 rounded-b-3xl grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-400/20 text-amber-600 font-bold flex items-center justify-center text-xs">{String.fromCharCode(64 + i)}</div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Active Node {i}</div>
                    <div className="text-[10px] text-slate-500">Live synchronized</div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    );
  }

  // 2. Standard Responsive Split-Hero / Landing Fallback
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden bg-slate-100 text-slate-900 font-sans p-4 sm:p-8 rounded-2xl">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-12 flex flex-col md:flex-row items-center gap-8 lg:gap-12">
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <img
            className="max-w-full max-h-[480px] h-auto object-cover rounded-2xl shadow-lg border border-slate-200"
            src={getImage(heroImage)}
            alt="Hero Visual Blueprint"
            onError={errorImage}
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col gap-4 text-left">
          <span
            className="inline-block px-4 py-1.5 rounded-full bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider self-start"
            dangerouslySetInnerHTML={{ __html: displayBrand }}
          />
          <h1
            className="text-3xl sm:text-5xl font-black text-slate-900 uppercase tracking-tight leading-tight"
            dangerouslySetInnerHTML={{ __html: displayHeadline }}
          />
          <p
            className="text-base sm:text-lg font-medium text-slate-600"
            dangerouslySetInnerHTML={{ __html: displaySub }}
          />
          <p
            className="text-sm text-slate-500 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: displayDesc }}
          />
          <div className="pt-2">
            <Button
              className="px-8 py-3.5 rounded-full font-bold bg-slate-900 text-white hover:bg-slate-800 transition shadow-md"
              label={displayCta}
              aria-label="Call to action"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
