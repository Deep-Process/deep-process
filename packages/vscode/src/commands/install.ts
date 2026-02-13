import * as vscode from 'vscode';
import { detectTools } from '../detectors/tool-detector';

export async function installCommand(context: vscode.ExtensionContext) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

  if (!workspaceFolder) {
    vscode.window.showErrorMessage('Please open a workspace folder first.');
    return;
  }

  // Detect available tools
  const tools = detectTools();
  const detectedTools = tools.filter(t => t.detected);

  if (detectedTools.length === 0) {
    vscode.window.showWarningMessage(
      'No AI tools detected. Install GitHub Copilot, Continue.dev, or Claude CLI first.'
    );
    return;
  }

  // TODO: Phase 2 - Week 1, Day 5-6: Implement installation logic
  vscode.window.showInformationMessage(
    `Detected tools: ${detectedTools.map(t => t.name).join(', ')}. Installation coming soon!`
  );
}
