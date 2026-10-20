import React from 'react';
import { transform } from 'sucrase';

export interface TranspileResult {
  success: boolean;
  component?: React.ComponentType<any>;
  error?: string;
}

export interface RunTestResult {
  testId: string;
  name: string;
  passed: boolean;
  error?: string;
  durationMs: number;
}

// Prepare code by removing module imports and exposing standard React hooks in scope
function sanitizeCodeForExecution(code: string): string {
  // Strip import statements
  let cleanCode = code.replace(/import\s+[\s\S]*?from\s+['"].*?['"];?/g, '');

  // Convert `export default function ComponentName` or `export default ComponentName` to returning it
  if (cleanCode.includes('export default function')) {
    cleanCode = cleanCode.replace(
      /export\s+default\s+function\s+([A-Za-z0-9_]+)/,
      'function $1'
    );
    // Find component name and return it
    const match = code.match(/export\s+default\s+function\s+([A-Za-z0-9_]+)/);
    if (match && match[1]) {
      cleanCode += `\nreturn ${match[1]};`;
    }
  } else if (cleanCode.includes('export default')) {
    cleanCode = cleanCode.replace(/export\s+default\s+([A-Za-z0-9_]+);?/, 'return $1;');
  } else {
    // If no export default found, try to return the last function or ProblemWorkspace
    const fnMatch = cleanCode.match(/function\s+([A-Z][A-Za-z0-9_]*)/);
    if (fnMatch && fnMatch[1]) {
      cleanCode += `\nreturn ${fnMatch[1]};`;
    }
  }

  return cleanCode;
}

export function transpileAndMount(sourceCode: string): TranspileResult {
  try {
    const prepared = sanitizeCodeForExecution(sourceCode);

    // Transpile JSX/TSX to standard ES2020 JavaScript using sucrase
    const compiled = transform(prepared, {
      transforms: ['jsx', 'typescript'],
      jsxRuntime: 'classic',
      production: true,
    }).code;

    // Inject React and common hooks into evaluation scope
    const scopeKeys = [
      'React',
      'useState',
      'useEffect',
      'useRef',
      'useMemo',
      'useCallback',
      'useReducer',
      'useContext',
      'useLayoutEffect',
      'useTransition',
      'useId',
      'createContext',
      'forwardRef',
    ];

    const scopeValues = [
      React,
      React.useState,
      React.useEffect,
      React.useRef,
      React.useMemo,
      React.useCallback,
      React.useReducer,
      React.useContext,
      React.useLayoutEffect,
      React.useTransition,
      React.useId,
      React.createContext,
      React.forwardRef,
    ];

    // Wrap in function constructor
    const factory = new Function(...scopeKeys, compiled);
    const Component = factory(...scopeValues);

    if (typeof Component !== 'function') {
      return {
        success: false,
        error: 'Evaluation did not return a valid React component function. Ensure your component has "export default function ComponentName() { ... }"',
      };
    }

    return {
      success: true,
      component: Component,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || String(err),
    };
  }
}
