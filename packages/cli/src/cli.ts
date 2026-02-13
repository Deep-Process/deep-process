import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { statusCommand } from './commands/status.js';
import { updateCommand } from './commands/update.js';
import { uninstallCommand } from './commands/uninstall.js';
import { addToolCommand } from './commands/add-tool.js';
import { removeToolCommand } from './commands/remove-tool.js';

const program = new Command();

program
  .name('deep-process')
  .description('Structured LLM workflows with interactive installer for AI tools')
  .version('0.1.0');

program
  .command('init')
  .description('Install deep-process workflows and generate AI tool commands')
  .option('-y, --yes', 'Non-interactive mode with defaults')
  .option('-t, --tools <tools>', 'Comma-separated list of tools (claude,gemini,cursor,continue,github-agents,agents-md,cline,windsurf,roo-code,copilot,aider)')
  .option('-p, --processes <processes>', 'Comma-separated list of processes to install')
  .option('-d, --dir <directory>', 'Process directory name', '_deep-process')
  .option('-g, --global', 'Install globally to ~/.deep-process')
  .action(initCommand);

program
  .command('status')
  .description('Show installed processes and tool integrations')
  .action(statusCommand);

program
  .command('update')
  .description('Update installed processes to latest versions')
  .option('-y, --yes', 'Non-interactive mode')
  .action(updateCommand);

program
  .command('uninstall')
  .description('Remove all deep-process files')
  .option('-y, --yes', 'Skip confirmation')
  .action(uninstallCommand);

program
  .command('add-tool')
  .description('Add a tool integration')
  .argument('<tool>', 'Tool to add (claude, gemini, cursor, etc.)')
  .action(addToolCommand);

program
  .command('remove-tool')
  .description('Remove a tool integration')
  .argument('<tool>', 'Tool to remove')
  .option('-y, --yes', 'Skip confirmation')
  .action(removeToolCommand);

program.parse();
