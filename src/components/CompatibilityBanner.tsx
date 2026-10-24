import React from 'react';
import { CompatibilityIssue, SystemBuild } from '../types/hardware';
import { AlertTriangle, AlertCircle, Info, Zap, ShieldCheck } from 'lucide-react';

interface CompatibilityBannerProps {
  issues: CompatibilityIssue[];
  build: SystemBuild;
}

export const CompatibilityBanner: React.FC<CompatibilityBannerProps> = ({ issues, build }) => {
  if (issues.length === 0) {
    return (
      <div className="titanium-card p-3.5 sm:p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg select-none">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2 font-heading uppercase tracking-wide">
              <span>BALANCED HARDWARE PAIRING</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 diode-pulse" />
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              {build.cpu.model} and {build.gpu.model} form a harmonious pairing with zero severe bottlenecking.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.04] w-full sm:w-auto justify-between sm:justify-start">
          <div>
            RAM: <span className="text-slate-100 font-bold">{build.ram.capacityGb}GB {build.ram.type}</span>
          </div>
          <div>
            Display: <span className="text-slate-100 font-bold">{build.monitor.resolution}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5 mb-6 select-none">
      {issues.map((issue, idx) => {
        const isCritical = issue.severity === 'critical';
        const isWarning = issue.severity === 'warning';

        return (
          <div
            key={idx}
            className={`rounded-xl p-3.5 sm:p-4 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md ${
              isCritical
                ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                : isWarning
                ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                : 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                  isCritical
                    ? 'bg-rose-500/20 text-rose-400'
                    : isWarning
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-cyan-500/20 text-cyan-400'
                }`}
              >
                {isCritical ? (
                  <AlertCircle className="w-4 h-4" />
                ) : isWarning ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <Info className="w-4 h-4" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold font-heading tracking-tight flex items-center gap-2">
                  <span>{issue.title}</span>
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-black/50 text-slate-300 border border-white/[0.08]">
                    {issue.category}
                  </span>
                </div>
                <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {issue.description}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5 font-medium font-mono">
                  <span className="text-cyan-400 font-bold uppercase tracking-wider">Suggested Fix:</span>
                  <span className="text-slate-200">{issue.recommendation}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
