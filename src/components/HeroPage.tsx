import React from 'react';
import { 
  ArrowRight, 
  Cpu, 
  Gauge, 
  Sparkles, 
  CheckCircle2, 
  MonitorPlay, 
  Zap, 
  ShieldCheck, 
  Sliders, 
  Layers,
  ChevronRight,
  Activity,
  UserPlus
} from 'lucide-react';
import { ThemeId, THEMES } from '../types/theme';
import { InteractiveRigCanvas } from './InteractiveRigCanvas';
import { ScrollReveal } from './ScrollReveal';

interface HeroPageProps {
  currentTheme: ThemeId;
  onStartBuild: () => void;
  onExplorePrebuilts: () => void;
  onJumpToResults: () => void;
  onOpenAuth?: () => void;
}

export const HeroPage: React.FC<HeroPageProps> = ({
  currentTheme,
  onStartBuild,
  onExplorePrebuilts,
  onJumpToResults,
  onOpenAuth,
}) => {
  const activeTheme = THEMES[currentTheme] || THEMES.cyberpunk;

  const features = [
    { 
      title: 'Build your PC', 
      desc: 'Step-by-step custom component configurator', 
      icon: Cpu,
      tag: 'STEP 1-6'
    },
    { 
      title: 'Select your components', 
      desc: 'Intel Ultra, AMD Ryzen 9000, RTX 40 & RDNA3', 
      icon: ShieldCheck,
      tag: 'DATABASE'
    },
    { 
      title: 'Check game performance', 
      desc: 'Hardware simulation with real architecture scoring', 
      icon: Gauge,
      tag: 'ANALYTICS'
    },
    { 
      title: 'Estimate FPS', 
      desc: '1080p, 1440p, 4K across graphics quality presets', 
      icon: Zap,
      tag: 'SIMULATION'
    },
    { 
      title: 'Find playable games', 
      desc: 'Instant compatibility verdict and bottleneck analysis', 
      icon: MonitorPlay,
      tag: 'LIBRARY'
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-between py-4 sm:py-8 text-center select-none overflow-hidden">
      {/* 3D Atmospheric Depth Ambient Glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] blur-[140px] opacity-25 pointer-events-none rounded-full"
        style={{
          background: `radial-gradient(ellipse at center, ${activeTheme.primaryHex} 0%, ${activeTheme.secondaryHex} 50%, transparent 80%)`,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 w-full my-auto">
        {/* Top Telemetry HUD Badge */}
        <ScrollReveal variant="fade" delayMs={40}>
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#121724]/90 border border-white/[0.1] backdrop-blur-md mb-5 shadow-lg group">
            <span className="w-2 h-2 rounded-full bg-emerald-400 diode-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-slate-300 uppercase">
              HARDWARE LAB & FPS ESTIMATION ENGINE
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1 font-semibold">
              <Activity className="w-3 h-3" />
              LIVE TELEMETRY
            </span>
          </div>
        </ScrollReveal>

        {/* Main Website Name - Theme-based Cyberpunk Titanium Gradient */}
        <ScrollReveal variant="slide-up" delayMs={90}>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-display uppercase mb-4 leading-none">
            <span
              className="bg-clip-text text-transparent inline-block drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
              style={{
                backgroundImage: activeTheme.headingGradient,
                textShadow: '0 0 40px rgba(0, 210, 255, 0.22)',
              }}
            >
              RIGLAB
            </span>
          </h1>
        </ScrollReveal>

        {/* Short Description */}
        <ScrollReveal variant="slide-up" delayMs={140}>
          <p className="text-sm sm:text-base md:text-lg text-slate-300 font-normal max-w-2xl mx-auto mb-6 leading-relaxed">
            What Can My PC Run? Build your custom rig, configure components, and estimate accurate gaming performance across 100+ AAA titles.
          </p>
        </ScrollReveal>

        {/* 3D Interactive Rig Showcase & Floating Telemetry Panels */}
        <ScrollReveal variant="card" delayMs={200} className="relative max-w-3xl mx-auto mb-8 px-2 sm:px-0">
          {/* Left Floating Hardware Telemetry Tag (Desktop) */}
          <div className="hidden md:flex absolute -left-12 top-10 flex-col gap-2 z-20 pointer-events-none">
            <div className="bg-[#10141f]/95 border border-cyan-500/30 rounded-xl px-3 py-2 text-left backdrop-blur-md shadow-xl transform -rotate-2">
              <div className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                GPU SIMULATOR
              </div>
              <div className="text-xs font-bold text-white font-heading mt-0.5">RTX 40 / RDNA 3</div>
              <div className="text-[10px] text-slate-400 font-mono">DLSS 3.5 & FSR 3.1</div>
            </div>

            <div className="bg-[#10141f]/95 border border-white/[0.08] rounded-xl px-3 py-2 text-left backdrop-blur-md shadow-xl transform rotate-1 mt-4">
              <div className="text-[9px] font-mono text-violet-400 uppercase tracking-wider">RESOLUTIONS</div>
              <div className="text-xs font-bold text-white font-heading mt-0.5">1080p • 1440p • 4K</div>
              <div className="text-[10px] text-slate-400 font-mono">Low / Med / High / Ultra</div>
            </div>
          </div>

          {/* Right Floating Hardware Telemetry Tag (Desktop) */}
          <div className="hidden md:flex absolute -right-12 top-10 flex-col gap-2 z-20 pointer-events-none">
            <div className="bg-[#10141f]/95 border border-white/[0.08] rounded-xl px-3 py-2 text-right backdrop-blur-md shadow-xl transform rotate-2">
              <div className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider flex items-center justify-end gap-1">
                <span>BOTTLENECK SCAN</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <div className="text-xs font-bold text-white font-heading mt-0.5">Balanced IPC Engine</div>
              <div className="text-[10px] text-slate-400 font-mono">CPU draw-call telemetry</div>
            </div>

            <div className="bg-[#10141f]/95 border border-cyan-500/20 rounded-xl px-3 py-2 text-right backdrop-blur-md shadow-xl transform -rotate-1 mt-4">
              <div className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider">HARDWARE CATALOG</div>
              <div className="text-xs font-bold text-white font-heading mt-0.5">200+ CPUs • 140+ GPUs</div>
              <div className="text-[10px] text-slate-400 font-mono">DDR5 & Custom Loops</div>
            </div>
          </div>

          {/* 3D Chassis Canvas */}
          <div className="rounded-3xl p-1 bg-gradient-to-b from-white/[0.12] via-white/[0.03] to-transparent shadow-2xl">
            <InteractiveRigCanvas
              primaryHex={activeTheme.primaryHex}
              secondaryHex={activeTheme.secondaryHex}
              cpuName="Ryzen 7 7800X3D"
              gpuName="RTX 4070 SUPER"
              ramText="32GB DDR5"
              coolerText="360mm AIO Cooler"
              isCompact={false}
            />
          </div>
        </ScrollReveal>

        {/* Primary CTA & Secondary Actions - Compact & High Impact */}
        <ScrollReveal variant="slide-up" delayMs={260}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10 max-w-xl mx-auto">
            {/* Main CTA */}
            <button
              onClick={onStartBuild}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-display font-bold text-sm sm:text-base tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all cursor-pointer btn-titanium-primary shadow-lg"
              style={{
                backgroundColor: activeTheme.primaryHex,
              }}
            >
              <span>BUILD MY PC</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Secondary Action */}
            <button
              onClick={onExplorePrebuilts}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-heading font-medium text-xs sm:text-sm text-slate-200 btn-titanium-secondary flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-slate-400" />
              <span>Explore Prebuilt Rigs</span>
            </button>

            {/* Quick Check Action */}
            <button
              onClick={onJumpToResults}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-heading font-medium text-xs sm:text-sm text-slate-300 hover:text-cyan-300 hover:bg-white/[0.04] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Quick Check Current Rig</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Login / Gamer Portal Action */}
            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-heading font-medium text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-cyan-400/25 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                title="Open Gamer Login & Registration"
              >
                <UserPlus className="w-4 h-4" />
                <span>Gamer Sign In</span>
              </button>
            )}
          </div>
        </ScrollReveal>

        {/* Feature Preview Cards - 5 Dedicated Modules Styled as Titanium Hardware Plates */}
        <div className="pt-6 border-t border-white/[0.08]">
          <ScrollReveal variant="fade" delayMs={290}>
            <div className="flex items-center justify-between mb-3 text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                SYSTEM CAPABILITIES & ARCHITECTURE
              </span>
              <span className="text-slate-500 hidden sm:inline">ZERO ESTIMATION GUESSWORK</span>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 text-left">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <ScrollReveal
                  key={idx}
                  variant="card"
                  delayMs={320 + idx * 50}
                  className="titanium-card p-3 sm:p-3.5 group cursor-default"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/[0.04] border border-white/[0.06] group-hover:border-cyan-400/40 transition-colors"
                      style={{ color: activeTheme.primaryHex }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-black/40 border border-white/[0.04]">
                      {feat.tag}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-200 mb-1 group-hover:text-white flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{feat.title}</span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                    {feat.desc}
                  </p>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {/* Compact Bottom Hardware Metrics Strip */}
        <ScrollReveal variant="fade" delayMs={500}>
          <div className="mt-6 pt-4 border-t border-white/[0.04] flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-100 font-bold">200+</span> CPUs Cataloged
            </div>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-100 font-bold">140+</span> GPUs Calibrated
            </div>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-100 font-bold">50+</span> Modern AAA Games
            </div>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Frame-Accurate Calculations
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};
