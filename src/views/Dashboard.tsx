import React, { useState } from 'react';
import { useWalletStore } from '../store/useWalletStore';
import { ExecutiveBalanceCard } from '../components/ExecutiveBalanceCard';
import { TokenCollection } from '../components/TokenCollection';
import MagicBento, { BentoItem } from '../components/MagicBento';
import { Send, QrCode, ArrowLeftRight, Lightbulb, ShieldAlert } from 'lucide-react';
import { GlossaryTooltip } from '../components/GlossaryTooltip';

const ROTATING_TIPS = [
  "Never share your 12-word recovery phrase. Real support staff or services will NEVER ask for it.",
  "Gas fees rise when many transactions compete for block space. Pay higher gas for faster confirmation.",
  "Unlike bank transfers, blockchain transactions cannot be reversed once confirmed on-chain.",
  "Slippage limits protect your trade. If market prices slip past your allowance, the smart contract aborts the swap.",
  "Phishing scams copy real websites to steal keys. Always verify domain names before connecting your wallet.",
  "Smart contracts are public, automated programs that execute swaps directly without needing central brokers.",
  "ENS handles (like alex.proto) map readable names to 42-character hex addresses to prevent manual typos.",
];

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { settings, currencyRates } = useWalletStore();
  const [activeTip] = useState(() => ROTATING_TIPS[Math.floor(Math.random() * ROTATING_TIPS.length)]);

  const isSecurityTip =
    activeTip.toLowerCase().includes('recovery phrase') ||
    activeTip.toLowerCase().includes('phishing') ||
    activeTip.toLowerCase().includes('scam');

  const currencyRate = currencyRates[settings.currency] || (settings.currency === 'INR' ? 83.5 : settings.currency === 'EUR' ? 0.92 : 1);
  const currencySymbol = settings.currency === 'INR' ? '₹' : settings.currency === 'EUR' ? '€' : settings.currency === 'GBP' ? '£' : '$';

  return (
    <div className="max-w-5xl w-full px-2 flex flex-col items-center">
      {/* MagicBento Grid Container */}
      <MagicBento
        textAutoHide={true}
        enableStars
        enableSpotlight
        enableBorderGlow={true}
        enableTilt={false}
        enableMagnetism={false}
        clickEffect
        spotlightRadius={400}
        particleCount={12}
        glowColor="168, 85, 247"
        disableAnimations={false}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 items-stretch">
          {/* Tile 1: Executive Balance Card */}
          <BentoItem span="md:col-span-1 flex flex-col justify-between p-5">
            <ExecutiveBalanceCard />
          </BentoItem>

          {/* Tile 2: Prominent Token Card Collection Deck (Front & Center) */}
          <BentoItem span="md:col-span-1 flex flex-col justify-center p-5">
            <TokenCollection
              currencySymbol={currencySymbol}
              currencyRate={currencyRate}
            />
          </BentoItem>

          {/* Tile 3: Quick Action Buttons */}
          <BentoItem span="md:col-span-1 flex flex-col justify-center p-4">
            <span className="font-display font-bold text-[10px] uppercase tracking-widest text-graphite/60 dark:text-paper/60 mb-2 block text-left">
              Quick Actions
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onNavigate('send')}
                className="group card-lift bg-ember-coral text-white py-2.5 px-2 rounded-btn font-body font-bold text-xs tracking-wider uppercase flex flex-col items-center gap-1 shadow-md focus-ring"
              >
                <Send className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                Send
              </button>

              <button
                onClick={() => onNavigate('receive')}
                className="group card-lift bg-[#A855F7]/15 border-2 border-[#A855F7] text-[#A855F7] py-2.5 px-2 rounded-btn font-body font-bold text-xs tracking-wider uppercase flex flex-col items-center gap-1 shadow-sm focus-ring"
              >
                <QrCode className="w-4 h-4 text-[#A855F7] group-hover:scale-90 transition-transform duration-200" />
                Receive
              </button>

              <button
                onClick={() => onNavigate('swap')}
                className="group card-lift bg-gradient-to-br from-[#A855F7] to-ember-coral text-white py-2.5 px-2 rounded-btn font-body font-bold text-xs tracking-wider uppercase flex flex-col items-center gap-1 shadow-md focus-ring"
              >
                <ArrowLeftRight className="w-4 h-4 text-white group-hover:rotate-180 transition-transform duration-300" />
                Swap
              </button>
            </div>
          </BentoItem>

          {/* Tile 4: Mentor Tip Box */}
          <BentoItem span="md:col-span-1 flex items-center gap-3 p-4">
            <div className="flex-shrink-0 p-2 rounded-btn bg-[#A855F7]/15 text-[#A855F7]">
              {isSecurityTip ? (
                <ShieldAlert className="w-5 h-5 text-loss-red" />
              ) : (
                <Lightbulb className="w-5 h-5 text-[#A855F7]" />
              )}
            </div>
            <div className="space-y-1 text-left">
              <span className="font-display font-bold text-[#A855F7] uppercase tracking-wider text-[10px] flex items-center justify-between">
                <span>Mentor Tip</span>
                {isSecurityTip && (
                  <span className="bg-loss-red/20 text-loss-red px-1.5 py-0.2 rounded text-[9px] font-bold">
                    SECURITY WARNING
                  </span>
                )}
              </span>
              <p className="font-body text-xs text-graphite/80 dark:text-paper/85 leading-normal line-clamp-2">
                {activeTip}
              </p>
            </div>
          </BentoItem>
        </div>
      </MagicBento>

      {/* Inline Jargon Trigger */}
      <div className="text-[10px] text-graphite/60 dark:text-paper/50 text-center mt-4">
        Learn what a <GlossaryTooltip termKey="gas fee">Gas Fee</GlossaryTooltip> or <GlossaryTooltip termKey="slippage">Slippage</GlossaryTooltip> is inline.
      </div>
    </div>
  );
};
