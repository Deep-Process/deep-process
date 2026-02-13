import fs from 'node:fs';
import path from 'node:path';
import type { ToolAdapter, InstalledFile } from './base-adapter.js';
import type { ProcessManifest } from '../core/process-registry.js';
import type { PathContext } from '../core/path-resolver.js';
import { buildTemplateVars } from '../core/path-resolver.js';
import { renderTemplate } from '../core/template-engine.js';
import { safeWriteFile, safeRemoveFile, fileExists, toPosixPath } from '../utils/fs-helpers.js';

function loadTemplate(): string {
  return fs.readFileSync(
    path.resolve(import.meta.dirname, '..', '..', 'templates', 'aider.md.tpl'),
    'utf-8'
  );
}

export const aiderAdapter: ToolAdapter = {
  id: 'aider',
  displayName: 'Aider',

  async install(processes, pathCtx, root) {
    const template = loadTemplate();
    const files: InstalledFile[] = [];

    // Create convention files
    for (const proc of processes) {
      const vars = buildTemplateVars(proc, pathCtx);
      const content = renderTemplate(template, vars);
      const relPath = path.join('.aider', 'conventions', `${proc.slashCommand}.md`);
      safeWriteFile(path.join(root, relPath), content);
      files.push({ path: toPosixPath(relPath), type: 'created' });
    }

    // Update or create .aider.conf.yml to reference convention files
    const confPath = path.join(root, '.aider.conf.yml');
    let confContent = '';
    if (fileExists(confPath)) {
      confContent = fs.readFileSync(confPath, 'utf-8');
    }

    // Add read entries for convention files if not already there
    const conventionPaths = processes.map(p => `.aider/conventions/${p.slashCommand}.md`);
    const existingReads = confContent.match(/^read:\s*$/m);

    if (!existingReads) {
      const readSection = '\n# Deep Process conventions\nread:\n' +
        conventionPaths.map(p => `  - ${p}`).join('\n') + '\n';
      confContent += readSection;
    }

    fs.writeFileSync(confPath, confContent, 'utf-8');
    files.push({ path: '.aider.conf.yml', type: 'modified' });

    return files;
  },

  async uninstall(files, root) {
    // Remove convention files
    for (const f of files) {
      if (f.path === '.aider.conf.yml') continue;
      safeRemoveFile(path.join(root, f.path));
    }

    // Clean up .aider.conf.yml — remove the deep-process read section
    const confPath = path.join(root, '.aider.conf.yml');
    if (fileExists(confPath)) {
      let content = fs.readFileSync(confPath, 'utf-8');
      // Remove the "# Deep Process conventions" block and its read entries
      content = content.replace(/\n?# Deep Process conventions\nread:\n(  - \.aider\/conventions\/.*\n)*/g, '');
      const trimmed = content.trim();
      if (trimmed.length === 0) {
        fs.unlinkSync(confPath);
      } else {
        fs.writeFileSync(confPath, trimmed + '\n', 'utf-8');
      }
    }
  },

  async detect(root) {
    const confExists = fs.existsSync(path.join(root, '.aider.conf.yml'));
    const dirExists = fs.existsSync(path.join(root, '.aider'));
    const detected = confExists || dirExists;
    const evidence: string[] = [];
    if (confExists) evidence.push('.aider.conf.yml exists');
    if (dirExists) evidence.push('.aider/ directory exists');
    return { detected, evidence };
  },
};
