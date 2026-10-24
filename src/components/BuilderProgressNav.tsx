import React from 'react';
import { Check, ChevronRight, Home, Sparkles, Cpu, Gamepad2, Layers, MemoryStick, HardDrive, Thermometer, Gauge } from 'lucide-react';
import { ThemeId, THEMES } from '../types/theme';

export type BuilderStep = 'hero' | 'cpu' | 'gpu' | 'motherboard' | 'ram' | 'storage' | 'cooler' | 'results' | 'compare' | 'auth';

interface BuilderProgressNavProps {
  currentStep: BuilderStep;
  currentTheme: ThemeId;
  onSelectStep: (step: BuilderStep) => void;
  completedSteps: Record<string, boolean>;
}

interface StepItem {
  id: BuilderStep;
  label: string;
  shortLabel: string;
  stepNum: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepItem[] = [
  { id: 'cpu', label: 'CPU', shortLabel: 'CPU', stepNum: '01', icon: Cpu },
  { id: 'gpu', label: 'GPU', shortLabel: 'GPU', stepNum: '02', icon: Gamepad2 },
  { id: 'motherboard', label: 'Motherboard', shortLabel: 'MOBO', stepNum: '03', icon: Layers },
  { id: 'ram', label: 'RAM', shortLabel: 'RAM', stepNum: '04', icon: MemoryStick },
  { id: 'storage', label: 'Storage', shortLabel: 'SSD', stepNum: '05', icon: HardDrive },
  { id: 'cooler', label: 'Cooler', shortLabel: 'AIO', stepNum: '06', icon: Thermometer },
  { id: 'results', label: 'Results', shortLabel: 'FPS', stepNum: '07', icon: Gauge },
];

export const BuilderProgressNav: React.FC<BuilderProgressNavProps> = ({
  currentStep,
  currentTheme,
  onSelectStep,
  completedSteps,
}) => {
  const activeTheme = THEMES[currentTheme] || THEMES.cyberpunk;

  if (currentStep === 'hero') return null;

  return (
    <div className="w-full mb-6 pt-1 select-none">
      <div className="titanium-glass-panel rounded-2xl p-2 sm:p-2.5">
        <div className="flex items-center justify-between overflow-x-auto scrollbar-none gap-1 sm:gap-2 px-1">
          {/* Home / Exit button */}
          <button
            onClick={() => onSelectStep('hero')}
            title="Return to Hero"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-100 hover:bg-white/[0.06] transition-all cursor-pointer shrink-0"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">EXIT</span>
          </button>

          <div className="h-4 w-px bg-white/[0.1] shrink-0 hidden sm:block" />

          {/* Stepper items */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-1 justify-center sm:justify-start">
            {STEPS.map((step, idx) => {
              const isCurrent = currentStep === step.id;
              const isCompleted = completedSteps[step.id];
              const Icon = step.icon;

              return (
                <React.Fragment key={step.id}>
                  {idx > 0 && (
                    <ChevronRight className="w-3 h-3 text-slate-600 shrink-0 hidden md:block opacity-60" />
                  )}
                  <button
                    onClick={() => onSelectStep(step.id)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-150 cursor-pointer shrink-0 relative ${
                      isCurrent
                        ? 'font-bold text-white shadow-lg border'
                        : isCompleted
                        ? 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                    style={
                      isCurrent
                        ? {
                            backgroundColor: 'rgba(16, 24, 38, 0.95)',
                            borderColor: activeTheme.primaryHex,
                            boxShadow: `0 0 16px -2px ${activeTheme.primaryHex}40`,
                          }
                        : {}
                    }
                  >
                    {/* Status marker */}
                    {isCompleted && !isCurrent ? (
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                    ) : isCurrent ? (
                      <span
                        className="w-2 h-2 rounded-full diode-pulse shrink-0"
                        style={{ backgroundColor: activeTheme.primaryHex }}
                      />
                    ) : (
                      <span className="text-[10px] text-slate-600 font-mono">
                        {step.stepNum}
                      </span>
                    )}

                    <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-cyan-400' : 'text-slate-400 opacity-70'}`} />

                    <span className="hidden sm:inline uppercase text-[11px] tracking-wider">{step.label}</span>
                    <span className="sm:hidden text-[10px]">{step.shortLabel}</span>

                    {step.id === 'results' && (
                      <Sparkles className="w-3 h-3 text-cyan-400 ml-0.5" />
                    )}
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
