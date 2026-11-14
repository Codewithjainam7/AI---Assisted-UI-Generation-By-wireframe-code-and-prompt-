import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'primereact/button';
import { fetchElementsByIds } from '../../features/cms/cmsSlice';
import { getImage, errorImage } from '../../utils/getImage';

const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80'
];

const COLOR_SWATCHES = [
  { name: 'Dark Grey Heather', image: PRODUCT_IMAGES[0] },
  { name: 'Oatmeal Grey', image: PRODUCT_IMAGES[1] },
  { name: 'Jet Black', image: PRODUCT_IMAGES[2] },
  { name: 'Navy Blue', image: PRODUCT_IMAGES[3] },
  { name: 'Crimson Red', image: PRODUCT_IMAGES[0] },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

export default function DynamicSectionPreview({ pageName = 'Home', job = null }) {
  const dispatch = useDispatch();

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const cmsData = useSelector((state) => state.cms?.allSections?.[pageName]) || {};
  const cmsCss  = useSelector((state) => state.cms?.allSectionsCss?.[pageName]) || {};

  // Extract from IR or fall back to standard defaults
  const ir = job?.ir;
  const elements = ir?.elements || [];

  const getElementDefault = (name, fallback) => {
    const el = elements.find((e) => e.elementName === name);
    return el?.defaultContent || fallback;
  };

  // Resolve values
  const brandBadge = getElementDefault('brandBadge', (job?.sectionName || 'AI STUDIO').toUpperCase());
  const headlineMain = getElementDefault('headlineMain', 'NEXT-GEN UI GENERATION');
  const headlineSub = getElementDefault('headlineSub', 'Production-ready component synthesized from your design.');
  const description = getElementDefault('description', 'Fully responsive React component with dynamic Redux CMS integration and clean Tailwind styling.');
  const ctaButton = getElementDefault('ctaButton', 'GET STARTED');
  const heroImage = getElementDefault('heroImage', 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80');

  // Look for CMS live value overrides
  const liveValues = {};
  elements.forEach((el) => {
    if (el.fieldId && cmsData[el.fieldId] !== undefined) {
      liveValues[el.elementName] = cmsData[el.fieldId];
    }
  });

  // Also check if any key in cmsData has strings matching our elements
  Object.entries(cmsData).forEach(([k, val]) => {
    if (typeof val === 'string') {
      if (val === brandBadge) liveValues.brandBadge = val;
      if (val === headlineMain) liveValues.headlineMain = val;
      if (val === headlineSub) liveValues.headlineSub = val;
      if (val === description) liveValues.description = val;
      if (val === ctaButton) liveValues.ctaButton = val;
      // Never allow a wireframe upload path to be heroImage
      if ((val.includes('.jpg') || val.includes('.png') || val.includes('.webp')) &&
          !val.includes('uploads/') && !val.includes('wireframe')) {
        liveValues.heroImage = val;
      }
    }
  });

  const displayBrand = liveValues.brandBadge || brandBadge;
  const displayHeadline = liveValues.headlineMain || headlineMain;
  const displaySub = liveValues.headlineSub || headlineSub;
  const displayDesc = liveValues.description || description;
  const displayCta = liveValues.ctaButton || ctaButton;
  let displayImage = liveValues.heroImage || heroImage;

  // Detect whether this is an e-commerce product wireframe
  const isEcommerce = ir?.domain === 'ecommerce' ||
    /hoodie|clothing|apparel|fleece|sweatshirt/i.test(displayHeadline + ' ' + displaySub + ' ' + displayDesc) ||
    /hoodie|apparel/i.test(job?.sectionName || '');

  // Detect whether this is a dashboard / multi-panel wireframe
  const isDashboard = ir?.domain === 'dashboard' ||
    ir?.sectionType === 'dashboard-hero' ||
    ir?.layout?.hasSidebar ||
    /dashboard|analytics|admin|console|overview|asset/i.test((job?.sectionName || '') + ' ' + displayHeadline + ' ' + displayBrand);

  if (displayImage.includes('uploads/') || displayImage.includes('wireframe') || displayImage.includes('1571434190823')) {
    displayImage = isEcommerce ? PRODUCT_IMAGES[0] : 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80';
  }

  // Stat badges loop
  const statEl = elements.find((e) => e.elementName === 'statBadges');
  let statCards = statEl?.statCards || (isEcommerce ? [
    { field1: '100%', field2: 'Organic Cotton' },
    { field1: '4.9★', field2: 'Rating (2.4k)' },
    { field1: 'Free', field2: 'Shipping & Returns' }
  ] : [
    { field1: '100+', field2: 'Active Users' },
    { field1: '4.9★', field2: 'Top Rated' },
    { field1: '24/7', field2: 'Live Support' },
  ]);

  if (statEl?.fieldId && Array.isArray(cmsData[statEl.fieldId]) && cmsData[statEl.fieldId].length > 0) {
    statCards = cmsData[statEl.fieldId];
  }

  useEffect(() => {
    if (job?.elementIds?.length > 0) {
      dispatch(fetchElementsByIds({ elementIds: job.elementIds, pageName }));
    }
  }, [dispatch, pageName, job?.sectionId]);

  if (isEcommerce) {
    return (
      <div className="relative min-h-screen w-full bg-[#09090b] text-white font-sans antialiased overflow-x-hidden rounded-2xl">
        <div className="hidden lg:block absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-red-500 via-orange-500 to-transparent z-20" />
        <div className="hidden lg:block absolute right-0 top-0 h-full w-1.5 bg-gradient-to-b from-red-500 via-orange-500 to-transparent z-20" />

        {/* Top Header / Navigation from Wireframe */}
        <header className="w-full border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-16 h-14 sm:h-16 flex items-center justify-between">
            <div className="flex items-center gap-4 sm:gap-8">
              <span
                className="text-lg sm:text-xl font-black tracking-wider uppercase text-white hover:text-red-400 transition cursor-pointer"
                dangerouslySetInnerHTML={{ __html: displayBrand }}
              />
              <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-zinc-300">
                {['Men', 'Women', 'Boys', 'Girls'].map((cat) => (
                  <a key={cat} href="#" className="hover:text-white hover:underline transition-colors py-1">{cat}</a>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative hidden sm:block">
                <input
                  type="search"
                  placeholder="search"
                  className="w-48 md:w-64 px-4 py-1.5 pl-9 rounded-full bg-zinc-900/90 border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition"
                />
                <span className="absolute left-3 top-2 text-zinc-400 text-xs">🔍</span>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 text-xs text-zinc-400 font-medium">
                <span className="hidden md:inline hover:text-white cursor-pointer transition">Join / Log In</span>
                <span className="hidden md:inline text-zinc-600">|</span>
                <span className="hover:text-white cursor-pointer transition">Help</span>
                <button className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 text-white transition" title="Shopping Cart">
                  🛒
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Category Quick-bar */}
          <div className="md:hidden flex items-center gap-4 px-4 py-2 overflow-x-auto border-t border-white/5 bg-zinc-950/90 text-xs font-semibold text-zinc-400 no-scrollbar">
            {["All", "Men", "Women", "Boys", "Girls"].map((cat, idx) => (
              <a key={cat} href="#" className={`flex-shrink-0 transition-colors ${idx === 0 ? "text-red-400 font-bold" : "hover:text-white"}`}>{cat}</a>
            ))}
          </div>
        </header>

        {/* Main Product Layout */}
        <main className="max-w-[1920px] mx-auto px-3 sm:px-8 lg:px-16 py-6 sm:py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-10 xl:gap-16">
            
            {/* Left: 2x2 Product Views Gallery */}
            <div className="w-full lg:w-7/12 flex flex-col gap-3 sm:gap-4">
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="group relative rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 aspect-square shadow-lg">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={getImage(displayImage)}
                    onError={errorImage}
                    alt="Product view front"
                  />
                  <span className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase bg-black/60 backdrop-blur-md text-white border border-white/15">
                    Front
                  </span>
                </div>

                <div className="group relative rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 aspect-square shadow-lg">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={getImage(PRODUCT_IMAGES[1])}
                    onError={errorImage}
                    alt="Product view back"
                  />
                  <span className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase bg-black/60 backdrop-blur-md text-white border border-white/15">
                    Back
                  </span>
                </div>

                <div className="group relative rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 aspect-square shadow-lg">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={getImage(PRODUCT_IMAGES[2])}
                    onError={errorImage}
                    alt="Product view detail"
                  />
                  <span className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase bg-black/60 backdrop-blur-md text-white border border-white/15">
                    Detail
                  </span>
                </div>

                <div className="group relative rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 aspect-square shadow-lg">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={getImage(PRODUCT_IMAGES[3])}
                    onError={errorImage}
                    alt="Product view lifestyle"
                  />
                  <span className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase bg-black/60 backdrop-blur-md text-white border border-white/15">
                    Fit
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Product Details & Purchase Form */}
            <div className="w-full lg:w-5/12 flex flex-col space-y-4 sm:space-y-6 lg:pl-2">
              <div>
                <span
                  className="inline-block px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-red-500/15 text-red-400 border border-red-500/20 mb-2 sm:mb-3"
                  dangerouslySetInnerHTML={{ __html: displayBrand }}
                />

                <h1
                  className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-black text-white tracking-tight uppercase leading-tight break-words"
                  dangerouslySetInnerHTML={{ __html: displayHeadline }}
                />

                <h2
                  className="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-300 mt-1 sm:mt-2"
                  dangerouslySetInnerHTML={{ __html: displaySub }}
                />
              </div>

              {/* Color Swatches */}
              <div className="space-y-2">
                <span className="text-[11px] sm:text-xs font-bold uppercase text-zinc-400 tracking-wider">
                  Select Color: <span className="text-white normal-case">{COLOR_SWATCHES[selectedColor].name}</span>
                </span>
                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 no-scrollbar">
                  {COLOR_SWATCHES.map((swatch, idx) => (
                    <button
                      key={swatch.name}
                      onClick={() => setSelectedColor(idx)}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 flex-shrink-0 transition-all p-0.5 overflow-hidden ${
                        selectedColor === idx
                          ? 'border-red-500 scale-105 sm:scale-110 shadow-glow-red ring-2 ring-red-500/30'
                          : 'border-white/20 hover:border-white/50 opacity-80'
                      }`}
                      title={swatch.name}
                    >
                      <img src={swatch.image} alt={swatch.name} className="w-full h-full object-cover rounded-lg" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-2 pt-1 sm:pt-2">
                <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold tracking-wider">
                  <span className="text-zinc-400 uppercase">Choose Size</span>
                  <button className="text-zinc-400 hover:text-white underline transition">Size Guide</button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 sm:gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all border ${
                        selectedSize === size
                          ? 'bg-white text-zinc-950 border-white shadow-md scale-105'
                          : 'bg-zinc-900/80 text-zinc-300 border-white/10 hover:border-white/30 hover:bg-zinc-800'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center gap-2.5 sm:gap-3 pt-2 sm:pt-4">
                <Button
                  className="flex-1 py-3.5 sm:py-4 rounded-full font-black text-sm sm:text-base uppercase tracking-wider bg-gradient-to-r from-red-600 via-orange-500 to-red-600 hover:shadow-glow-red hover:scale-[1.02] active:scale-[0.98] transition-all border-none"
                  severity="danger"
                  label={displayCta}
                  aria-label="Add to cart"
                  onClick={() => alert(`Added to cart: ${displayHeadline} (${selectedSize})`)}
                />
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-full flex items-center justify-center border transition-all ${
                    isWishlisted
                      ? 'bg-red-500/20 border-red-500 text-red-500 shadow-glow-red'
                      : 'bg-zinc-900 border-white/20 text-zinc-300 hover:text-white hover:border-white/40'
                  }`}
                  title="Add to Wishlist"
                >
                  {isWishlisted ? '❤️' : '🤍'}
                </button>
              </div>

              {/* Description & Specifications */}
              <div className="border-t border-white/10 pt-4 sm:pt-5 space-y-2.5 sm:space-y-3">
                <p
                  className="text-zinc-300 text-xs sm:text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: displayDesc }}
                />
                <a href="#" className="inline-block text-[11px] sm:text-xs font-semibold text-zinc-400 hover:text-white underline transition">
                  Read More Details
                </a>
              </div>

              {/* Stat / Feature Badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1 sm:pt-2">
                {statCards.map((item, idx) => (
                  <div key={idx} className="p-2 sm:p-3 rounded-xl bg-zinc-900/60 border border-white/10 flex flex-col items-center text-center">
                    <span
                      className="text-xs sm:text-sm font-extrabold text-white"
                      dangerouslySetInnerHTML={{ __html: item.field1 || '100%' }}
                    />
                    <span
                      className="text-[9px] sm:text-[10px] text-zinc-400 mt-0.5 leading-tight"
                      dangerouslySetInnerHTML={{ __html: item.field2 || 'Quality' }}
                    />
                  </div>
                ))}
              </div>

            </div>
          </div>
        </main>
        
        {/* Full Website Footer */}
        <footer className="w-full border-t border-white/10 bg-zinc-950/80 mt-12 sm:mt-16 py-8 sm:py-10 px-4 sm:px-6 lg:px-16 text-xs text-zinc-400">
          <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
              <span className="font-bold text-sm tracking-wider uppercase text-white" dangerouslySetInnerHTML={{ __html: displayBrand }} />
              <p className="text-zinc-500 text-[11px] sm:text-xs">© {new Date().getFullYear()} {displayBrand || 'Studio'}. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] sm:text-xs">
              <a href="#" className="hover:text-white transition">Product Guides</a>
              <a href="#" className="hover:text-white transition">Terms of Sale</a>
              <a href="#" className="hover:text-white transition">Terms of Use</a>
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  if (isDashboard) {
    return (
      <div className="relative min-h-screen w-full bg-[#09090b] text-white font-sans antialiased overflow-x-hidden rounded-2xl flex flex-col md:flex-row">
        {/* Left Vertical Yellow Sidebar (faithfully reconstructed from wireframe) */}
        <aside className="w-full md:w-20 lg:w-24 bg-amber-400 text-zinc-950 flex md:flex-col items-center justify-between py-3 md:py-6 px-4 md:px-0 flex-shrink-0 z-30 shadow-2xl">
          <div className="flex md:flex-col items-center gap-4 sm:gap-6">
            <button className="w-10 h-10 rounded-2xl bg-zinc-950 text-amber-400 flex items-center justify-center font-black text-lg shadow-md hover:scale-105 transition">
              <i className="pi pi-bars text-base" />
            </button>
            <div className="flex md:flex-col items-center gap-3 sm:gap-5 text-zinc-900">
              <button className="p-2 hover:bg-zinc-950/10 rounded-xl transition" title="Navigation">
                <i className="pi pi-caret-up text-base" />
              </button>
              <button className="p-2 hover:bg-zinc-950/10 rounded-xl transition" title="Analytics">
                <i className="pi pi-chart-bar text-base" />
              </button>
              <button className="p-2 hover:bg-zinc-950/10 rounded-xl transition" title="Favorites">
                <i className="pi pi-star text-base" />
              </button>
              <button className="w-11 h-11 rounded-2xl bg-zinc-950 text-amber-400 flex items-center justify-center shadow-lg hover:scale-105 transition" title="Grid View">
                <i className="pi pi-th-large text-base" />
              </button>
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-950/60" />
            </div>
          </div>
          <div className="flex md:flex-col items-center gap-2">
            <button className="p-2 hover:bg-zinc-950/10 rounded-xl transition" title="Settings">
              <i className="pi pi-cog text-lg" />
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-zinc-950">
          {/* Top Header Bar */}
          <header className="w-full border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-8">
              <span className="text-lg sm:text-xl font-black tracking-wider uppercase text-white" dangerouslySetInnerHTML={{ __html: displayBrand }} />
              <div className="hidden sm:flex items-center gap-2">
                {['Overview', 'Assets', 'Analytics', 'Settings'].map((t, idx) => (
                  <span key={t} className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition ${idx === 0 ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'}`}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden md:block w-56 lg:w-72">
                <input
                  type="text"
                  placeholder="Search assets, modules..."
                  className="w-full px-4 py-1.5 pl-9 rounded-full bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                />
                <i className="pi pi-search absolute left-3 top-2 text-xs text-zinc-400" />
              </div>
              <Button
                className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs px-4 py-2 rounded-xl border-none shadow-md transition"
                label={displayCta}
                aria-label="Create Action"
                onClick={() => {}}
              />
            </div>
          </header>

          {/* Main Dashboard Layout: Grid of Cards + Right Detail Panel */}
          <main className="p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 max-w-[1920px] w-full mx-auto">
            {/* Center: 3x2 Grid (6 Cards exactly as in wireframe) */}
            <div className="flex-1 flex flex-col gap-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight" dangerouslySetInnerHTML={{ __html: displayHeadline }} />
                <p className="text-sm text-zinc-400 mt-1" dangerouslySetInnerHTML={{ __html: displaySub }} />
              </div>

              {/* 3x2 Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[
                  { title: 'Modular Grid System', tag: 'Core', metric: '6 Modules', desc: 'Organize data assets into customizable grid layouts with instant filtering.' },
                  { title: 'Sidebar Quick Actions', tag: 'Navigation', metric: 'Fast', desc: 'Access system controls, favorites, and analytics with single-click navigation.' },
                  { title: 'Real-time Metrics', tag: 'Analytics', metric: 'Live', desc: 'Track system health, conversion rates, and user engagement live.' },
                  { title: 'Media Collection A', tag: 'Assets', metric: '1.2 GB', desc: 'High-resolution graphic assets and marketing collateral organized.' },
                  { title: 'UI Components Library', tag: 'Design', metric: '340 Items', desc: 'Standardized component tokens and interactive UI patterns.' },
                  { title: 'System Snapshots', tag: 'Security', metric: 'Daily', desc: 'Automated snapshot logs and database recovery points.' },
                ].map((c, idx) => (
                  <div key={idx} className="bg-zinc-900/60 border border-white/10 hover:border-amber-400/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all group shadow-lg">
                    <div className="w-full h-28 rounded-xl bg-zinc-800/80 mb-3 flex items-center justify-center text-zinc-500 overflow-hidden relative group-hover:scale-[1.02] transition-transform">
                      <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400 text-xl font-bold">
                        {idx + 1}
                      </div>
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-amber-400 border border-amber-400/30">
                        {c.metric}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-md">
                          {c.tag}
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition">{c.title}</h3>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Avatar Activity Row (Matching bottom circles in wireframe) */}
              <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {['bg-amber-400', 'bg-blue-400', 'bg-emerald-400', 'bg-purple-400'].map((bg, i) => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 border-zinc-950 ${bg} flex items-center justify-center text-zinc-950 font-bold text-xs`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">Active Workspace Collaborators</span>
                    <p className="text-[10px] text-zinc-400">4 team members currently viewing this board</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 cursor-pointer">
                  <span>Manage Permissions &rarr;</span>
                </div>
              </div>
            </div>

            {/* Right: Inspector / Detail Panel (Drawn in wireframe with preview card, ratings, and action buttons) */}
            <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 bg-zinc-900/60 border border-white/10 rounded-3xl p-5 sm:p-6 flex flex-col gap-4 shadow-2xl backdrop-blur-xl">
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-zinc-800 border border-white/10 shadow-lg group">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={displayImage}
                  onError={errorImage}
                  alt="Detail Preview"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-black/60 text-white backdrop-blur-md border border-white/20">
                  Live View
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Active Selection</span>
                <h2 className="text-lg font-black text-white mt-1" dangerouslySetInnerHTML={{ __html: displayHeadline }} />
                <div className="flex items-center gap-2 mt-1 text-xs text-amber-400">
                  <span>★★★★★</span>
                  <span className="text-zinc-400 font-medium">4.9 / 5.0 (2,450 ratings)</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-3">
                <p className="text-xs text-zinc-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: displayDesc }} />
              </div>

              {/* Key Specs / Stat list */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                {statCards.slice(0, 2).map((s, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-zinc-800/60 border border-white/10 text-center">
                    <div className="text-sm font-extrabold text-amber-400" dangerouslySetInnerHTML={{ __html: s.field1 }} />
                    <div className="text-[10px] text-zinc-400 mt-0.5" dangerouslySetInnerHTML={{ __html: s.field2 }} />
                  </div>
                ))}
              </div>

              {/* 2 Action Buttons (matching wireframe buttons) */}
              <div className="flex flex-col gap-2.5 pt-2">
                <Button
                  className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-zinc-950 border-none shadow-lg shadow-amber-400/10 transition"
                  label={displayCta}
                  aria-label="Action 1"
                  onClick={() => {}}
                />
                <button className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 transition">
                  Export Dataset
                </button>
              </div>
            </aside>
          </main>
        </div>
      </div>
    );
  }

  // Default Content Blocks matching the 3 boxes in the wireframe
  const contentBlocks = [
    {
      title: liveValues.contentBlock1Title || 'Modular Architecture',
      desc: liveValues.contentBlock1Desc || 'Construct high-performance interfaces with reusable, production-ready modules.'
    },
    {
      title: liveValues.contentBlock2Title || 'Zero-Latency State',
      desc: liveValues.contentBlock2Desc || 'Instantaneous client-side state synchronization with unified Redux stores.'
    },
    {
      title: liveValues.contentBlock3Title || 'Autonomous Pipelines',
      desc: liveValues.contentBlock3Desc || 'Streamline design handoffs into validated, accessible codebases.'
    }
  ];

  const featureCardImages = [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80'
  ];

  // Full Landing Page faithful to the wireframe sketch
  return (
    <div className="relative min-h-screen w-full bg-[#09090b] text-white font-sans antialiased overflow-x-hidden rounded-2xl">
      {/* ── 1. Top Sticky Navbar with Search ────────────────────────────── */}
      <header className="w-full border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-16 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-6 sm:gap-10">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-glow-sm" />
              <span
                className="text-lg sm:text-xl font-black tracking-wider uppercase text-white hover:text-red-400 transition cursor-pointer"
                dangerouslySetInnerHTML={{ __html: displayBrand }}
              />
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-zinc-300">
              {['Features', 'Solutions', 'Pricing'].map((link) => (
                <a key={link} href="#" className="hover:text-white hover:underline transition-colors py-1">{link}</a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative hidden sm:block">
              <input
                type="search"
                placeholder="search platform..."
                className="w-48 md:w-64 px-4 py-1.5 pl-9 rounded-full bg-zinc-900/90 border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition"
              />
              <span className="absolute left-3 top-2 text-zinc-400 text-xs">🔍</span>
            </div>
            <Button
              className="px-4 py-1.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 border-none text-white transition"
              label="Sign In"
              aria-label="Sign in"
            />
          </div>
        </div>
      </header>

      {/* ── 2. Full-Width Hero Section with Visual Media ────────────────── */}
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 pt-8 sm:pt-12 pb-12 sm:pb-16 flex flex-col items-center text-center">
        {displayBrand && (
          <div className="mb-4">
            <span
              className="inline-block px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full glass border border-red-500/40 uppercase text-red-400 font-bold text-[10px] sm:text-xs tracking-[0.2em]"
              dangerouslySetInnerHTML={{ __html: displayBrand }}
            />
          </div>
        )}

        <h1
          className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] uppercase max-w-4xl break-words"
          dangerouslySetInnerHTML={{ __html: displayHeadline }}
        />

        {displaySub && (
          <h2
            className="text-base sm:text-lg md:text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 mt-3 max-w-2xl"
            dangerouslySetInnerHTML={{ __html: displaySub }}
          />
        )}

        {displayDesc && (
          <p
            className="text-gray-400 text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed mt-4"
            dangerouslySetInnerHTML={{ __html: displayDesc }}
          />
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-6">
          <Button
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm sm:text-base bg-gradient-to-r from-red-600 to-orange-500 hover:shadow-glow-red hover:scale-105 transition-all border-none text-white shadow-lg"
            label={displayCta}
            aria-label="Primary CTA button"
            onClick={() => alert(`Clicked: ${displayCta}`)}
          />
          <button
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm sm:text-base glass border border-white/15 hover:bg-white/10 text-white transition-all"
            onClick={() => alert('Explore platform clicked')}
          >
            Explore Platform
          </button>
        </div>

        {/* Hero Visual Media Banner (Full-Width Wireframe Box) */}
        <div className="w-full max-w-5xl mt-8 sm:mt-12 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-zinc-900/60 p-2 sm:p-3 relative group">
          <img
            src={getImage(displayImage)}
            alt="Hero Visual Blueprint"
            onError={errorImage}
            className="w-full h-auto max-h-[360px] sm:max-h-[500px] object-cover rounded-xl sm:rounded-2xl transition-transform duration-500 group-hover:scale-[1.01]"
          />
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        </div>
      </main>

      {/* ── 3. Three Content Blocks in 3-Column Grid ────────────────────── */}
      <section className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 py-8 sm:py-12 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {contentBlocks.map((block, idx) => (
            <div
              key={idx}
              className="glass p-5 sm:p-6 rounded-2xl border border-white/10 hover:border-red-500/40 transition-all flex flex-col justify-center text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center font-bold text-sm mx-auto mb-3">
                0{idx + 1}
              </div>
              <h3
                className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-red-400 transition"
                dangerouslySetInnerHTML={{ __html: block.title }}
              />
              <p
                className="text-xs sm:text-sm text-gray-400 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: block.desc }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Prominent Horizontal "Below The Fold CTA" Banner ─────────── */}
      <section className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 py-6 sm:py-8">
        <div className="w-full rounded-2xl sm:rounded-3xl bg-gradient-to-r from-red-950/60 via-zinc-900 to-zinc-950 border border-red-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 shadow-xl">
          <div className="text-center md:text-left">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-red-400">Limited Alpha Access</span>
            <h2 className="text-lg sm:text-2xl font-black text-white mt-1">Ready to transform your UI workflows?</h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Join leading developers synthesizing production React components.</p>
          </div>
          <Button
            className="px-8 py-3 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-r from-red-600 to-orange-500 hover:shadow-glow-red hover:scale-105 transition-all border-none text-white flex-shrink-0"
            label="Join Alpha Now"
            aria-label="Join alpha"
            onClick={() => alert('Below the fold CTA activated')}
          />
        </div>
      </section>

      {/* ── 5. Four Feature Cards in 4-Column Grid with Image Headers ──── */}
      <section className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 py-8 sm:py-12 border-t border-white/10">
        <div className="text-center mb-8">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-red-400">Core Capabilities</span>
          <h2 className="text-xl sm:text-3xl font-black text-white mt-1">Engineered for Production Excellence</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.slice(0, 4).map((item, idx) => (
            <div
              key={idx}
              className="glass rounded-2xl border border-white/10 overflow-hidden flex flex-col hover:border-red-500/50 hover:scale-[1.02] transition-all group shadow-xl"
            >
              {/* Card Media Header (matching the wireframe square with X) */}
              <div className="w-full h-36 sm:h-40 overflow-hidden relative bg-zinc-900">
                <img
                  src={featureCardImages[idx % featureCardImages.length]}
                  alt={item.field1 || 'Feature'}
                  onError={errorImage}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-black/60 text-red-400 border border-white/10 backdrop-blur-md">
                  0{idx + 1}
                </span>
              </div>

              {/* Card Text Content */}
              <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h4
                    className="text-sm sm:text-base font-extrabold text-white group-hover:text-red-400 transition mb-1.5"
                    dangerouslySetInnerHTML={{ __html: item.field1 || 'Feature Metric' }}
                  />
                  <p
                    className="text-xs text-gray-400 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.field2 || 'Feature Description' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Full Website Footer ──────────────────────────────────────── */}
      <footer className="w-full border-t border-white/10 bg-zinc-950 mt-12 py-10 px-4 sm:px-6 lg:px-16 text-xs text-zinc-400">
        <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-white/5">
          {/* Left: Sign up CTA */}
          <div className="flex flex-col gap-3 max-w-md w-full">
            <span className="text-sm font-bold text-white uppercase tracking-wider">Stay Connected</span>
            <p className="text-xs text-gray-400">Receive architectural updates and newly generated design components.</p>
            <div className="flex items-center gap-2 w-full">
              <input
                type="email"
                placeholder="Enter your work email"
                className="flex-1 px-4 py-2 rounded-full bg-zinc-900 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-500/50"
              />
              <Button
                className="px-5 py-2 rounded-full text-xs font-bold bg-red-600 hover:bg-red-500 border-none text-white transition flex-shrink-0"
                label="Subscribe"
                aria-label="Subscribe"
                onClick={() => alert('Subscribed!')}
              />
            </div>
          </div>

          {/* Right: Three Navigation Columns */}
          <div className="flex flex-wrap gap-8 sm:gap-12 text-xs">
            <div className="flex flex-col gap-2">
              <span className="font-bold text-white uppercase text-[11px] tracking-wider">Product</span>
              <a href="#" className="hover:text-white transition">Architecture</a>
              <a href="#" className="hover:text-white transition">Live CMS</a>
              <a href="#" className="hover:text-white transition">Components</a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-bold text-white uppercase text-[11px] tracking-wider">Resources</span>
              <a href="#" className="hover:text-white transition">Documentation</a>
              <a href="#" className="hover:text-white transition">API Reference</a>
              <a href="#" className="hover:text-white transition">Guides</a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-bold text-white uppercase text-[11px] tracking-wider">Legal</span>
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">Security</a>
            </div>
          </div>
        </div>

        {/* Bottom Social Media Icons & Copyright */}
        <div className="max-w-[1920px] mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} {displayBrand || 'AI Studio'}. All rights reserved.</p>
          <div className="flex items-center gap-4 text-base text-zinc-400">
            <a href="#" className="hover:text-white transition" title="Email"><i className="pi pi-envelope" /></a>
            <a href="#" className="hover:text-white transition" title="LinkedIn"><i className="pi pi-linkedin" /></a>
            <a href="#" className="hover:text-white transition" title="Instagram"><i className="pi pi-instagram" /></a>
            <a href="#" className="hover:text-white transition" title="Twitter"><i className="pi pi-twitter" /></a>
            <a href="#" className="hover:text-white transition" title="Facebook"><i className="pi pi-facebook" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
