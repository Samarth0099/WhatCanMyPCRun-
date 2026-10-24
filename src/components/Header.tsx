import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Cpu, 
  GitCompare, 
  Share2, 
  Sparkles, 
  BookOpen, 
  Palette, 
  Hammer, 
  ChevronDown, 
  LogOut, 
  UserCheck, 
  UserPlus, 
  Monitor,
  Menu,
  X,
  Home,
  Zap,
  Shield,
  Layers,
  Gamepad2
} from 'lucide-react';
import { PREBUILT_SYSTEMS } from '../data/otherHardware';
import { SystemBuild } from '../types/hardware';
import { ThemeId, THEMES } from '../types/theme';
import { BuilderStep } from './BuilderProgressNav';
import { authService, GamerUser } from '../services/authService';

interface HeaderProps {
  onSelectPrebuilt: (build: SystemBuild) => void;
  onOpenCompare: () => void;
  onOpenSeoLookup: () => void;
  onShareBuild: () => void;
  tvMode: boolean;
  onToggleTvMode: () => void;
  currentTheme: ThemeId;
  onSelectTheme?: (theme: ThemeId) => void;
  onOpenThemeSelector: () => void;
  activeTab: 'games' | 'target_fps';
  onSelectTab: (tab: 'games' | 'target_fps') => void;
  currentStep?: BuilderStep;
  onSelectStep?: (step: BuilderStep) => void;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectPrebuilt,
  onOpenCompare,
  onOpenSeoLookup,
  onShareBuild,
  tvMode,
  onToggleTvMode,
  currentTheme,
  onSelectTheme,
  onOpenThemeSelector,
  activeTab,
  onSelectTab,
  currentStep,
  onSelectStep,
  onOpenAuth,
}) => {
  const activeTheme = THEMES[currentTheme] || THEMES.mocha_mousse;
  const [currentUser, setCurrentUser] = useState<GamerUser | null>(() => authService.getCurrentUser());
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(authService.getCurrentUser());
    };
    window.addEventListener('auth-state-changed', handleAuthChange);
    return () => window.removeEventListener('auth-state-changed', handleAuthChange);
  }, []);

  const handleNavigateToAuth = (mode: 'login' | 'signup' = 'login') => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
    if (onSelectStep) {
      onSelectStep('auth');
    }
    if (onOpenAuth) {
      onOpenAuth(mode);
    }
    // Scroll to top
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isBuilderActive = currentStep && ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooler'].includes(currentStep);

  return (
    <header
      className="sticky top-0 z-40 w-full border-b backdrop-blur-xl shadow-lg transition-colors duration-300"
      style={{
        backgroundColor: `${activeTheme.bgHex}f2`,
        borderColor: `${activeTheme.primaryHex}25`,
      }}
    >
      {/* ================= TOP PRIMARY BAR ================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 h-14 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Zone 1: Wordmark & Logo */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            onClick={() => onSelectStep ? onSelectStep('hero') : undefined}
            className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer text-left bg-transparent border-none p-0 focus:outline-none"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all group-hover:scale-105 border shadow-sm relative overflow-hidden"
              style={{
                backgroundColor: 'rgba(16, 22, 34, 0.95)',
                borderColor: `${activeTheme.primaryHex}50`,
                color: activeTheme.primaryHex,
                boxShadow: `0 0 14px ${activeTheme.primaryHex}25`,
              }}
            >
              <Cpu className="w-4 h-4" />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.1] to-transparent pointer-events-none" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`font-display text-sm sm:text-base md:text-lg font-black tracking-tight bg-gradient-to-r ${activeTheme.headingGradient} bg-clip-text text-transparent group-hover:opacity-90 transition-opacity uppercase whitespace-nowrap`}>
                  RIGLAB
                </span>
                <span 
                  className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase font-bold"
                  style={{ color: activeTheme.primaryHex, borderColor: `${activeTheme.primaryHex}40` }}
                >
                  PRO
                </span>
              </div>
              <div className="hidden lg:block text-[9px] font-mono tracking-widest text-slate-500 uppercase -mt-0.5">
                PRECISION FPS & HARDWARE LAB
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Desktop & Wide Tablet: xl:flex) */}
        <nav className="hidden xl:flex items-center gap-1 shrink-0 text-xs font-mono">
          <button
            onClick={() => onSelectStep && onSelectStep('cpu')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer relative ${
              isBuilderActive
                ? 'bg-white/[0.08] text-white font-bold border border-cyan-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Hammer className="w-3.5 h-3.5" style={{ color: activeTheme.primaryHex }} />
            <span>PC BUILDER</span>
            {isBuilderActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 diode-pulse" />
            )}
          </button>

          <button
            onClick={() => {
              if (onSelectStep) onSelectStep('results');
              onSelectTab('games');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentStep === 'results' && activeTab === 'games'
                ? 'bg-white/[0.08] text-white font-bold border border-cyan-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>FPS ESTIMATOR</span>
            {currentStep === 'results' && activeTab === 'games' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </button>

          <button
            onClick={() => {
              if (onSelectStep) onSelectStep('results');
              onSelectTab('target_fps');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentStep === 'results' && activeTab === 'target_fps'
                ? 'bg-white/[0.08] text-white font-bold border border-violet-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: activeTheme.secondaryHex }} />
            <span>TARGET FPS</span>
          </button>

          {/* Games Library Navigation Link */}
          <button
            onClick={() => {
              if (onSelectStep) {
                onSelectStep('compare');
              } else {
                onOpenCompare();
              }
            }}
            className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentStep === 'compare'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>GAMES LIBRARY</span>
            {currentStep === 'compare' && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 diode-pulse" />
            )}
          </button>

          <button
            onClick={onOpenSeoLookup}
            className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>GPU VS GAME</span>
          </button>

          {/* Direct Login Page Navigation Button */}
          <button
            onClick={() => handleNavigateToAuth('login')}
            className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentStep === 'auth'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/50 shadow-sm'
                : 'text-slate-400 hover:text-cyan-300 hover:bg-white/[0.04]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>LOGIN / SIGN UP</span>
            {currentStep === 'auth' && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 diode-pulse" />
            )}
          </button>
        </nav>

        {/* Zone 3: Actions & System Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Quick Prebuilts Selector Dropdown (Hidden on small mobile) */}
          <div className="relative group hidden md:block">
            <select
              aria-label="Load Prebuilt System"
              onChange={(e) => {
                const target = PREBUILT_SYSTEMS.find((p) => p.name === e.target.value);
                if (target) onSelectPrebuilt(target.build);
              }}
              className="px-2 py-1.5 rounded-lg border border-white/[0.08] bg-[#121622] hover:bg-[#181f2f] text-slate-300 text-xs font-mono transition-all cursor-pointer focus:outline-none focus:border-cyan-400/50 max-w-[140px] truncate"
              defaultValue=""
            >
              <option value="" disabled>Prebuilt Rig ▾</option>
              {PREBUILT_SYSTEMS.map((system) => (
                <option key={system.name} value={system.name} className="bg-[#0b0e16] text-slate-200">
                  {system.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Theme Switcher for user's requested palettes */}
          <div className="hidden lg:flex items-center gap-1 p-0.5 rounded-xl border border-white/[0.08] bg-black/40">
            <button
              onClick={() => onSelectTheme?.('mocha_mousse')}
              title="Mocha Mousse (Pantone's Color of the Year)"
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTheme === 'mocha_mousse'
                  ? 'bg-[#A47764] text-[#F8EDE3] shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#A47764] border border-white/40 shadow-xs" />
              <span>Mocha Mousse</span>
            </button>
            <button
              onClick={() => onSelectTheme?.('teal_cream')}
              title="Teal and Cream"
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTheme === 'teal_cream'
                  ? 'bg-[#14B8A6] text-[#061316] shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#14B8A6] border border-white/40 shadow-xs" />
              <span>Teal & Cream</span>
            </button>
            <button
              onClick={() => onSelectTheme?.('deep_purple_orange')}
              title="Deep Purple with Orange Accents"
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTheme === 'deep_purple_orange'
                  ? 'bg-[#A855F7] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#F97316] border border-white/40 shadow-xs" />
              <span>Purple & Orange</span>
            </button>
          </div>

          {/* Theme Selector Trigger */}
          <button
            onClick={onOpenThemeSelector}
            title={`Active Theme: ${activeTheme.name}. Click to view palette details.`}
            className="px-2 py-1.5 rounded-lg border border-white/[0.08] hover:bg-white/[0.06] text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            style={{ backgroundColor: `${activeTheme.cardBgHex}cc` }}
          >
            <div className="flex -space-x-1 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeTheme.primaryHex }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeTheme.secondaryHex }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeTheme.accentHex }} />
            </div>
            <span className="hidden sm:inline font-mono text-[11px] text-slate-200">{activeTheme.name.split('(')[0].trim()}</span>
            <Palette className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* TV Mode Toggle (Desktop only) */}
          <button
            onClick={onToggleTvMode}
            title={tvMode ? 'Exit TV Mode (T)' : '10-Foot Living Room TV Mode (T)'}
            className={`hidden sm:flex p-1.5 rounded-lg border transition-all cursor-pointer ${
              tvMode
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
          </button>

          {/* Share Rig Link */}
          <button
            onClick={onShareBuild}
            title="Share Rig URL"
            className="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          {/* User Account Button OR Login Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-1.5 sm:gap-2 p-1 pl-1.5 sm:pl-2 rounded-xl border border-white/[0.1] bg-[#101524] hover:bg-[#161d31] transition-all cursor-pointer"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-[11px] font-bold text-white leading-tight font-mono truncate max-w-[85px]">
                    {currentUser.gamerTag}
                  </div>
                  <div className="text-[9px] font-mono text-cyan-400 leading-none">
                    LVL {currentUser.level}
                  </div>
                </div>
                <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-cyan-400/50 shadow-sm shadow-cyan-500/20">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-black" />
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsProfileOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/[0.1] bg-[#0c101a] p-3 shadow-2xl z-50 backdrop-blur-xl animate-fade-in">
                    <div className="flex items-center gap-3 p-2 border-b border-white/[0.08] mb-2">
                      <div className="w-9 h-9 rounded-xl overflow-hidden border border-cyan-400/40">
                        <img
                          src={currentUser.avatarUrl}
                          alt={currentUser.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-white truncate font-mono">
                          {currentUser.name}
                        </div>
                        <div className="text-[10px] text-cyan-400 font-mono tracking-wider">
                          {currentUser.rank}
                        </div>
                        <div className="text-[9px] text-slate-500 truncate font-mono">
                          {currentUser.email}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs font-mono text-slate-300">
                      <div className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">SAVED RIGS</span>
                        <span className="text-white font-bold">{currentUser.savedBuilds.length} Builds</span>
                      </div>
                      <div className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">GAMER LEVEL</span>
                        <span className="text-cyan-400 font-bold">Level {currentUser.level}</span>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-white/[0.08] space-y-1">
                      <button
                        onClick={() => handleNavigateToAuth('login')}
                        className="w-full py-1.5 px-2.5 rounded-lg hover:bg-white/[0.05] text-slate-300 text-xs font-mono flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Manage Account / Switch</span>
                      </button>
                      <button
                        onClick={() => {
                          authService.logout();
                          setIsProfileOpen(false);
                        }}
                        className="w-full py-1.5 px-2.5 rounded-lg hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 text-xs font-mono flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out Session</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => handleNavigateToAuth('login')}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold font-mono tracking-wide transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer border shadow-sm"
              style={{
                backgroundColor: 'rgba(66, 232, 213, 0.14)',
                borderColor: `${activeTheme.primaryHex}60`,
                color: activeTheme.primaryHex,
                boxShadow: `0 0 12px ${activeTheme.primaryHex}25`,
              }}
              title="Open Login & Sign Up Page"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap font-bold">LOG IN</span>
            </button>
          )}

          {/* TABLET & MOBILE HAMBURGER BUTTON */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl border border-white/[0.1] bg-[#111726] hover:bg-[#182136] text-slate-200 transition-all cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4 text-cyan-400" />
            ) : (
              <Menu className="w-4 h-4 text-slate-300" />
            )}
          </button>

        </div>
      </div>

      {/* ================= TABLET & MOBILE SUB-NAV PILL BAR ================= */}
      {/* This bar is ALWAYS VISIBLE on tablets and mobile screens so navigation is never lost! */}
      <div className="xl:hidden w-full border-t border-white/[0.08] bg-[#090d18]/95 backdrop-blur-xl px-2.5 sm:px-4 py-2 overflow-x-auto scrollbar-none flex items-center justify-start sm:justify-center gap-1.5 z-30">
        
        {/* PC Builder */}
        <button
          onClick={() => onSelectStep && onSelectStep('cpu')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            isBuilderActive
              ? 'bg-white/[0.12] text-white font-bold border border-cyan-400/50 shadow-sm'
              : 'text-slate-300 hover:text-white bg-white/[0.03] border border-white/[0.05]'
          }`}
        >
          <Hammer className="w-3 h-3" style={{ color: activeTheme.primaryHex }} />
          <span>PC BUILDER</span>
          {isBuilderActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 diode-pulse" />
          )}
        </button>

        {/* FPS Estimator */}
        <button
          onClick={() => {
            if (onSelectStep) onSelectStep('results');
            onSelectTab('games');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            currentStep === 'results' && activeTab === 'games'
              ? 'bg-white/[0.12] text-white font-bold border border-cyan-400/50 shadow-sm'
              : 'text-slate-300 hover:text-white bg-white/[0.03] border border-white/[0.05]'
          }`}
        >
          <Monitor className="w-3 h-3 text-emerald-400" />
          <span>FPS ESTIMATOR</span>
        </button>

        {/* Games Library */}
        <button
          onClick={() => {
            if (onSelectStep) onSelectStep('compare');
            else onOpenCompare();
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            currentStep === 'compare'
              ? 'bg-white/[0.12] text-white font-bold border border-cyan-400/50 shadow-sm'
              : 'text-slate-300 hover:text-white bg-white/[0.03] border border-white/[0.05]'
          }`}
        >
          <Gamepad2 className="w-3 h-3 text-cyan-400" />
          <span>GAMES LIBRARY</span>
        </button>

        {/* Target FPS */}
        <button
          onClick={() => {
            if (onSelectStep) onSelectStep('results');
            onSelectTab('target_fps');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            currentStep === 'results' && activeTab === 'target_fps'
              ? 'bg-white/[0.12] text-white font-bold border border-violet-400/50 shadow-sm'
              : 'text-slate-300 hover:text-white bg-white/[0.03] border border-white/[0.05]'
          }`}
        >
          <Sparkles className="w-3 h-3 text-violet-400" />
          <span>TARGET FPS</span>
        </button>

        {/* GPU vs Game */}
        <button
          onClick={onOpenSeoLookup}
          className="px-2.5 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer text-slate-300 hover:text-white bg-white/[0.03] border border-white/[0.05]"
        >
          <BookOpen className="w-3 h-3 text-amber-400" />
          <span>GPU VS GAME</span>
        </button>

        {/* PROMINENT LOGIN PAGE BUTTON FOR TABLET / MOBILE */}
        <button
          onClick={() => handleNavigateToAuth('login')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border ${
            currentStep === 'auth'
              ? 'bg-cyan-500/25 text-white font-bold border-cyan-400 shadow-md shadow-cyan-500/20'
              : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-400/30'
          }`}
          title="Open Login & Sign Up Page"
        >
          <UserPlus className="w-3 h-3 text-cyan-400" />
          <span className="font-bold">LOGIN / SIGN UP</span>
          {currentStep === 'auth' && (
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 diode-pulse" />
          )}
        </button>

      </div>

      {/* ================= TABLET & MOBILE FULL CYBER DRAWER ================= */}
      {isMobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-0 top-[105px] z-50 bg-[#07090e]/98 backdrop-blur-2xl border-b border-white/[0.1] shadow-2xl p-4 sm:p-6 animate-fade-in max-h-[calc(100vh-105px)] overflow-y-auto">
          <div className="max-w-md mx-auto space-y-4">
            
            {/* Header info card */}
            <div className="p-3 rounded-xl bg-[#101626] border border-white/[0.08] flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">PLATFORM ACCESS</div>
                <div className="text-sm font-bold text-white font-heading">
                  {currentUser ? `Welcome, ${currentUser.gamerTag}` : 'Gamer Command Center'}
                </div>
              </div>
              <button
                onClick={() => handleNavigateToAuth('login')}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{currentUser ? 'My Profile' : 'Sign In Now'}</span>
              </button>
            </div>

            {/* Navigation options list */}
            <div className="space-y-1.5">
              <button
                onClick={() => {
                  if (onSelectStep) onSelectStep('hero');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full p-3 rounded-xl text-left font-mono text-xs flex items-center justify-between transition-all cursor-pointer ${
                  currentStep === 'hero' ? 'bg-white/[0.1] text-white border border-white/[0.15]' : 'bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Home className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="font-bold">HOME DASHBOARD</div>
                    <div className="text-[10px] text-slate-500 font-sans">Overview & 3D Interactive Rig</div>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 -rotate-90 text-slate-600" />
              </button>

              <button
                onClick={() => {
                  if (onSelectStep) onSelectStep('cpu');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full p-3 rounded-xl text-left font-mono text-xs flex items-center justify-between transition-all cursor-pointer ${
                  isBuilderActive ? 'bg-white/[0.1] text-white border border-cyan-400/40' : 'bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Hammer className="w-4 h-4" style={{ color: activeTheme.primaryHex }} />
                  <div>
                    <div className="font-bold">PC BUILDER</div>
                    <div className="text-[10px] text-slate-500 font-sans">Step-by-step custom PC configurator</div>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 -rotate-90 text-slate-600" />
              </button>

              <button
                onClick={() => {
                  if (onSelectStep) onSelectStep('results');
                  onSelectTab('games');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full p-3 rounded-xl text-left font-mono text-xs flex items-center justify-between transition-all cursor-pointer ${
                  currentStep === 'results' && activeTab === 'games' ? 'bg-white/[0.1] text-white border border-cyan-400/40' : 'bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Monitor className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-bold">FPS ESTIMATOR</div>
                    <div className="text-[10px] text-slate-500 font-sans">What can your PC run across 100+ titles</div>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 -rotate-90 text-slate-600" />
              </button>

              <button
                onClick={() => {
                  if (onSelectStep) onSelectStep('compare');
                  else onOpenCompare();
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full p-3 rounded-xl text-left font-mono text-xs flex items-center justify-between transition-all cursor-pointer ${
                  currentStep === 'compare' ? 'bg-white/[0.1] text-white border border-cyan-400/40' : 'bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Gamepad2 className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="font-bold">GAMES LIBRARY</div>
                    <div className="text-[10px] text-slate-500 font-sans">FPS Estimator & Compatibility Lab</div>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 -rotate-90 text-slate-600" />
              </button>

              <button
                onClick={() => {
                  if (onSelectStep) onSelectStep('results');
                  onSelectTab('target_fps');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full p-3 rounded-xl text-left font-mono text-xs flex items-center justify-between transition-all cursor-pointer ${
                  currentStep === 'results' && activeTab === 'target_fps' ? 'bg-white/[0.1] text-white border border-violet-400/40' : 'bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <div>
                    <div className="font-bold">TARGET FPS ESTIMATOR</div>
                    <div className="text-[10px] text-slate-500 font-sans">Find hardware required for 60, 144, or 240 FPS</div>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 -rotate-90 text-slate-600" />
              </button>

              <button
                onClick={() => {
                  onOpenSeoLookup();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full p-3 rounded-xl text-left font-mono text-xs flex items-center justify-between bg-white/[0.03] text-slate-300 hover:bg-white/[0.06] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-bold">GPU VS GAME DATABASE</div>
                    <div className="text-[10px] text-slate-500 font-sans">Direct GPU and game pairing lookup</div>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 -rotate-90 text-slate-600" />
              </button>

              {/* DEDICATED LOGIN / SIGN UP DRAWER ITEM */}
              <button
                onClick={() => handleNavigateToAuth('login')}
                className={`w-full p-3.5 rounded-xl text-left font-mono text-xs flex items-center justify-between transition-all cursor-pointer border ${
                  currentStep === 'auth'
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg'
                    : 'bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border-cyan-400/30 text-white hover:border-cyan-400/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <UserPlus className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="font-bold text-cyan-300">LOGIN & SIGN UP PORTAL</div>
                    <div className="text-[10px] text-slate-400 font-sans">Access saved PC rigs, cloud benchmarks & profile</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
                  OPEN
                </span>
              </button>
            </div>

            {/* Quick prebuilt rig dropdown inside drawer */}
            <div className="pt-2 border-t border-white/[0.08]">
              <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase">
                LOAD PREBUILT CONFIGURATION
              </label>
              <select
                aria-label="Load Prebuilt System"
                onChange={(e) => {
                  const target = PREBUILT_SYSTEMS.find((p) => p.name === e.target.value);
                  if (target) {
                    onSelectPrebuilt(target.build);
                    setIsMobileMenuOpen(false);
                  }
                }}
                className="w-full p-2.5 rounded-xl border border-white/[0.1] bg-[#121622] text-slate-200 text-xs font-mono"
                defaultValue=""
              >
                <option value="" disabled>Choose a prebuilt rig... ▾</option>
                {PREBUILT_SYSTEMS.map((system) => (
                  <option key={system.name} value={system.name} className="bg-[#0b0e16] text-slate-200">
                    {system.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Close Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.04] text-slate-300 font-mono text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-white/[0.08]"
            >
              <X className="w-4 h-4" />
              <span>Close Menu</span>
            </button>

          </div>
        </div>
      )}
    </header>
  );
};
