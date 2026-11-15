import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { fetchElementsByIds } from '../../features/cms/cmsSlice';
import { getImage, errorImage } from '../../utils/getImage';

const ids = {
  heroImage: "2000000215",
  brandBadge: "2000000216",
  headlineMain: "2000000217",
  headlineSub: "2000000218",
  description: "2000000219",
  statBadges: "2000000220",
  ctaButton: "2000000221",
};

const WellnessDashboard = ({ pageName = "Home" }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.cms?.allSections?.[pageName]);
  const cssData = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);

  useEffect(() => {
    dispatch(fetchElementsByIds({
      elementIds: Object.values(ids),
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

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans text-slate-900 overflow-x-hidden">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative text-slate-900">
        
        <header className="w-full bg-slate-200 border-b border-slate-300 px-6 py-3.5 flex items-center justify-between text-slate-900 font-bold text-base">
          <div className="flex items-center gap-2 font-black text-lg text-slate-900">
            <span id={ids.brandBadge} dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "HappyPiggy" }} />
          </div>
        </header>

        <div className="flex flex-col md:flex-row w-full items-stretch">
          <aside className="w-full sm:w-60 md:w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 self-stretch">
            <div className="bg-pink-100 border-b border-pink-200 p-6 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center border-2 border-pink-200 text-slate-400 overflow-hidden">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
              <h2 className="text-center font-bold text-slate-800 text-base mt-2.5">Kiraa</h2>
            </div>
            <nav className="p-5 flex flex-col gap-3.5 text-slate-600 font-medium text-sm">
              {["Diary", "Shopping Lists", "Your Progress", "Your Profile", "Settings"].map((item) => (
                <div key={item} className="cursor-pointer hover:text-rose-500 transition-colors">{item}</div>
              ))}
            </nav>
          </aside>

          <main className="flex-1 min-w-0 flex flex-col">
            <div className="border-b border-slate-200 px-6 pt-4 pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex gap-6">
                <button className="pb-3 text-slate-900 font-extrabold text-base border-b-2 border-slate-900 tracking-tight">Meal Plan</button>
                <button className="pb-3 text-slate-400 hover:text-slate-600 font-semibold text-base tracking-tight transition-colors">Exercise Plan</button>
              </div>
              <div className="flex flex-col items-end pb-2 text-right">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-sm">
                  <span className="text-slate-400 cursor-pointer">&lt;</span>
                  <span id={ids.headlineSub} dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Friday 23rd December" }} />
                  <span className="text-slate-400 cursor-pointer">&gt;</span>
                </div>
                <span className="text-xs text-slate-500 font-bold">Today</span>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <h3 id={ids.headlineMain} className="text-xl font-extrabold text-rose-500 tracking-tight" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "Your Calories" }} />
                <div className="flex items-center gap-4">
                  <svg className="w-14 h-14 text-slate-800 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">1999 Calories</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-slate-300 rounded-2xl overflow-hidden relative shadow-sm border border-slate-300 flex flex-col p-4">
                  <div className="h-36 sm:h-40 rounded-xl bg-slate-200 mb-3 flex items-center justify-center">
                    <svg className="w-10 h-10 text-slate-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l-5.5 9h11L12 2zm0 18l-5.5-9h11L12 20z"/></svg>
                  </div>
                  <div className="text-sm font-bold text-slate-900 uppercase">Breakfast</div>
                  <div className="text-xs text-slate-600 mt-1">View and edit your breakfast meal details.</div>
                </div>
                <div className="bg-slate-300 rounded-2xl overflow-hidden relative shadow-sm border border-slate-300 flex flex-col p-4">
                  <div className="h-36 sm:h-40 rounded-xl bg-slate-200 mb-3 flex items-center justify-center">
                    <svg className="w-10 h-10 text-slate-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l-5.5 9h11L12 2zm0 18l-5.5-9h11L12 20z"/></svg>
                  </div>
                  <div className="text-sm font-bold text-slate-900 uppercase">Morning Snack</div>
                  <div className="text-xs text-slate-600 mt-1">View and edit your morning snack details.</div>
                </div>
              </div>

              <Button 
                id={ids.ctaButton} 
                className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm self-start" 
                label={data?.[ids.ctaButton] || "GET STARTED"} 
                aria-label="Action button" 
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default WellnessDashboard;