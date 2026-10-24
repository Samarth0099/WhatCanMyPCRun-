import React from 'react';
import { GameFpsEstimate, VerdictBadge } from '../types/game';
import { CheckCircle2, XCircle, AlertTriangle, SlidersHorizontal, ArrowRight, Activity, Gauge, Star } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface GameCardProps {
  estimate: GameFpsEstimate;
  onOpenSettings: () => void;
  onOpenSeoDetails: () => void;
  tvMode: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  index?: number;
}

export const GameCard: React.FC<GameCardProps> = ({
  estimate,
  onOpenSettings,
  onOpenSeoDetails,
  tvMode,
  isFavorite = false,
  onToggleFavorite,
  index = 0,
}) => {
  const { 
    game, 
    resolution, 
    preset, 
    avgFpsMin, 
    avgFpsMax, 
    low1PercentMin, 
    low1PercentMax, 
    verdict, 
    bottleneckType, 
    vramSufficient, 
    vramRequiredGb, 
    warnings, 
    meetsMinimum 
  } = estimate;

  // Cyberpunk Titanium Benchmarking Verdict Config
  const verdictConfig: Record<VerdictBadge, { label: string; textClass: string; borderClass: string; bgClass: string; barColor: string; diodeClass: string }> = {
    high_refresh_120: {
      label: '120+ FPS HIGH REFRESH',
      textClass: 'text-cyan-300',
      borderClass: 'border-cyan-400/40',
      bgClass: 'bg-cyan-950/30',
      barColor: 'from-cyan-500 to-sky-400',
      diodeClass: 'bg-cyan-400 diode-pulse',
    },
    smooth_60: {
      label: '60+ FPS SMOOTH',
      textClass: 'text-emerald-300',
      borderClass: 'border-emerald-500/40',
      bgClass: 'bg-emerald-950/30',
      barColor: 'from-emerald-500 to-teal-400',
      diodeClass: 'bg-emerald-400 diode-pulse',
    },
    playable: {
      label: '30-59 FPS PLAYABLE',
      textClass: 'text-amber-300',
      borderClass: 'border-amber-500/40',
      bgClass: 'bg-amber-950/30',
      barColor: 'from-amber-500 to-yellow-400',
      diodeClass: 'bg-amber-400',
    },
    cant_run: {
      label: "<30 FPS LOW PERFORMANCE",
      textClass: 'text-rose-300',
      borderClass: 'border-rose-500/40',
      bgClass: 'bg-rose-950/30',
      barColor: 'from-rose-500 to-red-600',
      diodeClass: 'bg-rose-400',
    },
  };

  const vConfig = verdictConfig[verdict];
  const avgMidFps = Math.round((avgFpsMin + avgFpsMax) / 2);
  const barPercent = Math.min(Math.max((avgMidFps / 144) * 100, 8), 100);

  return (
    <ScrollReveal
      variant="card"
      delayMs={Math.min((index % 6) * 45, 250)}
      className="h-full"
    >
      <div
        className={`titanium-card p-5 sm:p-5 flex flex-col justify-between group select-none relative h-full ${
          tvMode ? 'ring-2 ring-cyan-400' : ''
        }`}
      >
      <div>
        {/* Header: Studio, Year, Engine, and Verdict */}
        <div className="flex items-start justify-between gap-2.5 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 truncate">
              <span className="truncate">{game.studio}</span>
              <span className="text-slate-600">·</span>
              <span>{game.releaseYear}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-500">{game.engine}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold font-heading text-white mt-0.5 group-hover:text-cyan-300 transition-colors truncate">
              {game.title}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Favorite Star Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite?.();
              }}
              aria-label={isFavorite ? `Remove ${game.title} from favorites` : `Add ${game.title} to favorites`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-amber-500/20 text-amber-400 border-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.35)]'
                  : 'bg-white/[0.03] text-slate-500 hover:text-amber-300 border-white/[0.08] hover:border-amber-400/40'
              }`}
            >
              <Star className={`w-3.5 h-3.5 transition-transform ${isFavorite ? 'fill-amber-400 scale-110' : ''}`} />
            </button>

            {/* Titanium Verdict Badge */}
            <div
              className={`px-2 py-0.8 rounded-lg text-[9px] font-mono font-bold border flex items-center gap-1.5 ${vConfig.bgClass} ${vConfig.textClass} ${vConfig.borderClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${vConfig.diodeClass}`} />
              <span>{vConfig.label}</span>
            </div>
          </div>
        </div>

        {/* Primary Metric: Big Tabular FPS Telemetry Display */}
        <div className="my-3.5 bg-black/40 border border-white/[0.05] rounded-xl p-3">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                ESTIMATED AVERAGE ({resolution} {preset})
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight tabular-nums">
                {avgFpsMin} – {avgFpsMax} <span className="text-xs font-sans font-normal text-slate-400">FPS</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                1% LOWS
              </div>
              <div className="text-sm sm:text-base font-bold font-mono text-slate-200 tabular-nums">
                {low1PercentMin} – {low1PercentMax} <span className="text-[10px] text-slate-500">FPS</span>
              </div>
            </div>
          </div>

          {/* Benchmark-Style Performance Gauge Bar */}
          <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden relative">
            {/* 60 FPS marker line */}
            <div className="absolute top-0 bottom-0 left-[41.6%] w-0.5 bg-white/30 z-10" title="60 FPS Baseline" />
            {/* 120 FPS marker line */}
            <div className="absolute top-0 bottom-0 left-[83.3%] w-0.5 bg-cyan-400/50 z-10" title="120 FPS Target" />
            
            <div
              className={`h-full rounded-full bg-gradient-to-r ${vConfig.barColor} transition-all duration-300`}
              style={{ width: `${barPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mt-1">
            <span>0</span>
            <span className="text-slate-400">60 FPS</span>
            <span className="text-cyan-400">120 FPS</span>
            <span>144+</span>
          </div>
        </div>

        {/* Clean Telemetry Strip */}
        <div className="pt-2 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5 text-[11px]">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                bottleneckType === 'Balanced' ? 'bg-emerald-400' :
                bottleneckType === 'GPU-Bound' ? 'bg-cyan-400' :
                bottleneckType === 'CPU-Bound' ? 'bg-amber-400' : 'bg-rose-400'
              }`} />
              <span className="text-slate-200">{bottleneckType}</span>
            </span>

            <span className="text-[11px]">
              VRAM: <span className={vramSufficient ? 'text-slate-200' : 'text-rose-400 font-semibold'}>~{vramRequiredGb} GB</span>
            </span>
          </div>

          {/* Requirements Compliance Strip */}
          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
            <span className="flex items-center gap-1">
              {meetsMinimum ? (
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Minimum Spec Met
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1 font-semibold">
                  <XCircle className="w-3 h-3" /> Below Minimum
                </span>
              )}
            </span>

            <span className="text-slate-400">
              DirectX 12 / Vulkan
            </span>
          </div>
        </div>

        {/* Warnings (if any VRAM or HDD stutter risk) */}
        {warnings.length > 0 && (
          <div className="mt-2.5 p-2 rounded-xl bg-amber-950/25 border border-amber-500/30 text-[10px] text-amber-200 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-tight">{warnings[0]}</div>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center gap-2">
        <button
          onClick={onOpenSettings}
          className="flex-1 py-2 px-3 rounded-xl btn-titanium-secondary text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <SlidersHorizontal className="w-3 h-3 text-cyan-400" />
          <span>Optimal Settings Guide</span>
        </button>

        <button
          onClick={onOpenSeoDetails}
          title="Full GPU vs Game Benchmark Breakdown"
          className="p-2 rounded-xl btn-titanium-secondary text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
    </ScrollReveal>
  );
};
