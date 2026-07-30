import React, { useState } from 'react';
import { useWalletStore } from '../store/useWalletStore';
import { Settings as SettingsIcon, Sun, Moon, DollarSign, Globe, RefreshCw, ShieldAlert } from 'lucide-react';

interface SettingsProps {
  onReset: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onReset }) => {
  const { settings, updateSettings, resetSimulation } = useWalletStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleResetConfirm = () => {
    resetSimulation();
    onReset();
  };

  return (
    <div className="max-w-2xl w-full flex flex-col items-center select-none text-left space-y-6 bg-transparent">
      {/* Header Banner */}
      <div className="w-full bg-transparent border border-graphite/15 dark:border-paper/15 rounded-card p-6 md:p-8 backdrop-blur-sm shadow-sm flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#A855F7] text-xs font-data font-bold uppercase tracking-wider mb-2">
            <SettingsIcon className="w-3.5 h-3.5" />
            Executive Control Panel
          </div>
          <h1 className="font-display text-3xl font-bold text-graphite dark:text-paper">
            Settings & Preferences
          </h1>
          <p className="font-body text-xs text-graphite/70 dark:text-paper/60 mt-1">
            Customize wallet theme, display currency, test network environments, and reset simulation state.
          </p>
        </div>
      </div>

      {/* Main Glassmorphism Form Console */}
      <div className="w-full bg-transparent border border-graphite/15 dark:border-paper/15 rounded-card p-6 md:p-8 backdrop-blur-sm shadow-sm space-y-6">
        {/* Appearance Theme Selector */}
        <div className="space-y-3">
          <label className="font-display font-bold text-xs uppercase tracking-widest text-graphite/70 dark:text-paper/70 flex items-center gap-2">
            <Sun className="w-4 h-4 text-[#A855F7]" />
            <span>Appearance Theme</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => updateSettings({ theme: 'day' })}
              className={`p-4 rounded-btn border text-left font-body text-xs font-bold transition-all flex items-center gap-3 ${
                settings.theme === 'day'
                  ? 'bg-[#A855F7]/15 border-[#A855F7] text-[#A855F7]'
                  : 'bg-transparent border border-graphite/15 dark:border-paper/15 text-graphite dark:text-paper hover:border-[#A855F7]'
              }`}
            >
              <Sun className="w-4 h-4" />
              <div>
                <div>Day Mode</div>
                <div className="text-[10px] font-data font-normal opacity-60">Clean high-contrast light</div>
              </div>
            </button>

            <button
              onClick={() => updateSettings({ theme: 'night' })}
              className={`p-4 rounded-btn border text-left font-body text-xs font-bold transition-all flex items-center gap-3 ${
                settings.theme === 'night'
                  ? 'bg-[#A855F7]/15 border-[#A855F7] text-[#A855F7]'
                  : 'bg-transparent border border-graphite/15 dark:border-paper/15 text-graphite dark:text-paper hover:border-[#A855F7]'
              }`}
            >
              <Moon className="w-4 h-4" />
              <div>
                <div>Night Mode</div>
                <div className="text-[10px] font-data font-normal opacity-60">Executive glass dark</div>
              </div>
            </button>
          </div>
        </div>

        {/* Display Currency */}
        <div className="space-y-3 border-t border-graphite/10 dark:border-paper/10 pt-4">
          <label className="font-display font-bold text-xs uppercase tracking-widest text-graphite/70 dark:text-paper/70 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#A855F7]" />
            <span>Display Currency</span>
          </label>

          <div className="grid grid-cols-3 gap-3 font-data text-xs font-bold">
            {(['USD', 'EUR', 'INR'] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => updateSettings({ currency: curr })}
                className={`py-3 px-2 rounded-btn border text-center transition-all ${
                  settings.currency === curr
                    ? 'bg-[#A855F7] border-[#A855F7] text-white shadow'
                    : 'bg-transparent border border-graphite/15 dark:border-paper/15 text-graphite dark:text-paper hover:border-[#A855F7]'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        {/* Test Network Environment */}
        <div className="space-y-3 border-t border-graphite/10 dark:border-paper/10 pt-4">
          <label className="font-display font-bold text-xs uppercase tracking-widest text-graphite/70 dark:text-paper/70 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#A855F7]" />
            <span>Test Network Environment</span>
          </label>

          <div className="grid grid-cols-3 gap-3 font-data text-xs font-bold">
            {(['Ethereum', 'Polygon', 'Arbitrum'] as const).map((net) => (
              <button
                key={net}
                onClick={() => updateSettings({ network: net })}
                className={`py-3 px-2 rounded-btn border text-center transition-all ${
                  settings.network === net
                    ? 'bg-[#A855F7] border-[#A855F7] text-white shadow'
                    : 'bg-transparent border border-graphite/15 dark:border-paper/15 text-graphite dark:text-paper hover:border-[#A855F7]'
                }`}
              >
                {net}
              </button>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="space-y-3 border-t border-graphite/10 dark:border-paper/10 pt-4">
          <label className="font-display font-bold text-xs uppercase tracking-widest text-loss-red flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            <span>Reset Simulation</span>
          </label>
          <p className="font-body text-xs text-graphite/60 dark:text-paper/50">
            Wipe all practice transactions, custom ENS handles, and token balances to restart onboarding.
          </p>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-3.5 bg-loss-red/15 text-loss-red border border-loss-red/30 rounded-btn font-body font-bold text-xs uppercase tracking-wider hover:bg-loss-red hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset All Simulation State</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Drawer Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-graphite/90 dark:bg-night/95 border border-loss-red/50 rounded-card p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-loss-red/20 text-loss-red border border-loss-red/40 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h3 className="font-display text-lg font-bold text-loss-red">
              Reset Simulation State?
            </h3>

            <p className="font-body text-xs text-graphite/80 dark:text-paper/80 leading-relaxed">
              This action will reset your practice wallet back to zero and return you to the onboarding landing page.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-grow py-3 border border-graphite/20 dark:border-paper/20 text-graphite dark:text-paper font-body font-bold text-xs uppercase rounded-btn hover:bg-graphite/10 dark:hover:bg-paper/10"
              >
                Cancel
              </button>
              <button
                onClick={handleResetConfirm}
                className="flex-grow py-3 bg-loss-red text-white font-body font-bold text-xs uppercase rounded-btn hover:bg-opacity-90 flex items-center justify-center gap-1.5 shadow"
              >
                <span>Yes, Reset Wallet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
