import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from "../../features/cms/cmsSlice";
import { getSectionTextContrastClass } from "../../utils/sectionContrast";
import { getImage, errorImage } from "../../utils/getImage";

// R1: Standard ids map
const ids = {
  heroImage:    "2000000001",
  brandBadge:   "2000000002",
  headlineMain: "2000000003",
  headlineSub:  "2000000004",
  description:  "2000000005",
  statBadges:   "2000000006",
  ctaButton:    "2000000007",
};

// R9: Default stat cards fallback
const DEFAULT_STAT_CARDS = [
  { field1: "1000+", fieldType1: "Text", fieldId1: "3000000001", field2: "Community<br />Members",  fieldType2: "Text", fieldId2: "3000000002" },
  { field1: "40+",   fieldType1: "Text", fieldId1: "3000000003", field2: "Fitness<br />Programmes", fieldType2: "Text", fieldId2: "3000000004" },
  { field1: "150+",  fieldType1: "Text", fieldId1: "3000000005", field2: "Fitness<br />Channels",   fieldType2: "Text", fieldId2: "3000000006" },
];

const HeroSection = ({ pageName = "Home" }) => {
  const dispatch = useDispatch();

  // R4: Read from Redux store
  const data    = useSelector((state) => state.cms?.allSections?.[pageName]) || {};
  const cssData = useSelector((state) => state.cms?.allSectionsCss?.[pageName]) || {};
  const rootRef = useRef(null);

  // Dynamically find content for fieldIds or fallback to keys
  const keys = Object.keys(data);
  const getContent = (preferredId, fallbackVal) => {
    if (data[preferredId] !== undefined) return data[preferredId];
    // If exact ID not found, check if there's any value in data
    return fallbackVal;
  };

  // Find Cards loop array if present
  let statBadgesArr = DEFAULT_STAT_CARDS;
  if (Array.isArray(data[ids.statBadges])) {
    statBadgesArr = data[ids.statBadges];
  } else {
    // Search any array in data
    const arrayKey = keys.find(k => Array.isArray(data[k]));
    if (arrayKey && Array.isArray(data[arrayKey])) {
      statBadgesArr = data[arrayKey];
    }
  }

  // R3: Dispatch all fieldIds on mount
  useEffect(() => {
    dispatch(fetchElementsByIds({
      elementIds: [
        ids.heroImage, ids.brandBadge, ids.headlineMain, ids.headlineSub,
        ids.description, ids.statBadges, ids.ctaButton,
        "3000000001","3000000002","3000000003",
        "3000000004","3000000005","3000000006",
      ],
      pageName,
    }));
  }, [dispatch, pageName]);

  // R10: Apply per-element CSS overrides
  useEffect(() => {
    Object.keys(cssData).forEach((id) => {
      if (id && cssData[id]) {
        const el = document.getElementById(id);
        if (el) el.style.cssText = cssData[id];
      }
    });
  }, [cssData]);

  const brandBadgeText = getContent(ids.brandBadge, "PULSE FIT");
  const headlineMainText = getContent(ids.headlineMain, "CHALLENGE YOUR LIMITS");
  const headlineSubText = getContent(ids.headlineSub, "Be a part of the tribe that's limitless.");
  const descriptionText = getContent(ids.description, "Join trainer-led workout sessions designed to kickstart your fitness journey, at your convenience.");
  const ctaButtonText = getContent(ids.ctaButton, "FIND A WORKOUT");
  const heroImageSrc = getContent(ids.heroImage, "default/images/hero-placeholder.jpg");

  return (
    // R11: Responsive split layout with max-width
    <div ref={rootRef} className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-950 text-white">
      {/* Red decorative accent bars */}
      <div className="hidden md:block absolute left-0 top-0 h-full w-2 bg-red-500 z-0" />
      <div className="hidden md:block absolute right-0 top-0 h-full w-2 bg-red-500 z-0" />

      <main className="relative z-10 w-full max-w-[1920px] mx-auto px-4 md:px-12 flex items-center justify-center min-h-screen">
        {/* R11: flex-col on mobile, flex-row on desktop */}
        <section className="w-full flex flex-col md:flex-row bg-zinc-950 overflow-hidden py-12 md:py-0">

          {/* Left — Hero Image */}
          <div className="md:w-1/2 w-full flex items-center justify-center min-h-[350px] md:min-h-[680px] py-6 px-4">
            {/* R5: id, R7: getImage+errorImage, R12: dynamicStyle2 */}
            <img
              id={ids.heroImage}
              className="dynamicStyle2 max-w-full max-h-[550px] h-auto object-contain mx-auto rounded-3xl shadow-2xl border border-white/5"
              src={getImage(heroImageSrc)}
              alt="Section hero image"
              onError={errorImage}
            />
          </div>

          {/* Right — Content */}
          <div className="md:w-1/2 w-full flex flex-col justify-center px-6 md:px-16 py-8 md:py-12 space-y-6">

            {/* Brand Badge — R5 id, R6 html, R12 dynamicStyle */}
            <div>
              <span
                id={ids.brandBadge}
                className="dynamicStyle inline-block px-4 py-1.5 rounded-full glass border border-red-500/30 uppercase text-red-400 font-bold text-xs tracking-[0.2em]"
                dangerouslySetInnerHTML={{ __html: typeof brandBadgeText === 'string' ? brandBadgeText : 'PULSE FIT' }}
              />
            </div>

            {/* Headline Main */}
            <h1
              id={ids.headlineMain}
              className="dynamicStyle text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] uppercase"
              dangerouslySetInnerHTML={{ __html: typeof headlineMainText === 'string' ? headlineMainText : 'CHALLENGE YOUR LIMITS' }}
            />

            {/* Headline Sub */}
            <h2
              id={ids.headlineSub}
              className="dynamicStyle text-lg md:text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400"
              dangerouslySetInnerHTML={{ __html: typeof headlineSubText === 'string' ? headlineSubText : "Be a part of the tribe that's limitless." }}
            />

            {/* Description */}
            <p
              id={ids.description}
              className="dynamicStyle text-gray-400 text-sm md:text-base max-w-xl leading-relaxed font-normal"
              dangerouslySetInnerHTML={{ __html: typeof descriptionText === 'string' ? descriptionText : 'Join trainer-led workout sessions.' }}
            />

            {/* Stat Cards — R9 loop, R5 ids on each */}
            <div id={ids.statBadges} className="dynamicStyle flex flex-wrap md:flex-nowrap gap-4 pt-2">
              {statBadgesArr.map((item, idx) => (
                <div key={item.fieldId1 || idx} className="flex-1 min-w-[120px] glass p-4 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center">
                  <div
                    id={item.fieldId1 || `stat-${idx}`}
                    className="dynamicStyle text-2xl md:text-3xl font-extrabold text-white"
                    dangerouslySetInnerHTML={{ __html: item.field1 || '1000+' }}
                  />
                  <div
                    id={item.fieldId2 || `label-${idx}`}
                    className="dynamicStyle mt-1 text-gray-400 text-xs uppercase tracking-wider leading-snug"
                    dangerouslySetInnerHTML={{ __html: item.field2 || 'Members' }}
                  />
                </div>
              ))}
            </div>

            {/* CTA Button — R8 PrimeReact, R5 id, R12 dynamicStyle */}
            <div className="pt-2">
              <Button
                id={ids.ctaButton}
                className="dynamicStyle w-full md:w-auto px-8 py-3.5 rounded-full font-bold text-base bg-gradient-to-r from-red-600 to-orange-500 hover:shadow-glow-red hover:scale-105 transition-all border-none"
                aria-label="Primary call to action"
                label={typeof ctaButtonText === 'string' ? ctaButtonText : 'FIND A WORKOUT'}
                onClick={() => alert('CTA clicked!')}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// R14: Default export
export default HeroSection;
