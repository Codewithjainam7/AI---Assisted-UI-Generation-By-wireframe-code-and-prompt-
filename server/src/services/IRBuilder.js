import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getIRSystemPrompt } from '../templates/ir-system-prompt.js';

let client;
let genAI;

export async function buildIR({ promptText, wireframeIR, codeIR, sectionName, pageName }) {
  if (!client && process.env.LLM_API_KEY) {
    client = new OpenAI({
      apiKey: process.env.LLM_API_KEY,
      baseURL: process.env.LLM_BASE_URL || 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'UIGen Studio'
      }
    });
  }

  const defaultHeroImage = wireframeIR?.content?.suggestedImageUrl || "default/images/hero-placeholder.jpg";

  let baseIR = {
    sectionType: wireframeIR?.sectionType || "split-hero",
    sectionName: sectionName || wireframeIR?.sectionName || "Custom",
    domain: wireframeIR?.domain || "general-saas",
    platform: "Website",
    layout: {
      direction: wireframeIR?.layout?.direction || "row",
      breakpoint: "md",
      columns: wireframeIR?.layout?.columns || 2,
      mediaPosition: wireframeIR?.layout?.mediaPosition || "left",
      hasNavbar: wireframeIR?.layout?.hasNavbar || false,
      hasSearchOrForm: wireframeIR?.layout?.hasSearchOrForm || false
    },
    theme: {
      accent: wireframeIR?.theme?.accent || "red-500",
      surface: wireframeIR?.theme?.surface || "dark",
      text: wireframeIR?.theme?.text || "white"
    },
    navbar: wireframeIR?.navbar || null,
    imageConcept: wireframeIR?.content?.imageConcept || "",
    contentBlocks: wireframeIR?.content?.contentBlocks || null,
    featureCards: wireframeIR?.content?.featureCards || null,
    ctaBlocks: wireframeIR?.content?.ctaBlocks || null,
    footer: wireframeIR?.content?.footer || wireframeIR?.footer || null,
    elements: [
      {
        elementName: "heroImage",
        contentType: "Image",
        defaultContent: defaultHeroImage,
        fieldId: "TBD-heroImage",
        position: wireframeIR?.layout?.mediaPosition || "left",
        concept: wireframeIR?.content?.imageConcept || ""
      },
      {
        elementName: "brandBadge",
        contentType: "Text",
        defaultContent: wireframeIR?.content?.brandBadge || "AI STUDIO",
        fieldId: "TBD-brandBadge"
      },
      {
        elementName: "headlineMain",
        contentType: "Text",
        defaultContent: wireframeIR?.content?.headlineMain || "NEXT-GEN UI GENERATION",
        fieldId: "TBD-headlineMain"
      },
      {
        elementName: "headlineSub",
        contentType: "Text",
        defaultContent: wireframeIR?.content?.headlineSub || "Transform ideas and wireframes into production React components.",
        fieldId: "TBD-headlineSub"
      },
      {
        elementName: "description",
        contentType: "Textfield",
        defaultContent: wireframeIR?.content?.description || "Built with automated CMS bindings, responsive layout system, and modern aesthetics.",
        fieldId: "TBD-description"
      },
      {
        elementName: "statBadges",
        contentType: "Cards",
        defaultContent: "",
        fieldId: "TBD-statBadges",
        statCount: Array.isArray(wireframeIR?.content?.statCards) && wireframeIR.content.statCards.length > 0 ? wireframeIR.content.statCards.length : 3,
        statCards: wireframeIR?.content?.statCards || null
      },
      {
        elementName: "ctaButton",
        contentType: "Button",
        defaultContent: wireframeIR?.content?.ctaButton || "GET STARTED",
        fieldId: "TBD-ctaButton"
      }
    ],
    secondaryButton: wireframeIR?.content?.secondaryButton || null,
    inputPlaceholder: wireframeIR?.content?.inputPlaceholder || null,
    featureCards: wireframeIR?.content?.featureCards || null,
    pageName: pageName || "Home"
  };

  // If a natural language prompt was provided, run Gemini or OpenRouter to extract exact copy, theme, and layout overrides
  if (promptText && promptText.trim()) {
    let parsedSuccess = false;
    const irSystemPrompt = getIRSystemPrompt();

    // 1. Try Gemini 2.5 Flash
    if (process.env.GEMINI_API_KEY) {
      if (!genAI) genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.5-flash' });
          const res = await model.generateContent([
            { text: irSystemPrompt },
            { text: `Extract the UI structure for this user prompt:\n${promptText}` }
          ]);
          const raw = res?.response?.text() || '';
          const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
          const generated = JSON.parse(cleaned);

          applyGeneratedToIR(baseIR, generated);
          parsedSuccess = true;
          console.log('✦ Successfully parsed prompt to IR using Gemini');
          break;
        } catch (err) {
          console.warn(`Gemini IR generation attempt ${attempt} warning:`, err.message);
          if (attempt < 2) await new Promise(r => setTimeout(r, 1000));
        }
      }
    }

    // 2. Fallback to OpenRouter
    if (!parsedSuccess && client) {
      const candidateModels = [
        'nvidia/nemotron-3-ultra-550b-a55b:free',
        process.env.LLM_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b',
        'nvidia/nemotron-3.5-lightning:free'
      ];

      for (const mName of candidateModels) {
        try {
          const completion = await client.chat.completions.create({
            model: mName,
            messages: [
              { role: 'system', content: irSystemPrompt },
              { role: 'user', content: promptText }
            ],
            max_tokens: 1200,
            temperature: 0.1
          });

          const raw = completion.choices?.[0]?.message?.content || '';
          const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
          const generated = JSON.parse(cleaned);

          applyGeneratedToIR(baseIR, generated);
          parsedSuccess = true;
          console.log(`✦ Successfully parsed prompt to IR using OpenRouter (${mName})`);
          break;
        } catch (e) {
          console.warn(`OpenRouter IR generation warning for ${mName}:`, e.message);
        }
      }
    }
  }

  if (codeIR && codeIR.existingIds) {
    baseIR.elements.forEach(el => {
      if (codeIR.existingIds[el.elementName]) {
        el.fieldId = codeIR.existingIds[el.elementName];
      }
    });
  }

  return baseIR;
}

function applyGeneratedToIR(baseIR, generated) {
  if (!generated) return;
  if (generated.domain) baseIR.domain = generated.domain;
  if (generated.theme) baseIR.theme = { ...baseIR.theme, ...generated.theme };
  if (generated.layout) baseIR.layout = { ...baseIR.layout, ...generated.layout };
  if (generated.sectionName) baseIR.sectionName = generated.sectionName;
  if (Array.isArray(generated.elements)) {
    generated.elements.forEach(ge => {
      const match = baseIR.elements.find(e => e.elementName === ge.elementName);
      if (match) {
        match.defaultContent = ge.defaultContent || match.defaultContent;
        if (ge.concept) match.concept = ge.concept;
        if (ge.statCards) match.statCards = ge.statCards;
      } else {
        baseIR.elements.push(ge);
      }
    });
  }
}
