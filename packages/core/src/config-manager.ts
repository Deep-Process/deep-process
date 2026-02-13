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

/**
 * Get the config file path for a given project root.
 */
export function getConfigPath(projectRoot: string): string {
  return path.join(projectRoot, CONFIG_FILENAME);
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
