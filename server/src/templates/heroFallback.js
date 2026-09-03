export function generateFallback(ir) {
  return `import React from 'react';
import { useSelector } from 'react-redux';

export default function ${ir.sectionName}Section() {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-white">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <h1 id="TBD-headlineMain" className="text-4xl font-bold text-gray-900">
          Fallback ${ir.sectionName}
        </h1>
        <button id="TBD-ctaButton" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded">
          Click Here
        </button>
      </div>
      <div className="w-full md:w-1/2">
        <img id="TBD-heroImage" src="/default/images/hero-placeholder.jpg" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
`;
}
