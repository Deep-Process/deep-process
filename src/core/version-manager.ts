import type { DeepProcessConfig } from './config-manager.js';
import type { ProcessManifest } from './process-registry.js';

export interface UpdateInfo {
  processId: string;
  currentVersion: string;
  availableVersion: string;
  needsUpdate: boolean;
}

/**
 * Compare installed versions against available versions.
 */
export function checkForUpdates(
  config: DeepProcessConfig,
  manifests: ProcessManifest[]
): UpdateInfo[] {
  const results: UpdateInfo[] = [];

  for (const manifest of manifests) {
    const installed = config.processes[manifest.id];
    if (!installed?.installed) continue;

    results.push({
      processId: manifest.id,
      currentVersion: installed.version,
      availableVersion: manifest.version,
      needsUpdate: installed.version !== manifest.version,
    });
  }

  return results;
}
