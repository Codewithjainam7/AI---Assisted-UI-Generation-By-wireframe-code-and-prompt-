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
  let userContent = `Generate the React section component for this IR JSON:\n${JSON.stringify(ir, null, 2)}`;

  const layout = ir.layout || {};
  const isMobile = ir.formFactor === 'mobile' || (layout.direction === 'column' && layout.columns === 1 && !layout.hasSidebar && layout.hasBottomNav);

  userContent += `\n\n=== PIXEL-ACCURATE WIREFRAME RECONSTRUCTION DIRECTIVES ===
Visual Concept & Blueprint: ${ir.imageConcept || ir.content?.imageConcept || 'Custom UI wireframe layout'}
Domain: ${ir.domain || 'general'}
Screen Type: ${ir.screenType || ir.sectionType || 'custom'}
Form Factor: ${isMobile ? 'Mobile App Screen' : 'Desktop / Responsive Web Application'}

CRITICAL FIDELITY DIRECTIVES:
You MUST reconstruct the EXACT user interface shown in the wireframe blueprint with 100% geometric and visual fidelity:
CRITICAL COLOR RULE: Use ONLY standard Tailwind palette color classes (e.g. bg-slate-700, bg-slate-300, bg-slate-200, bg-pink-100, bg-amber-400, text-rose-500, text-slate-900, text-white, border-slate-300). DO NOT use arbitrary bracket syntax like bg-[#...] or text-[#...].

1. Layout Shell & Main Application Window:
${isMobile ? `   - Mobile Shell: Outer canvas 'min-h-screen bg-slate-950 p-2 sm:p-6 flex items-center justify-center font-sans overflow-x-hidden text-slate-900'.
   - Phone Frame Container: 'w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border-4 border-slate-800 overflow-hidden flex flex-col relative min-h-[750px]'.`
: `   - Outer Canvas: 'bg-slate-100 min-h-screen p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans overflow-x-hidden text-slate-900'.
   - Main Window Container: 'w-full max-w-7xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative text-slate-900'.`}

2. Top Header Bar:
${(layout.hasNavbar || ir.navbar?.logoText || ir.brandBadge || /gray banner|bar at top|happypiggy/i.test(ir.imageConcept || '')) ? `   - Full-width Solid Header Bar spanning the very top of the window (header className="w-full bg-slate-200 border-b border-slate-300 px-6 py-3.5 flex items-center justify-between text-slate-900 font-bold text-base"):
     * Left side / Brand Logo: <div className="flex items-center gap-2 font-black text-lg text-slate-900"><span id={ids.brandBadge} className="dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "${ir.navbar?.logoText || ir.brandBadge || 'HappyPiggy'}" }} /><span>🐷</span></div>
     ${ir.navbar?.links?.length ? `* Nav links: ${ir.navbar.links.map(l => `<a href="#" className="text-sm font-semibold text-slate-700 hover:text-slate-950">${l}</a>`).join(' ')}` : ''}
     ${ir.inputPlaceholder ? `* Search input: <input type="text" placeholder="${ir.inputPlaceholder}" className="w-64 bg-white/90 border border-slate-300 rounded-full px-4 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400" />` : ''}`
: `   - Top header with brand/title: <h1 id={ids.brandBadge} className="text-xl font-black text-slate-900">${ir.brandBadge || 'App'}</h1>`}

3. Window Body (Sidebar + Content):
   - The body underneath the top bar uses: (div className="flex flex-col md:flex-row w-full items-stretch")
${layout.hasSidebar ? (
  layout.sidebarType === 'profile-sidebar' ? `   a) Left Profile Sidebar:
     * Dedicated vertical sidebar (aside className="w-full sm:w-60 md:w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 self-stretch"):
     * Top Profile Card (div className="bg-pink-100/80 border-b border-pink-200/80 p-6 flex flex-col items-center justify-center"):
       - User Avatar: Circular white container (div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center border-2 border-pink-200 text-slate-400 overflow-hidden") containing SVG user silhouette:
         <svg className="w-12 h-12 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
       - User Name: <h2 className="text-center font-bold text-slate-800 text-base mt-2.5">${layout.sidebarUser?.name || 'Kiraa'}</h2>
     * Bottom Navigation Menu List (nav className="p-5 flex flex-col gap-3.5"):
       Render each menu item vertically: ${(layout.sidebarItems || ['Diary', 'Shopping Lists', 'Your Progress', 'Your Profile', 'Settings']).map(item => `<div className="flex items-center gap-3 text-slate-700 hover:text-slate-950 font-medium text-sm transition-colors cursor-pointer py-1"><span className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0"></span><span>${item}</span></div>`).join(' ')}`
  : layout.sidebarType === 'icon-rail' ? `   a) Left Vertical Icon Rail:
     * Dedicated vertical capsule rail (aside className="w-16 min-w-[4rem] max-w-[4rem] ${layout.sidebarColor ? `bg-${layout.sidebarColor}` : 'bg-amber-400'} rounded-3xl py-6 px-2 flex flex-col items-center justify-between shadow-lg flex-shrink-0 self-stretch"):
     * Render SVG action icons matching: ${(layout.sidebarIcons || ['menu', 'chart', 'star', 'grid', 'settings']).join(', ')}. Every SVG icon MUST have explicit classes: 'w-5 h-5 min-w-[20px] min-h-[20px] text-slate-900'.`
  : `   a) Left Sidebar matching the wireframe: (aside className="w-full sm:w-56 bg-slate-100 rounded-2xl p-4 flex flex-col gap-4 flex-shrink-0").`
) : `   - NO sidebar. The layout spans full width without a sidebar.`}

   b) Main Workspace Content Area:
      - Takes remaining space: (main className="flex-1 min-w-0 flex flex-col")
${layout.hasTabs || layout.dateNavigator ? `      - Sub-Header Bar with Tabs & Date Switcher (div className="border-b border-slate-200 px-6 pt-4 pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"):
        * Left Tabs: (div className="flex items-center gap-6")
          ${(layout.tabs || ['Meal Plan', 'Exercise Plan']).map((t, i) => i === 0
            ? `<button className="pb-3 text-slate-900 font-extrabold text-base border-b-2 border-slate-900 tracking-tight">${t}</button>`
            : `<button className="pb-3 text-slate-400 hover:text-slate-600 font-semibold text-base tracking-tight transition-colors">${t}</button>`
          ).join(' ')}
        * Right Date Navigator: (div className="flex flex-col items-end pb-2 text-right")
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-sm">
            <span className="text-slate-400 font-bold cursor-pointer hover:text-slate-700">&lt;</span>
            <span>${layout.dateNavigator ? layout.dateNavigator.replace(/today/i, '').trim() : 'Friday 23rd December'}</span>
            <span className="text-slate-400 font-bold cursor-pointer hover:text-slate-700">&gt;</span>
          </div>
          <span className="text-xs text-slate-500 font-bold">Today</span>` : ''}

      - Main Content Canvas (div className="p-6 sm:p-8 flex flex-col gap-8"):
${(ir.statCards?.length > 0 || /calor|track|pie|metric|chart/i.test(ir.imageConcept || '')) ? `        * Calorie / Metric Tracker Section:
          (div className="flex flex-col gap-3")
          <h3 id={ids.headlineMain} className="text-xl font-extrabold text-rose-500 tracking-tight dynamicStyle" dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "Your Calories" }} />
          <div className="flex items-center gap-4">
            <svg className="w-14 h-14 text-slate-800 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">${ir.statCards?.[0]?.field1 || '1999 Calories'}</span>
          </div>` : ''}

${(Array.isArray(ir.featureCards) && ir.featureCards.length > 0) ? `        * Meal / Content Cards Grid (${ir.featureCards.length} cards):
          (div className="grid grid-cols-1 ${ir.featureCards.length === 2 ? 'sm:grid-cols-2' : ir.featureCards.length === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'} gap-6")
          Render EXACTLY these ${ir.featureCards.length} cards:
${ir.featureCards.map((card, idx) => `          Card ${idx + 1}: (div className="bg-slate-300 rounded-2xl overflow-hidden relative shadow-sm border border-slate-300 flex flex-col"):
            - Top-left category tag: <div className="bg-slate-700 text-white text-xs sm:text-sm font-black uppercase px-4 py-2 self-start rounded-br-xl shadow-sm">${card.title}</div>
            - Card body placeholder: (div className="h-56 sm:h-64 flex items-center justify-center relative p-6") containing SVG landscape photo placeholder icon:
              <svg className="w-16 h-16 text-white/90" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
            - DO NOT add extra paragraphs or fake text inside the card that wasn't in the wireframe.`).join('\n')}
          DO NOT generate extra cards beyond these ${ir.featureCards.length} cards.` : ''}

        * Action Button:
          <Button id={ids.ctaButton} className="dynamicStyle w-full sm:w-auto px-8 py-3 rounded-full font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm self-start" label={data?.[ids.ctaButton] || "Update Daily Log"} aria-label="Action button" />

4. Detail / Inspector Panel:
${layout.hasDetailPanel ? `   - Right-hand Inspector Panel: (aside className="w-full lg:w-80 min-w-[18rem] max-w-[20rem] bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between flex-shrink-0") with preview card, headline, description, ratings, and CTA buttons.`
: `   - DO NOT render any right-hand detail inspector panel. The central content area spans full remaining width.`}

5. Collaborator / Bottom Row:
${layout.hasBottomRow && Array.isArray(ir.bottomRowItems) && ir.bottomRowItems.length > 0 ? `   - Bottom Activity / Collaborator Row: (div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 mt-auto") with ${ir.bottomRowItems.length} user avatar cards.`
: `   - DO NOT render any bottom collaborator or activity row.`}

6. Mandatory High-Contrast Styling & Contract Rules (R1–R14):
   - All text on white/light backgrounds MUST have explicit dark text colors ('text-slate-900', 'text-slate-800', 'text-slate-600').
   - Declare const ids = { heroImage: "TBD-heroImage", brandBadge: "TBD-brandBadge", headlineMain: "TBD-headlineMain", headlineSub: "TBD-headlineSub", description: "TBD-description", statBadges: "TBD-statBadges", ctaButton: "TBD-ctaButton" };
   - On mount, dispatch fetchElementsByIds with all IDs and cardField IDs (TBD-cardField1 to TBD-cardField6).
   - Use dangerouslySetInnerHTML for text nodes.
   - Use PrimeReact Button with label from CMS.
   - Mobile-first responsive layout (stacks cleanly on 375px screens).`;

  // 1. Primary Engine: Gemini (using user-configured or verified models)
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
          max_tokens: 3000
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
