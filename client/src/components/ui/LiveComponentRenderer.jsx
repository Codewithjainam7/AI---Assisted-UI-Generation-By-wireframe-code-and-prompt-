import React, { useState, useEffect, useRef, useMemo, useCallback, Component } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Babel from '@babel/standalone';
import * as LucideIcons from 'lucide-react';
import { Button } from 'primereact/button';
import { fetchElementsByIds } from '../../features/cms/cmsSlice';
import { getSectionTextContrastClass } from '../../utils/sectionContrast';
import { getImage, errorImage } from '../../utils/getImage';
import DynamicSectionPreview from './DynamicSectionPreview';

// Safe identifier validation and reserved word filter
const VALID_IDENTIFIER_REGEX = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
const JS_RESERVED_WORDS = new Set([
  'default', 'class', 'function', 'return', 'import', 'export', 'const', 'let', 'var',
  'if', 'else', 'switch', 'case', 'break', 'continue', 'while', 'for', 'do', 'try',
  'catch', 'finally', 'throw', 'new', 'delete', 'typeof', 'void', 'instanceof', 'in',
  'with', 'this', 'super', 'extends', 'yield', 'await', 'null', 'true', 'false'
]);

// Extract safe Lucide icon components to inject into Babel evaluation scope
const SAFE_LUCIDE_KEYS = [];
const SAFE_LUCIDE_VALS = [];
for (const [k, v] of Object.entries(LucideIcons)) {
  if (VALID_IDENTIFIER_REGEX.test(k) && !JS_RESERVED_WORDS.has(k)) {
    SAFE_LUCIDE_KEYS.push(k);
    SAFE_LUCIDE_VALS.push(v);
  }
}

class RenderErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('LiveComponentRenderer runtime error (falling back to dynamic preview):', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col gap-3 w-full">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs text-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Rendering live component with reactive state preview engine</span>
            </div>
            <span className="text-[11px] font-mono text-amber-300/80">{this.state.error?.message || 'Handled runtime warning'}</span>
          </div>
          {this.props.fallback}
        </div>
      );
    }
    return this.props.children;
  }
}

export default function LiveComponentRenderer({ code = '', pageName = 'Home', job = null }) {
  const dispatch = useDispatch();

  const cmsData = useSelector((state) => state.cms?.allSections?.[pageName]) || {};
  const cmsCss  = useSelector((state) => state.cms?.allSectionsCss?.[pageName]) || {};

  const boundFetchElementsByIds = useCallback((ids) => {
    if (ids && ids.length > 0) {
      dispatch(fetchElementsByIds({ elementIds: ids, pageName }));
    }
  }, [dispatch, pageName]);

  const [CompiledComponent, setCompiledComponent] = useState(null);
  const [renderError, setRenderError] = useState(null);

  useEffect(() => {
    if (!code || typeof code !== 'string' || !code.trim()) {
      setCompiledComponent(null);
      setRenderError(null);
      return;
    }

    try {
      let cleaned = code.trim();

      // Remove markdown code fences if present
      const fenceMatch = cleaned.match(/```(?:jsx|javascript|js)?\s*([\s\S]*?)```/i);
      if (fenceMatch && fenceMatch[1]) {
        cleaned = fenceMatch[1].trim();
      } else {
        cleaned = cleaned.replace(/^```[\w]*\n?/gm, '').replace(/\n?```$/gm, '').trim();
      }

      // Strip non-code preambles (e.g. LLM logs or conversational prefix)
      const codeStart = cleaned.search(/(?:import\s|export\s|const\s|function\s|class\s)/);
      if (codeStart > 0) {
        cleaned = cleaned.slice(codeStart);
      }

      // Find component export name
      let componentName = 'CustomSection';
      const m1 = cleaned.match(/export\s+default\s+function\s+([a-zA-Z0-9_$]+)/);
      const m2 = cleaned.match(/export\s+default\s+([a-zA-Z0-9_$]+)/);
      const m3 = cleaned.match(/(?:const|function|var|let)\s+([A-Z][a-zA-Z0-9_$]*)/);

      if (m1 && m1[1]) {
        componentName = m1[1];
      } else if (m2 && m2[1] && m2[1] !== 'function') {
        componentName = m2[1];
      } else if (m3 && m3[1]) {
        componentName = m3[1];
      }

      // Remove import statements (we inject them directly into scope)
      cleaned = cleaned.replace(/(?:^|\n)\s*import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '\n');
      cleaned = cleaned.replace(/(?:^|\n)\s*import\s+['"][^'"]+['"];?/g, '\n');

      // Convert "export default function Name" to "function Name" so it is valid in function body
      cleaned = cleaned.replace(/export\s+default\s+function\s+/g, 'function ');
      cleaned = cleaned.replace(/export\s+default\s+[a-zA-Z0-9_$]+;?/g, '');

      // Transform with Babel standalone using classic runtime
      const transformFn = Babel?.transform || Babel?.default?.transform || (typeof window !== 'undefined' && window.Babel?.transform);
      if (!transformFn) {
        throw new Error('Babel standalone transform function not available');
      }

      const transformed = transformFn(cleaned, {
        presets: [
          ['react', { runtime: 'classic' }]
        ],
      }).code;

      // Wrap in execution function body with return statement
      const fnBody = `
        ${transformed}
        return typeof ${componentName} !== 'undefined' ? ${componentName} : null;
      `;

      // Create function with injected scope: React, hooks, primereact Button, Redux CMS helpers, and ALL Lucide icons
      const factory = new Function(
        'React',
        'useState',
        'useEffect',
        'useRef',
        'useMemo',
        'useCallback',
        'useSelector',
        'useDispatch',
        'Button',
        'fetchElementsByIds',
        'getSectionTextContrastClass',
        'getImage',
        'errorImage',
        ...SAFE_LUCIDE_KEYS,
        fnBody
      );

      const Comp = factory(
        React,
        useState,
        useEffect,
        useRef,
        useMemo,
        useCallback,
        useSelector,
        useDispatch,
        Button,
        boundFetchElementsByIds,
        getSectionTextContrastClass,
        getImage,
        errorImage,
        ...SAFE_LUCIDE_VALS
      );

      if (typeof Comp === 'function') {
        setCompiledComponent(() => Comp);
        setRenderError(null);
      } else {
        setCompiledComponent(null);
        setRenderError('Could not resolve component function');
      }
    } catch (err) {
      console.warn('LiveComponentRenderer compilation warning (using reactive fallback):', err.message);
      setCompiledComponent(null);
      setRenderError(err.message);
    }
  }, [code, boundFetchElementsByIds]);

  // If live component compiled successfully, render it with pageName and reactive state props
  if (CompiledComponent && !renderError) {
    return (
      <RenderErrorBoundary fallback={<DynamicSectionPreview pageName={pageName} job={job} />}>
        <div className="w-full relative">
          <CompiledComponent
            pageName={pageName}
            data={cmsData}
            cssData={cmsCss}
            fetchElementsByIds={boundFetchElementsByIds}
          />
        </div>
      </RenderErrorBoundary>
    );
  }

  // Fallback to reactive preview engine
  return <DynamicSectionPreview pageName={pageName} job={job} />;
}
