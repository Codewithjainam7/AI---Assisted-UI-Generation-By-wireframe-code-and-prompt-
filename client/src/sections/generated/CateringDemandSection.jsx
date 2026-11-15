import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { fetchElementsByIds } from '../../features/cms/cmsSlice';
import { getImage, errorImage } from '../../utils/getImage';

const ids = {
  heroImage: "2000000173",
  brandBadge: "2000000174",
  headlineMain: "2000000175",
  headlineSub: "2000000176",
  description: "2000000177",
  statBadges: "2000000178",
  ctaButton: "2000000179",
};

const CateringDemand = ({ pageName = "CateringPage" }) => {
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

  const screens = [
    { title: "Browse", desc: "Explore a wide variety of catering menus curated for your team.", img: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=400&q=80", active: 0 },
    { title: "Order", desc: "Customize dietary preferences and schedule delivery with precision.", img: "https://images.unsplash.com/photo-1615485925301-665e7d69273a?auto=format&fit=crop&w=400&q=80", active: 1 },
    { title: "Enjoy", desc: "Delight in fresh, restaurant-quality catering delivered directly to your venue.", img: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=400&q=80", active: 2 }
  ];

  return (
    <div className="w-full min-h-screen bg-slate-950 p-4 sm:p-8 flex flex-col items-center font-sans overflow-x-hidden text-slate-900">
      <div className="text-white text-base sm:text-lg font-black tracking-widest uppercase mb-12 flex items-center gap-2">
        <span id={ids.brandBadge} dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "Catering Demand" }} />
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 w-full max-w-7xl">
        {screens.map((screen, idx) => (
          <div key={idx} className="w-full max-w-[340px] bg-white rounded-[2.5rem] shadow-2xl border-4 border-slate-800 overflow-hidden flex flex-col relative min-h-[600px] p-8 justify-between">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase">
              <span>STEP {idx + 1}</span>
              <span className="text-rose-500 cursor-pointer">DONE</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden shadow-md my-6">
                <img src={screen.img} className="w-full h-full object-cover" alt="food" onError={errorImage} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 text-center tracking-tight">
                {idx === 2 ? <span id={ids.headlineMain} dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || screen.title }} /> : screen.title}
              </h2>
              <p className="text-xs text-slate-600 text-center mt-4 leading-relaxed max-w-[240px]">
                {idx === 2 ? <span id={ids.description} dangerouslySetInnerHTML={{ __html: data?.[ids.description] || screen.desc }} /> : screen.desc}
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex justify-center gap-2">
                {[0, 1, 2].map((s) => (
                  <div key={s} className={`w-2 h-2 rotate-45 ${s === idx ? 'bg-rose-500' : 'bg-slate-200'}`} />
                ))}
              </div>
              
              <div className="flex items-center gap-3 w-full">
                {idx < 2 ? (
                  <button className="text-slate-400 text-xs font-bold uppercase w-full py-3">SKIP</button>
                ) : (
                  <>
                    <button className="text-slate-400 text-xs font-bold uppercase">SKIP</button>
                    <Button id={ids.ctaButton} className="flex-1 py-3.5 rounded-full font-bold bg-slate-900 text-white hover:bg-slate-800 transition shadow-lg text-xs" label={data?.[ids.ctaButton] || "GET STARTED"} />
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CateringDemand;