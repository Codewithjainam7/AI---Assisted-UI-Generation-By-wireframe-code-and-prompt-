import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'primereact/button';
import { fetchElementsByIds } from '../../features/cms/cmsSlice';
import { getSectionTextContrastClass } from '../../utils/sectionContrast';
import { getImage, errorImage } from '../../utils/getImage';
import { sanitise } from '../../utils/sanitiseHtml';

const ids = {
  heroImage: '2000000001',
  brandBadge: '2000000002',
  headlineMain: '2000000003',
  headlineSub: '2000000004',
  description: '2000000005',
  statBadges: '2000000006',
  ctaButton: '2000000007',
};

const DEFAULT_STAT_CARDS = [
  { field1: '1000+', fieldType1: 'Text', fieldId1: '3000000001', field2: 'Community<br />Members', fieldType2: 'Text', fieldId2: '3000000002' },
  { field1: '40+', fieldType1: 'Text', fieldId1: '3000000003', field2: 'Fitness<br />Programmes', fieldType2: 'Text', fieldId2: '3000000004' },
  { field1: '150+', fieldType1: 'Text', fieldId1: '3000000005', field2: 'Fitness<br />Channels', fieldType2: 'Text', fieldId2: '3000000006' },
];

export default function HeroSection({ pageName = 'Home' }) {
  const dispatch = useDispatch();
  const contentData = useSelector((state) => state.cms.allSections[pageName]) || {};
  const cssData = useSelector((state) => state.cms.allSectionsCss[pageName]) || {};
  
  const sectionRef = useRef(null);

  useEffect(() => {
    const elementIds = Object.values(ids);
    dispatch(fetchElementsByIds({ elementIds, pageName }));
  }, [dispatch, pageName]);

  useEffect(() => {
    if (sectionRef.current) {
      Object.keys(cssData).forEach((fieldId) => {
        const elements = sectionRef.current.querySelectorAll(`[data-field-id="${fieldId}"]`);
        elements.forEach((el) => {
          if (cssData[fieldId]) {
            el.style.cssText = cssData[fieldId];
          }
        });
      });
    }
  }, [cssData]);

  // Content Fallbacks
  const heroImage = contentData[ids.heroImage] || 'default/images/hero-bg.jpg';
  const brandBadge = contentData[ids.brandBadge] || 'FITNESS STUDIO';
  const headlineMain = contentData[ids.headlineMain] || 'ELEVATE YOUR FITNESS';
  const headlineSub = contentData[ids.headlineSub] || 'JOURNEY WITH US';
  const description = contentData[ids.description] || 'Experience world-class facilities and expert guidance to help you reach your ultimate potential.';
  const statBadges = Array.isArray(contentData[ids.statBadges]) ? contentData[ids.statBadges] : DEFAULT_STAT_CARDS;
  const ctaButton = contentData[ids.ctaButton] || 'Start Free Trial';

  const contrastClass = getSectionTextContrastClass('dark', 'red');

  return (
    <section ref={sectionRef} className="relative w-full min-h-[80vh] flex flex-col md:flex-row bg-[#09090b] text-white overflow-hidden group">
      
      {/* Decorative Accent Bars (Desktop) */}
      <div className="hidden md:block absolute left-0 top-0 bottom-0 w-2 bg-red-600/80 z-20"></div>
      
      {/* Left Content Column */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 md:py-0 z-10 relative">
        
        {/* Brand Badge */}
        <div className="mb-6 animate-fade-up">
          <span 
            data-field-id={ids.brandBadge}
            className="inline-block px-4 py-1.5 rounded-full glass border border-red-500/30 text-red-400 text-xs font-bold tracking-[0.2em]"
            dangerouslySetInnerHTML={{ __html: sanitise(brandBadge) }}
          />
        </div>

        {/* Headlines */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[1.1] mb-2 tracking-tight animate-fade-up" style={{animationDelay: '0.1s'}}>
          <span 
            data-field-id={ids.headlineMain}
            className="block text-white"
            dangerouslySetInnerHTML={{ __html: sanitise(headlineMain) }}
          />
          <span 
            data-field-id={ids.headlineSub}
            className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500"
            dangerouslySetInnerHTML={{ __html: sanitise(headlineSub) }}
          />
        </h1>

        {/* Description */}
        <p 
          data-field-id={ids.description}
          className="mt-6 text-gray-400 text-lg md:text-xl max-w-xl font-medium leading-relaxed animate-fade-up"
          style={{animationDelay: '0.2s'}}
          dangerouslySetInnerHTML={{ __html: sanitise(description) }}
        />

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center gap-6 animate-fade-up" style={{animationDelay: '0.3s'}}>
          <Button 
            className="p-button-rounded bg-gradient-to-r from-red-600 to-red-500 border-none px-8 py-4 font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(220,38,38,0.4)]"
          >
            <span data-field-id={ids.ctaButton} dangerouslySetInnerHTML={{ __html: sanitise(ctaButton) }} />
            <i className="pi pi-arrow-right ml-3 text-sm"></i>
          </Button>
          
          <button className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors font-semibold">
            <div className="w-12 h-12 rounded-full glass flex items-center justify-center border border-white/10">
              <i className="pi pi-play text-sm"></i>
            </div>
            Watch Video
          </button>
        </div>

        {/* Stat Badges (Loop) */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-6 animate-fade-up" style={{animationDelay: '0.4s'}}>
          {statBadges.map((stat, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <span 
                className="text-3xl font-black text-white"
                dangerouslySetInnerHTML={{ __html: sanitise(stat.field1) }}
              />
              <span 
                className="text-sm font-medium text-gray-500 uppercase tracking-wide leading-tight"
                dangerouslySetInnerHTML={{ __html: sanitise(stat.field2) }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right Image Column */}
      <div className="flex-1 relative min-h-[50vh] md:min-h-full clip-path-hero">
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-transparent to-transparent z-10 hidden md:block"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent z-10 md:hidden"></div>
        
        <img 
          data-field-id={ids.heroImage}
          src={getImage(heroImage)}
          onError={errorImage}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover object-center grayscale-[0.2] contrast-125 group-hover:grayscale-0 transition-all duration-700"
        />
        
        {/* Image overlay glow */}
        <div className="absolute inset-0 bg-red-600/10 mix-blend-overlay"></div>
      </div>

    </section>
  );
}
