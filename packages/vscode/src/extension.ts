import * as vscode from 'vscode';
import { registerCommands } from './commands';
import { registerChatParticipant } from './chat/participant';
import { createStatusBar, updateStatusBar } from './ui/status-bar';
import { detectTools } from './detectors/tool-detector';
import { ConfigPanelProvider } from './ui/webview/config-panel';
import { shouldShowWizard, showSetupWizard, markWizardAsShown, markSetupCompleted } from './ui/setup-wizard';

export function activate(context: vscode.ExtensionContext) {
  console.log('Deep Process extension activated');

  // 1. Detect installed AI tools
  const tools = detectTools();
  console.log('Detected tools:', tools);

  // 2. Register webview panel
  const configPanelProvider = new ConfigPanelProvider(context.extensionUri, context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      ConfigPanelProvider.viewType,
      configPanelProvider
    )
  );

  // 3. Register commands
  registerCommands(context);

  // 4. Register Chat Participant (if API available)
  if ((vscode as any).chat) {
    try {
      registerChatParticipant(context);
      console.log('Chat participant registered');
    } catch (error) {
      console.error('Failed to register chat participant:', error);
      vscode.window.showErrorMessage(
        'Deep Process: Failed to register chat participant. Some features may be unavailable.',
        'Learn More'
      ).then(selection => {
        if (selection === 'Learn More') {
          vscode.env.openExternal(vscode.Uri.parse('https://github.com/deep-process-org/deep-process#chat-participant'));
        }
      });
    }
  } else {
    // Chat API not available - likely older VSCode version
    console.warn('Chat Participant API not available. VSCode 1.85+ required for chat features.');

    // Show warning if not already dismissed
    const dismissedKey = 'deep-process.chatApiWarningDismissed';
    const wasDismissed = context.globalState.get<boolean>(dismissedKey, false);

    if (!wasDismissed) {
      vscode.window.showWarningMessage(
        'Deep Process: Chat workflows require VSCode 1.85 or later with Chat Participant API. ' +
        'Please update VSCode to use @deep-process chat commands. ' +
        'You can still use command palette workflows.',
        'Update VSCode',
        'Dismiss'
      ).then(selection => {
        if (selection === 'Update VSCode') {
          vscode.env.openExternal(vscode.Uri.parse('https://code.visualstudio.com/download'));
        } else if (selection === 'Dismiss') {
          context.globalState.update(dismissedKey, true);
        }
      });
    }
  }

  // 5. Create status bar
  const statusBar = createStatusBar(tools);
  context.subscriptions.push(statusBar);

  // 6. Watch for config file changes to update status bar
  const configFileWatcher = vscode.workspace.createFileSystemWatcher(
    '**/deep-process.config.yaml'
  );

  configFileWatcher.onDidChange(() => updateStatusBar(statusBar, tools));
  configFileWatcher.onDidCreate(() => updateStatusBar(statusBar, tools));
  configFileWatcher.onDidDelete(() => updateStatusBar(statusBar, tools));

  context.subscriptions.push(configFileWatcher);

  // 7. Show setup wizard on first activation
  if (shouldShowWizard(context)) {
    // Show wizard after a short delay to let extension fully activate
    setTimeout(async () => {
      const result = await showSetupWizard(context);
      await markWizardAsShown(context);

      if (result.completed) {
        await markSetupCompleted(context);
      }
    }, 1000);
  }

  // 8. Register wizard command for manual invocation
  context.subscriptions.push(
    vscode.commands.registerCommand('deep-process.runWizard', async () => {
      const result = await showSetupWizard(context);
      if (result.completed) {
        await markSetupCompleted(context);
      }
    })
  );
}

export function deactivate() {
  console.log('Deep Process extension deactivated');
}
