import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from "../../features/cms/cmsSlice";
import { getSectionTextContrastClass } from "../../utils/sectionContrast";
import { getImage, errorImage } from "../../utils/getImage";

// R1: Stable ids map
const ids = {
  heroImage:    "2000000141",
  brandBadge:   "2000000142",
  headlineMain: "2000000143",
  headlineSub:  "2000000144",
  description:  "2000000145",
  statBadges:   "2000000146",
  ctaButton:    "2000000147",
};

// R9: Default stat cards extracted from wireframe
const DEFAULT_STAT_CARDS = [
  { field1: "100+", fieldType1: "Text", fieldId1: "3000000121", field2: "Active Users", fieldType2: "Text", fieldId2: "3000000122" },
  { field1: "4.9★", fieldType1: "Text", fieldId1: "3000000123", field2: "Top Rated", fieldType2: "Text", fieldId2: "3000000124" },
  { field1: "24/7", fieldType1: "Text", fieldId1: "3000000125", field2: "Live Support", fieldType2: "Text", fieldId2: "3000000126" },
];

// R2: pageName prop
const NovaHeroSection = ({ pageName = "Home" }) => {
  const dispatch = useDispatch();

  // R4: Read from Redux store
  const data    = useSelector((state) => state.cms?.allSections?.[pageName]);
  const cssData = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);
  const rootRef = useRef(null);

  // R9: CMS loop or fallback
  const statBadgesArr =
    Array.isArray(data?.[ids.statBadges]) && data[ids.statBadges].length > 0
      ? data[ids.statBadges]
      : DEFAULT_STAT_CARDS;

  // R3: Dispatch all fieldIds on mount
  useEffect(() => {
    dispatch(fetchElementsByIds({
      elementIds: [
        ids.heroImage, ids.brandBadge, ids.headlineMain, ids.headlineSub,
        ids.description, ids.statBadges, ids.ctaButton,
        "3000000121","3000000122","3000000123","3000000124","3000000125","3000000126"
      ],
      pageName,
    }));
  }, [dispatch, pageName]);

  // R10: Apply per-element CSS overrides
  useEffect(() => {
    Object.values(ids).forEach((id) => {
      if (id && cssData?.[id]) {
        const el = document.getElementById(id);
        if (el) el.style.cssText = cssData[id];
      }
    });
  }, [cssData]);

  return (
    // R11: Responsive split layout with max-width
    <div ref={rootRef} className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-950 text-white">
      <div className="hidden md:block absolute left-0 top-0 h-full w-2 bg-red-500 z-0" />
      <div className="hidden md:block absolute right-0 top-0 h-full w-2 bg-red-500 z-0" />

      <main className="relative z-10 w-full max-w-[1920px] mx-auto px-4 md:px-12 flex items-center justify-center min-h-screen">
        {/* R11: flex-col on mobile, flex-row on desktop */}
        <section className="w-full flex flex-col md:flex-row bg-zinc-950 overflow-hidden py-12 md:py-0">

          {/* Hero Media / Image */}
          <div className="md:w-1/2 w-full flex items-center justify-center min-h-[350px] md:min-h-[680px] py-8 px-4">
            {/* R5: id, R7: getImage+errorImage, R12: dynamicStyle2 */}
            <img
              id={ids.heroImage}
              className="dynamicStyle2 max-w-full max-h-[550px] h-auto object-contain mx-auto rounded-3xl shadow-2xl border border-white/10"
              src={data?.[ids.heroImage] ? getImage(data[ids.heroImage]) : getImage("default/images/hero-placeholder.jpg")}
              alt="Section visual representation"
              onError={errorImage}
            />
          </div>

          {/* Content Column */}
          <div className="md:w-1/2 w-full flex flex-col justify-center px-6 md:px-16 py-12 space-y-6">

            {/* Brand Badge */}
            <div>
              <span
                id={ids.brandBadge}
                className="dynamicStyle inline-block px-4 py-1.5 rounded-full glass border border-red-500/30 uppercase text-red-500 font-bold text-xs tracking-[0.2em]"
                dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "AI STUDIO" }}
              />
            </div>

            {/* Headline Main */}
            <h1
              id={ids.headlineMain}
              className="dynamicStyle text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] uppercase"
              dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "NEXT-GEN UI GENERATION" }}
            />

            {/* Headline Sub */}
            <h2
              id={ids.headlineSub}
              className="dynamicStyle text-lg md:text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400"
              dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Transform ideas and wireframes into production React components." }}
            />

            {/* Description */}
            <p
              id={ids.description}
              className="dynamicStyle text-gray-400 text-sm md:text-base max-w-xl leading-relaxed font-normal"
              dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "Built with automated CMS bindings, responsive layout system, and modern iOS-inspired aesthetics." }}
            />

            {/* Stat Cards */}
            <div id={ids.statBadges} className="dynamicStyle flex flex-wrap md:flex-nowrap gap-4 pt-2">
              {statBadgesArr.map((item, idx) => (
                <div key={item.fieldId1 || idx} className="flex-1 min-w-[120px] glass p-4 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center">
                  <div
                    id={item.fieldId1}
                    className="dynamicStyle text-2xl md:text-3xl font-extrabold text-white"
                    dangerouslySetInnerHTML={{ __html: data?.[item.fieldId1] || item.field1 }}
                  />
                  <div
                    id={item.fieldId2}
                    className="dynamicStyle mt-1 text-gray-400 text-xs uppercase tracking-wider leading-snug"
                    dangerouslySetInnerHTML={{ __html: data?.[item.fieldId2] || item.field2 }}
                  />
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Button
                id={ids.ctaButton}
                className="dynamicStyle w-full md:w-auto px-8 py-3.5 rounded-full font-bold text-base bg-gradient-to-r from-red-600 to-orange-500 hover:shadow-glow-red hover:scale-105 transition-all border-none"
                aria-label="Primary call to action"
                label={data?.[ids.ctaButton] || "GET STARTED"}
                onClick={() => {}}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// R14: Default export
export default NovaHeroSection;
