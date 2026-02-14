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
      console.log('Chat API not available:', error);
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
