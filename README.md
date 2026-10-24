# What Can My PC Run?

A production-ready PC gaming performance estimator and compatibility checker built with **React 19**, **TypeScript**, and **Tailwind CSS**.

Users select their hardware specifications (CPU, GPU, RAM, Storage, Motherboard, Cooler, Monitor) to see which popular and AAA titles their rig can run, realistic benchmark-grounded FPS ranges (e.g., `74 – 88 FPS`), 1% low frame pacing, bottleneck identification (CPU vs GPU bound percentage), and tailored in-game graphics settings guides.

---

## Key Features

1. **Comprehensive Component Database**:
   - **60+ CPUs**: Intel (Core 2nd–14th Gen, Core Ultra 200, Pentium, Celeron, Xeon, Laptop HX/H/U) & AMD (Ryzen 1000–9000, X3D 3D V-Cache series, Threadripper, Athlon, Laptop HS/H).
   - **70+ GPUs**: NVIDIA (GeForce RTX 40/30/20, GTX 16/10/9/7, RTX Laptop), AMD (Radeon RX 7000/6000/5000/500/Vega), Intel (Arc A-Series, Lunar Lake 140V), plus integrated graphics (Radeon 780M, Steam Deck APU, Iris Xe, UHD 770).
   - **RAM & Storage**: DDR3/DDR4/DDR5 speeds, Single vs Dual channel bandwidth impact, NVMe Gen 5/4/3 SSDs vs Mechanical HDDs (with asset streaming warnings).
   - **"Part Not Listed" Fallback**: Enter custom GPU VRAM, compute tier, CPU cores, and IPC scores manually.

2. **Benchmark-Driven FPS Estimation Engine**:
   - Grounded in verified **anchor benchmarks** per title across 1080p, 1440p, and 4K at Low, Medium, High, and Ultra presets.
   - Outputs **realistic ranges** (e.g. `74 – 88 FPS`, 1% Lows `52 – 58 FPS`) rather than misleading single-number predictions.
   - Simulates **VRAM overflow**: When game memory demand exceeds GPU VRAM, realistic PCIe memory paging penalties (-18% to -55% FPS and severe 1% low stuttering) are calculated.
   - Supports **DLSS 2/3**, **FSR 2/3**, **XeSS**, and **Frame Generation** (DLSS 3 / FSR 3).

3. **System Compatibility & Bottleneck Analysis**:
   - Detects severe CPU bottlenecks (e.g. RTX 4090 paired with an older quad-core CPU).
   - Detects single-channel RAM memory bandwidth bottlenecks.
   - Detects thermal throttling risks (CPU TDP exceeding Cooler TDP rating).
   - Detects mechanical hard drive (HDD) streaming stutter in modern SSD-mandatory titles.

4. **Target FPS Finder Mode**:
   - User chooses 60, 120, or 144 FPS; the engine automatically calculates the highest resolution, preset, and upscaler required to sustain that target.

5. **Best In-Game Settings Guide**:
   - Detailed per-game breakdown of graphics settings ranked by performance cost (e.g. Volumetric Fog -> Medium `+16% FPS`, Ray Tracing -> Off `+45% FPS`, Shadow Cascades -> High `+12% FPS`).

6. **Side-by-Side Build Comparison**:
   - Compare "Build A (Current Rig)" vs "Build B (Proposed Upgrade)" across 6 test games with delta FPS uplift percentages.

7. **SEO & Direct GPU-vs-Game Lookup**:
   - Direct query answering ("Can RTX 3060 run Black Myth: Wukong?") with shareable URLs (`#/gpu/:gpuId/game/:gameId`).

8. **TV & 10-Foot UI Mode**:
   - Scaled typography, $\ge 48\text{px}$ touch targets, high-contrast focus rings, and keyboard navigation (press `T` to toggle).

---

## FPS Estimation Algorithm

The calculation pipeline follows this mathematical formulation:

$$FPS_{\text{raw}} = FPS_{\text{anchor}} \times M_{\text{res}} \times M_{\text{preset}} \times \left(\frac{Score_{\text{gpu}}}{Score_{\text{ref\_gpu}}}\right)^{\text{gpuBias}} \times \left(\frac{Score_{\text{cpu}}}{Score_{\text{ref\_cpu}}}\right)^{1 - \text{gpuBias}}$$

Where:
- $\text{gpuBias}$ is the engine-specific workload distribution (e.g. `0.88` for *Black Myth: Wukong*, `0.42` for *Counter-Strike 2*).
- $M_{\text{res}}$ scales pixel fillrate between 1080p, 1440p, and 4K.
- $M_{\text{preset}}$ scales shader passes from Ultra down to Low.

### Memory & Hardware Penalties
1. **VRAM Deficit Penalty**:
   $$\text{Deficit} = \max(0, \text{VRAM}_{\text{demand}} - \text{VRAM}_{\text{gpu}})$$
   $$\text{Penalty} = \max(0.45, 1 - (\text{Deficit} \times 0.18))$$
   1% Low frame pacing drops by an additional $25\%$ when paging over the PCIe bus.
2. **Single-Channel RAM Penalty**: $-12\%$ average FPS, $-22\%$ on 1% low frame times.
3. **Mechanical HDD Penalty**: In games with `SSD_Mandatory` profile, $-35\%$ on 1% lows due to DirectStorage/Nanite asset streaming stalls.
4. **Thermal Throttling**: When $TDP_{\text{cpu}} > TDP_{\text{cooler}}$, sustained clocks throttle by up to $-20\%$.

---

## Project Structure

```
├── index.html                   # SEO metadata, OpenGraph, Schema.org WebApplication JSON-LD
├── metadata.json                # AI Studio application metadata
├── package.json                 # Scripts: dev, build, lint, test, validate-data
├── scripts/
│   └── import-data.ts           # Component ingestion pipeline & integrity validator
├── src/
│   ├── types/
│   │   ├── hardware.ts          # CPU, GPU, RAM, Cooler, Storage, Build models
│   │   └── game.ts              # Game, Requirements, Benchmarks, Settings models
│   ├── data/
│   │   ├── cpus.ts              # 60+ CPUs with normalized gaming scores
│   │   ├── gpus.ts              # 70+ GPUs with raster compute scores & VRAM
│   │   ├── games.ts             # 33 AAA & popular titles with benchmark anchors
│   │   └── otherHardware.ts     # Motherboards, RAM presets, Coolers, Monitors, Prebuilts
│   ├── services/
│   │   ├── estimationEngine.ts  # FPS estimation & compatibility analysis
│   │   ├── estimation.test.ts   # Automated unit test suite
│   │   └── buildSerializer.ts   # URL query & hash state synchronization
│   ├── components/
│   │   ├── Header.tsx           # 3-Zone top navigation bar
│   │   ├── HardwareSelector.tsx # Searchable autocomplete hardware selector
│   │   ├── CompatibilityBanner.tsx # Bottleneck & thermal alert banner
│   │   ├── GameFilterBar.tsx    # Resolution, preset, upscaler, and studio filters
│   │   ├── GameCard.tsx         # Performance card with FPS range & metrics
│   │   ├── GameSettingsModal.tsx # In-game graphics settings tuning guide
│   │   ├── BuildCompareModal.tsx# Side-by-side rig comparison modal
│   │   ├── SeoLookupModal.tsx   # "Can [GPU] run [Game]?" lookup modal
│   │   ├── CustomPartModal.tsx  # Manual specs fallback modal
│   │   └── TargetFpsPanel.tsx   # Target 60/120/144 FPS optimization solver
│   ├── App.tsx                  # Main application controller
│   └── main.tsx                 # React entry point
└── tsconfig.json
```

---

## Development & Testing

### Run Development Server
```bash
npm run dev
```

### Run Unit Tests
```bash
npm test
```
Executes `src/services/estimation.test.ts` verifying high-end rigs, low-end VRAM deficits, upscaler gains, single-channel RAM penalties, and bottleneck detection.

### Validate Database Integrity
```bash
npm run validate-data
```
Checks for duplicate IDs, missing benchmark anchors, and schema correctness.

---

## Adding New Parts and Games

### 1. Adding a New GPU
Open `src/data/gpus.ts` and append a record:
```typescript
{
  id: 'nvidia-geforce-rtx-5080',
  brand: 'Nvidia',
  model: 'GeForce RTX 5080',
  series: 'RTX 50',
  vramGb: 16,
  vramType: 'GDDR7',
  busWidthBits: 256,
  tdpWatts: 350,
  releaseYear: 2025,
  isLaptop: false,
  isIntegrated: false,
  scoreRaster: 340, // RTX 3060 12GB = 100 baseline
  supportsDLSS: true,
  supportsDLSS3FrameGen: true,
  supportsFSR: true,
  supportsXeSS: true,
}
```

### 2. Adding a New Game
Open `src/data/games.ts` and append a game with benchmark anchors:
```typescript
{
  id: 'gta-6',
  title: 'Grand Theft Auto VI',
  studio: 'Rockstar Games',
  publisher: 'Rockstar Games',
  releaseYear: 2025,
  genre: 'Action / Open World',
  engine: 'RAGE 9',
  description: 'Welcome to Vice City and the state of Leonida.',
  requirements: {
    minCpuScore: 95,
    recCpuScore: 140,
    minGpuScore: 75,
    recGpuScore: 145,
    minRamGb: 16,
    recRamGb: 32,
    minVramGb: 8,
    recVramGb: 12,
    requiresSsd: true,
    exampleMinCpu: 'Ryzen 5 3600 / i5-10400',
    exampleMinGpu: 'RTX 2070 / RX 6600 XT',
    exampleRecCpu: 'Ryzen 7 7800X3D / i7-14700K',
    exampleRecGpu: 'RTX 4070 / RX 7800 XT',
  },
  engineProfile: {
    gpuBias: 0.82,
    vramSensitivity: 'High',
    storageSensitivity: 'SSD_Mandatory',
    supportsRayTracing: true,
    supportsDLSS: true,
    supportsDLSS3FrameGen: true,
    supportsFSR: true,
    supportsFSR3FrameGen: true,
    supportsXeSS: true,
  },
  benchmarks: [
    { resolution: '1080p', preset: 'Ultra', referenceGpuScore: 175, referenceCpuScore: 188, anchorAvgFps: 95, anchorLow1PercentFps: 72, vramDemandGb: 8.5 },
    { resolution: '1440p', preset: 'High', referenceGpuScore: 175, referenceCpuScore: 188, anchorAvgFps: 82, anchorLow1PercentFps: 64, vramDemandGb: 9.8 },
  ],
  bestSettings: [
    { settingName: 'Ray Traced Reflections', recommendedValue: 'Off / Medium', fpsImpactPercent: 35, impactCategory: 'Major', explanation: 'Saves 35% GPU rasterization time.' },
  ],
}
```

Run `npm run validate-data` to verify that the new entries pass all constraints.

---

## Roadmap for Scaling to Every Part and Game

1. **Automated Scraping Pipelines**: Integrate `scripts/import-data.ts` with automated webhooks to pull daily TechPowerUp GPU specs and PassMark G3D benchmarks.
2. **Community Benchmark Ingestion**: Allow users to submit real FPS logs via an anonymous telemetry endpoint to refine anchor data points with crowdsourced variance.
3. **DirectStorage & Shader Compilation Profiler**: Add warning flags for games notorious for DirectX 12 shader compilation stutter on specific GPU driver versions.
4. **Offline PWA Support**: Cache the entire static component database and icons via ServiceWorker for zero-network handheld usage.
