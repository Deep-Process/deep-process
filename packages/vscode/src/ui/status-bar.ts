import * as vscode from 'vscode';
import { readConfig } from '@deep-process/core';
import type { DetectedTool } from '../detectors/tool-detector';

export function createStatusBar(tools: DetectedTool[]): vscode.StatusBarItem {
  const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );

  updateStatusBar(statusBar, tools);

  statusBar.show();

  return statusBar;
}

export function updateStatusBar(statusBar: vscode.StatusBarItem, tools: DetectedTool[]): void {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

  if (!workspaceFolder) {
    statusBar.text = `$(rocket) Deep Process`;
    statusBar.tooltip = 'Deep Process\nNo workspace folder open';
    statusBar.command = 'deep-process.configure';
    return;
  }

  const projectRoot = workspaceFolder.uri.fsPath;
  const config = readConfig(projectRoot);
  const detectedCount = tools.filter(t => t.detected).length;

  if (!config) {
    // Not installed
    statusBar.text = `$(rocket) Deep Process`;
    statusBar.tooltip = `Deep Process (not installed)\nDetected tools: ${detectedCount}\nClick to configure`;
    statusBar.command = 'deep-process.configure';
    statusBar.color = undefined;
  } else {
    // Installed
    const processCount = Object.keys(config.processes).length;
    const toolCount = Object.keys(config.tools).filter(k => config.tools[k].enabled).length;

    statusBar.text = `$(check) Deep Process`;
    statusBar.tooltip = `Deep Process ✓\n${processCount} processes installed\n${toolCount} tools configured\nDetected: ${detectedCount} AI tools\nClick to reconfigure`;
    statusBar.command = 'deep-process.configure';
    statusBar.color = new vscode.ThemeColor('terminal.ansiGreen');
  }
}
