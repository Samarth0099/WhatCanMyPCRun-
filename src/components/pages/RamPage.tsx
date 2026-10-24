import React from 'react';
import { Layers, ArrowLeft, ArrowRight, Check, AlertTriangle, Sparkles } from 'lucide-react';
import { RAMConfig, Motherboard } from '../../types/hardware';
import { RAM_PRESETS } from '../../data/otherHardware';

interface RamPageProps {
  selectedRam: RAMConfig;
  onSelectRam: (ram: RAMConfig) => void;
  selectedMotherboard?: Motherboard;
  onBack: () => void;
  onContinue: () => void;
}

export const RamPage: React.FC<RamPageProps> = ({
  selectedRam,
  onSelectRam,
  selectedMotherboard,
  onBack,
  onContinue,
}) => {
  const isSingleChannel = selectedRam.channels === 1;
  const isBelow16Gb = selectedRam.capacityGb < 16;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-semibold mb-1">
          Step 4 of 6 · Memory Configuration
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
          SELECT YOUR RAM
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl">
          Configure system memory. Dual-channel memory increases 1% low framerate stability by preventing memory bus contention.
        </p>
      </div>

      {/* Advisory Warnings if any */}
      {isSingleChannel && (
        <div className="mb-6 p-4 rounded-xl bg-amber-950/25 border border-amber-500/30 text-amber-200 flex items-start gap-3 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Single Channel Performance Warning:</span> Single-channel RAM cuts memory bandwidth in half, which can cause micro-stutters and drops in 1% low framerates in CPU-bound games. Dual channel is strongly recommended.
          </div>
        </div>
      )}

      {isBelow16Gb && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/25 border border-rose-500/30 text-rose-200 flex items-start gap-3 text-xs">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Low Capacity Warning:</span> 8GB RAM will hit swap memory limits in modern AAA games (e.g. Cyberpunk 2077, Hogwarts Legacy, Starfield), causing heavy stuttering. 16GB or 32GB is recommended.
          </div>
        </div>
      )}

      {/* Current Configuration Summary Strip */}
      <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">Active Memory Rig</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {selectedRam.capacityGb}GB {selectedRam.type} @ {selectedRam.speedMhz} MHz · {selectedRam.channels === 2 ? 'Dual Channel' : selectedRam.channels === 4 ? 'Quad Channel' : 'Single Channel'}
            </div>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-300 hidden sm:block">
          Bandwidth: ~{(selectedRam.speedMhz * 8 * selectedRam.channels / 1000).toFixed(1)} GB/s
        </div>
      </div>

      {/* Popular Presets Grid */}
      <div className="mb-8">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Recommended Memory Kits</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RAM_PRESETS.map((preset, idx) => {
            const isSelected =
              selectedRam.capacityGb === preset.capacityGb &&
              selectedRam.type === preset.type &&
              selectedRam.speedMhz === preset.speedMhz &&
              selectedRam.channels === preset.channels;

            return (
              <div
                key={idx}
                onClick={() => onSelectRam(preset)}
                className={`p-4 rounded-xl border transition-all cursor-pointer card-depth-3d flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-white/[0.08] border-cyan-500/60 shadow-lg ring-1 ring-cyan-500/40'
                    : 'bg-[#10141e] border-white/[0.07] hover:border-white/[0.18]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      preset.type === 'DDR5' ? 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/30' : 'bg-purple-950/40 text-purple-300 border border-purple-500/30'
                    }`}>
                      {preset.type}
                    </span>

                    <span className="text-[11px] font-mono text-slate-400">
                      {preset.channels === 2 ? '2x Sticks (Dual)' : '1x Stick (Single)'}
                    </span>
                  </div>

                  <h4 className="text-base font-bold font-display text-white group-hover:text-cyan-300 transition-colors">
                    {preset.capacityGb} GB Memory Kit
                  </h4>

                  <div className="text-xs text-slate-400 mt-1 font-mono">
                    {preset.speedMhz} MHz Speed
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">
                    {preset.capacityGb >= 32 ? 'High-End / AAA' : preset.capacityGb === 16 ? 'Mainstream Standard' : 'Entry Budget'}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRam(preset);
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
      </div>

      {/* Manual Capacity & Channel Controls */}
      <div className="bg-[#10141e]/80 border border-white/[0.08] rounded-2xl p-5 mb-8 card-depth-3d space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
          Custom Capacity & Generation Toggles
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Capacity */}
          <div>
            <label className="block text-slate-400 font-mono text-[11px] mb-2">Capacity</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[8, 16, 32, 64].map(cap => (
                <button
                  key={cap}
                  onClick={() => onSelectRam({ ...selectedRam, capacityGb: cap })}
                  className={`py-2 rounded-lg font-bold font-mono transition-colors ${
                    selectedRam.capacityGb === cap
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
                  }`}
                >
                  {cap}G
                </button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="block text-slate-400 font-mono text-[11px] mb-2">Generation</label>
            <div className="grid grid-cols-2 gap-2">
              {(['DDR4', 'DDR5'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => onSelectRam({
                    ...selectedRam,
                    type,
                    speedMhz: type === 'DDR5' ? 6000 : 3200,
                  })}
                  className={`py-2 rounded-lg font-bold font-mono transition-colors ${
                    selectedRam.type === type
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Channels */}
          <div>
            <label className="block text-slate-400 font-mono text-[11px] mb-2">Channel Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSelectRam({ ...selectedRam, channels: 2 })}
                className={`py-2 rounded-lg font-bold font-mono transition-colors text-[11px] ${
                  selectedRam.channels === 2
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                Dual Channel (2x)
              </button>
              <button
                onClick={() => onSelectRam({ ...selectedRam, channels: 1 })}
                className={`py-2 rounded-lg font-bold font-mono transition-colors text-[11px] ${
                  selectedRam.channels === 1
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                Single Channel (1x)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Navigation Bar */}
      <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all btn-tactile"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to Motherboard</span>
        </button>

        <button
          onClick={onContinue}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold font-sans flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all btn-tactile"
        >
          <span>Continue to Storage</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
