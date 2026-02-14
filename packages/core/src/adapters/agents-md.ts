import fs from 'node:fs';
import path from 'node:path';
import type { ToolAdapter, InstalledFile } from './base-adapter.js';
import type { ProcessManifest } from '../index.js';
import type { PathContext } from '../index.js';
import { buildTemplateVars } from '../index.js';
import { markerReplace, markerRemove } from '../fs-helpers.js';

const START_MARKER = '<!-- deep-process:start -->';
const END_MARKER = '<!-- deep-process:end -->';

export const agentsMdAdapter: ToolAdapter = {
  id: 'agents-md',
  displayName: 'AGENTS.md',

  async install(processes, pathCtx, root) {
    const filePath = path.join(root, 'AGENTS.md');
    const files: InstalledFile[] = [];

    // Build the routing table
    const header = `# Deep Process — Agent Instructions

This repository contains structured workflows for LLM-assisted analysis. Each workflow is a self-contained process with step files, quality gates, and adversarial checks.

## Available workflows

| Command | Workflow file | Purpose |
|---------|--------------|---------|`;

    const rows = processes.map(proc => {
      const vars = buildTemplateVars(proc, pathCtx);
      return `| \`${proc.slashCommand}\` | \`${vars.workflowPath}\` | ${proc.shortDescription} |`;
    });

    const instructions = `
## How to execute a workflow

1. Read the \`workflow.md\` file for the chosen process
2. Follow the execution sequence defined in that file
3. Load step files one at a time (\`steps/step-NN-*.md\`)
4. Evaluate quality gates after each step before proceeding
5. Do not skip steps or pre-judge execution modes — follow the interactive setup in the first step

## Key conventions

- Each step file is self-contained — it includes all instructions, schemas, and counter-checks needed
- Quality gates are binding — if a gate fails, halt and fix before proceeding
- Adversarial phases are mandatory — do not skip them
- Output must be structured and evidence-based, not conversational`;

    const content = header + '\n' + rows.join('\n') + '\n' + instructions;

    markerReplace(filePath, START_MARKER, END_MARKER, content);
    files.push({ path: 'AGENTS.md', type: fs.existsSync(filePath) ? 'modified' : 'created' });

    return files;
  },

  async uninstall(files, root) {
    const filePath = path.join(root, 'AGENTS.md');
    markerRemove(filePath, START_MARKER, END_MARKER);
  },

  async detect(root) {
    const exists = fs.existsSync(path.join(root, 'AGENTS.md'));
    return {
      detected: exists,
      evidence: exists ? ['AGENTS.md exists'] : [],
    };
  },
};
