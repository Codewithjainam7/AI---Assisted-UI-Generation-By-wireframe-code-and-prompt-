import React, { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { Copy, Check, Code2 } from 'lucide-react';

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
    <div className="relative w-full rounded-2xl glass-liquid-card overflow-hidden border border-white/12 flex flex-col bg-[#05070c] shadow-2xl">
      {/* Editor Header Bar */}
      <div className="h-11 px-4 bg-white/[0.03] backdrop-blur-md border-b border-white/8 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-1.5 ml-2 text-slate-400">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-mono text-slate-300 font-medium">{fileName}</span>
          </div>
        </div>

        {readOnly && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/[0.05] text-slate-400 border border-white/8">
              {language}
            </span>
            <button
              onClick={copyToClipboard}
              className="px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1.5 border border-white/10 active:scale-95 shadow-sm"
              title="Copy Code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
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
          className="w-full h-64 p-4 bg-transparent text-xs font-mono text-slate-200 focus:outline-none resize-y leading-relaxed"
          spellCheck="false"
        />
      )}
    </div>
  );
}
