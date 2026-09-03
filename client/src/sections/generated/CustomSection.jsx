import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from "../../features/cms/cmsSlice";
import { getSectionTextContrastClass } from "../../utils/sectionContrast";
import { getImage, errorImage } from "../../utils/getImage";

const ids = {
  heroImage: "2000000148",
  brandBadge: "2000000149",
  headlineMain: "2000000150",
  headlineSub: "2000000151",
  description: "2000000152",
  statBadges: "2000000153",
  ctaButton: "2000000154",
};

const DEFAULT_STAT_CARDS = [
  { fieldId1: "3000000127", fieldId2: "3000000128", fieldId3: "3000000129" },
  { fieldId1: "3000000130", fieldId2: "3000000131", fieldId3: "3000000132" },
  { fieldId1: "TBD-cardField7", fieldId2: "TBD-cardField8", fieldId3: "TBD-cardField9" },
];

const CustomSection = ({ pageName = "Home" }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.cms?.allSections?.[pageName]);
  const cssData = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);
  const contrastClass = getSectionTextContrastClass("white");

  useEffect(() => {
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
          "3000000127",
          "3000000128",
          "3000000129",
          "3000000130",
          "3000000131",
          "3000000132",
          "TBD-cardField7",
          "TBD-cardField8",
          "TBD-cardField9",
        ],
        pageName,
      })
    );
  }, [dispatch, pageName]);

  useEffect(() => {
    Object.values(ids).forEach((id) => {
      if (id && cssData?.[id]) {
        const el = document.getElementById(id);
        if (el) el.style.cssText = cssData[id];
      }
    });
    if (cssData) {
      Object.keys(cssData).forEach((key) => {
        if (key.startsWith("TBD-cardField")) {
          const el = document.getElementById(key);
          if (el) el.style.cssText = cssData[key];
        }
      });
    }
  }, [cssData]);

  const statBadgesArr =
    Array.isArray(data?.[ids.statBadges]) && data[ids.statBadges].length > 0
      ? data[ids.statBadges]
      : DEFAULT_STAT_CARDS;

  return (
    <section
      id={ids.heroImage + "-section"}
      className={`relative w-full max-w-[1920px] mx-auto px-4 md:px-12 py-16 md:py-24 bg-white ${contrastClass}`}
      style={{ backgroundColor: "white", color: "#1f2937" }}
    >
      <div
        className={`flex flex-col ${"md:flex-row"} items-center gap-12 md:gap-16`}
        style={{ flexDirection: "row" }}
      >
        <div
          id={ids.heroImage + "-container"}
          className={`relative w-full ${"md:w-1/2"} flex justify-center items-center order-1 ${"md:order-1"}`}
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
          id={ids.headlineMain + "-container"}
          className={`w-full ${"md:w-1/2"} flex flex-col items-start text-center md:text-left order-2 ${"md:order-2"}`}
        >
          <span
            id={ids.brandBadge}
            className="dynamicStyle inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4"
            style={{ backgroundColor: "#3b82f6", color: "white" }}
            dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "CYBERGUARD" }}
          />
          <h1
            id={ids.headlineMain}
            className="dynamicStyle text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
            dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "ZERO TRUST CLOUD SECURITY" }}
          />
          <h2
            id={ids.headlineSub}
            className="dynamicStyle text-xl md:text-2xl font-medium mb-6"
            style={{ color: "#3b82f6" }}
            dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "AI-powered threat detection at scale" }}
          />
          <p
            id={ids.description}
            className="dynamicStyle text-lg md:text-xl mb-8 max-w-xl"
            style={{ color: "#4b5563" }}
            dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "Protect your multi-cloud infrastructure with autonomous response" }}
          />

          <div
            id={ids.statBadges + "-container"}
            className="flex flex-wrap justify-center md:justify-start gap-4 mb-8 w-full"
          >
            {statBadgesArr.map((item, index) => (
              <div
                key={index}
                id={item.fieldId1}
                className="dynamicStyle flex flex-col items-center p-4 rounded-2xl min-w-[140px]"
                style={{ backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb" }}
              >
                <span
                  id={item.fieldId1}
                  className="dynamicStyle text-3xl font-bold mb-1"
                  style={{ color: "#3b82f6" }}
                  dangerouslySetInnerHTML={{ __html: data?.[item.fieldId1] || (index === 0 ? "99.9%" : index === 1 ? "<1s" : "24/7") }}
                />
                <span
                  id={item.fieldId2}
                  className="dynamicStyle text-sm font-medium text-center"
                  dangerouslySetInnerHTML={{ __html: data?.[item.fieldId2] || (index === 0 ? "Uptime SLA" : index === 1 ? "Response Time" : "Monitoring") }}
                />
                <span
                  id={item.fieldId3}
                  className="dynamicStyle text-xs text-gray-500 mt-1"
                  dangerouslySetInnerHTML={{ __html: data?.[item.fieldId3] || "Industry leading" }}
                />
              </div>
            ))}
          </div>

          <Button
            id={ids.ctaButton}
            className="dynamicStyle w-full md:w-auto px-8 py-3.5 rounded-full font-bold"
            severity="danger"
            label={data?.[ids.ctaButton] || "SECURE YOUR CLOUD"}
            aria-label="Action button"
            onClick={() => {}}
          />
        </div>
      </div>
    </section>
  );
};

export default CustomSection;