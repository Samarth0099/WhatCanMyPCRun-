import React, { useState, useMemo } from 'react';
import { HardDrive, ArrowLeft, ArrowRight, Check, AlertCircle, Sparkles } from 'lucide-react';
import { MOTHERBOARDS_DATABASE } from '../../data/otherHardware';
import { Motherboard, CPU } from '../../types/hardware';

interface MotherboardPageProps {
  selectedMotherboard?: Motherboard;
  onSelectMotherboard: (motherboard: Motherboard) => void;
  selectedCpu: CPU;
  onBack: () => void;
  onContinue: () => void;
}

export const MotherboardPage: React.FC<MotherboardPageProps> = ({
  selectedMotherboard,
  onSelectMotherboard,
  selectedCpu,
  onBack,
  onContinue,
}) => {
  const [brandFilter, setBrandFilter] = useState<string>('All');
  const [socketFilter, setSocketFilter] = useState<string>(selectedCpu.socket || 'All');

  // Filter boards
  const filteredBoards = useMemo(() => {
    return MOTHERBOARDS_DATABASE.filter(b => {
      const matchesBrand = brandFilter === 'All' || b.brand === brandFilter;
      const matchesSocket = socketFilter === 'All' || b.socket === socketFilter;
      return matchesBrand && matchesSocket;
    });
  }, [brandFilter, socketFilter]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-semibold mb-1">
          Step 3 of 6 · Motherboard Selection
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
          SELECT YOUR MOTHERBOARD
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl">
          Choose a motherboard with socket compatibility for your processor ({selectedCpu.model} uses {selectedCpu.socket}).
        </p>
      </div>

      {/* Socket Compatibility Hint Banner */}
      <div className="mb-6 p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              Target Socket: <span className="text-cyan-400 font-mono">{selectedCpu.socket}</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Filtered for boards compatible with your {selectedCpu.model}.
            </div>
          </div>
        </div>

        <button
          onClick={() => setSocketFilter('All')}
          className="text-xs text-slate-400 hover:text-white underline font-mono shrink-0"
        >
          {socketFilter === 'All' ? 'Showing All Sockets' : 'Show All Sockets'}
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#10141e]/90 border border-white/[0.08] rounded-2xl p-4 sm:p-5 mb-8 flex flex-wrap items-center justify-between gap-4 card-depth-3d text-xs">
        {/* Brand Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <span className="text-[11px] text-slate-500 font-mono uppercase tracking-wider mr-2">Brand:</span>
          {(['All', 'ASUS', 'MSI', 'Gigabyte', 'ASRock'] as const).map(b => (
            <button
              key={b}
              onClick={() => setBrandFilter(b)}
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

        {/* Socket Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar font-mono text-[11px]">
          <span className="text-[11px] text-slate-500 font-mono uppercase tracking-wider mr-2">Socket:</span>
          {['All', 'AM5', 'LGA1700', 'AM4', 'LGA1200'].map(s => (
            <button
              key={s}
              onClick={() => setSocketFilter(s)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                socketFilter === s
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Motherboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredBoards.map(board => {
          const isSelected = selectedMotherboard?.id === board.id;
          const isCompatible = board.socket === selectedCpu.socket;

          return (
            <div
              key={board.id}
              onClick={() => onSelectMotherboard(board)}
              className={`p-4 rounded-xl border transition-all cursor-pointer card-depth-3d flex flex-col justify-between group ${
                isSelected
                  ? 'bg-white/[0.08] border-cyan-500/60 shadow-lg ring-1 ring-cyan-500/40'
                  : 'bg-[#10141e] border-white/[0.07] hover:border-white/[0.18]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/[0.06] text-slate-300">
                    {board.brand}
                  </span>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    isCompatible ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30' : 'text-amber-400 bg-amber-950/40'
                  }`}>
                    {board.socket}
                  </span>
                </div>

                <h3 className="text-sm font-bold font-display text-white group-hover:text-cyan-300 transition-colors">
                  {board.model}
                </h3>

                <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <span>Chipset: {board.chipset}</span>
                  <span>·</span>
                  <span>{board.formFactor}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 text-[11px]">
                  {board.ramType} (up to {board.maxRamSpeedMhz} MHz)
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMotherboard(board);
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

      {/* Sticky Bottom Navigation Bar */}
      <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all btn-tactile"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to GPU</span>
        </button>

        <button
          onClick={onContinue}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold font-sans flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all btn-tactile"
        >
          <span>Continue to RAM</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
