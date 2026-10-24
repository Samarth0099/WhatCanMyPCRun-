/**
 * Unit tests for the "What Can My PC Run?" FPS Estimation Engine
 * Run with: npx tsx src/services/estimation.test.ts
 */

import { estimateGamePerformance, analyzeSystemCompatibility } from './estimationEngine';
import { GAMES_DATABASE } from '../data/games';
import { CPUS_DATABASE } from '../data/cpus';
import { GPUS_DATABASE } from '../data/gpus';
import { SystemBuild } from '../types/hardware';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ TEST FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ ${message}`);
  }
}

console.log('--- Running Estimation Engine Unit Tests ---\n');

// 1. High-End System Test
const rtx4090 = GPUS_DATABASE.find(g => g.id === 'nvidia-geforce-rtx-4090')!;
const ryzen7800x3d = CPUS_DATABASE.find(c => c.id === 'amd-ryzen-7-7800x3d')!;
const wukong = GAMES_DATABASE.find(g => g.id === 'black-myth-wukong')!;

const highEndEstimate = estimateGamePerformance({
  game: wukong,
  cpu: ryzen7800x3d,
  gpu: rtx4090,
  ram: { capacityGb: 32, type: 'DDR5', speedMhz: 6000, channels: 2 },
  resolution: '1440p',
  preset: 'High',
  upscaler: 'Off',
});

assert(highEndEstimate.avgFpsMin > 90, 'RTX 4090 + 7800X3D should exceed 90 FPS in Black Myth: Wukong at 1440p High');
assert(highEndEstimate.avgFpsMin < highEndEstimate.avgFpsMax, 'FPS output must be a range (min < max)');
assert(highEndEstimate.verdict === 'smooth_60' || highEndEstimate.verdict === 'high_refresh_120', 'High-end rig should be smooth 60 or 120+');
assert(highEndEstimate.vramSufficient === true, '24GB VRAM on RTX 4090 must be flagged as sufficient');

// 2. VRAM Overflow & Penalty Test (GTX 1060 3GB on Alan Wake 2)
const gtx1060_3gb = GPUS_DATABASE.find(g => g.id === 'nvidia-geforce-gtx-1060-3gb')!;
const i5_10400 = CPUS_DATABASE.find(c => c.id === 'intel-core-i5-10400f')!;
const alanWake2 = GAMES_DATABASE.find(g => g.id === 'alan-wake-2')!;

const vramLimitedEstimate = estimateGamePerformance({
  game: alanWake2,
  cpu: i5_10400,
  gpu: gtx1060_3gb,
  ram: { capacityGb: 16, type: 'DDR4', speedMhz: 3200, channels: 2 },
  resolution: '1080p',
  preset: 'High',
  upscaler: 'Off',
});

assert(vramLimitedEstimate.vramSufficient === false, 'GTX 1060 3GB must trigger VRAM deficit in Alan Wake 2');
assert(vramLimitedEstimate.bottleneckType === 'VRAM-Throttled', 'Bottleneck should be identified as VRAM-Throttled');
assert(vramLimitedEstimate.warnings.some(w => w.includes('VRAM overflow')), 'Must generate explicit VRAM overflow warning');

// 3. Upscaler Performance Gain Test
const rtx4070 = GPUS_DATABASE.find(g => g.id === 'nvidia-geforce-rtx-4070')!;
const cyberpunk = GAMES_DATABASE.find(g => g.id === 'cyberpunk-2077')!;

const nativeCyberpunk = estimateGamePerformance({
  game: cyberpunk,
  cpu: ryzen7800x3d,
  gpu: rtx4070,
  ram: { capacityGb: 32, type: 'DDR5', speedMhz: 6000, channels: 2 },
  resolution: '1440p',
  preset: 'Ultra',
  upscaler: 'Off',
});

const dlssCyberpunk = estimateGamePerformance({
  game: cyberpunk,
  cpu: ryzen7800x3d,
  gpu: rtx4070,
  ram: { capacityGb: 32, type: 'DDR5', speedMhz: 6000, channels: 2 },
  resolution: '1440p',
  preset: 'Ultra',
  upscaler: 'DLSS_Quality',
});

assert(dlssCyberpunk.avgFpsMin > nativeCyberpunk.avgFpsMin * 1.2, 'DLSS Quality should yield at least a 20% framerate increase');

// 4. Single vs Dual Channel RAM Test
const singleChannelEstimate = estimateGamePerformance({
  game: cyberpunk,
  cpu: ryzen7800x3d,
  gpu: rtx4070,
  ram: { capacityGb: 16, type: 'DDR4', speedMhz: 3200, channels: 1 },
  resolution: '1080p',
  preset: 'High',
  upscaler: 'Off',
});

const dualChannelEstimate = estimateGamePerformance({
  game: cyberpunk,
  cpu: ryzen7800x3d,
  gpu: rtx4070,
  ram: { capacityGb: 16, type: 'DDR4', speedMhz: 3200, channels: 2 },
  resolution: '1080p',
  preset: 'High',
  upscaler: 'Off',
});

assert(singleChannelEstimate.low1PercentMin < dualChannelEstimate.low1PercentMin, 'Single-channel RAM must penalize 1% low frame pacing');

// 5. System Compatibility Bottleneck Analysis
const mismatchedBuild: SystemBuild = {
  cpu: CPUS_DATABASE.find(c => c.id === 'intel-core-i7-2600k')!, // 2011 CPU
  gpu: rtx4090, // 2022 Flagship GPU
  ram: { capacityGb: 8, type: 'DDR3', speedMhz: 1600, channels: 1 },
  monitor: { resolution: '1440p', refreshRateHz: 144, aspectRatio: '16:9' },
};

const compatibilityIssues = analyzeSystemCompatibility(mismatchedBuild);
assert(compatibilityIssues.some(i => i.category === 'bottleneck' && i.severity === 'critical'), 'Must detect severe CPU bottleneck when pairing i7-2600K with RTX 4090');
assert(compatibilityIssues.some(i => i.category === 'ram' && i.title.includes('Single-Channel')), 'Must detect single-channel RAM warning');
assert(compatibilityIssues.some(i => i.category === 'ram' && i.title.includes('Low System RAM')), 'Must detect <16GB RAM warning');

console.log('\n🎉 ALL ESTIMATION ENGINE UNIT TESTS PASSED SUCCESSFULLY!\n');
