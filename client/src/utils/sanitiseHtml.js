const ALLOWED_TAGS = ['b','i','br','span','strong','em'];
export function sanitise(html) {
  if (!html) return '';
  return html.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/gi, (match, tag) => {
    return ALLOWED_TAGS.includes(tag.toLowerCase()) ? match : '';
  });
}
