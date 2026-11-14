import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from "../../features/cms/cmsSlice";
import { getSectionTextContrastClass } from "../../utils/sectionContrast";
import { getImage, errorImage } from "../../utils/getImage";

const ids = {
  heroImage: "2000000015",
  brandBadge: "2000000016",
  headlineMain: "2000000017",
  headlineSub: "2000000018",
  description: "2000000019",
  statBadges: "2000000020",
  ctaButton: "2000000021",
};

const DEFAULT_STAT_CARDS = [
  { field1: "99.9%", fieldType1: "Text", fieldId1: "3000000013", field2: "Uptime SLA", fieldType2: "Text", fieldId2: "3000000014" },
  { field1: "2.4M", fieldType1: "Text", fieldId1: "3000000015", field2: "Requests/Day", fieldType2: "Text", fieldId2: "3000000016" },
  { field1: "12ms", fieldType1: "Text", fieldId1: "3000000017", field2: "Avg Latency", fieldType2: "Text", fieldId2: "3000000018" }
];

const YellowDashboard = ({ pageName = "Home" }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.cms?.allSections?.[pageName]);
  const cssData = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);

  const [activeTab, setActiveTab] = useState("All Assets");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");

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
          "3000000013",
          "3000000014",
          "3000000015",
          "3000000016",
          "3000000017",
          "3000000018",
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
  }, [cssData]);

  const statBadgesArr =
    Array.isArray(data?.[ids.statBadges]) && data[ids.statBadges].length > 0
      ? data[ids.statBadges]
      : DEFAULT_STAT_CARDS;

  const navLinks = ["Overview", "Assets", "Analytics", "Settings"];

  const contentBlocks = [
    {
      title: "Modular Grid System",
      description: "Organize data assets into customizable grid layouts with instant filtering.",
      icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    },
    {
      title: "Sidebar Quick Actions",
      description: "Access system controls, favorites, and analytics with single-click navigation.",
      icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
    },
    {
      title: "Real-time Metrics",
      description: "Track system health, conversion rates, and user engagement live.",
      icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    }
  ];

  const featureCards = [
    {
      title: "Media Collection A",
      description: "High-resolution graphic assets and marketing collateral.",
      metric: "1.2 GB",
      tag: "Graphics",
      accent: "bg-amber-400"
    },
    {
      title: "UI Components Library",
      description: "Standardized component tokens and interactive UI patterns.",
      metric: "340 Items",
      tag: "Design",
      accent: "bg-yellow-400"
    },
    {
      title: "Analytics Reports",
      description: "Quarterly performance stats and user retention analysis.",
      metric: "98.4%",
      tag: "Data",
      accent: "bg-orange-400"
    },
    {
      title: "Marketing Templates",
      description: "Ready-to-use email templates and banner designs.",
      metric: "45 Files",
      tag: "Campaigns",
      accent: "bg-amber-500"
    },
    {
      title: "Brand Guidelines",
      description: "Typography, palette specifications, and usage rules.",
      metric: "v2.4",
      tag: "Docs",
      accent: "bg-yellow-500"
    },
    {
      title: "System Backups",
      description: "Automated snapshot logs and database recovery points.",
      metric: "Daily",
      tag: "Security",
      accent: "bg-orange-500"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden font-sans selection:bg-yellow-400 selection:text-zinc-950">
      {/* HEADER / NAVIGATION BAR */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-16 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-yellow-500 via-amber-400 to-yellow-300 flex items-center justify-center text-zinc-950 font-black text-lg shadow-lg shadow-yellow-500/20">
                C
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Core<span className="text-yellow-400">Dash</span>
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-zinc-800">
              {navLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={`#${link.toLowerCase()}`}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    idx === 0
                      ? "text-yellow-400 bg-yellow-400/10"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                  }`}
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>

          {/* Search Bar & Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center bg-zinc-900/90 border border-zinc-800 rounded-xl px-3 py-1.5 w-64 focus-within:border-yellow-400/50 transition-all">
              <svg className="w-4 h-4 text-zinc-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search assets, reports..."
                className="bg-transparent border-none outline-none text-xs text-zinc-200 placeholder-zinc-500 w-full"
              />
              <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700">⌘K</span>
            </div>

            <Button
              id={ids.ctaButton}
              className="dynamicStyle bg-yellow-400 hover:bg-yellow-300 text-zinc-950 font-bold border-none px-4 py-2 text-xs sm:text-sm rounded-xl transition-all shadow-md hover:shadow-yellow-400/20"
              label={data?.[ids.ctaButton] || "Create Asset"}
              aria-label="Create Asset action"
              onClick={() => {}}
            />

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white rounded-lg bg-zinc-900"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-3 space-y-2">
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 mb-2">
              <input
                type="text"
                placeholder="Search assets..."
                className="bg-transparent border-none outline-none text-sm text-zinc-200 placeholder-zinc-500 w-full"
              />
            </div>
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={`#${link.toLowerCase()}`}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-900 hover:text-yellow-400"
              >
                {link}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* HERO SECTION WITH YELLOW SIDEBAR INDICATOR STRIP */}
      <section className="relative w-full border-b border-zinc-800 bg-gradient-to-b from-zinc-950 via-zinc-900/40 to-zinc-950">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            
            {/* HERO LEFT CONTENT */}
            <div className="flex-1 w-full space-y-5 sm:space-y-6">
              {/* Brand Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs sm:text-sm font-bold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                <span
                  id={ids.brandBadge}
                  className="dynamicStyle"
                  dangerouslySetInnerHTML={{
                    __html: data?.[ids.brandBadge] || "ENTERPRISE DASHBOARD",
                  }}
                />
              </div>

              {/* Main Headline */}
              <h1
                id={ids.headlineMain}
                className="dynamicStyle text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black tracking-tight text-white leading-none break-words"
                dangerouslySetInnerHTML={{
                  __html: data?.[ids.headlineMain] || "Centralized Asset & Workflow Management",
                }}
              />

              {/* Subheadline */}
              <h2
                id={ids.headlineSub}
                className="dynamicStyle text-base sm:text-lg md:text-xl text-yellow-400/90 font-medium max-w-2xl"
                dangerouslySetInnerHTML={{
                  __html:
                    data?.[ids.headlineSub] ||
                    "Monitor real-time metrics, organize asset collections, and streamline team collaboration.",
                }}
              />

              {/* Description */}
              <p
                id={ids.description}
                className="dynamicStyle text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl"
                dangerouslySetInnerHTML={{
                  __html:
                    data?.[ids.description] ||
                    "Empower your operational workflows with high-visibility grid views, modular controls, and intelligent asset distribution tools built for modern teams.",
                }}
              />

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Button
                  id={ids.ctaButton}
                  className="dynamicStyle bg-yellow-400 hover:bg-yellow-300 text-zinc-950 font-bold px-8 py-3.5 rounded-xl border-none shadow-lg shadow-yellow-400/10 text-sm sm:text-base transition-all"
                  label={data?.[ids.ctaButton] || "Create Asset"}
                  aria-label="Create Asset primary action"
                  onClick={() => {}}
                />
                <button className="px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export Data
                </button>
              </div>

              {/* Stat Cards Grid (R9 compliant loop) */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4">
                {statBadgesArr.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-900/80 border border-zinc-800 p-3 sm:p-4 rounded-xl hover:border-yellow-400/40 transition-all group"
                  >
                    <div
                      id={item.fieldId1}
                      className="dynamicStyle text-lg sm:text-2xl font-black text-yellow-400 group-hover:scale-105 transition-transform origin-left"
                      dangerouslySetInnerHTML={{ __html: item.field1 || "" }}
                    />
                    <div
                      id={item.fieldId2}
                      className="dynamicStyle text-[10px] sm:text-xs text-zinc-400 font-medium mt-0.5"
                      dangerouslySetInnerHTML={{ __html: item.field2 || "" }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* HERO RIGHT MEDIA SHOWCASE (Mockup wireframe with yellow accent sidebar) */}
            <div className="flex-1 w-full relative">
              <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/60 p-2 sm:p-3 shadow-2xl backdrop-blur-xl overflow-hidden group">
                {/* Yellow status bar accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-300"></div>

                {/* Dashboard Header Bar Mockup */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/80 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    <span className="text-xs text-zinc-500 font-mono ml-2">coredash-v2.4.preview</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    Live Sync
                  </div>
                </div>

                {/* Main Hero Image */}
                <div className="relative overflow-hidden rounded-xl bg-zinc-950">
                  <img
                    id={ids.heroImage}
                    className="dynamicStyle2 w-full h-[280px] sm:h-[380px] lg:h-[420px] object-cover object-top opacity-90 group-hover:scale-102 transition-transform duration-700"
                    src={
                      data?.[ids.heroImage]
                        ? getImage(data[ids.heroImage])
                        : getImage("https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80")
                    }
                    onError={errorImage}
                    alt="CoreDash Wireframe Interface"
                  />
                  {/* Floating Yellow Sidebar Badge Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-zinc-950/90 border border-yellow-400/40 p-3 rounded-xl backdrop-blur-md flex items-center gap-3">
                    <div className="w-3 h-10 bg-yellow-400 rounded-full"></div>
                    <div>
                      <div className="text-xs font-bold text-white">Active Grid Template</div>
                      <div className="text-[11px] text-zinc-400">6 Modules • Live Analytics Enabled</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CONTENT BLOCKS / VALUE PROPOSITION SECTION */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 lg:px-16 max-w-[1920px] mx-auto border-b border-zinc-800/80">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Designed for Speed & High Visibility
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-2">
            Built from the ground up for modern enterprise dashboard workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contentBlocks.map((block, idx) => (
            <div
              key={idx}
              className="bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-2xl hover:border-yellow-400/40 transition-all hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 mb-4 group-hover:bg-yellow-400 group-hover:text-zinc-950 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={block.icon} />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{block.title}</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{block.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURE CARDS GRID WITH FILTER TABS */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 lg:px-16 max-w-[1920px] mx-auto border-b border-zinc-800/80">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Asset Collections
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Inspect and organize your enterprise system resources.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
            {["All Assets", "Graphics", "Data", "Campaigns", "Security"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? "bg-yellow-400 text-zinc-950 shadow-md shadow-yellow-400/20"
                    : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {featureCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-yellow-400/50 transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${card.accent}`}></span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-full border border-zinc-700/50">
                    {card.tag}
                  </span>
                </div>
                <span className="text-xs font-black text-yellow-400 font-mono bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                  {card.metric}
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white group-hover:text-yellow-400 transition-colors">
                  {card.title}
                </h4>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                  {card.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                <span className="hover:text-zinc-200 cursor-pointer">View Details &rarr;</span>
                <span className="text-[10px] text-zinc-500">Updated today</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BELOW THE FOLD CTA BANNER */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 lg:px-16 max-w-[1920px] mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-300 p-8 sm:p-12 text-zinc-950 overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-zinc-950/10 -skew-x-12 transform translate-x-12 hidden lg:block pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Ready to optimize your workspace?
            </h2>
            <p className="text-zinc-900 font-medium text-sm sm:text-base mt-2">
              Join thousands of data-driven teams managing workflows with CoreDash.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Button
                className="bg-zinc-950 hover:bg-zinc-900 text-white font-bold px-8 py-3.5 rounded-xl border-none text-sm sm:text-base shadow-xl transition-all"
                label="Start Free Trial"
                aria-label="Start Free Trial"
                onClick={() => {}}
              />
              <span className="text-xs font-semibold text-zinc-900/80">
                14-day free trial • No credit card required
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 bg-zinc-950 pt-12 pb-8 px-4 sm:px-8 lg:px-16 max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand & Email Subscription */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center text-zinc-950 font-black text-base">
                C
              </div>
              <span className="font-bold text-lg text-white">CoreDash</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm">
              Subscribe to standard release notes, metric templates, and grid updates.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-2 max-w-md pt-2"
            >
              <input
                type="email"
                placeholder="Enter your work email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 rounded-xl px-4 py-2.5 flex-1 focus:outline-none focus:border-yellow-400/50"
              />
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-300 text-zinc-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Quick Nav Links */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-3">
              Product Links
            </h5>
            <ul className="space-y-2 text-xs sm:text-sm text-zinc-400">
              {["Documentation", "API Reference", "Privacy Policy", "Terms of Service"].map(
                (item, idx) => (
                  <li key={idx}>
                    <a href={`#${item.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-yellow-400 transition-colors">
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-3">
              Community & Social
            </h5>
            <ul className="space-y-2 text-xs sm:text-sm text-zinc-400">
              {["Twitter", "GitHub", "Discord", "LinkedIn"].map((item, idx) => (
                <li key={idx}>
                  <a href={`#${item.toLowerCase()}`} className="hover:text-yellow-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>© {new Date().getFullYear()} CoreDash Inc. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-400 cursor-pointer">Privacy</span>
            <span className="hover:text-zinc-400 cursor-pointer">Security</span>
            <span className="hover:text-zinc-400 cursor-pointer">Status</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default YellowDashboard;