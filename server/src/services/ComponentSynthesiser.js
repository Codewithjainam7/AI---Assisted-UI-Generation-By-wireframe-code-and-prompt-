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
        { role: 'user', content: `Generate the React section component for this IR JSON:\n${JSON.stringify(ir, null, 2)}` }
      ],
      temperature: 0.2,
      max_tokens: 2500
    });
    
    let jsx = completion.choices?.[0]?.message?.content || '';
    
    // Extract code block if wrapped in markdown
    const fenceMatch = jsx.match(/```(?:jsx|javascript|js)?\s*([\s\S]*?)```/i);
    if (fenceMatch && fenceMatch[1]) {
      jsx = fenceMatch[1];
    } else {
      jsx = jsx.replace(/^```[\w]*\n?/gm, '').replace(/\n?```$/gm, '');
    }
    
    // Strip any leading non-code text
    const importIdx = jsx.search(/(?:^|\n)\s*(?:import|export|const|function)\s/);
    if (importIdx > 0) {
      jsx = jsx.slice(importIdx);
    }
    
    return { jsx: jsx.trim(), warnings: [] };
  } catch (e) {
    console.warn('Nemotron JSX synthesis warning:', e.message);
    return { jsx: '', warnings: [e.message] };
  }
}
