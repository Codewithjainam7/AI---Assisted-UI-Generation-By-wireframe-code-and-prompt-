import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from '../../features/cms/cmsSlice';

const ids = {
  heroImage: "2000000257",
  brandBadge: "2000000258",
  headlineMain: "2000000259",
  headlineSub: "2000000260",
  description: "2000000261",
  ctaButton: "2000000263",
};

const CustomSection = ({ pageName = "Home", data: propData, cssData: propCss, fetchElementsByIds: propFetch }) => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.cms?.allSections?.[pageName]);
  const reduxCss = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);
  const data = propData || reduxData || {};
  const cssData = propCss || reduxCss || {};

  const [activePage, setActivePage] = useState('Home');
  const [selectedService, setSelectedService] = useState('Main Dining Room');
  const [selectedSpecialist, setSelectedSpecialist] = useState('Chef Jean-Luc Moreau');
  const [selectedDate, setSelectedDate] = useState('Mon, Nov 16');
  const [selectedTime, setSelectedTime] = useState('06:00 PM');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  useEffect(() => {
    if (propFetch) propFetch(Object.values(ids));
    else if (dispatch) dispatch(fetchElementsByIds({ elementIds: Object.values(ids), pageName }));
  }, [dispatch, pageName, propFetch]);

  const navLinks = ['Home', 'Menu', 'Reservations', 'OurStory', 'Contact'];

  const renderHome = () => (
    <div className="flex flex-col">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10 p-6 sm:p-12">
        <div className="flex flex-col gap-4 lg:w-1/2">
          <span className="px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold self-start">Fine Dining & Culinary Excellence</span>
          <h1 id={ids.headlineMain} className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "An Unforgettable Gastronomic Journey" }} />
          <p id={ids.headlineSub} className="text-slate-500 font-medium text-lg" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Modern techniques meeting timeless culinary traditions." }} />
          <p id={ids.description} className="text-slate-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "ElysianTable offers an exquisite fusion of seasonal ingredients and avant-garde preparation, curated by world-class chefs in an atmosphere of sophisticated luxury." }} />
          <div className="flex gap-3 mt-4">
            <Button id={ids.ctaButton} onClick={() => setActivePage('Reservations')} className="px-8 py-4 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition shadow-lg" label={data?.[ids.ctaButton] || "Book a Table"} />
          </div>
        </div>
        <img id={ids.heroImage} src={data?.[ids.heroImage] || "https://images.unsplash.com/photo-1550966871-3ed39b5ed03e?auto=format&fit=crop&w=1200&q=80"} alt="Hero" className="w-full lg:w-1/2 h-80 lg:h-[500px] object-cover rounded-[2rem] shadow-2xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-12 bg-slate-50">
        {[{t:"Artisanal Menu", m:"Seasonal"}, {t:"Curated Spirits", m:"500+ Labels"}, {t:"Private Dining", m:"VIP Service"}].map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <h3 className="font-bold text-slate-900">{card.t}</h3>
            <p className="text-amber-600 text-sm font-semibold mt-1">{card.m}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReservations = () => (
    <div className="p-6 sm:p-12 max-w-3xl mx-auto w-full">
      {!isSubmitted ? (
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900">Reserve Your Table</h2>
            <p className="text-slate-500">Experience culinary excellence. Select your preferences below.</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Select Service</p>
            <div className="flex flex-wrap gap-2">
              {['Main Dining Room', 'Private Chef Table', 'Wine Cellar Lounge'].map(s => (
                <button key={s} onClick={() => setSelectedService(s)} className={`px-4 py-2 rounded-full border ${selectedService === s ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}>{s}</button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Choose Date</p>
            <div className="flex gap-2">
              {['Mon, Nov 16', 'Tue, Nov 17', 'Wed, Nov 18'].map(d => (
                <button key={d} onClick={() => setSelectedDate(d)} className={`px-4 py-2 rounded-lg border ${selectedDate === d ? 'border-amber-500 bg-amber-50' : ''}`}>{d}</button>
              ))}
            </div>
          </div>
          <Button label="Confirm Reservation" className="w-full bg-amber-500 text-slate-900 font-black py-4 rounded-xl" onClick={() => { setBookingRef('ET-' + Math.floor(Math.random()*9000)); setIsSubmitted(true); }} />
        </div>
      ) : (
        <div className="text-center p-12 bg-emerald-50 rounded-3xl border border-emerald-100">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto text-2xl mb-4">✓</div>
          <h2 className="text-2xl font-black text-slate-900">Table Reserved Successfully!</h2>
          <p className="text-emerald-800 mt-2">Ref: {bookingRef}</p>
          <Button label="Book Another" className="mt-6 bg-white text-slate-900 border border-slate-200" onClick={() => setIsSubmitted(false)} />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
        <header className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActivePage('Home')}>
            <div className="w-10 h-10 bg-slate-900 rounded-xl text-white flex items-center justify-center font-black">ET</div>
            <span id={ids.brandBadge} className="font-black text-xl tracking-tight" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "ElysianTable" }} />
          </div>
          <nav className="hidden md:flex gap-1 bg-slate-100 p-1 rounded-full">
            {navLinks.map(page => (
              <button key={page} onClick={() => setActivePage(page)} className={`px-5 py-2 rounded-full text-xs font-bold transition ${activePage === page ? 'bg-white shadow-sm' : 'text-slate-500'}`}>{page}</button>
            ))}
          </nav>
          <Button label="Reserve" onClick={() => setActivePage('Reservations')} className="bg-blue-600 rounded-full text-xs font-bold px-6 py-2.5" />
        </header>

        <main className="min-h-[60vh]">
          {activePage === 'Home' && renderHome()}
          {activePage === 'Reservations' && renderReservations()}
          {activePage !== 'Home' && activePage !== 'Reservations' && (
            <div className="p-20 text-center text-slate-400">Content for {activePage} is under development.</div>
          )}
        </main>

        <footer className="p-8 text-center border-t border-slate-100 text-sm text-slate-400">
          © 2026 ElysianTable. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default CustomSection;