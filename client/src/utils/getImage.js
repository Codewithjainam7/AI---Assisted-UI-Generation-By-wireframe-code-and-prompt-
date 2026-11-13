export const FALLBACK_IMAGE_DATA_URI = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='700' viewBox='0 0 1200 700'%3E%3Cdefs%3E%3ClinearGradient id='bgGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2309090b'/%3E%3Cstop offset='50%25' stop-color='%2318181b'/%3E%3Cstop offset='100%25' stop-color='%230f172a'/%3E%3C/linearGradient%3E%3ClinearGradient id='accentGrad' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' stop-color='%23ef4444'/%3E%3Cstop offset='100%25' stop-color='%23f97316'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23bgGrad)'/%3E%3Crect x='40' y='40' width='1120' height='620' rx='28' fill='%2318181b' stroke='%2327272a' stroke-width='2' stroke-dasharray='10 10'/%3E%3Ccircle cx='600' cy='310' r='75' fill='%23ef4444' fill-opacity='0.12' stroke='url(%23accentGrad)' stroke-width='3'/%3E%3Cpath d='M565 310 L635 310 M600 275 L600 345' stroke='%23f97316' stroke-width='5' stroke-linecap='round'/%3E%3Ctext x='600' y='435' font-family='system-ui, -apple-system, sans-serif' font-size='28' font-weight='800' fill='%23ffffff' text-anchor='middle' letter-spacing='0.08em'%3EAI PRODUCTION VISUAL%3C/text%3E%3Ctext x='600' y='472' font-family='system-ui, -apple-system, sans-serif' font-size='16' font-weight='500' fill='%2394a3b8' text-anchor='middle'%3EHigh-Resolution Visual Media Placeholder • Responsive Viewport%3C/text%3E%3C/svg%3E";

const VERIFIED_DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80';

export function getImage(image) {
  if (!image || typeof image !== 'string' || !image.trim()) {
    return VERIFIED_DEFAULT_IMAGE;
  }
  // Never display the raw wireframe upload sketch as the hero photo
  if (image.includes('uploads/') || image.includes('wireframe') || image.includes('hero-placeholder.jpg')) {
    return VERIFIED_DEFAULT_IMAGE;
  }
  if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('blob:') || image.startsWith('data:')) {
    return image;
  }
  const storageUrl = import.meta.env.VITE_STORAGE_URL || 'http://localhost:4000/storage/';
  const clean = image.replace(/^\//, '');
  return `${storageUrl.replace(/\/$/, '')}/${clean}`;
}

export function errorImage(event) {
  if (!event || !event.target) return;
  if (event.target.dataset.failedOnce) {
    event.target.src = FALLBACK_IMAGE_DATA_URI;
    return;
  }
  event.target.dataset.failedOnce = 'true';
  event.target.src = VERIFIED_DEFAULT_IMAGE;
}
