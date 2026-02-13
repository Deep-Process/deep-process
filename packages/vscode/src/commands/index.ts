import * as vscode from 'vscode';
import { configureCommand } from './configure';
import { installCommand } from './install';
import { updateCommand } from './update';
import { uninstallCommand } from './uninstall';
import { processCommands } from './process-commands';

export function registerCommands(context: vscode.ExtensionContext) {
  // Configuration commands
  context.subscriptions.push(
    vscode.commands.registerCommand('deep-process.configure', () => configureCommand(context))
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('deep-process.install', () => installCommand(context))
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('deep-process.update', () => updateCommand(context))
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('deep-process.uninstall', () => uninstallCommand(context))
  );

  // Process commands (verify, explore, document, feasibility, synthesis)
  registerProcessCommands(context);
}

function registerProcessCommands(context: vscode.ExtensionContext) {
  const processes = ['verify', 'explore', 'document', 'feasibility', 'synthesis'];

  for (const process of processes) {
    context.subscriptions.push(
      vscode.commands.registerCommand(
        `deep-process.${process}`,
        () => processCommands(process, context)
      )
    );
  }
}
