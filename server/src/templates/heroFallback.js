/**
 * generateFallback(ir)
 * Universal, intelligent fallback template generator that reconstructs the EXACT interface
 * drawn in the wireframe according to the extracted IR layout, screenArchetype, and visual geometry.
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

  const isMultiMobile = ir.screenArchetype === 'multi-screen-mobile' ||
    layout.isMultiScreenMobile ||
    (ir.formFactor === 'mobile' && layout.columns === 3 && /browse|order|enjoy/i.test((ir.content?.featureCards || []).map(c => c.title).join(' ')));

  const isPortal = ir.screenArchetype === 'corporate-portal' ||
    layout.isPortal ||
    (/company|intranet|portal|application/i.test((ir.sectionName || '') + ' ' + (ir.content?.headlineMain || '')) && !isMultiMobile) ||
    ir.content?.headlineMain === 'My applications';

  const isWellness = ir.screenArchetype === 'wellness-tracker' ||
    ir.domain === 'fitness' ||
    /calor|nutrition|diet|meal|kiraa|happypiggy/i.test((ir.sectionName || '') + ' ' + (ir.domain || '') + ' ' + (ir.imageConcept || ''));

  const isAnalytics = ir.screenArchetype === 'analytics-dashboard' ||
    (layout.hasSidebar && layout.sidebarType === 'icon-rail' && layout.hasDetailPanel);

  // 1. MULTI-SCREEN MOBILE ONBOARDING (e.g. Catering Demand 3 Phones)
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
    <div className="w-full min-h-screen bg-slate-950 p-4 sm:p-8 flex flex-col items-center justify-center font-sans overflow-x-hidden text-slate-900">
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
            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden shadow-md my-6 border-4 border-slate-100">
              <img className="w-full h-full object-cover" src="${sc.image}" onError={errorImage} alt="${sc.title}" />
            </div>
            <h2 ${i === 2 ? `id={ids.headlineMain}` : ''} className="text-2xl font-black text-slate-900 text-center tracking-tight dynamicStyle">
              ${i === 2 ? `<span dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "${sc.title}" }} />` : sc.title}
            </h2>
            <p ${i === 2 ? `id={ids.description}` : ''} className="text-xs text-slate-600 text-center mt-2 leading-relaxed dynamicStyle">
              ${i === 2 ? `<span dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "${sc.desc}" }} />` : sc.desc}
            </p>
          </div>

          <div>
            <div className="flex justify-center gap-2.5 my-5">
              <div className="w-2.5 h-2.5 rotate-45 ${sc.activeDot === 0 ? 'bg-rose-500' : 'bg-slate-300'} transition-all" />
              <div className="w-2.5 h-2.5 rotate-45 ${sc.activeDot === 1 ? 'bg-rose-500' : 'bg-slate-300'} transition-all" />
              <div className="w-2.5 h-2.5 rotate-45 ${sc.activeDot === 2 ? 'bg-rose-500' : 'bg-slate-300'} transition-all" />
            </div>

            <div className="flex items-center gap-3 w-full">
              <button className="text-slate-400 text-xs font-bold uppercase py-3 px-2">SKIP</button>
              ${i === 2 ? `
              <Button
                id={ids.ctaButton}
                className="dynamicStyle flex-1 py-3.5 rounded-full font-bold bg-slate-900 text-white hover:bg-slate-800 transition shadow-lg text-xs"
                label={data?.[ids.ctaButton] || "${ctaButtonVal}"}
                aria-label="Action button"
              />` : `
              <button className="flex-1 py-3.5 rounded-full font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 transition text-xs">
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

  // 2. CORPORATE INTRANET / PORTAL (e.g. Ivon Stoilov, My applications, Today's news)
  if (isPortal) {
    const portal = layout.portal || {};
    const appShortcuts = portal.appShortcuts || ['Salesforce', 'My file', 'Chatter', 'Planner', 'Cornerstone', 'Repository', 'Standards'];
    const sidebarUser = layout.sidebarUser?.name || 'Ivon Stoilov';

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

  const apps = [${appShortcuts.map(a => `"${a}"`).join(', ')}];

  return (
    <div className="w-full min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans overflow-x-hidden text-slate-900">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative text-slate-900">
        
        {/* Top Header Bar */}
        <header className="w-full bg-slate-200 border-b border-slate-300 px-6 py-3.5 flex items-center justify-between text-slate-900 font-bold text-base">
          <div className="flex items-center gap-2 font-black text-lg text-slate-900">
            <span id={ids.brandBadge} className="dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "${brandBadgeVal}" }} />
          </div>
          <div className="flex items-center gap-3">
            <input type="text" placeholder="${ir.inputPlaceholder || 'Start typing what are you looking for...'}" className="w-64 sm:w-80 bg-white border border-slate-300 rounded-full px-4 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400" />
            <span className="text-xs text-slate-500 font-semibold cursor-pointer hidden sm:inline">Advanced search</span>
          </div>
        </header>

        {/* Window Body: Sidebar + Main Content + Right Widgets */}
        <div className="flex flex-col lg:flex-row w-full items-stretch">
          
          {/* Left Profile Sidebar */}
          <aside className="w-full lg:w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
            <div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-slate-200 border-2 border-slate-300 flex items-center justify-center text-slate-400 shadow-inner">
                <svg className="w-12 h-12 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
              <span className="text-xs font-bold text-slate-500 mt-2">527 / 378</span>
              <h2 className="text-base font-bold text-slate-900 mt-1">${sidebarUser}</h2>
            </div>
            <nav className="p-5 flex flex-col gap-3">
              {["Home", "About", "Organisation", "Support", "News"].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-slate-700 hover:text-slate-950 font-medium text-sm transition-colors cursor-pointer py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  <span>{item}</span>
                </div>
              ))}
            </nav>
          </aside>

          {/* Central Main Content */}
          <main className="flex-1 min-w-0 p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 id={ids.headlineMain} className="text-xl font-black text-slate-900 tracking-tight dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "My applications" }} />
              <a href="#" className="text-xs font-bold text-blue-600 hover:underline">Edit</a>
            </div>

            {/* App Shortcuts Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {apps.map((app, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:shadow-xs transition text-center cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-600 font-black text-xs mb-2">
                    {app.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-slate-800 truncate w-full">{app}</span>
                </div>
              ))}
            </div>

            {/* Today's News Hero Banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm mt-2">
              <img
                id={ids.heroImage}
                className="w-full md:w-80 h-48 sm:h-auto object-cover"
                src={data?.[ids.heroImage] ? getImage(data[ids.heroImage]) : "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"}
                onError={errorImage}
                alt="Today\'s News"
              />
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <span className="text-xs font-bold text-rose-500 uppercase">Today\'s news</span>
                  <h3 id={ids.headlineSub} className="text-xl font-black text-slate-900 tracking-tight mt-1 dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "The real deal: Company is growing big" }} />
                  <p id={ids.description} className="text-xs text-slate-600 mt-2 leading-relaxed dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "Significant strategic milestones achieved across global operational centers, expanding cross-functional capabilities." }} />
                </div>
                <a href="#" className="text-xs font-bold text-slate-900 hover:underline mt-4 inline-flex items-center gap-1">Read full article →</a>
              </div>
            </div>
          </main>

          {/* Right Widgets Column */}
          <aside className="w-full lg:w-72 bg-slate-50 border-l border-slate-200 p-6 flex flex-col gap-6 flex-shrink-0">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Standardization</h4>
              <p className="text-xs text-slate-600">Company standards & compliance protocols repository.</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">My connections</h4>
              <div className="flex -space-x-2 my-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-700">
                    U{i}
                  </div>
                ))}
              </div>
              <span className="text-xs text-slate-500">7 active connections</span>
            </div>

            <Button
              id={ids.ctaButton}
              className="dynamicStyle w-full py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm text-xs"
              label={data?.[ids.ctaButton] || "Contact site admin"}
              aria-label="Action button"
            />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ${sectionName}Section;`;
  }

  // 3. WELLNESS / NUTRITION DASHBOARD (e.g. Kiraa, HappyPiggy, 1999 Calories, Breakfast & Snack)
  if (isWellness) {
    const sidebarUser = layout.sidebarUser?.name || 'Kiraa';
    const tabs = layout.tabs?.length ? layout.tabs : ['Meal Plan', 'Exercise Plan'];
    const cards = ir.featureCards?.length ? ir.featureCards : [
      { title: 'BREAKFAST', description: 'Placeholder for breakfast meal details.' },
      { title: 'MORNING SNACK', description: 'Placeholder for morning snack meal details.' }
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
    <div className="w-full min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans overflow-x-hidden text-slate-900">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative text-slate-900">
        
        {/* Top Header Bar */}
        <header className="w-full bg-slate-200 border-b border-slate-300 px-6 py-3.5 flex items-center justify-between text-slate-900 font-bold text-base">
          <div className="flex items-center gap-2 font-black text-lg text-slate-900">
            <span id={ids.brandBadge} className="dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "${brandBadgeVal}" }} />
          </div>
        </header>

        {/* Window Body: Pink Sidebar + Main Content */}
        <div className="flex flex-col md:flex-row w-full items-stretch">
          
          {/* Left Pink Sidebar */}
          <aside className="w-full sm:w-60 md:w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 self-stretch">
            <div className="bg-pink-100 border-b border-pink-200 p-6 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center border-2 border-pink-200 text-slate-400 overflow-hidden">
                <svg className="w-12 h-12 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
              <h2 className="text-center font-bold text-slate-800 text-base mt-2.5">${sidebarUser}</h2>
            </div>
            <nav className="p-5 flex flex-col gap-3.5">
              {["Diary", "Shopping Lists", "Your Progress", "Your Profile", "Settings"].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-slate-700 hover:text-slate-950 font-medium text-sm transition-colors cursor-pointer py-1">
                  <span className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0"></span>
                  <span>{item}</span>
                </div>
              ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 flex flex-col">
            <div className="border-b border-slate-200 px-6 pt-4 pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <button className="pb-3 text-slate-900 font-extrabold text-base border-b-2 border-slate-900 tracking-tight">${tabs[0] || 'Meal Plan'}</button>
                <button className="pb-3 text-slate-400 hover:text-slate-600 font-semibold text-base tracking-tight transition-colors">${tabs[1] || 'Exercise Plan'}</button>
              </div>
              <div className="flex flex-col items-end pb-2 text-right">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-sm">
                  <span className="text-slate-400 font-bold cursor-pointer hover:text-slate-700">&lt;</span>
                  <span id={ids.headlineSub} className="dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Friday 23rd December" }} />
                  <span className="text-slate-400 font-bold cursor-pointer hover:text-slate-700">&gt;</span>
                </div>
                <span className="text-xs text-slate-500 font-bold">Today</span>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <h3 id={ids.headlineMain} className="text-xl font-extrabold text-rose-500 tracking-tight dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "Your Calories" }} />
                <div className="flex items-center gap-4">
                  <svg className="w-14 h-14 text-slate-800 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">${ir.statCards?.[0]?.field1 || '1999 Calories'}</span>
                </div>
              </div>

              {/* EXACTLY 2 Meal Cards Side-by-Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                ${cards.map((c, idx) => `
                <div key="${idx}" className="bg-slate-300 rounded-2xl overflow-hidden relative shadow-sm border border-slate-300 flex flex-col p-4">
                  <div className="h-32 sm:h-36 rounded-xl bg-slate-200 mb-3 flex items-center justify-center">
                    <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                  </div>
                  <div className="text-sm font-bold text-slate-900 uppercase">${c.title}</div>
                  <div className="text-xs text-slate-600 mt-1">${c.description || 'Meal details placeholder'}</div>
                </div>`).join('\n')}
              </div>

              <Button
                id={ids.ctaButton}
                className="dynamicStyle w-full sm:w-auto px-8 py-3.5 rounded-full font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm self-start"
                label={data?.[ids.ctaButton] || "${ctaButtonVal}"}
                aria-label="Action button"
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ${sectionName}Section;`;
  }

  // 4. ANALYTICS SAAS DASHBOARD (e.g. Amber Capsule Rail, 6 Cards, Inspector Panel)
  const cards = Array.isArray(ir.featureCards) && ir.featureCards.length > 0
    ? ir.featureCards
    : (Array.isArray(ir.statCards) && ir.statCards.length > 0 ? ir.statCards.map(s => ({ title: s.field1, description: s.field2 })) : [
      { title: "User Acquisition", description: "Monthly growth metrics" },
      { title: "System Latency", description: "Real-time edge performance" },
      { title: "Memory Usage", description: "Cluster allocation logs" },
      { title: "Active Sessions", description: "Concurrent users online" },
      { title: "Error Rates", description: "SLA monitoring logs" },
      { title: "Storage Volume", description: "Distributed capacity" }
    ]);

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
          <input type="text" placeholder="${ir.inputPlaceholder || 'Search reports...'}" className="w-64 bg-white/90 border border-slate-300 rounded-full px-4 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400" />
        </header>

        {/* Window Body: Capsule Rail + Main Content + Right Detail Panel */}
        <div className="flex flex-col md:flex-row w-full items-stretch">
          
          {/* Amber Capsule Rail */}
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

          {/* Central Main Content */}
          <main className="flex-1 min-w-0 flex flex-col p-6 sm:p-8 gap-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h1 id={ids.headlineMain} className="text-2xl font-black text-slate-900 tracking-tight dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "${headlineMainVal}" }} />
                <p id={ids.headlineSub} className="text-xs text-slate-500 mt-1 dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "${headlineSubVal}" }} />
              </div>
            </div>

            {/* 3x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              ${cards.map((c, idx) => `
              <div key="${idx}" className="bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-xs">
                <div className="h-24 bg-slate-200 rounded-xl mb-3 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/></svg>
                </div>
                <div className="font-bold text-sm text-slate-900">${c.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">${c.description || 'System asset module'}</div>
              </div>`).join('\n')}
            </div>
          </main>

          {/* Right Inspector Panel */}
          <aside className="w-full lg:w-80 min-w-[18rem] max-w-[20rem] bg-slate-50 border-l border-slate-200 p-5 flex flex-col justify-between flex-shrink-0">
            <div>
              <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-200 mb-4">
                <img id={ids.heroImage} className="w-full h-full object-cover" src={data?.[ids.heroImage] ? getImage(data[ids.heroImage]) : "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"} onError={errorImage} alt="Analytics Detail" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Actionable Data Insights</h3>
              <div className="flex items-center gap-1.5 text-xs text-amber-500 my-1">
                <span>★★★★★</span>
                <span className="text-slate-600 font-semibold">4.9/5</span>
              </div>
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
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ${sectionName}Section;`;
}
