import * as vscode from 'vscode';
import type { DetectedTool } from '../detectors/tool-detector';

export function createStatusBar(tools: DetectedTool[]): vscode.StatusBarItem {
  const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );

  const detectedCount = tools.filter(t => t.detected).length;

  statusBar.text = `$(rocket) Deep Process`;
  statusBar.tooltip = `Deep Process\nDetected tools: ${detectedCount}`;
  statusBar.command = 'deep-process.configure';

  statusBar.show();

  return statusBar;
}
