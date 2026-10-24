import React, { useState, useMemo } from 'react';
import { Cooler, CPU, CustomLoopConfig } from '../../types/hardware';
import { COOLERS_DATABASE, CUSTOM_WATER_COOLING_PARTS } from '../../data/otherHardware';
import { ThemeId, THEMES } from '../../types/theme';
import { ArrowRight, ArrowLeft, Check, Search, X, Thermometer, ShieldCheck, Flame, Sliders } from 'lucide-react';
import { ScrollReveal } from '../ScrollReveal';

interface CoolerSelectionPageProps {
  selectedCooler?: Cooler;
  selectedCpu?: CPU;
  onSelectCooler: (cooler: Cooler) => void;
  onBack: () => void;
  onSkip: () => void;
  onContinue: () => void;
  currentTheme: ThemeId;
}

export const CoolerSelectionPage: React.FC<CoolerSelectionPageProps> = ({
  selectedCooler,
  selectedCpu,
  onSelectCooler,
  onBack,
  onSkip,
  onContinue,
  currentTheme,
}) => {
  const activeTheme = THEMES[currentTheme] || THEMES.cyberpunk;
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomLoopConfig, setShowCustomLoopConfig] = useState(false);

  // Custom loop interactive state
  const [customLoop, setCustomLoop] = useState<CustomLoopConfig>({
    waterBlock: CUSTOM_WATER_COOLING_PARTS.waterBlocks[0].name,
    gpuWaterBlock: CUSTOM_WATER_COOLING_PARTS.gpuWaterBlocks[0].name,
    radiator: CUSTOM_WATER_COOLING_PARTS.radiators[0].name,
    pump: CUSTOM_WATER_COOLING_PARTS.pumps[0].name,
    reservoir: CUSTOM_WATER_COOLING_PARTS.reservoirs[0].name,
    tubing: CUSTOM_WATER_COOLING_PARTS.tubing[0].name,
    coolant: CUSTOM_WATER_COOLING_PARTS.coolants[0].name,
  });

  const cpuTdp = selectedCpu?.tdpWatts || 125;

  const filteredCoolers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return COOLERS_DATABASE;
    return COOLERS_DATABASE.filter((c) => {
      const fullText = `${c.brand} ${c.model} ${c.type} ${c.ratedTdpWatts}w air aio water loop 360mm 240mm 280mm`.toLowerCase();
      return fullText.includes(q);
    });
  }, [searchQuery]);

  const handleApplyCustomLoop = (updated: CustomLoopConfig) => {
    setCustomLoop(updated);
    const customCooler: Cooler = {
      id: 'custom-loop-user-built',
      brand: 'Custom Water Loop',
      model: `Custom Water Loop (${updated.radiator ? updated.radiator.split(' ')[0] : '360mm'} + ${updated.pump ? updated.pump.split(' ')[1] : 'D5'})`,
      type: 'Custom_Loop',
      ratedTdpWatts: 450,
      customLoop: updated,
    };
    onSelectCooler(customCooler);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-1 select-none">
      {/* Header */}
      <ScrollReveal variant="slide-up">
        <div className="mb-6 text-left flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>STEP 06 OF 06 • THERMAL DISSIPATION & WATER LOOP (OPTIONAL)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight text-white uppercase">
              SELECT YOUR <span style={{ color: activeTheme.primaryHex }}>COOLER</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
              Search and select high-efficiency Air Coolers, AIO liquid coolers, or custom water loops.
            </p>
          </div>

          {/* Selected CPU TDP Hint */}
          {selectedCpu && (
            <div className="titanium-card px-3.5 py-2 self-start sm:self-auto text-left shadow-sm">
              <div className="text-[9px] font-mono uppercase text-slate-500">TARGET CPU TDP RATING</div>
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mt-0.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-amber-400 diode-pulse" />
                <span>{cpuTdp}W TDP Heat Output</span>
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
              placeholder="Search Coolers (e.g. 360mm AIO, Noctua NH-D15, Liquid Freezer III, Thermalright Peerless Assassin, Custom Loop)..."
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
              <span>FOUND <span className="text-cyan-400 font-bold">{filteredCoolers.length}</span> MATCHES FOR "{searchQuery}"</span>
            ) : (
              <span>CATALOG: <span className="text-white font-bold">{filteredCoolers.length}</span> THERMAL SOLUTIONS AVAILABLE</span>
            )}
          </div>
          <div className="hidden sm:block text-slate-500">HEADROOM ELIMINATES THERMAL THROTTLING</div>
        </div>
      </ScrollReveal>

      {/* Empty State or Coolers Hardware Cards Grid */}
      {filteredCoolers.length === 0 ? (
        <ScrollReveal variant="card">
          <div className="p-12 text-center titanium-card rounded-2xl border border-white/[0.08] mb-6">
            <Thermometer className="w-10 h-10 text-slate-500 mx-auto mb-3 opacity-60" />
            <p className="text-sm font-semibold text-slate-200">No thermal solutions found matching "{searchQuery}".</p>
            <p className="text-xs text-slate-400 mt-1">Try searching by cooler type (e.g. "360mm", "AIO", "Air"), brand ("Noctua", "Corsair"), or model.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 rounded-xl btn-titanium-secondary text-xs text-cyan-400 font-semibold cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        </ScrollReveal>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6 max-h-[500px] overflow-y-auto pr-1">
          {filteredCoolers.map((cooler, idx) => {
            const isSelected = selectedCooler?.id === cooler.id;
            const isSufficient = cooler.ratedTdpWatts >= cpuTdp;

            return (
              <ScrollReveal
                key={cooler.id}
                variant="card"
                delayMs={Math.min((idx % 9) * 35, 240)}
                className="h-full"
              >
                <div
                  onClick={() => {
                    if (cooler.type === 'Custom_Loop') {
                      setShowCustomLoopConfig(true);
                    }
                    onSelectCooler(cooler);
                  }}
                  className={`p-3.5 rounded-2xl cursor-pointer flex flex-col justify-between text-left transition-all relative h-full ${
                    isSelected
                      ? 'titanium-card titanium-card-active'
                      : 'titanium-card'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/[0.08]">
                        {cooler.type.replace('_', ' ')}
                      </span>
                      {isSelected ? (
                        <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-xs font-bold shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      ) : isSufficient ? (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                          <ShieldCheck className="w-3 h-3" /> Safe
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1 font-semibold">
                          <Flame className="w-3 h-3" /> Throttle Risk
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold font-heading text-white group-hover:text-cyan-300 transition-colors">
                      {cooler.model}
                    </h3>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      {cooler.brand}
                    </div>
                  </div>

                  {/* Technical Specs Badges */}
                  <div className="mt-3 pt-2.5 border-t border-white/[0.06] grid grid-cols-2 gap-1.5 text-center font-mono">
                    <div className="bg-black/30 p-1.5 rounded-lg border border-white/[0.03]">
                      <div className="text-[9px] text-slate-500 uppercase">TDP CAPACITY</div>
                      <div className={`text-xs font-bold ${isSufficient ? 'text-slate-200' : 'text-amber-400'}`}>
                        {cooler.ratedTdpWatts}W
                      </div>
                    </div>

                    <div className="bg-black/30 p-1.5 rounded-lg border border-white/[0.03]">
                      <div className="text-[9px] text-slate-500 uppercase">HEADROOM</div>
                      <div className={`text-xs font-bold ${cooler.ratedTdpWatts - cpuTdp >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {cooler.ratedTdpWatts - cpuTdp >= 0 ? `+${cooler.ratedTdpWatts - cpuTdp}W` : `${cooler.ratedTdpWatts - cpuTdp}W`}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      )}

      {/* Optional: Fine-Tune Custom Water Loop */}
      <div className="mb-6">
        <button
          onClick={() => setShowCustomLoopConfig(!showCustomLoopConfig)}
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{showCustomLoopConfig ? 'Hide Custom Water Loop Configurator' : 'Configure Custom Water Cooling Loop Details (Optional) →'}</span>
        </button>

        {showCustomLoopConfig && (
          <div className="titanium-glass-panel rounded-2xl p-4 sm:p-5 mt-3 animate-in fade-in duration-200">
            <h3 className="text-xs font-heading font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
              <span>CUSTOM OPEN-LOOP LIQUID COOLING COMPONENT RIG</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono mb-4">
              {/* CPU Water Block */}
              <div>
                <label className="block text-[10px] text-slate-400 uppercase mb-1">CPU Water Block</label>
                <select
                  aria-label="Select custom CPU water block"
                  value={customLoop.waterBlock}
                  onChange={(e) => handleApplyCustomLoop({ ...customLoop, waterBlock: e.target.value })}
                  className="w-full bg-black/40 border border-white/[0.08] text-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none"
                >
                  {CUSTOM_WATER_COOLING_PARTS.waterBlocks.map((wb) => (
                    <option key={wb.id} value={wb.name} className="bg-[#0b0e16] text-slate-200">
                      {wb.name} ({wb.tdpRating}W)
                    </option>
                  ))}
                </select>
              </div>

              {/* Radiator Size */}
              <div>
                <label className="block text-[10px] text-slate-400 uppercase mb-1">Radiator Assembly</label>
                <select
                  aria-label="Select custom radiator"
                  value={customLoop.radiator}
                  onChange={(e) => handleApplyCustomLoop({ ...customLoop, radiator: e.target.value })}
                  className="w-full bg-black/40 border border-white/[0.08] text-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none"
                >
                  {CUSTOM_WATER_COOLING_PARTS.radiators.map((rad) => (
                    <option key={rad.id} value={rad.name} className="bg-[#0b0e16] text-slate-200">
                      {rad.name} ({rad.tdpCapacity}W)
                    </option>
                  ))}
                </select>
              </div>

              {/* Pump Selection */}
              <div>
                <label className="block text-[10px] text-slate-400 uppercase mb-1">Pump / Reservoir</label>
                <select
                  aria-label="Select custom pump"
                  value={customLoop.pump}
                  onChange={(e) => handleApplyCustomLoop({ ...customLoop, pump: e.target.value })}
                  className="w-full bg-black/40 border border-white/[0.08] text-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none"
                >
                  {CUSTOM_WATER_COOLING_PARTS.pumps.map((p) => (
                    <option key={p.id} value={p.name} className="bg-[#0b0e16] text-slate-200">
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <ScrollReveal variant="slide-up" delayMs={120}>
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
          <button
            onClick={onBack}
            className="btn-titanium-secondary px-4 py-2.5 rounded-xl font-heading text-xs font-medium flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Storage</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onSkip}
              className="px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Skip Cooler
            </button>

            <button
              onClick={onContinue}
              className="btn-titanium-primary px-6 py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <span>Finish & View FPS Results</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};
