/**
 * Component & Benchmark Data Import Pipeline
 * 
 * This script demonstrates the ingestion, schema validation, score normalization,
 * and expansion pipeline for hardware parts (TechPowerUp, PassMark, Geekbench, UserBenchmark datasets)
 * and game benchmarks.
 * 
 * Usage:
 *   npx tsx scripts/import-data.ts --summary
 *   npx tsx scripts/import-data.ts --validate
 *   npx tsx scripts/import-data.ts --export-json
 */

import { CPUS_DATABASE } from '../src/data/cpus';
import { GPUS_DATABASE } from '../src/data/gpus';
import { GAMES_DATABASE } from '../src/data/games';
import { CPU, GPU } from '../src/types/hardware';
import * as fs from 'fs';
import * as path from 'path';

export interface ExternalBenchmarkRecord {
  partType: 'CPU' | 'GPU';
  vendor: string;
  name: string;
  tdp?: number;
  vramGb?: number;
  vramType?: string;
  rawScore: number; // e.g. PassMark G3D Mark or 3DMark Time Spy Graphics Score
  referenceBaseScore: number; // raw score of the baseline part (RTX 3060 12GB = ~8,800 Time Spy)
  releaseYear?: number;
}

/**
 * Normalizes an external benchmark test score to the application's unified scale
 * Baseline:
 *   - GPU: RTX 3060 12GB = 100
 *   - CPU: Core i5-12400F = 100
 */
export function normalizePartScore(record: ExternalBenchmarkRecord): number {
  if (record.referenceBaseScore <= 0) return 100;
  return Math.round((record.rawScore / record.referenceBaseScore) * 100);
}

/**
 * Validates integrity of component records
 */
export function validateDatabaseIntegrity() {
  console.log('🔍 Validating database integrity...');
  let errors = 0;

  // Validate CPUs
  const cpuIds = new Set<string>();
  for (const cpu of CPUS_DATABASE) {
    if (cpuIds.has(cpu.id)) {
      console.error(`Duplicate CPU ID detected: ${cpu.id}`);
      errors++;
    }
    cpuIds.add(cpu.id);

    if (cpu.cores <= 0 || cpu.gamingScore <= 0) {
      console.error(`Invalid specs for CPU: ${cpu.model}`);
      errors++;
    }
  }

  // Validate GPUs
  const gpuIds = new Set<string>();
  for (const gpu of GPUS_DATABASE) {
    if (gpuIds.has(gpu.id)) {
      console.error(`Duplicate GPU ID detected: ${gpu.id}`);
      errors++;
    }
    gpuIds.add(gpu.id);

    if (gpu.scoreRaster <= 0 || gpu.vramGb <= 0) {
      console.error(`Invalid specs for GPU: ${gpu.model}`);
      errors++;
    }
  }

  // Validate Games
  const gameIds = new Set<string>();
  for (const game of GAMES_DATABASE) {
    if (gameIds.has(game.id)) {
      console.error(`Duplicate Game ID detected: ${game.id}`);
      errors++;
    }
    gameIds.add(game.id);

    if (game.benchmarks.length === 0) {
      console.error(`Game has no reference benchmarks: ${game.title}`);
      errors++;
    }

    if (game.bestSettings.length === 0) {
      console.error(`Game has no recommended settings: ${game.title}`);
      errors++;
    }
  }

  if (errors === 0) {
    console.log(`✅ All database tables passed validation with 0 errors!`);
    console.log(`   - Total CPUs: ${CPUS_DATABASE.length}`);
    console.log(`   - Total GPUs: ${GPUS_DATABASE.length}`);
    console.log(`   - Total Games: ${GAMES_DATABASE.length}`);
  } else {
    console.error(`❌ Validation failed with ${errors} error(s).`);
  }
}

// Sample batch updater function to show how newly launched parts are appended
export function mockIngestNewGpu(newRecord: ExternalBenchmarkRecord): GPU {
  const normalized = normalizePartScore(newRecord);
  const id = `${newRecord.vendor.toLowerCase()}-${newRecord.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return {
    id,
    brand: newRecord.vendor as GPU['brand'],
    model: newRecord.name,
    series: 'Next-Gen',
    vramGb: newRecord.vramGb || 16,
    vramType: 'GDDR6X',
    busWidthBits: 256,
    tdpWatts: newRecord.tdp || 250,
    releaseYear: newRecord.releaseYear || 2025,
    isLaptop: false,
    isIntegrated: false,
    scoreRaster: normalized,
    supportsDLSS: newRecord.vendor.toLowerCase().includes('nvidia'),
    supportsDLSS3FrameGen: newRecord.vendor.toLowerCase().includes('nvidia'),
    supportsFSR: true,
    supportsXeSS: true,
  };
}

// Run CLI tasks if executed directly
if (process.argv.includes('--validate') || process.argv.includes('--summary')) {
  validateDatabaseIntegrity();
}
