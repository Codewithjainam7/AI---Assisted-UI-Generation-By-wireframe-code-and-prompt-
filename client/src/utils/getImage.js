export function getImage(image) {
  const storageUrl = import.meta.env.VITE_STORAGE_URL || 'http://localhost:4000/storage/';
  const placeholder = `${storageUrl.replace(/\/$/, '')}/default/images/hero-placeholder.jpg`;
  if (!image) return placeholder;
  if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('blob:') || image.startsWith('data:')) return image;
  if (image.startsWith('/storage/')) return `http://localhost:4000${image}`;
  const clean = image.replace(/^\//, '');
  return `${storageUrl.replace(/\/$/, '')}/${clean}`;
}

export function errorImage(event) {
  const storageUrl = import.meta.env.VITE_STORAGE_URL || 'http://localhost:4000/storage/';
  event.target.src = `${storageUrl.replace(/\/$/, '')}/default/images/hero-placeholder.jpg`;
}
