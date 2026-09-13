import OpenAI from 'openai';
import { getIRSystemPrompt } from '../templates/ir-system-prompt.js';

let client;

export async function buildIR({ promptText, wireframeIR, codeIR, sectionName, pageName }) {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.LLM_API_KEY || 'dummy',
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

  // If a natural language prompt was provided, run Nemotron to extract exact copy, theme, and layout overrides
  if (promptText && promptText.trim()) {
    try {
      const completion = await client.chat.completions.create({
        model: process.env.LLM_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b',
        messages: [
          { role: 'system', content: getIRSystemPrompt() },
          { role: 'user', content: promptText }
        ],
        max_tokens: 1500,
        temperature: 0.1
      });

      const raw = completion.choices?.[0]?.message?.content || '';
      const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
      const generated = JSON.parse(cleaned);

      if (generated.theme) baseIR.theme = { ...baseIR.theme, ...generated.theme };
      if (generated.layout) baseIR.layout = { ...baseIR.layout, ...generated.layout };
      if (generated.sectionName) baseIR.sectionName = generated.sectionName;
      if (Array.isArray(generated.elements)) {
        generated.elements.forEach(ge => {
          const match = baseIR.elements.find(e => e.elementName === ge.elementName);
          if (match) {
            match.defaultContent = ge.defaultContent || match.defaultContent;
          } else {
            baseIR.elements.push(ge);
          }
        });
      }
    } catch (e) {
      console.warn('Nemotron IR generation warning (using wireframe OCR/defaults):', e.message);
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
