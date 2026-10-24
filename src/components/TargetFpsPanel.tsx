import React, { useState } from 'react';
import { Game, Resolution, QualityPreset, UpscalerMode } from '../types/game';
import { SystemBuild } from '../types/hardware';
import { GAMES_DATABASE } from '../data/games';
import { estimateGamePerformance } from '../services/estimationEngine';
import { Target, CheckCircle, Sliders, Zap, AlertCircle } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface TargetFpsPanelProps {
  build: SystemBuild;
  onOpenSettings: (game: Game) => void;
}

interface TargetResolutionOption {
  game: Game;
  resolution: Resolution;
  preset: QualityPreset;
  upscaler: UpscalerMode;
  achievedFpsMin: number;
  achievedFpsMax: number;
  meetsTarget: boolean;
  strategy: string;
}

export const TargetFpsPanel: React.FC<TargetFpsPanelProps> = ({
  build,
  onOpenSettings,
}) => {
  const [targetFps, setTargetFps] = useState<60 | 120 | 144>(60);

  // For each game, find the optimal visual fidelity that hits the target FPS
  const recommendations: TargetResolutionOption[] = GAMES_DATABASE.map(game => {
    // Try highest quality combinations first (4K Ultra down to 1080p Low + Upscaler)
    const combinations: { res: Resolution; preset: QualityPreset; upscaler: UpscalerMode; strategy: string }[] = [
      { res: '4K', preset: 'Ultra', upscaler: 'Off', strategy: '4K Ultra Native' },
      { res: '4K', preset: 'High', upscaler: build.gpu.supportsDLSS ? 'DLSS_Quality' : 'FSR_Quality', strategy: '4K High with Upscaling' },
      { res: '1440p', preset: 'Ultra', upscaler: 'Off', strategy: '1440p Ultra Native' },
      { res: '1440p', preset: 'High', upscaler: 'Off', strategy: '1440p High Native' },
      { res: '1440p', preset: 'Medium', upscaler: build.gpu.supportsDLSS ? 'DLSS_Quality' : 'FSR_Quality', strategy: '1440p Medium + Upscaler' },
      { res: '1080p', preset: 'Ultra', upscaler: 'Off', strategy: '1080p Ultra Native' },
      { res: '1080p', preset: 'High', upscaler: 'Off', strategy: '1080p High Native' },
      { res: '1080p', preset: 'High', upscaler: build.gpu.supportsDLSS ? 'DLSS_Quality' : 'FSR_Quality', strategy: '1080p High + Upscaler' },
      { res: '1080p', preset: 'Medium', upscaler: build.gpu.supportsDLSS ? 'DLSS_Quality' : 'FSR_Quality', strategy: '1080p Medium + Upscaler' },
      { res: '1080p', preset: 'Low', upscaler: 'Frame_Gen', strategy: '1080p Low + Frame Gen' },
      { res: '1080p', preset: 'Low', upscaler: build.gpu.supportsDLSS ? 'DLSS_Performance' : 'FSR_Balanced', strategy: '1080p Low + Performance Upscaler' },
    ];

    let bestOption: TargetResolutionOption | null = null;

    for (const combo of combinations) {
      const est = estimateGamePerformance({
        game,
        cpu: build.cpu,
        gpu: build.gpu,
        ram: build.ram,
        storage: build.storage,
        cooler: build.cooler,
        resolution: combo.res,
        preset: combo.preset,
        upscaler: combo.upscaler,
      });

      if (est.avgFpsMin >= targetFps) {
        bestOption = {
          game,
          resolution: combo.res,
          preset: combo.preset,
          upscaler: combo.upscaler,
          achievedFpsMin: est.avgFpsMin,
          achievedFpsMax: est.avgFpsMax,
          meetsTarget: true,
          strategy: combo.strategy,
        };
        break;
      }
    }

    if (!bestOption) {
      const lowestEst = estimateGamePerformance({
        game,
        cpu: build.cpu,
        gpu: build.gpu,
        ram: build.ram,
        resolution: '1080p',
        preset: 'Low',
        upscaler: build.gpu.supportsDLSS ? 'DLSS_Performance' : 'FSR_Balanced',
      });

      bestOption = {
        game,
        resolution: '1080p',
        preset: 'Low',
        upscaler: build.gpu.supportsDLSS ? 'DLSS_Performance' : 'FSR_Balanced',
        achievedFpsMin: lowestEst.avgFpsMin,
        achievedFpsMax: lowestEst.avgFpsMax,
        meetsTarget: false,
        strategy: 'Max optimization at 1080p Low',
      };
    }

    return bestOption;
  });

  return (
    <div className="space-y-6 select-none">
      {/* Target FPS Selector Header */}
      <ScrollReveal variant="slide-up">
        <div className="titanium-card p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <h2 className="text-base sm:text-lg font-bold font-heading text-white uppercase tracking-wide">
                TARGET FPS RESOLUTION & PRESET SOLVER
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
              Choose your framerate target; our solver determines the highest visual fidelity and resolution your PC can sustain.
            </p>
          </div>

          {/* Target Buttons */}
          <div className="flex items-center gap-1.5 shrink-0 bg-black/40 p-1 rounded-xl border border-white/[0.06]">
            <span className="text-[11px] text-slate-400 font-mono px-2">Target:</span>
            {([60, 120, 144] as const).map(fps => (
              <button
                key={fps}
                onClick={() => setTargetFps(fps)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                  targetFps === fps
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {fps} FPS
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {recommendations.map((item, idx) => (
          <ScrollReveal
            key={item.game.id}
            variant="card"
            delayMs={Math.min((idx % 9) * 35, 240)}
            className="h-full"
          >
            <div className="titanium-card p-5 flex flex-col justify-between group shadow-lg h-full">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="text-[10px] text-slate-500 font-mono uppercase">{item.game.genre}</div>
                    <h3 className="text-sm sm:text-base font-bold font-heading text-white group-hover:text-cyan-300 transition-colors mt-0.5">
                      {item.game.title}
                    </h3>
                  </div>

                  <div className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold shrink-0 border ${
                    item.meetsTarget
                      ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/40'
                      : 'bg-rose-950/30 text-rose-300 border-rose-500/40'
                  }`}>
                    {item.meetsTarget ? `Target Met` : `Below Target`}
                  </div>
                </div>

                {/* Achieved Setting Recommendation */}
                <div className="mt-3 p-3 bg-black/40 rounded-xl border border-white/[0.05]">
                  <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Recommended Preset:</div>
                  <div className="text-xs font-bold text-cyan-300 mt-0.5">
                    {item.strategy}
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold font-mono text-white tabular-nums mt-1">
                    {item.achievedFpsMin} – {item.achievedFpsMax} <span className="text-xs font-normal text-slate-400 font-sans">FPS</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500 font-mono">
                  {item.game.engine}
                </span>
                <button
                  onClick={() => onOpenSettings(item.game)}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Tuning Guide →
                </button>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
};
