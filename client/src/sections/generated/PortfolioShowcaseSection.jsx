import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from '../../features/cms/cmsSlice';

const ids = {
  heroImage: "2000000278",
  brandBadge: "2000000279",
  headlineMain: "2000000280",
  headlineSub: "2000000281",
  description: "2000000282",
  ctaButton: "2000000284",
};

const CustomSection = ({ pageName = "Home", data: propData, cssData: propCss, fetchElementsByIds: propFetch }) => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.cms?.allSections?.[pageName]);
  const reduxCss = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);
  const data = propData || reduxData || {};
  const cssData = propCss || reduxCss || {};

  const [activePage, setActivePage] = useState('Home');
  const [selectedService, setSelectedService] = useState('Web Design');
  const [selectedSpecialist, setSelectedSpecialist] = useState('Jordan Hayes');
  const [selectedDate, setSelectedDate] = useState('Mon, Nov 16');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  useEffect(() => {
    if (propFetch) {
      propFetch(Object.values(ids));
    } else if (dispatch) {
      dispatch(fetchElementsByIds({ elementIds: Object.values(ids), pageName }));
    }
  }, [dispatch, pageName, propFetch]);

  const renderNav = () => (
    <header className="flex items-center justify-between p-6 bg-white border-b border-slate-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black">AC</div>
        <span id={ids.brandBadge} className="font-bold text-xl tracking-tighter" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "ApexCreative" }} />
      </div>
      <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-full">
        {['Home', 'Portfolio', 'Services', 'Contact', 'Appointments'].map((item) => (
          <button 
            key={item} 
            onClick={() => setActivePage(item)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${activePage === item ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
          >
            {item}
          </button>
        ))}
      </nav>
      <Button label="Consult Now" className="hidden sm:flex bg-indigo-600 text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-indigo-700" onClick={() => setActivePage('Appointments')} />
    </header>
  );

  const renderHome = () => (
    <div className="p-8 lg:p-16">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">Verified Agency</span>
          <h1 id={ids.headlineMain} className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] mt-6" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "Elevating Digital Experiences" }} />
          <p id={ids.headlineSub} className="text-xl text-slate-500 mt-4" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Strategic design and development for modern brands." }} />
          <div className="flex gap-4 mt-8">
            <Button label="View Portfolio" className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold" />
            <Button label="Contact Us" className="bg-slate-100 text-slate-900 px-8 py-4 rounded-full font-bold" />
          </div>
        </div>
        <img id={ids.heroImage} src={data?.[ids.heroImage] || "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80"} className="rounded-3xl shadow-2xl" alt="Hero" />
      </div>
    </div>
  );

  const renderBooking = () => (
    <div className="max-w-3xl mx-auto p-12">
      {!isSubmitted ? (
        <div className="space-y-8">
          <h2 className="text-3xl font-black">Schedule Consultation</h2>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Service</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['Web Design', 'Brand Identity', 'UI/UX'].map(s => (
                <button key={s} onClick={() => setSelectedService(s)} className={`px-4 py-2 rounded-full border text-sm font-semibold ${selectedService === s ? 'bg-indigo-600 text-white' : 'bg-white border-slate-200'}`}>{s}</button>
              ))}
            </div>
          </div>
          <Button label="Confirm Booking" className="w-full bg-indigo-600 py-4 text-white font-bold rounded-2xl" onClick={() => { setBookingRef('APT-9921'); setIsSubmitted(true); }} />
        </div>
      ) : (
        <div className="text-center py-20 bg-emerald-50 rounded-3xl border border-emerald-100">
          <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">✓</div>
          <h2 className="text-3xl font-black">Booking Confirmed!</h2>
          <p className="mt-2 text-emerald-800">Reference: {bookingRef}</p>
          <Button label="Book Another" className="mt-8 bg-emerald-600 px-6 py-3 rounded-full text-white" onClick={() => setIsSubmitted(false)} />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-[3rem] shadow-xl overflow-hidden border border-slate-100">
        {renderNav()}
        {activePage === 'Home' && renderHome()}
        {activePage === 'Appointments' && renderBooking()}
      </div>
    </div>
  );
};

export default CustomSection;