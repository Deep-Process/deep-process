import path from 'node:path';
import { readConfig, getConfigPath } from '@deep-process/core';
import { getAdapter, type ToolId } from '@deep-process/core';
import { log, createSpinner } from '../utils/logger.js';
import { safeRemoveDir, safeRemoveFile } from '@deep-process/core';
import { confirm } from '@inquirer/prompts';

interface UninstallOptions {
  yes?: boolean;
}

export async function uninstallCommand(options: UninstallOptions): Promise<void> {
  const projectRoot = process.cwd();
  const config = readConfig(projectRoot);

  if (!config) {
    log.warn('deep-process is not installed in this directory.');
    return;
  }

  if (!options.yes) {
    const proceed = await confirm({
      message: 'Remove all deep-process files? This cannot be undone.',
      default: false,
    });
    if (!proceed) {
      log.dim('Cancelled.');
      return;
    }
  }

  log.title('Uninstalling Deep Process');
  log.blank();

  // Remove tool files
  for (const [toolId, toolConfig] of Object.entries(config.tools)) {
    if (!toolConfig.enabled) continue;
    const adapter = getAdapter(toolId as ToolId);
    if (!adapter) continue;

    const spinner = createSpinner(`Removing ${adapter.displayName} commands...`);
    spinner.start();

    const files = toolConfig.files.map(f => ({ path: f, type: 'created' as const }));
    await adapter.uninstall(files, projectRoot);

    spinner.succeed(`Removed ${adapter.displayName} commands`);
  }

  // Remove process directory
  const processDir = path.join(projectRoot, config.installation.processDir);
  const dirSpinner = createSpinner('Removing process files...');
  dirSpinner.start();
  safeRemoveDir(processDir);
  dirSpinner.succeed('Removed process files');

  // Remove config
  safeRemoveFile(getConfigPath(projectRoot));
  log.success('Removed deep-process.config.yaml');

  log.blank();
  log.success('Deep Process has been uninstalled.');
}
