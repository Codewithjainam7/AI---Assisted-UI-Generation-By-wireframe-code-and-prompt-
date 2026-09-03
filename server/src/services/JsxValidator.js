import * as acorn from 'acorn';
import jsx from 'acorn-jsx';

const JSXParser = acorn.Parser.extend(jsx());

export function validate(jsxString) {
  const cleaned = jsxString.replace(/^```[\w]*\n?/gm,'').replace(/\n?```$/gm,'').trim();
  try {
    JSXParser.parse(cleaned, { sourceType: 'module', ecmaVersion: 2020 });
    return { valid: true, cleaned, errors: [] };
  } catch(e) {
    return { valid: false, cleaned, errors: [e.message] };
  }
}
