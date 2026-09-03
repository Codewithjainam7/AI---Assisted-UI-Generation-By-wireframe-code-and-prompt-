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
    
    if (req.file) {
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
      }
    }
    
    let finalJsx = synthResult.jsx;
    const sectionId = IdAllocator.nextSectionId();
    
    const elementsToInsert = ir.elements.map(e => {
      const fieldId = IdAllocator.nextFieldId();
      finalJsx = finalJsx.replace(new RegExp(e.fieldId, 'g'), fieldId);
      
      let loop = [];
      if (e.contentType === 'Cards') {
        const count = e.statCount || 3;
        const defaults = [
          { field1: '1000+', field2: 'Community<br />Members' },
          { field1: '40+',   field2: 'Fitness<br />Programmes' },
          { field1: '150+',  field2: 'Fitness<br />Channels' },
        ];
        for (let i = 0; i < count; i++) {
          const pair = IdAllocator.nextCardFieldIdPair();
          const def = defaults[i] || { field1: `Stat ${i + 1}`, field2: `Label ${i + 1}` };
          
          finalJsx = finalJsx.replace(new RegExp(`TBD-cardField${i * 2 + 1}`, 'g'), pair.fieldId1);
          finalJsx = finalJsx.replace(new RegExp(`TBD-cardField${i * 2 + 2}`, 'g'), pair.fieldId2);
          
          loop.push({
            field1:     def.field1,
            fieldType1: 'Text',
            fieldId1:   pair.fieldId1,
            field2:     def.field2,
            fieldType2: 'Text',
            fieldId2:   pair.fieldId2,
          });
        }
      }
      
      return {
        sectionId,
        elementName: e.elementName,
        fieldId,
        content: e.defaultContent || '',
        contentType: e.contentType,
        projectName: 'sample-brand',
        pageName: ir.pageName,
        isCustom: true,
        css: null,
        loop
      };
    });
    
    const sectionDoc = {
      sectionId,
      sectionName: ir.sectionName,
      pageName: ir.pageName,
      isGenerated: true,
      cardGridColumns: ir.layout?.columns || 3
    };
    
    await SectionStore.create(sectionDoc);
    await ElementStore.insertMany(elementsToInsert);
    
    // Write generated JSX file
    const generatedDir = path.resolve(process.cwd(), '../client/src/sections/generated');
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
