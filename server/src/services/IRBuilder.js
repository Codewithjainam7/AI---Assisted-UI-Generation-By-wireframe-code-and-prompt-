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

  let baseIR = {
    sectionType: "split-hero",
    platform: "Website",
    layout: {
      direction: "row",
      breakpoint: "md",
      columns: 2,
      mediaPosition: "left"
    },
    theme: { accent: "red-500", surface: "white", text: "gray-800" },
    elements: [
      { elementName: "heroImage", contentType: "Image", defaultContent: "default/images/hero-placeholder.jpg", fieldId: "TBD-heroImage", position: "left" },
      { elementName: "brandBadge", contentType: "Text", defaultContent: "PULSE FIT", fieldId: "TBD-brandBadge" },
      { elementName: "headlineMain", contentType: "Text", defaultContent: "CHALLENGE YOUR LIMITS", fieldId: "TBD-headlineMain" },
      { elementName: "headlineSub", contentType: "Text", defaultContent: "Be a part of the tribe that's limitless.", fieldId: "TBD-headlineSub" },
      { elementName: "description", contentType: "Textfield", defaultContent: "Join trainer-led workout sessions designed to kickstart your fitness journey, at your convenience.", fieldId: "TBD-description" },
      { elementName: "statBadges", contentType: "Cards", defaultContent: "", fieldId: "TBD-statBadges", statCount: 3 },
      { elementName: "ctaButton", contentType: "Button", defaultContent: "FIND A WORKOUT", fieldId: "TBD-ctaButton" }
    ],
    pageName: pageName || "Home",
    sectionName: sectionName || "Custom"
  };

  if (wireframeIR) {
    if (wireframeIR.layout) baseIR.layout = { ...baseIR.layout, ...wireframeIR.layout };
    if (wireframeIR.theme) baseIR.theme = { ...baseIR.theme, ...wireframeIR.theme };
  }

  if (promptText && promptText.trim()) {
    try {
      const completion = await client.chat.completions.create({
        model: process.env.LLM_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b',
        messages: [
          { role: 'system', content: getIRSystemPrompt() },
          { role: 'user', content: promptText }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 1500,
        temperature: 0.2
      });
      const generated = JSON.parse(completion.choices?.[0]?.message?.content || '{}');
      if (generated.theme) baseIR.theme = { ...baseIR.theme, ...generated.theme };
      if (generated.layout) baseIR.layout = { ...baseIR.layout, ...generated.layout };
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
      console.warn('Nemotron IR generation warning (using base layout):', e.message);
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
