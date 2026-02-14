import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';
import {
  loadManifest,
  copyProcessFiles,
  resolveProcessBaseDir,
  readConfig,
  updateConfig,
  type PathContext
} from '@deep-process/core';

/**
 * Install a single process
 */
export async function installProcessCommand(context: vscode.ExtensionContext, processId: string) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

  if (!workspaceFolder) {
    vscode.window.showErrorMessage('Please open a workspace folder first.');
    return;
  }

  const projectRoot = workspaceFolder.uri.fsPath;

  // Load process manifest
  const manifest = loadManifest(processId);

  if (!manifest) {
    vscode.window.showErrorMessage(`Process "${processId}" not found.`);
    return;
  }

  // Get configuration
  const config = vscode.workspace.getConfiguration('deep-process');
  const processDir = config.get<string>('processDir', '_deep-process');

  // Build path context
  const pathCtx: PathContext = {
    scope: 'project',
    processDir,
    globalDir: path.join(os.homedir(), '.deep-process'),
    projectRoot,
  };

  const targetDir = resolveProcessBaseDir(pathCtx);

  // Show progress
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Installing ${manifest.name}`,
      cancellable: false,
    },
    async (progress) => {
      progress.report({ message: 'Copying files...', increment: 30 });

      const fileCount = copyProcessFiles(manifest, targetDir);

      progress.report({ message: 'Updating configuration...', increment: 40 });

      // Update config atomically
      try {
        await updateConfig(projectRoot, (deepConfig) => {
          deepConfig.processes[manifest.id] = {
            installed: true,
            version: manifest.version,
          };
          return deepConfig;
        });
      } catch (error) {
        // Config doesn't exist yet - this shouldn't happen if install was run first
        throw new Error('Deep Process not installed. Run install command first.');
      }

      progress.report({ message: 'Done!', increment: 30 });

      vscode.window.showInformationMessage(
        `✓ Installed ${manifest.name} (${fileCount} files copied)`
      );
    }
  );
}

/**
 * Uninstall a single process
 */
export async function uninstallProcessCommand(context: vscode.ExtensionContext, processId: string) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

  if (!workspaceFolder) {
    vscode.window.showErrorMessage('Please open a workspace folder first.');
    return;
  }

  const projectRoot = workspaceFolder.uri.fsPath;

  // Load process manifest
  const manifest = loadManifest(processId);

  if (!manifest) {
    vscode.window.showErrorMessage(`Process "${processId}" not found.`);
    return;
  }

  // Confirm uninstall
  const confirm = await vscode.window.showWarningMessage(
    `Are you sure you want to uninstall ${manifest.name}?`,
    'Yes, Uninstall',
    'Cancel'
  );

  if (confirm !== 'Yes, Uninstall') {
    return;
  }

  // Get configuration
  const config = vscode.workspace.getConfiguration('deep-process');
  const processDir = config.get<string>('processDir', '_deep-process');

  const processPath = vscode.Uri.joinPath(
    workspaceFolder.uri,
    processDir,
    processId
  );

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Uninstalling ${manifest.name}`,
      cancellable: false,
    },
    async (progress) => {
      progress.report({ message: 'Removing files...', increment: 40 });

      // Delete process directory
      try {
        await vscode.workspace.fs.delete(processPath, { recursive: true });
      } catch (error) {
        throw new Error(`Failed to delete files: ${(error as Error).message}`);
      }

      progress.report({ message: 'Updating configuration...', increment: 40 });

      // Update config atomically
      try {
        await updateConfig(projectRoot, (deepConfig) => {
          if (deepConfig.processes[processId]) {
            delete deepConfig.processes[processId];
          }
          return deepConfig;
        });
      } catch (error) {
        // Config might not exist, which is fine during uninstall
        console.log('Config not found during uninstall, skipping update');
      }

      progress.report({ message: 'Done!', increment: 20 });

      vscode.window.showInformationMessage(
        `✓ Uninstalled ${manifest.name}`
      );
    }
  );
}

/**
 * Update a single process
 */
export async function updateProcessCommand(context: vscode.ExtensionContext, processId: string) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

  if (!workspaceFolder) {
    vscode.window.showErrorMessage('Please open a workspace folder first.');
    return;
  }

  const projectRoot = workspaceFolder.uri.fsPath;

  // Load process manifest
  const manifest = loadManifest(processId);

  if (!manifest) {
    vscode.window.showErrorMessage(`Process "${processId}" not found.`);
    return;
  }

  // Get current version
  const deepConfig = readConfig(projectRoot);
  const currentVersion = deepConfig?.processes[processId]?.version;

  if (!currentVersion) {
    vscode.window.showErrorMessage(`Process "${processId}" is not installed.`);
    return;
  }

  if (currentVersion === manifest.version) {
    vscode.window.showInformationMessage(
      `${manifest.name} is already up to date (v${manifest.version})`
    );
    return;
  }

  // Confirm update
  const confirm = await vscode.window.showInformationMessage(
    `Update ${manifest.name} from v${currentVersion} to v${manifest.version}?`,
    'Update',
    'Cancel'
  );

  if (confirm !== 'Update') {
    return;
  }

  // Perform update (reinstall)
  const config = vscode.workspace.getConfiguration('deep-process');
  const processDir = config.get<string>('processDir', '_deep-process');

  const pathCtx: PathContext = {
    scope: 'project',
    processDir,
    globalDir: path.join(os.homedir(), '.deep-process'),
    projectRoot,
  };

  const targetDir = resolveProcessBaseDir(pathCtx);

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Updating ${manifest.name}`,
      cancellable: false,
    },
    async (progress) => {
      progress.report({ message: 'Removing old files...', increment: 20 });

      const processPath = vscode.Uri.joinPath(
        workspaceFolder.uri,
        processDir,
        processId
      );

      try {
        await vscode.workspace.fs.delete(processPath, { recursive: true });
      } catch (error) {
        // Ignore if directory doesn't exist
      }

      progress.report({ message: 'Copying new files...', increment: 40 });

      const fileCount = copyProcessFiles(manifest, targetDir);

      progress.report({ message: 'Updating configuration...', increment: 30 });

      // Update config with new version atomically
      try {
        await updateConfig(projectRoot, (cfg) => {
          cfg.processes[manifest.id] = {
            installed: true,
            version: manifest.version,
          };
          return cfg;
        });
      } catch (error) {
        console.error('Failed to update config:', error);
      }

      progress.report({ message: 'Done!', increment: 10 });

      vscode.window.showInformationMessage(
        `✓ Updated ${manifest.name} to v${manifest.version}`
      );
    }
  );
}

/**
 * Get info about installed processes
 */
export function getInstalledProcesses(projectRoot: string): Array<{
  id: string;
  version: string;
  installed: boolean;
}> {
  const deepConfig = readConfig(projectRoot);
  if (!deepConfig) {
    return [];
  }

  return Object.entries(deepConfig.processes).map(([id, info]) => ({
    id,
    version: info.version,
    installed: info.installed
  }));
}
