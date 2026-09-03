import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Section from '../models/Section.js';
import Element from '../models/Element.js';
import { createZip } from '../services/ZipExporter.js';
import * as IRBuilder from '../services/IRBuilder.js';
import * as ComponentSynthesiser from '../services/ComponentSynthesiser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

export async function listSections(req, res, next) {
  try {
    const sections = await Section.find().sort({ createdAt: -1 });
    res.json({ ok: true, sections });
  } catch (err) {
    next(err);
  }
}

export async function getSection(req, res, next) {
  try {
    const section = await Section.findOne({ sectionId: req.params.sectionId });
    if (!section) return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'Section not found' } });
    res.json({ ok: true, section });
  } catch (err) {
    next(err);
  }
}

export async function regenerateSection(req, res, next) {
  try {
    const section = await Section.findOne({ sectionId: req.params.sectionId });
    if (!section) return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'Section not found' } });

    // Increment variations counter
    const currentVars = parseInt(section.variations || '1', 10);
    section.variations = (currentVars + 1).toString();

    // Build minimal IR for re-generation
    const ir = await IRBuilder.buildIR({
      promptText: req.body.prompt || `Regenerate the ${section.sectionName} section with a fresh layout variation.`,
      sectionName: section.sectionName,
      pageName: section.pageName,
    });

    const result = await ComponentSynthesiser.generate(ir);
    await section.save();

    res.json({ ok: true, section, jsx: result.jsx, warnings: result.warnings });
  } catch (err) {
    next(err);
  }
}

// GET /api/sections/:sectionId/export — returns a ZIP file
export async function exportSection(req, res, next) {
  try {
    const section = await Section.findOne({ sectionId: req.params.sectionId });
    if (!section) return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'Section not found' } });

    const elements = await Element.find({ sectionId: req.params.sectionId });

    // Try to read the generated JSX file from disk
    const jsxFileName = `${section.sectionName}Section.jsx`;
    const jsxPath = path.resolve(__dirname, `../../../client/src/sections/generated/${jsxFileName}`);
    let jsxContent = '// Generated JSX not found on disk';
    if (fs.existsSync(jsxPath)) {
      jsxContent = fs.readFileSync(jsxPath, 'utf8');
    }

    const zipBuffer = await createZip({
      jsxContent,
      sectionJson: section.toObject(),
      elementsJson: elements.map(e => e.toObject()),
      sectionName: section.sectionName,
    });

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${section.sectionName}Section.zip"`,
      'Content-Length': zipBuffer.length,
    });
    res.send(zipBuffer);
  } catch (err) {
    next(err);
  }
}
