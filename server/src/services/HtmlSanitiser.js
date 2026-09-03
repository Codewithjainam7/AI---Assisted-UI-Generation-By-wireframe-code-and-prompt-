export function sanitise(html) {
  if (!html) return '';
  let result = html;
  // Strip scripts
  result = stripScripts(result);
  
  // Allow b, i, br, span, strong, em
  // Use a generic regex to strip other tags
  const allowedTags = /<\/?(b|i|br|span|strong|em)(\s+[^>]*)?>/gi;
  result = result.replace(/<[^>]+>/g, (match) => {
    if (allowedTags.test(match)) {
      return match;
    }
    return '';
  });
  return result;
}

export function stripScripts(html) {
  if (!html) return '';
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}
