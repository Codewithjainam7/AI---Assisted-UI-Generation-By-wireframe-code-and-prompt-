import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from '../../features/cms/cmsSlice';

const ids = {
  heroImage: "2000000271",
  brandBadge: "2000000272",
  headlineMain: "2000000273",
  headlineSub: "2000000274",
  description: "2000000275",
  statBadges: "2000000276",
  ctaButton: "2000000277",
};

const CustomSection = ({ pageName = "Home", data: propData, cssData: propCss, fetchElementsByIds: propFetch }) => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.cms?.allSections?.[pageName]);
  const reduxCss = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);
  const data = propData || reduxData || {};
  const cssData = propCss || reduxCss || {};

  const [activePage, setActivePage] = useState('Home');
  const [selectedService, setSelectedService] = useState('General Medicine');
  const [selectedSpecialist, setSelectedSpecialist] = useState('Dr. Sarah Jenkins');
  const [selectedDate, setSelectedDate] = useState('Mon, Nov 16');
  const [selectedTime, setSelectedTime] = useState('09:00 AM');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const navLinks = ['Home', 'Appointments', 'Doctors', 'Services', 'Contact'];

  useEffect(() => {
    if (propFetch) propFetch(Object.values(ids));
    else if (dispatch) dispatch(fetchElementsByIds({ elementIds: Object.values(ids), pageName }));
  }, [dispatch, pageName, propFetch]);

  const renderNavbar = () => (
    <nav className="flex items-center justify-between p-6 border-b border-slate-100">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActivePage('Home')}>
        <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black">M</div>
        <span id={ids.brandBadge} className="font-bold text-xl tracking-tight" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "MedPulse Health" }} />
      </div>
      <div className="hidden md:flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-full border border-slate-200">
        {navLinks.map((link) => (
          <button key={link} onClick={() => setActivePage(link)} className={`px-5 py-2 rounded-full text-xs font-bold transition ${activePage === link ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
            {link}
          </button>
        ))}
      </div>
      <Button className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-bold text-xs" label="Book Appointment" onClick={() => setActivePage('Appointments')} />
    </nav>
  );

  const renderHome = () => (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-10 p-6 sm:p-12">
      <div className="flex-1 space-y-6">
        <span className="px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">Board-Certified Specialists</span>
        <h1 id={ids.headlineMain} className="text-4xl lg:text-6xl font-black text-slate-900 leading-tight" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "World-Class Care, Just a Click Away" }} />
        <p id={ids.headlineSub} className="text-slate-500 text-lg font-medium" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Expert medical consultations scheduled on your terms." }} />
        <div className="flex gap-4">
          <Button id={ids.ctaButton} className="bg-blue-600 px-8 py-4 rounded-full font-bold" label={data?.[ids.ctaButton] || "Book Your Visit"} onClick={() => setActivePage('Appointments')} />
          <Button className="bg-slate-100 text-slate-900 px-8 py-4 rounded-full font-bold" label="Explore Services" onClick={() => setActivePage('Services')} />
        </div>
      </div>
      <div className="flex-1 w-full">
        <img id={ids.heroImage} src={data?.[ids.heroImage] || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80"} className="rounded-3xl shadow-2xl w-full h-[500px] object-cover" alt="Health" />
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="p-8 sm:p-12">
      {!isSubmitted ? (
        <div className="space-y-8 max-w-2xl mx-auto">
          <h2 className="text-3xl font-black">Book an Appointment</h2>
          <div className="space-y-4">
            <h3 className="font-bold">Select Service</h3>
            <div className="flex flex-wrap gap-2">{['General Medicine', 'Cardiology', 'Pediatrics'].map(s => <button key={s} onClick={() => setSelectedService(s)} className={`px-4 py-2 rounded-full text-sm font-semibold border ${selectedService === s ? 'bg-blue-600 text-white' : 'bg-slate-50'}`}>{s}</button>)}</div>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold">Select Date</h3>
            <div className="flex gap-2">{['Mon, Nov 16', 'Tue, Nov 17'].map(d => <button key={d} onClick={() => setSelectedDate(d)} className={`px-4 py-2 rounded-xl border ${selectedDate === d ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>{d}</button>)}</div>
          </div>
          <Button className="w-full bg-blue-600 py-4 rounded-2xl" label="Confirm Booking" onClick={() => { setBookingRef('APT-9921'); setIsSubmitted(true); }} />
        </div>
      ) : (
        <div className="text-center p-12 bg-emerald-50 rounded-3xl border border-emerald-100">
          <div className="w-20 h-20 bg-emerald-500 text-white flex items-center justify-center rounded-full mx-auto text-4xl mb-6">✓</div>
          <h2 className="text-2xl font-black">Appointment Confirmed!</h2>
          <p className="mt-2 text-slate-600">Reference: {bookingRef}</p>
          <Button className="mt-6 bg-slate-900" label="Book Another" onClick={() => setIsSubmitted(false)} />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-6 lg:p-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-7xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
        {renderNavbar()}
        {activePage === 'Home' && renderHome()}
        {activePage === 'Appointments' && renderAppointments()}
        {(activePage !== 'Home' && activePage !== 'Appointments') && (
          <div className="p-12 text-center">
            <h2 className="text-3xl font-black mb-4">{activePage} View</h2>
            <p className="text-slate-500">Coming soon to the MedPulse portal.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSection;