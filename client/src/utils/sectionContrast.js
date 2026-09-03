export function getSectionTextContrastClass(bg, accent) {
  if (!bg || bg === 'white' || bg === '') return 'text-gray-800';
  if (bg === 'dark' || bg === 'black') return 'text-white';
  return 'text-gray-800';
}
