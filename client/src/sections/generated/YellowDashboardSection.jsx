import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from "../../features/cms/cmsSlice";
import { getImage, errorImage } from "../../utils/getImage";

const CustomSection = ({ pageName = "Home" }) => {
  const dispatch = useDispatch();
  const ids = {
    heroImage: "2000000054",
    brandBadge: "2000000055",
    headlineMain: "2000000056",
    headlineSub: "2000000057",
    description: "2000000058",
    statBadges: "2000000059",
    ctaButton: "2000000060",
  };

  useEffect(() => {
    dispatch(fetchElementsByIds({
      elementIds: [
        ids.heroImage, ids.brandBadge, ids.headlineMain, ids.headlineSub,
        ids.description, ids.statBadges, ids.ctaButton,
        "3000000043", "3000000044", "3000000045",
        "3000000046", "3000000047", "3000000048",
      ],
      pageName,
    }));
  }, [dispatch, pageName]);

  const data = useSelector((state) => state.cms?.allSections?.[pageName]);
  const cssData = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);

  useEffect(() => {
    Object.values(ids).forEach(id => {
      if (id && cssData?.[id]) {
        const el = document.getElementById(id);
        if (el) el.style.cssText = cssData[id];
      }
    });
  }, [cssData]);

  const DEFAULT_STAT_CARDS = [
    { field1: "12.5%", field2: "User Acquisition" },
    { field1: "42ms", field2: "System Latency" },
    { field1: "68%", field2: "Memory Usage" },
    { field1: "1,204", field2: "Active Sessions" },
    { field1: "0.02%", field2: "Error Rates" },
    { field1: "84TB", field2: "Storage Volume" }
  ];

  return (
    <div className="w-full min-h-screen bg-[#eef2f6] p-3 sm:p-6 lg:p-8 flex items-center justify-center font-sans overflow-x-hidden text-slate-900">
      <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 shadow-2xl w-full max-w-7xl flex flex-col gap-6 relative border border-slate-200/80 text-slate-900">
        
        {/* Full Top Header Bar */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center font-black text-slate-950 text-base shadow-sm">
              ✦
            </span>
            <h1
              id={ids.brandBadge}
              className="text-lg sm:text-xl font-black text-slate-900 tracking-tight"
              dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "ANALYTICS-CORE" }}
            />
            <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
              <span className="bg-white text-slate-900 px-3 py-1 rounded-lg shadow-2xs">Overview</span>
              <span className="px-3 py-1 hover:text-slate-900 cursor-pointer">Reports</span>
              <span className="px-3 py-1 hover:text-slate-900 cursor-pointer">Metrics</span>
              <span className="px-3 py-1 hover:text-slate-900 cursor-pointer">Settings</span>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search reports..."
                className="w-full bg-slate-100 border border-slate-200/80 rounded-full pl-9 pr-4 py-1.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>
        </header>

        {/* 3-Column Main Body */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full">
          
          {/* Column 1: Left floating amber capsule */}
          <nav className="w-16 min-w-[4rem] max-w-[4rem] bg-[#f5b800] rounded-3xl py-6 px-2 flex flex-col items-center justify-between shadow-lg shadow-amber-500/20 flex-shrink-0 self-stretch min-h-[520px]">
            <div className="flex flex-col items-center gap-5 w-full">
              <button className="p-2 rounded-xl text-slate-900 hover:bg-amber-500/30 transition-colors" title="Menu">
                <svg className="w-5 h-5 min-w-[20px] min-h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button className="p-2 rounded-xl text-slate-900 hover:bg-amber-500/30 transition-colors" title="Upload">
                <svg className="w-5 h-5 min-w-[20px] min-h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
              <button className="p-2 rounded-xl text-slate-900 hover:bg-amber-500/30 transition-colors" title="Analytics">
                <svg className="w-5 h-5 min-w-[20px] min-h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </button>
              <button className="p-2 rounded-xl text-slate-900 hover:bg-amber-500/30 transition-colors relative" title="Favorites">
                <svg className="w-5 h-5 min-w-[20px] min-h-[20px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-slate-900"></span>
              </button>
              <button className="p-2 rounded-xl bg-slate-900 text-amber-400 shadow-md" title="Grid Apps">
                <svg className="w-5 h-5 min-w-[20px] min-h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button className="p-2 rounded-xl text-slate-900 hover:bg-amber-500/30 transition-colors" title="Status">
                <svg className="w-5 h-5 min-w-[20px] min-h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
            <button className="p-2 rounded-xl text-slate-900 hover:bg-amber-500/30 transition-colors" title="Settings">
              <svg className="w-5 h-5 min-w-[20px] min-h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </nav>

          {/* Column 2: Center main content (3x2 grid + bottom collaborator row) */}
          <main className="flex-1 min-w-0 flex flex-col justify-between gap-6">
            {/* 3x2 Grid of 6 rounded thumbnail cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {DEFAULT_STAT_CARDS.map((card, i) => (
                <div key={i} className="bg-slate-50 hover:bg-white p-4 rounded-2xl border border-slate-200/80 transition-all hover:shadow-md flex flex-col justify-between">
                  <div className="h-20 bg-slate-200/80 rounded-xl mb-3 flex items-center justify-center text-slate-400">
                    <svg className="w-6 h-6 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 tracking-tight" id={`card-title-${i}`} dangerouslySetInnerHTML={{ __html: card.field1 }} />
                    <p className="text-xs text-slate-600 font-medium mt-0.5 truncate" id={`card-desc-${i}`} dangerouslySetInnerHTML={{ __html: card.field2 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Activity / Collaborator Row */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-4 mt-auto">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Active Collaborators</h4>
                <span className="text-xs text-amber-600 font-semibold cursor-pointer hover:underline">+ Invite</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: "Sarah K.", role: "Lead Designer", color: "bg-emerald-500" },
                  { name: "Alex R.", role: "Data Scientist", color: "bg-indigo-500" },
                  { name: "Elena M.", role: "System Admin", color: "bg-amber-500" },
                  { name: "David P.", role: "Product Manager", color: "bg-rose-500" },
                ].map((user, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-2xs">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${user.color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* Column 3: Right Inspector Detail Panel */}
          <aside className="w-full lg:w-80 min-w-[18rem] max-w-[20rem] bg-slate-50 rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between flex-shrink-0">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Inspector Panel</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-400 text-slate-950 rounded-md">Active</span>
              </div>
              <img
                id={ids.heroImage}
                className="dynamicStyle2 w-full h-44 object-cover rounded-xl border border-slate-200 mb-3 shadow-sm"
                src={data?.[ids.heroImage] ? getImage(data[ids.heroImage]) : "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"}
                onError={errorImage}
                alt="Preview"
              />
              <h3
                id={ids.headlineMain}
                className="dynamicStyle text-base font-extrabold text-slate-900 tracking-tight"
                dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "Actionable Data Insights" }}
              />
              <p
                id={ids.headlineSub}
                className="dynamicStyle text-xs text-slate-500 mt-0.5"
                dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Monitor performance metrics in real-time." }}
              />
              <div className="flex items-center gap-1.5 text-amber-500 text-sm my-2">
                <span>★★★★★</span>
                <span className="text-slate-700 font-bold text-xs">4.9 / 5.0</span>
              </div>
              <p
                id={ids.description}
                className="dynamicStyle text-xs text-slate-600 leading-relaxed my-2"
                dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "A comprehensive dashboard designed for rapid data visualization and asset management." }}
              />
              <div className="bg-white rounded-xl p-3 border border-slate-200/70 my-3 space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-500"><span>Update Frequency</span><span className="font-bold text-slate-800">Real-time</span></div>
                <div className="flex justify-between text-slate-500"><span>Telemetry Nodes</span><span className="font-bold text-slate-800">142 Clusters</span></div>
                <div className="flex justify-between text-slate-500"><span>SLA Performance</span><span className="font-bold text-emerald-600">99.98%</span></div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200/60">
              <Button
                id={ids.ctaButton}
                className="dynamicStyle flex-1 py-2.5 rounded-xl font-bold bg-[#f5b800] text-slate-950 border-none shadow-sm hover:brightness-105 transition-all text-xs sm:text-sm"
                label={data?.[ids.ctaButton] || "View Analytics"}
              />
              <Button
                className="dynamicStyle px-3 py-2.5 rounded-xl font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 text-xs sm:text-sm"
                label="Export"
              />
            </div>
          </aside>
        </div>

      </div>
    </div>
  );
};

export default CustomSection;
