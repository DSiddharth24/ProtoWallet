import React, { useState, useRef, useEffect } from 'react';
import { GLOSSARY } from '../utils/glossary';

interface GlossaryTooltipProps {
  termKey: string;
  children: React.ReactNode;
}

export const GlossaryTooltip: React.FC<GlossaryTooltipProps> = ({ termKey, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  const termData = GLOSSARY[termKey.toLowerCase()];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!termData) {
    return <span className="underline decoration-dotted">{children}</span>;
  }

  return (
    <span
      ref={containerRef}
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <span className="border-b border-dashed border-proto-teal text-proto-teal font-semibold cursor-help dark:text-proto-teal">
        {children}
      </span>
      <button
        type="button"
        className="ml-1 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-[10px] font-bold bg-proto-teal/10 text-proto-teal hover:bg-proto-teal hover:text-paper focus-ring transition-colors leading-none"
        aria-label={`Explain ${termData.term}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      >
        ?
      </button>

      {isOpen && (
        <span
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-graphite text-paper rounded-card border border-proto-teal/30 shadow-xl text-left text-xs pointer-events-auto block"
          role="tooltip"
        >
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2.5 h-2.5 bg-graphite rotate-45 border-r border-b border-proto-teal/30 block"></span>
          <span className="font-display text-xs font-bold text-proto-teal uppercase tracking-wider block mb-1">
            {termData.term}
          </span>
          <span className="font-body text-paper/90 leading-relaxed block">
            {termData.definition}
          </span>
        </span>
      )}
    </span>
  );
};
