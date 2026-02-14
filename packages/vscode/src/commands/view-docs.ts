import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { readConfig } from '@deep-process/core';
import { resolveProcessBaseDir } from '@deep-process/core';

/**
 * View documentation for a process.
 * Opens the process README.md in markdown preview.
 */
export async function viewDocsCommand(processId: string): Promise<void> {
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

  // Resolve process directory
  const processBaseDir = resolveProcessBaseDir({
    scope: config.installation.scope,
    processDir: config.installation.processDir,
    globalDir: path.join(require('os').homedir(), '.deep-process'),
    projectRoot,
  });

  // Try multiple possible documentation paths
  const possiblePaths = [
    path.join(processBaseDir, processId, 'docs', 'README.md'),
    path.join(processBaseDir, processId, 'README.md'),
    path.join(processBaseDir, processId, 'workflow.md'),
  ];

  let docsPath: string | null = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      docsPath = p;
      break;
    }
  }

  if (!docsPath) {
    vscode.window.showWarningMessage(
      `No documentation found for ${processId}. Expected files: docs/README.md, README.md, or workflow.md`
    );
    return;
  }

  try {
    const uri = vscode.Uri.file(docsPath);

    // Try to open in markdown preview
    try {
      await vscode.commands.executeCommand('markdown.showPreview', uri);
    } catch {
      // Fallback: just open the file in editor
      await vscode.commands.executeCommand('vscode.open', uri);
    }
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to open documentation: ${(error as Error).message}`
    );
  }
}
