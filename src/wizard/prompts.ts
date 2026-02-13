import { select, input, checkbox, confirm } from '@inquirer/prompts';
import type { ProcessManifest } from '../core/process-registry.js';
import type { ToolId } from '../adapters/index.js';
import { getAllAdapters } from '../adapters/index.js';

export interface WizardAnswers {
  scope: 'project' | 'global';
  processDir: string;
  selectedProcesses: string[];
  selectedTools: ToolId[];
  overwrite: boolean;
  addGitignore: boolean;
}

/**
 * Run the interactive wizard for init command.
 */
export async function runWizard(
  manifests: ProcessManifest[],
  detectedTools: ToolId[],
  hasExistingFiles: boolean
): Promise<WizardAnswers> {
  const scope = await select<'project' | 'global'>({
    message: 'Where to install?',
    choices: [
      { value: 'project', name: 'Project (local directory)' },
      { value: 'global', name: 'Global (~/.deep-process)' },
    ],
    default: 'project',
  });

  let processDir = '_deep-process';
  if (scope === 'project') {
    processDir = await input({
      message: 'Process directory?',
      default: '_deep-process',
    });
  }

  const selectedProcesses = await checkbox({
    message: 'Select processes to install:',
    choices: manifests.map(m => ({
      value: m.id,
      name: `${m.name} — ${m.shortDescription}`,
      checked: true,
    })),
  });

  const allAdapters = getAllAdapters();
  const toolChoices = allAdapters.map(a => ({
    value: a.id as ToolId,
    name: a.displayName,
    checked: detectedTools.includes(a.id as ToolId),
  }));

  const selectedTools = await checkbox({
    message: `Select AI tools to configure:${detectedTools.length > 0 ? ` (detected: ${detectedTools.length})` : ''}`,
    choices: toolChoices,
  }) as ToolId[];

  let overwrite = true;
  if (hasExistingFiles) {
    overwrite = await confirm({
      message: 'Existing files found — overwrite?',
      default: true,
    });
  }

  const addGitignore = await confirm({
    message: `Add ${processDir}/ to .gitignore?`,
    default: true,
  });

  return {
    scope,
    processDir,
    selectedProcesses,
    selectedTools,
    overwrite,
    addGitignore,
  };
}
