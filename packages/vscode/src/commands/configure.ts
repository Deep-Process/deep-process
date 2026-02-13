import * as vscode from 'vscode';
import { detectTools } from '../detectors/tool-detector';

export async function configureCommand(context: vscode.ExtensionContext) {
  const tools = detectTools();
  const detectedTools = tools.filter(t => t.detected);

  // Show quick pick with configuration options
  const options = [
    {
      label: '$(settings-gear) Open Configuration Panel',
      description: 'Interactive tool selection',
      action: 'panel'
    },
    {
      label: '$(checklist) Quick Setup',
      description: `Auto-select ${detectedTools.length} detected tools`,
      action: 'quick'
    },
    {
      label: '$(info) Detected Tools',
      description: `${detectedTools.length} found`,
      action: 'info'
    }
  ];

  const selected = await vscode.window.showQuickPick(options, {
    placeHolder: 'Choose configuration method'
  });

  if (!selected) return;

  switch (selected.action) {
    case 'panel':
      // Open the webview panel (will be implemented when webview is registered)
      vscode.commands.executeCommand('workbench.view.extension.deep-process-sidebar');
      break;

    case 'quick':
      await quickSetup(detectedTools.map(t => t.id));
      break;

    case 'info':
      showDetectedTools(tools);
      break;
  }
}

async function quickSetup(toolIds: string[]) {
  const config = vscode.workspace.getConfiguration('deep-process');
  await config.update('enabledTools', toolIds, vscode.ConfigurationTarget.Workspace);

  const install = await vscode.window.showInformationMessage(
    `✓ Configured ${toolIds.length} tools. Install processes now?`,
    'Install', 'Later'
  );

  if (install === 'Install') {
    vscode.commands.executeCommand('deep-process.install');
  }
}

function showDetectedTools(tools: any[]) {
  const detected = tools.filter(t => t.detected);
  const notDetected = tools.filter(t => !t.detected);

  const message = [
    `**Detected (${detected.length}):**`,
    ...detected.map(t => `  ✓ ${t.name}${t.version ? ' (v' + t.version + ')' : ''}`),
    '',
    `**Not Detected (${notDetected.length}):**`,
    ...notDetected.map(t => `  ✗ ${t.name}`)
  ].join('\n');

  vscode.window.showInformationMessage(message, { modal: true });
}
