import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from "../../features/cms/cmsSlice";
import { getSectionTextContrastClass } from "../../utils/sectionContrast";
import { getImage, errorImage } from "../../utils/getImage";

const ids = {
  heroImage: "2000000031",
  brandBadge: "2000000032",
  headlineMain: "2000000033",
  headlineSub: "2000000034",
  description: "2000000035",
  statBadges: "2000000036",
  ctaButton: "2000000037",
};

const DEFAULT_STAT_CARDS = [
  { field1: "1,248", fieldType1: "Text", fieldId1: "3000000025", field2: "Total Assets", fieldType2: "Text", fieldId2: "3000000026" },
  { field1: "84.2 GB", fieldType1: "Text", fieldId1: "3000000027", field2: "Storage Used", fieldType2: "Text", fieldId2: "3000000028" },
  { field1: "14", fieldType1: "Text", fieldId1: "3000000029", field2: "Active Collaborators", fieldType2: "Text", fieldId2: "3000000030" }
];

const YellowDashboard = ({ pageName = "Home" }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.cms?.allSections?.[pageName]);
  const cssData = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);

  const [activeTab, setActiveTab] = useState("All Assets");
  const [activeSidebarIcon, setActiveSidebarIcon] = useState("grid");
  const [selectedAsset, setSelectedAsset] = useState(0);

  useEffect(() => {
    dispatch(fetchElementsByIds({
      elementIds: [
        ids.heroImage, ids.brandBadge, ids.headlineMain, ids.headlineSub,
        ids.description, ids.statBadges, ids.ctaButton,
        "3000000025", "3000000026", "3000000027",
        "3000000028", "3000000029", "3000000030",
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

  const statBadgesArr = Array.isArray(data?.[ids.statBadges]) && data[ids.statBadges].length > 0
    ? data[ids.statBadges]
    : DEFAULT_STAT_CARDS;

  const featureCards = [
    {
      title: "Hero Video Reel",
      description: "MP4 • 4K Resolution • 142 MB",
      metric: "v2.4",
      bg: "bg-indigo-900/10 border-indigo-200",
      iconColor: "text-indigo-600",
      tag: "Video"
    },
    {
      title: "UI Kit Component Library",
      description: "Figma • Vector Tokens • 45 MB",
      metric: "v1.0",
      bg: "bg-amber-900/10 border-amber-200",
      iconColor: "text-amber-600",
      tag: "Figma"
    },
    {
      title: "Brand Guidelines 2024",
      description: "PDF • 24 Pages • 12 MB",
      metric: "v3.1",
      bg: "bg-emerald-900/10 border-emerald-200",
      iconColor: "text-emerald-600",
      tag: "Doc"
    },
    {
      title: "Product Presentation Deck",
      description: "Keynote • 18 Slides • 28 MB",
      metric: "v1.2",
      bg: "bg-rose-900/10 border-rose-200",
      iconColor: "text-rose-600",
      tag: "Slides"
    },
    {
      title: "3D Render Pack",
      description: "OBJ/FBX • Textures Included • 310 MB",
      metric: "v1.5",
      bg: "bg-purple-900/10 border-purple-200",
      iconColor: "text-purple-600",
      tag: "3D Asset"
    },
    {
      title: "Mobile App Prototype",
      description: "Protopie • Interactive • 85 MB",
      metric: "v2.0",
      bg: "bg-sky-900/10 border-sky-200",
      iconColor: "text-sky-600",
      tag: "Interactive"
    }
  ];

  const teamCollaborators = [
    { name: "Sarah K.", role: "Lead Designer", status: "Online", color: "bg-emerald-500" },
    { name: "Alex R.", role: "3D Artist", status: "In Figma", color: "bg-indigo-500" },
    { name: "Elena M.", role: "Motion Designer", status: "Reviewing", color: "bg-amber-500" },
    { name: "David P.", role: "Product Manager", status: "Idle", color: "bg-slate-400" }
  ];

  return (
    <div className="w-full overflow-x-hidden min-h-screen bg-[#e2e8f0] py-4 sm:py-8 px-2 sm:px-6 lg:px-8 font-sans flex items-center justify-center">
      <div className="w-full max-w-[1440px] bg-white rounded-2xl sm:rounded-[2.5rem] shadow-2xl border border-slate-200/80 p-3 sm:p-6 lg:p-8 flex flex-col gap-6">
        
        {/* TOP NAVIGATION BAR */}
        <header className="w-full flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400 flex items-center justify-center font-black text-slate-900 text-lg sm:text-xl shadow-md shadow-amber-400/30">
                A
              </span>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                AssetHub
              </span>
            </div>

            <span
              id={ids.brandBadge}
              className="dynamicStyle text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 bg-amber-100 text-amber-800 rounded-full border border-amber-200/60"
              dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "WORKSPACE" }}
            />
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {["All Assets", "Recent", "Shared", "Favorites", "Trash"].map((link) => (
              <button
                key={link}
                onClick={() => setActiveTab(link)}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === link
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {link}
              </button>
            ))}
          </div>

          {/* Search Bar & Actions */}
          <div className="w-full md:w-auto flex items-center gap-2">
            <div className="relative flex-1 md:w-64 lg:w-72">
              <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search assets, tags, or team members..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-full bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
              />
            </div>
            <Button
              className="dynamicStyle px-4 py-2 text-xs sm:text-sm rounded-full font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex-shrink-0"
              label="Filter View"
              aria-label="Filter View"
            />
          </div>
        </header>

        {/* MAIN BODY: SIDEBAR + CONTENT GRID + INSPECTOR DETAIL PANEL */}
        <div className="flex flex-col md:flex-row gap-4 lg:gap-6 items-stretch">
          
          {/* FLOATING AMBER SIDEBAR RAIL */}
          <aside className="w-full md:w-16 bg-amber-400 rounded-2xl md:rounded-3xl p-2.5 md:py-6 flex md:flex-col items-center justify-between shadow-lg shadow-amber-400/20 flex-shrink-0">
            <div className="flex md:flex-col items-center gap-3 sm:gap-4 lg:gap-6 w-full justify-around md:justify-start">
              <button
                onClick={() => setActiveSidebarIcon("menu")}
                className="p-2 rounded-xl text-slate-900 hover:bg-amber-500/30 transition-colors"
                title="Menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <button
                onClick={() => setActiveSidebarIcon("arrow")}
                className={`p-2 rounded-xl transition-all ${
                  activeSidebarIcon === "arrow" ? "bg-slate-900 text-amber-400 shadow-md" : "text-slate-900 hover:bg-amber-500/30"
                }`}
                title="Upload Activity"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>

              <button
                onClick={() => setActiveSidebarIcon("chart")}
                className={`p-2 rounded-xl transition-all ${
                  activeSidebarIcon === "chart" ? "bg-slate-900 text-amber-400 shadow-md" : "text-slate-900 hover:bg-amber-500/30"
                }`}
                title="Analytics"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </button>

              <button
                onClick={() => setActiveSidebarIcon("star")}
                className={`p-2 rounded-xl transition-all relative ${
                  activeSidebarIcon === "star" ? "bg-slate-900 text-amber-400 shadow-md" : "text-slate-900 hover:bg-amber-500/30"
                }`}
                title="Favorites"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-slate-900"></span>
              </button>

              <button
                onClick={() => setActiveSidebarIcon("grid")}
                className={`p-2 rounded-xl transition-all ${
                  activeSidebarIcon === "grid" ? "bg-slate-900 text-amber-400 shadow-md" : "text-slate-900 hover:bg-amber-500/30"
                }`}
                title="Asset Grid"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>

            <div className="hidden md:flex flex-col items-center gap-4">
              <button
                onClick={() => setActiveSidebarIcon("circle")}
                className="p-2 text-slate-900 hover:bg-amber-500/30 rounded-xl"
                title="Storage Meter"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              <button
                onClick={() => setActiveSidebarIcon("settings")}
                className="p-2 text-slate-900 hover:bg-amber-500/30 rounded-xl"
                title="Settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            
            {/* STAT BADGES ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {statBadgesArr.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-300 transition-all shadow-sm"
                >
                  <span
                    id={stat.fieldId2 || `2000000038${(idx + 1) * 2}`}
                    className="dynamicStyle text-xs font-bold text-slate-500 uppercase tracking-wider"
                    dangerouslySetInnerHTML={{ __html: stat.field2 || "Metric Label" }}
                  />
                  <span
                    id={stat.fieldId1 || `2000000039${idx * 2 + 1}`}
                    className="dynamicStyle text-xl sm:text-2xl font-black text-slate-900 mt-1"
                    dangerouslySetInnerHTML={{ __html: stat.field1 || "00.0" }}
                  />
                </div>
              ))}
            </div>

            {/* CARD GRID (2 rows x 3 cols = 6 cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featureCards.map((card, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedAsset(idx)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between bg-white ${
                    selectedAsset === idx
                      ? "ring-2 ring-amber-400 border-amber-400 shadow-md"
                      : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {card.tag}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {card.metric}
                    </span>
                  </div>

                  <div className={`h-24 sm:h-28 rounded-xl ${card.bg} border flex items-center justify-center mb-3 relative overflow-hidden group`}>
                    <div className={`w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center ${card.iconColor} shadow-sm transition-transform group-hover:scale-110`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900 truncate">
                      {card.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* BOTTOM COLLABORATORS / ACTIVITY ROW */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Active Team Members
                </h5>
                <span className="text-xs text-amber-600 font-semibold cursor-pointer hover:underline">
                  + Invite Member
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {teamCollaborators.map((user, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-2xs">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${user.color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT DETAIL INSPECTOR PANEL */}
          <aside className="w-full md:w-80 bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between flex-shrink-0">
            <div>
              {/* PANEL HEADER */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Inspector Panel
                </span>
                <span className="text-xs font-bold px-2 py-0.5 bg-amber-400 text-slate-900 rounded-md">
                  Active Card
                </span>
              </div>

              {/* INSPECTOR IMAGE PREVIEW */}
              <div className="relative mb-4 group">
                <img
                  id={ids.heroImage}
                  className="dynamicStyle2 w-full h-44 sm:h-48 object-cover rounded-xl border border-slate-200 shadow-sm"
                  src={
                    data?.[ids.heroImage]
                      ? getImage(data[ids.heroImage])
                      : getImage("https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80")
                  }
                  onError={errorImage}
                  alt="Visual representation"
                />
                <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-md">
                  4K RAW
                </div>
              </div>

              {/* MAIN HEADLINE */}
              <h3
                id={ids.headlineMain}
                className="dynamicStyle text-base sm:text-lg font-black text-slate-900 tracking-tight"
                dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "Digital Asset Workspace" }}
              />

              {/* SUBTITLE */}
              <p
                id={ids.headlineSub}
                className="dynamicStyle text-xs font-medium text-slate-500 mt-1"
                dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Manage, inspect, and organize your team's creative assets seamlessly." }}
              />

              {/* RATING & SPECS ROW */}
              <div className="flex items-center gap-2 my-3 py-2 border-y border-slate-200/80">
                <div className="flex text-amber-400 text-xs">
                  {"★".repeat(5)}
                </div>
                <span className="text-xs font-bold text-slate-700">4.9</span>
                <span className="text-xs text-slate-400">• 128 Reviews</span>
              </div>

              {/* DESCRIPTION */}
              <p
                id={ids.description}
                className="dynamicStyle text-xs leading-relaxed text-slate-600 my-3"
                dangerouslySetInnerHTML={{
                  __html: data?.[ids.description] || "Centralized asset repository with real-time detail previewing, granular metadata tracking, and integrated review workflows."
                }}
              />

              {/* METADATA LIST */}
              <div className="space-y-2 mt-4 bg-white p-3 rounded-xl border border-slate-200/70 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">File Format:</span>
                  <span className="font-bold text-slate-900">MP4 / ProRes</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">License:</span>
                  <span className="font-bold text-slate-900">Enterprise Commercial</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">Last Modified:</span>
                  <span className="font-bold text-slate-900">Today, 2:45 PM</span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS & CTA */}
            <div className="mt-6 flex flex-col gap-2">
              <Button
                id={ids.ctaButton}
                className="dynamicStyle w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-900 border-none rounded-xl font-bold text-sm shadow-md shadow-amber-400/20"
                label={data?.[ids.ctaButton] || "Upload Asset"}
                aria-label="Upload Asset"
                onClick={() => {}}
              />

              <div className="text-center mt-2">
                <p className="text-[11px] font-semibold text-slate-500">
                  Upgrade storage capacity anytime
                </p>
                <p className="text-[10px] text-slate-400">
                  Flexible team plans starting at $12/user/mo
                </p>
              </div>
            </div>
          </aside>

        </div>

        {/* FOOTER */}
        <footer className="w-full pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-700">© 2024 AssetHub Inc.</span>
            <span>Documentation</span>
            <span>Storage Rules</span>
            <span>API Keys</span>
            <span>Support</span>
          </div>
          <div className="flex items-center gap-3 font-medium text-slate-600">
            <span className="hover:text-slate-900 cursor-pointer">Twitter</span>
            <span className="hover:text-slate-900 cursor-pointer">GitHub</span>
            <span className="hover:text-slate-900 cursor-pointer">Discord</span>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default YellowDashboard;