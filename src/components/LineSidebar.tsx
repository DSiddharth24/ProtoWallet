import React, { useState, useRef, useEffect } from 'react';

export interface LineSidebarProps {
  items?: string[];
  accentColor?: string;
  textColor?: string;
  markerColor?: string;
  showIndex?: boolean;
  showMarker?: boolean;
  proximityRadius?: number;
  maxShift?: number;
  falloff?: 'smooth' | 'linear';
  markerLength?: number;
  markerGap?: number;
  tickScale?: number;
  scaleTick?: boolean;
  itemGap?: number;
  fontSize?: number;
  smoothing?: number;
  defaultActive?: number;
  onItemClick?: (index: number, label: string) => void;
  className?: string;
}

export const LineSidebar: React.FC<LineSidebarProps> = ({
  items = ['Dashboard', 'Send', 'Receive', 'Swap', 'Activity', 'Learn', 'Settings'],
  accentColor = '#A855F7',
  textColor = '#c4c4c4',
  markerColor = '#6c6c6c',
  showIndex = true,
  showMarker = true,
  proximityRadius = 100,
  maxShift = 30,
  falloff = 'smooth',
  markerLength = 60,
  markerGap = 0,
  tickScale = 0.5,
  scaleTick = true,
  itemGap = 20,
  fontSize = 1.1,
  smoothing = 100,
  defaultActive = 0,
  onItemClick,
  className = '',
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultActive);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveIndex(defaultActive);
  }, [defaultActive]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sidebarRef.current) return;
    const rect = sidebarRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -1000, y: -1000 });
  };

  return (
    <div
      ref={sidebarRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative flex flex-col select-none ${className}`}
      style={{ gap: `${itemGap}px` }}
    >
      {items.map((label, idx) => {
        const isActive = activeIndex === idx;

        // Proximity calculation for mouse shift effect with smoothing
        let shiftX = 0;
        let itemScale = 1;

        if (sidebarRef.current) {
          const itemElement = sidebarRef.current.children[idx] as HTMLElement;
          if (itemElement) {
            const itemRect = itemElement.getBoundingClientRect();
            const sidebarRect = sidebarRef.current.getBoundingClientRect();
            const itemCenterY = itemRect.top - sidebarRect.top + itemRect.height / 2;

            const distY = Math.abs(mousePos.y - itemCenterY);

            if (distY < proximityRadius) {
              const factor = 1 - distY / proximityRadius;
              const smoothFactor = falloff === 'smooth' ? Math.pow(factor, 2) : factor;
              shiftX = smoothFactor * maxShift * (smoothing / 100);
              if (scaleTick) {
                itemScale = 1 + smoothFactor * tickScale;
              }
            }
          }
        }

        return (
          <div
            key={label}
            onClick={() => {
              setActiveIndex(idx);
              if (onItemClick) {
                onItemClick(idx, label);
              }
            }}
            className="group flex items-center cursor-pointer transition-transform duration-150 ease-out py-1"
            style={{
              gap: `${markerGap > 0 ? markerGap : 12}px`,
              transform: `translateX(${shiftX}px) scale(${itemScale})`,
              transformOrigin: 'left center',
            }}
          >
            {/* Marker Line */}
            {showMarker && (
              <div
                className="transition-all duration-300 rounded-full flex-shrink-0"
                style={{
                  width: isActive ? `${markerLength}px` : '24px',
                  height: isActive ? '3px' : '2px',
                  backgroundColor: isActive ? accentColor : markerColor,
                  boxShadow: isActive ? `0 0 12px ${accentColor}` : 'none',
                }}
              />
            )}

            {/* Index Number */}
            {showIndex && (
              <span
                className="font-data font-bold transition-colors duration-200"
                style={{
                  fontSize: `${fontSize * 0.75}rem`,
                  color: isActive ? accentColor : markerColor,
                }}
              >
                0{idx + 1}
              </span>
            )}

            {/* Label */}
            <span
              className="font-body font-bold tracking-wide transition-colors duration-200"
              style={{
                fontSize: `${fontSize}rem`,
                color: isActive ? accentColor : textColor,
              }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default LineSidebar;
