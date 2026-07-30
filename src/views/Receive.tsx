import React, { useState } from 'react';
import { useWalletStore } from '../store/useWalletStore';
import { Copy, Check, Mail } from 'lucide-react';
import { GlossaryTooltip } from '../components/GlossaryTooltip';

export const Receive: React.FC = () => {
  const { address, handle } = useWalletStore();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-md w-full flex flex-col items-center bg-transparent">
      <div className="text-center mb-6">
        <h1 className="font-display text-3xl font-bold text-graphite dark:text-paper">
          Receive
        </h1>
        <p className="font-body text-xs text-graphite/70 dark:text-paper/60 mt-1">
          Share your address or handle to receive practice tokens.
        </p>
      </div>

      <div className="relative w-full bg-transparent border border-graphite/15 dark:border-paper/15 rounded-card p-6 md:p-8 flex flex-col items-center text-center shadow-sm backdrop-blur-sm overflow-hidden">
        <div className="relative z-10 w-full flex flex-col items-center">
          {/* ENS Handle */}
          <div className="bg-proto-teal/10 border border-proto-teal/30 rounded px-3 py-1 text-xs font-data font-bold text-proto-teal mb-5">
            {handle}
          </div>

          {/* Handcrafted SVG QR Code */}
          <div className="bg-white p-4 rounded-card border border-graphite/10 shadow-inner mb-6">
            <svg width="160" height="160" viewBox="0 0 29 29" className="text-graphite">
              <rect x="0" y="0" width="29" height="29" fill="white" />
              <rect x="1" y="1" width="7" height="7" fill="currentColor" />
              <rect x="2" y="2" width="5" height="5" fill="white" />
              <rect x="3" y="3" width="3" height="3" fill="currentColor" />
              <rect x="21" y="1" width="7" height="7" fill="currentColor" />
              <rect x="22" y="2" width="5" height="5" fill="white" />
              <rect x="23" y="3" width="3" height="3" fill="currentColor" />
              <rect x="1" y="21" width="7" height="7" fill="currentColor" />
              <rect x="2" y="22" width="5" height="5" fill="white" />
              <rect x="3" y="23" width="3" height="3" fill="currentColor" />

              <rect x="9" y="1" width="2" height="1" fill="currentColor" />
              <rect x="12" y="1" width="1" height="2" fill="currentColor" />
              <rect x="15" y="1" width="2" height="2" fill="currentColor" />
              <rect x="18" y="1" width="1" height="1" fill="currentColor" />
              <rect x="9" y="3" width="1" height="3" fill="currentColor" />
              <rect x="11" y="4" width="3" height="1" fill="currentColor" />
              <rect x="15" y="4" width="1" height="3" fill="currentColor" />
              <rect x="17" y="3" width="2" height="1" fill="currentColor" />
              <rect x="9" y="7" width="3" height="2" fill="currentColor" />
              <rect x="13" y="8" width="2" height="1" fill="currentColor" />
              <rect x="16" y="7" width="1" height="4" fill="currentColor" />
              <rect x="1" y="9" width="2" height="1" fill="currentColor" />
              <rect x="4" y="9" width="3" height="2" fill="currentColor" />
              <rect x="8" y="10" width="1" height="1" fill="currentColor" />
              <rect x="10" y="11" width="2" height="3" fill="currentColor" />
              <rect x="13" y="12" width="3" height="1" fill="currentColor" />
              <rect x="17" y="11" width="1" height="2" fill="currentColor" />
              <rect x="19" y="10" width="3" height="3" fill="currentColor" />
              <rect x="23" y="9" width="2" height="1" fill="currentColor" />
              <rect x="26" y="10" width="2" height="2" fill="currentColor" />
              <rect x="1" y="13" width="4" height="2" fill="currentColor" />
              <rect x="6" y="14" width="1" height="1" fill="currentColor" />
              <rect x="8" y="13" width="2" height="1" fill="currentColor" />
              <rect x="13" y="14" width="1" height="3" fill="currentColor" />
              <rect x="15" y="15" width="2" height="1" fill="currentColor" />
              <rect x="18" y="14" width="3" height="1" fill="currentColor" />
              <rect x="22" y="13" width="1" height="3" fill="currentColor" />
              <rect x="24" y="14" width="2" height="1" fill="currentColor" />
              <rect x="1" y="17" width="1" height="3" fill="currentColor" />
              <rect x="3" y="18" width="2" height="1" fill="currentColor" />
              <rect x="6" y="17" width="3" height="2" fill="currentColor" />
              <rect x="10" y="18" width="2" height="1" fill="currentColor" />
              <rect x="14" y="18" width="1" height="1" fill="currentColor" />
              <rect x="16" y="17" width="4" height="2" fill="currentColor" />
              <rect x="21" y="18" width="2" height="3" fill="currentColor" />
              <rect x="24" y="17" width="4" height="1" fill="currentColor" />
              <rect x="9" y="21" width="1" height="4" fill="currentColor" />
              <rect x="11" y="22" width="3" height="2" fill="currentColor" />
              <rect x="15" y="21" width="2" height="1" fill="currentColor" />
              <rect x="18" y="22" width="2" height="2" fill="currentColor" />
              <rect x="24" y="22" width="3" height="1" fill="currentColor" />
              <rect x="15" y="24" width="3" height="3" fill="currentColor" />
              <rect x="19" y="25" width="1" height="1" fill="currentColor" />
              <rect x="21" y="25" width="4" height="2" fill="currentColor" />
              <rect x="26" y="24" width="2" height="3" fill="currentColor" />
            </svg>
          </div>

          {/* Copyable Address */}
          <div className="w-full space-y-2 mb-6 text-left">
            <span className="font-body text-xs font-bold text-graphite/60 dark:text-paper/60 uppercase tracking-widest block">
              Public <GlossaryTooltip termKey="wallet address">Wallet Address</GlossaryTooltip>
            </span>
            <div className="flex items-center bg-transparent border border-graphite/15 dark:border-paper/15 rounded-btn p-3 w-full">
              <span className="font-data text-xs text-graphite dark:text-paper select-all truncate flex-grow">
                {address}
              </span>
              <button
                onClick={copyToClipboard}
                className="ml-2 p-1.5 rounded bg-[#A855F7] text-white hover:bg-opacity-90 focus-ring transition-colors"
                title="Copy address"
              >
                {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copied && (
              <span className="text-[10px] text-gain-green font-bold uppercase tracking-wider block text-right animate-pulse">
                ✔ Copied to clipboard
              </span>
            )}
          </div>

          {/* Mailbox Analogy Note */}
          <div className="border-t border-graphite/10 dark:border-paper/10 pt-5 text-left w-full">
            <div className="flex gap-2.5 bg-proto-teal/10 border border-proto-teal/20 rounded p-4 text-xs text-graphite dark:text-paper leading-relaxed">
              <Mail className="w-5 h-5 text-proto-teal flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-proto-teal block uppercase mb-0.5">Mailbox Analogy</strong>
                Anyone can see this address — it's like a <strong>mailbox number</strong>, not a password. People use it to send you funds, but they cannot access your wallet without your <GlossaryTooltip termKey="private key">private key</GlossaryTooltip>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
