import * as vscode from 'vscode';

export async function uninstallCommand(context: vscode.ExtensionContext) {
  // TODO: Phase 2 - Implementation
  const confirm = await vscode.window.showWarningMessage(
    'Remove all Deep Process files from this workspace?',
    { modal: true },
    'Yes', 'No'
  );

  if (confirm === 'Yes') {
    vscode.window.showInformationMessage('Uninstall - Coming soon!');
  }
}
