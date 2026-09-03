import * as acorn from 'acorn';
import jsx from 'acorn-jsx';

const JSXParser = acorn.Parser.extend(jsx());

/**
 * Parses pasted React/JSX code and extracts:
 * - existingIds: map of elementName -> fieldId (from `const ids = {...}`)
 * - elements: array of detected element descriptors
 */
export function parse(codeString) {
  if (!codeString || !codeString.trim()) return { elements: [], existingIds: {} };

  let ast;
  try {
    ast = JSXParser.parse(codeString, { sourceType: 'module', ecmaVersion: 2020 });
  } catch (e) {
    return { elements: [], existingIds: {} };
  }

  const existingIds = {};
  const elements = [];

  // Walk the AST to find const ids = { ... }
  function walk(node) {
    if (!node || typeof node !== 'object') return;

    // Look for: const ids = { heroImage: "2000000001", ... }
    if (
      node.type === 'VariableDeclaration' &&
      node.declarations?.length
    ) {
      for (const decl of node.declarations) {
        if (
          decl.id?.name === 'ids' &&
          decl.init?.type === 'ObjectExpression'
        ) {
          for (const prop of decl.init.properties) {
            const key = prop.key?.name || prop.key?.value;
            const val = prop.value?.value;
            if (key && val) existingIds[key] = String(val);
          }
        }
      }
    }

    // Look for JSX elements with id attributes to detect element names
    if (node.type === 'JSXOpeningElement') {
      const idAttr = node.attributes?.find(
        a => a.name?.name === 'id' && a.value?.type === 'JSXExpressionContainer'
      );
      if (idAttr) {
        const elementName = node.name?.name;
        if (elementName) {
          elements.push({
            elementName,
            contentType: elementName === 'img' ? 'Image' : elementName === 'button' || elementName === 'Button' ? 'Button' : 'Text',
            fieldId: `TBD-${elementName}`,
            defaultContent: '',
          });
        }
      }
    }

    // Recurse into all child nodes
    for (const key of Object.keys(node)) {
      if (key === 'type' || key === 'start' || key === 'end' || key === 'loc') continue;
      const child = node[key];
      if (Array.isArray(child)) child.forEach(walk);
      else if (child && typeof child === 'object') walk(child);
    }
  }

  walk(ast);

  return { elements, existingIds };
}
