import React, { useEffect } from 'react';
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

  // Live CMS value overrides
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

  useEffect(() => {
    if (job?.elementIds?.length > 0) {
      dispatch(fetchElementsByIds({ elementIds: job.elementIds, pageName }));
    }
  }, [dispatch, pageName, job?.sectionId]);

  // 1. Multi-Screen Mobile Onboarding Flow
  const isMultiMobile = ir?.screenArchetype === 'multi-screen-mobile' ||
    layout.isMultiScreenMobile ||
    (ir?.formFactor === 'mobile' && layout.columns === 3 && /browse|order|enjoy/i.test((ir?.content?.featureCards || []).map(c => c.title).join(' ')));

  if (isMultiMobile) {
    const screens = [
      { step: 'STEP 1', title: 'Browse', desc: 'Explore a wide variety of catering menus curated for your team.', activeDot: 0, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80' },
      { step: 'STEP 2', title: 'Order', desc: 'Customize dietary preferences and schedule delivery with precision.', activeDot: 1, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80' },
      { step: 'STEP 3', title: 'Enjoy', desc: 'Delight in fresh, restaurant-quality catering delivered directly to your venue.', activeDot: 2, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80' }
    ];

    return (
      <div className="w-full min-h-screen bg-slate-950 p-4 sm:p-8 flex flex-col items-center justify-center font-sans overflow-x-hidden text-slate-900 rounded-3xl">
        <div className="text-white text-base sm:text-lg font-black tracking-widest uppercase mb-8 flex items-center gap-2">
          <span dangerouslySetInnerHTML={{ __html: displayBrand }} />
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 w-full max-w-7xl">
          {screens.map((sc, i) => (
            <div key={i} className="w-full max-w-[340px] bg-white rounded-[2.5rem] shadow-2xl border-4 border-slate-800 overflow-hidden flex flex-col relative min-h-[640px] p-6 justify-between">
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>{sc.step}</span>
                  <span className="text-rose-500 font-extrabold cursor-pointer">DONE</span>
                </div>
                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden shadow-xl my-6 bg-slate-100 border-4 border-white">
                  <img className="w-full h-full object-cover" src={sc.image} alt={sc.title} onError={errorImage} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 text-center tracking-tight">{sc.title}</h2>
                <p className="text-xs text-slate-600 text-center mt-2 leading-relaxed font-medium">{sc.desc}</p>
              </div>

              <div>
                <div className="flex justify-center items-center gap-2.5 my-6">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className={`inline-block w-2.5 h-2.5 rotate-45 transition-all ${dot === sc.activeDot ? 'bg-rose-500 scale-125' : 'bg-slate-200'}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-3 w-full">
                  <button className="text-slate-400 text-xs font-bold uppercase tracking-wider py-2">SKIP</button>
                  {i === 2 ? (
                    <Button
                      className="w-full py-3.5 rounded-full font-bold bg-slate-900 text-white hover:bg-slate-800 transition shadow-lg text-xs"
                      label={displayCta}
                      aria-label="Action button"
                    />
                  ) : (
                    <button className="flex-1 py-3.5 rounded-full font-bold bg-slate-900 text-white hover:bg-slate-800 transition shadow-lg text-xs">
                      NEXT
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Corporate Portal
  const isPortal = ir?.screenArchetype === 'corporate-portal' ||
    layout.isPortal ||
    (/company|intranet|portal|application/i.test((job?.sectionName || '') + ' ' + (ir?.content?.headlineMain || '')) && !isMultiMobile) ||
    ir?.content?.headlineMain === 'My applications';

  if (isPortal) {
    const portal = layout.portal || {};
    const appShortcuts = portal.appShortcuts?.length ? portal.appShortcuts : ['Salesforce', 'My file', 'Chatter', 'Planner', 'Cornerstone', 'Repository', 'Standards'];
    const sidebarUser = layout.sidebarUser || { name: 'Ivon Stoilov', stats: '527 / 378' };

    return (
      <div className="w-full p-2 sm:p-4 flex items-center justify-center font-sans text-slate-900">
        <div className="w-full max-w-7xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col relative text-slate-900">
          
          <header className="w-full bg-slate-50 border-b border-slate-200 px-6 sm:px-8 py-4 flex items-center justify-between text-slate-900">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">CO</div>
              <span className="font-black text-base text-slate-900" dangerouslySetInnerHTML={{ __html: displayBrand }} />
            </div>
            <div className="flex items-center gap-3">
              <input type="text" placeholder={ir?.inputPlaceholder || 'Start typing what are you looking for...'} className="w-64 sm:w-80 bg-slate-100 border border-slate-200 rounded-full px-4 py-2 text-xs text-slate-800 focus:outline-none" />
              <span className="text-xs text-slate-500 font-semibold cursor-pointer hidden sm:inline">Advanced search</span>
            </div>
          </header>

          <div className="flex flex-col lg:flex-row w-full items-stretch">
            <aside className="w-full lg:w-64 bg-slate-50/60 border-r border-slate-200 flex flex-col justify-between flex-shrink-0 p-5">
              <div>
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col items-center text-center shadow-xs mb-6">
                  <div className="w-18 h-18 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-slate-600 font-black text-lg">
                    {(sidebarUser.name || 'U')[0]}
                  </div>
                  <span className="text-xs font-bold text-slate-400 mt-2">{sidebarUser.stats || '527 / 378'}</span>
                  <h2 className="text-base font-bold text-slate-900 mt-1">{sidebarUser.name || 'Ivon Stoilov'}</h2>
                </div>
                <nav className="flex flex-col gap-1.5">
                  {['Home', 'About', 'Organisation', 'Support', 'News'].map((item, idx) => (
                    <a key={idx} href="#" className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors">{item}</a>
                  ))}
                </nav>
              </div>
            </aside>

            <main className="flex-1 min-w-0 p-6 sm:p-8 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 tracking-tight" dangerouslySetInnerHTML={{ __html: displayHeadline }} />
                <a href="#" className="text-xs font-bold text-blue-600 hover:underline">Edit</a>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {appShortcuts.map((app, i) => (
                  <div key={i} className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition text-center cursor-pointer">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-bold">
                      {app.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-slate-800 mt-2 truncate w-full">{app}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-xs mt-2">
                <img className="w-full md:w-80 h-48 sm:h-auto object-cover" src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80" onError={errorImage} alt="News banner" />
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">{displaySub || "Today's news"}</span>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight mt-1">Strategic Enterprise Milestones Achieved</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: displayDesc }} />
                  </div>
                  <a href="#" className="text-xs font-bold text-slate-900 hover:underline mt-4 inline-flex items-center gap-1">Read full article →</a>
                </div>
              </div>
            </main>

            <aside className="w-full lg:w-72 bg-slate-50/60 border-l border-slate-200 p-6 flex flex-col gap-6 flex-shrink-0">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-1.5">Standardization</h4>
                <p className="text-xs text-slate-600">Company standards & compliance protocols</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">My connections</h4>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600">U{i}</div>)}
                </div>
              </div>
              <Button className="w-full py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm text-xs" label={displayCta || "Contact site admin"} />
            </aside>
          </div>
        </div>
      </div>
    );
  }

  // 3. UNIVERSAL HIGH-FIDELITY DESIGN
  const isWellness = ir?.screenArchetype === 'wellness-tracker' ||
    ir?.domain === 'fitness' ||
    /calor|nutrition|diet|meal|kiraa|happypiggy/i.test((job?.sectionName || '') + ' ' + (ir?.domain || '') + ' ' + (ir?.imageConcept || ''));

  const defaultWellnessCards = [
    {
      title: 'BREAKFAST',
      subtitle: 'Avocado Sourdough & Poached Egg',
      description: 'Two poached farm eggs, sliced Hass avocado, chili flakes on artisanal sourdough toast.',
      calories: '485 kcal',
      time: '8:30 AM',
      macros: '24g P • 18g F • 42g C',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'MORNING SNACK',
      subtitle: 'Greek Yogurt & Wild Berry Bowl',
      description: 'Organic whole-milk Greek yogurt topped with fresh wild berries, raw clover honey & chia seeds.',
      calories: '240 kcal',
      time: '11:15 AM',
      macros: '16g P • 4g F • 28g C',
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80'
    }
  ];

  let cards = [];
  if (isWellness) {
    cards = defaultWellnessCards;
  } else if (ir?.featureCards && ir.featureCards.length > 0) {
    cards = ir.featureCards.map((c, idx) => ({
      title: c.title || `Module ${idx + 1}`,
      subtitle: c.metric || '',
      description: c.description || 'System asset module engineered for high reliability.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
    }));
  } else {
    cards = [
      { title: 'Feature One', description: 'Production-grade React component synchronized with Redux CMS store.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80' },
      { title: 'Feature Two', description: 'Responsive mobile-first layout engineered with precision Tailwind classes.', image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80' }
    ];
  }

  const cardCount = cards.length;
  let gridColsClass = 'grid-cols-1 sm:grid-cols-2';
  if (cardCount === 1) gridColsClass = 'grid-cols-1';
  else if (cardCount === 3) gridColsClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  else if (cardCount === 4) gridColsClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
  else if (cardCount >= 5 && cardCount <= 6) gridColsClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  else if (cardCount >= 7) gridColsClass = 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-7';

  const hasSidebar = layout.hasSidebar !== false;
  const sidebarUser = layout.sidebarUser?.name || 'Kiraa';
  const sidebarItems = (layout.sidebarItems && layout.sidebarItems.length > 0)
    ? layout.sidebarItems
    : ['Diary', 'Shopping Lists', 'Your Progress', 'Your Profile', 'Settings'];

  const hasTabs = layout.hasTabs !== false;
  const tabs = (layout.tabs && layout.tabs.length > 0) ? layout.tabs : ['Meal Plan', 'Exercise Plan'];
  const activeTab = layout.activeTab || tabs[0] || 'Meal Plan';
  const dateNav = layout.dateNavigator || 'Friday 23rd December Today';

  const statText = isWellness ? '1999 Calories' : (ir?.statCards?.[0]?.field1 || '');

  return (
    <div className="w-full p-2 sm:p-4 flex items-center justify-center font-sans text-slate-900">
      <div className="w-full max-w-7xl bg-white rounded-[2rem] shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col relative text-slate-900">
        
        {/* Top Header Bar */}
        <header className="w-full bg-white border-b border-slate-100 px-6 sm:px-8 py-4 flex items-center justify-between text-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center font-black text-sm shadow-sm shadow-rose-500/20">
              HP
            </div>
            <div className="flex flex-col">
              <span className="font-black text-base tracking-tight text-slate-900" dangerouslySetInnerHTML={{ __html: displayBrand }} />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider -mt-0.5">Health & Nutrition Studio</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search recipes, ingredients, logs..."
                className="w-64 bg-slate-50 border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
              <svg className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200/60 text-xs font-bold text-rose-600 shadow-2xs">
              <span>14 Day Streak</span>
            </div>
          </div>
        </header>

        {/* Window Body: Sidebar + Main Content */}
        <div className="flex flex-col md:flex-row w-full items-stretch">
          
          {hasSidebar && (
            <aside className="w-full sm:w-64 bg-gradient-to-b from-rose-50/60 via-white to-rose-50/30 border-r border-rose-100/80 flex flex-col justify-between flex-shrink-0 p-5">
              <div>
                <div className="bg-white/80 backdrop-blur-sm border border-rose-200/60 rounded-2xl p-5 flex flex-col items-center text-center shadow-xs mb-6">
                  <div className="relative">
                    <div className="w-18 h-18 rounded-full overflow-hidden bg-rose-100 p-0.5 border-2 border-white shadow-md">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                        alt={sidebarUser}
                        className="w-full h-full object-cover rounded-full"
                        onError={errorImage}
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" title="Active"></span>
                  </div>
                  <h2 className="font-black text-slate-900 text-base mt-3 tracking-tight">{sidebarUser}</h2>
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/60 mt-1 shadow-2xs">Daily Goal: 2,400 kcal</span>
                </div>

                <nav className="flex flex-col gap-1.5">
                  {sidebarItems.map((item, idx) => (
                    <div
                      key={item}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${idx === 0 ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/25 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-rose-100/60'}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-white' : 'bg-slate-300'}`}></span>
                      <span>{item}</span>
                    </div>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Central Main Content */}
          <main className="flex-1 min-w-0 flex flex-col">
            
            {hasTabs && (
              <div className="border-b border-slate-100 px-6 sm:px-8 pt-4 pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  {tabs.map((t, idx) => (
                    <button
                      key={t}
                      className={`pb-3 text-sm font-extrabold tracking-tight transition-colors ${idx === 0 ? 'text-slate-900 border-b-2 border-rose-500' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 pb-2 text-right">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs shadow-2xs">
                    <span className="text-slate-400 font-bold cursor-pointer">&lt;</span>
                    <span dangerouslySetInnerHTML={{ __html: displaySub || dateNav }} />
                    <span className="text-slate-400 font-bold cursor-pointer">&gt;</span>
                  </div>
                </div>
              </div>
            )}

            <div className="p-6 sm:p-8 flex flex-col gap-6">
              
              {/* Calorie Hero Block */}
              <div className="bg-gradient-to-br from-slate-50 via-white to-rose-50/30 border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-rose-500">Daily Nutritional Target</span>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight" dangerouslySetInnerHTML={{ __html: displayHeadline }} />
                  <p className="text-xs text-slate-500">Target: 2,400 kcal &bull; 401 kcal remaining for dinner</p>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-3.5 bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <svg className="w-12 h-12 text-rose-500 flex-shrink-0" viewBox="0 0 36 36">
                      <path className="text-slate-100" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="text-rose-500" strokeDasharray="83, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div className="flex flex-col">
                      <span className="text-xl font-black text-slate-900 tracking-tight leading-none">{statText || '1,999 kcal'}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">83% of daily goal</span>
                    </div>
                  </div>

                  <div className="hidden sm:flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Protein: 142g / 160g (88%)</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span>Carbs: 185g / 220g (84%)</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      <span>Healthy Fats: 54g / 65g (83%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Meal Cards Grid */}
              <div className={`grid ${gridColsClass} gap-6`}>
                {cards.map((card, idx) => (
                  <div key={idx} className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group">
                    <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
                      <img
                        src={card.image || 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80'}
                        alt={card.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={errorImage}
                      />
                      <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white tracking-wider uppercase">
                        {card.title}
                      </div>
                      {card.calories && (
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black text-rose-600 shadow-sm">
                          {card.calories}
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                      <div>
                        <h4 className="font-black text-slate-900 text-base tracking-tight">{card.subtitle || card.title}</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{card.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500">
                        <span>{card.macros || 'Balanced nutritional profile'}</span>
                        <span className="text-rose-600 font-bold hover:underline cursor-pointer">+ Log items</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Primary Action Button */}
              <div className="pt-2">
                <Button
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-md shadow-rose-500/25 transition-all text-xs tracking-wider uppercase"
                  label={displayCta}
                  aria-label="Action button"
                />
              </div>

            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
