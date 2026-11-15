import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from '../../features/cms/cmsSlice';

const ids = {
  heroImage: "2000000250",
  brandBadge: "2000000251",
  headlineMain: "2000000252",
  headlineSub: "2000000253",
  description: "2000000254",
  statBadges: "2000000255",
  ctaButton: "2000000256",
};

const HealthcareBookingPortal = ({ pageName = "Home", data: propData, cssData: propCss, fetchElementsByIds: propFetch }) => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.cms?.allSections?.[pageName]);
  const reduxCss = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);
  const data = propData || reduxData || {};
  const cssData = propCss || reduxCss || {};

  const [activePage, setActivePage] = useState('Home');
  const [selectedService, setSelectedService] = useState('General Medicine');
  const [selectedTime, setSelectedTime] = useState('09:00 AM');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

  useEffect(() => {
    if (propFetch) propFetch(Object.values(ids));
    else if (dispatch) dispatch(fetchElementsByIds({ elementIds: Object.values(ids), pageName }));
  }, [dispatch, pageName, propFetch]);

  const navLinks = ['Home', 'Appointments', 'Doctors', 'Services', 'Contact'];

  const handleBooking = () => setIsSubmitted(true);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-black text-blue-600 tracking-tight" id={ids.brandBadge}>
            {data?.[ids.brandBadge] || "MedPulse Health"}
          </div>
          <div className="flex gap-6">
            {navLinks.map((link) => (
              <button 
                key={link} 
                onClick={() => setActivePage(link)}
                className={`text-sm font-semibold transition ${activePage === link ? "text-blue-600" : "text-slate-500 hover:text-slate-900"}`}
              >
                {link}
              </button>
            ))}
          </div>
          <Button label="Patient Portal" className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold" />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 lg:p-12">
        {activePage === 'Home' ? (
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 id={ids.headlineMain} className="text-5xl font-extrabold leading-tight tracking-tighter" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "World-Class Care, Just a Click Away" }} />
              <p id={ids.description} className="text-lg text-slate-600 mt-6" dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "Professional medical care at your fingertips." }} />
              <Button id={ids.ctaButton} onClick={() => setActivePage('Appointments')} className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700" label={data?.[ids.ctaButton] || "Book Now"} />
            </div>
            <img id={ids.heroImage} src={data?.[ids.heroImage] || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80"} className="rounded-3xl shadow-2xl w-full h-[500px] object-cover" alt="Healthcare" />
          </div>
        ) : activePage === 'Appointments' ? (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            {!isSubmitted ? (
              <>
                <h2 className="text-2xl font-bold">Book an Appointment</h2>
                <div className="grid grid-cols-3 gap-3 mt-6">
                  {['General Medicine', 'Cardiology', 'Pediatrics'].map(s => (
                    <button key={s} onClick={() => setSelectedService(s)} className={`p-3 rounded-xl border ${selectedService === s ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200"}`}>{s}</button>
                  ))}
                </div>
                <div className="mt-6">
                  <label className="text-sm font-bold text-slate-500">Full Name</label>
                  <input className="w-full mt-2 p-3 border rounded-xl" placeholder="John Doe" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <Button label="Confirm Appointment" onClick={handleBooking} className="mt-8 w-full bg-blue-600 text-white py-3 rounded-xl font-bold" />
              </>
            ) : (
              <div className="text-center p-12">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto">✓</div>
                <h3 className="text-xl font-bold mt-6">Appointment Confirmed!</h3>
                <p className="text-slate-500 text-sm mt-2">Ref: APT-2026-8492</p>
                <Button label="Book Another" onClick={() => setIsSubmitted(false)} className="mt-6 bg-slate-100 text-slate-900 px-6 py-2 rounded-lg font-bold" />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold">{activePage} Section</h2>
            <p className="text-slate-500 mt-4">Content for {activePage} is under development.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HealthcareBookingPortal;