import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
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

/**
 * Clean up stale lock files.
 * Call this on extension activation to remove locks from crashed processes.
 *
 * @param projectRoot - Project root directory
 * @returns true if stale lock was removed, false otherwise
 */
export function cleanupStaleLocks(projectRoot: string): boolean {
  const lockPath = path.join(projectRoot, NEW_CONFIG_DIR, '.config.lock');

  try {
    if (!fs.existsSync(lockPath)) {
      return false; // No lock file
    }

    const lockData = JSON.parse(fs.readFileSync(lockPath, 'utf-8'));
    const lockAge = Date.now() - lockData.timestamp;

    // Only remove if lock is older than 60 seconds (stale)
    if (lockAge > 60000) {
      fs.unlinkSync(lockPath);
      console.log(`Removed stale lock file (age: ${lockAge}ms, PID: ${lockData.pid})`);
      return true;
    }

    return false;
  } catch (error) {
    // If we can't read/parse lock file, remove it
    try {
      fs.unlinkSync(lockPath);
      console.log('Removed corrupted lock file');
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Hybrid in-memory + file-based lock for config operations.
 * Prevents race conditions both within a process and across processes/instances.
 */
class ConfigLock {
  private locks: Map<string, Promise<void>> = new Map();
  private readonly LOCK_TIMEOUT_MS = 30000; // 30 seconds
  private readonly STALE_LOCK_MS = 60000; // 60 seconds

  async acquire(projectRoot: string): Promise<() => void> {
    // Step 1: Acquire in-memory lock first (fast path for same process)
    const existingLock = this.locks.get(projectRoot);
    if (existingLock) {
      await existingLock;
    }

    let releaseFn: () => void;
    const lockPromise = new Promise<void>((resolve) => {
      releaseFn = resolve;
    });
    this.locks.set(projectRoot, lockPromise);

    // Step 2: Acquire file-based lock (cross-process protection)
    await this.acquireFileLock(projectRoot);

    // Return combined release function
    return () => {
      this.releaseFileLock(projectRoot);
      this.locks.delete(projectRoot);
      releaseFn!();
    };
  }

  private async acquireFileLock(projectRoot: string): Promise<void> {
    const lockPath = this.getLockFilePath(projectRoot);
    const startTime = Date.now();

    while (true) {
      try {
        // Try to create lock file exclusively (atomic operation)
        const lockData = {
          pid: process.pid,
          timestamp: Date.now(),
          host: os.hostname()
        };

        // Check if lock file exists
        if (fs.existsSync(lockPath)) {
          // Read existing lock
          const existingLock = JSON.parse(fs.readFileSync(lockPath, 'utf-8'));
          const lockAge = Date.now() - existingLock.timestamp;

          // Check if lock is stale (process crashed or timeout)
          if (lockAge > this.STALE_LOCK_MS) {
            console.warn(`Removing stale lock file (age: ${lockAge}ms)`);
            fs.unlinkSync(lockPath);
            continue; // Retry acquisition
          }

          // Check if we've been waiting too long
          if (Date.now() - startTime > this.LOCK_TIMEOUT_MS) {
            throw new Error(
              `Config lock timeout after ${this.LOCK_TIMEOUT_MS}ms. ` +
              `Lock held by PID ${existingLock.pid} on ${existingLock.host}`
            );
          }

          // Wait and retry
          await new Promise(resolve => setTimeout(resolve, 100));
          continue;
        }

        // Try to create lock file atomically
        // Using 'wx' flag - fails if file exists (atomic check-and-create)
        fs.writeFileSync(lockPath, JSON.stringify(lockData, null, 2), {
          flag: 'wx',
          encoding: 'utf-8'
        });

        // Successfully acquired lock
        return;

      } catch (error: any) {
        if (error.code === 'EEXIST') {
          // File was created by another process between our check and write
          // Wait and retry
          await new Promise(resolve => setTimeout(resolve, 100));
          continue;
        }

        // Other error - propagate
        throw error;
      }
    }
  }

  private releaseFileLock(projectRoot: string): void {
    const lockPath = this.getLockFilePath(projectRoot);

    try {
      if (fs.existsSync(lockPath)) {
        fs.unlinkSync(lockPath);
      }
    } catch (error) {
      console.error('Failed to release lock file:', error);
      // Don't throw - release should be best-effort
    }
  }

  private getLockFilePath(projectRoot: string): string {
    const configDir = path.join(projectRoot, NEW_CONFIG_DIR);
    return path.join(configDir, '.config.lock');
  }
}

const globalConfigLock = new ConfigLock();

/**
 * Atomically update config file using read-modify-write pattern.
 *
 * **Thread Safety:**
 * - Uses hybrid in-memory + file-based locking
 * - Safe for concurrent operations within same process
 * - Safe across multiple VS Code instances
 * - Safe when CLI tools and extension run concurrently
 *
 * **Lock Behavior:**
 * - Timeout: 30 seconds (throws error if lock held longer)
 * - Stale detection: Locks older than 60s automatically removed
 * - Lock file: `_deep-process/.config.lock`
 *
 * **Error Handling:**
 * - Throws if config doesn't exist (use createConfig first)
 * - Throws on lock timeout
 * - Always releases lock (even on error)
 *
 * @param projectRoot - Project root directory
 * @param updateFn - Function that modifies the config (receives current config, returns updated config)
 * @returns Promise that resolves when update is complete
 *
 * @example
 * await updateConfig(projectRoot, (config) => {
 *   config.tools['claude'] = { enabled: true, files: [...] };
 *   return config;
 * });
 *
 * @throws {Error} If config file doesn't exist
 * @throws {Error} If lock timeout exceeded (30s)
 */
export async function updateConfig(
  projectRoot: string,
  updateFn: (config: DeepProcessConfig) => DeepProcessConfig | Promise<DeepProcessConfig>
): Promise<void> {
  const release = await globalConfigLock.acquire(projectRoot);

  try {
    // Read current config
    let config = readConfig(projectRoot);

    // If config doesn't exist, throw error (caller should create it first)
    if (!config) {
      throw new Error('Config file does not exist. Create it first with createConfig().');
    }

    // Apply update function
    config = await updateFn(config);

    // Write updated config
    writeConfig(projectRoot, config);
  } finally {
    // Always release lock, even on error
    release();
  }
}
