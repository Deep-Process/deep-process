import * as fs from 'fs';
import * as path from 'path';
import { parse as parseYaml } from 'yaml';
import { getExtensionPath } from './extension-context.js';

export interface ProcessManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  shortDescription: string;
  workflowFile: string;
  firstStepFile: string;
  firstStepLabel: string;
  agentName: string;
  agentInstruction: string;
  githubAgentTools: string[];
  slashCommand: string;
  excludeFromInstall?: string[];
}

/**
 * Get the directory where bundled processes live (inside the VS Code extension).
 */
export function getProcessesDir(): string {
  // Get extension path from the singleton (set during activation)
  const extensionPath = getExtensionPath();
  return path.join(extensionPath, 'processes');
}

/**
 * Read all process manifests from the bundled processes directory.
 */
export function loadAllManifests(): ProcessManifest[] {
  const processesDir = getProcessesDir();
  if (!fs.existsSync(processesDir)) {
    return [];
  }

  const entries = fs.readdirSync(processesDir, { withFileTypes: true });
  const manifests: ProcessManifest[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const manifestPath = path.join(processesDir, entry.name, 'manifest.yaml');
    if (!fs.existsSync(manifestPath)) continue;

    try {
      const content = fs.readFileSync(manifestPath, 'utf-8');
      const data = parseYaml(content) as ProcessManifest;

      // Validate that manifest has required fields
      if (!data || !data.id || !data.name) {
        console.warn(`Invalid manifest at ${manifestPath}: missing id or name`);
        continue;
      }

      manifests.push(data);
    } catch (error) {
      console.error(`Failed to load manifest at ${manifestPath}:`, error);
    }
  }

  return manifests.sort((a, b) => (a.id || '').localeCompare(b.id || ''));
}

/**
 * Load a single process manifest by ID.
 */
export function loadManifest(processId: string): ProcessManifest | undefined {
  const manifestPath = path.join(getProcessesDir(), processId, 'manifest.yaml');
  if (!fs.existsSync(manifestPath)) return undefined;

  const content = fs.readFileSync(manifestPath, 'utf-8');
  return parseYaml(content) as ProcessManifest;
}
