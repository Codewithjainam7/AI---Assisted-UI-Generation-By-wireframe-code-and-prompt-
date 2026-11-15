import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from '../../features/cms/cmsSlice';

const ids = {
  heroImage:    "2000000229",
  brandBadge:   "2000000230",
  headlineMain: "2000000231",
  headlineSub:  "2000000232",
  description:  "2000000233",
  statBadges:   "2000000234",
  ctaButton:    "2000000235",
};

const CustomSection = ({ pageName = "Home", data: propData, cssData: propCss, fetchElementsByIds: propFetch }) => {
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
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 flex items-center justify-center font-sans text-slate-900">
      <div className="w-full max-w-7xl bg-white rounded-[2rem] shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col md:flex-row min-h-[800px]">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-gradient-to-b from-rose-50/60 via-white to-rose-50/30 border-r border-rose-100/80 flex flex-col justify-between flex-shrink-0 p-5">
          <div>
            <div className="bg-white/80 backdrop-blur-sm border border-rose-200/60 rounded-2xl p-5 flex flex-col items-center text-center shadow-xs mb-6">
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" alt="Kiraa" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md" />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <h2 className="font-black text-slate-900 text-base mt-3 tracking-tight">Kiraa</h2>
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/60 mt-1">DAILY GOAL: 2,400 KCAL</span>
            </div>
            <nav className="flex flex-col gap-1.5">
              {["Diary", "Shopping Lists", "Your Progress", "Your Profile", "Settings"].map((item, i) => (
                <button key={item} className={`${i === 0 ? "bg-rose-500 text-white shadow-sm shadow-rose-500/25 font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-3" : "text-slate-500 font-medium px-3.5 py-2.5 rounded-xl text-xs hover:bg-white transition-colors"}`}>
                  {item}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <header className="w-full bg-white border-b border-slate-100 px-6 sm:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center font-black text-sm shadow-sm shadow-rose-500/20">HP</div>
              <div>
                <span id={ids.brandBadge} className="block font-black text-base tracking-tight text-slate-900" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "HappyPiggy" }} />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider -mt-0.5">HEALTH & NUTRITION</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200/60 text-xs font-bold text-rose-600">14 Day Streak</div>
          </header>

          <div className="border-b border-slate-100 px-6 sm:px-8 pt-4 flex items-center justify-between">
            <div className="flex gap-6">
              <button className="pb-3 text-sm font-extrabold text-slate-900 border-b-2 border-rose-500">Meal Plan</button>
              <button className="pb-3 text-sm font-extrabold text-slate-400 hover:text-slate-600 transition-colors">Exercise Plan</button>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200 text-slate-700 font-semibold text-xs shadow-2xs">
              <span className="cursor-pointer font-bold">&lt;</span>
              <span id={ids.headlineSub} dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Friday 23rd Dec" }} />
              <span className="cursor-pointer font-bold">&gt;</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 flex flex-col gap-6">
            <div className="bg-gradient-to-br from-slate-50 via-white to-rose-50/30 border border-slate-200/80 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h3 id={ids.headlineMain} className="text-2xl font-black text-slate-900 tracking-tight" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "Your Calories" }} />
                <p className="text-slate-500 text-sm mt-1">Target: 2,400 kcal • 401 kcal remaining for dinner</p>
                <div className="flex gap-2 mt-4">
                  <span className="px-2 py-1 bg-rose-50 text-rose-700 text-[10px] rounded border border-rose-200 font-bold">142g Protein</span>
                  <span className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] rounded border border-amber-200 font-bold">185g Carbs</span>
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] rounded border border-emerald-200 font-bold">54g Fats</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-rose-500">1,999</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Calories Consumed</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Avocado Sourdough & Poached Egg", kcal: "485 kcal", img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80", tag: "BREAKFAST" },
                { title: "Greek Yogurt & Wild Berry Bowl", kcal: "240 kcal", img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80", tag: "MORNING SNACK" }
              ].map((card) => (
                <div key={card.tag} className="group bg-white rounded-2xl border border-slate-200/80 hover:border-rose-300 overflow-hidden shadow-xs hover:shadow-md transition-all">
                  <img src={card.img} className="w-full h-40 object-cover" alt={card.tag} />
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-900 text-white font-black text-[10px] uppercase">{card.tag}</span>
                      <span className="text-xs font-bold text-rose-500">{card.kcal}</span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{card.title}</h4>
                    <button className="text-xs font-bold text-rose-600 mt-3 hover:underline">Log items +</button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button id={ids.ctaButton} className="w-fit px-8 py-3.5 rounded-full font-bold bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 transition shadow-md text-xs uppercase" label={data?.[ids.ctaButton] || "GET STARTED"} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomSection;