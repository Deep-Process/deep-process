import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

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
 * Get the directory where bundled processes live (inside the npm package).
 */
export function getProcessesDir(): string {
  // When running from dist/core/, processes are at package root
  // import.meta.url -> file:///path/to/package/dist/core/process-registry.js
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.resolve(__dirname, '..', '..', 'processes');
}

// TEMPORARY: Only allow stable processes (deep-verify and deep-explore)
const ALLOWED_PROCESSES = ['deep-verify', 'deep-explore'];

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

    // FILTER: Only allow specific processes
    if (!ALLOWED_PROCESSES.includes(entry.name)) {
      continue;
    }

    const manifestPath = path.join(processesDir, entry.name, 'manifest.yaml');
    if (!fs.existsSync(manifestPath)) continue;

    const content = fs.readFileSync(manifestPath, 'utf-8');
    const data = parseYaml(content) as ProcessManifest;
    manifests.push(data);
  }

  return manifests.sort((a, b) => a.id.localeCompare(b.id));
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
