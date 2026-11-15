import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from "../../features/cms/cmsSlice";
import { getImage, errorImage } from "../../utils/getImage";

const ids = {
  heroImage: "2000000110",
  brandBadge: "2000000111",
  headlineMain: "2000000112",
  headlineSub: "2000000113",
  description: "2000000114",
  statBadges: "2000000115",
  ctaButton: "2000000116",
};

const CustomSection = ({ pageName = "Home" }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.cms?.allSections?.[pageName]);
  const cssData = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);

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
          "3000000089",
          "3000000090",
          "3000000091",
          "3000000092",
          "3000000093",
          "3000000094",
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

  const cards = [
    { title: "Module One", desc: "Performance monitoring data" },
    { title: "Module Two", desc: "User engagement statistics" },
    { title: "Module Three", desc: "System health summary" },
    { title: "Module Four", desc: "Infrastructure status" },
    { title: "Module Five", desc: "Recent deployment logs" },
    { title: "Module Six", desc: "Financial overview" },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans text-slate-900">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative">
        <header className="w-full bg-slate-200 border-b border-slate-300 px-6 py-3.5 flex items-center justify-between text-slate-900 font-bold text-base">
          <div className="flex items-center gap-2 font-black text-lg">
            <span id={ids.brandBadge} className="dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "Analytics Dashboard" }} />
          </div>
          <input type="text" placeholder="Search dashboard..." className="w-64 bg-white/90 border border-slate-300 rounded-full px-4 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400" />
        </header>

        <div className="flex flex-col md:flex-row w-full items-stretch">
          <aside className="w-16 min-w-[4rem] max-w-[4rem] bg-amber-400 rounded-3xl py-6 px-2 flex flex-col items-center justify-between shadow-lg flex-shrink-0 self-stretch my-3 ml-3">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                <div className="w-4 h-4 bg-slate-900 rounded-sm" />
              </div>
            ))}
          </aside>

          <main className="flex-1 min-w-0 flex flex-col">
            <div className="border-b border-slate-200 px-6 pt-4 pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <button className="pb-3 text-slate-900 font-extrabold text-base border-b-2 border-slate-900 tracking-tight">Overview</button>
                {["Analytics", "Reports", "Settings"].map((t) => (
                  <button key={t} className="pb-3 text-slate-400 hover:text-slate-600 font-semibold text-base tracking-tight transition-colors">{t}</button>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col gap-8">
              <div>
                <h1 id={ids.headlineMain} className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "Performance Overview" }} />
                <p id={ids.headlineSub} className="text-sm text-slate-600 mt-1 dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Monitor your key metrics and system activity" }} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((c, idx) => (
                  <div key={idx} className="bg-slate-300 rounded-2xl overflow-hidden relative shadow-sm border border-slate-300 flex flex-col p-4">
                    <div className="h-32 sm:h-36 rounded-xl bg-slate-200 mb-3 flex items-center justify-center">
                        <div className="w-8 h-8 bg-slate-400 rounded-full" />
                    </div>
                    <div className="text-sm font-bold text-slate-900">{c.title}</div>
                    <div className="text-xs text-slate-600 mt-1">{c.desc}</div>
                  </div>
                ))}
              </div>

              <Button id={ids.ctaButton} className="dynamicStyle w-full sm:w-auto px-8 py-3 rounded-full font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm self-start" label={data?.[ids.ctaButton] || "Export Data"} aria-label="Action button" />
            </div>
          </main>

          <aside className="w-full lg:w-80 min-w-[18rem] max-w-[20rem] bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between flex-shrink-0 m-3">
            <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-200 mb-4" />
            <h3 className="text-base font-bold text-slate-900">Actionable Data Insights</h3>
            <div className="flex items-center gap-1.5 text-xs text-amber-500 my-1">
                <span>★★★★★</span> <span className="text-slate-600 font-semibold">4.9/5</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed my-2">Monitor performance metrics and system health in real-time.</p>
            <Button className="w-full py-2.5 rounded-xl font-bold text-xs bg-amber-400 text-slate-900 border-none mb-2" label="View Analytics" />
          </aside>
        </div>

        <div className="bg-slate-50 border-t border-slate-200 p-4 mt-auto rounded-b-3xl grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-300" />
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Project Status</div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CustomSection;