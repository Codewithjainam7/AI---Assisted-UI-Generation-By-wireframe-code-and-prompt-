import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import Section from '../models/Section.js';
import Element from '../models/Element.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../../.env') });

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/uigen');
    console.log('Connected to MongoDB');

    await Section.deleteMany({ pageName: 'Home' });
    await Element.deleteMany({ pageName: 'Home' });

    const sectionData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../../seed/section.json'), 'utf8'));
    const elementsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../../seed/elements.json'), 'utf8'));

    // Remove $oid
    if (sectionData._id && sectionData._id.$oid) {
      delete sectionData._id;
    }

    await Section.create(sectionData);
    await Element.insertMany(elementsData);

    console.log('Seed completed successfully');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
