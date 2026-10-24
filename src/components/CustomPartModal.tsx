import React, { useState } from 'react';
import { CPU, GPU, SystemBuild } from '../types/hardware';
import { X, Wrench, CheckCircle } from 'lucide-react';

interface CustomPartModalProps {
  isOpen: boolean;
  onClose: () => void;
  build: SystemBuild;
  onApplyCustom: (updated: SystemBuild) => void;
}

export const CustomPartModal: React.FC<CustomPartModalProps> = ({
  isOpen,
  onClose,
  build,
  onApplyCustom,
}) => {
  const [customType, setCustomType] = useState<'GPU' | 'CPU'>('GPU');

  // Custom GPU fields
  const [gpuName, setGpuName] = useState('Custom Gaming GPU');
  const [gpuVram, setGpuVram] = useState(8);
  const [gpuTier, setGpuTier] = useState<number>(100); // 100 = RTX 3060 baseline
  const [supportsDlss, setSupportsDlss] = useState(false);
  const [supportsFsr, setSupportsFsr] = useState(true);

  // Custom CPU fields
  const [cpuName, setCpuName] = useState('Custom Gaming CPU');
  const [cpuCores, setCpuCores] = useState(6);
  const [cpuThreads, setCpuThreads] = useState(12);
  const [cpuScore, setCpuScore] = useState<number>(110); // 100 = i5-12400 baseline

  if (!isOpen) return null;

  const handleSave = () => {
    if (customType === 'GPU') {
      const customGpu: GPU = {
        id: `custom-gpu-${Date.now()}`,
        brand: 'Nvidia',
        model: gpuName || 'Custom GPU',
        series: 'Custom',
        vramGb: Number(gpuVram) || 8,
        vramType: 'GDDR6',
        busWidthBits: 192,
        tdpWatts: 175,
        releaseYear: 2024,
        isLaptop: false,
        isIntegrated: false,
        scoreRaster: Number(gpuTier) || 100,
        supportsDLSS: supportsDlss,
        supportsDLSS3FrameGen: false,
        supportsFSR: supportsFsr,
        supportsXeSS: true,
      };
      onApplyCustom({ ...build, gpu: customGpu });
    } else {
      const customCpu: CPU = {
        id: `custom-cpu-${Date.now()}`,
        brand: 'AMD',
        model: cpuName || 'Custom CPU',
        series: 'Custom',
        socket: 'AM4',
        cores: Number(cpuCores) || 6,
        threads: Number(cpuThreads) || 12,
        baseClockGhz: 3.5,
        boostClockGhz: 4.4,
        tdpWatts: 65,
        releaseYear: 2024,
        isLaptop: false,
        scoreSingle: Number(cpuScore) || 100,
        scoreMulti: Number(cpuScore) || 100,
        gamingScore: Number(cpuScore) || 100,
      };
      onApplyCustom({ ...build, cpu: customCpu });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0e111a] border border-white/[0.08] rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold font-display text-white">Manual Part Specification</h2>
            <p className="text-xs text-slate-400">Enter custom specs if your component isn't listed.</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-white/[0.02] rounded-xl border border-white/[0.06] mb-5">
          <button
            onClick={() => setCustomType('GPU')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              customType === 'GPU' ? 'bg-white/[0.12] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Custom GPU
          </button>
          <button
            onClick={() => setCustomType('CPU')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              customType === 'CPU' ? 'bg-white/[0.12] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Custom CPU
          </button>
        </div>

        {customType === 'GPU' ? (
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Model Name</label>
              <input
                type="text"
                value={gpuName}
                onChange={(e) => setGpuName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Radeon RX 7600 XT or RTX 3060 12GB"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">VRAM Capacity (GB)</label>
              <input
                type="number"
                min="1"
                max="48"
                value={gpuVram}
                onChange={(e) => setGpuVram(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1 flex justify-between">
                <span>Estimated Performance Tier</span>
                <span className="font-mono text-emerald-400 font-bold">{gpuTier} pts</span>
              </label>
              <input
                type="range"
                min="10"
                max="400"
                step="5"
                value={gpuTier}
                onChange={(e) => setGpuTier(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 mt-1 font-mono">
                <span>GTX 1050 (30)</span>
                <span>RTX 3060 (100)</span>
                <span>RTX 4070 (175)</span>
                <span>RTX 4090 (385)</span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                <input
                  type="checkbox"
                  checked={supportsDlss}
                  onChange={(e) => setSupportsDlss(e.target.checked)}
                  className="rounded accent-emerald-500"
                />
                <span>Supports DLSS</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                <input
                  type="checkbox"
                  checked={supportsFsr}
                  onChange={(e) => setSupportsFsr(e.target.checked)}
                  className="rounded accent-emerald-500"
                />
                <span>Supports FSR</span>
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Model Name</label>
              <input
                type="text"
                value={cpuName}
                onChange={(e) => setCpuName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Ryzen 5 7500F or Core i5-13400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">Physical Cores</label>
                <input
                  type="number"
                  min="2"
                  max="64"
                  value={cpuCores}
                  onChange={(e) => setCpuCores(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-neutral-300 font-medium mb-1">Threads</label>
                <input
                  type="number"
                  min="2"
                  max="128"
                  value={cpuThreads}
                  onChange={(e) => setCpuThreads(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1 flex justify-between">
                <span>Gaming IPC Score</span>
                <span className="font-mono text-emerald-400 font-bold">{cpuScore} pts</span>
              </label>
              <input
                type="range"
                min="20"
                max="200"
                step="5"
                value={cpuScore}
                onChange={(e) => setCpuScore(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 mt-1 font-mono">
                <span>i7-4790K (58)</span>
                <span>i5-12400F (114)</span>
                <span>7800X3D (188)</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-white/[0.06]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-all flex items-center gap-1.5 btn-tactile"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Apply Custom Part
          </button>
        </div>
      </div>
    </div>
  );
};
