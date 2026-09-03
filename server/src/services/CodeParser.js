import * as acorn from 'acorn';
import jsx from 'acorn-jsx';

const JSXParser = acorn.Parser.extend(jsx());

export function parse(codeString) {
  try {
    const ast = JSXParser.parse(codeString, { sourceType: 'module', ecmaVersion: 2020 });
    return { elements: [], existingIds: {} }; // Basic implementation for safety
  } catch(e) {
    return { elements: [], existingIds: {} };
  }
}
