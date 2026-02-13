import { readConfig } from '../core/config-manager.js';
import { loadAllManifests } from '../core/process-registry.js';
import { checkForUpdates } from '../core/version-manager.js';
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
  const updates = checkForUpdates(config, manifests);
  const outdated = updates.filter(u => u.needsUpdate);
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
