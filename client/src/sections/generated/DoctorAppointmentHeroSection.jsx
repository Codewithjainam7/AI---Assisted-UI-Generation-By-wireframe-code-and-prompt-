import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from '../../features/cms/cmsSlice';
import { getImage, errorImage } from '../../utils/getImage';

const ids = {
  heroImage:    "2000000243",
  brandBadge:   "2000000244",
  headlineMain: "2000000245",
  headlineSub:  "2000000246",
  description:  "2000000247",
  statBadges:   "2000000248",
  ctaButton:    "2000000249",
};

const CustomSection = ({ pageName = "Home", data: propData, cssData: propCss, fetchElementsByIds: propFetch }) => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.cms?.allSections?.[pageName]);
  const reduxCss = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);
  const data = propData || reduxData || {};
  const cssData = propCss || reduxCss || {};

  // Navigation & Interactive Form State
  const [activePage, setActivePage] = useState('Home');
  const [selectedService, setSelectedService] = useState('General Practice');
  const [selectedSpecialist, setSelectedSpecialist] = useState('Dr. Sarah Jenkins, MD');
  const [selectedDate, setSelectedDate] = useState('Mon, Nov 16');
  const [selectedTime, setSelectedTime] = useState('08:30 AM');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', notes: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [contactSent, setContactSent] = useState(false);

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

  // Mock Doctors List
  const doctorsList = [
    {
      name: "Dr. Sarah Jenkins, MD",
      specialty: "General Practice & Family Health",
      rating: "4.9",
      reviews: 142,
      exp: "12+ Yrs Exp.",
      image: "https://images.unsplash.com/photo-1594824813566-7885a6591ce4?auto=format&fit=crop&w=500&q=80",
      category: "General Practice"
    },
    {
      name: "Dr. Marcus Vance, DO",
      specialty: "Cardiology & Vascular Medicine",
      rating: "4.95",
      reviews: 210,
      exp: "16+ Yrs Exp.",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80",
      category: "Cardiology"
    },
    {
      name: "Dr. Elena Rostova, MD",
      specialty: "Pediatric & Adolescent Care",
      rating: "4.88",
      reviews: 98,
      exp: "9+ Yrs Exp.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80",
      category: "Pediatrics"
    },
    {
      name: "Dr. David Chen, MD",
      specialty: "Clinical & Aesthetic Dermatology",
      rating: "4.92",
      reviews: 184,
      exp: "14+ Yrs Exp.",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=500&q=80",
      category: "Dermatology"
    }
  ];

  const servicesList = [
    { title: "General Practice", desc: "Comprehensive physical exams, chronic disease management, and wellness checkups.", icon: "🩺" },
    { title: "Cardiology", desc: "Heart health assessments, ECG, echocardiography, and cardiovascular care.", icon: "❤️" },
    { title: "Pediatrics", desc: "Dedicated pediatric care, vaccinations, and growth tracking for infants and kids.", icon: "👶" },
    { title: "Dermatology", desc: "Advanced skin care, acne therapy, dermatological surgery, and screenings.", icon: "✨" },
    { title: "Neurology", desc: "Brain, spinal cord, and neural disorder diagnostics and individualized treatment.", icon: "🧠" },
    { title: "Orthopedics", desc: "Bone, joint, and sports injury treatment with rehabilitation plans.", icon: "🦴" }
  ];

  const datesList = ["Mon, Nov 16", "Tue, Nov 17", "Wed, Nov 18", "Thu, Nov 19", "Fri, Nov 20", "Sat, Nov 21"];
  const timesList = ["08:30 AM", "10:00 AM", "11:30 AM", "02:00 PM", "03:30 PM", "05:00 PM"];

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    const generatedRef = "OMNI-" + Math.floor(100000 + Math.random() * 900000);
    setBookingRef(generatedRef);
    setIsSubmitted(true);
  };

  const navPages = ["Home", "Appointments", "Doctors", "Services", "Contact"];

  return (
    <div className="min-h-screen bg-slate-100 p-2 sm:p-6 lg:p-8 flex items-center justify-center font-sans text-slate-900 overflow-x-hidden">
      <div className="w-full max-w-7xl bg-white rounded-3xl sm:rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative text-slate-900">
        
        {/* TOP HEADER NAVIGATION BAR */}
        <header className="w-full border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-50">
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActivePage('Home')}
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md group-hover:bg-blue-700 transition">
              +
            </div>
            <span 
              id={ids.brandBadge} 
              className="font-black text-xl text-slate-900 tracking-tight dynamicStyle" 
              dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "OmniCare Health" }} 
            />
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-full border border-slate-200">
            {navPages.map((page) => {
              const isActive = activePage === page;
              return (
                <button
                  key={page}
                  onClick={() => setActivePage(page)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setActivePage('Appointments');
                setIsSubmitted(false);
              }} 
              className="px-5 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-md shadow-blue-500/20 hidden sm:inline-flex items-center gap-2"
            >
              <span>Book Appointment</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </header>

        {/* MOBILE NAVIGATION BAR (Shown on small screens) */}
        <div className="md:hidden flex items-center justify-around bg-slate-50 border-b border-slate-200 py-2.5 px-2 overflow-x-auto">
          {navPages.map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                activePage === page 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* PAGE CONTENT SWITCHER */}
        <main className="flex-1">

          {/* VIEW 1: HOME PAGE */}
          {activePage === 'Home' && (
            <div className="animate-fadeIn">
              {/* HERO SECTION */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-10 p-6 sm:p-12 lg:p-16 border-b border-slate-100">
                <div className="flex-1 space-y-5 text-left max-w-2xl">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                    Board-Certified Specialists & Urgent Care
                  </span>

                  <h1 
                    id={ids.headlineMain} 
                    className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] dynamicStyle" 
                    dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "Expert Healthcare at Your Fingertips" }} 
                  />

                  <p 
                    id={ids.headlineSub} 
                    className="text-blue-600 font-bold text-lg sm:text-xl dynamicStyle" 
                    dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Book Board-Certified Specialists in Minutes" }} 
                  />

                  <p 
                    id={ids.description} 
                    className="text-slate-600 text-base leading-relaxed dynamicStyle" 
                    dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "Connect with leading medical professionals, view real-time doctor availability, and schedule your appointments effortlessly online. Quality care designed around your life." }} 
                  />

                  <div className="flex flex-wrap items-center gap-4 pt-3">
                    <Button 
                      id={ids.ctaButton} 
                      className="p-button-rounded bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 text-sm shadow-lg shadow-blue-500/25 border-none transition-transform active:scale-95" 
                      label={data?.[ids.ctaButton] || "Book an Appointment"} 
                      onClick={() => {
                        setActivePage('Appointments');
                        setIsSubmitted(false);
                      }} 
                    />
                    <button 
                      onClick={() => setActivePage('Doctors')} 
                      className="px-7 py-3.5 rounded-full bg-slate-100 text-slate-800 font-bold text-sm hover:bg-slate-200 transition"
                    >
                      Meet Our Doctors
                    </button>
                  </div>

                  {/* Trust Rating */}
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                    <div className="flex -space-x-2">
                      <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Patient" />
                      <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Patient" />
                      <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Patient" />
                    </div>
                    <div>
                      <div className="flex text-amber-400 text-xs">★★★★★</div>
                      <p className="text-xs text-slate-500 font-semibold">Over 50,000+ verified patient consultations</p>
                    </div>
                  </div>
                </div>

                {/* Hero Media Block */}
                <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                    <img 
                      id={ids.heroImage} 
                      src={getImage(data?.[ids.heroImage]) || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80"} 
                      onError={errorImage} 
                      alt="Healthcare Specialist" 
                      className="w-full h-[400px] sm:h-[480px] object-cover"
                    />
                    
                    {/* Floating Doctor Badge */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">Live Booking Active</p>
                          <p className="text-[11px] text-slate-500 font-medium">Next available slot: Today at 2:30 PM</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActivePage('Appointments')}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-blue-600 transition"
                      >
                        Claim Slot
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* FEATURE CARDS */}
              <div className="p-6 sm:p-12 lg:p-16 bg-slate-50/50">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Why Patients Choose OmniCare</h2>
                  <p className="text-slate-500 text-sm mt-2">Delivering modern medical excellence with seamless accessibility.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Instant Online Booking",
                      description: "Select your doctor and lock in your appointment time instantly without waiting on hold.",
                      metric: "24/7 Available",
                      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                      title: "Verified Specialists",
                      description: "Access over 120+ top-rated board-certified physicians across primary and specialized care.",
                      metric: "120+ Doctors",
                      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                      title: "Comprehensive Care",
                      description: "From preventive checkups to complex treatments, receive coordinated personal care.",
                      metric: "99% Satisfaction",
                      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80"
                    }
                  ].map((card, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group">
                      <div>
                        <div className="relative h-44 rounded-xl overflow-hidden mb-5">
                          <img src={card.image} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full">
                            {card.metric}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">{card.title}</h3>
                        <p className="text-slate-500 text-xs leading-relaxed mt-2">{card.description}</p>
                      </div>
                      <button 
                        onClick={() => setActivePage('Appointments')}
                        className="mt-6 text-xs font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1.5 self-start"
                      >
                        Explore & Book <span>→</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* STATS BAR */}
              <div id={ids.statBadges} className="border-t border-slate-200 p-8 sm:p-12 bg-white flex flex-wrap items-center justify-around gap-8 text-center dynamicStyle">
                <div>
                  <p className="text-3xl sm:text-4xl font-black text-blue-600">50,000+</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Patients Served</p>
                </div>
                <div className="hidden sm:block w-px h-10 bg-slate-200" />
                <div>
                  <p className="text-3xl sm:text-4xl font-black text-slate-900">120+</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Expert Doctors</p>
                </div>
                <div className="hidden sm:block w-px h-10 bg-slate-200" />
                <div>
                  <p className="text-3xl sm:text-4xl font-black text-amber-500">4.9/5</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Patient Rating</p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: APPOINTMENT BOOKING FORM */}
          {activePage === 'Appointments' && (
            <div className="p-6 sm:p-12 max-w-4xl mx-auto animate-fadeIn">
              {!isSubmitted ? (
                <div>
                  <div className="text-center mb-8">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">Step-by-Step Scheduling</span>
                    <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-2">Book Your Medical Appointment</h2>
                    <p className="text-slate-500 text-sm mt-1">Select a specialty, doctor, date & time to lock in your visit.</p>
                  </div>

                  <form onSubmit={handleBookingSubmit} className="space-y-8 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
                    {/* 1. Select Specialty */}
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-500 mb-3 tracking-wider">1. Select Medical Department</label>
                      <div className="flex flex-wrap gap-2">
                        {servicesList.map((srv) => (
                          <button
                            type="button"
                            key={srv.title}
                            onClick={() => setSelectedService(srv.title)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition ${
                              selectedService === srv.title
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <span className="mr-1.5">{srv.icon}</span> {srv.title}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Select Specialist */}
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-500 mb-3 tracking-wider">2. Choose Preferred Doctor</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {doctorsList.map((doc) => {
                          const isSelected = selectedSpecialist === doc.name;
                          return (
                            <div
                              key={doc.name}
                              onClick={() => setSelectedSpecialist(doc.name)}
                              className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center gap-4 bg-white ${
                                isSelected ? 'border-blue-600 shadow-md ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <img src={doc.image} alt={doc.name} className="w-14 h-14 rounded-xl object-cover" />
                              <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900">{doc.name}</p>
                                <p className="text-xs text-slate-500">{doc.specialty}</p>
                                <div className="flex items-center gap-2 mt-1 text-xs">
                                  <span className="text-amber-500 font-bold">★ {doc.rating}</span>
                                  <span className="text-slate-400">•</span>
                                  <span className="text-slate-500">{doc.exp}</span>
                                </div>
                              </div>
                              {isSelected && (
                                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">✓</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3. Select Date */}
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-500 mb-3 tracking-wider">3. Select Appointment Date</label>
                      <div className="flex flex-wrap gap-2">
                        {datesList.map((d) => (
                          <button
                            type="button"
                            key={d}
                            onClick={() => setSelectedDate(d)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition ${
                              selectedDate === d
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 4. Select Time Slot */}
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-500 mb-3 tracking-wider">4. Available Time Slots</label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {timesList.map((t) => (
                          <button
                            type="button"
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className={`py-2 rounded-xl text-xs font-bold border transition text-center ${
                              selectedTime === t
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 5. Patient Contact Info */}
                    <div className="border-t border-slate-200 pt-6 space-y-4">
                      <label className="block text-xs font-black uppercase text-slate-500 tracking-wider">5. Patient Details</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Eleanor Vance"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                          <input
                            type="tel"
                            required
                            placeholder="e.g. +1 (555) 019-2834"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Optional)</label>
                        <input
                          type="email"
                          placeholder="e.g. eleanor@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Visit / Symptoms</label>
                        <textarea
                          rows={3}
                          placeholder="Briefly describe your medical request or symptoms..."
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 bg-white"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition active:scale-[0.99]"
                    >
                      Confirm Appointment Booking →
                    </button>
                  </form>
                </div>
              ) : (
                /* SUCCESS STATE CONFIRMATION CARD */
                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-3xl font-bold mx-auto shadow-lg shadow-emerald-500/30">
                    ✓
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase text-emerald-700 tracking-wider">Booking Ref: {bookingRef}</span>
                    <h3 className="text-3xl font-black text-slate-900 mt-1">Appointment Confirmed!</h3>
                    <p className="text-slate-600 text-sm mt-2">Your consultation has been locked in our clinical schedule. A SMS confirmation was sent.</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-emerald-100 text-left space-y-3 text-sm">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-400 font-medium">Patient:</span>
                      <span className="font-bold text-slate-900">{formData.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-400 font-medium">Specialist:</span>
                      <span className="font-bold text-blue-600">{selectedSpecialist}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-400 font-medium">Department:</span>
                      <span className="font-bold text-slate-900">{selectedService}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Scheduled Time:</span>
                      <span className="font-bold text-slate-900">{selectedDate} at {selectedTime}</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-6 py-3 rounded-full bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
                    >
                      Book Another Appointment
                    </button>
                    <button
                      onClick={() => setActivePage('Home')}
                      className="px-6 py-3 rounded-full bg-white text-slate-700 border border-slate-300 font-bold text-xs hover:bg-slate-50 transition"
                    >
                      Return to Home
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW 3: DOCTORS DIRECTORY */}
          {activePage === 'Doctors' && (
            <div className="p-6 sm:p-12 animate-fadeIn">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">Medical Staff</span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">Board-Certified Physicians</h2>
                <p className="text-slate-500 text-sm mt-1">Direct access to renowned medical specialists with proven clinical excellence.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {doctorsList.map((doc, idx) => (
                  <div key={idx} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group">
                    <div>
                      <div className="relative h-60 overflow-hidden">
                        <img src={doc.image} alt={doc.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-slate-900 shadow">
                          {doc.exp}
                        </span>
                      </div>
                      <div className="p-5">
                        <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">{doc.category}</span>
                        <h3 className="text-lg font-bold text-slate-900 mt-1">{doc.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">{doc.specialty}</p>
                        <div className="flex items-center gap-1.5 mt-3 text-xs">
                          <span className="text-amber-400 font-bold">★ {doc.rating}</span>
                          <span className="text-slate-400">({doc.reviews} patient reviews)</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 pt-0">
                      <button
                        onClick={() => {
                          setSelectedSpecialist(doc.name);
                          setSelectedService(doc.category);
                          setActivePage('Appointments');
                          setIsSubmitted(false);
                        }}
                        className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white font-bold text-xs text-slate-700 transition"
                      >
                        Book Consultation
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 4: SERVICES CATALOG */}
          {activePage === 'Services' && (
            <div className="p-6 sm:p-12 animate-fadeIn">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">Clinical Offerings</span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">Comprehensive Medical Services</h2>
                <p className="text-slate-500 text-sm mt-1">From routine screenings to complex multi-specialty care programs.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servicesList.map((srv, idx) => (
                  <div key={idx} className="bg-slate-50 p-6 rounded-3xl border border-slate-200 hover:bg-white hover:shadow-xl transition-all flex flex-col justify-between group">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-sm mb-4">
                        {srv.icon}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{srv.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed mt-2">{srv.desc}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedService(srv.title);
                        setActivePage('Appointments');
                        setIsSubmitted(false);
                      }}
                      className="mt-6 py-2.5 px-4 rounded-xl bg-white border border-slate-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 font-bold text-xs text-slate-700 transition self-start"
                    >
                      Schedule Appointment →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 5: CONTACT & LOCATION */}
          {activePage === 'Contact' && (
            <div className="p-6 sm:p-12 max-w-4xl mx-auto animate-fadeIn">
              <div className="text-center mb-10">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">Get In Touch</span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">Contact OmniCare Health</h2>
                <p className="text-slate-500 text-sm mt-1">We are here 24/7 to assist with your medical inquiries and emergencies.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h4 className="text-xs font-black uppercase text-blue-600 tracking-wider mb-2">Primary Clinic Location</h4>
                    <p className="font-bold text-slate-900 text-sm">OmniCare Medical Center Plaza</p>
                    <p className="text-xs text-slate-500 mt-1">742 Evergreen Medical Parkway, Suite 400<br />San Francisco, CA 94107</p>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h4 className="text-xs font-black uppercase text-blue-600 tracking-wider mb-2">Emergency Hotline</h4>
                    <p className="font-bold text-slate-900 text-sm">+1 (800) 555-CARE (2273)</p>
                    <p className="text-xs text-slate-500 mt-1">Available 24 hours a day, 7 days a week.</p>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h4 className="text-xs font-black uppercase text-blue-600 tracking-wider mb-2">Operating Hours</h4>
                    <p className="text-xs text-slate-700"><strong>Mon - Fri:</strong> 7:00 AM - 8:00 PM</p>
                    <p className="text-xs text-slate-700 mt-1"><strong>Sat - Sun:</strong> 8:00 AM - 5:00 PM</p>
                  </div>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Send a Patient Inquiry</h3>
                  {contactSent ? (
                    <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center text-emerald-800">
                      <p className="font-bold text-sm">Message Sent Successfully!</p>
                      <p className="text-xs mt-1">Our clinical desk will respond within 2 hours.</p>
                    </div>
                  ) : (
                    <form onSubmit={(e) => { e.preventDefault(); setContactSent(true); }} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                        <input required type="text" className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                        <input required type="email" className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                        <textarea required rows={4} className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600" />
                      </div>
                      <button type="submit" className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition">
                        Submit Inquiry →
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

        </main>

        {/* FOOTER */}
        <footer className="border-t border-slate-200 bg-slate-900 text-slate-400 p-8 sm:p-12 text-xs">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-base">
                +
              </div>
              <span className="font-black text-lg text-white tracking-tight">OmniCare Health</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 font-semibold">
              {navPages.map((page) => (
                <button
                  key={page}
                  onClick={() => setActivePage(page)}
                  className="hover:text-white transition"
                >
                  {page}
                </button>
              ))}
            </div>

            <p className="text-slate-500">
              © 2026 OmniCare Health Inc. All rights reserved.
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default CustomSection;