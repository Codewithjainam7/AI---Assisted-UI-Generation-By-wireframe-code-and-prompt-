import * as WireframeParser from '../services/WireframeParser.js';
import * as CodeParser from '../services/CodeParser.js';
import * as IRBuilder from '../services/IRBuilder.js';
import * as ComponentSynthesiser from '../services/ComponentSynthesiser.js';
import * as JsxValidator from '../services/JsxValidator.js';
import IdAllocator from '../services/IdAllocator.js';
import { SectionStore, ElementStore } from '../services/dbStore.js';
import { generateFallback } from '../templates/heroFallback.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generate(req, res, next) {
  try {
    if (!req.file && !req.body.code && !req.body.prompt) {
      const err = new Error('Requires at least one input');
      err.code = 'INVALID_INPUT';
      throw err;
    }
    
    const pageName = req.body.pageName || 'Home';
    const rawSectionName = req.body.sectionName || 'Custom';
    const sectionName = rawSectionName.replace(/\s+/g, '') || 'Custom';
    
    const promises = [];
    let wireframeIR = null;
    let codeIR = null;
    let uploadedImageRelativePath = null;
    
    if (req.file) {
      // Copy uploaded image to storage/uploads so frontend can display it
      const storageUploadsDir = path.join(__dirname, '../../storage/uploads');
      if (!fs.existsSync(storageUploadsDir)) {
        fs.mkdirSync(storageUploadsDir, { recursive: true });
      }
      const cleanFileName = `${Date.now()}-${path.basename(req.file.path)}`;
      const destPath = path.join(storageUploadsDir, cleanFileName);
      fs.copyFileSync(req.file.path, destPath);
      uploadedImageRelativePath = `uploads/${cleanFileName}`;

      promises.push(WireframeParser.parse(req.file).then(r => wireframeIR = r));
    }
    if (req.body.code) {
      promises.push(Promise.resolve(CodeParser.parse(req.body.code)).then(r => codeIR = r));
    }
    
    await Promise.all(promises);
    
    const ir = await IRBuilder.buildIR({
      promptText: req.body.prompt,
      wireframeIR,
      codeIR,
      sectionName,
      pageName
    });

    // The uploaded wireframe image is the design blueprint, stored in sectionDoc.wireframes
    let warnings = [];
    const mainEl = ir.elements.find(e => e.elementName === 'headlineMain');
    const ctaEl = ir.elements.find(e => e.elementName === 'ctaButton');
    if (!mainEl) warnings.push('Missing headlineMain in IR');
    if (!ctaEl) warnings.push('Missing ctaButton in IR');
    
    let synthResult = await ComponentSynthesiser.generate(ir);
    let validation = JsxValidator.validate(synthResult.jsx || '');
    
    if (!synthResult.jsx || !validation.valid) {
      synthResult = await ComponentSynthesiser.generate(ir);
      validation = JsxValidator.validate(synthResult.jsx || '');
      
      if (!synthResult.jsx || !validation.valid) {
        warnings.push('Used fallback template due to generation failure');
        synthResult.jsx = generateFallback(ir);
      } else {
        synthResult.jsx = validation.cleaned;
      }
    } else {
      synthResult.jsx = validation.cleaned;
    }
    
    let finalJsx = synthResult.jsx;
    const sectionId = IdAllocator.nextSectionId();
    
    const elementsToInsert = ir.elements.map(e => {
      const fieldId = IdAllocator.nextFieldId();
      finalJsx = finalJsx.replace(new RegExp(e.fieldId, 'g'), fieldId);
      
      let loop = [];
      if (e.contentType === 'Cards') {
        const rawCards = e.statCards || [
          { field1: '100+', field2: 'Active Users' },
          { field1: '4.9★', field2: 'Top Rated' },
          { field1: '24/7', field2: 'Live Support' }
        ];
        
        for (let i = 0; i < rawCards.length; i++) {
          const pair = IdAllocator.nextCardFieldIdPair();
          const card = rawCards[i] || { field1: `Metric ${i + 1}`, field2: `Label ${i + 1}` };
          
          finalJsx = finalJsx.replace(new RegExp(`TBD-cardField${i * 2 + 1}`, 'g'), pair.fieldId1);
          finalJsx = finalJsx.replace(new RegExp(`TBD-cardField${i * 2 + 2}`, 'g'), pair.fieldId2);
          
          loop.push({
            field1:     card.field1 || '100+',
            fieldType1: 'Text',
            fieldId1:   pair.fieldId1,
            field2:     card.field2 || 'Metric',
            fieldType2: 'Text',
            fieldId2:   pair.fieldId2,
          });
        }
      }
      
      let content = e.defaultContent || '';
      if (e.contentType === 'Image') {
        if (!content || content.includes('uploads/') || content.includes('wireframe') || content.includes('1571434190823')) {
          content = 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80';
        }
      }
      
      return {
        sectionId,
        elementName: e.elementName,
        fieldId,
        content,
        contentType: e.contentType,
        projectName: 'sample-brand',
        pageName: ir.pageName,
        isCustom: true,
        css: null,
        loop
      };
    });

    // Clean up any remaining TBD placeholders with valid allocated IDs
    finalJsx = finalJsx.replace(/TBD-cardField\d+/g, () => IdAllocator.nextCardFieldId());
    finalJsx = finalJsx.replace(/TBD-[\w]+/g, () => IdAllocator.nextFieldId());
    
    const sectionDoc = {
      sectionId,
      sectionName: ir.sectionName,
      pageName: ir.pageName,
      isGenerated: true,
      wireframes: uploadedImageRelativePath || '',
      cardGridColumns: ir.layout?.columns || 3,
      jsx: finalJsx
    };
    
    // Clear old elements for this page and save new ones
    await ElementStore.deleteMany({ pageName: ir.pageName });
    await SectionStore.create(sectionDoc);
    await ElementStore.insertMany(elementsToInsert);
    
    // Write generated JSX file
    const generatedDir = path.resolve(__dirname, '../../../client/src/sections/generated');
    if (!fs.existsSync(generatedDir)) {
      fs.mkdirSync(generatedDir, { recursive: true });
    }
    
    const namedOutPath = path.join(generatedDir, `${ir.sectionName}Section.jsx`);
    fs.writeFileSync(namedOutPath, finalJsx, 'utf8');

    // Also update HeroSection.jsx if generating for Home
    if (pageName === 'Home' || ir.sectionName.toLowerCase().includes('hero') || ir.sectionName.toLowerCase().includes('custom')) {
      const heroOutPath = path.join(generatedDir, 'HeroSection.jsx');
      fs.writeFileSync(heroOutPath, finalJsx, 'utf8');
    }
    
    res.json({
      ok: true,
      sectionId,
      pageName,
      componentFile: `${ir.sectionName}Section.jsx`,
      jsx: finalJsx,
      elementIds: elementsToInsert.map(e => e.fieldId),
      warnings,
      ir
    });
    
  } catch (err) {
    next(err);
  }
}
