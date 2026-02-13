import os from 'node:os';
import path from 'node:path';
import { readConfig, writeConfig } from '../core/config-manager.js';
import { loadAllManifests } from '../core/process-registry.js';
import { checkForUpdates } from '../core/version-manager.js';
import { copyProcessFiles } from '../core/file-copier.js';
import { resolveProcessBaseDir, type PathContext } from '../core/path-resolver.js';
import { getAdapter, type ToolId } from '../adapters/index.js';
import { log, createSpinner } from '../utils/logger.js';

interface UpdateOptions {
  yes?: boolean;
}

export async function updateCommand(options: UpdateOptions): Promise<void> {
  const projectRoot = process.cwd();
  const config = readConfig(projectRoot);

  if (!config) {
    log.warn('deep-process is not installed. Run `npx deep-process init` first.');
    return;
  }

  const manifests = loadAllManifests();
  const updates = checkForUpdates(config, manifests);
  const outdated = updates.filter(u => u.needsUpdate);

  if (outdated.length === 0) {
    log.success('All processes are up to date.');
    return;
  }

  log.title('Deep Process Update');
  log.blank();

  for (const u of outdated) {
    log.info(`${u.processId}: ${u.currentVersion} → ${u.availableVersion}`);
  }

  const pathCtx: PathContext = {
    scope: config.installation.scope,
    processDir: config.installation.processDir,
    globalDir: path.join(os.homedir(), '.deep-process'),
    projectRoot,
  };

  const targetDir = resolveProcessBaseDir(pathCtx);

  // Update process files
  const spinner = createSpinner('Updating process files...');
  spinner.start();

  const updatedManifests = manifests.filter(m =>
    outdated.some(u => u.processId === m.id)
  );

  for (const manifest of updatedManifests) {
    copyProcessFiles(manifest, targetDir);
    config.processes[manifest.id] = {
      installed: true,
      version: manifest.version,
    };
  }

  spinner.succeed(`Updated ${updatedManifests.length} process(es)`);

  // Regenerate tool commands for updated processes
  const enabledTools = Object.entries(config.tools)
    .filter(([, t]) => t.enabled)
    .map(([id]) => id as ToolId);

  for (const toolId of enabledTools) {
    const adapter = getAdapter(toolId);
    if (!adapter) continue;

    const toolSpinner = createSpinner(`Updating ${adapter.displayName} commands...`);
    toolSpinner.start();

    const allInstalled = manifests.filter(m => config.processes[m.id]?.installed);
    const files = await adapter.install(allInstalled, pathCtx, projectRoot);

    config.tools[toolId] = {
      enabled: true,
      files: files.map(f => f.path),
    };

    toolSpinner.succeed(`Updated ${adapter.displayName} commands`);
  }

  writeConfig(projectRoot, config);
  log.success('Update complete.');
}
