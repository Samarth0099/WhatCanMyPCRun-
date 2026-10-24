import React from 'react';
import { ThemeId, THEMES } from '../types/theme';
import { Palette, Check, Sparkles } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  onSelectTheme: (themeId: ThemeId) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const requestedThemeIds: ThemeId[] = ['mocha_mousse', 'teal_cream', 'deep_purple_orange'];
  const otherThemeIds: ThemeId[] = (Object.keys(THEMES) as ThemeId[]).filter(
    (id) => !requestedThemeIds.includes(id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0e111a] border border-white/[0.1] rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] sticky top-0 bg-[#0e111a]/95 backdrop-blur-md z-10 -mt-2 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-white">Visual Themes & Color Palettes</h2>
              <p className="text-xs text-slate-400">Restrained 60/30/10 dark modes & atmospheric palettes.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* 1. FEATURED REQUESTED THEMES */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Featured Color Palettes</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {requestedThemeIds.map((id) => {
              const t = THEMES[id];
              const isSelected = currentTheme === id;

              return (
                <button
                  key={id}
                  onClick={() => {
                    onSelectTheme(id);
                    onClose();
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-3 group relative overflow-hidden cursor-pointer ${
                    isSelected
                      ? 'border-white/40 bg-white/[0.09] shadow-lg ring-1 ring-white/20'
                      : 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.18]'
                  }`}
                  style={{
                    boxShadow: isSelected ? `0 0 25px ${t.glowRgba}` : undefined,
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Visual Swatch Badges */}
                    <div className="flex -space-x-1.5 shrink-0 pt-1">
                      <span
                        className="w-5 h-5 rounded-full border-2 border-black/60 shadow-md"
                        style={{ backgroundColor: t.primaryHex }}
                        title="Primary Color"
                      />
                      <span
                        className="w-5 h-5 rounded-full border-2 border-black/60 shadow-md"
                        style={{ backgroundColor: t.secondaryHex }}
                        title="Secondary Color"
                      />
                      <span
                        className="w-5 h-5 rounded-full border-2 border-black/60 shadow-md"
                        style={{ backgroundColor: t.accentHex }}
                        title="Accent Color"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm font-bold text-white flex flex-wrap items-center gap-2">
                        <span>{t.name}</span>
                        {id === 'mocha_mousse' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#A47764]/30 border border-[#A47764]/60 text-[#F8EDE3] font-mono font-bold uppercase">
                            Pantone 2025
                          </span>
                        )}
                        {id === 'teal_cream' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 font-mono font-bold uppercase">
                            Oceanic Ivory
                          </span>
                        )}
                        {id === 'deep_purple_orange' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-300 font-mono font-bold uppercase">
                            Cosmic Flame
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-300">
                        {t.tagline}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        <span className="text-slate-500">Colors:</span> {t.colorsDescription}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="shrink-0 p-1.5 rounded-full bg-white text-black mt-1 shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. ADDITIONAL CLASSIC PALETTES */}
        <div className="mt-6 pt-5 border-t border-white/[0.08] space-y-3">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Classic Hardware Lab Themes
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {otherThemeIds.map((id) => {
              const t = THEMES[id];
              const isSelected = currentTheme === id;

              return (
                <button
                  key={id}
                  onClick={() => {
                    onSelectTheme(id);
                    onClose();
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'border-white/30 bg-white/[0.08] shadow-md'
                      : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex -space-x-1 shrink-0">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/50"
                        style={{ backgroundColor: t.primaryHex }}
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/50"
                        style={{ backgroundColor: t.secondaryHex }}
                      />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-white truncate">{t.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{t.vibe}</div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="shrink-0 p-1 rounded-full bg-white/20 text-white">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
