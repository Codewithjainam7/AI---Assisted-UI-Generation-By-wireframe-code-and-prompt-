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
1. Outer Container: Light neutral canvas (e.g. bg-[#e8eaed] or bg-gray-100 min-h-screen p-4 sm:p-8 flex items-center justify-center font-sans).
2. Main Application Window: A large rounded white container (bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-2xl w-full max-w-7xl flex flex-col md:flex-row gap-6 relative border border-gray-200/60).
3. Floating Left Vertical Sidebar Capsule:
   - A rounded vertical pill rail on the left (w-16 min-w-[4rem] max-w-[4rem] ${ir.layout?.sidebarColor || 'bg-[#f5b800]'} rounded-3xl py-6 px-2 flex flex-col items-center justify-between shadow-lg shadow-amber-500/20 min-h-[580px] flex-shrink-0 z-20). Do NOT use 'w-full'. Ensure it is always a vertical rail with explicit width and min-width:
     * Top hamburger menu icon (= / ☰),
     * Triangle up (▲),
     * Bar chart (📊 / ☲),
     * Star with active indicator dot (★ •),
     * Active highlighted grid app square (⊞) with rounded white/dark pill backdrop,
     * Circle outline (○),
     * Bottom hexagon nut / gear settings icon (⬡).
     * Every SVG icon MUST have explicit classes: 'w-5 h-5 min-w-[20px] min-h-[20px]'.
4. Top Bar:
   - Category tab pills or breadcrumbs on left (e.g. Overview, Assets, Library).
   - Rounded search bar input on right with search icon and placeholder '${ir.inputPlaceholder || ir.content?.inputPlaceholder || 'Search...'}'.
5. Central Content Area:
   - Main card container (flex-1 min-w-0) holding a 3x2 grid of 6 rounded thumbnail cards (grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6).
   - Each card has a gray rounded thumbnail rectangle (h-28 bg-gray-200/90 rounded-2xl mb-3) and two lines of text (title and subtitle).
6. Right Detail Inspector Panel:
   - A dedicated rounded panel (w-80 min-w-[18rem] max-w-[20rem] bg-gray-50/90 rounded-2xl p-5 border border-gray-100 flex flex-col justify-between flex-shrink-0) containing:
     * Top large preview image card (<img id={ids.heroImage} className="dynamicStyle2 w-full h-44 object-cover rounded-xl mb-3" ... />),
     * Main headline (<h3 id={ids.headlineMain} className="dynamicStyle text-base font-bold text-gray-900" ... />),
     * Subtitle (<p id={ids.headlineSub} className="dynamicStyle text-xs text-gray-500" ... />),
     * Star rating row (5 golden stars: ★★★★★) and score text,
     * Body description (<p id={ids.description} className="dynamicStyle text-xs text-gray-600 my-2" ... />),
     * Bottom action row with Primary CTA (<Button id={ids.ctaButton} className="dynamicStyle flex-1 py-2.5 rounded-xl font-bold" ... />) and Secondary action button.
7. Bottom Activity Row:
   - A horizontal row of 4 rounded collaborator / avatar cards (rounded avatar circle + 2 lines of text).
8. STRICT REQUIREMENT:
   - Do NOT generate an unrelated marketing landing page hero headline banner or footer email signup. Reconstruct the EXACT dashboard layout depicted in the wireframe!
9. Ensure strict adherence to R1–R14 contract rules:
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
