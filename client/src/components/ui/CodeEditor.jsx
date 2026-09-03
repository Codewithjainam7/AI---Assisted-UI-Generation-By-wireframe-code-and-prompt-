import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

export default function CodeEditor({ value, onChange, readOnly = false, language = 'javascript', placeholder = '' }) {
  const codeRef = useRef(null);

  useEffect(() => {
    if (readOnly && codeRef.current) {
      delete codeRef.current.dataset.highlighted;
      hljs.highlightElement(codeRef.current);
    }
  }, [value, readOnly, language]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div className="relative w-full rounded-2xl glass-strong overflow-hidden border border-gray-700">
      {readOnly ? (
        <div className="relative group max-h-[500px] overflow-auto">
          <button 
            onClick={copyToClipboard}
            className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-gray-800/80 text-gray-300 hover:text-white hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Copy"
          >
            <i className="pi pi-copy"></i>
          </button>
          <pre className="m-0 p-4 text-sm font-mono leading-relaxed">
            <code ref={codeRef} className={`language-${language}`}>
              {value}
            </code>
          </pre>
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-64 p-4 bg-transparent text-sm font-mono text-gray-300 focus:outline-none resize-y"
          spellCheck="false"
        />
      )}
    </div>
  );
}
