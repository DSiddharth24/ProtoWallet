import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div onClick={onClick} className={`w-full h-full ${className}`}>
      {children}
    </div>
  );
};

export interface CardSwapProps {
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const CardSwap: React.FC<CardSwapProps> = ({
  cardDistance = 40,
  verticalDistance = 40,
  delay = 5000,
  pauseOnHover = true,
  children,
  className = '',
}) => {
  const childrenArray = React.Children.toArray(children);
  const totalCards = childrenArray.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPausedManually, setIsPausedManually] = useState(false);

  useEffect(() => {
    if (totalCards <= 1) return;
    if (isPausedManually || (pauseOnHover && isHovered)) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalCards);
    }, delay);

    return () => clearInterval(timer);
  }, [totalCards, delay, pauseOnHover, isHovered, isPausedManually]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalCards);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  return (
    <div
      className={`flex flex-col items-center justify-between w-full select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Stack Deck Area */}
      <div className="relative w-full max-w-[260px] h-[300px] flex items-center justify-center my-1">
        {childrenArray.map((child, idx) => {
          const stackOffset = (idx - activeIndex + totalCards) % totalCards;
          const isTop = stackOffset === 0;

          return (
            <motion.div
              key={idx}
              className="absolute w-full h-full cursor-pointer"
              style={{
                zIndex: totalCards - stackOffset,
              }}
              animate={{
                x: stackOffset * (cardDistance * 0.08),
                y: stackOffset * (verticalDistance * 0.25),
                scale: 1 - stackOffset * 0.05,
                opacity: 1 - stackOffset * 0.15,
              }}
              transition={{
                type: 'spring',
                stiffness: 280,
                damping: 24,
              }}
              onClick={() => {
                if (!isTop) {
                  setActiveIndex(idx);
                }
              }}
            >
              {child}
            </motion.div>
          );
        })}
      </div>

      {/* Modern Control Bar — Completely separated below the card stack */}
      <div className="mt-6 flex items-center justify-between w-full max-w-[280px] px-3.5 py-2 rounded-full bg-paper/80 dark:bg-night/80 border border-graphite/15 dark:border-paper/15 shadow-md backdrop-blur-md z-20">
        {/* Prev Button */}
        <button
          onClick={handlePrev}
          className="p-1.5 rounded-full hover:bg-[#A855F7]/20 text-graphite dark:text-paper hover:text-[#A855F7] transition-all cursor-pointer focus-ring"
          title="Previous Card"
          aria-label="Previous Card"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Interactive Pagination Dots */}
        <div className="flex items-center gap-1.5">
          {childrenArray.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === activeIndex
                  ? 'w-6 h-2 bg-[#A855F7] shadow-sm shadow-[#A855F7]/50'
                  : 'w-2 h-2 bg-graphite/25 dark:bg-paper/25 hover:bg-graphite/50 dark:hover:bg-paper/50'
              }`}
              title={`Card ${idx + 1}`}
              aria-label={`Go to Card ${idx + 1}`}
            />
          ))}
        </div>

        {/* Card Counter & Pause/Play toggle */}
        <div className="flex items-center gap-1.5">
          <span className="font-data text-[10px] font-bold text-graphite/60 dark:text-paper/60 tracking-wider">
            {activeIndex + 1}/{totalCards}
          </span>
          <button
            onClick={() => setIsPausedManually(!isPausedManually)}
            className="p-1 rounded-full text-graphite/50 dark:text-paper/50 hover:text-[#A855F7] transition-colors"
            title={isPausedManually ? 'Resume Auto-Swap' : 'Pause Auto-Swap'}
            aria-label="Toggle Auto Swap"
          >
            {isPausedManually ? (
              <Play className="w-3 h-3 text-[#A855F7]" />
            ) : (
              <Pause className="w-3 h-3" />
            )}
          </button>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="p-1.5 rounded-full hover:bg-[#A855F7]/20 text-graphite dark:text-paper hover:text-[#A855F7] transition-all cursor-pointer focus-ring"
          title="Next Card"
          aria-label="Next Card"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CardSwap;
