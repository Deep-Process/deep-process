import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';
import { loadAllManifests, getProcessesDir } from '../core/process-registry.js';
import {
  copyProcessFiles,
  resolveProcessBaseDir,
  readConfig,
  updateConfig,
  type PathContext
} from '@deep-process/core';

export async function updateCommand(context: vscode.ExtensionContext) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

  if (!workspaceFolder) {
    vscode.window.showErrorMessage('Please open a workspace folder first.');
    return;
  }

  const projectRoot = workspaceFolder.uri.fsPath;
  const config = readConfig(projectRoot);

  if (!config) {
    vscode.window.showWarningMessage(
      'Deep Process is not installed. Run "Deep Process: Install" first.'
    );
    return;
  }

  // Load available processes
  const manifests = loadAllManifests();

  if (manifests.length === 0) {
    vscode.window.showErrorMessage('No processes found. Extension may be corrupted.');
    return;
  }

  // Build path context
  const pathCtx: PathContext = {
    scope: config.installation.scope,
    processDir: config.installation.processDir,
    globalDir: path.join(os.homedir(), '.deep-process'),
    projectRoot,
  };

  const targetDir = resolveProcessBaseDir(pathCtx);

  // Check which processes need updating
  const installedManifests = manifests.filter(m => config.processes[m.id]?.installed);
  const outdatedProcesses = installedManifests.filter(
    m => config.processes[m.id].version !== m.version
  );

  if (outdatedProcesses.length === 0) {
    vscode.window.showInformationMessage(
      '✓ All processes are up to date!'
    );
    return;
  }

  // Show outdated processes
  const processNames = outdatedProcesses
    .map(m => `  • ${m.name} (${config.processes[m.id].version} → ${m.version})`)
    .join('\n');

  const confirm = await vscode.window.showInformationMessage(
    `${outdatedProcesses.length} process(es) need updating:\n${processNames}`,
    { modal: true },
    'Update All',
    'Cancel'
  );

  if (confirm !== 'Update All') {
    return;
  }

  // Show progress
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Updating Deep Process',
      cancellable: false,
    },
    async (progress) => {
      let updatedCount = 0;
      let totalFiles = 0;
      const processesDir = getProcessesDir();

      for (const manifest of outdatedProcesses) {
        progress.report({
          message: `Updating ${manifest.name}...`,
          increment: (100 / outdatedProcesses.length) * 0.9
        });

        const count = copyProcessFiles(manifest, targetDir, processesDir);
        totalFiles += count;

        updatedCount++;
      }

      // Save updated config atomically
      await updateConfig(projectRoot, (cfg) => {
        for (const manifest of outdatedProcesses) {
          cfg.processes[manifest.id].version = manifest.version;
        }
        return cfg;
      });

      progress.report({ message: 'Done!', increment: 10 });

      // Show success message
      vscode.window.showInformationMessage(
        `✓ Updated ${updatedCount} process(es) (${totalFiles} files)`
      );
    }
  );
}
