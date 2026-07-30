import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

export interface ShapeGridProps {
  speed?: number;
  squareSize?: number;
  direction?: 'diagonal' | 'horizontal' | 'vertical';
  borderColor?: string;
  hoverFillColor?: string;
  shape?: 'square' | 'circle';
  hoverTrailAmount?: number;
  className?: string;
}

export const ShapeGrid: React.FC<ShapeGridProps> = ({
  speed = 0.5,
  squareSize = 40,
  direction = 'diagonal',
  borderColor = '#999',
  hoverFillColor = '#222',
  shape = 'square',
  hoverTrailAmount = 0,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Hover state
    let hoverCol = -1;
    let hoverRow = -1;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      hoverCol = Math.floor(x / squareSize);
      hoverRow = Math.floor(y / squareSize);
    };

    window.addEventListener('pointermove', handlePointerMove);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Tab visibility handling
    let isTabVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let offset = 0;

    const render = () => {
      if (!isTabVisible) return;

      if (!prefersReduced) {
        offset += speed;
        if (offset >= squareSize) {
          offset %= squareSize;
        }
      }

      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / squareSize) + 2;
      const rows = Math.ceil(height / squareSize) + 2;

      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1.0;
      ctx.globalAlpha = 0.25; // Slightly clearer and whiter visibility

      for (let r = -1; r < rows; r++) {
        for (let c = -1; c < cols; c++) {
          let drawX = c * squareSize;
          let drawY = r * squareSize;

          if (direction === 'diagonal') {
            drawX += offset;
            drawY += offset;
          } else if (direction === 'horizontal') {
            drawX += offset;
          } else if (direction === 'vertical') {
            drawY += offset;
          }

          // Check if square is currently hovered
          const isHovered =
            Math.floor((drawX + squareSize / 2) / squareSize) === hoverCol &&
            Math.floor((drawY + squareSize / 2) / squareSize) === hoverRow;

          if (isHovered) {
            ctx.fillStyle = hoverFillColor;
            ctx.globalAlpha = 0.4;
            if (shape === 'circle') {
              ctx.beginPath();
              ctx.arc(drawX + squareSize / 2, drawY + squareSize / 2, squareSize / 2 - 2, 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.fillRect(drawX, drawY, squareSize, squareSize);
            }
            ctx.globalAlpha = 0.15;
          }

          if (shape === 'circle') {
            ctx.beginPath();
            ctx.arc(drawX + squareSize / 2, drawY + squareSize / 2, squareSize / 2 - 2, 0, Math.PI * 2);
            ctx.stroke();
          } else {
            ctx.strokeRect(drawX, drawY, squareSize, squareSize);
          }
        }
      }

      ctx.globalAlpha = 1;
      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [speed, squareSize, direction, borderColor, hoverFillColor, shape, hoverTrailAmount, prefersReduced]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-[1] ${className}`}
    />
  );
};
