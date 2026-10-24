export type ComponentBrand = 'Intel' | 'AMD' | 'Nvidia' | 'ASUS' | 'MSI' | 'Gigabyte' | 'ASRock' | 'Corsair' | 'Noctua' | 'Arctic' | 'NZXT' | 'Crucial' | 'Samsung' | 'Kingston' | 'Western Digital' | 'Other';

export interface CPU {
  id: string;
  brand: 'Intel' | 'AMD';
  model: string;
  series: string; // e.g. 'Core i7', 'Ryzen 7', 'Xeon', 'Core Ultra'
  socket: string; // 'AM5', 'AM4', 'LGA1700', 'LGA1200', 'LGA1151', 'BGA'
  cores: number;
  threads: number;
  baseClockGhz: number;
  boostClockGhz: number;
  tdpWatts: number;
  releaseYear: number;
  isLaptop?: boolean;
  scoreSingle: number; // normalized single-thread score (100 = i5-12400 baseline)
  scoreMulti: number;  // normalized multi-thread score (100 = i5-12400 baseline)
  gamingScore: number; // gaming specific index (weights cache, single thread, arch)
}

export interface GPU {
  id: string;
  brand: 'Nvidia' | 'AMD' | 'Intel';
  partnerBrand?: 'ASUS' | 'MSI' | 'Gigabyte' | 'AORUS' | 'Nvidia' | 'AMD' | 'Intel' | 'Other';
  model: string;
  series: string; // 'RTX 40', 'RTX 30', 'RX 7000', 'Arc', etc.
  vramGb: number;
  vramType: 'GDDR6X' | 'GDDR6' | 'GDDR5' | 'Shared' | 'HBM2';
  busWidthBits: number;
  tdpWatts: number;
  releaseYear: number;
  isLaptop: boolean;
  isIntegrated: boolean;
  scoreRaster: number; // normalized raster score (100 = RTX 3060 12GB baseline)
  supportsDLSS: boolean;
  supportsDLSS3FrameGen: boolean;
  supportsFSR: boolean;
  supportsXeSS: boolean;
}

export interface Motherboard {
  id: string;
  brand: string;
  model: string;
  chipset: string; // 'Z790', 'B650', 'B550', 'H610', etc.
  socket: string;
  ramType: 'DDR4' | 'DDR5' | 'DDR3';
  maxRamSpeedMhz: number;
  formFactor: 'ATX' | 'Micro-ATX' | 'Mini-ITX' | 'E-ATX';
}

export type RamBrand =
  | 'Samsung'
  | 'SK hynix'
  | 'Micron'
  | 'Corsair'
  | 'G.Skill'
  | 'Kingston'
  | 'Crucial'
  | 'TeamGroup'
  | 'ADATA'
  | 'XPG'
  | 'Patriot'
  | 'Silicon Power'
  | 'PNY'
  | 'Lexar'
  | 'Mushkin'
  | 'OLOy'
  | 'GeIL'
  | 'Transcend'
  | 'Apacer'
  | 'KLEVV'
  | 'V-Color'
  | 'Thermaltake'
  | 'GAMDIAS'
  | 'Generic';

export type RamChipMaker = 'Samsung' | 'SK hynix' | 'Micron' | 'Nanya' | 'Winbond' | 'Auto';

export type RamGeneration =
  | 'DDR'
  | 'DDR2'
  | 'DDR3'
  | 'DDR4'
  | 'DDR5'
  | 'LPDDR3'
  | 'LPDDR4'
  | 'LPDDR4X'
  | 'LPDDR5'
  | 'LPDDR5X';

export type RamServerType = 'UDIMM' | 'LPDDR' | 'ECC UDIMM' | 'ECC RDIMM' | 'LRDIMM' | 'RDIMM';

export interface RAMConfig {
  capacityGb: number; // 4, 8, 16, 32, 64, 128, etc.
  type: RamGeneration;
  speedMhz: number; // 2133, 3200, 3600, 5600, 6000, 7200, etc.
  channels: 1 | 2 | 4 | 8; // Single, Dual, Quad, Octa
  brand?: RamBrand;
  chipMaker?: RamChipMaker;
  serverType?: RamServerType;
}

export interface StorageConfig {
  type: 'NVMe_Gen5' | 'NVMe_Gen4' | 'NVMe_Gen3' | 'SATA_SSD' | 'HDD_7200' | 'HDD_5400';
  name: string;
  readSpeedMbps: number;
  capacityGb: number;
}

export type CoolerType = 'Air' | 'AIO_120' | 'AIO_240' | 'AIO_280' | 'AIO_360' | 'AIO_420' | 'Custom_Loop' | 'Stock';

export interface CustomLoopConfig {
  waterBlock?: string;        // CPU Water Block
  gpuWaterBlock?: string;     // GPU Water Block
  radiator?: string;          // Radiator
  pump?: string;              // Pump (D5 / DDC)
  reservoir?: string;         // Reservoir
  tubing?: string;            // Tubing (Soft / Hard)
  fittings?: string;          // Fittings
  coolant?: string;           // Coolant
  distributionPlate?: string; // Distribution Plate
}

export interface Cooler {
  id: string;
  brand: string;
  model: string;
  type: CoolerType;
  ratedTdpWatts: number;
  customLoop?: CustomLoopConfig;
}

export interface Monitor {
  resolution: '1080p' | '1440p' | '4K' | 'Ultrawide_1440p';
  refreshRateHz: number;
  aspectRatio: string;
}

export interface UserCustomSpecs {
  isCustom: boolean;
  gpuName?: string;
  gpuVramGb?: number;
  gpuEstimatedScore?: number;
  cpuName?: string;
  cpuCores?: number;
  cpuEstimatedScore?: number;
}

export interface SystemBuild {
  id?: string;
  name?: string;
  cpu: CPU;
  gpu: GPU;
  ram: RAMConfig;
  storage?: StorageConfig;
  motherboard?: Motherboard;
  cooler?: Cooler;
  monitor: Monitor;
  customSpecs?: UserCustomSpecs;
}

export interface CompatibilityIssue {
  severity: 'warning' | 'critical' | 'info';
  category: 'bottleneck' | 'thermal' | 'ram' | 'storage' | 'vram' | 'socket';
  title: string;
  description: string;
  recommendation: string;
}
