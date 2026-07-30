export interface Token {
  symbol: string;
  name: string;
  amount: number;
  priceUSD: number;
  change24h: number;
}

export type TransactionType = 'send' | 'receive' | 'swap';
export type TransactionStatus = 'Broadcasting' | 'Confirming' | 'Complete' | 'Cancelled';

export interface Transaction {
  id: string;
  type: TransactionType;
  counterparty: string;
  tokenSymbol: string;
  amount: number;
  status: TransactionStatus;
  timestamp: number;
  hash: string;
  feeUSD: number;
  blockNumber: number;
  swapToTokenSymbol?: string;
  swapToAmount?: number;
}

export interface Lesson {
  id: string;
  title: string;
  completed: boolean;
  quizScore: number | null;
}

export interface Settings {
  theme: 'day' | 'night';
  currency: 'USD' | 'INR' | 'EUR';
  network: 'Ethereum' | 'Polygon' | 'Arbitrum';
}

export interface WalletState {
  address: string;
  handle: string;
  tokens: Token[];
  transactions: Transaction[];
  lessons: Lesson[];
  badges: string[];
  settings: Settings;
  simulationStarted: boolean;
  currencyRates: Record<string, number>;
}
