import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from '../../features/cms/cmsSlice';

const ids = {
  heroImage: "2000000299",
  brandBadge: "2000000300",
  headlineMain: "2000000301",
  headlineSub: "2000000302",
  description: "2000000303",
  statBadges: "2000000304",
  ctaButton: "2000000305",
};

const HealthcareAppointmentPortal = ({ pageName = "Home", data: propData, cssData: propCss, fetchElementsByIds: propFetch }) => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.cms?.allSections?.[pageName]);
  const reduxCss = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);
  const data = propData || reduxData || {};
  const cssData = propCss || reduxCss || {};

  const [activePage, setActivePage] = useState('Home');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', notes: '' });

  useEffect(() => {
    if (propFetch) {
      propFetch(Object.values(ids));
    } else if (dispatch) {
      dispatch(fetchElementsByIds({ elementIds: Object.values(ids), pageName }));
    }
  }, [dispatch, pageName, propFetch]);

  const renderHome = () => (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span id={ids.headlineMain} className="text-5xl font-extrabold text-slate-900 tracking-tighter" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "World-Class Care, Just a Click Away" }} />
          <p id={ids.description} className="text-lg text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "Experience seamless medical consultations with our board-certified experts." }} />
          <Button id={ids.ctaButton} className="bg-cyan-500 hover:bg-cyan-600 border-none px-8 py-3 text-white font-bold rounded-full shadow-lg" label={data?.[ids.ctaButton] || "Book Appointment"} onClick={() => setActivePage('Appointments')} />
        </div>
        <img id={ids.heroImage} src={data?.[ids.heroImage] || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80"} className="rounded-3xl shadow-2xl object-cover h-96 w-full" alt="Healthcare" />
      </div>
      <div className="grid grid-cols-3 gap-6">
        {[ { m: "50+", d: "Expert Specialists" }, { m: "10k+", d: "Patients Served" }, { m: "98%", d: "Success Rate" } ].map((s, i) => (
          <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
            <div className="text-3xl font-black text-cyan-600">{s.m}</div>
            <div className="text-sm font-semibold text-slate-500">{s.d}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAppointments = () => (
    isSubmitted ? (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mb-4">✓</div>
        <h2 className="text-3xl font-bold">Appointment Confirmed!</h2>
        <p className="text-slate-500">Your reference: <span className="font-mono bg-slate-100 px-2 py-1 rounded">APT-2026-8492</span></p>
        <Button label="Book Another" className="p-button-outlined" onClick={() => setIsSubmitted(false)} />
      </div>
    ) : (
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold">Book Your Consultation</h2>
        <div className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full p-4 rounded-xl border border-slate-200" onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <input type="email" placeholder="Email Address" className="w-full p-4 rounded-xl border border-slate-200" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <Button label="Confirm Appointment" className="w-full bg-cyan-600 text-white font-bold p-4 rounded-xl" onClick={() => setIsSubmitted(true)} />
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <header className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div id={ids.brandBadge} className="text-xl font-black text-cyan-600" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "MedPulse Health" }} />
          <nav className="flex gap-6">
            {['Home', 'Appointments', 'Doctors', 'Services', 'Contact'].map((item) => (
              <button key={item} onClick={() => setActivePage(item)} className={`text-sm font-bold transition ${activePage === item ? "text-cyan-600 underline decoration-2 underline-offset-8" : "text-slate-400 hover:text-slate-900"}`}>
                {item}
              </button>
            ))}
          </nav>
        </header>
        <main className="p-8 lg:p-12">
          {activePage === 'Home' && renderHome()}
          {activePage === 'Appointments' && renderAppointments()}
          {activePage !== 'Home' && activePage !== 'Appointments' && (
            <div className="py-20 text-center text-slate-400">Content for {activePage} section coming soon.</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HealthcareAppointmentPortal;