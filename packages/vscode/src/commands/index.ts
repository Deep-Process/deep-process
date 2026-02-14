import * as vscode from 'vscode';
import { configureCommand } from './configure';
import { installCommand } from './install';
import { updateCommand } from './update';
import { uninstallCommand } from './uninstall';
import { processCommands } from './process-commands';
import {
  installProcessCommand,
  uninstallProcessCommand,
  updateProcessCommand
} from './process-manager';

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

  // Process management commands
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'deep-process.installProcess',
      (processId: string) => installProcessCommand(context, processId)
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'deep-process.uninstallProcess',
      (processId: string) => uninstallProcessCommand(context, processId)
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'deep-process.updateProcess',
      (processId: string) => updateProcessCommand(context, processId)
    )
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
