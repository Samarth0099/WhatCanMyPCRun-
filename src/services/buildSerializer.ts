import { SystemBuild, CPU, GPU, RAMConfig, Monitor } from '../types/hardware';
import { CPUS_DATABASE } from '../data/cpus';
import { GPUS_DATABASE } from '../data/gpus';
import { RAM_PRESETS, MONITORS_DATABASE, STORAGE_PRESETS } from '../data/otherHardware';

export function serializeBuildToQuery(build: SystemBuild): string {
  const params = new URLSearchParams();
  params.set('cpu', build.cpu.id);
  params.set('gpu', build.gpu.id);
  params.set('ram', `${build.ram.capacityGb}-${build.ram.type}-${build.ram.speedMhz}-${build.ram.channels}`);
  params.set('res', build.monitor.resolution);
  params.set('hz', String(build.monitor.refreshRateHz));
  return params.toString();
}

export function parseBuildFromUrl(): Partial<SystemBuild> | null {
  if (typeof window === 'undefined') return null;

  const urlParams = new URLSearchParams(window.location.search);
  const cpuId = urlParams.get('cpu');
  const gpuId = urlParams.get('gpu');
  const ramParam = urlParams.get('ram');
  const resParam = urlParams.get('res') as Monitor['resolution'] | null;
  const hzParam = urlParams.get('hz');

  if (!cpuId && !gpuId) return null;

  const cpu = CPUS_DATABASE.find(c => c.id === cpuId);
  const gpu = GPUS_DATABASE.find(g => g.id === gpuId);

  let ram: RAMConfig | undefined;
  if (ramParam) {
    const [cap, type, speed, ch] = ramParam.split('-');
    ram = {
      capacityGb: Number(cap) || 16,
      type: (type as RAMConfig['type']) || 'DDR4',
      speedMhz: Number(speed) || 3200,
      channels: (Number(ch) as 1 | 2 | 4) || 2,
    };
  }

  let monitor: Monitor | undefined;
  if (resParam) {
    monitor = {
      resolution: resParam,
      refreshRateHz: Number(hzParam) || 144,
      aspectRatio: '16:9',
    };
  }

  return {
    ...(cpu ? { cpu } : {}),
    ...(gpu ? { gpu } : {}),
    ...(ram ? { ram } : {}),
    ...(monitor ? { monitor } : {}),
  };
}
