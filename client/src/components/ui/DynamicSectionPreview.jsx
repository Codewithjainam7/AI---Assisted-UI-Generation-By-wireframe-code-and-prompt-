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
  const brandBadge = getElementDefault('brandBadge', 'ACME ATHLETICS');
  const headlineMain = getElementDefault('headlineMain', 'CUSHY FLEECE HOODIE');
  const headlineSub = getElementDefault('headlineSub', "Men's Pullover Hoodie  $45");
  const description = getElementDefault('description', 'The Acme Cushy Hoodie is made with an ultra-soft interior for everyday comfort.<br /><br />• Shown: Dark Grey Heather/White<br />• Style: 804346-063');
  const ctaButton = getElementDefault('ctaButton', 'Add To Cart');
  const heroImage = getElementDefault('heroImage', PRODUCT_IMAGES[0]);

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

  if (displayImage.includes('uploads/') || displayImage.includes('wireframe') || displayImage.includes('1571434190823')) {
    displayImage = PRODUCT_IMAGES[0];
  }

  // Detect whether this is an e-commerce product wireframe
  const isEcommerce = ir?.domain === 'ecommerce' ||
    /hoodie|shoe|shirt|apparel|product|cart|fleece|acme/i.test(displayHeadline + ' ' + displaySub + ' ' + displayDesc) ||
    /hoodie|shop|store|product|overview/i.test(job?.sectionName || '');

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
          <div className="max-w-[1920px] mx-auto px-6 lg:px-16 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <span
                className="text-xl font-black tracking-wider uppercase text-white hover:text-red-400 transition cursor-pointer"
                dangerouslySetInnerHTML={{ __html: displayBrand }}
              />
              <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-zinc-300">
                {['Men', 'Women', 'Boys', 'Girls'].map((cat) => (
                  <a key={cat} href="#" className="hover:text-white hover:underline transition-colors py-1">{cat}</a>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <input
                  type="search"
                  placeholder="search"
                  className="w-48 md:w-64 px-4 py-1.5 pl-9 rounded-full bg-zinc-900/90 border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition"
                />
                <span className="absolute left-3 top-2 text-zinc-400 text-xs">🔍</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-zinc-400 font-medium">
                <span className="hidden md:inline hover:text-white cursor-pointer transition">Join / Log In</span>
                <span className="hidden md:inline text-zinc-600">|</span>
                <span className="hover:text-white cursor-pointer transition">Help</span>
                <button className="p-2 rounded-full hover:bg-white/10 text-white transition" title="Shopping Cart">
                  🛒
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Product Layout */}
        <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row items-start gap-10 xl:gap-16">
            
            {/* Left: 2x2 Product Views Gallery */}
            <div className="w-full lg:w-7/12 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 aspect-square shadow-lg">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={getImage(displayImage)}
                    onError={errorImage}
                    alt="Product view front"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-black/60 backdrop-blur-md text-white border border-white/15">
                    Front
                  </span>
                </div>

                <div className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 aspect-square shadow-lg">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={getImage(PRODUCT_IMAGES[1])}
                    onError={errorImage}
                    alt="Product view back"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-black/60 backdrop-blur-md text-white border border-white/15">
                    Back
                  </span>
                </div>

                <div className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 aspect-square shadow-lg">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={getImage(PRODUCT_IMAGES[2])}
                    onError={errorImage}
                    alt="Product view detail"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-black/60 backdrop-blur-md text-white border border-white/15">
                    Detail
                  </span>
                </div>

                <div className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 aspect-square shadow-lg">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={getImage(PRODUCT_IMAGES[3])}
                    onError={errorImage}
                    alt="Product view lifestyle"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-black/60 backdrop-blur-md text-white border border-white/15">
                    Fit
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Product Details & Purchase Form */}
            <div className="w-full lg:w-5/12 flex flex-col space-y-6 lg:pl-2">
              <div>
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-red-500/15 text-red-400 border border-red-500/20 mb-3"
                  dangerouslySetInnerHTML={{ __html: displayBrand }}
                />

                <h1
                  className="text-3xl sm:text-4xl xl:text-5xl font-black text-white tracking-tight uppercase leading-tight"
                  dangerouslySetInnerHTML={{ __html: displayHeadline }}
                />

                <h2
                  className="text-xl sm:text-2xl font-semibold text-zinc-300 mt-2"
                  dangerouslySetInnerHTML={{ __html: displaySub }}
                />
              </div>

              {/* Color Swatches */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase text-zinc-400 tracking-wider">
                  Select Color: <span className="text-white normal-case">{COLOR_SWATCHES[selectedColor].name}</span>
                </span>
                <div className="flex items-center gap-3">
                  {COLOR_SWATCHES.map((swatch, idx) => (
                    <button
                      key={swatch.name}
                      onClick={() => setSelectedColor(idx)}
                      className={`w-10 h-10 rounded-xl border-2 transition-all p-0.5 overflow-hidden ${
                        selectedColor === idx
                          ? 'border-red-500 scale-110 shadow-glow-red ring-2 ring-red-500/30'
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
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs font-bold tracking-wider">
                  <span className="text-zinc-400 uppercase">Choose Size</span>
                  <button className="text-zinc-400 hover:text-white underline transition">Size Guide</button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 rounded-xl font-bold text-sm transition-all border ${
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
              <div className="flex items-center gap-3 pt-4">
                <Button
                  className="flex-1 py-4 rounded-full font-black text-base uppercase tracking-wider bg-gradient-to-r from-red-600 via-orange-500 to-red-600 hover:shadow-glow-red hover:scale-[1.02] active:scale-[0.98] transition-all border-none"
                  severity="danger"
                  label={displayCta}
                  aria-label="Add to cart"
                  onClick={() => alert(`Added to cart: ${displayHeadline} (${selectedSize})`)}
                />
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all ${
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
              <div className="border-t border-white/10 pt-5 space-y-3">
                <p
                  className="text-zinc-300 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: displayDesc }}
                />
                <a href="#" className="inline-block text-xs font-semibold text-zinc-400 hover:text-white underline transition">
                  Read More Details
                </a>
              </div>

              {/* Stat / Feature Badges */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {statCards.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-zinc-900/60 border border-white/10 flex flex-col items-center text-center">
                    <span
                      className="text-sm font-extrabold text-white"
                      dangerouslySetInnerHTML={{ __html: item.field1 || '100%' }}
                    />
                    <span
                      className="text-[10px] text-zinc-400 mt-0.5 leading-tight"
                      dangerouslySetInnerHTML={{ __html: item.field2 || 'Quality' }}
                    />
                  </div>
                ))}
              </div>

            </div>
          </div>
        </main>
      </div>
    );
  }

  // Standard Split-Hero fallback
  return (
    <div className="relative min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-zinc-950 text-white rounded-2xl">
      <div className="hidden md:block absolute left-0 top-0 h-full w-2 bg-red-500 z-0" />
      <div className="hidden md:block absolute right-0 top-0 h-full w-2 bg-red-500 z-0" />

      <main className="relative z-10 w-full max-w-[1920px] mx-auto px-4 md:px-12 flex items-center justify-center py-12 md:py-16">
        <section className="w-full flex flex-col md:flex-row items-center gap-8 md:gap-12 overflow-hidden">
          <div className="w-full md:w-1/2 flex items-center justify-center min-h-[300px] md:min-h-[500px] p-4">
            <div className="relative w-full max-w-[500px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900/60 p-2 group">
              <img
                src={getImage(displayImage)}
                alt="Section visual"
                onError={errorImage}
                className="w-full h-auto max-h-[460px] object-contain mx-auto rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center px-4 md:px-8 space-y-6">
            {displayBrand && (
              <div>
                <span
                  className="inline-block px-4 py-1.5 rounded-full glass border border-red-500/40 uppercase text-red-400 font-bold text-xs tracking-[0.2em]"
                  dangerouslySetInnerHTML={{ __html: displayBrand }}
                />
              </div>
            )}

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] uppercase"
              dangerouslySetInnerHTML={{ __html: displayHeadline }}
            />

            {displaySub && (
              <h2
                className="text-lg md:text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400"
                dangerouslySetInnerHTML={{ __html: displaySub }}
              />
            )}

            {displayDesc && (
              <p
                className="text-gray-400 text-sm md:text-base max-w-xl leading-relaxed font-normal"
                dangerouslySetInnerHTML={{ __html: displayDesc }}
              />
            )}

            {Array.isArray(statCards) && statCards.length > 0 && (
              <div className="flex flex-wrap md:flex-nowrap gap-3 pt-2">
                {statCards.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex-1 min-w-[110px] glass p-3.5 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center shadow-lg"
                  >
                    <div
                      className="text-2xl md:text-3xl font-extrabold text-white"
                      dangerouslySetInnerHTML={{ __html: item.field1 || '100+' }}
                    />
                    <div
                      className="mt-1 text-gray-400 text-[11px] uppercase tracking-wider leading-snug"
                      dangerouslySetInnerHTML={{ __html: item.field2 || 'Metric' }}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2">
              <Button
                className="w-full md:w-auto px-8 py-3.5 rounded-full font-bold text-base bg-gradient-to-r from-red-600 to-orange-500 hover:shadow-glow-red hover:scale-105 transition-all border-none text-white shadow-lg"
                label={displayCta}
                aria-label="Call to action"
                onClick={() => alert(`CTA Clicked: ${displayCta}`)}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
