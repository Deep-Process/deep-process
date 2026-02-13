import * as vscode from 'vscode';

export async function processCommands(processName: string, context: vscode.ExtensionContext) {
  // TODO: Phase 2 - Week 2, Day 7-9: Implement process execution through Chat Participant
  vscode.window.showInformationMessage(
    `Deep ${capitalizeFirst(processName)} - Use @deep-process /${processName} in chat for now.`
  );
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
