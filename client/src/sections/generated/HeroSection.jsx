import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from "../../features/cms/cmsSlice";
import { getSectionTextContrastClass } from "../../utils/sectionContrast";
import { getImage, errorImage } from "../../utils/getImage";

const CustomSection = ({ pageName = "Home" }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.cms?.allSections?.[pageName]);
  const cssData = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);

  const ir = {
    "sectionType": "app-landing",
    "sectionName": "Custom",
    "domain": "saas-ai",
    "platform": "Website",
    "layout": {
      "direction": "column",
      "breakpoint": "md",
      "columns": 4,
      "mediaPosition": "none",
      "hasNavbar": true,
      "hasSearchOrForm": true
    },
    "theme": {
      "accent": "blue-500",
      "surface": "light",
      "text": "gray-900"
    },
    "navbar": {
      "logoText": "InnovateAI",
      "links": [
        "Solutions",
        "Features",
        "Pricing",
        "About Us"
      ]
    },
    "imageConcept": "A large, abstract representation of interconnected data networks or a futuristic AI interface for the hero section. Four smaller, distinct icons or simple illustrations representing each feature card's concept, such as a brain icon for AI, a gear for automation, a chart for analytics, and people for collaboration.",
    "contentBlocks": [
      {
        "title": "Intuitive Development",
        "description": "Streamline your workflow with an easy-to-use interface and powerful IDE integrations."
      },
      {
        "title": "Robust API Access",
        "description": "Integrate seamlessly with your existing systems using our well-documented and flexible APIs."
      },
      {
        "title": "Comprehensive Support",
        "description": "Access 24/7 expert support and a thriving community for all your development needs."
      }
    ],
    "featureCards": [
      {
        "title": "AI Model Training",
        "description": "Train custom machine learning models with various algorithms and datasets in a scalable environment."
      },
      {
        "title": "Automated Deployment",
        "description": "Effortlessly deploy your AI applications to production with integrated CI/CD pipelines."
      },
      {
        "title": "Real-time Analytics",
        "description": "Monitor performance and gain insights into your AI models with real-time data and dashboards."
      },
      {
        "title": "Collaborative Workspace",
        "description": "Foster team productivity with shared projects, version control, and access management."
      }
    ],
    "ctaBlocks": [
      {
        "headline": "Ready to transform your AI projects?",
        "buttonText": "Sign Up Now",
        "subtext": "No credit card required. Start building today!"
      }
    ],
    "footer": {
      "hasEmailSignup": true,
      "emailPlaceholder": "Enter your email address",
      "signupButtonText": "Subscribe",
      "links": [
        "About Us",
        "Careers",
        "Privacy Policy"
      ],
      "socials": [
        "Email",
        "LinkedIn",
        "Instagram",
        "Twitter",
        "Facebook"
      ]
    },
    "elements": [
      {
        "elementName": "heroImage",
        "contentType": "Image",
        "defaultContent": "https://images.unsplash.com/photo-1579782522030-ff6778648873?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTQzODd8MHwxfHNlYXJjaHw1fHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlfGVufDB8fHx8MTcwMTI3NjE5Mnww&ixlib=rb-4.0.3&q=80&w=1080",
        "fieldId": "2000000354",
        "position": "none",
        "concept": "A large, abstract representation of interconnected data networks or a futuristic AI interface for the hero section. Four smaller, distinct icons or simple illustrations representing each feature card's concept, such as a brain icon for AI, a gear for automation, a chart for analytics, and people for collaboration."
      },
      {
        "elementName": "brandBadge",
        "contentType": "Text",
        "defaultContent": "AI STUDIO",
        "fieldId": "2000000355"
      },
      {
        "elementName": "headlineMain",
        "contentType": "Text",
        "defaultContent": "Unlock the Future of AI Development",
        "fieldId": "2000000356"
      },
      {
        "elementName": "headlineSub",
        "contentType": "Text",
        "defaultContent": "Build, deploy, and scale intelligent applications with unprecedented speed and precision.",
        "fieldId": "2000000357"
      },
      {
        "elementName": "description",
        "contentType": "Textfield",
        "defaultContent": "Our cutting-edge platform provides a comprehensive suite of tools for data scientists, developers, and enterprises to innovate faster and bring their AI visions to life.",
        "fieldId": "2000000358"
      },
      {
        "elementName": "statBadges",
        "contentType": "Cards",
        "defaultContent": "",
        "fieldId": "2000000359",
        "statCount": 4,
        "statCards": [
          {
            "field1": "AI Model Training",
            "field2": "AI Model Training"
          },
          {
            "field1": "Automated Deployment",
            "field2": "Automated Deployment"
          },
          {
            "field1": "Real-time Analytics",
            "field2": "Real-time Analytics"
          },
          {
            "field1": "Collaborative Workspace",
            "field2": "Collaborative Workspace"
          }
        ]
      },
      {
        "elementName": "ctaButton",
        "contentType": "Button",
        "defaultContent": "Get Started Free",
        "fieldId": "2000000360"
      }
    ],
    "secondaryButton": "Explore Features",
    "inputPlaceholder": "Search products...",
    "pageName": "Home"
  };

  const ids = {
    heroImage: "2000000354",
    brandBadge: "2000000355",
    headlineMain: "2000000356",
    headlineSub: "2000000357",
    description: "2000000358",
    statBadges: "2000000359",
    ctaButton: "2000000360",
    // Navbar
    navbarLogo: "2000000361",
    navbarLink1: "2000000362-solutions",
    navbarLink2: "2000000363-features",
    navbarLink3: "2000000364-pricing",
    navbarLink4: "2000000365-aboutUs",
    // Secondary CTA
    secondaryCtaButton: "2000000366",
    // Content Blocks
    contentBlock1Title: "2000000367-1-title",
    contentBlock1Description: "2000000368-1-description",
    contentBlock2Title: "2000000369-2-title",
    contentBlock2Description: "2000000370-2-description",
    contentBlock3Title: "2000000371-3-title",
    contentBlock3Description: "2000000372-3-description",
    // Below-the-fold CTA
    ctaBlockHeadline: "2000000373-headline",
    ctaBlockButtonText: "2000000374-buttonText",
    ctaBlockSubtext: "2000000375-subtext",
    // Footer
    footerEmailInput: "2000000376",
    footerSubscribeButton: "2000000377",
    footerLink1: "2000000378-aboutUs",
    footerLink2: "2000000379-careers",
    footerLink3: "2000000380-privacyPolicy",
    footerSocial1: "2000000381-email",
    footerSocial2: "2000000382-linkedin",
    footerSocial3: "2000000383-instagram",
    footerSocial4: "2000000384-twitter",
    footerSocial5: "2000000385-facebook",
  };

  const accentColor = ir.theme.accent;
  const surfaceColor = ir.theme.surface === 'dark' ? 'zinc-900' : 'white';
  const contrastClass = getSectionTextContrastClass(surfaceColor);

  const DEFAULT_STAT_CARDS = ir.featureCards.map((card, index) => ({
    field1: card.title,
    fieldType1: "Text",
    fieldId1: `2000000386-${index + 1}-title`,
    field2: card.description,
    fieldType2: "Text",
    fieldId2: `2000000387-${index + 1}-description`,
  }));

  const statBadgesArr = Array.isArray(data?.[ids.statBadges]) && data[ids.statBadges].length > 0
    ? data[ids.statBadges]
    : DEFAULT_STAT_CARDS;

  // Combine all fieldIds for dispatch
  const allElementIds = [
    ...Object.values(ids),
    // Dynamically add fieldIds for stat cards
    ...DEFAULT_STAT_CARDS.flatMap(card => [card.fieldId1, card.fieldId2]),
    // Additional IDs for dynamic content
    ...ir.navbar.links.map((_, i) => ids[`navbarLink${i + 1}`]),
    ...ir.contentBlocks.flatMap((_, i) => [ids[`contentBlock${i + 1}Title`], ids[`contentBlock${i + 1}Description`]]),
    ...ir.footer.links.map((_, i) => ids[`footerLink${i + 1}`]),
    ...ir.footer.socials.map((_, i) => ids[`footerSocial${i + 1}`]),
  ];

  useEffect(() => {
    dispatch(fetchElementsByIds({
      elementIds: allElementIds,
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
    // Apply for stat card fields too
    DEFAULT_STAT_CARDS.forEach(card => {
      if (cssData?.[card.fieldId1]) {
        const el = document.getElementById(card.fieldId1);
        if (el) el.style.cssText = cssData[card.fieldId1];
      }
      if (cssData?.[card.fieldId2]) {
        const el = document.getElementById(card.fieldId2);
        if (el) el.style.cssText = cssData[card.fieldId2];
      }
    });
  }, [cssData]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={`w-full overflow-x-hidden min-h-screen bg-zinc-950 ${contrastClass}`}>
      {/* Sticky Navbar (R11h) */}
      <nav className={`sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md h-14 sm:h-16 shadow-lg border-b border-zinc-800 px-4 sm:px-6 lg:px-16 flex items-center justify-between`}>
        <div className="flex items-center gap-6">
          <a href="#" className={`text-xl sm:text-2xl font-bold text-${accentColor}`} id={ids.navbarLogo} dangerouslySetInnerHTML={{ __html: data?.[ids.navbarLogo] || ir.navbar.logoText }}></a>
          <ul className="hidden lg:flex items-center gap-6">
            {ir.navbar.links.map((link, index) => (
              <li key={index}>
                <a href="#" id={ids[`navbarLink${index + 1}`]} className={`text-zinc-300 hover:text-${accentColor} transition-colors dynamicStyle`} dangerouslySetInnerHTML={{ __html: data?.[ids[`navbarLink${index + 1}`]] || link }}></a>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <input
            type="text"
            placeholder={ir.inputPlaceholder || "Search..."}
            className="hidden sm:block px-4 py-2 bg-zinc-800 text-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 w-48"
          />
          <Button label="Login" className="p-button-text text-zinc-200 hover:text-white" />
          <Button id={ids.ctaButton} className={`dynamicStyle px-5 py-2 rounded-full font-semibold text-white bg-${accentColor} hover:bg-${accentColor.replace('-500', '-600')} transition-colors`} label={data?.[ids.ctaButton] || ir.elements.find(el => el.fieldId === ids.ctaButton)?.defaultContent} aria-label="Get Started Free" onClick={() => {}} />
        </div>
        <button className="lg:hidden p-2 text-zinc-300" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <i className="pi pi-bars text-xl"></i>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-zinc-950/95 flex flex-col items-center justify-center lg:hidden">
          <button className="absolute top-4 right-4 p-2 text-zinc-300" onClick={() => setIsMobileMenuOpen(false)}>
            <i className="pi pi-times text-2xl"></i>
          </button>
          <ul className="flex flex-col gap-6 text-2xl font-bold">
            {ir.navbar.links.map((link, index) => (
              <li key={index}>
                <a href="#" className={`text-zinc-300 hover:text-${accentColor} transition-colors dynamicStyle`} dangerouslySetInnerHTML={{ __html: data?.[ids[`navbarLink${index + 1}`]] || link }}></a>
              </li>
            ))}
            <li><Button label="Login" className="p-button-text text-zinc-300 text-2xl" onClick={() => setIsMobileMenuOpen(false)} /></li>
            <li><Button id={ids.ctaButton + "-mobile"} className={`dynamicStyle px-8 py-3 rounded-full font-semibold text-lg text-white bg-${accentColor} hover:bg-${accentColor.replace('-500', '-600')} transition-colors`} label={data?.[ids.ctaButton] || ir.elements.find(el => el.fieldId === ids.ctaButton)?.defaultContent} aria-label="Get Started Free" onClick={() => setIsMobileMenuOpen(false)} /></li>
          </ul>
        </div>
      )}


      <div className="px-3 sm:px-8 lg:px-16 py-6 sm:py-8 lg:py-12 max-w-[1920px] mx-auto text-center lg:text-left">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16 py-12 md:py-20 lg:py-24">
          <div className="flex-1 max-w-xl lg:max-w-2xl">
            <p id={ids.brandBadge} className={`dynamicStyle text-sm sm:text-base font-semibold text-${accentColor} mb-2`} dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || ir.elements.find(el => el.fieldId === ids.brandBadge)?.defaultContent }}></p>
            <h1 id={ids.headlineMain} className="dynamicStyle text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold text-white leading-tight break-words tracking-tight mb-4 md:mb-6" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || ir.elements.find(el => el.fieldId === ids.headlineMain)?.defaultContent }}></h1>
            <h2 id={ids.headlineSub} className="dynamicStyle text-lg sm:text-xl md:text-2xl text-zinc-300 mb-6 md:mb-8" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || ir.elements.find(el => el.fieldId === ids.headlineSub)?.defaultContent }}></h2>
            <p id={ids.description} className="dynamicStyle text-base sm:text-lg text-zinc-400 mb-8 md:mb-10 max-w-prose" dangerouslySetInnerHTML={{ __html: data?.[ids.description] || ir.elements.find(el => el.fieldId === ids.description)?.defaultContent }}></p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button id={ids.ctaButton} className={`dynamicStyle flex-1 sm:flex-none w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-lg text-white bg-${accentColor} hover:bg-${accentColor.replace('-500', '-600')} transition-colors`} label={data?.[ids.ctaButton] || ir.elements.find(el => el.fieldId === ids.ctaButton)?.defaultContent} aria-label="Get Started Free" onClick={() => {}} />
              <Button id={ids.secondaryCtaButton} className={`dynamicStyle flex-1 sm:flex-none w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-lg text-${accentColor} border-2 border-${accentColor} hover:bg-${accentColor} hover:text-white transition-colors`} label={data?.[ids.secondaryCtaButton] || ir.secondaryButton} aria-label="Explore Features" outlined onClick={() => {}} />
            </div>
          </div>
          <div className="flex-1 w-full lg:w-auto max-w-xl lg:max-w-none">
            <img
              id={ids.heroImage}
              className="dynamicStyle2 w-full h-auto object-cover rounded-3xl shadow-2xl transition-transform duration-500 hover:scale-105"
              src={data?.[ids.heroImage] ? getImage(data[ids.heroImage]) : getImage(ir.elements.find(el => el.fieldId === ids.heroImage)?.defaultContent || "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80")}
              onError={errorImage}
              alt="Futuristic AI interface"
            />
          </div>
        </section>

        {/* Feature Cards / Stat Badges (R9, R11i) */}
        <section className="py-12 md:py-20 lg:py-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white text-center mb-12">Powerful Features for Your AI Journey</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {statBadgesArr.map((item, index) => (
              <div key={index} className="p-4 sm:p-6 rounded-2xl bg-zinc-800 border border-zinc-700 shadow-xl flex flex-col items-start text-left hover:scale-[1.02] transition-transform duration-300">
                {/* Placeholder for icon/illustration based on imageConcept */}
                <div className={`text-${accentColor} mb-3 text-3xl sm:text-4xl`}>
                  {index === 0 && <i className="pi pi-chart-line"></i> /* AI Model Training */}
                  {index === 1 && <i className="pi pi-cloud-upload"></i> /* Automated Deployment */}
                  {index === 2 && <i className="pi pi-globe"></i> /* Real-time Analytics */}
                  {index === 3 && <i className="pi pi-users"></i> /* Collaborative Workspace */}
                </div>
                <h3 id={item.fieldId1} className="dynamicStyle text-lg sm:text-xl font-bold text-white mb-2" dangerouslySetInnerHTML={{ __html: data?.[item.fieldId1] || item.field1 }}></h3>
                <p id={item.fieldId2} className="dynamicStyle text-sm sm:text-base text-zinc-400" dangerouslySetInnerHTML={{ __html: data?.[item.fieldId2] || item.field2 }}></p>
              </div>
            ))}
          </div>
        </section>

        {/* Content Blocks / Value Propositions */}
        <section className="py-12 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {ir.contentBlocks.map((block, index) => (
              <div key={index} className="text-center p-6 bg-zinc-800/50 rounded-2xl border border-zinc-700 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300">
                <h3 id={ids[`contentBlock${index + 1}Title`]} className="dynamicStyle text-xl sm:text-2xl font-bold text-white mb-3" dangerouslySetInnerHTML={{ __html: data?.[ids[`contentBlock${index + 1}Title`]] || block.title }}></h3>
                <p id={ids[`contentBlock${index + 1}Description`]} className="dynamicStyle text-base sm:text-lg text-zinc-400" dangerouslySetInnerHTML={{ __html: data?.[ids[`contentBlock${index + 1}Description`]] || block.description }}></p>
              </div>
            ))}
          </div>
        </section>

        {/* Below-the-fold CTA */}
        <section className={`bg-${accentColor}/10 border border-${accentColor} rounded-3xl p-8 sm:p-12 lg:p-16 my-12 md:my-20 lg:my-24 text-center shadow-xl`}>
          <h2 id={ids.ctaBlockHeadline} className="dynamicStyle text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight break-words" dangerouslySetInnerHTML={{ __html: data?.[ids.ctaBlockHeadline] || ir.ctaBlocks[0].headline }}></h2>
          <p id={ids.ctaBlockSubtext} className="dynamicStyle text-base sm:text-lg text-zinc-300 mb-8 max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: data?.[ids.ctaBlockSubtext] || ir.ctaBlocks[0].subtext }}></p>
          <Button id={ids.ctaBlockButtonText} className={`dynamicStyle px-10 py-4 rounded-full font-bold text-xl text-white bg-${accentColor} hover:bg-${accentColor.replace('-500', '-600')} transition-colors`} label={data?.[ids.ctaBlockButtonText] || ir.ctaBlocks[0].buttonText} aria-label="Sign Up Now" onClick={() => {}} />
        </section>
      </div>

      {/* Footer (R11j) */}
      <footer className="bg-zinc-900 border-t border-zinc-800 py-8 sm:py-10 lg:py-12 px-3 sm:px-8 lg:px-16">
        <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-4">
            <h3 className={`text-2xl font-bold text-${accentColor}`} dangerouslySetInnerHTML={{ __html: data?.[ids.navbarLogo] || ir.navbar.logoText }}></h3>
            {ir.footer.hasEmailSignup && (
              <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full justify-center md:justify-start">
                <input
                  type="email"
                  id={ids.footerEmailInput}
                  placeholder={data?.[ids.footerEmailInput] || ir.footer.emailPlaceholder}
                  className="dynamicStyle flex-grow px-5 py-3 bg-zinc-800 text-zinc-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 w-full sm:w-auto min-w-[200px]"
                />
                <Button id={ids.footerSubscribeButton} className={`dynamicStyle px-6 py-3 rounded-full font-bold text-white bg-${accentColor} hover:bg-${accentColor.replace('-500', '-600')} transition-colors w-full sm:w-auto`} label={data?.[ids.footerSubscribeButton] || ir.footer.signupButtonText} aria-label="Subscribe to newsletter" onClick={() => {}} />
              </div>
            )}
            <p className="text-zinc-500 text-sm mt-4">&copy; {new Date().getFullYear()} {ir.navbar.logoText}. All rights reserved.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 sm:gap-10 lg:gap-16 text-zinc-300">
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold text-white mb-2">Company</h4>
              {ir.footer.links.map((link, index) => (
                <a key={index} href="#" id={ids[`footerLink${index + 1}`]} className={`dynamicStyle text-zinc-400 hover:text-${accentColor} transition-colors`} dangerouslySetInnerHTML={{ __html: data?.[ids[`footerLink${index + 1}`]] || link }}></a>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold text-white mb-2">Connect</h4>
              <div className="flex gap-4 justify-center md:justify-start">
                {ir.footer.socials.map((social, index) => (
                  <a key={index} href="#" id={ids[`footerSocial${index + 1}`]} aria-label={social} className={`text-zinc-400 hover:text-${accentColor} transition-colors text-xl`}>
                    {social === "Email" && <i className="pi pi-envelope"></i>}
                    {social === "LinkedIn" && <i className="pi pi-linkedin"></i>}
                    {social === "Instagram" && <i className="pi pi-instagram"></i>}
                    {social === "Twitter" && <i className="pi pi-twitter"></i>}
                    {social === "Facebook" && <i className="pi pi-facebook"></i>}
                    {/* Add more social icons as needed */}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomSection;