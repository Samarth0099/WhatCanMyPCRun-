import React from 'react';
import { ArrowRight, Wrench, Gauge, Gamepad2, CheckCircle, Sparkles, Cpu, Zap, Layers } from 'lucide-react';
import { ThemeConfig } from '../../types/theme';
import { PREBUILT_SYSTEMS } from '../../data/otherHardware';
import { SystemBuild } from '../../types/hardware';

interface HeroPageProps {
  theme: ThemeConfig;
  onStartBuilding: () => void;
  onSelectPrebuilt: (build: SystemBuild) => void;
  onBrowseGames: () => void;
}

export const HeroPage: React.FC<HeroPageProps> = ({
  theme,
  onStartBuilding,
  onSelectPrebuilt,
  onBrowseGames,
}) => {
  const features = [
    { title: 'Build your PC', desc: 'Step-by-step modular component selector for every part of your rig.', icon: Wrench },
    { title: 'Select your components', desc: 'Over 140+ real CPUs and GPUs from Intel, AMD, NVIDIA, and board partners.', icon: Cpu },
    { title: 'Check game performance', desc: 'Real benchmark interpolation engine calibrated on published hardware test data.', icon: Gauge },
    { title: 'Estimate FPS', desc: 'Instant average FPS and 1% lows across 1080p, 1440p, and 4K resolutions.', icon: Zap },
    { title: 'Find playable games', desc: 'Discover which AAA and competitive titles run smoothly on your exact hardware.', icon: Gamepad2 },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
      {/* Subtle Hardware Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium mb-8 bg-white/[0.03] border border-white/[0.08] text-slate-300">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primaryHex }} />
        <span>PC Builder & Gaming Performance Estimator</span>
      </div>

      {/* Main Website Name with Theme Gradient */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-display tracking-tight text-white leading-[1.08] uppercase">
        WHAT CAN MY PC <span className={`bg-gradient-to-r ${theme.headingGradient} bg-clip-text text-transparent`}>RUN?</span>
      </h1>

      {/* Short Description */}
      <p className="text-base sm:text-xl text-slate-400 mt-6 max-w-2xl mx-auto font-normal leading-relaxed">
        Build your PC setup, select your components, and discover what games your system can run.
      </p>

      {/* Main CTA */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onStartBuilding}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold font-sans text-base shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-3 btn-tactile group"
        >
          <span>BUILD MY PC</span>
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>

        <button
          onClick={onBrowseGames}
          className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-slate-300 hover:text-white font-medium text-sm transition-all btn-tactile"
        >
          Browse All Games Directly →
        </button>
      </div>

      {/* Feature Preview Cards */}
      <div className="mt-20 sm:mt-24 pt-12 border-t border-white/[0.06]">
        <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-8 font-semibold">
          How It Works
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bg-[#10141e]/90 border border-white/[0.07] rounded-2xl p-5 card-depth-3d flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-cyan-400 mb-4">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white font-display">{f.title}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick 1-Click Reference Builds */}
      <div className="mt-16 text-left bg-[#10141e]/50 border border-white/[0.06] rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Or Start with a Popular Reference Rig</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any prebuilt setup to immediately populate parts and test game performance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {PREBUILT_SYSTEMS.slice(0, 3).map((p, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPrebuilt(p.build)}
              className="text-left p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.15] transition-all group btn-tactile"
            >
              <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                {p.name.split('(')[0].trim()}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">
                {p.build.gpu.model} · {p.build.cpu.model}
              </div>
              <div className="text-[10px] text-cyan-400 font-semibold mt-2 flex items-center gap-1 font-mono">
                <span>Load this rig & test</span>
                <span>→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
