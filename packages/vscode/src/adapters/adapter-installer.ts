import * as vscode from 'vscode';
import {
  getAdapter,
  getAllAdapters,
  type ProcessManifest,
  type PathContext
} from '@deep-process/core';

export interface AdapterInstallResult {
  toolId: string;
  files: string[];
  errors?: string[];
}

/**
 * Install adapters for selected AI tools
 * Creates tool-specific integration files (.claude/commands/, .gemini/commands/, etc.)
 */
export async function installAdaptersForTools(
  enabledToolIds: string[],
  processes: ProcessManifest[],
  pathCtx: PathContext,
  projectRoot: string,
  progressCallback?: (msg: string) => void
): Promise<Record<string, string[]>> {
  const results: Record<string, string[]> = {};

  for (const toolId of enabledToolIds) {
    try {
      progressCallback?.(`Installing ${toolId} integration...`);

      const adapter = getAdapter(toolId);
      if (!adapter) {
        console.warn(`[Adapter Installer] No adapter found for ${toolId}`);
        continue;
      }

      // Install adapter (creates tool-specific files)
      const createdFiles = await adapter.install(processes, pathCtx, projectRoot);

      results[toolId] = createdFiles;
      progressCallback?.(`✓ ${toolId}: ${createdFiles.length} file(s) created`);
    } catch (error) {
      console.error(`[Adapter Installer] Failed to install ${toolId}:`, error);
      vscode.window.showErrorMessage(
        `Failed to install ${toolId} integration: ${(error as Error).message}`
      );
    }
  }

  return results;
}

/**
 * Uninstall adapters for a specific tool
 * Removes tool-specific integration files
 */
export async function uninstallAdaptersForTool(
  toolId: string,
  projectRoot: string
): Promise<void> {
  try {
    const adapter = getAdapter(toolId);
    if (!adapter) {
      throw new Error(`No adapter found for ${toolId}`);
    }

    await adapter.uninstall(projectRoot);
    console.log(`[Adapter Installer] Uninstalled ${toolId}`);
  } catch (error) {
    console.error(`[Adapter Installer] Failed to uninstall ${toolId}:`, error);
    throw error;
  }
}

/**
 * Get list of all available adapters
 */
export function getAvailableAdapters(): string[] {
  return getAllAdapters().map(a => a.id);
}

/**
 * Check if adapter exists for a tool ID
 */
export function hasAdapter(toolId: string): boolean {
  return !!getAdapter(toolId);
}
