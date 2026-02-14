import type { ProcessManifest } from '../index.js';
import type { PathContext } from '../index.js';

export interface InstalledFile {
  path: string;       // Relative to project root
  type: 'created' | 'modified';
}

export interface DetectionResult {
  detected: boolean;
  evidence: string[];
}

export interface ToolAdapter {
  readonly id: string;
  readonly displayName: string;

  /**
   * Install commands/rules for the given processes.
   */
  install(
    processes: ProcessManifest[],
    pathCtx: PathContext,
    root: string
  ): Promise<InstalledFile[]>;

  /**
   * Remove all installed commands/rules.
   */
  uninstall(files: InstalledFile[], root: string): Promise<void>;

  /**
   * Detect if this tool is already used in the project.
   */
  detect(root: string): Promise<DetectionResult>;
}
