import * as WireframeParser from '../services/WireframeParser.js';
import * as CodeParser from '../services/CodeParser.js';
import * as IRBuilder from '../services/IRBuilder.js';
import * as ComponentSynthesiser from '../services/ComponentSynthesiser.js';
import * as JsxValidator from '../services/JsxValidator.js';
import IdAllocator from '../services/IdAllocator.js';
import Section from '../models/Section.js';
import Element from '../models/Element.js';
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
    const sectionName = req.body.sectionName || 'Custom';
    
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
    let validation = JsxValidator.validate(synthResult.jsx);
    
    if (!validation.valid) {
      synthResult = await ComponentSynthesiser.generate(ir);
      validation = JsxValidator.validate(synthResult.jsx);
      
      if (!validation.valid) {
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
        pageName: ir.pageName,
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
    
    await Section.create(sectionDoc);
    await Element.insertMany(elementsToInsert);
    
    const outPath = path.resolve(process.cwd(), `../client/src/sections/generated/${ir.sectionName}Section.jsx`);
    const outDir = path.dirname(outPath);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    fs.writeFileSync(outPath, finalJsx, 'utf8');
    
    res.json({
      ok: true,
      sectionId,
      pageName,
      componentFile: `${ir.sectionName}Section.jsx`,
      elementIds: elementsToInsert.map(e => e.fieldId),
      warnings,
      ir
    });
    
  } catch (err) {
    next(err);
  }
}
