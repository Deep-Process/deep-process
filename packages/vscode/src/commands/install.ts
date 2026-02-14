import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';
import { detectTools } from '../detectors/tool-detector';
import { loadAllManifests, getProcessesDir } from '../core/process-registry.js';
import {
  copyProcessFiles,
  resolveProcessBaseDir,
  createConfig,
  writeConfig,
  configExists,
  type PathContext
} from '@deep-process/core';

export async function installCommand(context: vscode.ExtensionContext) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

  if (!workspaceFolder) {
    vscode.window.showErrorMessage('Please open a workspace folder first.');
    return;
  }

  const projectRoot = workspaceFolder.uri.fsPath;

  // Load available processes
  const manifests = loadAllManifests();

  if (manifests.length === 0) {
    vscode.window.showErrorMessage('No processes found. Extension may be corrupted.');
    return;
  }

  // Get configuration
  const config = vscode.workspace.getConfiguration('deep-process');
  const processDir = config.get<string>('processDir', '_deep-process');
  const enabledTools = config.get<string[]>('enabledTools', []);

  // Check if already installed
  const alreadyInstalled = configExists(projectRoot);

  if (alreadyInstalled) {
    const reinstall = await vscode.window.showWarningMessage(
      'Deep Process is already installed in this workspace. Reinstall?',
      'Yes, Reinstall',
      'Cancel'
    );

    if (reinstall !== 'Yes, Reinstall') {
      return;
    }
  }

  // Detect available tools
  const detectedTools = detectTools().filter(t => t.detected);

  if (detectedTools.length === 0 && enabledTools.length === 0) {
    const proceed = await vscode.window.showWarningMessage(
      'No AI tools detected. Process files will be copied, but no tool integrations will be configured.',
      'Continue Anyway',
      'Cancel'
    );

    if (proceed !== 'Continue Anyway') {
      return;
    }
  }

  // Build path context
  const pathCtx: PathContext = {
    scope: 'project',
    processDir,
    globalDir: path.join(os.homedir(), '.deep-process'),
    projectRoot,
  };

  const targetDir = resolveProcessBaseDir(pathCtx);

  // Show progress
  try {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Installing Deep Process',
        cancellable: false,
      },
      async (progress) => {
        try {
          // Step 1: Copy process files
          progress.report({ message: 'Copying process files...', increment: 20 });

          const processesDir = getProcessesDir();
          let totalFiles = 0;
          for (const manifest of manifests) {
            const count = copyProcessFiles(manifest, targetDir, processesDir);
            totalFiles += count;
          }

          // Step 2: Create config
          progress.report({ message: 'Creating configuration...', increment: 40 });

          const deepConfig = createConfig('project', processDir, '1.0.0');

          for (const manifest of manifests) {
            deepConfig.processes[manifest.id] = {
              installed: true,
              version: manifest.version,
            };
          }

          // Record enabled tools (even if not installed yet)
          for (const toolId of enabledTools) {
            deepConfig.tools[toolId] = {
              enabled: true,
              files: [],
            };
          }

          writeConfig(projectRoot, deepConfig);

          // Step 3: Add to gitignore
          progress.report({ message: 'Updating .gitignore...', increment: 30 });

          await addToGitignore(projectRoot, processDir);

          progress.report({ message: 'Done!', increment: 10 });
        } catch (error) {
          throw new Error(`Installation failed: ${(error as Error).message}`);
        }
      }
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      `Deep Process installation failed: ${(error as Error).message}\n\n` +
      'Please check file permissions and try again.',
      'View Logs'
    ).then(selection => {
      if (selection === 'View Logs') {
        vscode.commands.executeCommand('workbench.action.toggleDevTools');
      }
    });
    return;
  }

  // Show success message
  const detectedNames = detectedTools.map(t => t.name).join(', ');
  const toolsMessage = detectedTools.length > 0
    ? `\n\nDetected AI tools: ${detectedNames}\nYou can now use these tools with Deep Process workflows!`
    : '';

  vscode.window.showInformationMessage(
    `✓ Installed ${manifests.length} processes (copied to ${processDir}/)${toolsMessage}`
  );

  // Refresh the configuration panel if open
  vscode.commands.executeCommand('workbench.action.webview.reloadWebviewAction');
}

async function addToGitignore(projectRoot: string, processDir: string): Promise<void> {
  const gitignorePath = path.join(projectRoot, '.gitignore');
  const entry = `${processDir}/`;

  try {
    const gitignoreUri = vscode.Uri.file(gitignorePath);
    let content = '';

    try {
      const fileContent = await vscode.workspace.fs.readFile(gitignoreUri);
      content = Buffer.from(fileContent).toString('utf-8');
    } catch {
      // File doesn't exist, create it
    }

    if (!content.includes(entry)) {
      const newContent = content.trim()
        ? `${content}\n\n# Deep Process\n${entry}\n`
        : `# Deep Process\n${entry}\n`;

      await vscode.workspace.fs.writeFile(
        gitignoreUri,
        Buffer.from(newContent, 'utf-8')
      );
    }
  } catch (error) {
    console.error('Failed to update .gitignore:', error);
    // Non-critical error, just notify user
    vscode.window.showWarningMessage(
      `Note: Could not update .gitignore automatically. Please add "${entry}" manually to ignore process files.`
    );
  }
}
