import React, { useState } from 'react';
import { SystemBuild } from '../types/hardware';
import { ThemeId, THEMES } from '../types/theme';
import { BuilderStep } from './BuilderProgressNav';
import { 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  Gamepad2, 
  HardDrive, 
  Layers, 
  MemoryStick, 
  Sparkles, 
  Thermometer, 
  ArrowRight,
  RotateCcw,
  Zap,
  Activity
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface PersistentBuildSummaryProps {
  build: SystemBuild;
  currentStep: BuilderStep;
  currentTheme: ThemeId;
  onNavigateToStep: (step: BuilderStep) => void;
  onResetBuild?: () => void;
  onViewResults: () => void;
}

export const PersistentBuildSummary: React.FC<PersistentBuildSummaryProps> = ({
  build,
  currentStep,
  currentTheme,
  onNavigateToStep,
  onResetBuild,
  onViewResults,
}) => {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const activeTheme = THEMES[currentTheme] || THEMES.cyberpunk;

  if (currentStep === 'hero') return null;

  const items = [
    {
      step: 'cpu' as BuilderStep,
      label: 'CPU',
      value: build.cpu ? `${build.cpu.brand} ${build.cpu.model}` : 'Not selected',
      detail: build.cpu ? `${build.cpu.cores}C/${build.cpu.threads}T • ${build.cpu.socket}` : 'Required',
      icon: Cpu,
      isSet: !!build.cpu,
    },
    {
      step: 'gpu' as BuilderStep,
      label: 'GPU',
      value: build.gpu ? build.gpu.model : 'Not selected',
      detail: build.gpu ? `${build.gpu.vramGb}GB ${build.gpu.vramType} • ${build.gpu.series}` : 'Required',
      icon: Gamepad2,
      isSet: !!build.gpu,
    },
    {
      step: 'motherboard' as BuilderStep,
      label: 'Motherboard',
      value: build.motherboard ? build.motherboard.model : 'Default Compatible',
      detail: build.motherboard ? `${build.motherboard.chipset} • ${build.motherboard.formFactor}` : 'Configured',
      icon: Layers,
      isSet: !!build.motherboard,
    },
    {
      step: 'ram' as BuilderStep,
      label: 'RAM',
      value: build.ram ? `${build.ram.capacityGb}GB ${build.ram.type}${build.ram.brand ? ` (${build.ram.brand})` : ''}` : 'Not selected',
      detail: build.ram ? `${build.ram.speedMhz} MHz • ${build.ram.channels === 2 ? 'Dual' : `${build.ram.channels}x`} Ch` : 'Required',
      icon: MemoryStick,
      isSet: !!build.ram,
    },
    {
      step: 'storage' as BuilderStep,
      label: 'Storage',
      value: build.storage ? `${build.storage.capacityGb >= 1000 ? `${build.storage.capacityGb / 1000}TB` : `${build.storage.capacityGb}GB`} ${build.storage.type.replace('_', ' ')}` : 'Standard SSD',
      detail: build.storage ? `${build.storage.readSpeedMbps} MB/s` : 'Configured',
      icon: HardDrive,
      isSet: !!build.storage,
    },
    {
      step: 'cooler' as BuilderStep,
      label: 'Cooler',
      value: build.cooler ? build.cooler.model : 'Standard Cooler',
      detail: build.cooler ? `${build.cooler.type.replace('_', ' ')} • ${build.cooler.ratedTdpWatts}W TDP` : 'Optional',
      icon: Thermometer,
      isSet: !!build.cooler,
    },
  ];

  const hasCoreComponents = build.cpu && build.gpu && build.ram;
  const estimatedPower = (build.cpu?.tdpWatts || 65) + (build.gpu?.tdpWatts || 150) + 75;

  return (
    <>
      {/* DESKTOP SIDE PANEL (Compact & High-Tech HUD) */}
      <aside className="hidden lg:block w-72 shrink-0 select-none">
        <ScrollReveal variant="card">
          <div className="sticky top-20 titanium-card p-4 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
              <div>
                <div className="text-[10px] font-mono tracking-widest uppercase text-slate-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  TELEMETRY HUD
                </div>
                <h3 className="text-xs font-display font-bold text-white flex items-center gap-1.5 mt-0.5 uppercase tracking-wide">
                  <span>CONFIGURED RIG</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    LIVE
                  </span>
                </h3>
              </div>
              {onResetBuild && (
                <button
                  onClick={onResetBuild}
                  title="Reset to default build"
                  className="text-slate-500 hover:text-slate-200 p-1 rounded-lg hover:bg-white/[0.06] transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          {/* Estimated Draw & Rig Health */}
          <div className="bg-black/40 border border-white/[0.06] rounded-xl p-2.5 mb-3 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              EST. POWER DRAW:
            </span>
            <span className="text-slate-100 font-bold">~{estimatedPower}W</span>
          </div>

          {/* Component HUD List */}
          <div className="space-y-1.5 mb-4">
            {items.map((item) => {
              const isCurrent = currentStep === item.step;
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  onClick={() => onNavigateToStep(item.step)}
                  className={`p-2 rounded-xl border transition-all duration-150 cursor-pointer text-left group ${
                    isCurrent
                      ? 'bg-white/[0.08] border-cyan-400/50 shadow-sm'
                      : 'bg-black/20 border-white/[0.04] hover:border-white/[0.12] hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span className="text-slate-400 font-mono text-[10px] uppercase flex items-center gap-1.5 group-hover:text-slate-200">
                      <Icon className="w-3 h-3 text-slate-400" />
                      <span>{item.label}</span>
                    </span>
                    {item.isSet ? (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 font-mono">
                        <Check className="w-2.5 h-2.5" /> READY
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 font-mono">PENDING</span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
                    {item.value}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">
                    {item.detail}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action CTA to View Results */}
          <button
            onClick={onViewResults}
            disabled={!hasCoreComponents}
            className={`w-full py-3 px-4 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
              hasCoreComponents
                ? 'btn-titanium-primary'
                : 'bg-white/[0.05] text-slate-500 border border-white/[0.06] cursor-not-allowed'
            }`}
          >
            <span>CHECK FPS RESULTS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        </ScrollReveal>
      </aside>

      {/* MOBILE BOTTOM FLOATING BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090d14]/95 border-t border-white/[0.1] backdrop-blur-xl p-3 shadow-2xl">
        <div className="max-w-md mx-auto">
          {/* Expanded Drawer */}
          {isMobileExpanded && (
            <div className="mb-3 p-3 bg-black/60 rounded-xl border border-white/[0.08] space-y-2 max-h-60 overflow-y-auto">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-2 border-b border-white/[0.06]">
                <span>CONFIGURED PARTS</span>
                {onResetBuild && (
                  <button onClick={onResetBuild} className="text-cyan-400 hover:underline">
                    Reset
                  </button>
                )}
              </div>
              {items.map((item) => (
                <div
                  key={item.step}
                  onClick={() => {
                    onNavigateToStep(item.step);
                    setIsMobileExpanded(false);
                  }}
                  className="flex items-center justify-between text-xs py-1 cursor-pointer border-b border-white/[0.03]"
                >
                  <span className="text-slate-400 font-mono text-[10px]">{item.label}:</span>
                  <span className="text-slate-200 font-medium truncate max-w-[160px] text-right">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Bar Controls */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setIsMobileExpanded(!isMobileExpanded)}
              className="flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-white"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 diode-pulse" />
              <span className="truncate max-w-[120px] font-bold">
                {build.gpu?.model || 'No GPU'}
              </span>
              {isMobileExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            <button
              onClick={onViewResults}
              disabled={!hasCoreComponents}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                hasCoreComponents ? 'btn-titanium-primary' : 'bg-white/10 text-slate-500'
              }`}
            >
              <span>SEE FPS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
