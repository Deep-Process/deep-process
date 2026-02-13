import fs from 'node:fs';
import path from 'node:path';
import { getProcessesDir, type ProcessManifest } from './process-registry.js';

/**
 * Copy process files from bundled processes/ to the target directory.
 * Returns the number of files copied.
 */
export function copyProcessFiles(
  manifest: ProcessManifest,
  targetBaseDir: string
): number {
  const sourceDir = path.join(getProcessesDir(), manifest.id);
  const targetDir = path.join(targetBaseDir, manifest.id);

  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Process source not found: ${sourceDir}`);
  }

  return copyDirRecursive(sourceDir, targetDir, manifest.excludeFromInstall ?? []);
}

/**
 * Recursively copy a directory, excluding files matching exclude patterns.
 */
function copyDirRecursive(src: string, dest: string, excludePatterns: string[]): number {
  fs.mkdirSync(dest, { recursive: true });
  let count = 0;

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    const relativePath = path.relative(src, srcPath);

    if (shouldExclude(relativePath, excludePatterns)) continue;
    if (entry.name === 'manifest.yaml') continue; // Don't copy manifest to user project

    if (entry.isDirectory()) {
      count += copyDirRecursive(srcPath, destPath, excludePatterns);
    } else {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }

  return count;
}

/**
 * Simple glob-like exclude check.
 * Supports patterns like "docs/**" and exact matches.
 */
function shouldExclude(relativePath: string, patterns: string[]): boolean {
  const normalized = relativePath.replace(/\\/g, '/');
  for (const pattern of patterns) {
    if (pattern.endsWith('/**')) {
      const prefix = pattern.slice(0, -3);
      if (normalized.startsWith(prefix + '/') || normalized === prefix) return true;
    } else if (normalized === pattern) {
      return true;
    }
  }
  return false;
}

/**
 * Remove a process directory from the installation.
 */
export function removeProcessFiles(processId: string, targetBaseDir: string): void {
  const targetDir = path.join(targetBaseDir, processId);
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
}
