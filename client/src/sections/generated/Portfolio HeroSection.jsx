import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from "../../features/cms/cmsSlice";
import { getSectionTextContrastClass } from "../../utils/sectionContrast";
import { getImage, errorImage } from "../../utils/getImage";

const ids = {
  heroImage: "2000000162",
  brandBadge: "2000000163",
  headlineMain: "2000000164",
  headlineSub: "2000000165",
  description: "2000000166",
  statBadges: "2000000167",
  ctaButton: "2000000168",
};

const DEFAULT_STAT_CARDS = [
  { fieldId1: "3000000133", fieldId2: "3000000134", label: "Projects", value: "50+" },
  { fieldId1: "3000000135", fieldId2: "3000000136", label: "Clients", value: "30+" },
  { fieldId1: "3000000137", fieldId2: "3000000138", label: "Years Exp", value: "5+" },
];

const PortfolioHero = ({ pageName = "Home" }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.cms?.allSections?.[pageName]);
  const cssData = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);
  const contrastClass = getSectionTextContrastClass("white");

  useEffect(() => {
    dispatch(fetchElementsByIds({
      elementIds: [
        ids.heroImage, ids.brandBadge, ids.headlineMain, ids.headlineSub,
        ids.description, ids.statBadges, ids.ctaButton,
        "3000000133", "3000000134", "3000000135",
        "3000000136", "3000000137", "3000000138",
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
    if (cssData) {
      Object.keys(cssData).forEach(key => {
        if (key.startsWith("TBD-cardField")) {
          const el = document.getElementById(key);
          if (el) el.style.cssText = cssData[key];
        }
      });
    }
  }, [cssData]);

  const statBadgesArr = Array.isArray(data?.[ids.statBadges]) && data[ids.statBadges].length > 0
    ? data[ids.statBadges]
    : DEFAULT_STAT_CARDS;

  return (
    <section
      id={ids.heroImage + "-section"}
      className={`relative max-w-[1920px] mx-auto px-4 md:px-8 py-16 md:py-24 bg-white ${contrastClass}`}
      aria-labelledby={ids.headlineMain}
    >
      <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
        <div id={ids.heroImage + "-wrapper"} className="flex-1 w-full md:w-1/2 order-1 md:order-1">
          <img
            id={ids.heroImage}
            className="dynamicStyle2 max-w-full max-h-[600px] h-auto object-contain mx-auto rounded-3xl shadow-xl"
            src={data?.[ids.heroImage] ? getImage(data[ids.heroImage]) : getImage("default/images/portfolio-hero.jpg")}
            onError={errorImage}
            alt="Portfolio showcase"
          />
        </div>
        <div id={ids.headlineMain + "-wrapper"} className="flex-1 w-full md:w-1/2 order-2 md:order-2 flex flex-col items-start md:items-start text-center md:text-left">
          <span
            id={ids.brandBadge}
            className="dynamicStyle inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 mb-6"
            dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "PORTFOLIO" }}
          />
          <h1
            id={ids.headlineMain}
            className="dynamicStyle text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
            dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "SHOWCASING MY WORK" }}
          />
          <h2
            id={ids.headlineSub}
            className="dynamicStyle text-xl md:text-2xl font-medium text-gray-600 mb-6"
            dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Creative Developer & Designer" }}
          />
          <p
            id={ids.description}
            className="dynamicStyle text-lg text-gray-600 mb-8 max-w-xl"
            dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "Explore my projects, skills, and experience in web development and design." }}
          />
          <div id={ids.statBadges + "-container"} className="flex flex-wrap justify-center md:justify-start gap-4 mb-8 w-full">
            {statBadgesArr.map((item, index) => (
              <div
                key={index}
                id={item.fieldId1}
                className="dynamicStyle flex flex-col items-center p-4 md:px-6 md:py-4 bg-gray-50 rounded-2xl min-w-[120px] border border-gray-100"
              >
                <span
                  id={item.fieldId2}
                  className="dynamicStyle text-3xl md:text-4xl font-bold text-blue-500"
                  dangerouslySetInnerHTML={{ __html: data?.[item.fieldId2] || item.value }}
                />
                <span
                  id={item.fieldId1 + "-label"}
                  className="dynamicStyle text-sm text-gray-600 mt-1"
                  dangerouslySetInnerHTML={{ __html: data?.[item.fieldId1] || item.label }}
                />
              </div>
            ))}
          </div>
          <Button
            id={ids.ctaButton}
            className="dynamicStyle w-full md:w-auto px-8 py-3.5 rounded-full font-bold"
            severity="secondary"
            label={data?.[ids.ctaButton] || "VIEW PROJECTS"}
            aria-label="View projects button"
            onClick={() => {}}
          />
        </div>
      </div>
    </section>
  );
};

export default PortfolioHero;