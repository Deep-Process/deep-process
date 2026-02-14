import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';
import { readConfig, writeConfig, type PathContext } from '@deep-process/core';
import { loadAllManifests } from '../core/process-registry.js';
import {
  installAdaptersForTools,
  uninstallAdaptersForTool
} from '../adapters/adapter-installer';

/**
 * Install adapters for a specific AI tool
 */
export async function installToolCommand(toolId: string): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

  if (!workspaceFolder) {
    vscode.window.showErrorMessage('Please open a workspace folder first.');
    return;
  }

  const projectRoot = workspaceFolder.uri.fsPath;
  const config = readConfig(projectRoot);

  if (!config) {
    vscode.window.showWarningMessage(
      'Deep Process not installed yet. Please install processes first.',
      'Install Now'
    ).then(selection => {
      if (selection === 'Install Now') {
        vscode.commands.executeCommand('deep-process.install');
      }
    });
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
        // Load installed processes
        const allManifests = loadAllManifests();
        const installedManifests = allManifests.filter(
          m => config.processes[m.id]?.installed
        );

        if (installedManifests.length === 0) {
          throw new Error('No processes installed');
        }

        // Build path context
        const pathCtx: PathContext = {
          scope: config.installation.scope,
          processDir: config.installation.processDir,
          globalDir: path.join(os.homedir(), '.deep-process'),
          projectRoot,
        };

        // Install adapter
        progress.report({ message: 'Creating integration files...' });

        const adapterFiles = await installAdaptersForTools(
          [toolId],
          installedManifests,
          pathCtx,
          projectRoot,
          (msg) => progress.report({ message: msg })
        );

        // Update config
        config.tools[toolId] = {
          enabled: true,
          files: adapterFiles[toolId] || [],
        };

        writeConfig(projectRoot, config);

        progress.report({ message: 'Done!' });
      }
    );

    vscode.window.showInformationMessage(
      `✓ ${toolId} integration installed successfully`
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to install ${toolId} integration: ${(error as Error).message}`
    );
  }
}

/**
 * Uninstall adapters for a specific AI tool
 */
export async function uninstallToolCommand(toolId: string): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

  if (!workspaceFolder) {
    vscode.window.showErrorMessage('Please open a workspace folder first.');
    return;
  }

  const projectRoot = workspaceFolder.uri.fsPath;
  const config = readConfig(projectRoot);

  if (!config || !config.tools[toolId]) {
    vscode.window.showWarningMessage(
      `${toolId} integration is not installed.`
    );
    return;
  }

  // Confirm with user
  const confirm = await vscode.window.showWarningMessage(
    `Remove ${toolId} integration files?\n\nThis will delete:\n${config.tools[toolId].files.join('\n')}`,
    { modal: true },
    'Yes, Remove',
    'Cancel'
  );

  if (confirm !== 'Yes, Remove') {
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

        await uninstallAdaptersForTool(toolId, projectRoot);

        // Update config
        delete config.tools[toolId];
        writeConfig(projectRoot, config);

        progress.report({ message: 'Done!' });
      }
    );

    vscode.window.showInformationMessage(
      `✓ ${toolId} integration removed successfully`
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to uninstall ${toolId} integration: ${(error as Error).message}`
    );
  }
}
