import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from "../../features/cms/cmsSlice";
import { getSectionTextContrastClass } from "../../utils/sectionContrast";
import { getImage, errorImage } from "../../utils/getImage";

const ids = {
  heroImage: "2000000169",
  brandBadge: "2000000170",
  headlineMain: "2000000171",
  headlineSub: "2000000172",
  description: "2000000173",
  statBadges: "2000000174",
  ctaButton: "2000000175",
};

const DEFAULT_STAT_CARDS = [
  { fieldId1: "3000000139", fieldId2: "3000000140", fieldId3: "3000000141" },
  { fieldId1: "3000000142", fieldId2: "3000000143", fieldId3: "3000000144" },
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
          "3000000139",
          "3000000140",
          "3000000141",
          "3000000142",
          "3000000143",
          "3000000144",
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
      id={ids.heroImage}
      className={`relative max-w-[1920px] mx-auto px-4 py-16 md:py-24 bg-white ${contrastClass}`}
      aria-labelledby={ids.headlineMain}
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

        <div className="dynamicStyle w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-2">
          <span
            id={ids.brandBadge}
            className="dynamicStyle inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-red-500/10 text-red-500 mb-6"
            dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "JAINN AI" }}
          />
          <h1
            id={ids.headlineMain}
            className="dynamicStyle text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
            dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "JAINN AI" }}
          />
          <h2
            id={ids.headlineSub}
            className="dynamicStyle text-xl md:text-2xl font-medium text-gray-600 dark:text-gray-300 mb-6"
            dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Your intelligent chatbot companion" }}
          />
          <p
            id={ids.description}
            className="dynamicStyle text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl"
            dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "Experience seamless conversations with dark and light mode toggle." }}
          />

          <div
            id={ids.statBadges}
            className="dynamicStyle flex flex-wrap justify-center md:justify-start gap-4 mb-8 w-full"
            role="list"
            aria-label="Statistics"
          >
            {statBadgesArr.map((item, index) => (
              <div
                key={index}
                id={item.fieldId1}
                className="dynamicStyle flex flex-col items-center p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 min-w-[120px] flex-1"
                role="listitem"
              >
                <span
                  id={item.fieldId2}
                  className="dynamicStyle text-3xl font-bold text-red-500 mb-1"
                  dangerouslySetInnerHTML={{ __html: data?.[item.fieldId2] || "99%" }}
                />
                <span
                  id={item.fieldId3}
                  className="dynamicStyle text-sm font-medium text-gray-600 dark:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: data?.[item.fieldId3] || "Stat label" }}
                />
              </div>
            ))}
          </div>

          <Button
            id={ids.ctaButton}
            className="dynamicStyle w-full md:w-auto px-8 py-3.5 rounded-full font-bold"
            severity="danger"
            label={data?.[ids.ctaButton] || "START CHATTING"}
            aria-label="Action button"
            onClick={() => {}}
          />
        </div>
      </div>
    </section>
  );
};

export default CustomSection;