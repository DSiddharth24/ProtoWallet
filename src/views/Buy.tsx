import React, { useState } from 'react';
import { useWalletStore } from '../store/useWalletStore';
import { ShoppingBag, CreditCard, CheckCircle2, ArrowRight, Wallet, ShieldCheck, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface BuyProps {
  onNavigate?: (view: string) => void;
}

const CARD_GRADIENTS: Record<string, { bgClass: string; textClass: string; accentClass: string }> = {
  pETH: {
    bgClass: 'bg-gradient-to-br from-[#15181D]/80 via-[#1A2634]/80 to-[#0E9C8C]/80 backdrop-blur-md',
    textClass: 'text-paper',
    accentClass: 'bg-proto-teal',
  },
  pUSDC: {
    bgClass: 'bg-gradient-to-br from-[#1E293B]/80 via-[#334155]/80 to-[#475569]/80 backdrop-blur-md',
    textClass: 'text-paper',
    accentClass: 'bg-[#2775CA]',
  },
  pMATIC: {
    bgClass: 'bg-gradient-to-br from-[#2E1065]/80 via-[#4C1D95]/80 to-[#7C3AED]/80 backdrop-blur-md',
    textClass: 'text-paper',
    accentClass: 'bg-[#A855F7]',
  },
  pARB: {
    bgClass: 'bg-gradient-to-br from-[#1E1B4B]/80 via-[#312E81]/80 to-[#4338CA]/80 backdrop-blur-md',
    textClass: 'text-paper',
    accentClass: 'bg-[#12AAFD]',
  },
};

export const Buy: React.FC<BuyProps> = ({ onNavigate }) => {
  const { tokens, settings, currencyRates, buyToken } = useWalletStore();

  const currencyRate = currencyRates[settings.currency] || (settings.currency === 'INR' ? 83.5 : settings.currency === 'EUR' ? 0.92 : 1);
  const currencySymbol = settings.currency === 'INR' ? '₹' : settings.currency === 'EUR' ? '€' : settings.currency === 'GBP' ? '£' : '$';

  const defaultLocalAmount = Math.round(100 * currencyRate);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('pETH');
  const [localAmount, setLocalAmount] = useState<number>(defaultLocalAmount);
  const [paymentMethod, setPaymentMethod] = useState<string>('Mock Card');
  const [purchaseSuccess, setPurchaseSuccess] = useState<boolean>(false);
  const [lastBoughtInfo, setLastBoughtInfo] = useState<{ amount: number; symbol: string; localVal: number } | null>(null);

  const selectedToken = tokens.find((t) => t.symbol === selectedSymbol) || tokens[0];

  const presets = [
    Math.round(50 * currencyRate),
    Math.round(100 * currencyRate),
    Math.round(250 * currencyRate),
    Math.round(500 * currencyRate),
  ];

  const usdAmountEquivalent = localAmount / currencyRate;
  const tokenAmountToReceive = usdAmountEquivalent / selectedToken.priceUSD;

  const handleExecuteBuy = () => {
    if (localAmount <= 0) return;
    buyToken(selectedSymbol, usdAmountEquivalent, paymentMethod);
    setLastBoughtInfo({
      amount: tokenAmountToReceive,
      symbol: selectedSymbol,
      localVal: localAmount,
    });
    setPurchaseSuccess(true);
  };

  return (
    <div className="max-w-4xl w-full flex flex-col items-center select-none text-left space-y-6 bg-transparent">
      {/* Header Banner */}
      <div className="w-full bg-transparent border border-graphite/15 dark:border-paper/15 rounded-card p-6 md:p-8 backdrop-blur-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#A855F7] text-xs font-data font-bold uppercase tracking-wider mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            Instant Purchase Sandbox
          </div>
          <h1 className="font-display text-3xl font-bold text-graphite dark:text-paper">
            Buy Mock Crypto
          </h1>
          <p className="font-body text-xs text-graphite/70 dark:text-paper/60 mt-1">
            Simulate purchasing crypto assets with practice fiat money to increase your total net worth.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gain-green/10 border border-gain-green/30 text-gain-green font-data text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Zero Real Money</span>
        </div>
      </div>

      {/* Asset Selection Collectible Cards (Vertical High-Craft Collectibles) */}
      <div className="w-full space-y-3">
        <h3 className="font-display font-bold text-xs uppercase tracking-widest text-graphite/70 dark:text-paper/70">
          1. Choose Asset to Buy
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tokens.map((token) => {
            const isSelected = token.symbol === selectedSymbol;
            const style = CARD_GRADIENTS[token.symbol] || CARD_GRADIENTS.pETH;
            const isPositive = token.change24h >= 0;

            return (
              <div
                key={token.symbol}
                onClick={() => setSelectedSymbol(token.symbol)}
                className={`relative cursor-pointer rounded-card p-5 transition-all duration-300 card-lift flex flex-col justify-between aspect-[4/5] shadow-lg overflow-hidden ${style.bgClass} ${style.textClass} ${
                  isSelected
                    ? 'ring-4 ring-[#A855F7] ring-offset-2 ring-offset-night scale-[1.03] shadow-2xl z-20'
                    : 'opacity-85 hover:opacity-100 hover:scale-[1.01]'
                }`}
              >
                {/* Top Badge Strip */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-data text-xs font-bold shadow-inner">
                    {token.symbol.slice(1)}
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#A855F7] text-white flex items-center justify-center shadow">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Symbol & Name */}
                <div className="relative z-10 space-y-1 my-auto">
                  <div className="font-data text-2xl font-black tracking-wider">
                    {token.symbol}
                  </div>
                  <div className="font-body text-[11px] opacity-75 font-semibold">
                    {token.name}
                  </div>

                  {/* Accent Line */}
                  <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden flex gap-1 mt-2">
                    <div className={`h-full w-1/3 ${style.accentClass}`} />
                    <div className="h-full w-1/4 bg-white/40" />
                  </div>
                </div>

                {/* Bottom: Price & 24h Chip */}
                <div className="relative z-10 space-y-1 pt-2 border-t border-white/15">
                  <span className="font-body text-[10px] uppercase tracking-widest opacity-60 block font-semibold">
                    Unit Price
                  </span>
                  <div className="flex items-center justify-between font-data">
                    <span className="text-sm font-bold">
                      {currencySymbol}{(token.priceUSD * currencyRate) < 10
                        ? (token.priceUSD * currencyRate).toFixed(3)
                        : (token.priceUSD * currencyRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>

                    <div
                      className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded font-data ${
                        isPositive
                          ? 'bg-gain-green/25 text-gain-green border border-gain-green/40'
                          : 'bg-loss-red/25 text-loss-red border border-loss-red/40'
                      }`}
                    >
                      {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      <span>{Math.abs(token.change24h).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Purchase Configuration Panel */}
      <div className="w-full bg-transparent border border-graphite/15 dark:border-paper/15 rounded-card p-6 md:p-8 backdrop-blur-sm shadow-sm space-y-6">
        {/* Amount Input & Presets */}
        <div className="space-y-3">
          <label className="font-display font-bold text-xs uppercase tracking-widest text-graphite/70 dark:text-paper/70 block">
            2. Enter Purchase Amount ({settings.currency})
          </label>

          <div className="flex gap-2">
            {presets.map((amt) => (
              <button
                key={amt}
                onClick={() => setLocalAmount(amt)}
                className={`px-4 py-2 rounded-btn font-data text-xs font-bold transition-all focus-ring ${
                  localAmount === amt
                    ? 'bg-[#A855F7] text-white shadow'
                    : 'bg-transparent border border-graphite/15 dark:border-paper/15 text-graphite dark:text-paper hover:border-[#A855F7]'
                }`}
              >
                {currencySymbol}{amt.toLocaleString()}
              </button>
            ))}
          </div>

          <div className="relative mt-2">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-data text-lg font-bold text-graphite/50 dark:text-paper/50">
              {currencySymbol}
            </span>
            <input
              type="number"
              min="1"
              max="1000000"
              value={localAmount}
              onChange={(e) => setLocalAmount(Math.max(1, parseFloat(e.target.value) || 0))}
              className="w-full pl-10 pr-4 py-3 bg-transparent border border-graphite/15 dark:border-paper/15 rounded-btn font-data text-xl font-bold text-graphite dark:text-paper focus-ring"
            />
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-3 border-t border-graphite/10 dark:border-paper/10 pt-4">
          <label className="font-display font-bold text-xs uppercase tracking-widest text-graphite/70 dark:text-paper/70 block">
            3. Select Practice Payment Method
          </label>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'Mock Card', label: 'Mock Card', icon: CreditCard },
              { id: 'Apple Pay', label: 'Practice Apple Pay', icon: Zap },
              { id: 'Bank Transfer', label: 'Bank Transfer', icon: Wallet },
            ].map((pm) => {
              const IconComp = pm.icon;
              const isSelected = paymentMethod === pm.id;
              return (
                <button
                  key={pm.id}
                  onClick={() => setPaymentMethod(pm.id)}
                  className={`p-3 rounded-btn border text-left font-body text-xs font-bold transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#A855F7]/15 border-[#A855F7] text-[#A855F7]'
                      : 'bg-transparent border border-graphite/15 dark:border-paper/15 text-graphite dark:text-paper hover:border-[#A855F7]'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{pm.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Real-time Order Summary */}
        <div className="bg-transparent border border-graphite/15 dark:border-paper/15 rounded-card p-4 space-y-2 font-data text-xs">
          <div className="flex justify-between text-graphite/70 dark:text-paper/70">
            <span>You Pay:</span>
            <span className="font-bold text-graphite dark:text-paper">{currencySymbol}{localAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {settings.currency}</span>
          </div>
          <div className="flex justify-between text-graphite/70 dark:text-paper/70">
            <span>Exchange Rate:</span>
            <span>1 {selectedToken.symbol} = {currencySymbol}{(selectedToken.priceUSD * currencyRate).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[#A855F7] font-bold border-t border-graphite/10 dark:border-paper/10 pt-2 text-sm">
            <span>You Receive:</span>
            <span>≈ {tokenAmountToReceive.toFixed(4)} {selectedToken.symbol}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleExecuteBuy}
          className="w-full py-4 bg-[#A855F7] text-white font-body font-bold text-sm uppercase tracking-wider rounded-btn hover:bg-opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg focus-ring"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Confirm Purchase ({currencySymbol}{localAmount.toLocaleString()})</span>
        </button>
      </div>

      {/* Success Modal */}
      {purchaseSuccess && lastBoughtInfo && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-graphite/90 dark:bg-night/95 border border-gain-green/40 rounded-card p-6 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gain-green/20 text-gain-green border border-gain-green/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="font-display text-xl font-bold text-gain-green">
              Purchase Complete!
            </h3>

            <p className="font-body text-xs text-graphite/80 dark:text-paper/80 leading-relaxed">
              Successfully bought <strong className="text-graphite dark:text-paper">{lastBoughtInfo.amount.toFixed(4)} {lastBoughtInfo.symbol}</strong> for <strong className="text-graphite dark:text-paper">{currencySymbol}{lastBoughtInfo.localVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {settings.currency}</strong> using {paymentMethod}. Your portfolio balance valuation has been updated!
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setPurchaseSuccess(false)}
                className="flex-grow py-3 bg-graphite/20 dark:bg-paper/10 text-graphite dark:text-paper font-body font-bold text-xs uppercase rounded-btn hover:bg-graphite/30 dark:hover:bg-paper/20"
              >
                Buy More
              </button>
              <button
                onClick={() => {
                  setPurchaseSuccess(false);
                  if (onNavigate) onNavigate('dashboard');
                }}
                className="flex-grow py-3 bg-[#A855F7] text-white font-body font-bold text-xs uppercase rounded-btn hover:bg-opacity-90 flex items-center justify-center gap-1.5 shadow"
              >
                <span>View Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
