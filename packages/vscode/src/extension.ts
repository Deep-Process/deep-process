import * as vscode from 'vscode';
import { registerCommands } from './commands';
import { registerChatParticipant } from './chat/participant';
import { createStatusBar } from './ui/status-bar';
import { detectTools } from './detectors/tool-detector';
import { ConfigPanelProvider } from './ui/webview/config-panel';

export function activate(context: vscode.ExtensionContext) {
  console.log('Deep Process extension activated');

  // 1. Detect installed AI tools
  const tools = detectTools();
  console.log('Detected tools:', tools);

  // 2. Register webview panel
  const configPanelProvider = new ConfigPanelProvider(context.extensionUri);
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

  // 6. Show welcome message on first activation
  const hasShownWelcome = context.globalState.get<boolean>('deep-process.hasShownWelcome');
  if (!hasShownWelcome) {
    vscode.window.showInformationMessage(
      'Deep Process extension activated! Run "Deep Process: Configure" to get started.',
      'Configure Now'
    ).then(selection => {
      if (selection === 'Configure Now') {
        vscode.commands.executeCommand('deep-process.configure');
      }
    });
    context.globalState.update('deep-process.hasShownWelcome', true);
  }
}

export function deactivate() {
  console.log('Deep Process extension deactivated');
}
