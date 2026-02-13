import fs from 'node:fs';
import path from 'node:path';
import type { DeepProcessConfig } from './config-manager.js';
import type { ProcessManifest } from './process-registry.js';

export interface UpdateInfo {
  processId: string;
  currentVersion: string;
  availableVersion: string;
  needsUpdate: boolean;
  reason: 'version' | 'missing' | 'up-to-date';
}

/**
 * Compare installed versions against available versions.
 * Also detects missing process directories (manually deleted).
 */
export function checkForUpdates(
  config: DeepProcessConfig,
  manifests: ProcessManifest[],
  projectRoot: string
): UpdateInfo[] {
  const results: UpdateInfo[] = [];

  for (const manifest of manifests) {
    const installed = config.processes[manifest.id];
    if (!installed?.installed) continue;

    // Check if process directory actually exists on disk
    const processDir = path.join(projectRoot, config.installation.processDir, manifest.id);
    const dirMissing = !fs.existsSync(processDir);

    const versionChanged = installed.version !== manifest.version;

    results.push({
      processId: manifest.id,
      currentVersion: installed.version,
      availableVersion: manifest.version,
      needsUpdate: versionChanged || dirMissing,
      reason: dirMissing ? 'missing' : versionChanged ? 'version' : 'up-to-date',
    });
  }

  return results;
}
