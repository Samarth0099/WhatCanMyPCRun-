import React, { useState, useMemo } from 'react';
import { CPUS_DATABASE } from '../data/cpus';
import { GPUS_DATABASE } from '../data/gpus';
import { RAM_PRESETS, STORAGE_PRESETS, COOLERS_DATABASE, MONITORS_DATABASE, MOTHERBOARDS_DATABASE } from '../data/otherHardware';
import { SystemBuild, CPU, GPU, RAMConfig, StorageConfig, Cooler, Monitor, Motherboard } from '../types/hardware';
import { Search, ChevronDown, Sliders, Monitor as MonitorIcon, HardDrive, Fan, Layers, Check, Wrench } from 'lucide-react';

interface HardwareSelectorProps {
  build: SystemBuild;
  onChangeBuild: (updated: SystemBuild) => void;
  onOpenCustomPartModal: () => void;
}

export const HardwareSelector: React.FC<HardwareSelectorProps> = ({
  build,
  onChangeBuild,
  onOpenCustomPartModal,
}) => {
  const [cpuQuery, setCpuQuery] = useState('');
  const [gpuQuery, setGpuQuery] = useState('');
  const [isCpuOpen, setIsCpuOpen] = useState(false);
  const [isGpuOpen, setIsGpuOpen] = useState(false);
  const [cpuBrandFilter, setCpuBrandFilter] = useState<'All' | 'Intel' | 'AMD'>('All');
  const [gpuBrandFilter, setGpuBrandFilter] = useState<'All' | 'Nvidia' | 'AMD' | 'Intel'>('All');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Filtered CPUs
  const filteredCpus = useMemo(() => {
    return CPUS_DATABASE.filter(cpu => {
      const matchesBrand = cpuBrandFilter === 'All' || cpu.brand === cpuBrandFilter;
      const matchesQuery = cpu.model.toLowerCase().includes(cpuQuery.toLowerCase()) ||
                           cpu.series.toLowerCase().includes(cpuQuery.toLowerCase());
      return matchesBrand && matchesQuery;
    });
  }, [cpuQuery, cpuBrandFilter]);

  // Filtered GPUs
  const filteredGpus = useMemo(() => {
    return GPUS_DATABASE.filter(gpu => {
      const matchesBrand = gpuBrandFilter === 'All' || gpu.brand === gpuBrandFilter;
      const matchesQuery = gpu.model.toLowerCase().includes(gpuQuery.toLowerCase()) ||
                           gpu.series.toLowerCase().includes(gpuQuery.toLowerCase());
      return matchesBrand && matchesQuery;
    });
  }, [gpuQuery, gpuBrandFilter]);

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 sm:p-6 shadow-xl mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-3">
        <div>
          <h1 className="text-xl font-bold font-display text-white tracking-tight">Select Your PC Specs</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Configure your CPU, GPU, and RAM to estimate accurate in-game frame rates and bottlenecks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCustomPartModal}
            className="px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-750 text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Wrench className="w-3.5 h-3.5 text-emerald-400" />
            <span>Part Not Listed? Enter Custom</span>
          </button>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showAdvanced ? 'Hide Extras' : 'Storage / Cooler / Motherboard'}</span>
          </button>
        </div>
      </div>

      {/* Primary Selector Grid: CPU, GPU, RAM, Monitor */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {/* CPU Selector */}
        <div className="relative">
          <label className="block text-xs font-medium text-neutral-400 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              Processor (CPU)
              <span className="text-emerald-400 font-bold">*</span>
            </span>
            <span className="text-[11px] text-neutral-500 font-mono">
              Score: {build.cpu.gamingScore}
            </span>
          </label>

          <div
            onClick={() => setIsCpuOpen(!isCpuOpen)}
            className="w-full bg-neutral-950 border border-neutral-800 hover:border-neutral-700 rounded-lg p-2.5 cursor-pointer flex items-center justify-between text-left transition-colors"
          >
            <div className="truncate pr-2">
              <div className="text-sm font-semibold text-white truncate">{build.cpu.model}</div>
              <div className="text-[11px] text-neutral-400">
                {build.cpu.cores} Cores · {build.cpu.socket} · {build.cpu.tdpWatts}W TDP
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
          </div>

          {/* Autocomplete Dropdown */}
          {isCpuOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl p-2 max-h-80 flex flex-col">
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search CPU (e.g. 7800X3D, 13600K, 5600)..."
                  value={cpuQuery}
                  onChange={(e) => setCpuQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-neutral-950 border border-neutral-750 text-xs text-white rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Brand Filters */}
              <div className="flex items-center gap-1 mb-2 px-1">
                {(['All', 'Intel', 'AMD'] as const).map(brand => (
                  <button
                    key={brand}
                    onClick={() => setCpuBrandFilter(brand)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                      cpuBrandFilter === brand
                        ? 'bg-neutral-700 text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>

              {/* List */}
              <div className="overflow-y-auto flex-1 divide-y divide-neutral-800">
                {filteredCpus.map(cpu => (
                  <button
                    key={cpu.id}
                    onClick={() => {
                      onChangeBuild({ ...build, cpu });
                      setIsCpuOpen(false);
                      setCpuQuery('');
                    }}
                    className={`w-full text-left p-2 hover:bg-neutral-800 rounded flex items-center justify-between group transition-colors ${
                      build.cpu.id === cpu.id ? 'bg-emerald-950/30 text-emerald-300' : 'text-neutral-200'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="text-xs font-semibold group-hover:text-white truncate">
                        {cpu.model}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        {cpu.cores}C/{cpu.threads}T · {cpu.socket} · {cpu.releaseYear}
                      </div>
                    </div>
                    {build.cpu.id === cpu.id && (
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                  </button>
                ))}
                {filteredCpus.length === 0 && (
                  <div className="p-3 text-center text-xs text-neutral-500">
                    No CPU matched your search.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* GPU Selector */}
        <div className="relative">
          <label className="block text-xs font-medium text-neutral-400 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              Graphics Card (GPU)
              <span className="text-emerald-400 font-bold">*</span>
            </span>
            <span className="text-[11px] text-neutral-500 font-mono">
              Score: {build.gpu.scoreRaster}
            </span>
          </label>

          <div
            onClick={() => setIsGpuOpen(!isGpuOpen)}
            className="w-full bg-neutral-950 border border-neutral-800 hover:border-neutral-700 rounded-lg p-2.5 cursor-pointer flex items-center justify-between text-left transition-colors"
          >
            <div className="truncate pr-2">
              <div className="text-sm font-semibold text-white truncate">{build.gpu.model}</div>
              <div className="text-[11px] text-neutral-400">
                {build.gpu.vramGb}GB {build.gpu.vramType} · {build.gpu.tdpWatts}W TDP
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
          </div>

          {/* Autocomplete Dropdown */}
          {isGpuOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl p-2 max-h-80 flex flex-col">
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search GPU (e.g. 4070, 3060, 7800 XT, 1660)..."
                  value={gpuQuery}
                  onChange={(e) => setGpuQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-neutral-950 border border-neutral-750 text-xs text-white rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Brand Filters */}
              <div className="flex items-center gap-1 mb-2 px-1">
                {(['All', 'Nvidia', 'AMD', 'Intel'] as const).map(brand => (
                  <button
                    key={brand}
                    onClick={() => setGpuBrandFilter(brand)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                      gpuBrandFilter === brand
                        ? 'bg-neutral-700 text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>

              {/* List */}
              <div className="overflow-y-auto flex-1 divide-y divide-neutral-800">
                {filteredGpus.map(gpu => (
                  <button
                    key={gpu.id}
                    onClick={() => {
                      onChangeBuild({ ...build, gpu });
                      setIsGpuOpen(false);
                      setGpuQuery('');
                    }}
                    className={`w-full text-left p-2 hover:bg-neutral-800 rounded flex items-center justify-between group transition-colors ${
                      build.gpu.id === gpu.id ? 'bg-emerald-950/30 text-emerald-300' : 'text-neutral-200'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="text-xs font-semibold group-hover:text-white truncate">
                        {gpu.model}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        {gpu.vramGb}GB {gpu.vramType} · {gpu.series} · {gpu.releaseYear}
                      </div>
                    </div>
                    {build.gpu.id === gpu.id && (
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                  </button>
                ))}
                {filteredGpus.length === 0 && (
                  <div className="p-3 text-center text-xs text-neutral-500">
                    No GPU matched your search.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RAM Selector */}
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              Memory (RAM)
              <span className="text-emerald-400 font-bold">*</span>
            </span>
            <span className="text-[11px] text-neutral-500 font-mono">
              {build.ram.channels === 2 ? 'Dual Channel' : build.ram.channels === 1 ? 'Single Channel' : 'Quad Channel'}
            </span>
          </label>

          <select
            aria-label="Select RAM Configuration"
            value={`${build.ram.capacityGb}-${build.ram.type}-${build.ram.speedMhz}-${build.ram.channels}`}
            onChange={(e) => {
              const [cap, type, speed, ch] = e.target.value.split('-');
              onChangeBuild({
                ...build,
                ram: {
                  capacityGb: Number(cap),
                  type: type as RAMConfig['type'],
                  speedMhz: Number(speed),
                  channels: Number(ch) as 1 | 2 | 4,
                },
              });
            }}
            className="w-full bg-neutral-950 border border-neutral-800 hover:border-neutral-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {RAM_PRESETS.map((r, i) => (
              <option key={i} value={`${r.capacityGb}-${r.type}-${r.speedMhz}-${r.channels}`}>
                {r.capacityGb}GB {r.type}-{r.speedMhz} MHz ({r.channels === 2 ? 'Dual Channel' : 'Single Channel'})
              </option>
            ))}
          </select>
        </div>

        {/* Monitor Selector */}
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1.5 flex items-center justify-between">
            <span>Primary Monitor</span>
            <span className="text-[11px] text-neutral-500 font-mono">
              {build.monitor.refreshRateHz}Hz
            </span>
          </label>

          <select
            aria-label="Select Monitor Resolution and Refresh Rate"
            value={`${build.monitor.resolution}-${build.monitor.refreshRateHz}`}
            onChange={(e) => {
              const [res, hz] = e.target.value.split('-');
              onChangeBuild({
                ...build,
                monitor: {
                  resolution: res as Monitor['resolution'],
                  refreshRateHz: Number(hz),
                  aspectRatio: '16:9',
                },
              });
            }}
            className="w-full bg-neutral-950 border border-neutral-800 hover:border-neutral-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {MONITORS_DATABASE.map((m, i) => (
              <option key={i} value={`${m.resolution}-${m.refreshRateHz}`}>
                {m.resolution} @ {m.refreshRateHz}Hz
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Hardware Drawer: Storage, Motherboard, Cooler */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-neutral-800/80">
          {/* Storage */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-neutral-500" />
              <span>Storage Drive</span>
            </label>
            <select
              aria-label="Select Storage Drive"
              value={build.storage?.type || STORAGE_PRESETS[1].type}
              onChange={(e) => {
                const selected = STORAGE_PRESETS.find(s => s.type === e.target.value) || STORAGE_PRESETS[1];
                onChangeBuild({ ...build, storage: selected });
              }}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {STORAGE_PRESETS.map((s) => (
                <option key={s.type} value={s.type}>
                  {s.name} (~{s.readSpeedMbps} MB/s)
                </option>
              ))}
            </select>
          </div>

          {/* Cooler */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5 flex items-center gap-1.5">
              <Fan className="w-3.5 h-3.5 text-neutral-500" />
              <span>CPU Cooler</span>
            </label>
            <select
              aria-label="Select CPU Cooler"
              value={build.cooler?.id || COOLERS_DATABASE[0].id}
              onChange={(e) => {
                const selected = COOLERS_DATABASE.find(c => c.id === e.target.value) || COOLERS_DATABASE[0];
                onChangeBuild({ ...build, cooler: selected });
              }}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {COOLERS_DATABASE.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.brand} {c.model} ({c.ratedTdpWatts}W TDP)
                </option>
              ))}
            </select>
          </div>

          {/* Motherboard */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-neutral-500" />
              <span>Motherboard</span>
            </label>
            <select
              aria-label="Select Motherboard"
              value={build.motherboard?.id || ''}
              onChange={(e) => {
                const selected = MOTHERBOARDS_DATABASE.find(m => m.id === e.target.value);
                onChangeBuild({ ...build, motherboard: selected });
              }}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="">Auto-matched / Generic Motherboard</option>
              {MOTHERBOARDS_DATABASE.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.brand} {m.model} ({m.chipset} · {m.socket})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
