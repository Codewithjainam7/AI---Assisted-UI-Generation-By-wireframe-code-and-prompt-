import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from "../../features/cms/cmsSlice";
import { getSectionTextContrastClass } from "../../utils/sectionContrast";
import { getImage, errorImage } from "../../utils/getImage";

const ids = {
  heroImage: "2000000323",
  brandBadge: "2000000324",
  headlineMain: "2000000325",
  headlineSub: "2000000326",
  description: "2000000327",
  statBadges: "2000000328",
  ctaButton: "2000000329",
  // Stat card field IDs
  cardField1: "3000000225",
  cardField2: "3000000226",
  cardField3: "3000000227",
  cardField4: "3000000228",
  cardField5: "3000000229",
  cardField6: "3000000230",
};

const DEFAULT_STAT_CARDS = [
  { field1: "99.9%", fieldType1: "Text", fieldId1: ids.cardField1, field2: "Uptime", fieldType2: "Text", fieldId2: ids.cardField2 },
  { field1: "24/7", fieldType1: "Text", fieldId1: ids.cardField3, field2: "Support", fieldType2: "Text", fieldId2: ids.cardField4 },
  { field1: "100K+", fieldType1: "Text", fieldId1: ids.cardField5, field2: "Secured Endpoints", fieldType2: "Text", fieldId2: ids.cardField6 }
];

const CustomSection = ({ pageName = "Home" }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.cms?.allSections?.[pageName]);
  const cssData = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);

  useEffect(() => {
    dispatch(fetchElementsByIds({
      elementIds: [
        ids.heroImage, ids.brandBadge, ids.headlineMain, ids.headlineSub,
        ids.description, ids.statBadges, ids.ctaButton,
        ids.cardField1, ids.cardField2, ids.cardField3,
        ids.cardField4, ids.cardField5, ids.cardField6,
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
  }, [cssData]);

  const statBadgesArr = Array.isArray(data?.[ids.statBadges]) && data[ids.statBadges].length > 0 ? data[ids.statBadges] : DEFAULT_STAT_CARDS;

  return (
    <div className="w-full overflow-x-hidden bg-zinc-950 text-white min-h-screen flex items-center">
      <div className="px-3 sm:px-8 lg:px-16 py-6 sm:py-8 lg:py-12 max-w-[1920px] mx-auto w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-16">
          {/* Left Column - Image */}
          <div className="md:w-1/2 w-full flex justify-center order-first md:order-first">
            <img
              id={ids.heroImage}
              className="dynamicStyle2 w-full max-w-md md:max-w-full lg:max-w-xl h-auto object-cover rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out"
              src={data?.[ids.heroImage] ? getImage(data[ids.heroImage]) : getImage("https://images.unsplash.com/photo-1596558450125-961e155c0a37?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")}
              onError={errorImage}
              alt="AI cybersecurity hero visual"
            />
          </div>

          {/* Right Column - Content */}
          <div className="md:w-1/2 w-full flex flex-col justify-center text-center md:text-left gap-5 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8 bg-white/5 backdrop-blur-lg rounded-3xl shadow-xl border border-white/10 order-last md:order-last">
            {/* Brand Badge */}
            <div className="inline-flex self-center md:self-start items-center gap-2 bg-gradient-to-r from-gray-700 to-zinc-600 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full mb-2">
              <i className="pi pi-shield text-base text-cyan-400"></i>
              <span id={ids.brandBadge} className="dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "CYBERPULSE" }}></span>
            </div>

            {/* Main Headline */}
            <h1 id={ids.headlineMain} className="dynamicStyle text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-black break-words tracking-tight leading-tight text-white" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "ZERO TRUST CLOUD SECURITY" }}></h1>

            {/* Sub Headline */}
            <p id={ids.headlineSub} className="dynamicStyle text-lg sm:text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto md:mx-0" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Protect your multi-cloud infrastructure with autonomous AI agents." }}></p>

            {/* Description (from IR, even if it feels a bit off for cybersecurity) */}
            <p id={ids.description} className="dynamicStyle text-sm sm:text-base text-gray-400 max-w-xl mx-auto md:mx-0" dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "Join trainer-led workout sessions." }}></p>

            {/* Stat Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 my-4">
              {statBadgesArr.map((item, index) => (
                <div key={index} className="p-2 sm:p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center text-center">
                  <div id={item.fieldId1} className="dynamicStyle text-xs sm:text-sm font-extrabold text-white" dangerouslySetInnerHTML={{ __html: data?.[item.fieldId1] || item.field1 }}></div>
                  <div id={item.fieldId2} className="dynamicStyle text-[9px] sm:text-[10px] text-gray-400 mt-1" dangerouslySetInnerHTML={{ __html: data?.[item.fieldId2] || item.field2 }}></div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex justify-center md:justify-start">
              <Button
                id={ids.ctaButton}
                className="dynamicStyle w-full md:w-auto px-8 py-3.5 rounded-full font-bold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-cyan-500 text-white border-none"
                label={data?.[ids.ctaButton] || "START FREE TRIAL"}
                aria-label="Action button"
                onClick={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomSection;