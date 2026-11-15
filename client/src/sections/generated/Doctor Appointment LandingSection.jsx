import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { fetchElementsByIds } from '../../features/cms/cmsSlice';
import { getImage, errorImage } from '../../utils/getImage';

const ids = {
  heroImage: "2000000208",
  brandBadge: "2000000209",
  headlineMain: "2000000210",
  headlineSub: "2000000211",
  description: "2000000212",
  statBadges: "2000000213",
  ctaButton: "2000000214",
};

const CustomSection = ({ pageName = "Home" }) => {
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
    Object.values(ids).forEach((id) => {
      if (id && cssData?.[id]) {
        const el = document.getElementById(id);
        if (el) el.style.cssText = cssData[id];
      }
    });
  }, [cssData]);

  const stats = (data?.[ids.statBadges] || "Trusted,Certified,Fast").split(",");

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans text-slate-900 overflow-x-hidden">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row relative">
        <div className="w-full md:w-1/2 bg-slate-200">
          <img
            id={ids.heroImage}
            className="w-full h-full min-h-[300px] object-cover"
            src={data?.[ids.heroImage] ? getImage(data[ids.heroImage]) : "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80"}
            onError={errorImage}
            alt="Medical Hero"
          />
        </div>
        <div className="w-full md:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
          <div id={ids.brandBadge} className="text-blue-500 font-bold text-xs uppercase tracking-widest mb-4" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "MEDICAL CARE" }} />
          <h1 id={ids.headlineMain} className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "Expert Medical Care at Your Convenience" }} />
          <h2 id={ids.headlineSub} className="text-xl text-slate-500 mb-6 font-medium" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Connecting patients with top-rated professionals." }} />
          <p id={ids.description} className="text-slate-600 mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "Schedule your consultation with ease using our secure appointment booking system." }} />
          
          <div id={ids.statBadges} className="flex gap-4 mb-10">
            {stats.map((stat, i) => (
              <span key={i} className="px-4 py-1 bg-slate-100 rounded-full text-slate-700 text-xs font-bold border border-slate-200">
                {stat}
              </span>
            ))}
          </div>

          <div>
            <Button
              id={ids.ctaButton}
              className="px-8 py-4 rounded-full font-bold bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-lg"
              label={data?.[ids.ctaButton] || "BOOK APPOINTMENT"}
              aria-label="Book Appointment"
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomSection;