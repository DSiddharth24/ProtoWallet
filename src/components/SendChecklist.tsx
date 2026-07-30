import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { GlossaryTooltip } from './GlossaryTooltip';

export interface SendChecklistItem {
  id: string;
  label: string;
  isMet: boolean;
  explainer?: string;
  tooltipTerm?: string;
  tooltipAnchorText?: string;
}

interface SendChecklistProps {
  items: SendChecklistItem[];
}

export const SendChecklist: React.FC<SendChecklistProps> = ({ items }) => {
  const prefersReducedMotion = useReducedMotion();

  const checkVariants = {
    unchecked: { pathLength: 0, opacity: 0 },
    checked: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.25,
        ease: 'easeInOut' as const,
      },
    },
  };

  return (
    <div className="bg-paper dark:bg-graphite/40 border border-graphite/15 dark:border-paper/10 rounded-card p-4 my-4 max-w-md w-full mx-auto text-left shadow-sm">
      <h3 className="font-display font-bold text-xs tracking-wider uppercase text-graphite dark:text-paper mb-3 flex items-center">
        <span className="inline-block w-2 h-2 bg-ember-coral rounded-full mr-2 animate-pulse"></span>
        Verification Checklist
      </h3>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li
            key={item.id}
            className={`flex items-start p-2.5 rounded transition-colors ${
              item.isMet
                ? 'bg-gain-green/5 dark:bg-gain-green/10'
                : 'bg-graphite/5 dark:bg-paper/5'
            }`}
          >
            {/* SVG Checkbox */}
            <div className="flex-shrink-0 mt-0.5 mr-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                className={`w-5 h-5 rounded border ${
                  item.isMet
                    ? 'border-gain-green bg-gain-green text-paper'
                    : 'border-graphite/30 dark:border-paper/30 bg-transparent'
                } transition-colors duration-200`}
              >
                {item.isMet && (
                  <motion.path
                    d="M4 10 l4 4 l8 -8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={checkVariants}
                    initial="unchecked"
                    animate="checked"
                  />
                )}
              </svg>
            </div>

            {/* Label and Explainer */}
            <div className="flex-grow text-xs">
              <div className="font-semibold text-graphite dark:text-paper flex items-center flex-wrap gap-1">
                {item.tooltipTerm && item.tooltipAnchorText && item.label.includes(item.tooltipAnchorText) ? (
                  <>
                    <span>{item.label.split(item.tooltipAnchorText)[0]}</span>
                    <GlossaryTooltip termKey={item.tooltipTerm}>
                      {item.tooltipAnchorText}
                    </GlossaryTooltip>
                    <span>{item.label.split(item.tooltipAnchorText)[1]}</span>
                  </>
                ) : (
                  item.label
                )}
              </div>
              {item.explainer && (
                <p className="text-[11px] text-graphite/70 dark:text-paper/60 mt-0.5 leading-normal">
                  {item.explainer}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
