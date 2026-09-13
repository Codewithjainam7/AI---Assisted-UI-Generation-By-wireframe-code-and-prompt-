import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from "../../features/cms/cmsSlice";
import { getSectionTextContrastClass } from "../../utils/sectionContrast";
import { getImage, errorImage } from "../../utils/getImage";

const ids = {
  heroImage: "2000000197",
  brandBadge: "2000000198",
  headlineMain: "2000000199",
  headlineSub: "2000000200",
  description: "2000000201",
  statBadges: "2000000202",
  ctaButton: "2000000203",
};

const DEFAULT_STAT_CARDS = [
  { fieldId1: "3000000157", fieldId2: "3000000158", field1: "100%", field2: "Responsive" },
  { fieldId1: "3000000159", fieldId2: "3000000160", field1: "0ms", field2: "Latency" },
  { fieldId1: "3000000161", fieldId2: "3000000162", field1: "React 18", field2: "Production Ready" },
];

const CustomSection = ({ pageName = "Home" }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.cms?.allSections?.[pageName]);
  const cssData = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);
  const contrastClass = getSectionTextContrastClass("dark");
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    dispatch(fetchElementsByIds({
      elementIds: [
        ids.heroImage, ids.brandBadge, ids.headlineMain, ids.headlineSub,
        ids.description, ids.statBadges, ids.ctaButton,
        "3000000157", "3000000158", "3000000159",
        "3000000160", "3000000161", "3000000162",
      ],
      pageName,
    }));
    return () => { isMounted.current = false; };
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
      id={ids.sectionWrapper}
      className={`relative w-full max-w-[1920px] mx-auto px-4 md:px-12 py-16 md:py-24 bg-gray-950 ${contrastClass}`}
      style={{ backgroundColor: "#030712" }}
    >
      <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
        <div id={ids.heroImage} className="dynamicStyle2 w-full md:w-1/2 flex justify-center order-2 md:order-1">
          <img
            id={ids.heroImage}
            className="dynamicStyle2 max-w-full max-h-[600px] h-auto object-contain mx-auto rounded-3xl"
            src={data?.[ids.heroImage] ? getImage(data[ids.heroImage]) : getImage("uploads/1789322832176-1789322832171-wireframe-example-plain.png")}
            onError={errorImage}
            alt="Hero visual"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-start md:items-start text-left order-1 md:order-2">
          <span
            id={ids.brandBadge}
            className="dynamicStyle inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider mb-6 bg-red-500/20 text-red-400 border border-red-500/30"
            dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "AI ASSISTED UI" }}
          />
          <h1
            id={ids.headlineMain}
            className="dynamicStyle text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4"
            dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "GENERATED FROM WIREFRAME" }}
          />
          <h2
            id={ids.headlineSub}
            className="dynamicStyle text-xl md:text-2xl font-medium text-gray-300 mb-6 max-w-xl"
            dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Engineered with Precision & Live CMS Bindings" }}
          />
          <p
            id={ids.description}
            className="dynamicStyle text-base md:text-lg text-gray-400 mb-8 max-w-xl leading-relaxed"
            dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "Your uploaded wireframe was successfully structured into an interactive React component." }}
          />
          <div id={ids.statBadges} className="dynamicStyle flex flex-wrap gap-4 mb-8 w-full">
            {statBadgesArr.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl backdrop-blur-sm"
              >
                <span
                  id={DEFAULT_STAT_CARDS[index]?.fieldId1}
                  className="dynamicStyle text-2xl font-bold text-red-500"
                  dangerouslySetInnerHTML={{ __html: badge?.field1 || DEFAULT_STAT_CARDS[index]?.field1 || "" }}
                />
                <span
                  id={DEFAULT_STAT_CARDS[index]?.fieldId2}
                  className="dynamicStyle text-sm font-medium text-gray-300"
                  dangerouslySetInnerHTML={{ __html: badge?.field2 || DEFAULT_STAT_CARDS[index]?.field2 || "" }}
                />
              </div>
            ))}
          </div>
          <Button
            id={ids.ctaButton}
            className="dynamicStyle w-full md:w-auto px-8 py-3.5 rounded-full font-bold"
            severity="danger"
            label={data?.[ids.ctaButton] || "GET STARTED"}
            aria-label="Action button"
            onClick={() => {}}
          />
        </div>
      </div>
    </section>
  );
};

export default CustomSection;