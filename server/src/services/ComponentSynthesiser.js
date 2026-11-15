import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getJSXSystemPrompt } from '../templates/jsx-system-prompt.js';

let openAIClient;
let genAIClient;

export async function generate(ir) {
  const prompt = getJSXSystemPrompt();
  let userContent = `Generate the React section component for this IR JSON:\n${JSON.stringify(ir, null, 2)}`;

  const layout = ir.layout || {};
  const isMobile = ir.formFactor === 'mobile' || (layout.direction === 'column' && layout.columns === 1 && !layout.hasSidebar && layout.hasBottomNav);
  const isAppOrDashboard = layout.hasSidebar || layout.hasTabs || layout.hasCardGrid || ir.screenType === 'desktop-dashboard' || ir.sectionType === 'dashboard-hero';

  userContent += `\n\n=== UNIVERSAL WIREFRAME RECONSTRUCTION DIRECTIVES ===
Visual Concept & Blueprint: ${ir.imageConcept || ir.content?.imageConcept || 'Custom UI wireframe layout'}
Domain: ${ir.domain || 'general'}
Screen Type: ${ir.screenType || ir.sectionType || 'custom'}
Form Factor: ${isMobile ? 'Mobile App Screen' : 'Desktop / Responsive Web Application'}

CRITICAL FIDELITY DIRECTIVES:
You MUST reconstruct the EXACT user interface shown in the wireframe blueprint without forcing any extraneous templates:

1. Layout Shell & Container:
${isMobile ? `   - Mobile Shell: Outer wrapper 'min-h-screen bg-slate-950 p-2 sm:p-6 flex items-center justify-center font-sans overflow-x-hidden text-slate-900'.
   - Phone Frame Container: 'w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border-4 border-slate-800 overflow-hidden flex flex-col relative min-h-[750px]'.`
: `   - Outer Canvas: '${ir.theme?.surface === 'light' ? 'bg-[#f1f5f9]' : 'bg-slate-950'} min-h-screen p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans overflow-x-hidden ${ir.theme?.surface === 'light' ? 'text-slate-900' : 'text-white'}'.
   - Application Window: '${ir.theme?.surface === 'light' ? 'w-full max-w-7xl bg-white rounded-3xl sm:rounded-[2.5rem] shadow-2xl border border-slate-200 p-5 sm:p-8 flex flex-col gap-6 text-slate-900 relative' : 'w-full max-w-7xl bg-slate-900 rounded-3xl sm:rounded-[2.5rem] shadow-2xl border border-slate-800 p-5 sm:p-8 flex flex-col gap-6 text-white relative'}'.`}

2. Top Navigation Bar / Header:
${(layout.hasNavbar || ir.navbar?.logoText || ir.brandBadge) ? `   - Full-width header spanning the top (header className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4"):
     * Brand / App Title: <h1 id={ids.brandBadge} className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dynamicStyle">${ir.navbar?.logoText || ir.brandBadge || 'App'}</h1>
     ${ir.navbar?.links?.length ? `* Nav links: ${ir.navbar.links.map(l => `<a href="#" className="text-sm font-semibold text-slate-600 hover:text-slate-900">${l}</a>`).join(' ')}` : ''}
     ${ir.inputPlaceholder ? `* Search input: <input type="text" placeholder="${ir.inputPlaceholder}" className="w-64 bg-slate-100 border border-slate-200 rounded-full px-4 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400" />` : ''}`
: `   - Top header with brand/title: <h1 id={ids.brandBadge} className="text-xl font-black text-slate-900">${ir.brandBadge || 'App'}</h1>`}

3. Sidebar Navigation:
${layout.hasSidebar ? (
  layout.sidebarType === 'profile-sidebar' ? `   - Left Profile Sidebar:
     * Dedicated vertical sidebar (aside className="w-full sm:w-56 md:w-64 ${layout.sidebarColor ? (layout.sidebarColor.includes('pink') ? 'bg-pink-100 border-pink-200' : `bg-${layout.sidebarColor}`) : 'bg-pink-100 border-pink-200'} rounded-2xl p-5 flex flex-col gap-6 flex-shrink-0 self-stretch border shadow-sm"):
     * User Profile Info: Avatar circle (<div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-300 flex items-center justify-center text-slate-700 font-black text-xl mx-auto shadow-inner">${(layout.sidebarUser?.name || 'U')[0]}</div>) and username (<h2 className="text-center font-bold text-slate-800 text-base mt-2">${layout.sidebarUser?.name || 'User'}</h2>).
     * Menu Navigation List: Render each menu item vertically: ${(layout.sidebarItems || ['Overview', 'Settings']).map(item => `• "${item}"`).join(', ')}. Each item should have a bullet dot or icon, high-contrast dark text (text-slate-800 font-medium text-sm hover:text-slate-950 py-1.5 cursor-pointer flex items-center gap-2).`
  : layout.sidebarType === 'icon-rail' ? `   - Left Vertical Icon Rail:
     * Dedicated vertical capsule rail (aside className="w-16 min-w-[4rem] max-w-[4rem] ${layout.sidebarColor ? `bg-${layout.sidebarColor}` : 'bg-amber-400'} rounded-3xl py-6 px-2 flex flex-col items-center justify-between shadow-lg flex-shrink-0 self-stretch"):
     * Render SVG action icons matching: ${(layout.sidebarIcons || ['menu', 'chart', 'star', 'grid', 'settings']).join(', ')}. Every SVG icon MUST have explicit classes: 'w-5 h-5 min-w-[20px] min-h-[20px] text-slate-900'.`
  : `   - Left Sidebar matching the wireframe: (aside className="w-full sm:w-56 bg-slate-100 rounded-2xl p-4 flex flex-col gap-4 flex-shrink-0").`
) : `   - NO sidebar. The layout spans full width without a sidebar.`}

4. Central Workspace & Content:
   - Container: (div className="flex-1 min-w-0 flex flex-col gap-6")
${layout.hasTabs ? `   - Tab Navigation Bar:
     * Render tab switcher with ${(layout.tabs || ['Tab 1', 'Tab 2']).map(t => `"${t}"`).join(', ')}.
     * Highlight active tab "${layout.activeTab || layout.tabs?.[0] || 'Tab 1'}" with bold text and bottom border underline indicator (border-b-2 border-slate-900 font-bold).` : ''}
${layout.dateNavigator ? `   - Date Navigator / Subheader:
     * Render date picker / status switcher: "${layout.dateNavigator}" (e.g. left chevron <, date text, right chevron >, Today badge).` : ''}
${(ir.statCards?.length > 0 || /calor|track|pie|metric|chart/i.test(ir.imageConcept || '')) ? `   - Metrics / Tracker Widget:
     * Prominent metric container (bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4).
     * High-contrast title and metric values (e.g. pie chart SVG or progress ring + stat values).` : ''}
${(Array.isArray(ir.featureCards) && ir.featureCards.length > 0) ? `   - Feature / Content Cards (${ir.featureCards.length} cards):
     * Grid Layout: ${layout.cardGridCols || (ir.featureCards.length <= 2 ? 2 : 3)} columns (div className="grid grid-cols-1 ${ir.featureCards.length === 2 ? 'sm:grid-cols-2' : ir.featureCards.length === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'} gap-6").
     * Render EXACTLY these ${ir.featureCards.length} cards:
       ${ir.featureCards.map((card, idx) => `Card ${idx + 1}: Title "${card.title}", Description "${card.description || ''}", category banner (bg-slate-700 text-white text-xs font-bold uppercase px-3 py-1.5 rounded-t-lg inline-block), and large image placeholder or photo container (h-48 bg-slate-200 rounded-xl flex items-center justify-center text-slate-500 overflow-hidden).`).join('\n       ')}
     * DO NOT generate extra cards beyond these ${ir.featureCards.length} cards.` : ''}

5. Detail / Inspector Panel:
${layout.hasDetailPanel ? `   - Right-hand Inspector Panel: (aside className="w-full lg:w-80 min-w-[18rem] max-w-[20rem] bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between flex-shrink-0") with preview card, headline, description, ratings, and CTA buttons.`
: `   - DO NOT render any right-hand detail inspector panel. The central content area spans the full remaining width.`}

6. Collaborator / Bottom Row:
${layout.hasBottomRow && Array.isArray(ir.bottomRowItems) && ir.bottomRowItems.length > 0 ? `   - Bottom Activity / Collaborator Row: (div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 mt-auto") with ${ir.bottomRowItems.length} user avatar cards.`
: `   - DO NOT render any bottom collaborator or activity row.`}

7. Mobile Bottom Navigation:
${layout.hasBottomNav ? `   - Sticky Mobile Bottom Navigation: (nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-16 flex items-center justify-around px-4") with icons for ${(layout.bottomNavItems || ['Home', 'Search', 'Profile']).join(', ')}.` : ''}

8. Mandatory High-Contrast Styling & Contract Rules (R1–R14):
   - All text on white/light backgrounds MUST have explicit dark text colors ('text-slate-900', 'text-slate-800', 'text-slate-600').
   - Declare const ids = { heroImage: "TBD-heroImage", brandBadge: "TBD-brandBadge", headlineMain: "TBD-headlineMain", headlineSub: "TBD-headlineSub", description: "TBD-description", statBadges: "TBD-statBadges", ctaButton: "TBD-ctaButton" };
   - On mount, dispatch fetchElementsByIds with all IDs and cardField IDs (TBD-cardField1 to TBD-cardField6).
   - Use dangerouslySetInnerHTML for text nodes.
   - Use PrimeReact Button with label from CMS and styling matching theme.
   - Mobile-first responsive layout (stacks cleanly on 375px screens).`;

  // 1. Primary Engine: Gemini 2.5 Flash
  if (process.env.GEMINI_API_KEY) {
    if (!genAIClient) {
      genAIClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    const geminiModels = [process.env.GEMINI_MODEL || 'gemini-3.5-flash', 'gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-flash-latest'];
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
