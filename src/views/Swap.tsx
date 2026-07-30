import React, { useState } from 'react';
import { useWalletStore } from '../store/useWalletStore';
import { SendProgress } from '../components/SendProgress';
import { ArrowDown, ArrowLeftRight, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import type { TransactionStatus } from '../types';

interface SwapProps {
  onNavigate: (view: string) => void;
}

export const Swap: React.FC<SwapProps> = ({ onNavigate }) => {
  const { tokens, settings, currencyRates, swapTokens } = useWalletStore();

  const currencyRate = currencyRates[settings.currency] || (settings.currency === 'INR' ? 83.5 : settings.currency === 'EUR' ? 0.92 : 1);
  const currencySymbol = settings.currency === 'INR' ? '₹' : settings.currency === 'EUR' ? '€' : settings.currency === 'GBP' ? '£' : '$';

  const [fromSymbol, setFromSymbol] = useState<string>('pETH');
  const [toSymbol, setToSymbol] = useState<string>('pUSDC');
  const [amountFromStr, setAmountFromStr] = useState<string>('0.5');
  const [slippage, setSlippage] = useState<number>(0.5);

  const [txStatus, setTxStatus] = useState<TransactionStatus | null>(null);
  const [cancelFn, setCancelFn] = useState<(() => void) | null>(null);

  const fromToken = tokens.find((t) => t.symbol === fromSymbol) || tokens[0];
  const toToken = tokens.find((t) => t.symbol === toSymbol) || tokens[1];

  const amountFrom = parseFloat(amountFromStr) || 0;
  const amountTo = (amountFrom * fromToken.priceUSD) / toToken.priceUSD;

  const feeUSD = 1.25;
  const hasSufficientBalance = fromToken.amount >= amountFrom;

  const handleReverseTokens = () => {
    setFromSymbol(toSymbol);
    setToSymbol(fromSymbol);
  };

  const handleExecuteSwap = () => {
    const { cancel } = swapTokens(
      fromSymbol,
      toSymbol,
      amountFrom,
      amountTo,
      feeUSD,
      (status) => {
        setTxStatus(status);
        if (status === 'Complete') {
          setTimeout(() => {
            onNavigate('activity');
          }, 1200);
        }
      }
    );
    setCancelFn(() => cancel);
  };

  return (
    <div className="max-w-2xl w-full flex flex-col items-center select-none text-left space-y-6 bg-transparent">
      {/* Header Banner */}
      <div className="w-full bg-transparent border border-graphite/15 dark:border-paper/15 rounded-card p-6 md:p-8 backdrop-blur-sm shadow-sm flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#A855F7] text-xs font-data font-bold uppercase tracking-wider mb-2">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            DEX Swap Sandbox
          </div>
          <h1 className="font-display text-3xl font-bold text-graphite dark:text-paper">
            DeFi Token Swap
          </h1>
          <p className="font-body text-xs text-graphite/70 dark:text-paper/60 mt-1">
            Swap tokens instantly via automated smart contracts with slippage protection.
          </p>
        </div>

        <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gain-green/10 border border-gain-green/30 text-gain-green font-data text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Zero Risk</span>
        </div>
      </div>

      {/* Main Glassmorphism DEX Swap Console */}
      <div className="w-full bg-transparent border border-graphite/15 dark:border-paper/15 rounded-card p-6 md:p-8 backdrop-blur-sm shadow-sm space-y-5">
        {/* FROM Token Input Box */}
        <div className="bg-transparent border border-graphite/15 dark:border-paper/15 rounded-card p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-data text-graphite/60 dark:text-paper/60 font-bold">
            <span>You Pay (From)</span>
            <span>Balance: {fromToken.amount.toFixed(4)} {fromToken.symbol}</span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              step="0.01"
              value={amountFromStr}
              onChange={(e) => setAmountFromStr(e.target.value)}
              className="w-full bg-transparent font-data text-2xl font-bold text-graphite dark:text-paper focus:outline-none"
            />
            <select
              value={fromSymbol}
              onChange={(e) => setFromSymbol(e.target.value)}
              className="bg-transparent border border-graphite/15 dark:border-paper/15 rounded-btn px-3 py-2 font-body font-bold text-xs text-graphite dark:text-paper focus-ring"
            >
              {tokens.map((t) => (
                <option key={t.symbol} value={t.symbol} className="bg-night text-paper">
                  {t.symbol}
                </option>
              ))}
            </select>
          </div>
          <div className="text-[10px] font-data text-graphite/50 dark:text-paper/50">
            ≈ {currencySymbol}${(amountFrom * fromToken.priceUSD * currencyRate).toFixed(2)} {settings.currency}
          </div>
        </div>

        {/* Reverse Swap Button Divider */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            onClick={handleReverseTokens}
            className="p-2.5 rounded-full bg-[#A855F7] text-white border-4 border-paper dark:border-night shadow-lg hover:rotate-180 transition-transform duration-300 focus-ring"
            title="Reverse Swap Direction"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

        {/* TO Token Input Box */}
        <div className="bg-transparent border border-graphite/15 dark:border-paper/15 rounded-card p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-data text-graphite/60 dark:text-paper/60 font-bold">
            <span>You Receive (Estimated)</span>
            <span>Balance: {toToken.amount.toFixed(4)} {toToken.symbol}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-full font-data text-2xl font-bold text-graphite dark:text-paper">
              {amountTo.toFixed(4)}
            </div>
            <select
              value={toSymbol}
              onChange={(e) => setToSymbol(e.target.value)}
              className="bg-transparent border border-graphite/15 dark:border-paper/15 rounded-btn px-3 py-2 font-body font-bold text-xs text-graphite dark:text-paper focus-ring"
            >
              {tokens.map((t) => (
                <option key={t.symbol} value={t.symbol} className="bg-night text-paper">
                  {t.symbol}
                </option>
              ))}
            </select>
          </div>
          <div className="text-[10px] font-data text-graphite/50 dark:text-paper/50">
            ≈ {currencySymbol}${(amountTo * toToken.priceUSD * currencyRate).toFixed(2)} {settings.currency}
          </div>
        </div>

        {/* Slippage & Network Details Bar */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="font-display font-bold text-[10px] uppercase tracking-widest text-graphite/70 dark:text-paper/70 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#A855F7]" />
              <span>Slippage Tolerance</span>
            </label>
            <div className="flex gap-1">
              {[0.1, 0.5, 1.0].map((s) => (
                <button
                  key={s}
                  onClick={() => setSlippage(s)}
                  className={`px-2.5 py-1 rounded text-[10px] font-data font-bold transition-all ${
                    slippage === s
                      ? 'bg-[#A855F7] text-white'
                      : 'bg-transparent border border-graphite/15 dark:border-paper/15 text-graphite/60 dark:text-paper/60'
                  }`}
                >
                  {s}%
                </button>
              ))}
            </div>
          </div>

          <div className="bg-transparent border border-graphite/15 dark:border-paper/15 rounded-card p-3 font-data text-xs space-y-1">
            <div className="flex justify-between text-graphite/70 dark:text-paper/70">
              <span>Exchange Rate:</span>
              <span>1 {fromSymbol} = {(fromToken.priceUSD / toToken.priceUSD).toFixed(4)} {toSymbol}</span>
            </div>
            <div className="flex justify-between text-graphite/70 dark:text-paper/70">
              <span>Estimated Network Gas:</span>
              <span>{currencySymbol}${(feeUSD * currencyRate).toFixed(2)} {settings.currency} ({settings.network})</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          disabled={!hasSufficientBalance || amountFrom <= 0 || fromSymbol === toSymbol}
          onClick={handleExecuteSwap}
          className="w-full py-4 bg-[#A855F7] text-white font-body font-bold text-sm uppercase tracking-wider rounded-btn hover:bg-opacity-95 disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-lg focus-ring"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Execute Practice Swap</span>
        </button>
      </div>

      {/* Broadcast Overlay */}
      {txStatus && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-graphite/90 dark:bg-night/95 border border-[#A855F7]/50 rounded-card p-6 shadow-2xl text-center space-y-4">
            <SendProgress
              status={txStatus}
              isSwap
              onCancel={() => {
                cancelFn?.();
                setTxStatus(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
