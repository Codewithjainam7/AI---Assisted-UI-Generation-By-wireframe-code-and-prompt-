import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from '../../features/cms/cmsSlice';
import { getImage, errorImage } from '../../utils/getImage';

const ids = {
  heroImage:    "2000000236",
  brandBadge:   "2000000237",
  headlineMain: "2000000238",
  headlineSub:  "2000000239",
  description:  "2000000240",
  statBadges:   "2000000241",
  ctaButton:    "2000000242",
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
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-12 flex items-center justify-center font-sans">
      <div className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Media */}
        <div className="w-full md:w-1/2 bg-slate-900 relative overflow-hidden h-64 md:h-auto">
          <img 
            id={ids.heroImage}
            src={data?.[ids.heroImage] || "https://images.unsplash.com/photo-1579684385127-1ecd15d5bf87?auto=format&fit=crop&q=80&w=1200"}
            alt="Medical Professional"
            className="w-full h-full object-cover opacity-80 mix-blend-overlay"
            onError={errorImage}
          />
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="text-white text-center">
              <span id={ids.brandBadge} className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold tracking-widest uppercase mb-4" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "DOC APPOINT" }} />
            </div>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center gap-6">
          <div>
            <h1 id={ids.headlineMain} className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "Expert Medical Care at Your Fingertips" }} />
            <h2 id={ids.headlineSub} className="text-xl text-blue-600 font-medium" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Book appointments seamlessly." }} />
          </div>

          <p id={ids.description} className="text-slate-600 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "Access top-tier doctors and schedule your visit using our simplified appointment form." }} />

          <div id={ids.statBadges} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Response Time</p>
              <p className="text-xl font-bold text-slate-900">Under 24h</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Doctor Rating</p>
              <p className="text-xl font-bold text-slate-900">4.9 / 5.0</p>
            </div>
          </div>

          <div className="mt-4">
            <Button 
              id={ids.ctaButton} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95" 
              label={data?.[ids.ctaButton] || "BOOK APPOINTMENT"} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomSection;