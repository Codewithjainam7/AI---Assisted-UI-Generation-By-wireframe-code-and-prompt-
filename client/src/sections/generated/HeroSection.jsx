import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from "../../features/cms/cmsSlice";
import { getImage, errorImage } from "../../utils/getImage";

const ids = {
  heroImage:    "TBD-heroImage",
  brandBadge:   "TBD-brandBadge",
  headlineMain: "TBD-headlineMain",
  headlineSub:  "TBD-headlineSub",
  description:  "TBD-description",
  statBadges:   "TBD-statBadges",
  ctaButton:    "TBD-ctaButton",
};

const WellnessDashboardSection = ({ pageName = "Home" }) => {
  const dispatch = useDispatch();
  const data    = useSelector((state) => state.cms?.allSections?.[pageName]);
  const cssData = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);

  useEffect(() => {
    dispatch(fetchElementsByIds({
      elementIds: Object.values(ids),
      pageName,
    }));
  }, [dispatch, pageName]);

  useEffect(() => {
    Object.values(ids).forEach((id) => {
      if (id && cssData?.[id]) {
        const el = document.getElementById(id);
        if (el) el.style.cssText = cssData[id];
      }
    });
  }, [cssData]);

  return (
    <div className="w-full p-2 sm:p-4 flex items-center justify-center font-sans text-slate-900">
      <div className="w-full max-w-7xl bg-white rounded-[2rem] shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col relative text-slate-900">
        
        {/* Top Header Bar */}
        <header className="w-full bg-white border-b border-slate-100 px-6 sm:px-8 py-4 flex items-center justify-between text-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center font-black text-sm shadow-sm shadow-rose-500/20">
              HP
            </div>
            <div className="flex flex-col">
              <span id={ids.brandBadge} className="font-black text-base tracking-tight text-slate-900 dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "HappyPiggy" }} />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider -mt-0.5">Health & Nutrition Studio</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search recipes, ingredients, logs..."
                className="w-64 bg-slate-50 border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
              <svg className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200/60 text-xs font-bold text-rose-600 shadow-2xs">
              <span>14 Day Streak</span>
            </div>
          </div>
        </header>

        {/* Window Body: Sidebar + Main Content */}
        <div className="flex flex-col md:flex-row w-full items-stretch">
          
          
          {/* Left Profile Sidebar */}
          <aside className="w-full sm:w-64 bg-gradient-to-b from-rose-50/60 via-white to-rose-50/30 border-r border-rose-100/80 flex flex-col justify-between flex-shrink-0 p-5">
            <div>
              {/* Profile Card */}
              <div className="bg-white/80 backdrop-blur-sm border border-rose-200/60 rounded-2xl p-5 flex flex-col items-center text-center shadow-xs mb-6">
                <div className="relative">
                  <div className="w-18 h-18 rounded-full overflow-hidden bg-rose-100 p-0.5 border-2 border-white shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                      alt="Kiraa"
                      className="w-full h-full object-cover rounded-full"
                      onError={errorImage}
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" title="Active"></span>
                </div>
                <h2 className="font-black text-slate-900 text-base mt-3 tracking-tight">Kiraa</h2>
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/60 mt-1 shadow-2xs">Daily Goal: 2,400 kcal</span>
              </div>

              {/* Navigation Menu */}
              <nav className="flex flex-col gap-1.5">
                
                <div
                  key="Diary"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer bg-rose-500 text-white shadow-sm shadow-rose-500/25 font-bold"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>Diary</span>
                </div>

                <div
                  key="Shopping Lists"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer text-slate-600 hover:text-slate-900 hover:bg-rose-100/60"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span>Shopping Lists</span>
                </div>

                <div
                  key="Your Progress"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer text-slate-600 hover:text-slate-900 hover:bg-rose-100/60"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span>Your Progress</span>
                </div>

                <div
                  key="Your Profile"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer text-slate-600 hover:text-slate-900 hover:bg-rose-100/60"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span>Your Profile</span>
                </div>

                <div
                  key="Settings"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer text-slate-600 hover:text-slate-900 hover:bg-rose-100/60"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span>Settings</span>
                </div>
              </nav>
            </div>
          </aside>

          {/* Central Main Content */}
          <main className="flex-1 min-w-0 flex flex-col">
            
            
            {/* Sub-header Navigation Tabs */}
            <div className="border-b border-slate-100 px-6 sm:px-8 pt-4 pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                
                <button
                  key="Meal Plan"
                  className="pb-3 text-sm font-extrabold tracking-tight transition-colors text-slate-900 border-b-2 border-rose-500"
                >
                  Meal Plan
                </button>

                <button
                  key="Exercise Plan"
                  className="pb-3 text-sm font-extrabold tracking-tight transition-colors text-slate-400 hover:text-slate-600"
                >
                  Exercise Plan
                </button>
              </div>
              
              <div className="flex items-center gap-2 pb-2 text-right">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs shadow-2xs">
                  <span className="text-slate-400 font-bold cursor-pointer">&lt;</span>
                  <span id={ids.headlineSub} className="dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Friday 23rd December Today" }} />
                  <span className="text-slate-400 font-bold cursor-pointer">&gt;</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col gap-6">
              
              {/* Calorie Hero Block */}
              <div className="bg-gradient-to-br from-slate-50 via-white to-rose-50/30 border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-rose-500">Daily Nutritional Target</span>
                  <h3 id={ids.headlineMain} className="text-2xl font-black text-slate-900 tracking-tight dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "Wellness Page Wireframe" }} />
                  <p className="text-xs text-slate-500">Target: 2,400 kcal &bull; 401 kcal remaining for dinner</p>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  {/* Circular Calorie Gauge */}
                  <div className="flex items-center gap-3.5 bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <svg className="w-12 h-12 text-rose-500 flex-shrink-0" viewBox="0 0 36 36">
                      <path className="text-slate-100" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="text-rose-500" strokeDasharray="83, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div className="flex flex-col">
                      <span className="text-xl font-black text-slate-900 tracking-tight leading-none">1999 Calories</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">83% of daily goal</span>
                    </div>
                  </div>

                  {/* Macro Pills */}
                  <div className="hidden sm:flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Protein: 142g / 160g (88%)</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span>Carbs: 185g / 220g (84%)</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      <span>Healthy Fats: 54g / 65g (83%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Meal Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div key="0" className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group">
                  {/* Food Image with Floating Time & Calorie Tags */}
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80"
                      alt="BREAKFAST"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={errorImage}
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white tracking-wider uppercase">
                      BREAKFAST
                    </div>
                    
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black text-rose-600 shadow-sm">
                      485 kcal
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                    <div>
                      <h4 className="font-black text-slate-900 text-base tracking-tight">Avocado Sourdough & Poached Egg</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">Two poached farm eggs, sliced Hass avocado, chili flakes on artisanal sourdough toast.</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500">
                      <span>24g P • 18g F • 42g C</span>
                      <span className="text-rose-600 font-bold hover:underline cursor-pointer">+ Log items</span>
                    </div>
                  </div>
                </div>

                <div key="1" className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group">
                  {/* Food Image with Floating Time & Calorie Tags */}
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80"
                      alt="MORNING SNACK"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={errorImage}
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white tracking-wider uppercase">
                      MORNING SNACK
                    </div>
                    
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black text-rose-600 shadow-sm">
                      240 kcal
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                    <div>
                      <h4 className="font-black text-slate-900 text-base tracking-tight">Greek Yogurt & Wild Berry Bowl</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">Organic whole-milk Greek yogurt topped with fresh wild berries, raw clover honey & chia seeds.</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500">
                      <span>16g P • 4g F • 28g C</span>
                      <span className="text-rose-600 font-bold hover:underline cursor-pointer">+ Log items</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="pt-2">
                <Button
                  id={ids.ctaButton}
                  className="dynamicStyle w-full sm:w-auto px-8 py-3.5 rounded-full font-bold bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-md shadow-rose-500/25 transition-all text-xs tracking-wider uppercase"
                  label={data?.[ids.ctaButton] || "GET STARTED"}
                  aria-label="Action button"
                />
              </div>

            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default WellnessDashboardSection;