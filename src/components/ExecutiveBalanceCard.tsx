import React from 'react';
import { useWalletStore, calculatePortfolioMetrics } from '../store/useWalletStore';
import { TrendingUp, TrendingDown, Zap, ArrowUpRight } from 'lucide-react';

interface ExecutiveBalanceCardProps {
  balanceFormatted?: string;
  changePercent?: number;
  currencyLabel?: string;
}

export const ExecutiveBalanceCard: React.FC<ExecutiveBalanceCardProps> = () => {
  const { tokens, settings, currencyRates, updateSettings } = useWalletStore();

  // Consume authoritative portfolio metrics engine directly from backend store
  const metrics = calculatePortfolioMetrics(tokens, settings.currency, currencyRates);

  return (
    <div className="w-full flex flex-col items-center select-none text-left space-y-5">
      {/* Top Header Strip */}
      <div className="w-full flex items-center justify-between border-b border-graphite/10 dark:border-paper/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-full bg-[#A855F7]/15 text-[#A855F7]">
            <Zap className="w-4 h-4" />
          </span>
          <span className="font-display font-bold text-xs uppercase tracking-widest text-graphite/70 dark:text-paper/70">
            Portfolio & Balance Console
          </span>
        </div>

        {/* Currency Switcher Pills */}
        <div className="flex items-center gap-1.5 bg-transparent p-1 rounded-full border border-graphite/15 dark:border-paper/15">
          {(['USD', 'EUR', 'INR'] as const).map((curr) => (
            <button
              key={curr}
              onClick={() => updateSettings({ currency: curr })}
              className={`px-2.5 py-0.5 rounded-full font-data text-[10px] font-bold transition-all ${
                settings.currency === curr
                  ? 'bg-[#A855F7] text-white shadow'
                  : 'text-graphite/60 dark:text-paper/60 hover:text-graphite dark:hover:text-paper'
              }`}
            >
              {curr}
            </button>
          ))}
        </div>
      </div>

      {/* Main Balance Display */}
      <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4 py-1">
        <div>
          <span className="font-body text-[10px] font-bold uppercase tracking-widest text-graphite/50 dark:text-paper/50 block">
            Total Net Worth ({settings.currency})
          </span>
          <div className="font-data text-4xl md:text-5xl font-black text-graphite dark:text-paper tracking-tight mt-1">
            {metrics.formattedBalance}
          </div>
        </div>

        {/* 24h PnL Amount & Percentage Pill */}
        <div className="flex flex-col md:items-end gap-1">
          <div
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-btn font-data text-xs font-bold ${
              metrics.isPositive
                ? 'bg-gain-green/15 text-gain-green border border-gain-green/30'
                : 'bg-loss-red/15 text-loss-red border border-loss-red/30'
            }`}
          >
            {metrics.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{metrics.formattedPnL}</span>
          </div>
          <span className="font-data text-[9px] text-graphite/50 dark:text-paper/40">
            24-hour unrealized profit/loss
          </span>
        </div>
      </div>

      {/* Real Dynamic Asset Allocation Bar */}
      <div className="w-full bg-transparent rounded-card p-4 space-y-3 border border-graphite/15 dark:border-paper/15">
        <div className="flex justify-between items-center text-xs font-data">
          <span className="font-bold text-[#A855F7] uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#A855F7] animate-pulse" />
            Live Asset Composition
          </span>
          <span className="font-bold text-graphite dark:text-paper">
            {metrics.activeTokenCount} Active Tokens
          </span>
        </div>

        {/* Multi-color dynamic percentage bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex gap-0.5 bg-graphite/20 dark:bg-paper/20 p-0.5">
          {metrics.allocations.map((alloc) =>
            alloc.pct > 0 ? (
              <div
                key={alloc.symbol}
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${alloc.pct}%`, backgroundColor: alloc.color }}
                title={`${alloc.symbol}: ${alloc.amount.toFixed(4)} (${alloc.pct.toFixed(1)}%)`}
              />
            ) : null
          )}
        </div>

        {/* Dynamic Token Breakdown Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 font-data text-xs">
          {metrics.allocations.map((alloc) => (
            <div
              key={alloc.symbol}
              className="bg-transparent p-2 rounded-btn border border-graphite/15 dark:border-paper/15 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 font-bold text-[11px] text-graphite dark:text-paper">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: alloc.color }} />
                  {alloc.symbol}
                </span>
                <span className="text-[10px] text-[#A855F7] font-bold">
                  {alloc.pct.toFixed(0)}%
                </span>
              </div>

              <div className="mt-1 flex justify-between items-end text-[10px] text-graphite/60 dark:text-paper/50">
                <span>{alloc.amount.toFixed(2)}</span>
                <span className="font-bold text-graphite dark:text-paper">
                  {metrics.currencySymbol}{alloc.valConverted.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metric Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-3 w-full font-data text-xs">
        <div className="bg-transparent p-3 rounded-card border border-graphite/15 dark:border-paper/15 space-y-0.5">
          <span className="text-[9px] uppercase font-bold text-graphite/50 dark:text-paper/40 block">
            Largest Holding
          </span>
          <div className="font-bold text-graphite dark:text-paper flex items-center justify-between">
            <span>{metrics.topHolding.symbol}</span>
            <span className="text-[#A855F7]">
              {metrics.currencySymbol}{metrics.topHolding.valConverted.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        <div className="bg-transparent p-3 rounded-card border border-graphite/15 dark:border-paper/15 space-y-0.5">
          <span className="text-[9px] uppercase font-bold text-graphite/50 dark:text-paper/40 block">
            Top 24h Gainer
          </span>
          <div className="font-bold text-gain-green flex items-center justify-between">
            <span>{metrics.topGainer.symbol}</span>
            <span className="flex items-center text-[10px]">
              <ArrowUpRight className="w-3 h-3" />
              +{metrics.topGainer.change24h.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="bg-transparent p-3 rounded-card border border-graphite/15 dark:border-paper/15 space-y-0.5">
          <span className="text-[9px] uppercase font-bold text-graphite/50 dark:text-paper/40 block">
            Network Gas State
          </span>
          <div className="font-bold text-proto-teal flex items-center justify-between">
            <span>12 Gwei</span>
            <span className="text-[9px] bg-proto-teal/20 px-1.5 py-0.2 rounded uppercase">Optimal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
