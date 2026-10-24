import React from 'react';
import { Cpu, Palette, Share2, Tv, Sparkles, Wrench, CheckCircle } from 'lucide-react';
import { ThemeId, THEMES } from '../types/theme';

export type AppView =
  | 'hero'
  | 'cpu'
  | 'gpu'
  | 'motherboard'
  | 'ram'
  | 'storage'
  | 'cooler'
  | 'results'
  | 'games'
  | 'compare'
  | 'about';

interface NavigationProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  currentTheme: ThemeId;
  onOpenThemeSelector: () => void;
  tvMode: boolean;
  onToggleTvMode: () => void;
  onShareBuild: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onNavigate,
  currentTheme,
  onOpenThemeSelector,
  tvMode,
  onToggleTvMode,
  onShareBuild,
}) => {
  const activeTheme = THEMES[currentTheme];

  const isWizardActive = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooler'].includes(currentView);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#090b10]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all group-hover:scale-105"
              style={{
                backgroundColor: `${activeTheme.primaryHex}15`,
                border: `1px solid ${activeTheme.primaryHex}30`,
                color: activeTheme.primaryHex,
              }}
            >
              <Cpu className="w-4 h-4" />
            </div>
            <span
              className={`font-display text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r ${activeTheme.headingGradient} bg-clip-text text-transparent group-hover:opacity-95 transition-opacity`}
            >
              What Can My PC Run?
            </span>
          </button>
        </div>

        {/* Primary Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 shrink-0 text-xs font-medium">
          <button
            onClick={() => onNavigate('hero')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              currentView === 'hero'
                ? 'bg-white/[0.08] text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => onNavigate('cpu')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              isWizardActive
                ? 'bg-white/[0.08] text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" style={{ color: activeTheme.primaryHex }} />
            Build PC
          </button>

          <button
            onClick={() => onNavigate('results')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'results'
                ? 'bg-white/[0.08] text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Results
          </button>

          <button
            onClick={() => onNavigate('games')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              currentView === 'games'
                ? 'bg-white/[0.08] text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            Game Library
          </button>

          <button
            onClick={() => onNavigate('about')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              currentView === 'about'
                ? 'bg-white/[0.08] text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            About
          </button>
        </nav>

        {/* Right Tools (Theme, Share, TV) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Selector */}
          <button
            onClick={onOpenThemeSelector}
            title={`Active Theme: ${activeTheme.name}. Click to switch theme.`}
            className="px-2.5 py-1.5 rounded-lg border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.06] text-slate-300 text-xs font-medium flex items-center gap-2 transition-all btn-tactile"
          >
            <div className="flex -space-x-1 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeTheme.primaryHex }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeTheme.secondaryHex }} />
            </div>
            <span className="hidden sm:inline font-mono text-[11px]">{activeTheme.name}</span>
            <Palette className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Share Link */}
          <button
            onClick={onShareBuild}
            title="Share current PC build link"
            className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.07] text-slate-400 hover:text-white hover:border-white/[0.14] transition-colors btn-tactile"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          {/* TV / 10-Foot Mode */}
          <button
            onClick={onToggleTvMode}
            title={tvMode ? 'Disable TV Mode' : 'Enable TV Mode (Large UI)'}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              tvMode
                ? 'bg-white/[0.1] border-white/25 text-white shadow-sm'
                : 'bg-white/[0.02] border-white/[0.07] text-slate-400 hover:text-white'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{tvMode ? 'TV Mode' : 'TV Mode'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
