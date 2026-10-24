import React, { useState, useMemo } from 'react';
import { Motherboard, CPU } from '../../types/hardware';
import { MOTHERBOARDS_DATABASE } from '../../data/otherHardware';
import { ThemeId, THEMES } from '../../types/theme';
import { Search, ArrowRight, ArrowLeft, Check, X, Layers } from 'lucide-react';
import { ScrollReveal } from '../ScrollReveal';

interface MotherboardSelectionPageProps {
  selectedMotherboard?: Motherboard;
  selectedCpu?: CPU;
  onSelectMotherboard: (mobo: Motherboard) => void;
  onBack: () => void;
  onContinue: () => void;
  currentTheme: ThemeId;
}

export const MotherboardSelectionPage: React.FC<MotherboardSelectionPageProps> = ({
  selectedMotherboard,
  selectedCpu,
  onSelectMotherboard,
  onBack,
  onContinue,
  currentTheme,
}) => {
  const activeTheme = THEMES[currentTheme] || THEMES.cyberpunk;
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMotherboards = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return MOTHERBOARDS_DATABASE;
    return MOTHERBOARDS_DATABASE.filter((m) => {
      const fullText = `${m.brand} ${m.model} ${m.chipset} ${m.socket} ${m.formFactor} ${m.ramType}`.toLowerCase();
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
              <span>STEP 03 OF 06 • MAINBOARD & CHIPSET FABRIC</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight text-white uppercase">
              SELECT YOUR <span style={{ color: activeTheme.primaryHex }}>MOTHERBOARD</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
              Search and select your motherboard. Interconnects CPU PCIe lanes, high-speed RAM, and NVMe bandwidth.
            </p>
          </div>

          {/* Selected CPU Socket Indicator */}
          {selectedCpu && (
            <div className="titanium-card px-3.5 py-2 self-start sm:self-auto text-left shadow-sm">
              <div className="text-[9px] font-mono uppercase text-slate-500">TARGET SOCKET</div>
              <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 diode-pulse" />
                <span>{selectedCpu.socket} ({selectedCpu.model})</span>
              </div>
            </div>
          )}
        </div>
      </ScrollReveal>

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
              placeholder="Search Motherboard (e.g. B650, Z790, AM5, LGA1700, ASUS ROG, MSI Tomahawk, ATX, DDR5)..."
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
              <span>FOUND <span className="text-cyan-400 font-bold">{filteredMotherboards.length}</span> MATCHES FOR "{searchQuery}"</span>
            ) : (
              <span>CATALOG: <span className="text-white font-bold">{filteredMotherboards.length}</span> MOTHERBOARDS LISTED</span>
            )}
          </div>
          <div className="hidden sm:block text-slate-500">
            {selectedCpu ? `OPTIMAL FOR ${selectedCpu.socket.toUpperCase()}` : 'UNIVERSAL COMPATIBILITY CHECK'}
          </div>
        </div>
      </ScrollReveal>

      {/* Empty State or Motherboard Hardware Cards Grid */}
      {filteredMotherboards.length === 0 ? (
        <ScrollReveal variant="card">
          <div className="p-12 text-center titanium-card rounded-2xl border border-white/[0.08] mb-6">
            <Layers className="w-10 h-10 text-slate-500 mx-auto mb-3 opacity-60" />
            <p className="text-sm font-semibold text-slate-200">No motherboards found matching "{searchQuery}".</p>
            <p className="text-xs text-slate-400 mt-1">Try searching by chipset (e.g. "B650", "Z790", "B550"), brand, socket, or form factor.</p>
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
          {filteredMotherboards.map((mobo, idx) => {
            const isSelected = selectedMotherboard?.id === mobo.id;
            const isSocketMatch = selectedCpu ? mobo.socket === selectedCpu.socket : true;

            return (
              <ScrollReveal
                key={mobo.id}
                variant="card"
                delayMs={Math.min((idx % 9) * 35, 240)}
                className="h-full"
              >
                <div
                  onClick={() => onSelectMotherboard(mobo)}
                  className={`p-3.5 rounded-2xl cursor-pointer flex flex-col justify-between text-left transition-all relative h-full ${
                    isSelected
                      ? 'titanium-card titanium-card-active'
                      : 'titanium-card'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/[0.08]">
                        {mobo.chipset} • {mobo.formFactor}
                      </span>
                      {isSelected ? (
                        <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-xs font-bold shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      ) : isSocketMatch && selectedCpu ? (
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Matched
                        </span>
                      ) : null}
                    </div>

                    <h3 className="text-sm font-bold font-heading text-white group-hover:text-cyan-300 transition-colors">
                      {mobo.brand} {mobo.model}
                    </h3>
                  </div>

                  {/* Technical Specs Badges */}
                  <div className="mt-3 pt-2.5 border-t border-white/[0.06] grid grid-cols-3 gap-1.5 text-center font-mono">
                    <div className="bg-black/30 p-1.5 rounded-lg border border-white/[0.03]">
                      <div className="text-[9px] text-slate-500 uppercase">SOCKET</div>
                      <div className={`text-xs font-bold ${isSocketMatch ? 'text-slate-200' : 'text-amber-400'}`}>
                        {mobo.socket}
                      </div>
                    </div>

                    <div className="bg-black/30 p-1.5 rounded-lg border border-white/[0.03]">
                      <div className="text-[9px] text-slate-500 uppercase">RAM TYPE</div>
                      <div className="text-xs font-bold text-cyan-400">
                        {mobo.ramType}
                      </div>
                    </div>

                    <div className="bg-black/30 p-1.5 rounded-lg border border-white/[0.03]">
                      <div className="text-[9px] text-slate-500 uppercase">MAX BUS</div>
                      <div className="text-xs font-bold text-slate-200">
                        {mobo.maxRamSpeedMhz} MHz
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
            <span>Back to GPU</span>
          </button>

          <button
            onClick={onContinue}
            className="btn-titanium-primary px-6 py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <span>Continue to RAM</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </ScrollReveal>
    </div>
  );
};

