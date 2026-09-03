/**
 * generateFallback(ir)
 * Template-based fallback JSX generator — used when Nemotron fails after 2 attempts.
 * Satisfies ALL R1-R14 rules.
 */
export function generateFallback(ir) {
  const sectionName = ir.sectionName || 'Custom';
  const pageName    = ir.pageName    || 'Home';
  const accent      = ir.theme?.accent || 'red-500';

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

  const getDefault = (name) => {
    const el = (ir.elements || []).find(e => e.elementName === name);
    return el?.defaultContent || '';
  };

  return `import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from "../../features/cms/cmsSlice";
import { getSectionTextContrastClass } from "../../utils/sectionContrast";
import { getImage, errorImage } from "../../utils/getImage";

// R1: Stable ids map
const ids = {
  heroImage:    "${idsMap.heroImage}",
  brandBadge:   "${idsMap.brandBadge}",
  headlineMain: "${idsMap.headlineMain}",
  headlineSub:  "${idsMap.headlineSub}",
  description:  "${idsMap.description}",
  statBadges:   "${idsMap.statBadges}",
  ctaButton:    "${idsMap.ctaButton}",
};

// R9: Default stat cards fallback
const DEFAULT_STAT_CARDS = [
  { field1: "1000+", fieldType1: "Text", fieldId1: "TBD-cardField1", field2: "Community<br />Members",  fieldType2: "Text", fieldId2: "TBD-cardField2" },
  { field1: "40+",   fieldType1: "Text", fieldId1: "TBD-cardField3", field2: "Fitness<br />Programmes", fieldType2: "Text", fieldId2: "TBD-cardField4" },
  { field1: "150+",  fieldType1: "Text", fieldId1: "TBD-cardField5", field2: "Fitness<br />Channels",   fieldType2: "Text", fieldId2: "TBD-cardField6" },
];

// R2: pageName prop
const ${sectionName}Section = ({ pageName = "${pageName}" }) => {
  const dispatch = useDispatch();

  // R4: Read from Redux store
  const data    = useSelector((state) => state.cms?.allSections?.[pageName]);
  const cssData = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);
  const rootRef = useRef(null);

  // R9: CMS loop or fallback
  const statBadgesArr =
    Array.isArray(data?.[ids.statBadges]) && data[ids.statBadges].length === 3
      ? data[ids.statBadges]
      : DEFAULT_STAT_CARDS;

  // R3: Dispatch all fieldIds on mount
  useEffect(() => {
    dispatch(fetchElementsByIds({
      elementIds: [
        ids.heroImage, ids.brandBadge, ids.headlineMain, ids.headlineSub,
        ids.description, ids.statBadges, ids.ctaButton,
        "TBD-cardField1","TBD-cardField2","TBD-cardField3",
        "TBD-cardField4","TBD-cardField5","TBD-cardField6",
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
    <div ref={rootRef} className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-950">
      <div className="hidden md:block absolute left-0 top-0 h-full w-2 bg-${accent} z-0" />
      <div className="hidden md:block absolute right-0 top-0 h-full w-2 bg-${accent} z-0" />

      <main className="relative z-10 w-full max-w-[1920px] mx-auto px-0 md:px-12 flex items-center justify-center min-h-screen">
        {/* R11: flex-col on mobile, flex-row on desktop */}
        <section className="w-full flex flex-col md:flex-row bg-zinc-950 overflow-hidden">

          {/* Left — Hero Image */}
          <div className="md:w-1/2 w-full flex items-center justify-center min-h-[400px] md:min-h-[680px] py-8">
            {/* R5: id, R7: getImage+errorImage, R12: dynamicStyle2 */}
            <img
              id={ids.heroImage}
              className="dynamicStyle2 max-w-full max-h-[600px] h-auto object-contain mx-auto"
              src={data?.[ids.heroImage] ? getImage(data[ids.heroImage]) : getImage(null)}
              alt="Section hero image"
              onError={errorImage}
            />
          </div>

          {/* Right — Content */}
          <div className="md:w-1/2 w-full flex flex-col justify-center px-6 md:px-16 py-12 space-y-6">

            {/* Brand Badge — R5 id, R6 html, R12 dynamicStyle */}
            <span
              id={ids.brandBadge}
              className="dynamicStyle uppercase text-${accent} font-bold text-sm tracking-[0.2em]"
              dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "${getDefault('brandBadge') || 'PULSE FIT'}" }}
            />

            {/* Headline Main */}
            <h1
              id={ids.headlineMain}
              className="dynamicStyle text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight"
              dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "${getDefault('headlineMain') || 'CHALLENGE YOUR LIMITS'}" }}
            />

            {/* Headline Sub */}
            <h2
              id={ids.headlineSub}
              className="dynamicStyle text-lg md:text-xl font-medium text-gray-400"
              dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "${getDefault('headlineSub') || "Be a part of the tribe that's limitless."}" }}
            />

            {/* Description */}
            <p
              id={ids.description}
              className="dynamicStyle text-gray-500 text-base md:text-lg max-w-xl leading-relaxed"
              dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "${getDefault('description') || 'Join trainer-led workout sessions.'}" }}
            />

            {/* Stat Cards — R9 loop, R5 ids on each */}
            <div id={ids.statBadges} className="dynamicStyle flex flex-col md:flex-row md:justify-between md:gap-x-8 gap-y-6 pt-2">
              {statBadgesArr.map((item) => (
                <div key={item.fieldId1} className="flex-1 flex flex-col items-center justify-center">
                  <div
                    id={item.fieldId1}
                    className="dynamicStyle text-3xl md:text-4xl font-extrabold text-white"
                    dangerouslySetInnerHTML={{ __html: data?.[item.fieldId1] || item.field1 }}
                  />
                  <div
                    id={item.fieldId2}
                    className="dynamicStyle mt-1 text-gray-500 text-sm text-center"
                    dangerouslySetInnerHTML={{ __html: data?.[item.fieldId2] || item.field2 }}
                  />
                </div>
              ))}
            </div>

            {/* CTA Button — R8 PrimeReact, R5 id, R12 dynamicStyle */}
            <Button
              id={ids.ctaButton}
              className="dynamicStyle w-full md:w-auto rounded-full font-bold"
              severity="danger"
              aria-label="Primary call to action"
              label={data?.[ids.ctaButton] || "${getDefault('ctaButton') || 'FIND A WORKOUT'}"}
              onClick={() => {}}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

// R14: Default export
export default ${sectionName}Section;
`;
}
