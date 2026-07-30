import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useWalletStore } from '../store/useWalletStore';

interface TickerItem {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  iconColor: string;
}

const INITIAL_TICKERS: TickerItem[] = [
  { symbol: 'ETH', name: 'Ethereum', price: 3245.8, change24h: 2.4, iconColor: '#627EEA' },
  { symbol: 'BTC', name: 'Bitcoin', price: 64820.5, change24h: 1.8, iconColor: '#F7931A' },
  { symbol: 'USDC', name: 'USD Coin', price: 1.0, change24h: 0.01, iconColor: '#2775CA' },
  { symbol: 'MATIC', name: 'Polygon', price: 0.88, change24h: -1.2, iconColor: '#8247E5' },
  { symbol: 'ARB', name: 'Arbitrum', price: 1.18, change24h: 4.5, iconColor: '#12AAFD' },
  { symbol: 'SOL', name: 'Solana', price: 148.3, change24h: 3.1, iconColor: '#14F195' },
];

export const CryptoTickerBar: React.FC = () => {
  const { settings, currencyRates } = useWalletStore();
  const [tickers, setTickers] = useState<TickerItem[]>(INITIAL_TICKERS);

  const currencyRate = currencyRates[settings.currency] || (settings.currency === 'INR' ? 83.5 : settings.currency === 'EUR' ? 0.92 : 1);
  const currencySymbol = settings.currency === 'INR' ? '₹' : settings.currency === 'EUR' ? '€' : settings.currency === 'GBP' ? '£' : '$';

  // Subtle live price fluctuation simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setTickers((prev) =>
        prev.map((t) => {
          const delta = (Math.random() - 0.48) * (t.price * 0.002);
          const newPrice = Math.max(0.01, t.price + delta);
          return {
            ...t,
            price: newPrice,
          };
        })
      );
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-transparent border-b border-graphite/10 dark:border-paper/10 py-1.5 px-4 overflow-hidden select-none z-40 backdrop-blur-sm">
      <div className="flex items-center gap-8 whitespace-nowrap animate-grid-drift" style={{ animationDuration: '45s' }}>
        <div className="flex items-center gap-2 font-data text-[10px] uppercase font-bold text-[#A855F7]">
          <span className="w-2 h-2 rounded-full bg-[#A855F7] animate-pulse" />
          <span>Live Market Feed</span>
        </div>

        {tickers.map((t) => {
          const isPositive = t.change24h >= 0;
          const convertedPrice = t.price * currencyRate;
          return (
            <div key={t.symbol} className="inline-flex items-center gap-2 text-xs font-data">
              <span className="font-bold text-graphite dark:text-paper">{t.symbol}</span>
              <span className="text-graphite/70 dark:text-paper/70 font-mono">
                {currencySymbol}{convertedPrice < 10 ? convertedPrice.toFixed(3) : convertedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`inline-flex items-center text-[10px] font-bold ${isPositive ? 'text-gain-green' : 'text-loss-red'}`}>
                {isPositive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                {isPositive ? '+' : ''}{t.change24h.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
