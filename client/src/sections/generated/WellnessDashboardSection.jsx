import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from "../../features/cms/cmsSlice";
import { getImage, errorImage } from "../../utils/getImage";

const WellnessDashboard = ({ pageName = "Home" }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.cms?.allSections?.[pageName]);
  const cssData = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);

  const ids = {
    heroImage: "2000000075",
    brandBadge: "2000000076",
    headlineMain: "2000000077",
    headlineSub: "2000000078",
    description: "2000000079",
    statBadges: "2000000080",
    ctaButton: "2000000081",
  };

  useEffect(() => {
    dispatch(fetchElementsByIds({
      elementIds: [
        ids.heroImage, ids.brandBadge, ids.headlineMain, ids.headlineSub,
        ids.description, ids.statBadges, ids.ctaButton,
        "3000000057", "3000000058", "3000000059", "3000000060"
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

  return (
    <div className="w-full min-h-screen bg-[#f1f5f9] p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans text-slate-900 overflow-x-hidden">
      <div className="w-full max-w-7xl bg-white rounded-3xl sm:rounded-[2.5rem] shadow-2xl border border-slate-200 p-5 sm:p-8 flex flex-col gap-8">
        
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <h1 id={ids.brandBadge} className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "Wellness Page Wireframe" }} />
          <div className="text-sm text-slate-500 font-medium">HappyPiggy System v1.0</div>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 bg-pink-100/70 border border-pink-200 rounded-2xl p-5 flex flex-col gap-6 flex-shrink-0 self-start">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-slate-700 font-black text-2xl shadow-inner border-2 border-pink-200">K</div>
              <h2 className="font-bold text-slate-800 text-lg mt-3">Kiraa</h2>
            </div>
            <nav className="flex flex-col gap-3">
              {["Diary", "Shopping Lists", "Your Progress", "Your Profile", "Settings"].map((item) => (
                <div key={item} className="text-slate-800 font-medium text-sm hover:text-slate-950 py-1.5 cursor-pointer flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400" /> {item}
                </div>
              ))}
            </nav>
          </aside>

          <main className="flex-1 min-w-0 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex gap-6">
                <span className="font-bold text-slate-900 border-b-2 border-slate-900 pb-1 cursor-pointer">Meal Plan</span>
                <span className="text-slate-500 hover:text-slate-700 cursor-pointer">Exercise Plan</span>
              </div>
              <div className="text-sm text-slate-600 font-medium">{"< Friday 23rd December > Today"}</div>
            </div>

            <div id={ids.statBadges} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 id={ids.headlineMain} className="text-lg font-extrabold text-slate-900 dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "Your Calories" }} />
                <p id={ids.headlineSub} className="text-sm text-slate-600 dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Daily nutritional tracking summary" }} />
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border-4 border-rose-500 flex items-center justify-center font-black text-xs text-rose-600 bg-rose-50">PIE</div>
                <div className="text-2xl font-black text-slate-900">1999 <span className="text-sm font-medium text-slate-500">Calories</span></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "BREAKFAST", desc: "Placeholder for meal content" },
                { title: "MORNING SNACK", desc: "Placeholder for snack content" }
              ].map((card, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-slate-700 text-white text-xs font-bold uppercase px-3 py-1.5 inline-block rounded-br-lg">{card.title}</div>
                  <div className="h-40 bg-slate-100 flex items-center justify-center text-slate-400">
                    <img id={ids.heroImage} className="w-full h-full object-cover opacity-80 dynamicStyle2" src={data?.[ids.heroImage] ? getImage(data[ids.heroImage]) : getImage("https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80")} onError={errorImage} alt="Content" />
                  </div>
                  <div className="p-4">
                    <h4 className="text-slate-900 font-bold mb-1">{card.title}</h4>
                    <p className="text-slate-500 text-sm">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button id={ids.ctaButton} className="w-full md:w-max px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors dynamicStyle" label={data?.[ids.ctaButton] || "GET STARTED"} aria-label="Action button" />
          </main>
        </div>
      </div>
    </div>
  );
};

export default WellnessDashboard;