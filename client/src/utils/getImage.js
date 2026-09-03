export function getImage(image) {
  if (!image) return `${import.meta.env.VITE_STORAGE_URL}default/images/hero-placeholder.jpg`;
  if (image.includes('blob:')) return image;
  return `${import.meta.env.VITE_STORAGE_URL}${image}`;
}
export function errorImage(event) {
  event.target.src = `${import.meta.env.VITE_STORAGE_URL}default/images/hero-placeholder.jpg`;
}
