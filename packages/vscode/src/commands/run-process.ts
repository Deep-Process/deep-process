import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { readConfig, resolveProcessBaseDir } from '@deep-process/core';
import { loadAllManifests } from '../core/process-registry';
import { detectTools } from '../detectors/tool-detector';

/**
 * Run a process with a choice of execution methods.
 * Shows a QuickPick menu with available options based on detected tools.
 */
export async function runProcessCommand(processId: string): Promise<void> {
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

  // Load process manifest
  const manifests = loadAllManifests();
  const process = manifests.find(m => m.id === processId);

  if (!process) {
    vscode.window.showErrorMessage(`Process ${processId} not found.`);
    return;
  }

  // Detect available tools
  const tools = detectTools();
  const hasClaude = tools.some(t => t.id === 'claude' && t.detected);
  const hasGemini = tools.some(t => t.id === 'gemini' && t.detected);
  const hasChatParticipant = !!(vscode as any).chat;

  // Build menu options
  const options: vscode.QuickPickItem[] = [];

  if (hasChatParticipant) {
    options.push({
      label: '💬 Execute in Chat Participant',
      description: 'Run interactively in VS Code chat',
      detail: 'Opens chat with @deep-process command',
    });
  }

  if (hasClaude) {
    options.push({
      label: '🔮 Run with Claude CLI',
      description: 'Execute in terminal with Claude',
      detail: 'Opens a terminal and runs the Claude command',
    });
  }

  if (hasGemini) {
    options.push({
      label: '💎 Run with Gemini CLI',
      description: 'Execute in terminal with Gemini',
      detail: 'Opens a terminal and runs the Gemini command',
    });
  }

  options.push({
    label: '📄 View Workflow Document',
    description: 'Open workflow.md in editor',
    detail: 'Read the workflow instructions manually',
  });

  if (options.length === 0) {
    vscode.window.showWarningMessage(
      'No execution methods available. Please install an AI tool first.'
    );
    return;
  }

  // Show menu
  const choice = await vscode.window.showQuickPick(options, {
    title: `How would you like to run ${process.name}?`,
    placeHolder: 'Select an execution method',
  });

  if (!choice) {
    return; // User cancelled
  }

  // Extract CLI flags from config
  const claudeFlags = config.tools['claude']?.cliFlags || '';
  const geminiFlags = config.tools['gemini']?.cliFlags || '';

  // Execute based on choice
  try {
    if (choice.label.includes('Chat Participant')) {
      await executeInChatParticipant(process.slashCommand);
    } else if (choice.label.includes('Claude CLI')) {
      await executeWithClaudeCLI(process.slashCommand, claudeFlags);
    } else if (choice.label.includes('Gemini CLI')) {
      await executeWithGeminiCLI(process.slashCommand, geminiFlags);
    } else if (choice.label.includes('View Workflow')) {
      await viewWorkflowDocument(processId, config, projectRoot);
    }
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to execute process: ${(error as Error).message}`
    );
  }
}

async function executeInChatParticipant(slashCommand: string): Promise<void> {
  try {
    // Remove leading slash if present
    const command = slashCommand.replace(/^\//, '');

    // Try to open chat with the command
    await vscode.commands.executeCommand('workbench.action.chat.open', {
      query: `@deep-process /${command}`
    });
  } catch (error) {
    // Fallback: just open chat
    await vscode.commands.executeCommand('workbench.action.chat.open');
    vscode.window.showInformationMessage(
      `Type: @deep-process ${slashCommand}`
    );
  }
}

async function executeWithClaudeCLI(slashCommand: string, cliFlags: string = ''): Promise<void> {
  const terminal = vscode.window.createTerminal({
    name: 'Claude CLI',
    iconPath: new vscode.ThemeIcon('terminal'),
  });

  terminal.show();
  const command = cliFlags ? `claude ${cliFlags} ${slashCommand}` : `claude ${slashCommand}`;
  terminal.sendText(command);
}

async function executeWithGeminiCLI(slashCommand: string, cliFlags: string = ''): Promise<void> {
  const terminal = vscode.window.createTerminal({
    name: 'Gemini CLI',
    iconPath: new vscode.ThemeIcon('terminal'),
  });

  terminal.show();
  const command = cliFlags ? `gemini ${cliFlags} ${slashCommand}` : `gemini ${slashCommand}`;
  terminal.sendText(command);
}

async function viewWorkflowDocument(
  processId: string,
  config: any,
  projectRoot: string
): Promise<void> {
  const processBaseDir = resolveProcessBaseDir({
    scope: config.installation.scope,
    processDir: config.installation.processDir,
    globalDir: path.join(require('os').homedir(), '.deep-process'),
    projectRoot,
  });

  const workflowPath = path.join(processBaseDir, processId, 'workflow.md');

  if (!fs.existsSync(workflowPath)) {
    vscode.window.showWarningMessage(
      `Workflow document not found: ${workflowPath}`
    );
    return;
  }

  const uri = vscode.Uri.file(workflowPath);

  try {
    // Try to open in markdown preview
    await vscode.commands.executeCommand('markdown.showPreview', uri);
  } catch {
    // Fallback: just open the file
    await vscode.commands.executeCommand('vscode.open', uri);
  }
}
