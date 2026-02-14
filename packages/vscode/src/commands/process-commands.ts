import * as vscode from 'vscode';
import * as path from 'path';
import { readConfig, loadManifest } from '@deep-process/core';
import {
  loadWorkflowFiles,
  getProcessDir,
  isProcessInstalled
} from '../chat/workflow-helpers';

// Map command names to process IDs
const PROCESS_ID_MAP: Record<string, string> = {
  'verify': 'deep-verify',
  'explore': 'deep-explore',
  'document': 'deep-document',
  'feasibility': 'deep-feasibility',
  'synthesis': 'deep-synthesis'
};

export async function processCommands(processName: string, context: vscode.ExtensionContext) {
  const processId = PROCESS_ID_MAP[processName];

  if (!processId) {
    vscode.window.showErrorMessage(`Unknown process: ${processName}`);
    return;
  }

  // Check if workspace is open
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage(
      'Deep Process: No workspace folder open. Please open a workspace to use Deep Process workflows.'
    );
    return;
  }

  const projectRoot = workspaceFolder.uri.fsPath;
  const config = readConfig(projectRoot);

  // Check if Deep Process is installed
  if (!config) {
    const install = await vscode.window.showErrorMessage(
      'Deep Process: Not installed in this workspace.',
      'Install Now',
      'Cancel'
    );

    if (install === 'Install Now') {
      await vscode.commands.executeCommand('deep-process.install');
    }
    return;
  }

  // Check if specific process is installed
  if (!isProcessInstalled(config, processId)) {
    const install = await vscode.window.showErrorMessage(
      `Deep Process: ${processId} is not installed.`,
      'Install Process',
      'Cancel'
    );

    if (install === 'Install Process') {
      await vscode.commands.executeCommand('deep-process.installProcess', processId);
    }
    return;
  }

  // Load process manifest
  const manifest = loadManifest(processId);
  if (!manifest) {
    vscode.window.showErrorMessage(`Deep Process: Failed to load manifest for ${processId}`);
    return;
  }

  // Offer execution options: Chat (preferred) or Document view
  const vscodeAny = vscode as any;
  const hasChatAPI = !!(vscodeAny.chat && vscodeAny.chat.createChatParticipant);

  let executionMode: string | undefined;

  if (hasChatAPI) {
    executionMode = await vscode.window.showQuickPick(
      [
        {
          label: '💬 Execute in Chat',
          description: 'Recommended: Interactive workflow with AI agent',
          value: 'chat'
        },
        {
          label: '📄 View Workflow Document',
          description: 'View workflow instructions in editor',
          value: 'document'
        }
      ],
      {
        title: `Deep ${capitalizeFirst(processName)}`,
        placeHolder: 'How would you like to execute this workflow?'
      }
    ).then(selection => selection?.value);
  } else {
    // No chat API - inform user and show document
    const proceed = await vscode.window.showWarningMessage(
      'Deep Process: Chat Participant API not available (requires VSCode 1.85+).\n\n' +
      'You can view the workflow instructions and execute manually, or update VSCode for interactive chat workflows.',
      'View Workflow',
      'Update VSCode',
      'Cancel'
    );

    if (proceed === 'Update VSCode') {
      vscode.env.openExternal(vscode.Uri.parse('https://code.visualstudio.com/download'));
      return;
    } else if (proceed === 'View Workflow') {
      executionMode = 'document';
    } else {
      return;
    }
  }

  if (!executionMode) {
    return; // User cancelled
  }

  if (executionMode === 'chat') {
    // Open chat and pre-fill with command
    const prompt = await vscode.window.showInputBox({
      title: `Deep ${capitalizeFirst(processName)}`,
      prompt: 'Enter your input for the workflow (optional)',
      placeHolder: 'e.g., Verify the claims in this document...'
    });

    // Open chat with command
    try {
      await vscodeAny.commands.executeCommand('workbench.action.chat.open', {
        query: `@deep-process /${processName} ${prompt || ''}`
      });
    } catch (error) {
      vscode.window.showErrorMessage(
        `Failed to open chat: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  } else {
    // Document mode - load and display workflow
    await showWorkflowDocument(projectRoot, config, processId, manifest);
  }
}

async function showWorkflowDocument(
  projectRoot: string,
  config: any,
  processId: string,
  manifest: any
) {
  try {
    const processDir = getProcessDir(projectRoot, config.installation.processDir, processId);
    const workflowContext = await loadWorkflowFiles(processDir, manifest);

    // Create workflow document content
    const content = [
      `# ${manifest.name}`,
      '',
      manifest.description,
      '',
      '---',
      '',
      `**Agent:** ${manifest.agentName}`,
      manifest.agentInstruction ? `**Instructions:** ${manifest.agentInstruction}` : '',
      '',
      '---',
      '',
      '## 📋 Master Workflow',
      '',
      workflowContext.workflowContent,
      '',
      '---',
      '',
      `## 🎯 ${manifest.firstStepLabel}`,
      '',
      workflowContext.firstStepContent,
      '',
      '---',
      '',
      `📁 **Process files:** \`${config.installation.processDir}/${processId}/\``,
      '',
      'Additional step files and data files are available in the process directory.',
      '',
      `> **Tip:** For interactive execution with AI, use the chat command: \`@deep-process /${processId.replace('deep-', '')} <your input>\``
    ].filter(Boolean).join('\n');

    // Open in new untitled document with markdown language
    const doc = await vscode.workspace.openTextDocument({
      content,
      language: 'markdown'
    });

    await vscode.window.showTextDocument(doc, {
      preview: false,
      viewColumn: vscode.ViewColumn.One
    });

    // Optionally show in preview mode
    await vscode.commands.executeCommand('markdown.showPreview', doc.uri);

  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to load workflow: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
