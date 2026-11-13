import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { fetchElementsByIds } from "../../features/cms/cmsSlice";
import { getSectionTextContrastClass } from "../../utils/sectionContrast";
import { getImage, errorImage } from "../../utils/getImage";

const ids = {
  // Hero section
  heroImage: "2000000420",
  brandBadge: "2000000421",
  headlineMain: "2000000422",
  headlineSub: "2000000423",
  description: "2000000424",
  ctaButton: "2000000426",
  // Navbar
  navbarLogo: "2000000427",
  navLink1: "2000000428", // Features
  navLink2: "2000000429", // Solutions
  navLink3: "2000000430", // Pricing
  navLink4: "2000000431", // About Us
  navbarSearchInput: "2000000432",
  // Content Blocks (Value Propositions)
  contentBlock1Title: "2000000433",
  contentBlock1Desc: "2000000434",
  contentBlock2Title: "2000000435",
  contentBlock2Desc: "2000000436",
  contentBlock3Title: "2000000437",
  contentBlock3Desc: "2000000438",
  // Below the Fold CTA
  belowFoldCtaHeadline: "2000000439",
  belowFoldCtaButton: "2000000440",
  belowFoldCtaSubtext: "2000000441",
  // Feature Cards (Stat Badges)
  statBadges: "2000000425", // Container ID for stat cards
  cardField1: "3000000259",
  cardField2: "3000000260",
  cardField3: "3000000261",
  cardField4: "3000000262",
  cardField5: "3000000263",
  cardField6: "3000000264",
  cardField7: "3000000265",
  cardField8: "3000000266",
  // Footer
  footerEmailInput: "2000000442",
  footerSignupButton: "2000000443",
  footerLink1: "2000000444", // About Us
  footerLink2: "2000000445", // Support
  footerLink3: "2000000446", // Legal
  socialLink1: "2000000447", // Email
  socialLink2: "2000000448", // LinkedIn
  socialLink3: "2000000449", // Instagram
  socialLink4: "2000000450", // Twitter
  socialLink5: "2000000451", // Facebook
};

const CustomSection = ({ pageName = "Home" }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.cms?.allSections?.[pageName]);
  const cssData = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);

  const themeAccent = "indigo-500"; // From ir.theme.accent

  const navbarLinks = [
    { text: "Features", id: ids.navLink1 },
    { text: "Solutions", id: ids.navLink2 },
    { text: "Pricing", id: ids.navLink3 },
    { text: "About Us", id: ids.navLink4 },
  ];

  const contentBlocks = [
    {
      titleId: ids.contentBlock1Title,
      titleDefault: "Scalable Architecture",
      descriptionId: ids.contentBlock1Desc,
      descriptionDefault: "Built on a robust, cloud-native infrastructure, our platform scales effortlessly with your business needs."
    },
    {
      titleId: ids.contentBlock2Title,
      titleDefault: "Intuitive Interface",
      descriptionId: ids.contentBlock2Desc,
      descriptionDefault: "Designed for clarity and ease of use, empowering your team to harness AI without complexity."
    },
    {
      titleId: ids.contentBlock3Title,
      titleDefault: "Secure & Compliant",
      descriptionId: ids.contentBlock3Desc,
      descriptionDefault: "Enterprise-grade security and strict compliance ensure your data is always protected."
    }
  ];

  const DEFAULT_STAT_CARDS = [
    { field1: "AI-Driven Insights", fieldType1: "Text", fieldId1: ids.cardField1, field2: "Gain deep, actionable insights from your data with advanced analytics and predictive modeling.", fieldType2: "Text", fieldId2: ids.cardField2 },
    { field1: "Automated Workflows", fieldType1: "Text", fieldId1: ids.cardField3, field2: "Streamline repetitive tasks and complex processes with intelligent automation tools.", fieldType2: "Text", fieldId2: ids.cardField4 },
    { field1: "Personalized Experiences", fieldType1: "Text", fieldId1: ids.cardField5, field2: "Deliver tailored content and services to your users with adaptive AI algorithms.", fieldType2: "Text", fieldId2: ids.cardField6 },
    { field1: "Real-time Collaboration", fieldType1: "Text", fieldId1: ids.cardField7, field2: "Enhance team productivity with shared workspaces and instant communication features.", fieldType2: "Text", fieldId2: ids.cardField8 }
  ];

  const footerLinks = [
    { text: "About Us", id: ids.footerLink1 },
    { text: "Support", id: ids.footerLink2 },
    { text: "Legal", id: ids.footerLink3 },
  ];

  const socialLinks = [
    { icon: "pi pi-envelope", id: ids.socialLink1 },
    { icon: "pi pi-linkedin", id: ids.socialLink2 },
    { icon: "pi pi-instagram", id: ids.socialLink3 },
    { icon: "pi pi-twitter", id: ids.socialLink4 },
    { icon: "pi pi-facebook", id: ids.socialLink5 },
  ];

  useEffect(() => {
    const allElementIds = [
      ...Object.values(ids),
      // Individual card fields for statBadges (already included via DEFAULT_STAT_CARDS and explicit ids)
      // Individual content block fields (already included via contentBlocks and explicit ids)
      // Navbar links, footer links, social links (already included via their arrays and explicit ids)
    ];
    dispatch(fetchElementsByIds({
      elementIds: allElementIds.filter(id => id && id !== ids.statBadges), // Filter out container ID for direct fetch
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

  const statBadgesArr = Array.isArray(data?.[ids.statBadges]) && data[ids.statBadges].length > 0
    ? data[ids.statBadges]
    : DEFAULT_STAT_CARDS;

  return (
    <div className="w-full overflow-x-hidden min-h-screen bg-zinc-950 text-gray-100 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-zinc-950/90 backdrop-blur-md shadow-lg h-14 sm:h-16 flex items-center justify-between px-4 sm:px-6 lg:px-16 border-b border-zinc-800">
        <div className="flex items-center gap-6">
          <a href="#" className="flex-shrink-0 text-xl sm:text-2xl font-black text-gray-100" id={ids.navbarLogo}>
            <span dangerouslySetInnerHTML={{ __html: data?.[ids.navbarLogo] || "InnovateAI" }} className="dynamicStyle"></span>
          </a>
          <div className="hidden sm:flex items-center gap-6 lg:gap-8">
            {navbarLinks.map((link) => (
              <a key={link.id} href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors" id={link.id}>
                <span dangerouslySetInnerHTML={{ __html: data?.[link.id] || link.text }} className="dynamicStyle"></span>
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="p-input-icon-left hidden sm:block">
            <i className="pi pi-search text-gray-400" />
            <InputText id={ids.navbarSearchInput} className="dynamicStyle w-32 sm:w-48 bg-zinc-800 text-gray-100 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder={data?.[ids.navbarSearchInput] || "Search..."} />
          </span>
          <Button icon="pi pi-bars" className="p-button-rounded p-button-text p-button-sm text-gray-100 sm:hidden" aria-label="Menu" />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-3 sm:px-8 lg:px-16 py-12 sm:py-16 lg:py-24 max-w-[1920px] mx-auto text-center flex flex-col items-center justify-center gap-8 lg:gap-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 opacity-60"></div>
        <div className="relative z-10 flex flex-col items-center gap-6 lg:gap-8 max-w-4xl">
          <span id={ids.brandBadge} className={`dynamicStyle inline-flex items-center rounded-full bg-${themeAccent}/20 px-4 py-1.5 text-xs sm:text-sm font-semibold text-${themeAccent} shadow-inner`}>
            <span dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "AI STUDIO" }}></span>
          </span>
          <h1 id={ids.headlineMain} className="dynamicStyle text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-black break-words tracking-tight text-white leading-tight">
            <span dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "Unlock the Power of Intelligent Automation" }}></span>
          </h1>
          <h2 id={ids.headlineSub} className="dynamicStyle text-lg sm:text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Revolutionize your workflows with cutting-edge AI-powered solutions designed for efficiency and growth." }}></span>
          </h2>
          <p id={ids.description} className="dynamicStyle text-sm sm:text-base text-gray-400 max-w-xl">
            <span dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "Our platform seamlessly integrates advanced machine learning and intuitive design, enabling businesses to achieve unprecedented levels of productivity and innovation. Experience the future of work today." }}></span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Button id={ids.ctaButton} className={`dynamicStyle w-full sm:w-auto px-8 py-3.5 rounded-full font-bold bg-${themeAccent} hover:bg-${themeAccent}/80 text-white shadow-lg transition-all duration-300 ease-in-out`} severity="danger" label={data?.[ids.ctaButton] || "Get Started Free"} aria-label="Get Started Free" onClick={() => {}} />
            <Button className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-gray-200 border border-zinc-600 hover:border-zinc-500 hover:bg-zinc-800 transition-all duration-300 ease-in-out" label="Learn More" outlined aria-label="Learn More" onClick={() => {}} />
          </div>
        </div>
        <div className="relative w-full max-w-5xl mt-10 md:mt-16 z-10">
          <img id={ids.heroImage} className="dynamicStyle2 w-full h-auto object-cover rounded-3xl shadow-2xl border border-zinc-700"
            src={data?.[ids.heroImage] ? getImage(data[ids.heroImage]) : getImage("https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80")}
            onError={errorImage}
            alt="AI-powered solutions dashboard"
          />
        </div>
      </section>

      {/* Content Blocks (Value Propositions) */}
      <section className="px-3 sm:px-8 lg:px-16 py-12 sm:py-16 lg:py-24 max-w-[1920px] mx-auto bg-zinc-900 border-t border-b border-zinc-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contentBlocks.map((block, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl bg-zinc-800/60 border border-zinc-700 backdrop-blur-sm shadow-xl">
              <i className={`pi pi-${index === 0 ? "cloud" : index === 1 ? "compass" : "lock"} text-4xl text-${themeAccent} mb-4`}></i>
              <h3 id={block.titleId} className="dynamicStyle text-xl sm:text-2xl font-bold text-white mb-3">
                <span dangerouslySetInnerHTML={{ __html: data?.[block.titleId] || block.titleDefault }}></span>
              </h3>
              <p id={block.descriptionId} className="dynamicStyle text-gray-300 text-sm sm:text-base">
                <span dangerouslySetInnerHTML={{ __html: data?.[block.descriptionId] || block.descriptionDefault }}></span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Below the Fold CTA */}
      <section className="px-3 sm:px-8 lg:px-16 py-10 sm:py-12 max-w-[1920px] mx-auto bg-gradient-to-br from-zinc-800 to-zinc-900 flex flex-col md:flex-row items-center justify-between gap-6 rounded-b-3xl">
        <div className="flex flex-col text-center md:text-left">
          <h2 id={ids.belowFoldCtaHeadline} className="dynamicStyle text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
            <span dangerouslySetInnerHTML={{ __html: data?.[ids.belowFoldCtaHeadline] || "Ready to elevate your business with AI?" }}></span>
          </h2>
          <p id={ids.belowFoldCtaSubtext} className="dynamicStyle text-sm text-gray-300">
            <span dangerouslySetInnerHTML={{ __html: data?.[ids.belowFoldCtaSubtext] || "No credit card required • Instant access" }}></span>
          </p>
        </div>
        <Button id={ids.belowFoldCtaButton} className={`dynamicStyle w-full md:w-auto px-8 py-3.5 rounded-full font-bold bg-${themeAccent} hover:bg-${themeAccent}/80 text-white shadow-lg transition-all duration-300 ease-in-out`} label={data?.[ids.belowFoldCtaButton] || "Start Free Trial"} aria-label="Start Free Trial" onClick={() => {}} />
      </section>

      {/* Feature Cards / Stat Badges */}
      <section className="px-3 sm:px-8 lg:px-16 py-12 sm:py-16 lg:py-24 max-w-[1920px] mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-12">Key Features</h2>
        <div id={ids.statBadges} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statBadgesArr.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl bg-zinc-800/60 border border-zinc-700 backdrop-blur-sm shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center rounded-full mb-6 bg-zinc-700/50 border border-zinc-600 overflow-hidden">
                <img className="dynamicStyle2 absolute inset-0 w-full h-full object-cover opacity-20" src={getImage("https://via.placeholder.com/150/0f172a/60a5fa?text=%2B")} onError={errorImage} alt="Feature visual" />
                <i className={`pi pi-${index === 0 ? "chart-line" : index === 1 ? "sync" : index === 2 ? "user-plus" : "comments"} text-4xl text-${themeAccent} relative z-10`}></i>
              </div>
              <h3 id={item.fieldId1} className="dynamicStyle text-xl sm:text-2xl font-extrabold text-white mb-2 leading-tight">
                <span dangerouslySetInnerHTML={{ __html: data?.[item.fieldId1] || item.field1 }}></span>
              </h3>
              <p id={item.fieldId2} className="dynamicStyle text-sm sm:text-base text-gray-300">
                <span dangerouslySetInnerHTML={{ __html: data?.[item.fieldId2] || item.field2 }}></span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-zinc-900 border-t border-zinc-800 px-3 sm:px-8 lg:px-16 py-8 sm:py-10 max-w-[1920px] mx-auto text-gray-400">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 mb-8 pb-8 border-b border-zinc-800">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
            <span id={ids.navbarLogo} className="dynamicStyle text-xl sm:text-2xl font-black text-gray-100 mb-2">
              <span dangerouslySetInnerHTML={{ __html: data?.[ids.navbarLogo] || "InnovateAI" }}></span>
            </span>
            <p className="text-sm">Revolutionizing workflows with AI.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <span className="p-input-icon-left w-full sm:w-auto">
              <i className="pi pi-envelope text-gray-400" />
              <InputText id={ids.footerEmailInput} className="dynamicStyle w-full bg-zinc-800 text-gray-100 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder={data?.[ids.footerEmailInput] || "Email address field"} />
            </span>
            <Button id={ids.footerSignupButton} className={`dynamicStyle w-full sm:w-auto px-6 py-2 rounded-lg font-semibold bg-${themeAccent} hover:bg-${themeAccent}/80 text-white transition-colors`} label={data?.[ids.footerSignupButton] || "Sign up CTA button"} aria-label="Sign up for updates" onClick={() => {}} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-center sm:text-left">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {footerLinks.map((link) => (
              <a key={link.id} href="#" className="hover:text-white transition-colors" id={link.id}>
                <span dangerouslySetInnerHTML={{ __html: data?.[link.id] || link.text }} className="dynamicStyle"></span>
              </a>
            ))}
          </div>
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a key={social.id} href="#" className="text-xl hover:text-white transition-colors" aria-label={social.icon.split('-')[1]} id={social.id}>
                <i className={`${social.icon} dynamicStyle`}></i>
              </a>
            ))}
          </div>
        </div>
        <p className="text-center text-xs mt-8">&copy; 2023 InnovateAI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CustomSection;