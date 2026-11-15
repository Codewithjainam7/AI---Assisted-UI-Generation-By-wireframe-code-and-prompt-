import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getJSXSystemPrompt } from '../templates/jsx-system-prompt.js';

let openAIClient;
let genAIClient;

export async function generate(ir) {
  const prompt = getJSXSystemPrompt();
  let userContent = `Generate the React section component for this IR JSON:\n${JSON.stringify(ir, null, 2)}`;

  const isDashboard = ir.domain === 'dashboard' || ir.layout?.hasSidebar || ir.sectionType === 'dashboard-hero';

  if (isDashboard) {
    userContent += `\n\n=== WIREFRAME VISUAL BLUEPRINT & DASHBOARD ARCHITECTURE ===
Visual Concept & Blueprint: ${ir.imageConcept || 'Custom multi-panel workspace dashboard'}
CRITICAL RECONSTRUCTION DIRECTIVES:
The wireframe is an interactive Dashboard / Application Workspace. Reconstruct the EXACT layout shown in the wireframe:
1. Outer Container: Light neutral canvas (bg-[#eef2f6] min-h-screen p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans overflow-x-hidden text-slate-900).
2. Main Application Window: A large rounded white container (w-full max-w-7xl bg-white rounded-3xl sm:rounded-[2.5rem] shadow-2xl border border-slate-200/80 p-5 sm:p-8 flex flex-col gap-6 text-slate-900 relative).
3. Top Header Bar:
   - Spans the full width of the main window at the top (header className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4"):
     * Left side: Brand badge / Logo (<h1 id={ids.brandBadge} className="text-lg font-black tracking-tight text-slate-900" ... />) + category filter pills (e.g. All, Reports, Metrics, Settings).
     * Right side: Rounded search input with search icon (<input type="text" placeholder="${ir.inputPlaceholder || ir.content?.inputPlaceholder || 'Search...'}" className="w-64 bg-slate-100 border border-slate-200 rounded-full px-4 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400" />).
4. Main 3-Column Body Row:
   - The body below the header consists of 3 columns side-by-side (div className="flex flex-col lg:flex-row gap-6 items-stretch w-full"):
     a) Left Vertical Sidebar Rail:
        * A vertical capsule rail docked on the left (aside className="w-16 min-w-[4rem] max-w-[4rem] ${ir.layout?.sidebarColor || 'bg-[#f5b800]'} rounded-3xl py-6 px-2 flex flex-col items-center justify-between shadow-lg shadow-amber-400/20 flex-shrink-0 self-stretch"):
          - Top hamburger menu icon (= / ☰),
          - Triangle up (▲),
          - Bar chart (📊 / ☲),
          - Star with active indicator dot (★ •),
          - Active highlighted grid app square (⊞) with rounded backdrop,
          - Circle outline (○),
          - Bottom hexagon nut / gear settings icon (⬡).
          - Every SVG icon MUST have explicit classes: 'w-5 h-5 min-w-[20px] min-h-[20px] text-slate-900'.
     b) Central Content Area:
        * Takes the remaining space (div className="flex-1 min-w-0 flex flex-col justify-between gap-6"):
          - Top: 3x2 Grid of 6 rounded thumbnail cards (div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"):
            Each card has a gray rounded thumbnail rectangle (h-24 bg-slate-200/80 rounded-xl mb-3 flex items-center justify-center overflow-hidden), a bold high-contrast title (text-slate-900 font-extrabold text-sm sm:text-base truncate), and descriptive metadata (text-slate-600 text-xs mt-0.5 truncate).
          - Bottom: Collaborator / Activity row (div className="bg-slate-50/90 rounded-2xl border border-slate-200/80 p-4 mt-auto"):
            Contains a small uppercase header ("Active Collaborators") and a row of 4 rounded user avatar cards (grid grid-cols-2 sm:grid-cols-4 gap-3), each with a circular avatar and 2 lines of high-contrast text. This ensures there are NO empty white gaps below the grid.
     c) Right Detail Inspector Panel:
        * A dedicated rounded inspector panel (aside className="w-full lg:w-80 min-w-[18rem] max-w-[20rem] bg-slate-50 rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between flex-shrink-0"):
          - Top large preview image card (<img id={ids.heroImage} className="dynamicStyle2 w-full h-44 object-cover rounded-xl border border-slate-200 mb-3 shadow-sm" ... />),
          - Main headline (<h3 id={ids.headlineMain} className="dynamicStyle text-base font-extrabold text-slate-900 tracking-tight" ... />),
          - Subtitle (<p id={ids.headlineSub} className="dynamicStyle text-xs text-slate-500 mt-0.5" ... />),
          - Star rating row (5 golden stars: ★★★★★ with 4.9/5 score text),
          - Body description (<p id={ids.description} className="dynamicStyle text-xs text-slate-600 leading-relaxed my-2" ... />),
          - Bottom action row with Primary CTA (<Button id={ids.ctaButton} className="dynamicStyle flex-1 py-2.5 rounded-xl font-bold bg-[#f5b800] text-slate-950 border-none shadow-sm hover:brightness-105" ... />) and Secondary action button (<Button className="dynamicStyle px-3 py-2.5 rounded-xl font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50" label="Export" ... />).
5. STRICT CONTRAST & PROPORTIONS:
   - All text on white/light cards MUST have explicit 'text-slate-900', 'text-slate-600', or 'text-slate-500'. NEVER omit text colors on light backgrounds.
   - Do NOT generate an unrelated marketing landing page hero headline banner or footer email signup. Reconstruct the EXACT dashboard layout depicted in the wireframe!
6. Ensure strict adherence to R1–R14 contract rules:
   - Provide valid IDs in 'const ids = { ... }' for all editable nodes.
   - Dispatch fetchElementsByIds on mount with all IDs including card field IDs (TBD-cardField1 through TBD-cardField6).
   - Text nodes use dangerouslySetInnerHTML with default fallback copy.
   - PrimeReact Button with label from CMS.
   - Mobile-first responsive Tailwind layout.`;
  } else if (ir.imageConcept || ir.featureCards || ir.contentBlocks || ir.ctaBlocks) {
    userContent += `\n\n=== WIREFRAME VISUAL BLUEPRINT & PAGE SECTIONS ===
Visual Concept & Blueprint: ${ir.imageConcept || 'Custom multi-block UI layout'}
CRITICAL RECONSTRUCTION DIRECTIVES:
1. Reconstruct EVERY section and element depicted in the wireframe blueprint:
   ${ir.layout?.hasNavbar ? '- Sticky top Navigation bar with logo/brand and navigation links.' : ''}
   - Main section with headline, subhead, body description, primary/secondary CTA, and visual media faithful to the wireframe blueprint.
   ${ir.contentBlocks ? `- Content blocks / value propositions described in the blueprint.` : ''}
   ${ir.ctaBlocks ? `- Prominent horizontal 'Below the fold CTA' banner.` : ''}
   ${ir.featureCards ? `- Feature / Stat cards grid faithful to the wireframe layout.` : ''}
   ${ir.footer ? `- Comprehensive footer with email signup input, subscribe CTA button, nav links, and social links.` : ''}
2. Ensure strict adherence to R1–R14 contract rules:
   - Provide valid IDs in 'const ids = { ... }' for all editable nodes.
   - Dispatch fetchElementsByIds on mount with all IDs including card field IDs.
   - Text nodes use dangerouslySetInnerHTML with default fallback copy.
   - PrimeReact Button with label from CMS.
   - Mobile-first responsive Tailwind layout (strictly stacked on 375px mobile, flex-row or responsive grids on desktop).`;
  }

  // 1. Primary Engine: Gemini 2.5 Flash (Fast, reliable, large context, zero credit limit)
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

  // 2. Secondary Engine: OpenRouter (with free reasoning models)
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
          max_tokens: 2200
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
