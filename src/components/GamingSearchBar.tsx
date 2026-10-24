import React, { useState, useRef, useEffect, useMemo } from 'react';
import { CPUS_DATABASE } from '../data/cpus';
import { GPUS_DATABASE } from '../data/gpus';
import { GAMES_DATABASE } from '../data/games';
import { PREBUILT_SYSTEMS } from '../data/otherHardware';
import { SystemBuild, CPU, GPU } from '../types/hardware';
import { Game } from '../types/game';
import { Search, Cpu, Zap, Gamepad2, Layers, Check, Sparkles, X, ChevronRight, Wrench, Monitor } from 'lucide-react';

interface GamingSearchBarProps {
  build: SystemBuild;
  onUpdateBuild: (updated: SystemBuild) => void;
  onSelectGame: (game: Game) => void;
  onOpenCustomPartModal: () => void;
  onOpenCompare: () => void;
}

export const GamingSearchBar: React.FC<GamingSearchBarProps> = ({
  build,
  onUpdateBuild,
  onSelectGame,
  onOpenCustomPartModal,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [vendorFilter, setVendorFilter] = useState<'All' | 'Nvidia' | 'AMD' | 'ASUS' | 'MSI' | 'Gigabyte' | 'AORUS'>('All');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search Results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    // Filter GPUs
    let gpus = GPUS_DATABASE;
    if (vendorFilter !== 'All') {
      gpus = gpus.filter(g =>
        g.brand === vendorFilter ||
        g.partnerBrand === vendorFilter ||
        g.model.toLowerCase().includes(vendorFilter.toLowerCase())
      );
    }
    if (q) {
      gpus = gpus.filter(g =>
        g.model.toLowerCase().includes(q) ||
        g.series.toLowerCase().includes(q) ||
        g.brand.toLowerCase().includes(q) ||
        (g.partnerBrand && g.partnerBrand.toLowerCase().includes(q))
      );
    }
    const filteredGpus = gpus.slice(0, 8);

    // Filter CPUs
    let cpus = CPUS_DATABASE;
    if (q) {
      cpus = cpus.filter(c =>
        c.model.toLowerCase().includes(q) ||
        c.series.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q)
      );
    }
    const filteredCpus = cpus.slice(0, 6);

    // Filter Games
    let games = GAMES_DATABASE;
    if (q) {
      games = games.filter(gm =>
        gm.title.toLowerCase().includes(q) ||
        gm.studio.toLowerCase().includes(q) ||
        gm.genre.toLowerCase().includes(q)
      );
    }
    const filteredGames = games.slice(0, 6);

    // Filter Prebuilts
    let prebuilts = PREBUILT_SYSTEMS;
    if (q) {
      prebuilts = prebuilts.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    const filteredPrebuilts = prebuilts.slice(0, 3);

    return {
      gpus: filteredGpus,
      cpus: filteredCpus,
      games: filteredGames,
      prebuilts: filteredPrebuilts,
    };
  }, [query, vendorFilter]);

  const hasResults = results.gpus.length > 0 || results.cpus.length > 0 || results.games.length > 0 || results.prebuilts.length > 0;

  return (
    <div className="relative z-30 mb-10" ref={containerRef}>
      {/* Floating 3D Minimalist Search Capsule */}
      <div className="relative">
        <div className="relative bg-[#10141e]/90 border border-white/[0.08] hover:border-white/[0.16] rounded-2xl p-2.5 sm:p-3 shadow-[0_16px_36px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-all">
          <div className="flex items-center gap-3">
            {/* Search Affordance */}
            <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-slate-300 shrink-0">
              <Search className="w-4 h-4" />
            </div>

            {/* Smart Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder="Search any GPU, CPU, Game, or Brand (e.g. 'RTX 4070', '7800X3D', 'ASUS', 'MSI', 'Wukong')..."
                className="w-full bg-transparent text-sm sm:text-base font-normal text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>

            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Manual Part Entry Link */}
            <button
              onClick={onOpenCustomPartModal}
              title="Manual Part Entry"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] text-slate-300 text-xs font-medium border border-white/[0.07] transition-colors shrink-0 btn-tactile"
            >
              <Wrench className="w-3.5 h-3.5 text-slate-400" />
              <span>Custom Specs</span>
            </button>
          </div>

          {/* Clean Brand Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pt-2.5 mt-1 border-t border-white/[0.05] no-scrollbar text-xs">
            <span className="text-[11px] text-slate-500 font-mono uppercase tracking-wider shrink-0 mr-1.5">
              Brand:
            </span>
            {(['All', 'Nvidia', 'AMD', 'ASUS', 'MSI', 'Gigabyte', 'AORUS'] as const).map(brand => (
              <button
                key={brand}
                onClick={() => {
                  setVendorFilter(brand);
                  setIsOpen(true);
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
                  vendorFilter === brand
                    ? 'bg-white/[0.12] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Search Results Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-[#12151f]/95 backdrop-blur-2xl border border-white/[0.1] rounded-2xl shadow-[0_24px_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden z-50 p-3 sm:p-4 max-h-[72vh] overflow-y-auto divide-y divide-white/[0.06] animate-in fade-in duration-150">
          {!hasResults ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching component or game found for "<span className="text-white font-medium">{query}</span>".
              <div className="mt-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenCustomPartModal();
                  }}
                  className="text-cyan-400 font-medium hover:underline"
                >
                  Enter manual specifications instead →
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Ready-to-Game Rigs */}
              {results.prebuilts.length > 0 && (
                <div className="pb-3 mb-1">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Quick Reference Rigs</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {results.prebuilts.map(p => (
                      <button
                        key={p.name}
                        onClick={() => {
                          onUpdateBuild(p.build);
                          setIsOpen(false);
                          setQuery('');
                        }}
                        className="text-left p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] transition-colors group"
                      >
                        <div className="text-xs font-semibold text-white group-hover:text-cyan-300 truncate">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {p.build.gpu.model} · {p.build.cpu.model}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Graphics Cards (GPUs) */}
              {results.gpus.length > 0 && (
                <div className="py-3">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Graphics Cards ({results.gpus.length})</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans normal-case">Click to equip</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.gpus.map(gpu => (
                      <button
                        key={gpu.id}
                        onClick={() => {
                          onUpdateBuild({ ...build, gpu });
                          setIsOpen(false);
                          setQuery('');
                        }}
                        className={`text-left p-2.5 rounded-xl border transition-all flex items-center justify-between group ${
                          build.gpu.id === gpu.id
                            ? 'bg-white/[0.08] border-cyan-500/40 text-white shadow-sm'
                            : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05] text-slate-300'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="text-xs font-medium group-hover:text-white truncate flex items-center gap-1.5">
                            {gpu.partnerBrand && (
                              <span className="px-1.5 py-0.2 rounded bg-white/[0.06] text-[10px] text-slate-300 font-mono">
                                {gpu.partnerBrand}
                              </span>
                            )}
                            <span className="truncate">{gpu.model}</span>
                            <span className="text-[11px] text-slate-400 font-mono shrink-0">
                              ({gpu.vramGb}GB)
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                            Score: {gpu.scoreRaster} · {gpu.series} · {gpu.tdpWatts}W
                          </div>
                        </div>
                        {build.gpu.id === gpu.id ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-medium shrink-0">
                            Equipped
                          </span>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Processors (CPUs) */}
              {results.cpus.length > 0 && (
                <div className="py-3">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-purple-400">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Processors ({results.cpus.length})</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans normal-case">Click to equip</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.cpus.map(cpu => (
                      <button
                        key={cpu.id}
                        onClick={() => {
                          onUpdateBuild({ ...build, cpu });
                          setIsOpen(false);
                          setQuery('');
                        }}
                        className={`text-left p-2.5 rounded-xl border transition-all flex items-center justify-between group ${
                          build.cpu.id === cpu.id
                            ? 'bg-white/[0.08] border-purple-500/40 text-white shadow-sm'
                            : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05] text-slate-300'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="text-xs font-medium group-hover:text-white truncate">
                            {cpu.model}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {cpu.cores}C/{cpu.threads}T · {cpu.socket} · Gaming: {cpu.gamingScore}
                          </div>
                        </div>
                        {build.cpu.id === cpu.id ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-medium shrink-0">
                            Equipped
                          </span>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Games */}
              {results.games.length > 0 && (
                <div className="pt-3">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Gamepad2 className="w-3.5 h-3.5 text-pink-400" />
                    <span>Games</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.games.map(game => (
                      <button
                        key={game.id}
                        onClick={() => {
                          onSelectGame(game);
                          setIsOpen(false);
                          setQuery('');
                        }}
                        className="text-left p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] transition-colors flex items-center justify-between group"
                      >
                        <div className="truncate pr-2">
                          <div className="text-xs font-medium text-white group-hover:text-pink-300 truncate">
                            {game.title}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {game.studio} · {game.genre}
                          </div>
                        </div>
                        <span className="text-xs font-medium text-slate-300 group-hover:text-white shrink-0 font-mono">
                          Inspect →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Equipped Hardware Strip — Minimalist Single-Elevation Layer */}
      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 select-none">
        {/* GPU Chip */}
        <div
          onClick={() => {
            setQuery('');
            setIsOpen(true);
          }}
          className="titanium-card p-3 sm:p-3.5 cursor-pointer transition-all group"
        >
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Zap className="w-3 h-3" />
              <span>Graphics</span>
            </span>
            <span className="text-[9px] text-slate-500 group-hover:text-cyan-300 font-mono transition-colors">SWAP ▾</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-white truncate mt-1">
            {build.gpu.model}
          </div>
          <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
            {build.gpu.vramGb}GB {build.gpu.vramType}
          </div>
        </div>

        {/* CPU Chip */}
        <div
          onClick={() => {
            setQuery('Ryzen');
            setIsOpen(true);
          }}
          className="titanium-card p-3 sm:p-3.5 cursor-pointer transition-all group"
        >
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-violet-400">
              <Cpu className="w-3 h-3" />
              <span>Processor</span>
            </span>
            <span className="text-[9px] text-slate-500 group-hover:text-violet-300 font-mono transition-colors">SWAP ▾</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-white truncate mt-1">
            {build.cpu.model}
          </div>
          <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
            {build.cpu.cores}C / {build.cpu.threads}T
          </div>
        </div>

        {/* RAM Chip */}
        <div
          onClick={() => {
            const newCap = build.ram.capacityGb === 32 ? 16 : 32;
            onUpdateBuild({
              ...build,
              ram: {
                ...build.ram,
                capacityGb: newCap,
                type: newCap === 32 ? 'DDR5' : 'DDR4',
                speedMhz: newCap === 32 ? 6000 : 3200,
                channels: 2,
              },
            });
          }}
          className="titanium-card p-3 sm:p-3.5 cursor-pointer transition-all group"
        >
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <Layers className="w-3 h-3" />
              <span>Memory</span>
            </span>
            <span className="text-[9px] text-slate-500 group-hover:text-cyan-300 font-mono transition-colors">TOGGLE ▾</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-white truncate mt-1">
            {build.ram.capacityGb}GB {build.ram.type}
          </div>
          <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
            {build.ram.speedMhz} MHz · Dual Channel
          </div>
        </div>

        {/* Display Chip */}
        <div
          onClick={() => {
            const cycle: Record<string, '1080p' | '1440p' | '4K'> = {
              '1080p': '1440p',
              '1440p': '4K',
              '4K': '1080p',
              'Ultrawide_1440p': '1080p',
            };
            const nextRes = cycle[build.monitor.resolution] || '1440p';
            onUpdateBuild({
              ...build,
              monitor: {
                ...build.monitor,
                resolution: nextRes,
              },
            });
          }}
          className="titanium-card p-3 sm:p-3.5 cursor-pointer transition-all group"
        >
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Monitor className="w-3 h-3" />
              <span>Display</span>
            </span>
            <span className="text-[9px] text-slate-500 group-hover:text-emerald-300 font-mono transition-colors">CYCLE ▾</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-white truncate mt-1">
            {build.monitor.resolution}
          </div>
          <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
            {build.monitor.refreshRateHz}Hz Refresh
          </div>
        </div>
      </div>

      {/* Quick 1-Click Popular Preset Pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-3 mt-2 no-scrollbar text-xs">
        <span className="text-[11px] text-slate-500 shrink-0 font-mono uppercase tracking-wider">Quick Rigs:</span>
        {PREBUILT_SYSTEMS.map(p => (
          <button
            key={p.name}
            onClick={() => onUpdateBuild(p.build)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors border shrink-0 ${
              build.gpu.id === p.build.gpu.id && build.cpu.id === p.build.cpu.id
                ? 'bg-white/[0.1] border-white/30 text-white'
                : 'bg-transparent border-white/[0.07] hover:border-white/[0.16] text-slate-400 hover:text-slate-200'
            }`}
          >
            {p.name.split('(')[0].trim()}
          </button>
        ))}
      </div>
    </div>
  );
};
