import React, { useEffect, useState } from 'react';
import { useWalletStore } from '../store/useWalletStore';
import { ShapeGrid } from './ShapeGrid';
import LineSidebar from './LineSidebar';
import { CryptoTickerBar } from './CryptoTickerBar';
import { Sun, Moon, PanelLeft, PanelLeftClose, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
  const { settings, handle, address, updateSettings, simulationStarted } = useWalletStore();
  const [isNavOpen, setIsNavOpen] = useState(true);

  useEffect(() => {
    if (settings.theme === 'night') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [settings.theme]);

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'day' ? 'night' : 'day' });
  };

  const navViewKeys = ['dashboard', 'buy', 'swap', 'send', 'receive', 'news', 'activity', 'learn', 'settings'];
  const navLabels = ['Dashboard', 'Buy Crypto', 'Swap', 'Send', 'Receive', 'News', 'Activity', 'Learn', 'Settings'];
  const activeNavIdx = Math.max(0, navViewKeys.indexOf(currentView));

  return (
    <div className="min-h-screen flex flex-col bg-paper dark:bg-night text-graphite dark:text-paper transition-colors duration-200 relative overflow-x-hidden">
      {/* Live Crypto Price Ticker Bar */}
      <CryptoTickerBar />

      {/* Animated ShapeGrid Background */}
      <ShapeGrid
        speed={1.2}
        squareSize={40}
        direction="diagonal"
        borderColor={settings.theme === 'night' ? '#a3a3a3' : '#737373'}
        hoverFillColor={settings.theme === 'night' ? '#333333' : '#e5e5e5'}
        shape="square"
        hoverTrailAmount={0}
      />

      {/* Header */}
      <header className="w-full border-b border-graphite/10 dark:border-paper/10 px-4 md:px-6 py-3.5 bg-paper/80 dark:bg-night/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {simulationStarted && (
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="p-2 rounded-btn border border-graphite/15 dark:border-paper/15 hover:border-[#A855F7] bg-graphite/5 dark:bg-paper/5 hover:bg-[#A855F7]/10 text-graphite dark:text-paper hover:text-[#A855F7] transition-all flex items-center gap-2 focus-ring group"
              title={isNavOpen ? 'Hide Navigation' : 'Show Navigation'}
              aria-label="Toggle Navigation"
            >
              {isNavOpen ? (
                <PanelLeftClose className="w-5 h-5 text-[#A855F7]" />
              ) : (
                <PanelLeft className="w-5 h-5 text-graphite dark:text-paper group-hover:text-[#A855F7]" />
              )}
              <span className="font-body text-xs font-bold uppercase tracking-wider hidden sm:inline">
                {isNavOpen ? 'Hide Menu' : 'Menu'}
              </span>
            </button>
          )}

          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 group text-left focus-ring rounded"
          >
            <span className="font-display text-2xl font-bold tracking-tight text-graphite dark:text-paper group-hover:text-[#A855F7] transition-colors">
              Proto<span className="text-[#A855F7]">Wallet</span>
            </span>
          </button>

          {simulationStarted && (
            <span className="hidden sm:flex font-data text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-graphite/20 dark:border-paper/20 bg-transparent text-graphite dark:text-paper items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gain-green animate-pulse" />
              {settings.network} Network
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {simulationStarted && (
            <div className="flex flex-col text-right">
              <span className="font-data text-xs font-bold text-graphite dark:text-paper">
                {handle}
              </span>
              <span className="font-data text-[9px] text-graphite/60 dark:text-paper/50">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            </div>
          )}

          {/* Theme Selector Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-btn border border-graphite/10 dark:border-paper/10 hover:bg-graphite/5 dark:hover:bg-paper/5 focus-ring transition-colors"
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {settings.theme === 'day' ? (
              <Moon className="w-4 h-4 text-graphite" />
            ) : (
              <Sun className="w-4 h-4 text-[#A855F7]" />
            )}
          </button>
        </div>
      </header>

      {/* Main Layout Container anchored to the leftmost boundary */}
      <div className="flex-grow flex flex-col md:flex-row w-full pb-16 md:pb-0 relative z-10 bg-transparent">
        {/* Desktop Collapsible Leftmost LineSidebar Navigation */}
        {simulationStarted && (
          <aside
            className={`hidden md:block border-r border-graphite/10 dark:border-paper/10 flex-shrink-0 bg-paper/30 dark:bg-night/30 backdrop-blur-xs transition-all duration-300 ease-in-out ${
              isNavOpen ? 'w-64 pl-6 pr-4 py-8 opacity-100' : 'w-0 pl-0 pr-0 py-8 opacity-0 pointer-events-none border-r-0'
            }`}
          >
            <div className="sticky top-24 w-52">
              <div className="mb-4 pb-2 border-b border-graphite/10 dark:border-paper/10 flex items-center justify-between">
                <span className="font-display font-bold text-[10px] uppercase tracking-widest text-[#A855F7]">
                  Navigation
                </span>
                <span className="font-data text-[9px] text-graphite/50 dark:text-paper/40">
                  {activeNavIdx + 1}/{navLabels.length}
                </span>
              </div>
              <LineSidebar
                items={navLabels}
                accentColor="#A855F7"
                textColor={settings.theme === 'night' ? '#c4c4c4' : '#333333'}
                markerColor={settings.theme === 'night' ? '#6c6c6c' : '#a3a3a3'}
                showIndex
                showMarker
                proximityRadius={100}
                maxShift={24}
                falloff="smooth"
                markerLength={50}
                markerGap={0}
                tickScale={0.5}
                scaleTick
                itemGap={18}
                fontSize={1.0}
                smoothing={100}
                defaultActive={activeNavIdx}
                onItemClick={(index) => onNavigate(navViewKeys[index])}
              />
            </div>
          </aside>
        )}

        {/* Main Content Area */}
        <main className="flex-grow p-4 md:p-8 flex flex-col items-center overflow-x-hidden w-full bg-transparent transition-all">
          {children}
        </main>
      </div>

      {/* Mobile Drawer Slide-over Navigation Overlay */}
      {simulationStarted && isNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsNavOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-paper dark:bg-night h-full p-6 shadow-2xl flex flex-col justify-between border-r border-graphite/20 dark:border-paper/20 overflow-y-auto z-10">
            <div>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-graphite/10 dark:border-paper/10">
                <span className="font-display font-bold text-sm tracking-tight text-graphite dark:text-paper">
                  Proto<span className="text-[#A855F7]">Nav</span>
                </span>
                <button
                  onClick={() => setIsNavOpen(false)}
                  className="p-1.5 rounded-btn hover:bg-graphite/10 dark:hover:bg-paper/10 text-graphite dark:text-paper"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <LineSidebar
                items={navLabels}
                accentColor="#A855F7"
                textColor={settings.theme === 'night' ? '#c4c4c4' : '#333333'}
                markerColor={settings.theme === 'night' ? '#6c6c6c' : '#a3a3a3'}
                showIndex
                showMarker
                proximityRadius={100}
                maxShift={20}
                falloff="smooth"
                markerLength={40}
                markerGap={0}
                tickScale={0.5}
                scaleTick
                itemGap={16}
                fontSize={0.95}
                smoothing={100}
                defaultActive={activeNavIdx}
                onItemClick={(index) => {
                  onNavigate(navViewKeys[index]);
                  setIsNavOpen(false);
                }}
              />
            </div>

            <div className="pt-6 border-t border-graphite/10 dark:border-paper/10 text-center">
              <span className="font-data text-[10px] text-graphite/50 dark:text-paper/40">
                ProtoWallet Simulation • {settings.network}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Quick Tab Bar */}
      {simulationStarted && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-paper/90 dark:bg-night/90 backdrop-blur-md border-t border-graphite/10 dark:border-paper/10 flex items-center justify-around py-2.5 px-1 z-40 shadow-lg">
          {navViewKeys.slice(0, 5).map((viewKey, idx) => {
            const label = navLabels[idx];
            const isActive = currentView === viewKey;
            return (
              <button
                key={viewKey}
                onClick={() => onNavigate(viewKey)}
                className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded transition-all focus-ring ${
                  isActive
                    ? 'text-[#A855F7] font-bold scale-105'
                    : 'text-graphite/60 dark:text-paper/50'
                }`}
              >
                <span className="font-data text-xs">0{idx + 1}</span>
                <span className="font-body text-[10px] tracking-tight">{label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded text-[#A855F7] font-bold"
          >
            <Menu className="w-4 h-4" />
            <span className="font-body text-[10px] tracking-tight">More</span>
          </button>
        </nav>
      )}
    </div>
  );
};
