import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Babel from '@babel/standalone';
import { Button } from 'primereact/button';
import { fetchElementsByIds } from '../../features/cms/cmsSlice';
import { getSectionTextContrastClass } from '../../utils/sectionContrast';
import { getImage, errorImage } from '../../utils/getImage';
import DynamicSectionPreview from './DynamicSectionPreview';

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

      // Find component export name
      let componentName = 'CustomSection';
      const exportDefaultMatch = cleaned.match(/export\s+default\s+([a-zA-Z0-9_$]+)/);
      if (exportDefaultMatch && exportDefaultMatch[1]) {
        componentName = exportDefaultMatch[1];
      }
      cleaned = cleaned.replace(/export\s+default\s+[a-zA-Z0-9_$]+;?/g, '');

      // Append return statement to retrieve the component, with hooks in scope
      const executableCode = `
        const { useState, useEffect, useRef, useMemo, useCallback } = React;
        ${cleaned}
        return typeof ${componentName} !== 'undefined' ? ${componentName} : null;
      `;

      // Transform with Babel standalone
      const transformed = Babel.transform(executableCode, {
        presets: ['react'],
      }).code;

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
        transformed
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

  // If live component compiled successfully, render it with pageName
  if (CompiledComponent && !renderError) {
    return (
      <div className="w-full relative">
        <CompiledComponent pageName={pageName} />
      </div>
    );
  }

  // Fallback to reactive preview engine
  return <DynamicSectionPreview pageName={pageName} job={job} />;
}
