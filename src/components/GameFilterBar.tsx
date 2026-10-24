import React from 'react';
import { Resolution, QualityPreset, UpscalerMode, VerdictBadge } from '../types/game';
import { Search, Monitor, Gauge, Filter, SlidersHorizontal, Star } from 'lucide-react';

interface GameFilterBarProps {
  resolution: Resolution;
  onChangeResolution: (res: Resolution) => void;
  preset: QualityPreset;
  onChangePreset: (preset: QualityPreset) => void;
  upscaler: UpscalerMode;
  onChangeUpscaler: (upscaler: UpscalerMode) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedStudio: string;
  onSelectStudio: (studio: string) => void;
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
  selectedVerdict: VerdictBadge | 'All';
  onSelectVerdict: (v: VerdictBadge | 'All') => void;
  studios: string[];
  genres: string[];
  gpuSupportsDlss: boolean;
  gpuSupportsDlss3Fg: boolean;
  favoritesOnly: boolean;
  onToggleFavoritesOnly: (val: boolean) => void;
  favoriteCount: number;
}

export const GameFilterBar: React.FC<GameFilterBarProps> = ({
  resolution,
  onChangeResolution,
  preset,
  onChangePreset,
  upscaler,
  onChangeUpscaler,
  searchQuery,
  onSearchChange,
  selectedStudio,
  onSelectStudio,
  selectedGenre,
  onSelectGenre,
  selectedVerdict,
  onSelectVerdict,
  studios,
  genres,
  gpuSupportsDlss,
  gpuSupportsDlss3Fg,
  favoritesOnly,
  onToggleFavoritesOnly,
  favoriteCount,
}) => {
  return (
    <div className="titanium-glass-panel rounded-2xl p-4 sm:p-5 mb-6 space-y-3.5 select-none shadow-xl">
      {/* Top Row: Resolution, Preset, Upscaler, and Live Filter */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Resolution Tabs */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/[0.06]">
          <Monitor className="w-3.5 h-3.5 text-cyan-400 ml-2 mr-1 hidden sm:block" />
          {(['1080p', '1440p', '4K'] as Resolution[]).map(res => (
            <button
              key={res}
              onClick={() => onChangeResolution(res)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                resolution === res
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {res}
            </button>
          ))}
        </div>

        {/* Quality Preset Tabs */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/[0.06]">
          <Gauge className="w-3.5 h-3.5 text-violet-400 ml-2 mr-1 hidden sm:block" />
          {(['Low', 'Medium', 'High', 'Ultra'] as QualityPreset[]).map(p => (
            <button
              key={p}
              onClick={() => onChangePreset(p)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                preset === p
                  ? 'bg-white/[0.12] text-white border border-white/[0.2] shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Upscaler Selector */}
        <div className="flex items-center gap-2">
          <select
            aria-label="Select Upscaling and Frame Generation Mode"
            value={upscaler}
            onChange={(e) => onChangeUpscaler(e.target.value as UpscalerMode)}
            className="bg-black/40 border border-white/[0.08] hover:border-cyan-400/40 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer font-mono"
          >
            <option value="Off" className="bg-[#0b0e16] text-slate-200">Native Resolution (Off)</option>
            {gpuSupportsDlss && <option value="DLSS_Quality" className="bg-[#0b0e16] text-slate-200">NVIDIA DLSS (Quality)</option>}
            {gpuSupportsDlss && <option value="DLSS_Balanced" className="bg-[#0b0e16] text-slate-200">NVIDIA DLSS (Balanced)</option>}
            <option value="FSR_Quality" className="bg-[#0b0e16] text-slate-200">AMD FSR (Quality)</option>
            <option value="FSR_Balanced" className="bg-[#0b0e16] text-slate-200">AMD FSR (Balanced)</option>
            <option value="XeSS_Quality" className="bg-[#0b0e16] text-slate-200">Intel XeSS (Quality)</option>
            <option value="Frame_Gen" className="bg-[#0b0e16] text-slate-200">
              {gpuSupportsDlss3Fg ? 'DLSS 3 Frame Gen' : 'FSR 3 Frame Gen'} (+55% FPS)
            </option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search game titles..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-black/40 border border-white/[0.08] rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 font-mono"
          />
        </div>
      </div>

      {/* Bottom Row: All/Favorites Toggle, Studio, Genre, Verdict Filters */}
      <div className="flex flex-wrap items-center justify-between pt-2.5 border-t border-white/[0.06] gap-2.5 text-xs font-mono">
        {/* Left side: Favorites Toggle, Studio, Genre */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle All vs Favorite Games */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/[0.08]">
            <button
              type="button"
              onClick={() => onToggleFavoritesOnly(false)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                !favoritesOnly
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Games
            </button>
            <button
              type="button"
              onClick={() => onToggleFavoritesOnly(true)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                favoritesOnly
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-amber-300' : ''}`} />
              <span>Favorite Games</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                favoritesOnly ? 'bg-amber-400/25 text-amber-300 font-bold' : 'bg-white/[0.08] text-slate-400'
              }`}>
                {favoriteCount}
              </span>
            </button>
          </div>

          {/* Studio and Genre selects */}
          <select
            aria-label="Filter games by Studio or Publisher"
            value={selectedStudio}
            onChange={(e) => onSelectStudio(e.target.value)}
            className="bg-black/40 border border-white/[0.08] rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none cursor-pointer hover:border-white/[0.2]"
          >
            <option value="All" className="bg-[#0b0e16] text-slate-200">All Studios</option>
            {studios.map(s => (
              <option key={s} value={s} className="bg-[#0b0e16] text-slate-200">{s}</option>
            ))}
          </select>

          <select
            aria-label="Filter games by Genre"
            value={selectedGenre}
            onChange={(e) => onSelectGenre(e.target.value)}
            className="bg-black/40 border border-white/[0.08] rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none cursor-pointer hover:border-white/[0.2]"
          >
            <option value="All" className="bg-[#0b0e16] text-slate-200">All Genres</option>
            {genres.map(g => (
              <option key={g} value={g} className="bg-[#0b0e16] text-slate-200">{g}</option>
            ))}
          </select>
        </div>

        {/* Verdict Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'All', label: 'All Verdicts' },
            { id: 'smooth_60', label: '60+ Smooth' },
            { id: 'high_refresh_120', label: '120+ High Refresh' },
            { id: 'playable', label: '30+ Playable' },
            { id: 'cant_run', label: "Can't Run" },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => onSelectVerdict(item.id as VerdictBadge | 'All')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                selectedVerdict === item.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 bg-black/20 border border-white/[0.04]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
