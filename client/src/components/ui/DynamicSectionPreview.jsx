import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'primereact/button';
import { fetchElementsByIds } from '../../features/cms/cmsSlice';
import { getImage, errorImage } from '../../utils/getImage';

export default function DynamicSectionPreview({ pageName = 'Home', job = null }) {
  const dispatch = useDispatch();

  const cmsData = useSelector((state) => state.cms?.allSections?.[pageName]) || {};
  const cmsCss  = useSelector((state) => state.cms?.allSectionsCss?.[pageName]) || {};

  // Extract from IR or fall back to standard defaults
  const ir = job?.ir;
  const elements = ir?.elements || [];

  const getElementDefault = (name, fallback) => {
    const el = elements.find((e) => e.elementName === name);
    return el?.defaultContent || fallback;
  };

  // Resolve values: Redux CMS values win if available; otherwise IR defaultContent
  const brandBadge = getElementDefault('brandBadge', 'AI STUDIO');
  const headlineMain = getElementDefault('headlineMain', 'NEXT-GEN UI GENERATION');
  const headlineSub = getElementDefault('headlineSub', 'Built with Automated CMS Bindings & Modern Aesthetics');
  const description = getElementDefault('description', 'Transform ideas and wireframes into production React components instantly.');
  const ctaButton = getElementDefault('ctaButton', 'GET STARTED');
  const heroImage = getElementDefault('heroImage', 'default/images/hero-placeholder.jpg');

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
      if (val.includes('.jpg') || val.includes('.png') || val.includes('.webp')) {
        liveValues.heroImage = val;
      }
    }
  });

  const displayBrand = liveValues.brandBadge || brandBadge;
  const displayHeadline = liveValues.headlineMain || headlineMain;
  const displaySub = liveValues.headlineSub || headlineSub;
  const displayDesc = liveValues.description || description;
  const displayCta = liveValues.ctaButton || ctaButton;
  const displayImage = liveValues.heroImage || heroImage;

  // Stat badges loop
  const statEl = elements.find((e) => e.elementName === 'statBadges');
  let statCards = statEl?.statCards || [
    { field1: '100+', field2: 'Active Users' },
    { field1: '4.9★', field2: 'Top Rated' },
    { field1: '24/7', field2: 'Live Support' },
  ];

  if (statEl?.fieldId && Array.isArray(cmsData[statEl.fieldId]) && cmsData[statEl.fieldId].length > 0) {
    statCards = cmsData[statEl.fieldId];
  }

  // Layout & Theme
  const isMediaRight = ir?.layout?.mediaPosition === 'right';
  const accentColor = ir?.theme?.accent || 'red-500';

  useEffect(() => {
    if (job?.elementIds?.length > 0) {
      dispatch(fetchElementsByIds({ elementIds: job.elementIds, pageName }));
    }
  }, [dispatch, pageName, job?.sectionId]);

  return (
    <div className="relative min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-zinc-950 text-white rounded-2xl">
      {/* Decorative Red Accent Bars */}
      <div className="hidden md:block absolute left-0 top-0 h-full w-2 bg-red-500 z-0" />
      <div className="hidden md:block absolute right-0 top-0 h-full w-2 bg-red-500 z-0" />

      <main className="relative z-10 w-full max-w-[1920px] mx-auto px-4 md:px-12 flex items-center justify-center py-12 md:py-16">
        <section className={`w-full flex flex-col ${isMediaRight ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-12 overflow-hidden`}>
          
          {/* Media / Image Column */}
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

          {/* Content Column */}
          <div className="w-full md:w-1/2 flex flex-col justify-center px-4 md:px-8 space-y-6">
            
            {/* Brand Badge */}
            {displayBrand && (
              <div>
                <span
                  className="inline-block px-4 py-1.5 rounded-full glass border border-red-500/40 uppercase text-red-400 font-bold text-xs tracking-[0.2em]"
                  dangerouslySetInnerHTML={{ __html: displayBrand }}
                />
              </div>
            )}

            {/* Headline Main */}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] uppercase"
              dangerouslySetInnerHTML={{ __html: displayHeadline }}
            />

            {/* Headline Sub */}
            {displaySub && (
              <h2
                className="text-lg md:text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400"
                dangerouslySetInnerHTML={{ __html: displaySub }}
              />
            )}

            {/* Description */}
            {displayDesc && (
              <p
                className="text-gray-400 text-sm md:text-base max-w-xl leading-relaxed font-normal"
                dangerouslySetInnerHTML={{ __html: displayDesc }}
              />
            )}

            {/* Stat Cards */}
            {Array.isArray(statCards) && statCards.length > 0 && (
              <div className="flex flex-wrap md:flex-nowrap gap-3 pt-2">
                {statCards.map((item, idx) => (
                  <div
                    key={item.fieldId1 || idx}
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

            {/* CTA Button */}
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
