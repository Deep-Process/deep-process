import * as vscode from 'vscode';
import { detectToolsAsync, DetectedTool } from '../detectors/tool-detector';
import { loadAllManifests } from '../core/process-registry.js';

interface WizardResult {
  completed: boolean;
  selectedTools: string[];
  selectedProcesses: string[];
}

export async function showSetupWizard(context: vscode.ExtensionContext): Promise<WizardResult> {
  const result: WizardResult = {
    completed: false,
    selectedTools: [],
    selectedProcesses: []
  };

  // Step 1: Welcome
  const shouldContinue = await showWelcomeStep();
  if (!shouldContinue) {
    return result;
  }

  // Step 2: Detect and select AI tools
  const tools = await showToolDetectionStep();
  if (!tools) {
    return result;
  }

  const selectedTools = await showToolSelectionStep(tools);
  if (!selectedTools) {
    return result;
  }
  result.selectedTools = selectedTools;

  // Step 3: Select processes
  const selectedProcesses = await showProcessSelectionStep();
  if (!selectedProcesses) {
    return result;
  }
  result.selectedProcesses = selectedProcesses;

  // Step 4: Install
  const installed = await showInstallStep(selectedTools, selectedProcesses);
  if (!installed) {
    return result;
  }

  // Step 5: Success
  await showSuccessStep();

  result.completed = true;
  return result;
}

async function showWelcomeStep(): Promise<boolean> {
  // Check VSCode version for Chat API support
  const vscodeAny = vscode as any;
  const hasChatAPI = !!(vscodeAny.chat && vscodeAny.chat.createChatParticipant);

  let versionNote = '';
  if (!hasChatAPI) {
    versionNote = '\n\n⚠️ **Note:** Your VSCode version does not support the Chat Participant API (requires VSCode 1.85+). ' +
      'You can still install and use workflows via Command Palette, but interactive chat features will not be available. ' +
      'Consider updating VSCode for the full experience.';
  }

  const response = await vscode.window.showInformationMessage(
    '🎯 Welcome to Deep Process!\n\n' +
    'This wizard will help you set up structured LLM workflows for verification, exploration, and more.\n\n' +
    'We\'ll guide you through:\n' +
    '1. Detecting AI tools (like Copilot, Claude, etc.)\n' +
    '2. Selecting which tools to use\n' +
    '3. Installing process workflows\n\n' +
    'Ready to get started?' + versionNote,
    { modal: true },
    'Continue',
    'Skip Setup'
  );

  return response === 'Continue';
}

async function showToolDetectionStep(): Promise<DetectedTool[] | undefined> {
  return await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Detecting AI tools...',
      cancellable: false
    },
    async (progress) => {
      const tools = await detectToolsAsync((msg, increment) => {
        progress.report({ message: msg, increment });
      });

      const detectedCount = tools.filter(t => t.detected).length;

      if (detectedCount === 0) {
        const proceed = await vscode.window.showWarningMessage(
          '⚠️ No AI tools detected\n\n' +
          'We couldn\'t find any supported AI tools installed. You can still continue and install processes, ' +
          'but you\'ll need to install AI tools later to use them.\n\n' +
          'Supported tools include:\n' +
          '• GitHub Copilot\n' +
          '• Cline (Claude Dev)\n' +
          '• Continue.dev\n' +
          '• And more...',
          { modal: true },
          'Continue Anyway',
          'Cancel'
        );

        if (proceed !== 'Continue Anyway') {
          return undefined;
        }
      } else {
        await vscode.window.showInformationMessage(
          `✓ Found ${detectedCount} AI tool${detectedCount > 1 ? 's' : ''}!\n\n` +
          tools.filter(t => t.detected).map(t => `• ${t.name}`).join('\n'),
          { modal: false }
        );
      }

      return tools;
    }
  );
}

async function showToolSelectionStep(tools: DetectedTool[]): Promise<string[] | undefined> {
  const detectedTools = tools.filter(t => t.detected);

  if (detectedTools.length === 0) {
    // No tools detected, skip selection
    return [];
  }

  if (detectedTools.length === 1) {
    // Only one tool, auto-select it
    const proceed = await vscode.window.showInformationMessage(
      `We found ${detectedTools[0].name}. Would you like to use it with Deep Process?`,
      { modal: true },
      'Yes, Use It',
      'No, Skip'
    );

    return proceed === 'Yes, Use It' ? [detectedTools[0].id] : [];
  }

  // Multiple tools, show quick pick
  interface ToolPickItem extends vscode.QuickPickItem {
    toolId: string;
  }

  const items: ToolPickItem[] = detectedTools.map(tool => ({
    label: tool.name,
    description: tool.version ? `v${tool.version}` : undefined,
    detail: tool.description || 'Detected and ready to use',
    toolId: tool.id,
    picked: true // Auto-select all detected tools
  }));

  const selected = await vscode.window.showQuickPick(items, {
    canPickMany: true,
    title: 'Select AI Tools',
    placeHolder: 'Choose which AI tools you want to use with Deep Process',
    ignoreFocusOut: true
  });

  if (!selected) {
    return undefined;
  }

  return selected.map(item => item.toolId);
}

async function showProcessSelectionStep(): Promise<string[] | undefined> {
  const manifests = loadAllManifests();

  if (manifests.length === 0) {
    vscode.window.showErrorMessage('No processes available. Extension may be corrupted.');
    return undefined;
  }

  interface ProcessPickItem extends vscode.QuickPickItem {
    processId: string;
  }

  const items: ProcessPickItem[] = manifests.map(manifest => ({
    label: manifest.name,
    description: `v${manifest.version}`,
    detail: manifest.description,
    processId: manifest.id,
    picked: true // Auto-select all processes by default
  }));

  const selected = await vscode.window.showQuickPick(items, {
    canPickMany: true,
    title: 'Select Processes to Install',
    placeHolder: 'Choose which workflows you want to install',
    ignoreFocusOut: true
  });

  if (!selected) {
    return undefined;
  }

  if (selected.length === 0) {
    const proceed = await vscode.window.showWarningMessage(
      'You haven\'t selected any processes. Without processes, Deep Process won\'t have any workflows to run.\n\n' +
      'Are you sure you want to continue?',
      { modal: true },
      'Go Back',
      'Continue Anyway'
    );

    if (proceed === 'Go Back') {
      return showProcessSelectionStep(); // Recursive call to go back
    }
  }

  return selected.map(item => item.processId);
}

async function showInstallStep(toolIds: string[], processIds: string[]): Promise<boolean> {
  const summary = [
    `**Selected AI Tools (${toolIds.length}):**`,
    toolIds.length > 0 ? toolIds.map(id => `• ${id}`).join('\n') : '• None',
    '',
    `**Selected Processes (${processIds.length}):**`,
    processIds.length > 0 ? processIds.map(id => `• ${id}`).join('\n') : '• None'
  ].join('\n');

  const proceed = await vscode.window.showInformationMessage(
    '📦 Ready to Install\n\n' + summary + '\n\nProceed with installation?',
    { modal: true },
    'Install',
    'Cancel'
  );

  if (proceed !== 'Install') {
    return false;
  }

  // Save tool configuration
  try {
    const config = vscode.workspace.getConfiguration('deep-process');
    await config.update('enabledTools', toolIds, vscode.ConfigurationTarget.Workspace);
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to save configuration: ${(error as Error).message}\n\nPlease check workspace settings permissions.`
    );
    return false;
  }

  // Run install command if any processes selected
  if (processIds.length > 0) {
    try {
      await vscode.commands.executeCommand('deep-process.install');
    } catch (error) {
      const retry = await vscode.window.showErrorMessage(
        `Installation failed: ${(error as Error).message}\n\nWould you like to try installing processes manually?`,
        'Open Process Manager',
        'Skip'
      );

      if (retry === 'Open Process Manager') {
        await vscode.commands.executeCommand('workbench.view.extension.deep-process-sidebar');
      }
      return false;
    }
  }

  return true;
}

async function showSuccessStep(): Promise<void> {
  const vscodeAny = vscode as any;
  const hasChatAPI = !!(vscodeAny.chat && vscodeAny.chat.createChatParticipant);

  let nextSteps = '**Next Steps:**\n' +
    '• Open the Deep Process panel to manage your configuration\n' +
    '• Try a workflow: Command Palette → "Deep Process: Verify"\n';

  if (hasChatAPI) {
    nextSteps += '• Use chat: Type @deep-process /verify <your question>\n';
  } else {
    nextSteps += '• For chat workflows: Update to VSCode 1.85+ to enable Chat Participant API\n';
  }

  nextSteps += '\n**Documentation:** VSCode 1.85+ required for full chat integration.';

  const openPanel = await vscode.window.showInformationMessage(
    '🎉 Setup Complete!\n\n' +
    'Deep Process is now configured and ready to use.\n\n' +
    nextSteps +
    '\n\nHappy coding!',
    { modal: true },
    'Open Panel',
    'Done'
  );

  if (openPanel === 'Open Panel') {
    vscode.commands.executeCommand('workbench.view.extension.deep-process-sidebar');
  }
}

/**
 * Check if setup wizard should be shown on activation
 */
export function shouldShowWizard(context: vscode.ExtensionContext): boolean {
  const hasShownWizard = context.globalState.get<boolean>('deep-process.hasShownWizard', false);
  const setupCompleted = context.globalState.get<boolean>('deep-process.setupCompleted', false);

  // Show wizard if it hasn't been shown before and setup is not completed
  return !hasShownWizard && !setupCompleted;
}

/**
 * Mark wizard as shown
 */
export async function markWizardAsShown(context: vscode.ExtensionContext): Promise<void> {
  await context.globalState.update('deep-process.hasShownWizard', true);
}

/**
 * Mark setup as completed
 */
export async function markSetupCompleted(context: vscode.ExtensionContext): Promise<void> {
  await context.globalState.update('deep-process.setupCompleted', true);
}
