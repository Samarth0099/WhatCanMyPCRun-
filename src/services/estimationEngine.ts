import { CPU, GPU, RAMConfig, StorageConfig, Cooler, SystemBuild, CompatibilityIssue } from '../types/hardware';
import { Game, Resolution, QualityPreset, UpscalerMode, GameFpsEstimate, VerdictBadge } from '../types/game';

interface EstimationInput {
  game: Game;
  cpu: CPU;
  gpu: GPU;
  ram: RAMConfig;
  storage?: StorageConfig;
  cooler?: Cooler;
  resolution: Resolution;
  preset: QualityPreset;
  upscaler: UpscalerMode;
}

export function estimateGamePerformance(input: EstimationInput): GameFpsEstimate {
  const { game, cpu, gpu, ram, storage, cooler, resolution, preset, upscaler } = input;
  const warnings: string[] = [];

  // 1. Find best anchor benchmark or baseline
  // Try exact match first
  let anchor = game.benchmarks.find(b => b.resolution === resolution && b.preset === preset);

  // If not exact, find closest resolution anchor
  if (!anchor) {
    anchor = game.benchmarks.find(b => b.resolution === resolution);
  }
  // Fallback to any anchor
  if (!anchor) {
    anchor = game.benchmarks[0];
  }

  // 2. Base preset and resolution scaling multipliers if interpolating from anchor
  let resMultiplier = 1.0;
  if (anchor.resolution !== resolution) {
    const resWeight: Record<Resolution, number> = { '720p': 1.45, '1080p': 1.0, '1440p': 0.72, '4K': 0.42 };
    const anchorWeight = resWeight[anchor.resolution] || 1.0;
    const targetWeight = resWeight[resolution] || 1.0;
    resMultiplier = targetWeight / anchorWeight;
  }

  let presetMultiplier = 1.0;
  if (anchor.preset !== preset) {
    const presetScale = { Low: 1.75, Medium: 1.40, High: 1.18, Ultra: 1.0 };
    presetMultiplier = presetScale[preset] / presetScale[anchor.preset];
  }

  // 3. Hardware Compute Capacity Relative to Anchor Reference
  const gpuRatio = Math.max(0.1, gpu.scoreRaster / anchor.referenceGpuScore);
  const cpuRatio = Math.max(0.1, cpu.gamingScore / anchor.referenceCpuScore);

  // Engine weighting (e.g. 0.85 GPU vs 0.15 CPU)
  const gpuBias = game.engineProfile.gpuBias;
  const cpuBias = 1 - gpuBias;

  // Base raw calculated FPS
  let baseAvgFps = anchor.anchorAvgFps * resMultiplier * presetMultiplier * Math.pow(gpuRatio, gpuBias) * Math.pow(cpuRatio, cpuBias);
  let base1PercentLow = anchor.anchorLow1PercentFps * resMultiplier * presetMultiplier * Math.pow(gpuRatio, gpuBias * 0.9) * Math.pow(cpuRatio, cpuBias * 1.1);

  // 4. Bottleneck & Utilization Breakdown
  // Compare GPU potential throughput vs CPU potential throughput
  const gpuHeadroomFps = anchor.anchorAvgFps * resMultiplier * presetMultiplier * gpuRatio;
  const cpuHeadroomFps = anchor.anchorAvgFps * presetMultiplier * Math.pow(cpuRatio, 0.95);

  let bottleneckType: GameFpsEstimate['bottleneckType'] = 'Balanced';
  let gpuUtilization = 99;
  let cpuUtilization = 50;

  if (cpuHeadroomFps < gpuHeadroomFps * 0.82) {
    bottleneckType = 'CPU-Bound';
    gpuUtilization = Math.round(Math.min(98, Math.max(45, (cpuHeadroomFps / gpuHeadroomFps) * 100)));
    cpuUtilization = 95;
    warnings.push(`CPU bottleneck: ${cpu.model} is limiting ${gpu.model}. GPU utilization around ~${gpuUtilization}%.`);
  } else if (gpuHeadroomFps < cpuHeadroomFps * 0.85) {
    bottleneckType = 'GPU-Bound';
    gpuUtilization = 99;
    cpuUtilization = Math.round(Math.min(90, Math.max(30, (gpuHeadroomFps / cpuHeadroomFps) * 75)));
  } else {
    bottleneckType = 'Balanced';
    gpuUtilization = 96;
    cpuUtilization = 68;
  }

  // 5. VRAM Constraints & Overflow Penalty
  let vramDemand = anchor.vramDemandGb;
  if (resolution === '720p') vramDemand = Math.max(1.5, vramDemand - 1.2);
  else if (resolution === '1440p') vramDemand += 1.2;
  else if (resolution === '4K') vramDemand += 2.8;
  if (preset === 'Low') vramDemand *= 0.75;
  else if (preset === 'Medium') vramDemand *= 0.85;

  const vramDeficit = Math.max(0, vramDemand - gpu.vramGb);
  const vramSufficient = vramDeficit <= 0.2;

  if (!vramSufficient) {
    bottleneckType = 'VRAM-Throttled';
    // Severe paging penalty when VRAM overflows to system RAM over PCIe bus
    const vramPenaltyFactor = Math.max(0.45, 1 - (vramDeficit * 0.18));
    baseAvgFps *= vramPenaltyFactor;
    // 1% lows drop much more brutally
    base1PercentLow *= (vramPenaltyFactor * 0.75);
    warnings.push(`VRAM overflow: Requires ~${vramDemand.toFixed(1)}GB, but GPU only has ${gpu.vramGb}GB. Expect severe micro-stutters and texture pop-in.`);
  }

  // 6. System RAM Constraints
  if (ram.capacityGb < game.requirements.minRamGb) {
    bottleneckType = 'RAM-Constrained';
    baseAvgFps *= 0.65;
    base1PercentLow *= 0.45;
    warnings.push(`Insufficient System RAM (${ram.capacityGb}GB vs ${game.requirements.minRamGb}GB minimum). Windows paging file will cause heavy frame drops.`);
  } else if (ram.capacityGb < game.requirements.recRamGb) {
    baseAvgFps *= 0.92;
    base1PercentLow *= 0.84;
  }

  // Single-channel RAM penalty
  if (ram.channels === 1) {
    baseAvgFps *= 0.88;
    base1PercentLow *= 0.78;
    warnings.push('Single-channel RAM detected: Halves memory bandwidth, reducing 1% low frame rates by ~15-22%.');
  }

  // 7. Storage Impact (Mechanical HDD vs SSD)
  if (storage && (storage.type === 'HDD_7200' || storage.type === 'HDD_5400')) {
    if (game.engineProfile.storageSensitivity === 'SSD_Mandatory') {
      base1PercentLow *= 0.65;
      baseAvgFps *= 0.88;
      warnings.push(`Running on mechanical HDD: This game requires an SSD for streaming assets. Severe hitching and loading pauses expected.`);
    } else if (game.engineProfile.storageSensitivity === 'SSD_Recommended') {
      base1PercentLow *= 0.82;
      warnings.push(`Mechanical HDD detected: Asset streaming will cause sporadic frame time spikes.`);
    }
  }

  // 8. Thermal Throttling Assessment
  if (cooler && cpu.tdpWatts > cooler.ratedTdpWatts) {
    const deficit = cpu.tdpWatts - cooler.ratedTdpWatts;
    const throttleRatio = Math.max(0.80, 1 - (deficit * 0.003));
    baseAvgFps *= throttleRatio;
    base1PercentLow *= (throttleRatio * 0.92);
    warnings.push(`Thermal throttling risk: Cooler (${cooler.ratedTdpWatts}W rating) is insufficient for CPU TDP (${cpu.tdpWatts}W). Clocks will throttle under sustained load.`);
  }

  // 9. Upscaling & Frame Generation Multiplier
  let upscalerMultiplier = 1.0;
  let fgMultiplier = 1.0;

  if (upscaler === 'DLSS_Quality' && gpu.supportsDLSS) {
    upscalerMultiplier = 1.30;
  } else if (upscaler === 'DLSS_Balanced' && gpu.supportsDLSS) {
    upscalerMultiplier = 1.45;
  } else if (upscaler === 'DLSS_Performance' && gpu.supportsDLSS) {
    upscalerMultiplier = 1.65;
  } else if (upscaler === 'FSR_Quality' && gpu.supportsFSR) {
    upscalerMultiplier = 1.28;
  } else if (upscaler === 'FSR_Balanced' && gpu.supportsFSR) {
    upscalerMultiplier = 1.42;
  } else if (upscaler === 'XeSS_Quality' && gpu.supportsXeSS) {
    upscalerMultiplier = 1.26;
  } else if (upscaler === 'Frame_Gen') {
    // DLSS 3 or FSR 3 Frame Gen
    if (gpu.supportsDLSS3FrameGen || game.engineProfile.supportsFSR3FrameGen) {
      // Frame gen adds ~55-65% frames on top of base
      upscalerMultiplier = 1.28; // typically paired with quality upscaler
      fgMultiplier = 1.55;
    } else {
      warnings.push('Frame Generation requested but hardware does not support DLSS 3 / FSR 3.');
    }
  }

  baseAvgFps *= (upscalerMultiplier * fgMultiplier);
  base1PercentLow *= upscalerMultiplier; // Frame gen does not dramatically boost true 1% lows

  // 10. Frame Rate Flooring & Realistic Output Range
  const rawAvg = Math.max(5, Math.round(baseAvgFps));
  const rawLow = Math.max(3, Math.round(Math.min(rawAvg * 0.85, base1PercentLow)));

  // Output realistic range (e.g. 74 - 86 FPS)
  const margin = Math.max(3, Math.round(rawAvg * 0.08));
  const avgFpsMin = Math.max(5, rawAvg - margin);
  const avgFpsMax = rawAvg + margin;

  const lowMargin = Math.max(2, Math.round(rawLow * 0.07));
  const low1PercentMin = Math.max(3, rawLow - lowMargin);
  const low1PercentMax = Math.max(low1PercentMin + 1, rawLow + lowMargin);

  // 11. Verdict Determination
  let verdict: VerdictBadge = 'cant_run';
  if (rawAvg >= 120) {
    verdict = 'high_refresh_120';
  } else if (rawAvg >= 60) {
    verdict = 'smooth_60';
  } else if (rawAvg >= 30) {
    verdict = 'playable';
  } else {
    verdict = 'cant_run';
  }

  // 12. Requirements Verification
  const meetsMinCpu = cpu.gamingScore >= game.requirements.minCpuScore;
  const meetsMinGpu = gpu.scoreRaster >= game.requirements.minGpuScore;
  const meetsMinRam = ram.capacityGb >= game.requirements.minRamGb;
  const meetsMinimum = meetsMinCpu && meetsMinGpu && meetsMinRam;

  const meetsRecCpu = cpu.gamingScore >= game.requirements.recCpuScore;
  const meetsRecGpu = gpu.scoreRaster >= game.requirements.recGpuScore;
  const meetsRecRam = ram.capacityGb >= game.requirements.recRamGb;
  const meetsRecommended = meetsRecCpu && meetsRecGpu && meetsRecRam;

  return {
    game,
    resolution,
    preset,
    upscaler,
    avgFpsMin,
    avgFpsMax,
    low1PercentMin,
    low1PercentMax,
    verdict,
    bottleneckType,
    gpuUtilizationPercent: gpuUtilization,
    cpuUtilizationPercent: cpuUtilization,
    vramSufficient,
    vramRequiredGb: Math.round(vramDemand * 10) / 10,
    vramDeficitGb: Math.round(vramDeficit * 10) / 10,
    meetsMinimum,
    meetsRecommended,
    warnings,
  };
}

export function analyzeSystemCompatibility(build: SystemBuild): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];
  const { cpu, gpu, ram, cooler, storage, motherboard } = build;

  // 1. CPU / GPU Balance (Bottleneck index)
  // Check if high-end GPU is throttled by low-end CPU
  if (gpu.scoreRaster >= 160 && cpu.gamingScore < 95) {
    issues.push({
      severity: 'critical',
      category: 'bottleneck',
      title: 'Severe CPU Bottleneck Detected',
      description: `${gpu.model} is a high-performance GPU, but ${cpu.model} lacks the single-thread IPC and cache to feed it in modern games. You will experience low GPU utilization and erratic frame pacing.`,
      recommendation: 'Upgrade to a modern processor like Ryzen 5 7600, Ryzen 7 7800X3D, or Core i5-13600K to unlock full GPU performance.',
    });
  } else if (gpu.scoreRaster < 55 && cpu.gamingScore >= 160) {
    issues.push({
      severity: 'info',
      category: 'bottleneck',
      title: 'GPU-Bound Configuration',
      description: `${cpu.model} is an enthusiast processor paired with a budget/entry-level ${gpu.model}. The CPU will idle while the GPU runs at 100% capacity in all 3D games.`,
      recommendation: 'Your CPU has headroom for future GPU upgrades up to an RTX 4070 Ti Super or RTX 4080.',
    });
  }

  // 2. RAM capacity & speed
  if (ram.capacityGb < 16) {
    issues.push({
      severity: 'warning',
      category: 'ram',
      title: 'Low System RAM (Under 16GB)',
      description: `With only ${ram.capacityGb}GB RAM, modern 2023-2025 titles like Cyberpunk 2077, Black Myth: Wukong, and Starfield will suffer heavy disk paging stutter.`,
      recommendation: 'Upgrade to at least 16GB (or 32GB DDR4/DDR5) for smooth background multitasking and modern gaming.',
    });
  }

  if (ram.channels === 1) {
    issues.push({
      severity: 'warning',
      category: 'ram',
      title: 'Single-Channel Memory Configuration',
      description: 'Running a single stick of RAM limits bandwidth to 64-bit rather than 128-bit dual channel. This causes up to a 20% loss in CPU gaming performance and frequent 1% low stutter.',
      recommendation: 'Install a second identical RAM stick to enable dual-channel bandwidth.',
    });
  }

  // 3. Motherboard & Socket Compatibility
  if (motherboard && cpu.socket !== 'BGA' && motherboard.socket !== cpu.socket) {
    issues.push({
      severity: 'critical',
      category: 'socket',
      title: 'Incompatible CPU Socket & Motherboard',
      description: `${cpu.model} requires a ${cpu.socket} socket, but ${motherboard.model} features a ${motherboard.socket} socket. They cannot physically connect.`,
      recommendation: `Select a motherboard with the matching ${cpu.socket} chipset.`,
    });
  }

  // 4. Cooler adequacy
  if (cooler && cpu.tdpWatts > cooler.ratedTdpWatts) {
    issues.push({
      severity: 'warning',
      category: 'thermal',
      title: 'Cooler TDP Exceeded (Thermal Throttling Risk)',
      description: `${cpu.model} outputs up to ${cpu.tdpWatts}W TDP under gaming turbo, which exceeds ${cooler.model}'s ${cooler.ratedTdpWatts}W cooling capacity.`,
      recommendation: 'Switch to a dual-tower air cooler (like Thermalright Peerless Assassin 120) or 240mm/360mm AIO liquid cooler.',
    });
  }

  // 5. Storage
  if (storage && (storage.type === 'HDD_7200' || storage.type === 'HDD_5400')) {
    issues.push({
      severity: 'warning',
      category: 'storage',
      title: 'Mechanical Hard Drive (HDD) Warning',
      description: 'Modern AAA titles use DirectStorage and virtual geometry (Nanite, Mesh Shaders) that require NVMe SSD read speeds. Playing on an HDD will produce stuttering and prolonged load times.',
      recommendation: 'Install an inexpensive PCIe NVMe Gen3 or Gen4 M.2 SSD for modern game installations.',
    });
  }

  // 6. Laptop GPU distinction
  if (gpu.isLaptop) {
    issues.push({
      severity: 'info',
      category: 'vram',
      title: 'Mobile / Laptop GPU Specification Note',
      description: `${gpu.model} operates within laptop thermal/TDP constraints (usually 60W-140W) and typically performs 15-30% lower than its desktop counterpart. Benchmark calculations have factored in this difference.`,
      recommendation: 'Ensure your laptop cooling vents are elevated with proper airflow when gaming.',
    });
  }

  return issues;
}
