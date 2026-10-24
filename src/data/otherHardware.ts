import { Motherboard, RAMConfig, StorageConfig, Cooler, Monitor, SystemBuild, RamBrand, RamChipMaker, RamGeneration, RamServerType } from '../types/hardware';
import { CPUS_DATABASE } from './cpus';
import { GPUS_DATABASE } from './gpus';

export const MOTHERBOARDS_DATABASE: Motherboard[] = [
  // AM5
  { id: 'asus-rog-strix-x670e-e', brand: 'ASUS', model: 'ROG Strix X670E-E Gaming WiFi', chipset: 'X670E', socket: 'AM5', ramType: 'DDR5', maxRamSpeedMhz: 6400, formFactor: 'ATX' },
  { id: 'msi-mag-b650-tomahawk', brand: 'MSI', model: 'MAG B650 Tomahawk WiFi', chipset: 'B650', socket: 'AM5', ramType: 'DDR5', maxRamSpeedMhz: 6600, formFactor: 'ATX' },
  { id: 'gigabyte-b650-aorus-elite-ax', brand: 'Gigabyte', model: 'B650 AORUS Elite AX', chipset: 'B650', socket: 'AM5', ramType: 'DDR5', maxRamSpeedMhz: 6666, formFactor: 'ATX' },
  { id: 'asus-tuf-gaming-b650-plus', brand: 'ASUS', model: 'TUF Gaming B650-Plus WiFi', chipset: 'B650', socket: 'AM5', ramType: 'DDR5', maxRamSpeedMhz: 6400, formFactor: 'ATX' },
  { id: 'asrock-b650m-hdv-m2', brand: 'ASRock', model: 'B650M-HDV/M.2', chipset: 'B650', socket: 'AM5', ramType: 'DDR5', maxRamSpeedMhz: 6400, formFactor: 'Micro-ATX' },
  { id: 'gigabyte-a620m-gaming-x', brand: 'Gigabyte', model: 'A620M Gaming X', chipset: 'A620', socket: 'AM5', ramType: 'DDR5', maxRamSpeedMhz: 6400, formFactor: 'Micro-ATX' },
  { id: 'msi-mpg-b650i-edge-wifi', brand: 'MSI', model: 'MPG B650I EDGE WiFi', chipset: 'B650', socket: 'AM5', ramType: 'DDR5', maxRamSpeedMhz: 6600, formFactor: 'Mini-ITX' },

  // LGA1851 & LGA1700
  { id: 'asus-rog-maximus-z890-hero', brand: 'ASUS', model: 'ROG Maximus Z890 Hero', chipset: 'Z890', socket: 'LGA1851', ramType: 'DDR5', maxRamSpeedMhz: 8800, formFactor: 'ATX' },
  { id: 'msi-mag-z890-tomahawk-wifi', brand: 'MSI', model: 'MAG Z890 Tomahawk WiFi', chipset: 'Z890', socket: 'LGA1851', ramType: 'DDR5', maxRamSpeedMhz: 8600, formFactor: 'ATX' },
  { id: 'asus-rog-maximus-z790-hero', brand: 'ASUS', model: 'ROG Maximus Z790 Hero', chipset: 'Z790', socket: 'LGA1700', ramType: 'DDR5', maxRamSpeedMhz: 7800, formFactor: 'ATX' },
  { id: 'msi-pro-z790-a-wifi', brand: 'MSI', model: 'PRO Z790-A WiFi', chipset: 'Z790', socket: 'LGA1700', ramType: 'DDR5', maxRamSpeedMhz: 7200, formFactor: 'ATX' },
  { id: 'gigabyte-z790-aorus-elite-ax', brand: 'Gigabyte', model: 'Z790 AORUS Elite AX', chipset: 'Z790', socket: 'LGA1700', ramType: 'DDR5', maxRamSpeedMhz: 7600, formFactor: 'ATX' },
  { id: 'msi-mag-b760-tomahawk-wifi', brand: 'MSI', model: 'MAG B760 Tomahawk WiFi', chipset: 'B760', socket: 'LGA1700', ramType: 'DDR5', maxRamSpeedMhz: 7000, formFactor: 'ATX' },
  { id: 'asus-rog-strix-b760-i', brand: 'ASUS', model: 'ROG Strix B760-I Gaming WiFi', chipset: 'B760', socket: 'LGA1700', ramType: 'DDR5', maxRamSpeedMhz: 7600, formFactor: 'Mini-ITX' },
  { id: 'gigabyte-b760m-ds3h-ddr4', brand: 'Gigabyte', model: 'B760M DS3H DDR4', chipset: 'B760', socket: 'LGA1700', ramType: 'DDR4', maxRamSpeedMhz: 5333, formFactor: 'Micro-ATX' },
  { id: 'asrock-h610m-hdv-m2', brand: 'ASRock', model: 'H610M-HDV/M.2', chipset: 'H610', socket: 'LGA1700', ramType: 'DDR4', maxRamSpeedMhz: 3200, formFactor: 'Micro-ATX' },

  // AM4
  { id: 'msi-b550-tomahawk', brand: 'MSI', model: 'MAG B550 TOMAHAWK', chipset: 'B550', socket: 'AM4', ramType: 'DDR4', maxRamSpeedMhz: 4866, formFactor: 'ATX' },
  { id: 'asus-tuf-gaming-b550-plus', brand: 'ASUS', model: 'TUF Gaming B550-Plus', chipset: 'B550', socket: 'AM4', ramType: 'DDR4', maxRamSpeedMhz: 4600, formFactor: 'ATX' },
  { id: 'gigabyte-b550-aorus-pro-v2', brand: 'Gigabyte', model: 'B550 AORUS Pro V2', chipset: 'B550', socket: 'AM4', ramType: 'DDR4', maxRamSpeedMhz: 5400, formFactor: 'ATX' },
  { id: 'gigabyte-b450-aorus-elite', brand: 'Gigabyte', model: 'B450 AORUS Elite', chipset: 'B450', socket: 'AM4', ramType: 'DDR4', maxRamSpeedMhz: 3600, formFactor: 'ATX' },
  { id: 'asrock-b450m-pro4', brand: 'ASRock', model: 'B450M Pro4', chipset: 'B450', socket: 'AM4', ramType: 'DDR4', maxRamSpeedMhz: 3200, formFactor: 'Micro-ATX' },

  // LGA1200 & LGA1151
  { id: 'msi-z490-a-pro', brand: 'MSI', model: 'Z490-A PRO', chipset: 'Z490', socket: 'LGA1200', ramType: 'DDR4', maxRamSpeedMhz: 4800, formFactor: 'ATX' },
  { id: 'asus-prime-z390-a', brand: 'ASUS', model: 'Prime Z390-A', chipset: 'Z390', socket: 'LGA1151', ramType: 'DDR4', maxRamSpeedMhz: 4266, formFactor: 'ATX' },
];

export const RAM_MODULE_BRANDS: RamBrand[] = [
  'Corsair', 'G.Skill', 'Kingston', 'Crucial', 'TeamGroup',
  'ADATA', 'XPG', 'Patriot', 'Silicon Power', 'PNY',
  'Lexar', 'Mushkin', 'OLOy', 'GeIL', 'Transcend',
  'Apacer', 'KLEVV', 'V-Color', 'Thermaltake', 'GAMDIAS'
];

export const RAM_CHIP_MAKERS: RamChipMaker[] = [
  'Samsung', 'SK hynix', 'Micron', 'Nanya', 'Winbond'
];

export const RAM_GENERATIONS_LIST: RamGeneration[] = [
  'DDR5', 'DDR4', 'DDR3', 'DDR2', 'DDR',
  'LPDDR5X', 'LPDDR5', 'LPDDR4X', 'LPDDR4', 'LPDDR3'
];

export const RAM_SERVER_TYPES: RamServerType[] = [
  'UDIMM', 'LPDDR', 'ECC UDIMM', 'ECC RDIMM', 'LRDIMM', 'RDIMM'
];

export const DDR4_SPEEDS = [2133, 2400, 2666, 2800, 3000, 3200, 3600, 4000, 4400, 4600, 4800];
export const DDR5_SPEEDS = [4800, 5200, 5600, 6000, 6200, 6400, 6800, 7200, 7600, 8000];

export const RAM_PRESETS: RAMConfig[] = [
  // Flagship DDR5 Kits
  { capacityGb: 32, type: 'DDR5', speedMhz: 6000, channels: 2, brand: 'G.Skill', chipMaker: 'SK hynix', serverType: 'UDIMM' },
  { capacityGb: 32, type: 'DDR5', speedMhz: 6400, channels: 2, brand: 'Corsair', chipMaker: 'SK hynix', serverType: 'UDIMM' },
  { capacityGb: 64, type: 'DDR5', speedMhz: 6000, channels: 2, brand: 'Kingston', chipMaker: 'SK hynix', serverType: 'UDIMM' },
  { capacityGb: 32, type: 'DDR5', speedMhz: 7200, channels: 2, brand: 'TeamGroup', chipMaker: 'SK hynix', serverType: 'UDIMM' },
  { capacityGb: 16, type: 'DDR5', speedMhz: 5200, channels: 2, brand: 'Crucial', chipMaker: 'Micron', serverType: 'UDIMM' },
  { capacityGb: 48, type: 'DDR5', speedMhz: 6800, channels: 2, brand: 'Patriot', chipMaker: 'SK hynix', serverType: 'UDIMM' },
  { capacityGb: 64, type: 'DDR5', speedMhz: 6400, channels: 2, brand: 'ADATA', chipMaker: 'Samsung', serverType: 'UDIMM' },
  { capacityGb: 96, type: 'DDR5', speedMhz: 6000, channels: 2, brand: 'Corsair', chipMaker: 'Micron', serverType: 'UDIMM' },

  // Popular DDR4 Kits
  { capacityGb: 16, type: 'DDR4', speedMhz: 3200, channels: 2, brand: 'Corsair', chipMaker: 'Samsung', serverType: 'UDIMM' },
  { capacityGb: 16, type: 'DDR4', speedMhz: 3600, channels: 2, brand: 'G.Skill', chipMaker: 'Samsung', serverType: 'UDIMM' },
  { capacityGb: 32, type: 'DDR4', speedMhz: 3600, channels: 2, brand: 'Kingston', chipMaker: 'SK hynix', serverType: 'UDIMM' },
  { capacityGb: 32, type: 'DDR4', speedMhz: 3200, channels: 2, brand: 'Crucial', chipMaker: 'Micron', serverType: 'UDIMM' },
  { capacityGb: 64, type: 'DDR4', speedMhz: 3600, channels: 2, brand: 'TeamGroup', chipMaker: 'Samsung', serverType: 'UDIMM' },
  { capacityGb: 8, type: 'DDR4', speedMhz: 2666, channels: 1, brand: 'Silicon Power', chipMaker: 'Nanya', serverType: 'UDIMM' },
  { capacityGb: 16, type: 'DDR4', speedMhz: 4000, channels: 2, brand: 'Patriot', chipMaker: 'Samsung', serverType: 'UDIMM' },

  // DDR3 / Legacy Kits
  { capacityGb: 16, type: 'DDR3', speedMhz: 1866, channels: 2, brand: 'Kingston', chipMaker: 'Samsung', serverType: 'UDIMM' },
  { capacityGb: 8, type: 'DDR3', speedMhz: 1600, channels: 2, brand: 'Crucial', chipMaker: 'Micron', serverType: 'UDIMM' },
  { capacityGb: 4, type: 'DDR2', speedMhz: 800, channels: 2, brand: 'Corsair', chipMaker: 'Samsung', serverType: 'UDIMM' },

  // Low Power (Laptop / Handheld)
  { capacityGb: 16, type: 'LPDDR5', speedMhz: 6400, channels: 2, brand: 'Samsung', chipMaker: 'Samsung', serverType: 'LPDDR' },
  { capacityGb: 32, type: 'LPDDR5X', speedMhz: 7500, channels: 2, brand: 'SK hynix', chipMaker: 'SK hynix', serverType: 'LPDDR' },
  { capacityGb: 16, type: 'LPDDR4X', speedMhz: 4266, channels: 2, brand: 'Micron', chipMaker: 'Micron', serverType: 'LPDDR' },

  // Server ECC
  { capacityGb: 64, type: 'DDR5', speedMhz: 4800, channels: 4, brand: 'Kingston', chipMaker: 'SK hynix', serverType: 'ECC RDIMM' },
  { capacityGb: 128, type: 'DDR5', speedMhz: 5600, channels: 8, brand: 'Samsung', chipMaker: 'Samsung', serverType: 'LRDIMM' },
  { capacityGb: 32, type: 'DDR4', speedMhz: 3200, channels: 2, brand: 'Crucial', chipMaker: 'Micron', serverType: 'ECC UDIMM' },
];

export const STORAGE_PRESETS: StorageConfig[] = [
  { type: 'NVMe_Gen5', name: 'PCIe Gen 5 NVMe SSD (Crucial T700 / Samsung 990 EVO+)', readSpeedMbps: 12000, capacityGb: 2000 },
  { type: 'NVMe_Gen4', name: 'PCIe Gen 4 NVMe SSD (Samsung 990 Pro / WD Black SN850X 2TB)', readSpeedMbps: 7400, capacityGb: 2000 },
  { type: 'NVMe_Gen4', name: 'PCIe Gen 4 NVMe SSD (Kingston KC3000 / Crucial P5 Plus 1TB)', readSpeedMbps: 7000, capacityGb: 1000 },
  { type: 'NVMe_Gen3', name: 'PCIe Gen 3 NVMe SSD (Samsung 970 EVO / Kingston NV2 1TB)', readSpeedMbps: 3500, capacityGb: 1000 },
  { type: 'NVMe_Gen3', name: 'PCIe Gen 3 NVMe SSD (Crucial P3 500GB)', readSpeedMbps: 3000, capacityGb: 500 },
  { type: 'SATA_SSD', name: 'SATA III 2.5" SSD (Crucial MX500 / Samsung 870 EVO 1TB)', readSpeedMbps: 550, capacityGb: 1000 },
  { type: 'SATA_SSD', name: 'SATA III 2.5" SSD (Kingston A400 500GB)', readSpeedMbps: 500, capacityGb: 500 },
  { type: 'HDD_7200', name: 'Mechanical HDD 7200 RPM (Seagate Barracuda / WD Blue 2TB)', readSpeedMbps: 160, capacityGb: 2000 },
  { type: 'HDD_5400', name: 'Mechanical HDD 5400 RPM (Slow Internal / Laptop Drive 1TB)', readSpeedMbps: 90, capacityGb: 1000 },
];

// Custom Water Cooling Loop Parts Database
export const CUSTOM_WATER_COOLING_PARTS = {
  waterBlocks: [
    { id: 'wb-ek-velocity2', name: 'EK-Quantum Velocity² D-RGB (Nickel + Plexi)', brand: 'EKWB', tdpRating: 320, price: '29' },
    { id: 'wb-corsair-xc7', name: 'Corsair Hydro X Series XC7 RGB PRO', brand: 'Corsair', tdpRating: 300, price: '9' },
    { id: 'wb-alphacool-xpx', name: 'Alphacool Eisblock XPX Aurora PRO Full Clear', brand: 'Alphacool', tdpRating: 310, price: '5' },
    { id: 'wb-bitspower-summit', name: 'Bitspower Premium Summit M D-RGB Block', brand: 'Bitspower', tdpRating: 290, price: '05' },
  ],
  gpuWaterBlocks: [
    { id: 'gwb-ek-vector2', name: 'EK-Quantum Vector² RTX 4090/4080 Active Backplate', brand: 'EKWB', tdpRating: 500, price: '69' },
    { id: 'gwb-corsair-xg7', name: 'Corsair Hydro X Series XG7 RGB GPU Water Block', brand: 'Corsair', tdpRating: 450, price: '69' },
    { id: 'gwb-alphacool-aurora', name: 'Alphacool Eisblock Aurora GPX-N Plexi Light', brand: 'Alphacool', tdpRating: 460, price: '79' },
    { id: 'gwb-none', name: 'Air-Cooled GPU Only (No GPU Water Block)', brand: 'OEM', tdpRating: 0, price: 'sh' },
  ],
  radiators: [
    { id: 'rad-360-triple', name: 'Triple 360mm Radiator (Copper High-Performance 45mm)', size: '360mm', tdpCapacity: 380 },
    { id: 'rad-240-dual', name: 'Dual 240mm Slim Radiator (Copper 30mm)', size: '240mm', tdpCapacity: 260 },
    { id: 'rad-280-dual', name: 'Dual 280mm Wide Radiator (140mm Fan Spacing 30mm)', size: '280mm', tdpCapacity: 310 },
    { id: 'rad-420-triple', name: 'Triple 420mm Ultra-Thick High Fin Density (45mm)', size: '420mm', tdpCapacity: 450 },
    { id: 'rad-120-single', name: 'Single 120mm Compact Copper Radiator', size: '120mm', tdpCapacity: 160 },
    { id: 'rad-480-quad', name: 'Quad 480mm Extreme Monster Radiator (60mm Multiport)', size: '480mm', tdpCapacity: 520 },
  ],
  pumps: [
    { id: 'pump-d5-pwm', name: 'Standalone D5 PWM High-Flow Pump (1500 L/h, 3.9m Head)', flowRate: '1500 L/h' },
    { id: 'pump-ddc-compact', name: 'DDC 4.2 Compact High-Pressure Pump (1000 L/h, 5.2m Head)', flowRate: '1000 L/h' },
  ],
  reservoirs: [
    { id: 'res-tube-200', name: 'EK-Quantum Kinetic TBE 200ml D-RGB Tube Reservoir', capacity: '200 ml' },
    { id: 'res-corsair-xd5', name: 'Corsair Hydro X Series XD5 RGB Pump/Reservoir Combo', capacity: '330 ml' },
    { id: 'res-singularity-flat', name: 'Singularity Computers Protium 2.0 ARGB Compact Combo', capacity: '150 ml' },
  ],
  tubing: [
    { id: 'tube-soft-epdm', name: 'Soft Tubing 10/16mm Zero-Maintenance EPDM Matte Black', type: 'Soft' },
    { id: 'tube-hard-acrylic', name: 'Hard Tubing 14mm Ultra-Clear Acrylic (High Heat Resistance)', type: 'Hard' },
    { id: 'tube-hard-petg', name: 'Hard Tubing 16mm Easy-Bend PETG High Clarity', type: 'Hard' },
    { id: 'tube-soft-pvc', name: 'Soft Tubing 10/13mm Flexible Clear PVC', type: 'Soft' },
  ],
  fittings: [
    { id: 'fit-compression-g14', name: 'EK-Quantum Torque G1/4" Compression Fittings + 90° Rotary Angle Adapters', style: 'Compression + Rotary' },
    { id: 'fit-barrow-angle', name: 'Barrow G1/4" Metallic Multi-Link 90° & 45° Rotary Adapters', style: 'Angle Adapters' },
    { id: 'fit-barb-clamp', name: 'Alphacool HF High-Flow G1/4" Barb Fittings with Hose Clamps', style: 'Barb' },
  ],
  coolants: [
    { id: 'coolant-clear', name: 'EK-CryoFuel Clear Ultra-Pure Non-Toxic Premix (1000mL)', color: 'Clear' },
    { id: 'coolant-pastel-white', name: 'Corsair Hydro X Series XL8 Solid Pastel White Coolant', color: 'White' },
    { id: 'coolant-uv-green', name: 'Mayhems UV Acid Green Fluorescent Reactive Coolant', color: 'UV Green' },
    { id: 'coolant-cyan-cryo', name: 'EK-CryoFuel Electric Indigo / Cyan Premix Coolant', color: 'Cyan' },
  ],
  distroPlates: [
    { id: 'distro-o11d-front', name: 'Lian Li O11D EVO Custom Front Panel Distro Plate with Integrated D5', type: 'Front Panel' },
    { id: 'distro-side-matrix', name: 'Universal Matrix Side Chamber Distribution Plate with DDC', type: 'Side Chamber' },
    { id: 'distro-none', name: 'Standard Reservoir (No Distribution Plate)', type: 'None' },
  ],
};

export const COOLERS_DATABASE: Cooler[] = [
  // --- CUSTOM WATER COOLING LOOPS (NEW) ---
  {
    id: 'custom-loop-flagship-360',
    brand: 'Custom Water Loop',
    model: 'Enthusiast CPU + GPU Custom Loop (360mm Rad + D5 Pump + Distro Plate)',
    type: 'Custom_Loop',
    ratedTdpWatts: 420,
    customLoop: {
      waterBlock: 'EK-Quantum Velocity² D-RGB (Nickel + Plexi)',
      gpuWaterBlock: 'EK-Quantum Vector² RTX 4090/4080 Active Backplate',
      radiator: 'Triple 360mm Radiator (Copper High-Performance 45mm)',
      pump: 'Standalone D5 PWM High-Flow Pump (1500 L/h, 3.9m Head)',
      reservoir: 'EK-Quantum Kinetic TBE 200ml D-RGB Tube Reservoir',
      tubing: 'Hard Tubing 14mm Ultra-Clear Acrylic (High Heat Resistance)',
      fittings: 'EK-Quantum Torque G1/4" Compression Fittings + 90° Rotary Angle Adapters',
      coolant: 'EK-CryoFuel Clear Ultra-Pure Non-Toxic Premix (1000mL)',
      distributionPlate: 'Lian Li O11D EVO Custom Front Panel Distro Plate with Integrated D5',
    },
  },
  {
    id: 'custom-loop-cpu-240-soft',
    brand: 'Custom Water Loop',
    model: 'Performance CPU Custom Loop (240mm Rad + DDC Pump + Soft Tubing)',
    type: 'Custom_Loop',
    ratedTdpWatts: 320,
    customLoop: {
      waterBlock: 'Corsair Hydro X Series XC7 RGB PRO',
      gpuWaterBlock: 'Air-Cooled GPU Only (No GPU Water Block)',
      radiator: 'Dual 240mm Slim Radiator (Copper 30mm)',
      pump: 'DDC 4.2 Compact High-Pressure Pump (1000 L/h, 5.2m Head)',
      reservoir: 'Corsair Hydro X Series XD5 RGB Pump/Reservoir Combo',
      tubing: 'Soft Tubing 10/16mm Zero-Maintenance EPDM Matte Black',
      fittings: 'Alphacool HF High-Flow G1/4" Barb Fittings with Hose Clamps',
      coolant: 'Corsair Hydro X Series XL8 Solid Pastel White Coolant',
      distributionPlate: 'Standard Reservoir (No Distribution Plate)',
    },
  },
  {
    id: 'custom-loop-dual-420-extreme',
    brand: 'Custom Water Loop',
    model: 'Extreme Dual-Rad Custom Loop (420mm + 360mm Radiators, Dual D5)',
    type: 'Custom_Loop',
    ratedTdpWatts: 500,
    customLoop: {
      waterBlock: 'Alphacool Eisblock XPX Aurora PRO Full Clear',
      gpuWaterBlock: 'Alphacool Eisblock Aurora GPX-N Plexi Light',
      radiator: 'Triple 420mm Ultra-Thick High Fin Density (45mm)',
      pump: 'Standalone D5 PWM High-Flow Pump (1500 L/h, 3.9m Head)',
      reservoir: 'Singularity Computers Protium 2.0 ARGB Compact Combo',
      tubing: 'Hard Tubing 16mm Easy-Bend PETG High Clarity',
      fittings: 'Barrow G1/4" Metallic Multi-Link 90° & 45° Rotary Adapters',
      coolant: 'EK-CryoFuel Electric Indigo / Cyan Premix Coolant',
      distributionPlate: 'Universal Matrix Side Chamber Distribution Plate with DDC',
    },
  },

  // --- AIR COOLERS ---
  { id: 'thermalright-peerless-assassin-120', brand: 'Thermalright', model: 'Peerless Assassin 120 SE', type: 'Air', ratedTdpWatts: 245 },
  { id: 'noctua-nh-d15', brand: 'Noctua', model: 'NH-D15 Chromax.Black', type: 'Air', ratedTdpWatts: 260 },
  { id: 'deepcool-ak620', brand: 'DeepCool', model: 'AK620 Dual-Tower High Performance', type: 'Air', ratedTdpWatts: 240 },
  { id: 'be-quiet-dark-rock-pro-4', brand: 'be quiet!', model: 'Dark Rock Pro 4 Silent Air Cooler', type: 'Air', ratedTdpWatts: 250 },
  { id: 'cooler-master-hyper-212', brand: 'Cooler Master', model: 'Hyper 212 Black Edition (Slim Tower)', type: 'Air', ratedTdpWatts: 150 },
  
  // --- AIO 360mm ---
  { id: 'arctic-liquid-freezer-iii-360', brand: 'Arctic', model: 'Liquid Freezer III 360mm AIO', type: 'AIO_360', ratedTdpWatts: 300 },
  { id: 'nzxt-kraken-elite-360', brand: 'NZXT', model: 'Kraken Elite 360 RGB LCD AIO', type: 'AIO_360', ratedTdpWatts: 290 },
  { id: 'corsair-icue-h150i-elite', brand: 'Corsair', model: 'iCUE H150i Elite Capellix XT 360mm', type: 'AIO_360', ratedTdpWatts: 280 },
  
  // --- AIO 280mm ---
  { id: 'arctic-liquid-freezer-iii-280', brand: 'Arctic', model: 'Liquid Freezer III 280mm AIO', type: 'AIO_280', ratedTdpWatts: 280 },
  { id: 'nzxt-kraken-280', brand: 'NZXT', model: 'Kraken 280 RGB High-Flow AIO', type: 'AIO_280', ratedTdpWatts: 270 },

  // --- AIO 240mm ---
  { id: 'arctic-liquid-freezer-iii-240', brand: 'Arctic', model: 'Liquid Freezer III 240mm AIO', type: 'AIO_240', ratedTdpWatts: 240 },
  { id: 'corsair-h100x-rgb-elite', brand: 'Corsair', model: 'H100x RGB Elite 240mm Liquid Cooler', type: 'AIO_240', ratedTdpWatts: 230 },

  // --- AIO 120mm ---
  { id: 'cooler-master-masterliquid-120l', brand: 'Cooler Master', model: 'MasterLiquid ML120L V2 RGB 120mm', type: 'AIO_120', ratedTdpWatts: 180 },
  { id: 'corsair-h60x-elite-120', brand: 'Corsair', model: 'Hydro H60x Elite 120mm Compact AIO', type: 'AIO_120', ratedTdpWatts: 175 },

  // --- Stock ---
  { id: 'amd-wraith-stealth', brand: 'AMD', model: 'AMD Wraith Stealth (Stock Boxed)', type: 'Stock', ratedTdpWatts: 65 },
  { id: 'intel-stock-cooler', brand: 'Intel', model: 'Intel Laminar Box Cooler (Stock)', type: 'Stock', ratedTdpWatts: 65 },
  { id: 'laptop-oem-cooling', brand: 'OEM', model: 'Integrated Laptop Heatpipe & Dual Fan System', type: 'Stock', ratedTdpWatts: 140 },
];

export const MONITORS_DATABASE: Monitor[] = [
  { resolution: '1080p', refreshRateHz: 60, aspectRatio: '16:9' },
  { resolution: '1080p', refreshRateHz: 144, aspectRatio: '16:9' },
  { resolution: '1080p', refreshRateHz: 240, aspectRatio: '16:9' },
  { resolution: '1440p', refreshRateHz: 60, aspectRatio: '16:9' },
  { resolution: '1440p', refreshRateHz: 144, aspectRatio: '16:9' },
  { resolution: '1440p', refreshRateHz: 165, aspectRatio: '16:9' },
  { resolution: '1440p', refreshRateHz: 240, aspectRatio: '16:9' },
  { resolution: '4K', refreshRateHz: 60, aspectRatio: '16:9' },
  { resolution: '4K', refreshRateHz: 120, aspectRatio: '16:9' },
  { resolution: '4K', refreshRateHz: 144, aspectRatio: '16:9' },
];

export function findCpu(id: string) {
  return CPUS_DATABASE.find(c => c.id === id) || CPUS_DATABASE[0];
}

export function findGpu(id: string) {
  return GPUS_DATABASE.find(g => g.id === id) || GPUS_DATABASE[0];
}

export const PREBUILT_SYSTEMS: { name: string; description: string; build: SystemBuild }[] = [
  {
    name: 'Mainstream Gaming Sweet Spot (1440p High)',
    description: 'Ryzen 5 7600 + RTX 4070 + 32GB DDR5 – exceptional price-to-performance for 1440p.',
    build: {
      name: 'Mainstream Gaming Sweet Spot',
      cpu: findCpu('amd-ryzen-5-7600'),
      gpu: findGpu('nvidia-geforce-rtx-4070'),
      ram: { capacityGb: 32, type: 'DDR5', speedMhz: 6000, channels: 2, brand: 'G.Skill', chipMaker: 'SK hynix' },
      storage: STORAGE_PRESETS[1],
      cooler: COOLERS_DATABASE[3],
      monitor: MONITORS_DATABASE[5],
    },
  },
  {
    name: 'God-Tier Enthusiast (4K 120+ FPS)',
    description: 'Ryzen 7 7800X3D + RTX 4090 + 32GB DDR5 + Custom Water Loop – plays every modern AAA title at 4K Ultra.',
    build: {
      name: 'God-Tier Enthusiast',
      cpu: findCpu('amd-ryzen-7-7800x3d'),
      gpu: findGpu('nvidia-geforce-rtx-4090'),
      ram: { capacityGb: 32, type: 'DDR5', speedMhz: 6000, channels: 2, brand: 'Corsair', chipMaker: 'SK hynix' },
      storage: STORAGE_PRESETS[1],
      cooler: COOLERS_DATABASE[0],
      monitor: MONITORS_DATABASE[8],
    },
  },
  {
    name: 'Budget 1080p Champion',
    description: 'Ryzen 5 5600 + RX 6600 8GB + 16GB DDR4 – maximum frames for under 50.',
    build: {
      name: 'Budget 1080p Champion',
      cpu: findCpu('amd-ryzen-5-5600'),
      gpu: findGpu('amd-radeon-rx-6600'),
      ram: { capacityGb: 16, type: 'DDR4', speedMhz: 3200, channels: 2, brand: 'Corsair', chipMaker: 'Samsung' },
      storage: STORAGE_PRESETS[2],
      cooler: COOLERS_DATABASE[13],
      monitor: MONITORS_DATABASE[1],
    },
  },
];
