import React, { useState, useRef } from 'react';

export interface MagicBentoProps {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  glowColor?: string;
  disableAnimations?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export interface BentoItemProps {
  children: React.ReactNode;
  className?: string;
  span?: string;
}

export const BentoItem: React.FC<BentoItemProps> = ({ children, className = '', span = 'col-span-1' }) => {
  return (
    <div
      className={`relative rounded-card border border-graphite/15 dark:border-paper/15 bg-transparent backdrop-blur-sm p-5 overflow-hidden transition-all duration-300 hover:border-proto-teal/40 hover:shadow-lg ${span} ${className}`}
    >
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};

export const MagicBento: React.FC<MagicBentoProps> = ({
  clickEffect = true,
  children,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<{ id: string; x: number; y: number }[]>([]);

  // Click ripple effect
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!clickEffect) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const id = `ripple_${Date.now()}_${Math.random()}`;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 800);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`relative w-full max-w-4xl mx-auto rounded-card select-none overflow-hidden ${className}`}
    >
      {/* ── Click Ripples ── */}
      {ripples.map((rip) => (
        <div
          key={rip.id}
          className="pointer-events-none absolute rounded-full border border-proto-teal/80 bg-proto-teal/20 animate-circuit-ripple z-20"
          style={{
            left: rip.x,
            top: rip.y,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* ── Bento Grid Content Container ── */}
      <div className="relative z-20 w-full">
        {children}
      </div>
    </div>
  );
};

export default MagicBento;
