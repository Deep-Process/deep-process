import { loadTemplate as loadTpl } from './template-loader.js';
import fs from 'node:fs';
import path from 'node:path';
import type { ToolAdapter, InstalledFile } from './base-adapter.js';
import type { ProcessManifest } from '../index.js';
import type { PathContext } from '../index.js';
import { buildTemplateVars } from '../index.js';
import { renderTemplate } from '../index.js';
import { safeWriteFile, safeRemoveFile, toPosixPath } from '../fs-helpers.js';

function loadTemplate(): string {
  return loadTpl('continue-dev.prompt.tpl');
}

export const continueDevAdapter: ToolAdapter = {
  id: 'continue',
  displayName: 'Continue.dev',

  async install(processes, pathCtx, root) {
    const template = loadTemplate();
    const files: InstalledFile[] = [];

    for (const proc of processes) {
      const vars = buildTemplateVars(proc, pathCtx);
      const content = renderTemplate(template, vars);
      const relPath = path.join('.continue', 'prompts', `${proc.slashCommand}.prompt`);
      safeWriteFile(path.join(root, relPath), content);
      files.push({ path: toPosixPath(relPath), type: 'created' });
    }

    return files;
  },

  async uninstall(files, root) {
    for (const f of files) {
      safeRemoveFile(path.join(root, f.path));
    }
  },

  async detect(root) {
    const dir = path.join(root, '.continue');
    const exists = fs.existsSync(dir);
    return {
      detected: exists,
      evidence: exists ? ['.continue/ directory exists'] : [],
    };
  },
};
