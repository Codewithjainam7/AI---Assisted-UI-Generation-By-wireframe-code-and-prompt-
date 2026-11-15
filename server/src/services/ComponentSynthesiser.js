import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getJSXSystemPrompt } from '../templates/jsx-system-prompt.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

let openAIClient;
let genAIClient;


export function resolveDomainConfig(ir) {
  const domain = (ir.domain || '').toLowerCase();
  const rawText = ((ir.sectionName || '') + ' ' + (ir.promptText || '') + ' ' + (ir.content?.headlineMain || '') + ' ' + (ir.content?.brandBadge || '') + ' ' + domain).toLowerCase();
  
  if (/restaurant|dining|food|bistro|cafe|culinary|chef|menu|reservation/i.test(rawText)) {
    return {
      domainType: 'restaurant',
      brand: ir.navbar?.logoText || ir.brandBadge || 'L’Artisan Bistro',
      badge: 'Fine Dining & Culinary Excellence',
      heroHeadline: ir.content?.headlineMain || 'Culinary Artistry & Memorable Gatherings',
      heroSub: ir.content?.headlineSub || 'Reserve your table for an extraordinary dining experience.',
      heroDesc: ir.content?.description || 'Award-winning seasonal tasting menus, sommelier-curated pairings, and private dining spaces.',
      heroImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      actionLabel: 'Reserve a Table',
      bookingPageName: 'Reservations',
      teamPageName: 'Chefs',
      specialistLabel: 'Executive Chef & Sommelier',
      specialists: [
        { name: 'Chef Jean-Luc Moreau', role: 'Executive Chef & Owner', specialty: 'French Nouvelle Cuisine', exp: '3 Michelin Stars', rating: '4.9 ★', photo: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80' },
        { name: 'Chef Elena Rostova', role: 'Head Pastry Chef', specialty: 'Artisanal Confections', exp: '14 yrs exp', rating: '4.8 ★', photo: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=400&q=80' },
        { name: 'Marco Valenti', role: 'Master Sommelier', specialty: 'Old World Wine Pairings', exp: '18 yrs exp', rating: '5.0 ★', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' }
      ],
      categoriesTitle: 'Dining Area & Experience',
      categories: ['Main Dining Room', 'Chef’s Tasting Table', 'Rooftop Terrace', 'Private Wine Cellar'],
      timeSlots: ['05:30 PM', '06:30 PM', '07:45 PM', '08:30 PM', '09:15 PM', '10:00 PM'],
      formNotice: 'Guests are accommodated for 2 hours per seating.',
      confirmedTitle: 'Table Reserved Successfully!',
      confirmedSub: 'Your dining reservation has been confirmed with our maître d\'.'
    };
  }

  if (/fitness|gym|workout|trainer|crossfit|athletic|wellness|yoga/i.test(rawText)) {
    return {
      domainType: 'fitness',
      brand: ir.navbar?.logoText || ir.brandBadge || 'Apex Athletic Club',
      badge: 'High-Performance Training Facility',
      heroHeadline: ir.content?.headlineMain || 'Elevate Your Strength, Speed & Longevity',
      heroSub: ir.content?.headlineSub || 'Book 1-on-1 private coaching sessions with elite trainers.',
      heroDesc: ir.content?.description || 'Customized biomechanical assessments, strength periodization, and nutritional support built for results.',
      heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
      actionLabel: 'Book Training Session',
      bookingPageName: 'Book Session',
      teamPageName: 'Trainers',
      specialistLabel: 'Master Coach',
      specialists: [
        { name: 'Alex Rivera, CSCS', role: 'Director of Strength', specialty: 'Olympic Weightlifting & Hypertrophy', exp: '12 yrs exp', rating: '4.9 ★', photo: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80' },
        { name: 'Maya Lin', role: 'Head of Mobility', specialty: 'Functional Movement & Yoga', exp: '10 yrs exp', rating: '5.0 ★', photo: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80' },
        { name: 'Marcus Brody', role: 'Conditioning Specialist', specialty: 'HIIT & Endurance Periodization', exp: '8 yrs exp', rating: '4.8 ★', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' }
      ],
      categoriesTitle: 'Training Program / Focus',
      categories: ['1-on-1 Strength Training', 'HIIT & Athletic Conditioning', 'Biomechanical Assessment', 'Mobility & Recovery'],
      timeSlots: ['06:00 AM', '07:30 AM', '09:00 AM', '12:00 PM', '04:30 PM', '06:00 PM'],
      formNotice: 'Please arrive 10 minutes before your scheduled session.',
      confirmedTitle: 'Training Session Booked!',
      confirmedSub: 'Your private coaching session is confirmed in our training schedule.'
    };
  }

  if (/law|legal|attorney|lawyer|advocate|counsel/i.test(rawText)) {
    return {
      domainType: 'legal',
      brand: ir.navbar?.logoText || ir.brandBadge || 'Vanguard Legal Partners',
      badge: 'Premier Corporate & Litigation Counsel',
      heroHeadline: ir.content?.headlineMain || 'Strategic Legal Counsel for Complex Challenges',
      heroSub: ir.content?.headlineSub || 'Schedule a confidential consultation with senior practice partners.',
      heroDesc: ir.content?.description || 'Protecting your corporate assets, intellectual property, and strategic interests with courtroom-tested excellence.',
      heroImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
      actionLabel: 'Schedule Consultation',
      bookingPageName: 'Consultation',
      teamPageName: 'Attorneys',
      specialistLabel: 'Senior Counsel / Partner',
      specialists: [
        { name: 'Eleanor Vance, JD', role: 'Managing Partner', specialty: 'Corporate Mergers & Acquisitions', exp: '22 yrs exp', rating: '5.0 ★', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
        { name: 'David Sterling, Esq.', role: 'Senior Litigation Counsel', specialty: 'Commercial Dispute Resolution', exp: '18 yrs exp', rating: '4.9 ★', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80' },
        { name: 'Sophia Chen, LLM', role: 'Partner', specialty: 'Patent & Intellectual Property', exp: '14 yrs exp', rating: '4.9 ★', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' }
      ],
      categoriesTitle: 'Practice Area / Matter',
      categories: ['Corporate & Commercial', 'Intellectual Property & Patents', 'Litigation & Arbitration', 'Regulatory Compliance'],
      timeSlots: ['09:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:30 PM'],
      formNotice: 'All consultations are protected by strict attorney-client privilege.',
      confirmedTitle: 'Consultation Confirmed!',
      confirmedSub: 'Your confidential legal appointment has been scheduled with counsel.'
    };
  }

  if (/real estate|property|realtor|homes|apartment|condo|villa/i.test(rawText)) {
    return {
      domainType: 'real-estate',
      brand: ir.navbar?.logoText || ir.brandBadge || 'Aura Luxury Real Estate',
      badge: 'Curated Architectural Residences',
      heroHeadline: ir.content?.headlineMain || 'Exquisite Properties Tailored to Your Vision',
      heroSub: ir.content?.headlineSub || 'Book a private architectural tour with top regional advisors.',
      heroDesc: ir.content?.description || 'Exclusive access to premier private listings, waterfront estates, and modern urban penthouses.',
      heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      actionLabel: 'Schedule Private Tour',
      bookingPageName: 'Schedule Tour',
      teamPageName: 'Agents',
      specialistLabel: 'Licensed Real Estate Advisor',
      specialists: [
        { name: 'Harrison Sterling', role: 'Principal Broker', specialty: 'Ultra-Luxury Waterfront Estates', exp: '16 yrs exp', rating: '5.0 ★', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
        { name: 'Claire Kensington', role: 'Senior Vice President', specialty: 'Penthouse & Architectural Properties', exp: '12 yrs exp', rating: '4.9 ★', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' }
      ],
      categoriesTitle: 'Tour Experience Type',
      categories: ['Private In-Person Tour', 'VIP Virtual Video Walkthrough', 'Architectural Consultation', 'Investment Portfolio Review'],
      timeSlots: ['10:00 AM', '11:30 AM', '01:30 PM', '03:00 PM', '04:30 PM'],
      formNotice: 'Discreet transportation arrangements available upon request.',
      confirmedTitle: 'Private Tour Scheduled!',
      confirmedSub: 'Your private showing has been registered with our senior broker.'
    };
  }

  if (/doctor|clinic|hospital|medical|patient|dentist|healthcare|pediatric|cardio/i.test(rawText)) {
    return {
      domainType: 'healthcare',
      brand: ir.navbar?.logoText || ir.brandBadge || 'Apex Medical Center',
      badge: 'Board-Certified Specialists & Urgent Care',
      heroHeadline: ir.content?.headlineMain || 'Compassionate, World-Class Healthcare',
      heroSub: ir.content?.headlineSub || 'Schedule your visit with certified medical practitioners.',
      heroDesc: ir.content?.description || 'Comprehensive clinical care with modern diagnostic facilities, emergency services, and patient-first digital booking.',
      heroImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80',
      actionLabel: 'Book Appointment',
      bookingPageName: 'Appointments',
      teamPageName: 'Doctors',
      specialistLabel: 'Attending Physician & Surgeon',
      specialists: [
        { name: 'Dr. Sarah Jenkins, MD', role: 'Chief of Cardiology', specialty: 'Cardiovascular Care', exp: '15 yrs exp', rating: '4.9 ★', photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Marcus Vance, DO', role: 'Head of Neurology', specialty: 'Neuro-Diagnostics', exp: '18 yrs exp', rating: '4.9 ★', photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dr. Elena Ramos, MD', role: 'Senior Pediatrician', specialty: 'Child & Adolescent Care', exp: '12 yrs exp', rating: '5.0 ★', photo: 'https://images.unsplash.com/photo-1594824813571-638f02614d3f?auto=format&fit=crop&w=400&q=80' }
      ],
      categoriesTitle: 'Clinical Department',
      categories: ['General Medicine', 'Cardiovascular Clinic', 'Pediatrics & Adolescent', 'Neurology & Diagnostics', 'Dermatology & Skin'],
      timeSlots: ['09:00 AM', '10:30 AM', '11:45 AM', '02:00 PM', '03:30 PM', '04:45 PM'],
      formNotice: 'Emergency triage services are available 24/7 without prior booking.',
      confirmedTitle: 'Appointment Confirmed!',
      confirmedSub: 'Your reservation has been locked in our clinical calendar.'
    };
  }

  return {
    domainType: 'general',
    brand: ir.navbar?.logoText || ir.brandBadge || 'Apex Global',
    badge: 'Verified Professional Services',
    heroHeadline: ir.content?.headlineMain || 'Precision Solutions Engineered for Your Success',
    heroSub: ir.content?.headlineSub || 'Book an appointment with dedicated industry specialists.',
    heroDesc: ir.content?.description || 'Tailored consulting, rapid onboarding, and premier customer care designed to deliver measurable results.',
    heroImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80',
    actionLabel: 'Schedule Consultation',
    bookingPageName: 'Appointments',
    teamPageName: 'Team',
    specialistLabel: 'Senior Advisor & Specialist',
    specialists: [
      { name: 'Jordan Hayes', role: 'Principal Specialist', specialty: 'Strategic Advisory & Operations', exp: '14 yrs exp', rating: '4.9 ★', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
      { name: 'Sophia Sterling', role: 'Lead Consultant', specialty: 'Solutions Architecture & Review', exp: '11 yrs exp', rating: '5.0 ★', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' }
    ],
    categoriesTitle: 'Service / Department Selection',
    categories: ['Strategic Consultation', 'Technical Assessment', 'Comprehensive Review', 'Dedicated Support Session'],
    timeSlots: ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM'],
    formNotice: 'A confirmation summary with calendar invite will be delivered instantly.',
    confirmedTitle: 'Booking Confirmed!',
    confirmedSub: 'Your consultation has been locked in our schedule.'
  };
}


export async function generate(ir) {
  const prompt = getJSXSystemPrompt();
  const layout = ir.layout || {};

  const isMultiMobile = ir.screenArchetype === 'multi-screen-mobile' ||
    layout.isMultiScreenMobile ||
    (ir.formFactor === 'mobile' && layout.columns === 3 && /browse|order|enjoy/i.test((ir.content?.featureCards || []).map(c => c.title).join(' ')));

  const isPortal = ir.screenArchetype === 'corporate-portal' ||
    layout.isPortal ||
    (/company|intranet|portal|application/i.test((ir.sectionName || '') + ' ' + (ir.content?.headlineMain || '')) && !isMultiMobile) ||
    ir.content?.headlineMain === 'My applications';

  const isWellness = ir.screenArchetype === 'wellness-tracker' ||
    ir.domain === 'fitness' ||
    /calor|nutrition|diet|meal|kiraa|happypiggy/i.test((ir.sectionName || '') + ' ' + (ir.domain || '') + ' ' + (ir.imageConcept || ''));

  const isAnalytics = ir.screenArchetype === 'analytics-dashboard' ||
    (layout.hasSidebar && layout.sidebarType === 'icon-rail' && layout.hasDetailPanel);

  const isSingleMobile = ir.formFactor === 'mobile' && !isMultiMobile;

  const isMultiPageWithForm = (ir.isMultiPage || ir.hasForm || (Array.isArray(ir.pages) && ir.pages.length > 1) || /appointment|booking|reservation|form|consultation|signup|inquiry|doctor|clinic|hospital/i.test((ir.sectionName || '') + ' ' + (ir.content?.headlineMain || '') + ' ' + (ir.formType || ''))) && !isWellness && !isMultiMobile && !isPortal;

  let userContent = 'Generate the React section component for this IR JSON:\n' +
    JSON.stringify(ir, null, 2) + '\n\n' +
    '=== PIXEL-ACCURATE WIREFRAME RECONSTRUCTION DIRECTIVES ===\n' +
    'Detected Wireframe Archetype: ' + (isMultiMobile ? 'Multi-Screen Mobile Onboarding Flow (3 Phones)' : isPortal ? 'Corporate Intranet / Application Portal' : isWellness ? 'Wellness / Calorie Tracking Dashboard' : isAnalytics ? 'Analytics SaaS Dashboard' : isSingleMobile ? 'Single Mobile Screen' : 'Universal Responsive Layout') + '\n' +
    'Domain: ' + (ir.domain || 'general') + '\n' +
    'Screen Type: ' + (ir.screenType || ir.sectionType || 'custom') + '\n' +
    'Form Factor: ' + (ir.formFactor || 'responsive') + '\n\n' +
    'CRITICAL COLOR & FIDELITY RULES:\n' +
    '1. Standard Tailwind Color Classes ONLY (bg-slate-900, bg-slate-100, bg-white, bg-pink-100, bg-rose-50, text-rose-500, text-slate-900, border-slate-200, etc.). Never use bracket syntax like bg-[#...].\n' +
    '2. High Contrast: All text on light surfaces MUST have explicit dark text classes (text-slate-900, text-slate-800, text-slate-600).\n' +
    '3. High Fidelity Imagery: Always use real, high-resolution Unsplash photos tailored to the domain. NEVER use grey boxes or placeholder text.\n' +
    '4. Strict Blueprint Accuracy: DO NOT mix elements from different wireframes! Only build what is specified for this wireframe archetype.\n\n';

  if (isMultiMobile) {
    userContent += `
=== BLUEPRINT: MULTI-SCREEN MOBILE ONBOARDING (3 PHONES) ===
Outer Canvas: 'w-full min-h-screen bg-slate-950 p-4 sm:p-8 flex flex-col items-center justify-center font-sans overflow-x-hidden text-slate-900'
Top Brand Header: <div className="text-white text-base sm:text-lg font-black tracking-widest uppercase mb-8 flex items-center gap-2"><span id={ids.brandBadge} dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "${ir.navbar?.logoText || ir.brandBadge || 'Catering Demand'}" }} /></div>

Screens Row: (div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 w-full max-w-7xl")
Render EXACTLY 3 mobile phone mockups side-by-side matching the wireframe:

Phone 1 ('Browse'):
- Container: 'w-full max-w-[340px] bg-white rounded-[2.5rem] shadow-2xl border-4 border-slate-800 overflow-hidden flex flex-col relative min-h-[640px] p-6 justify-between'
- Header: (div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase") <span>STEP 1</span> <span className="text-rose-500 cursor-pointer">DONE</span>
- Illustration: Circular photo container (div className="w-48 h-48 mx-auto rounded-full overflow-hidden shadow-md my-4") containing an appetizing catering photo (https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80).
- Title & Desc: <h2 className="text-2xl font-black text-slate-900 text-center tracking-tight">Browse</h2> <p className="text-xs text-slate-600 text-center mt-2 leading-relaxed">Explore a wide variety of catering menus curated for your team.</p>
- Stepper: (div className="flex justify-center gap-2 my-4") with diamonds (◆ ◇ ◇) where the 1st diamond is active (bg-rose-500 rotate-45 w-2 h-2).
- Footer: <button className="text-slate-400 text-xs font-bold uppercase self-start">SKIP</button>

Phone 2 ('Order'):
- Container: Same sleek mobile container.
- Header: <span>STEP 2</span> <span className="text-rose-500 cursor-pointer">DONE</span>
- Illustration: Circular photo container with food photo (https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80).
- Title & Desc: <h2 className="text-2xl font-black text-slate-900 text-center tracking-tight">Order</h2> <p className="text-xs text-slate-600 text-center mt-2 leading-relaxed">Customize dietary preferences and schedule delivery with precision.</p>
- Stepper: Diamonds (◇ ◆ ◇) where the 2nd diamond is active (bg-rose-500).
- Footer: <button className="text-slate-400 text-xs font-bold uppercase self-start">SKIP</button>

Phone 3 ('Enjoy'):
- Container: Same sleek mobile container.
- Header: <span>STEP 3</span> <span className="text-rose-500 cursor-pointer">DONE</span>
- Illustration: Circular photo container with food photo (https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80).
- Title & Desc: <h2 id={ids.headlineMain} className="text-2xl font-black text-slate-900 text-center tracking-tight dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "Enjoy" }} /> <p id={ids.description} className="text-xs text-slate-600 text-center mt-2 leading-relaxed dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "Delight in fresh, restaurant-quality catering delivered directly to your venue." }} />
- Stepper: Diamonds (◇ ◇ ◆) where the 3rd diamond is active (bg-rose-500).
- Footer: (div className="flex items-center gap-3 w-full") <button className="text-slate-400 text-xs font-bold uppercase">SKIP</button> <Button id={ids.ctaButton} className="dynamicStyle flex-1 py-3.5 rounded-full font-bold bg-slate-900 text-white hover:bg-slate-800 transition shadow-lg text-xs" label={data?.[ids.ctaButton] || "${ir.content?.ctaButton || 'GET STARTED'}"} />

DO NOT RENDER any right detail inspector panel.
DO NOT RENDER any bottom collaborator row.`;
  } else if (isPortal) {
    const portal = layout.portal || {};
    const appShortcuts = portal.appShortcuts || ['Salesforce', 'My file', 'Chatter', 'Planner', 'Cornerstone', 'Repository', 'Standards'];
    const sidebarUser = layout.sidebarUser || { name: 'Ivon Stoilov', stats: '527 / 378' };
    const appTilesStr = appShortcuts.map((app) => 'Tile: ' + app + ' (' + app.slice(0, 2).toUpperCase() + ')').join('\n');

    userContent += `
=== BLUEPRINT: CORPORATE INTRANET / APPLICATION PORTAL ===
Outer Canvas: 'min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans text-slate-900 overflow-x-hidden'
Main Window Container: 'w-full max-w-7xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative text-slate-900'

1. Top Header Bar:
- Solid header (header className="w-full bg-slate-200 border-b border-slate-300 px-6 py-3.5 flex items-center justify-between text-slate-900 font-bold text-base")
- Brand: <div className="flex items-center gap-2 font-black text-lg text-slate-900"><span id={ids.brandBadge} className="dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "${ir.navbar?.logoText || ir.brandBadge || 'CompanyName'}" }} /></div>
- Search with Toggle: (div className="flex items-center gap-3") <input type="text" placeholder="${ir.inputPlaceholder || 'Start typing what are you looking for...'}" className="w-64 sm:w-80 bg-white border border-slate-300 rounded-full px-4 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400" /> <span className="text-xs text-slate-500 font-semibold cursor-pointer hidden sm:inline">Advanced search</span>

2. Window Body: (div className="flex flex-col lg:flex-row w-full items-stretch")
a) Left Profile Sidebar: (aside className="w-full lg:w-64 bg-slate-50 border-r border-slate-200 flex flex-col justify-between flex-shrink-0 p-5")
   - Profile Header Card: (div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center shadow-xs mb-6")
     Avatar: (div className="w-18 h-18 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-slate-600 font-black text-lg") ${(sidebarUser.name || 'U')[0]}
     Stats: <span className="text-xs font-bold text-slate-400 mt-2">${sidebarUser.stats || '527 / 378'}</span>
     Username: <h2 className="text-base font-bold text-slate-900 mt-1">${sidebarUser.name || 'Ivon Stoilov'}</h2>
   - Navigation: Home, About, Organisation, Support, News.

b) Central Main Content: (main className="flex-1 min-w-0 p-6 sm:p-8 flex flex-col gap-6")
   - Applications Title: <div className="flex items-center justify-between"><h2 id={ids.headlineMain} className="text-xl font-black text-slate-900 tracking-tight dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "My applications" }} /><a href="#" className="text-xs font-bold text-blue-600 hover:underline">Edit</a></div>
   - 7 Application Tiles Grid: (div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3")
${appTilesStr}
   - News Banner Card: (div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-xs mt-2")
     Image: <img id={ids.heroImage} className="w-full md:w-80 h-48 sm:h-auto object-cover" src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80" alt="News banner" />
     Text: <span id={ids.headlineSub} className="text-xs font-bold text-rose-500 uppercase tracking-wider dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Today's news" }} />
           <p id={ids.description} className="text-xs text-slate-600 mt-2 leading-relaxed dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "Enterprise platform update notes." }} />

c) Right Inspector Panel: (aside className="w-full lg:w-72 bg-slate-50 border-l border-slate-200 p-6 flex flex-col gap-6 flex-shrink-0")
   - Standardization widget
   - Connections widget (4 avatar circles)
   - CTA button: <Button id={ids.ctaButton} className="dynamicStyle w-full py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm text-xs" label={data?.[ids.ctaButton] || "Contact site admin"} />`;
  } else if (isWellness) {
    const sidebarUser = layout.sidebarUser || { name: 'Kiraa', avatar: true };
    const tabs = layout.tabs?.length ? layout.tabs : ['Meal Plan', 'Exercise Plan'];

    userContent += `
=== BLUEPRINT: WELLNESS & NUTRITION STUDIO DASHBOARD ===
Outer Canvas: 'min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans text-slate-900 overflow-x-hidden'
Main Window Container: 'w-full max-w-7xl bg-white rounded-[2rem] shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col relative text-slate-900'

1. Top Header Bar:
- Full-width modern bar: (header className="w-full bg-white border-b border-slate-100 px-6 sm:px-8 py-4 flex items-center justify-between text-slate-900")
- Brand Emblem: (div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center font-black text-sm shadow-sm shadow-rose-500/20") HP
- Brand Name: <span id={ids.brandBadge} className="font-black text-base tracking-tight text-slate-900 dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "${ir.navbar?.logoText || ir.brandBadge || 'HappyPiggy'}" }} />
- Studio Subtitle: <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider -mt-0.5">HEALTH & NUTRITION STUDIO</span>
- Search & Streak: (div className="hidden sm:flex items-center gap-4") Search input with SVG search icon, and a streak badge (div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200/60 text-xs font-bold text-rose-600 shadow-2xs") <span>14 Day Streak</span>

2. Window Body: (div className="flex flex-col md:flex-row w-full items-stretch")
a) Left Profile Sidebar: (aside className="w-full sm:w-64 bg-gradient-to-b from-rose-50/60 via-white to-rose-50/30 border-r border-rose-100/80 flex flex-col justify-between flex-shrink-0 p-5")
   - Profile Card: (div className="bg-white/80 backdrop-blur-sm border border-rose-200/60 rounded-2xl p-5 flex flex-col items-center text-center shadow-xs mb-6")
     Avatar: High-resolution portrait photo (https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80) in a rounded-full container with an emerald-500 online badge!
     Name: <h2 className="font-black text-slate-900 text-base mt-3 tracking-tight">${sidebarUser.name || 'Kiraa'}</h2>
     Daily Goal Pill: <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/60 mt-1 shadow-2xs">DAILY GOAL: 2,400 KCAL</span>
   - Navigation Menu: (nav className="flex flex-col gap-1.5")
     * Active item: 'Diary' styled as a solid coral-rose pill (bg-rose-500 text-white shadow-sm shadow-rose-500/25 font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-3).
     * Other items: 'Shopping Lists', 'Your Progress', 'Your Profile', 'Settings' with subtle bullet dots and smooth hover states.

b) Central Main Content: (main className="flex-1 min-w-0 flex flex-col")
   - Sub-header Navigation Bar: (div className="border-b border-slate-100 px-6 sm:px-8 pt-4 pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4")
     * Active Tab: <button className="pb-3 text-sm font-extrabold tracking-tight text-slate-900 border-b-2 border-rose-500">${tabs[0] || 'Meal Plan'}</button>
     * Inactive Tab: <button className="pb-3 text-sm font-extrabold tracking-tight text-slate-400 hover:text-slate-600 transition-colors">${tabs[1] || 'Exercise Plan'}</button>
     * Date Switcher: (div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs shadow-2xs") <span className="text-slate-400 font-bold cursor-pointer">&lt;</span><span id={ids.headlineSub} className="dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Friday 23rd December" }} /><span className="text-slate-400 font-bold cursor-pointer">&gt;</span> <span className="text-[10px] text-slate-400 font-bold">Today</span>

   - Main Content Body: (div className="p-6 sm:p-8 flex flex-col gap-6")
     * Calorie Hero Block: (div className="bg-gradient-to-br from-slate-50 via-white to-rose-50/30 border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6")
       Left: Title <h3 id={ids.headlineMain} className="text-2xl font-black text-slate-900 tracking-tight dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "Your Calories" }} /> and subtitle "Target: 2,400 kcal • 401 kcal remaining for dinner".
       Right:
         - Circular SVG Calorie Donut Gauge (stroke-rose-500 showing 83% completion) with '1,999 Calories' and '83% OF DAILY GOAL' in bold typography!
         - 3 Macro Breakdown Pills:
           Protein badge: bg-rose-50 text-rose-700 border border-rose-200 "142g Protein (92%)"
           Carbs badge: bg-amber-50 text-amber-700 border border-amber-200 "185g Carbs (77%)"
           Fats badge: bg-emerald-50 text-emerald-700 border border-emerald-200 "54g Fats (84%)"

     * EXACTLY 2 High-Fidelity Meal Cards: (div className="grid grid-cols-1 sm:grid-cols-2 gap-6")
       Card 1 (BREAKFAST):
         Container: (div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-rose-300 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col")
         Image: <img className="w-full h-44 object-cover" src="https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80" alt="Breakfast" />
         Header Badge: (div className="flex items-center justify-between p-4 pb-0") <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-black text-[10px] tracking-wider uppercase">BREAKFAST</span> <span className="text-xs font-bold text-rose-500">485 kcal</span>
         Title: <h4 className="font-extrabold text-slate-900 text-sm mt-2 px-4">Avocado Sourdough & Poached Egg</h4>
         Macros: <span className="text-xs text-slate-500 mt-1 px-4">24g P • 18g F • 42g C</span>
         Action: (div className="p-4 pt-2") <span className="text-xs font-bold text-rose-600 cursor-pointer hover:underline inline-flex items-center gap-1">+ Log items</span>

       Card 2 (MORNING SNACK):
         Container: (div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-rose-300 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col")
         Image: <img className="w-full h-44 object-cover" src="https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80" alt="Morning Snack" />
         Header Badge: (div className="flex items-center justify-between p-4 pb-0") <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-black text-[10px] tracking-wider uppercase">MORNING SNACK</span> <span className="text-xs font-bold text-rose-500">240 kcal</span>
         Title: <h4 className="font-extrabold text-slate-900 text-sm mt-2 px-4">Greek Yogurt & Wild Berry Bowl</h4>
         Macros: <span className="text-xs text-slate-500 mt-1 px-4">16g P • 4g F • 28g C</span>
         Action: (div className="p-4 pt-2") <span className="text-xs font-bold text-rose-600 cursor-pointer hover:underline inline-flex items-center gap-1">+ Log items</span>

     * Primary Action:
       <Button id={ids.ctaButton} className="dynamicStyle w-full sm:w-auto px-8 py-3.5 rounded-full font-bold bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 transition shadow-md shadow-rose-500/25 self-start text-xs uppercase tracking-wider" label={data?.[ids.ctaButton] || "${ir.content?.ctaButton || 'GET STARTED'}"} />

c) DO NOT RENDER any right inspector panel!
d) DO NOT RENDER any collaborator row!`;
  } else if (isMultiPageWithForm) {
    const domainCfg = resolveDomainConfig(ir);
    const pages = (Array.isArray(ir.pages) && ir.pages.length > 0) ? ir.pages : ['Home', domainCfg.bookingPageName, domainCfg.teamPageName, 'Services', 'Contact'];
    const formConfig = ir.formConfig || {};
    const services = formConfig.services || domainCfg.categories;
    const timeSlots = formConfig.timeSlots || domainCfg.timeSlots;
    const specialists = domainCfg.specialists;
    const pagesListStr = pages.map(p => `'${p}'`).join(', ');
    const servicesListStr = services.map(s => `'${s}'`).join(', ');
    const slotsListStr = timeSlots.map(t => `'${t}'`).join(', ');
    const specialistsJsonStr = JSON.stringify(specialists);

    userContent += `
=== BLUEPRINT: UNIVERSAL INTERACTIVE MULTI-PAGE & FORM APPLICATION ===
Outer Canvas: 'min-h-screen bg-slate-50 p-3 sm:p-6 lg:p-8 flex items-center justify-center font-sans text-slate-900 overflow-x-hidden'
Main Container: 'w-full max-w-7xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative text-slate-900'

1. IN-COMPONENT REACTIVE STATE ARCHITECTURE:
- activePage: const [activePage, setActivePage] = useState('${pages[0] || 'Home'}');
- Form state:
  const [selectedService, setSelectedService] = useState('${services[0]}');
  const [selectedSpecialist, setSelectedSpecialist] = useState('${specialists[0]?.name || 'Specialist'}');
  const [selectedDate, setSelectedDate] = useState('Mon, Nov 16');
  const [selectedTime, setSelectedTime] = useState('${timeSlots[0] || '10:30 AM'}');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', notes: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

2. TOP HEADER NAVIGATION BAR:
- Brand Emblem: (div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-base shadow-md cursor-pointer" onClick={() => setActivePage('Home')})
- Brand Name: <span id={ids.brandBadge} className="font-black text-base text-slate-900 tracking-tight dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "${domainCfg.brand}" }} />
- Nav Links Pill Bar: (nav className="hidden md:flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-full border border-slate-200")
  Render nav buttons for pages: [${pagesListStr}].
  Each button: onClick={() => setActivePage(page)}, active style: 'bg-slate-900 text-white shadow-sm font-bold', inactive style: 'text-slate-600 hover:text-slate-900 hover:bg-white'.
- Action Pill: (button onClick={() => setActivePage('${domainCfg.bookingPageName}')} className="px-5 py-2 rounded-full bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-sm hidden sm:inline-flex") '${domainCfg.actionLabel}'

3. VIEW 1: HOME PAGE (activePage === 'Home'):
- Hero Section: (div className="flex flex-col lg:flex-row items-center justify-between gap-10 p-6 sm:p-12")
  * Left:
    - Status Badge: (span className="px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold self-start") '${domainCfg.badge}'
    - Headline: <h1 id={ids.headlineMain} className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight dynamicStyle leading-[1.15]" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "${domainCfg.heroHeadline}" }} />
    - Subtitle: <p id={ids.headlineSub} className="text-slate-500 font-semibold text-base mt-2 dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "${domainCfg.heroSub}" }} />
    - Description: <p id={ids.description} className="text-slate-600 text-sm leading-relaxed mt-2 dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "${domainCfg.heroDesc}" }} />
    - Buttons: (div className="flex flex-wrap items-center gap-3 mt-6")
      * Primary CTA: (button onClick={() => setActivePage('${domainCfg.bookingPageName}')} className="px-7 py-3.5 rounded-full bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-lg shadow-blue-500/25") '${domainCfg.actionLabel} →'
      * Secondary: (button onClick={() => setActivePage('${domainCfg.teamPageName}')} className="px-6 py-3.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition") 'Meet Our ${domainCfg.teamPageName}'
  * Right:
    - Hero Photo: <img id={ids.heroImage} src="${domainCfg.heroImage}" alt="${domainCfg.brand}" className="w-full h-80 lg:h-96 object-cover rounded-3xl shadow-xl" />

- Features Grid: (div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-12 pt-0")
  Render 3 domain cards with icons, title, description, and 'Explore →' button.

- Trust / Stats Bar: (div className="border-t border-slate-100 p-6 sm:p-12 flex flex-wrap items-center justify-around gap-6 bg-slate-50/50")
  Render 3 key metrics matching the domain (e.g. '100% Verified Quality', '15k+ Served', '4.9★ Rating').

4. VIEW 2: BOOKING / APPOINTMENT / RESERVATION PAGE (activePage === '${domainCfg.bookingPageName}'):
A full multi-step interactive booking form:
- Form Header: Title '${domainCfg.actionLabel}', subtitle 'Select your preferences and confirm your date & time.'
- If NOT submitted (!isSubmitted):
  1. Service / Category Selector: (div className="flex flex-wrap gap-2")
     Buttons for [${servicesListStr}], clicking sets selectedService.
  2. Specialist Selector: (div className="grid grid-cols-1 sm:grid-cols-3 gap-4")
     Cards for specialists with avatar, name, role, rating. Clicking a card sets selectedSpecialist.
  3. Date Selector: (div className="flex flex-wrap gap-2")
     Pills for dates ['Mon, Nov 16', 'Tue, Nov 17', 'Wed, Nov 18', 'Thu, Nov 19', 'Fri, Nov 20', 'Sat, Nov 21'], clicking sets selectedDate.
  4. Time Slots: (div className="grid grid-cols-3 sm:grid-cols-6 gap-2")
     Buttons for [${slotsListStr}], clicking sets selectedTime.
  5. Contact Fields: Full Name (input), Phone Number (input), Email (input), Special Requests/Notes (textarea).
  6. Submit Button: 'Confirm Booking →', onSubmit handler:
     e.preventDefault();
     setBookingRef('#REF-' + Math.floor(100000 + Math.random() * 900000));
     setIsSubmitted(true);
- If SUBMITTED (isSubmitted):
  Render Confirmation Card:
  - Green checkmark emblem
  - Headline '${domainCfg.confirmedTitle}'
  - Subtitle '${domainCfg.confirmedSub}'
  - Details card showing Booking Reference (bookingRef), Specialist (selectedSpecialist), Service (selectedService), Scheduled Date & Time (selectedDate at selectedTime).
  - Button 'Book Another' onClick={() => setIsSubmitted(false)}.

5. VIEW 3: SPECIALISTS / TEAM DIRECTORY (activePage === '${domainCfg.teamPageName}'):
- Header: 'Our Certified ${domainCfg.teamPageName}', subtitle 'World-class professionals dedicated to excellence.'
- Grid: Render cards for specialists with photos, name, specialty, years of experience, rating, and button '${domainCfg.actionLabel}' onClick={() => { setSelectedSpecialist(name); setActivePage('${domainCfg.bookingPageName}'); }}.

6. VIEW 4: SERVICES CATALOG (activePage === 'Services'):
- Header: 'Comprehensive Services & Offerings'
- Grid of services matching [${servicesListStr}] with descriptions, and 'Book This Service →' buttons that switch to the booking tab!

7. VIEW 5: CONTACT & LOCATION (activePage === 'Contact'):
- Direct contact cards (Hotline, Email, Physical Address, Operating Hours).
- Interactive 'Send a Message' feedback box.

8. FOOTER:
Solid footer with brand name, navigation links, and copyright text.
`;
  } else {
    // UNIVERSAL DYNAMIC BLUEPRINT FOR ANY OTHER WIREFRAME
    const rawCards = (ir.featureCards && ir.featureCards.length > 0) ? ir.featureCards : (ir.content?.featureCards || []);
    const cards = rawCards.length > 0 ? rawCards : [
      { title: 'Core Feature', description: 'Engineered for high performance and live Redux CMS synchronization.' },
      { title: 'Responsive Flow', description: 'Built with mobile-first Tailwind design principles.' }
    ];
    const cardCount = cards.length;
    let gridCols = 'grid-cols-1 sm:grid-cols-2';
    if (cardCount === 1) gridCols = 'grid-cols-1';
    else if (cardCount === 3) gridCols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    else if (cardCount === 4) gridCols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    else if (cardCount >= 5) gridCols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

    const cardsListStr = cards.map((c, i) => 'Card ' + (i + 1) + ': ' + c.title + ' - ' + (c.description || '')).join('\n');
    const sidebarItemsStr = (layout.sidebarItems || ['Overview', 'Analytics', 'Settings']).map(it => 'Item: ' + it).join('\n');

    userContent += `
=== BLUEPRINT: UNIVERSAL HIGH-FIDELITY WIREFRAME RECONSTRUCTION ===
Outer Canvas: 'min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans text-slate-900 overflow-x-hidden'
Main Container: 'w-full max-w-7xl bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative text-slate-900'

${layout.hasNavbar ? `1. Top Header Bar:
- Brand Logo: <span id={ids.brandBadge} className="dynamicStyle font-black text-lg text-slate-900" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "${ir.navbar?.logoText || ir.brandBadge || 'Dashboard'}" }} />
${layout.hasSearchOrForm ? `- Search: <input type="text" placeholder="${ir.inputPlaceholder || 'Search...'}" className="w-64 bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5 text-xs text-slate-800" />` : ''}` : ''}

2. Window Body: (div className="flex flex-col md:flex-row w-full items-stretch")
${layout.hasSidebar ? `a) Left Sidebar (${layout.sidebarType || 'menu'}):
   - Style: bg-slate-50 border-r border-slate-200 p-5 flex flex-col gap-2 w-full md:w-60
   - Items:
${sidebarItemsStr}` : ''}

b) Central Content: (main className="flex-1 min-w-0 p-6 sm:p-8 flex flex-col gap-6")
- Headline: <h1 id={ids.headlineMain} className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "${ir.content?.headlineMain || 'Overview'}" }} />
- Description: <p id={ids.description} className="text-sm text-slate-600 dynamicStyle leading-relaxed" dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "${ir.content?.description || 'Overview description'}" }} />

- Feature Cards (${cardCount} cards in ${gridCols}):
  Render EXACTLY ${cardCount} cards matching the extracted wireframe titles:
${cardsListStr}

- Primary Action: <Button id={ids.ctaButton} className="dynamicStyle w-full sm:w-auto px-8 py-3.5 rounded-full font-bold bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm self-start text-xs" label={data?.[ids.ctaButton] || "${ir.content?.ctaButton || 'GET STARTED'}"} />

${layout.hasDetailPanel ? `c) Right Detail Panel: Render inspector panel.` : 'c) DO NOT RENDER any right inspector panel.'}
${layout.hasBottomRow ? `d) Bottom Row: Render collaborator row.` : 'd) DO NOT RENDER any bottom collaborator row.'}`;
  }

  // 1. Primary Engine: Gemini
  if (process.env.GEMINI_API_KEY) {
    if (!genAIClient) {
      genAIClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    const geminiModels = [
      process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-3.5-flash'
    ];
    for (const gModelName of geminiModels) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const model = genAIClient.getGenerativeModel({ model: gModelName });
          const res = await model.generateContent([
            { text: prompt },
            { text: userContent }
          ]);
          let jsx = res?.response?.text() || '';
          jsx = cleanJsx(jsx);
          if (jsx && jsx.includes('import') && jsx.includes('export default')) {
            console.log(`✦ Successfully synthesized JSX using Gemini (${gModelName})`);
            return { jsx, warnings: [] };
          }
        } catch (err) {
          console.warn(`Gemini synthesis attempt ${attempt} with ${gModelName} warning:`, err.message);
          if (attempt < 2) await new Promise(r => setTimeout(r, 1200));
        }
      }
    }
  }

  // 2. Secondary Engine: OpenRouter
  if (process.env.LLM_API_KEY) {
    if (!openAIClient) {
      openAIClient = new OpenAI({
        apiKey: process.env.LLM_API_KEY,
        baseURL: process.env.LLM_BASE_URL || 'https://openrouter.ai/api/v1',
        defaultHeaders: { 'HTTP-Referer': 'http://localhost:5173', 'X-Title': 'UIGen Studio' }
      });
    }

    const geminiModels = [
      process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-3.5-flash'
    ];

    for (const modelName of geminiModels) {
      try {
        const completion = await openAIClient.chat.completions.create({
          model: modelName,
          messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: userContent }
          ],
          temperature: 0.2,
          max_tokens: 3500
        });

        let jsx = completion.choices?.[0]?.message?.content || '';
        jsx = cleanJsx(jsx);
        if (jsx && jsx.includes('import') && jsx.includes('export default')) {
          console.log(`✦ Successfully synthesized JSX using OpenRouter (${modelName})`);
          return { jsx, warnings: [] };
        }
      } catch (e) {
        console.warn(`OpenRouter synthesis warning for ${modelName}:`, e.message);
      }
    }
  }

  return { jsx: '', warnings: ['All candidate LLM models exhausted'] };
}

function cleanJsx(raw) {
  if (!raw || !raw.trim()) return '';
  let jsx = raw;
  const fenceMatch = jsx.match(/```(?:jsx|javascript|js)?\s*([\s\S]*?)```/i);
  if (fenceMatch && fenceMatch[1]) {
    jsx = fenceMatch[1];
  } else {
    jsx = jsx.replace(/^```[\w]*\n?/gm, '').replace(/\n?```$/gm, '');
  }

  const importIdx = jsx.search(/(?:^|\n)\s*(?:import|export|const|function)\s/);
  if (importIdx > 0) {
    jsx = jsx.slice(importIdx);
  }
  return jsx.trim();
}
