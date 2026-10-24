import React, { useState, useMemo } from 'react';
import { RAMConfig, Motherboard } from '../../types/hardware';
import { RAM_PRESETS } from '../../data/otherHardware';
import { ThemeId, THEMES } from '../../types/theme';
import { ArrowRight, ArrowLeft, Check, Search, X, MemoryStick, AlertTriangle } from 'lucide-react';
import { ScrollReveal } from '../ScrollReveal';

interface RamSelectionPageProps {
  selectedRam?: RAMConfig;
  selectedMotherboard?: Motherboard;
  onSelectRam: (ram: RAMConfig) => void;
  onBack: () => void;
  onContinue: () => void;
  currentTheme: ThemeId;
}

export const RamSelectionPage: React.FC<RamSelectionPageProps> = ({
  selectedRam,
  selectedMotherboard,
  onSelectRam,
  onBack,
  onContinue,
  currentTheme,
}) => {
  const activeTheme = THEMES[currentTheme] || THEMES.cyberpunk;
  const [searchQuery, setSearchQuery] = useState('');

  const moboRamType = selectedMotherboard?.ramType;

  const filteredKits = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return RAM_PRESETS;
    return RAM_PRESETS.filter((kit) => {
      const fullText = `${kit.capacityGb}gb ${kit.type} ${kit.speedMhz}mhz ${kit.brand || ''} ${kit.chipMaker || ''} ${kit.channels === 2 ? 'dual dual-channel' : 'single'} ${kit.serverType || ''}`.toLowerCase();
      return fullText.includes(q);
    });
  }, [searchQuery]);

  return (
    <div className="w-full max-w-5xl mx-auto py-1 select-none">
      {/* Header */}
      <ScrollReveal variant="slide-up">
        <div className="mb-6 text-left flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>STEP 04 OF 06 • SYNCHRONOUS DYNAMIC RAM</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight text-white uppercase">
              SELECT YOUR <span style={{ color: activeTheme.primaryHex }}>RAM</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
              Search and select system memory. High bandwidth and dual-channel capacity eliminate 1% low frame drops.
            </p>
          </div>

          {/* Selected RAM Chip */}
          {selectedRam && (
            <div className="titanium-card px-3.5 py-2 self-start sm:self-auto text-left shadow-sm">
              <div className="text-[9px] font-mono uppercase text-slate-500">EQUIPPED MEMORY</div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 diode-pulse" />
                <span>
                  {selectedRam.capacityGb}GB {selectedRam.type}-{selectedRam.speedMhz} ({selectedRam.brand || 'DRAM'})
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                {selectedRam.channels === 2 ? 'Dual-Channel (2x DIMMs)' : 'Single DIMM'} • {selectedRam.serverType || 'UDIMM'}
              </div>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Motherboard RAM type compatibility alert */}
      {moboRamType && selectedRam?.type !== moboRamType && (
        <ScrollReveal variant="fade">
          <div className="mb-5 p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="text-xs text-amber-200">
              <strong>Memory Notice:</strong> Motherboard ({selectedMotherboard?.model}) expects <strong>{moboRamType}</strong>, selected memory is <strong>{selectedRam?.type}</strong>.
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Clean Search Bar */}
      <ScrollReveal variant="slide-up" delayMs={50}>
        <div className="relative mb-5">
          <div className="relative flex items-center bg-[#0d101a]/90 border border-white/[0.1] hover:border-cyan-400/40 focus-within:border-cyan-400/60 focus-within:ring-2 focus-within:ring-cyan-400/15 rounded-2xl p-2 sm:p-2.5 transition-all shadow-xl">
            <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-cyan-400 shrink-0 ml-0.5">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search RAM (e.g. 32GB DDR5, 6000MHz, Corsair, G.Skill, Kingston, 16GB DDR4, Crucial)..."
              className="w-full bg-transparent px-3.5 py-1.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none font-mono"
              autoFocus={false}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.08] transition-colors mr-1 cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* Results Count & Notice */}
      <ScrollReveal variant="fade" delayMs={80}>
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-3 px-1">
          <div>
            {searchQuery ? (
              <span>FOUND <span className="text-cyan-400 font-bold">{filteredKits.length}</span> MATCHES FOR "{searchQuery}"</span>
            ) : (
              <span>CATALOG: <span className="text-white font-bold">{filteredKits.length}</span> MEMORY KITS LISTED</span>
            )}
          </div>
          <div className="hidden sm:block text-slate-500">
            {moboRamType ? `MOTHERBOARD COMPATIBILITY: ${moboRamType}` : 'DUAL-CHANNEL RECOMMENDED'}
          </div>
        </div>
      </ScrollReveal>

      {/* Empty State or RAM Kits Grid */}
      {filteredKits.length === 0 ? (
        <ScrollReveal variant="card">
          <div className="p-12 text-center titanium-card rounded-2xl border border-white/[0.08] mb-6">
            <MemoryStick className="w-10 h-10 text-slate-500 mx-auto mb-3 opacity-60" />
            <p className="text-sm font-semibold text-slate-200">No memory kits found matching "{searchQuery}".</p>
            <p className="text-xs text-slate-400 mt-1">Try searching by capacity (e.g. "32GB", "16GB", "64GB"), generation ("DDR5", "DDR4"), or brand.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 rounded-xl btn-titanium-secondary text-xs text-cyan-400 font-semibold cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        </ScrollReveal>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6 max-h-[540px] overflow-y-auto pr-1">
          {filteredKits.map((preset, idx) => {
            const isSelected =
              selectedRam?.capacityGb === preset.capacityGb &&
              selectedRam?.type === preset.type &&
              selectedRam?.speedMhz === preset.speedMhz &&
              selectedRam?.brand === preset.brand;

            return (
              <ScrollReveal
                key={`${preset.type}-${preset.capacityGb}-${preset.speedMhz}-${preset.brand}-${idx}`}
                variant="card"
                delayMs={Math.min((idx % 9) * 35, 240)}
                className="h-full"
              >
                <div
                  onClick={() => onSelectRam(preset)}
                  className={`p-3.5 rounded-2xl cursor-pointer flex flex-col justify-between text-left transition-all relative h-full ${
                    isSelected
                      ? 'titanium-card titanium-card-active'
                      : 'titanium-card'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/[0.08]">
                        {preset.brand} • {preset.type}
                      </span>
                      {isSelected ? (
                        <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-xs font-bold shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500">
                          {preset.chipMaker || 'OEM'}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold font-heading text-white group-hover:text-cyan-300 transition-colors">
                      {preset.capacityGb} GB {preset.type}
                    </h3>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      {preset.speedMhz} MHz • {preset.channels === 2 ? 'Dual-Channel (2x Dimms)' : 'Single Dimms'}
                    </div>
                  </div>

                  {/* Technical Specs Badges */}
                  <div className="mt-3 pt-2.5 border-t border-white/[0.06] grid grid-cols-2 gap-1.5 text-center font-mono">
                    <div className="bg-black/30 p-1.5 rounded-lg border border-white/[0.03]">
                      <div className="text-[9px] text-slate-500 uppercase">CONFIGURATION</div>
                      <div className="text-xs font-bold text-slate-200">
                        {preset.channels === 2 ? `2x ${preset.capacityGb / 2}GB` : `1x ${preset.capacityGb}GB`}
                      </div>
                    </div>

                    <div className="bg-black/30 p-1.5 rounded-lg border border-white/[0.03]">
                      <div className="text-[9px] text-slate-500 uppercase">TIER</div>
                      <div className="text-xs font-bold text-cyan-400">
                        {preset.capacityGb >= 32 ? 'Optimal 1440p+' : 'Budget / Entry'}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      )}

      {/* Navigation Footer */}
      <ScrollReveal variant="slide-up" delayMs={120}>
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
          <button
            onClick={onBack}
            className="btn-titanium-secondary px-4 py-2.5 rounded-xl font-heading text-xs font-medium flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Motherboard</span>
          </button>

          <button
            onClick={onContinue}
            className="btn-titanium-primary px-6 py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <span>Continue to Storage</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </ScrollReveal>
    </div>
  );
};

