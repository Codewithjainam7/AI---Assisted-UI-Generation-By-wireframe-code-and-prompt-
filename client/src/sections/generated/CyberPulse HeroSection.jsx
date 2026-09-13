import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from "../../features/cms/cmsSlice";
import { getSectionTextContrastClass } from "../../utils/sectionContrast";
import { getImage, errorImage } from "../../utils/getImage";

const ids = {
  heroImage: "2000000190",
  brandBadge: "2000000191",
  headlineMain: "2000000192",
  headlineSub: "2000000193",
  description: "2000000194",
  statBadges: "2000000195",
  ctaButton: "2000000196",
};

const DEFAULT_STAT_CARDS = [
  { fieldId1: "3000000151", fieldId2: "3000000152", value: "99.9%", label: "THREAT DETECTION" },
  { fieldId1: "3000000153", fieldId2: "3000000154", value: "<1ms", label: "RESPONSE TIME" },
  { fieldId1: "3000000155", fieldId2: "3000000156", value: "24/7", label: "AUTONOMOUS OPS" },
];

const CustomSection = ({ pageName = "Home" }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.cms?.allSections?.[pageName]);
  const cssData = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);
  const contrastClass = getSectionTextContrastClass("white");

  useEffect(() => {
    dispatch(fetchElementsByIds({
      elementIds: [
        ids.heroImage, ids.brandBadge, ids.headlineMain, ids.headlineSub,
        ids.description, ids.statBadges, ids.ctaButton,
        "3000000151", "3000000152", "3000000153",
        "3000000154", "3000000155", "3000000156",
      ],
      pageName,
    }));
  }, [dispatch, pageName]);

  useEffect(() => {
    Object.values(ids).forEach(id => {
      if (id && cssData?.[id]) {
        const el = document.getElementById(id);
        if (el) el.style.cssText = cssData[id];
      }
    });
    DEFAULT_STAT_CARDS.forEach((card, idx) => {
      [card.fieldId1, card.fieldId2].forEach(fid => {
        if (cssData?.[fid]) {
          const el = document.getElementById(fid);
          if (el) el.style.cssText = cssData[fid];
        }
      });
    });
  }, [cssData]);

  const statBadgesArr = Array.isArray(data?.[ids.statBadges]) && data[ids.statBadges].length > 0
    ? data[ids.statBadges]
    : DEFAULT_STAT_CARDS;

  return (
    <section
      id={ids.heroImage + "-section"}
      className={`relative max-w-[1920px] mx-auto px-4 md:px-12 py-16 md:py-24 bg-white ${contrastClass}`}
      aria-labelledby={ids.headlineMain}
    >
      <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
        <div
          id={ids.heroImage + "-wrapper"}
          className="flex-1 w-full md:w-1/2 order-1 md:order-1 flex justify-center items-center"
        >
          <img
            id={ids.heroImage}
            className="dynamicStyle2 max-w-full max-h-[600px] h-auto object-contain mx-auto rounded-3xl"
            src={data?.[ids.heroImage] ? getImage(data[ids.heroImage]) : getImage("default/images/hero-placeholder.jpg")}
            onError={errorImage}
            alt="Hero visual"
          />
        </div>
        <div
          id={ids.headlineMain + "-wrapper"}
          className="flex-1 w-full md:w-1/2 order-2 md:order-2 flex flex-col items-start md:items-start text-left"
        >
          <span
            id={ids.brandBadge}
            className="dynamicStyle inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-4 bg-blue-500/10 text-blue-500 border border-blue-500/20"
            dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "CYBERPULSE" }}
          />
          <h1
            id={ids.headlineMain}
            className="dynamicStyle text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4"
            dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "REAL-TIME NEURAL SECURITY" }}
          />
          <h2
            id={ids.headlineSub}
            className="dynamicStyle text-xl md:text-2xl font-medium mb-6 text-gray-600 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Next-gen autonomous defense" }}
          />
          <p
            id={ids.description}
            className="dynamicStyle text-base md:text-lg mb-8 max-w-xl text-gray-600 dark:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "Stop zero-day attacks before they execute." }}
          />
          <div
            id={ids.statBadges}
            className="dynamicStyle flex flex-wrap gap-4 mb-8 w-full"
            role="list"
            aria-label="Key statistics"
          >
            {statBadgesArr.map((stat, index) => (
              <div
                key={index}
                id={stat.fieldId1}
                className="flex-1 min-w-[140px] bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-200 dark:border-gray-700"
                role="listitem"
              >
                <div
                  id={stat.fieldId1}
                  className="dynamicStyle text-3xl md:text-4xl font-extrabold text-blue-500 mb-1"
                  dangerouslySetInnerHTML={{ __html: data?.[stat.fieldId1] || stat.value }}
                />
                <div
                  id={stat.fieldId2}
                  className="dynamicStyle text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  dangerouslySetInnerHTML={{ __html: data?.[stat.fieldId2] || stat.label }}
                />
              </div>
            ))}
          </div>
          <Button
            id={ids.ctaButton}
            className="dynamicStyle w-full md:w-auto px-8 py-3.5 rounded-full font-bold"
            severity="danger"
            label={data?.[ids.ctaButton] || "START FREE TRIAL"}
            aria-label="Action button"
            onClick={() => {}}
          />
        </div>
      </div>
    </section>
  );
};

export default CustomSection;