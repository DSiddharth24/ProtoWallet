import React, { useState } from 'react';
import { useWalletStore } from '../store/useWalletStore';
import { ChevronDown, ChevronUp, Copy, Check, Info, Send, Inbox } from 'lucide-react';
import type { Transaction } from '../types';

interface ActivityProps {
  onNavigate: (view: string) => void;
}

export const Activity: React.FC<ActivityProps> = ({ onNavigate }) => {
  const { transactions, settings, currencyRates } = useWalletStore();
  const [expandedTxId, setExpandedTxId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currencyRate = currencyRates[settings.currency] || (settings.currency === 'INR' ? 83.5 : settings.currency === 'EUR' ? 0.92 : 1);
  const currencySymbol = settings.currency === 'INR' ? '₹' : settings.currency === 'EUR' ? '€' : settings.currency === 'GBP' ? '£' : '$';

  const toggleExpand = (id: string) => {
    setExpandedTxId(expandedTxId === id ? null : id);
  };

  const handleCopyHash = (e: React.MouseEvent, hash: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const formatTimeAgo = (tx: Transaction) => {
    if (tx.status !== 'Complete' && tx.status !== 'Cancelled') {
      return `${tx.status}...`;
    }
    const diff = Date.now() - tx.timestamp;
    if (diff < 10000) return `${tx.status}, just now`;
    if (diff < 60000) return `${tx.status}, ${Math.floor(diff / 1000)}s ago`;
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${tx.status}, ${mins} min${mins > 1 ? 's' : ''} ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${tx.status}, ${hours} hr${hours > 1 ? 's' : ''} ago`;
    return `${tx.status}, ${new Date(tx.timestamp).toLocaleDateString()}`;
  };

  const buildSentence = (tx: Transaction) => {
    if (tx.type === 'receive') {
      if (tx.amount === 0) {
        return (
          <span>
            Received starter balance from <strong className="font-data text-proto-teal">{tx.counterparty}</strong>.
          </span>
        );
      }
      return (
        <span>
          Received <strong className="font-data">{tx.amount} {tx.tokenSymbol}</strong> from{' '}
          <strong className="font-data text-proto-teal">{tx.counterparty}</strong>.
        </span>
      );
    }

    if (tx.type === 'swap') {
      return (
        <span>
          Swapped <strong className="font-data">{tx.amount} {tx.tokenSymbol}</strong> for{' '}
          <strong className="font-data text-gain-green">
            {tx.swapToAmount?.toFixed(4)} {tx.swapToTokenSymbol}
          </strong>.
        </span>
      );
    }

    return (
      <span>
        Sent <strong className="font-data">{tx.amount} {tx.tokenSymbol}</strong> to{' '}
        <strong className="font-data text-proto-teal">{tx.counterparty}</strong>.
      </span>
    );
  };

  return (
    <div className="max-w-md w-full flex flex-col items-center bg-transparent">
      <div className="text-center mb-6">
        <h1 className="font-display text-3xl font-bold text-graphite dark:text-paper">
          Activity
        </h1>
        <p className="font-body text-xs text-graphite/70 dark:text-paper/60 mt-1">
          Your transaction ledger and activity history.
        </p>
      </div>

      {transactions.length === 0 ? (
        <div className="w-full bg-transparent border border-graphite/15 dark:border-paper/15 rounded-card p-8 text-center space-y-5 shadow-sm backdrop-blur-sm">
          <div className="w-14 h-14 rounded-full bg-proto-teal/10 border border-proto-teal/30 text-proto-teal flex items-center justify-center mx-auto">
            <Inbox className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold text-graphite dark:text-paper">
              No transactions yet
            </h3>
            <p className="font-body text-xs text-graphite/75 dark:text-paper/70 max-w-xs mx-auto">
              Send your first practice transaction or test a swap to see your ledger activity here.
            </p>
          </div>

          <button
            onClick={() => onNavigate('send')}
            className="px-6 py-2.5 bg-ember-coral text-white rounded-btn font-body font-bold text-xs uppercase tracking-wider hover:bg-opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mx-auto shadow focus-ring"
          >
            <Send className="w-4 h-4" />
            Send your first transaction
          </button>
        </div>
      ) : (
        <div className="w-full space-y-3">
          {transactions.map((tx) => {
            const isExpanded = expandedTxId === tx.id;
            const isComplete = tx.status === 'Complete';
            const isCancelled = tx.status === 'Cancelled';

            const statusColor = isComplete
              ? 'text-gain-green'
              : isCancelled
              ? 'text-loss-red'
              : 'text-proto-teal';

            return (
              <div
                key={tx.id}
                onClick={() => toggleExpand(tx.id)}
                className={`w-full text-left bg-transparent border ${
                  isExpanded
                    ? 'border-[#A855F7]/60 shadow-md'
                    : 'border-graphite/15 dark:border-paper/15 hover:border-[#A855F7]/40'
                } rounded-card p-4 transition-all duration-150 cursor-pointer shadow-sm backdrop-blur-sm`}
              >
                <div className="flex items-start justify-between gap-3 text-xs leading-relaxed">
                  <div className="font-body text-graphite dark:text-paper">
                    {buildSentence(tx)}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className={`font-data text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                      {formatTimeAgo(tx)}
                    </span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </div>

                {/* Progressive disclosure details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-graphite/15 dark:border-paper/15 text-[10px] font-data space-y-2 text-graphite/80 dark:text-paper/80">
                    <div className="flex justify-between items-center">
                      <span className="text-graphite/55 dark:text-paper/55 uppercase font-bold">
                        Transaction ID
                      </span>
                      <span>{tx.id}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-graphite/55 dark:text-paper/55 uppercase font-bold">
                        Block Number
                      </span>
                      <span>{tx.blockNumber}</span>
                    </div>

                    {tx.feeUSD > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-graphite/55 dark:text-paper/55 uppercase font-bold">
                          Network Fee Paid
                        </span>
                        <span>~{currencySymbol}${(tx.feeUSD * currencyRate).toFixed(2)} {settings.currency}</span>
                      </div>
                    )}

                    <div className="flex flex-col gap-1 border-t border-graphite/5 dark:border-paper/5 pt-2">
                      <span className="text-graphite/55 dark:text-paper/55 uppercase font-bold text-left mb-1">
                        Transaction Hash (Ledger Record)
                      </span>
                      <div className="flex items-center bg-transparent border border-graphite/15 dark:border-paper/15 px-2.5 py-1.5 rounded text-[9px] select-all truncate text-graphite dark:text-paper justify-between font-bold">
                        <span className="truncate mr-2">{tx.hash}</span>
                        <button
                          onClick={(e) => handleCopyHash(e, tx.hash, tx.id)}
                          className="p-1 rounded bg-[#A855F7] text-white hover:bg-opacity-90 transition-colors"
                          title="Copy hash"
                        >
                          {copiedId === tx.id ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-proto-teal/5 border border-proto-teal/15 text-[10px] leading-relaxed p-2.5 rounded text-graphite/80 dark:text-paper/90 text-left mt-2">
                      <Info className="w-4 h-4 text-proto-teal flex-shrink-0" />
                      <span>
                        On-chain hashes verify that a transaction was mined into a block.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
