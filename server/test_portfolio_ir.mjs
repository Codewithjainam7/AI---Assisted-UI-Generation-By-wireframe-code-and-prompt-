
import dotenv from 'dotenv';
dotenv.config();
import * as IRBuilder from './src/services/IRBuilder.js';

async function test() {
  const ir = await IRBuilder.buildIR({
    promptText: 'a simple portfolio website with a form of contact',
    wireframeIR: null,
    codeIR: null,
    sectionName: 'PortfolioShowcase',
    pageName: 'Home'
  });
  console.log("IR Result:");
  console.log("domain:", ir.domain);
  console.log("isMultiPage:", ir.isMultiPage);
  console.log("pages:", ir.pages);
  console.log("hasForm:", ir.hasForm);
  console.log("formType:", ir.formType);
  console.log("formConfig:", ir.formConfig);
  console.log("headlineMain:", ir.elements?.find(e => e.elementName === 'headlineMain')?.defaultContent);
}
test();
