import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from '../../features/cms/cmsSlice';

const ids = {
  heroImage:    "2000000264",
  brandBadge:   "2000000265",
  headlineMain: "2000000266",
  headlineSub:  "2000000267",
  description:  "2000000268",
  statBadges:   "2000000269",
  ctaButton:    "2000000270",
};

const WellnessDashboard = ({ pageName = "Home", data: propData, cssData: propCss, fetchElementsByIds: propFetch }) => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.cms?.allSections?.[pageName]);
  const reduxCss = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);
  const data = propData || reduxData || {};
  const cssData = propCss || reduxCss || {};

  useEffect(() => {
    if (propFetch) {
      propFetch(Object.values(ids));
    } else if (dispatch) {
      dispatch(fetchElementsByIds({
        elementIds: Object.values(ids),
        pageName,
      }));
    }
  }, [dispatch, pageName, propFetch]);

  useEffect(() => {
    Object.values(ids).forEach((id) => {
      if (id && cssData?.[id]) {
        const el = document.getElementById(id);
        if (el) el.style.cssText = cssData[id];
      }
    });
  }, [cssData]);

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans text-slate-900 overflow-x-hidden">
      <div className="w-full max-w-7xl bg-white rounded-[2rem] shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col relative text-slate-900">
        
        <header className="w-full bg-white border-b border-slate-100 px-6 sm:px-8 py-4 flex items-center justify-between text-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center font-black text-sm shadow-sm shadow-rose-500/20">HP</div>
            <div>
              <span id={ids.brandBadge} className="font-black text-base tracking-tight text-slate-900" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "Wellness Page Wireframe" }} />
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider -mt-0.5">HEALTH & NUTRITION STUDIO</div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200/60 text-xs font-bold text-rose-600 shadow-2xs">14 Day Streak</div>
          </div>
        </header>

        <div className="flex flex-col md:flex-row w-full items-stretch">
          <aside className="w-full sm:w-64 bg-gradient-to-b from-rose-50/60 via-white to-rose-50/30 border-r border-rose-100/80 flex flex-col justify-between flex-shrink-0 p-5">
            <div>
              <div className="bg-white/80 backdrop-blur-sm border border-rose-200/60 rounded-2xl p-5 flex flex-col items-center text-center shadow-xs mb-6">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" className="w-20 h-20 rounded-full border-4 border-white shadow-md" alt="Kiraa" />
                <h2 className="font-black text-slate-900 text-base mt-3 tracking-tight">Kiraa</h2>
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/60 mt-1 shadow-2xs">DAILY GOAL: 2,400 KCAL</span>
              </div>
              <nav className="flex flex-col gap-1.5">
                {['Diary', 'Shopping Lists', 'Your Progress', 'Your Profile', 'Settings'].map((item, i) => (
                  <button key={item} className={`${i === 0 ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/25' : 'text-slate-500 hover:bg-slate-100'} font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-3 transition`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" /> {item}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <main className="flex-1 min-w-0 flex flex-col">
            <div className="border-b border-slate-100 px-6 sm:px-8 pt-4 pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex gap-6">
                <button className="pb-3 text-sm font-extrabold tracking-tight text-slate-900 border-b-2 border-rose-500">Meal Plan</button>
                <button className="pb-3 text-sm font-extrabold tracking-tight text-slate-400 hover:text-slate-600 transition-colors">Exercise Plan</button>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs shadow-2xs">
                <span className="text-slate-400 font-bold cursor-pointer">&lt;</span>
                <span id={ids.headlineSub} dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Friday 23rd December" }} />
                <span className="text-slate-400 font-bold cursor-pointer">&gt;</span>
                <span className="text-[10px] text-slate-400 font-bold border-l pl-1.5">Today</span>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col gap-6">
              <div className="bg-gradient-to-br from-slate-50 via-white to-rose-50/30 border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <h3 id={ids.headlineMain} className="text-2xl font-black text-slate-900 tracking-tight" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "Your Calories" }} />
                  <p className="text-sm text-slate-500 mt-1">Target: 2,400 kcal • 401 kcal remaining for dinner</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black text-rose-500">1,999</span>
                    <span className="text-xs font-bold text-slate-400 leading-tight">CALORIES<br/>CONSUMED</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">Protein (92%)</span>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">Carbs (77%)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: "BREAKFAST", img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80", name: "Avocado Sourdough & Poached Egg", macros: "24g P • 18g F • 42g C" },
                  { title: "MORNING SNACK", img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80", name: "Greek Yogurt & Wild Berry Bowl", macros: "16g P • 4g F • 28g C" }
                ].map((meal) => (
                  <div key={meal.title} className="group bg-white rounded-2xl border border-slate-200/80 hover:border-rose-300 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col">
                    <img className="w-full h-44 object-cover" src={meal.img} alt={meal.title} />
                    <div className="flex items-center justify-between p-4 pb-0">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-black text-[10px] tracking-wider uppercase">{meal.title}</span>
                      <span className="text-xs font-bold text-rose-500">485 kcal</span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-sm mt-2 px-4">{meal.name}</h4>
                    <span className="text-xs text-slate-500 mt-1 px-4">{meal.macros}</span>
                    <div className="p-4 pt-2">
                      <span className="text-xs font-bold text-rose-600 cursor-pointer hover:underline inline-flex items-center gap-1">+ Log items</span>
                    </div>
                  </div>
                ))}
              </div>

              <Button id={ids.ctaButton} className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 transition shadow-md shadow-rose-500/25 self-start text-xs uppercase tracking-wider" label={data?.[ids.ctaButton] || "Log Daily Nutrition"} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default WellnessDashboard;