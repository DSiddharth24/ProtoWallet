import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;

// Cache for live crypto prices and fiat rates
let priceCache: { timestamp: number; data: any } | null = null;
let rateCache: { timestamp: number; data: any } | null = null;
const CACHE_TTL_MS = 30000; // 30 seconds cache

const DEFAULT_PRICES = {
  pETH: { priceUSD: 3245.8, change24h: 2.4 },
  pUSDC: { priceUSD: 1.0, change24h: 0.01 },
  pMATIC: { priceUSD: 0.88, change24h: -1.2 },
  pARB: { priceUSD: 1.18, change24h: 4.5 },
  BTC: { priceUSD: 64820.5, change24h: 1.8 },
  SOL: { priceUSD: 148.3, change24h: 3.1 },
};

const DEFAULT_RATES = {
  USD: 1.0,
  EUR: 0.92,
  INR: 83.5,
  GBP: 0.78,
};

async function startServer() {
  const app = express();
  app.use(express.json());

  // API 1: Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
  });

  // API 2: Live Crypto Prices
  app.get('/api/prices', async (_req, res) => {
    const now = Date.now();
    if (priceCache && now - priceCache.timestamp < CACHE_TTL_MS) {
      return res.json(priceCache.data);
    }

    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,usd-coin,matic-network,arbitrum,bitcoin,solana&vs_currencies=usd&include_24hr_change=true',
        { headers: { Accept: 'application/json' } }
      );

      if (!response.ok) throw new Error(`CoinGecko status ${response.status}`);
      const data = await response.json();

      const prices = {
        pETH: {
          priceUSD: data.ethereum?.usd ?? DEFAULT_PRICES.pETH.priceUSD,
          change24h: data.ethereum?.usd_24h_change ?? DEFAULT_PRICES.pETH.change24h,
        },
        pUSDC: {
          priceUSD: data['usd-coin']?.usd ?? DEFAULT_PRICES.pUSDC.priceUSD,
          change24h: data['usd-coin']?.usd_24h_change ?? DEFAULT_PRICES.pUSDC.change24h,
        },
        pMATIC: {
          priceUSD: data['matic-network']?.usd ?? DEFAULT_PRICES.pMATIC.priceUSD,
          change24h: data['matic-network']?.usd_24h_change ?? DEFAULT_PRICES.pMATIC.change24h,
        },
        pARB: {
          priceUSD: data.arbitrum?.usd ?? DEFAULT_PRICES.pARB.priceUSD,
          change24h: data.arbitrum?.usd_24h_change ?? DEFAULT_PRICES.pARB.change24h,
        },
        BTC: {
          priceUSD: data.bitcoin?.usd ?? DEFAULT_PRICES.BTC.priceUSD,
          change24h: data.bitcoin?.usd_24h_change ?? DEFAULT_PRICES.BTC.change24h,
        },
        SOL: {
          priceUSD: data.solana?.usd ?? DEFAULT_PRICES.SOL.priceUSD,
          change24h: data.solana?.usd_24h_change ?? DEFAULT_PRICES.SOL.change24h,
        },
      };

      priceCache = { timestamp: now, data: prices };
      return res.json(prices);
    } catch (err) {
      console.warn('Fallback to default crypto prices due to fetch error:', err);
      return res.json(DEFAULT_PRICES);
    }
  });

  // API 3: Live Fiat Exchange Rates relative to USD
  app.get('/api/rates', async (_req, res) => {
    const now = Date.now();
    if (rateCache && now - rateCache.timestamp < CACHE_TTL_MS * 10) {
      return res.json(rateCache.data);
    }

    try {
      const response = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!response.ok) throw new Error('Fiat rate API error');
      const data = await response.json();

      const rates = {
        USD: 1.0,
        EUR: data.rates?.EUR ?? DEFAULT_RATES.EUR,
        INR: data.rates?.INR ?? DEFAULT_RATES.INR,
        GBP: data.rates?.GBP ?? DEFAULT_RATES.GBP,
      };

      rateCache = { timestamp: now, data: rates };
      return res.json(rates);
    } catch {
      return res.json(DEFAULT_RATES);
    }
  });

  // Vite development vs production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ProtoWallet full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
