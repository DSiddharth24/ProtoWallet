import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WalletState, Token, Transaction, Lesson, Settings, TransactionStatus } from '../types';

export interface PortfolioMetrics {
  totalUSD: number;
  totalConverted: number;
  prevTotalUSD: number;
  pnlUSD: number;
  pnlConverted: number;
  pnlPercent: number;
  currencySymbol: string;
  formattedBalance: string;
  formattedPnL: string;
  isPositive: boolean;
  allocations: {
    symbol: string;
    name: string;
    amount: number;
    valUSD: number;
    valConverted: number;
    pct: number;
    change24h: number;
    color: string;
  }[];
  topGainer: { symbol: string; change24h: number };
  topHolding: { symbol: string; valConverted: number };
  activeTokenCount: number;
}

const DEFAULT_PRICES: Record<string, number> = {
  pETH: 3100,
  pUSDC: 1.0,
  pMATIC: 0.58,
  pARB: 1.15,
};

const TOKEN_COLORS: Record<string, string> = {
  pETH: '#627EEA',
  pUSDC: '#2775CA',
  pMATIC: '#8247E5',
  pARB: '#12AAFD',
};

const safeNum = (val: any, fallback = 0): number => {
  if (val === null || val === undefined) return fallback;
  const n = typeof val === 'number' ? val : parseFloat(val);
  return typeof n === 'number' && !isNaN(n) && isFinite(n) ? n : fallback;
};

const DEFAULT_TOKENS: Token[] = [
  { symbol: 'pETH', name: 'Practice ETH', amount: 2.4, priceUSD: 3100, change24h: 2.3 },
  { symbol: 'pUSDC', name: 'Practice USDC', amount: 500, priceUSD: 1.0, change24h: 0.01 },
  { symbol: 'pMATIC', name: 'Practice MATIC', amount: 300, priceUSD: 0.58, change24h: -1.2 },
  { symbol: 'pARB', name: 'Practice ARB', amount: 150, priceUSD: 1.15, change24h: 4.1 },
];

const DEFAULT_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  INR: 83.5,
  GBP: 0.78,
};

export const calculatePortfolioMetrics = (
  rawTokens: Token[],
  currency: 'USD' | 'EUR' | 'INR' | 'GBP' = 'USD',
  rates: Record<string, number> = DEFAULT_RATES
): PortfolioMetrics => {
  const tokensToUse = Array.isArray(rawTokens) && rawTokens.length > 0 ? rawTokens : DEFAULT_TOKENS;

  const sanitizedTokens = tokensToUse.map((t) => {
    const defaultAmount = DEFAULT_TOKENS.find((d) => d.symbol === t.symbol)?.amount || 0;
    const defaultPrice = DEFAULT_PRICES[t.symbol] || 1;
    return {
      ...t,
      amount: safeNum(t.amount, defaultAmount),
      priceUSD: safeNum(t.priceUSD, defaultPrice),
      change24h: safeNum(t.change24h, 0),
    };
  });

  const rawRate = rates[currency] ?? (currency === 'INR' ? 83.5 : currency === 'EUR' ? 0.92 : currency === 'GBP' ? 0.78 : 1);
  const rate = safeNum(rawRate, 1);
  const currencySymbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';

  // 1. Live Net Worth in USD
  const totalUSD = safeNum(
    sanitizedTokens.reduce((sum, t) => sum + t.amount * t.priceUSD, 0),
    0
  );
  const totalConverted = safeNum(totalUSD * rate, 0);

  // 2. Previous 24h Net Worth in USD
  const prevTotalUSD = safeNum(
    sanitizedTokens.reduce((sum, t) => {
      const changeFrac = t.change24h / 100;
      const prevPrice = changeFrac !== -1 ? t.priceUSD / (1 + changeFrac) : t.priceUSD;
      return sum + t.amount * prevPrice;
    }, 0),
    0
  );

  // 3. Unrealized PnL Dollar & Percentage
  const pnlUSD = safeNum(totalUSD - prevTotalUSD, 0);
  const pnlConverted = safeNum(pnlUSD * rate, 0);
  const rawPnlPercent = prevTotalUSD > 0 ? (pnlUSD / prevTotalUSD) * 100 : 0;
  const pnlPercent = safeNum(rawPnlPercent, 0);
  const isPositive = pnlUSD >= 0;

  // 4. Token Breakdown Allocations
  const allocations = sanitizedTokens.map((t) => {
    const valUSD = safeNum(t.amount * t.priceUSD, 0);
    const pct = safeNum(totalUSD > 0 ? (valUSD / totalUSD) * 100 : 0, 0);
    return {
      symbol: t.symbol,
      name: t.name || t.symbol,
      amount: t.amount,
      valUSD,
      valConverted: safeNum(valUSD * rate, 0),
      pct,
      change24h: t.change24h,
      color: TOKEN_COLORS[t.symbol] || '#A855F7',
    };
  });

  const sortedByGainer = [...allocations].sort((a, b) => b.change24h - a.change24h);
  const sortedByHolding = [...allocations].sort((a, b) => b.valUSD - a.valUSD);

  const formattedBalance = `${currencySymbol}${totalConverted.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const formattedPnL = `${isPositive ? '+' : '-'}${currencySymbol}${Math.abs(pnlConverted).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} (${isPositive ? '+' : ''}${pnlPercent.toFixed(2)}%)`;

  return {
    totalUSD,
    totalConverted,
    prevTotalUSD,
    pnlUSD,
    pnlConverted,
    pnlPercent,
    currencySymbol,
    formattedBalance,
    formattedPnL,
    isPositive,
    allocations,
    topGainer: {
      symbol: sortedByGainer[0]?.symbol || 'pETH',
      change24h: safeNum(sortedByGainer[0]?.change24h, 0),
    },
    topHolding: {
      symbol: sortedByHolding[0]?.symbol || 'pETH',
      valConverted: safeNum(sortedByHolding[0]?.valConverted, 0),
    },
    activeTokenCount: allocations.filter((a) => a.amount > 0).length,
  };
};

interface WalletStore extends WalletState {
  startSimulation: (handle: string) => void;
  getStarterBalance: () => void;
  sendTokens: (
    recipient: string,
    tokenSymbol: string,
    amount: number,
    feeUSD: number,
    onStatusChange?: (status: TransactionStatus) => void
  ) => { txId: string; cancel: () => void };
  swapTokens: (
    fromSymbol: string,
    toSymbol: string,
    amountFrom: number,
    amountTo: number,
    feeUSD: number,
    onStatusChange?: (status: TransactionStatus) => void
  ) => { txId: string; cancel: () => void };
  buyToken: (
    symbol: string,
    usdAmount: number,
    paymentMethod: string
  ) => void;
  completeLesson: (lessonId: string, score: number) => void;
  unlockBadge: (badgeId: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  resetSimulation: () => void;
  fetchLivePrices: () => Promise<void>;
}

const DEFAULT_LESSONS: Lesson[] = [
  { id: 'lesson-01', title: 'What is a wallet', completed: false, quizScore: null },
  { id: 'lesson-02', title: 'Recovery phrases & why they\'re never shared', completed: false, quizScore: null },
  { id: 'lesson-03', title: 'Sending & receiving', completed: false, quizScore: null },
  { id: 'lesson-04', title: 'Gas & network fees', completed: false, quizScore: null },
  { id: 'lesson-05', title: 'Swaps & DeFi basics', completed: false, quizScore: null },
  { id: 'lesson-06', title: 'Spotting scams & phishing', completed: false, quizScore: null },
];

const randomHex = (len: number) =>
  Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('');

const activeTimers: Record<string, { timeouts: any[] }> = {};

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      address: '',
      handle: '',
      tokens: DEFAULT_TOKENS,
      transactions: [],
      lessons: DEFAULT_LESSONS,
      badges: [],
      settings: { theme: 'night', currency: 'USD', network: 'Ethereum' },
      simulationStarted: false,
      currencyRates: DEFAULT_RATES,

      startSimulation: (handle) => {
        const address = `0x${randomHex(40)}`;
        const sanitized = handle.endsWith('.proto') ? handle : `${handle}.proto`;
        const currentTokens = get().tokens;

        const depositTx: Transaction = {
          id: `tx_init_${Date.now()}`,
          type: 'receive',
          counterparty: 'ProtoWallet Starter Faucet',
          tokenSymbol: 'multiple',
          amount: 0,
          status: 'Complete',
          timestamp: Date.now(),
          hash: `0x${randomHex(64)}`,
          feeUSD: 0,
          blockNumber: 19_800_000 + Math.floor(Math.random() * 5000),
        };

        const initializedTokens = DEFAULT_TOKENS.map((dt) => {
          const match = currentTokens.find((ct) => ct.symbol === dt.symbol);
          return {
            ...dt,
            priceUSD: match ? match.priceUSD : dt.priceUSD,
            change24h: match ? match.change24h : dt.change24h,
          };
        });

        set({
          address,
          handle: sanitized,
          simulationStarted: true,
          lessons: DEFAULT_LESSONS,
          badges: ['setup-complete'],
          transactions: [depositTx],
          tokens: initializedTokens,
        });
      },

      getStarterBalance: () => {
        const currentTokens = get().tokens;
        const initializedTokens = DEFAULT_TOKENS.map((dt) => {
          const match = currentTokens.find((ct) => ct.symbol === dt.symbol);
          return {
            ...dt,
            priceUSD: match ? match.priceUSD : dt.priceUSD,
            change24h: match ? match.change24h : dt.change24h,
          };
        });
        set({ tokens: initializedTokens });
      },

      buyToken: (symbol, usdAmount, paymentMethod) => {
        const { tokens } = get();
        const targetToken = tokens.find((t) => t.symbol === symbol);
        if (!targetToken) return;

        const priceUSD = safeNum(targetToken.priceUSD, DEFAULT_PRICES[symbol] || 1);
        const tokenAmountBought = safeNum(usdAmount / priceUSD, 0);

        const updatedTokens = tokens.map((t) =>
          t.symbol === symbol ? { ...t, amount: safeNum(t.amount, 0) + tokenAmountBought } : t
        );

        const buyTx: Transaction = {
          id: `tx_buy_${Date.now()}`,
          type: 'receive',
          counterparty: `Mock Buy (${paymentMethod})`,
          tokenSymbol: symbol,
          amount: tokenAmountBought,
          status: 'Complete',
          timestamp: Date.now(),
          hash: `0x${randomHex(64)}`,
          feeUSD: 0,
          blockNumber: 19_800_000 + Math.floor(Math.random() * 5000),
        };

        set((s) => ({
          tokens: updatedTokens,
          transactions: [buyTx, ...s.transactions],
          badges: s.badges.includes('first-buy') ? s.badges : [...s.badges, 'first-buy'],
        }));
      },

      sendTokens: (recipient, tokenSymbol, amount, feeUSD, onStatusChange) => {
        const txId = `tx_${Date.now()}`;
        const { tokens, settings } = get();

        const gasToken = settings.network === 'Polygon' ? 'pMATIC' : 'pETH';
        const gasTokenPrice = safeNum(tokens.find((t) => t.symbol === gasToken)?.priceUSD, 3100);
        const gasFeeNative = safeNum(feeUSD / gasTokenPrice, 0.0005);

        const updated = tokens.map((t) => {
          let a = safeNum(t.amount, 0);
          if (t.symbol === tokenSymbol) a -= amount;
          if (t.symbol === gasToken) a -= gasFeeNative;
          return { ...t, amount: Math.max(0, safeNum(a, 0)) };
        });

        const tx: Transaction = {
          id: txId,
          type: 'send',
          counterparty: recipient,
          tokenSymbol,
          amount,
          status: 'Broadcasting',
          timestamp: Date.now(),
          hash: `0x${randomHex(64)}`,
          feeUSD,
          blockNumber: 19_800_000 + Math.floor(Math.random() * 5000),
        };

        set((s) => ({ tokens: updated, transactions: [tx, ...s.transactions] }));
        onStatusChange?.('Broadcasting');

        const cancel = () => {
          activeTimers[txId]?.timeouts.forEach(clearTimeout);
          delete activeTimers[txId];
          const refunded = get().tokens.map((t) => {
            let a = safeNum(t.amount, 0);
            if (t.symbol === tokenSymbol) a += amount;
            if (t.symbol === gasToken) a += gasFeeNative;
            return { ...t, amount: safeNum(a, 0) };
          });
          set((s) => ({
            tokens: refunded,
            transactions: s.transactions.map((t) =>
              t.id === txId ? { ...t, status: 'Cancelled' as TransactionStatus } : t
            ),
          }));
          onStatusChange?.('Cancelled');
        };

        const timeouts: any[] = [];
        timeouts.push(
          setTimeout(() => {
            set((s) => ({
              transactions: s.transactions.map((t) =>
                t.id === txId ? { ...t, status: 'Confirming' as TransactionStatus } : t
              ),
            }));
            onStatusChange?.('Confirming');
            timeouts.push(
              setTimeout(() => {
                set((s) => ({
                  transactions: s.transactions.map((t) =>
                    t.id === txId ? { ...t, status: 'Complete' as TransactionStatus } : t
                  ),
                  badges: s.badges.includes('first-send') ? s.badges : [...s.badges, 'first-send'],
                }));
                onStatusChange?.('Complete');
                delete activeTimers[txId];
              }, 3000)
            );
          }, 3000)
        );
        activeTimers[txId] = { timeouts };
        return { txId, cancel };
      },

      swapTokens: (fromSymbol, toSymbol, amountFrom, amountTo, feeUSD, onStatusChange) => {
        const txId = `tx_${Date.now()}`;
        const { tokens, settings } = get();

        const gasToken = settings.network === 'Polygon' ? 'pMATIC' : 'pETH';
        const gasTokenPrice = safeNum(tokens.find((t) => t.symbol === gasToken)?.priceUSD, 3100);
        const gasFeeNative = safeNum(feeUSD / gasTokenPrice, 0.0005);

        const updated = tokens.map((t) => {
          let a = safeNum(t.amount, 0);
          if (t.symbol === fromSymbol) a -= amountFrom;
          if (t.symbol === gasToken) a -= gasFeeNative;
          return { ...t, amount: Math.max(0, safeNum(a, 0)) };
        });

        const tx: Transaction = {
          id: txId,
          type: 'swap',
          counterparty: 'DEX',
          tokenSymbol: fromSymbol,
          amount: amountFrom,
          swapToTokenSymbol: toSymbol,
          swapToAmount: amountTo,
          status: 'Broadcasting',
          timestamp: Date.now(),
          hash: `0x${randomHex(64)}`,
          feeUSD,
          blockNumber: 19_800_000 + Math.floor(Math.random() * 5000),
        };

        set((s) => ({ tokens: updated, transactions: [tx, ...s.transactions] }));
        onStatusChange?.('Broadcasting');

        const cancel = () => {
          activeTimers[txId]?.timeouts.forEach(clearTimeout);
          delete activeTimers[txId];
          const refunded = get().tokens.map((t) => {
            let a = safeNum(t.amount, 0);
            if (t.symbol === fromSymbol) a += amountFrom;
            if (t.symbol === gasToken) a += gasFeeNative;
            return { ...t, amount: safeNum(a, 0) };
          });
          set((s) => ({
            tokens: refunded,
            transactions: s.transactions.map((t) =>
              t.id === txId ? { ...t, status: 'Cancelled' as TransactionStatus } : t
            ),
          }));
          onStatusChange?.('Cancelled');
        };

        const timeouts: any[] = [];
        timeouts.push(
          setTimeout(() => {
            set((s) => ({
              transactions: s.transactions.map((t) =>
                t.id === txId ? { ...t, status: 'Confirming' as TransactionStatus } : t
              ),
            }));
            onStatusChange?.('Confirming');
            timeouts.push(
              setTimeout(() => {
                const finalTokens = get().tokens.map((t) =>
                  t.symbol === toSymbol ? { ...t, amount: safeNum(t.amount, 0) + amountTo } : t
                );
                set((s) => ({
                  tokens: finalTokens,
                  transactions: s.transactions.map((t) =>
                    t.id === txId ? { ...t, status: 'Complete' as TransactionStatus } : t
                  ),
                  badges: s.badges.includes('first-swap') ? s.badges : [...s.badges, 'first-swap'],
                }));
                onStatusChange?.('Complete');
                delete activeTimers[txId];
              }, 3000)
            );
          }, 3000)
        );
        activeTimers[txId] = { timeouts };
        return { txId, cancel };
      },

      completeLesson: (lessonId, score) => {
        set((s) => {
          const lessons = s.lessons.map((l) =>
            l.id === lessonId ? { ...l, completed: true, quizScore: score } : l
          );
          const badge = `badge-${lessonId}`;
          let badges = s.badges.includes(badge) ? s.badges : [...s.badges, badge];
          if (lessons.every((l) => l.completed) && !badges.includes('all-lessons')) {
            badges = [...badges, 'all-lessons'];
          }
          return { lessons, badges };
        });
      },

      unlockBadge: (badgeId) => {
        set((s) => ({ badges: s.badges.includes(badgeId) ? s.badges : [...s.badges, badgeId] }));
      },

      updateSettings: (newSettings) => {
        set((s) => ({ settings: { ...s.settings, ...newSettings } }));
      },

      resetSimulation: () => {
        Object.values(activeTimers).forEach((t) => t.timeouts.forEach(clearTimeout));
        Object.keys(activeTimers).forEach((k) => delete activeTimers[k]);
        set({
          address: '',
          handle: '',
          tokens: DEFAULT_TOKENS,
          transactions: [],
          lessons: DEFAULT_LESSONS,
          badges: [],
          settings: { theme: 'night', currency: 'USD', network: 'Ethereum' },
          simulationStarted: false,
        });
      },

      fetchLivePrices: async () => {
        const store = get() as any;
        const now = Date.now();
        if (store._lastFetched && now - store._lastFetched < 15000) {
          return;
        }
        store._lastFetched = now;

        try {
          const [priceRes, rateRes] = await Promise.all([
            fetch('/api/prices').catch(() => null),
            fetch('/api/rates').catch(() => null),
          ]);

          let priceData = priceRes && priceRes.ok ? await priceRes.json() : null;
          let rateData = rateRes && rateRes.ok ? await rateRes.json() : null;

          if (!priceData) {
            const fallbackRes = await fetch(
              'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,usd-coin,matic-network,arbitrum&vs_currencies=usd&include_24hr_change=true'
            );
            if (fallbackRes.ok) {
              const cg = await fallbackRes.json();
              priceData = {
                pETH: { priceUSD: cg.ethereum?.usd, change24h: cg.ethereum?.usd_24h_change },
                pUSDC: { priceUSD: cg['usd-coin']?.usd, change24h: cg['usd-coin']?.usd_24h_change },
                pMATIC: { priceUSD: cg['matic-network']?.usd, change24h: cg['matic-network']?.usd_24h_change },
                pARB: { priceUSD: cg.arbitrum?.usd, change24h: cg.arbitrum?.usd_24h_change },
              };
            }
          }

          if (priceData || rateData) {
            set((s) => ({
              tokens: priceData
                ? s.tokens.map((t) => {
                    const info = priceData[t.symbol];
                    if (info) {
                      return {
                        ...t,
                        priceUSD: safeNum(info.priceUSD, t.priceUSD),
                        change24h: safeNum(info.change24h, t.change24h),
                      };
                    }
                    return t;
                  })
                : s.tokens,
              currencyRates: rateData ? { ...DEFAULT_RATES, ...rateData } : s.currencyRates,
            }));
          }
        } catch {
          // Graceful fallback
        }
      },
    }),
    {
      name: 'protowallet-state',
      version: 6, // Bump version for rates support and price preservation
      migrate: (persistedState: any) => {
        if (!persistedState || typeof persistedState !== 'object') return persistedState;
        if (!persistedState.currencyRates) {
          persistedState.currencyRates = DEFAULT_RATES;
        }
        if (!Array.isArray(persistedState.tokens) || persistedState.tokens.length === 0) {
          persistedState.tokens = DEFAULT_TOKENS;
        } else {
          persistedState.tokens = persistedState.tokens.map((t: any) => ({
            ...t,
            amount: safeNum(t.amount, DEFAULT_TOKENS.find((d) => d.symbol === t.symbol)?.amount || 0),
            priceUSD: safeNum(t.priceUSD, DEFAULT_PRICES[t.symbol] || 1),
            change24h: safeNum(t.change24h, 0),
          }));
        }
        return persistedState;
      },
    }
  )
);
