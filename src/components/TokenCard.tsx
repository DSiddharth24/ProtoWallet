import React, { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Token } from '../types';
import { ArrowUpRight, ArrowDownRight, RotateCw, Sparkles, CheckCircle2 } from 'lucide-react';

interface TokenCardProps {
  token: Token;
  currencySymbol?: string;
  currencyRate?: number;
  isLessonCompleted?: boolean;
  delayIndex?: number;
}

const safeNum = (val: any, fallback = 0): number => {
  const n = typeof val === 'number' ? val : parseFloat(val);
  return typeof n === 'number' && !isNaN(n) && isFinite(n) ? n : fallback;
};

const CARD_EXPLAINERS: Record<string, { desc: string; lessonName: string }> = {
  pETH: {
    desc: 'pETH — used to explore sending, swaps, and gas fees on Ethereum.',
    lessonName: 'Gas & Network Fees (Lesson 4)',
  },
  pUSDC: {
    desc: 'pUSDC — a practice stablecoin pegged to $1.00 USD, ideal for low-volatility storage.',
    lessonName: 'Sending & Receiving (Lesson 3)',
  },
  pMATIC: {
    desc: 'pMATIC — native gas token for Polygon, built for fast and cheap transactions.',
    lessonName: 'Gas & Network Fees (Lesson 4)',
  },
  pARB: {
    desc: 'pARB — Layer-2 token used to test high-speed Arbitrum rollup swaps.',
    lessonName: 'Swaps & DeFi Basics (Lesson 5)',
  },
};

const GRADIENT_PRESETS: Record<string, { bgClass: string; textClass: string; accentClass: string; borderFoil: string }> = {
  pETH: {
    bgClass: 'bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#0D9488]',
    textClass: 'text-white',
    accentClass: 'bg-proto-teal',
    borderFoil: 'border-2 border-proto-teal shadow-lg shadow-proto-teal/30',
  },
  pUSDC: {
    bgClass: 'bg-gradient-to-br from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB]',
    textClass: 'text-white',
    accentClass: 'bg-[#60A5FA]',
    borderFoil: 'border-2 border-[#60A5FA] shadow-lg shadow-[#60A5FA]/30',
  },
  pMATIC: {
    bgClass: 'bg-gradient-to-br from-[#3B0764] via-[#5B21B6] to-[#7C3AED]',
    textClass: 'text-white',
    accentClass: 'bg-[#C084FC]',
    borderFoil: 'border-2 border-[#C084FC] shadow-lg shadow-[#C084FC]/30',
  },
  pARB: {
    bgClass: 'bg-gradient-to-br from-[#9A3412] via-[#C2410C] to-[#0284C7]',
    textClass: 'text-white',
    accentClass: 'bg-[#FB923C]',
    borderFoil: 'border-2 border-[#FB923C] shadow-lg shadow-[#FB923C]/30',
  },
};

export const TokenCard: React.FC<TokenCardProps> = ({
  token,
  currencySymbol = '$',
  currencyRate = 1,
  isLessonCompleted = false,
  delayIndex = 0,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [shinePos, setShinePos] = useState({ x: 50, y: 50 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || prefersReduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setShinePos({ x, y });
  };

  const handleMouseLeave = () => {
    setShinePos({ x: 50, y: 50 });
  };

  const preset = GRADIENT_PRESETS[token.symbol] || GRADIENT_PRESETS.pETH;
  const explainer = CARD_EXPLAINERS[token.symbol] || {
    desc: `${token.name} — practice asset inside ProtoWallet.`,
    lessonName: 'Basics Lesson',
  };

  const amount = safeNum(token.amount, 0);
  const priceUSD = safeNum(token.priceUSD, 1);
  const rate = safeNum(currencyRate, 1);
  const change24h = safeNum(token.change24h, 0);

  const convertedValue = safeNum(amount * priceUSD * rate, 0);
  const isPositive = change24h >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delayIndex * 0.08 }}
      className="perspective-1000 w-full max-w-[240px] aspect-[4/5] mx-auto select-none"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsFlipped(!isFlipped)}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className={`relative w-full h-full rounded-card cursor-pointer shadow-md transition-shadow duration-200 hover:shadow-xl ${
          isLessonCompleted ? preset.borderFoil : 'border border-graphite/20 dark:border-paper/20'
        }`}
      >
        {/* ──────── FRONT FACE ──────── */}
        <div
          style={{ backfaceVisibility: 'hidden' }}
          className={`absolute inset-0 rounded-card p-4 flex flex-col justify-between overflow-hidden ${preset.bgClass} ${preset.textClass}`}
        >
          {/* Holographic foil shine overlay */}
          {!prefersReduced && (
            <div
              className={`absolute inset-0 pointer-events-none rounded-card transition-opacity duration-300 ${
                isTouchDevice ? 'animate-pulse opacity-20' : 'opacity-30'
              }`}
              style={{
                background: `radial-gradient(circle at ${shinePos.x}% ${shinePos.y}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 60%)`,
                mixBlendMode: 'color-dodge',
              }}
            />
          )}

          {/* Top: Icon + Symbol + Decorative accent strip */}
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-data text-xs font-bold shadow-inner">
                {token.symbol.slice(1)}
              </div>

              {/* Foil Upgrade Badge */}
              {isLessonCompleted && (
                <div
                  className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-data font-bold tracking-wider"
                  title="Foil border unlocked via lesson completion!"
                >
                  <Sparkles className="w-3 h-3 text-ember-coral" />
                  <span>FOIL TIER</span>
                </div>
              )}
            </div>

            <div className="font-data text-xl font-extrabold tracking-wider">
              {token.symbol}
            </div>

            {/* Decorative abstract accent strip */}
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden flex gap-1">
              <div className={`h-full w-1/3 ${preset.accentClass}`} />
              <div className="h-full w-1/4 bg-white/40" />
            </div>
          </div>

          {/* Middle: Amount Held */}
          <div className="relative z-10 my-auto py-2">
            <span className="font-body text-[10px] uppercase tracking-widest opacity-70 block font-semibold">
              Balance
            </span>
            <div className="font-data text-2xl font-black tracking-tight leading-tight">
              {amount.toFixed(4)}
            </div>
          </div>

          {/* Bottom: USD Value + 24h Change */}
          <div className="relative z-10 space-y-1.5 border-t border-white/20 pt-2.5 mt-auto bg-black/30 -mx-4 -mb-4 p-3 rounded-b-card backdrop-blur-xs">
            <div className="flex items-center justify-between font-data">
              <span className="text-sm font-extrabold text-white">
                {currencySymbol}
                {convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>

              {/* 24h Change Chip */}
              <div
                className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full font-data ${
                  isPositive
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                }`}
              >
                {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                <span>{Math.abs(change24h).toFixed(1)}%</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[9px] text-white/70 font-body">
              <span>Tap card to flip</span>
              <RotateCw className="w-3 h-3 opacity-80" />
            </div>
          </div>
        </div>

        {/* ──────── BACK FACE ──────── */}
        <div
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          className="absolute inset-0 rounded-card p-4 bg-graphite dark:bg-night text-paper border border-proto-teal/40 flex flex-col justify-between text-left overflow-hidden shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-paper/15 pb-2">
            <span className="font-data text-xs font-bold text-proto-teal truncate mr-1">
              {token.name}
            </span>
            <span className="font-data text-[10px] text-paper/50 flex-shrink-0">
              {token.symbol}
            </span>
          </div>

          {/* Body Description */}
          <div className="my-auto py-1 space-y-1">
            <span className="font-body text-[10px] font-bold uppercase tracking-wider text-proto-teal/80 block">
              Asset Overview
            </span>
            <p className="font-body text-[11px] text-paper/90 leading-snug">
              {explainer.desc}
            </p>
          </div>

          {/* Footer Lesson Upgrade Info */}
          <div className="border-t border-paper/15 pt-2 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold font-data uppercase tracking-wider text-proto-teal">
              {isLessonCompleted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-gain-green" />
                  <span className="text-gain-green">Foil Unlocked</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-ember-coral" />
                  <span>Unlock Foil Tier</span>
                </>
              )}
            </div>
            <p className="font-body text-[10px] text-paper/60 leading-tight">
              Complete <strong>{explainer.lessonName}</strong> to upgrade foil.
            </p>
            <div className="flex justify-between items-center text-[9px] text-paper/40 pt-1">
              <RotateCw className="w-3 h-3" />
              <span>Tap to flip back</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
