import React, { useState } from 'react';
import { GPUS_DATABASE } from '../data/gpus';
import { GAMES_DATABASE } from '../data/games';
import { CPUS_DATABASE } from '../data/cpus';
import { estimateGamePerformance } from '../services/estimationEngine';
import { X, Search, CheckCircle2, AlertTriangle, ArrowRight, Share2, HelpCircle } from 'lucide-react';

interface SeoLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGpuId?: string;
  initialGameId?: string;
}

export const SeoLookupModal: React.FC<SeoLookupModalProps> = ({
  isOpen,
  onClose,
  initialGpuId,
  initialGameId,
}) => {
  const [selectedGpuId, setSelectedGpuId] = useState(initialGpuId || 'nvidia-geforce-rtx-3060-12gb');
  const [selectedGameId, setSelectedGameId] = useState(initialGameId || 'black-myth-wukong');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const gpu = GPUS_DATABASE.find(g => g.id === selectedGpuId) || GPUS_DATABASE[17];
  const game = GAMES_DATABASE.find(g => g.id === selectedGameId) || GAMES_DATABASE[5];
  // Standard typical reference CPU (Ryzen 5 5600)
  const cpu = CPUS_DATABASE.find(c => c.id === 'amd-ryzen-5-5600') || CPUS_DATABASE[15];

  // Estimates across 1080p and 1440p
  const est1080p = estimateGamePerformance({
    game,
    cpu,
    gpu,
    ram: { capacityGb: 16, type: 'DDR4', speedMhz: 3200, channels: 2 },
    resolution: '1080p',
    preset: 'High',
    upscaler: gpu.supportsDLSS ? 'DLSS_Quality' : 'FSR_Quality',
  });

  const est1440p = estimateGamePerformance({
    game,
    cpu,
    gpu,
    ram: { capacityGb: 16, type: 'DDR4', speedMhz: 3200, channels: 2 },
    resolution: '1440p',
    preset: 'Medium',
    upscaler: gpu.supportsDLSS ? 'DLSS_Quality' : 'FSR_Quality',
  });

  const pageTitle = `Can ${gpu.model} Run ${game.title}?`;
  const seoUrl = `${window.location.origin}${window.location.pathname}#/gpu/${gpu.id}/game/${game.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(seoUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPlayable = est1080p.avgFpsMin >= 30;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0e111a] border border-white/[0.08] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
          Direct Hardware Performance Query
        </div>
        <h1 className="text-xl sm:text-2xl font-bold font-display text-white pr-8">
          {pageTitle}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Benchmark results, expected framerates, VRAM limits, and optimization guides.
        </p>

        {/* Quick Query Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5 p-3.5 bg-[#10141e] rounded-xl border border-white/[0.06]">
          <div>
            <label className="block text-[11px] text-slate-400 font-mono mb-1.5">Choose Graphics Card</label>
            <select
              aria-label="Select Graphics Card for SEO lookup"
              value={selectedGpuId}
              onChange={(e) => setSelectedGpuId(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.08] text-slate-100 rounded-lg p-2 text-xs focus:outline-none"
            >
              {GPUS_DATABASE.map(g => (
                <option key={g.id} value={g.id} className="bg-slate-900 text-slate-200">{g.model} ({g.vramGb}GB)</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 font-mono mb-1.5">Choose Game Title</label>
            <select
              aria-label="Select Game Title for SEO lookup"
              value={selectedGameId}
              onChange={(e) => setSelectedGameId(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.08] text-slate-100 rounded-lg p-2 text-xs focus:outline-none"
            >
              {GAMES_DATABASE.map(gm => (
                <option key={gm.id} value={gm.id} className="bg-slate-900 text-slate-200">{gm.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Direct Verdict Box */}
        <div className={`p-4 sm:p-5 rounded-xl border mb-5 ${
          isPlayable
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
            : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
        }`}>
          <div className="text-base font-bold font-display flex items-center gap-2.5">
            {isPlayable ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-rose-400" />}
            <span>
              {isPlayable
                ? `Yes, the ${gpu.model} can run ${game.title}!`
                : `The ${gpu.model} will struggle to run ${game.title}.`}
            </span>
          </div>
          <div className="text-xs text-slate-300 mt-2 leading-relaxed">
            At <span className="font-semibold text-white">1080p High</span> with {gpu.supportsDLSS ? 'DLSS Quality' : 'FSR Quality'}, you can expect approximately{' '}
            <span className="font-mono font-bold text-white tabular-nums">{est1080p.avgFpsMin} – {est1080p.avgFpsMax} FPS</span> with 1% lows of{' '}
            <span className="font-mono text-white tabular-nums">{est1080p.low1PercentMin} – {est1080p.low1PercentMax} FPS</span>.
          </div>
        </div>

        {/* Resolution Benchmarks Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div className="bg-[#10141e] border border-white/[0.06] rounded-xl p-4">
            <div className="text-[11px] text-slate-400 font-mono">1080p High Benchmark</div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums mt-0.5">
              {est1080p.avgFpsMin} – {est1080p.avgFpsMax} FPS
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Verdict: <span className="text-slate-300 font-semibold">{est1080p.verdict.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="bg-[#10141e] border border-white/[0.06] rounded-xl p-4">
            <div className="text-[11px] text-slate-400 font-mono">1440p Medium Benchmark</div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums mt-0.5">
              {est1440p.avgFpsMin} – {est1440p.avgFpsMax} FPS
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Verdict: <span className="text-slate-300 font-semibold">{est1440p.verdict.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Top 3 Recommended In-Game Settings */}
        <div className="mb-5">
          <div className="text-xs font-bold text-slate-300 mb-2 font-mono uppercase tracking-wider">
            Recommended In-Game Settings for {gpu.model}:
          </div>
          <div className="space-y-2 text-xs">
            {game.bestSettings.slice(0, 3).map((rec, i) => (
              <div key={i} className="p-3 rounded-lg bg-[#10141e] border border-white/[0.06] flex justify-between items-center gap-2">
                <div>
                  <span className="font-semibold text-white">{rec.settingName}:</span>{' '}
                  <span className="text-emerald-400 font-mono font-medium">{rec.recommendedValue}</span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">+{rec.fpsImpactPercent}% FPS</span>
              </div>
            ))}
          </div>
        </div>

        {/* Share Permalink for SEO */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] text-xs text-slate-400">
          <div className="truncate pr-2 font-mono text-[11px]">
            {seoUrl}
          </div>
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-medium flex items-center gap-1.5 shrink-0 transition-colors border border-white/[0.07] btn-tactile"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Link Copied!' : 'Copy SEO Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
