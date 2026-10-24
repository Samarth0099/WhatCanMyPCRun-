import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SystemBuild, CPU, GPU, RAMConfig } from '../types/hardware';
import { CPUS_DATABASE } from '../data/cpus';
import { GPUS_DATABASE } from '../data/gpus';
import { GAMES_DATABASE } from '../data/games';
import { Game, Resolution, QualityPreset, UpscalerMode } from '../types/game';
import { ThemeId, THEMES } from '../types/theme';
import { GamingDoodleBackground } from './GamingDoodleBackground';
import { ScrollReveal } from './ScrollReveal';
import { estimateGamePerformance } from '../services/estimationEngine';
import { 
  ChevronLeft, 
  ChevronDown, 
  Search, 
  Gamepad2, 
  Cpu as CpuIcon, 
  Monitor, 
  Gauge, 
  Sliders, 
  Check, 
  X, 
  TrendingUp, 
  Sparkles, 
  Zap, 
  AlertTriangle, 
  HelpCircle,
  Maximize2,
  HardDrive,
  SlidersHorizontal,
  ArrowRight,
  Info,
  Star
} from 'lucide-react';

interface CompareViewProps {
  baseBuild: SystemBuild;
  onClose?: () => void;
  currentTheme?: ThemeId;
  onNavigateToBuilder?: (step?: string) => void;
  onUpdateBuild?: (newBuild: SystemBuild) => void;
  onSelectGame?: (game: Game) => void;
  onOpenCustomPartModal?: () => void;
  favoriteGameIds?: string[];
  onToggleFavorite?: (gameId: string) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  baseBuild,
  onClose,
  currentTheme = 'mocha_mousse',
  onNavigateToBuilder,
  onUpdateBuild,
  favoriteGameIds = [],
  onToggleFavorite,
}) => {
  const activeTheme = THEMES[currentTheme] || THEMES.mocha_mousse;
  // Navigation / Dedicated Details View State
  const [selectedGameForDetails, setSelectedGameForDetails] = useState<Game | null>(null);

  // User's Active Build for Estimates (defaults to baseBuild from builder)
  const [activeBuild, setActiveBuild] = useState<SystemBuild>(baseBuild);
  useEffect(() => {
    setActiveBuild(baseBuild);
  }, [baseBuild]);

  // Main Library Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'fps-desc' | 'fps-asc' | 'title-asc' | 'year-desc' | 'vram-desc'>('fps-desc');
  const [visibleLimit, setVisibleLimit] = useState<number>(32);

  // Global Resolution & Preset for Card Previews
  const [previewResolution, setPreviewResolution] = useState<Resolution>('1080p');
  const [previewPreset, setPreviewPreset] = useState<QualityPreset>('High');

  // Dedicated Game Details View Controls
  const [detailResolution, setDetailResolution] = useState<Resolution>('1080p');
  const [detailPreset, setDetailPreset] = useState<QualityPreset>('High');
  const [detailUpscaler, setDetailUpscaler] = useState<UpscalerMode>('Off');

  // Spec Selector inside Details View
  const [cpuSearchQuery, setCpuSearchQuery] = useState('');
  const [isCpuPickerOpen, setIsCpuPickerOpen] = useState(false);
  const [gpuSearchQuery, setGpuSearchQuery] = useState('');
  const [isGpuPickerOpen, setIsGpuPickerOpen] = useState(false);

  const cpuDropdownRef = useRef<HTMLDivElement>(null);
  const gpuDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cpuDropdownRef.current && !cpuDropdownRef.current.contains(e.target as Node)) {
        setIsCpuPickerOpen(false);
      }
      if (gpuDropdownRef.current && !gpuDropdownRef.current.contains(e.target as Node)) {
        setIsGpuPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Category matching helper
  const matchesCategory = (genre: string, category: string): boolean => {
    if (category === 'All') return true;
    const g = genre.toLowerCase();
    const c = category.toLowerCase();

    if (c === 'action rpg') {
      return (
        g.includes('rpg') ||
        g.includes('soulslike') ||
        g.includes('arpg') ||
        g.includes('crpg') ||
        g.includes('action rpg')
      );
    }
    if (c === 'shooter') {
      return (
        g.includes('shooter') ||
        g.includes('fps') ||
        g.includes('first-person shooter') ||
        g.includes('tactical shooter')
      );
    }
    if (c === 'action-adventure' || c === 'adventure') {
      return (
        g.includes('action-adventure') ||
        g.includes('action / adventure') ||
        g.includes('adventure') ||
        g.includes('stealth')
      );
    }
    if (c === 'open world') {
      return g.includes('open world') || g.includes('open-world') || g.includes('sandbox');
    }
    if (c === 'survival & horror' || c === 'horror' || c === 'survival') {
      return g.includes('horror') || g.includes('survival');
    }
    if (c === 'racing') {
      return g.includes('racing') || g.includes('motorsport') || g.includes('driving');
    }
    if (c === 'sports') {
      return g.includes('sports') || g.includes('football') || g.includes('fifa') || g.includes('fc');
    }
    return g.includes(c);
  };

  const categories = [
    'All',
    'Favorites',
    'Action RPG',
    'Shooter',
    'Action-Adventure',
    'Open World',
    'Survival & Horror',
    'Racing',
    'Sports',
  ];

  // Quick FPS calculation for card preview
  const getCardFps = (game: Game, res: Resolution, pre: QualityPreset) => {
    try {
      const est = estimateGamePerformance({
        game,
        cpu: activeBuild.cpu,
        gpu: activeBuild.gpu,
        ram: activeBuild.ram,
        resolution: res,
        preset: pre,
        upscaler: 'Off',
      });
      const avg = Math.round((est.avgFpsMin + est.avgFpsMax) / 2);
      const low = Math.round((est.low1PercentMin + est.low1PercentMax) / 2);
      return { avg, low, verdict: est.verdict };
    } catch {
      return { avg: 60, low: 45, verdict: 'smooth_60' as const };
    }
  };

  // Filter & sort games list
  const filteredGames = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const result = GAMES_DATABASE.filter(game => {
      const matchCat = selectedCategory === 'Favorites'
        ? favoriteGameIds.includes(game.id)
        : matchesCategory(game.genre, selectedCategory);
      const matchQuery =
        !q ||
        game.title.toLowerCase().includes(q) ||
        game.genre.toLowerCase().includes(q) ||
        game.studio.toLowerCase().includes(q) ||
        game.engine.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });

    return result.sort((a, b) => {
      if (sortBy === 'fps-desc') {
        const fpsA = getCardFps(a, previewResolution, previewPreset).avg;
        const fpsB = getCardFps(b, previewResolution, previewPreset).avg;
        return fpsB - fpsA;
      }
      if (sortBy === 'fps-asc') {
        const fpsA = getCardFps(a, previewResolution, previewPreset).avg;
        const fpsB = getCardFps(b, previewResolution, previewPreset).avg;
        return fpsA - fpsB;
      }
      if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'year-desc') {
        return b.releaseYear - a.releaseYear;
      }
      if (sortBy === 'vram-desc') {
        const vramA = a.benchmarks[0]?.vramDemandGb || 4;
        const vramB = b.benchmarks[0]?.vramDemandGb || 4;
        return vramB - vramA;
      }
      return 0;
    });
  }, [searchQuery, selectedCategory, sortBy, activeBuild, previewResolution, previewPreset, favoriteGameIds]);

  // Filtered CPUs for dropdown picker
  const filteredCpus = useMemo(() => {
    const q = cpuSearchQuery.toLowerCase().trim();
    if (!q) return CPUS_DATABASE.slice(0, 30);
    return CPUS_DATABASE.filter(c => 
      c.model.toLowerCase().includes(q) || 
      c.brand.toLowerCase().includes(q) || 
      c.series.toLowerCase().includes(q)
    ).slice(0, 30);
  }, [cpuSearchQuery]);

  // Filtered GPUs for dropdown picker
  const filteredGpus = useMemo(() => {
    const q = gpuSearchQuery.toLowerCase().trim();
    if (!q) return GPUS_DATABASE.slice(0, 30);
    return GPUS_DATABASE.filter(g => 
      g.model.toLowerCase().includes(q) || 
      g.brand.toLowerCase().includes(q) || 
      g.series.toLowerCase().includes(q)
    ).slice(0, 30);
  }, [gpuSearchQuery]);

  // Detailed estimation for selected game in Details View
  const detailedEstimate = useMemo(() => {
    if (!selectedGameForDetails) return null;
    return estimateGamePerformance({
      game: selectedGameForDetails,
      cpu: activeBuild.cpu,
      gpu: activeBuild.gpu,
      ram: activeBuild.ram,
      storage: activeBuild.storage,
      cooler: activeBuild.cooler,
      resolution: detailResolution,
      preset: detailPreset,
      upscaler: detailUpscaler,
    });
  }, [selectedGameForDetails, activeBuild, detailResolution, detailPreset, detailUpscaler]);

  // Multi-resolution estimates for comparison bar
  const multiResEstimates = useMemo(() => {
    if (!selectedGameForDetails) return null;
    const resolutions: Resolution[] = ['720p', '1080p', '1440p', '4K'];
    return resolutions.map(res => {
      const est = estimateGamePerformance({
        game: selectedGameForDetails,
        cpu: activeBuild.cpu,
        gpu: activeBuild.gpu,
        ram: activeBuild.ram,
        resolution: res,
        preset: detailPreset,
        upscaler: detailUpscaler,
      });
      return {
        resolution: res,
        avg: Math.round((est.avgFpsMin + est.avgFpsMax) / 2),
        low: Math.round((est.low1PercentMin + est.low1PercentMax) / 2),
        verdict: est.verdict,
      };
    });
  }, [selectedGameForDetails, activeBuild, detailPreset, detailUpscaler]);

  // Recommended graphics settings generator for selected game
  const recommendedSettings = useMemo(() => {
    if (!selectedGameForDetails) return null;
    const vram = activeBuild.gpu.vramGb;
    const isUltraCapable = activeBuild.gpu.scoreRaster >= 140;
    const isHighCapable = activeBuild.gpu.scoreRaster >= 95;

    return [
      {
        setting: 'Resolution',
        value: detailResolution,
        impact: 'Very High',
        advice: 'Lower to 1080p if target FPS is below 60 at 1440p/4K.',
      },
      {
        setting: 'Upscaling / AI Reconstruction',
        value: activeBuild.gpu.supportsDLSS ? 'NVIDIA DLSS (Quality)' : activeBuild.gpu.supportsFSR ? 'AMD FSR (Quality)' : 'Intel XeSS',
        impact: 'High (+35-50% FPS)',
        advice: 'Renders at lower internal resolution and reconstructs sharp visuals with minimal artifacting.',
      },
      {
        setting: 'Texture Quality',
        value: vram >= 12 ? 'Ultra' : vram >= 8 ? 'High' : 'Medium',
        impact: 'VRAM Bound',
        advice: vram >= 8 ? 'Can safely stay High with zero FPS penalty when VRAM capacity is sufficient.' : 'Lower to Medium to avoid VRAM stutter.',
      },
      {
        setting: 'Shadows & Lighting',
        value: 'Medium',
        impact: 'High (+18-25% FPS)',
        advice: 'Lowering shadows from Ultra to Medium gives huge FPS boosts with minimal perceptual loss during fast movement.',
      },
      {
        setting: 'Volumetric Fog & Clouds',
        value: isUltraCapable ? 'Medium' : 'Low',
        impact: 'High (+12-20% FPS)',
        advice: 'Volumetric raymarching is extremely heavy on GPUs. Lowering this provides an immediate frame rate boost.',
      },
      {
        setting: 'Ambient Occlusion',
        value: 'SSAO / GTAO (Medium)',
        impact: 'Moderate (+5-8% FPS)',
        advice: 'Provides realistic contact shadows without the severe overhead of ray traced ambient occlusion.',
      },
      {
        setting: 'Ray Tracing',
        value: 'Off (or Low with Frame Gen)',
        impact: 'Extreme (+40-80% FPS when Off)',
        advice: 'Turn off for the highest competitive and smooth frame rates. Only enable if using DLSS 3 Frame Gen.',
      },
      {
        setting: 'Motion Blur & Film Grain',
        value: 'Off',
        impact: 'Clarity / Low FPS',
        advice: 'Disabling eliminates visual smear, enhances target tracking, and saves slight post-processing frame time.',
      },
    ];
  }, [selectedGameForDetails, activeBuild, detailResolution]);

  // Handle RAM Capacity change
  const handleRamCapacityChange = (capacityGb: number) => {
    setActiveBuild(prev => ({
      ...prev,
      ram: {
        ...prev.ram,
        capacityGb,
        speedMhz: capacityGb >= 32 ? 6000 : 3600,
        type: capacityGb >= 32 ? 'DDR5' : 'DDR4',
      },
    }));
  };

  // Sync active build back to parent system if user clicks "Apply"
  const handleApplyToSystem = () => {
    if (onUpdateBuild) {
      onUpdateBuild(activeBuild);
    }
  };

  // =========================================================================
  // VIEW MODE 1: DEDICATED GAME DETAILS & SPEC CALIBRATION VIEW
  // =========================================================================
  if (selectedGameForDetails) {
    const game = selectedGameForDetails;
    const avgFps = detailedEstimate ? Math.round((detailedEstimate.avgFpsMin + detailedEstimate.avgFpsMax) / 2) : 60;
    const lowFps = detailedEstimate ? Math.round((detailedEstimate.low1PercentMin + detailedEstimate.low1PercentMax) / 2) : 45;

    return (
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6 animate-in fade-in duration-200">
        {/* Top Action Bar: Back to Games Library Button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setSelectedGameForDetails(null)}
            className="group flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all border shadow-sm hover:scale-[1.02] cursor-pointer"
            style={{
              backgroundColor: activeTheme.cardBgHex,
              borderColor: `${activeTheme.primaryHex}50`,
              color: activeTheme.accentHex || '#ffffff',
              boxShadow: `0 0 15px ${activeTheme.glowRgba}`,
            }}
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>BACK TO GAMES LIBRARY</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              Testing:
            </span>
            <span
              className="px-3 py-1 rounded-full text-xs font-mono font-bold border"
              style={{
                backgroundColor: `${activeTheme.primaryHex}20`,
                borderColor: `${activeTheme.primaryHex}50`,
                color: activeTheme.accentHex || '#ffffff',
              }}
            >
              {game.title}
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Hero Header with Transparent Game Logo & Cyberpunk Backdrop */}
        <div 
          className="relative rounded-2xl p-5 sm:p-7 overflow-hidden shadow-2xl transition-colors duration-300"
          style={{
            background: `linear-gradient(135deg, ${activeTheme.cardBgHex}f5 0%, ${activeTheme.bgHex}f5 100%)`,
            border: `1px solid ${activeTheme.primaryHex}40`,
            boxShadow: `0 25px 50px -12px ${activeTheme.glowRgba}`,
          }}
        >
          {/* Ambient Glows */}
          <div 
            className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25"
            style={{ backgroundColor: activeTheme.primaryHex }}
          />
          <div 
            className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ backgroundColor: activeTheme.secondaryHex }}
          />

          {/* Background Game Art Backdrop (if present) */}
          {game.coverImage && (
            <div className="absolute inset-y-0 right-0 w-full sm:w-2/3 opacity-25 pointer-events-none">
              <img
                src={game.coverImage}
                alt={game.title}
                className="w-full h-full object-cover object-right"
              />
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to right, ${activeTheme.cardBgHex} 0%, ${activeTheme.cardBgHex}e0 50%, transparent 100%)`,
                }}
              />
            </div>
          )}

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Official Game Logo Box */}
              <div 
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl p-3.5 flex items-center justify-center shrink-0 relative group"
                style={{
                  backgroundColor: `${activeTheme.bgHex}f0`,
                  border: `1px solid ${activeTheme.primaryHex}60`,
                  boxShadow: `0 0 25px ${activeTheme.glowRgba}`,
                }}
              >
                <div 
                  className="absolute inset-0 rounded-2xl pointer-events-none opacity-15"
                  style={{ background: `linear-gradient(to bottom, ${activeTheme.primaryHex}, transparent)` }}
                />
                {game.logoUrl ? (
                  <img
                    src={game.logoUrl}
                    alt={`${game.title} Logo`}
                    className="max-h-24 sm:max-h-28 max-w-[90%] object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : null}
                <div className="hidden only:flex flex-col items-center justify-center text-center">
                  <Gamepad2 className="w-8 h-8 text-cyan-400 mb-1" />
                  <span className="font-heading font-black text-xs text-white uppercase">{game.title}</span>
                </div>
              </div>

              {/* Game Info */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                    {game.genre.split('/')[0].trim()}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Released {game.releaseYear}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs font-mono text-slate-400">
                    Engine: <strong className="text-slate-200">{game.engine}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    {game.title}
                  </h1>
                  <button
                    type="button"
                    onClick={() => onToggleFavorite?.(game.id)}
                    aria-label={favoriteGameIds.includes(game.id) ? `Remove ${game.title} from favorites` : `Add ${game.title} to favorites`}
                    title={favoriteGameIds.includes(game.id) ? 'Remove from favorites' : 'Add to favorites'}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      favoriteGameIds.includes(game.id)
                        ? 'bg-amber-500/25 text-amber-300 border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                        : 'bg-white/[0.04] text-slate-400 hover:text-amber-300 border-white/[0.1] hover:border-amber-400/40'
                    }`}
                  >
                    <Star className={`w-5 h-5 transition-transform ${favoriteGameIds.includes(game.id) ? 'fill-amber-300 scale-105' : ''}`} />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-mono leading-relaxed line-clamp-2 sm:line-clamp-none">
                  {game.description}
                </p>

                <div className="text-[11px] font-mono text-slate-400 pt-1">
                  Developer: <span className="text-slate-200 font-bold">{game.studio}</span> | Publisher: <span className="text-slate-200 font-bold">{game.publisher}</span>
                </div>
              </div>
            </div>

            {/* Live Readout Pill */}
            <div 
              className="rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center shrink-0 min-w-[200px]"
              style={{
                backgroundColor: `${activeTheme.bgHex}f0`,
                border: `1px solid ${activeTheme.primaryHex}50`,
                boxShadow: `0 0 30px ${activeTheme.glowRgba}`,
              }}
            >
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-0.5">
                Estimated FPS
              </div>
              <div className="flex items-baseline gap-1.5">
                <span 
                  className="font-heading font-black text-4xl sm:text-5xl"
                  style={{
                    color: avgFps >= 60 ? (activeTheme.accentHex || activeTheme.primaryHex) : (avgFps >= 45 ? '#fbbf24' : '#f87171'),
                    textShadow: `0 0 15px ${activeTheme.glowRgba}`,
                  }}
                >
                  ~{avgFps}
                </span>
                <span className="text-xs font-mono text-slate-400 font-bold">FPS</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-1">
                1% Low: <strong className="text-slate-200">~{lowFps} FPS</strong>
              </div>
              <div 
                className="mt-2.5 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border"
                style={{
                  backgroundColor: `${activeTheme.primaryHex}20`,
                  borderColor: `${activeTheme.primaryHex}50`,
                  color: activeTheme.accentHex || '#ffffff',
                }}
              >
                {detailResolution} • {detailPreset}
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Left Spec Controls + Right Performance & Settings Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ============================================================
              LEFT COLUMN (Col Span 5): HARDWARE & SETTINGS SPEC SELECTOR
          ============================================================ */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-2xl bg-[#080d20]/95 border border-blue-500/30 p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-heading font-extrabold text-sm text-white uppercase tracking-wider">
                    Test Your PC Specifications
                  </h3>
                </div>
                <button
                  onClick={handleApplyToSystem}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-[10px] font-mono font-bold transition-all cursor-pointer"
                  title="Save current CPU/GPU/RAM to your overall build session"
                >
                  Save to Global PC
                </button>
              </div>

              {/* 1. CPU Selector */}
              <div className="space-y-1.5" ref={cpuDropdownRef}>
                <label className="text-xs font-mono text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CpuIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Processor (CPU):</span>
                  </span>
                  <span className="text-[10px] text-cyan-400 font-bold">{activeBuild.cpu.brand}</span>
                </label>
                
                <div className="relative">
                  <button
                    onClick={() => setIsCpuPickerOpen(prev => !prev)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#060a16] border border-white/[0.1] hover:border-cyan-400/50 text-left text-xs font-mono text-white transition-all cursor-pointer"
                  >
                    <span className="truncate">{activeBuild.cpu.model}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
                  </button>

                  {isCpuPickerOpen && (
                    <div className="absolute left-0 right-0 top-full mt-2 bg-[#090d1c] border border-cyan-500/40 rounded-xl p-2.5 shadow-2xl z-50 max-h-60 overflow-y-auto divide-y divide-white/[0.06]">
                      <div className="pb-2">
                        <input
                          type="text"
                          value={cpuSearchQuery}
                          onChange={(e) => setCpuSearchQuery(e.target.value)}
                          placeholder="Search CPU (e.g. 7800X3D, i7-14700K)..."
                          className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                          autoFocus
                        />
                      </div>
                      <div className="pt-1.5 space-y-1">
                        {filteredCpus.map(cpu => (
                          <div
                            key={cpu.id}
                            onClick={() => {
                              setActiveBuild(prev => ({ ...prev, cpu }));
                              setIsCpuPickerOpen(false);
                            }}
                            className={`flex items-center justify-between p-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                              activeBuild.cpu.id === cpu.id
                                ? 'bg-cyan-500/25 text-cyan-300 font-bold border border-cyan-400/40'
                                : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
                            }`}
                          >
                            <span className="truncate">{cpu.model}</span>
                            <span className="text-[10px] text-slate-500 ml-2 shrink-0">{cpu.cores}C/{cpu.threads}T</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. GPU Selector */}
              <div className="space-y-1.5" ref={gpuDropdownRef}>
                <label className="text-xs font-mono text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5 text-blue-400" />
                    <span>Graphics Card (GPU):</span>
                  </span>
                  <span className="text-[10px] text-cyan-400 font-bold">{activeBuild.gpu.vramGb} GB VRAM</span>
                </label>

                <div className="relative">
                  <button
                    onClick={() => setIsGpuPickerOpen(prev => !prev)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#060a16] border border-white/[0.1] hover:border-cyan-400/50 text-left text-xs font-mono text-white transition-all cursor-pointer"
                  >
                    <span className="truncate">{activeBuild.gpu.model}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
                  </button>

                  {isGpuPickerOpen && (
                    <div className="absolute left-0 right-0 top-full mt-2 bg-[#090d1c] border border-cyan-500/40 rounded-xl p-2.5 shadow-2xl z-50 max-h-60 overflow-y-auto divide-y divide-white/[0.06]">
                      <div className="pb-2">
                        <input
                          type="text"
                          value={gpuSearchQuery}
                          onChange={(e) => setGpuSearchQuery(e.target.value)}
                          placeholder="Search GPU (e.g. RTX 4070, RX 7800 XT)..."
                          className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                          autoFocus
                        />
                      </div>
                      <div className="pt-1.5 space-y-1">
                        {filteredGpus.map(gpu => (
                          <div
                            key={gpu.id}
                            onClick={() => {
                              setActiveBuild(prev => ({ ...prev, gpu }));
                              setIsGpuPickerOpen(false);
                            }}
                            className={`flex items-center justify-between p-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                              activeBuild.gpu.id === gpu.id
                                ? 'bg-cyan-500/25 text-cyan-300 font-bold border border-cyan-400/40'
                                : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
                            }`}
                          >
                            <span className="truncate">{gpu.model}</span>
                            <span className="text-[10px] text-slate-500 ml-2 shrink-0">{gpu.vramGb}GB</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. RAM Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-purple-400" />
                    <span>System Memory (RAM):</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">{activeBuild.ram.type}</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[8, 16, 32, 64].map(gb => (
                    <button
                      key={gb}
                      onClick={() => handleRamCapacityChange(gb)}
                      className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        activeBuild.ram.capacityGb === gb
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-black shadow-md'
                          : 'bg-[#060a16] border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/[0.2]'
                      }`}
                    >
                      {gb} GB
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Target Resolution (720p, 1080p, 1440p, 4K) */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Display Resolution:</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['720p', '1080p', '1440p', '4K'] as Resolution[]).map(res => (
                    <button
                      key={res}
                      onClick={() => setDetailResolution(res)}
                      className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        detailResolution === res
                          ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                          : 'bg-[#060a16] border border-white/[0.08] text-slate-400 hover:text-white'
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Graphics Preset (Low, Medium, High, Ultra) */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-violet-400" />
                  <span>Graphics Quality Preset:</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Low', 'Medium', 'High', 'Ultra'] as QualityPreset[]).map(p => (
                    <button
                      key={p}
                      onClick={() => setDetailPreset(p)}
                      className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        detailPreset === p
                          ? 'bg-blue-600/35 text-white border border-blue-400/50 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                          : 'bg-[#060a16] border border-white/[0.08] text-slate-400 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Upscaling & Frame Generation Mode */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upscaling & Frame Gen:</span>
                  </span>
                  <span className="text-[10px] text-amber-300 font-mono font-bold">FPS Booster</span>
                </label>
                <select
                  aria-label="Upscaling and Frame Generation Mode"
                  value={detailUpscaler}
                  onChange={(e) => setDetailUpscaler(e.target.value as UpscalerMode)}
                  className="w-full bg-[#060a16] border border-white/[0.1] hover:border-cyan-400/40 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none cursor-pointer"
                >
                  <option value="Off" className="bg-[#0b0e16] text-slate-200">Native Render (Upscaling Off)</option>
                  {activeBuild.gpu.supportsDLSS && (
                    <option value="DLSS_Quality" className="bg-[#0b0e16] text-slate-200">NVIDIA DLSS (Quality - Recommended)</option>
                  )}
                  {activeBuild.gpu.supportsDLSS && (
                    <option value="DLSS_Balanced" className="bg-[#0b0e16] text-slate-200">NVIDIA DLSS (Balanced - Max Boost)</option>
                  )}
                  <option value="FSR_Quality" className="bg-[#0b0e16] text-slate-200">AMD FSR (Quality)</option>
                  <option value="FSR_Balanced" className="bg-[#0b0e16] text-slate-200">AMD FSR (Balanced)</option>
                  <option value="XeSS_Quality" className="bg-[#0b0e16] text-slate-200">Intel XeSS (Quality)</option>
                  <option value="Frame_Gen" className="bg-[#0b0e16] text-slate-200">
                    {activeBuild.gpu.supportsDLSS3FrameGen ? 'DLSS 3 Frame Gen' : 'FSR 3 Frame Gen'} (+55% FPS)
                  </option>
                </select>
              </div>
            </div>

            {/* Hardware Requirements Check Card */}
            <div className="rounded-2xl bg-[#080d20]/95 border border-blue-500/30 p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <h4 className="font-heading font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Hardware Compatibility Check</span>
                </h4>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">100% Verified</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-slate-400">CPU Requirement:</span>
                  <div className={`flex items-center gap-1.5 ${detailedEstimate?.meetsRecommended ? 'text-emerald-400' : 'text-amber-400'}`}>
                    <Check className="w-3.5 h-3.5" />
                    <span>{detailedEstimate?.meetsRecommended ? 'Meets Recommended' : 'Meets Minimum'} ({game.requirements.exampleRecCpu})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-slate-400">GPU Requirement:</span>
                  <div className={`flex items-center gap-1.5 ${detailedEstimate?.meetsRecommended ? 'text-emerald-400' : 'text-amber-400'}`}>
                    <Check className="w-3.5 h-3.5" />
                    <span>{detailedEstimate?.meetsRecommended ? 'Meets Recommended' : 'Meets Minimum'} ({game.requirements.exampleRecGpu})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-slate-400">RAM Requirement:</span>
                  <div className={`flex items-center gap-1.5 ${activeBuild.ram.capacityGb >= game.requirements.recRamGb ? 'text-emerald-400' : 'text-amber-400'}`}>
                    <Check className="w-3.5 h-3.5" />
                    <span>{activeBuild.ram.capacityGb}GB vs {game.requirements.recRamGb}GB Req</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-slate-400">Storage Footprint:</span>
                  <span className="text-slate-300 font-bold">{game.requirements.requiresSsd ? 'High-Speed SSD Mandatory' : 'SSD / HDD Supported'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              RIGHT COLUMN (Col Span 7): PERFORMANCE ANALYSIS & SETTINGS
          ============================================================ */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* 1. Main FPS & Multi-Resolution Scaling Breakdown */}
            <div className="rounded-2xl bg-[#080d20]/95 border border-blue-500/30 p-5 sm:p-6 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                <div>
                  <h3 className="font-heading font-extrabold text-base text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Estimated FPS Performance</span>
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Benchmark-calibrated for {activeBuild.gpu.model} + {activeBuild.cpu.model}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${
                    avgFps >= 100 ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.3)]' :
                    avgFps >= 60 ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.3)]' :
                    avgFps >= 45 ? 'bg-amber-500/15 border-amber-400/40 text-amber-300' :
                    'bg-rose-500/15 border-rose-400/40 text-rose-300'
                  }`}>
                    {avgFps >= 100 ? '120+ High Refresh' : avgFps >= 60 ? 'Smooth 60+ FPS' : avgFps >= 45 ? 'Playable 30+' : 'Low FPS'}
                  </span>
                </div>
              </div>

              {/* Digital FPS Meters */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-xl bg-[#050814] border border-white/[0.08] p-3 text-center">
                  <div className="text-[10px] font-mono uppercase text-slate-400">Average FPS</div>
                  <div className="font-heading font-black text-3xl sm:text-4xl text-cyan-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.5)] mt-1">
                    ~{avgFps}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-0.5">Expected in-game</div>
                </div>

                <div className="rounded-xl bg-[#050814] border border-white/[0.08] p-3 text-center">
                  <div className="text-[10px] font-mono uppercase text-slate-400">1% Low FPS</div>
                  <div className="font-heading font-black text-3xl sm:text-4xl text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)] mt-1">
                    ~{lowFps}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-0.5">Stutter floor</div>
                </div>

                <div className="col-span-2 sm:col-span-1 rounded-xl bg-[#050814] border border-white/[0.08] p-3 text-center">
                  <div className="text-[10px] font-mono uppercase text-slate-400">System Balance</div>
                  <div className="font-heading font-black text-lg text-purple-300 mt-2 truncate">
                    {detailedEstimate?.bottleneckType || 'Balanced'}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-0.5">Hardware pairing</div>
                </div>
              </div>

              {/* Multi-Resolution Scaling Comparison Bars */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold uppercase">FPS Across Resolutions:</span>
                  <span className="text-[11px] text-slate-500">Preset: {detailPreset}</span>
                </div>

                <div className="space-y-2">
                  {multiResEstimates?.map(item => {
                    const pct = Math.min(100, (item.avg / 160) * 100);
                    const isCurrent = item.resolution === detailResolution;

                    return (
                      <div
                        key={item.resolution}
                        onClick={() => setDetailResolution(item.resolution)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-cyan-500/10 border-cyan-400/50 shadow-sm'
                            : 'bg-[#050814] border-white/[0.06] hover:border-white/[0.15]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${isCurrent ? 'text-cyan-300' : 'text-slate-300'}`}>
                              {item.resolution}
                            </span>
                            {isCurrent && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-400/20 text-cyan-300 font-bold">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-400 text-[11px]">1% Low: ~{item.low}</span>
                            <span className="font-bold text-white text-xs">~{item.avg} FPS</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isCurrent
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                                : 'bg-slate-600'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Estimate Transparency Disclaimer */}
              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 flex items-start gap-2.5 text-[11px] font-mono text-slate-400">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p>
                  Estimated FPS calculated using actual hardware benchmark indexes, resolution scaling coefficients, and game-specific engine profiles. Figures are estimates and vary with background software and driver updates.
                </p>
              </div>
            </div>

            {/* 2. Recommended Best Graphics Settings for Highest Possible FPS */}
            <div className="rounded-2xl bg-[#080d20]/95 border border-blue-500/30 p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-heading font-extrabold text-sm sm:text-base text-white uppercase tracking-wider">
                    Recommended Graphics Settings for Highest FPS
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-600/20 text-cyan-300 border border-blue-500/30 text-[10px] font-mono font-bold">
                  OPTIMAL FIDELITY
                </span>
              </div>

              <p className="text-xs font-mono text-slate-300 leading-relaxed">
                Configure your in-game options with these settings to gain <strong className="text-cyan-300">+30% to +50% FPS</strong> with virtually zero degradation in image clarity.
              </p>

              {/* Settings Table */}
              <div className="divide-y divide-white/[0.06] border border-white/[0.08] rounded-xl overflow-hidden bg-[#060a16]">
                {recommendedSettings?.map((item, idx) => (
                  <div key={idx} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-white/[0.02] transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-white">{item.setting}</span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-400/20">
                          {item.impact}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {item.advice}
                      </p>
                    </div>

                    <div className="shrink-0 self-start sm:self-auto">
                      <span className="px-3 py-1 rounded-lg bg-[#0e1730] border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold shadow-sm">
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tuning Guide Callout */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-900/30 to-purple-900/20 border border-cyan-500/25 space-y-1.5 text-xs font-mono">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pro Tuning Tip:</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  If you encounter frame drops in dense open-world areas, reduce <strong>Volumetric Fog</strong> and <strong>Shadow Quality</strong> to Medium first. These two settings consume over 35% of GPU rasterization budgets without noticeably altering character or world detail.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE 2: GAMES LIBRARY BROWSER (Focused Purely on Games & Selection)
  // =========================================================================
  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
      
      {/* 1. TOP HEADER & SEARCH / FILTER HERO */}
      <ScrollReveal variant="fade" delayMs={40}>
        <div 
          className="rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden transition-colors duration-300 border"
          style={{
            borderColor: `${activeTheme.primaryHex}40`,
            boxShadow: `0 20px 40px -15px ${activeTheme.glowRgba}`,
          }}
        >
          {/* AAA Gaming Doodle Art Background with subtle depth layers & text shield */}
          <GamingDoodleBackground activeTheme={activeTheme} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span 
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 border shadow-sm"
                style={{
                  backgroundColor: `${activeTheme.primaryHex}20`,
                  borderColor: `${activeTheme.primaryHex}50`,
                  color: activeTheme.accentHex || '#ffffff',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: activeTheme.primaryHex }} />
                GAMES LIBRARY • 100 AAA TITLES
              </span>
              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                FPS Estimator & Settings Guide
              </span>
            </div>

            <h1 className={`text-2xl sm:text-4xl font-heading font-black uppercase tracking-tight bg-gradient-to-r ${activeTheme.headingGradient} bg-clip-text text-transparent`}>
              GAMES LIBRARY
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-mono mt-1 max-w-xl">
              Browse 100 AAA titles with official logos. Click any game to test your hardware specs, calculate estimated FPS, and get optimal settings.
            </p>
          </div>

          {/* Quick Hardware Spec Summary Pill */}
          <div 
            className="rounded-xl border p-3 text-xs font-mono space-y-1 shrink-0 self-start md:self-auto shadow-sm"
            style={{
              backgroundColor: `${activeTheme.bgHex}dd`,
              borderColor: `${activeTheme.primaryHex}35`,
            }}
          >
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Current Tested Spec:</div>
            <div className="flex items-center gap-2 font-bold text-white">
              <span style={{ color: activeTheme.accentHex || activeTheme.primaryHex }}>{activeBuild.gpu.model}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">{activeBuild.cpu.model.split(' ')[0]} {activeBuild.cpu.model.split(' ')[1]}</span>
            </div>
            <div className="text-[10px] text-slate-400">
              {activeBuild.ram.capacityGb}GB RAM • Preview: <strong style={{ color: activeTheme.accentHex || activeTheme.primaryHex }}>{previewResolution} {previewPreset}</strong>
            </div>
          </div>
        </div>

        {/* Search, Sort, Resolution & Preset Bar */}
        <div className="mt-5 pt-4 border-t border-white/[0.08] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleLimit(32);
              }}
              placeholder="Search 100 titles by name, studio, or genre..."
              className="w-full bg-[#050814] border border-white/[0.1] hover:border-cyan-400/50 focus:border-cyan-400 rounded-xl pl-10 pr-9 py-2 text-xs text-white placeholder-slate-500 font-mono transition-all focus:outline-none shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Secondary Controls: Sort & Quick Preview Res/Preset */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#050814] border border-white/[0.1] rounded-xl px-2.5 py-1.5">
              <span className="text-[10px] text-slate-400">Sort:</span>
              <select
                aria-label="Sort Games Library"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-mono text-cyan-300 focus:outline-none cursor-pointer"
              >
                <option value="fps-desc" className="bg-[#0b0e16] text-slate-200">Highest FPS</option>
                <option value="fps-asc" className="bg-[#0b0e16] text-slate-200">Lowest FPS</option>
                <option value="title-asc" className="bg-[#0b0e16] text-slate-200">Title (A - Z)</option>
                <option value="year-desc" className="bg-[#0b0e16] text-slate-200">Release Year</option>
                <option value="vram-desc" className="bg-[#0b0e16] text-slate-200">High Graphics Demand</option>
              </select>
            </div>

            {/* Quick Resolution Switcher */}
            <div className="flex items-center gap-1 bg-[#050814] border border-white/[0.1] p-1 rounded-xl">
              {(['1080p', '1440p', '4K'] as Resolution[]).map(res => (
                <button
                  key={res}
                  onClick={() => setPreviewResolution(res)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    previewResolution === res
                      ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>

            {/* Quick Preset Switcher */}
            <div className="flex items-center gap-1 bg-[#050814] border border-white/[0.1] p-1 rounded-xl">
              {(['Medium', 'High', 'Ultra'] as QualityPreset[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPreviewPreset(p)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    previewPreset === p
                      ? 'bg-blue-600/30 text-white border border-blue-400/50 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. GENRE FILTER PILLS (Action RPG, Shooter, Open World, etc.) */}
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {categories.map(cat => {
            const count = cat === 'All' 
              ? GAMES_DATABASE.length 
              : cat === 'Favorites'
              ? favoriteGameIds.length
              : GAMES_DATABASE.filter(g => matchesCategory(g.genre, cat)).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleLimit(32);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-heading font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? cat === 'Favorites'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)] border border-amber-300'
                      : 'text-white border shadow-md'
                    : 'bg-[#050814] text-slate-400 hover:text-white hover:bg-white/[0.05] border border-white/[0.08]'
                }`}
                style={
                  isSelected && cat !== 'Favorites'
                    ? {
                        background: `linear-gradient(135deg, ${activeTheme.primaryHex}, ${activeTheme.secondaryHex})`,
                        borderColor: activeTheme.accentHex || activeTheme.primaryHex,
                        color: currentTheme === 'teal_cream' ? '#061316' : '#ffffff',
                        boxShadow: `0 0 16px ${activeTheme.glowRgba}`,
                      }
                    : undefined
                }
              >
                {cat === 'Favorites' && (
                  <Star className={`w-3.5 h-3.5 ${isSelected ? 'fill-black' : 'text-amber-400 fill-amber-400/40'}`} />
                )}
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-black/40 text-white font-extrabold' : 'bg-white/[0.06] text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </ScrollReveal>

      {/* Filter Feedback Banner if Filtered */}
      {selectedCategory !== 'All' && (
        <div className="px-4 py-2 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs font-mono text-slate-300 flex items-center justify-between">
          <span>
            Filtering by <strong className="text-cyan-300">{selectedCategory}</strong> ({filteredGames.length} titles found). Click any card for detailed specs and graphics recommendations.
          </span>
          <button
            onClick={() => setSelectedCategory('All')}
            className="text-cyan-400 hover:text-white underline text-[11px] font-bold cursor-pointer"
          >
            Show All 100 Games
          </button>
        </div>
      )}

      {/* 2. GAMES CARDS GRID (100 AAA GAMES) */}
      {filteredGames.length === 0 ? (
        <div className="py-16 px-4 text-center rounded-2xl bg-[#080d20] border border-white/[0.06] space-y-3">
          <Gamepad2 className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="font-heading font-bold text-lg text-white">No games found</h3>
          <p className="text-xs font-mono text-slate-400 max-w-sm mx-auto">
            No games matched "{searchQuery}" in category "{selectedCategory}".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-mono text-xs font-bold transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredGames.slice(0, visibleLimit).map((game, idx) => {
            const fpsData = getCardFps(game, previewResolution, previewPreset);
            const genreTag = game.genre.split('/')[0].trim();

            return (
              <ScrollReveal
                key={game.id}
                variant="card"
                delayMs={Math.min((idx % 8) * 45, 280)}
                className="h-full"
              >
                <div
                  onClick={() => setSelectedGameForDetails(game)}
                  className="group relative rounded-2xl bg-gradient-to-b from-[#090e24] to-[#060a17] border border-blue-500/20 hover:border-cyan-400/80 p-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.85),0_0_25px_rgba(6,182,212,0.3)] cursor-pointer flex flex-col justify-between h-full"
                >
                {/* Glow backlight on hover */}
                <div className="absolute inset-0 rounded-2xl bg-radial from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div>
                  {/* =========================================================
                      1. OFFICIAL GAME LOGO (Transparent Background)
                  ========================================================= */}
                  <div className="w-full h-28 sm:h-32 rounded-xl bg-gradient-to-b from-[#0f1734] to-[#060a17] border border-white/[0.06] group-hover:border-cyan-500/40 p-3.5 flex items-center justify-center relative overflow-hidden transition-all shadow-inner">
                    {/* Background game artwork hint */}
                    {game.coverImage && (
                      <div className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity pointer-events-none">
                        <img
                          src={game.coverImage}
                          alt=""
                          className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-500"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#060a17] via-transparent to-transparent" />
                      </div>
                    )}

                    {/* Transparent Game Logo */}
                    {game.logoUrl ? (
                      <img
                        src={game.logoUrl}
                        alt={`${game.title} Official Logo`}
                        className="max-h-20 sm:max-h-24 max-w-[88%] object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] transition-transform duration-300 group-hover:scale-110 relative z-10"
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                          const fallback = e.currentTarget.parentElement?.querySelector('.logo-fallback') as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}

                    {/* Logo Fallback Typography */}
                    <div className="logo-fallback hidden flex-col items-center justify-center text-center p-2 relative z-10">
                      <span className="font-heading font-black text-sm uppercase text-cyan-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]">
                        {game.title}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 mt-0.5">{game.engine}</span>
                    </div>

                    {/* Genre Tag Pill top-left */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-mono text-cyan-300 uppercase font-bold tracking-wider z-20">
                      {genreTag}
                    </div>

                    {/* Release Year & Favorite Star Button top-right */}
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 z-20">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite?.(game.id);
                        }}
                        aria-label={favoriteGameIds.includes(game.id) ? `Remove ${game.title} from favorites` : `Add ${game.title} to favorites`}
                        title={favoriteGameIds.includes(game.id) ? 'Remove from favorites' : 'Add to favorites'}
                        className={`p-1 rounded-md border transition-all cursor-pointer ${
                          favoriteGameIds.includes(game.id)
                            ? 'bg-amber-500/25 text-amber-300 border-amber-400/50 shadow-[0_0_10px_rgba(251,191,36,0.4)]'
                            : 'bg-black/60 text-slate-400 hover:text-amber-300 border-white/10 hover:border-amber-400/40'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${favoriteGameIds.includes(game.id) ? 'fill-amber-300' : ''}`} />
                      </button>

                      <div className="px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-[9px] font-mono text-slate-400">
                        {game.releaseYear}
                      </div>
                    </div>
                  </div>

                  {/* =========================================================
                      2. GAME NAME (Official Title Clearly Displayed)
                  ========================================================= */}
                  <div className="mt-3.5 space-y-0.5">
                    <h3
                      className="font-heading font-black text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-1 tracking-wide"
                      title={game.title}
                    >
                      {game.title}
                    </h3>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span className="truncate max-w-[140px]">{game.studio}</span>
                      <span className="truncate text-slate-500">{game.engine.split('(')[0].trim()}</span>
                    </div>
                  </div>
                </div>

                {/* =========================================================
                    3. ESTIMATED FPS (Calculated for current hardware/preset)
                ========================================================= */}
                <div className="mt-4 pt-3 border-t border-white/[0.08]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[9px] font-mono uppercase tracking-wider text-slate-400">
                        Estimated FPS
                      </div>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className={`font-heading font-black text-2xl tracking-tight ${
                          fpsData.avg >= 100 ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]' :
                          fpsData.avg >= 60 ? 'text-cyan-300 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]' :
                          fpsData.avg >= 45 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          ~{fpsData.avg}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 font-bold">FPS</span>
                      </div>
                      <div className="text-[9px] font-mono text-slate-500">
                        1% Low: ~{fpsData.low} FPS
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase border ${
                        fpsData.avg >= 100 ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300' :
                        fpsData.avg >= 60 ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-300' :
                        fpsData.avg >= 45 ? 'bg-amber-500/15 border-amber-400/40 text-amber-300' :
                        'bg-rose-500/15 border-rose-400/40 text-rose-300'
                      }`}>
                        {fpsData.avg >= 100 ? '120+ FPS' : fpsData.avg >= 60 ? 'Ultra 60+' : fpsData.avg >= 45 ? 'Playable' : 'Low FPS'}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 mt-1 uppercase">
                        {previewResolution} • {previewPreset}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Button */}
                  <div className="mt-3 w-full py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 bg-white/[0.04] group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:text-black text-slate-300 border border-white/[0.08] group-hover:border-cyan-300 transition-all shadow-sm">
                    <span>Test Specs & Settings</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
            );
          })}
        </div>
      )}

      {/* Pagination / Load More */}
      {filteredGames.length > visibleLimit && (
        <div className="pt-4 text-center border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setVisibleLimit(prev => Math.min(filteredGames.length, prev + 32))}
            className="px-6 py-2.5 rounded-xl bg-blue-600/25 hover:bg-blue-600/35 border border-blue-500/40 text-cyan-300 font-mono text-xs font-bold transition-all cursor-pointer shadow-lg hover:shadow-cyan-500/20"
          >
            Load More Games (+32)
          </button>
          <button
            onClick={() => setVisibleLimit(filteredGames.length)}
            className="px-6 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white font-mono text-xs font-bold transition-all cursor-pointer"
          >
            Show All ({filteredGames.length}) Titles
          </button>
        </div>
      )}

    </div>
  );
};
