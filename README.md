# ⚡ ProtoWallet — Next-Gen Web3 Wallet Simulator & Asset Console

ProtoWallet is a modern, interactive Web3 wallet simulator and crypto asset management console. Designed with executive aesthetics, fluid card deck animations, dynamic market tickers, and a built-in transaction engine, ProtoWallet delivers an intuitive playground for exploring decentralized asset management, token swaps, security best practices, and multi-network analytics.

🌐 **Live Demo**: [https://proto-wallet-1.vercel.app/#/](https://proto-wallet-1.vercel.app/#/)

---

## ✨ Features

### 💎 1. Interactive Token Card Collection
- **Auto-Swapping Card Deck**: Layered 3D token cards with smooth transitions, interactive card-flipping for technical token specs, and manual slide controls.
- **Supported Assets**: Native support for Proto Ethereum (`pETH`), Proto USD Coin (`pUSDC`), Proto Polygon (`pMATIC`), and Proto Arbitrum (`pARB`).
- **Real-Time Performance**: Live 24h price trend indicators, native balances, and currency-converted valuations.

### 📊 2. Executive Balance & Portfolio Dashboard
- **Multi-Currency Conversion**: Instant real-time conversion across USD ($), EUR (€), GBP (£), and INR (₹).
- **Yield & Network Metrics**: Live calculated portfolio return, active network indicators (Ethereum Mainnet, Arbitrum, Polygon, Sepolia Testnet), and quick address copying.
- **Recent Activity Feed**: Real-time transaction history tracking incoming/outgoing transfers and token swaps.

### 🔄 3. Simulated Blockchain Operations
- **Buy Crypto Gateway**: Simulated fiat-to-crypto checkout with instant balance updates and card/bank payment options.
- **DEX Token Swap**: Decentralized token exchange engine with customizable slippage tolerance, gas estimation, and price impact calculation.
- **Send & Receive**: Address validation, ENS handle support (`@user.eth`), QR code generation, and transfer verification.

### 📰 4. Crypto Ticker & Market News
- **Live Marquee Ticker**: Real-time streaming marquee showcasing major asset prices, 24h percentage changes, and volume trends.
- **News Aggregator**: Curated Web3 news feed with sentiment tags (Bullish, Neutral, Security) and direct source links.

### 🎓 5. Interactive Web3 Learn Hub
- **Security & Gas Modules**: Educational guides covering private key management, phishing prevention, gas optimization, and DeFi yield mechanics.
- **Interactive Quizzes**: Knowledge checks to test Web3 comprehension with instant feedback.

### 🎨 6. Executive UI & Custom Themes
- **Day & Night Themes**: Seamless switching between clean high-contrast Day Mode and executive dark-glass Night Mode.
- **Kinetic Background Canvas**: Interactive geometric shape grid background with customizable animation speeds and responsive hover highlights.
- **Collapsible Navigation**: Smooth collapsible sidebar and drawer navigation for compact and expanded layouts.

---

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 with custom glassmorphism and typography
- **Animations**: Framer Motion (`motion/react`) & Lucide React Icons
- **State Management**: Zustand with persistent storage
- **Linter & Tools**: Oxlint

---

## 🚀 Deployment & Installation

### Live Application
Experience the live application online at [https://proto-wallet-1.vercel.app/#/](https://proto-wallet-1.vercel.app/#/).

### Building from Source

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd protowallet
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
├── public/                 # Static assets and icons
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── CardSwap.tsx            # 3D auto-swapping card stack component
│   │   ├── CryptoTickerBar.tsx     # Streaming crypto market ticker
│   │   ├── ExecutiveBalanceCard.tsx# Portfolio balance card
│   │   ├── Layout.tsx              # Main application container & header
│   │   ├── LineSidebar.tsx         # Proximity-animated vertical sidebar
│   │   ├── ShapeGrid.tsx           # Kinetic canvas grid background
│   │   ├── TokenCard.tsx           # Individual token card component
│   │   └── TokenCollection.tsx     # Token card deck wrapper
│   ├── store/              # Global application state (Zustand)
│   │   └── useWalletStore.ts
│   ├── views/              # View screens
│   │   ├── Activity.tsx            # Transaction history log
│   │   ├── BuyCrypto.tsx           # Fiat-to-crypto gateway
│   │   ├── Dashboard.tsx           # Primary executive overview
│   │   ├── Landing.tsx             # Onboarding & simulation trigger
│   │   ├── Learn.tsx               # Web3 educational hub
│   │   ├── News.tsx                # Crypto news feed
│   │   ├── Receive.tsx             # Deposit & QR code generator
│   │   ├── Send.tsx                # Asset transfer form
│   │   ├── Settings.tsx           # Theme, currency, and network settings
│   │   └── Swap.tsx                # DEX swap interface
│   ├── App.tsx             # Main routing & layout controller
│   ├── main.tsx            # Entry point
│   └── index.css           # Global Tailwind CSS definitions
├── package.json
├── vite.config.ts
└── README.md
```

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
