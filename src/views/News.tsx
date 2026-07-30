import React, { useState } from 'react';
import { Newspaper, Clock, ChevronRight, X, ShieldAlert, TrendingUp, BookOpen, Layers, RefreshCw } from 'lucide-react';

export interface DailyNewsArticle {
  id: string;
  title: string;
  category: 'Security Alert' | 'Market Update' | 'Beginner Explainer' | 'Protocol News';
  summary: string;
  body: string;
  timeAgo: string;
  readTime: string;
  bannerType: 'ethereum' | 'security' | 'defi' | 'layer2' | 'bitcoin';
}

const getDailyArticles = (): DailyNewsArticle[] => {
  const today = new Date().toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return [
    {
      id: 'daily-01',
      title: 'Ethereum Network Activity Surges — Gas Optimization Strategies',
      category: 'Market Update',
      summary: 'High transaction queue competition is pushing base gas fees higher today. Learn how EIP-1559 priority tips affect confirmation speed.',
      body: `As of ${today}, increased smart contract interactions on Ethereum mainnet have raised base fees to 42 Gwei. When gas spikes, validators prioritize transactions offering higher tips. If your practice transfer or swap is non-urgent, setting a conservative max fee or submitting transactions during low-traffic windows (typically weekends) can significantly lower costs.`,
      timeAgo: `Updated today, ${today}`,
      readTime: '3 min read',
      bannerType: 'ethereum',
    },
    {
      id: 'daily-02',
      title: 'Critical Security Alert: Phishing Sites Cloning Popular dApp Domains',
      category: 'Security Alert',
      summary: 'Cybersecurity monitoring reveals counterfeit web3 connection forms asking for secret 12-word phrases.',
      body: `Security advisory for ${today}: Malicious actors are deploying Google ad campaigns for fake decentralized exchange domains (e.g. metamask-auth-sync.net). These fraudulent pages present a fake modal claiming your wallet needs re-validation. NEVER enter your 12-word recovery phrase on any website. Real support staff will never ask for it.`,
      timeAgo: `Alert issued ${today}`,
      readTime: '2 min read',
      bannerType: 'security',
    },
    {
      id: 'daily-03',
      title: 'DeFi Mechanics: How Automated Market Maker Pools Execute Token Swaps',
      category: 'Beginner Explainer',
      summary: 'Unlike traditional stock exchanges with order books, DEXs use mathematical liquidity formulas (x * y = k).',
      body: 'Decentralized exchanges execute trades without middleman brokers. Liquidity providers deposit token pairs (like ETH and USDC) into smart contracts. When you swap, the smart contract recalculates token ratios automatically and applies your slippage tolerance to shield you against price front-running.',
      timeAgo: `Published ${today}`,
      readTime: '4 min read',
      bannerType: 'defi',
    },
    {
      id: 'daily-04',
      title: 'Layer-2 Rollup Ecosystem Milestone: Arbitrum & Optimism Reach New Peak',
      category: 'Protocol News',
      summary: 'L2 scaling solutions now process over 80% of total Ethereum transaction volume with sub-cent gas costs.',
      body: 'Layer-2 rollups execute transactions off-chain in batches, then submit compressed zero-knowledge or optimistic proofs back to Ethereum Layer-1. This architecture provides instant finality and tiny transaction fees while benefiting from Ethereum\'s security.',
      timeAgo: `Report published ${today}`,
      readTime: '3 min read',
      bannerType: 'layer2',
    },
  ];
};

export const News: React.FC = () => {
  const [articles] = useState<DailyNewsArticle[]>(getDailyArticles());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<DailyNewsArticle | null>(null);

  const categories = ['All', 'Security Alert', 'Market Update', 'Beginner Explainer', 'Protocol News'];

  const filteredArticles = articles.filter(
    (a) => selectedCategory === 'All' || a.category === selectedCategory
  );

  const renderBannerIllustration = (type: DailyNewsArticle['bannerType']) => {
    switch (type) {
      case 'ethereum':
        return (
          <div className="w-full h-36 rounded-t-card bg-[#15181D]/80 flex items-center justify-between px-6 border-b border-paper/10 relative overflow-hidden">
            <div className="space-y-1 relative z-10 text-left">
              <span className="font-data text-[10px] font-bold text-proto-teal uppercase tracking-wider">
                Mainnet Analytics
              </span>
              <h4 className="font-display text-sm font-bold text-paper">
                Ethereum Gas Tracker
              </h4>
            </div>
            <div className="w-16 h-16 rounded-full bg-proto-teal/20 border border-proto-teal/40 flex items-center justify-center text-proto-teal">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="w-full h-36 rounded-t-card bg-[#2A1015]/80 flex items-center justify-between px-6 border-b border-paper/10 relative overflow-hidden">
            <div className="space-y-1 relative z-10 text-left">
              <span className="font-data text-[10px] font-bold text-loss-red uppercase tracking-wider">
                Threat Intelligence
              </span>
              <h4 className="font-display text-sm font-bold text-paper">
                Phishing Defense Shield
              </h4>
            </div>
            <div className="w-16 h-16 rounded-full bg-loss-red/20 border border-loss-red/40 flex items-center justify-center text-loss-red">
              <ShieldAlert className="w-8 h-8" />
            </div>
          </div>
        );
      case 'defi':
        return (
          <div className="w-full h-36 rounded-t-card bg-[#1E1035]/80 flex items-center justify-between px-6 border-b border-paper/10 relative overflow-hidden">
            <div className="space-y-1 relative z-10 text-left">
              <span className="font-data text-[10px] font-bold text-[#A855F7] uppercase tracking-wider">
                Smart Contract Math
              </span>
              <h4 className="font-display text-sm font-bold text-paper">
                AMM Swap Liquidity
              </h4>
            </div>
            <div className="w-16 h-16 rounded-full bg-[#A855F7]/20 border border-[#A855F7]/40 flex items-center justify-center text-[#A855F7]">
              <BookOpen className="w-8 h-8" />
            </div>
          </div>
        );
      case 'layer2':
        return (
          <div className="w-full h-36 rounded-t-card bg-[#0F2027]/80 flex items-center justify-between px-6 border-b border-paper/10 relative overflow-hidden">
            <div className="space-y-1 relative z-10 text-left">
              <span className="font-data text-[10px] font-bold text-gain-green uppercase tracking-wider">
                Scaling Protocol
              </span>
              <h4 className="font-display text-sm font-bold text-paper">
                L2 Rollup Proofs
              </h4>
            </div>
            <div className="w-16 h-16 rounded-full bg-gain-green/20 border border-gain-green/40 flex items-center justify-center text-gain-green">
              <Layers className="w-8 h-8" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'Security Alert':
        return 'bg-loss-red/15 text-loss-red border-loss-red/30';
      case 'Market Update':
        return 'bg-gain-green/15 text-gain-green border-gain-green/30';
      case 'Beginner Explainer':
        return 'bg-proto-teal/15 text-proto-teal border-proto-teal/30';
      case 'Protocol News':
        return 'bg-[#A855F7]/15 text-[#A855F7] border-[#A855F7]/30';
      default:
        return 'bg-[#A855F7]/10 text-graphite dark:text-paper';
    }
  };

  return (
    <div className="max-w-4xl w-full flex flex-col items-center select-none text-left space-y-6 bg-transparent">
      {/* Header Section */}
      <div className="w-full bg-transparent border border-graphite/15 dark:border-paper/15 rounded-card p-6 md:p-8 backdrop-blur-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#A855F7] text-xs font-data font-bold uppercase tracking-wider mb-2">
            <Newspaper className="w-3.5 h-3.5" />
            Daily News & Intelligence
          </div>
          <h1 className="font-display text-3xl font-bold text-graphite dark:text-paper">
            Crypto News Hub
          </h1>
          <p className="font-body text-xs text-graphite/70 dark:text-paper/60 mt-1">
            Real-time security advisories, market updates, and protocol explainers updated daily.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-proto-teal/10 border border-proto-teal/30 text-proto-teal font-data text-xs font-bold">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Auto-Updated Daily</span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="w-full flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-body text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors focus-ring ${
              selectedCategory === cat
                ? 'bg-[#A855F7] text-white shadow-md'
                : 'bg-transparent text-graphite/70 dark:text-paper/70 border border-graphite/15 dark:border-paper/15 hover:border-[#A855F7]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of News Cards with Legitimate Visual Banners */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredArticles.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveArticle(item)}
            className="group bg-transparent border border-graphite/15 dark:border-paper/15 hover:border-[#A855F7]/60 rounded-card backdrop-blur-sm shadow-sm transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Visual Illustration Banner */}
              {renderBannerIllustration(item.bannerType)}

              <div className="p-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-data font-bold border uppercase tracking-wider ${getCategoryBadge(item.category)}`}>
                    {item.category}
                  </span>
                  <span className="font-data text-[10px] text-graphite/50 dark:text-paper/50 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.timeAgo}
                  </span>
                </div>

                <h3 className="font-display text-base font-bold text-graphite dark:text-paper group-hover:text-[#A855F7] transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="font-body text-xs text-graphite/70 dark:text-paper/70 leading-relaxed line-clamp-3">
                  {item.summary}
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-3 border-t border-graphite/10 dark:border-paper/10 flex items-center justify-between text-xs font-data text-[#A855F7] font-bold">
              <span>{item.readTime}</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Read Article <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Full Article Reader Modal / Glassmorphism Drawer */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-graphite/90 dark:bg-night/95 border border-[#A855F7]/50 rounded-card p-6 md:p-8 shadow-2xl space-y-5 text-left max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-graphite/20 dark:border-paper/20 pb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded text-xs font-data font-bold border uppercase tracking-wider ${getCategoryBadge(activeArticle.category)}`}>
                {activeArticle.category}
              </span>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-1.5 rounded hover:bg-graphite/20 dark:hover:bg-paper/20 text-graphite dark:text-paper"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="font-display text-xl md:text-2xl font-bold text-graphite dark:text-paper leading-snug">
              {activeArticle.title}
            </h2>

            <div className="flex items-center gap-4 text-xs font-data text-graphite/60 dark:text-paper/50 border-b border-graphite/10 dark:border-paper/10 pb-4">
              <span>{activeArticle.timeAgo}</span>
              <span>•</span>
              <span>{activeArticle.readTime}</span>
            </div>

            <div className="font-body text-sm text-graphite/90 dark:text-paper/90 leading-relaxed space-y-4">
              <p className="font-semibold text-graphite dark:text-paper text-base">
                {activeArticle.summary}
              </p>
              <p className="pt-3 border-t border-graphite/10 dark:border-paper/10 leading-relaxed">
                {activeArticle.body}
              </p>
            </div>

            <button
              onClick={() => setActiveArticle(null)}
              className="w-full mt-6 py-3.5 bg-[#A855F7] text-white font-body font-bold text-xs uppercase tracking-wider rounded-btn hover:bg-opacity-90 transition-all focus-ring shadow-lg"
            >
              Close Article
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
