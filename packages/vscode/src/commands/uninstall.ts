import * as vscode from 'vscode';
import * as path from 'path';
import {
  readConfig,
  resolveProcessBaseDir,
  getConfigPath,
  type PathContext
} from '@deep-process/core';
import * as os from 'os';

export async function uninstallCommand(context: vscode.ExtensionContext) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

  if (!workspaceFolder) {
    vscode.window.showErrorMessage('Please open a workspace folder first.');
    return;
  }

  const projectRoot = workspaceFolder.uri.fsPath;
  const config = readConfig(projectRoot);

  if (!config) {
    vscode.window.showWarningMessage(
      'Deep Process is not installed in this workspace.'
    );
    return;
  }

  // Show detailed confirmation
  const processCount = Object.keys(config.processes).length;
  const toolCount = Object.keys(config.tools).length;

  const confirm = await vscode.window.showWarningMessage(
    `Remove Deep Process from this workspace?\n\nThis will delete:\n• ${processCount} process(es)\n• ${toolCount} tool integration(s)\n• Configuration file\n\nThis action cannot be undone.`,
    { modal: true },
    'Yes, Remove',
    'Cancel'
  );

  if (confirm !== 'Yes, Remove') {
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

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Uninstalling Deep Process',
      cancellable: false,
    },
    async (progress) => {
      // Step 1: Remove process directory
      progress.report({ message: 'Removing process files...', increment: 50 });

      try {
        const processUri = vscode.Uri.file(targetDir);
        await vscode.workspace.fs.delete(processUri, { recursive: true, useTrash: false });
      } catch (error) {
        console.error('Failed to remove process directory:', error);
      }

      // Step 2: Remove config file
      progress.report({ message: 'Removing configuration...', increment: 30 });

      try {
        const configUri = vscode.Uri.file(getConfigPath(projectRoot));
        await vscode.workspace.fs.delete(configUri, { useTrash: false });
      } catch (error) {
        console.error('Failed to remove config file:', error);
      }

      // Step 3: Remove from gitignore
      progress.report({ message: 'Updating .gitignore...', increment: 20 });

      await removeFromGitignore(projectRoot, config.installation.processDir);

      progress.report({ message: 'Done!' });
    }
  );

  vscode.window.showInformationMessage(
    '✓ Deep Process uninstalled successfully'
  );

  // Clear workspace configuration
  const wsConfig = vscode.workspace.getConfiguration('deep-process');
  await wsConfig.update('enabledTools', [], vscode.ConfigurationTarget.Workspace);

  // Refresh the configuration panel if open
  vscode.commands.executeCommand('workbench.action.webview.reloadWebviewAction');
}

async function removeFromGitignore(projectRoot: string, processDir: string): Promise<void> {
  const gitignorePath = path.join(projectRoot, '.gitignore');
  const entry = `${processDir}/`;

  try {
    const gitignoreUri = vscode.Uri.file(gitignorePath);
    const fileContent = await vscode.workspace.fs.readFile(gitignoreUri);
    let content = Buffer.from(fileContent).toString('utf-8');

    // Remove the entry and the "# Deep Process" comment if present
    const lines = content.split('\n');
    const filtered = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed !== entry && trimmed !== '# Deep Process';
    });

    content = filtered.join('\n');

    await vscode.workspace.fs.writeFile(
      gitignoreUri,
      Buffer.from(content, 'utf-8')
    );
  } catch (error) {
    console.error('Failed to update .gitignore:', error);
  }
}
