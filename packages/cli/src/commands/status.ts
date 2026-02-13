import { readConfig } from '@deep-process/core';
import { loadAllManifests } from '@deep-process/core';
import { checkForUpdates } from '@deep-process/core';
import { log } from '../utils/logger.js';
import chalk from 'chalk';

export async function statusCommand(): Promise<void> {
  const projectRoot = process.cwd();
  const config = readConfig(projectRoot);

  if (!config) {
    log.warn('deep-process is not installed in this directory.');
    log.dim('Run `npx deep-process init` to get started.');
    return;
  }

  log.title('Deep Process Status');
  log.blank();

  // Installation info
  log.info(`Scope: ${config.installation.scope}`);
  log.info(`Process directory: ${config.installation.processDir}`);
  log.info(`Package version: ${config.packageVersion}`);
  log.blank();

  // Processes
  const processEntries = Object.entries(config.processes);
  if (processEntries.length > 0) {
    console.log(chalk.bold('Processes:'));
    for (const [id, proc] of processEntries) {
      const status = proc.installed ? chalk.green('installed') : chalk.dim('not installed');
      console.log(`  ${id} v${proc.version} — ${status}`);
    }
  }

  // Check for updates
  const manifests = loadAllManifests();
  const updates = checkForUpdates(config, manifests, projectRoot);
  const missing = updates.filter(u => u.reason === 'missing');
  const outdated = updates.filter(u => u.reason === 'version');

  if (missing.length > 0) {
    log.blank();
    log.warn(`${missing.length} process(es) missing from disk:`);
    for (const u of missing) {
      console.log(`  ${u.processId} — ${chalk.red('missing')}`);
    }
    log.dim('Run `npx deep-process update` to restore.');
  }

  if (outdated.length > 0) {
    log.blank();
    log.warn(`${outdated.length} process(es) have updates available:`);
    for (const u of outdated) {
      console.log(`  ${u.processId}: ${u.currentVersion} → ${chalk.green(u.availableVersion)}`);
    }
    log.dim('Run `npx deep-process update` to update.');
  }

  log.blank();

  // Tools
  const toolEntries = Object.entries(config.tools);
  if (toolEntries.length > 0) {
    console.log(chalk.bold('Tools:'));
    for (const [id, tool] of toolEntries) {
      const status = tool.enabled ? chalk.green('enabled') : chalk.dim('disabled');
      console.log(`  ${id} — ${status} (${tool.files.length} files)`);
    }
  }
}
