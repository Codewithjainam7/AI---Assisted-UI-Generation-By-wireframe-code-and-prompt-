import React, { useState, useEffect, useMemo, Component } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Babel from '@babel/standalone';
import { Button } from 'primereact/button';
import { fetchElementsByIds } from '../../features/cms/cmsSlice';
import { getSectionTextContrastClass } from '../../utils/sectionContrast';
import { getImage, errorImage } from '../../utils/getImage';
import DynamicSectionPreview from './DynamicSectionPreview';

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
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function LiveComponentRenderer({ code = '', pageName = 'Home', job = null }) {
  const dispatch = useDispatch();

  const [CompiledComponent, setCompiledComponent] = useState(null);
  const [renderError, setRenderError] = useState(null);

  useEffect(() => {
    if (!code || typeof code !== 'string' || !code.trim()) {
      setCompiledComponent(null);
      setRenderError(null);
      return;
    }

    try {
      // Clean the code string
      let cleaned = code.trim();

      // Remove markdown code fences if present
      const fenceMatch = cleaned.match(/```(?:jsx|javascript|js)?\s*([\s\S]*?)```/i);
      if (fenceMatch && fenceMatch[1]) {
        cleaned = fenceMatch[1].trim();
      } else {
        cleaned = cleaned.replace(/^```[\w]*\n?/gm, '').replace(/\n?```$/gm, '').trim();
      }

      // Remove import statements (we inject them into the execution scope)
      cleaned = cleaned.replace(/(?:^|\n)\s*import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '\n');
      cleaned = cleaned.replace(/(?:^|\n)\s*import\s+['"][^'"]+['"];?/g, '\n');

      // Find component export name
      let componentName = 'CustomSection';
      const exportDefaultMatch = cleaned.match(/export\s+default\s+([a-zA-Z0-9_$]+)/);
      if (exportDefaultMatch && exportDefaultMatch[1]) {
        componentName = exportDefaultMatch[1];
      }
      cleaned = cleaned.replace(/export\s+default\s+[a-zA-Z0-9_$]+;?/g, '');

      // Transform with Babel standalone using classic runtime (React.createElement)
      // to avoid modern automatic JSX runtime generating import statements
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

      // Create function with injected scope
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
        fetchElementsByIds,
        getSectionTextContrastClass,
        getImage,
        errorImage
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
  }, [code]);

  // If live component compiled successfully, render it with pageName inside Error Boundary
  if (CompiledComponent && !renderError) {
    return (
      <RenderErrorBoundary fallback={<DynamicSectionPreview pageName={pageName} job={job} />}>
        <div className="w-full relative">
          <CompiledComponent pageName={pageName} />
        </div>
      </RenderErrorBoundary>
    );
  }

  // Fallback to reactive preview engine
  return <DynamicSectionPreview pageName={pageName} job={job} />;
}
