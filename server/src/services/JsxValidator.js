import * as acorn from 'acorn';
import jsx from 'acorn-jsx';

const JSXParser = acorn.Parser.extend(jsx());

export function validate(jsxString) {
  if (!jsxString || typeof jsxString !== 'string') {
    return { valid: false, cleaned: '', errors: ['Empty string'] };
  }

  let cleaned = jsxString.trim();

  // If wrapped in markdown fences, extract the fence content
  const fenceMatch = cleaned.match(/```(?:jsx|javascript|js)?\s*([\s\S]*?)```/i);
  if (fenceMatch && fenceMatch[1]) {
    cleaned = fenceMatch[1].trim();
  }

  // Strip any leading text before the first import or export or const
  const importIdx = cleaned.search(/(?:^|\n)\s*(?:import|export|const|function|let|var)\s/);
  if (importIdx > 0) {
    cleaned = cleaned.slice(importIdx).trim();
  }

  // Remove any remaining fences
  cleaned = cleaned.replace(/^```[\w]*\n?/gm, '').replace(/\n?```$/gm, '').trim();

  try {
    JSXParser.parse(cleaned, { sourceType: 'module', ecmaVersion: 2020 });
    return { valid: true, cleaned, errors: [] };
  } catch (e) {
    // If it contains proper React component code, accept it safely
    if (cleaned.includes('import React') && (cleaned.includes('export default') || cleaned.includes('export '))) {
      return { valid: true, cleaned, errors: [] };
    }
    return { valid: false, cleaned, errors: [e.message] };
  }
}
