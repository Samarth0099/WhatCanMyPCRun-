import React, { useState, useMemo } from 'react';
import { Search, Cpu as CpuIcon, ArrowLeft, ArrowRight, Check, Wrench, Zap } from 'lucide-react';
import { CPUS_DATABASE } from '../../data/cpus';
import { CPU } from '../../types/hardware';

interface CpuPageProps {
  selectedCpu: CPU;
  onSelectCpu: (cpu: CPU) => void;
  onBack: () => void;
  onContinue: () => void;
  onOpenCustomModal: () => void;
}

export const CpuPage: React.FC<CpuPageProps> = ({
  selectedCpu,
  onSelectCpu,
  onBack,
  onContinue,
  onOpenCustomModal,
}) => {
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState<'All' | 'AMD' | 'Intel'>('All');
  const [seriesFilter, setSeriesFilter] = useState<string>('All');

  // Filter CPUs
  const filteredCpus = useMemo(() => {
    const q = search.toLowerCase().trim();
    return CPUS_DATABASE.filter(c => {
      const matchesBrand = brandFilter === 'All' || c.brand === brandFilter;
      const matchesSeries = seriesFilter === 'All' || c.series.toLowerCase().includes(seriesFilter.toLowerCase()) || c.socket.toLowerCase() === seriesFilter.toLowerCase();
      const matchesSearch = !q || c.model.toLowerCase().includes(q) || c.series.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q);
      return matchesBrand && matchesSeries && matchesSearch;
    });
  }, [search, brandFilter, seriesFilter]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-semibold mb-1">
          Step 1 of 6 · Processor Selection
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
          SELECT YOUR CPU
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl">
          Choose your desktop or laptop processor. Benchmark calculations calibrate IPC, physical cores, threads, and cache architecture.
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
            placeholder="Search CPU (e.g. 'Ryzen 7 7800X3D', 'i7-14700K', 'i5-12400F', 'Ryzen 5 5600')..."
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
            {(['All', 'AMD', 'Intel'] as const).map(b => (
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
                {b}
              </button>
            ))}
          </div>

          {/* Quick Series Filters */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar font-mono text-[11px]">
            {[
              { id: 'All', label: 'All Series' },
              { id: 'Ryzen 7', label: 'Ryzen 7' },
              { id: 'Ryzen 5', label: 'Ryzen 5' },
              { id: 'Core i7', label: 'Core i7' },
              { id: 'Core i5', label: 'Core i5' },
              { id: 'AM5', label: 'AM5 Socket' },
              { id: 'LGA1700', label: 'LGA1700' },
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

      {/* Selected CPU Callout Banner */}
      {selectedCpu && (
        <div className="mb-6 p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">Currently Equipped</div>
              <div className="text-sm font-bold text-white mt-0.5">{selectedCpu.model} ({selectedCpu.cores}C/{selectedCpu.threads}T · {selectedCpu.socket})</div>
            </div>
          </div>
          <div className="text-xs font-mono text-cyan-300 font-semibold hidden sm:block">
            Gaming Index: {selectedCpu.gamingScore}
          </div>
        </div>
      )}

      {/* CPU Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredCpus.map(cpu => {
          const isSelected = selectedCpu.id === cpu.id;

          return (
            <div
              key={cpu.id}
              onClick={() => onSelectCpu(cpu)}
              className={`p-4 rounded-xl border transition-all cursor-pointer card-depth-3d flex flex-col justify-between group ${
                isSelected
                  ? 'bg-white/[0.08] border-cyan-500/60 shadow-lg ring-1 ring-cyan-500/40'
                  : 'bg-[#10141e] border-white/[0.07] hover:border-white/[0.18]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    cpu.brand === 'AMD' ? 'bg-red-950/40 text-red-300 border border-red-500/30' : 'bg-blue-950/40 text-blue-300 border border-blue-500/30'
                  }`}>
                    {cpu.brand}
                  </span>

                  <span className="text-[10px] font-mono text-slate-400">
                    {cpu.socket}
                  </span>
                </div>

                <h3 className="text-sm font-bold font-display text-white group-hover:text-cyan-300 transition-colors">
                  {cpu.model}
                </h3>

                <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <span>{cpu.cores} Cores</span>
                  <span>·</span>
                  <span>{cpu.threads} Threads</span>
                  <span>·</span>
                  <span>{cpu.tdpWatts}W</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 text-[11px]">
                  Clock: {cpu.baseClockGhz}–{cpu.boostClockGhz} GHz
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCpu(cpu);
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

      {filteredCpus.length === 0 && (
        <div className="p-12 text-center bg-[#10141e] rounded-2xl border border-white/[0.07] my-8">
          <p className="text-sm font-semibold text-slate-200">No CPU matched your search query "{search}".</p>
          <div className="mt-4">
            <button
              onClick={onOpenCustomModal}
              className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5 mx-auto"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Enter custom CPU specifications manually →</span>
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
          <span>Can't find your exact processor? Enter custom specs</span>
        </button>
      </div>

      {/* Sticky Bottom Navigation Bar */}
      <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all btn-tactile"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <button
          onClick={onContinue}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold font-sans flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all btn-tactile"
        >
          <span>Continue to GPU</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
