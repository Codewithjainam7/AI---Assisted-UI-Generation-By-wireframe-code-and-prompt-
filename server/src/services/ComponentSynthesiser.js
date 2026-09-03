import OpenAI from 'openai';
import { getJSXSystemPrompt } from '../templates/jsx-system-prompt.js';

let client;

export async function generate(ir) {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.LLM_API_KEY || 'dummy',
      baseURL: process.env.LLM_BASE_URL || 'https://openrouter.ai/api/v1',
      defaultHeaders: { 'HTTP-Referer': 'http://localhost:5173', 'X-Title': 'UIGen Studio' }
    });
  }

  try {
    const completion = await client.chat.completions.create({
      model: process.env.LLM_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b',
      messages: [
        { role: 'system', content: getJSXSystemPrompt() },
        { role: 'user', content: JSON.stringify(ir) }
      ],
      temperature: 0.3
    });
    
    let jsx = completion.choices[0].message.content;
    jsx = jsx.replace(/^```[\w]*\n?/gm,'').replace(/\n?```$/gm,'').trim();
    
    return { jsx, warnings: [] };
  } catch (e) {
    return { jsx: '', warnings: [e.message] };
  }
}
