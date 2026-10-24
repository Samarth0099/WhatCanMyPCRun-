import React, { useState, useMemo } from 'react';
import { GPU } from '../../types/hardware';
import { GPUS_DATABASE } from '../../data/gpus';
import { ThemeId, THEMES } from '../../types/theme';
import { Search, ArrowRight, ArrowLeft, Check, X, Gamepad2 } from 'lucide-react';
import { ScrollReveal } from '../ScrollReveal';

interface GpuSelectionPageProps {
  selectedGpu: GPU;
  onSelectGpu: (gpu: GPU) => void;
  onBack: () => void;
  onContinue: () => void;
  currentTheme: ThemeId;
}

export const GpuSelectionPage: React.FC<GpuSelectionPageProps> = ({
  selectedGpu,
  onSelectGpu,
  onBack,
  onContinue,
  currentTheme,
}) => {
  const activeTheme = THEMES[currentTheme] || THEMES.cyberpunk;
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGpus = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return GPUS_DATABASE;
    return GPUS_DATABASE.filter((gpu) => {
      const fullText = `${gpu.brand} ${gpu.model} ${gpu.series} ${gpu.vramGb}gb ${gpu.vramType} ${gpu.partnerBrand || ''}`.toLowerCase();
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
              <span>STEP 02 OF 06 • GRAPHICS SILICON & RASTERIZATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight text-white uppercase">
              SELECT YOUR <span style={{ color: activeTheme.primaryHex }}>GPU</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
              Search and select your graphics card. The GPU executes pixel shading, rasterization, and ray tracing.
            </p>
          </div>

          {/* Selected GPU Chip */}
          {selectedGpu && (
            <div className="titanium-card px-3.5 py-2 self-start sm:self-auto text-left shadow-sm">
              <div className="text-[9px] font-mono uppercase text-slate-500">EQUIPPED GPU</div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 diode-pulse" />
                <span className="truncate max-w-[200px]">{selectedGpu.model} ({selectedGpu.vramGb}GB)</span>
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
              placeholder="Search GPU (e.g. RTX 4080, RX 7900 XTX, RTX 3060, Arc B580, 4070 Ti Super, 16GB VRAM)..."
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
              <span>FOUND <span className="text-cyan-400 font-bold">{filteredGpus.length}</span> MATCHES FOR "{searchQuery}"</span>
            ) : (
              <span>CATALOG: <span className="text-white font-bold">{filteredGpus.length}</span> GRAPHICS CARDS AVAILABLE</span>
            )}
          </div>
          <div className="hidden sm:block text-slate-500">RAY TRACING & UPSCALER CALIBRATED</div>
        </div>
      </ScrollReveal>

      {/* Empty State or GPU Hardware Cards Grid */}
      {filteredGpus.length === 0 ? (
        <ScrollReveal variant="card">
          <div className="p-12 text-center titanium-card rounded-2xl border border-white/[0.08] mb-6">
            <Gamepad2 className="w-10 h-10 text-slate-500 mx-auto mb-3 opacity-60" />
            <p className="text-sm font-semibold text-slate-200">No graphics cards found matching "{searchQuery}".</p>
            <p className="text-xs text-slate-400 mt-1">Try searching by model number (e.g., "4070", "7900", "3060"), brand, or VRAM amount.</p>
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
          {filteredGpus.map((gpu, idx) => {
            const isSelected = selectedGpu?.id === gpu.id;

            return (
              <ScrollReveal
                key={gpu.id}
                variant="card"
                delayMs={Math.min((idx % 9) * 35, 240)}
                className="h-full"
              >
                <div
                  onClick={() => onSelectGpu(gpu)}
                  className={`p-3.5 rounded-2xl cursor-pointer flex flex-col justify-between text-left transition-all relative h-full ${
                    isSelected
                      ? 'titanium-card titanium-card-active'
                      : 'titanium-card'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/[0.08]">
                        {gpu.brand} • {gpu.vramGb} GB {gpu.vramType}
                      </span>
                      {isSelected ? (
                        <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-xs font-bold shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500">
                          {gpu.series}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold font-heading text-white group-hover:text-cyan-300 transition-colors">
                      {gpu.model}
                    </h3>
                  </div>

                  {/* Technical Specs Badges */}
                  <div className="mt-3 pt-2.5 border-t border-white/[0.06] grid grid-cols-3 gap-1.5 text-center font-mono">
                    <div className="bg-black/30 p-1.5 rounded-lg border border-white/[0.03]">
                      <div className="text-[9px] text-slate-500 uppercase">VRAM</div>
                      <div className="text-xs font-bold text-slate-200">
                        {gpu.vramGb} GB
                      </div>
                    </div>

                    <div className="bg-black/30 p-1.5 rounded-lg border border-white/[0.03]">
                      <div className="text-[9px] text-slate-500 uppercase">TIER</div>
                      <div className="text-xs font-bold text-cyan-400">
                        {gpu.scoreRaster >= 250 ? 'Enthusiast' : gpu.scoreRaster >= 160 ? 'High-End' : gpu.scoreRaster >= 90 ? 'Mid-Range' : 'Entry'}
                      </div>
                    </div>

                    <div className="bg-black/30 p-1.5 rounded-lg border border-white/[0.03]">
                      <div className="text-[9px] text-slate-500 uppercase">TDP</div>
                      <div className="text-xs font-bold text-slate-200">
                        {gpu.tdpWatts}W
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
            <span>Back to CPU</span>
          </button>

          <button
            onClick={onContinue}
            className="btn-titanium-primary px-6 py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <span>Continue to Motherboard</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </ScrollReveal>
    </div>
  );
};

