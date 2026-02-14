import os from 'node:os';
import path from 'node:path';
import { readConfig, writeConfig } from '@deep-process/core';
import { getAdapter, isValidToolId, type ToolId } from '../adapters/index.js';
import type { PathContext } from '@deep-process/core';
import { loadAllManifests } from '../core/process-registry.js';
import { log, createSpinner } from '../utils/logger.js';

export async function addToolCommand(tool: string): Promise<void> {
  const projectRoot = process.cwd();
  const config = readConfig(projectRoot);

  if (!config) {
    log.warn('deep-process is not installed. Run `npx deep-process init` first.');
    return;
  }

  if (!isValidToolId(tool)) {
    log.error(`Unknown tool: ${tool}`);
    log.dim('Available tools: claude, gemini, cursor, continue, github-agents, agents-md, cline, windsurf, roo-code, copilot, aider');
    return;
  }

  const toolId = tool as ToolId;
  const adapter = getAdapter(toolId);
  if (!adapter) return;

  if (config.tools[toolId]?.enabled) {
    log.warn(`${adapter.displayName} is already configured.`);
    return;
  }

  const pathCtx: PathContext = {
    scope: config.installation.scope,
    processDir: config.installation.processDir,
    globalDir: path.join(os.homedir(), '.deep-process'),
    projectRoot,
  };

  const manifests = loadAllManifests();
  const installedManifests = manifests.filter(m => config.processes[m.id]?.installed);

  const spinner = createSpinner(`Adding ${adapter.displayName}...`);
  spinner.start();

  const files = await adapter.install(installedManifests, pathCtx, projectRoot);

  config.tools[toolId] = {
    enabled: true,
    files: files.map(f => f.path),
  };

  writeConfig(projectRoot, config);
  spinner.succeed(`Added ${adapter.displayName} (${files.length} files)`);
}
