import React from 'react';
import { Game, GameFpsEstimate } from '../types/game';
import { SystemBuild } from '../types/hardware';
import { X, SlidersHorizontal, TrendingUp, HelpCircle, Check, Sparkles } from 'lucide-react';

interface GameSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
  estimate: GameFpsEstimate | null;
  build: SystemBuild;
}

export const GameSettingsModal: React.FC<GameSettingsModalProps> = ({
  isOpen,
  onClose,
  game,
  estimate,
  build,
}) => {
  if (!isOpen || !game || !estimate) return null;

  // Calculate cumulative potential FPS gain from all recommended setting optimizations
  const totalGainPercent = game.bestSettings.reduce((acc, s) => acc + s.fpsImpactPercent, 0);
  const potentialFpsMin = Math.round(estimate.avgFpsMin * (1 + (totalGainPercent * 0.007)));
  const potentialFpsMax = Math.round(estimate.avgFpsMax * (1 + (totalGainPercent * 0.007)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0e111a] border border-white/[0.08] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 mb-6 pr-8">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 shrink-0">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">
              Optimal Tuning Guide · {game.engine}
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-display text-white mt-0.5">
              {game.title} – Best In-Game Settings for Max FPS
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Tailored for {build.gpu.model} ({build.gpu.vramGb}GB VRAM) and {build.cpu.model}.
            </p>
          </div>
        </div>

        {/* Potential Framerate Boost Banner */}
        <div className="bg-[#10141e] border border-white/[0.06] rounded-xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Optimized Framerate Projection</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 max-w-md">
              Applying these settings preserves ~95% visual fidelity while eliminating costly render passes.
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
              {potentialFpsMin} – {potentialFpsMax} FPS
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              up from {estimate.avgFpsMin} – {estimate.avgFpsMax} FPS
            </div>
          </div>
        </div>

        {/* Setting by Setting Recommendations */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Ranked Performance-Sensitive Settings
          </h3>

          <div className="divide-y divide-white/[0.05] border border-white/[0.06] rounded-xl overflow-hidden bg-[#10141e]/70">
            {game.bestSettings.map((rec, idx) => (
              <div key={idx} className="p-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-white flex items-center gap-2">
                      <span>{rec.settingName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">→</span>
                      <span className="text-emerald-400 font-mono font-bold">{rec.recommendedValue}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {rec.explanation}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                      rec.fpsImpactPercent >= 20
                        ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                        : rec.fpsImpactPercent >= 12
                        ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30'
                        : 'bg-white/[0.05] text-slate-300 border border-white/[0.06]'
                    }`}>
                      +{rec.fpsImpactPercent}% FPS
                    </span>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">
                      {rec.impactCategory} Impact
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engine and Hardware Insights */}
        <div className="mt-5 p-4 rounded-xl bg-neutral-950/40 border border-neutral-800 text-xs space-y-1.5">
          <div className="font-semibold text-neutral-300">Engine Profile & Hardware Advice:</div>
          <div className="text-neutral-400 leading-relaxed">
            This title has a <span className="text-neutral-200 font-medium">{(game.engineProfile.gpuBias * 100).toFixed(0)}% GPU bias</span>.
            {game.engineProfile.vramSensitivity === 'High' && (
              <span> Watch out for high texture memory allocation; cards with under 8GB VRAM must lower textures to prevent micro-stuttering.</span>
            )}
            {game.engineProfile.supportsRayTracing && (
              <span> Ray tracing yields high photorealism but consumes 30-50% GPU raster time.</span>
            )}
            {game.engineProfile.supportsDLSS3FrameGen && build.gpu.supportsDLSS3FrameGen && (
              <span> NVIDIA DLSS 3 Frame Generation is supported on your RTX 40 series GPU.</span>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 text-[11px] text-neutral-500 leading-tight">
          Disclaimer: FPS figures are benchmark-derived estimates and may vary with Windows background applications, Nvidia/AMD driver updates, thermal throttling, and ongoing game patches.
        </div>
      </div>
    </div>
  );
};
