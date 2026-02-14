import * as vscode from 'vscode';
import * as path from 'path';
import { readConfig, updateConfig } from '@deep-process/core';
import { uninstallAdaptersForTool, installAdaptersForTools } from '../adapters/adapter-installer';
import { loadAllManifests } from '../core/process-registry';
import type { PathContext } from '@deep-process/core';
import * as os from 'os';

/**
 * Uninstall adapters for a specific tool.
 * Removes integration files and updates config.
 */
export async function uninstallToolCommand(toolId: string): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('No workspace folder open.');
    return;
  }

  const projectRoot = workspaceFolder.uri.fsPath;
  const config = readConfig(projectRoot);

  if (!config) {
    vscode.window.showWarningMessage('Deep Process is not installed in this workspace.');
    return;
  }

  const toolConfig = config.tools[toolId];
  if (!toolConfig || !toolConfig.enabled) {
    vscode.window.showWarningMessage(`Tool ${toolId} is not installed.`);
    return;
  }

  try {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `Uninstalling ${toolId} integration`,
        cancellable: false,
      },
      async (progress) => {
        progress.report({ message: 'Removing integration files...' });

        // Uninstall adapter files
        await uninstallAdaptersForTool(toolId, toolConfig.files, projectRoot);

        // Update config atomically
        await updateConfig(projectRoot, (cfg) => {
          delete cfg.tools[toolId];
          return cfg;
        });

        progress.report({ message: 'Done!' });
      }
    );

    vscode.window.showInformationMessage(`✓ ${toolId} integration removed`);
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to uninstall ${toolId}: ${(error as Error).message}`
    );
  }
}

/**
 * Install adapters for a specific tool.
 * Creates integration files and updates config.
 */
export async function installToolCommand(toolId: string): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('No workspace folder open.');
    return;
  }

  const projectRoot = workspaceFolder.uri.fsPath;
  const config = readConfig(projectRoot);

  if (!config) {
    vscode.window.showWarningMessage('Deep Process is not installed. Please run install first.');
    return;
  }

  try {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `Installing ${toolId} integration`,
        cancellable: false,
      },
      async (progress) => {
        progress.report({ message: 'Creating integration files...' });

        // Load manifests
        const manifests = loadAllManifests();

        // Build path context
        const pathCtx: PathContext = {
          scope: 'project',
          processDir: config.installation.processDir,
          globalDir: path.join(os.homedir(), '.deep-process'),
          projectRoot,
        };

        // Install adapters
        const adapterFiles = await installAdaptersForTools(
          [toolId],
          manifests,
          pathCtx,
          projectRoot
        );

        // Update config atomically
        await updateConfig(projectRoot, (cfg) => {
          cfg.tools[toolId] = {
            enabled: true,
            files: adapterFiles[toolId] || [],
          };
          return cfg;
        });

        progress.report({ message: 'Done!' });
      }
    );

    vscode.window.showInformationMessage(`✓ ${toolId} integration installed`);
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to install ${toolId}: ${(error as Error).message}`
    );
  }
}
