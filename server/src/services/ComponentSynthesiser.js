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
      'gemini-flash-lite-latest',
      'gemini-3.1-flash-lite'
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

    const candidateModels = [
      'nvidia/nemotron-3-ultra-550b-a55b:free',
      process.env.LLM_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b',
      'nvidia/nemotron-3.5-lightning:free',
      'google/gemma-4-26b-a4b-it:free'
    ];

    for (const modelName of candidateModels) {
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
