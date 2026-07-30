import React, { useEffect, useState } from 'react';
import { Send, AlertTriangle } from 'lucide-react';
import type { TransactionStatus } from '../types';
import { GlossaryTooltip } from './GlossaryTooltip';

interface SendProgressProps {
  status: TransactionStatus;
  onCancel: () => void;
  isSwap?: boolean;
}

export const SendProgress: React.FC<SendProgressProps> = ({
  status,
  onCancel,
  isSwap = false,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(3);

  useEffect(() => {
    if (status !== 'Broadcasting') return;
    setSecondsRemaining(3);

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  const stages: { label: TransactionStatus; desc: string }[] = [
    { label: 'Broadcasting', desc: 'Sending transaction data to network nodes...' },
    { label: 'Confirming', desc: 'Network validators are processing and verifying your transaction...' },
    { label: 'Complete', desc: 'Transaction confirmed and permanently recorded on the blockchain.' },
  ];

  const currentStageIndex = stages.findIndex((s) => s.label === status);
  const activeStage = stages[currentStageIndex] || stages[0];

  return (
    <div className="bg-graphite dark:bg-night border border-graphite/20 dark:border-paper/20 rounded-card p-6 my-6 max-w-md w-full mx-auto shadow-xl text-paper select-none text-left">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-sm text-proto-teal tracking-wider uppercase flex items-center gap-2">
          <Send className="w-4 h-4 text-proto-teal" />
          {isSwap ? 'SWAP IN PROGRESS' : 'TRANSACTION IN PROGRESS'}
        </h3>
        <span className="font-data text-xs bg-proto-teal/20 text-proto-teal px-2 py-0.5 rounded font-bold uppercase tracking-wider">
          {status}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative my-6 flex items-center justify-between">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-paper/20 z-0"></div>
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-proto-teal transition-all duration-500 z-0"
          style={{ width: `${(Math.max(0, currentStageIndex) / (stages.length - 1)) * 100}%` }}
        ></div>

        {stages.map((stage, idx) => {
          const isCompleted = idx < currentStageIndex;
          const isActive = idx === currentStageIndex;
          return (
            <div key={stage.label} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center border-2 font-data text-xs font-bold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-gain-green border-gain-green text-paper'
                    : isActive
                    ? 'bg-proto-teal border-proto-teal text-paper scale-110 shadow-lg'
                    : 'bg-graphite border-paper/30 text-paper/50'
                }`}
              >
                {idx + 1}
              </div>
              <span
                className={`absolute top-full mt-2 font-body text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 ${
                  isActive ? 'text-proto-teal' : 'text-paper/50'
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Active Stage Explanation Box */}
      <div className="bg-paper/5 border border-paper/10 rounded-card p-3.5 my-4">
        <p className="font-body text-xs font-semibold text-paper mb-1">
          {activeStage.desc}
        </p>
        <p className="font-data text-[10px] text-paper/50 italic">
          Stage {Math.max(0, currentStageIndex) + 1} of 3
        </p>
      </div>

      {/* Cancel window */}
      {status === 'Broadcasting' ? (
        <div className="space-y-3 mt-4">
          <button
            onClick={onCancel}
            className="w-full bg-loss-red text-white py-2.5 rounded-btn font-body font-bold text-xs tracking-wider uppercase hover:bg-opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 focus-ring"
          >
            Cancel Transaction ({secondsRemaining}s remaining)
          </button>
          <div className="flex items-start gap-2 bg-loss-red/10 border border-loss-red/20 rounded p-3 text-[11px] leading-relaxed text-paper/85">
            <AlertTriangle className="w-4 h-4 text-loss-red flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-loss-red block uppercase mb-0.5">Why can you cancel now?</strong>
              You can cancel because the transaction is still <strong>Broadcasting</strong> to the network. Once it moves to <strong>Confirming</strong>, <GlossaryTooltip termKey="validator">validators</GlossaryTooltip> begin writing it to the block. Real blockchain transactions <strong>cannot be cancelled</strong> after confirmation.
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2 bg-gain-green/10 border border-gain-green/20 rounded p-3 text-[11px] leading-relaxed text-paper/85 mt-4">
          <AlertTriangle className="w-4 h-4 text-gain-green flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-gain-green block uppercase mb-0.5">Transaction Confirmed</strong>
            The transaction has been broadcast and is being written to the ledger. In real crypto, on-chain actions are permanent and final.
          </div>
        </div>
      )}
    </div>
  );
};
