import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { fetchElementsByIds } from '../../features/cms/cmsSlice';
import { getImage, errorImage } from '../../utils/getImage';

const ids = {
  heroImage: "2000000180",
  brandBadge: "2000000181",
  headlineMain: "2000000182",
  headlineSub: "2000000183",
  description: "2000000184",
  statBadges: "2000000185",
  ctaButton: "2000000186",
};

const CorporatePortal = ({ pageName = "CorporatePage" }) => {
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

  const apps = ["Salesforce", "My file", "Chatter", "Planner", "Cornerstone", "Repository", "Standards"];

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans text-slate-900 overflow-x-hidden">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative text-slate-900">
        
        <header className="w-full bg-slate-200 border-b border-slate-300 px-6 py-3.5 flex items-center justify-between text-slate-900 font-bold text-base">
          <div className="flex items-center gap-2 font-black text-lg text-slate-900">
            <span id={ids.brandBadge} className="dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "CompanyName" }} />
          </div>
          <div className="flex items-center gap-3">
            <input type="text" placeholder="Start typing what are you looking for..." className="w-64 sm:w-80 bg-white border border-slate-300 rounded-full px-4 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400" />
            <span className="text-xs text-slate-500 font-semibold cursor-pointer hidden sm:inline">Advanced search</span>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row w-full items-stretch">
          <aside className="w-full lg:w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
            <div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-slate-200 border-2 border-slate-300 flex items-center justify-center text-slate-400 font-bold">IS</div>
              <span className="text-xs font-bold text-slate-500 mt-2">527 / 378</span>
              <h2 className="text-base font-bold text-slate-900 mt-1">Ivon Stoilov</h2>
            </div>
            <nav className="p-5 flex flex-col gap-3">
              {["Home", "About", "Organisation", "Support", "News"].map((item) => (
                <a key={item} href="#" className={`text-sm font-bold ${item === "Home" ? "text-emerald-600" : "text-slate-600 hover:text-slate-900"}`}>{item}</a>
              ))}
            </nav>
          </aside>

          <main className="flex-1 min-w-0 p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 id={ids.headlineMain} className="text-xl font-black text-slate-900 tracking-tight dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "My applications" }} />
              <a href="#" className="text-xs font-bold text-blue-600 hover:underline">Edit</a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {apps.map((app, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:shadow-xs transition text-center cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-slate-200" />
                  <span className="text-xs font-bold text-slate-800 mt-2 truncate w-full">{app}</span>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm mt-4">
              <img id={ids.heroImage} className="w-full md:w-80 h-48 sm:h-auto object-cover" src={data?.[ids.heroImage] ? getImage(data[ids.heroImage]) : "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"} onError={errorImage} alt="News banner" />
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <span className="text-xs font-bold text-rose-500 uppercase">Today's news</span>
                  <h3 id={ids.headlineSub} className="text-xl font-black text-slate-900 tracking-tight mt-1 dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "The real deal: Company is growing big" }} />
                  <p id={ids.description} className="text-xs text-slate-600 mt-2 leading-relaxed dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "Significant strategic milestones achieved across global operational centers." }} />
                </div>
                <a href="#" className="text-xs font-bold text-slate-900 hover:underline mt-4 inline-flex items-center gap-1">Read full article →</a>
              </div>
            </div>
          </main>

          <aside className="w-full lg:w-72 bg-slate-50 border-l border-slate-200 p-6 flex flex-col gap-6 flex-shrink-0">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Standardization</h4>
              <p className="text-xs text-slate-600">Company standards & compliance protocols</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">My connections</h4>
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white" />)}
              </div>
            </div>
            <Button id={ids.ctaButton} className="w-full py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm text-xs" label={data?.[ids.ctaButton] || "Contact site admin"} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CorporatePortal;