import React from 'react';
import { ExecutiveBalanceCard } from '../components/ExecutiveBalanceCard';
import { ShapeGrid } from '../components/ShapeGrid';
import { ArrowRight, ShieldAlert, Award, Zap } from 'lucide-react';

interface LandingProps {
  onStartPracticing: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStartPracticing }) => {
  return (
    <div className="max-w-4xl w-full flex flex-col items-center text-center py-6 px-4 relative space-y-8">
      {/* Animated ShapeGrid Background */}
      <ShapeGrid
        speed={0.5}
        squareSize={40}
        direction="diagonal"
        borderColor="#999"
        hoverFillColor="#222"
        shape="square"
        hoverTrailAmount={0}
      />

      {/* Hero Header */}
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#A855F7] text-xs font-data font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#A855F7] animate-pulse" />
          Interactive Practice Sandbox
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-bold text-graphite dark:text-paper leading-tight tracking-tight">
          Master Crypto Without the <span className="text-ember-coral">Risk</span>.
        </h1>

        <p className="font-body text-base md:text-lg text-graphite/80 dark:text-paper/80 leading-relaxed">
          ProtoWallet is a practice crypto wallet for complete beginners. Learn to buy, send, receive, and swap fake tokens in a zero-risk sandbox built like a real production wallet.
        </p>

        <button
          onClick={onStartPracticing}
          className="px-8 py-4 bg-ember-coral text-white rounded-btn font-body font-bold text-base tracking-wide uppercase hover:bg-opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-md focus-ring mx-auto relative z-10"
        >
          Start practicing
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Hero Interactive Executive Balance Showcase (Full Width Card Container) */}
      <div className="w-full max-w-3xl bg-transparent border border-graphite/15 dark:border-paper/15 rounded-card p-6 md:p-8 shadow-lg relative z-10 backdrop-blur-sm">
        <ExecutiveBalanceCard />
      </div>

      {/* Systematic Feature Showcase Grid (3 Columns) */}
      <div className="w-full max-w-3xl space-y-4 text-left pt-4">
        <h2 className="font-display text-xl font-bold text-graphite dark:text-paper text-center">
          Why train with ProtoWallet?
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-transparent border border-graphite/15 dark:border-paper/15 rounded-card p-5 space-y-2 backdrop-blur-sm">
            <div className="p-2 rounded-btn bg-[#A855F7]/10 text-[#A855F7] w-fit">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-body text-sm font-bold text-graphite dark:text-paper">
              Buy & Asset Sandbox
            </h4>
            <p className="font-body text-xs text-graphite/70 dark:text-paper/60 leading-normal">
              Practice buying mock assets with card hover physics and instant valuation updates.
            </p>
          </div>

          <div className="bg-transparent border border-graphite/15 dark:border-paper/15 rounded-card p-5 space-y-2 backdrop-blur-sm">
            <div className="p-2 rounded-btn bg-ember-coral/10 text-ember-coral w-fit">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h4 className="font-body text-sm font-bold text-graphite dark:text-paper">
              Spot Scams Safely
            </h4>
            <p className="font-body text-xs text-graphite/70 dark:text-paper/60 leading-normal">
              Learn to spot phishing links, fake support DMs, and malicious contract approvals before facing real funds.
            </p>
          </div>

          <div className="bg-transparent border border-graphite/15 dark:border-paper/15 rounded-card p-5 space-y-2 backdrop-blur-sm">
            <div className="p-2 rounded-btn bg-gain-green/10 text-gain-green w-fit">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-body text-sm font-bold text-graphite dark:text-paper">
              Clear Next Actions
            </h4>
            <p className="font-body text-xs text-graphite/70 dark:text-paper/60 leading-normal">
              Every pending state is explained with a timeline, cancel window, and readable contact handles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
