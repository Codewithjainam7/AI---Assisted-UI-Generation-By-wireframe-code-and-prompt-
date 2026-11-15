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

  let userContent = `Generate the React section component for this IR JSON:
${JSON.stringify(ir, null, 2)}`;

  userContent += `

=== PIXEL-ACCURATE WIREFRAME RECONSTRUCTION DIRECTIVES ===
Detected Wireframe Archetype: ${isMultiMobile ? 'Multi-Screen Mobile Onboarding Flow (3 Phones)' : isPortal ? 'Corporate Intranet / Application Portal' : isWellness ? 'Wellness / Calorie Tracking Dashboard' : isAnalytics ? 'Analytics SaaS Dashboard' : isSingleMobile ? 'Single Mobile Screen' : 'Universal Responsive Layout'}
Domain: ${ir.domain || 'general'}
Screen Type: ${ir.screenType || ir.sectionType || 'custom'}
Form Factor: ${ir.formFactor || 'responsive'}

CRITICAL COLOR & FIDELITY RULES:
1. Use ONLY standard Tailwind palette color classes (bg-slate-900, bg-slate-100, bg-white, bg-pink-100, bg-amber-400, text-slate-900, text-rose-500, border-slate-200, etc.). Never use arbitrary bracket syntax like bg-[#...].
2. High Contrast: All text on light surfaces MUST have explicit dark text classes ('text-slate-900', 'text-slate-800', 'text-slate-600').
3. Strict Fidelity: DO NOT mix elements from different wireframes! Only build what is specified for this wireframe archetype.
`;

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
- Illustration: Circular photo container (div className="w-48 h-48 mx-auto rounded-full overflow-hidden shadow-md my-4") containing a food photo.
- Title & Desc: <h2 className="text-2xl font-black text-slate-900 text-center tracking-tight">Browse</h2> <p className="text-xs text-slate-600 text-center mt-2 leading-relaxed">Explore a wide variety of catering menus curated for your team.</p>
- Stepper: (div className="flex justify-center gap-2 my-4") with diamonds (◆ ◇ ◇) where the 1st diamond is active (bg-rose-500 rotate-45 w-2 h-2).
- Footer: <button className="text-slate-400 text-xs font-bold uppercase self-start">SKIP</button>

Phone 2 ('Order'):
- Container: Same sleek mobile container.
- Header: <span>STEP 2</span> <span className="text-rose-500 cursor-pointer">DONE</span>
- Illustration: Circular photo container with food photo.
- Title & Desc: <h2 className="text-2xl font-black text-slate-900 text-center tracking-tight">Order</h2> <p className="text-xs text-slate-600 text-center mt-2 leading-relaxed">Customize dietary preferences and schedule delivery with precision.</p>
- Stepper: Diamonds (◇ ◆ ◇) where the 2nd diamond is active (bg-rose-500).
- Footer: <button className="text-slate-400 text-xs font-bold uppercase self-start">SKIP</button>

Phone 3 ('Enjoy'):
- Container: Same sleek mobile container.
- Header: <span>STEP 3</span> <span className="text-rose-500 cursor-pointer">DONE</span>
- Illustration: Circular photo container with food photo.
- Title & Desc: <h2 id={ids.headlineMain} className="text-2xl font-black text-slate-900 text-center tracking-tight dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "Enjoy" }} /> <p id={ids.description} className="text-xs text-slate-600 text-center mt-2 leading-relaxed dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "Delight in fresh, restaurant-quality catering delivered directly to your venue." }} />
- Stepper: Diamonds (◇ ◇ ◆) where the 3rd diamond is active (bg-rose-500).
- Footer: (div className="flex items-center gap-3 w-full") <button className="text-slate-400 text-xs font-bold uppercase">SKIP</button> <Button id={ids.ctaButton} className="dynamicStyle flex-1 py-3.5 rounded-full font-bold bg-slate-900 text-white hover:bg-slate-800 transition shadow-lg text-xs" label={data?.[ids.ctaButton] || "${ir.content?.ctaButton || 'GET STARTED'}"} />

DO NOT RENDER any right detail inspector panel.
DO NOT RENDER any bottom collaborator row.`;
  } else if (isPortal) {
    const portal = layout.portal || {};
    const appShortcuts = portal.appShortcuts || ['Salesforce', 'My file', 'Chatter', 'Planner', 'Cornerstone', 'Repository', 'Standards'];
    const sidebarUser = layout.sidebarUser || { name: 'Ivon Stoilov', stats: '527 / 378' };

    userContent += `
=== BLUEPRINT: CORPORATE INTRANET / APPLICATION PORTAL ===
Outer Canvas: 'min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans text-slate-900 overflow-x-hidden'
Main Window Container: 'w-full max-w-7xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative text-slate-900'

1. Top Header Bar:
- Solid header (header className="w-full bg-slate-200 border-b border-slate-300 px-6 py-3.5 flex items-center justify-between text-slate-900 font-bold text-base")
- Brand: <div className="flex items-center gap-2 font-black text-lg text-slate-900"><span id={ids.brandBadge} className="dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "${ir.navbar?.logoText || ir.brandBadge || 'CompanyName'}" }} /></div>
- Search with Toggle: (div className="flex items-center gap-3") <input type="text" placeholder="${ir.inputPlaceholder || 'Start typing what are you looking for...'}" className="w-64 sm:w-80 bg-white border border-slate-300 rounded-full px-4 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400" /> <span className="text-xs text-slate-500 font-semibold cursor-pointer hidden sm:inline">Advanced search</span>

2. Window Body: (div className="flex flex-col lg:flex-row w-full items-stretch")
a) Left Profile Sidebar: (aside className="w-full lg:w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0")
   - User Profile Card: (div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-col items-center text-center")
     Avatar: Circular border-2 border-slate-300 w-20 h-20 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center text-slate-400
     Reputation: <span className="text-xs font-bold text-slate-500 mt-2">${sidebarUser.stats || '527 / 378'}</span>
     Username: <h2 className="text-base font-bold text-slate-900 mt-1">${sidebarUser.name || 'Ivon Stoilov'}</h2>
   - Navigation Menu: (nav className="p-5 flex flex-col gap-3") with links: Home, About, Organisation, Support, News.

b) Central Content Area: (main className="flex-1 min-w-0 p-6 sm:p-8 flex flex-col gap-6")
   - Applications Header: (div className="flex items-center justify-between") <h2 id={ids.headlineMain} className="text-xl font-black text-slate-900 tracking-tight dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "My applications" }} /> <a href="#" className="text-xs font-bold text-blue-600 hover:underline">Edit</a>
   - App Shortcuts Grid (${appShortcuts.length} apps): (div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3")
${appShortcuts.map((app, i) => `     Tile ${i + 1}: (div className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:shadow-xs transition text-center") with square app icon and <span className="text-xs font-bold text-slate-800 mt-2 truncate w-full">${app}</span>`).join('\n')}
   - 'Today\'s news' Banner Card: (div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm mt-4")
     Photo: <img id={ids.heroImage} className="w-full md:w-80 h-48 sm:h-auto object-cover" src={data?.[ids.heroImage] ? getImage(data[ids.heroImage]) : "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"} onError={errorImage} alt="News banner" />
     Story: (div className="p-6 flex flex-col justify-between flex-1")
       <div>
         <span className="text-xs font-bold text-rose-500 uppercase">Today\'s news</span>
         <h3 id={ids.headlineSub} className="text-xl font-black text-slate-900 tracking-tight mt-1 dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "The real deal: Company is growing big" }} />
         <p id={ids.description} className="text-xs text-slate-600 mt-2 leading-relaxed dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "Significant strategic milestones achieved across global operational centers." }} />
       </div>
       <a href="#" className="text-xs font-bold text-slate-900 hover:underline mt-4 inline-flex items-center gap-1">Read full article →</a>

c) Right Sidebar: (aside className="w-full lg:w-72 bg-slate-50 border-l border-slate-200 p-6 flex flex-col gap-6 flex-shrink-0")
   - 'Standardization' Card: (div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs") <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Standardization</h4> <p className="text-xs text-slate-600">Company standards & compliance protocols</p>
   - 'My connections' Card: (div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs") <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">My connections</h4> (div className="flex -space-x-2") with circular colleague avatars.
   - Primary CTA Button: <Button id={ids.ctaButton} className="dynamicStyle w-full py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm text-xs" label={data?.[ids.ctaButton] || "${ir.content?.ctaButton || 'Contact site admin'}"} />`;
  } else if (isWellness) {
    const sidebarUser = layout.sidebarUser || { name: 'Kiraa' };
    const tabs = layout.tabs || ['Meal Plan', 'Exercise Plan'];
    const featureCards = ir.featureCards?.length ? ir.featureCards : [
      { title: 'BREAKFAST', description: 'Healthy morning meal plan' },
      { title: 'MORNING SNACK', description: 'Nutritious mid-day boost' }
    ];

    userContent += `
=== BLUEPRINT: WELLNESS / NUTRITION DASHBOARD ===
Outer Canvas: 'min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans text-slate-900 overflow-x-hidden'
Main Window Container: 'w-full max-w-7xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative text-slate-900'

1. Top Header Bar:
- Full-width Header: (header className="w-full bg-slate-200 border-b border-slate-300 px-6 py-3.5 flex items-center justify-between text-slate-900 font-bold text-base")
- Title: <div className="flex items-center gap-2 font-black text-lg text-slate-900"><span id={ids.brandBadge} className="dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "${ir.navbar?.logoText || ir.brandBadge || 'Wellness Page Wireframe'}" }} /></div>

2. Window Body: (div className="flex flex-col md:flex-row w-full items-stretch")
a) Left Pink Sidebar: (aside className="w-full sm:w-60 md:w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 self-stretch")
   - Profile Header Card: (div className="bg-pink-100 border-b border-pink-200 p-6 flex flex-col items-center justify-center")
     Avatar: (div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center border-2 border-pink-200 text-slate-400 overflow-hidden") with SVG user silhouette.
     Username: <h2 className="text-center font-bold text-slate-800 text-base mt-2.5">${sidebarUser.name || 'Kiraa'}</h2>
   - Navigation Links: (nav className="p-5 flex flex-col gap-3.5") with links: Diary, Shopping Lists, Your Progress, Your Profile, Settings.

b) Main Content Area: (main className="flex-1 min-w-0 flex flex-col")
   - Sub-header Bar: (div className="border-b border-slate-200 px-6 pt-4 pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4")
     Tabs: <button className="pb-3 text-slate-900 font-extrabold text-base border-b-2 border-slate-900 tracking-tight">${tabs[0] || 'Meal Plan'}</button> <button className="pb-3 text-slate-400 hover:text-slate-600 font-semibold text-base tracking-tight transition-colors">${tabs[1] || 'Exercise Plan'}</button>
     Date Switcher on right: (div className="flex flex-col items-end pb-2 text-right") <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-sm"><span className="text-slate-400 cursor-pointer">&lt;</span><span id={ids.headlineSub} className="dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Friday 23rd December" }} /><span className="text-slate-400 cursor-pointer">&gt;</span></div><span className="text-xs text-slate-500 font-bold">Today</span>

   - Main Content Body: (div className="p-6 sm:p-8 flex flex-col gap-8")
     * Calorie Tracker: (div className="flex flex-col gap-3")
       <h3 id={ids.headlineMain} className="text-xl font-extrabold text-rose-500 tracking-tight dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "Your Calories" }} />
       (div className="flex items-center gap-4")
       <svg className="w-14 h-14 text-slate-800 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
       <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">${ir.statCards?.[0]?.field1 || '1999 Calories'}</span>

     * EXACTLY 2 Meal Cards: (div className="grid grid-cols-1 sm:grid-cols-2 gap-6")
${featureCards.map((card, idx) => `       Card ${idx + 1} (${card.title}): (div className="bg-slate-300 rounded-2xl overflow-hidden relative shadow-sm border border-slate-300 flex flex-col p-4")
         - Media placeholder: (div className="h-36 sm:h-40 rounded-xl bg-slate-200 mb-3 flex items-center justify-center") with SVG image icon.
         - Title: <div className="text-sm font-bold text-slate-900 uppercase">${card.title}</div>
         - Description: <div className="text-xs text-slate-600 mt-1">${card.description || 'Meal details placeholder'}</div>`).join('\n')}

     * Primary Action Button:
       <Button id={ids.ctaButton} className="dynamicStyle w-full sm:w-auto px-8 py-3.5 rounded-full font-bold bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm self-start" label={data?.[ids.ctaButton] || "${ir.content?.ctaButton || 'GET STARTED'}"} />

c) DO NOT RENDER any right inspector panel!
d) DO NOT RENDER any collaborator row!`;
  } else if (isAnalytics) {
    userContent += `
=== BLUEPRINT: ANALYTICS SAAS DASHBOARD ===
Outer Canvas: 'min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans text-slate-900 overflow-x-hidden'
Main Window: 'w-full max-w-7xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative text-slate-900'

1. Top Header: Brand badge 'ANALYTICS-CORE', Search input.
2. Window Body:
a) Left Yellow Capsule Rail: (aside className="w-16 min-w-[4rem] max-w-[4rem] bg-amber-400 rounded-3xl py-6 px-2 flex flex-col items-center justify-between shadow-lg flex-shrink-0 self-stretch my-3 ml-3") with 7 SVG action icons.
b) Central Content: Sub-header tabs, 3x2 grid of 6 metric cards.
c) Right Inspector Panel: Image preview, 'Actionable Data Insights', 4.9/5 stars rating, description, and yellow 'View Analytics' button.
d) Bottom Collaborator Row: User avatar bubbles.`;
  } else {
    // Universal Blueprint
    userContent += `
=== BLUEPRINT: UNIVERSAL RESPONSIVE WIREFRAME ===
Outer Canvas: 'min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans text-slate-900 overflow-x-hidden'
Main Container: 'w-full max-w-7xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative text-slate-900'

${layout.hasNavbar ? `1. Top Header Bar:
- Brand Logo: <span id={ids.brandBadge} className="dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "${ir.navbar?.logoText || ir.brandBadge || 'Dashboard'}" }} />
${layout.hasSearchOrForm ? `- Search: <input type="text" placeholder="${ir.inputPlaceholder || 'Search...'}" className="w-64 bg-white border border-slate-300 rounded-full px-4 py-1.5 text-xs text-slate-800" />` : ''}` : ''}

2. Window Body:
${layout.hasSidebar ? `a) Sidebar (${layout.sidebarType}): Render sidebar with color ${layout.sidebarColor || 'white'} and items: ${(layout.sidebarItems || []).join(', ')}` : ''}
b) Central Content:
- Headline: <h1 id={ids.headlineMain} className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "${ir.content?.headlineMain || 'Overview'}" }} />
- Description: <p id={ids.description} className="text-sm text-slate-600 mt-1 dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "${ir.content?.description || 'Overview description'}" }} />
${(Array.isArray(ir.featureCards) && ir.featureCards.length > 0) ? `- Feature Cards (${ir.featureCards.length} cards): Render EXACTLY ${ir.featureCards.length} cards matching the wireframe titles: ${ir.featureCards.map(c => c.title).join(', ')}` : ''}
- Action Button: <Button id={ids.ctaButton} className="dynamicStyle w-full sm:w-auto px-8 py-3 rounded-full font-bold bg-slate-900 text-white" label={data?.[ids.ctaButton] || "${ir.content?.ctaButton || 'GET STARTED'}"} />

${layout.hasDetailPanel ? `c) Right Detail Panel: Render inspector panel.` : 'c) DO NOT render any right inspector panel.'}
${layout.hasBottomRow ? `d) Bottom Row: Render collaborator row.` : 'd) DO NOT render any bottom collaborator row.'}`;
  }

  userContent += `

=== MANDATORY CONTRACT RULES (R1–R14) ===
- Declare const ids = { heroImage: "TBD-heroImage", brandBadge: "TBD-brandBadge", headlineMain: "TBD-headlineMain", headlineSub: "TBD-headlineSub", description: "TBD-description", statBadges: "TBD-statBadges", ctaButton: "TBD-ctaButton" };
- On mount, dispatch fetchElementsByIds with all IDs and cardField IDs (TBD-cardField1 to TBD-cardField6).
- Use dangerouslySetInnerHTML for text nodes.
- Use PrimeReact Button with label from CMS.
- Mobile-first responsive layout (stacks cleanly on 375px screens).`;

  // 1. Primary Engine: Gemini
  if (process.env.GEMINI_API_KEY) {
    if (!genAIClient) {
      genAIClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    const geminiModels = [
      process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-3.5-flash',
      'gemini-flash-latest'
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
