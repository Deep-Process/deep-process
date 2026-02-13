import fs from 'node:fs';
import path from 'node:path';
import type { ToolAdapter, InstalledFile } from './base-adapter.js';
import type { ProcessManifest } from '../core/process-registry.js';
import type { PathContext } from '../core/path-resolver.js';
import { buildTemplateVars } from '../core/path-resolver.js';
import { renderTemplate } from '../core/template-engine.js';
import { markerReplace, markerRemove, toPosixPath } from '../utils/fs-helpers.js';

const START_MARKER = '<!-- deep-process:start -->';
const END_MARKER = '<!-- deep-process:end -->';

function loadTemplate(): string {
  return fs.readFileSync(
    path.resolve(import.meta.dirname, '..', '..', 'templates', 'copilot-section.md.tpl'),
    'utf-8'
  );
}

export const copilotAdapter: ToolAdapter = {
  id: 'copilot',
  displayName: 'GitHub Copilot',

  async install(processes, pathCtx, root) {
    const template = loadTemplate();
    const files: InstalledFile[] = [];
    const filePath = path.join(root, '.github', 'copilot-instructions.md');

    const sections = processes.map(proc => {
      const vars = buildTemplateVars(proc, pathCtx);
      return renderTemplate(template, vars);
    });

    const content = sections.join('\n---\n\n');
    markerReplace(filePath, START_MARKER, END_MARKER, content);
    files.push({ path: toPosixPath(path.join('.github', 'copilot-instructions.md')), type: 'modified' });

    return files;
  },

  async uninstall(files, root) {
    const filePath = path.join(root, '.github', 'copilot-instructions.md');
    markerRemove(filePath, START_MARKER, END_MARKER);
  },

  async detect(root) {
    const exists = fs.existsSync(path.join(root, '.github', 'copilot-instructions.md'));
    return {
      detected: exists,
      evidence: exists ? ['.github/copilot-instructions.md exists'] : [],
    };
  },
};
