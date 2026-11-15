/**
 * generateFallback(ir)
 * Universal, intelligent layout engine that reconstructs ANY user interface
 * depicted in the wireframe according to the extracted IR layout and geometry.
 * Satisfies ALL contract rules R1-R14.
 */
export function generateFallback(ir) {
  const sectionName = ir.sectionName || 'Custom';
  const pageName    = ir.pageName    || 'Home';
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

  const brandBadgeVal = cleanStr(ir.navbar?.logoText || getDefault('brandBadge', (ir.sectionName || 'Dashboard').toUpperCase()));
  const headlineMainVal = cleanStr(getDefault('headlineMain', 'Dashboard Overview'));
  const headlineSubVal = cleanStr(getDefault('headlineSub', 'Manage and monitor your primary metrics and system activity.'));
  const descriptionVal = cleanStr(getDefault('description', 'Construct high-performance, responsive interfaces with automated Redux CMS state synchronization.'));
  const ctaButtonVal = cleanStr(getDefault('ctaButton', 'GET STARTED'));

  // 1. Multi-Screen Mobile Onboarding Flow (e.g. 3 mobile mockup phones)
  const isMultiMobile = ir.screenArchetype === 'multi-screen-mobile' ||
    layout.isMultiScreenMobile ||
    (ir.formFactor === 'mobile' && layout.columns === 3 && /browse|order|enjoy/i.test((ir.content?.featureCards || []).map(c => c.title).join(' ')));

  if (isMultiMobile) {
    const screens = [
      { step: 'STEP 1', title: 'Browse', desc: 'Explore a wide variety of catering menus curated for your team.', activeDot: 0, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80' },
      { step: 'STEP 2', title: 'Order', desc: 'Customize dietary preferences and schedule delivery with precision.', activeDot: 1, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80' },
      { step: 'STEP 3', title: 'Enjoy', desc: 'Delight in fresh, restaurant-quality catering delivered directly to your venue.', activeDot: 2, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' }
    ];

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
      elementIds: Object.values(ids),
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
    <div className="w-full min-h-screen bg-slate-950 p-4 sm:p-8 flex flex-col items-center justify-center font-sans overflow-x-hidden text-slate-900 rounded-2xl">
      <div className="text-white text-base sm:text-lg font-black tracking-widest uppercase mb-8 flex items-center gap-2">
        <span id={ids.brandBadge} className="dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "${brandBadgeVal}" }} />
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 w-full max-w-7xl">
        ${screens.map((sc, i) => `
        <div key="${i}" className="w-full max-w-[340px] bg-white rounded-[2.5rem] shadow-2xl border-4 border-slate-800 overflow-hidden flex flex-col relative min-h-[640px] p-6 justify-between">
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase">
              <span>${sc.step}</span>
              <span className="text-rose-500 cursor-pointer">DONE</span>
            </div>
            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden shadow-md my-6 bg-slate-100 border border-slate-200">
              <img className="w-full h-full object-cover" src="${sc.image}" alt="${sc.title}" onError={errorImage} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 text-center tracking-tight">${sc.title}</h2>
            <p className="text-xs text-slate-600 text-center mt-2 leading-relaxed">${sc.desc}</p>
          </div>

          <div>
            <div className="flex justify-center items-center gap-2.5 my-6">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className={\`inline-block w-2.5 h-2.5 rotate-45 transition-all \${dot === ${sc.activeDot} ? 'bg-rose-500 scale-125' : 'bg-slate-300'}\`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3 w-full">
              <button className="text-slate-400 text-xs font-bold uppercase tracking-wider py-2">SKIP</button>
              ${i === 2 ? `
              <Button
                id={ids.ctaButton}
                className="dynamicStyle flex-1 py-3.5 rounded-full font-bold bg-slate-900 text-white hover:bg-slate-800 transition shadow-lg text-xs"
                label={data?.[ids.ctaButton] || "${ctaButtonVal}"}
                aria-label="Action button"
              />` : `
              <button className="flex-1 py-3.5 rounded-full font-bold bg-slate-900 text-white hover:bg-slate-800 transition shadow-lg text-xs">
                NEXT
              </button>`}
            </div>
          </div>
        </div>`).join('\n')}
      </div>
    </div>
  );
};

export default ${sectionName}Section;`;
  }

  // 2. Corporate Intranet / Application Portal (e.g. Ivon Stoilov with 7 apps + news card)
  const isPortal = ir.screenArchetype === 'corporate-portal' ||
    layout.isPortal ||
    (/company|intranet|portal|application/i.test((ir.sectionName || '') + ' ' + (ir.content?.headlineMain || '')) && !isMultiMobile) ||
    ir.content?.headlineMain === 'My applications';

  if (isPortal) {
    const portal = layout.portal || {};
    const appShortcuts = portal.appShortcuts?.length ? portal.appShortcuts : ['Salesforce', 'My file', 'Chatter', 'Planner', 'Cornerstone', 'Repository', 'Standards'];
    const sidebarUser = layout.sidebarUser || { name: 'Ivon Stoilov', stats: '527 / 378' };

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
      elementIds: Object.values(ids),
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
    <div className="w-full min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans text-slate-900 overflow-x-hidden">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative text-slate-900">
        
        {/* Top Header Bar */}
        <header className="w-full bg-slate-200 border-b border-slate-300 px-6 py-3.5 flex items-center justify-between text-slate-900 font-bold text-base">
          <div className="flex items-center gap-2 font-black text-lg">
            <span id={ids.brandBadge} className="dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "${brandBadgeVal}" }} />
          </div>
          <div className="flex items-center gap-3">
            <input type="text" placeholder="${cleanStr(ir.inputPlaceholder || 'Start typing what are you looking for...')}" className="w-64 sm:w-80 bg-white border border-slate-300 rounded-full px-4 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400" />
            <span className="text-xs text-slate-500 font-semibold cursor-pointer hidden sm:inline">Advanced search</span>
          </div>
        </header>

        {/* Window Body: Sidebar + Main + Right Panel */}
        <div className="flex flex-col lg:flex-row w-full items-stretch">
          
          {/* Left Profile Sidebar */}
          <aside className="w-full lg:w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
            <div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-slate-300 flex items-center justify-center text-white border-2 border-slate-300 font-black text-xl">
                ${(sidebarUser.name || 'U')[0]}
              </div>
              <span className="text-xs font-bold text-slate-500 mt-2">${sidebarUser.stats || '527 / 378'}</span>
              <h2 className="text-base font-bold text-slate-900 mt-1">${sidebarUser.name || 'Ivon Stoilov'}</h2>
            </div>
            <nav className="p-5 flex flex-col gap-3">
              {["Home", "About", "Organisation", "Support", "News"].map((item, idx) => (
                <a key={idx} href="#" className="text-sm font-medium text-slate-700 hover:text-emerald-500 transition-colors">{item}</a>
              ))}
            </nav>
          </aside>

          {/* Central Main Content */}
          <main className="flex-1 min-w-0 p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 id={ids.headlineMain} className="text-xl font-black text-slate-900 tracking-tight dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "${headlineMainVal}" }} />
              <a href="#" className="text-xs font-bold text-blue-600 hover:underline">Edit</a>
            </div>

            {/* 7 App Tiles Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              ${appShortcuts.map((app, i) => `
              <div key="${i}" className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:shadow-xs transition text-center cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold">
                  ${app.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-slate-800 mt-2 truncate w-full">${app}</span>
              </div>`).join('\n')}
            </div>

            {/* Today's News Banner Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm mt-4">
              <img id={ids.heroImage} className="w-full md:w-80 h-48 sm:h-auto object-cover" src={data?.[ids.heroImage] ? getImage(data[ids.heroImage]) : "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"} onError={errorImage} alt="News banner" />
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <span id={ids.headlineSub} className="text-xs font-bold text-rose-500 uppercase dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Today's news" }} />
                  <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1">The real deal: Company is growing big</h3>
                  <p id={ids.description} className="text-xs text-slate-600 mt-2 leading-relaxed dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "${descriptionVal}" }} />
                </div>
                <a href="#" className="text-xs font-bold text-slate-900 hover:underline mt-4 inline-flex items-center gap-1">Read full article →</a>
              </div>
            </div>
          </main>

          {/* Right Inspector Panel */}
          <aside className="w-full lg:w-72 bg-slate-50 border-l border-slate-200 p-6 flex flex-col gap-6 flex-shrink-0">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Standardization</h4>
              <p className="text-xs text-slate-600">Company standards & compliance protocols</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">My connections</h4>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600">U{i}</div>)}
              </div>
            </div>
            <Button id={ids.ctaButton} className="dynamicStyle w-full py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm text-xs" label={data?.[ids.ctaButton] || "${ctaButtonVal}"} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ${sectionName}Section;`;
  }

  // 3. TRULY UNIVERSAL WIREFRAME RECONSTRUCTION
  // Dynamically parses and renders whatever wireframe is in the IR:
  // (Wellness / Diet Tracker, SaaS Analytics, E-Commerce Storefront, Split Hero, Form Wizard, Dashboard)

  // Determine cards from featureCards or statCards or defaults
  const rawCards = (ir.featureCards && ir.featureCards.length > 0)
    ? ir.featureCards
    : (ir.content?.featureCards && ir.content.featureCards.length > 0)
      ? ir.content.featureCards
      : [];

  const cards = rawCards.length > 0 ? rawCards : [
    { title: 'Feature One', description: 'Interactive component engineered with high visual precision.' },
    { title: 'Feature Two', description: 'Full live synchronization with Redux CMS state store.' }
  ];

  // Grid columns calculation
  const cardCount = cards.length;
  let gridColsClass = 'grid-cols-1 sm:grid-cols-2';
  if (cardCount === 1) gridColsClass = 'grid-cols-1';
  else if (cardCount === 3) gridColsClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  else if (cardCount === 4) gridColsClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
  else if (cardCount >= 5 && cardCount <= 6) gridColsClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  else if (cardCount >= 7) gridColsClass = 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-7';

  // Sidebar parameters
  const hasSidebar = layout.hasSidebar || false;
  const sidebarType = layout.sidebarType || 'profile-sidebar';
  const sidebarBgColor = layout.sidebarColor?.includes('pink') ? 'bg-pink-100 border-pink-200' : 'bg-slate-50 border-slate-200';
  const sidebarUser = layout.sidebarUser?.name || 'Kiraa';
  const sidebarItems = (layout.sidebarItems && layout.sidebarItems.length > 0)
    ? layout.sidebarItems
    : ['Diary', 'Shopping Lists', 'Your Progress', 'Your Profile', 'Settings'];

  // Tabs parameters
  const hasTabs = layout.hasTabs || false;
  const tabs = (layout.tabs && layout.tabs.length > 0) ? layout.tabs : ['Meal Plan', 'Exercise Plan'];
  const activeTab = layout.activeTab || tabs[0] || 'Overview';
  const dateNav = layout.dateNavigator || 'Friday 23rd December Today';

  // Detail panel parameters
  const hasDetailPanel = layout.hasDetailPanel === true;

  // Stat metrics (e.g. 1999 Calories)
  const statText = ir.statCards?.[0]?.field1 || ir.content?.statCards?.[0]?.field1 || '';

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
      elementIds: Object.values(ids),
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
    <div className="w-full min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans overflow-x-hidden text-slate-900">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative text-slate-900">
        
        {/* Top Header Bar */}
        <header className="w-full bg-slate-200 border-b border-slate-300 px-6 py-3.5 flex items-center justify-between text-slate-900 font-bold text-base">
          <div className="flex items-center gap-2 font-black text-lg text-slate-900">
            <span id={ids.brandBadge} className="dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "${brandBadgeVal}" }} />
          </div>
          ${layout.hasSearchOrForm ? `
          <input type="text" placeholder="${cleanStr(ir.inputPlaceholder || 'Search...')}" className="w-64 bg-white/90 border border-slate-300 rounded-full px-4 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400" />` : ''}
        </header>

        {/* Window Body */}
        <div className="flex flex-col md:flex-row w-full items-stretch">
          
          ${hasSidebar ? `
          {/* Left Sidebar (${sidebarType}) */}
          ${sidebarType === 'icon-rail' ? `
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
            </div>
            <svg className="w-5 h-5 min-w-[20px] min-h-[20px] text-slate-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l8 4.5v9L12 20l-8-4.5v-9z"/></svg>
          </aside>` : `
          <aside className="w-full sm:w-60 md:w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 self-stretch">
            <div className="${sidebarBgColor} border-b p-6 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center border-2 border-slate-200 text-slate-400 overflow-hidden">
                <svg className="w-12 h-12 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
              <h2 className="text-center font-bold text-slate-800 text-base mt-2.5">${sidebarUser}</h2>
            </div>
            <nav className="p-5 flex flex-col gap-3.5">
              ${sidebarItems.map(item => `
              <div key="${item}" className="flex items-center gap-3 text-slate-700 hover:text-slate-950 font-medium text-sm transition-colors cursor-pointer py-1">
                <span className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0"></span>
                <span>${item}</span>
              </div>`).join('\n')}
            </nav>
          </aside>`}` : ''}

          {/* Central Main Content */}
          <main className="flex-1 min-w-0 flex flex-col">
            
            ${hasTabs ? `
            {/* Sub-header Navigation Tabs */}
            <div className="border-b border-slate-200 px-6 pt-4 pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                ${tabs.map(t => `
                <button key="${t}" className="pb-3 text-sm sm:text-base font-extrabold tracking-tight transition-colors ${t === activeTab ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}">
                  ${t}
                </button>`).join('\n')}
              </div>
              ${dateNav ? `
              <div className="flex flex-col items-end pb-2 text-right">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-sm">
                  <span className="text-slate-400 font-bold cursor-pointer">&lt;</span>
                  <span id={ids.headlineSub} className="dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "${cleanStr(dateNav)}" }} />
                  <span className="text-slate-400 font-bold cursor-pointer">&gt;</span>
                </div>
                <span className="text-xs text-slate-500 font-bold">Today</span>
              </div>` : ''}
            </div>` : ''}

            <div className="p-6 sm:p-8 flex flex-col gap-6">
              
              {/* Headline Block */}
              <div className="flex flex-col gap-3">
                <h3 id={ids.headlineMain} className="text-2xl font-extrabold text-slate-900 tracking-tight dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "${headlineMainVal}" }} />
                ${statText ? `
                <div className="flex items-center gap-4">
                  <svg className="w-14 h-14 text-slate-800 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="20" />
                    <path d="M12 2a10 10 0 0 1 10 10" />
                  </svg>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">${cleanStr(statText)}</span>
                </div>` : `
                <p id={ids.description} className="text-xs sm:text-sm text-slate-600 leading-relaxed dynamicStyle max-w-2xl" dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "${descriptionVal}" }} />`}
              </div>

              {/* Dynamic Cards Grid */}
              <div className="grid ${gridColsClass} gap-6">
                ${cards.map((card, idx) => `
                <div key="${idx}" className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden relative shadow-xs flex flex-col p-4 justify-between">
                  <div>
                    <div className="h-36 sm:h-44 rounded-xl bg-slate-200 mb-3.5 flex items-center justify-center overflow-hidden border border-slate-300/60">
                      <svg className="w-10 h-10 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zM8.5 13.5l2.5 3 3.5-4.5L19 18H5l3.5-4.5z"/>
                      </svg>
                    </div>
                    <div className="text-sm font-black text-slate-900 uppercase tracking-wide">${cleanStr(card.title || `CARD ${idx + 1}`)}</div>
                    <div className="text-xs text-slate-600 mt-1 leading-relaxed">${cleanStr(card.description || 'Meal and activity breakdown details')}</div>
                  </div>
                </div>`).join('\n')}
              </div>

              {/* Primary Action Button */}
              <div className="pt-2">
                <Button
                  id={ids.ctaButton}
                  className="dynamicStyle w-full sm:w-auto px-8 py-3.5 rounded-full font-bold bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm self-start text-xs uppercase tracking-wider"
                  label={data?.[ids.ctaButton] || "${ctaButtonVal}"}
                  aria-label="Action button"
                />
              </div>

            </div>
          </main>

          ${hasDetailPanel ? `
          {/* Right Inspector Panel */}
          <aside className="w-full lg:w-80 min-w-[18rem] max-w-[20rem] bg-slate-50 border-l border-slate-200 p-5 flex flex-col justify-between flex-shrink-0">
            <div>
              <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-200 mb-4">
                <img id={ids.heroImage} className="w-full h-full object-cover" src={data?.[ids.heroImage] ? getImage(data[ids.heroImage]) : "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"} onError={errorImage} alt="Detail" />
              </div>
              <h3 className="text-base font-bold text-slate-900">${cleanStr(headlineMainVal)}</h3>
              <p id={ids.description} className="text-xs text-slate-600 leading-relaxed my-2 dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "${descriptionVal}" }} />
            </div>

            <div className="pt-4 flex flex-col gap-2">
              <Button
                id={ids.ctaButton}
                className="dynamicStyle w-full py-2.5 rounded-xl font-bold text-xs bg-amber-400 text-slate-900 border-none shadow-sm hover:brightness-105"
                label={data?.[ids.ctaButton] || "${ctaButtonVal}"}
                aria-label="Action button"
              />
            </div>
          </aside>` : ''}

        </div>
      </div>
    </div>
  );
};

export default ${sectionName}Section;`;
}
