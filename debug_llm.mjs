
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, 'server/.env') });

console.log('GEMINI_API_KEY present:', !!process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY?.slice(0, 10));
console.log('LLM_API_KEY present:', !!process.env.LLM_API_KEY, process.env.LLM_API_KEY?.slice(0, 10));
console.log('GEMINI_MODEL:', process.env.GEMINI_MODEL);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModels = [process.env.GEMINI_MODEL || 'gemini-3.5-flash', 'gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

for (const m of geminiModels) {
  try {
    console.log(`Trying Gemini model: ${m}...`);
    const model = genAI.getGenerativeModel({ model: m });
    const res = await model.generateContent('Hello! Test response.');
    console.log(`Model ${m} succeeded:`, res.response.text());
    break;
  } catch (err) {
    console.error(`Model ${m} failed:`, err.message);
  }
}

if (process.env.LLM_API_KEY) {
  const openAI = new OpenAI({
    apiKey: process.env.LLM_API_KEY,
    baseURL: process.env.LLM_BASE_URL || 'https://openrouter.ai/api/v1',
  });
  const orModels = [
    'nvidia/nemotron-3-ultra-550b-a55b:free',
    process.env.LLM_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b',
    'nvidia/nemotron-3.5-lightning:free'
  ];
  for (const m of orModels) {
    try {
      console.log(`Trying OpenRouter model: ${m}...`);
      const comp = await openAI.chat.completions.create({
        model: m,
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 50
      });
      console.log(`OpenRouter ${m} succeeded:`, comp.choices[0]?.message?.content);
      break;
    } catch (err) {
      console.error(`OpenRouter ${m} failed:`, err.message);
    }
  }
}
