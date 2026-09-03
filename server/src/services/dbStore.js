import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import SectionModel from '../models/Section.js';
import ElementModel from '../models/Element.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../../data');
const sectionsFile = path.join(dataDir, 'sections.json');
const elementsFile = path.join(dataDir, 'elements.json');

// Ensure data dir exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize JSON files from seed if they don't exist
function initJsonStore() {
  const seedSectionPath = path.join(__dirname, '../../../seed/section.json');
  const seedElementsPath = path.join(__dirname, '../../../seed/elements.json');

  if (!fs.existsSync(sectionsFile)) {
    if (fs.existsSync(seedSectionPath)) {
      const raw = JSON.parse(fs.readFileSync(seedSectionPath, 'utf8'));
      if (raw._id && raw._id.$oid) delete raw._id;
      fs.writeFileSync(sectionsFile, JSON.stringify([raw], null, 2));
    } else {
      fs.writeFileSync(sectionsFile, JSON.stringify([], null, 2));
    }
  }

  if (!fs.existsSync(elementsFile)) {
    if (fs.existsSync(seedElementsPath)) {
      const raw = JSON.parse(fs.readFileSync(seedElementsPath, 'utf8'));
      fs.writeFileSync(elementsFile, JSON.stringify(raw, null, 2));
    } else {
      fs.writeFileSync(elementsFile, JSON.stringify([], null, 2));
    }
  }
}

initJsonStore();

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

function readJson(file) {
  try {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return [];
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ─── Section Operations ──────────────────────────────────────────────
export const SectionStore = {
  async find(query = {}) {
    if (isMongoConnected()) {
      return SectionModel.find(query).sort({ createdAt: -1 });
    }
    let list = readJson(sectionsFile);
    if (query.pageName) list = list.filter(s => s.pageName === query.pageName);
    if (query.sectionId) list = list.filter(s => s.sectionId === query.sectionId);
    return list;
  },

  async findOne(query) {
    if (isMongoConnected()) {
      return SectionModel.findOne(query);
    }
    const list = readJson(sectionsFile);
    const item = list.find(s => {
      for (const [k, v] of Object.entries(query)) {
        if (s[k] !== v) return false;
      }
      return true;
    });
    if (!item) return null;
    return {
      ...item,
      toObject() { return { ...this }; },
      async save() {
        const all = readJson(sectionsFile);
        const idx = all.findIndex(s => s.sectionId === item.sectionId);
        if (idx !== -1) {
          all[idx] = { ...this };
          writeJson(sectionsFile, all);
        }
        return this;
      }
    };
  },

  async create(doc) {
    const sectionDoc = {
      ...doc,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (isMongoConnected()) {
      return SectionModel.create(sectionDoc);
    }
    const list = readJson(sectionsFile);
    list.unshift(sectionDoc);
    writeJson(sectionsFile, list);
    return {
      ...sectionDoc,
      toObject() { return { ...this }; }
    };
  },

  async deleteMany(query) {
    if (isMongoConnected()) {
      return SectionModel.deleteMany(query);
    }
    let list = readJson(sectionsFile);
    if (query.pageName) {
      list = list.filter(s => s.pageName !== query.pageName);
    }
    writeJson(sectionsFile, list);
    return { acknowledged: true };
  }
};

// ─── Element Operations ──────────────────────────────────────────────
export const ElementStore = {
  async find(query = {}) {
    if (query.sectionId) {
      if (isMongoConnected()) {
        return ElementModel.find({ sectionId: query.sectionId }).lean();
      }
      return readJson(elementsFile).filter(e => e.sectionId === query.sectionId);
    }

    if (query.pageName) {
      // Find the most recent section for this pageName
      const sections = await SectionStore.find({ pageName: query.pageName });
      const latestSection = Array.isArray(sections) && sections.length > 0 ? sections[0] : null;

      if (latestSection && latestSection.sectionId) {
        if (isMongoConnected()) {
          return ElementModel.find({ sectionId: latestSection.sectionId }).lean();
        }
        const filtered = readJson(elementsFile).filter(e => e.sectionId === latestSection.sectionId);
        if (filtered.length > 0) return filtered;
      }

      if (isMongoConnected()) {
        return ElementModel.find({ pageName: query.pageName }).lean();
      }
      return readJson(elementsFile).filter(e => e.pageName === query.pageName);
    }

    if (isMongoConnected()) {
      return ElementModel.find(query).lean();
    }
    return readJson(elementsFile);
  },

  async findOne(query) {
    if (isMongoConnected()) {
      return ElementModel.findOne(query);
    }
    const list = readJson(elementsFile);
    return list.find(e => {
      for (const [k, v] of Object.entries(query)) {
        if (e[k] !== v) return false;
      }
      return true;
    }) || null;
  },

  async findOneAndUpdate(query, update, options = {}) {
    if (isMongoConnected()) {
      return ElementModel.findOneAndUpdate(query, update, options);
    }
    const list = readJson(elementsFile);
    const idx = list.findIndex(e => {
      for (const [k, v] of Object.entries(query)) {
        if (e[k] !== v) return false;
      }
      return true;
    });
    if (idx === -1) return null;
    const updated = { ...list[idx], ...(update.$set || update), updatedAt: new Date().toISOString() };
    list[idx] = updated;
    writeJson(elementsFile, list);
    return updated;
  },

  async insertMany(docs) {
    const formatted = docs.map(d => ({
      ...d,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    if (isMongoConnected()) {
      return ElementModel.insertMany(formatted);
    }
    const list = readJson(elementsFile);
    list.push(...formatted);
    writeJson(elementsFile, list);
    return formatted;
  },

  async deleteMany(query) {
    if (isMongoConnected()) {
      return ElementModel.deleteMany(query);
    }
    let list = readJson(elementsFile);
    if (query.pageName) {
      list = list.filter(e => e.pageName !== query.pageName);
    }
    writeJson(elementsFile, list);
    return { acknowledged: true };
  }
};
