import * as vscode from 'vscode';
import {
  getAdapter,
  type ToolId,
  type ProcessManifest,
  type PathContext,
  type InstalledFile
} from '@deep-process/core';

/**
 * Install adapters for the specified AI tools.
 * This creates integration files (commands/prompts) for each enabled tool.
 *
 * @param enabledToolIds - List of tool IDs to install adapters for
 * @param processes - Process manifests to install
 * @param pathCtx - Path context for template variables
 * @param projectRoot - Project root directory
 * @param progressCallback - Optional callback for progress updates
 * @returns Map of tool IDs to created file paths
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
    const adapter = getAdapter(toolId as ToolId);
    if (!adapter) {
      vscode.window.showWarningMessage(`Unknown tool adapter: ${toolId}`);
      continue;
    }

    try {
      if (progressCallback) {
        progressCallback(`Installing ${adapter.displayName} integration...`);
      }

      const installedFiles = await adapter.install(processes, pathCtx, projectRoot);
      results[toolId] = installedFiles.map(f => f.path);

      if (progressCallback) {
        const fileCount = installedFiles.length;
        progressCallback(
          `✓ ${adapter.displayName}: ${fileCount} file${fileCount === 1 ? '' : 's'} created`
        );
      }
    } catch (error) {
      const message = `Failed to install ${adapter.displayName}: ${(error as Error).message}`;
      vscode.window.showErrorMessage(message);
      console.error(message, error);
    }
  }

  return results;
}

/**
 * Uninstall adapters for a specific tool.
 *
 * @param toolId - Tool ID to uninstall
 * @param installedFiles - List of file paths that were installed
 * @param projectRoot - Project root directory
 */
export async function uninstallAdaptersForTool(
  toolId: string,
  installedFiles: string[],
  projectRoot: string
): Promise<void> {
  const adapter = getAdapter(toolId as ToolId);
  if (!adapter) {
    throw new Error(`Unknown tool adapter: ${toolId}`);
  }

  const files: InstalledFile[] = installedFiles.map(path => ({
    path,
    type: 'created' as const
  }));

  await adapter.uninstall(files, projectRoot);
}
