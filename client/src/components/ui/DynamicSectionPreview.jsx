import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'primereact/button';
import { fetchElementsByIds } from '../../features/cms/cmsSlice';
import { getImage, errorImage } from '../../utils/getImage';
import { resolveDomainConfig } from '../../utils/domainConfig';

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

  const [activePreviewPage, setActivePreviewPage] = useState(pageName || 'Home');

  useEffect(() => {
    if (pageName) {
      setActivePreviewPage(pageName);
    }
  }, [pageName]);
  const [selectedService, setSelectedService] = useState('General Medicine');
  const [selectedDoctor, setSelectedDoctor] = useState('Dr. Sarah Jenkins, MD');
  const [selectedDate, setSelectedDate] = useState('Mon, Nov 16');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', notes: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  useEffect(() => {
    if (job?.elementIds?.length > 0) {
      dispatch(fetchElementsByIds({ elementIds: job.elementIds, pageName }));
    }
  }, [dispatch, pageName, job?.sectionId]);

  // Core archetype identification (declared upfront to prevent TDZ)
  const isMultiMobile = ir?.screenArchetype === 'multi-screen-mobile' ||
    layout.isMultiScreenMobile ||
    (ir?.formFactor === 'mobile' && layout.columns === 3 && /browse|order|enjoy/i.test((ir?.content?.featureCards || []).map(c => c.title).join(' ')));

  const isPortal = ir?.screenArchetype === 'corporate-portal' ||
    layout.isPortal ||
    (/company|intranet|portal|application/i.test((job?.sectionName || '') + ' ' + (ir?.content?.headlineMain || '')) && !isMultiMobile) ||
    ir?.content?.headlineMain === 'My applications';

  const isWellness = ir?.screenArchetype === 'wellness-tracker' ||
    ir?.domain === 'fitness' ||
    /calor|nutrition|diet|meal|kiraa|happypiggy/i.test((job?.sectionName || '') + ' ' + (ir?.domain || '') + ' ' + (ir?.imageConcept || ''));

  // 1. Multi-Screen Mobile Onboarding Flow

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

  // 2.7 INTERACTIVE MULTI-PAGE & FORM APPLICATION
  const isMultiPageWithForm = (ir?.isMultiPage || ir?.hasForm || (Array.isArray(ir?.pages) && ir.pages.length > 1) || /appointment|booking|reservation|form|consultation|signup|inquiry|doctor|clinic|hospital/i.test((job?.sectionName || '') + ' ' + (ir?.content?.headlineMain || '') + ' ' + (ir?.formType || ''))) && !isWellness && !isMultiMobile && !isPortal;

  if (isMultiPageWithForm) {
    const domainCfg = resolveDomainConfig(ir, job);
    const pages = (Array.isArray(ir?.pages) && ir.pages.length > 0)
      ? ir.pages
      : ['Home', domainCfg.bookingPageName, domainCfg.teamPageName, 'Services', 'Contact'];
    
    const formConfig = ir?.formConfig || {};
    const servicesList = formConfig.services || domainCfg.categories;
    const timeSlotsList = formConfig.timeSlots || domainCfg.timeSlots;
    const datesList = ['Mon, Nov 16', 'Tue, Nov 17', 'Wed, Nov 18', 'Thu, Nov 19', 'Fri, Nov 20', 'Sat, Nov 21'];
    const specialists = domainCfg.specialists;

    const currentBookingPage = pages.find(p => /appointment|booking|reservation|schedule|consultation/i.test(p)) || domainCfg.bookingPageName;
    const currentTeamPage = pages.find(p => /doctor|team|specialist|chef|trainer|attorney|agent/i.test(p)) || domainCfg.teamPageName;

    return (
      <div className="w-full min-h-screen bg-slate-50 p-3 sm:p-6 lg:p-8 flex items-center justify-center font-sans text-slate-900 overflow-x-hidden">
        <div className="w-full max-w-7xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative text-slate-900 animate-fade-in">
          
          {/* Top Multi-Page Navigation Header */}
          <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 sm:px-10 py-4 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActivePreviewPage('Home')}>
              <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-base shadow-md">
                {(domainCfg.brand || 'U')[0]}
              </div>
              <div className="flex flex-col">
                <span className="font-black text-base text-slate-900 tracking-tight leading-none">{displayBrand || domainCfg.brand}</span>
                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mt-1">{domainCfg.badge}</span>
              </div>
            </div>

            {/* Navigation Pills */}
            <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-full border border-slate-200 shadow-inner">
              {pages.map((p) => (
                <button
                  key={p}
                  onClick={() => setActivePreviewPage(p)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    activePreviewPage === p
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </nav>

            {/* Action Pill */}
            <button
              onClick={() => setActivePreviewPage(currentBookingPage)}
              className="px-5 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-md shadow-blue-500/20 hidden sm:inline-flex items-center gap-1.5"
            >
              <span>{domainCfg.actionLabel}</span>
              <span>→</span>
            </button>
          </header>

          {/* VIEW 1: HOME PAGE */}
          {activePreviewPage === 'Home' && (
            <main className="flex flex-col">
              {/* Hero Banner */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-10 p-6 sm:p-12">
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                  <span className="px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold self-start">
                    {domainCfg.badge}
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                    {displayHeadline || domainCfg.heroHeadline}
                  </h1>
                  <p className="text-slate-500 font-semibold text-base mt-1">
                    {displaySub || domainCfg.heroSub}
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {displayDesc || domainCfg.heroDesc}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    <button
                      onClick={() => setActivePreviewPage(currentBookingPage)}
                      className="px-7 py-3.5 rounded-full bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-lg shadow-blue-500/25 flex items-center gap-2"
                    >
                      <span>{domainCfg.actionLabel}</span>
                      <span>→</span>
                    </button>
                    <button
                      onClick={() => setActivePreviewPage(currentTeamPage)}
                      className="px-6 py-3.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition"
                    >
                      Meet Our {domainCfg.teamPageName}
                    </button>
                  </div>
                </div>

                <div className="w-full lg:w-1/2 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 relative">
                  <img
                    src={domainCfg.heroImage}
                    alt={domainCfg.brand}
                    className="w-full h-80 lg:h-96 object-cover"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-white/40 shadow-lg flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-slate-900">{domainCfg.brand}</p>
                      <p className="text-[10px] text-slate-500 font-bold">100% Certified Quality Assurance</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                      Active Now
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-12 pt-0">
                {specialists.slice(0, 3).map((sp, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition">
                    <div>
                      <span className="text-xs font-black text-blue-600 uppercase tracking-wider">Feature 0{idx + 1}</span>
                      <h3 className="font-extrabold text-base text-slate-900 mt-2">{sp.specialty}</h3>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                        Led by {sp.name} with {sp.exp} of dedicated domain expertise.
                      </p>
                    </div>
                    <button
                      onClick={() => { setSelectedDoctor(sp.name); setActivePreviewPage(currentBookingPage); }}
                      className="text-xs font-bold text-blue-600 hover:underline mt-4 text-left"
                    >
                      {domainCfg.actionLabel} →
                    </button>
                  </div>
                ))}
              </div>

              {/* Metrics / Trust Bar */}
              <div className="border-t border-slate-100 p-6 sm:p-12 flex flex-wrap items-center justify-around gap-6 bg-slate-50/50">
                <div className="text-center">
                  <p className="text-2xl font-black text-slate-900">15,000+</p>
                  <p className="text-xs font-bold text-slate-400 uppercase mt-0.5">Satisfied Clients</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-blue-600">4.9 ★</p>
                  <p className="text-xs font-bold text-slate-400 uppercase mt-0.5">Average Review</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-slate-900">24/7</p>
                  <p className="text-xs font-bold text-slate-400 uppercase mt-0.5">Support Availability</p>
                </div>
              </div>
            </main>
          )}

          {/* VIEW 2: INTERACTIVE APPOINTMENT / RESERVATION / BOOKING FORM */}
          {activePreviewPage === currentBookingPage && (
            <main className="p-6 sm:p-12 flex flex-col gap-8 max-w-4xl mx-auto w-full">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-blue-600">Instant Online Scheduling</span>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">{domainCfg.actionLabel}</h2>
                <p className="text-slate-500 text-sm mt-1">{domainCfg.formNotice}</p>
              </div>

              {!isSubmitted ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setBookingRef('#REF-' + Math.floor(100000 + Math.random() * 900000));
                    setIsSubmitted(true);
                  }}
                  className="flex flex-col gap-8"
                >
                  {/* Category Selector */}
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                      1. Select {domainCfg.categoriesTitle}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {servicesList.map((svc) => (
                        <button
                          key={svc}
                          type="button"
                          onClick={() => setSelectedService(svc)}
                          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                            selectedService === svc
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {svc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Specialist Selector */}
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                      2. Choose a {domainCfg.specialistLabel}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {specialists.map((doc) => (
                        <div
                          key={doc.name}
                          onClick={() => setSelectedDoctor(doc.name)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                            selectedDoctor === doc.name
                              ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <img src={doc.photo} alt={doc.name} className="w-12 h-12 rounded-xl object-cover" />
                          <div className="flex flex-col min-w-0">
                            <span className="font-extrabold text-xs text-slate-900 truncate">{doc.name}</span>
                            <span className="text-[10px] text-slate-500 font-semibold">{doc.specialty}</span>
                            <span className="text-[10px] font-bold text-amber-500 mt-0.5">{doc.rating}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Date & Time Selector */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-500">3. Select Date</label>
                      <div className="flex flex-wrap gap-2">
                        {datesList.map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setSelectedDate(d)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                              selectedDate === d
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-white text-slate-700 border-slate-200'
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-500">4. Select Time Slot</label>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlotsList.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTime(slot)}
                            className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all border text-center ${
                              selectedTime === slot
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-white text-slate-700 border-slate-200'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">5. Contact Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your Name"
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Special Notes / Requests (Optional)</label>
                      <textarea
                        rows="2"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Any special requirements, accommodations, or details..."
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-xl shadow-blue-500/25 text-sm uppercase tracking-wider"
                  >
                    Confirm {domainCfg.actionLabel} & Send Notification →
                  </button>
                </form>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 flex flex-col items-center text-center shadow-lg">
                  <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-2xl shadow-lg mb-4">
                    ✓
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">{domainCfg.confirmedTitle}</h3>
                  <p className="text-slate-600 text-xs mt-1">{domainCfg.confirmedSub}</p>
                  
                  <div className="bg-white rounded-2xl border border-emerald-200/80 p-5 mt-6 w-full max-w-md text-left flex flex-col gap-2 text-xs">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Booking Reference:</span>
                      <span className="font-mono font-bold text-slate-900">{bookingRef}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 py-1.5">
                      <span className="text-slate-500">{domainCfg.specialistLabel}:</span>
                      <span className="font-bold text-slate-900">{selectedDoctor}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 py-1.5">
                      <span className="text-slate-500">Option:</span>
                      <span className="font-bold text-slate-900">{selectedService}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-500">Scheduled Time:</span>
                      <span className="font-bold text-emerald-600">{selectedDate} at {selectedTime}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 px-6 py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
                  >
                    Make Another Booking
                  </button>
                </div>
              )}
            </main>
          )}

          {/* VIEW 3: SPECIALISTS / TEAM DIRECTORY */}
          {activePreviewPage === currentTeamPage && (
            <main className="p-6 sm:p-12 flex flex-col gap-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Our Certified {domainCfg.teamPageName}</h2>
                <p className="text-slate-500 text-sm mt-1">World-class professionals dedicated to exceptional care and results.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {specialists.map((doc, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden flex flex-col shadow-xs hover:shadow-md transition">
                    <img src={doc.photo} alt={doc.name} className="w-full h-48 object-cover" />
                    <div className="p-5 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-600">{doc.role || doc.specialty}</span>
                          <span className="text-xs font-bold text-amber-500">{doc.rating}</span>
                        </div>
                        <h4 className="font-extrabold text-base text-slate-900 mt-1">{doc.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">{doc.exp}</p>
                      </div>
                      <button
                        onClick={() => { setSelectedDoctor(doc.name); setActivePreviewPage(currentBookingPage); }}
                        className="mt-4 w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
                      >
                        {domainCfg.actionLabel} →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          )}

          {/* VIEW 4: SERVICES & CONTACT */}
          {(activePreviewPage === 'Services' || activePreviewPage === 'Contact') && (
            <main className="p-6 sm:p-12 flex flex-col gap-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Comprehensive Offerings & Contact</h2>
                <p className="text-slate-500 text-sm mt-1">24/7 dedicated support and specialized assistance.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {servicesList.map((s, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-blue-600">Department 0{idx + 1}</span>
                      <h4 className="font-extrabold text-sm text-slate-900 mt-1">{s}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">Dedicated professional guidance, assessment, and tailored delivery.</p>
                    </div>
                    <button
                      onClick={() => { setSelectedService(s); setActivePreviewPage(currentBookingPage); }}
                      className="text-xs font-bold text-blue-600 hover:underline mt-4 text-left"
                    >
                      Select this option →
                    </button>
                  </div>
                ))}
              </div>
            </main>
          )}

        </div>
      </div>
    );
  }
// 3. UNIVERSAL HIGH-FIDELITY DESIGN

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
