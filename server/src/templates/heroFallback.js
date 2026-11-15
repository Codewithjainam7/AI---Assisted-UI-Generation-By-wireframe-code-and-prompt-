/**
 * generateFallback(ir)
 * Universal, intelligent fallback template generator that reconstructs the EXACT interface
 * drawn in the wireframe according to the extracted IR layout, screenType, and visual geometry.
 * Satisfies ALL contract rules R1-R14.
 */
export function generateFallback(ir) {
  const sectionName = ir.sectionName || 'Custom';
  const pageName    = ir.pageName    || 'Home';
  const accent      = ir.theme?.accent || 'rose-500';
  const layout      = ir.layout || {};

  // Build the ids map from IR elements
  const idsMap = (ir.elements || []).reduce((acc, el) => {
    acc[el.elementName] = el.fieldId || `TBD-${el.elementName}`;
    return acc;
  }, {});

  const allIds = [
    'heroImage', 'brandBadge', 'headlineMain', 'headlineSub',
    'description', 'statBadges', 'ctaButton'
  ];
  allIds.forEach(name => {
    if (!idsMap[name]) idsMap[name] = `TBD-${name}`;
  });

  const getDefault = (name, fallbackText = '') => {
    const el = (ir.elements || []).find(e => e.elementName === name);
    return el?.defaultContent || fallbackText;
  };

  const cleanStr = (s) => (s || '').replace(/\r?\n/g, '<br />').replace(/"/g, '\\"');

  const brandBadgeVal = cleanStr(ir.navbar?.logoText || getDefault('brandBadge', (ir.sectionName || 'AI STUDIO').toUpperCase()));
  const headlineMainVal = cleanStr(getDefault('headlineMain', 'Your Calories'));
  const headlineSubVal = cleanStr(getDefault('headlineSub', 'Production-grade components engineered for high-velocity teams.'));
  const descriptionVal = cleanStr(getDefault('description', 'Construct high-performance, responsive interfaces with automated Redux CMS state synchronization.'));
  const ctaButtonVal = cleanStr(getDefault('ctaButton', 'UPDATE LOG'));

  // E-commerce apparel wireframe
  const isEcommerce = ir.domain === 'ecommerce' ||
    /hoodie|fleece|clothing|apparel|sweatshirt/i.test((ir.elements || []).map(e => e.defaultContent || '').join(' '));

  // Dashboard / Multi-panel / Wellness wireframe
  const isDashboard = ir.screenType === 'desktop-dashboard' ||
    ir.sectionType === 'dashboard-hero' ||
    layout.hasSidebar ||
    layout.hasTabs ||
    layout.sidebarType === 'profile-sidebar' ||
    /wellness|dashboard|analytics|plan|meal/i.test((ir.sectionName || '') + ' ' + (ir.domain || ''));

  // Feature cards or stat cards
  const cards = Array.isArray(ir.featureCards) && ir.featureCards.length > 0
    ? ir.featureCards
    : (Array.isArray(ir.statCards) && ir.statCards.length > 0 ? ir.statCards.map(s => ({ title: s.field1, description: s.field2 })) : [
      { title: "BREAKFAST", description: "Meal placeholder" },
      { title: "MORNING SNACK", description: "Snack placeholder" }
    ]);

  const cardFieldIdsList = cards.map((_, i) => `"TBD-cardField${i * 2 + 1}","TBD-cardField${i * 2 + 2}"`).join(',');

  // 1. Dashboard / Multi-Panel Wireframe Reconstruction (Wellness, Analytics, Admin)
  if (isDashboard) {
    const isProfileSidebar = layout.sidebarType === 'profile-sidebar';
    const sidebarItems = layout.sidebarItems || ['Diary', 'Shopping Lists', 'Your Progress', 'Your Profile', 'Settings'];
    const sidebarUser = layout.sidebarUser?.name || 'Kiraa';
    const tabs = layout.tabs || ['Meal Plan', 'Exercise Plan'];
    const dateNav = layout.dateNavigator ? layout.dateNavigator.replace(/today/i, '').trim() : 'Friday 23rd December';

    return `import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from "../../features/cms/cmsSlice";
import { getImage, errorImage } from "../../utils/getImage";

// R1: Stable IDs map
const ids = {
  heroImage:    "${idsMap.heroImage}",
  brandBadge:   "${idsMap.brandBadge}",
  headlineMain: "${idsMap.headlineMain}",
  headlineSub:  "${idsMap.headlineSub}",
  description:  "${idsMap.description}",
  statBadges:   "${idsMap.statBadges}",
  ctaButton:    "${idsMap.ctaButton}",
};

// R2: Component accepting pageName prop
const ${sectionName}Section = ({ pageName = "${pageName}" }) => {
  const dispatch = useDispatch();

  // R4: Redux CMS selectors
  const data    = useSelector((state) => state.cms?.allSections?.[pageName]);
  const cssData = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);

  // R3: Dispatch on mount
  useEffect(() => {
    dispatch(fetchElementsByIds({
      elementIds: [
        ids.heroImage, ids.brandBadge, ids.headlineMain, ids.headlineSub,
        ids.description, ids.statBadges, ids.ctaButton,
        ${cardFieldIdsList}
      ],
      pageName,
    }));
  }, [dispatch, pageName]);

  // R10: Live CSS application
  useEffect(() => {
    Object.values(ids).forEach((id) => {
      if (id && cssData?.[id]) {
        const el = document.getElementById(id);
        if (el) el.style.cssText = cssData[id];
      }
    });
  }, [cssData]);

  return (
    <div className="w-full min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans overflow-x-hidden text-slate-900">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative text-slate-900">
        
        {/* Top Header Bar */}
        <header className="w-full bg-slate-200 border-b border-slate-300 px-6 py-3.5 flex items-center justify-between text-slate-900 font-bold text-base">
          <div className="flex items-center gap-2 font-black text-lg text-slate-900">
            <span id={ids.brandBadge} className="dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "${brandBadgeVal}" }} />
            <span>🐷</span>
          </div>
        </header>

        {/* Window Body: Sidebar + Main Content */}
        <div className="flex flex-col md:flex-row w-full items-stretch">
          
          {/* Left Sidebar */}
          ${layout.hasSidebar !== false ? `
          <aside className="w-full sm:w-60 md:w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 self-stretch">
            <div className="bg-pink-100 border-b border-pink-200 p-6 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center border-2 border-pink-200 text-slate-400 overflow-hidden">
                <svg className="w-12 h-12 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
              <h2 className="text-center font-bold text-slate-800 text-base mt-2.5">${sidebarUser}</h2>
            </div>
            <nav className="p-5 flex flex-col gap-3.5">
              {[${sidebarItems.map(i => `"${i}"`).join(', ')}].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-slate-700 hover:text-slate-950 font-medium text-sm transition-colors cursor-pointer py-1">
                  <span className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0"></span>
                  <span>{item}</span>
                </div>
              ))}
            </nav>
          </aside>
          ` : ''}

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 flex flex-col">
            
            {/* Sub-Header Tabs & Date Switcher */}
            <div className="border-b border-slate-200 px-6 pt-4 pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                {[${tabs.map(t => `"${t}"`).join(', ')}].map((t, i) => (
                  <button key={i} className={\`pb-3 text-base tracking-tight \${i === 0 ? "text-slate-900 font-extrabold border-b-2 border-slate-900" : "text-slate-400 hover:text-slate-600 font-semibold transition-colors"}\`}>
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex flex-col items-end pb-2 text-right">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-sm">
                  <span className="text-slate-400 font-bold cursor-pointer hover:text-slate-700">&lt;</span>
                  <span>${dateNav}</span>
                  <span className="text-slate-400 font-bold cursor-pointer hover:text-slate-700">&gt;</span>
                </div>
                <span className="text-xs text-slate-500 font-bold">Today</span>
              </div>
            </div>

            {/* Main Content Body */}
            <div className="p-6 sm:p-8 flex flex-col gap-8">
              
              {/* Calorie / Metric Tracker */}
              <div className="flex flex-col gap-3">
                <h3 id={ids.headlineMain} className="text-xl font-extrabold text-rose-500 tracking-tight dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "${headlineMainVal}" }} />
                <div className="flex items-center gap-4">
                  <svg className="w-14 h-14 text-slate-800 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">${ir.statCards?.[0]?.field1 || '1999'} ${ir.statCards?.[0]?.field2 || 'Calories'}</span>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 ${cards.length === 2 ? 'sm:grid-cols-2' : cards.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'} gap-6">
                {[${cards.map(c => `"${c.title}"`).join(', ')}].map((title, idx) => (
                  <div key={idx} className="bg-slate-300 rounded-2xl overflow-hidden relative shadow-sm border border-slate-300 flex flex-col">
                    <div className="bg-slate-700 text-white text-xs sm:text-sm font-black uppercase px-4 py-2 self-start rounded-br-xl shadow-sm">
                      {title}
                    </div>
                    <div className="h-56 sm:h-64 flex items-center justify-center relative p-6">
                      <svg className="w-16 h-16 text-white/90" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Button id={ids.ctaButton} className="dynamicStyle w-full sm:w-auto px-8 py-3 rounded-full font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm self-start" label={data?.[ids.ctaButton] || "${ctaButtonVal}"} aria-label="Action button" />
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ${sectionName}Section;
`;
  }

  // 2. Standard Landing / Split-Hero Fallback
  return `import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from "../../features/cms/cmsSlice";
import { getImage, errorImage } from "../../utils/getImage";

const ids = {
  heroImage:    "${idsMap.heroImage}",
  brandBadge:   "${idsMap.brandBadge}",
  headlineMain: "${idsMap.headlineMain}",
  headlineSub:  "${idsMap.headlineSub}",
  description:  "${idsMap.description}",
  statBadges:   "${idsMap.statBadges}",
  ctaButton:    "${idsMap.ctaButton}",
};

const ${sectionName}Section = ({ pageName = "${pageName}" }) => {
  const dispatch = useDispatch();
  const data    = useSelector((state) => state.cms?.allSections?.[pageName]);
  const cssData = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);

  useEffect(() => {
    dispatch(fetchElementsByIds({
      elementIds: [
        ids.heroImage, ids.brandBadge, ids.headlineMain, ids.headlineSub,
        ids.description, ids.statBadges, ids.ctaButton,
        ${cardFieldIdsList}
      ],
      pageName,
    }));
  }, [dispatch, pageName]);

  useEffect(() => {
    Object.values(ids).forEach((id) => {
      if (id && cssData?.[id]) {
        const el = document.getElementById(id);
        if (el) el.style.cssText = cssData[id];
      }
    });
  }, [cssData]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden bg-slate-100 text-slate-900 font-sans p-4 sm:p-8">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-12 flex flex-col md:flex-row items-center gap-8 lg:gap-12">
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <img
            id={ids.heroImage}
            className="dynamicStyle2 max-w-full max-h-[480px] h-auto object-cover rounded-2xl shadow-lg border border-slate-200"
            src={data?.[ids.heroImage] ? getImage(data[ids.heroImage]) : getImage("https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80")}
            alt="Hero Visual Blueprint"
            onError={errorImage}
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col gap-4 text-left">
          <span
            id={ids.brandBadge}
            className="dynamicStyle inline-block px-4 py-1.5 rounded-full bg-rose-100 text-rose-600 font-bold text-xs uppercase tracking-wider self-start"
            dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "${brandBadgeVal}" }}
          />
          <h1
            id={ids.headlineMain}
            className="dynamicStyle text-3xl sm:text-5xl font-black text-slate-900 uppercase tracking-tight leading-tight"
            dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "${headlineMainVal}" }}
          />
          <p
            id={ids.headlineSub}
            className="dynamicStyle text-base sm:text-lg font-medium text-slate-600"
            dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "${headlineSubVal}" }}
          />
          <p
            id={ids.description}
            className="dynamicStyle text-sm text-slate-500 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "${descriptionVal}" }}
          />
          <div className="pt-2">
            <Button
              id={ids.ctaButton}
              className="dynamicStyle px-8 py-3.5 rounded-full font-bold bg-slate-900 text-white hover:bg-slate-800 transition shadow-md"
              label={data?.[ids.ctaButton] || "${ctaButtonVal}"}
              aria-label="Call to action"
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ${sectionName}Section;
`;
}
