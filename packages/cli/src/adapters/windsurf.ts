import fs from 'node:fs';
import path from 'node:path';
import type { ToolAdapter, InstalledFile } from './base-adapter.js';
import type { ProcessManifest } from '@deep-process/core';
import type { PathContext } from '@deep-process/core';
import { buildTemplateVars } from '@deep-process/core';
import { renderTemplate } from '@deep-process/core';
import { safeWriteFile, safeRemoveFile, toPosixPath } from '../utils/fs-helpers.js';

function loadTemplate(): string {
  return fs.readFileSync(
    path.resolve(import.meta.dirname, '..', '..', 'templates', 'windsurf.md.tpl'),
    'utf-8'
  );
}

export const windsurfAdapter: ToolAdapter = {
  id: 'windsurf',
  displayName: 'Windsurf',

  async install(processes, pathCtx, root) {
    const template = loadTemplate();
    const files: InstalledFile[] = [];

    for (const proc of processes) {
      const vars = buildTemplateVars(proc, pathCtx);
      const content = renderTemplate(template, vars);
      const relPath = path.join('.windsurf', 'rules', `${proc.slashCommand}.md`);
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
    const dir = path.join(root, '.windsurf');
    const exists = fs.existsSync(dir);
    return {
      detected: exists,
      evidence: exists ? ['.windsurf/ directory exists'] : [],
    };
  },
};
