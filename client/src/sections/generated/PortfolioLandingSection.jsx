import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from '../../features/cms/cmsSlice';

const ids = {
  heroImage: "2000000285",
  brandBadge: "2000000286",
  headlineMain: "2000000287",
  headlineSub: "2000000288",
  description: "2000000289",
  statBadges: "2000000290",
  ctaButton: "2000000291",
};

const CustomSection = ({ pageName = "Home", data: propData, cssData: propCss, fetchElementsByIds: propFetch }) => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.cms?.allSections?.[pageName]);
  const reduxCss = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);
  const data = propData || reduxData || {};
  const cssData = propCss || reduxCss || {};

  const [activePage, setActivePage] = useState('Home');
  const [selectedService, setSelectedService] = useState('Project Inquiry');
  const [selectedDate, setSelectedDate] = useState('Mon, Nov 16');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  useEffect(() => {
    if (propFetch) propFetch(Object.values(ids));
    else if (dispatch) dispatch(fetchElementsByIds({ elementIds: Object.values(ids), pageName }));
  }, [dispatch, pageName, propFetch]);

  const renderNav = () => (
    <header className="flex items-center justify-between p-6 border-b border-slate-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg">CP</div>
        <span id={ids.brandBadge} className="font-black text-xl tracking-tighter" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "CreativePortfolio" }} />
      </div>
      <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
        {['Home', 'Portfolio', 'About', 'Contact'].map((item) => (
          <button 
            key={item} 
            onClick={() => setActivePage(item)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${activePage === item ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            {item}
          </button>
        ))}
      </nav>
      <Button onClick={() => setActivePage('Appointments')} className="bg-indigo-600 text-white px-5 py-2 rounded-full font-bold text-xs hover:bg-indigo-700" label="Get Started" />
    </header>
  );

  const renderHome = () => (
    <div className="flex flex-col lg:flex-row items-center gap-12 p-8 lg:p-16">
      <div className="flex-1 space-y-6">
        <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">PREMIER DIGITAL SOLUTIONS</span>
        <h1 id={ids.headlineMain} className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "Elevating Digital Experiences" }} />
        <p id={ids.headlineSub} className="text-xl text-slate-500 font-medium" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Professional design and development solutions for modern brands." }} />
        <div className="flex gap-4">
          <Button onClick={() => setActivePage('Appointments')} className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-indigo-200" label="Start Project" />
          <Button className="bg-slate-100 text-slate-900 px-8 py-4 rounded-full font-bold" label="View Portfolio" />
        </div>
      </div>
      <div className="flex-1 w-full">
        <img id={ids.heroImage} src={data?.[ids.heroImage] || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80"} alt="Hero" className="rounded-[2rem] w-full h-[400px] object-cover shadow-2xl" />
      </div>
    </div>
  );

  const renderForm = () => (
    <div className="p-8 max-w-2xl mx-auto">
      {!isSubmitted ? (
        <div className="space-y-6">
          <h2 className="text-3xl font-black">Get in Touch</h2>
          <div className="space-y-4">
            {['Project Inquiry', 'Collaboration', 'Consulting', 'Other'].map((s) => (
              <button key={s} onClick={() => setSelectedService(s)} className={`w-full p-4 rounded-xl border text-left ${selectedService === s ? 'bg-indigo-50 border-indigo-500' : 'border-slate-200'}`}>
                {s}
              </button>
            ))}
          </div>
          <Button onClick={() => { setBookingRef('REF-9923'); setIsSubmitted(true); }} className="w-full bg-indigo-600 py-4 text-white font-bold rounded-xl" label="Send Request" />
        </div>
      ) : (
        <div className="text-center p-12 bg-emerald-50 rounded-3xl border border-emerald-100">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-2xl font-black">Request Submitted!</h2>
          <p className="text-slate-600 mt-2">Ref: {bookingRef}</p>
          <Button className="mt-6 bg-slate-900 text-white rounded-full px-6 py-3" label="Done" onClick={() => setIsSubmitted(false)} />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-12 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto bg-white rounded-[2rem] shadow-2xl border border-slate-100 min-h-[800px] flex flex-col">
        {renderNav()}
        <div className="flex-1">
          {activePage === 'Home' && renderHome()}
          {activePage === 'Appointments' && renderForm()}
        </div>
      </div>
    </div>
  );
};

export default CustomSection;