import archiver from 'archiver';

export async function createZip({ jsxContent, sectionJson, elementsJson, sectionName }) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('data', chunk => chunks.push(chunk));
    archive.on('end', () => resolve(Buffer.concat(chunks)));
    archive.on('error', reject);
    
    archive.append(jsxContent, { name: `${sectionName}Section.jsx` });
    archive.append(JSON.stringify(sectionJson, null, 2), { name: 'section.json' });
    archive.append(JSON.stringify(elementsJson, null, 2), { name: 'elements.json' });
    archive.finalize();
  });
}
