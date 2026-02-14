import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

export interface ProcessConfig {
  installed: boolean;
  version: string;
}

export interface ToolConfig {
  enabled: boolean;
  files: string[];
  cliFlags?: string; // Optional CLI flags (e.g., "--yolo" for gemini, "--dangerously-skip-permissions" for claude)
}

export interface DeepProcessConfig {
  version: string;
  packageVersion: string;
  installation: {
    scope: 'project' | 'global';
    processDir: string;
  };
  processes: Record<string, ProcessConfig>;
  tools: Record<string, ToolConfig>;
}

const CONFIG_FILENAME = 'deep-process.config.yaml';
const OLD_CONFIG_PATH = CONFIG_FILENAME; // Root-level config (legacy)
const NEW_CONFIG_DIR = '_deep-process'; // New config directory

/**
 * Get the config file path for a given project root.
 * Now uses _deep-process/deep-process.config.yaml instead of root-level.
 */
export function getConfigPath(projectRoot: string): string {
  return path.join(projectRoot, NEW_CONFIG_DIR, CONFIG_FILENAME);
}

/**
 * Read the deep-process config from disk.
 */
export function readConfig(projectRoot: string): DeepProcessConfig | null {
  const configPath = getConfigPath(projectRoot);
  if (!fs.existsSync(configPath)) return null;

  const content = fs.readFileSync(configPath, 'utf-8');
  return parseYaml(content) as DeepProcessConfig;
}

/**
 * Write the deep-process config to disk.
 */
export function writeConfig(projectRoot: string, config: DeepProcessConfig): void {
  const configPath = getConfigPath(projectRoot);
  const content = stringifyYaml(config, { lineWidth: 120 });
  fs.writeFileSync(configPath, content, 'utf-8');
}

/**
 * Create a new default config.
 */
export function createConfig(
  scope: 'project' | 'global',
  processDir: string,
  packageVersion: string
): DeepProcessConfig {
  return {
    version: '1.0.0',
    packageVersion,
    installation: { scope, processDir },
    processes: {},
    tools: {},
  };
}

/**
 * Check if a config file exists.
 */
export function configExists(projectRoot: string): boolean {
  return fs.existsSync(getConfigPath(projectRoot));
}

/**
 * Migrate config from root directory to _deep-process/ directory.
 * Returns true if migration was performed, false otherwise.
 */
export function migrateConfigToNewLocation(projectRoot: string): boolean {
  const oldPath = path.join(projectRoot, OLD_CONFIG_PATH);
  const newPath = getConfigPath(projectRoot);

  // If old config exists and new one doesn't, migrate
  if (fs.existsSync(oldPath) && !fs.existsSync(newPath)) {
    try {
      // Ensure target directory exists
      const newDir = path.dirname(newPath);
      if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir, { recursive: true });
      }

      // Copy config file
      fs.copyFileSync(oldPath, newPath);

      // Remove old config
      fs.unlinkSync(oldPath);

      return true;
    } catch (error) {
      console.error('Failed to migrate config:', error);
      return false;
    }
  }

  return false;
}

/**
 * Check if old root-level config exists (for migration detection).
 */
export function hasLegacyConfig(projectRoot: string): boolean {
  const oldPath = path.join(projectRoot, OLD_CONFIG_PATH);
  return fs.existsSync(oldPath);
}
