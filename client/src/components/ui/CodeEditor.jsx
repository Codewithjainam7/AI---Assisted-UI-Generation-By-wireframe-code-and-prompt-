import React, { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

export default function CodeEditor({
  value = '',
  onChange,
  readOnly = false,
  language = 'javascript',
  placeholder = '',
  fileName = 'SectionComponent.jsx',
  maxHeight = '550px'
}) {
  const codeRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (readOnly && codeRef.current) {
      delete codeRef.current.dataset.highlighted;
      hljs.highlightElement(codeRef.current);
    }
  }, [value, readOnly, language]);

  const copyToClipboard = () => {
    if (!value) return;
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative w-full rounded-2xl glass-strong overflow-hidden border border-white/10 flex flex-col bg-[#0d1117] shadow-2xl">
      {/* Editor Header Bar */}
      <div className="h-10 px-4 bg-black/40 border-b border-white/10 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs font-mono text-gray-400 ml-2">{fileName}</span>
        </div>

        {readOnly && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">
              {language}
            </span>
            <button
              onClick={copyToClipboard}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors text-xs flex items-center gap-1.5"
              title="Copy Code"
            >
              <i className={`pi ${copied ? 'pi-check text-green-400' : 'pi-copy'} text-xs`} />
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Editor Body */}
      {readOnly ? (
        <div className="overflow-auto font-mono text-xs leading-relaxed p-4" style={{ maxHeight }}>
          <pre className="m-0">
            <code ref={codeRef} className={`language-${language}`}>
              {value || '// No generated code available'}
            </code>
          </pre>
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-64 p-4 bg-transparent text-xs font-mono text-gray-200 focus:outline-none resize-y leading-relaxed"
          spellCheck="false"
        />
      )}
    </div>
  );
}
