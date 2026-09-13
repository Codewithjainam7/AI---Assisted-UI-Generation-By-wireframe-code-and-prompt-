import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from "../../features/cms/cmsSlice";
import { getSectionTextContrastClass } from "../../utils/sectionContrast";
import { getImage, errorImage } from "../../utils/getImage";

// R1: Stable ids map
const ids = {
  heroImage:    "2000000260",
  brandBadge:   "2000000261",
  headlineMain: "2000000262",
  headlineSub:  "2000000263",
  description:  "2000000264",
  statBadges:   "2000000265",
  ctaButton:    "2000000266",
};

// R9: Default stat cards extracted from wireframe
const DEFAULT_STAT_CARDS = [
  { field1: "Content Item Title", fieldType1: "Text", fieldId1: "3000000181", field2: "Media Placeholder", fieldType2: "Text", fieldId2: "3000000182" },
];

// R2: pageName prop
const CustomSection = ({ pageName = "Home" }) => {
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
        "3000000181","3000000182"
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
    <div ref={rootRef} className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden bg-zinc-950 text-white">
      <div className="hidden md:block absolute left-0 top-0 h-full w-2 bg-indigo-500 z-0" />
      <div className="hidden md:block absolute right-0 top-0 h-full w-2 bg-indigo-500 z-0" />

      <main className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 flex items-center justify-center min-h-screen py-8 sm:py-12 md:py-16">
        <section className="w-full flex flex-col md:flex-row bg-zinc-950 overflow-hidden py-6 sm:py-12 md:py-0">
          <div className="md:w-1/2 w-full flex items-center justify-center min-h-[260px] sm:min-h-[350px] md:min-h-[680px] py-4 sm:py-8 px-2 sm:px-4">
            <img
              id={ids.heroImage}
              className="dynamicStyle2 max-w-full max-h-[320px] sm:max-h-[550px] h-auto object-contain mx-auto rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10"
              src={data?.[ids.heroImage] ? getImage(data[ids.heroImage]) : getImage("https://images.unsplash.com/photo-1616763355548-ee0325858674?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80")}
              alt="Section visual representation"
              onError={errorImage}
            />
          </div>

          <div className="md:w-1/2 w-full flex flex-col justify-center px-4 sm:px-8 md:px-16 py-6 sm:py-12 space-y-4 sm:space-y-6 items-center md:items-start text-center md:text-left">
            <div>
              <span
                id={ids.brandBadge}
                className="dynamicStyle inline-block px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full glass border border-indigo-500/30 uppercase text-indigo-500 font-bold text-[10px] sm:text-xs tracking-[0.2em]"
                dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "AI STUDIO" }}
              />
            </div>

            <h1
              id={ids.headlineMain}
              className="dynamicStyle text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] uppercase break-words"
              dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "WELCOME" }}
            />

            <h2
              id={ids.headlineSub}
              className="dynamicStyle text-base sm:text-lg md:text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-orange-400"
              dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "REGISTRATION" }}
            />

            <p
              id={ids.description}
              className="dynamicStyle text-gray-400 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed font-normal"
              dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "This collection of mobile application wireframes illustrates a complete user journey including a welcome screen, user registration form, profile management, various content display formats (lists and grids), detailed content views, and a calendar component for scheduling or date selection. The app features consistent branding with a 'LOGO' and a standard bottom navigation bar across multiple screens." }}
            />

            <div id={ids.statBadges} className="dynamicStyle grid grid-cols-3 gap-2 sm:gap-4 pt-2 w-full">
              {statBadgesArr.map((item, idx) => (
                <div key={item.fieldId1 || idx} className="glass p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center shadow-lg">
                  <div
                    id={item.fieldId1}
                    className="dynamicStyle text-base sm:text-2xl md:text-3xl font-extrabold text-white"
                    dangerouslySetInnerHTML={{ __html: data?.[item.fieldId1] || item.field1 }}
                  />
                  <div
                    id={item.fieldId2}
                    className="dynamicStyle mt-0.5 sm:mt-1 text-gray-400 text-[9px] sm:text-xs uppercase tracking-wider leading-snug"
                    dangerouslySetInnerHTML={{ __html: data?.[item.fieldId2] || item.field2 }}
                  />
                </div>
              ))}
            </div>

            <div className="pt-2 w-full sm:w-auto">
              <Button
                id={ids.ctaButton}
                className="dynamicStyle w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-full font-bold text-sm sm:text-base bg-gradient-to-r from-red-600 to-orange-500 hover:shadow-glow-red hover:scale-105 transition-all border-none"
                aria-label="Primary call to action"
                label={data?.[ids.ctaButton] || "NEXT →"}
                onClick={() => {}}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CustomSection;
