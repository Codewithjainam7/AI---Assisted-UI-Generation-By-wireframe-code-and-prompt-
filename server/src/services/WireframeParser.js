import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

let genAI;

export async function parse(file) {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy');
  }

  try {
    const imageData = fs.readFileSync(file.path);
    const base64 = imageData.toString('base64');
    
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.5-pro' });
    
    const prompt = `Analyze this wireframe image for a website section. Identify and return a JSON object with the following structure:
{
  "sectionType": "split-hero" | "full-hero" | "features" | "stats" | "generic",
  "layout": {
    "direction": "row" | "column",
    "mediaPosition": "left" | "right" | "top" | "none",
    "columns": 1 | 2
  },
  "detectedElements": [
    {
      "elementName": "heroImage" | "brandBadge" | "headlineMain" | "headlineSub" | "description" | "statBadges" | "ctaButton",
      "detected": true | false,
      "confidence": 0.0-1.0,
      "position": "left" | "right" | "top" | "center"
    }
  ],
  "statCount": 3,
  "theme": {
    "accent": "red-500",
    "surface": "white",
    "text": "gray-800"
  }
}
Return ONLY the JSON object, no markdown, no explanation.`;

    const result = await model.generateContent([
      { inlineData: { mimeType: file.mimetype, data: base64 } },
      prompt
    ]);
    
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```[\w]*\n?/,'').replace(/\n?```$/,'').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    // Graceful degradation
    return {
      sectionType: 'split-hero',
      layout: { direction: 'row', mediaPosition: 'left', columns: 2 }
    };
  }
}
