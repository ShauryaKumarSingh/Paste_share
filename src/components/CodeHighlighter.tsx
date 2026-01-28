'use client';

import { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { Language, SUPPORTED_LANGUAGES } from '@/types';

interface CodeHighlighterProps {
  code: string;
  language: Language;
  showLineNumbers?: boolean;
}

export function CodeHighlighter({ code, language, showLineNumbers = true }: CodeHighlighterProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.textContent = code;

      // Use highlightElement if the language is supported
      if (SUPPORTED_LANGUAGES.includes(language) && language !== 'plaintext') {
        codeRef.current.className = `language-${language}`;
        hljs.highlightElement(codeRef.current);
      } else {
        codeRef.current.className = '';
      }
    }
  }, [code, language]);

  const lines = code.split('\n');

  return (
    <div className="relative overflow-x-auto bg-gray-950 rounded-lg border border-white/10">
      <pre className="p-4 m-0 font-mono text-sm leading-relaxed">
        {showLineNumbers && (
          <div className="float-left mr-4 select-none text-gray-600">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        )}
        <code ref={codeRef} />
      </pre>
    </div>
  );
}
