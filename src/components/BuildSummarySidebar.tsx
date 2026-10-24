import React, { useState } from 'react';
import { Cpu, Zap, Layers, HardDrive, Fan, Monitor, Check, ChevronDown, ChevronUp, ArrowRight, RotateCcw } from 'lucide-react';
import { SystemBuild } from '../types/hardware';
import { AppView } from './Navigation';
import { PREBUILT_SYSTEMS } from '../data/otherHardware';

interface BuildSummarySidebarProps {
  build: SystemBuild;
  onNavigate: (view: AppView) => void;
  onResetBuild?: () => void;
  currentView: AppView;
}

export const BuildSummarySidebar: React.FC<BuildSummarySidebarProps> = ({
  build,
  onNavigate,
  onResetBuild,
  currentView,
}) => {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const items = [
    {
      key: 'cpu' as AppView,
      label: 'CPU',
      value: build.cpu?.model || 'Not Selected',
      detail: `${build.cpu?.cores || 0}C / ${build.cpu?.threads || 0}T`,
      icon: Cpu,
      isSet: Boolean(build.cpu?.model),
    },
    {
      key: 'gpu' as AppView,
      label: 'GPU',
      value: build.gpu?.model || 'Not Selected',
      detail: `${build.gpu?.vramGb || 0}GB ${build.gpu?.vramType || 'VRAM'}`,
      icon: Zap,
      isSet: Boolean(build.gpu?.model),
    },
    {
      key: 'motherboard' as AppView,
      label: 'Motherboard',
      value: build.motherboard?.model || 'Generic ATX Board',
      detail: `${build.motherboard?.chipset || 'B650'} · ${build.motherboard?.socket || build.cpu?.socket || 'AM5'}`,
      icon: HardDrive,
      isSet: Boolean(build.motherboard?.model),
    },
    {
      key: 'ram' as AppView,
      label: 'RAM',
      value: `${build.ram?.capacityGb || 16}GB ${build.ram?.type || 'DDR5'}`,
      detail: `${build.ram?.speedMhz || 6000}MHz ${build.ram?.channels === 2 ? 'Dual' : 'Single'} Channel`,
      icon: Layers,
      isSet: Boolean(build.ram?.capacityGb),
    },
    {
      key: 'storage' as AppView,
      label: 'Storage',
      value: build.storage?.type.replace('_', ' ') || '1TB NVMe SSD',
      detail: `${build.storage?.capacityGb || 1000}GB (${build.storage?.readSpeedMbps || 5000} MB/s)`,
      icon: HardDrive,
      isSet: Boolean(build.storage?.name),
    },
    {
      key: 'cooler' as AppView,
      label: 'Cooler',
      value: build.cooler?.model || 'Stock / Air Cooler',
      detail: `${build.cooler?.type.replace('_', ' ') || 'Air'} (${build.cooler?.ratedTdpWatts || 180}W)`,
      icon: Fan,
      isSet: Boolean(build.cooler?.model),
    },
  ];

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="w-80 shrink-0 hidden lg:block">
        <div className="sticky top-36 bg-[#10141e]/90 border border-white/[0.08] rounded-2xl p-5 shadow-2xl backdrop-blur-xl card-depth-3d">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-4">
            <div>
              <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">Active Build</div>
              <h3 className="text-base font-bold font-display text-white mt-0.5">YOUR PC RIG</h3>
            </div>
            {onResetBuild && (
              <button
                onClick={onResetBuild}
                title="Reset to recommended reference build"
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Component Selection List */}
          <div className="space-y-2.5">
            {items.map(item => {
              const Icon = item.icon;
              const isCurrentStep = currentView === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() => onNavigate(item.key)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-3 group ${
                    isCurrentStep
                      ? 'bg-white/[0.08] border-cyan-500/40 shadow-sm'
                      : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.1]'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg mt-0.5 shrink-0 ${
                    item.isSet ? 'bg-cyan-500/10 text-cyan-400' : 'bg-white/[0.04] text-slate-500'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 text-[11px] font-mono text-slate-400">
                      <span>{item.label}</span>
                      {item.isSet && (
                        <span className="text-emerald-400 flex items-center gap-0.5 text-[10px]">
                          <Check className="w-2.5 h-2.5 stroke-[3]" /> Ready
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-slate-100 truncate mt-0.5 group-hover:text-cyan-300 transition-colors">
                      {item.value}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate font-mono mt-0.5">
                      {item.detail}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Jump to Results CTA */}
          <div className="mt-5 pt-4 border-t border-white/[0.06]">
            <button
              onClick={() => onNavigate('results')}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold font-sans flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all btn-tactile"
            >
              <span>See Game Performance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Collapsible Drawer (Bottom) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#10141e]/95 border-t border-white/[0.1] backdrop-blur-2xl shadow-2xl">
        <div className="px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-white font-mono">
              RIG: {build.gpu?.model.split('GeForce ')[1] || build.gpu?.model || 'PC'} + {build.cpu?.model.replace('AMD Ryzen', 'Ryzen').replace('Intel Core', 'Core') || 'CPU'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileExpanded(!isMobileExpanded)}
              className="p-1.5 rounded-lg bg-white/[0.06] text-slate-300 text-xs flex items-center gap-1 font-mono"
            >
              <span>Specs</span>
              {isMobileExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => onNavigate('results')}
              className="py-1 px-3 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs"
            >
              Results →
            </button>
          </div>
        </div>

        {isMobileExpanded && (
          <div className="px-4 pb-4 pt-1 max-h-60 overflow-y-auto space-y-2 border-t border-white/[0.06] mt-1">
            {items.map(item => (
              <div
                key={item.key}
                onClick={() => {
                  onNavigate(item.key);
                  setIsMobileExpanded(false);
                }}
                className="flex items-center justify-between text-xs py-1.5 border-b border-white/[0.04]"
              >
                <span className="text-slate-400 font-mono text-[11px]">{item.label}</span>
                <span className="text-slate-200 font-semibold truncate max-w-[200px]">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
