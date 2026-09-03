import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedSec = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../seed/section.json'), 'utf8'));
if (seedSec._id && seedSec._id['$oid']) delete seedSec._id;
const seedElem = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../seed/elements.json'), 'utf8'));

fs.writeFileSync(path.join(__dirname, '../../data/sections.json'), JSON.stringify([seedSec], null, 2));
fs.writeFileSync(path.join(__dirname, '../../data/elements.json'), JSON.stringify(seedElem, null, 2));

console.log('Cleaned server/data to clean seed data');
