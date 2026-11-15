import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from '../../features/cms/cmsSlice';

const ids = {
  heroImage:    "2000000222",
  brandBadge:   "2000000223",
  headlineMain: "2000000224",
  headlineSub:  "2000000225",
  description:  "2000000226",
  statBadges:   "2000000227",
  ctaButton:    "2000000228",
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
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans text-slate-900 overflow-x-hidden">
      <div className="w-full max-w-7xl bg-white rounded-[2rem] shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col md:flex-row min-h-[800px]">
        
        {/* Sidebar */}
        <aside className="w-full sm:w-64 bg-gradient-to-b from-rose-50/60 via-white to-rose-50/30 border-r border-rose-100/80 flex flex-col p-6">
          <div className="bg-white/90 backdrop-blur-sm border border-rose-100 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm mb-8">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" alt="Kiraa" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md" />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
            </div>
            <h2 className="font-black text-slate-900 text-lg mt-3">Kiraa</h2>
            <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-full mt-2 border border-rose-100">DAILY GOAL: 2,400 KCAL</span>
          </div>
          
          <nav className="flex flex-col gap-2">
            {['Diary', 'Shopping Lists', 'Your Progress', 'Your Profile', 'Settings'].map((item, idx) => (
              <a key={item} href="#" className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${idx === 0 ? 'bg-rose-500 text-white shadow-md' : 'text-slate-500 hover:bg-rose-100/50'}`}>
                {item}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Header Bar */}
          <header className="w-full bg-white border-b border-slate-100 px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center font-black text-sm">HP</div>
              <div>
                <span id={ids.brandBadge} className="block font-black text-base tracking-tight text-slate-900" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "Wellness Page Wireframe" }} />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">HEALTH & NUTRITION STUDIO</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-xs font-bold text-rose-600">14 Day Streak</div>
            </div>
          </header>

          {/* Sub-Nav */}
          <div className="border-b border-slate-100 px-8 pt-4 pb-0 flex flex-col sm:flex-row items-end justify-between gap-4">
            <div className="flex gap-6">
              <button className="pb-3 text-sm font-extrabold text-slate-900 border-b-2 border-rose-500">Meal Plan</button>
              <button className="pb-3 text-sm font-extrabold text-slate-400 hover:text-slate-600">Exercise Plan</button>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs">
              <span className="cursor-pointer">&lt;</span>
              <span id={ids.headlineSub} dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Friday 23rd December" }} />
              <span className="cursor-pointer">&gt;</span>
            </div>
          </div>

          <div className="p-8 flex flex-col gap-8">
            {/* Calorie Hero */}
            <div className="bg-gradient-to-r from-slate-50 to-rose-50/50 border border-slate-200 rounded-2xl p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div>
                <h3 id={ids.headlineMain} className="text-2xl font-black text-slate-900" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "Your Calories" }} />
                <p className="text-sm text-slate-500 mt-1">Target: 2,400 kcal • 401 kcal remaining</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-black text-rose-500">1,999</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Calories</div>
                </div>
              </div>
            </div>

            {/* Meal Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: 'BREAKFAST', kcal: '485 kcal', img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80', desc: 'Avocado Sourdough & Egg' },
                { title: 'MORNING SNACK', kcal: '240 kcal', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80', desc: 'Greek Yogurt & Berry' }
              ].map((m) => (
                <div key={m.title} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
                  <img src={m.img} alt={m.title} className="w-full h-32 object-cover rounded-xl mb-4" />
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black bg-slate-900 text-white px-2 py-1 rounded-lg">{m.title}</span>
                    <span className="text-xs font-bold text-rose-500">{m.kcal}</span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{m.desc}</h4>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <span className="text-xs font-bold text-rose-600 cursor-pointer">+ Log Items</span>
                  </div>
                </div>
              ))}
            </div>

            <Button id={ids.ctaButton} className="w-full sm:w-auto px-8 py-3 rounded-full font-bold bg-rose-500 text-white hover:bg-rose-600 transition text-xs uppercase shadow-lg shadow-rose-200" label={data?.[ids.ctaButton] || "GET STARTED"} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomSection;