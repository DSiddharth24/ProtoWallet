import React, { useState } from 'react';
import { useWalletStore } from '../store/useWalletStore';
import { SendChecklist, type SendChecklistItem } from '../components/SendChecklist';
import { SendProgress } from '../components/SendProgress';
import { Send as SendIcon, CheckCircle2, User, ArrowRight, ShieldCheck, Zap, ShoppingBag, AlertCircle } from 'lucide-react';
import type { TransactionStatus } from '../types';

interface SendProps {
  onNavigate: (view: string) => void;
}

export const Send: React.FC<SendProps> = ({ onNavigate }) => {
  const { tokens, settings, currencyRates, sendTokens } = useWalletStore();

  const currencyRate = currencyRates[settings.currency] || (settings.currency === 'INR' ? 83.5 : settings.currency === 'EUR' ? 0.92 : 1);
  const currencySymbol = settings.currency === 'INR' ? '₹' : settings.currency === 'EUR' ? '€' : settings.currency === 'GBP' ? '£' : '$';

  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState<string>('pETH');
  const [recipient, setRecipient] = useState<string>('alex.proto');
  const [amountStr, setAmountStr] = useState<string>('0.05');
  const [feeTier, setFeeTier] = useState<'low' | 'normal' | 'fast'>('normal');

  const [txStatus, setTxStatus] = useState<TransactionStatus | null>(null);
  const [cancelFn, setCancelFn] = useState<(() => void) | null>(null);
  const [showChecklistModal, setShowChecklistModal] = useState<boolean>(false);

  const selectedToken = tokens.find((t) => t.symbol === selectedTokenSymbol) || tokens[0];
  const numericAmount = parseFloat(amountStr) || 0;

  const feeMap = { low: 0.85, normal: 1.5, fast: 2.75 };
  const feeUSD = feeMap[feeTier];

  const hasSufficientBalance = selectedToken.amount >= numericAmount && numericAmount > 0;

  const resolvedAddress = recipient.includes('.')
    ? `0x71C...${recipient.slice(0, 3)}3a92`
    : recipient;

  const checklistItems: SendChecklistItem[] = [
    {
      id: 'addr-check',
      label: `Recipient Verified: ${recipient}`,
      isMet: true,
      explainer: `Resolved ENS handle to ${resolvedAddress}`,
    },
    {
      id: 'amount-check',
      label: `Amount: ${numericAmount} ${selectedTokenSymbol}`,
      isMet: true,
      explainer: `≈ ${currencySymbol}${(numericAmount * selectedToken.priceUSD * currencyRate).toFixed(2)} ${settings.currency}`,
    },
    {
      id: 'gas-check',
      label: `Gas Fee Tier: ${feeTier.toUpperCase()}`,
      isMet: true,
      explainer: `Paid to ${settings.network} validators (${currencySymbol}${(feeUSD * currencyRate).toFixed(2)})`,
    },
    {
      id: 'irreversible-check',
      label: 'Blockchain transactions cannot be reversed once confirmed',
      isMet: true,
      explainer: 'Confirm all details before submitting',
    },
  ];

  const handleConfirmSend = () => {
    setShowChecklistModal(false);

    const { cancel } = sendTokens(
      recipient,
      selectedTokenSymbol,
      numericAmount,
      feeUSD,
      (status) => {
        setTxStatus(status);
        if (status === 'Complete') {
          setTimeout(() => {
            onNavigate('activity');
          }, 1200);
        }
      }
    );
    setCancelFn(() => cancel);
  };

  return (
    <div className="max-w-2xl w-full flex flex-col items-center select-none text-left space-y-6 bg-transparent">
      {/* Header Banner */}
      <div className="w-full bg-transparent border border-graphite/15 dark:border-paper/15 rounded-card p-6 md:p-8 backdrop-blur-sm shadow-sm flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ember-coral/10 border border-ember-coral/30 text-ember-coral text-xs font-data font-bold uppercase tracking-wider mb-2">
            <SendIcon className="w-3.5 h-3.5" />
            Transfer Sandbox
          </div>
          <h1 className="font-display text-3xl font-bold text-graphite dark:text-paper">
            Send Practice Tokens
          </h1>
          <p className="font-body text-xs text-graphite/70 dark:text-paper/60 mt-1">
            Send simulated crypto tokens safely using ENS handles or wallet addresses.
          </p>
        </div>

        <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gain-green/10 border border-gain-green/30 text-gain-green font-data text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Zero Risk</span>
        </div>
      </div>

      {/* Main Glassmorphism Form Console */}
      <div className="w-full bg-transparent border border-graphite/15 dark:border-paper/15 rounded-card p-6 md:p-8 backdrop-blur-sm shadow-sm space-y-6">
        {/* Token Selection */}
        <div className="space-y-2">
          <label className="font-display font-bold text-xs uppercase tracking-widest text-graphite/70 dark:text-paper/70 block">
            Select Asset
          </label>
          <div className="grid grid-cols-4 gap-2">
            {tokens.map((t) => {
              const isSelected = t.symbol === selectedTokenSymbol;
              return (
                <button
                  key={t.symbol}
                  onClick={() => {
                    setSelectedTokenSymbol(t.symbol);
                    if (t.amount > 0 && parseFloat(amountStr) > t.amount) {
                      setAmountStr((t.amount * 0.5).toFixed(4));
                    }
                  }}
                  className={`py-3 px-2 rounded-card border text-center font-body text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#A855F7] border-[#A855F7] text-white shadow-md'
                      : 'bg-transparent border-graphite/15 dark:border-paper/15 text-graphite dark:text-paper hover:border-[#A855F7]'
                  }`}
                >
                  {t.symbol}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between items-center text-[11px] font-data pt-1">
            <span className="text-graphite/60 dark:text-paper/50">
              Available Balance: <strong className="text-graphite dark:text-paper">{selectedToken.amount.toFixed(4)} {selectedToken.symbol}</strong>
            </span>
            {selectedToken.amount > 0 && (
              <button
                onClick={() => setAmountStr((selectedToken.amount * 0.5).toFixed(4))}
                className="text-[#A855F7] hover:underline font-bold"
              >
                Use 50%
              </button>
            )}
          </div>
        </div>

        {/* Recipient Input */}
        <div className="space-y-2">
          <label className="font-display font-bold text-xs uppercase tracking-widest text-graphite/70 dark:text-paper/70 block">
            Recipient ENS / Address
          </label>
          <div className="relative">
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. alex.proto or 0x..."
              className="w-full pl-10 pr-4 py-3 bg-transparent border border-graphite/15 dark:border-paper/15 rounded-btn font-data text-xs text-graphite dark:text-paper focus-ring"
            />
            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-graphite/40 dark:text-paper/40" />
          </div>
          <div className="text-[10px] font-data text-[#A855F7] font-bold">
            Resolved: {resolvedAddress}
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="font-display font-bold text-xs uppercase tracking-widest text-graphite/70 dark:text-paper/70 block">
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              className="w-full pl-4 pr-16 py-3 bg-transparent border border-graphite/15 dark:border-paper/15 rounded-btn font-data text-lg font-bold text-graphite dark:text-paper focus-ring"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-data text-xs font-bold text-[#A855F7]">
              {selectedTokenSymbol}
            </span>
          </div>
          <div className="text-[11px] font-data text-graphite/60 dark:text-paper/50">
            ≈ {currencySymbol}{(numericAmount * selectedToken.priceUSD * currencyRate).toFixed(2)} {settings.currency}
          </div>
        </div>

        {/* Gas Fee Tier Selector */}
        <div className="space-y-2 border-t border-graphite/10 dark:border-paper/10 pt-4">
          <label className="font-display font-bold text-xs uppercase tracking-widest text-graphite/70 dark:text-paper/70 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>Gas Speed Tier</span>
          </label>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'low', label: `Slow (${currencySymbol}${(0.85 * currencyRate).toFixed(2)})`, time: '30s' },
              { id: 'normal', label: `Normal (${currencySymbol}${(1.50 * currencyRate).toFixed(2)})`, time: '12s' },
              { id: 'fast', label: `Fast (${currencySymbol}${(2.75 * currencyRate).toFixed(2)})`, time: '3s' },
            ].map((gt) => (
              <button
                key={gt.id}
                onClick={() => setFeeTier(gt.id as any)}
                className={`py-2 px-3 rounded-btn border text-center font-body text-xs font-bold transition-all ${
                  feeTier === gt.id
                    ? 'bg-[#A855F7]/15 border-[#A855F7] text-[#A855F7]'
                    : 'bg-transparent border border-graphite/15 dark:border-paper/15 text-graphite dark:text-paper'
                }`}
              >
                <div>{gt.label}</div>
                <div className="text-[9px] font-data text-graphite/50 dark:text-paper/50">{gt.time}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Insufficient Balance Notice & Buy CTA */}
        {!hasSufficientBalance && (
          <div className="p-3 bg-loss-red/10 border border-loss-red/30 rounded-card flex items-center justify-between gap-2 text-xs text-loss-red">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Insufficient {selectedTokenSymbol} balance ({selectedToken.amount.toFixed(4)} available)</span>
            </div>
            <button
              onClick={() => onNavigate('buy')}
              className="px-3 py-1 bg-loss-red text-white rounded-btn text-[10px] font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-1"
            >
              <ShoppingBag className="w-3 h-3" /> Buy Crypto
            </button>
          </div>
        )}

        {/* Submit Action Button */}
        <button
          disabled={!hasSufficientBalance}
          onClick={() => setShowChecklistModal(true)}
          className={`w-full py-4 font-body font-bold text-sm uppercase tracking-wider rounded-btn transition-all flex items-center justify-center gap-2 shadow-lg focus-ring ${
            hasSufficientBalance
              ? 'bg-ember-coral text-white hover:bg-opacity-95 cursor-pointer'
              : 'bg-transparent text-graphite/50 dark:text-paper/40 cursor-not-allowed border border-graphite/15 dark:border-paper/15'
          }`}
        >
          <span>Review Transfer Checklist</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Checklist Confirmation Drawer Modal */}
      {showChecklistModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-graphite/90 dark:bg-night/95 border border-[#A855F7]/50 rounded-card p-6 shadow-2xl space-y-5 text-left">
            <h3 className="font-display text-lg font-bold text-graphite dark:text-paper">
              Pre-Send Verification
            </h3>

            <SendChecklist items={checklistItems} />

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowChecklistModal(false)}
                className="flex-grow py-3 border border-graphite/20 dark:border-paper/20 text-graphite dark:text-paper font-body font-bold text-xs uppercase rounded-btn hover:bg-graphite/10 dark:hover:bg-paper/10"
              >
                Back to Edit
              </button>
              <button
                onClick={handleConfirmSend}
                className="flex-grow py-3 bg-ember-coral text-white font-body font-bold text-xs uppercase rounded-btn hover:bg-opacity-90 flex items-center justify-center gap-1.5 shadow"
              >
                <span>Submit Tx</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Transaction Broadcast Progress Overlay */}
      {txStatus && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-graphite/90 dark:bg-night/95 border border-[#A855F7]/50 rounded-card p-6 shadow-2xl space-y-4 text-center">
            <SendProgress
              status={txStatus}
              onCancel={() => {
                cancelFn?.();
                setTxStatus(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
