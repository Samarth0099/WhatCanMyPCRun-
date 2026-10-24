export type Resolution = '720p' | '1080p' | '1440p' | '4K';
export type QualityPreset = 'Low' | 'Medium' | 'High' | 'Ultra';
export type UpscalerMode = 'Off' | 'DLSS_Quality' | 'DLSS_Balanced' | 'DLSS_Performance' | 'FSR_Quality' | 'FSR_Balanced' | 'XeSS_Quality' | 'Frame_Gen';
export type VerdictBadge = 'cant_run' | 'playable' | 'smooth_60' | 'high_refresh_120';

export interface HardwareRequirementTier {
  minCpuScore: number;
  recCpuScore: number;
  minGpuScore: number;
  recGpuScore: number;
  minRamGb: number;
  recRamGb: number;
  minVramGb: number;
  recVramGb: number;
  requiresSsd: boolean;
  exampleMinCpu: string;
  exampleMinGpu: string;
  exampleRecCpu: string;
  exampleRecGpu: string;
}

export interface InGameSettingRecommendation {
  settingName: string;
  recommendedValue: string;
  fpsImpactPercent: number; // e.g., 14 means changing this saves ~14% render time
  impactCategory: 'Major' | 'Moderate' | 'Minor';
  explanation: string;
}

export interface AnchorBenchmark {
  resolution: Resolution;
  preset: QualityPreset;
  referenceGpuScore: number; // baseline GPU score (e.g., 165 for RTX 4070)
  referenceCpuScore: number; // baseline CPU score (e.g., 150 for Ryzen 7 7800X3D)
  anchorAvgFps: number;
  anchorLow1PercentFps: number;
  vramDemandGb: number;
}

export interface Game {
  id: string;
  title: string;
  studio: string;
  publisher: string;
  releaseYear: number;
  genre: string;
  engine: string;
  coverImage?: string;
  logoUrl?: string;
  description: string;
  requirements: HardwareRequirementTier;
  engineProfile: {
    gpuBias: number; // 0.0 to 1.0 (e.g., 0.85 means heavily GPU-bound, 0.40 means heavily CPU-bound like CS2/Valorant)
    vramSensitivity: 'High' | 'Medium' | 'Low';
    storageSensitivity: 'SSD_Mandatory' | 'SSD_Recommended' | 'HDD_Tolerant';
    supportsRayTracing: boolean;
    supportsDLSS: boolean;
    supportsDLSS3FrameGen: boolean;
    supportsFSR: boolean;
    supportsFSR3FrameGen: boolean;
    supportsXeSS: boolean;
  };
  benchmarks: AnchorBenchmark[];
  bestSettings: InGameSettingRecommendation[];
}

export interface GameFpsEstimate {
  game: Game;
  resolution: Resolution;
  preset: QualityPreset;
  upscaler: UpscalerMode;
  avgFpsMin: number;
  avgFpsMax: number;
  low1PercentMin: number;
  low1PercentMax: number;
  verdict: VerdictBadge;
  bottleneckType: 'GPU-Bound' | 'CPU-Bound' | 'Balanced' | 'VRAM-Throttled' | 'RAM-Constrained';
  gpuUtilizationPercent: number;
  cpuUtilizationPercent: number;
  vramSufficient: boolean;
  vramRequiredGb: number;
  vramDeficitGb: number;
  meetsMinimum: boolean;
  meetsRecommended: boolean;
  warnings: string[];
}
