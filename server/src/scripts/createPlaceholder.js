import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#18181b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#27272a;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#grad)"/>
  <circle cx="400" cy="250" r="80" fill="#ef4444" fill-opacity="0.2" stroke="#ef4444" stroke-width="4"/>
  <path d="M360 250 L440 250 M400 210 L400 290" stroke="#ef4444" stroke-width="6" stroke-linecap="round"/>
  <text x="400" y="380" font-family="sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">PULSE FIT</text>
  <text x="400" y="420" font-family="sans-serif" font-size="18" fill="#a1a1aa" text-anchor="middle">Hero Image Placeholder</text>
</svg>`;

const dirs = [
  path.join(__dirname, '../../storage/default/images'),
  path.join(__dirname, '../storage/default/images')
];

for (const targetDir of dirs) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.writeFileSync(path.join(targetDir, 'hero-placeholder.jpg'), svg);
  fs.writeFileSync(path.join(targetDir, 'hero-placeholder.svg'), svg);
  console.log('Placeholder images created at:', targetDir);
}
