import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { AppView } from './Navigation';
import { SystemBuild } from '../types/hardware';

interface WizardProgressProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  build: SystemBuild;
}

interface StepDef {
  id: AppView;
  label: string;
  isFilled: boolean;
}

export const WizardProgress: React.FC<WizardProgressProps> = ({
  currentView,
  onNavigate,
  build,
}) => {
  const steps: StepDef[] = [
    { id: 'cpu', label: 'CPU', isFilled: Boolean(build.cpu?.model) },
    { id: 'gpu', label: 'GPU', isFilled: Boolean(build.gpu?.model) },
    { id: 'motherboard', label: 'Motherboard', isFilled: Boolean(build.motherboard?.model) },
    { id: 'ram', label: 'RAM', isFilled: Boolean(build.ram?.capacityGb) },
    { id: 'storage', label: 'Storage', isFilled: Boolean(build.storage?.name) },
    { id: 'cooler', label: 'Cooler', isFilled: Boolean(build.cooler?.model) },
    { id: 'results', label: 'Results', isFilled: false },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentView);
  const isInsideWizard = currentStepIndex !== -1;

  if (!isInsideWizard && currentView !== 'results') {
    return null;
  }

  return (
    <div className="w-full bg-[#10141e]/80 border-b border-white/[0.06] backdrop-blur-md sticky top-16 z-30 py-3.5 px-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar gap-2 sm:gap-4 text-xs font-mono">
        {steps.map((step, idx) => {
          const isCurrent = step.id === currentView;
          const isCompleted = idx < currentStepIndex || (step.isFilled && !isCurrent);

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => onNavigate(step.id)}
                className={`flex items-center gap-2 py-1 px-2.5 rounded-lg whitespace-nowrap transition-all group ${
                  isCurrent
                    ? 'bg-white/[0.12] text-white font-bold shadow-sm border border-white/20'
                    : isCompleted
                    ? 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {/* Status Dot / Checkmark */}
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 font-sans transition-all ${
                    isCurrent
                      ? 'bg-cyan-400 text-slate-950 font-bold shadow-sm shadow-cyan-500/40'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'border border-white/20 text-slate-500'
                  }`}
                >
                  {isCompleted && !isCurrent ? (
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  ) : (
                    idx + 1
                  )}
                </span>

                <span className="font-sans text-xs tracking-tight">
                  {step.label}
                </span>

                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse hidden sm:inline-block" />
                )}
              </button>

              {idx < steps.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0 hidden sm:block" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
