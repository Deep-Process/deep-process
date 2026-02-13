import { readConfig, writeConfig } from '@deep-process/core';
import { getAdapter, isValidToolId, type ToolId } from '../adapters/index.js';
import { log, createSpinner } from '../utils/logger.js';
import { confirm } from '@inquirer/prompts';

interface RemoveToolOptions {
  yes?: boolean;
}

export async function removeToolCommand(tool: string, options: RemoveToolOptions): Promise<void> {
  const projectRoot = process.cwd();
  const config = readConfig(projectRoot);

  if (!config) {
    log.warn('deep-process is not installed. Run `npx deep-process init` first.');
    return;
  }

  if (!isValidToolId(tool)) {
    log.error(`Unknown tool: ${tool}`);
    return;
  }

  const toolId = tool as ToolId;
  const adapter = getAdapter(toolId);
  if (!adapter) return;

  if (!config.tools[toolId]?.enabled) {
    log.warn(`${adapter.displayName} is not configured.`);
    return;
  }

  if (!options.yes) {
    const proceed = await confirm({
      message: `Remove ${adapter.displayName} integration?`,
      default: true,
    });
    if (!proceed) return;
  }

  const spinner = createSpinner(`Removing ${adapter.displayName}...`);
  spinner.start();

  const files = config.tools[toolId].files.map(f => ({ path: f, type: 'created' as const }));
  await adapter.uninstall(files, projectRoot);

  delete config.tools[toolId];
  writeConfig(projectRoot, config);

  spinner.succeed(`Removed ${adapter.displayName}`);
}
