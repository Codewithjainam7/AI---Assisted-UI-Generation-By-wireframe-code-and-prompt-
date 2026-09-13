import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from "../../features/cms/cmsSlice";
import { getSectionTextContrastClass } from "../../utils/sectionContrast";
import { getImage, errorImage } from "../../utils/getImage";

const ids = {
  heroImage: "2000000183",
  brandBadge: "2000000184",
  headlineMain: "2000000185",
  headlineSub: "2000000186",
  description: "2000000187",
  statBadges: "2000000188",
  ctaButton: "2000000189",
};

const DEFAULT_STAT_CARDS = [
  { fieldId1: "TBD-cardField1", fieldId2: "TBD-cardField2", fieldId3: "TBD-cardField3" },
  { fieldId1: "TBD-cardField4", fieldId2: "TBD-cardField5", fieldId3: "TBD-cardField6" },
];

const CustomSection = ({ pageName = "Home" }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.cms?.allSections?.[pageName]);
  const cssData = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);
  const contrastClass = getSectionTextContrastClass("dark");
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      dispatch(
        fetchElementsByIds({
          elementIds: [
            ids.heroImage,
            ids.brandBadge,
            ids.headlineMain,
            ids.headlineSub,
            ids.description,
            ids.statBadges,
            ids.ctaButton,
            "TBD-cardField1",
            "TBD-cardField2",
            "TBD-cardField3",
            "TBD-cardField4",
            "TBD-cardField5",
            "TBD-cardField6",
          ],
          pageName,
        })
      );
    }
  }, [dispatch, pageName]);

  useEffect(() => {
    Object.values(ids).forEach((id) => {
      if (id && cssData?.[id]) {
        const el = document.getElementById(id);
        if (el) el.style.cssText = cssData[id];
      }
    });
    DEFAULT_STAT_CARDS.forEach((card) => {
      Object.values(card).forEach((fieldId) => {
        if (cssData?.[fieldId]) {
          const el = document.getElementById(fieldId);
          if (el) el.style.cssText = cssData[fieldId];
        }
      });
    });
  }, [cssData]);

  const statBadgesArr =
    Array.isArray(data?.[ids.statBadges]) && data[ids.statBadges].length > 0
      ? data[ids.statBadges]
      : DEFAULT_STAT_CARDS;

  return (
    <section
      id={ids.sectionWrapper}
      className={`relative w-full max-w-[1920px] mx-auto px-4 md:px-12 py-16 md:py-24 bg-gray-950 ${contrastClass}`}
      style={{ backgroundColor: "#030712" }}
    >
      <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
        <div
          id={ids.heroImage}
          className="dynamicStyle2 w-full md:w-1/2 flex justify-center order-1 md:order-1"
        >
          <img
            id={ids.heroImage}
            className="dynamicStyle2 max-w-full max-h-[600px] h-auto object-contain mx-auto rounded-3xl"
            src={data?.[ids.heroImage] ? getImage(data[ids.heroImage]) : getImage("default/images/hero-placeholder.jpg")}
            onError={errorImage}
            alt="Hero visual"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-start md:items-start text-left order-2 md:order-2">
          <span
            id={ids.brandBadge}
            className="dynamicStyle inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-6 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "AI STUDIO" }}
          />

          <h1
            id={ids.headlineMain}
            className="dynamicStyle text-5xl md:text-7xl font-extrabold leading-tight mb-4 tracking-tight text-white"
            dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "SmartLot" }}
          />

          <h2
            id={ids.headlineSub}
            className="dynamicStyle text-xl md:text-2xl font-medium mb-8 text-emerald-300 tracking-wider"
            dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "MANAGE BETTER • BUILD STRONGER • LIVE CONNECTED" }}
          />

          <p
            id={ids.description}
            className="dynamicStyle text-lg md:text-xl text-gray-300 mb-10 max-w-xl leading-relaxed"
            dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "Built with automated CMS bindings, responsive layout system, and modern iOS-inspired aesthetics." }}
          />

          {statBadgesArr.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-10 w-full">
              {statBadgesArr.map((badge, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 px-5 py-3 bg-gray-900/80 border border-gray-700 rounded-xl backdrop-blur-sm"
                >
                  <span
                    id={badge.fieldId1}
                    className="dynamicStyle text-2xl font-bold text-emerald-400"
                    dangerouslySetInnerHTML={{ __html: data?.[badge.fieldId1] || "99%" }}
                  />
                  <div className="flex flex-col">
                    <span
                      id={badge.fieldId2}
                      className="dynamicStyle text-sm font-semibold text-white"
                      dangerouslySetInnerHTML={{ __html: data?.[badge.fieldId2] || "Uptime" }}
                    />
                    <span
                      id={badge.fieldId3}
                      className="dynamicStyle text-xs text-gray-400"
                      dangerouslySetInnerHTML={{ __html: data?.[badge.fieldId3] || "Guaranteed SLA" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button
            id={ids.ctaButton}
            className="dynamicStyle w-full md:w-auto px-8 py-3.5 rounded-full font-bold text-lg"
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