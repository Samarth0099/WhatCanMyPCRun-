import React, { useState, useMemo } from 'react';
import { Search, Zap, ArrowLeft, ArrowRight, Check, Wrench } from 'lucide-react';
import { GPUS_DATABASE } from '../../data/gpus';
import { GPU } from '../../types/hardware';

interface GpuPageProps {
  selectedGpu: GPU;
  onSelectGpu: (gpu: GPU) => void;
  onBack: () => void;
  onContinue: () => void;
  onOpenCustomModal: () => void;
}

export const GpuPage: React.FC<GpuPageProps> = ({
  selectedGpu,
  onSelectGpu,
  onBack,
  onContinue,
  onOpenCustomModal,
}) => {
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState<'All' | 'Nvidia' | 'AMD' | 'Intel'>('All');
  const [seriesFilter, setSeriesFilter] = useState<string>('All');

  const filteredGpus = useMemo(() => {
    const q = search.toLowerCase().trim();
    return GPUS_DATABASE.filter(g => {
      const matchesBrand = brandFilter === 'All' || g.brand === brandFilter;
      const matchesSeries = seriesFilter === 'All' || g.series.toLowerCase().includes(seriesFilter.toLowerCase());
      const matchesSearch = !q || g.model.toLowerCase().includes(q) || g.series.toLowerCase().includes(q) || (g.partnerBrand && g.partnerBrand.toLowerCase().includes(q));
      return matchesBrand && matchesSeries && matchesSearch;
    });
  }, [search, brandFilter, seriesFilter]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-semibold mb-1">
          Step 2 of 6 · Graphics Card Selection
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
          SELECT YOUR GPU
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl">
          Select your dedicated or integrated graphics card. The GPU is the primary factor for rendering resolution, texture quality, and raw raster FPS.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#10141e]/90 border border-white/[0.08] rounded-2xl p-4 sm:p-5 mb-8 space-y-4 card-depth-3d">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-slate-400 shrink-0">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search GPU (e.g. 'RTX 4070', 'RTX 3060', 'RX 7800 XT', 'Arc A770', 'GTX 1650')..."
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-xs text-slate-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Brand & Series Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.06] text-xs">
          {/* Brand Tabs */}
          <div className="flex items-center gap-1">
            {(['All', 'Nvidia', 'AMD', 'Intel'] as const).map(b => (
              <button
                key={b}
                onClick={() => {
                  setBrandFilter(b);
                  setSeriesFilter('All');
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  brandFilter === b
                    ? 'bg-white/[0.12] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {b === 'Nvidia' ? 'NVIDIA' : b}
              </button>
            ))}
          </div>

          {/* Quick Series Filters */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar font-mono text-[11px]">
            {[
              { id: 'All', label: 'All Series' },
              { id: 'RTX 40', label: 'RTX 40 Series' },
              { id: 'RTX 30', label: 'RTX 30 Series' },
              { id: 'RX 70', label: 'RDNA 3 (RX 7000)' },
              { id: 'RX 60', label: 'RDNA 2 (RX 6000)' },
              { id: 'Arc', label: 'Intel Arc' },
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setSeriesFilter(s.id)}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  seriesFilter === s.id
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected GPU Callout Banner */}
      {selectedGpu && (
        <div className="mb-6 p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">Currently Equipped</div>
              <div className="text-sm font-bold text-white mt-0.5">{selectedGpu.model} ({selectedGpu.vramGb}GB {selectedGpu.vramType} · {selectedGpu.tdpWatts}W)</div>
            </div>
          </div>
          <div className="text-xs font-mono text-cyan-300 font-semibold hidden sm:block">
            Raster Score: {selectedGpu.scoreRaster}
          </div>
        </div>
      )}

      {/* GPU Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredGpus.map(gpu => {
          const isSelected = selectedGpu.id === gpu.id;

          return (
            <div
              key={gpu.id}
              onClick={() => onSelectGpu(gpu)}
              className={`p-4 rounded-xl border transition-all cursor-pointer card-depth-3d flex flex-col justify-between group ${
                isSelected
                  ? 'bg-white/[0.08] border-cyan-500/60 shadow-lg ring-1 ring-cyan-500/40'
                  : 'bg-[#10141e] border-white/[0.07] hover:border-white/[0.18]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    gpu.brand === 'Nvidia' ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30' :
                    gpu.brand === 'AMD' ? 'bg-red-950/40 text-red-300 border border-red-500/30' :
                    'bg-blue-950/40 text-blue-300 border border-blue-500/30'
                  }`}>
                    {gpu.brand}
                  </span>

                  <span className="text-[10px] font-mono text-slate-400">
                    {gpu.vramGb} GB {gpu.vramType}
                  </span>
                </div>

                <h3 className="text-sm font-bold font-display text-white group-hover:text-cyan-300 transition-colors">
                  {gpu.model}
                </h3>

                <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <span>{gpu.series}</span>
                  <span>·</span>
                  <span>{gpu.tdpWatts}W</span>
                  {gpu.isLaptop && (
                    <>
                      <span>·</span>
                      <span className="text-amber-300 font-mono text-[10px]">Mobile</span>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs">
                <div className="font-mono text-slate-400 text-[11px] flex items-center gap-1.5">
                  {gpu.supportsDLSS && <span className="text-emerald-400 font-bold">DLSS</span>}
                  {gpu.supportsDLSS3FrameGen && <span className="text-cyan-400 font-bold">FG</span>}
                  {gpu.supportsFSR && <span className="text-amber-400 font-bold">FSR</span>}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectGpu(gpu);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'bg-white/[0.04] text-slate-300 group-hover:bg-white/[0.08]'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Select'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredGpus.length === 0 && (
        <div className="p-12 text-center bg-[#10141e] rounded-2xl border border-white/[0.07] my-8">
          <p className="text-sm font-semibold text-slate-200">No GPU matched your search query "{search}".</p>
          <div className="mt-4">
            <button
              onClick={onOpenCustomModal}
              className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5 mx-auto"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Enter custom GPU specifications manually →</span>
            </button>
          </div>
        </div>
      )}

      {/* Manual Part Entry Link */}
      <div className="text-center mb-10">
        <button
          onClick={onOpenCustomModal}
          className="text-xs text-slate-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1.5 font-mono"
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Can't find your graphics card? Enter custom specs</span>
        </button>
      </div>

      {/* Sticky Bottom Navigation Bar */}
      <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all btn-tactile"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to CPU</span>
        </button>

        <button
          onClick={onContinue}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold font-sans flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all btn-tactile"
        >
          <span>Continue to Motherboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
