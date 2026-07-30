import React, { useState, useEffect } from 'react';
import { useWalletStore } from '../store/useWalletStore';

import { ShieldCheck, Key, CheckCircle, RefreshCw, ArrowRight, Wallet } from 'lucide-react';

const MOCK_WORDS = [
  'anchor', 'beacon', 'breeze', 'canvas', 'harbor',
  'island', 'lantern', 'mariner', 'horizon', 'compass', 'nautical',
  'ocean', 'pebble', 'shelter', 'starlight', 'stream', 'voyage', 'wave', 'zenith'
];

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const { startSimulation, getStarterBalance } = useWalletStore();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('alex');
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);

  const [verifyIndices, setVerifyIndices] = useState<number[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [verificationError, setVerificationError] = useState(false);

  const generatePhrase = () => {
    const shuffled = [...MOCK_WORDS].sort(() => 0.5 - Math.random());
    const phrase = shuffled.slice(0, 12);
    setSeedPhrase(phrase);

    const indices: number[] = [];
    while (indices.length < 3) {
      const idx = Math.floor(Math.random() * 12);
      if (!indices.includes(idx)) indices.push(idx);
    }
    indices.sort((a, b) => a - b);
    setVerifyIndices(indices);
    setSelectedAnswers({});
    setVerificationError(false);
  };

  useEffect(() => {
    generatePhrase();
  }, []);

  const handleVerify = () => {
    const isCorrect = verifyIndices.every(
      (idx) => selectedAnswers[idx] === seedPhrase[idx]
    );

    if (isCorrect) {
      setStep(3);
    } else {
      setVerificationError(true);
    }
  };

  const handleFinish = () => {
    startSimulation(username);
    getStarterBalance();
    onComplete();
  };

  return (
    <div className="max-w-xl w-full bg-graphite/5 dark:bg-paper/5 border border-graphite/10 dark:border-paper/10 rounded-card p-6 md:p-8 shadow-sm text-left">
      {/* Header step counter */}
      <div className="flex justify-between items-center mb-6">
        <span className="font-data text-xs text-proto-teal font-bold uppercase tracking-wider">
          Step {step} of 3
        </span>
        <div className="flex gap-1.5">
          <div className={`w-3 h-1.5 rounded-full ${step >= 1 ? 'bg-proto-teal' : 'bg-graphite/10 dark:bg-paper/10'}`}></div>
          <div className={`w-3 h-1.5 rounded-full ${step >= 2 ? 'bg-proto-teal' : 'bg-graphite/10 dark:bg-paper/10'}`}></div>
          <div className={`w-3 h-1.5 rounded-full ${step >= 3 ? 'bg-proto-teal' : 'bg-graphite/10 dark:bg-paper/10'}`}></div>
        </div>
      </div>

      {/* STEP 1: Welcome */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="flex justify-center text-proto-teal">
            <div className="p-4 rounded-full bg-proto-teal/15 text-proto-teal border border-proto-teal/30">
              <Wallet className="w-12 h-12" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="font-display text-2xl font-bold text-graphite dark:text-paper">
              Welcome to ProtoWallet
            </h2>
            <p className="font-body text-sm text-graphite/75 dark:text-paper/70">
              This wallet holds fake money. You'll practice everything real wallets do, safely.
            </p>
          </div>

          <div className="space-y-2 text-left">
            <label className="font-body text-xs font-bold text-graphite dark:text-paper block">
              Choose your practice handle (ENS Name):
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, '').toLowerCase())}
                className="w-full pl-3 pr-20 py-2.5 rounded-btn border border-graphite/20 dark:border-paper/20 bg-transparent text-sm font-data"
                placeholder="alex"
                maxLength={15}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 font-data font-bold text-sm text-graphite/50 dark:text-paper/50">
                .proto
              </span>
            </div>
            <p className="text-[11px] text-graphite/60 dark:text-paper/50 mt-1">
              Handles replace complex 42-character hex addresses so sending is easy and readable!
            </p>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!username.trim()}
            className="w-full py-3 bg-ember-coral text-white rounded-btn font-body font-bold text-sm tracking-wide uppercase hover:bg-opacity-95 disabled:opacity-40 transition-all flex items-center justify-center gap-2 focus-ring shadow-sm"
          >
            Next: Recovery Phrase
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: Your practice recovery phrase */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex justify-center text-proto-teal">
            <Key className="w-12 h-12 stroke-1.5" />
          </div>

          <div className="text-center space-y-2">
            <h2 className="font-display text-xl md:text-2xl font-bold text-graphite dark:text-paper">
              Your Practice Recovery Phrase
            </h2>
            <p className="font-body text-xs text-graphite/75 dark:text-paper/70 leading-relaxed">
              A recovery phrase is a 12-word master backup for your wallet.
            </p>
          </div>

          {/* 30-second inline explainer */}
          <div className="bg-graphite/5 dark:bg-paper/5 border border-graphite/10 dark:border-paper/10 rounded p-4 text-xs space-y-2 leading-relaxed text-left">
            <div className="font-bold text-proto-teal flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Quick 30-Second Explainer
            </div>
            <ul className="list-disc pl-4 space-y-1 text-graphite/80 dark:text-paper/80">
              <li><strong>What it is:</strong> A master key that backs up all your private keys.</li>
              <li><strong>Why real ones are private:</strong> Anyone who has it can take your funds. Real websites will <em>never</em> ask for it.</li>
              <li><strong>Why this one is safe:</strong> It's 100% fake and generated locally in your browser. Feel free to screenshot it!</li>
            </ul>
          </div>

          {/* Seed Phrase Grid */}
          <div className="bg-graphite dark:bg-night border border-proto-teal/30 rounded-card p-4">
            <div className="grid grid-cols-3 gap-2">
              {seedPhrase.map((word, index) => (
                <div
                  key={index}
                  className="bg-graphite/50 border border-paper/10 rounded px-2 py-1.5 flex items-center font-data text-xs text-paper"
                >
                  <span className="text-proto-teal font-bold mr-1.5 text-[10px] w-4 text-right">
                    {index + 1}.
                  </span>
                  <span>{word}</span>
                </div>
              ))}
            </div>
            <button
              onClick={generatePhrase}
              className="mt-3 mx-auto flex items-center gap-1 text-[10px] font-data font-bold text-proto-teal hover:underline"
            >
              <RefreshCw className="w-3 h-3" /> Regenerate Phrase
            </button>
          </div>

          {/* Word Verification */}
          <div className="border-t border-graphite/10 dark:border-paper/10 pt-5 space-y-4 text-left">
            <h3 className="font-body text-xs font-bold text-graphite dark:text-paper uppercase tracking-wider">
              Confirm Backup Verification
            </h3>
            <p className="font-body text-[11px] text-graphite/75 dark:text-paper/70">
              Select the correct words from your phrase to confirm you saved it:
            </p>

            <div className="space-y-3">
              {verifyIndices.map((wordIndex) => {
                const correctAnswer = seedPhrase[wordIndex];
                const distractors = MOCK_WORDS.filter((w) => w !== correctAnswer)
                  .sort(() => 0.5 - Math.random())
                  .slice(0, 2);
                const options = [correctAnswer, ...distractors].sort();

                return (
                  <div key={wordIndex} className="flex flex-col gap-1.5">
                    <span className="font-data text-xs font-bold text-graphite dark:text-paper">
                      What is word #{wordIndex + 1}?
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {options.map((opt) => {
                        const isSelected = selectedAnswers[wordIndex] === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => {
                              setSelectedAnswers((prev) => ({ ...prev, [wordIndex]: opt }));
                              setVerificationError(false);
                            }}
                            className={`py-1.5 px-2 text-xs font-data border rounded transition-all ${
                              isSelected
                                ? 'bg-proto-teal border-proto-teal text-white font-bold shadow-sm'
                                : 'bg-transparent border-graphite/20 dark:border-paper/20 text-graphite dark:text-paper hover:bg-graphite/5 dark:hover:bg-paper/5'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {verificationError && (
              <p className="text-loss-red font-bold text-xs">
                Selection mismatch! Please check your recovery phrase above and select the matching words.
              </p>
            )}
          </div>

          <button
            onClick={handleVerify}
            disabled={Object.keys(selectedAnswers).length < 3}
            className="w-full py-3 bg-ember-coral text-white rounded-btn font-body font-bold text-sm tracking-wide uppercase hover:bg-opacity-95 disabled:opacity-40 transition-all flex items-center justify-center gap-2 focus-ring shadow-sm"
          >
            Verify & Proceed
          </button>
        </div>
      )}

      {/* STEP 3: You're set up */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="flex justify-center text-gain-green">
            <CheckCircle className="w-16 h-16 stroke-1.5 animate-bounce" />
          </div>

          <div className="text-center space-y-2">
            <h2 className="font-display text-2xl font-bold text-graphite dark:text-paper">
              You're set up!
            </h2>
            <p className="font-body text-sm text-graphite/75 dark:text-paper/70">
              Your practice wallet is ready for takeoff.
            </p>
          </div>

          <div className="bg-gain-green/5 border border-gain-green/20 rounded p-4 text-xs space-y-2 leading-relaxed text-left">
            <span className="font-bold text-gain-green block uppercase tracking-wider">
              Setup Summary
            </span>
            <p>✔ Practice address created</p>
            <p>✔ Handle registered: <strong>{username}.proto</strong></p>
            <p>✔ Backup phrase verified</p>
          </div>

          <button
            onClick={handleFinish}
            className="w-full py-3.5 bg-ember-coral text-white rounded-btn font-body font-bold text-sm tracking-wide uppercase hover:bg-opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 focus-ring shadow-md"
          >
            Get your starter balance
          </button>
        </div>
      )}
    </div>
  );
};
