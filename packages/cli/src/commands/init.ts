import os from 'node:os';
import path from 'node:path';
import { copyProcessFiles } from '@deep-process/core';
import { resolveProcessBaseDir, type PathContext } from '@deep-process/core';
import { createConfig, writeConfig, configExists } from '@deep-process/core';
import { loadAllManifests, getProcessesDir } from '../core/process-registry.js';
import { getAdapter, detectTools, isValidToolId, type ToolId } from '@deep-process/core';
import { runWizard, type WizardAnswers } from '../wizard/prompts.js';
import { log, createSpinner } from '../utils/logger.js';
import { addToGitignore } from '@deep-process/core';

interface InitOptions {
  yes?: boolean;
  tools?: string;
  processes?: string;
  dir?: string;
  global?: boolean;
}

export async function initCommand(options: InitOptions): Promise<void> {
  log.title('Deep Process Installer v0.1.0');
  log.blank();

  const projectRoot = process.cwd();
  const manifests = loadAllManifests();

  if (manifests.length === 0) {
    log.error('No processes found. Package may be corrupted.');
    process.exit(1);
  }

  // Check if already installed — in interactive mode, ask what to do
  if (configExists(projectRoot) && !options.yes) {
    const { confirm } = await import('@inquirer/prompts');
    const reinstall = await confirm({
      message: 'deep-process is already installed. Reinstall?',
      default: true,
    });
    if (!reinstall) return;
  }

  let answers: WizardAnswers;

  if (options.yes) {
    // Non-interactive mode
    const toolList: ToolId[] = options.tools
      ? options.tools.split(',').filter(isValidToolId) as ToolId[]
      : await detectTools(projectRoot);

    const processList = options.processes
      ? options.processes.split(',').filter(id => manifests.some(m => m.id === id))
      : manifests.map(m => m.id);

    answers = {
      scope: options.global ? 'global' : 'project',
      processDir: options.dir ?? '_deep-process',
      selectedProcesses: processList,
      selectedTools: toolList,
      overwrite: true,
      addGitignore: true,
    };
  } else {
    // Interactive wizard
    const detectedTools = await detectTools(projectRoot);
    const hasExisting = configExists(projectRoot);
    answers = await runWizard(manifests, detectedTools, hasExisting);
  }

  if (answers.selectedProcesses.length === 0) {
    log.warn('No processes selected. Aborting.');
    return;
  }

  // Build path context
  const pathCtx: PathContext = {
    scope: answers.scope,
    processDir: answers.processDir,
    globalDir: path.join(os.homedir(), '.deep-process'),
    projectRoot,
  };

  const targetDir = resolveProcessBaseDir(pathCtx);
  const selectedManifests = manifests.filter(m => answers.selectedProcesses.includes(m.id));

  // Copy process files
  const spinner = createSpinner('Copying process files...');
  spinner.start();

  const processesDir = getProcessesDir();
  let totalFiles = 0;
  for (const manifest of selectedManifests) {
    const count = copyProcessFiles(manifest, targetDir, processesDir);
    totalFiles += count;
  }

  spinner.succeed(`Copied ${selectedManifests.length} processes (${totalFiles} files) to ${answers.processDir}/`);

  // Install tool integrations
  const config = createConfig(answers.scope, answers.processDir, '0.1.0');

  for (const manifest of selectedManifests) {
    config.processes[manifest.id] = {
      installed: true,
      version: manifest.version,
    };
  }

  for (const toolId of answers.selectedTools) {
    const adapter = getAdapter(toolId);
    if (!adapter) continue;

    const toolSpinner = createSpinner(`Configuring ${adapter.displayName}...`);
    toolSpinner.start();

    const files = await adapter.install(selectedManifests, pathCtx, projectRoot);

    config.tools[toolId] = {
      enabled: true,
      files: files.map(f => f.path),
    };

    toolSpinner.succeed(`Created ${files.length} ${adapter.displayName} commands`);
  }

  // Save config
  writeConfig(projectRoot, config);
  log.success('Saved deep-process.config.yaml');

  // Gitignore
  if (answers.addGitignore && answers.scope === 'project') {
    const added = addToGitignore(projectRoot, answers.processDir + '/');
    if (added) {
      log.success(`Added ${answers.processDir}/ to .gitignore`);
    }
  }

  log.blank();
  log.success('Done! Run /deep-verify in your AI tool to start.');
}
