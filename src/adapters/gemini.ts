import fs from 'node:fs';
import path from 'node:path';
import type { ToolAdapter, InstalledFile } from './base-adapter.js';
import type { ProcessManifest } from '../core/process-registry.js';
import type { PathContext } from '../core/path-resolver.js';
import { buildTemplateVars } from '../core/path-resolver.js';
import { renderTemplate } from '../core/template-engine.js';
import { safeWriteFile, safeRemoveFile, toPosixPath } from '../utils/fs-helpers.js';

function loadTemplate(): string {
  return fs.readFileSync(
    path.resolve(import.meta.dirname, '..', '..', 'templates', 'gemini.toml.tpl'),
    'utf-8'
  );
}

export const geminiAdapter: ToolAdapter = {
  id: 'gemini',
  displayName: 'Gemini CLI',

  async install(processes, pathCtx, root) {
    const template = loadTemplate();
    const files: InstalledFile[] = [];

    for (const proc of processes) {
      const vars = buildTemplateVars(proc, pathCtx);
      // For Gemini, {{args}} in the template must remain as literal {{args}}
      const content = renderTemplate(template, vars);
      const relPath = path.join('.gemini', 'commands', `${proc.slashCommand}.toml`);
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
    const dir = path.join(root, '.gemini', 'commands');
    const exists = fs.existsSync(dir);
    return {
      detected: exists,
      evidence: exists ? ['.gemini/commands/ directory exists'] : [],
    };
  },
};
